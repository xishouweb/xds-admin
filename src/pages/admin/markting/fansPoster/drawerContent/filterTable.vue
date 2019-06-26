<template>
    <div class="fileContent">
        <div class="poster">
          <span class="poster-title">海报到期状态</span>
          <RadioGroup v-model="expireStatus" type="button" size="large" class="selectGroup">
            <Radio label="全部"></Radio>
            <Radio label="NOT_EXPIRE" style="margin-left:20px;">未到期</Radio>
            <Radio label="EXPIRE" style="margin-left:20px;">已到期</Radio>
          </RadioGroup>
        </div>
        <!-- <div class="lookStatus">
          <span class="poster-title">关注状态</span>
          <RadioGroup v-model="button4" type="button" size="large" class="selectGroups">
            <Radio label="全部"></Radio>
            <Radio label="关注中" style="margin-left:20px;"></Radio>
            <Radio label="已取消" style="margin-left:20px;"></Radio>
          </RadioGroup>
        </div> -->
        <div class="task">
          <span class="poster-title">任务完成状态</span>
          <RadioGroup v-model="completeStatus" type="button" size="large" class="Group">
            <Radio label="全部"></Radio>
            <Radio label="SUCCESS" style="margin-left:20px;">完成</Radio>
            <Radio label="DOING" style="margin-left:33px;">未完成</Radio>
          </RadioGroup>
        </div>
        <div class="drawer-footer">
          <Button style="width: 120px; margin-right: 15px" type="primary" @click="ok">确定</Button>
          <Button style="width: 120px; margin-right: 15px" @click="cancle">取消</Button>
        </div>
    </div>
</template>
<script>
import { sessionStorageSaveOrRead } from '@/utils/util'
export default {
  data() {
    return {
      button4: '全部',
      expireStatus: sessionStorageSaveOrRead('posterFilter').expireStatus || '全部',
      completeStatus: sessionStorageSaveOrRead('posterFilter').completeStatus || '全部',
    }
  },
  props: {
    drawer: {
      type: Object,
      default() {
        return {}
      }
    },
  },
  methods: {
    cancle() {
      this.drawer.show = false
      this.expireStatus = '全部'
      this.completeStatus = '全部'
    },
    ok() {
//       2	expireStatus	海报到期状态EXPIRE:到期，NOT_EXPIRE：没到期		[string]
// 3	completeStatus	任务完成状态SUCCESS：完成 DOING:进行中		[string]
      let param = {
        expireStatus: this.expireStatus === '全部' ? null : this.expireStatus,
        completeStatus: this.completeStatus === '全部' ? null : this.completeStatus
      }
      sessionStorageSaveOrRead('posterFilter', param)
      this.drawer.fn && this.drawer.fn(param)
      this.cancle()
    }
  }
}
</script>
<style lang="stylus" >
  .fileContent
    margin-top 30px
    .selectGroup
      margin-left 80px
      .ivu-radio-group-button .ivu-radio-wrapper:first-child
        border-radius 4px!important
  .poster-title
      font-family: MicrosoftYaHei;
      font-size: 14px;
      font-weight: normal;
      font-stretch: normal;
      line-height: 28px;
      letter-spacing: 0px;
      color: #303133;
  .lookStatus
    margin-top 47px
    .selectGroups
      margin-left 108px
  .task
    margin-top 47px
    .Group
      margin-left 80px

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

