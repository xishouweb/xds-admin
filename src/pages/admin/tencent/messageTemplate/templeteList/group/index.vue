<template>
  <div class="groupWrap">
    <BScroll :offsetBottom="20">
      <div :style="{paddingRight:'20px'}">
        <div class="groupAction">
          <button @click.stop="$root.Bus.$emit('add-group', groupList.length)">+新建分组</button>
        </div>
        <div class="groupList">
          <!-- <data-loading :data-satau="loading.staff" @reload="initData"> -->
          <ul>
            <li
              @click.stop="getCurrentGroup(item, index)"
              v-for="(item, index) in groupList"
              :key="item.id"
              :class="{active: index === currentIndex}"
            >
              <span class="txt">{{item.name}}</span>
              <span>（{{item.count || 0}}）</span>
              <div
                class="action"
                @click.stop="operation($event, item, index)"
                v-if="index !=0 && index !=1"
              >
                <Icon class="action-btn" type="android-more-vertical"></Icon>
              </div>
            </li>
          </ul>
          <!-- </data-loading> -->
        </div>
      </div>
    </BScroll>
    <BulletBox :position="position" v-if="showBulletBox">
      <ul class="actionWrap">
        <li
          class="actionWrap-item"
          v-for="(_item, _index) in Operations"
          :key="_index"
          @click.stop="groupAction(null, _item.type)"
        >{{_item.title}}</li>
      </ul>
    </BulletBox>
    <Modal title="删除提示" v-model="showModal" class-name="self-center-modal">
      <div>确认删除该分组吗</div>
      <div slot="footer">
        <Button type="primary" @click.stop="modalConfirm">确定</Button>
        <Button type="ghost" @click.stop="showModal = false">取消</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import { mapState } from "vuex"
import BulletBox from "@/components/BulletBox.vue"

export default {
  name: "tempGroup",
  components: { BulletBox },
  props: {
    Operations: {
      type: Array,
      default: () => {
        return [
          { title: "修改", type: "modify" },
          { title: "删除", type: "delete" },
          { title: "上移", type: "moveup" },
          { title: "下移", type: "movedown" }
        ]
      }
    }
  },
  data() {
    return {
      loading: {
        staff: 1
      },
      showModal: false,
      groupList: [],
      currentIndex: 0,
      currentGroup: {},
      showBulletBox: false,
      position: { x: 0, y: 0 }
    }
  },
  computed: {
    ...mapState("publicAccount", {
      appAccountId: state => state.curPublic.appAccountId,
      curPublic: state => state.curPublic
    })
  },
  watch: {
    curPublic() {
      this.initData()
    }
  },
  mounted() {
    document.addEventListener('click', e => {
      e.stopPropagation()
      this.showBulletBox = false
    })
    // 交互更新
    this.$root.Bus.$on("updateGroup", () => {
      this.initData()
    })
    this.initData()
  },
  methods: {
    async initData() {
      this.loading.staff = 1
      let params = {
        appAccountId: this.appAccountId,
        type: "template"
      }
      const response = await this.post(this.Path.queryTemplateCssGroup, params)
      let { code, data } = response
      if (code === 1) {
        // data 排序
        const first = data.filter(item => item.name === "未分组")
        let rest = data.filter(item => item.name !== "未分组")
        rest = rest.sort((a, b) => {
          return b.groupOrder - a.groupOrder
        })
        const totalCount = data.reduce((init, next) => {
          return init + next.count
        }, 0)
        this.groupList = [
          { groupId: "", name: "全部", count: totalCount },
          ...first,
          ...rest
        ]
        this.loading.staff = 2
        this.$emit("getGroupTotal", totalCount)
      } else {
        this.loading.staff = 3
      }
    },
    getCurrentGroup(item, index) {
      this.currentIndex = index
      this.currentGroup = item
      this.showBulletBox = false
      this.$root.Bus.$emit("updateTemplate", { groupId: item.groupId })
    },
    operation(_event, item, index) {
      // 选中
      this.currentIndex = index
      this.currentGroup = item
      this.showBulletBox = true
      this.$root.Bus.$emit("updateTemplate", { groupId: item.groupId })
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
    async groupAction(e, type) {
      this.showBulletBox = false
      if (type === "modify") {
        // 修改
        this.$root.Bus.$emit("modity-group", this.currentGroup)
      } else if (type === "delete") {
        // 删除
        this.showModal = true
      } else if (type === "moveup") {
        // 上移
        if (this.currentIndex === 2) {
          this.$Message.error("此分组无法上移!")
          return false
        }
        this.moveGroup("up")
      } else {
        // 下移
        if (this.currentIndex === this.groupList.length - 1) {
          this.$Message.error("此分组无法下移!")
          return false
        }
        this.moveGroup("down")
      }
    },
    async moveGroup(type) {
      let params = {
        appAccountId: this.appAccountId
      }
      if (type === "up") {
        params = {
          ...params,
          upCssGroupId: this.currentGroup.groupId,
          downCssGroupId: this.groupList[this.currentIndex - 1].groupId
        }
      } else {
        params = {
          ...params,
          upCssGroupId: this.groupList[this.currentIndex + 1].groupId,
          downCssGroupId: this.currentGroup.groupId
        }
      }
      const response = await this.post(this.Path.updateGroupOrder, params)
      if (response.code === 1) {
        this.$Message.success("移动成功")
        this.initData()
      } else {
        this.$Message.error("移动失败")
      }
    },
    async modalConfirm() {
      let params = {
        appAccountId: this.appAccountId,
        id: this.currentGroup.groupId
      }
      const response = await this.post(this.Path.deleteTemplateGroup, params)
      if (response.code === 1) {
        this.$Message.success("删除成功")
        this.currentIndex = 0
        this.$root.Bus.$emit("updateTemplate", { groupId: '' })
        this.initData()
      } else {
        this.$Message.error("删除失败")
      }
      this.showModal = false
    }
  },
  destroyed() {
    this.$root.Bus.$off("updateGroup")
  }
}
</script>

<style lang="stylus">
.groupWrap
  width 190px
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
    li
      position relative
      line-height 40px
      padding-left 20px
      cursor pointer
      display flex
      .txt
        white-space nowrap
        text-overflow ellipsis
        overflow hidden
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
