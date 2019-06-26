<template>
  <transition name="poptipCustom">
    <div class="poptip-wrapper" :style="{width, top}" v-show="showPoptip">
      <slot></slot>
    </div>
  </transition>
</template>
<script>
export default {
  name: 'poptipCustom',
  model: {
    prop: 'showPoptip',
    event: 'close'
  },
  props: {
    showPoptip: {
      default: false,
      type: Boolean
    },
    width: {
      default: '170px',
      type: String
    },
    top: {
      default: '50px',
      type: String
    }
  },
  mounted() {
    document.addEventListener('click', () => {
      this.$emit('close', false)
    }, false)
  },
  methods: {

  }
}
</script>
<style lang="stylus">
@import '~@/assets/stylus/mixin'
.poptip-wrapper
  hide-boxShadow()
  position absolute
  box-shadow 1px 2px 18px 0px rgba(0, 0, 0, 0.2)
  left 0
  top 50px
  line-height 1
  z-index 4
  text-align left
  background-color #fff
.poptipCustom-enter-active, .poptipCustom-leave-active
  transition all 0.2s linear
.poptipCustom-enter, .poptipCustom-leave-to
  opacity 0  
</style>


