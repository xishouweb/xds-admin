<template>
    <div id="bullet-box" ref="bulletbox" :style="{left: Position.x + 'px', top: Position.y + 'px', bottom: Position.b + 'px'}">
      <span class="icon left-tag" v-if="tagPosition === 'left'">&#xe687;</span>
      <span class="icon right-tag" v-if="tagPosition === 'right'" >&#xe622;</span>
      <slot></slot>
    </div>
</template>

<script>
  export default {
    name: "bulletbox",
    data() {
      return {
        initposition: this.position
      }
    },
    props: {
      position: {
        type: Object,
        default() { return {x: 0, y: 0} }
      },
      tagPosition: {
        type: String,
        default() { return 'left' }
      },
      transfer: {
        type: Boolean,
        default() { return false }
      }
    },
    computed: {
      Position() {
        return this.initposition
      }
    },
    watch: {
      position(val) {
        this.initposition = val
      },
    },
    mounted() {
      // 生成后， 判断该弹框底边是否超过桌面高度
      // 超过桌面高度则将bottom = 0px
      let bullet = this.$el
      if (this.transfer) {
        document.body.appendChild(bullet)
      }
      let windowHeight = this.getViewPort().height
      let positionBottom = bullet.getBoundingClientRect().bottom
      if (windowHeight < positionBottom) {
        this.$set(this.initposition, "b", 0)
        this.$set(this.initposition, "y", null)
        bullet.style.top = null
      }
    },
    methods: {
      getViewPort() {
          if (document.compatMode === "BackCompat") { // 浏览器嗅探，混杂模式
              return {
                  width: document.body.clientWidth,
                  height: document.body.clientHeight
              }
          } else {
              return {
                  width: document.documentElement.clientWidth,
                  height: document.documentElement.clientHeight
              }
          }
      }
    },
    beforeDestroy() {
      if (this.transfer) {
        document.body.removeChild(this.$el)
      }
    }
  }
</script>

<style lang="stylus">
@import '~@/assets/stylus/index.styl'
#bullet-box
  fixed()
  padding:10px 0
  color(#000)
  bgColor(#fff)
  z-index:999
  radius(5px)
  boxShadow(0 0 5px 2px #ddd)
  .left-tag, .right-tag
    position absolute
    color #ffffff
    top: 17px
    font-size 14px
  .left-tag
    left -10px
  .right-tag
    right -10px
</style>
