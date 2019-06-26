<template>
  <div id="createCompany">
    <div class="title">创建新企业</div>
    <div class="create-steps">
      <OperateSteps :current="currentSteps" :isUpgrade="false"></OperateSteps>
    </div>
    <div class="form" v-if="reloadComponent" v-show="currentSteps==0">
      <third-step @companyParams="companyParams" type="go-on"></third-step>
    </div>
    <div class="order-second-steps" v-if="reloadComponent" v-show="currentSteps==1">
      <orderPay
        type="createCompany"
        :creatCorpName="corpData.corpName"
        @lastStep="lastStep"
        @submitOrder="submitOrder"
        @nextOrderStep="nextOrderStep"
      ></orderPay>
    </div>
    <div class="order-third-steps" v-if="currentSteps==2">
      <payment @restartOrder="restartOrder" @nextOrderStep="nextOrderStep"></payment>
    </div>
    <div class="order-four-steps" v-if="currentSteps==3">
      <complatePay :complateStatus="complateStatus"></complatePay>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex"
import OperateSteps from "@/components/OperateSteps"
import orderPay from "@/pages/admin/pay/OrderPay"
import payment from "@/pages/admin/pay/payment"
import thirdStep from "@/pages/register/thirdStep"
import complatePay from "@/pages/admin/pay/complatePay"
import {
  logout,
  saveWebAdminLoginBySession,
  getSession,
  getPersonalInfo
} from "@/api/query"
export default {
  name: "creatCompany",
  data() {
    return {
      corpData: {},
      currentSteps:
        (this.localStorageSaveOrRead("saveStepsData") &&
          this.localStorageSaveOrRead("saveStepsData").current) ||
        0,
      saveStepsData: {
        current: 0,
        name: this.$route.name
      },
      complateStatus: this.localStorageSaveOrRead("nextOrderStep") || 1,
      reloadComponent: true,
      userInfo: this.getToken() || null
    }
  },
  created() {
    setTimeout(() => {
      this.registerClient()
    }, 1000)
  },
  mounted() {
    this.setCurrentCokie()
  },
  computed: {
    ...mapGetters({
      routerInfo: "nav/getRouterInfo"
    })
  },
  methods: {
    setCurrentCokie() {
      this.saveStepsData.current = this.currentSteps
      this.localStorageSaveOrRead("saveStepsData", this.saveStepsData)
    },
    companyParams(params) {
      this.corpData = params
      this.currentSteps = 1
      this.setCurrentCokie()
    },
    lastStep(val) {
      this.currentSteps = 0
      this.setCurrentCokie()
    },
    submitOrder() {
      this.currentSteps = 2
      this.setCurrentCokie()
    },
    nextOrderStep(val) {
      this.complateStatus = val
      this.localStorageSaveOrRead("nextOrderStep", val)
      this.currentSteps = 3
      this.setCurrentCokie()
    },
    restartOrder() {
      this.reloadComponent = false
      this.$nextTick(() => {
        this.reloadComponent = true
        this.currentSteps = 0
        this.setCurrentCokie()
      })
    },
    async registerClient() {
      const { sessionId, userId } = this.$route.query
      if (userId) {
        // 没有用户
        if (!this.userInfo) {
          const params = {
            oldSessionId: sessionId,
            userId: parseInt(userId),
            platformType: "PC_WEB_ADMIN"
          }
          const res = await saveWebAdminLoginBySession(params)
          if (res.code === 1) {
            const resSession = await getSession()
            const resPerson = await getPersonalInfo()
            if (resSession.code === 1 && resPerson.code === 1) {
              let session = {
                ...resSession.data,
                corpList: resPerson.data.corpList
              }
              this.setToken(session, 0.5)
              location.reload()
            } else {
              this.$Message.error("登录失败")
            }
          } else {
            this.$Message.error("登录失败")
          }
        }
        // 有其他用户
        if (this.userInfo && this.userInfo.userId !== parseInt(userId)) {
          const res = await logout()
          if (res.code === 1) {
            this.removeToken()
            this.localStorageRemove("accountList")
            this.localStorageRemove("currentCorp")
            this.localStorageRemove("preAuthCode")
            location.reload()
          }
        }
        // 有自己,不处理
      }
    }
  },
  watch: {
    // $route(to, from) {
    //   this.saveStepsData.name = to.name
    //   this.setCurrentCokie()
    // },
    "routerInfo.name"(val) {
      this.saveStepsData.name = val
      this.setCurrentCokie()
    }
  },
  components: {
    thirdStep,
    OperateSteps,
    payment,
    orderPay,
    complatePay
  }
}
</script>

<style lang="stylus">
#createCompany
  padding-bottom 35px
  padding-top 43px
  min-height 742px
  >.title
    font-size 20px
    margin-left 43px
  .form
    margin-top 75px
  .create-steps
    margin 50px 0
  .order-second-steps
    width 75%
    margin 0 auto
  .order-third-steps
    width 64.286%
    margin 0 auto
</style>


