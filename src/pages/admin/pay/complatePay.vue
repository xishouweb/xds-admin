<template>
  <div class="complate-pay">
    <div class="complate-wrapper">
      <div class="complate-icon"><Icon type="checkmark-circled"></Icon></div>
      <div class="status1" v-show="complateStatus === 1">
        <p class="p">您已成功完成订购！</p>
        <div class="p2">支付金额：<span>¥ {{orderPayPrice}}</span></div>
        <div class="complate-btn">
          <Button class="look" type="ghost" @click="lookOrderDetail">查看订单</Button>
          <Button class="use" type="primary" @click="startUse">开始使用</Button>
        </div>
      </div>
      <div class="status2" v-show="complateStatus === 2">
        <p class="p">您已完成订购流程！</p>
        <div class="p2">我们将尽快审核您的付款信息，请耐心等待。</div>
        <div class="complate-btn">
          <Button class="back" type="ghost" @click="back" v-if="localStorageSaveOrRead('isCreatCompany') && this.complateStatus !== 1">返回</Button>
          <Button class="look" type="ghost" @click="lookOrderDetail">查看订单</Button>
        </div>
      </div>
      <div class="status3"  v-show="complateStatus === 3">
        <p class="p">您已完成订购流程！</p>
        <div class="p2">订单正在处理中，如需帮助可在线咨询或电话咨询</div>
        <div class="p2">咨询电话：400-1622-800</div>
        <div class="complate-btn complate-status3-btn">
          <Button class="back" type="ghost" @click="back" v-if="localStorageSaveOrRead('isCreatCompany') && this.complateStatus !== 1">返回</Button>
          <Button class="look" type="ghost" @click="lookOrderDetail">查看订单</Button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {localStorageSaveOrRead} from '@/utils/util'
import {saveloginCompany} from '@/api/query'
export default {
  name: 'complatePay',
  data() {
    return {
      orderPayPrice: localStorageSaveOrRead('orderPayPrice') || 0
    }
  },
  props: {
    complateStatus: {
      default: localStorageSaveOrRead('nextOrderStep') || 1,
      type: Number
    }
  },
  mounted() {
    // this.$root.Bus.$emit('refreshBScroll',this.complateStatus)
  },
  methods: {
    lookOrderDetail() {
      if (localStorageSaveOrRead('isCreatCompany') && this.complateStatus !== 1) {
        let params = {
          orderId: localStorageSaveOrRead('orderId'),
          corpId: localStorageSaveOrRead('corpId'),
          status: localStorageSaveOrRead('status')
        }
        this.$root.Bus.$emit('openDrawerDetail', params)
      } else {
        let currentCorp = {
          applyId: localStorageSaveOrRead('corpId'),
          corpName: localStorageSaveOrRead('corpName')
        }
        console.log(currentCorp)
        this.localStorageSaveOrRead('currentCorp', currentCorp)
        if (this.$route.name === 'records') {
          this.$root.Bus.$emit('hideFullPageDrawer', false)
          location.reload()
        } else if (this.$route.path.indexOf('main') >= 0) {
          this.saveloginCompany('records')
        } else {
          this.$root.Bus.$emit('regainCompanyInfo', 'records')
        }
      }
    },
    back() {
      this.$router.push({ name: 'company' })
    },
    // 进入公司信息
    saveloginCompany(name) {
      let obj = {
        corpId: this.localStorageSaveOrRead('currentCorp').applyId
      }
      saveloginCompany(obj).then(data => {
        if (data.code === 1) {
          this.$router.push({ name: name })
        } else {
          let params = {
            orderId: localStorageSaveOrRead('orderId'),
            corpId: localStorageSaveOrRead('corpId'),
            status: localStorageSaveOrRead('status')
          }
          this.$root.Bus.$emit('openDrawerDetail', params)
        }
      })
    },
    startUse() {
      let currentCorp = {
        applyId: localStorageSaveOrRead('corpId'),
        corpName: localStorageSaveOrRead('corpName')
      }
      this.localStorageSaveOrRead('currentCorp', currentCorp)
      this.$root.Bus.$emit('hideFullPageDrawer', false)
      if (this.$route.path.indexOf('main') >= 0) {
        this.saveloginCompany('survey')
      } else {
        if (this.$route.name === 'survey') {
          this.$root.Bus.$emit('regainCompanyInfo', false)
        } else {
          this.$root.Bus.$emit('regainCompanyInfo', 'survey')
        }
      }
    }
  }
}
</script>
<style lang="stylus">
.complate-pay
  margin-top 110px
  text-align center
  .complate-wrapper
    display inline-block
    .complate-icon
      font-size 42px
      color rgb(63, 184, 56)
    .status1, .status2, .status3
      margin-top 30px
      .p
        font-size 16px
        font-weight bold
      .p2
        margin-top 10px
        color #606366
      .img
        display inline-block
        margin-top 40px
        width 170px
        height 170px
        img
          width 100%
          height 100%
        p
          margin-top 15px
          color #606366
      .complate-btn
        margin-top 100px
        .ivu-btn
          width 100px
        .use
          margin-left 20px
        .back
          margin-right 20px
      .complate-status3-btn
        margin-top 40px
</style>


