<template>
  <div>
    <div class="text-strong" style="padding-left: 10px"><span class="border-left" >来源统计（关注中人数）</span></div>
    <Row :gutter="16">
      <Col span="15">
        <v-chart style="width: 100%;height: 349px;" :options="curStatisMapOption"/>
      </Col>
      <Col span="8" offset="1">
      <template v-for="(item, index) in pieData" >
        <div class="text-small margintb20" :key="index" v-if="item.show">
          <div class="echarts-pie-tool-pointer" :style="{background: item.color}"></div>
          <span>{{item.name}}</span><span class="padding20">{{item.precent}}%</span>
        </div>
      </template>
      </Col>
    </Row>
  </div>
</template>

<script>
import { mapState } from "vuex"
const pie = [
  {
    color: '#0000ce',
    name: '搜索公众号',
    show: true
  },
  {
    color: '#fe6802',
    name: '扫渠道二维码',
    show: true
  },
  {
    color: '#ff1100',
    name: '裂变海报',
    show: false
  },
  {
    color: '#00c45c',
    name: '扫公众号二维码',
    show: false
  },
  {
    color: '#fffb4a',
    name: '图文页内名称点击',
    show: true
  },
  {
    color: '#3c80ff',
    name: '图文页右上角菜单',
    show: true
  },
  {
    color: '#ffc107',
    name: '名片分享',
    show: true
  },
  {
    color: '#bd1ee5',
    name: '支付后关注',
    show: true
  },
  {
    color: '#00cdff',
    name: '公众号迁移',
    show: true
  },
  {
    color: '#5bfa66',
    name: '其他',
    show: true
  }
]
export default {
  components: {
    "v-chart": () => import('@/components/echarts.vue'),
    HeaderTitle: () => import('@/components/pageStyle/headerTitle.vue'),
    PragraphTitle: () => import('@/components/pageStyle/pragraphTitle.vue'),
  },
  computed: {
    ...mapState({
      currentPublicNo: state => state.publicAccount.curPublic,
      publicList: state => state.publicAccount.publicAccountList
    })
  },
  data() {
    return {
      pieColor: pie.map(item => item.color),
      pieData: [],
      curStatisMapOption: {}
    }
  },
  props: ["data"],
  watch: {
    data(nv) {
      this.initData()
    }
  },
  mounted() {
    this.initData()
  },
  methods: {
    async initData() {
      /**  userSource	新增用户来源统计，
       * 来源
       * 1代表公众号搜索
       * 30代表扫描二维码
       *
       *
       * 57代表图文页内公众号名称
       * 43代表图文页右上角菜单
       * 17代表名片分享
       * 51代表支付后关注（在支付完成页）
       * 75代表公众号文章广告
       * 0代表其他合计
       *
       * 78代表朋友圈广告
       */
      let source = (this.data || {})['userSource'] || {}
      let total = (this.data || {}).totalNewUser || 0

      this.pieData = pie.map((item, index) => {
        let value = 0
        let precent = 0

        if (index === 0) {
          value = source['1'] || 0
        } else if (index === 1) {
          value = source['30'] || 0
        } else if (index === 2) {
          value = 0
        } else if (index === 3) {
          value = 0
        } else if (index === 4) {
          value = source['57'] || 0
        } else if (index === 5) {
          value = source['43'] || 0
        } else if (index === 6) {
          value = source['17'] || 0
        } else if (index === 7) {
          value = source['51'] || 0
        } else if (index === 8) {
          // 公众号迁移
          value = source['75'] || 0
        } else if (index === 9) {
          value = source['0'] || 0
        }
        precent = parseFloat(value / total * 100 || 0).toFixed(2)

        return {
          name: item.name,
          show: item.show,
          color: item.color,
          value,
          precent
        }
      })


      this.initCircle(this.pieData)
    },
    initCircle(pieData) {
      this.curStatisMapOption = {
          tooltip: {
            trigger: "item",
            show: true,
            enterable: true,
            // showContent: true,
            padding: [4, 10],
            backgroundColor: "#000000",
            extraCssText: "box-shadow: 0px 2px 6px 0px rgba(0,0,0,0.8)",
            textStyle: {
              fontFamily: "MicrosoftYaHei",
              fontSize: 14,
              lineHeight: 14
            },
            formatter: params => {
              const {color, data} = params
              let res = `<div class="echarts-pie-tool-pointer" style="background: ${color}"></div>
                          <span>${data.name}</span>：${data.value} (${data.precent})%`
              return res
            }
          },
          color: pie.map(item => item.color),
          series: [
              {
                  name: '季度',
                  type: 'pie',
                  radius: ['60%','86%'],
                  center: ['45%', '50%'],
                  data: pieData,
                  startAngle: 0,
                  itemStyle: {
                    normal: {
                      label: {
                        show: false // 隐藏标示文字
                      },
                      labelLine: {
                        show: false // 隐藏标示线
                      }
                    }
                  }
              }
          ]
        }
    }
  }
}
</script>

<style lang="stylus">

</style>
