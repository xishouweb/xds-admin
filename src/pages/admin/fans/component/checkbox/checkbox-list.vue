<template>
  <div class="checkbox-list">
    <slot></slot>
  </div>
</template>
<script>
export default {
  name: "checkbox-list",
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
.checkbox-list
  display inline-block
</style>
