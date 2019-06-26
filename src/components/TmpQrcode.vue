<template>
  <div class="tmpQrcode">
    <div class="qrcode-img" :style="styles">
      <Spin fix v-show="status === 0">
        <Icon type="load-c" size=40 class="spin-icon-load"></Icon>
        <div>loading</div>
      </Spin>
      <img class="img" v-if="loginData.url" :src="loginData.url" alt="tmpQrcode">
      <div class="loss" v-show="status == 3">
        <div class="loss-center" :class="{registerCenter: qrcodeType=='Register'}">
          <img src="@/assets/images/excalmatory-mark.png" alt="excalmatory">
          {{contentText}}
        </div>
      </div>
    </div>
    <div class="status-tips">
      <div class="tips">
        <div v-show="status == 1 && qrcodeType=='Login'">
          <img class="wechat" src="@/assets/images/wechat.png" alt="right">
          微信扫一扫登录
        </div>
        <div v-show="status == 2">
          <img src="@/assets/images/right.png" alt="right">
          {{tips}}
        </div>
        <div class="btn" v-show="status == 3">
          <Button type="primary" @click="refresh" :disabled="refreshBtn">
            <Icon type="refresh"></Icon>
            点击刷新
            </Button>
        </div>
      </div>
    </div>
    <NewModal v-model="forbidden" :closable="false" :maskClosable="false" header="禁用提示" :content="content" confrim="知道了" :cancelBtn="false"></NewModal>
  </div>
</template>

<script>
import {
  getTmpQrcode,
  getSession,
  getPersonalInfo,
  saveloginCompany
} from '@/api/query'
import {mapActions} from 'vuex'
export default {
  props: {
    styles: {
      type: Object,
      default: () => {
        return {
          width: '180px',
          height: '180px'
        }
      }
    },
    qrcodeType: {
      type: String,
      default: 'Login'
    },
    tips: {
      type: String,
      default: '登录成功 正在跳转...'
    }
  },
  data() {
    return {
      content: '很抱歉，您的微信账号已被禁用，请换一个微信试一试吧。如需帮助，请联系销大师，咨询电话：400-1622-800。',
      loginData: [],
      timer: null,
      status: 0,
      refreshBtn: false,
      tokenData: {},
      timeoutTimer: null,
      forbidden: false,
      contentText: '111'
    }
  },
  created() {
    this.getTmpQrcode()
  },
  methods: {
    // 进入公司信息
    saveloginCompany(param, name) {
      let obj = {
        corpId: param
      }
      saveloginCompany(obj).then(data => {
        if (data.code === 1) {
          if (!data.data.menuTree) {
            this.$Message.error('非常抱歉，您暂无权限，不能进入管理')
            return
          }
          this.$router.push({ name: name })
        } else {
          this.$router.push({ name: 'company' })
        }
      })
    },
    refresh() {
      this.refreshBtn = true
      this.getTmpQrcode('刷新成功')
    },
    // getDefaultInfo() {
    //   getDefaultInfo().then(data => {
    //     this.appAccountId = data.data.defaultWechatAccountid
    //     this.tokenData = Object.assign({}, this.tokenData, data.data)
    //     this.getTmpQrcode()
    //   })
    // },
    getTmpQrcode(msg) {
      let params = {
        platformType: 3,
        qrcodeType: 'TMPQRCODE_LOGIN_SESSIONID',
        expireSeconds: 6000,
        appAccountId: null,
        corpId: null,
        mobile: null
      }
      this.status = 0
      getTmpQrcode(params)
        .then(data => {
          if (data.code === 1) {
            if (msg) { this.$Message.success(msg) }
            this.refreshBtn = false
            this.status = 1
            this.loginData = data.data
            this.getSession()
            if (!this.timer) {
              this.timer = setInterval(() => {
                this.getSession()
              }, 5000)
            }
            this.timeoutTimer = setTimeout(() => {
              this.contentText = '二维码已失效'
              this.status = 3
              this.refreshBtn = false
              clearInterval(this.timer)
              this.timer = null
            }, data.data.expireSeconds * 1000)
          } else {
            this.status = 3
            this.contentText = '服务开小差啦'
            this.$Message.error('抱歉！服务暂时不可用，请稍后再试！')
            this.refreshBtn = false
          }
        })
        .catch(() => {
          this.contentText = '服务开小差啦'
          this.$Message.error('抱歉！服务暂时不可用，请稍后再试！')
          this.status = 3
          this.refreshBtn = false
        })
    },
    getPersonalInfo() {
      getPersonalInfo().then(data => {
        if (data.code === 1) {
          this.status = 2
          this.tokenData.corpList = (data.data.corpList && data.data.corpList.length) || 0
          this.setToken(this.tokenData, 0.5)
          if (data.data.corpList === null || (data.data.corpList && data.data.corpList.length === 0)) {
            if (data.data.alreadyCreateCorp) {
              this.localStorageSaveOrRead('isCreatCompany', true)
              this.$router.push({name: 'createCompany'})
              return
            }
            this.setStep(2)
            setTimeout(() => {
              if (this.qrcodeType === 'Register') {
              } else {
                this.$Message.error('您还没有绑定企业，请先绑定企业')
                this.$router.push({name: 'register'})
              }
            }, 1500)
          } else if (data.data.corpList && data.data.corpList.length === 1) {
            if (data.data.corpList[0].corpStatus !== 'ACTIVE') {
              this.$router.push({ name: 'company' })
            } else {
              let currentCorp = {
                applyId: data.data.corpList[0].corpId,
                corpName: data.data.corpList[0].companyName
              }
              this.localStorageSaveOrRead('currentCorp', currentCorp)
              this.saveloginCompany(data.data.corpList[0].corpId, 'survey')
            }
          } else {
            setTimeout(() => {
              this.$router.push({ name: 'company' })
            }, 1500)
          }
        }
      })
    },
    getSession() {
      getSession()
        .then(data => {
          switch (data.code) {
            case 1:
              clearInterval(this.timer)
              this.timer = null
              this.status = 2
              delete data.data.sessionId
              this.tokenData = Object.assign({}, this.tokenData, data.data)
              this.tokenData.corpList = 0
              this.setToken(this.tokenData, 0.5)
              if (data.data.mobileStatus !== 'BIND') {
                this.setStep(1)
                if (this.qrcodeType === 'Register') {
                } else {
                  setTimeout(() => {
                    this.$Message.error('您还没有绑定手机，请先绑定手机')
                    this.$router.push({name: 'register'})
                  }, 1500)
                }
              } else {
                this.getPersonalInfo()
              }
              break
            case 0:
              this.$Message.error(data.message)
              break
            // case 2524:
            //   this.forbidden = true
            //   clearInterval(this.timer)
            //   this.timer = null
            //   break
            default:
              break
          }
        })
        .catch(() => {
          clearInterval(this.timer)
          this.timer = null
        })
    },
    ...mapActions({
      setStep: 'user/setStep'
    })
  },
  destroyed() {
    clearInterval(this.timer)
    clearTimeout(this.timeoutTimer)
    this.timeoutTimer = null
    this.timer = null
  }
}
</script>

<style lang="stylus">
.tmpQrcode
  display inline-block
  .qrcode-img
    position relative
    .loss
      position absolute
      width 100%
      height 100%
      top 0
      left 0
      background-color rgba(255, 255, 255, 0.9)
      .loss-center
        margin-top 80px
        &.registerCenter
          margin-top 80px
        img
          display inline-block
          vertical-align middle
    .img
      width 100%
  .status-tips
    margin-top 13px
    .tips
      height 40px
      line-height 24px
      margin-bottom 10px
      img
        display inline-block
        vertical-align middle
      .btn
        .ivu-btn
          width 100%
          margin-bottom 15px
    .tips
      .wechat
        width 24px
        height 24px
</style>

