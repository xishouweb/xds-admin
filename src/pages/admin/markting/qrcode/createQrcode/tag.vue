<template>
  <Modal v-model="visible" :class="calcModalClass" width="600" @on-cancel="close">
    <div slot="header" class="modal-title">
      <span>{{title}}</span>
    </div>
    <div class="modal-content">
      <div class="tags-container">
        <ScrollBar>
          <div class="tags-wrapper">
            <TagsGroup
              :data="formatFansTagsId"
              :maxNum="maxNum"
              :defaultValue="selectedTags"
              @on-check-error="checkError"
              @on-check-change="changeTags"
            ></TagsGroup>
          </div>
        </ScrollBar>
      </div>
    </div>
    <div slot="footer" class="modal-footer">
      <div class="modalFooter">
        <div class="modal-footer-left">
          <Button @click="clearSelected">清空选择</Button>
        </div>
        <div class="modal-footer-right">
          <span>已选择
            <span class="selectedNum">{{selectedTags.length}}/{{maxNum}}</span>
          </span>
          <Button type="primary" @click="tagSaveOk">确定</Button>
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
import { mapGetters } from "vuex"
import TagsGroup from "@/components/tagsGroup"
export default {
  name: "market-tags",
  props: {
    title: {
      type: String,
      default: "指定标签(最多可选20个标签)"
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
          selectedTag: []
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
      selectedTags: [] // 保存倍选中的
    }
  },
  computed: {
    ...mapGetters("fans", ["formatFansTagsId"]),
    calcModalClass() {
      return ["modalTags", "modalTagsMutiple"]
    }
  },
  watch: {
    value(val) {
      this.visible = val
    },
    visible(val) {
      this.$emit("input", val)
    },
    params: {
      handler(val) {
        if (val) {
          // 设置默认选中的值
          this.selectedTags = val.selectedTag || []
        }
      }
    }
  },
  methods: {
    checkError() {
      this.actionVisible = true
    },
    changeTags(val) {
      this.selectedTags = val
    },
    clearSelected() {
      this.selectedTags = []
      this.$emit('on-success', this.selectedTags)
    },
    tagSaveOk() {
      // 设置标签
      const params = {}
      params.tagIds = this.selectedTags
      if (!params.tagIds.length) {
        this.$Message.error("请选择一个标签")
      }
      this.$emit('on-success', this.selectedTags)
      this.visible = false
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
      margin: 0 !important
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

