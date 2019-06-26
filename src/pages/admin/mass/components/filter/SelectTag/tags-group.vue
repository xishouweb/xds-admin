<template>
  <div class="tags-Group">
    <tags-node v-if="item.children && item.children.length" v-for="item in data" :key="item.id" :data="item"></tags-node>
  </div>
</template>

<script>
import TagsNode from "./tags-node"
// {11: {}, 12: {}}
export default {
  name: "tags-group",
  components: { TagsNode },
  props: {
    data: { // 数据
      type: Array,
      default: () => {
        return []
      }
    }
  }
}
</script>

<style lang="stylus">
</style>
