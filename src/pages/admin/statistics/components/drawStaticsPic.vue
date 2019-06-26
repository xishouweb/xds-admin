<template>
  <div class="echart-statisWrap">
    <div class="echart-statisDate">
      <RadioGroup v-model="curDate" type="button" @on-change="changeType">
        <Radio v-if="!forbiddenTime.includes(1)" label="1">
          <span>累计时间</span>
        </Radio>
        <Radio v-if="!forbiddenTime.includes(2)" label="2">
          <span>今天</span>
        </Radio>
        <Radio v-if="!forbiddenTime.includes(3)" label="3">
          <span>昨天</span>
        </Radio>
        <Radio v-if="!forbiddenTime.includes(4)" label="4">
          <span>最近7天</span>
        </Radio>
        <Radio v-if="!forbiddenTime.includes(5)" label="5">
          <span>最近30天</span>
        </Radio>
      </RadioGroup>
      <DatePicker
        v-if="!forbiddenTime.includes(6)"
        @on-change="changeDateType"
        :value="curDateRange"
        size="large"
        format="yyyy/MM/dd"
        type="daterange"
        placement="bottom-end"
        placeholder="请选择时间段"
        style="width: 240px;"
        :options="dateOptions"
      ></DatePicker>
    </div>

    <div class="echart-statisList">
      <template v-if="selectType">
      <div
        class="echart-statisItem"
        :style="{width: `${100/ list.length}%`}"
        :class="{active: item.name === curStatis.name}"
        v-for="(item, index) in list"
        :key="index"
        @click="handleClick(item)"
      >
        <p class="echart-name text-light">{{item.name}}</p>
        <p class="echart-count text-strong fn24">{{item.count}}</p>
      </div>
      </template>
      <template v-else>
        <slot name="label"></slot>
        <Select :value="curStatis.type" size="small" not-found-text="无匹配数据" style="padding-left: 10px; width:160px">
        <Option v-for="(item, index) in list"  @click.native="handleClick(item)"
            :key="index" :value="item.type">{{item.name}}</Option>
        </Select>
      </template>
    </div>


    <div class="echart-statisChart">
      <template v-if="curStatisMapOption">
        <div class="echart-statisTChart">
          <v-chart :options="curStatisMapOption"/>
        </div>
      </template>
      <template v-else>
        <div class="echart-statisNoChart">
          <span>暂无数据</span>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import _ from "lodash"
import dayjs from "dayjs"

export default {
  name: "statis",
  components: {
    "v-chart": () => import('@/components/echarts.vue'),
  },
  props: {
    initTimeRange: {
      type: Array,
      default() {
        return []
      }
    },
    forbiddenTime: {
      type: Array,
      default() {
        return []
      }
    },
    statisCountData: {
      type: [Object,Array],
      default() {
        return {}
      }
    },
    statisList: {
      type: [Object,Array],
      default() {
        return []
      }
    },
    initDateType: {
      type: String,
      default: "2"
    },
    dataType: {
      type: Array,
      default() {
        return [
          {
            name: "1",
            type: "a",
          },
          {
            name: "2",
            type: "b",
          },
          {
            name: "3",
            type: "c",
          },
          {
            name: "4",
            type: "d",
          }
        ]
      }
    },
    selectType: {
      type: Number,
      default: 1
    },
    params: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  watch: {
    statisCountData(nv) {
      this.list = this.dataType.map(item => {
        return {
          ...item,
          count: nv[item.type] || 0
        }
      })
      this.statisCount = nv
    },
    statisList(nv) {
      this.statisMapList = this.selectedMethod === 1
                          ? this.createNullData(this.curDate, nv) : this.createNullData(this.curDateRange, nv)
      this.$emit('data-create', this.statisMapList)
        // 模拟点击第一个/上次选中的
      this.handleClick(this.deepCopy(this.preSelectedCurStatis || this.list[0]))
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
  data() {
    return {
      list: [],
      zeroValue: {},
      curDate: this.initDateType,
      selectedMethod: 1,
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
                  ).valueOf() || date.valueOf() > Date.now() - 86400000
              )
            }
          }
          return (
            date.valueOf() < Date.now() - 86400000 * 90 ||
            date.valueOf() > Date.now() - 86400000
          )
        }
      },
      preSelectedCurStatis: null
    }
  },
  mounted() {
    this.createZeroData()
    this.curDateRange = this.initTimeRange
  },
  methods: {
    handleClick(item) {
      this.preSelectedCurStatis = item
      this.curStatis = item
    },
    changeType(value) {
      this.selectedMethod = 1
      this.curDate = value
      this.curDateRange = []
      // 获取数据
      const params = this.formatParams(value)
      this.curDateRange = [params.startTime, dayjs(params.endTime).subtract(1, "day").format("YYYY-MM-DD")]
      this.$emit("changeSelection", {...params, endTime: dayjs(params.endTime).subtract(1, "day").format("YYYY-MM-DD")})
    },
    changeDateType(value) {
      this.selectedMethod = 2
      this.curDateRange = value

      const params = {
        countType: "day",
        startTime: dayjs(value[0]).format("YYYY-MM-DD HH:mm:ss"),
        endTime: dayjs(value[1])
          .format("YYYY-MM-DD HH:mm:ss")
      }
      this.reactCurDate(params)
      this.$emit("changeSelection", params)
    },
    reactCurDate(params) {
      this.curDate = 0
      if (dayjs().diff(dayjs(params.endTime),'day') > 1) {
        return
      }
      if (dayjs().diff(dayjs(params.startTime),'day') === 7) {
        this.curDate = '4'
      }
      if (dayjs().diff(dayjs(params.startTime),'day') === 30) {
        this.curDate = '5'
      }
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
              let res = "时间:" + params[0].name
              if (this.curDate === "2" || this.curDate === "3") {
                res = "时间:" + params[0].name + ":00"
              }
              params.forEach(function(item) {
                res = item.seriesName + ":" + item.data + "<br>" + res
              })
              return res
            }
          },
          grid: {
            x: 40,
            y: 20,
            x2: 40,
            y2: 40
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
              name: (this.list.find(i => i.type === type) || {}).name,
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
            startTime: this.params.createTime,
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
            endTime: this.formatZeroTime()
          }
        case "5":
          return {
            countType: "day",
            startTime: this.formatZeroTime(30),
            endTime: this.formatZeroTime()
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
    createNullData(type, data) {
      // 今天，昨天，最近7天，最近30天，时间段
      if (!Array.isArray(data)) {
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
        list = this.handleDay(dayjs(this.formatZeroTime()), 7, data)
      }
      if (type === "5") {
        list = this.handleDay(dayjs(this.formatZeroTime()), 30, data)
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
              ...this.zeroValue,
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
    },
    createZeroData() {
      this.dataType.forEach(item => {
        this.zeroValue[item.type] = 0
      })
    }
  }
}
</script>
<style lang="stylus">
.echart-statisWrap
  .echart-statisList:after
    display block
    width 100%
    height 1px
    content "."
    clear both
  .echart-statisItem
    float left
    padding-top 18px
    height: 90px;
    text-align center
    background-color #ffffff
    border-radius 3px
    .echart-count
      margin-top 4px
    &.active
      border solid 1px #409eff
    &:hover
      background-color #e6f0f5;
  .echart-statisChart
    .echart-statisTarget
      display flex
      justify-content space-between
      align-items center
    .echart-statisTChart
      margin-top 0px
      height 340px
    .echart-statisNoChart
      height 300px
      display flex
      align-items center
      justify-content center
      color #979899
   .ivu-input-large
      height 32px !important
</style>
