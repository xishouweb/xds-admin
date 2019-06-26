<template>
  <!-- 二级菜单组件 -->
  <div id="tencent">
    <div class="second-nav" :class="{secondcollapsed:!collapsed}" v-if="secondMenu">
      <div class="nav-title">{{secondMenu.name}}</div>
      <div class="second-nav-link" v-for="(item, index) in secondMenu.list" :key="index">
        <div
          class="second-nav-item"
          @click="goToRouter(item.menuUrl)"
          :class="{active: (routerInfo.path.indexOf(item.menuUrl || 1)>=0)||(item.menuUrl==='personalizedMenu'&&routerInfo.name==='modifyMenu') || (item.menuUrl==='messageTemplate'&&routerInfo.name==='messageTAdd')}"
        >{{item.menuName}}</div>
      </div>
    </div>
    <div
      v-if="$route.name === 'tencentManage' || ($route.name !== 'reception' && $route.path.includes('setting')) "
      class="tencent-wrapper"
      :class="{tencentcollapsed:!collapsed}">
        <div class="tencent-wrapper-scroller">
          <router-view></router-view>
        </div>
    </div>
    <div v-else class="tencent-wrapper1" :class="{tencentcollapsed:!collapsed}">
      <Spin fix v-if="accountLoading">
        <Icon type="load-c" size="40" class="spin-icon-load"></Icon>
        <div>loading</div>
      </Spin>
      <template v-else>
        <div class="data-wrapper" v-if="hasAccount">
          <div v-if="hasValidAccount" class="tencent-wrapper-scroller">
            <router-view></router-view>
          </div>
          <div v-else :style="{height: '100%'}">
            <!-- 公众号状态验证 -->
            <public-verify v-model="status"></public-verify>
          </div>
        </div>
        <div class="noData-wrapper" v-else>
          <scroll-bar>
            <!-- 公众号状态验证 -->
            <public-verify v-model="status"></public-verify>
          </scroll-bar>
        </div>
      </template>
    </div>
  </div>
</template>
<script>
// import PublicNo from '@/components/currPublicNo'
import { mapGetters } from "vuex"
export default {
  name: "secondMenu",
  data() {
    return {
      status: 0
    }
  },
  components: {
    NoPublic: () => import("../pages/admin/error/noPublic"), // 没有公众号的提示页面
    NoValidPublic: () => import("../pages/admin/error/noValidPublic"),
    publicVerify: () => import('@/pages/admin/error/publicVerify.vue')
  },
  computed: {
    ...mapGetters({
      collapsed: "nav/getCollapsed",
      routerInfo: "nav/getRouterInfo",
      secondMenu: "nav/getSecondMenu",
      accountLoading: "publicAccount/accountLoading",
      hasAccount: "publicAccount/hasAccount",
      hasValidAccount: "publicAccount/hasValidAccount"
    })
  },
  methods: {
    goToRouter(name) {
      this.$router.push({
        name: name
      })
    }
  }
}
</script>
<style lang="stylus">
.second-nav
  position fixed
  z-index 10
  overflow hidden
  width 120px
  height 100%
  transition all 0.2s
  &.secondcollapsed
    width 0
  .nav-title
    padding-left 20px
    width 120px
    margin-top 25px
    margin-bottom 36px
    font-weight 600
    color #909499
  .second-nav-link
    width 120px
    margin-top 12px
    .second-nav-item
      position relative
      cursor pointer
      color #0c0c0d
      height 40px
      padding-left 20px
      line-height 40px
      border-radius 3px
      &:hover
        background-color #ffffff
        &:after
          position absolute
          content ''
          left 10px
          top 13px
          width 3px
          height 12px
          background-color #409eff
      &.active
        background-color #ffffff
        &:after
          position absolute
          content ''
          left 10px
          top 13px
          width 3px
          height 12px
          background-color #409eff
#tencent
  height 100%
  .tencent-wrapper, .tencent-wrapper1
    position relative
    height 100%
    margin-left 130px
    transition margin-left 0.2s
    border-radius 3px
    .tencent-wrapper-scroller
      height 100%
      padding 20px
      padding-bottom 10px
    &.tencentcollapsed
      margin-left 0
  .tencent-wrapper
    background-color #ffffff
  .tencent-wrapper1
    .tencent-wrapper-scroller
      height 100%
      padding 20px 0px
      padding-bottom 0
  .data-wrapper
    height 100%
  .noData-wrapper
    height 100%
    padding 0 0 10px
    background #fff
</style>

