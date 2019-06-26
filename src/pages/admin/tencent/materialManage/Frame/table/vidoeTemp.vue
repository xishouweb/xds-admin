<template>
    <div class="video-temp">
      <div class="video_wrap">
        <div class="tabel-cell wrap icon" @click="play()">&#xe627;</div>

        <div class="tabel-cell discription" v-if="showInfo">
          <p><span>{{video.title}} </span><br/> <span style="color: #979899;">{{video.size | fileSizeFilter}}</span></p>
          <!--  -->
        </div>
        <div class="tabel-cell only-title" v-else>
          <p>{{video.title}}</p>
        </div>
      </div>
      <maskModal v-model="showModal" width="unset" :transfer="true">
        <video controls="" autoplay="" name="media" style="max-height: 600px">
          <source :src="`https://${video.cloudUrl}`" type="video/mp4">
        </video>
      </maskModal>
    </div>
</template>
<script>
import maskModal from '@/components/MaskModal.vue'
export default {
  name: "videoType",
  components: {maskModal},
  data() {
      return {
        showModal: false
      }
  },
  props: {
    video: {
      type: Object,
      default: () => { return {} }
    },
    showInfo: {
      type: Boolean,
      default: () => { return false }
    }
  },
  methods: {
    play() {
      if (this.video.cloudUrl) {
        this.showModal = true
      } else {
        this.$Message.info("微信公众平台上传的视频不支持播放")
      }
    }
  }
}
</script>
<style lang="stylus" scoped>
  @import '~@/assets/stylus/index'
  .video-temp
    cursor()
    relative()
    .video_wrap
      display table-row
      &.active
        border:1px solid text_color
      .tabel-cell
        display table-cell
        vertical-align top
      .discription
        // width 390px
        padding 0 10px
        p
          margin-top -6px
          height 36px
          line-height 22px
      .only-title
        padding-left 10px
        line-height 36px
      .wrap
        margin:0 10px
        radius(50%)
        fn(36px)
        color(#ac8ce0)
        mr(10px)
        cursor()

      .user_detail
        width 200px
        text-align right
      .icon
        font-size 24px
        line-height 36px
</style>
