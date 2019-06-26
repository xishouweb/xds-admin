<template>
  <!-- 布局组件 -->
  <layout>
    <!-- 主体 -->
    <DataLoading v-show="getLoadingStatus" :dataSatau="1" style="position: absolute;"> </DataLoading>
    <router-view v-if="validAccount === 'yes'"></router-view>
    <div v-if="validAccount === 'no'" class="public-error">
      <HeaderTitle border>裂变海报</HeaderTitle>
      <!-- 公众号状态验证 -->
      <public-verify v-model="status" :isService="(true)" :text1="text1" :text2="text2"></public-verify>
      <!-- <unValidAccount title="当前公众号为订阅号，无法设置裂变海报" subTitle="裂变海报功能只支持服务号，您可前往“公众号管理”添加服务号在设置"></unValidAccount> -->
    </div>
  </layout>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'

export default {
  name: "markting",
  components: {
    layout: () => import('@/components/pageStyle/layout'),
    // unValidAccount: () => import('@/pages/admin/error/unValidAccount'),
    HeaderTitle: () => import('@/components/pageStyle/headerTitle.vue'),
    publicVerify: () => import('@/pages/admin/error/publicVerify.vue')
  },
  computed: {
    ...mapGetters({
      currPublic: "publicAccount/curPublic",
      getLoadingStatus: 'poster/getLoadingStatus'
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
      text1: ['当前企业暂无服务号，无法设置裂变海报', '裂变海报功能只支持服务号，您可前往“公众号管理”添加服务号再设置'],
      text2: ['当前公众号为订阅号，无法设置裂变海报', '裂变海报功能只支持服务号，您可前往“公众号管理”添加服务号再设置'],
      validAccount: false
    }
  },
  mounted() {
    this.isValidAppAccount()
  },
  methods: {
    ...mapMutations({
      setPosterList: "poster/SET_POSTER_GROUPLIST"
    }),
    ...mapActions({
      validCssAppAccountType: 'poster/validCssAppAccountType'
    }),
    // 公众号类型和认证状态判断
    async isValidAppAccount() {
      let res = await this.validCssAppAccountType({appAccountId: this.currPublic.appAccountId})
      if (res.code === 1) {
        this.validAccount = "yes"
      } else {
        this.validAccount = "no"
      }
    }
  }
}
</script>

<style lang="stylus">

</style>
