<template>
  <div class="preSan">
    <div v-if="type == 'select'" class="prescan-box-wrap" @click.stop="select" :class="{'prescan-box-active': id === data.id}" >
      <div class="prescan-box-badge"><i class="icon">&#xe637;</i></div>
    </div>
    <div class="scan_wrap-mask" v-else>
      <div class="scan_wrap" v-if='size === "small"'>
        <Button style="width: 66px" type="primary" size="small" class="scan_button" @click.stop="action('link')">预览</Button>
      </div>

      <div class="scan_wrap large" v-if='size === "large"'>
        <Button type="primary"  class="scan_button_large" @click.stop="action('link')">预览</Button>
        <Button class="scan_button_large" @click.stop="action('add')">添加到组合器</Button>
      </div>

      <div class="scan_wrap move" v-if='size === "move"'>
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
  </div>
</template>
<script>
  export default {
    name: 'preSan',
    data() {
      return {
        id: ''
      }
    },
    props: ['type', "data", "position", 'selectedFlag', "size"],
    watch: {
      selectedFlag(nv) {
        this.id = nv
      }
    },
    mounted() {
    },
    methods: {
      action(type) {
        let item = {
          type,
          data: this.data
        }
        if (type === 'link') {
          window.open(this.data.url, "_blank")
        } else {
          this.$root.Bus.$emit('graphicPerScanAction', item)
        }
      },
      clickBtn() {
        (!this.type || (this.type === 'link')) && window.open(this.data.url, "_blank")
      },
      select() {
        this.$root.Bus.$emit("preScanSelectGraphic", this.data)
      }
    }
  }
</script>
<style lang="stylus" scoped>
@import '~@/assets/stylus/index'
  .preSan
    absolute()
    width 100%
    height 100%
    right:0
    left:0
    top:0
    bottom:0
    .scan_wrap-mask
      display none
      width 100%
      height 100%
      bgColor(rgba(0,0,0, 0.3))
    &:hover
      .scan_wrap-mask
        display block
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

  .prescan-box-box
    bgColor(rgba(0,0,0, 0))
  .prescan-box-wrap
      position relative
      height 100%
      width 100%
      boxSizing()
      .prescan-box-badge
        display none
        position absolute
        bottom 0
        right 0

    .prescan-box-active
      boxShadow(-1px 2px 5px 3px rgba(64, 159, 255, 0.54))
      border 1px solid #409fff
      .prescan-box-badge
        display block
        i
          color #409fff
</style>
