<template>
  <div id="pages">
    <Page
        class-name="pages"
        show-elevator
        v-if="pagination"
        :page-size='pageSize'
        :total="pageTotal"
        :current="currPage"
        show-total
        show-sizer
        @on-change="pageChange"
        @on-page-size-change="pageSizeChange"
        ></Page>
  </div>
</template>
<script>
  export default {
    name: '',
    data() {
      return {
        currPage: 1,
        pageSize: 10,
        pageParam: {}
      }
    },
    props: {
      pagination: {
        type: Boolean,
        default: true
      },
      pageTotal: {
        type: Number,
        default: 0
      }
    },
    created() {

    },
    components: {},
    methods: {
      pageChange(page) {
        if (page !== this.currPage) {
          this.currPage = page
          this._BUS.$emit('handleOrder', 'getRecords')
        }
      },
      pageSizeChange(pageSize) {
        if (this.pageSize !== pageSize) {
          this.pageSize = pageSize
          this._BUS.$emit('handleOrder', 'getRecords')
        }
      },
      getParams() {
        return {
          offset: (this.currPage - 1) * this.pageSize,
          limit: this.pageSize
        }
      }
    }
  }
</script>
<style lang="stylus">
@import '~@/assets/stylus/index'
  #pages
    mt(20px)
    fr()
</style>
