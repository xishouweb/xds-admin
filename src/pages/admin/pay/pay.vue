<template>
  <div id="pay">
    <div class="pay-wrapper">
      <Payment></Payment>
    </div>
  </div>
</template>
<script>
import Payment from '@/pages/admin/pay/payment'
export default {
  name: 'pay',
  components: {
    Payment
  }
}
</script>
<style lang="stylus">
#pay
  padding-top 50px
  width 100%
  height 100%
  background-color #fff
  .pay-wrapper
    width 80%
    margin auto
</style>


