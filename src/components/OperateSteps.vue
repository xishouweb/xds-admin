<template>
  <div class="operate-steps" :class="{'four-steps':stepsData.length===4}">
    <Steps :current="current" size="small">
      <Step :title="item" v-for="(item, index) in stepsData" :key="index"></Step>
      <!-- <Step title="进行中"></Step>
      <Step title="待进行"></Step>
      <Step title="待进行"></Step> -->
    </Steps>
  </div>
</template>

<script>
export default {
  name: 'operateSteps',
  props: {
    current: {
      default: 0,
      type: Number
    },
    isUpgrade: {
      default: true,
      type: Boolean
    }
  },
  data() {
    return {
      createCompanyStepsData: ['企业信息','选择服务', '确认付款', '订购成功'],
      upgradeStepsData: ['选择服务', '确认付款', '订购成功'],
      stepsData: []
    }
  },
  mounted() {
    if (this.isUpgrade) {
      this.stepsData = this.upgradeStepsData
    } else {
      this.stepsData = this.createCompanyStepsData
    }
  }
}
</script>
<style lang="stylus">
.operate-steps
  margin 0 auto
  width 560px
  .ivu-steps
    .ivu-steps-item
      width: 40% !important
    .ivu-steps-item:nth-last-of-type(1)
      width: 17.3333% !important
    .ivu-steps-status-wait
      .ivu-steps-main
        .ivu-steps-title
          color #979899
      .ivu-steps-head
        .ivu-steps-head-inner
          border solid 1px #cacbcc
          span
            color #cacbcc
  &.four-steps
    width 800px
    .ivu-steps
      .ivu-steps-item
        width: 29.666% !important
      .ivu-steps-item:nth-last-of-type(1)
        width: 11% !important
</style>


