<template>
  <div id="register-main">
    <div class="register-header">
      <div class="header-left">
        <div class="icon">
          <a href="/">
            <img :src="logourl" alt="icon">
          </a>
        </div>
      </div>
      <div class="header-right">
        <span class="select-login" v-if="!userInfo">
          <router-link to="/login">登录</router-link>
        </span>
        <span v-show="!userInfo">销大师账号</span>
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
              <DropdownItem name="company">
                <Icon size="16" type="home"></Icon>我的企业
              </DropdownItem>
              <DropdownItem name="personInfo">
                <Icon size="16" type="person"></Icon>个人信息
              </DropdownItem>
              <DropdownItem name="quit">
                <Icon size="16" type="power"></Icon>退出登录
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>
    </div>
    <div class="register-min">
      <div class="register-form">
        <div class="register-wrapper">
          <div class="title">
            <div class="ykt-icon">欢迎注册销大师</div>
          </div>
          <div class="article">
            <div class="steps">
              <div class="steps-item">
                <div class="steps-img">
                  <img src="@/assets/images/wechat.png" alt>
                </div>
                <div class="steps-text">1.&ensp; 微信扫码注册</div>
              </div>
              <div class="steps-item steps-line">
                <div class="line1"></div>
                <div class="line2"></div>
              </div>
              <div class="steps-item">
                <div class="steps-img">
                  <img src="@/assets/images/phone.png" alt v-if="step < 1">
                  <img src="@/assets/images/phoneActive.png" alt v-if="step >= 1">
                </div>
                <div class="steps-text">2.&ensp; 绑定手机号码</div>
              </div>
              <div class="steps-item steps-line">
                <div class="line1"></div>
                <div class="line2"></div>
              </div>
              <div class="steps-item">
                <div class="steps-img">
                  <img src="@/assets/images/company.png" alt v-if="step < 2">
                  <img src="@/assets/images/companyActive.png" alt v-if="step == 2">
                </div>
                <div class="steps-text">3.&ensp; 创建企业</div>
              </div>
            </div>
            <div class="content">
              <!-- 注册第一步 -->
              <div class="steps-1" v-show="step == 0">
                <tmp-qrcode qrcodeType="Register" tips="关注成功 正在跳转..."></tmp-qrcode>
                <div class="tips dex">
                  <div>微信扫一扫注册，扫码后点击“关注公众号”即可完成注册</div>
                </div>
                <div class="tips agree">
                  <span>扫码注册即表示同意</span>
                  <router-link :to="{name:'agreement'}" target="_blank">《销大师注册协议》</router-link>
                </div>
              </div>
              <!-- 注册第二步 -->
              <div class="steps-2" v-if="step == 1">
                <second-step></second-step>
              </div>
              <div class="steps-2" v-if="step == 2">
                <third-step type="new"></third-step>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="footer">
      <commonFooter></commonFooter>
    </div>
  </div>
</template>

<script>
import secondStep from "./secondStep"
import thirdStep from "./thirdStep"
import CommonFooter from "@/layouts/CommonFooter"
import TmpQrcode from "@/components/TmpQrcode"
import { logout, saveWebAdminLoginBySession, getSession, getPersonalInfo } from "@/api/query"
import { mapGetters } from "vuex"
export default {
  data() {
    return {
      logourl: `${process.env.SELF_BASE_URL}/top_logo.png`,
      registerData: [],
      appAccountId: "",
      status: 0,
      loadingImg: false,
      userInfo: this.getToken() || null
    }
  },
  computed: {
    ...mapGetters({
      step: "user/getStep"
    })
  },
  watch: {
    step() {
      this.userInfo = this.getToken() || null
    }
  },
  created() {
    // this.logout()
    setTimeout(() => {
      this.registerClient()
    }, 1000)
  },
  mounted() {},
  methods: {
    logout() {
      logout().then(data => {
        if (data.code === 1) {
          this.removeToken()
          this.localStorageRemove("accountList")
          this.localStorageRemove("currentCorp")
          this.localStorageRemove("preAuthCode")
          this.$router.push({ name: "login" })
        }
      })
    },
    enterRoute(name) {
      if (name !== "quit") {
        this.$router.push({ name: name })
      } else {
        this.logout()
      }
    },
    async registerClient() {
      const { sessionId, userId } = this.$route.query
      if (userId) {
        // 没有用户
        if (!this.userInfo) {
          const params = {
            oldSessionId: sessionId,
            userId: parseInt(userId),
            platformType: "PC_WEB_ADMIN"
          }
          const res = await saveWebAdminLoginBySession(params)
          // debugger
          if (res.code === 1) {
            const resSession = await getSession()
            const resPerson = await getPersonalInfo()
            if (resSession.code === 1 && resPerson.code === 1) {
              let session = {
                ...resSession.data,
                corpList: resPerson.data.corpList
              }
              this.setToken(session, 0.5)
              location.reload()
            } else {
              this.$Message.error("登录失败")
            }
          } else {
            this.$Message.error("登录失败")
          }
        }
        // 有其他用户
        if (this.userInfo && this.userInfo.userId !== parseInt(userId)) {
          const res = await logout()
          if (res.code === 1) {
            this.removeToken()
            this.localStorageRemove("accountList")
            this.localStorageRemove("currentCorp")
            this.localStorageRemove("preAuthCode")
            location.reload()
          }
        }
        // 有自己,不处理
      }
    }
  },
  components: {
    secondStep,
    thirdStep,
    CommonFooter,
    TmpQrcode
  }
}
</script>

<style lang="stylus">
@import '~@/assets/stylus/mixin'
#register-main
  width 100%
  height 100%
  background-color rgb(246, 246, 247)
  .register-header
    z-index 2
    height 80px
    background-color #ffffff
    // box-shadow 0px 1px 10px 0px #e5e5e5
    box-shadow: 0px 2px 6px rgba(0, 51, 102, 0.15)
    .header-left
      clear()
      float left
      line-height 80px
      margin-left 30px
      .icon
        cursor pointer
        clear()
        a
          height: 80px
          display: flex
          align-items: center
        img
          float left
          // width 33px
          height 45px
          // margin-top 14px
        .text
          float left
          font-size 21px
          margin-left 5px
          color #0f0f0f
    .header-right
      margin-right 30px
      line-height 80px
      float right
      .select-login
        a
          color #409eff
      .login-after
        margin-right 94px
        cursor pointer
        clear()
        .user
          line-height 80px
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
  .register-min
    width 100%
    margin-top 40px
    .register-form
      // height 693px
      width 1179px
      margin auto
      text-align center
      .register-wrapper
        .title
          .ykt-icon
            font-size 36px
            display inline-block
            cursor pointer
            >div
              clear()
              img
                float left
              .text
                float left
                font-size 16px
                margin-left 8px
                margin-top 12px
        .article
          height 540px
          margin-top 40px
          padding-top 40px
          border solid 1px #fff
          background-color #fff
          box-shadow 1px 1px 5px 0px rgba(0, 0, 0, 0.2)
          hide-boxShadow()
          .steps
            display inline-block
            height 60px
            text-align left
            .steps-item
              display inline-block
              text-align center
              height 80px
              .steps-img
                margin-bottom 10px
              &.steps-line
                width 150px
                position relative
                margin-left 12px
                margin-right 12px
                .line1
                  position absolute
                  width 150px
                  height 1px
                  background-color #e6e6e6
                  top 29px
          .content
            .steps-1
              display inline-block
              text-align center
              margin-top 60px
              .weixin
                position relative
                height 155px
                margin-bottom 0
                img
                  width 155px
              .agree
                margin-top 10px
                color #999999
                a
                  height 24px
                  line-height 24px
                  margin-bottom 15px
                  display inline-block
                  cursor pointer
                  color #999999
                  &:hover
                    color #409eff
  .footer
    margin-top 30px
    .commom-footer-wrapper
      padding-top 20px
      height 110px
</style>
