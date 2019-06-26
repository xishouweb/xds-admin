<template>
  <div class="tab-panel">
    <slot>
    </slot>
  </div>
</template>
<script>
  export default {
    name: 'tab-panel',
    props: {
      value: {
        type: [String, Number],
        required: true
      }
    },
    mounted () {
      this.$parent.addPanel(this)
    },
    destroyed () {
      this.$parent.removePanel(this)
    }
  }
</script>
<style lang="stylus">
  .tab-panel {
    width: 100%;
    flex: 1 0 auto;
  }
</style>
