<!-- 客服消息群发 -->
<template>
  <!-- 布局组件 -->
  <layout>
    <!-- 主体 -->
    <router-view v-if="curPublic" :appAccountId='curPublic.appAccountId'></router-view>
  </layout>
</template>
<script>
  import { mapGetters } from 'vuex'

  export default {
    data() {
      return {}
    },
    components: {
      layout: () => import('./components/layout'),
    },
    computed: {
      ...mapGetters({
        curPublic: 'publicAccount/curPublic'
      })
    },
    watch: {},
    mounted() {},
    methods: {},
  }
</script>

<style lang="stylus">
</style>
