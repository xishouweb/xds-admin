<template>
  <p :class="{'active':active}" @click="toggle">
    <slot></slot>
  </p>
</template>

<script>
import findParent from "./find-parent"
// 自定义v-model和关联同级元素，先设置在取，，取出当前表示是否在父元素中
export default {
  name: "radio-item",
  mixins: [findParent],
  props: {
    name: null, // 表示这个标识
    value: null // 关联active true，false
  },
  computed: {
    active: {
      // 根基状态更改属性
      get() {
        // 根据是否有父元素，是否存在父元素中
        return this.parent
          ? this.parent.value === this.name
          : this.value
      },
      set(val) {
        const { parent } = this
        if (parent) {
          parent.$emit("input", this.name)
        } else {
          // model 中默认的value属性和input事件
          this.$emit("input", val)
        }
      }
    }
  },
  watch: {
    value(val) {
      this.$emit("change", val)
    }
  },
  created() {
    this.findParent("radio-list")
  },
  methods: {
    toggle: function() {
      this.active = !this.active
      if (!this.parent) {
        this.$emit('click', this.active)
      }
    }
  }
}
</script>
<style lang="stylus" scoped>
p
  display inline-block
  // margin 6px 12px 6px 0
  margin-right: 12px
  padding 0 16px
  line-height 32px
  font-size 14px
  border-radius 3px
  border solid 1px #e3e4e5
  background-color #ffffff
  color #606366
  transition: color 0.2s linear, background-color 0.2s linear, border 0.2s linear, box-shadow 0.2s linear, -webkit-box-shadow 0.2s linear;
  &:hover
    border-radius 3px
    border solid 1px #409fff
    color #409fff
  &.active
    border-radius 3px
    border solid 1px #409fff
    color #409fff
</style>
