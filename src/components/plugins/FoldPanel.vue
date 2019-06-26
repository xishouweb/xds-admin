<template>
  <div class="fold-panel">
    <div class="fold-title" @click="packUpToogle">
      <slot name="title"></slot>
      <Icon type="ios-arrow-up" :class="{chevronAnimate: !foldStatu}" class="chevron"></Icon>
    </div>
    <div class="fold-container" ref="container" :class="{'fold-pick-up': !foldStatu, containerClass}">
      <slot name="container"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'foldPanel',
  props: {
    isFold: {
      type: Boolean,
      default: true
    },
    containerClass: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      foldStatu: this.isFold
    }
  },
  mounted() {},
  methods: {
    packUpToogle() {
      this.foldStatu = !this.foldStatu
      this.$nextTick(() => {
        this.$root.Bus.$emit('calcScrollHeight')
      })
    }
  }
}
</script>

<style lang="stylus">
.fold-panel
  .fold-title
    padding 21px 0
    position relative
    cursor pointer
    border-bottom solid 1px #e3e4e6
    .chevron
      color #409eff
      position absolute
      right 0
      top 21.5px
      transition all 0.2s
    .chevronAnimate
      transform rotateZ(-180deg)
  .fold-container
    position relative
    max-height 196px
    overflow hidden
    transition all 0.2s
    &.fold-pick-up
      max-height 0
</style>

