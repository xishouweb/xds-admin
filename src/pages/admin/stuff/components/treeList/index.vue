<template>
  <div v-if="initTree && initTree.length">
    <template v-for="(item, index) in initTree">
     <treeNode
     :parent="item"
     :data="item"
     :index="index"
     :key="index"
     :noaction="noaction"
     :selectedId="selectedId"></treeNode>
    </template>
  </div>
</template>

<script>
import treeNode from './tree-node'

export default {
  name: 'treelist',
  props: {
    datas: {
      type: Array,
      default: () => { return [] }
    },
    expendDeep: {
      type: Number,
      default: 3
    },
    firstSelected: {
      type: Boolean,
      default: true
    },
    noaction: {
      type: Boolean,
      default: false
    },
    selectedId: {
      type: Number,
      default: -1
    },
  },
  provide () {
    return {
      treeRoot: this
    }
  },
  components: {
    treeNode
  },
  data() {
    return {
      initTree: [],
      initExpendDeep: this.expendDeep
    }
  },
  watch: {
    datas: {
      handler() {
        // 可能会做一些相关过滤
        this.expendDeepFn(this.datas)
        // this.datas[0] && (this.datas[0].selected = this.firstSelected)
        this.initTree = [] // 为了注销组件
        setTimeout(() => {
          this.initTree = this.datas
        }, 5)
      },
      immediate: true
    }
  },
  mounted() {
    // nodeActions 可以直接在父节点监听
    this.$on('nodeActions', (data) => {
      // console.log(data)
      // 可能会做一些相关过滤
      this.$emit('tree-action', data)
    })
    this.$on('selected', (data, prarm) => {
      // console.log(data)
      // 可能会做一些相关过滤
      this.$emit('tree-selected', data, prarm)
    })
    this.$on('hover-change', (data) => {
      // console.log(data)
      // 可能会做一些相关过滤
      this.$emit('node-hover', data)
    })
  },
  methods: {
    expendDeepFn(data) {
      let _data = data
      while (_data[0] && this.initExpendDeep-- >= 0) {
        _data[0].expend = true
        _data = _data[0].children
      }
    }
  }
}
</script>
