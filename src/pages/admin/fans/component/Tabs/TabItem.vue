<template>
  <div class="tab" :class="{'tab_active': isActive}" @click="handleClick">
    <slot>
      <span v-html="label"></span>
    </slot>
  </div>
</template>
<script>
  export default {
    name: 'tab',
    props: {
      label: {
        type: [String, Number],
        required: true
      },
      value: {
        type: [String, Number],
        required: true
      }
    },
    mounted () {
      // 触发方法，加入到父组件状态中
      this.$parent.addTab(this)
    },
    destroyed () {
      // 移除状态
      this.$parent.removeTab(this)
    },
    computed: {
      isActive () {
        // 通过label判断当前状态
        return this.$parent.value === this.value
      }
    },
    methods: {
      handleClick (item) {
        // 改变父的当前值
        this.$parent.trigger(this.value)
      }
    }
  }
</script>
<style lang="stylus">
.tab {
  flex: 1;
  padding: 7px 0;
  color: #303641;
  font-size: 16px;
  text-align: center;
  cursor: pointer
}
.tab_active {
  color: #1c94f8;
  span {
    display: inline-block;
  }
}
</style>
