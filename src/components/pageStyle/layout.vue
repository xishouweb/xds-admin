
<template>
  <div class="infoPage">
    <!-- 公众号切换组件 -->
    <div class="publicCut-box">
      <publicCut></publicCut>
    </div>
    <!-- 主体内容 -->
    <div class="content-box">
      <!-- 内容插槽 -->
      <slot></slot>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {

      }
    }
  }
</script>

<style lang="stylus">
.infoPage
  height 100%
  padding-top 28px
  padding-bottom 20px
  position: relative
  border-top: 1px solid transparent
  background-color #f2f4f5
  .publicCut-box
    position: absolute
    top: -14px
    left: 0
  .content-box
    height: 100%
    // margin-top: 30px
    padding: 8px 20px 0
    background-color: #fff
</style>
