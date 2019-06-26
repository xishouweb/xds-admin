<template>
  <div class="componentEditPhone">
    <Form label-position="left" ref="formEditPhone" :model="formEditPhone" :rules="ruleValidate"  :label-width="100">
      <FormItem label="原手机号">
          {{params.oldMobile}}
      </FormItem>
      <FormItem label="验证身份">
        <div class="infoAuth">
          <div class="left">
            <Spin fix v-show="loadingImg">
              <Icon type="load-c" size=40 class="spin-icon-load"></Icon>
              <div>loading</div>
            </Spin>
            <img class="img" v-if="tmpData.url" :src="tmpData.url" alt="">
            <div class="loss" v-show="verifyStatus==3">
              <div class="loss-center">
                <img src="@/assets/images/excalmatory-mark.png" alt="excalmatory">
                二维码已失效
              </div>
            </div>
          </div>
          <div class="right">
            请用该手机号绑定企业时对应的微信扫码验证您的用户身份
          </div>
        </div>
        <div class="hintInfo" v-show="verifyStatus!==3">
          <div v-show="verifyStatus==1">
            <Icon size="25" type="checkmark-circled" color="#409eff"></Icon>
            <span>验证成功</span>
          </div>
          <div v-show="verifyStatus==2">
            <img class="img" src="@/assets/images/excalmatory-mark.png" alt="excalmatory">
            <span>验证失败</span>
          </div>
        </div>
        <div class="btn" v-show="verifyStatus == 3">
          <Button type="primary" @click="refresh" :disabled="refreshBtn">
            <Icon type="refresh"></Icon>
            点击刷新
          </Button>
        </div>
      </FormItem>
      <FormItem label="新手机号" prop="phone" :error="alreadyRegister">
        <Input v-model="formEditPhone.phone" clearable placeholder="请填写您更改后的手机号">
          <div slot="prepend">中国大陆+86</div>
        </Input>
      </FormItem>
      <FormItem :error="codeError" label="短信验证码" prop="code">
        <Row>
          <Col span="15"><Input v-model="formEditPhone.code" clearable placeholder="请填写验证码"></Input></Col>
          <Col offset="1" span="8">
            <Button type="primary" @click="intervalTime" :disabled="codeBtn">
              {{oneMinute}}
              <span v-show="codeBtn">秒后重发</span>
            </Button>
          </Col>
        </Row>
      </FormItem>
      <FormItem class="end" v-if="type==='editPhone'">
        <div class="go-on">
          <Button class="left" type="primary" @click="handleSubmit('formEditPhone')">保存</Button>
          <Button class="right" @click="cancel">返回</Button>
        </div>
      </FormItem>
    </Form>
  </div>
</template>
<script>
import { phone } from '@/utils/regExp'
import {
  getScanResult,
  updateCorpMobileById,
  resendCode,
  getTmpQrcode
} from '@/api/query'
const TIMENUM = 60
export default {
  name: 'componentEditPhone',
  props: {
    type: {
      type: String,
      default: 'editPhone'
    },
    params: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    const validatePhone = (rule, value, callback) => {
      value = value.alltrim()
      let isPhone = phone.test(value)
      if (isPhone) {
        callback()
      } else {
        callback(new Error('请输入正确的手机号码！'))
      }
    }
    const validateCode = (rule, value, callback) => {
      if (value.length === 4) {
        callback()
      } else {
        callback(new Error('请输入4位验证码'))
      }
    }
    return {
      formEditPhone: {
        phone: '',
        code: ''
      },
      ruleValidate: {
        phone: [
          {
            required: true,
            message: '请输入手机号',
            trigger: 'blur'
          },
          { validator: validatePhone, trigger: 'blur' }
        ],
        code: [
          {
            required: true,
            message: '请输入4位验证码',
            trigger: 'blur'
          },
          {
            validator: validateCode,
            trigger: 'blur'
          }
        ]
      },
      codeBtn: false,
      oneMinute: '获取验证码',
      alreadyRegister: null,
      codeError: null,
      token: this.getToken(),
      tmpData: {},
      verifyRandomStr: '',
      verifyStatus: 0,
      timer: null,
      loadingImg: true,
      refreshBtn: false,
      timeoutTimer: null,
      countTimer: null
    }
  },
  mounted() {
    this.$root.Bus.$on('drawerClose', () => {
      clearInterval(this.timer)
    })
  },
  watch: {
    'formEditPhone.phone'(val) {
      if (val.length === 3 || val.length === 8) {
        this.formEditPhone.phone = this.formEditPhone.phone + ' '
      }
    },
    params: {
      handler(val) {
        this.getTmpQrcode()
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    refresh() {
      this.refreshBtn = true
      this.getTmpQrcode('刷新成功')
    },
    getScanResult() {
      let params = {
        scanResult: this.tmpData.scanResult,
        qrcodeType: 'TMPQRCODE_MODMOBILE_VALID'
      }
      getScanResult(params).then(data => {
        switch (data.code) {
          case 1:
            clearInterval(this.timer)
            this.verifyStatus = 1
            this.verifyRandomStr = data.data.scanResult
            break
          case 2518:
            this.verifyStatus = 2
            clearInterval(this.timer)
            break
          case 2517:
            break
          default:
            break
        }
      })
    },
    getTmpQrcode(msg) {
      this.loadingImg = true
      let params = {
        platformType: 3,
        qrcodeType: 'TMPQRCODE_MODMOBILE_VALID',
        expireSeconds: 6000,
        appAccountId: null,
        corpId: this.params.applyId,
        mobile: this.params.oldMobile
      }
      getTmpQrcode(params).then(data => {
        if (data.code === 1) {
          if (msg) { this.$Message.success(msg) }
          this.verifyStatus = 0
          this.refreshBtn = false
          this.loadingImg = false
          this.tmpData = data.data
          this.timer = setInterval(() => {
            this.getScanResult()
          }, 5000)
          this.timeoutTimer = setTimeout(() => {
            this.verifyStatus = 3
            clearInterval(this.timer)
            this.timer = null
          }, data.data.expireSeconds * 1000)
        }
      }).catch(() => {
        this.loadingImg = true
        this.refreshBtn = false
      })
    },
    // getDefaultInfo() {
    //   getDefaultInfo().then(data => {
    //     this.appAccountId = data.data.defaultWechatAccountid
    //     this.getTmpQrcode()
    //   })
    // },
    updateCorpMobileById() {
      let params = {
        applyId: this.params.applyId,
        identifyType: 'MOBILE',
        oldMobile: this.params.oldMobile,
        validateCode: this.formEditPhone.code,
        identifyCode: this.formEditPhone.phone.alltrim(),
        userId: this.token.userId,
        scanResult: this.tmpData.scanResult,
        verifyRandomStr: this.verifyRandomStr
      }
      updateCorpMobileById(params).then(data => {
        switch (data.code) {
          case 1:
            this.$Message.success('手机号修改成功！')
            if (this.type === 'editPhone') {
              this.$router.push({ name: 'personInfo' })
            } else {
              this.$emit('success', true)
            }
            break
          case 2501:
            this.codeError = '验证码错误'
            break
          case 2519:
            this.$Message.error('请先用微信扫描上面的二维码验证身份')
            break
          case 1002:
            this.$Message.error('请先用微信扫描上面的二维码验证身份')
            break
          case 2525:
            this.oneMinute = '获取验证码'
            this.codeBtn = false
            clearInterval(this.countTimer)
            this.alreadyRegister = '该手机号已绑定，请重新输入'
            break
          default:
            this.$Message.error('手机号修改失败！')
            break
        }
      }).catch(() => {
        this.$Message.error('手机号修改失败！')
        this.$emit('success', false)
      })
    },
    resendCode() {
      this.codeParams = {
        userId: this.token.userId,
        identifyType: 'MOBILE',
        identifyCode: this.formEditPhone.phone.alltrim(),
        validateCode: null,
        validateCodeType: 1,
        validateCodeLength: 4,
        validateCodeBusiType: 'MODMOBILE_VALID'
      }
      resendCode(this.codeParams).then(data => {
        if (data.code === 1) {
        }
      })
    },
    handleSubmit(name) {
      this.alreadyRegister = null
      this.codeError = null
      this.$refs[name].validate(valid => {
        if (valid) {
          this.updateCorpMobileById()
        } else {
        }
      })
    },
    cancel() {
      this.$router.push({ name: 'personInfo' })
    },
    intervalTime() {
      this.$refs.formEditPhone.validateField('phone', message => {
        if (!message) {
          this.resendCode()
          this.oneMinute = TIMENUM
          this.codeBtn = true
          this.countTimer = setInterval(() => {
            this.oneMinute--
            if (this.oneMinute <= 0) {
              this.codeBtn = false
              this.oneMinute = '获取验证码'
              clearInterval(this.countTimer)
            }
          }, 1000)
        }
      })
    }
  },
  destroyed() {
    clearInterval(this.countTimer)
    clearInterval(this.timer)
    clearTimeout(this.timeoutTimer)
    this.timeoutTimer = null
    this.timer = null
    this.countTimer = null
  }
}
</script>


<style lang="stylus">
@import '~@/assets/stylus/mixin'
.componentEditPhone
  .ivu-form-item-required .ivu-form-item-label:before
    display none
  .ivu-btn
    height 40px
  .ivu-form-item
    margin-bottom 31px
    &:nth-of-type(1)
      margin-bottom 25px
  .end
    .ivu-form-item-content
      margin-left 0 !important
      .go-on
        .ivu-btn
          height 40px
          width 140px
        .left
          float left
        .right
          float right
  .infoAuth
    clear()
    .left
      position relative
      width 130px
      height 130px
      left -8px
      top 3px
      float left
      .img
        width 130px
        height 130px
      .loss
        position absolute
        width 100%
        height 100%
        top 0
        left 0
        background-color rgba(255, 255, 255, 0.9)
        .loss-center
          text-align center
          line-height 130px
          font-size 13px
          img
            width 20px
            height 20px
            display inline-block
            vertical-align middle
    .right
      position relative
      top 7px
      float left
      line-height 22px
      width 154px
  .hintInfo
    height 32px
    margin-top 3px
    margin-left 8px
    .ivu-icon
      vertical-align middle
      margin-right 5px
    .img
      display inline-block
      margin-right 5px
      vertical-align middle
  .btn
    margin-top 10px
</style>


