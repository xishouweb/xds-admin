<template>
  <div class="custom-seats">
    <div class="individuation" >
      <FoldPanel :isFold="true" v-for="(item, index) in customAccount" :key="index" containerClass="containerClass">
        <div slot="title">
          <div class="menu-tit" :class="{'un-active': item.status!=1}">
            <div class="menu-float img default-seat-img"><img :src="item.headImg | urlFilter" alt=""></div>
            <div class="menu-float text">{{item.nickName || item.principalName}}</div>
          </div>
        </div>
        <div slot="container" :class="{'border-top': item.status!=1}">
          <div class="menu-tit" v-if="item.status!=1">
            <div class="menu-float img default-seat-img"><img :src="item.headImg | urlFilter" alt=""></div>
            <div class="menu-float text">{{item.nickName || item.principalName}}</div>
            <div class="menu-float tips" v-show="item.status === 2">停用</div>
            <div class="menu-float tips" v-show="item.status === 0">禁用</div>
            <div class="menu-float tips" v-show="item.status === 3">未授权</div>
          </div>
          <div class="menu-con" :class="{'un-active': item.status!=1}">
            <div class="menu-con-item">
              <span class="item-name">坐席昵称</span>
              <span class="item-info">
                <Input v-model="item.seatNickName" :disabled="item.status!=1" placeholder="请输入坐席昵称" style="width: 360px"></Input>
              </span>
            </div>
            <div class="menu-con-item">
              <span class="item-name">坐席头像</span>
              <span class="item-info">
                <UploadImg
                  @fileBoob="fileBoob"
                  @change="fileBoob"
                  :idx="index"
                  :seatId="seatId"
                  :imgSrc="item.conditionalHeadImg || item.headImg"
                ></UploadImg>
              </span>
              <span class="items-tips">
                点击上传头像，建议尺寸400px*400px
              </span>
            </div>
          </div>
        </div>
      </FoldPanel>
    </div>
  </div>
</template>
<script>
import { mapActions, mapGetters, mapState } from 'vuex'
import UploadImg from '@/components/upload/uploadSeatAvatar'
export default {
  props: {
    isAdd: {
      type: Boolean,
      default: false
    },
    appAccountIds: {
      type: Array,
      default: () => {
        return []
      }
    },
    createSeat: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      copyArr: [],
      seatsName: '',
      customAccount: [],
      seatsInfo: this.localStorageSaveOrRead('seatsInfo'),
      appAccountId: this.appAccountIds,
      seatId: null
    }
  },
  computed: {
    ...mapState({
      accountList: state => state.publicAccount.publicAccountList,
    }),
    ...mapGetters({
      thirdStepData: 'seats/getThirdStepData'
    })
  },
  created() {
    if (!this.isAdd) {
      this.seatId = this.seatsInfo.id
      let customAccount = (this.seatsInfo.seatPublicNumDetailDtos || []).filter(i => i.status !== 4)
      customAccount.forEach(item => {
        item.principalName = item.nickName
        item.filename = null
        item.isError = false
        item.seatNickName = item.seatNickName || item.nickName
      })
      this.customAccount = customAccount

      this.copyArr = JSON.parse(JSON.stringify(this.customAccount))
    } else {
      this.seatId = this.createSeat.id
    }
  },
  watch: {
    appAccountIds() {
      this.appAccountId = this.appAccountIds
      this.init()
    }
  },
  methods: {
    init() {
      this.customAccount = []
      if (this.appAccountIds.length > 0) {
        this.accountList.forEach(item => {
          let idx = this.appAccountIds.indexOf(item.appAccountId)
          if (idx >= 0) {
            item.seatNickName = item.principalName
            item.conditionalHeadImg = item.headImg
            item.filename = null
            item.isError = false
            this.customAccount.push(item)
          }
        })
        this.copyArr = JSON.parse(JSON.stringify(this.customAccount))
      }
    },
    isDone() {
      let arr = []
      for (let index = 0; index < this.customAccount.length; index++) {
        let customAccount = this.customAccount[index]
        customAccount.isError = false
        if (customAccount.seatNickName === '') {
          customAccount.isError = true
        }
        let obj = {}
        obj.appAccountId = customAccount.appAccountId
        obj.seatNickName = customAccount.seatNickName
        if (customAccount.file) {
          obj.cloudUrl = customAccount.file.url.split('.com')[1]
        } else if (customAccount.conditionalHeadImg) {
          obj.cloudUrl = customAccount.conditionalHeadImg.split('.com')[1]
        } else {
          obj.cloudUrl = customAccount.headImg
        }
        arr.push(obj)
      }
      for (let index = 0; index < this.customAccount.length; index++) {
        let customAccount = this.customAccount[index]
        if (customAccount.isError) {
          this.$Message.error('坐席昵称不能为空')
          return false
        }
      }
      return arr
    },
    fileBoob(file, filename, idx) {
      this.customAccount[idx].file = file
      this.customAccount[idx].filename = filename
    },
    ...mapActions({
      setThirdStepData: 'seats/setThirdStepData'
    })
  },
  components: {
    UploadImg
  }
}
</script>
<style lang="stylus">
@import '~@/assets/stylus/index'
@import '~@/assets/stylus/mixin'
.custom-seats
  .ivu-menu-item
    display inline-block !important
  .ivu-menu-item-active:not(.ivu-menu-submenu)
    bgColor(inherit)
    color(inherit)
    &:after
      width 0
  .ivu-menu-vertical.ivu-menu-light:after
    width 0
  .ivu-menu-light.ivu-menu-vertical .ivu-menu-item-active:not(.ivu-menu-submenu)
    bgColor(inherit)
    color(inherit)
    border-right none
    &:after
      width 0
  .ivu-menu-vertical .ivu-menu-item
    cursor default
  .ivu-menu-submenu-title-icon
    color #409eff
  .ivu-menu-vertical .ivu-menu-item:hover, .ivu-menu-vertical .ivu-menu-submenu-title:hover
    background-color #fff
  .ivu-menu-submenu-title > i, .ivu-menu-submenu-title span > i
    margin-right 0
  .individuation
    padding-right 20px
    padding-left 20px
    .containerClass
      max-height: 240px !important
    .fold-panel .fold-title
      border-top solid 1px #e3e4e6
      border-bottom none
    .ivu-menu-submenu-title
      border-top solid 1px #e3e4e6
      border-bottom none
    .menu-tit
      display inline-block
      clear()
      .menu-float
        float left
        height 20px
        line-height 20px
        margin-right 10px
      .img
        width 20px
        height 20px
        img
          width 20px
          height 20px
      .tips
        background-color #cacbcc
        padding 0 10px
        color #ffffff
        font-size 12px
        border-radius 3px
    .border-top
      border-top 1px solid #979899
      padding-top 30px
      color #979899
      .fold-container
        position relative
        max-height 250px !important
        overflow hidden
    .menu-con
      .menu-con-item
        margin-top 40px
        margin-bottom 40px
        clear()
        .item-name
          float left
          height 40px
          line-height 40px
          margin-right 25px
        .item-info
          float left
          img
            cursor pointer
            width 60px
            height 60px
            &:hover
              border 1px solid #eaeaea
        .items-tips
          color #979899
          display inline-block
          margin-left 15px
          margin-top 40px
</style>


