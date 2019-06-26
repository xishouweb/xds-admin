<!-- 模板消息群发 -->
<template>
  <!-- 布局组件 -->
  <layout :isService="(true)" :text1="text1" :text2="text2">
    <!-- 没有服务号 -->
    <!-- <div v-if="!hasWepiaoer">
      <no-valid-service :text="text1"></no-valid-service>
    </div> -->
    <!-- 当前不是服务号 -->
    <!-- <div v-else-if="curPublic.serviceTypeInfo !== 2">
      <no-valid-service :text="text2"></no-valid-service>
    </div> -->
    <!-- 主体 -->
    <!-- <div v-else> -->
     <router-view v-if="curPublic" :appAccountId='curPublic.appAccountId'></router-view>
    <!-- </div> -->
  </layout>
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    data() {
      return {
        text1: [
          '当前企业暂无服务号，无法设置模板消息群发',
          '模板消息群发功能只支持服务号，您可前往“公众号管理”添加服务号再设置'
        ],
        text2: [
          '当前公众号为订阅号，无法设置模板消息群发',
          '模板消息群发功能只支持服务号，您可前往“公众号管理”添加服务号再设置'
        ]
      }
    },
    components: {
      layout: () => import('./components/layout'),
      noValidService: () => import('../error/noValidService.vue')
    },
    computed: {
      ...mapGetters({
        curPublic: 'publicAccount/curPublic',
        hasWepiaoer: 'publicAccount/hasWepiaoer',
      })
    },
    mounted() {

    },
    methods: {},
  }
</script>

<style lang="stylus" scoped>
</style>
