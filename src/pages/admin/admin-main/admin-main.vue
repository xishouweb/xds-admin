<template>
  <div id="admin">
    <div class="admin-nav">
      <admin-nav></admin-nav>
    </div>
    <div class="admin-main" :class="{bigMain:!collapsed, smallMain:collapsed}">
      <admin-header></admin-header>
      <div class="admin-main-wrapper">
        <div class="admin-main-scroll">
          <div class="admin-main-height">
            <router-view></router-view>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import AdminHeader from '@/layouts/AdminHeader'
import AdminNav from '@/layouts/AdminNav'
export default {
  name: 'adminMain',
  data() {
    return {}
  },
  computed: {
    ...mapGetters({
      collapsed: 'nav/getCollapsed'
    })
  },
  components: {
    AdminHeader,
    AdminNav
  }
}
</script>
<style lang="stylus">
#admin
  width 100%
  height 100%
  .admin-nav
    position fixed
    z-index 20
  .admin-main
    height 100%
    overflow hidden
    background-color #666
    transition all 0.2s
    &.bigMain
      margin-left 60px
    &.smallMain
      margin-left 120px
    .admin-main-wrapper
      height 100%
      padding-top 50px
      background-color #f2f4f5
      .admin-main-scroll
        height calc(100% - 10px)
        margin-top:10px
        .admin-main-height
          height 100%
          overflow hidden
</style>

