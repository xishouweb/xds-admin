<template>
  <div class="errorPage">
    <NoPublic v-if="status === 1"></NoPublic>
    <NoValidPublic v-if="status === 2"></NoValidPublic>
  </div>
</template>
<script>
  import NoPublic from './noPublic' // 类型为1
  import NoValidPublic from './noValidPublic' // 卫星为2
  export default {
    name: 'error',
    components: { NoPublic, NoValidPublic },
    data() {
      const status = this.$route.params.type
      return {
        status: Number(status)
      }
    }
  }
</script>

<style lang="stylus">
.errorPage
  height 100%
  background #fff
</style>
