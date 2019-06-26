<template>
    <div id="ykt-table" >
      <slot name="header"></slot>
      <component :is="bscroll" :offsetBottom="80" :data="datas">
        <slot name="main" >
          <Table ref="yktTableBody"
          :loading="loading"
          @on-row-click="rowClick"
          :columns="columns"
          :data="datas"
          :no-data-text="noDatatext"
          @on-selection-change="selectionChange"
          @on-sort-change="changeOrder"></Table>
        </slot>
      </component>
      <slot name="footer"></slot>
    </div>
</template>
<script>
import tableMixin from './tableMixin.js'
    export default {
      name: 'ykt-Table',
      data() {
          return {
            loading: false,
            preOrder: '',
          }
      },
      mixins: [tableMixin],
      props: {
        columns: {
          type: Array,
          default: () => { return [] }
        },
        datas: {
          type: Array,
          default: () => { return [] }
        },
        pageTotal: {
          type: Number,
          default: 0
        },
        noDatatext: {
          type: String,
          default: ''
        },
        outputFileName: {
          type: String,
          default: '用户数据'
        },
        bscroll: {
          type: String,
          default: 'BScroll'
        }
      },
      watch: {
        datas() {
          this.selection = []
          this.emitCheckedAll(false)
        }
      },
      created() {
        this.onCheckedAll(this.handleSelectAll)
        this.computedCheckBoxNumber()
        this.$on("exportCsv", () => {
          // 去除不必要的列，将null值替换为0，将完成状态由文字转换为汉字
          let data = this.deepCopy(this.datas)
          data.forEach(item => {
            for (let k in item) {
              item[k] = item[k] === null ? 0 : item[k]
              if (k === 'completeStatus') {
                item[k] = item[k] === 0 ? '完成' : '未完成'
              }
            }
          })

          this.$refs.yktTableBody.exportCsv({
            filename: this.outputFileName + new Date().toLocaleDateString(),
            columns: this.columns.slice(1, -1),
            data: data
          })
        })
      },
      methods: {
        rowClick(val) {

        },
        // 导出数据
        exportCsv() {
          this.$refs.table.exportCsv({
            filename: '用户数据',
            columns: this.columns,
            data: this.datas
          })
        },
        changeOrder(param) {
          param.order !== 'normal' && (this.preOrder = param.order)
          let arg = {
            key: param.key,
            order: (param.order === 'normal' ? this.preOrder : param.order).toUpperCase()
          }
          this.$emit('sortChange', arg)
        },
        selectionChange(selection) {
          let isAllChoosed = (this.datas.length && selection.length === this.datas.length)
          this.selection = selection
          this.emitCheckedAll(isAllChoosed)
        },
        handleSelectAll (status) {
          this.$refs.yktTableBody.selectAll(status)
        }
      },
      updated() {

      }
    }
</script>
<style lang="stylus">
@import '~@/assets/stylus/index'
  #ykt-table
    .no_data
      margin:0 auto
      text-align:center
      vertical-align:middle
      .no_wrap
        width:200px
        inline()
        mt(200px)
        img, p, button
          inline()
        p
          margin: 10px 0
  .action.ivu-poptip-poppe .ivu-poptip-arrow:after
    right: 0 !important
  .action.ivu-poptip-popper .ivu-poptip-body
    padding: 8px 0 !important
  .action.ivu-poptip-popper .ivu-poptip-body .action-item {
    text-align: center;
    height: 30px;
    line-height:30px;
  }
  .action.ivu-poptip-popper .ivu-poptip-body .action-item:hover {
    background-color: #409eff;
    cursor: pointer;
    color: #fff;
  }
  .ivu-table-tip
    span
      display inline-block
      padding 57px
      font-size: 14px;
	    color: #979899;
</style>
