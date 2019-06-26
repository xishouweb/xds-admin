<template>
  <transition name="cascader">
    <div v-show="showCascaderModal" :class="{'word-cascader':type==='selectArea',drawerCascader:type==='drawerArea'}" @click.stop>
      <div class="cascader-title">
        <div>
          选择地区
        </div>
        <Icon size="20" @click="close" type="android-close"></Icon>
      </div>
      <div class="cascader-radio">
        <RadioGroup v-model="areaType">
          <Radio :label="1">不限</Radio>
          <Radio :label="2">指定地区</Radio>
        </RadioGroup>
      </div>
      <div class="cascader-wrapper">
        <div v-show="areaType === 1">
          <div class="blank"></div>
          <div class="operate">
            <Button size="small" type="primary" @click="unlimited">确定</Button>
          </div>
        </div>
        <div v-show="areaType === 2">
          <div class="cascader-select">
            <div class="cascader-select-item" :class="{'select-item-active':selectIndex==0}" @click.stop="selectArea(0)">
              国家
            </div>
            <div class="cascader-select-item" :class="{'select-item-active':selectIndex==1}" @click.stop="selectArea(1)">
              省
            </div>
            <div class="cascader-select-item" :class="{'select-item-active':selectIndex==2}" @click.stop="selectArea(2)">
              市
            </div>
          </div>
          <div class="cascader-content">
            <div class="area" v-show="selectIndex==0&&!loadingImg">
              <div class="area-item" v-for="(item, index) in countryData" :key="index">
                <div class="area-text" :class="{active: activeItem.pro == index}"  @click.stop="selectAreaItem('WX_PROVINCE', item.itemValue, index, item.itemName)">
                  {{item.itemName}}
                </div>
              </div>
            </div>
            <div class="area" v-show="selectIndex==1&&!loadingImg">
              <div class="area-item" v-for="(item, index) in provinceData" :key="index">
                <div class="area-text" :class="{active: activeItem.city == index}"  @click.stop="selectAreaItem('WX_CITY', item.itemValue, index, item.itemName)">
                  {{item.itemName}}
                </div>
              </div>
            </div>
            <div class="area" v-show="selectIndex==2&&!loadingImg">
              <div class="area-item" v-for="(item, index) in cityData" :key="index">
                <div class="area-text" :class="{active: activeItem.dis == index}" @click.stop="selectDistric(index,  item.itemName)">
                  {{item.itemName}}
                </div>
              </div>
            </div>
            <div class="area-img" v-show="loadingImg">
              <Spin fix>
                <Icon type="load-c" size=40 class="spin-icon-load"></Icon>
                <div>loading</div>
              </Spin>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { loadTConfigListTree, getValueByKeyAndPv } from '@/api/query'
export default {
  name: 'wordCascader',
  model: {
    prop: 'showCascaderModal',
    event: 'close'
  },
  props: {
    showCascaderModal: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: 'selectArea'
    }
  },
  data() {
    return {
      selectIndex: 0,
      activeItem: {
        pro: -1,
        city: -1,
        dis: -1
      },
      areaType: 1,
      countryData: [],
      provinceData: [],
      cityData: [],
      loadingImg: true,
      areaName: {
        proName: '',
        cityName: '',
        disName: ''
      }
    }
  },
  created() {
    this.loadTConfigListTree('WX_COUNTRY')
  },
  mounted() {
    document.addEventListener('click', (e) => {
      this.$emit('close', false)
    }, false)
  },
  methods: {
    selectAreaItem(str, itemValue, index, itemName) {
      if (str === 'WX_PROVINCE') {
        this.activeItem.pro = index
        this.activeItem.city = -1
        this.activeItem.dis = -1
        this.areaName.proName = itemName
        this.loadTConfigListTree(str)
        this.$emit('areaSelect', this.areaName.proName)
      } else {
        this.activeItem.city = index
        this.activeItem.dis = -1
        this.areaName.cityName = itemName
        let params = {
          itemKey: str,
          itemPv: itemValue,
        }
        this.getValueByKeyAndPv(params)
      }
    },
    selectDistric(index, itemName) {
      this.areaName.disName = itemName
      this.activeItem.dis = index
      let areaName = `${this.areaName.proName}/${this.areaName.cityName}/${this.areaName.disName}`
      this.$emit('areaSelect', areaName)
      this.$emit('close', false)
    },
    selectArea(val) {
      this.selectIndex = val
    },
    unlimited() {
      this.selectIndex = 0
      this.activeItem = {
        pro: -1,
        city: -1,
        dis: -1
      }
      this.areaName = {
        proName: '',
        cityName: '',
        disName: ''
      }
      this.$emit('areaSelect', '')
      this.$emit('close', false)
    },
    loadTConfigListTree(str) {
      let obj = {
        itemKey: str
      }
      this.loadingImg = true
      loadTConfigListTree(obj).then(data => {
        if (data.code === 1) {
          this.loadingImg = false
          if (str === 'WX_COUNTRY') {
            this.countryData = data.data
          } else {
            this.selectIndex = 1
            this.provinceData = data.data
          }
        }
      })
    },
    getValueByKeyAndPv(params) {
      this.loadingImg = true
      getValueByKeyAndPv(params).then(data => {
        if (data.code === 1) {
          this.loadingImg = false
          this.cityData = data.data
          if (this.cityData.length <= 0) {
            this.$emit('close', false)
          } else {
            this.selectIndex = 2
          }
          let areaName = `${this.areaName.proName}/${this.areaName.cityName}`
          this.$emit('areaSelect', areaName)
        }
      })
    },
    close() {
      this.$emit('close', false)
    }
  }
}
</script>

<style lang="stylus">
@import '~@/assets/stylus/mixin'
.word-cascader
  hide-boxShadow()
  position absolute
  box-shadow 1px 2px 18px 0px rgba(0, 0, 0, 0.2)
  left 0
  top 50px
  line-height 1
  z-index 4
  width 600px
  text-align left
  background-color #fff
  padding 10px 20px 5px
  .cascader-title
    font-size 18px
    line-height 28px
    display flex
    justify-content space-between
    .ivu-icon
      cursor pointer
      color #999
      &:hover
        color #409eff
  .cascader-radio
    margin 35px 0 30px
    .ivu-radio-wrapper
      margin-right 30px
  .cascader-wrapper
    .blank
      height 180px
    .operate
      padding-bottom 18px
      text-align right
      .ivu-btn
        width 60px
    .cascader-select
      padding-bottom 20px
      border-bottom solid 1px #e6e6e6
      .cascader-select-item
        display inline-block
        height 28px
        margin-right 40px
        padding 6px 23px
        cursor pointer
        border-radius 5px
        &.select-item-active
          background-color #3d96f2
          color #fff
        &:hover
          background-color #3d96f2
          color #fff
    .cascader-content
      .area
        clear()
        margin-top 19px
        .area-item
          float left
          width 25%
          margin-bottom 17px
          .area-text
            display inline-block
            height 28px
            padding 6px 15px
            cursor pointer
            border-radius 5px
            &.active
              background-color #3d96f2
              color #fff
            &:hover
              background-color #3d96f2
              color #fff
      .area-img
        position relative
        height 220px
.drawerCascader
  text-align left
.cascader-enter-active, .cascader-leave-active
  transition all 0.2s linear
.cascader-enter, .cascader-leave-to
  opacity 0
</style>


