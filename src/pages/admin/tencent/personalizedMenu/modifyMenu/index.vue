<template>
  <div id="modifyMenu">
    <div class="modifyMenu-wrapper">
      <div class="wechat-title">个性化菜单
        <Poptips width="227" content="个性化菜单支持用户标签，当用户身上的标签超过1个时，以最后打上的标签为匹配"></Poptips>
      </div>
      <scroll-bar v-setScrollBoxHeight>
        <div class="modify-main">
          <div class="step">
            <Steps :current="steps" size="small">
              <Step title="设置条件"></Step>
              <Step title="设置菜单内容"></Step>
            </Steps>
          </div>
          <div class="modify-components">
            <div class="modify-center">
              <FormStep v-show="steps===0" @doneStep="doneStep"></FormStep>
            </div>
            <div class="second-wrapper">
              <editMenu type="personalizedMenu" v-if="steps===1" @lastStep="lastStep" ></editMenu>
            </div>
          </div>
        </div>
      </scroll-bar>
    </div>
  </div>
</template>
<script>
import editMenu from '@/pages/admin/tencent/customMenu/editMenu'
import PublicNo from '../../components/currPublicNo'
import FormStep from './formStep'
export default {
  name: 'modifyMenu',
  data() {
    return {
      steps: 0
    }
  },
  components: {
    PublicNo,
    FormStep,
    editMenu
  },
  methods: {
    doneStep(val) {
      this.steps = val
      this.$nextTick(() => {
        this.$root.Bus.$emit('calcScrollHeight')
      })
    },
    lastStep(val) {
      this.steps = val
      this.$nextTick(() => {
        this.$root.Bus.$emit('calcScrollHeight')
      })
    },
  }
}
</script>
<style lang="stylus">
#modifyMenu
  .modifyMenu-wrapper
    padding 0 20px
    margin-top 10px
    background-color #ffffff
    border-radius 3px
  .modify-main
    padding-top 30px
    text-align center
    .step
      .ivu-steps
        display inline-block
        width 346px
        text-align left
        .ivu-steps-item
          width: 68% !important
        .ivu-steps-item:nth-last-of-type(1)
          width: 32% !important
    .modify-components
      text-align left
      .modify-center
        display block
      .second-wrapper
        padding 20px 30px 0
</style>

