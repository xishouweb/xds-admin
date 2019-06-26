<template>
<PageMain>
  <!-- 当前公众号不是订阅号，不支持服务 -->
  <div class="tips-wrapper" style="width: 100%; paddingTop: 20%" >
    <div class="noImg">
      <img src="@/assets/images/admin/noTencent.png" alt>
    </div>
    <div class="tip">{{title}}</div>
    <div class="tip-2">{{subTitle}}</div>
    <Button type="primary" style="width: 200px" @click="goManage">公众号管理</Button>
  </div>
</PageMain>
</template>

<script>
export default {
  components: {
    PageMain: () => import('@/components/pageStyle/pageMain.vue'),
  },
  props: {
    title: {
      type: String,
      default: "当前公众号为订阅号，无法设置渠道二维码"
    },
    subTitle: {
      type: String,
      default: "渠道二维码功能只支持服务号，您可前往“公众号管理”添加服务号在设置"
    }
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
