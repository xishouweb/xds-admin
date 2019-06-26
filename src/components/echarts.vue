<template>
  <div :class="className" :id="id" :style="{height:height,width:width}" ref="myEchart">
  </div>
</template>
<script>
import echarts from 'echarts'
export default {
  props: {
    className: {
      type: String,
      default: 'yourClassName'
    },
    id: {
      type: String,
      default: 'yourID'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '100%'
    },
    options: {
        type: [Array, Object],
        default: () => {
            return []
        }
    }
  },
  data() {
    return {
      chart: null
    }
  },
  mounted() {
    this.initChart()
    window.addEventListener('resize', () => {
      this.chart && this.chart.resize()
    })
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  watch: {
    options: {
        handler(curVal, oldVal) {
            this.initChart(curVal)
        },
        deep: true
    }
  },
  methods: {
    initChart() {
        // let options = this.setOption(param);
        this.chart = echarts.init(this.$refs.myEchart)
        // 把配置和数据放这里
        this.chart.setOption(this.options)
    }
  }
}
</script>
