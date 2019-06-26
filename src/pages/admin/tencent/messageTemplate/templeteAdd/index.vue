<template>
  <div id="temps">
    <div class="editStep" v-if="!isModity">
      <Steps :current="Number(current)" size="small">
        <Step title="选择模板"></Step>
        <Step title="设置模板消息"></Step>
      </Steps>
    </div>
    <div class="contWrap">
      <TempleteTable v-if="Number(current) === 0" @changeSelect="getSelectValue"></TempleteTable>
      <TempleteForm v-else :templateId="selectValue"></TempleteForm>
    </div>
  </div>
</template>
<script>
import TempleteTable from "./templeteTable"
import TempleteForm from "./templeteForm"
export default {
  data() {
    return {
      current: this.$route.params.step || 0,
      selectValue: this.$route.query.templateId,
      isModity: !!this.$route.query.id
    }
  },
  components: { TempleteTable, TempleteForm },
  watch: {
    '$route' (to, from) {
      this.current = to.params.step
    }
  },
  methods: {
    getSelectValue(val) {
      this.selectValue = val
    }
  }
}
</script>
<style lang="stylus">
#temps
  // height calc(100vh - 248px)
  .editStep
    width 366px
    margin 30px auto 50px
  .contWrap
    margin-bottom 60px
    padding-bottom 20px
  .actionFooter
    position fixed
    left 258px
    right 0
    bottom 0
    z-index 20
    height 60px
    padding 10px 0
    text-align center
    box-shadow 0px -1px 0px 0px #e3e4e5
    background #fff
    button
      border-radius 3px
      width 110px
      height 40px
      margin-right 20px
    .white
      background #fff
</style>
