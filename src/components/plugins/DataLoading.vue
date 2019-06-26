<template>
  <div class="data-loading">
    <Spin fix v-if="dataSatau === 1">
      <Icon type="load-c" size=40 class="spin-icon-load"></Icon>
      <div>{{remindText}}</div>
    </Spin>
    <div class="data-wrapper" :class="{'data-show': dataSatau === 2}">
      <slot></slot>
    </div>
    <div class="loading-error" v-if="dataSatau === 3">
      <slot name="error">
        <div class="tips">
          数据加载失败
        </div>
      </slot>
      <Button type="primary" size="small" @click="reload">重新加载</Button>
    </div>
  </div>
</template>
<script>
export default {
  name: 'dataLoading',
  props: {
    dataSatau: {
      type: Number,
      // 1加载中 2加载完成 3 加载失败
      default: 1
    },
    remindText: {
      type: String,
      default: 'loading...'
    }
  },
  methods: {
    reload() {
      this.$emit('reload')
    }
  }
}
</script>
<style lang="stylus">
.data-loading
  position relative
  width 100%
  height 100%
  >.ivu-spin-fix
    background-color: rgba(0 , 0, 0, 0)
  .data-wrapper
    opacity 0
    width 100%
    height 100%
    &.data-show
      transition opacity 1s
      opacity 1
  .loading-error
    text-align center
    position absolute
    left calc(50% - 42px)
    top calc(50% - 27px)
    .tips
      color #999999
      margin-bottom 10px
</style>
