<template>
  <div class="picCard-m">
    <div class="img_type">
      <div class="img_wrap" :style="{width: width+'px', height: height + 'px'}">
        <img class="img-background" :src="picture.cloudUrl | urlFilter" >
        <div class="cover" v-show="coverType" @click.stop="coverAction">
          <i class="icon cover-icon" >&#xe603;</i>
        </div>
      </div>
      <div class="img_span" v-if="size == 'small'">{{picture.title}}</div>
      <div class="img-span-large" v-if="size == 'large'">
        <div class="title">{{picture.title}}</div>
        <div class="time">{{picture.updateTime | filterDate}}</div>
      </div>
    </div>
  </div>
</template>
<script>
import UploadImg from '@/components/UploadImg.vue'
  export default {
    name: 'picCard-m',
    data() {
        return {}
    },
    components: { UploadImg },
    filters: {
      urlFilter(src) {
        if (src && src.includes('myqcloud.com')) {
          if (src.includes('https://') || src.includes('http://')) {
            return file.url
          } else {
            return 'https://' + src
          }
        }
      }
    },
    props: {
      size: {
        type: String,
        default: () => { return 'small' }
      },
      picture: {
        type: Object,
        default: () => { return {} }
      },
      width: {
        type: [Number,String],
        default: () => { return 209 }
      },
      height: {
        type: [Number,String],
        default: () => { return 129 }
      },
      coverType: {
        type: Boolean,
        default: () => { return false }
      }
    },
    computed: {
    },
    methods: {
      coverAction() {
        this.$emit("coverAction")
      }
    },
  }
</script>
<style lang="stylus">
@import '~@/assets/stylus/index.styl'
padding = 5px
radius = 3px
  .picCard-m
    padding 5px
    .img_type
      text-align center
      .img_wrap
        position relative
        width: 209px;
        height: 129px;
        line-height 129px
        border-radius: 3px;
        img
          max-width: 100%
          max-height: 100%
          vertical-align: middle;
        .cover
          display none
          position absolute
          width: 100%
          height: 100%
          top: 0
          left 0
          background-color: rgba(0,0,0, .3);
          text-align center
          .cover-icon
            font-size 24px
            color: #ffffff
        &:hover
          .cover
            display block

      .img_span
        padding 5px
        height 23px
        overflow hidden
        white-space nowrap
        text-overflow:ellipsis
      .img-span-large
        text-align left
        padding 5px
        margin-top 10px
        .title
          width: 207px;
          height: 18px;
          line-height: 20px;
          color: #303133;
          overflow hidden
          white-space nowrap
          text-overflow:ellipsis
        .time
          margin 10px 0
          height: 9px;
          font-size: 12px;
          color: #979899;
</style>
