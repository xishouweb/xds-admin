<template>
  <div class="tagGroup">
    <p class="tagHeader">
      {{title}}
      <span
        class="selectAll"
        v-if="showSelectAll"
        :class="{isAll: isEqual }"
        @click="selectAll(isEqual)"
      >{{isEqual ? '取消全选': '全选'}}</span>
    </p>
    <div class="tagList">
      <TagItem v-for="item in list" :key="item.id" :name="item" @select="onChangeTags">
        <span>{{item.tagName}}</span>
      </TagItem>
    </div>
  </div>
</template>

<script>
import _ from "lodash"
import TagItem from "./TagItem"
export default {
  name: "tag-list",
  components: { TagItem },
  props: {
    id: {
      type: [String, Number],
      default: ''
    },
    defaultValue: {
      type: Array,
      default() {
        return []
      }
    },
    list: {
      // 渲染的组标签列表
      // tags
      type: Array,
      default: () => {
        return []
      }
    },
    title: String, // 渲染的组
    showSelectAll: {
      // 是否要渲染
      type: Boolean,
      default: true
    },
    closable: {
      type: Boolean,
      default: false
    },
    single: {
      // 单选和多选
      type: Boolean,
      default: false
    }
  },
  data() {
    // value复制分组选中的值。。。每一个组选中的值
    return {
      value: this.defaultValue
    }
  },
  computed: {
    isEqual() {
      let flag = true
      for (var i = 0; i < this.list.length; i++) {
        if (!this.value.some(item => item.id === this.list[i].id)) {
          flag = false
          break
        }
      }
      return flag
    }
  },
  watch: { // 触发change事件,groupId
    value(val) {
      this.$emit('change', {id: this.id, value: val})
    },
  },
  methods: {
    onChangeTags(val) {
      this.value = val
    },
    selectAll(flag) {
      if (flag) {
        // true
        // 设置 false
        this.value = []
      } else {
        // 设置true
        let selectValue = _.cloneDeep(this.list) // 全部被选中的值
        this.value = selectValue
      }
    }
  }
}
</script>

<style lang="stylus">
</style>
