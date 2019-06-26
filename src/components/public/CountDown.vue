<template>
  <span class="CountDown" :class="{err:payInvalidTxt}" :style="{color: color}" :value="computedVal">
    {{residueTime}}
  </span>
</template>
<script>
export default {
  name: 'countDown',
  data() {
    return {
      residueTime: '',
      timer: null,
      count: false, // 是否已经获取到创建时间和服务器时间
      leftTime: '',
      payInvalidTxt: false
    }
  },
  props: {
    creatTime: {
      default: '',
      type: String
    },
    serviceTime: {
      default: '',
      type: String
    },
    color: {
      default: '#409eff',
      type: String
    },
    validTime: {
      default: 48,
      type: Number
    }
  },
  computed: {
    computedVal() {
      if (this.creatTime && this.serviceTime) {
        if (!this.count) {
          this.init()
          this.countTime()
        }
      }
      return ''
    }
  },
  methods: {
    init() {
      this.count = true
      let creatData = Date.parse(this.creatTime.replace(/-/g,"/")) + this.validTime * 60 * 60 * 1000
      let serviceData = Date.parse(this.serviceTime.replace(/-/g,"/"))
      this.leftTime = creatData - serviceData
    },
    countTime: function() {
      if (this.leftTime >= 0) {
        this.payInvalidTxt = false
        let d = Math.floor(this.leftTime / 1000 / 60 / 60 / 24)
        let h = Math.floor((this.leftTime / 1000 / 60 / 60) % 24)
        let m = Math.floor((this.leftTime / 1000 / 60) % 60)
        this.residueTime = `${d} 天 ${h} 小时 ${m} 分`
        this.leftTime -= 1000
      } else {
        this.payInvalidTxt = true
        this.residueTime = ` 0 天 0 小时 0 分`
        clearTimeout(this.timer)
        this.$emit('payInvalid')
        return
      }
      this.timer = setTimeout(this.countTime, 1000)
    },
  },
  destroyed() {
    clearTimeout(this.timer)
  }
}
</script>
<style lang="stylus">
  .CountDown
    &.err
      color #f56c6c !important
</style>


