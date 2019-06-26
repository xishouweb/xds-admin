<template>
  <!-- 创建企业选择地区组件 -->
  <transition name="cascader">
    <div v-show="showCascaderModal" :class="{cascader:type==='selectArea',drawerCascader:type==='drawerArea'}" @click.stop>
      <div class="cascader-wrapper">
        <div class="cascader-select">
          <div class="cascader-select-item" :class="{'select-item-active':selectIndex==0}" @click.stop="selectArea(0)">
            国
          </div>
          <div class="cascader-select-item" :class="{'select-item-active':selectIndex==1}" @click.stop="selectArea(1)">
            省
          </div>
          <div class="cascader-select-item" :class="{'select-item-active':selectIndex==2}" @click.stop="selectArea(2)">
            市
          </div>
        </div>
        <div class="arer-part" style="minHeight: 400px;position:relative">
          <ScrollBar :isAbsolute='true' :data="provinceData">
            <div class="cascader-content">
              <div class="area" v-show="selectIndex==0&&!loadingImg">
                <div class="area-item" v-for="(item, index) in provinceData" :key="index">
                  <div class="area-text" :class="{active: activeItem.pro == index}"  @click.stop="selectAreaItem(keys[1], item.itemValue, index, item.itemName)">
                    {{item.itemName}}
                  </div>
                </div>
              </div>
              <div class="area" v-show="selectIndex==1&&!loadingImg">
                <div class="area-item" v-for="(item, index) in cityData" :key="index">
                  <div class="area-text" :class="{active: activeItem.city == index}"  @click.stop="selectAreaItem(keys[2], item.itemValue, index, item.itemName)">
                    {{item.itemName}}
                  </div>
                </div>
              </div>
              <div class="area" v-show="selectIndex==2&&!loadingImg">
                <div class="area-item" v-for="(item, index) in districtData" :key="index">
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
          </ScrollBar>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { loadTConfigListTree, getValueByKeyAndPv } from '@/api/query'
export default {
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
      keys: ['WECHAT_COUNTRY', 'WECHAT_PROVINCE', 'WECHAT_CITY'], // 获取三级地区数据相应的Key值
      selectIndex: 0,
      activeItem: {
        pro: -1,
        city: -1,
        dis: -1
      },
      provinceData: [],
      cityData: [],
      districtData: [],
      loadingImg: true,
      areaName: {
        proName: '',
        cityName: '',
        disName: ''
      }
    }
  },
  created() {
    this.loadTConfigListTree()
  },
  mounted() {
    document.addEventListener('click', (e) => {
      e.stopPropagation()
      this.$emit('parentCadcader', false)
    }, false)
  },
  methods: {
    selectAreaItem(str, itemValue, index, itemName) {
      if (str === this.keys[1]) {
        this.activeItem.pro = index
        this.activeItem.city = -1
        this.activeItem.dis = -1
        this.areaName.proName = itemName
      } else {
        this.activeItem.city = index
        this.activeItem.dis = -1
        this.areaName.cityName = itemName
      }
      let params = {
        itemKey: str,
        itemPv: itemValue,
      }
      this.getValueByKeyAndPv(params)
    },
    selectDistric(index, itemName) {
      this.areaName.disName = itemName
      this.activeItem.dis = index
      let areaName = `${this.areaName.proName}/${this.areaName.cityName}/${this.areaName.disName}`
      this.$emit('areaSelect', areaName)
      this.$emit('parentCadcader', false)
    },
    selectArea(val) {
      this.selectIndex = val
    },
    loadTConfigListTree() {
      let obj = {
        itemKey: this.keys[0]
      }
      this.loadingImg = true
      loadTConfigListTree(obj).then(data => { // 获取国家级数据
        if (data.code === 1) {
          this.loadingImg = false
          let dat = data.data
          if (dat) {
            this.provinceData = dat.sort((a, b) => a.itemIdx - b.itemIdx)
            console.log(this.provinceData)
          }
        }
      })
    },
    getValueByKeyAndPv(params) { // 获取省/市级数据
      this.loadingImg = true
      getValueByKeyAndPv(params).then(data => {
        if (data.code === 1) {
          this.loadingImg = false
          if (params.itemKey === this.keys[1]) {
            this.cityData = data.data.sort((a, b) => a.itemIdx - b.itemIdx)
            if (this.cityData.length <= 0) {
              this.$emit('parentCadcader', false)
            } else {
              this.selectIndex = 1
            }
            this.$emit('areaSelect', this.areaName.proName)
          } else {
            this.districtData = data.data.sort((a, b) => a.itemIdx - b.itemIdx)
            if (this.districtData.length <= 0) {
              this.$emit('parentCadcader', false)
            } else {
              this.selectIndex = 2
            }
            let areaName = `${this.areaName.proName}/${this.areaName.cityName}`
            this.$emit('areaSelect', areaName)
          }
        }
      })
    }
  }
}
</script>

<style lang="stylus">
@import '~@/assets/stylus/mixin'
.cascader
  hide-boxShadow()
  position absolute
  box-shadow 1px 2px 18px 0px rgba(0, 0, 0, 0.2)
  left -160px
  top -240px
  line-height 1
  z-index 4
  width 600px
  text-align left
  background-color #fff
  padding 10px 20px 5px
.drawerCascader
  text-align left
.cascader-wrapper
  .arer-part
    padding-bottom 10px
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
      padding-top 19px
      .area-item
        float left
        min-width 25%
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
.cascader-enter-active, .cascader-leave-active
  transition all 0.2s linear
.cascader-enter, .cascader-leave-to
  opacity 0
</style>


