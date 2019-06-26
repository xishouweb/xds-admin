<template>
  <div class="statisWrap" :style="{marginTop: '20px'}">
    <div class="statisDate" :style="{marginBottom: '20px'}">
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
        style="width: 204px"
        :options="dateOptions"
      ></DatePicker>
    </div>
    <div class="statisTarget">
      <Select v-model="curDivision" style="width:100px" @on-change="changeDivision">
        <Option
          v-for="item in  division"
          :value="item.value"
          :key="item.value"
        >{{ item.label }}</Option>
      </Select>
      <PopTip></PopTip>
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
        <div class="statisTChart" :style="{height: '300px'}">
          <v-chart :options="curStatisMapOption"/>
        </div>
      </template>
      <template v-else>
        <div class="statisNoChart">
          <span>暂无数据</span>
        </div>
      </template>
    </div>
    <div class="posterInfo">
      <h4>基本信息</h4>
      <div class="baseInformation">
        <div class="basePic" v-if="statisCount" @click="showPic">
          <img :src="fansPosterBase64" alt style="max-width:100%;max-height:100%">
        </div>
        <div class="baseTime">
          <p class="p_time">
            裂变海报ID
            <span class="return_times">{{this.statisCount.fansPosterNo}}</span>
          </p>
          <p class="p_time">
            生成日期
            <span class="return_time">{{timed}}</span>
          </p>
          <p class="p_time">
            到期时间
            <span class="return_time">{{exTimed}}</span>
          </p>
        </div>
      </div>
    </div>
    <div class="drawer-footer" v-if="showFooter">
      <Button style="width: 120px; margin-right: 15px" @click="cancle">取消</Button>
    </div>
    <PicModle :param="picinfo"></PicModle>
  </div>
</template>

<script>
import _ from "lodash"
import dayjs from "dayjs"

import PopTip from "../posterInfo/statis/popTip"
import PicModle from "./picModle"
import { mapActions } from "vuex"
import {
  getFansPosterStatisticsList,
  getFansPosterStatistics
} from "@/api/poster"
const fieldObj = {
  scanNum: "累计扫码",
  followersNum: "累计关注",
  // invitedNum: "已邀请数量",
  actualFollowNum: '已邀请人数',
  cancelFollowNum: "已取消"
}

export default {
  name: "statis",
  components: {
    "v-chart": () => import('@/components/echarts.vue'),
    PopTip,
    PicModle
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
      picinfo: {
        show: false,
        imgUrl: null
      },
      division: [
        {
          value: 1,
          label: "累计统计"
        },
        {
          value: 2,
          label: "一级裂变"
        },
        {
          value: 3,
          label: "二级裂变"
        },
        {
          value: 4,
          label: "三级裂变"
        }
      ],
      curDate: "1",
      curDivision: 1,
      statisCount: {},
      fansPosterBase64: "",
      timed: null, // 生成时间
      exTimed: null, // 到期时间
      statisMapList: [],
      curStatisMapOption: {},
      curStatis: {}, // 当前统计目标
      formatStatis: {},
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
          name: "累计扫码",
          type: "scanNum",
          fissionType: "primaryFissionScanNum",
          secondType: "secondaryFissionScanNum",
          thirdType: "tertiaryFissionScanNum",
          count: this.formatStatis.scanNum || 0
        },
        {
          name: "累计关注",
          type: "followersNum",
          fissionType: "primaryFissionFollowersNum",
          secondType: "secondaryFissionFollowersNum",
          thirdType: "tertiaryFissionFollowersNum",
          count: this.formatStatis.followersNum || 0
        },
        {
          name: "已邀请人数",
          type: "actualFollowNum",
          fissionType: "primaryFissionActualFollowNum",
          secondType: "secondaryFissionActualFollowNum",
          thirdType: "tertiaryFissionActualFollowNum",
          count: this.formatStatis.actualFollowNum || 0
        },
        {
          name: "已取消",
          type: "cancelFollowNum",
          fissionType: "primaryFissionCancelFollowNum",
          secondType: "secondaryFissionCancelFollowNum",
          thirdType: "tertiaryFissionCancelFollowNum",
          count: this.formatStatis.cancelFollowNum || 0
        }
      ]
    }
  },
  watch: {
    model3(newValue) {
      this.initFissionType(newValue)
    },
    params: {
      handler(val) {
        if (val) {
          this.init()
        }
      },
      deep: true
    }
  },
  created() {
    // 初始化数据
    this.init()
    this.getFansPosterImageBase()
  },
  methods: {
    ...mapActions({
      getFansPosterImageById: "poster/getFansPosterImageById"
    }),
    getFansPosterImageBase() {
      let param = {
        appAccountId: this.curPublic.appAccountId,
        fansPosterId: this.params.id
      }
      this.getFansPosterImageById(param).then(res => {
        if (res.code === 1) {
          this.fansPosterBase64 = `data:image/${res.data.imageType};base64,${
            res.data.base64StrImage
          }`
        }
      })
    },
    async init(params, value) {
      await this.getStatisCount(params)
      await this.getStatisMap(params, value)
    },
    showPic() {
      this.picinfo = {
        show: true,
        imgUrl: this.fansPosterBase64
      }
    },
    handleClick(item) {
      this.curStatis = item
      this.formatMapOption(
        item.type,
        item.fissionType,
        item.secondType,
        item.thirdType
      )
    },
    changeDivision(curDivision) {
      this.formatStatisCount(curDivision)
      const item = this.curStatis
      this.formatMapOption(
        item.type,
        item.fissionType,
        item.secondType,
        item.thirdType
      )
    },
    changeType(value) {
      this.curDateRange = []
      this.curDivision = 1
      // 获取数据
      const params = this.formatParams(value)
      this.init(params, value)
    },
    changeDateType(value) {
      const params = {
        countType: "day",
        startTime: dayjs(value[0]).format("YYYY-MM-DD HH:mm:ss"),
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
    formatMapOption(type, fissionType, secondType, thirdType) {
      // 按月， 日，时展示
      let xAxisData = []
      xAxisData = this.statisMapList.map(item => {
        return item.time
      })
      const seriesData = this.statisMapList.map(item => {
        if (this.curDivision === 1) {
          return item[type] || 0
        } else if (this.curDivision === 2) {
          // 累计
          return item[fissionType] || 0
        } else if (this.curDivision === 3) {
          // 一级
          return item[secondType] || 0
        } else if (this.curDivision === 4) {
          // 二级
          return item[thirdType] || 0
        }
      })
      if (this.statisMapList.length) {
        this.curStatisMapOption = {
          tooltip: {
            trigger: "axis",
            show: true,
            enterable: true,
            showContent: true,
            padding: [12, 15],
            backgroundColor: "#303133",
            extraCssText: "box-shadow: 0px 2px 6px 0px rgba(0,0,0,0.8)",
            textStyle: {
              fontFamily: "MicrosoftYaHei",
              fontSize: 14,
              lineHeight: 14
            },
            position: function(point, params, dom, rect, size) {
              var x = point[0]
              var y = point[1]
              var boxWidth = size.contentSize[0]
              var boxHeight = size.contentSize[1]
              var posX = 0
              var posY = 0

              if (x < boxWidth) {
                posX = 4
              } else {
                posX = x - boxWidth
              }

              if (y < boxHeight) {
                posY = 4
              } else {
                posY = y - boxHeight
              }

              return [posX, posY]
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
              nodeStyle: {
                number: 10
              },
              symbol: 'circle'
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
      const response = await getFansPosterStatistics({
        ...params,
        id,
        appAccountId
      })
      if (response.code === 1 && response.data) {
        this.statisCount = response.data
        this.formatStatisCount(1)
        this.timed = this.statisCount.createTime.substring(0, 16)
        this.exTimed = this.statisCount.expireTime.substring(0, 16)
      }
    },
    formatStatisCount(curDivision) {
      const {
        scanNum,
        followersNum,
        invitedNum,
        cancelFollowNum,
        primaryFissionScanNum,
        primaryFissionFollowersNum,
        primaryFissionInvitedNum,
        primaryFissionCancelFollowNum,
        secondaryFissionScanNum,
        secondaryFissionFollowersNum,
        secondaryFissionInvitedNum,
        secondaryFissionCancelFollow,
        tertiaryFissionScanNum,
        tertiaryFissionFollowersNum,
        tertiaryFissionInvitedNum,
        tertiaryFissionCancelFollowNum,
        actualFollowNum,
        primaryFissionActualFollowNum,
        secondaryFissionActualFollowNum,
        tertiaryFissionActualFollowNum
      } = this.statisCount
      if (curDivision === 1) {
        this.formatStatis = {
          scanNum,
          followersNum,
          invitedNum,
          cancelFollowNum,
          actualFollowNum
        }
      } else if (curDivision === 2) {
        this.formatStatis = {
          scanNum: primaryFissionScanNum,
          followersNum: primaryFissionFollowersNum,
          invitedNum: primaryFissionInvitedNum,
          cancelFollowNum: primaryFissionCancelFollowNum,
          actualFollowNum: primaryFissionActualFollowNum
        }
      } else if (curDivision === 3) {
        this.formatStatis = {
          scanNum: secondaryFissionScanNum,
          followersNum: secondaryFissionFollowersNum,
          invitedNum: secondaryFissionInvitedNum,
          cancelFollowNum: secondaryFissionCancelFollow,
          actualFollowNum: secondaryFissionActualFollowNum
        }
      } else if (curDivision === 4) {
        this.formatStatis = {
          scanNum: tertiaryFissionScanNum,
          followersNum: tertiaryFissionFollowersNum,
          invitedNum: tertiaryFissionInvitedNum,
          cancelFollowNum: tertiaryFissionCancelFollowNum,
          actualFollowNum: tertiaryFissionActualFollowNum
        }
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
      const response = await getFansPosterStatisticsList({
        ...params,
        id,
        appAccountId
      })
      if (response.code === 1 && response.data) {
        this.statisMapList = this.createNullData(value || "1", response.data)
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
        dayjs(this.params.createTime).year() * 12 +
        dayjs(this.params.createTime).month()
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
    margin-top 20px
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
    margin-top 30px
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
  .statisTarget
    display flex
    justify-content space-between
    align-items center
    padding-bottom 15px
    border-bottom solid 1px #e3e4e6
  .baseInformation
    display flex
    justify-content flex-start
    margin 20px 40px
    .basePic
      width 68px
      height 120px
      overflow hidden
      text-align center
      display flex
      align-items center
      border 1px solid #f0f0f0
    .baseTime
      margin-left 20px
      .p_time
        margin-top 20px
        font-size 14px
        font-family MicrosoftYaHei
        font-weight normal
        color #606366
        .return_time
          font-size 14px
          margin-left 44px
        .return_times
          margin-left 30px
</style>
