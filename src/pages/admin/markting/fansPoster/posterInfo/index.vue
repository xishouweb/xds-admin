<template>
  <div>
    <PageMain class="qr-code-theme-main">
      <Tabs value="list" style="width: 100%;">
        <TabPane label="裂变海报列表" name="list">
            <Lsit @openDrawer="openDrawer"></Lsit>
        </TabPane>
        <TabPane label="海报模板统计" name="data">
          <BScroll>
            <statisData @openDrawer="openDrawer" :curPublic="currPublic"></statisData>
          </BScroll>
        </TabPane>
        <TabPane label="海报模板详情" name="info">
            <Information @openDrawer="openDrawer"></Information>
        </TabPane>
      </Tabs>
    </PageMain>

    <Drawer
      v-model="drawer.show"
      :titleTips="drawer.title"
      :isScroll="false"
      :width="drawer.width || '680px'"
      ref="Drawer"
      >
      <div slot="content">
        <!-- 筛选 -->
        <template v-if="this.drawer.type === 'filter'">
          <filter-table
            v-if="drawer.show"
            :drawer="drawer"
            :metarialType="metarialType"></filter-table>
        </template>
        <!--海报详情 -->
        <template v-if="this.drawer.type === 'info'">
          <list-info
          v-if="drawer.show"
          :drawer="drawer"
          :params="drawer.current"
          :curPublic="currPublic"
          :metarialType="metarialType"
          ></list-info>
        </template>
      </div>
    </Drawer>

    <NewModal
      :header="modal.header"
      :maxZIndex="true"
      v-model="modal.show"
      width="464"
      @ok="modal.ok"
    >
      <div>{{modal.message}}</div>
    </NewModal>
  </div>
</template>

<script>
import { mapGetters } from "vuex"
export default {
  name: "qrcodeTheme",
  components: {
    PageMain: () => import('@/components/pageStyle/pageMain.vue'),
    Lsit: () => import('./list'),
    statisData: () => import('./statis'),
    Information: () => import('./info'),
    filterTable: () => import('../drawerContent/filterTable.vue'),
    listInfo: () => import('../drawerContent/listInfo.vue')
     },
  data() {
    return {
      metarialType: 'channel_qr_code',
      labelList: [],
      drawer: {
        show: false,
        title: "",
        type: "",
        currentGroup: {}
      },
      modal: {
        show: false,
        header: "删除",
        message: "",
        ok() {}
      }
    }
  },
  computed: {
    ...mapGetters({
      currPublic: "publicAccount/curPublic",
    })
  },
  watch: {
    currPublic() {
      this.$router.push({name: 'actionPoster'})
    }
  },
  methods: {
    openDrawer(drawer) {
      this.drawer = drawer
      this.drawer.title = drawer.title
    }
  }
}
</script>

<style lang="stylus">
  .qr-code-theme-main
    padding-top 20px
    .ivu-tabs-nav
      font-size 18px
  .ivu-tabs-tab
    padding-bottom 27px
</style>
