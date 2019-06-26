<template>
  <div class="create-poster-temp">
    <HeaderTitle>裂变海报模板</HeaderTitle>
    <HeaderSubtitle>
      <p>
        <i @click="$router.push({name: 'actionPoster'})" style="cursor: pointer">裂变海报模板</i> /
        <span>新建海报模板</span>
      </p>
    </HeaderSubtitle>
    <div class="create-poster-temp-step">
      <Steps size="small" :current="currentStep" ivu-steps ivu-steps-horizontal>
        <Step title="海报基本信息"></Step>
        <Step title="活动通知设置"></Step>
      </Steps>
    </div>

    <step1 v-if="currentStep === 0" @changeStep="toNext" :form="step1Form" :file="file"></step1>
    <step2 v-if="currentStep === 1" @changeStep="currentStep = 0" :file="file.file" :form="step1Form" @saveFormData="saveFormData"></step2>
    <!-- 离开页面时的弹框提示 -->
    <exit-page-modal></exit-page-modal>
  </div>
</template>

<script>
export default {
  name: "create-poster-temp",
  components: {
    HeaderTitle: () => import('@/components/pageStyle/headerTitle.vue'),
    HeaderSubtitle: () => import('@/components/pageStyle/headerSubtitle.vue'),
    step1: () => import('./step1/'),
    step2: () => import('./step2/')
  },
  data() {
    return {
      currentStep: 0,
      file: {},
      step1Form: {}
    }
  },
  methods: {
    toNext(file, form) {
      this.currentStep = 1
      this.step1Form = form
      this.file = file
    },
    saveFormData(data) {
      this.step1Form = { ...data }
    }
  }
}
</script>

<style lang="stylus">
.create-poster-temp
  .create-poster-temp-step
      display flex
      justify-content center
      .ivu-steps.ivu-steps-horizontal
        width 390px !important
  .create-qrcode-title
    margin 40px 0
    &:first-child
      margin-top 0
  .ivu-form-item-required .ivu-form-item-label:before
    display none
  .ivu-form-item-label
    text-align left !important
    padding-left 20px !important
  .ivu-radio-wrapper
    display: block !important
    margin-bottom 15px
  .form-item-indent
    padding-left 24px
  .reset-error-tip
    .ivu-form-item-error-tip
      top: -19px;
  .unshow-error-tip
    .ivu-form-item-error-tip
      visibility hidden
</style>
