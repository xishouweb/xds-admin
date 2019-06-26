<template>
  <div class="add-seats">
    <DrawerNoSave :offsetBottom="59" titleTips="添加坐席" :isScroll="false" v-model="showAddSeats">
      <div slot="content">
        <div class="steps">
          <Steps :current="currentSteps" size="small">
            <Step title="坐席信息"></Step>
            <Step title="坐席权限"></Step>
            <Step title="个性化坐席"></Step>
          </Steps>
        </div>
        <div class="scroll-add" v-show="currentSteps==0">
          <div class="steps0">
            <BScroll :offsetBottom="59">
              <add-first-step :createSeat="createSeat"  ref="addFirstStep" :isAdd="true"></add-first-step>
            </BScroll>
          </div>
        </div>
        <div class="scroll-add" v-show="currentSteps==1">
          <div class="steps1">
            <div class="noseatDate" v-show="accountList.length<=0">
              <div class="item img"><img src="@/assets/images/admin/icon.png" alt=""></div>
              <div class="item tip">您还没有绑定公众号</div>
              <div class="item btn"><Button type="primary" @click="addAccount">添加公众号</Button></div>
            </div>
            <div v-show="accountList.length>0">
              <seatsLimit ref="seatsLimit" :isAdd="true"></seatsLimit>
            </div>
          </div>
        </div>
        <div class="scroll-add" v-show="currentSteps==2">
          <div class="steps2">
            <BScroll :offsetBottom="59">
              <customSeats :data="accountList" ref="customSeats" :createSeat="createSeat" :appAccountIds="saveSeatParams.appAccountIds" :isAdd="true"></customSeats>
            </BScroll>
          </div>
        </div>
      </div>
      <div slot="footer">
        <div class="footer-wrapper" id="footer-wrapper" :class="{'endStep': currentSteps==2}">
          <Button class="footer-btn" v-show="currentSteps==2" :loading="doneLoading" @click="againStep" type="primary">完成并继续添加</Button>
          <Button class="footer-btn" v-show="currentSteps==2" :loading="doneLoading" @click="doneStep" type="primary">完成</Button>
          <Button class="footer-btn" v-show="currentSteps!=2" :disabled="doneLoading" @click="nextStep(currentSteps)" type="primary">保存并下一步</Button>
          <Button class="footer-btn" v-show="currentSteps!=0" :disabled="doneLoading" @click="lastStep" type="ghost">上一步</Button>
          <Button class="footer-btn" type="ghost" @click="cancelStep">取消</Button>
        </div>
      </div>
    </DrawerNoSave>

  </div>
</template>
<script>
import { mapActions, mapGetters, mapState } from 'vuex'
import { updateSeatBaseInfo, saveSeat } from '@/api/query'
import addFirstStep from './addFirstStep'
import seatsLimit from './seatsLimit'
import customSeats from './customSeats'
export default {
  props: {
    createSeat: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      isJixuAdd: false,
      showAddSeats: false,
      currentSteps: 0,
      saveSeatParams: {
        seatId: null,
        remark: null,
        eeId: null,
        appAccountIds: [],
        authIds: [],
        saveConditionalSeatForm: []
      },
      doneLoading: false
    }
  },
  computed: {
    ...mapState({
      accountList: state => state.publicAccount.publicAccountList,
    }),
    ...mapGetters({
      firstStepData: 'seats/getFirstStepData',
      secondStepData: 'seats/getSecondStepData',
      thirdStepData: 'seats/getThirdStepData',
      corpPackRoleList: 'seats/getCorpPackRoleList'
    })
  },
  mounted() {},
  methods: {
    updateSeatBaseInfo(params) {
      this.doneLoading = true
      updateSeatBaseInfo(params).then(data => {
        this.doneLoading = false
        if (data.code === 1) {
          this.currentSteps++
        } else if (data.code === 5018) {
          this.$Message.error('添加失败,员工已有坐席')
        } else {
          this.$Message.error(data.message)
        }
      }).catch(() => {
        this.doneLoading = false
      })
    },
    saveSeat() {
      this.doneLoading = true
      let param = {
        authIds: this.saveSeatParams.authIds,
        remark: this.saveSeatParams.remark,
        saveConditionalSeatForm: this.saveSeatParams.saveConditionalSeatForm,
        seatId: this.saveSeatParams.seatId
      }
      saveSeat(param)
        .then(data => {
          this.doneLoading = false
          if (data.code === 1) {
            this.$Message.success('添加坐席成功')
            this.hideAddSeats()
            this.$root.Bus.$emit('refreshList')
            if (this.isJixuAdd) {
              this.$emit('isJixuAdd')
              // this.currentSteps = 0
              // setTimeout(() => {
              //   this.showAddSeats = true
              // }, 0.1)
            }
          } else if (data.code === 5018) {
            this.$Message.error(data.message)
          } else {
            this.$Message.error(data.message)
            this.hideAddSeats()
          }
        })
        .catch(() => {
          this.doneLoading = false
          this.$Message.error('添加坐席失败')
        })
    },
    showDrawer() {
      this.showAddSeats = true
    },
    hideAddSeats() {
      this.showAddSeats = false
    },
    nextStep(currentSteps) {
      if (currentSteps === 0) {
        let param = this.$refs['addFirstStep'].isGoNext()
        this.saveSeatParams.seatId = this.createSeat.id || null
        if (param) {
          this.saveSeatParams.remark = param.remark || ''
          this.saveSeatParams.eeId = param.eeId || null
          this.updateSeatBaseInfo(param)
          //
        }
      } else {
        let param = this.$refs['seatsLimit'].isGoNext()
        if (param) {
          this.saveSeatParams.appAccountIds = param.appAccountIds || null
          this.saveSeatParams.authIds = param.authIds || null
          this.currentSteps++
        }
      }
    },
    lastStep() {
      this.currentSteps--
    },
    cancelStep() {
      this.hideAddSeats()
    },
    addAccount() {
      this.$router.push({ name: 'tencentManage' })
    },
    doneStep() {
      this.isJixuAdd = false
      let param = this.$refs['customSeats'].isDone()
      if (param) {
        this.saveSeatParams.saveConditionalSeatForm = param || null
        this.saveSeat()
      }
    },
    againStep() {
      this.isJixuAdd = true
      let param = this.$refs['customSeats'].isDone()
      if (param) {
        this.saveSeatParams.saveConditionalSeatForm = param || null
        this.saveSeat()
      }
    },
    ...mapActions({
      setFirstStepData: 'seats/setFirstStepData',
      setSecondStepData: 'seats/setSecondStepData',
      setThirdStepData: 'seats/setThirdStepData'
    })
  },
  watch: {
    showAddSeats(val) {
      if (!val) {
        this.currentSteps = 0
      }
    },
    currentSteps: {
      handler() {
        this.$root.Bus.$emit('manualRefresh')
      },
      immediate: true
    }
  },
  components: {
    seatsLimit,
    customSeats,
    addFirstStep
  }
}
</script>
<style lang="stylus">
@import '~@/assets/stylus/mixin'
.add-seats
  .steps
    padding 50px 0 50px 20px
    .ivu-steps
      .ivu-steps-item
        width 40% !important
        &:nth-last-of-type(1)
          width 17.3333% !important
      .ivu-steps-item.ivu-steps-status-wait .ivu-steps-title
        color #979899
  .scroll-add
    height calc(100% - 122px)
    .steps1, .steps2, .steps0
      height 100%
      position relative
  .steps0
    padding-left 20px
#footer-wrapper
  &.endStep
    .footer-btn
      width 90px
      &:nth-of-type(1)
        width 130px
</style>


