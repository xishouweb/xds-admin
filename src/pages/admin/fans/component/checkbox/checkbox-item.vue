<template>
  <p :class="{'active':active}" @click="toggle">
    <slot></slot>
  </p>
</template>

<script>
import findParent from "./find-parent"
// 自定义v-model和关联同级元素，先设置在取，，取出当前表示是否在父元素中
export default {
  name: "checkbox",
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
          ? this.parent.value.indexOf(this.name) !== -1
          : this.value
      },
      set(val) {
        const { parent } = this
        if (parent) {
          // 存在父元素
          const parentValue = this.parent.value.slice() // 复制数组
          if (val) {
            // 设置值
            if (parent.max && parentValue.length >= parent.max) {
              return // 设置最大选中的
            }
            /* istanbul ignore else */
            if (parentValue.indexOf(this.name) === -1 && !parent.disabled) {
              parentValue.push(this.name)
              parent.$emit("input", parentValue)
            }
          } else {
            // 没有值，删除指定的索引值
            const index = parentValue.indexOf(this.name)
            /* istanbul ignore else */
            if (index !== -1 && !parent.disabled) {
              parentValue.splice(index, 1)
              parent.$emit("input", parentValue) //
            }
          }
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
    this.findParent("checkbox-list")
  },
  methods: {
    toggle: function() {
      this.active = !this.active
      if (!this.parent) {
        this.$emit('click', this.active)
      } else {
        this.parent.$emit('click')
      }
    }
  }
}
</script>
<style lang="stylus" scoped>
p
  display inline-block
  margin-right 12px
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
