<template>
   <MaskModal v-model="param.show" propClass="pic-modal">
      <div slot="header" class="header">
        <span class="titleName">{{name}}</span>
        <span class="icon" id="cha" @click="close">&#xe674;</span>
      </div>
      <div class="content-modal">
        <BScroll maxHeight="753px">
        <div class="imgDiv">
          <img :src="param.imgUrl" v-if="param.imgUrl" alt="" style="width:100%; margin-top: 80px">
          <span class="noImg" v-else>暂无图片</span>
        </div>
        </BScroll>
      </div>
   </MaskModal>
</template>
<script>
export default {
  data() {
    return {
      showModal: false,
      name: null,
      ImageHeight: 752
    }
  },
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
  mounted() {
    this.name = this.$route.query.name
  },
  methods: {
    close() {
      this.param.show = false
    }
  }
}
</script>
<style lang="stylus">
  .pic-modal
    width 452px
    background:white
    .content-modal
      display flex
      justify-content center
      max-height 753px
      padding 0 20px
      margin-bottom 20px
      .imgDiv
        border 1px solid #f0f0f0
    .header
      padding 20px
      #cha
        float right
        font-size 14px
        color #d2d2d2
        cursor pointer
      .titleName
        font-size 18px
        color #303133
        width 45px
        height 320px
</style>
