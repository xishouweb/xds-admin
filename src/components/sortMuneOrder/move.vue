<template>
  <div class="move-box" ref="parent">
    <slot></slot>
  </div>
</template>

<script>
export default {
  data() {
    return {
      mouseStatus: "up",
      children: [],
      initPosList: [], // 初始化位置
      currentItem: {},
      selectedItem: {},
      itemList: [],
      self: null,
    }
  },
  provide() {
    return {
     moveParent: this
    }
  },
  props: {
    // x 水平方向， y 垂直方向
    axis: {
      type: String,
      default: () => 'x'
    },
    value: {
      type: Array,
      default: () => []
    },
    canMove: {
      type: Boolean,
      default: () => true
    },
    selectedIndex: {
      // type: Number,
      default: () => 0
    },
  },
  watch: {
    value: {
      handler(nv) {
        this.init(nv)
      },
      immediate: true
    },
    selectedIndex: {
      handler(nv) {
        this.selectedItem = this.itemList[nv]
      },
      immediate: true
    }
  },
  mounted() {
    this.self = this.$refs.parent
    this.children = this.$children
  },
  methods: {
    init(nv) {
      this.itemList = (nv || []).map(item => {
        return {
          content: item
        }
      })
    },
    // beforeMove
    beforeMove(ev) {
      this.$emit('moveStart')
      // return false
    },
    // 重新排序
    reverse() {
      let newIndex = 0
      let newSelectedIndex = 0

      if (this.canMove) {
        let reorderList = this.itemList.sort((item1, item2) => {
          if (this.axis === 'x') {
            return item1.x - item2.x - item2.width / 2
          } else {
            return item1.y - item2.y - item2.height / 2
          }
        }).map((item, index) => {
          if (this.currentItem.content === item.content) newIndex = index
          if (this.selectedItem.content === item.content) newSelectedIndex = index
          return item.content
        })

        this.$emit('input', reorderList)
        this.$emit('moveEnd', newIndex, newSelectedIndex, reorderList)
      }
    },
    // mouse down
    getInitPosList() {
      let parent = this.self
      let parentPos = {
        left: parent.getBoundingClientRect().left,
        top: parent.getBoundingClientRect().top,
        width: parent.getBoundingClientRect().right - parent.getBoundingClientRect().left,
        height: parent.getBoundingClientRect().bottom - parent.getBoundingClientRect().top
      }
      parent.style.width = parentPos.width + 'px'
      parent.style.height = parentPos.height + 'px'

      let itemList = Array.prototype.slice.call(this.$children)
      this.initPosList = itemList.map((item, index) => {
        let child = item.$el
        let style = {
          left: child.getBoundingClientRect().left - parentPos.left,
          top: child.getBoundingClientRect().top - parentPos.top,
          width: child.getBoundingClientRect().right - child.getBoundingClientRect().left,
          height: child.getBoundingClientRect().bottom - child.getBoundingClientRect().top
        }
        this.itemList[index].x = style.left
        this.itemList[index].y = style.top
        this.itemList[index].width = style.width
        this.itemList[index].height = style.height
        // 重写样式
        child.style.left = style.left + 'px'
        child.style.top = style.top + 'px'

        return style
      })
    },
    // mouse up
    resetStyle() {
      // list
      this.self.style.width = "unset"
      this.self.style.height = "unset"
      // item
      this.initPosList.forEach((item, index) => {
        let child = this.$children[index].$el
        // 重写样式
        child.style.left = "unset"
        child.style.top = "unset"
      })
    }
  }
}
</script>

<style>
  .move-box {
    position: relative;
  }
  .move-box::after {
    display: block;
    content: '.';
    height: 0px;
    clear: both;
    visibility: hidden;
  }
  .move-box > .move-box-item {
      float: left;
      cursor: pointer;
      user-select: none;
  }
</style>
