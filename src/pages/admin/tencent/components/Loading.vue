<template>
  <div class="loading-box">
    <Spin fix v-if="loading">
      <Icon type="load-c" size="40" class="spin-icon-load"></Icon>
      <div>loading</div>
    </Spin>
    <div v-else class="nodate">
      <slot>暂无数据</slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "lodaing",
  props: {
    loading: {
      type: Boolean,
      default: false,
    }
  },
  data() {
    return {
      timeout: 1.5 * 1000, // 秒

    }
  },
  created() {

  },
  methods: {

  }
}
</script>

<style lang="stylus" scoped>
.loading-box
  height 300px
  position relative
  .nodate
    text-align center
    line-height 300px
    font-size: 30px
    color: #bbbfc5
</style>


