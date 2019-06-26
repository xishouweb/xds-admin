<template>
    <div class="audio-temp-audioType">
      <div class="audio-temp-audio_wrap">
        <div class="audio-temp-tabel-cell" v-show="isPlaying">
          <i class="audio-temp-icon icon" @click.stop="pause">&#xe714;</i>
          </div>
        <div class="audio-temp-tabel-cell" @click.stop="play" v-show="isPause">
          <i class="audio-temp-icon icon" @click.stop="play">&#xe61c;</i>
        </div>
        <div class="audio-temp-tabel-cell" v-show="isEnd">
          <i class="audio-temp-icon icon" @click.stop="isEnd">&#xe6f0;</i>
          </div>
        <div class="audio-temp-tabel-cell audio-temp-discription">
          <p class="audio-temp-audio-type-title">{{audio.title}}</p>
          <p class="audio-temp-audio-type-title">{{audio.timeLength | filterTimelength}}</p>
        </div>

        <div v-if="!hiddenTime" class="audio-temp-tabel-cell user_detail">
          <i>{{audio.updateTime}}</i>
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
    hiddenTime: {
      type: Boolean,
      default: () => false
    },
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
      this.isPlaying = true
      this.isPause = false
      this.isEnd = false
      this.audioDom.play()
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
<style lang="stylus">
  @import '~@/assets/stylus/index'
    .audio-temp-audioType
      cursor()
      relative()
      height 80px
      width: 100%
      padding 22px 30px
      audio
          display:none

      .audio-temp-audio_wrap
        display table-row
        &.audio-temp-active
          border:1px solid text_color
        .audio-temp-tabel-cell
          display table-cell
          vertical-align top
          .audio-temp-icon
            font-size 36px
            color #409eff
         .audio-temp-discription
            padding-left 10px
            width 390px
            height 16px!important
            overflow hidden
            white-space nowrap
            text-overflow:ellipsis

            .audio-temp-audio-type-title
              height 14px
              line-height 14px
              margin-bottom 5px

        .audio-temp-wrap
          margin:0 10px
          radius(50%)
          fn(36px)
          color(text_color)
          mr(10px)
          cursor()
        .audio-temp-user_detail
          width 200px
          text-align right
     .audio-temp-audio-type-title
        overflow hidden
        white-space nowrap
        text-overflow:ellipsis
</style>
