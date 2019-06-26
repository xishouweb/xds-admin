<template>
  <div class="statisDate">
    <RadioGroup v-model="curDate" type="button" @on-change="changeType">
        <Radio label="1" v-if="allTime">
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
        style="width: 230px"
        :options="dateOptions"
      ></DatePicker>
  </div>
</template>

<script>
import dayjs from "dayjs"
export default {
  props: {
    value: {
      type: Object,
      default() {
        return {}
      }
    },
    params: {
      type: Object,
      default() {
        return {}
      }
    },
    allTime: {
      type: Boolean,
      default() {
        return false
      }
    }
  },
  data() {
    return {
      curDate: "2",
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
      }
    }
  },
  methods: {
    changeType(value) {
      this.curDateRange = []
      // 获取数据
      const params = this.formatParams(value)
      this.curDateRange = [params.startTime, params.endTime]
      this.$emit('input', params)
    },
    changeDateType(value) {
      this.curDate = ""
      const params = {
        countType: "day",
        startTime: dayjs(value[0]).format("YYYY-MM-DD HH:mm:ss"),
        endTime: dayjs(value[1])
          .add(1, "day")
          .format("YYYY-MM-DD HH:mm:ss")
      }
      this.$emit('input', params)
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
    }
  }
}
</script>

<style lang="stylus" scoped>
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
</style>
