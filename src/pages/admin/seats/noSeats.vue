<template>
  <div class="no-seat">
    <div class="img">
      <img src="@/assets/images/admin/noTencent.png" alt="">
    </div>
    <div class="tips tips1">
      您尚未添加坐席
    </div>
    <div class="tips tips2">
      当前套餐版本最多可添加5个坐席，如需更多坐席请 <span @click="upgrade">升级</span>  
    </div>
    <div class="tips tips3">
      <Button class="btn" type="primary"  @click="addSeats">添加坐席</Button>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    addSeats() {
      this.$emit('addSeats')
    },
    upgrade() {
      this.$emit('upgrade')
    }
  }
}
</script>

<style lang="stylus">
  .no-seat
    text-align center
    padding-top 180px
    .tips
      margin-bottom 15px
      .btn
        width 200px
    .tips1
      margin-top 20px 
    .tips2
      color #606366
      span
        color #409eff
        cursor pointer
</style>


