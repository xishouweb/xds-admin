<template>
  <div id="login">
    <Wave class="login-wave"></Wave>
    <div class="login-cont">
      <div class="login-header flexB">
        <div class="header-left">
          <div class="icon">
            <a href="/">
              <img :src="logourl" alt="icon">
            </a>
          </div>
        </div>
        <div class="header-right">
          <span class="select-login" v-if="!userInfo">
            <span @click="toRegister">免费试用</span>
          </span>
          <div class="login-after" v-if="userInfo">
            <Dropdown trigger="hover" :transfer="true" @on-click="enterRoute">
              <div class="user">
                <div class="user-img">
                  <img :src="userInfo.picUrl" alt="userImg">
                </div>
                <div class="user-name">{{userInfo.nickName}}</div>
                <Icon type="arrow-down-b"></Icon>
              </div>
              <DropdownMenu slot="list" class="userDrop">
                <DropdownItem name="company"><Icon size="16" type="home"></Icon>我的企业</DropdownItem>
                <DropdownItem name="personInfo"><Icon size="16" type="person"></Icon>个人信息</DropdownItem>
                <DropdownItem name="quit"><Icon size="16" type="power"></Icon>退出登录</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>
      </div>
      <div class="login-main">
        <div class="center flexB">
          <div class="official">
            <div class="official-wrapper">
              <h2>微信裂变营销专家</h2>
              <Row>
                <Col span="14"><div class="item">裂变式增长</div></Col>
                <Col span="10"><div class="item">连接粉丝</div></Col>
              </Row>
              <Row>
                <Col span="14"><div class="item">精准化营销</div></Col>
                <Col span="10"><div class="item">成交客户</div></Col>
              </Row>
            </div>
          </div>
          <div class="login-form">
            <div class="title">欢迎登录销大师</div>
            <div class="content">
              <tmp-qrcode></tmp-qrcode>
            </div>
          </div>
        </div>
      </div>
      <div class="footer">
        <loginFooter></loginFooter>
      </div>
    </div>
  </div>
</template>

<script>
import {
  logout
} from '@/api/query'
import {mapActions} from 'vuex'
import loginFooter from './loginFooter'
import TmpQrcode from '@/components/TmpQrcode'
import Wave from '@/components/wave'
export default {
  data() {
    return {
      logourl: `${process.env.SELF_BASE_URL}/login_logo.png`,
      userInfo: this.getToken() || null,
    }
  },
  created() {
    // this.logout()
  },
  mounted() {
  },
  methods: {
    logout() {
      logout().then(data => {
        if (data.code === 1) {
          this.removeToken()
        }
      })
    },
    toRegister() {
      this.setStep(0)
      this.$router.push({name: 'register'})
    },
    ...mapActions({
      setStep: 'user/setStep'
    })
  },
  components: {
    loginFooter,
    TmpQrcode,
    Wave,
    // commonHeader
  },
  destroyed() {
    clearInterval(this.timer)
  }
}
</script>

<style lang="stylus">
@import '~@/assets/stylus/mixin'
  html, body
    overflow: hidden
#login
  width 100%
  height 100%
  overflow auto
  background-image url('../../assets/images/login-bg.png')
  // background-position 50% 50%
  background-size 100% 100%
  .login-wave
    position: absolute
    left: 0
    top: 0
    right: 16px
    bottom:16px
    z-index: 0
  .login-cont
    min-width: 1200px
    position: relative
    z-index: 1
  .login-header
    z-index 2
    height 80px
    .header-left
      clear()
      float left
      line-height 60px
      margin-left 30px
      .icon
        cursor pointer
        clear()
        a
          disply: flex
          align-items: center
          height: 80px
        img
          float left
          // margin-top 14px
          // width 33px
          height 45px
        .text
          float left
          color #fff
          font-size 16px
          margin-left 5px
    .header-right
      margin-right 30px
      line-height 80px
      float right
      .select-login
        span
          cursor pointer
          color #ffffff
      .login-after
        margin-right 94px
        cursor pointer
        clear()
        .user
          line-height 60px
          .user-img
            float left
            margin-right 5px
            img
              width 36px
              height 36px
              border-radius 50%
              display inline-block
              vertical-align middle
          .user-name
            float left
            padding-right 5px
            max-width 90px
            no-wrap()
  .login-main
    position relative
    width 100%
    text-align center
    margin 116px 0
    clear()
    .center
      // display inline-block
      padding: 0 50px
      max-width: 1200px
      margin: 0 auto
    .official
      text-align left
      float left
      margin-right 50px
      .official-wrapper
        color #ffffff
        h2
          margin-top 46px
          margin-bottom 80px
          font-size 60px
        .item
          margin-top 38px
          font-size 30px
          padding-left 39px
          position relative
          &:after
            position absolute
            content ''
            width 10px
            height 10px
            background-color #fff
            border-radius 50%
            top 50%
            margin-top -5px
            left 0
    .login-form
      float left
      height 445px
      width 400px
      background-color #fff
      margin-top 5px
      box-shadow 1px 2px 18px 0px rgba(0, 0, 0, 0.2)
      hide-boxShadow()
      .title
        font-size 30px
        margin-top 58px
        margin-bottom 62px
      .content
        display inline-block
  // >.footer
  //   background-color transparent
  //   .commom-footer-wrapper
  //     background-color transparent
</style>
