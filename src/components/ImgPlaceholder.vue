<template>
<div>
  <slot name="content"></slot>

  <div class="ImgPlaceholder">
    <slot name="holder"><span> + </span></slot>
  </div>
</div>
</template>

<script>
export default {
}
</script>

<style lang="stylus" scoped>
.ImgPlaceholder
    width: 228px;
    height: 120px;
    line-height 120px
    text-align center
    border: dashed 1px #e3e4e5;
    background #fff
    span
      width: 48px;
      height: 48px;
      font-size 48px;
      color: #cacbcc;
      cursor pointer
</style>
