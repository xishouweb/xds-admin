<template>
  <div id="authorization">
    <div class="auth-header">
      <div><img src="@/assets/images/admin/weixin.png" alt=""></div>
      <div>微信公众平台</div>
      <div>销大师</div>
    </div>
    <div class="auth-main" v-if="status !== null">
      <div class="auth-title">公众平台账号授权</div>
      <div class="auth-wrapper" :class="{setWidth:status == 6}">
        <div class="already-auth auth-item" v-show="status == 3">
          <div class="auth-img">
            <Icon type="information-circled" size="46" color="#F7BA2B"></Icon>
          </div>
          <div class="result">公众号已授权</div>
          <div class="tips" v-if="currpart">该公众号已绑定在<span class="corp-color">{{reAuthData.srcCorpName}}</span>名下，您正在将公众号重新授权绑定给<span class="corp-color">{{reAuthData.corpName}}</span>，点击“重新授权”后公众号将从原绑定的企业中自动解绑。如需帮助，请随时通过销大师公众号在线咨询哦。</div>
          <div class="tips" v-if="!currpart">该公众号已绑定在<span class="corp-color">{{reAuthData.srcCorpName}}</span>名下，无法重新授权绑定给<span class="corp-color">{{reAuthData.corpName}}</span>，如需帮助，请随时通过销大师公众号在线咨询哦。</div>
          <div class="float-btn">
            <Button size="small" class="left" type="ghost" @click="reBind" v-if="currpart">重新授权</Button>
            <Button size="small" class="right" type="primary"  @click="goSurvey">继续使用</Button>
          </div>
        </div>
        <div class="already-auth auth-item" v-show="status == 5">
          <div class="auth-img">
            <Icon type="information-circled" size="46" color="#F7BA2B"></Icon>
          </div>
          <div class="result">公众号已授权</div>
          <div class="tips">该公众号已绑定在当前企业，请尝试其他公众号，或将此公众号解绑后再进行授权</div>
          <div class="float-btn">
            <Button size="small" class="left" type="ghost" @click="getAuthUrl">其他公众号</Button>
            <Button size="small" class="right" type="primary"  @click="goSurvey">继续使用</Button>
          </div>
        </div>
        <div class="no-funcInfo no-permission auth-item" v-show="status == 6">
          <div class="auth-img">
            <Icon type="information-circled" size="46" color="#F7BA2B"></Icon>
          </div>
          <div class="result">授权权限不足</div>
          <div class="tips">你的公众号<span class="corp-color">{{reAuthData.nickName}}</span>有以下权限未授权给销大师：</div>
          <div class="list-wrapper">
            <div class="list-item" v-for="item in funcInfo" :key="item.itemValue">
              {{item.itemName}}
            </div>
          </div>
          <div class="tips-bottom">因授权的权限不足无法正常使用产品功能，请继续将以上权限授权给销大师。</div>
          <div class="float-btn">
            <Button size="small" class="left" type="ghost"  @click="goTencent">返回公众号管理</Button>
            <Button size="small" class="right" type="primary"  @click="getAuthUrl">重新授权</Button>
          </div>
        </div>
        <div class="no-permission auth-item" v-show="status == 7">
          <div class="auth-img">
            <Icon type="information-circled" size="46" color="#F7BA2B"></Icon>
          </div>
          <div class="result">公众号未认证</div>
          <div class="tips">您授权的公众号<span class="corp-color">{{reAuthData.nickName}}</span>未认证，为了更好地使用销大师，请先进入微信公众平台认证。</div>
          <div class="float-btn">
            <Button size="small" class="left" type="ghost"  @click="goTencent">返回公众号管理</Button>
            <Button size="small" class="right" type="primary"  @click="goAuthentication">去认证</Button>
          </div>
        </div>
        <div class="auth-error auth-item" v-show="status == 2">
          <div class="auth-img">
            <Icon type="close-circled" size="46" color="#F46C6C"></Icon>
          </div>
          <div class="result">授权失败</div>
          <div class="tips">公众号授权失败，请重新扫码授权</div>
          <div class="single-btn">
            <Button size="small" type="primary"  @click="getAuthUrl">重新授权</Button>
          </div>
        </div>
        <div class="ansy-auth auth-item" v-show="status == 0">
          <div class="auth-img auth-loading">
            <Spin fix>
              <Icon type="load-c" size=40 class="spin-icon-load"></Icon>
            </Spin>
          </div>
          <div class="result">同步数据</div>
          <div class="tips">预计{{countNum}}s后完成，请稍后…</div>
        </div>
        <div class="ansy-error auth-item" v-show="status == 4">
          <div class="auth-img">
            <Icon type="close-circled" size="46" color="#F46C6C"></Icon>
          </div>
          <div class="result">数据同步失败</div>
          <div class="tips">数据同步失败，该公众号授权可能失败，您可重新授权或点击查看公众号是否授权成功</div>
          <div class="float-btn">
            <Button size="small" class="left" type="ghost" @click="getAuthUrl">重新授权</Button>
            <Button size="small" class="right" type="primary" @click="goTencent">查看公众号</Button>
          </div>
        </div>
        <div class="success-auth auth-item" v-show="status == 1">
          <div class="auth-img">
            <Icon type="checkmark-circled"  size="46" color="#3FB738"></Icon>
          </div>
          <div class="result">授权成功</div>
          <div class="tips">数据同步完成，公众号授权成功，您可正常使用销大师系统</div>
          <div class="single-btn">
            <Button size="small" type="primary"  @click="goTencent">立即使用</Button>
          </div>
        </div>
        <div class="end-end">
          <div class="left">
            <img :src="logourl" alt="">
          </div>
          <div class="right">
            <div>销大师</div>
            <div class="des">
              <div class="mark">标签</div>
              <div class="detail">企业管理 互动营销 客服系统 CRM 客户管理</div>
            </div>
            <div class="des">
              <div class="mark">简介</div>
              <div class="detail">销大师，微信裂变营销专家，为企业提供裂变吸粉，高级群发。智能客服等丰富的社交营销解决方案。销大师————让微信营销飞起来!</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { getScanResult, getAuthUrl, updateBindCorp } from '@/api/query'
import {mapActions} from 'vuex'
const timeoutNum = 10000
const intervalNum = 2000
const countDown = 10
const TENCENTURL = 'https://mp.weixin.qq.com/'
export default {
  name: 'authorization',
  data() {
    return {
      logourl: `${process.env.SELF_BASE_URL}/logo.png`,
      timer: null,
      numTime: null,
      outTime: null,
      thirdplatUrl: '',
      status: null,
      authCode: '',
      countNum: countDown,
      randomStr: '',
      preAuthCode: this.localStorageSaveOrRead('preAuthCode'),
      reAuth: 0,
      reAuthData: {},
      funcInfo: [],
      requiredAuth: [],
      currpart: true
    }
  },
  created() {
    this.getItemValue('XDS_SUBSCRIPTION_NUMBER_REQUIRED_AUTH')
  },
  mounted() {
    if (this.$route.query) {
      this.authCode = this.$route.query.auth_code
    }
  },
  methods: {
    ...mapActions({
      resetPublicAccountList: 'publicAccount/resetPublicAccountList'
    }),
    reBind() {
      this.reAuth = 1
      this.countNum = countDown
      this.getAuthorization()
    },
    goTencent() {
      this.$router.push({ name: 'tencentManage' })
    },
    goSurvey() {
      this.$router.push({ name: 'survey' })
    },
    getAuthUrl() {
      let params = {
        redirectUrl: this.constRedirectUrl,
        reqType: 0,
        authType: 3
      }
      getAuthUrl(params).then(data => {
        if (data.code === 1) {
          this.thirdplatUrl = data.data.url
          this.localStorageSaveOrRead('preAuthCode', data.data.preAuthCode)
          this.preAuthCode = data.data.preAuthCode
          this.skipUrl(this.thirdplatUrl)
        } else {
          this.$Message.error('获取授权url失败')
        }
      }).catch(() => {
        this.$Message.error('获取授权url失败')
      })
    },
    goAuthentication() {
      window.open(TENCENTURL)
    },
    getAuthorization() {
      let params = {
        randomStr: this.authCode,
        preAuthCode: this.preAuthCode,
        reAuth: this.reAuth
      }
      updateBindCorp(params).then(data => {
        switch (data.code) {
          case 1:
            if (data.data.funcInfo && JSON.parse(data.data.funcInfo).length > 0) {
              this.status = 6
              this.reAuthData = data.data
              this.funcInfo = this.filterData(data.data.funcInfo, this.requiredAuth)
              clearTimeout(this.outTime)
              clearInterval(this.timer)
              clearInterval(this.numTime)
              this.outTime = null
              this.timer = null
              this.numTime = null
              return
            } else if (data.data.verifyType && data.data.verifyType === '-1') {
              clearTimeout(this.outTime)
              clearInterval(this.timer)
              clearInterval(this.numTime)
              this.outTime = null
              this.timer = null
              this.numTime = null
              this.status = 7
              this.reAuthData = data.data
              return
            }
            if (data.data.authed) {
              clearTimeout(this.outTime)
              clearInterval(this.timer)
              clearInterval(this.numTime)
              this.outTime = null
              this.timer = null
              this.numTime = null
              this.reAuthData = data.data
              if (data.data.authed !== 'same') {
                this.status = 3
                this.currpart = true
                if (data.data.authed.currpart) {
                  this.currpart = false
                }
              } else {
                this.status = 5
              }
            } else {
              this.randomStr = data.data.randomStr
              this.intervalLoop()
              this.timeoutLoop()
              this.status = 0
            }
            break
          // 验证无效
          case 2517:
            break
          // 验证失败
          case 2518:
            clearTimeout(this.outTime)
            clearInterval(this.timer)
            clearInterval(this.numTime)
            this.outTime = null
            this.timer = null
            this.numTime = null
            this.status = 2
            break
          // 验证失败
          case 0:
            clearTimeout(this.outTime)
            clearInterval(this.timer)
            clearInterval(this.numTime)
            this.outTime = null
            this.timer = null
            this.numTime = null
            this.status = 2
            break
          // 授权码已经绑定过 COMPONENT_AUTHCODE
          case 2521:
            clearTimeout(this.outTime)
            clearInterval(this.timer)
            clearInterval(this.numTime)
            this.outTime = null
            this.timer = null
            this.numTime = null
            this.status = 3
            break
          // 数据已被禁用
          case 2522:
            this.$Message.error('授权失败，数据已被禁用')
            clearTimeout(this.outTime)
            clearInterval(this.timer)
            clearInterval(this.numTime)
            this.outTime = null
            this.timer = null
            this.numTime = null
            break
          // 数据已被停用
          case 2523:
            this.$Message.error('授权失败，数据已被停用')
            clearTimeout(this.outTime)
            clearInterval(this.timer)
            clearInterval(this.numTime)
            this.outTime = null
            this.timer = null
            this.numTime = null
            break
          default:
            this.$Message.error(data.message)
            break
        }
      })
    },
    getScanResult() {
      let params = {
        qrcodeType: 'SYNC_WX_PUBLIC_ACCOUNT',
        randomStr: this.randomStr
      }
      getScanResult(params).then(data => {
        switch (data.code) {
          case 1:
            this.status = 1
            clearTimeout(this.outTime)
            clearInterval(this.timer)
            clearInterval(this.numTime)
            this.resetPublicAccountList()
            this.outTime = null
            this.timer = null
            this.numTime = null
            break
          case 2517:
            break
          case 2518:
            this.status = 4
            clearTimeout(this.outTime)
            clearInterval(this.timer)
            clearInterval(this.numTime)
            this.outTime = null
            this.timer = null
            this.numTime = null
            break
          default:
            this.$Message.error(data.message)
            break
        }
      }).catch(() => {
        this.status = 4
        clearTimeout(this.outTime)
        clearInterval(this.timer)
        clearInterval(this.numTime)
        this.outTime = null
        this.timer = null
        this.numTime = null
      })
    },
    timeoutLoop() {
      if (this.outTime) {
        return
      }
      this.countNum = countDown
      this.numTime = setInterval(() => {
        this.countNum--
      }, 1000)
      this.outTime = setTimeout(() => {
        this.status = 4
        clearInterval(this.timer)
        clearInterval(this.numTime)
        this.timer = null
        this.numTime = null
      }, timeoutNum)
    },
    intervalLoop() {
      if (this.timer) {
        return
      }
      this.timer = setInterval(() => {
        this.getScanResult()
      }, intervalNum)
    },
    // 获取坐席筛选的状态
    getItemValue(key) {
      let obj = {
        itemKey: key
      }
      this.queryTItemValueByPager(obj).then(data => {
        switch (data.code) {
          case 1:
            this.getAuthorization()
            this.requiredAuth = data.data
            break
          default:
            break
        }
      })
    },
    // 过滤权限数据显示缺少的权限
    filterData(funcInfo, auth) {
      let arr = []
      funcInfo = JSON.parse(funcInfo)
      auth.forEach(item => {
        if (funcInfo.indexOf(Number(item.itemValue)) > -1) {
          arr.push(item)
        }
      })
      return arr
    }
  },
  destroyed() {
    clearTimeout(this.outTime)
    clearInterval(this.timer)
    clearInterval(this.numTime)
    this.outTime = null
    this.timer = null
    this.numTime = null
  }
}
</script>
<style lang="stylus">
@import './authorization.styl'
</style>


