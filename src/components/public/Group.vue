<template>
  <div class="public-group">
    <BScroll :data="groupData">
      <ul class="group-list-wrapper">
        <li
          class="group-item"
          @click.stop="getCurrentGroup(item, index)"
          :class="{active: currentGroup && currentGroup.id === item.id}"
          v-for="(item, index) in groupData"
          :key="index"
        >
          <div class="group-name">{{item.name}}</div>
          <div class="group-count" v-if="hasCount">({{item.count|| 0}})</div>
          <div
            v-show="isOperate && index >= noSelectNum"
            class="customClick"
            ref="groupList"
            @click.stop="operation($event, item, index)"
          >
            <Icon class="action-btn" size="24" type="android-more-vertical"></Icon>
          </div>
        </li>
      </ul>
    </BScroll>
    <BulletBox :position="position" v-if="showBulletBox">
      <ul class="actionWrap">
        <li
          class="actionWrap-item"
          v-for="(_item, _index) in options"
          :key="_index"
          @click.stop="groupAction(_item.type)"
        >{{_item.title}}</li>
      </ul>
    </BulletBox>
    <NewModal v-model="deleteModal" header="删除提示" content="确定要删除分组吗？" @ok="del"></NewModal>
  </div>
</template>
<script>
import BulletBox from "@/components/BulletBox.vue"
export default {
  name: "publicGroup",
  props: {
    // 当前选中的id
    currentId: {
      type: [Number, String],
      default: -1
    },
    // 新建的
    createdId: {
      type: [Number, String],
      default: -1
    },
    // 分组的数据
    groupData: {
      type: Array,
      default: () => {
        return []
      }
    },
    // 操作的选项
    options: {
      type: Array,
      default: () => {
        return [
          {
            title: "修改",
            type: "modify"
          },
          {
            title: "删除",
            type: "del"
          },
          {
            title: "上移",
            type: "top"
          },
          {
            title: "下移",
            type: "bottom"
          }
        ]
      }
    },
    // 是否可以进行操作
    isOperate: {
      type: Boolean,
      default: true
    },
    // 前几项不能选择
    noSelectNum: {
      default: 1,
      type: Number
    },
    deleteTip: {
      type: String,
      default: "当前分组下有粉丝不可删除"
    },
    hasCount: {
      type: Boolean,
      default: true
    }
  },
  watch: {
    currentId(id) {
      let index = this.groupData.findIndex(item => {
        return item.id === id
      })
      this.currentIndex = index
      this.currentGroup = this.groupData[index]
    },
    createdId(id) {
      this.getCurrentGroup(this.groupData[this.groupData.length - 1], this.noSelectNum)
      // let index = this.groupData.findIndex((item) => item.id === id)
      // let newCreate = this.groupData.splice(index, 1)
      // this.groupData.splice(this.noSelectNum, 0, newCreate[0])
      // // 模拟选中当前
      // this.getCurrentGroup(newCreate[0], this.noSelectNum)
    },
  },
  data() {
    return {
      currentIndex: 0,
      currentGroup: {
        id: -1
      },
      showBulletBox: false,
      position: { x: 0, y: 0 },
      deleteModal: false,
      eventCopy: null,
      moveIndex: null
    }
  },
  mounted() {
    document.body.addEventListener("click", () => {
      this.showBulletBox = false
    })
  },
  methods: {
    getCurrentGroup(item, index) {
      this.currentIndex = index
      this.currentGroup = item
      this.showBulletBox = false
      this.$emit("getTempsData", item)
    },
    operation(_event, item, index) {
      document.body.click() // 关闭气泡提示
      // 选中
      this.currentIndex = index
      this.currentGroup = item
      this.showBulletBox = true
      this.$emit("getTempsData", item)
      // 交互操作
      let clientRect = _event.target.getBoundingClientRect()
      let position = {
        x: Math.round(clientRect.left),
        y: Math.round(clientRect.top),
        w: Math.round(clientRect.width),
        h: Math.round(clientRect.height)
      }
      this.position = {
        x: position.x + position.w + 10,
        y: position.y - 7
      }
    },
    groupAction(type) {
      this.showBulletBox = false
      switch (type) {
        case "modify": // 修改
          this.$emit("transmitEvent", type, this.currentGroup)
          break
        case "del": // 删除
          if (this.currentGroup.count) {
            this.$Message.error(this.deleteTip)
            return
          }
          this.deleteModal = true
          break
        case "top": // 上移
          this.zIndexUp(
            type,
            this.groupData,
            this.currentIndex,
            this.noSelectNum
          )
          break
        case "bottom": // 下移
          this.zIndexDown(
            type,
            this.groupData,
            this.currentIndex,
            this.groupData.length
          )
          break
        case "left": // 左移
          this.zIndexUp(
            type,
            this.groupData,
            this.currentIndex,
            this.noSelectNum
          )
          break
        case "right": // 右移
          this.zIndexDown(
            type,
            this.groupData,
            this.currentIndex,
            this.groupData.length
          )
          break
        default:
          break
      }
    },
    // 移动分组的操作 传出数组以及两个将要移动的分组的索引值
    swapArray(type, arr, index1, index2) {
      this.moveIndex = index2
      // this.againAdjust()
      this.$emit("moveEvent", type, arr, index1, index2)
    },
    zIndexUp(type, arr, index, length) {
      if (index !== length) {
        this.swapArray(type, arr, index, index - 1)
      } else {
        this.$Message.error("此分组无法上移!")
      }
    },
    zIndexDown(type, arr, index, length) {
      if (index !== length - 1) {
        this.swapArray(type, arr, index, index + 1)
      } else {
        this.$Message.error("此分组无法下移!")
      }
    },
    del() {
      this.$emit("transmitEvent", "del", this.currentGroup)
    },
    // 重新调整 showBulletBox 的位置
    againAdjust() {
      this.currentIndex = this.moveIndex
      this.$nextTick(() => {
        document.getElementsByClassName('customClick')[this.currentIndex].onclick = event => {
          this.eventCopy = event
        }
        document.getElementsByClassName('customClick')[this.currentIndex].click()
        this.operation(
          this.eventCopy,
          this.groupData[this.currentIndex],
          this.currentIndex
        )
      })
    }
  },
  components: { BulletBox }
}
</script>
<style lang="stylus">
@import '~@/assets/stylus/mixin'
.public-group
  .group-list-wrapper
    padding 0 10px
    .group-item
      position relative
      display flex
      height 40px
      line-height 40px
      padding-left 20px
      cursor pointer
      &:hover
        background rgba(0, 0, 0, 0.2)
        .customClick
          display block
      &.active
        color #fff
        background-color #409eff
        .customClick
          display block
      .group-name
        max-width 156px
        no-wrap()
      .customClick
        position absolute
        text-align center
        display none
        right 10px
        top 0
        height 40px
        .action-btn
          line-height 40px
          width 20px
</style>


