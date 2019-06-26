<template>
  <div class="better-scroll" :style="style" ref="wrapper">
    <div>
      <slot></slot>
    </div>
  </div>
</template>

<script>
import BScroll from "better-scroll"
// height: placeholder ? initMaxHeight : 'unset' {maxHeight: initMaxHeight}
export default {
  name: "betterScroll",
  props: {
    /**
     * 1 滚动的时候会派发scroll事件，会截流。
     * 2 滚动的时候实时派发scroll事件，不会截流。
     * 3 除了实时派发scroll事件，在swipe的情况下仍然能实时派发scroll事件
     */
    probeType: {
      type: Number,
      default: 1
    },
    data: {
      // 列表的数据
      default: null
    },
    maxHeight: {
      // 设置最大高度， 当超过最大高度的时候出现滚动条
      default: "none",
      type: [Number, String]
    },
    listenScroll: {
      // 开启监听滚动事件
      default: false,
      type: Boolean
    },
    placeholder: { // 滚动区域实际占位高
      default: false,
      type: Boolean
    },
    // 距离底部多高触发事件
    distanceBottom: {
      default: 50,
      type: Number
    },
    // 距离顶部多高触发事件
    distanceTop: {
      default: 10,
      type: Number
    },
    offsetBottom: {
      default: 20,
      type: Number
    }
  },
  data() {
    return {
      preHeight: 0,
      preScrollY: 0,
      // maxHeight: 'none',
      Node: null,
      initMaxHeight: this.maxHeight,
      scroll: null, // betterScroll对象
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.init()
      this.autoMaxHeight()
    })
    this.$root.Bus.$on("manualRefresh", () => {
      this.autoMaxHeight()
    })
    window.addEventListener("resize", () => {
      this.autoMaxHeight()
    })
  },
  watch: {
    // 监听数据的变化，延时refreshDelay时间后调用refresh方法重新计算，保证滚动效果正常
    data: {
      handler(val) {
        this.$nextTick(() => {
          this.autoMaxHeight()
        })
      },
      deep: true,
      immediate: true
    }
  },
  computed: {
    style() {
      let h = this.initMaxHeight
      if (typeof h === 'number') {
        h += 'px'
      }
      if (this.placeholder) {
        return {height: h, maxHeight: h}
      }
      return {maxHeight: h}
    }
  },
  destroyed() {
    this.$root.Bus.$off("manualRefresh")
  },
  methods: {
    autoMaxHeight() {
      if (this.maxHeight === "none") {
        this.$nextTick(() => {
          let el = this.$el
          if (!el) {
            return
          }
          let offSetTop = el.getBoundingClientRect().top
          let screenH =
            document.body.clientHeight || document.documentElement.clientHeight
          this.initMaxHeight = screenH - offSetTop - this.offsetBottom + "px"

          this.$emit("maxHeight", screenH - offSetTop - this.offsetBottom)
          this.$nextTick(() => {
            this.refresh()
          })
        })
      }
    },
    init() {
      if (!this.$refs.wrapper) {
        return
      }
      this.scroll = new BScroll(this.$refs.wrapper, {
        click: true,
        mouseWheel: true,
        scrollbar: {
          fade: false,
          interactive: true // 1.8.0 新增
        },
        preventDefault: false,
        bounce: false,
        eventPassthrough: "horizontal",
        freeScroll: true,
        disableMouse: false,
        bindToWrapper: false,
        stopPropagation: true,
        autoBlur: true,
        pullDownRefresh: {
          threshold: 0,
          stop: 0
        }
      })
      if (this.listenScroll) {
        window.onresize = () => {
          let pos = {
            x: this.scroll.x,
            y: this.scroll.y
          }
          this.preScrollY = this.scroll.y
          this.calcEvent(pos)
        }
        this.scroll.on("scroll", pos => {
          this.calcEvent(pos)
        })
        this.scroll.on("scrollEnd", pos => {
          this.preScrollY = this.scroll.y
        })
      }
      // 绑定scrollStart事件用于处理滚动条与操作按钮位置的冲突，因为多个页面都有这个问题，所以默认绑定该事件
      this.scroll.on("scrollStart", () => {
        document.body.click()
      })
    },
    refresh() {
      this.scroll && this.scroll.refresh()
    },
    scrollTo() {
      this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments)
    },
    scrollToElement() {
      this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments)
    },
    // 滚动到上一个记录的位置
    setPrePosition() {
      let nowHeight = this.$slots.default[0].elm.clientHeight
      let scrollToHeight = this.preHeight - nowHeight
      this.scrollTo(0, scrollToHeight)
      this.preHeight = nowHeight
    },
    // 窗口缩放和滚动触发
    calcEvent(pos) {
      this.$emit("hideContextMenue")
      this.preHeight = this.$slots.default[0].elm.clientHeight
      this.$emit("scroll", pos)
      // 是否派发滚动到底部事件，用于向下滚动加载
      if (this.scroll.y <= this.scroll.maxScrollY + this.distanceBottom) {
        // 这个是距离顶部一定距离的区间
        this.$emit("scrollToBottom", true)
        // 区别于'scrollToBottom' 用来向下滚动请求数据 只有满足一定的区间并且滚动条是向下运动的做加载
        if (this.scroll.movingDirectionY === 1) {
          this.$emit("downLoadingData", true)
        }
      } else {
        this.$emit("scrollToBottom", false)
      }
      // 是否派发滚动到顶部事件，用于向上滚动加载
      if (this.scroll.y >= -this.distanceTop) {
        // 区别于'scrollToTop' 用来向上滚动请求数据 只有满足一定的区间并且滚动条是向上运动的做加载
        if (this.scroll.movingDirectionY === -1) {
          this.$emit("upLoadingData", true)
        }
      } else {
        this.$emit("scrollToTop", false)
      }
      // 自定义事件 目前用在滚动条在scroll.y===0的时候向上滚动的时候触发获取请求历史记录
      if (
        this.scroll.y === this.preScrollY &&
        this.scroll.movingDirectionY === -1 &&
        this.scroll.y === 0
      ) {
        this.$emit("fromZeroUpLoadingData")
      }
    }
  }
}
</script>

<style lang="stylus">
.better-scroll
  position relative
  width 100%
  height 100%
  overflow hidden
  .bscroll-vertical-scrollbar
    z-index 40 !important
  // .bscroll-vertical-scrollbar
  // z-index 500 !important
  .bscroll-indicator
    border none !important
    background-color rgba(0, 0, 0, 0.1) !important
</style>
