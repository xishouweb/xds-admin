<template>
  <Modal v-model="visible" :class="calcModalClass" width="600" @on-cancel="close">
    <div slot="header" class="modal-title">
      <span>设置标签</span>
    </div>
    <div class="modal-content">
      <div class="tags-container" v-if="params.type === 'single'">
        <div class="tabs">
          <div class="tabs-bar">
            <div
              class="tabs-bar-nav"
              :class="{active: curBar === 'all'}"
              @click="changeTab('all')"
            >全部标签</div>
            <div
              class="tabs-bar-nav"
              :class="{active: curBar === 'my'}"
              @click="changeTab('my')"
            >已有标签</div>
          </div>
          <div class="tabs-panels">
            <div class="tabs-panel" v-show="curBar === 'all'">
              <ScrollBar>
                <div class="tags-wrapper">
                  <TagsGroup
                    :data="formatFansTags"
                    :defaultValue="calcDefaultTag"
                    :maxNum="maxNum"
                    @on-check-error="checkError"
                    @on-check-change="changeTags"
                  ></TagsGroup>
                </div>
              </ScrollBar>
            </div>
            <div class="tabs-panel" v-show="curBar === 'my'">
              <ScrollBar>
                <div class="tags-wrapper">
                  <TagsGroup
                    v-if="defaultSelectedTags && defaultSelectedTags.length"
                    :data="defaultSelectedTags"
                    type="deleted"
                    @on-remove="removeDefaultTag"
                  ></TagsGroup>
                  <div v-else :style="{paddingTop: '60px', textAlign: 'center'}">暂无标签</div>
                </div>
              </ScrollBar>
            </div>
          </div>
        </div>
      </div>
      <div class="tags-container" v-if="params.type === 'mutiple'">
        <ScrollBar>
          <div class="tags-wrapper">
            <TagsGroup
              :data="formatFansTags"
              :defaultValue="defaultSelectedTags"
              :maxNum="maxNum"
              @on-check-error="checkError"
              @on-check-change="changeTags"
            ></TagsGroup>
          </div>
        </ScrollBar>
      </div>
    </div>
    <div slot="footer" class="modal-footer">
      <div class="modalFooter" v-if="curBar === 'all'">
        <div class="modal-footer-left">
          共选择
          <span class="selectedNum">{{selectedTags.length}}</span>标签
        </div>
        <div class="modal-footer-right">
          <Button type="primary" @click="tagSaveOk">确定</Button>
          <Button @click="close">取消</Button>
        </div>
      </div>
      <div class="modalFooter" v-if="curBar === 'my'">
        <div class="modal-footer-left"></div>
        <div class="modal-footer-right">
          <Button type="primary" @click="tagRemoveOk">确定</Button>
          <Button @click="close">取消</Button>
        </div>
      </div>
    </div>
    <Modal v-model="actionVisible" title="标签数量不足" class="actionGroup" width="300">
      <div class="actionWrapper">指定标签最多可选{{maxNum}}个。</div>
      <div slot="footer" class="modal-footer">
        <Button type="primary" @click="actionVisible = false">知道了</Button>
      </div>
    </Modal>
  </Modal>
</template>

<script>
import _ from "lodash"
import { mapGetters, mapActions } from "vuex"
import TagsGroup from "@/components/tagsGroup"
export default {
  name: "tags",
  props: {
    title: {
      type: String,
      default: "设置标签"
    },
    value: {
      type: Boolean,
      default: false
    },
    params: {
      // 传递已有标签
      type: Object,
      default() {
        return {
          selectedTag: [],
          type: "single" // single, mutiple
        }
      }
    },
    maxNum: {
      type: [String, Number],
      default: 20
    }
  },
  components: { TagsGroup },
  data() {
    return {
      visible: this.value,
      actionVisible: false,
      curBar: "all",
      selectedTags: [], // 保存倍选中的
      defaultSelectedTags: []
    }
  },
  computed: {
    ...mapGetters("fans", ["formatFansTags"]),
    calcModalClass() {
      if (this.params.type === "single") {
        return ["modalTags", "modalTagsSingle"]
      } else {
        return ["modalTags", "modalTagsMutiple"]
      }
    },
    calcDefaultTag() {
      const selectedTagId = (this.params.selectedTag || []).map(
        item => item.tagId
      )
      return selectedTagId
    }
  },
  watch: {
    value(val) {
      this.visible = val
    },
    visible(val) {
      if (!val) {
        // 关闭重置选中
        this.selectedTags = []
        this.defaultSelectedTags = []
      }
      this.$emit("input", val)
    },
    params: {
      handler(val) {
        if (val) {
          const defaultSelectedTags = (val.selectedTag || []).reduce(
            (init, next) => {
              const obj = _.find(init, item => {
                return item.id === next.groupId
              })
              if (obj) {
                obj.children = [
                  ...obj.children,
                  { ...next, id: next.tagId, name: next.tagName }
                ]
              } else {
                init = [
                  ...init,
                  {
                    id: next.groupId,
                    name: next.groupName || "--",
                    children: [{ ...next, id: next.tagId, name: next.tagName }]
                  }
                ]
              }
              return init
            },
            []
          )
          this.defaultSelectedTags = defaultSelectedTags
          // 设置默认选中的值
          this.selectedTags = (val.selectedTag || []).map(item => item.tagId)
        }
      }
    }
  },
  methods: {
    ...mapActions("fans", ["updateBatchSetFansUserTagSingle"]),
    changeTab(val) {
      this.curBar = val
    },
    checkError() {
      this.actionVisible = true
    },
    removeDefaultTag(val) {
      this.defaultSelectedTags = this.defaultSelectedTags.map(item => {
        if (item.children.some(_item => _item.id === val)) {
          item.children = item.children.filter(__item => __item.id !== val)
        }
        return item
      })
    },
    changeTags(val) {
      this.selectedTags = val
    },
    tagSaveOk() {
      // 设置标签
      const params = {}
      params.appAccountId = this.params.appAccountId
      params.ids = this.params.fans.map(item => item.fansId)
      params.tagIds = this.selectedTags
      // if (!params.tagIds.length) {
      //   this.$Message.error("请选择一个标签")
      //   return;
      // }
      this.updateBatchSetFansUserTagSingle(params).then(res => {
        this.visible = false
        if (res.code === 1) {
          this.$Message.success("标签修改成功")
          // 获取粉丝列表
          clearTimeout(this.timer)
          this.timer = setTimeout(() => {
            this.$root.Bus.$emit("resetSelect")
            this.$root.Bus.$emit("updateCurFans")
            this.$root.Bus.$emit("freshfans")
          }, 2000)
        } else {
          this.$Message.error(res.message)
        }
      })
    },
    tagRemoveOk() {
      const params = {}
      params.appAccountId = this.params.appAccountId
      params.ids = this.params.fans.map(item => item.fansId)
      params.tagIds = this.defaultSelectedTags.reduce((init, next) => {
        const ids = next.children.map(item => item.id)
        return [...init, ...ids]
      }, [])
      // if (!params.tagIds.length) {
      //   this.$Message.error("请选择一个标签");
      //   return;
      // }
      this.updateBatchSetFansUserTagSingle(params).then(res => {
        this.visible = false
        if (res.code === 1) {
          this.$Message.success("标签设置成功")
          // 获取粉丝列表
          clearTimeout(this.timer)
          this.timer = setTimeout(() => {
            this.$root.Bus.$emit("resetSelect")
            this.$root.Bus.$emit("updateCurFans")
            this.$root.Bus.$emit("freshfans")
          }, 2000)
        } else {
          this.$Message.error(res.message)
        }
      })
    },
    close() {
      this.visible = false
    }
  }
}
</script>

<style lang="stylus">
.modalTags
  // 模态
  position relative
  z-index 90
  .ivu-modal-wrap
    display flex
    align-items center
    justify-content center
    .ivu-modal
      top 0
      margin 0 !important // 处理对话框在IE上不居中问题
      .ivu-modal-header
        border-bottom none
      .ivu-modal-footer
        border-top 1px solid #e3e8ee
  &.modalTagsSingle
    .ivu-modal-body
      padding-top 10px
  $.modalTagsMutiple
    .ivu-modal
      .ivu-modal-header
        border-bottom 1px solid #e3e8ee
  // 业务
  .tags-container
    height 400px
    .tags-wrapper
      margin-right 15px
  // tabs
  .tabs
    .tabs-bar
      border-bottom solid 1px #efefef
      padding-bottom 16px
      &-nav
        display inline-block
        margin-right 28px
        &.active
          color #409fff
    .tabs-panel
      padding-top 20px
      height 360px
  // 底部交互
  .modalFooter
    display flex
    align-items center
    justify-content space-between
    .modal-footer-left
      color #979899
      .selectedNum
        color #409fff
// 交互model
.actionGroup
  // 模态
  position relative
  z-index 100
  .ivu-modal-mask
    display none
  .ivu-modal-wrap
    display flex
    align-items center
    justify-content center
    .ivu-modal
      box-shadow 0px 1px 6px 0px rgba(0, 0, 0, 0.2)
      border-radius 3px
      border solid 1px #cacbcc
      top 0
      .ivu-modal-header
        border-bottom none
</style>

