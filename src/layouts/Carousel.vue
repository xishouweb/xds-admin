<template>
  <div class="slide-show" @mouseover="clear" @mouseout="run">
    <div class="slide-img">
      <transition name="slide-trans">
        <img v-if="isShow" :src="slides[nowIndex].src">
      </transition>
      <transition name="slide-trans-old">
        <img v-if="!isShow" :src="slides[nowIndex].src">
      </transition>

    </div>
    <ul class="slide-pages">
      <li v-for="(item, index) in slides" :class="{on: index === nowIndex}" :key="index" @click="goto(index)">
        <!-- <a >{{ index + 1 }}</a> -->
      </li>
    </ul>
    <div @click="goto(prevIndex)" class="handle-inner pre">&lt;</div>
    <div @click="goto(nextIndex)" class="handle-inner next">&gt;</div>
  </div>
</template>

<script>
export default {
  props: {
    slides: {
      type: Array,
      default: () => []
    },
    inv: {
      type: Number,
      default: 1000
    }
  },
  data() {
    return {
      nowIndex: 0,
      isShow: true
    }
  },
  computed: {
    prevIndex() {
      if (this.nowIndex === 0) {
        return this.slides.length - 1
      } else {
        return this.nowIndex - 1
      }
    },
    nextIndex() {
      if (this.nowIndex === this.slides.length - 1) {
        return 0
      } else {
        return this.nowIndex + 1
      }
    }
  },
  methods: {
    goto(index) {
      this.isShow = false
      setTimeout(() => {
        this.isShow = true
        this.nowIndex = index
      }, 1)
    },
    run() {
      this.invId = setInterval(() => {
        this.goto(this.nextIndex)
      }, this.inv)
    },
    clear() {
      clearInterval(this.invId)
    }
  },
  mounted() {
    this.run()
  }
}
</script>

<style lang="stylus">
@import '~@/assets/stylus/mixin'
.slide-trans-enter-active
  transition all 1s
.slide-trans-enter
  opacity 0
.slide-trans-old-leave-active
  transition all 1s
  opacity 0
.slide-show
  position relative
  cursor pointer
  width 100%
  height 100%
  .slide-img
    width 100%
    img
      width 100%
      position absolute
      top 0
      left 0
  .slide-pages
    position absolute
    left 0
    bottom 15%
    z-index 99
    right 15px
    text-align center
    li
      extend-click()
      margin 0 3px 
      display inline-block
      width 40px
      height 3px
      padding 0 10px
      cursor pointer
      background-color rgb(99, 104, 116)
      &.on
        background-color #fff
  .handle-inner
    position absolute
    opacity 0
    top 50%
    margin-top -30px
    width 60px
    height 60px
    transition opacity 0.3s
    line-height 60px
    font-size 60px
    text-align center
    border-radius 50%
    color rgba(0, 122, 255, 0.8)
    &:hover
      color rgba(0, 122, 255, 1)
    &.pre
      left 20px
    &.next
      right 20px
  &:hover .handle-inner
    opacity 1
</style>