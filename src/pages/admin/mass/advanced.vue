<!-- 高级群发 -->
<template>
  <!-- 布局组件 -->
  <layout :isService="(true)" :text1="text1" :text2="text2">
        <router-view v-if="curPublic" :appAccountId='curPublic.appAccountId'></router-view>
  </layout>
</template>
<script>
  import { mapGetters } from 'vuex'

  export default {
    data() {
      return {
        text1: [
          '当前企业暂无服务号，无法设置高级群发',
          '高级群发功能只支持服务号，您可前往“公众号管理”添加服务号再设置'
        ],
        text2: [
          '当前公众号为订阅号，无法设置高级群发',
          '高级群发功能只支持服务号，您可前往“公众号管理”添加服务号再设置'
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
        hasWepiaoer: 'publicAccount/hasWepiaoer'
      })
    },
    mounted() {},
    methods: {},
  }
</script>

<style lang="stylus" scoped>
</style>
