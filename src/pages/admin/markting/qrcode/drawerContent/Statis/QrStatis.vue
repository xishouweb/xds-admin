<template>
  <div class="statisWrap">
    <div class="statisDate">
      <RadioGroup v-model="curDate" type="button" @on-change="changeType">
        <Radio label="1">
          <span>累计时间</span>
        </Radio>
        <Radio label="2">
          <span>今天</span>
        </Radio>
        <Radio label="3">
          <span>昨天</span>
        </Radio>
        <Radio label="4">
          <span>最近7天</span>
        </Radio>
        <Radio label="5">
          <span>最近30天</span>
        </Radio>
      </RadioGroup>
      <DatePicker
        @on-change="changeDateType"
        :value="curDateRange"
        size="large"
        format="yyyy/MM/dd"
        type="daterange"
        placement="bottom-end"
        placeholder="请选择时间段"
        style="width: 196px"
        :options="dateOptions"
      ></DatePicker>
    </div>
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
      <template v-if="curStatisMapOption">
        <div class="statisTChart">
          <vchart :options="curStatisMapOption"></vchart>
        </div>
      </template>
      <template v-else>
        <div class="statisNoChart">
          <span>暂无数据</span>
        </div>
      </template>
      <div class="statisTip">温馨提示：以上数据包含渠道二维码被删除前的数据，删除后不统计在内。</div>
    </div>
    <div class="drawer-footer" v-if="showFooter">
      <Button style="width: 120px; margin-right: 15px" type="primary" @click="create">新建二维码</Button>
      <Button style="width: 120px; margin-right: 15px" @click="cancle">返回</Button>
    </div>
  </div>
</template>

<script>
import _ from "lodash"
import dayjs from "dayjs"
import {
  getChannelQrCodeStatisticsList,
  getChannelQrCodeStatistics
} from "@/api/markting"
const fieldObj = {
  scanNum: "累计扫码次数",
  followersNum: "累计关注人数",
  followedNum: "已关注",
  cancelFollowNum: "已取消"
}
export default {
  name: "statis",
  components: {
    "vchart": () => import('@/components/echarts.vue'),
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
    },
    curPublic: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      curDate: "1",
      statisCount: {},
      statisMapList: [],
      curStatisMapOption: {},
      curStatis: {}, // 当前统计目标
      curDateRange: [],
      dateOptions: {
        disabledDate: date => {
          // 创建时间
          if (this.params.createTime) {
            if (
              dayjs(this.params.createTime).valueOf() >
              Date.now() - 86400000 * 90
            ) {
              return (
                date.valueOf() <
                  dayjs(
                    dayjs(this.params.createTime).format("YYYY-MM-DD")
                  ).valueOf() || date.valueOf() > Date.now()
              )
            }
          }
          return (
            date.valueOf() < Date.now() - 86400000 * 90 ||
            date.valueOf() > Date.now()
          )
        }
      }
    }
  },
  computed: {
    list() {
      return [
        {
          name: "累计扫码次数",
          type: "scanNum",
          count: this.statisCount.scanNum || 0
        },
        {
          name: "累计关注人数",
          type: "followersNum",
          count: this.statisCount.followersNum || 0
        },
        {
          name: "已关注",
          type: "followedNum",
          count: this.statisCount.followedNum || 0
        },
        {
          name: "已取消",
          type: "cancelFollowNum",
          count: this.statisCount.cancelFollowNum || 0
        }
      ]
    }
  },
  watch: {
    params: {
      handler(val) {
        if (val) {
          this.init()
        }
      },
      deep: true
    },
    curStatis: {
      handler(val) {
        if (val) {
          this.formatMapOption(val.type)
        }
      },
      deep: true
    }
  },
  created() {
    // 初始化数据
    this.init()
  },
  methods: {
    async init(params, value) {
      await this.getStatisCount(params)
      await this.getStatisMap(params, value)
    },
    handleClick(item) {
      this.curStatis = item
    },
    changeType(value) {
      this.curDateRange = []
      // 获取数据
      const params = this.formatParams(value)
      this.init(params, value)
    },
    changeDateType(value) {
      const params = {
        countType: "day",
        startTime: dayjs(value[0]).format("YYYY-MM-DD 00:00:00"),
        endTime: dayjs(value[1])
          .add(1, "day")
          .format("YYYY-MM-DD HH:mm:ss")
      }
      this.reactCurDate(params)
      this.init(params, value)
    },
    reactCurDate(params) {
      this.curDate = 0
      if (dayjs().diff(dayjs(params.startTime),'day') === 0) {
        this.curDate = '2'
      }
      if (dayjs().diff(dayjs(params.startTime),'day') === 1) {
        this.curDate = '3'
      }
      if (dayjs().diff(dayjs(params.startTime),'day') === 7) {
        this.curDate = '4'
      }
      if (dayjs().diff(dayjs(params.startTime),'day') === 30) {
        this.curDate = '5'
      }
    },
    cancle() {
      this.drawer.show = false
    },
    // 新建二维码
    create() {
      this.drawer.fn && this.drawer.fn(this.drawer.params)
    },
    formatMapOption(type) {
      // 按月， 日，时展示
      let xAxisData = []
      xAxisData = this.statisMapList.map(item => {
        return item.time
      })
      const seriesData = this.statisMapList.map(item => {
        return item[type] || 0
      })
      if (this.statisMapList.length) {
        this.curStatisMapOption = {
          tooltip: {
            trigger: "axis",
            padding: [12, 15],
            backgroundColor: "#303133",
            extraCssText: "box-shadow: 0px 2px 6px 0px rgba(0,0,0,0.8)",
            textStyle: {
              fontFamily: "MicrosoftYaHei",
              fontSize: 14,
              lineHeight: 14
            },
            axisPointer: {
              type: "line",
              label: {
                backgroundColor: "#6a7985"
              }
            },
            formatter: params => {
              let res = "时间：" + params[0].name
              if (this.curDate === "2" || this.curDate === "3") {
                res = "时间：" + params[0].name + ":00"
              }
              params.forEach(function(item) {
                res = item.seriesName + "：" + item.data + "<br>" + res
              })
              return res
            }
          },
          xAxis: {
            type: "category",
            data: xAxisData
          },
          yAxis: {
            type: "value"
          },
          series: [
            {
              name: fieldObj[type],
              data: seriesData,
              type: "line",
              color: "#409eff",
              itemStyle: {
                normal: {
                  color: "#409eff"
                }
              },
              lineStyle: {
                color: '#409eff',
                width: 1,
              },
              areaStyle: {
                color: "#409eff",
                opacity: 0.15
              }
            }
          ]
        }
      } else {
        this.curStatisMapOption = null
      }
    },
    formatParams(type) {
      switch (type) {
        case "1":
          return {
            countType: "month",
            startTime: dayjs(this.params.createTime).format("YYYY-MM-DD 00:00:00"),
            endTime: dayjs().format("YYYY-MM-DD HH:mm:ss")
          }
        case "2":
          return {
            countType: "hour",
            startTime: this.formatZeroTime(),
            endTime: dayjs().format("YYYY-MM-DD HH:mm:ss")
          }
        case "3":
          return {
            countType: "hour",
            startTime: this.formatZeroTime(1),
            endTime: this.formatZeroTime()
          }
        case "4":
          return {
            countType: "day",
            startTime: this.formatZeroTime(7),
            endTime: dayjs().format("YYYY-MM-DD HH:mm:ss")
          }
        case "5":
          return {
            countType: "day",
            startTime: this.formatZeroTime(30),
            endTime: dayjs().format("YYYY-MM-DD HH:mm:ss")
          }
      }
    },
    formatZeroTime(day) {
      day = day || 0
      return dayjs(
        dayjs()
          .subtract(day, "day")
          .format("YYYY-MM-DD")
      ).format("YYYY-MM-DD HH:mm:ss")
    },
    async getStatisCount(params) {
      const id = this.params.id
      const appAccountId = this.curPublic.appAccountId
      if (!params) {
        params = {
          countType: "month",
          startTime: dayjs(this.params.createTime).format("YYYY-MM-DD 00:00:00"),
          endTime: dayjs().format("YYYY-MM-DD HH:mm:ss")
        }
      }
      const response = await getChannelQrCodeStatistics({
        ...params,
        id,
        appAccountId
      })
      if (response.code === 1 && response.data) {
        this.statisCount = response.data
      }
    },
    async getStatisMap(params, value) {
      const id = this.params.id
      const appAccountId = this.curPublic.appAccountId
      if (!params) {
        params = {
          countType: "month",
          startTime: dayjs(this.params.createTime).format("YYYY-MM-DD 00:00:00"),
          endTime: dayjs().format("YYYY-MM-DD HH:mm:ss")
        }
      }
      const response = await getChannelQrCodeStatisticsList({
        ...params,
        id,
        appAccountId
      })
      if (response.code === 1 && response.data) {
        this.statisMapList = this.createNullData(value || '1', response.data)
        // 模拟点击第一个 获取累计扫码
        this.handleClick(this.list[0])
      }
    },
    createNullData(type, data) {
      // 今天，昨天，最近7天，最近30天，时间段
      if (!data.length) {
        return []
      }
      data = [...data]
      let list = [] // 新数据
      if (type === "1") {
        list = this.handleMonth(data)
      }
      if (type === "2") {
        list = this.handleHour(dayjs().hour(), data)
      }
      if (type === "3") {
        list = this.handleHour(23, data)
      }
      // 按日期
      if (type === "4") {
        list = this.handleDay(dayjs(this.formatZeroTime(-1)), 7, data)
      }
      if (type === "5") {
        list = this.handleDay(dayjs(this.formatZeroTime(-1)), 30, data)
      }
      if (typeof type === "object") {
        const day =
          (dayjs(type[1])
            .add(1, "day")
            .valueOf() -
            dayjs(type[0]).valueOf()) /
          86400000
        list = this.handleDay(dayjs(type[1]).add(1, "day"), day, data)
      }
      return list
    },
    handleMonth(data) {
      let list = []
      let len = null
      const startMonth =
        dayjs(this.params.createTime).year() * 12 + dayjs(this.params.createTime).month()
      const endMonth = dayjs().year() * 12 + dayjs().month()
      len = endMonth - startMonth + 1
      while (len >= 1) {
        let calcDate = dayjs().subtract(len - 1, "month")
        let calcYear = calcDate.year()
        let calcMonth = calcDate.month() + 1
        const target = _.find(
          data,
          item => item.year === calcYear && item.month === calcMonth
        )
        if (target) {
          list = [...list, { ...target, time: calcYear + "/" + calcMonth }]
        } else {
          list = [
            ...list,
            {
              ...data[0],
              cancelFollowNum: 0,
              followedNum: 0,
              followersNum: 0,
              scanNum: 0,
              time: calcYear + "/" + calcMonth,
              month: calcMonth,
              year: calcYear
            }
          ]
        }
        len--
      }
      return list
    },
    handleHour(taggetHour, data) {
      data = this.handleSameHourData(data)
      let list = []
      let hour = 0
      while (hour <= taggetHour) {
        const target = _.find(
          data,
          item => dayjs(item.recordTime).hour() === hour
        )
        if (target) {
          list = [
            ...list,
            { ...target, time: dayjs(target.recordTime).hour() }
          ]
        } else {
          list = [
            ...list,
            {
              ...data[0],
              cancelFollowNum: 0,
              followedNum: 0,
              followersNum: 0,
              scanNum: 0,
              time: hour < 10 ? "0" + hour : hour,
              recordTime: dayjs(data[0].recordTime)
                .set("hour", hour)
                .format("YYYY-MM-DD HH:mm:ss")
            }
          ]
        }
        hour++
      }
      return list
    },
        handleSameHourData(data) {
      let arr = []
      for (let i = 0; i < data.length; i++) {
        let flag = false
        for (let j = 0; j < arr.length; j++) {
          if (
            dayjs(data[i].recordTime).hour() === dayjs(arr[j].recordTime).hour()
          ) {
            arr[j] = {
              ...arr[j],
              cancelFollowNum: arr[j].cancelFollowNum + data[i].cancelFollowNum,
              followedNum: arr[j].followedNum + data[i].followedNum,
              followersNum: arr[j].followersNum + data[i].followersNum,
              scanNum: arr[j].scanNum + data[i].scanNum
            }
            flag = true
            break
          }
        }
        !flag && arr.push(data[i])
      }
      return arr
    },
    handleDay(taggetDate, len, data) {
      let list = []
      let date = len
      while (date >= 1) {
        let calcDate = taggetDate.subtract(date, "day")
        const target = _.find(data, item => {
          return calcDate.isSame(
            dayjs(`${item.year}-${item.month}-${item.day}`)
          )
        })
        if (target) {
          list = [
            ...list,
            {
              ...target,
              time: calcDate.format("MM/DD")
            }
          ]
        } else {
          list = [
            ...list,
            {
              ...data[0],
              cancelFollowNum: 0,
              followedNum: 0,
              followersNum: 0,
              scanNum: 0,
              time: calcDate.format("MM/DD"),
              year: calcDate.year(),
              month: calcDate.month() + 1,
              day: calcDate.date()
            }
          ]
        }
        date--
      }
      return list
    }
  }
}
</script>

<style lang="stylus">
.statisWrap
  margin-top 40px
  .statisDate
    margin-bottom 40px
    .ivu-radio-group-item
      transition none
    .ivu-radio-group-item.ivu-radio-wrapper-checked
      background-color #409eff
      color #fff
    .ivu-date-picker
      margin-left 4px
      .ivu-input.ivu-input-large
        height 32px
      .ivu-icon
        height 32px
        line-height 32px
  .statisList
    display flex
    justify-content space-between
    font-size 14px
    .statisItem
      width: 140px;
      height: 87px;
      padding 20px 25px
      text-align center
      background-color #ffffff
      .name
        font-size: 14px;
        color: #606366;
      .count
        margin-top 10px
        font-size 20px
      &.active
        border-radius 3px
        border solid 1px #409eff
  .statisChart
    margin-top 30px
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
    .statisNoChart
      height 300px
      display flex
      align-items center
      justify-content center
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
