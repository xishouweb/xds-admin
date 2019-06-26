<template>
  <div class="upgrade-order">
    <div class="steps">
      <OperateSteps :current="currentSteps"></OperateSteps>
    </div>
    <div class="upgrade-order-wrapper order-wrapper-item" v-if="currentSteps==0">
      <orderPay @nextOrderStep="nextOrderStep" @submitOrder="submitOrder"></orderPay>
    </div>
    <div class="pay-for-order order-wrapper-item" v-if="currentSteps==1">
      <payment @restartOrder="restartOrder" @nextOrderStep="nextOrderStep"></payment>
    </div>
    <div class="pay-for-complate order-wrapper-item" v-if="currentSteps==2">
      <complatePay :complateStatus="complateStatus"></complatePay>
    </div>
  </div>
</template>

<script>
// 全局订单流程
import { mapGetters } from 'vuex'
import OperateSteps from '@/components/OperateSteps'
import orderPay from '@/pages/admin/pay/OrderPay'
import payment from '@/pages/admin/pay/payment'
import complatePay from '@/pages/admin/pay/complatePay'
export default {
  name: 'upgrdeOrder',
  data() {
    return {
      currentSteps: (this.localStorageSaveOrRead('saveStepsData') && this.localStorageSaveOrRead('saveStepsData').current) || 0,
      saveStepsData: {
        current: 0,
        name: this.$route.name
      },
      complateStatus: this.localStorageSaveOrRead('nextOrderStep') || 1
    }
  },
  computed: {
    ...mapGetters({
      routerInfo: 'nav/getRouterInfo'
    })
  },
  mounted() {
    this.$nextTick(() => {
      this.setCurrentCokie()
      this.$nextTick(() => {
        this.$root.Bus.$emit('calcScrollHeight')
      })
    })
  },
  methods: {
    setCurrentCokie() {
      this.saveStepsData.current = this.currentSteps
      this.localStorageSaveOrRead('saveStepsData', this.saveStepsData)
    },
    submitOrder(val) {
      this.currentSteps = val
      this.setCurrentCokie()
    },
    restartOrder() {
      this.currentSteps = 0
      this.setCurrentCokie()
    },
    nextOrderStep(val) {
      this.complateStatus = val
      this.localStorageSaveOrRead('nextOrderStep', val)
      this.currentSteps = 2
      this.setCurrentCokie()
    }
  },
  watch: {
    // $route(to, from) {
    //   this.saveStepsData.name = to.name
    //   this.setCurrentCokie()
    // },
    'routerInfo.name'(val) {
      this.saveStepsData.name = val
      this.setCurrentCokie()
    },
    currentSteps() {
      // 让滚动条重新计算
      this.$nextTick(() => {
        this.$root.Bus.$emit('calcScrollHeight')
      })
    }
  },
  components: {
    OperateSteps,
    orderPay,
    payment,
    complatePay
  }
}
</script>

<style lang="stylus">
.upgrade-order
  padding-top 1px
  padding-bottom 106px
  .steps
    margin 50px auto
  .upgrade-order-wrapper
    width 65.625%
    margin auto
  .pay-for-order
    width 65.625%
    margin auto
</style>


