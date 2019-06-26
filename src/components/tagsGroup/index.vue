<template>
  <div class="tags-Group">
    <tags-node v-if="item.children && item.children.length" @on-check="onChange" v-for="item in data" :key="item.id" :data="item" :type="type"></tags-node>
  </div>
</template>

<script>
import TagsNode from "./tags-node"
export default {
  name: "tags-group",
  components: { TagsNode },
  props: {
    data: { // 数据
      type: Array,
      default: () => {
        return []
      }
    },
    defaultValue: {
      type: Array,
      default: () => {
        return []
      }
    },
    type: {
      type: String,
      default: "undeleted" // 不可移除的 deleted,可移除的
    },
    maxNum: {
      type: [String, Number],
      default: 20
    }
  },
  data() {
    return {
      selectedValue: this.defaultValue
    }
  },
  watch: {
    defaultValue: {
      handler(val) {
        this.selectedValue = val
      },
      deep: true
    }
  },
  methods: {
    onChange(val) {
      if (val.length > this.maxNum) {
        this.$emit("on-check-error")
        return
      }
      this.selectedValue = val
      this.$emit("on-check-change", val)
    },
    getCheckedNodes() {
      return this.selectedValue
    }
  }
}
</script>

<style lang="stylus">
</style>

