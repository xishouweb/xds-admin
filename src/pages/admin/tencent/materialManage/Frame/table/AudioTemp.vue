<template>
    <div class="audioType">
      <div class="audio_wrap">
        <span class="tabel-cell wrap icon play" @click.stop="pause" v-show="isPlaying">&#xe714;</span>
        <span class="tabel-cell wrap icon pause" @click.stop="play" v-show="isPause">&#xe61c;</span>
        <span class="tabel-cell wrap icon end" @click.stop="play" v-show="isEnd">&#xe6f0;</span>

        <div class="tabel-cell discription" v-if="showInfo">
          <p><span>{{audio.title}} </span><br/> <span style="color: #979899;">{{audio.timeLength | filterTimelength}}</span></p>
        </div>
        <div class="tabel-cell only-title" v-else>
          <p>{{audio.title}}</p>
        </div>
      </div>
      <audio ref="audio" :src="audio.cloudUrl | urlFilter"></audio>
    </div>
</template>
<script>
export default {
  name: "audioType",
  data() {
      return {
        audioDom: null,
        isPlaying: false,
        isPause: false,
        isEnd: true
      }
  },
  props: {
    audio: {
      type: Object,
      default: () => { return {} }
    },
    showInfo: {
      type: Boolean,
      default: () => { return false }
    }
  },
  mounted() {
      let self = this
      this.audioDom = this.$refs.audio
      this.audioDom.addEventListener('ended', () => {
        self.isEnd = true
        self.isPlaying = false
        self.isPause = false
      })
  },
  methods: {
    endPlay() {
      this.isEnd = true
      this.isPause = false
      this.isPlaying = false
    },
    play() {
      if (this.audio.cloudUrl) {
      this.isPlaying = true
      this.isPause = false
      this.isEnd = false
      this.audioDom.play()
      } else {
        this.$Message.info("微信公众平台上传的语音不支持播放")
      }
    },
    pause() {
      this.isPause = true
      this.isPlaying = false
      this.isEnd = false
      this.audioDom.pause()
    }
  }
}
</script>
<style lang="stylus" scoped>
  @import '~@/assets/stylus/index'
    .audioType
      cursor()
      relative()
      display inline-block
      audio
          display:none

      .audio_wrap
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
            line-height 22px
        .only-title
          padding-left 10px
          line-height 22px
        .wrap
          margin:0 10px
          radius(50%)
          line-height 22px
          fn(24px)
          color(text_color)
          cursor()
        .user_detail
          width 200px
          text-align right
</style>
