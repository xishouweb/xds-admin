<template>
  <!-- 编辑页面关闭、切换提示 -->
  <div>
    <NewModal
      v-model="show"
      confrim="离开"
      cancelText="留下"
      header="要离开此页面吗?"
      content="系统可能不会保存您所做的更改"
      @close="close"
      @ok="ok"
    >
    </NewModal>
  </div>
</template>

<script>
  import {mapState, mapMutations} from 'vuex'
  export default {
    data() {
      return {
        show: false,
        body: null,
      }
    },
    porps: {
      intercept: {
        type: Boolean,
        default: true
      }
    },
    components: {},
    computed: {
      ...mapState({
        showModal: state => state.public.showModal,
        to: state => state.public.to
      })
    },
    watch: {
      showModal(v) {
        this.show = this.showModal
      },
    },
    created() {
      // console.log('绑定')
      this.show = this.showModal
      this.$nextTick(() => {
        this.body = document.getElementsByTagName('body')[0]
        this.on(this.body, 'beforeunload', this.interceptFn) // 绑定关闭拦截事件
      })
    },
    beforeDestroy() {
      // console.log('解绑')
      let body = document.getElementsByTagName('body')[0]
      this.off(body, 'beforeunload', this.interceptFn) // 解绑关闭拦截事件
    },
    methods: {
      ...mapMutations({
        set_showModal: 'public/SET_SHOWMODAL',
        set_to: 'public/SET_TO'
      }),
      closeWindow() { // 关闭当前窗口函数
        var userAgent = navigator.userAgent
        if (userAgent.indexOf("Firefox") !== -1 || userAgent.indexOf("Presto") !== -1) {
            window.location.replace("about:blank")
        } else {
            window.opener = null
            window.open("", "_self")
            window.close()
        }
      },
      ok() {
        this.to()
        this.set_showModal(false)
        this.set_to(null)
      },
      close() {
        this.set_showModal(false)
        this.set_to(null)
      },
      interceptFn(ev) { // 拦截窗口关闭
        if (!this.showModal) {
          ev = ev || window.event
          ev.returnValue = false // 兼容 Gecko + IE
          return false // 兼容 Gecko + Webkit, Safari, Chrome
        }
      }
    },
  }
</script>

<style lang="stylus">

</style>
