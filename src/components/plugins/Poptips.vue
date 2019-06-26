<template>
  <div class="poptip-wrapper-tips">
    <Poptip trigger="hover" :placement="placement" :width="width">
      <!-- <div class="help">?</div> -->
      <i class="icon">&#xe635;</i>
      <div class="api" slot="content">
        <div class="content">{{content}}</div>
      </div>
    </Poptip>
  </div>
</template>
<script>
export default {
  props: {
    width: {
      default: '200',
      type: String
    },
    placement: {
      default: 'right',
      type: String
    },
    content: {
      default: '',
      type: String
    }
  }
}
</script>
<style lang="stylus">
.poptip-wrapper-tips
  font-size 14px
  position relative
  display inline-block
  // .help
  //   display inline-block
  //   line-height 14px
  //   height 14px
  //   width 14px
  //   cursor pointer
  //   text-align center
  //   border-radius 50%
  //   color #ffffff
  //   background-color #cacbcc
  //   font-size 12px
  .api
    white-space: normal
    margin 0
    .content
      color #606366
      line-height 24px
</style>


