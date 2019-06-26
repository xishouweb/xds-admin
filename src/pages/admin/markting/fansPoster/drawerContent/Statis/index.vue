<template>
  <div class="statisWrap">
    <div class="statisList">
      <div
        class="statisItem"
        :class="{active: item.name === curStatis.name}"
        v-for="(item, index) in list"
        :key="index"
        @click="handleClick(item)"
      >
        <p class="name">{{item.name}}</p>
        <p class="count">{{item.count}}</p>
      </div>
    </div>
    <div class="statisChart">
      <div class="statisTarget">
        <p class="statisTTitle">{{curStatis.name}}</p>
        <div class="statisTDate">
          <DatePicker
            :value="curDateRange"
            format="yyyy/MM/dd"
            type="daterange"
            placement="bottom-end"
            placeholder="请选择时间段"
            style="width: 220px"
          ></DatePicker>
        </div>
      </div>
      <div class="statisTChart">
        <v-chart :options="option"/>
      </div>
      <div class="statisTip">温馨提示：以上数据包含渠道二维码被删除前的数据，删除后不统计在内。</div>
    </div>
    <div class="drawer-footer" v-if="showFooter">
      <Button style="width: 120px; margin-right: 15px" type="primary" @click="create">新建二维码</Button>
      <Button style="width: 120px; margin-right: 15px" @click="cancle">返回</Button>
    </div>
  </div>
</template>

<script>
// import ECharts from "vue-echarts/components/ECharts"
// import "echarts/lib/chart/line"
export default {
  name: "statis",
  components: {
    "v-chart": () => import('@/components/echarts.vue'),
  },
  props: {
    params: {
      type: Object,
      default() {
        return {}
      }
    },
    drawer: {
      type: Object,
      default() {
        return {}
      }
    },
    showFooter: {
      type: Boolean,
      default() {
        return true
      }
    }
  },
  data() {
    return {
      list: [],
      curStatis: {},
      curDateRange: [],
      curStatisData: [],
      option: {
        xAxis: {
          type: "category",
          data: ["12/29", "12/30", "12/31", "1/1", "1/2", "1/3", "1/4"]
        },
        yAxis: {
          type: "value"
        },
        series: [
          {
            data: [820, 932, 901, 934, 1290, 1330, 1320],
            type: "line",
            color: "#409eff"
          }
        ]
      }
    }
  },
  created() {
    // 初始化数据
    this.init()
  },
  methods: {
    async init() {
      const response = [
        {
          name: "二维码总数",
          count: "200"
        },
        {
          name: "累计扫码",
          count: "200"
        },
        {
          name: "累计关注",
          count: "200"
        },
        {
          name: "已关注",
          count: "200"
        },
        {
          name: "已取消",
          count: "200"
        }
      ]
      this.list = response
      // 模拟点击第一个
      this.handleClick(response[0])
    },
    async getStatusData() {
      // curStatis
      this.curStatisData = []
    },
    handleClick(item) {
      this.curStatis = item
      this.getStatusData()
    },
    cancle() {
      this.drawer.show = false
    },
    // 新建二维码
    create() {
      this.$router.push({ name: "qrcodeEdit", params: { id: this.drawer.param.id } })
    }
  }
}
</script>

<style lang="stylus" scoped>
.statisWrap
  margin-top 40px
  .statisList
    display flex
    justify-content space-between
    font-size 14px
    .statisItem
      padding 20px 25px
      text-align center
      background-color #ffffff
      .count
        margin-top 8px
        font-size 20px
      &.active
        border-radius 3px
        border solid 1px #409eff
  .statisChart
    margin-top 60px
    .statisTarget
      display flex
      justify-content space-between
      align-items center
    .statisTChart
      margin-top 15px
      height 340px
    .statisTip
      margin-left 30px
      font-size 12px
      color #979899
  .echarts
    width 100%
    height 100%
  .drawer-footer
    border-top solid 1px #edeff0
    position absolute
    background-color #fff
    left 0
    bottom 0
    width 100%
    height 60px
    line-height 60px
    text-align center
    z-index 12
</style>
