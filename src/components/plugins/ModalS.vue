<template>
  <div id="modals">
    <Modal :title="modalTitle" v-model="isShow" class-name="models-center" @on-cancel="cancel">
      <div v-html="content"></div>
      <div slot="footer">
        <div v-if="!noFooter">
          <Button type="primary" @click.stop="confirm">{{okText}}</Button>
          <Button type="ghost" @click.stop="cancel">{{cancelText}}</Button>
        </div>
      </div>
    </Modal>
  </div>
</template>
<script>
  export default {
    name: '',
    data() {
        return {
          isShow: false
        }
    },
    model: {
      prop: "modalShow",
      event: "close"
    },
    props: ['modalTitle', 'modalShow', 'okText', 'cancelText', 'content', 'noFooter'],
    watch: {
      modalShow() {
        this.isShow = this.modalShow
      }
    },
    methods: {
      cancel() {
        this.$emit('modal-cancel')
        this.$emit('close')
      },
      confirm(key) {
        this.$emit('modal-confirm')
      }
    }
  }
</script>
<style lang="stylus">
@import '~@/assets/stylus/index'
  .models-center.ivu-modal-wrap
    top: 50%
    left: 50%
    transform translate(-50%, -50%)
  #modals
    height:auto
</style>
