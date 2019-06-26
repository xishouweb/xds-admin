<template>
  <!-- 当前公众号不可用 -->
  <div class="tips-wrapper" style="width: 100%; paddingTop: 20%" >
    <div class="noImg">
      <img src="@/assets/images/admin/noTencent.png" alt>
    </div>
    <div class="tip-2">当前公众号状态不可用，请前往公众号管理页面查看。</div>
    <Button type="primary" style="width: 200px" @click="goManage">公众号管理</Button>
  </div>
</template>

<script>
export default {
  data() {
    return {}
  },
  methods: {
    goManage() {
      this.$router.push({ name: 'tencentManage' })
    }
  }
}
</script>
<style lang="stylus" scoped>
    .tips-wrapper
      text-align center
      background #ffffff
      height 100%
      .tip
        margin-top 30px
        font-size 16px
      .tip-2
        font-size 14px
        margin 15px
        color: #606366
        span
          color #409eff
          cursor pointer
      .tip-3
        width 200px
        margin-top 20px
    .bottom-tip
      div
        margin-top 10px
      .explain
        margin-top 40px
</style>
