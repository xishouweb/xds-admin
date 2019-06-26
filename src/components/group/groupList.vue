<template>
  <div class="label-list groupWrap">
    <div :style="{paddingRight:'20px'}">
      <div v-if="type === 'wx'" class="groupAction">
        <Button size="small" class="create-new"  @click="createGroup">+新建分组</Button>
      </div>
      <BScroll :data="groupList">
      <div class="groupList">
        <ul>
          <li
            @click.stop="getCurrentGroup(item, index)"
            v-for="(item, index) in groupList"
            :key="item.id"
            :class="{active: index === currentIndex}">
            <span class="label-name">{{item.name}}</span><span class="label-count"> ({{item.count}})</span>
            <div
              class="action"
              @click.stop="operation($event, item, index)"
              v-if="index >= ableActionIndex">
              <Icon class="action-btn" type="android-more-vertical"></Icon>
            </div>
          </li>
        </ul>
      </div>
      </BScroll>
    </div>
    <BulletBox :position="position" v-if="showBulletBox">
      <ul  class="actionWrap">
        <li
          class="actionWrap-item"
          v-for="(_item, _index) in Operations"
          :key="_index"
          @click.stop="groupAction(null, _item.type)"
        >{{_item.title}}</li>
      </ul>
    </BulletBox>
    <Modal title="删除提示" v-model="showModal" class-name="self-center-modal">
      <div>{{deleteRemind}}</div>
      <div slot="footer">
        <Button type="primary" @click.stop="modalConfirm">确定</Button>
        <Button type="ghost" @click.stop="showModal = false">取消</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import BulletBox from "@/components/BulletBox.vue"
import { mapGetters } from 'vuex'
export default {
  name: "groupList1",
  components: { BulletBox },
  data() {
    return {
      showModal: false,
      Operations: [
        { title: "修改", type: "modify" },
        { title: "删除", type: "delete" },
        { title: "上移", type: "moveup" },
        { title: "下移", type: "movedown" }
      ],
      groupList: this.labelList || [],
      currentIndex: 0,
      currentGroup: {},
      showBulletBox: false,
      position: { x: 0, y: 0 },
      newGroup: {name: ''},
      initDeleteRemind: this.deleteRemind || '确认删除该分组吗'
    }
  },
  props: {
    ableActionIndex: {
      type: Number,
      default() { return 2 }
    },
    labelList: {
      type: Array,
      default() { return [] }
    },
    type: {
      type: String,
      default() {
        // 微信素材: wx,  云服务空间: cloud
        return "wx"
      }
    },
    deleteFn: {
      type: Function,
      default() {
        return null
      }
    },
    deleteRemind: {
      type: String,
      default() { return '确认删除该分组吗' }
    }
  },
  computed: {
    ...mapGetters({
      currPublic: 'publicAccount/curPublic'
    })
  },
  watch: {
    labelList(nv) {
      this.groupList = nv
      // this.selectedNewGroup(nv)
    },
    deleteRemind(nv) {
      this.initDeleteRemind = nv
    }
  },
  mounted() {
    document.addEventListener('click', e => {
      e.stopPropagation()
      this.showBulletBox = false
    })
  },
  methods: {
    selectedNewGroup(nv) {
      let newLablist = this.deepCopy(nv)
      let index = newLablist.findIndex(item => item.name === this.newGroup.name)
      if (index >= this.ableActionIndex) {
        this.groupList = this.swapArray(newLablist, index, this.ableActionIndex)
        this.currentIndex = this.ableActionIndex
      } else {
        this.groupList = newLablist
      }
    },
    getCurrentGroup(item, index) {
      this.currentIndex = index
      this.currentGroup = item
      this.showBulletBox = false
      this.$emit("selectGroup", item)
    },
    operation(_event, item, index) {
      // 选中
      this.currentIndex = index
      this.currentGroup = item
      this.showBulletBox = true
      this.$emit("selectGroup", item)
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
        y: position.y - 15
      }
    },
    groupAction(e, type) {
      this.initNewGroup()
      if (type === "modify") {
        // 修改
        this.$emit('createNew', 'modify', this.currentGroup)
      } else if (type === "delete") {
        // 删除
        this.showModal = true
      } else if (type === "moveup") {
        // 上移
        this.zIndexUp(this.groupList, this.currentIndex, 3)
      } else {
        // 下移
        this.zIndexDown(this.groupList, this.currentIndex, this.groupList.length)
      }
    },
    async changeGroupOrder(upGroupId, downGroupId) {
        if (!this.currPublic) return
        let param = {
          appAccountId: this.currPublic.appAccountId,
          upCssGroupId: upGroupId,
          downCssGroupId: downGroupId
        }
        let res = await this.$post(this.Path.updateGroupOrder, param)
        return new Promise((resolve, reject) => {
          if (res.data.code === 1) {
            resolve('true')
          } else {
            reject(res.data)
          }
        })
      },
    async modalConfirm() {
      if (!this.currPublic) return
        if (this.deleteFn) {
          if (this.deleteFn(this.currentGroup)) {
            this.showModal = false
            this.groupList.splice(this.currentIndex, 1)
            this.showBulletBox = false
            this.$emit("deleteGroup")
          } else {
            this.$Message.error("删除失败！")
          }
        }
    },
    swapArray(arr, index1, index2) {
      arr[index1] = arr.splice(index2, 1, arr[index1])[0]
      return arr
    },
    async zIndexUp(arr, index, length) {
      if (index !== length - 1) {
        let data = await this.changeGroupOrder(arr[index].groupId, arr[index - 1].groupId)
        if (data === 'true') {
          this.$Message.success("移动分组成功!")
          this.swapArray(arr, index, index - 1)
        }
      } else {
        this.$Message.error("此分组无法上移!")
      }
    },
    async zIndexDown(arr, index, length) {
      if (index !== length - 1) {
        let data = await this.changeGroupOrder(arr[index + 1].groupId, arr[index].groupId)
        if (data === 'true') {
          this.swapArray(arr, index, index + 1)
        }
      } else {
        this.$Message.error("此分组无法下移!")
      }
    },
    initNewGroup() {
      this.newGroup = {name: ''}
    },
    createGroup() {
      this.initNewGroup()
      if (this.labelList.length > 50) {
        this.$Message.error("最多可新建50个分组")
      } else {
        this.$emit('createNew', 'create', this.newGroup)
      }
    }
  }
}
</script>

<style lang="stylus">
.label-list
  width 210px
  height 100%
  font-size 14px
  color #303133
  .groupAction
    margin-bottom 20px
    button
      height 40px
      width 100%
      background-color #ffffff
      border-radius 3px
      border solid 1px #e3e4e5
      cursor pointer
      &:hover
        border solid 1px #409eff
        color #409eff
      &:active
        border solid 1px #409eff
        color #409eff
  .groupList
    padding-right: 8px
    li
      display flex
      position relative
      line-height 40px
      padding-left 20px
      cursor pointer
      span
        display inline-block
      .label-name
        overflow hidden
        white-space nowrap
        text-overflow: ellipsis;
        max-width 80%
      .label-count
        width 20%
      &:hover
        background rgba(0, 0, 0, 0.2)
        .action
          visibility visible
      &.active
        background-color #409eff
        color #fff
      .action
        position absolute
        right 0
        top 0
        text-align center
        font-size 24px
        cursor pointer
        visibility hidden
        .action-btn
          width 26px
          height 40px
</style>
