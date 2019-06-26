<template>
  <div id="modals">
    <Modal :title="modalTitle" v-model="isShow" @on-ok="handle(confirmHanle)"
      @on-cancel="cancel" class-name="self-center-modal" :okText="okText" :cancelText="cancelText">
      <div v-html="tips"></div>
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
    props: ['modalTitle', 'modalShow', 'okText', 'cancelText', 'confirmHanle', 'cancelHanle', 'tips'],
    watch: {
      modalShow() {
        this.isShow = this.modalShow
      }
    },
    methods: {
      cancel() {
        this.$emit('close')
        this.handle(this.cancelHanle)
      },
      handle(key) {
        this._BUS.$emit('handle', key)
      }
    }
  }
</script>
<style lang="stylus">
@import '~@/assets/stylus/index'
  #modals
    height:auto
</style>
