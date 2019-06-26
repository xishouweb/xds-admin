<template>
  <div class="common-modal">
     <!-- id="newModal" -->
     <!-- :styles="{top: '50%', marginTop: '-8%'}" -->
    <Modal
      v-model="showModal"
      id="newModal"
      :transfer="transfer"
      :styles="{top: '50%', marginTop: '-8%'}"
      :width="width"
      :mask-closable="maskClosable"
      :closable="closable"
      @on-cancel="close"
      class-name="vertical-center-modal"
    >
      <slot name="header">
        <p slot="header">
          <span>{{header}}</span>
        </p>
      </slot>
      <div>
        <p v-if="!$slots.default" v-html="content"></p>
        <div v-else class="isContentSlot">
          <slot></slot>
        </div>
      </div>

        <div slot="footer" v-show="showFooter">
          <slot name="footer">
            <Button type="primary" @click.stop="ok">{{confrim}}</Button>
            <Button type="ghost" v-show="cancelBtn" @click.stop="cancel">{{cancelText}}</Button>
          </slot>
        </div>
    </Modal>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  name: 'newModal',
  model: {
    prop: 'modal',
    event: 'close'
  },
  props: {
    modal: {
      default: false,
      type: Boolean
    },
    width: {
      type: String,
      default: '520'
    },
    confrim: {
      type: String,
      default: '确定'
    },
    transfer: {
      type: Boolean,
      default: true
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
      default: '标题'
    },
    showFooter: {
      type: Boolean,
      default: true
    },
    isOrder: {
      type: Boolean,
      default: false
    },
    isAutoClose: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    showModal: {
      get() {
        return this.modal
      },
      set() {
      }
    }
  },
  methods: {
    cancel() {
      if (this.isOrder) {
        this.setIsOrder(1)
      } else {
        this.$emit('close', false)
      }
      this.$emit('cancel')
    },
    ok() {
      this.$emit('ok', 111)
      if (this.isOrder) {
        this.setIsOrder(1)
      } else {
        this.isAutoClose && this.$emit('close', false)
      }
    },
    close() {
      if (this.isOrder) {
        this.setIsOrder(1)
      } else {
        this.$emit('close', false)
      }
    },
    ...mapActions({
      setIsOrder: 'pay/setIsOrder'
    })
  },
  watch: {
    // showModal(val) {
    //   if (!val && this.isOrder) {
    //     this.setIsOrder(false)
    //   }
    // }
  }
}
</script>

<style lang="stylus">
#newModal
  .ivu-modal
    position: absolute
    left: 0
    right: 0
    // margin: 0 !important // 兼容360、IE模态框不居中问题
  .ivu-modal-content
    text-align left
    padding-left 20px
    padding-right 20px
    .ivu-modal-close .ivu-icon-ios-close-empty:hover
      color #409eff
    .ivu-modal-header
      padding-left 0
      padding-top 20px
      border-bottom none
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


