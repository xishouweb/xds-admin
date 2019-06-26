<template>
  <!-- 布局组件 -->
  <layout>
    <!-- 主体 -->
    <DataLoading v-show="getLoadingStatus" :dataSatau="1" style="position: absolute;"></DataLoading>
    <router-view v-if="status === 0"></router-view>
    <div v-if="status !== 0" class="public-error">
      <HeaderTitle border style="height: 70px">智能接待</HeaderTitle>
      <!-- 公众号状态验证 -->
      <public-verify v-model="status" :text1="text1" :text2="text2"></public-verify>
    </div>
  </layout>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: "markting",
  components: {
    layout: () => import('@/components/pageStyle/layout'),
    HeaderTitle: () => import('@/components/pageStyle/headerTitle.vue'),
    publicVerify: () => import('@/pages/admin/error/publicVerify.vue')
  },
  computed: {
    ...mapGetters({
      getLoadingStatus: 'markting/getLoadingStatus'
    })
  },
  watch: {
  },
  data() {
    return {
      status: 9, // 公众号状态，初始值不能为0
      text1: ['当前企业暂无服务号，无法设置智能接待', '智能接待功能只支持服务号，您可前往“公众号管理”添加服务号再设置'],
      text2: ['当前公众号为订阅号，无法设置智能接待', '智能接待功能只支持服务号，您可前往“公众号管理”添加服务号再设置'],
    }
  },
  mounted() {
  },
  methods: {
  },
}
</script>

<style lang="stylus">
  .smart-page
    margin-right:
    .smart-scroll>div:first-child
      padding-right: 10px

</style>
