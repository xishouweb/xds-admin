<template>
    <div class="video-temp-video-temp">
      <div class="video-temp-video_wrap">
        <div class="video-temp-tabel-cell" >
          <i class="video-temp-icon icon" @click="play()">&#xe627;</i>
          </div>

        <div class="video-temp-tabel-cell video-temp-discription">
          <p class="video-temp-discription-title">{{video.title}}</p>
          <p class="video-temp-discription-title">{{video.size | fileSizeFilter}}</p>
        </div>

        <div v-if="!hiddenTime" class="video-temp-tabel-cell user_detail">
          <i>{{video.updateTime}}</i>
        </div>
      </div>
    </div>
</template>
<script>
export default {
  name: "videoType",
  data() {
      return {
      }
  },
  props: {
    video: {
      type: Object,
      default: () => { return {} }
    },
    hiddenTime: {
      type: Boolean,
      default: () => false
    },
  },
  created() {
  },
  methods: {
    play() {
      // this.video
    }
  }
}
</script>
<style lang="stylus" scoped>
  @import '~@/assets/stylus/index'
    .video-temp-video-temp
      cursor()
      relative()
      height 80px
      width: 100%
      padding 22px 30px
      .video-temp-video_wrap
        display table-row
        &.video-temp-active
          border:1px solid text_color
        .video-temp-tabel-cell
          display table-cell
          vertical-align top
          .video-temp-icon
            font-size 36px
            color #ac8ce0
        .video-temp-discription
          width 390px
          padding 0 10px
          overflow hidden
          white-space nowrap
          text-overflow:ellipsis
          .video-temp-discription-title
            height 14px
            line-height 14px
            margin-bottom 5px

        .video-temp-wrap
          margin:0 10px
          radius(50%)
          fn(36px)
          color(#ac8ce0)
          mr(10px)
          cursor()
        .video-temp-user_detail
          width 200px
          text-align right
</style>
