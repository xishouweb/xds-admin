<template>
  <div class="tag" :class="{'tag-checked':active}" @click="toggle">
    <slot></slot>
    <!-- <Icon type="close-circled" @click.stop="deleteTag(item.id)"></Icon> -->
  </div>
</template>

<script>
import _ from "lodash"
import findParent from "./find-parent"
// 自定义v-model和关联同级元素，先设置在取，，取出当前表示是否在父元素中
export default {
  name: "tag-item",
  mixins: [findParent],
  props: {
    name: null, // 表示这个标识                  // 对象
    value: null, // 关联active true，false  //  父元素的是数组对象
    single: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    active: {
      // 根基状态更改属性
      get() {
        // 根据是否有父元素，是否存在父元素中
        return this.parent
          ? this.parent.value.some(item => item.id === this.name.id)
          : this.value
      },
      set(val) {
        const { parent } = this
        if (parent) {
          // 存在父元素
          let parentValue = _.cloneDeep(this.parent.value)// 复制数组
          if (!this.single) { // 多选
            if (val) {
              // 设置值
              if (parent.max && parentValue.length >= parent.max) {
                return // 设置最大选中的
              }
              /* istanbul ignore else */
              if (!(parentValue.some(item => item.id === this.name.id)) && !parent.disabled) {
                parentValue.push(this.name)
                this.$emit('select', parentValue)
                // parent.$emit("input", parentValue)
              }
            } else {
              parentValue = parentValue.filter(item => item.id !== this.name.id)
              if (!parent.disabled) {
                this.$emit('select', parentValue)
                // parent.$emit("input", parentValue)
              }
            }
          } else { // 单选
            this.$emit('select', [this.name])
            // parent.$emit("input", [this.name])
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
    this.findParent("tag-list")
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
