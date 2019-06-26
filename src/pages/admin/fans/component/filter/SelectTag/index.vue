<template>
  <div class="modalContainer">
    <slot></slot>
    <Modal v-model="visible" class="modalTags modalTagsSingle" width="600" @on-cancel="close">
      <div slot="header" class="modal-title">
        <span>指定标签</span>
      </div>
      <div class="modal-content">
        <div class="tags-container select-container">
          <Tabs :animated="false" v-if="visible">
            <TabPane :label="item.name" v-for="item in formatFansSeatTags" :key="item.id">
              <div class="tabs-panel">
                <ScrollBar>
                  <div class="tags-wrapper">
                    <TagsGroup :data="item.children"></TagsGroup>
                  </div>
                </ScrollBar>
              </div>
            </TabPane>
          </Tabs>
        </div>
      </div>
      <div slot="footer" class="modal-footer">
        <div class="modalFooter">
          <div class="modal-footer-left">
            共选择
            <span class="selectedNum">{{calcSelectedLength}}</span>标签
          </div>
          <div class="modal-footer-right">
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
  </div>
</template>

<script>
import { mapGetters } from "vuex"
import TagsGroup from "./tags-group"
export default {
  name: "tags-container",
  props: {
    title: {
      type: String,
      default: "指定标签"
    },
    value: {
      type: Boolean,
      default: false
    },
    defaultValue: {
      type: Object,
      default() {
        return {}
      }
    },
    maxNum: {
      type: [String, Number],
      default: 1000
    }
  },
  components: { TagsGroup },
  data() {
    return {
      visible: this.value,
      actionVisible: false,
      selectedValue: {}
    }
  },
  computed: {
    ...mapGetters("fans", ["formatFansSeatTags"]),
    calcSelectedLength() {
      const count = Object.keys(this.selectedValue).length
      return count
    }
  },
  watch: {
    value(val) {
      this.visible = val
    },
    visible(val) {
      this.$emit("input", val)
    },
    defaultValue: {
      handler(val) {
        this.selectedValue = val
      },
      deep: true
    }
  },
  mounted() {
    this.$root.Bus.$on("on-check", val => {
      if (Object.keys(val).length > this.maxNum) {
        this.$emit("on-check-error")
        return
      }
      this.selectedValue = val
    })
  },
  methods: {
    tagSaveOk() {
      // 设置标签
      if (!Object.keys(this.selectedValue).length) {
        this.$Message.error("请选择一个标签")
        return
      }
      const cloneValue = JSON.parse(JSON.stringify(this.selectedValue))
      let arrValue = []
      Object.keys(cloneValue).forEach(key => {
        arrValue = [...arrValue, cloneValue[key]]
      })
      this.$emit("on-ok", {
        count: arrValue.length,
        value: cloneValue,
        originList: arrValue,
        list: arrValue.length > 3 ? arrValue.slice(0, 3) : arrValue
      })
      this.visible = false
    },
    close() {
      this.visible = false
    }
  },
  destroyed() {
    this.$root.Bus.$off("on-check")
  }
}
</script>

<style lang="stylus">
.modalContainer
  display inline-block
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
  .tags-container.select-container
    height 440px
    .tags-wrapper
      margin-right 15px
  // tabs
  .tabs-panel
    padding-top 10px
    height 390px
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
