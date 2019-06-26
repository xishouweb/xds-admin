<template>
  <div>
    <dataLoading @reload="reload" :data-satau='loadingStatu'>
      <!-- <PublicNo></PublicNo> -->
      <publicCut></publicCut>
      <div id="material">
        <div class="weixin-wrapper">
          <div class="wechat-title pading-wrapper">
            <div class="customName">自定义菜单</div>
            <div class="tongbuName" @click="updateWxMenuBySysn">同步菜单</div>
          </div>
          <!-- <BScroll :offsetBottom="0"> -->
          <scroll-bar v-setScrollBoxHeight>
          <div class="editMenu-wrapper">
            <editMenu type="customMenu"></editMenu>
          </div>
          </scroll-bar>
          <!-- </BScroll> -->
        </div>
      </div>
    </dataLoading>
    <!-- 离开页面时的弹框提示 -->
    <exit-page-modal v-if="!!hasAccount"></exit-page-modal>
  </div>
</template>
<script>
import {mapState, mapGetters} from 'vuex'
import PublicNo from '../components/currPublicNo'
import editMenu from '@/pages/admin/tencent/customMenu/editMenu'

export default {
  name: 'customMenu',
  components: {
    PublicNo,
    editMenu
  },
  data() {
    return {
      currPublic: {},
      loadingStatu: 2
    }
  },
  computed: {
    ...mapState({
      appAccountId: state => state.publicAccount.curPublic.appAccountId
    }),
    ...mapGetters({
      hasAccount: "publicAccount/hasAccount"
    })
  },
  mounted() {
    if (this.appAccountId) {
      this.loadingStatu = 1
    }
    this.$root.Bus.$on('loadingStatu', (val) => {
      this.loadingStatu = val
    })
  },
  methods: {
    async updateWxMenuBySysn() {
      let params = {
        appAccountId: this.appAccountId
      }
      const response = await this.post(this.fylPath.updateWxMenuBySysn, params)
      const { code, message } = response
      if (code === 1) {
        this.$Message.success('菜单同步成功')
        this.$root.Bus.$emit('refreshMenuList', true)
      } else {
        this.$Message.error(message)
      }
    },
    reload() {
      this.$root.Bus.$emit('refreshMenuList', true)
    }
  }
}
</script>
<style lang="stylus">
#material
  // padding 0 20px
  margin-top 10px
  background-color #ffffff
  border-radius 3px
  .weixin-wrapper
    .wechat-title
      display flex
      justify-content space-between
      &.pading-wrapper
        padding-left 20px
        padding-right 20px
      .customName
        font-weight bold
      .tongbuName
        color #606366
        cursor pointer
        font-size 16px
        line-height 18px
        &:hover
          color #409fff
    .editMenu-wrapper
      padding 30px 20px 0
</style>
