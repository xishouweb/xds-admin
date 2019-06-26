<template>
<div ref="drawerbox" class="drawer-main">
  <transition name="slide-fade" @after-enter="afterEnter">
    <div class="drawer" @click="clickBody" v-show="showDrawer">
      <div class="drawer-wrapper" :style="{width:width}" @click.stop>
        <div class="title">
          <span>{{titleTips}}</span>
        </div>
        <div v-if="isScroll && showDrawer" class="content isScroll-content">
          <BScroll :offsetBottom="59" :data="data">
            <div class="isScroll-wrapper">
              <slot name="content"></slot>
            </div>
          </BScroll>
        </div>
        <div v-if="!isScroll" class="content">
          <slot name="content"></slot>
        </div>
        <div class="footer" v-if="showFooter">
          <slot name="footer"></slot>
        </div>
      </div>
    </div>
  </transition>
</div>
</template>
<script>
export default {
  name: 'drawer',
  model: {
    prop: "showDrawer",
    event: "close"
  },
  props: {
    data: {},
    showDrawer: {
      default: false,
      type: Boolean
    },
    titleTips: {
      default: '筛选',
      type: String
    },
    isScroll: {
      type: Boolean,
      default: true
    },
    showFooter: {
      type: Boolean,
      default: true
    },
    isCloseHeghtLight: {
      type: Boolean,
      default: true
    },
    width: {
      default: '640px',
      type: String
    }
  },
  computed: {
    heightLight: {
      get: function () {
        return this.isCloseHeghtLight
      },
      set: function (newValue) {}
    }
  },
  mounted() {
    this.$nextTick(() => {
      // document.body.appendChild(this.$el)
    })
  },
  methods: {
    clickBody() {
      this.heightLight = true
      this.$root.Bus.$emit('drawerClose')
      this.$emit('close', false)
    },
    afterEnter() {
      this.$root.Bus.$emit('manualRefresh')
    }
  },
  watch: {
    showDrawer(val) {
      if (!val && this.heightLight) {
        this.$root.Bus.$emit('drawerClose')
      }
    }
  },
}
</script>
<style lang="stylus">
@import '~@/assets/stylus/mixin'
// .drawer-main
//   .data-loading
//     height: 100%
//     .data-wrapper.data-show
//       height: calc(100% - 200px)

.drawer-main
  .drawer
    position fixed
    top 0
    right 0
    bottom 0
    width 100%
    height 100%
    z-index 500
    background-color rgba(255,255,255,0)
    clear()
    .drawer-wrapper
      position relative
      float right
      height 100%
      background-color #fff
      box-shadow -5px 0px 8px 0px rgba(3, 0, 0, 0.15)
      .title
        font-size 18px
        padding 29px 20px 15px
        border-bottom solid 1px #edeff0
      >.content
        padding 0 20px 0 20px
        margin-bottom 60px
        height calc(100% - 123px)
        >div
          height 100%
          .tab-wrapper
            height 100%
            .ivu-tabs
              height 100%
              .ivu-tabs-content
                height calc(100% - 72px)
                .ivu-tabs-tabpane
                  height 100%
      .isScroll-content
        padding 0
        margin-right 5px
        .isScroll-wrapper
          padding 20px 15px 20px 20px
      .footer
        border-top solid 1px #edeff0
        position absolute
        background-color #fff
        left 0
        bottom 0
        width 100%
        height 60px
        line-height 60px
        text-align center
        >div
          height 100%
  .slide-fade-enter-active, .slide-fade-leave-active
    transition all 0.5s ease-in-out
  .slide-fade-enter, .slide-fade-leave-to
    transform translateX(100%)
</style>


