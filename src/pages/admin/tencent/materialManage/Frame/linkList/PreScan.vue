<template>
  <div class="preSan">
    <div class="scan_wrap" v-if='type === "small"'>
      <Button type="primary" size="small" class="scan_button" @click.stop="action('link')">预览</Button>
    </div>
    <div class="scan_wrap large" v-if='type === "large"'>
      <Button type="primary"  class="scan_button_large" @click.stop="action('link')">预览</Button>
      <Button class="scan_button_large" @click.stop="action('add', $event)">添加到组合器</Button>
    </div>
    <div class="scan_wrap move" v-if='type === "move"'>
      <div v-if="position == 'first'">
        <i class="icon" @click.stop="action('down')">&#xe638;</i>
        <i class="icon space">&#xe703;</i>
        <i class="icon last" @click.stop="action('remove')">&#xe703;</i>
      </div>
      <div v-else-if="position == 'last'">
        <i class="icon" @click.stop="action('up')">&#xe639;</i>
        <i class="icon space">&#xe703;</i>
        <i class="icon last" @click.stop="action('remove')">&#xe703;</i>
      </div>
      <div v-else-if="position == 'one'">
        <i class="icon last" @click.stop="action('remove')">&#xe703;</i>
      </div>
      <div v-else>
        <i class="icon" @click.stop="action('up')">&#xe639;</i>
        <i class="icon" @click.stop="action('down')">&#xe638;</i>
        <i class="icon last" @click.stop="action('remove')">&#xe703;</i>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'preSan',
    data() {
      return {}
    },
    props: ['type', 'val', "data", "position", "isOutLink"],
    methods: {
      action(type, event) {
        let item = {
          type,
          data: this.data
        }
        if (type === 'link') {
          window.open(this.val, "_blank")
        } else {
          if (this.isOutLink) {
            this.$Message.error("外链图文不能添加到组合器！")
          } else {
            this.$root.Bus.$emit('graphicPerScanAction', item, event)
          }
        }
      }
    }
  }
</script>
<style lang="stylus" scoped>
@import '~@/assets/stylus/index'
  .preSan
    absolute()
    right:0
    left:0
    top:0
    bottom:0
    bgColor(rgba(0,0,0, 0.3))
    .scan_wrap
      absolute()
      left 50%
      top 50%
      fn(14px)
      transform: translate(-50%, -50%)
      .scan_button
        padding 0
        radius(3px)
        height 28px
        line-height 28px
        &:first-child
          mr(15px)
    .large
      width 100%
      text-align center
      .scan_button_large
        radius(3px)
        height 40px
        &:first-child
          mr(15px)
    .move
      i
      width 26px
      cursor pointer
      font-size: 26px;
      color: #f7f9fa;
      .last
        color #f56c6c
      .space
        opacity 0
</style>
