<template>
  <div id="realPay">
    <i v-if="status - 0 === 0 || (status - 0 === 2) || (status - 0 === 4)">应</i><i v-else>实</i>付款 &nbsp;&nbsp;&nbsp;&nbsp;<span>¥ <i>{{realPay - 0 > 0 ? realPay : 0}}</i></span>
  </div>
</template>
<script>
  export default {
    name: '',
    props: ['realPay', 'status']
  }
</script>
<style lang="stylus" scoped>
@import '~@/assets/stylus/index'
  #realPay
    span
      color(err_color)
      i
        fn(30px)
</style>
