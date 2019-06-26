<template>
  <MaskModal v-model="param.show" width="1150">
    <div class="icon iframe-close" @click="param.show=false">&#xe674;</div>
    <iframe
    width="100%"
    height="750px"
    src="https://mh.cli.im/?isdialog=1&datanow=20141111&t=0.7860787808895111" frameborder="0"></iframe>
  </MaskModal>
</template>
<script>
export default {
  name: 'prettyQrCode',
  props: {
    param: {
      type: Object,
      default: () => {
        return {
          show: false
        }
      }
    }
  },
  components: {
    MaskModal: () => import('@/components/MaskModal.vue'),
  },
  data() {
    return {
    }
  },
  mounted() {
  },
  methods: {
  }
}
</script>
<style lang="stylus">
size = 40px
  .iframe-close
    width 25px
    height size
    background #efefef
    position absolute
    display flex
    justify-content center
    align-items center
    right 0
    top 0
    cursor pointer
</style>
