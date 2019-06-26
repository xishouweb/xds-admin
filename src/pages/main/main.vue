<template>
  <div id="main">
    <common-header></common-header>
    <div class="main-scroll-bar">
      <scroll-bar :isTop="true" v-if="$route.name !== 'home'">
        <div class="main-wrapper-noscroll">
          <div class="main-content">
            <router-view></router-view>
          </div>
        </div>
        <common-footer></common-footer>
      </scroll-bar>
      <div v-else>
        <div class="main-wrapper-noscroll">
          <div class="main-content">
            <router-view></router-view>
          </div>
        </div>
        <common-footer></common-footer>
      </div>
    </div>
  </div>
</template>

<script>
import CommonHeader from '@/layouts/CommonHeader'
import CommonFooter from '@/layouts/CommonFooter'
export default {
  components: {
    CommonHeader,
    CommonFooter
  }
}
</script>

<style lang="stylus">
@import '~@/assets/stylus/mixin'
#main
  height 100%
  width 100%
  padding-top 80px
  .main-scroll-bar
    height 100%
    .main-wrapper-noscroll
      min-height calc(100% - 243px)
      margin 30px 6.25% 10px
      background-color #ffffff
      box-shadow 1px 2px 18px 0px rgba(0, 0, 0, 0.2)
      hide-boxShadow()
      overflow hidden
</style>
