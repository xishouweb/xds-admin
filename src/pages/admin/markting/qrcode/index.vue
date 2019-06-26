<template>
  <!-- 布局组件 -->
  <layout>
    <!-- 主体 -->
    <DataLoading v-show="getLoadingStatus" :dataSatau="1" style="position: absolute;"></DataLoading>
    <router-view v-if="validAccount === 'yes'"></router-view>
    <div v-if="validAccount === 'no'" class="public-error">
      <HeaderTitle border>主题列表</HeaderTitle>
      <!-- 公众号状态验证 -->
      <public-verify v-model="status" :isService="(true)" :text1="text1" :text2="text2"></public-verify>
      <!-- <unValidAccount></unValidAccount> -->
    </div>
  </layout>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'
export default {
  name: "markting",
  components: {
    layout: () => import('@/components/pageStyle/layout'),
    unValidAccount: () => import('@/pages/admin/error/unValidAccount'),
    HeaderTitle: () => import('@/components/pageStyle/headerTitle.vue'),
    publicVerify: () => import('@/pages/admin/error/publicVerify.vue')
  },
  computed: {
    ...mapGetters({
      currPublic: "publicAccount/curPublic",
      getLoadingStatus: 'markting/getLoadingStatus'
    })
  },
  watch: {
    currPublic() {
      this.isValidAppAccount()
    }
  },
  data() {
    return {
      status: 0,
      text1: ['当前企业暂无服务号，无法设置渠道二维码', '渠道二维码功能只支持服务号，您可前往“公众号管理”添加服务号再设置'],
      text2: ['当前公众号为订阅号，无法设置渠道二维码', '渠道二维码功能只支持服务号，您可前往“公众号管理”添加服务号再设置'],
      validAccount: ''
    }
  },
  mounted() {
    this.isValidAppAccount()
  },
  methods: {
    ...mapMutations({
      setQrCodeList: "markting/SET_QRCODE_GROUPLIST"
    }),
    ...mapActions({
      validCssAppAccountType: 'markting/validCssAppAccountType',
      canSaveQrCode: "markting/canSaveQrCode",
      getQrCodeNum: 'markting/getQrCodeNum',
    }),
    // 公众号类型和认证状态判断
    async isValidAppAccount() {
      let param = {appAccountId: this.currPublic.appAccountId}
      let res = await this.validCssAppAccountType(param)
      if (res.code === 1) {
        this.validAccount = 'yes'
        this.getQrCodeNum(param) // 获取二维码的数量
        this.canSaveQrCode(param) // 判断当前公众号是否可以新建二位码
      } else {
        this.validAccount = "no"
      }
    }
  },
}
</script>

<style lang="stylus">
.marketing-header-title
  height 140px
.public-error
    min-height: 760px
</style>
