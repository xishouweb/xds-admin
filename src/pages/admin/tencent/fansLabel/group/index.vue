<template>
  <div class="group-common">
    <ul class="group-list-wrapper">
      <li class="group-item" @click="getCurrentGroup(item, index)" :class="{active: groupData.currentIndex === index}" v-for="(item, index) in groupData.allTagGroup" :key="index">
        <div class="group-name">{{item.name}}</div>
        <div class="group-count">({{item.fansWxTagCount || 0}})</div>
        <div class="customClick tagMove noClass1" v-show="item.name!=='微信标签'" ref="groupList" @click.stop="operation($event, item, index)">
          <Icon class="action-btn" size="24" type="android-more-vertical"></Icon>
        </div>
      </li>
    </ul>
    <BulletBox :position="position" :transfer="true" v-if="showBulletBox">
      <ul class="actionWrap">
        <li class="actionWrap-item" v-for="(_item, _index) in options" :key="_index" @click.stop="groupAction(_item.type)">
          {{_item.title}}
        </li>
      </ul>
    </BulletBox>
    <NewModal v-model="deleteModal" header="删除提示" content="确定要删除么？" @ok="del"></NewModal>
  </div>
</template>
<script>
import {mapState} from 'vuex'
import BulletBox from "@/components/BulletBox.vue"
export default {
  name: 'groupCommon',
  props: {
    groupData: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      options: [
        {
          title: '修改',
          type: 'modifyGroup'
        },
        {
          title: '删除',
          type: 'del'
        },
        {
          title: '上移',
          type: 'top'
        },
        {
          title: '下移',
          type: 'bottom'
        }
      ],
      eventCopy: null,
      moveIndex: -1,
      showBulletBox: false,
      position: { x: 0, y: 0 },
      deleteModal: false
    }
  },
  computed: {
    ...mapState({
      appAccountId: state => state.publicAccount.curPublic.appAccountId
    }),
    isWechatTagLength() {
      if (this.groupData.allTagGroup.some((item) => item.name === '微信标签')) {
        return 1
      } else {
        return 0
      }
    }
  },
  mounted() {
    this.$root.Bus.$on('againAdjust', () => {
      this.groupData.currentIndex = this.moveIndex
      this.groupData.currentTagGroup = this.groupData.allTagGroup[this.moveIndex]
      this.$nextTick(() => {
        let node = document.getElementsByClassName('noClass1')[this.tagsCurrentIndex]
        this.operation(node, this.groupData.currentTagGroup, this.groupData.currentIndex)
      })
    })
    document.addEventListener('click', (e) => {
      e.stopPropagation()
      this.showBulletBox = false
    })
  },
  methods: {
    // 上移下移修改分组操作
    async updateWxGroupSort(params) {
      const response = await this.post(this.fylPath.updateWxGroupSort, params)
      const { code, message } = response
      if (code === 1) {
        this.$root.Bus.$emit('refreshList', 'move')
      } else {
        this.$Message.error(message)
      }
    },
    // 删除标签分组
    async deleteWxTagGroup(params) {
      const response = await this.post(this.fylPath.deleteWxTagGroup, params)
      const { code, message } = response
      if (code === 1) {
        this.$Message.success('删除成功')
        this.$root.Bus.$emit('refreshList')
      } else {
        this.$Message.error(message)
      }
    },
    del() {
      let params = {
        appAccountId: this.appAccountId,
        id: this.groupData.currentTagGroup.id
      }
      this.deleteWxTagGroup(params)
    },
    groupAction(type) {
      this.showBulletBox = false
      if (type === "modifyGroup") {
        this.$emit('createAndModify', type, this.groupData.currentTagGroup)
        // 修改
      } else if (type === "del") {
        // 删除
        if (this.groupData.currentTagGroup.fansWxTagCount <= 0) {
          this.deleteModal = true
        } else {
          this.$Message.warning('请先删除标签分组内的标签')
        }
      } else if (type === "top") {
        // 上移
        this.zIndexUp(this.groupData.allTagGroup, this.groupData.currentIndex, this.isWechatTagLength)
      } else {
        // 下移
        this.zIndexDown(this.groupData.allTagGroup, this.groupData.currentIndex, this.groupData.allTagGroup.length)
      }
    },
    zIndexUp(arr, index, length) {
      if (index !== length) {
        this.swapArray(arr, index, index - 1)
      } else {
        this.$Message.error("此分组无法上移!")
      }
    },
    zIndexDown(arr, index, length) {
      if (index !== length - 1) {
        this.swapArray(arr, index, index + 1)
      } else {
        this.$Message.error("此分组无法下移!")
      }
    },
    swapArray(arr, index1, index2) {
      this.moveIndex = index2
      let params = {
        appAccountId: this.appAccountId,
        sourceId: arr[index1].id,
        targetId: arr[index2].id,
        sourceGroupOrder: arr[index1].groupOrder,
        targetGroupOrder: arr[index2].groupOrder,
      }
      this.updateWxGroupSort(params)
    },
    getCurrentGroup(item, index) {
      this.groupData.currentIndex = index
      this.groupData.currentTagGroup = item
      this.showBulletBox = false
    },
    operation(_event, item, index) {
      // 选中
      this.groupData.currentIndex = index
      this.groupData.currentTagGroup = item
      this.showBulletBox = true
      // 交互操作
      let clientRect = _event.target ? _event.target.getBoundingClientRect() : _event.getBoundingClientRect()
      let position = {
        x: Math.round(clientRect.left),
        y: Math.round(clientRect.top),
        w: Math.round(clientRect.width),
        h: Math.round(clientRect.height)
      }
      console.log(position)
      this.position = {
        x: position.x + position.w + 17,
        y: position.y - 9
      }
    }
  },
  components: {
    BulletBox
  },
  destroyed() {
    this.$root.Bus.$off('againAdjust')
  }
}
</script>
<style lang="stylus">
@import '~@/assets/stylus/mixin'
  .group-common
    .group-list-wrapper
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
            visibility visible
        &.active
          color #fff
          background-color #409eff
          .customClick
            visibility visible
        .group-name
          max-width 156px
          no-wrap()
        .customClick
          position absolute
          text-align center
          visibility hidden
          right 10px
          top 0
          height 40px
          .action-btn
            line-height 40px
            width 20px
</style>


