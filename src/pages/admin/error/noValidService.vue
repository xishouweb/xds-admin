<template>
  <!-- 无可用服务号 -->
  <div class="tips-wrapper" style="width: 100%; paddingTop: 20%" >
    <div class="noImg">
      <img src="@/assets/images/admin/noTencent.png" alt>
    </div>
    <!-- 当前企业暂无服务号，无法设置模板消息 -->
    <div class="tip" v-show="text[0]">{{text[0]}}</div>
    <div class="tip-2">{{text[1]}}</div>
    <Button type="primary" style="width: 200px" @click="goManage">公众号管理</Button>
  </div>
</template>

<script>
export default {
  data() {
    return {}
  },
  props: {
    text: {
      type: Array,
      default() {
        // '当前公众号为订阅号，暂不支持该功能'
        return ['', '当前企业暂无可用服务号，暂不支持该功能']
      }
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
