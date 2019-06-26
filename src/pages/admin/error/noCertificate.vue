<template>
  <!-- 当前公众号未认证 -->
  <div class="tips-wrapper" style="width: 100%; paddingTop: 10%" >
    <div class="noImg">
      <img src="@/assets/images/admin/noTencent.png" alt>
    </div>
    <div class="tip-2">当前公众号未认证，您可前往微信公众号平台认证，或前往公众号管理查看。</div>
    <Button type="primary" style="width: 160px" @click="goManage">公众号管理</Button>
    <Button style="width: 160px; margin-left: 16px;" @click="toWx">微信公众平台</Button>
  </div>
</template>

<script>
export default {
  data() {
    return {}
  },
  methods: {
    toWx() { // 打开微信公众平台页面
      window.open('https://mp.weixin.qq.com/?token=&lang=zh_CN', '_blank')
    },
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
