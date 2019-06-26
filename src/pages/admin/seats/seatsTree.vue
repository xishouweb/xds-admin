<template>
    <Treelist root noBorder
    :treeData="datas"
    :noOperation="true"
    tagName="total"
    noRootBorder
    @select="getCurTreeNode" :width="283">
    </Treelist>
</template>

<script>
import Treelist from '@/components/treelist/treelist.vue'
export default {
  name: 'seatsTree',
  components: { Treelist },
  data() {
    return {
      datas: [
        {
          title: '',
          order: 1,
          id: 0,
          expand: true
        }
      ]
    }
  },
  created() {
    this.getTreeData()
  },
  methods: {
    transforData(data) {
      let rules = {
          'key': 'id',
          'label': 'title',
          'value': 'value',
          'parentId': 'parentId',
          'extItem': 'extItem',
          'parentLabel': 'parentLabel',
          'total': 'total',
          'eeNum': 'number',
          'children': 'children',
          "expand": 'expand'
      }
      data = data.map(item =>
        this._transformData(item, rules, false, 'children')
      )
      return data
    },
    getTreeData() {
      this.getTree().then(res => {
        if (res.code === 1) {
          let rules = { parentLabel: 'label', _parentId: 'key', total: 'eeNum' }
          // let obj = res.data.map(item =>
          //   this._computedTreeTotal(item, rules, 'children', 'total')
          // )
          let obj = this._computedTreeTotal(res.data, rules, 'children', 'total')
          let finalRes = this.transforData(obj)
          this.$emit('getCurrentNode', finalRes[0])
          this.$set(this, 'datas', finalRes)
        } else {}
      })
    },
    getCurTreeNode(val, type) {
      if (type === 'addChild') {
        this.addTreeNode(val)
      } else if (type === 'modify') {
        this.modifyTreeNode(val)
      } else if (type === 'delete') {
        this.deleteTreeNode(val)
      } else if (type === 'moveup') {
        this.moveupTreeNode(val)
      } else if (type === 'movedown') {
        this.movedownTreeNode(val)
      } else {
        this.$emit('getCurrentNode', val)
      }
    },
    addTreeNode(val) {
      let childNode = {
        title: 'new',
        order: -1
      }
      let currentChildren = val.currentNode.children || []
      currentChildren.push(childNode)
      this.$set(val.currentNode, 'children', currentChildren)
    },
    modifyTreeNode(val) {},
    deleteTreeNode(val) {
      let currIndex = val.currentIndex
      val.parentNode.splice(currIndex, 1)
    },
    moveupTreeNode(val) {
      let currIndex = val.currentIndex
      if (currIndex === 0) {
        // 弹窗提示当前为第一个节点
      } else {
        let currOrder = val.currentNode.order
        let perOrder = val.parentNode[currIndex - 1].order
        this.$set(val.currentNode, 'order', perOrder)
        this.$set(val.parentNode[currIndex - 1], 'order', currOrder)
      }
    },
    movedownTreeNode(val) {
      let currIndex = val.currentIndex
      if (currIndex === val.parentNode.length - 1) {
        // 弹窗提示当前为最后一个节点^
      } else {
        let currOrder = val.currentNode.order
        let nextOrder = val.parentNode[currIndex + 1].order
        this.$set(val.currentNode, 'order', nextOrder)
        this.$set(val.parentNode[currIndex + 1], 'order', currOrder)
      }
    }
  }
}
</script>
