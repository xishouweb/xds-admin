<template>
  <div id="triangle" :style="{width: width + 'px', height:width + 'px', lineHeight: width + 'px'}">
    <div class="triangle" :style="style"></div>
    <i class="icon" :style="iStyle" v-html="content"></i>
  </div>
</template>
<script>
  export default {
    name: '',
    data() {
      return {
        style: {},
        iStyle: {}
      }
    },
    props: ["width", 'direction', 'content', 'bgColor'],
    created() {
      switch (this.direction) {
        case 'topLeft':
          this.style = {
            borderWidth: this.width + 'px' + ' ' + this.width + 'px' + ' 0 0',
            borderTopColor: this.bgColor + '',
            borderRightColor: 'transparent'
          }
          this.iStyle = {
            top: '-20%',
            left: '-20%'
          }
          break
        case 'topRight':
          this.style = {
            borderWidth: this.width + 'px' + ' 0 0 ' + this.width + 'px',
            borderTopColor: this.bgColor + '',
            borderLeftColor: 'transparent'
          }
          this.iStyle = {
            top: '-20%',
            right: '-20%'
          }
          break
        case 'bottomLeft':
          this.style = {
            borderWidth: '0 ' + this.width + 'px ' + this.width + 'px 0',
            borderBottomColor: this.bgColor + '',
            borderRightColor: 'transparent'
          }
          this.iStyle = {
            bottom: '-20%',
            left: '-20%'
          }
          break
        case 'bottomRight':
          this.style = {
            borderWidth: '0 0 ' + this.width + 'px ' + this.width + 'px',
            borderBottomColor: this.bgColor + '',
            borderLeftColor: 'transparent'
          }
          this.iStyle = {
            bottom: '-20%',
            right: '-20%'
          }
          break
        case 'top':
          this.style = {
            borderWidth: this.width + 'px ' + this.width + 'px' + ' 0 ' + this.width + 'px',
            borderTopColor: this.bgColor + '',
            borderRightColor: 'transparent',
            borderLeftColor: 'transparent'
          }
          this.iStyle = {
            top: '-10%'
          }
          break
        case 'right':
          this.style = {
            borderWidth: this.width + 'px ' + this.width + 'px ' + this.width + 'px 0',
            borderRightColor: this.bgColor + '',
            borderTopColor: 'transparent',
            borderBottomColor: 'transparent'
          }
          this.iStyle = {
            right: '-10%',
            top: '50%'
          }
          break
        case 'left':
          this.style = {
            borderWidth: this.width + 'px 0 ' + this.width + 'px ' + this.width + 'px',
            borderLeftColor: this.bgColor + '',
            borderTopColor: 'transparent',
            borderBottomColor: 'transparent'
          }
          this.iStyle = {
            left: '-10%',
            top: '50%'
          }
          break
        case 'bottom':
          this.style = {
            borderWidth: '0 ' + this.width + 'px ' + this.width + 'px ' + this.width + 'px',
            borderBottomColor: this.bgColor + '',
            borderRightColor: 'transparent',
            borderLeftColor: 'transparent'
          }
          this.iStyle = {
            bottom: '-10%'
          }
          break
        default:
          break
      }
    }
  }
</script>
<style lang="stylus" scoped>
@import '~@/assets/stylus/index'
  #triangle
    relative()
    .triangle
      width:0
      height:0
      border-style:solid
      absolute()
      top:0
      left:0
    i
      width:100%
      height:100%
      absolute()
      color()
      fn(12px)
</style>
