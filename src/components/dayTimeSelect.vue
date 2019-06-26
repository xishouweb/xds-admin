<template>
    <div class="day-time-select">
      <Select v-model="selected.day" size="large" style="width:60px" @on-change="getSecond" :disabled="disabled">
          <Option v-for="(item, index) in day1" :value="item" :key="index">{{ item }}</Option>
      </Select>
      天
      <Select v-model="selected.hour" size="large" style="width:60px" @on-change="getSecond" :disabled="selected.day == 30 || disabled">
        <Option v-for="(item, index) in hour" :value="item - 1" :key="index">{{ item - 1 }}</Option>
      </Select>
      小时
      <Select v-model="selected.min" size="large" style="width:60px" @on-change="getSecond" :disabled="selected.day == 30 || selected.hour == 24 || disabled">
        <Option v-for="(item, index) in min" :value="item - 1" :key="index">{{ item - 1 }}</Option>
      </Select>
      分
    </div>
</template>

<script>
export default {
  name: "day-time-select",
  data() {
    return {
      day1: 30,
      hour: 24,
      min: 60,
      selected: {
        day: 30,
        hour: 0,
        min: 0,
      }
    }
  },
  props: {
    value: {
      type: [Number, String],
      default: 0
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    value(nv) {
      this.resetTime(nv * 1000)
    }
  },
  methods: {
    // 获取秒数 < 2592000 s
    getSecond() {
      let s = this.selected.day * 24 * 60 * 60 +
              this.selected.hour * 60 * 60 +
              this.selected.min * 60
      this.$emit('input', s)
    },
    // 传过来的时间是秒数
    resetTime(time) {
      let d = new Date(time)
      this.selected = {
        day: d.getUTCDate() - 1,
        hour: d.getUTCHours(),
        min: d.getUTCMinutes(),
      }
    }
  }
}
</script>

<style lang="stylus">
.day-time-select
    display inline-block
    width 260px
</style>
