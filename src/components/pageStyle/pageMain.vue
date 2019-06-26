<template>
  <div class="page-main" ref="pageMain">
    <div class="page-main-inner-float">
      <slot></slot>
    </div>
    <div class="page-main-footer" v-if="$slots.footer" :style="Width">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "header-title",
  data() {
    return {
      screenH: document.body.clientHeight || document.documentElement.clientHeight,
      screenW: document.body.clientWidth || document.documentElement.clientWidth,
      offSetTop: 0,
      offSetLeft: 0,
      height: 'none'
    }
  },
  computed: {
    Height() {
      return (this.screenH - this.offSetTop) + 'px'
    },
    Width() {
      return {width: this.screenW - this.offSetLeft + 'px'}
    }
  },
  created() {
    this.whenBrothersMounted()
  },
  mounted() {
    window.addEventListener('resize', () => { this.screenH = document.body.clientHeight || document.documentElement.clientHeight })
    this.pageMainOffSet()
    this.$nextTick(() => {
      this.whenBrothersMounted()
    })
  },
  methods: {
    autoMaxHeight() {
      let el = this.$el
      if (!el) { return }
      let offSetTop = el.getBoundingClientRect().top
      let screenH = document.body.clientHeight || document.documentElement.clientHeight
      this.height = screenH - offSetTop + 'px'
    },
    pageMainOffSet() {
      this.offSetTop = this.$refs.pageMain.getBoundingClientRect().top
      this.offSetLeft = this.$refs.pageMain.getBoundingClientRect().left
    },
    whenBrothersMounted() {
      this.$parent.$children.forEach(item => {
        item.$on('hook:updated', () => {
          this.pageMainOffSet()
        })
      })
    },
  }
}
</script>

<style lang="stylus">
.page-main
  position relative
  padding-bottom 20px
  .page-main-inner
    display flex
  .page-main-inner-float
    > div
      float left
    &::after
      content:'.'
      display:block
      clear:both
      height 0
  .page-main-footer
    position: fixed
    border-top: solid 1px #edeff0;
    background-color: #fff;
    bottom: 0;
    width: 100%;
    height: 60px;
    line-height: 60px;
    text-align: center;
    .ivu-btn
      width 110px
</style>
