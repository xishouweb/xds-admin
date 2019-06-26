<template>
  <div>
    <NewTable v-bind="table" @sortChange="pageChange">
      <tableHeader
        slot="header"
        @search="pageChange"
        @filterTable="filterTable"
        :filter="true"
        :csv="true"
        inputWidth="240px"
        placeholder="输入粉丝昵称或姓名搜索"
      >
      <div slot='left'><span class="list-title" v-if="fansName">{{fansName}}</span></div>
      </tableHeader>
      <tablePagenation slot="footer" noLeft v-bind="tableParam" @pageChange="pageChange"></tablePagenation>
    </NewTable>
  </div>
</template>

<script>
import { mapGetters } from "vuex"
import tableMixin from "./tableMixin.js"
export default {
  name: "qrcodeTheme",
  components: {
    NewTable: () => import('@/components/tableStyle/tables'),
    tableHeader: () => import('@/components/tableStyle/tableHeader'),
    tablePagenation: () => import('@/components/tableStyle/tablePagenation'),
    filterTable: () => import('../../drawerContent/filterTable.vue'),
    listInfo: () => import('../../drawerContent/listInfo.vue')
  },
  data() {
    return {
      metarialType: 'channel_qr_code',
      labelList: [],
      fansName: null,
      drawer: {
        show: false,
        title: "筛选",
        title1: '裂变海报详情',
        type: "",
      }
    }
  },
  mixins: [tableMixin],
  computed: {
    ...mapGetters({
      currPublic: "publicAccount/curPublic",
      getQrCodeNumber: "markting/getQrCodeNumber",
      getQrcodeGroupList: "markting/getQrcodeGroupList",
      qrcodeDefaultGroupId: "markting/qrcodeDefaultGroupId",
      getCanCreateQrCode: "markting/getCanCreateQrCode",
    })
  },
  mounted() {
    this.fansName = this.$route.query.name
  },
  methods: {
    // 打开筛选抽屉
    filterTable() {
      this.$emit('openDrawer', {
        show: true,
        type: "filter",
        current: {},
        fn: (arg) => { this.getTableList(arg) }
      })
    }
  }
}
</script>

<style lang="stylus">
.qr-code-theme-main
  padding-top 20px
  .list-title
    font-size 24px
    font-weight normal
    font-family MicrosoftYaHei
    color #303133
  .basicInfo
    display flex
    align-items center
    padding 15px 0
    line-height 24px
    img
      width 44px
      height 44px
    .right
      margin-left 15px
      .nickName
        color #303133
      .name
        color #979899
</style>
