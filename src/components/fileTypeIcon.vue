<template>
    <span class="file-type-icon" :class="`${fileType}`" :style="style"></span>
</template>
<script>
export default {
  name: "file-type-icon",
  props: {
    type: {
      type: String,
      default: () => ''
    },
    size: {
      type: [Number],
      default: () => 44
    }
  },
  computed: {
    fileType() {
      return this.type
    },
    style() {
      return {
        width: this.size + "px",
        height: this.size * 44 / 37 + 'px'
      }
    }
  }
}
</script>

<style lang="stylus">
  .file-type-icon
    display inline-block
    width 37px
    height 44px
    background-size:100% 100%
    &.pdf
      background: url("/static/images/fileType/pdf.png") center center no-repeat
    &.ppt
      background: url("/static/images/fileType/ppt.png") center center no-repeat
    &.rar
      background: url("/static/images/fileType/rar.png") center center no-repeat
    &.zip
      background: url("/static/images/fileType/zip.png") center center no-repeat
    &.txt
      background: url("/static/images/fileType/txt.png") center center no-repeat
    &.doc
      background: url("/static/images/fileType/doc.png") center center no-repeat
    &.xls
      background: url("/static/images/fileType/xls.png") center center no-repeat
</style>
