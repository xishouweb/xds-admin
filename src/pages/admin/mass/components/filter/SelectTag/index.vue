<template>
  <div class="modalContainer">
    <slot></slot>
    <Modal v-model="visible" class="modalTags modalTagsSingle" width="600" @on-cancel="close">
      <div slot="header" class="modal-title">
        <span>指定标签</span>
      </div>
      <!-- <div class="modal-content"> -->
        <div class="tags-container">
          <!-- <Tabs :animated="false">
            <TabPane :label="item.name" v-for="item in formatFansSeatTags" :key="item.id">
              <div class="tabs-panel"> -->
                <ScrollBar v-if="tagDataCopy">
                  <div class="tags-wrapper">
                    <!-- <TagsGroup :data="tagData"></TagsGroup> -->
                    <div class="tags-Group">
                      <template v-for="(v, i) in tagDataCopy">
                        <template v-if="v.fansWxTagDtos">
                          <tags-node :key="v.tagId" :group="v" :dex="i" @on-check="check" @on-checkAll="checkAll"></tags-node>
                        </template>
                      </template>
                    </div>
                  </div>
                </ScrollBar>
              <!-- </div>
            </TabPane>
          </Tabs> -->
        </div>
      <!-- </div> -->
      <div slot="footer" class="modal-footer">
        <div class="modalFooter">
          <div class="modal-footer-left">
            共选择
            <span class="selectedNum">{{getNum || 0}}</span>标签
          </div>
          <div class="modal-footer-right">
            <Button type="primary" @click="ok">确定</Button>
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
// import TagsGroup from "./tags-group"
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
    tagData: {
      type: Array,
      default() {
        return []
      }
    },
    maxNum: {
      type: [String, Number],
      default: 1000
    }
  },
  components: { TagsNode: () => import("./tags-node") },
  data() {
    return {
      visible: this.value,
      actionVisible: false,
      // selectedValue: {},
      tagDataCopy: null,
    }
  },
  computed: {
    ...mapGetters({
      curPublic: "publicAccount/curPublic"
    }),
    getNum() { // 获取选中数量
      let num = 0
      if (!this.tagDataCopy) { return 0 }
      this.tagDataCopy.forEach(k => {
        let tags = k.fansWxTagDtos
        if (tags && tags.length) {
          tags.forEach(v => {
            if (v.checked) {
              num++
            }
          })
        }
      })
      return num
    }
  },
  watch: {
    value(val) {
      this.visible = val
    },
    visible(val) {
      this.$emit("input", val)
    },
    tagData: {
      handler(val) {
        this.initTagData()
        // this.selectedValue = val
      },
      deep: true
    }
  },
  mounted() {
    this.initTagData()
  },
  methods: {
    check(i, j) { // 标签选择
      this.$set(
        this.tagDataCopy[i].fansWxTagDtos[j],
        'checked',
        !this.tagDataCopy[i].fansWxTagDtos[j].checked
      )
    },
    checkAll(i, bool) { // 全选、取消全选
      this.tagDataCopy[i].fansWxTagDtos.forEach((v, j) => {
        this.$set(
          this.tagDataCopy[i].fansWxTagDtos[j], 'checked', bool)
      })
    },
    initTagData() { // 初始化、重置当前页数据
      if (this.tagData) {
        this.tagDataCopy = JSON.parse(JSON.stringify(this.tagData))
      }
    },
    ok() {
      this.$emit('on-ok', this.tagDataCopy)
      this.visible = false
      // 设置标签
      // if (!Object.keys(this.selectedValue).length) {
      //   this.$Message.error("请选择一个标签")
      //   return
      // }
      // const cloneValue = JSON.parse(JSON.stringify(this.selectedValue))
      // let arrValue = []
      //  Object.keys(cloneValue).forEach(key => {
      //   arrValue = [...arrValue, cloneValue[key]]
      // })
      //  this.$emit('on-ok', {
      //   count: arrValue.length,
      //   value: cloneValue,
      //   originList: arrValue,
      //   list: arrValue.length > 3 ? arrValue.slice(0, 3) : arrValue
      // })
      // this.visible = false
    },
    close() {
      this.visible = false
      this.initTagData()
    }
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
      margin: 0 !important
      .ivu-modal-header
        border-bottom none
      // .ivu-modal-footer
      //   border-top 1px solid #e3e8ee
  &.modalTagsSingle
    .ivu-modal-body
      padding-top 10px
  $.modalTagsMutiple
    .ivu-modal
      .ivu-modal-header
        border-bottom 1px solid #e3e8ee
  // 业务
  .tags-container
    height 440px
    border-top: 1px solid #e3e8ee
    border-bottom: 1px solid #e3e8ee
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
