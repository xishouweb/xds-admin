
export default {
  data() {
    return {
      checkedAll: false,
      selection: [], // 选中的项目
      totalCheckItems: 0,
    }
  },
  computed: {

  },
  methods: {
    findChild(name, childNode) {
      let nodeList = []
      let children = childNode ? childNode.$children : this.$children
      children.forEach(child => {
        if (child.$options.name === name) {
          nodeList.push(child)
        } else {
          nodeList = nodeList.concat(this.findChild(name, child))
        }
      })
      return nodeList
    },
    findParent(name) {
      let parent = this.$parent
      while (parent) {
        if (parent.$options.name === name) {
          this.parent = parent
          break
        }
        parent = parent.$parent
      }
      return parent
    },
    // 监听全选事件
    onCheckedAll(fn) {
      this.$on('selectAll', (status, selection) => {
        this.selection = selection
        this.checkedAll = status
        fn && fn(status)
      })
    },
    // 全选及取消全选
    checkedAllOrNone() {
      // this.checkedAll = !this.checkedAll
      let parentNode = this.findParent("ykt-Table")
      parentNode.$emit("selectAll", this.checkedAll, [])
      this.emitCheckedItem(this.checkedAll, parentNode)
    },
    // 向相关组件派发 全选事件 ， 只能父组件使用
    emitCheckedAll(bool) {
      // 向 tablePagenation.vue 组件推送选择
      this.findChild("ykt-table-page").forEach(child => {
        child.$emit("selectAll", bool, this.selection)
      })
      // 向 tableCheckAll.vue 组件推送选择
      this.findChild("ykt-table-check-all").forEach(child => {
        child.$emit("selectAll", bool, this.selection)
      })
      // 向 tableHeader.vue 组件推送选择
      this.findChild("ykt-table-header").forEach(child => {
        child.$emit("selectAll", bool, this.selection)
      })
    },
    // tableCheckItem.vue 向其他组件派发
    checkItemEemitCheckedAll(bool, parentNode, selection) {
      // 向 tablePagenation.vue 组件推送选择
      this.findChild("ykt-table-page", parentNode).forEach(child => {
        child.$emit("selectAll", bool, selection)
      })
      // 向 tableCheckAll.vue 组件推送选择
      this.findChild("ykt-table-check-all", parentNode).forEach(child => {
        child.$emit("selectAll", bool, selection)
      })
      // 向 tableHeader.vue 组件推送选择
      this.findChild("ykt-table-header", parentNode).forEach(child => {
        child.$emit("selectAll", bool, selection)
      })
    },

    // 向 tableCheckItem.vue 组件推送选择
    emitCheckedItem(bool, parentNode) {
      this.findChild("ykt-table-check-item", parentNode).forEach(child => {
        child.$emit("selectAll", bool, this.selection)
      })
    },
    // 计算单选框个数
    computedCheckBoxNumber() {
      this.$on('check-item-mounted', (data) => {
        data ? this.totalCheckItems++ : this.totalCheckItems--
      })
    }
  }
}
