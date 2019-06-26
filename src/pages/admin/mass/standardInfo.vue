<!-- 标准群发 -->
<template>
  <!-- 布局组件 -->
  <layout>
    <!-- 主体 -->
    <div>
     <router-view v-if="curPublic" :publicType="curPublic.serviceTypeInfo" :appAccountId='curPublic.appAccountId'></router-view>
    </div>
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
    mounted() {},
    methods: {},
  }
</script>

<style lang="stylus" scoped>
</style>
