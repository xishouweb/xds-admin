<template>
  <div class="admin-nav" :class="{bigWidth:collapsed, smallWidth:!collapsed}">
    <div class="nav-unfold" v-show="collapsed">
      <div class="nav-icon">
        <div class="nav-icon-img">
          <img :src='logourl' alt>
        </div>
      </div>
      <div class="nav-main">
        <ul>
          <li
            v-for="(item, index) in mainMenuList"
            :key="index"
            :class="{active:routerInfo.path.indexOf(item.menuUrl)>=0, [item.fontClass + 'c']: item.fontClass}"
            class="nav-item"
            @click="goToRouter(item.menuUrl, item.isSecond)"
            @mouseover="mouseActive(index)"
            @mouseout="mouseUnActive(index)"
          >
            <div class="img-iconfont">
              <i class="icon" v-html="item.icon"></i>
            </div>
            <div class="text">{{item.menuName}}</div>
          </li>
        </ul>
      </div>
      <div class="nav-service" @click.stop="enterCustomerSystem">
        <div class="left">
          <img src="@/assets/images/navbig/servicenav.png" alt>
        </div>
        <div class="right">客服中心</div>
      </div>
    </div>
    <div class="nav-packup" v-show="!collapsed">
      <div class="nav-icon">
        <div class="nav-icon-img">
          <img :src="logourl" alt>
          <!-- <Tooltip content="销大师" placement="right" :transfer="true">
            <div class="text-tootip"></div>
          </Tooltip> -->
        </div>
      </div>
      <div class="nav-main">
        <ul>
          <li
            v-for="(item, index) in mainMenuList"
            :key="index"
            class="nav-item"
            :class="{active:routerInfo.path.indexOf(item.menuUrl)>=0,[item.fontClass + 'b']: item.fontClass}"
            @click="goToRouterPackup(item.menuUrl, item.isSecond)"
            @mouseover="mouseActive(index)"
            @mouseout="mouseUnActive(index)"
          >
            <Tooltip :content="item.menuName" placement="right" :transfer="true">
              <div class="text-tootip"></div>
            </Tooltip>
            <div class="img-iconfont">
              <i class="icon" v-html="item.icon"></i>
            </div>
          </li>
        </ul>
      </div>
      <div class="nav-service">
        <Tooltip content="客服中心" placement="right" :transfer="true">
          <div class="text-tootip"></div>
        </Tooltip>
        <div class="left">
          <img src="@/assets/images/navbig/servicenav.png" alt>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapGetters, mapActions } from "vuex"
import { getCookieSession } from "@/utils/cookies"
export default {
  name: "adminNav",
  data() {
    return {
      logourl: `${process.env.SELF_BASE_URL}/logo.png`,
      unfoldData: [
        {
          fontClass: "icon-gaikuang",
          icon: "&#xe614;",
          name: "概况",
          urlName: "survey"
        },
        {
          fontClass: "icon-weixin",
          icon: "&#xe615;",
          name: "公众号",
          urlName: "tencent",
          isSecond: true
        },
        {
          fontClass: "icon-yuangong",
          icon: "&#xe619;",
          name: "员工",
          urlName: "stuff"
        },
        {
          fontClass: "icon-zuoxi",
          icon: "&#xe618;",
          name: "坐席",
          urlName: "seats"
        },
        {
          fontClass: "icon-yingxiao",
          icon: "&#xe617;",
          name: "营销",
          urlName: "markting"
        },
        {
          fontClass: "icon-qunfa",
          icon: "&#xe612;",
          name: "群发",
          urlName: "markting"
        },
        {
          fontClass: "icon-fensi",
          icon: "&#xe611;",
          name: "粉丝"
        },
        {
          fontClass: "icon-tongji",
          icon: "&#xe613;",
          name: "统计"
        },
        {
          fontClass: "icon-shezhi",
          icon: "&#xe616;",
          name: "设置",
          urlName: "setting",
          isSecond: true
        }
      ],
      mouseStatus: -1
    }
  },
  computed: {
    ...mapState({
      publicAccountList: state => state.publicAccount.publicAccountList
    }),
    ...mapGetters({
      allSecondObj: 'nav/getAllSecondObj',
      collapsed: "nav/getCollapsed",
      routerInfo: "nav/getRouterInfo",
      mainMenuList: "nav/getMainMenuList",
      validPublicAccount: "publicAccount/validPublicAccount"
    })
  },
  mounted() {
  },
  methods: {
    mouseActive(index) {
      this.mouseStatus = index
    },
    goToRouter(name, isSecond) {
      if (isSecond) {
        if (this.routerInfo.path.indexOf(name) < 0) {
          this.$router.push({
            name: name
          })
        }
      } else {
        this.$router.push({
          name: name
        })
      }
    },
    goToRouterPackup(name, isSecond) {
      if (isSecond) {
        this.setCollapsed(true)
        if (this.routerInfo.path.indexOf(name) < 0) {
          this.$router.push({
            name: name
          })
        }
      } else {
        this.$router.push({
          name: name
        })
      }
    },
    mouseUnActive(index) {
      this.mouseStatus = -1
    },
    validEnterCustomer(item) {
      // this.enterCustomerTip = "操作提示"
      // this.$refs.customerSystem.showModal()
      // this.isDisable(item.applyId, item.packStatus, item)
    },
    enterCustomerSystem() {
      let CHAT_URL = process.env.CHAT_BASE_URL
      if (CHAT_URL) {
        let sessionId = getCookieSession()
        let applyId = this.$store.state.survey.saveloginCompany.corpId
        let uid = this.getToken().userId
        window.open(
          `${CHAT_URL}/?sid=${sessionId}&corpId=${applyId}&uid=${uid}`
        )
      } else {
        console.error("请填写要跳转的地址")
      }
    },
    ...mapActions({
      setCollapsed: "nav/setCollapsed"
    })
  }
}
</script>
<style lang="stylus">
@import '~@/assets/stylus/mixin'
.admin-nav
  height 100%
  background-color #242b33
  overflow hidden
  .ivu-tooltip
    position absolute
    z-index 10
    opacity 0
    width 100%
    height 100%
    .ivu-tooltip-rel
      width 100%
      height 100%
      .text-tootip
        width 100%
        height 100%
  &.bigWidth
    transition all 0.2s
    width 120px
  &.smallWidth
    transition all 0.2s
    width 60px
  .nav-unfold, .nav-packup
    .nav-icon
      margin-top 38px
      .nav-icon-img
        cursor pointer
        position relative
        height 90px
        img
          transition all 0.5s
          position absolute
          left 33px
          width 60px
          height 60px
      .nav-icon-text
        display inline-block
        width 48px
        color #fff
        height 16px
        font-size 16px
        margin 9px 0 32px
        margin-left 34px
    .nav-main
      .nav-item
        position relative
        height 50px
        line-height 50px
        cursor pointer
        &:hover, &.active
          background-color #35404c
          .img-iconfont .icon, .text
            color #fff
        .img-iconfont
          position absolute
          top 0px
          left 30px
          .icon
            font-size 18px
            color #a8adb2
        &.icon-weixinc
          .img-iconfont
            left 29px
            .icon
              font-size 17px
        &.icon-zuoxic
          .img-iconfont
            left 28px
            .icon
              font-size 21px
        &.icon-qunfac, &.icon-fensic
          .img-iconfont
            left 29px
        &.icon-shezhic
          .img-iconfont
            left 28px
            .icon
              font-size 22px
        .text
          width 42px
          left 58px
          position absolute
          color #a8adb2
    .nav-service
      position relative
      height 50px
      line-height 50px
      margin-top 75px
      cursor pointer
      background-color #1c64ae
      .left
        position absolute
        left 20px
        img
          width 18px
          display inline-block
          vertical-align middle
      .right
        position absolute
        left 43px
        width 56px
        color #fff
  .nav-packup
    .nav-icon
      .nav-icon-img
        img
          left 13px
          width 33px
          height 33px
          transition all 0.5s
    .nav-main
      margin-top 57px
      .nav-item
        .img-iconfont
          position absolute
          top 0px
          left 18px
          .icon
            font-size 18px
            color #a8adb2
        &.icon-weixinb
          .img-iconfont
            left 17px
            .icon
              font-size 17px
        &.icon-zuoxib
          .img-iconfont
            left 16px
            .icon
              font-size 21px
        &.icon-qunfab, &.icon-fensib
          .img-iconfont
            left 17px
        &.icon-shezhib
          .img-iconfont
            left 16px
            .icon
              font-size 22px
    .nav-service
      .left
        left 19px
        text-align center
        img
          width 21px
</style>

