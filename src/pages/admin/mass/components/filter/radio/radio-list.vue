<template>
  <div class="radio-list">
    <slot></slot>
  </div>
</template>
<script>
export default {
  name: "radio-list",
  props: {
    value: null,
    disabled: false
  },
  watch: {
    value(val) {
      // 添加额外的事件
      this.$emit("change", val)
    }
  }
}
</script>
<style lang="stylus" scoped>
.radio-list
  display inline-block
</style>
