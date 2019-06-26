<template>
  <div class="fansRightPart">
    <div class="title right-padding">
      <div class="left">
        {{groupData.currentTagGroup.name}}
      <span v-show="groupData.allTagGroup.length > 0">({{groupData.currentTagGroup.fansWxTagCount || 0}})</span>
      </div>
      <div class="refresh" @click="$root.Bus.$emit('refreshList', 'refresh')">
        <span class="icon">&#xe62b;</span>
        <span class="refresh-text">刷新</span>
      </div>
    </div>
    <Operate v-if="groupData.allTagGroup.length > 0" class="operate right-padding" @transmitEvent="transmitEvent" :usablePublicNum="usablePublicNum" :groupData="groupData" :drawer="drawer" v-model="batchOperate"></Operate>
    <BScroll :data="groupData.allTagGroup" :offsetBottom="170" @maxHeight="maxHeight">
      <div class="right-padding">
        <div class="tags-wrapper">
          <!-- <SlickList :lockToContainerEdges="true" v-if="groupData.currentTagGroup.fansWxTagDtos" axis="x" lockAxis="x" v-model="items" class="tags-main" @input="getChangeLists">
            <SlickItem :class="{batchOperate: batchOperate,noBatchOperate: !batchOperate,active: tagsCurrentIndex === index&&!batchOperate,tagId:item.tagId===2}" class="tags-item" v-for="(item, index) in groupData.currentTagGroup.fansWxTagDtos" :index="index" :key="index">
              <div
                @click="getCurrentTag(item, index)"
              >
                <div class="tags-item-left" v-if="batchOperate">
                  <Checkbox v-model="item.flag" v-if="item.tagId!=2"><span style="margin-left:6px">{{item.tagName}} ({{item.count || 0}})</span></Checkbox>
                  <div v-else>{{item.tagName}} ({{item.count || 0}})</div>
                </div>
                <div class="tags-item-right" v-if="!batchOperate">
                  {{item.tagName}} ({{item.count || 0}})
                </div>
                <div v-show="!batchOperate&&item.tagId!=2" class="tagsCustomClick" ref="tags" @click.stop="operation($event, item, index)">
                  <Icon class="action-btn" size="24" type="android-more-vertical"></Icon>
                </div>
              </div>
            </SlickItem>
          </SlickList> -->
          <ul class="tags-main" v-if="groupData.currentTagGroup.fansWxTagDtos">
            <template v-for="(item, index) in groupData.currentTagGroup.fansWxTagDtos">
              <li
                class="tags-item"
                :key="index"
                @click="getCurrentTag(item, index)"
                :class="{batchOperate: batchOperate,noBatchOperate: !batchOperate,active: tagsCurrentIndex === index&&!batchOperate,tagId:item.tagId===2}"
              >
                <div class="tags-item-left" v-if="batchOperate">
                  <Checkbox v-model="item.flag" v-if="item.tagId!=2"><span style="margin-left:6px">{{item.tagName}} ({{item.count || 0}})</span></Checkbox>
                  <div v-else>{{item.tagName}} ({{item.count || 0}})</div>
                </div>
                <div class="tags-item-right" v-if="!batchOperate">
                  {{item.tagName}} ({{item.count || 0}})
                </div>
                <div v-show="!batchOperate&&item.tagId!=2" class="tagsCustomClick" ref="tags" @click.stop="operation($event, item, index)">
                  <Icon class="action-btn" size="24" type="android-more-vertical"></Icon>
                </div>
              </li>
            </template>
          </ul>
          <div class="noFansTag" v-else :style="{height: (noDataHeight - 51) + 'px'}">
            <div>
              <img src="@/assets/images/nofanstag.png" alt="nofanstag">
              <div class="tips" v-if="groupData.allTagGroup.length > 0">
                当前分组尚未添加标签
              </div>
              <div class="tips" v-else>当前尚未创建分组</div>
            </div>
          </div>
        </div>
      </div>
    </BScroll>
    <div class="tags-footer">
      <div class="tips">帮助提示</div>
      <div class="tips">1、标签分组最多支持50个，标签总数最多100个，标签名称不能重复，标签分组旁边的数字表示组内有多少个标签，标签旁边的数字表示有多少粉丝被设置了该标签。</div>
      <div class="tips">2、当某个标签下的粉丝超过10万时，不能直接删除标签，应先在粉丝身上取消该标签，直到粉丝数不超过10万，才能直接删除该标签。</div>
    </div>
    <BulletBox :position="position" v-if="showBulletBox">
      <ul class="actionWrap">
        <li class="actionWrap-item" v-for="(_item, _index) in options" :key="_index" @click.stop="tagsAction(_item.type)">
          {{_item.title}}
        </li>
      </ul>
    </BulletBox>
    <NewModal v-model="deleteModal" header="删除提示" content="确定要删除么？" @ok="del"></NewModal>
  </div>
</template>
<script>
import {mapState} from 'vuex'
// import { SlickList, SlickItem } from 'vue-slicksort'
import Operate from './operate'
import BulletBox from "@/components/BulletBox.vue"
export default {
  name: 'fansRightPart',
  props: {
    groupData: {
      type: Object,
      default: () => {}
    },
    drawer: {
      type: Object,
      default: () => {}
    },
    usablePublicNum: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      eventCopy: null,
      deleteModal: false,
      batchOperate: false,
      showBulletBox: false,
      tagsCurrentIndex: -1,
      noDataHeight: 0,
      willMoveIndex: -1,
      currentItem: {},
      ids: null,
      options: [
        {
          title: '修改',
          type: 'modifyTag'
        },
        {
          title: '删除',
          type: 'del'
        },
        {
          title: '左移',
          type: 'left'
        },
        {
          title: '右移',
          type: 'right'
        }
      ],
      position: { x: 0, y: 0 }
    }
  },
  watch: {
    'groupData.currentTagGroup'(newVal,oldVal) {
      if (newVal && oldVal && newVal.id && oldVal.id && (newVal.id !== oldVal.id)) {
        this.tagsCurrentIndex = -1
        this.groupData.currentTagGroup.fansWxTagDtos = this.groupData.currentTagGroup.fansWxTagDtos && this.groupData.currentTagGroup.fansWxTagDtos.map((item) => {
          return { ...item, flag: false }
        })
      }
    }
  },
  computed: {
    ...mapState({
      appAccountId: state => state.publicAccount.curPublic.appAccountId
    })
  },
  mounted() {
    this.$root.Bus.$on('againAdjustTags', () => {
      this.$nextTick(() => {
        this.tagsCurrentIndex = this.willMoveIndex
        let node = document.getElementsByClassName('tagsCustomClick')[this.tagsCurrentIndex]
        this.operation(node, this.groupData.currentTagGroup.fansWxTagDtos[this.tagsCurrentIndex], this.tagsCurrentIndex)
      })
    })
    document.addEventListener('click', (e) => {
      e.stopPropagation()
      this.showBulletBox = false
    })
  },
  methods: {
    // 删除标签分组
    async deleteWxTag(params) {
      const response = await this.post(this.fylPath.deleteWxTag, params)
      const { code, message } = response
      if (code === 1) {
        this.$Message.success('删除成功')
        this.$root.Bus.$emit('refreshList')
      } else {
        this.$Message.error(message)
      }
    },
    maxHeight(val) {
      console.log(val)
      this.noDataHeight = val
    },
    // 设置标签分组
    async updateWxTagGroup(params) {
      const response = await this.post(this.fylPath.updateWxTagGroup, params)
      const { code, message } = response
      if (code === 1) {
        this.$Message.success('设置标签分组成功')
        this.$root.Bus.$emit('refreshList')
      } else {
        this.$Message.error(message)
      }
    },
    // 左右移动修改标签位置操作
    async updateWxTagSort(params) {
      const response = await this.post(this.fylPath.updateWxTagSort, params)
      const { code, message } = response
      if (code === 1) {
        this.$root.Bus.$emit('refreshList', 'moveTags')
      } else {
        this.$Message.error(message)
      }
    },
    transmitEvent(type, val) {
      switch (type) {
        case 'selectAll':
          if (val && this.groupData.currentTagGroup.fansWxTagDtos) {
            this.groupData.currentTagGroup.fansWxTagDtos = this.groupData.currentTagGroup.fansWxTagDtos.map((item) => {
              if (item.tagId !== 2) {
                return { ...item, flag: true }
              } else {
                return item
              }
            })
          } else {
            this.groupData.currentTagGroup.fansWxTagDtos = this.groupData.currentTagGroup.fansWxTagDtos.map((item) => {
              return { ...item, flag: false }
            })
          }
          break
          case 'delTags':
            this.deleteModal = true
            break
          case 'groupOk':
            let tagGroupList = []
            let ids = this.filterArr(this.groupData.currentTagGroup.fansWxTagDtos)
            ids.forEach(item => {
              tagGroupList.push({
                id: item,
                sourceGroupId: this.groupData.currentTagGroup.id,
                targetGroupId: val,
              })
            })
            let params = {
              tagGroupList: tagGroupList,
              appAccountId: this.appAccountId,
            }
            this.updateWxTagGroup(params)
            break
        default:
          break
      }
    },
    del() {
      let ids
      if (this.batchOperate) {
        ids = this.filterArr(this.groupData.currentTagGroup.fansWxTagDtos)
      } else {
         ids = [this.ids]
      }
      let params = {
        appAccountId: this.appAccountId,
        ids: ids
      }
      this.deleteWxTag(params)
    },
    filterArr(arr) {
      let filterArr = []
      arr.forEach(item => {
        if (item.flag) {
          filterArr.push(item.id)
        }
      })
      return filterArr
    },
    tagsAction(type) {
      this.showBulletBox = false
      if (type === "modifyTag") {
        // 修改
        this.drawer.show = true
        this.drawer.title = '修改标签'
        this.drawer.type = type
        this.drawer.id = this.groupData.currentTagGroup.id
        this.drawer.name = this.currentItem.tagName
        this.drawer.editTagId = this.currentItem.id
      } else if (type === "del") {
        // 删除
        this.ids = this.currentItem.id
        this.deleteModal = true
      } else if (type === "left") {
        // 左移
        this.zIndexLeft(this.groupData.currentTagGroup.fansWxTagDtos, this.tagsCurrentIndex)
      } else {
        // 右移
        this.zIndexRight(this.groupData.currentTagGroup.fansWxTagDtos, this.tagsCurrentIndex, this.groupData.currentTagGroup.fansWxTagDtos.length)
      }
    },
    zIndexLeft(arr, index) {
      if (!(index === 0 || arr[index - 1].tagId === 2)) {
        this.swapArray(arr, index, index - 1)
      } else {
        this.$Message.error("此标签无法左移!")
      }
    },
    zIndexRight(arr, index, len) {
      if (index !== len - 1) {
        this.swapArray(arr, index, index + 1)
      } else {
        this.$Message.error("此标签无法右移!")
      }
    },
    swapArray(arr, index1, index2) {
      this.willMoveIndex = index2
      let params = {
        appAccountId: this.appAccountId,
        sourceId: arr[index1].id,
        targetId: arr[index2].id,
        sourceTagOrder: arr[index1].tagOrder,
        targetTagOrder: arr[index2].tagOrder
      }
      this.updateWxTagSort(params)
    },
    getCurrentTag(item, index) { // 测试表示标签没有选中状态，只有悬浮状态，因此注释，见bug 1913
      if (item.tagId === 2) {
        this.tagsCurrentIndex = -1
        return
      }
      this.tagsCurrentIndex = index
      this.currentItem = item
      this.showBulletBox = false
    },
    operation(_event, item, index) {
      // 选中
      this.tagsCurrentIndex = index
      this.currentItem = item
      this.showBulletBox = true
      // 交互操作
      let clientRect = _event.target ? _event.target.getBoundingClientRect() : _event.getBoundingClientRect()
      let position = {
        x: Math.round(clientRect.left),
        y: Math.round(clientRect.top),
        w: Math.round(clientRect.width),
        h: Math.round(clientRect.height)
      }
      this.position = {
        x: position.x + position.w + 5,
        y: position.y
      }
    },
    // 拖动前触发
    sortStart(event, node, index, collection) {
    },
    // 拖动结束时触发
    sortEnd(event, newIndex, oldIndex, collection) {
    },
  },
  components: {
    Operate,
    BulletBox,
    // SlickItem,
    // SlickList
  },
  destroyed() {
    this.$root.Bus.$off('againAdjustTags')
  }
}
</script>
<style lang="stylus">
@import '~@/assets/stylus/mixin'
.fansRightPart
  padding 20px
  padding-right 0
  display flex
  flex-direction column
  .right-padding
    padding-right 20px
  .title
    font-size 18px
    display flex
    color #0c0c0d
    justify-content space-between
    padding 12px 20px 20px 0
    flex-shrink 0
    line-border()
    .left
      font-weight bold
      span
        color #909499
    .refresh
      font-size 14px
      cursor pointer
      color #606366
  .operate
    flex-shrink 0
  .tags-wrapper
    flex 1
    padding-top 50px
    min-height: 500px
    .noFansTag
      display flex
      justify-content center
      align-items center
      .tips
        color #979899
        font-size 16px
        margin-top 20px
        text-align center
    .tags-main
      display flex
      flex-wrap wrap
      .tags-item
        position relative
        height 50px
        padding-left 30px
        padding-right 30px
        line-height 50px
        margin-right 30px
        margin-bottom 30px
        border-radius 25px
        cursor pointer
        border solid 1px #e3e4e5
        transition transform 0.1s
        &.batchOperate
          padding-left 17px
          padding-right 17px
        &.noBatchOperate
          &:hover
            transform scale(1.1)
            box-shadow: 0px 3px 12px 0px rgba(0, 0, 0, 0.25)
            .tagsCustomClick
              // display block
              visibility visible
        &.active
          transform scale(1.1)
          box-shadow: 0px 3px 12px 0px rgba(0, 0, 0, 0.25)
          .tagsCustomClick
            display block
            visibility visible
        &.tagId
          background-color #f2f4f5
          &:hover
            transform none
            box-shadow none
        .tags-item-left
          float left
        .tags-item-right
          float left
        .tagsCustomClick
          position absolute
          text-align center
          // display none
          visibility hidden
          right 5px
          top 0
          height 50px
          .action-btn
            line-height 50px
            width 20px
            color #409eff
  .tags-footer
    flex-shrink 0
    border-top solid 1px #e3e4e6
    padding-top 34px
    .tips
      line-height 28px
      color #606366
</style>
