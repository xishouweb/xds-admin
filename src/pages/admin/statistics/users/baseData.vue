<template>
  <div>
    <div class="text-strong">
      <span class="border-left">综合数据</span>
      <Poptip trigger="hover" transfer placement="right-start"  popper-class="poptip-text" >
        <i class="icon" style="color: #979899;">&#xe635</i>
        <div slot="content" style="width: 227px; whiteSpace: normal">
          <p class="pop-h">综合数据统计绑定到我们系统截止到昨天的数据，可能与粉丝管理页的数据不一致。</p>
          <p class="pop-h">公众号数量</p>
          <p>已绑定的公众号数量，不包含停用、禁用的公众号，不包含未认证的公众号。</p>
          <p class="pop-h">粉丝总数</p>
          <p>关注过公众号的粉丝数量，包含已取消的数量。</p>
          <p class="pop-h">关注中人数</p>
          <p >累计关注中的人数。</p>
          <p class="pop-h">已取消人数</p>
          <p>关注后取消关注的人数。</p>
          <p class="pop-h">关注占比</p>
          <p >选择的公众号的关注人数除以选择的公众号的粉丝总数。</p>
          <p class="pop-h">取消占比</p>
          <p>选择的公众号的取消人数除以选择的公众号的粉丝总数。</p>
        </div>
      </Poptip>
    </div>

    <Row class="center">
      <Col class="margintb20" span="8" v-for="(item, index) in datalist" :key="index">
        <div class="text-light">{{item.name}}</div>
        <div class="text-strong fn24 margintb20">{{item.value}}</div>
      </Col>
    </Row>
  </div>
</template>

<script>
import { addComma } from '@/utils/util'

export default {
  props: ['data'],
  watch: {
    data(nv) {
      this.getPublicAccountUserCount()
    }
  },
  mounted() {
      this.getPublicAccountUserCount()
  },
  data() {
    return {
      datalist: [
        {
          name: '公众号数量',
          value: '暂无数据'
        },
        {
          name: '粉丝总数',
          value: '暂无数据'
        },
        {
          name: '关注中人数',
          value: '暂无数据'
        },
        {
          name: '已取消人数',
          value: '暂无数据'
        },
        {
          name: '关注占比',
          value: '暂无数据'
        },
        {
          name: '取消占比',
          value: '暂无数据'
        }
      ]
    }
  },
  methods: {
    rowClassName (row, index) {
      if (index === 1) {
          return 'demo-table-info-row'
      } else if (index === 3) {
          return 'demo-table-error-row'
      }
      return ''
    },
    async getPublicAccountUserCount() {
      let data = this.data
      let total = data.totalCancelUser + data.cumulateUser
      this.datalist[0].value = addComma(data.publicNum) || 0
      this.datalist[1].value = addComma(total) || 0
      this.datalist[2].value = addComma(data.cumulateUser) || 0
      this.datalist[3].value = addComma(data.totalCancelUser) || 0
      this.datalist[4].value = (parseFloat(data.cumulateUser / total * 100).toFixed(2) || 0) + '%'
      this.datalist[5].value = (parseFloat(data.totalCancelUser / total * 100).toFixed(2) || 0) + '%'
      this.datalist = this.deepCopy(this.datalist)
    }
  }
}
</script>

<style lang="stylus">
  .ivu-table .demo-table-info-row td{
      background-color: #2db7f5;
      color: #fff;
  }
  .ivu-table .demo-table-error-row td{
      background-color: #ff6600;
      color: #fff;
  }
</style>
