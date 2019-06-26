<template>
  <div class="PayWay">
    <div class="pay-type">
      <RadioGroup v-model="payType">
        <Radio label="1">
          <span>扫码支付</span>
        </Radio>
        <Radio label="2">
          <span>
            银行汇款
          </span>
        </Radio>
      </RadioGroup>
    </div>
    <div v-if="payType=='1'" class="scanCode">
      <div class="payremind-text">
        扫一扫付款
      </div>
      <div class="erweicode">
        <qriously :value="value" :size="size"/>
      </div>
      <div class="paytype-img">
        <div class="pay-weixin pay-phone">
          <div class="left"><img src="@/assets/images/pay/weixin.png" alt=""></div>
          <div class="left">微信支付</div>
        </div>
        <div class="pay-zhifubao pay-phone">
          <div class="left"><img src="@/assets/images/pay/zhifubao.png" alt=""></div>
          <div class="left">支付宝</div>
        </div>
      </div>
    </div>
    <div v-else class="bank">
      <div class="tips1">您需汇款人民币 <span class="money">{{transferProps.orderPayprice}}</span> 元至以下账户</div>
      <div class="tips2">汇款成功后点击“付款完成，去上传凭证”，上传银行汇款凭证信息，审核通过后套餐生效并订购完成。</div>
      <div class="payee-info">
        <div class="payee-info-wrapper">
          <div class="payee-info-item">
            <span class="text1">收款方名称</span>
            <span class="text2">杭州星客互联科技有限公司</span>
          </div>
          <div class="payee-info-item">
            <span class="text1">收款方开户行</span>
            <span class="text2">中国工商银行杭州市金晖支行</span>
          </div>
          <div class="payee-info-item">
            <span class="text1">收款方账户</span>
            <span class="text2">1202 0526 0990 0046 277 </span>
          </div>
          <div class="payee-info-item">
            <span class="text1">汇款备注</span>
            <span class="text2">{{transferProps.orderId}}</span>
          </div>
        </div>
      </div>
      <div class="btn">
        <Button type="primary" class="toUpload" @click="UploadDocument">付款完成，去上传凭证</Button>
      </div>
      <modalUpload @success="success" :transferProps="transferProps" v-model="showUpload"></modalUpload>
    </div>
  </div>
</template>
<script>
import modalUpload from '@/pages/admin/pay/modalUpload'
import {isCanPayVoucher} from '@/api/query'
export default {
  name: 'payWay',
  props: {
    transferProps: {
      default: () => {},
      type: Object
    }
  },
  data() {
    return {
      payType: '1',
      showUpload: false,
      // 可以自定义，必填项。
      value: '',
      // 二维码大小 默认 100
      size: 179
    }
  },
  watch: {
    payType(val) {
      if (val === '1') {
        this.$emit('isStartInterval', true)
      } else {
        this.$emit('isStartInterval', false)
      }
    }
  },
  mounted() {
    this.formQrcodeParams({orderId: this.localStorageSaveOrRead('orderId')})
  },
  methods: {
    isCanPayVoucher() {
      isCanPayVoucher({
        orderId: this.localStorageSaveOrRead('orderId')
      }).then(data => {
        if (data.code === 1) {
          if (data.data) {
            this.showUpload = true
          } else {
            this.showUpload = false
            this.$Message.error(data.message)
          }
        } else {
          this.$Message.error(data.message)
        }
      })
    },
    UploadDocument() {
      this.isCanPayVoucher()
    },
    success(val) {
      this.$emit('success', val)
    },
    formQrcodeParams(params) {
      let url = this.qrcodeUrl
      Object.entries(params).forEach((item, index) => {
        if (index === 0) {
          url += '?' + item[0] + '=' + item[1]
        } else {
          url += '&' + item[0] + '=' + item[1]
        }
      })
      url += '&userId=' + this.getToken().userId
      this.value = encodeURI(url)
    }
  },
  components: {
    modalUpload
  }
}
</script>
<style lang="stylus">
</style>


