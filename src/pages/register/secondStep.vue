<template>
  <div class="second-step">
    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
      <FormItem label="手机号" prop="phone" :error="alreadyRegister">
          <Input :autofocus="true" v-model="formValidate.phone" clearable placeholder="请输入手机号">
            <div slot="prepend">中国大陆+86</div>
          </Input>
          <!-- <div class="error">
            <p v-show="alreadyRegister">该手机号已注册</p>
          </div> -->
      </FormItem>
      <FormItem label="验证码" prop="code" :error="codeError">
        <Row>
          <Col span="15"><Input v-model="formValidate.code" clearable :error="codeError" placeholder="请输入验证码"></Input></Col>
          <Col span="8" offset="1">
            <Button type="primary" :disabled="codeBtn" @click="intervalTime">
              {{oneMinute}}
              <span v-show="codeBtn">秒后重发</span>
            </Button>
          </Col>
        </Row>
        <!-- <div class="error">
          <p v-show="codeError">验证码错误</p>
        </div> -->
      </FormItem>
      <FormItem>
        <Button type="primary" @click="handleSubmit('formValidate')">下一步</Button>
      </FormItem>
    </Form>
  </div>
</template>
<script>
import { phone } from '@/utils/regExp'
import { resendCode, getSession } from '@/api/query'
import {mapActions} from 'vuex'
const TIMENUM = 60
export default {
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
      formValidate: {
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
      alreadyRegister: '',
      codeError: '',
      token: this.getToken(),
      codeParams: {},
      isCode: false
    }
  },
  watch: {
    'formValidate.phone'(val) {
      if (val.length === 3 || val.length === 8) {
        this.formValidate.phone = this.formValidate.phone + ' '
      }
    }
  },
  mounted() {
  },
  methods: {
    getSession() {
      getSession()
        .then(data => {
          if (data.code === 1) {
            delete data.data.sessionId
            let tokenData = Object.assign({}, this.token, data.data)
            tokenData.corpList = 0
            this.setToken(tokenData, 0.5)
            this.setStep(2)
          }
        })
    },
    resendCode() {
      this.codeParams = {
        userId: this.token.userId,
        identifyType: 'MOBILE',
        identifyCode: this.formValidate.phone.alltrim(),
        validateCode: null,
        validateCodeType: 1,
        validateCodeLength: 4,
        validateCodeBusiType: 'BINDMOBILE_CORP'
      }
      if (this.isCode) {
        this.codeParams.validateCode = this.formValidate.code
      }
      resendCode(this.codeParams).then(data => {
        if (this.isCode) {
          if (data.code === 1) {
            this.getSession()
          } else if (data.code === 2501) {
            this.codeError = '验证码错误'
          } else if (data.code === 2502) {
            this.alreadyRegister = '该手机号已注册'
          }
        }
      })
    },
    handleSubmit(name) {
      this.alreadyRegister = ''
      this.codeError = ''
      this.$refs[name].validate(valid => {
        this.isCode = true
        if (valid) {
          this.resendCode()
        } else {
        }
      })
    },
    intervalTime() {
      this.$refs.formValidate.validateField('phone', message => {
        if (!message) {
          this.isCode = false
          this.resendCode()
          this.oneMinute = TIMENUM
          this.codeBtn = true
          let timer = setInterval(() => {
            this.oneMinute--
            if (this.oneMinute <= 0) {
              this.codeBtn = false
              this.oneMinute = '获取验证码'
              clearInterval(timer)
            }
          }, 1000)
        }
      })
    },
    ...mapActions({
      setStep: 'user/setStep'
    })
  }
}
</script>

<style lang="stylus">
.second-step
  width 410px
  margin 146px auto 0
  .ivu-form .ivu-form-item-label
    height 40px
    line-height 1.3
  .ivu-input-group-prepend
    color #cdcdcd
  .ivu-form-item-content
    position relative
    .error
      position absolute
      top 36px
      color #ff3300
  .ivu-form-item-content
    line-height 40px
  .ivu-btn
    height 40px
    width 100%
  .ivu-form-item
    margin-bottom 34px
</style>
