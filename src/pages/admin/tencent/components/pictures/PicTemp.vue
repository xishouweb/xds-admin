<template>
  <div class="img-temp-picCard">
    <div class="img-temp-img_type">
      <div class="img-temp-img_wrap img-background" :style="{width: width+'px'}">
        <img :src="picture.cloudUrl | urlFilter" >
      </div>
      <div class="img-temp-img_span">{{picture.title}}</div>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'picCard',
    data() {
        return {}
    },
    props: {
      picture: {
        type: Object,
        default: () => { return {} }
      },
      width: {
        type: [Number,String],
        default: () => { return 210 }
      },
    },
    computed: {
      // imgSrc () {
      //   return this.picture.url.replace(/http:\/\/mmbiz.qpic.cn/, '/wx_public')
      // }
    }
  }
</script>
<style lang="stylus">
  .img-temp-picCard
    padding 5px
    .img-temp-img_type
      text-align center
      .img-temp-img_wrap
        position relative
        width: 209px;
        height: 129px;
        line-height 129px
        border-radius: 3px;
        img
          max-width: 100%
          max-height: 100%
          vertical-align: middle;
      .img-temp-img_span
        margin-top 5px
        padding 0 5px
        // height 14px
        overflow hidden
        white-space nowrap
        text-overflow:ellipsis
        color: #303133;
</style>
