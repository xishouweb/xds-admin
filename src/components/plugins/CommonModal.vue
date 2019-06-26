<template>
  <div class="common-modal">
    <Modal v-model="modal" :mask-closable="maskClosable" :closable="closable" @on-cancel="close" :styles="{top: '50%', marginTop: '-8%'}">
      <p slot="header">
        <span>{{header}}</span>
      </p>
      <div>
        <p v-if="!$slots.default" v-html="content"></p>
        <div v-else class="isContentSlot">
          <slot></slot>
        </div>
      </div>
      <div slot="footer" v-show="showFooter">
        <Button type="primary" @click.stop="ok">{{confrim}}</Button>
        <Button type="ghost" v-show="cancelBtn" @click.stop="cancel">{{cancelText}}</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
export default {
  props: {
    confrim: {
      type: String,
      default: '确定'
    },
    cancelBtn: {
      type: Boolean,
      default: true
    },
    maskClosable: {
      type: Boolean,
      default: true
    },
    closable: {
      type: Boolean,
      default: true
    },
    cancelText: {
      type: String,
      default: '取消'
    },
    content: {
      type: String,
      default: '确定要删除么？'
    },
    header: {
      type: String,
      default: '解绑企业'
    },
    showFooter: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      modal: false
    }
  },
  methods: {
    showModal() {
      this.modal = true
    },
    cancel() {
      this.modal = false
      this.$emit('cancel')
    },
    ok() {
      this.modal = false
      this.$emit('ok')
    },
    close() {
      this.modal = false
    }
  }
}
</script>

<style lang="stylus">
  .ivu-modal-content
    padding-left 20px
    padding-right 20px
    .ivu-modal-close .ivu-icon-ios-close-empty:hover
      color #409eff
    .ivu-modal-header
      padding-left 0
      padding-top 20px
      span
        color #303133
        font-size 18px
    .ivu-modal-body
      font-size 14px
      padding-left 0
      padding-right 0
    .ivu-modal-footer
      border-top none
      padding 20px 0
      .ivu-btn
        padding-top 4.5px
        padding-bottom 4.5px
        margin-left 20px
</style>


