<template>
  <div class="tablePay">
    <table class="table-list" >
      <thead>
        <tr class="tr-th">
          <th class="th" v-for="(item, index) in columns" v-if="tableType=='old'" :key="index">
            <span class="span">{{item}}</span>
            <Poptips v-if="index == 6" width="273" content="抵扣小计=原套餐剩余天数x每天价格（每天价格=实付款/套餐有效时间）"></Poptips>
          </th>
          <th class="th" v-for="(item, index) in columns1" v-if="tableType=='new'" :key="index">
            <span>{{item}}</span>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr class="tr-td">
          <td class="td" v-for="(obj, key, idx) in buyInfo" :key="idx">
            <span v-if="key ==='price' || key ==='discountsPrice' ||key ==='countPrice' ||key ==='goodsDiscountsPrice' ||key ==='orderPayprice' ||key ==='minusPrice'">￥</span>
            <span v-if="key === 'countPrice' || key === 'minusPrice'">{{insertPoint(obj)}}</span>
            <span v-else>{{obj}}</span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script>
import Const from './const'
export default {
  name: 'tablePay',
  props: {
    tableType: {
      type: String,
      default: 'new'
    },
    buyInfo: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      columns: Const.columns,
      columns1: Const.columns1
    }
  },
  mounted() {},
  methods: {}
}
</script>
<style lang="stylus">
@import '~@/assets/stylus/mixin'
.tablePay
  .table-list
    width 100%
    text-align left
    .tr-th
      text-align left
      height 45px
      line-height 45px
      background-color #f7f9fa
      border-bottom solid 1px #edeff0
      border-top solid 1px #edeff0
      .th
        text-align left
        padding-left 20px
        color #606366
        .span
          margin-right 5px
    .tr-td
      height 90px
      border-bottom solid 1px #edeff0
      .td
        vertical-align middle
        padding-left 20px
        &:nth-last-of-type(1)
          color #f56c6c
        span
          white-space: nowrap;
</style>
