<template>
  <div class="qr-code-info">
    <div class="img">
      <img :src="data.qrCodeUrl || defaultImg" alt="">
    </div>
    <div class="copy">
      <div class="text" style="color: #606366;">二维码参数地址</div>
      <Input id="qrCodeUrl" class="input" size="small" v-model="data.qrCodeUrl" readonly />
      <div>
        <Button class="btn" v-clipboard="data.qrCodeUrl" type="primary" @success="handleSuccess" @error="handleError">复制</Button>
        <span class="text">可复制二维码参数地址到二维码制作的网站进行生成、美化。</span>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "qrcode-copy",
  props: {
    data: {
      type: Object,
      default: () => { }
    }
  },
  data() {
    return {
      defaultImg: `${process.env.SELF_BASE_URL}/logo.png`
    }
  },
  mounted() {

  },
  methods: {
    copy() {

    },
    handleSuccess() {
        this.$Message.success('复制成功！')
    },
    handleError(e) {
    },
  }
}
</script>
<style lang="stylus" scope>
  .qr-code-info
    display flex
    .img
      flex-basis 92px
      width: 92px;
      height: 92px;
      margin-right 20px
      img
        width 100%
        height: 100%
    .copy
      flex-grow 1
      .input
        margin-bottom 10px
      .btn
        width: 50px;
        height: 30px;
        padding: 5px;
      .text
        width: 315px;
        height: 13px;
        font-size: 12px;
        color: #979899;
        margin-bottom 10px
        overflow hidden
        white-space nowrap
</style>
