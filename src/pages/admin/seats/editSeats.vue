<template>
  <div class="edit-seats">
    <drawer titleTips="修改" :isScroll="false" v-model="showEditSeats" :isCloseHeghtLight="heghtLightStatu">
      <div slot="content">
        <div class="tab-wrapper">
          <Tabs v-model="editTabsVal" :animated="false">
            <TabPane label="坐席信息" name="1">
              <BScroll :offsetBottom="59">
                <add-first-step v-if="editTabsVal == '1'" ref="addFirstStep"></add-first-step>
              </BScroll>
            </TabPane>
            <TabPane label="坐席权限" name="2">
              <div class="noseatDate" v-show="accountList.length<=0">
                <div class="item img"><img src="@/assets/images/admin/icon.png" alt=""></div>
                <div class="item tip">您还没有绑定公众号</div>
                <div class="item btn"><Button type="primary" @click="addAccount">添加公众号</Button></div>
              </div>
              <div v-show="accountList.length>0">
                <!-- <BScroll :offsetBottom="59" :data="corpPackRoleList" v-show="accountList.length>0"> -->
                  <seatsLimit v-if="editTabsVal == '2'" ref="seatsLimit"></seatsLimit>
                <!-- </BScroll> -->
              </div>
            </TabPane>
            <TabPane label="个性化坐席" name="3">
              <div class="noseatDate" v-show="!seatsInfo.seatPublicNumDetailDtos">
                <div class="item img"><img src="@/assets/images/admin/icon.png" alt=""></div>
                <div class="item tip">您还没个性化坐席</div>
                <div class="item small-tip">如需个性化坐席请先设置坐席权限</div>
                <div class="item btn"><Button type="primary" @click="setAuthSeat">设置坐席权限</Button></div>
              </div>
              <BScroll :offsetBottom="59" :data="accountList" v-show="seatsInfo.seatPublicNumDetailDtos">
                <customSeats v-if="editTabsVal == '3'" ref="customSeats"></customSeats>
              </BScroll>
            </TabPane>
          </Tabs>
        </div>
      </div>
      <div slot="footer" class="footer-wrapper">
        <Button class="footer-btn" @click="saveSeatsInfo" type="primary" :loading="doneLoading">保存</Button>
        <Button class="footer-btn" @click="back" type="ghost" :disabled="doneLoading">返回</Button>
      </div>
    </drawer>
    <NewModal v-model="modalShow" v-bind="modal" @ok="modalOk"></NewModal>
  </div>
</template>
<script>
import {mapActions, mapGetters, mapState} from 'vuex'
import {updateSeatBaseInfo, updateSeatAuth, updateConditionalSeat} from '@/api/query'
import addFirstStep from './addFirstStep'
import seatsLimit from './seatsLimit'
import customSeats from './customSeats'
export default {
  props: {
    tabsVal: {
      type: String,
      default: '1'
    }
  },
  data() {
    return {
      heghtLightStatu: true,
      showEditSeats: false,
      editTabsVal: '1',
      doneLoading: false,
      modalShow: false,
      modal: {
        header: '操作提示',
        content: "当前公众号的微信号未设置，请前往微信公众平台设置。",
        confrim: '去设置',
      }
    }
  },
  mounted() {},
  computed: {
    ...mapState({
      accountList: state => state.publicAccount.publicAccountList,
    }),
    ...mapGetters({
      firstStepData: 'seats/getFirstStepData',
      secondStepData: 'seats/getSecondStepData',
      thirdStepData: 'seats/getThirdStepData',
      seatsInfo: 'seats/getSeatsInfo',
      corpPackRoleList: 'seats/getCorpPackRoleList'
    })
  },
  watch: {
    editTabsVal: {
      handler() {
        this.$root.Bus.$emit('manualRefresh')
      },
      immediate: true
    },
    tabsVal(val) {
      this.editTabsVal = val
    },
    showEditSeats(val) {
      if (!val) {
        this.editTabsVal = '1'
      }
    }
  },
  methods: {
    setAuthSeat() {
      this.editTabsVal = '2'
    },
    addAccount() {
      this.$router.push({name: 'tencentManage'})
    },
    updateSeatBaseInfo(params) {
      this.doneLoading = true
      updateSeatBaseInfo(params).then(data => {
        this.doneLoading = false
        if (data.code === 1) {
          this.$Message.success('修改坐席信息成功')
          this.$emit('editInfoSeat', this.seatsInfo.id, 'seatsInfo', this.editTabsVal)
          this.hideEditSeats()
        } else if (data.code === 5018) {
          this.$Message.error('修改失败,员工已有坐席')
        } else {
          this.$Message.error(data.message)
        }
      }).catch(() => {
        this.doneLoading = false
      })
    },
    updateSeatAuth(params) {
      updateSeatAuth(params).then(data => {
        this.doneLoading = false
        if (data.code === 1) {
          this.$Message.success('修改坐席权限成功')
          this.$emit('editInfoSeat', this.seatsInfo.id, 'seatsInfo', this.editTabsVal)
          this.hideEditSeats()
        } else {
          this.$Message.error(data.message)
        }
      }).catch(() => {
        this.doneLoading = false
      })
    },
    updateConditionalSeat(params) {
      updateConditionalSeat(params).then(data => {
        this.doneLoading = false
        if (data.code === 1) {
          this.$Message.success('修改个性化坐席成功')
          this.$emit('editInfoSeat', this.seatsInfo.id, 'seatsInfo', this.editTabsVal)
          this.hideEditSeats()
        } else if (data.code === 6008) {
          this.modalShow = true
        } else {
          // debugger
          this.$Message.error(data.message)
        }
      }).catch(() => {
        this.doneLoading = false
      })
    },
    showDrawer() {
      this.showEditSeats = true
    },
    saveSeatsInfo() { // 点击保存
      this.heghtLightStatu = false
      this.editSeatParams = {}
      this.editSeatParams.seatId = this.seatsInfo.id || null
      if (this.editTabsVal === '1') {
        let param = this.$refs['addFirstStep'].isGoNext()
        if (param) {
          param.seatId = this.seatsInfo.id || null
          this.updateSeatBaseInfo(param)
        }
      } else if (this.editTabsVal === '2') {
        let param = this.$refs['seatsLimit'].isGoNext()
        if (param) {
          param.seatId = this.seatsInfo.id || null
          this.updateSeatAuth(param)
        }
      } else {
        let isUpdate = this.$refs['customSeats'].isDone()
        if (isUpdate) {
          let param = {}
          param.updateConditionalSeats = this.$refs['customSeats'].isDone()
          if (param) {
            param.seatId = this.seatsInfo.id || null
            this.updateConditionalSeat(param)
          }
        }
      }
    },
    hideEditSeats() {
      this.showEditSeats = false
    },
    back() {
      this.heghtLightStatu = true
      this.hideEditSeats()
    },
    modalOk() {
      this.modalShow = false
      window.open("https://mp.weixin.qq.com")
    },
    ...mapActions({
      setFirstStepData: 'seats/setFirstStepData',
      setSecondStepData: 'seats/setSecondStepData',
      setThirdStepData: 'seats/setThirdStepData'
    })
  },
  components: {
    seatsLimit,
    customSeats,
    addFirstStep
  }
}
</script>
<style lang="stylus">
.edit-seats
  .ivu-tabs-content
    margin-top 30px
  .tab-wrapper
    padding-top 20px
</style>


