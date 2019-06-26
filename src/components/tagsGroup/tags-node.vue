<template>
  <div class="tags">
    <template v-if="type === 'undeleted'">
      <p class="tags-header">
        {{data.name}} <span v-if="data.mode === 'radio'">（单选）</span>
        <span
          class="tags-action"
          v-if="data.mode === 'checkbox'"
          :class="{'tags-action-checked': isEqual }"
          @click="handleCheckAll(isEqual)"
        >{{isEqual ? '取消全选': '全选'}}</span>
      </p>
      <div class="tags-content">
        <div
          class="tags-item"
          :class="{'tags-item-checked': calcIsChecked(item.id)}"
          @click="handleCheck(item.id)"
          v-for="item in data.children"
          :key="item.id"
        >
          <span>{{item.name}}</span>
        </div>
      </div>
    </template>
    <template v-else>
      <p class="tags-header">
        {{data.name}}
      </p>
      <div class="tags-content">
        <div
          class="tags-item tags-item-delete"
          v-for="item in data.children"
          :key="item.id"
        >
          <span>{{item.name}}</span>
          <i class="icon" @click="handleDelete(item.id)">&#xe674;</i>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import _ from "lodash"
import findParent from "./find-parent"
export default {
  name: "tags-node",
  mixins: [findParent],
  props: {
    data: {
      // 标签节点
      type: Object,
      default() {
        return {
          id: 1,
          name: "数字",
          mode: "checkbox", // 多选和单选
          children: [
            {
              id: "11",
              name: "11"
            },
            {
              id: "12",
              name: "12"
            }
          ]
        }
      }
    },
    type: {
      type: String,
      default: "undeleted" // 不可移除的 deleted,可移除的
    }
  },
  computed: {
    isEqual() {
      // 是否都在值中
      let check = true
      for (let i = 0; i < this.data.children.length; i++) {
        if (!_.includes(this.parent.selectedValue, this.data.children[i].id)) {
          check = false
          break
        }
      }
      return check
    }
  },
  created() {
    this.findParent("tags-group")
  },
  methods: {
    handleCheckAll(check) {
      let newSelectValue = []
      if (check) {
        // 取消全选
        newSelectValue = _.difference(
          this.parent.selectedValue,
          this.data.children.map(item => item.id)
        )
      } else {
        // 全选
        newSelectValue = _.union(
          this.parent.selectedValue,
          this.data.children.map(item => item.id)
        )
      }
      this.$emit("on-check", newSelectValue)
    },
    calcIsChecked(id) {
      return this.parent.selectedValue.includes(id)
    },
    handleCheck(id) {
      // 单选，多选, 反选
      let newSelectValue = []
      const isChecked = this.calcIsChecked(id)
      if (isChecked) {
        // 反选移除
        newSelectValue = this.parent.selectedValue.filter(item => item !== id)
      } else {
        // 反选添加
        if (this.data.mode === "checkbox") {
          newSelectValue = [...this.parent.selectedValue, id]
        } else if (this.data.mode === "radio") {
          const removeValue = _.difference(
            this.parent.selectedValue,
            this.data.children.map(item => item.id)
          )
          newSelectValue = [...removeValue, id]
        }
      }
      this.$emit("on-check", newSelectValue)
    },
    handleDelete(id) {
      // 移除列表数据
      this.parent.$emit("on-remove", id)
    }
  }
}
</script>

<style lang="stylus">
.tags
  margin-bottom 20px
.tags-header
  margin-bottom 16px
  span
    color #909499
  .tags-action
    float right
    font-size 12px
    cursor pointer
    &-checked
      color #409fff
.tags-content
  font-size 14px
  line-height 28px
  .tags-item
    position relative
    display inline-block
    margin-right 16px
    margin-bottom 18px
    box-sizing border-box
    background-color #ffffff
    border-radius 3px
    border solid 1px #dcdcdc
    padding 0 14px
    color #606366
    line-height 30px
    cursor pointer
    transition color 0.2s linear, background-color 0.2s linear, border 0.2s linear, box-shadow 0.2s linear, -webkit-box-shadow 0.2s linear
    &:hover
      border solid 1px #409eff
      color #409eff
    &-checked
      border solid 1px #409eff
      color #409eff
    &-delete
      border solid 1px #409eff
      color #409eff
      .icon
        font-size 12px
        cursor pointer
</style>
