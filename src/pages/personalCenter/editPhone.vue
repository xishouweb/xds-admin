<template>
  <div id="editPhone">
    <div class="title">修改手机</div>
    <div class="form">
      <componentEditPhone :params="infoParams"></componentEditPhone>
    </div>
  </div>
</template>

<script>
import componentEditPhone from '@/pages/personalCenter/componentEditPhone'
export default {
  data() {
    return {
      infoParams: {}
    }
  },
  mounted() {
    this.infoParams = {
      applyId: this.$route.params.applyId,
      oldMobile: this.$route.params.oldMobile
    }
  },
  components: {
    componentEditPhone
  },
}
</script>


<style lang="stylus">
@import '~@/assets/stylus/mixin'
#editPhone
  padding 42px 43px 20px 43px
  .title
    font-size 20px
  .form
    width 410px
    margin 75px auto  
</style>