<template>
  <!-- 群发公共部分 -->
  <div id="infoPage">

      <!-- 公众号切换组件 -->
      <div class="publicCut-box" v-if="status !== 1 && status !== 2">
        <publicCut></publicCut>
      </div>
      <!-- 主体内容 -->
      <div class="content-box" :class="{'no-top': (status === 1 || status === 2)}">
        <public-verify v-model="status" :needCut="(true)" :isService="isService" :text1="text1" :text2="text2"></public-verify>

        <!-- 内容插槽 -->
        <!-- <BScroll> -->
          <slot v-if="status === 0"></slot>
        <!-- </BScroll> -->
      </div>
    <!-- </template> -->

  </div>
</template>

<script>
import { mapGetters } from "vuex"

export default {
  props: {
    isService: {
      type: Boolean,
      default: false
    },
    text1: {},
    text2: {}
  },
  data() {
    return {
      status: 0
    }
  },
  watch: {},
  components: {
    noPublic: () => import('@/pages/admin/error/noPublic.vue'),
    noValidPublic: () => import('@/pages/admin/error/noValidPublic.vue'),
    noCertificate: () => import('@/pages/admin/error/noCertificate.vue'),

    publicVerify: () => import('@/pages/admin/error/publicVerify.vue') // 公众号统一验证组件
  },
  computed: {
    ...mapGetters({
      hasAccount: "publicAccount/hasAccount", // 是否绑定公众号
      hasValidAccount: "publicAccount/hasValidAccount", // 是否有可用公众号
      curPublic: "publicAccount/curPublic" // 当前公众号
    })
  },
  mounted() {},
  methods: {},
}
</script>

<style lang="stylus">
  .no-top
    margin-top: 0 !important
#infoPage
  position: relative
  border-top: 1px solid transparent
  .publicCut-box
    position: absolute
    top: -14px
    left: 0
  .content-box
    min-height: 800px
    margin-top: 30px
    padding: 8px 0 0 20px
    background-color: #fff
</style>
