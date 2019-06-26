<template>
  <NewTable  v-bind="table"
    class="paddingtb30"
    style="padding: 10px"
    bscroll="div"
    @sortChange="pageChange"
    :outputFileName="outputFileName">
    <tableHeader slot="header" :search="false">
      <div slot="left" class="text-strong"><span class="border-left">详细数据</span></div>
    </tableHeader>
    <tablePagenation noLeft slot="footer" v-bind="tableParam" @pageChange="pageChange"></tablePagenation>
  </NewTable>
</template>

<script>
import { mapState } from "vuex"
export default {
  components: {
    NewTable: () => import("@/components/tableStyle/tables"),
    tablePagenation: () => import("@/components/tableStyle/tablePagenation"),
    tableHeader: () => import("@/components/tableStyle/tableHeader"),
  },
  props: ['data'],
  computed: {
    ...mapState({
      currentPublicNo: state => state.publicAccount.curPublic,
      publicList: state => state.publicAccount.publicAccountList
    })
  },
  data() {
    return {
      outputFileName: "客服会话统计-" + new Date().toLocaleDateString(),
      currentPublic: 0,
      tableData: [],
      tableParam: {
        totalPage: 0,
        pageSize: 10,
        currPage: 1,
        keyword: null,
        groupId: null,
        sort: null,
        order: null
      },
      table: {
        noDatatext: '暂无数据',
        columns: [
          {
            title: '日期',
            key: 'date'
          },
          {
            title: '会话消息条数',
            key: 'msgCount'
          },
          {
            title: '会话消息人数',
            key: 'eventCount'
          },
          {
            title: '强制发送次数',
            key: 'massPreviewCount'
          },
          {
            title: '抢单次数',
            key: 'seatQdCount'
          }
        ],
        datas: []
      }
    }
  },
  watch: {
    data: {
      handler() {
        this.tableData = ([...this.data] || []).reverse()
        this.tableData = this.tableData.map(item => {
          return {
            ...item,
            date: `${item.year}-${item.month}-${item.day}`
          }
        })
        this.getTableData()
      },
      immediate: true
    }
  },
  methods: {
    // table相关操作
    async getTableData() {
      let _param = this.tableParam
      let param = {
        offset: (_param.currPage - 1) * _param.pageSize,
        limit: _param.pageSize
      }
      let res = {
        totalCount: this.tableData.length,
        limit: param.limit,
        offset: param.offset,
        records: this.tableData.slice(param.offset, param.offset + param.limit)
      }
      this.tableParam = Object.assign({}, this.tableParam, {
        totalPage: res.totalCount,
        pageSize: res.limit,
        currPage: parseInt(res.offset / res.limit) + 1
      })
      this.$set(this.table, 'datas', res.records || [])
    },
    // 翻页获取列表
    pageChange(param) {
      this.tableParam.pageSize = param.size
      this.tableParam.currPage = param.page
      this.getTableData()
    }
  }
}
</script>

<style lang="stylus">

</style>
