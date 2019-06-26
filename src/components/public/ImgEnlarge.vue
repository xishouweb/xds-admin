<template>
  <div id="imgEnlarge">
    <img :src="imgUrl" :width="width" :height="height" @click="showPop = true">
    <SelfModal v-model="showPop" zIndex="999999" v-if="showPop">
      <div class="img_class" :style="{width:largeW, height:largeH}">
        <span class="icon" @click='showPop = false'>&#xe703;</span>
        <img :src="imgUrl">
      </div>
    </SelfModal>
  </div>
</template>
<script>
  export default {
    name: '',
    data() {
        return {
          showPop: false
        }
    },
    props: {
      width: {
        type: String,
        default: '180px'
      },
      height: {
        type: String,
        default: '100px'
      },
      largeW: {
        type: String,
        default: '800px'
      },
      largeH: {
        type: String,
        default: '500px'
      },
      imgUrl: {
        type: String,
        default: ''
      }
    },
    created() {

    },
    components: {},
    methods: {

    }
  }
</script>
<style lang="stylus" scoped>
@import '~@/assets/stylus/index'
  #imgEnlarge
    >img
      cursor()
    .img_class
      relative()
      bgColor()
      text-align:center
      .icon
        absolute()
        top:0
        right:-30px
        fn(30px)
        line-height:30px
        color()
        cursor()
      img
        absolute()
        max-width:100%
        max-height:100%
        left: 50%
        top: 50%
        transform: translate(-50%, -50%)
</style>
