<template>
  <transition name="fade">
    <div id="fansDetail" v-show="isVisible">
      <div class="user_wrap" @click="onWrap">
        <div id="user_info">
          <div class="close" @click="onClose">
            <span class="icon">&#xe674;</span>
          </div>
          <div class="wrap">
            <div class="info_card">
              <div class="card_bg" :style="curFans.headImgUrl | calcBg(0)"></div>
              <div class="card_info">
                <p class="name">
                  <span class="ellipsis">{{ curFans.nickName }}</span>
                  <i class="sex icon" v-if="curFans.sex === 0" :style="{ color: '#666' }">&#xe63a;</i>
                  <i
                    class="sex icon"
                    v-else-if="curFans.sex === 1"
                    :style="{ color: '#409fff' }"
                  >&#xe60b;</i>
                  <i class="sex icon" v-else :style="{ color: 'rgb(255, 111, 78)' }">&#xe607;</i>
                </p>
                <p class="wechat">
                  <span class="ellipsis">公众号：{{ curFans.accountName }}</span>
                  <i class="status" :class="{ active: curFans.subscribe }">
                    {{
                    curFans.subscribe ? '已关注' : '已取消'
                    }}
                  </i>
                </p>
                <p
                  class="origin"
                  v-if="curFans.specificSourceName"
                >来源：{{ curFans.specificSourceName }}</p>
                <p class="origin" v-else>来源：{{ curFans.subscribeScene | formatOrgin }}</p>
              </div>
            </div>
            <div id="tabs">
              <tab-bar v-model="value" :data="tabList" @change="changeTab"/>
              <tab-panels v-model="value">
                <tab-panel value="1">
                  <BScroll :data="curFans" ref="basicInfo">
                    <BasicInfo :curFans="curFans"/>
                  </BScroll>
                </tab-panel>
                <tab-panel value="2">
                  <BScroll :data="conversationStatistics" ref="count">
                    <Count :conversationStatistics="conversationStatistics"/>
                  </BScroll>
                </tab-panel>
                <tab-panel value="3">
                  <BScroll ref="track" :data="fansRecord" @downLoadingData="scrollDropLoad" :listenScroll="true">
                    <Track :fansRecord="fansRecord"/>
                  </BScroll>
                </tab-panel>
              </tab-panels>
              <div class="send_chat" v-if="isEditable">
                <Button type="primary" @click="createConversationAction">发起会话</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { mapState, mapActions } from "vuex"
import TabPanels from "../Tabs/TabPanels"
import TabPanel from "../Tabs/TabPanel"
import TabBar from "../Tabs/TabBar"
import BasicInfo from "./BasicInfo"
import Count from "./Count"
import Track from "./Track"
import { getCookieSession } from "@/utils/cookies"
const origins = {
  ADD_SCENE_SEARCH: "搜索公众号",
  ADD_SCENE_ACCOUNT_MIGRATION: "公众号迁移",
  ADD_SCENE_PROFILE_CARD: "名片分享",
  ADD_SCENE_QR_CODE: "扫描二维码",
  ADD_SCENE_PROFILE_LINK: "图文页内名称点击",
  ADD_SCENE_PROFILE_ITEM: "图文页右上角菜单",
  ADD_SCENE_PAID: "支付后关注",
  ADD_SCENE_OTHERS: "其他",
  ADD_SCENE_UNKNOWN_CHANNEL_QR_CODE: "未知渠道二维码",
  ADD_SCENE_UNKNOWN_FANS_POSTER: "未知裂变海报"
}
export default {
  name: "fansDetail",
  components: {
    TabPanels,
    TabPanel,
    TabBar,
    BasicInfo,
    Count,
    Track
  },
  model: {
    prop: "visible",
    event: "toggle"
  },
  filters: {
    calcBg(val, target) {
      if (val) {
        val = val.replace(/(.+\/)(\d+)/g, ($0, $1) => {
          return $1 + target
        })
      }
      return { backgroundImage: `url(${val})` }
    },
    formatOrgin(val) {
      return origins[val]
    }
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapState("fans", {
      curFans: state => state.curFans,
      conversationStatistics: state => state.conversationStatistics,
      fansRecord: state => state.fansRecord
    }),
    isEditable() {
      const userInfo = this.getToken()
      return (
        this.curFans.kfSeatId === this.$store.state.fans.fansGroupList.seatId ||
        this.$store.state.survey.saveloginCompany.createId === userInfo.userId
      )
    }
  },
  data() {
    return {
      dataLoading: false,
      nomore: false,
      page: 1, //
      isVisible: this.visible,
      value: "1",
      tabList: [
        {
          label: "基本信息",
          value: "1"
        },
        {
          label: "互动统计",
          value: "2"
        },
        {
          label: "粉丝轨迹",
          value: "3"
        }
      ]
    }
  },
  watch: {
    visible(val) {
      this.isVisible = val
    },
    isVisible(val) {
      if (!val) {
        // 关闭重置
        this.value = "1"
        this.$refs.basicInfo.scrollTo(0, 0)
        this.$refs.count.scrollTo(0, 0)
        this.$refs.track.scrollTo(0, 0)
      }
      this.$emit("toggle", val)
    }
  },
  mounted() {
    // 刷新当前粉丝
    this.$root.Bus.$on("updateCurFans", () => {
      this.getCurFan()
    })
  },
  methods: {
    ...mapActions("fans", [
      "getFan",
      "createConversation",
      "getConversationStatistics",
      "getFansRecord"
    ]),
    onClose() {
      this.isVisible = false
    },
    async scrollDropLoad() {
      console.log(111)
      if (this.dataLoading || this.nomore) {
        return
      }
      this.dataLoading = true
      this.$refs.track.refresh()
      const payload = {
        convrId: `1_${this.curFans.appAccountId}_${this.curFans.fansId}`
      }
      payload.offset = this.page
      let res = await this.getFansRecord(payload)
      const { data } = res
      if (data.records.length < 20) {
        this.nomore = true
      }
      this.page++
      this.dataLoading = false
    },
    getCurFan() {
      if (this.curFans.fansId) {
        this.getFan({
          id: this.curFans.fansId,
          appAccountId: this.curFans.appAccountId
        })
      }
    },
    onWrap(event) {
      const className = event.target.getAttribute("class")
      if (className && className.indexOf(`user_wrap`) > -1) this.onClose()
    },
    async createConversationAction() {
      let CHAT_URL = process.env.CHAT_BASE_URL
      // 发起会话
      const res = await this.createConversation({
        seatId: this.$store.state.fans.fansGroupList.seatId,
        fansId: this.curFans.fansId,
        appAccountId: this.curFans.appAccountId
      })
      if (res.code === 1) {
        let sessionId = getCookieSession()
        let userId = this.getToken().userId
        let corp = this.localStorageSaveOrRead("currentCorp")
        const baseUrl = `${CHAT_URL}/?sid=${sessionId}&corpId=${
          corp.applyId
        }&uid=${userId}&convId=${res.data.conversationId}`
        window.open(baseUrl)
      } else {
        this.$Message.error(res.message || "发起会话失败")
      }
    },
    async changeTab(val) {
      const payload = {
        convrId: `1_${this.curFans.appAccountId}_${this.curFans.fansId}`
      }
      switch (val) {
        case "1":
          this.getFan({
            id: this.curFans.fansId,
            appAccountId: this.curFans.appAccountId
          })
          break
        case "2":
          this.getConversationStatistics(payload)
          break
        case "3":
          this.page = 1
          this.nomore = false
          payload.offset = this.page
          let res = await this.getFansRecord(payload)
          const { data } = res
          if (data.records.length < 20) {
            this.nomore = true
          }
          this.page++
          break
        default:
          break
      }
    },
    destroyed() {
      this.$root.Bus.$off("updateCurFans")
    }
  }
}
</script>

<style lang="stylus">
#fansDetail
  position fixed
  left 0
  top 0
  right 0
  bottom 0
  z-index 50
  .user_wrap
    position fixed
    left 0
    top 0
    right 0
    bottom 0
    padding 30px 0
    z-index 50
.fade-enter-active, .fade-leave-active
  transition opacity 0.5s
.fade-enter, .fade-leave-to
  opacity 0
#user_info
  position relative
  margin 0 auto
  width 340px
  height 100%
  text-align center
  color #2c3e50
  font-size 14px
  background #fff
  box-shadow 0px 1px 6px 0px rgba(0, 0, 0, 0.2)
  .wrap
    height 100%
    display flex
    flex-direction column
    line-height 24px
  .close
    position absolute
    right 20px
    top 20px
    z-index 20
    cursor pointer
    .icon
      font-size 12px
      color #fff
  .info_card
    position relative
    height 254px
    color #fff
    .card_bg
      position absolute
      width 100%
      height 100%
      // background-image url('~@/assets/images/fans-bg.png')
      background-position center center
      background-repeat no-repeat
      background-size cover
    .card_info
      position absolute
      bottom 0
      width 100%
      height 110px
      z-index 1
      padding 26px 20px 15px
      text-align left
      font-size 14px
      background linear-gradient(top, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.7))
      // background-image url('~@S/images/fans/shadow.png')
      background-position center center
      background-repeat no-repeat
      background-size cover
      text-shadow 0px 1px 0px #000000
      .ellipsis
        white-space nowrap
        text-overflow ellipsis
        overflow hidden
      .avatar
        img
          width 66px
          height 66px
          border solid 1px #fff
      .name
        display flex
        align-items center
        font-size 20px
        .sex
          margin-left 4px
          font-size 16px
      .wechat
        display flex
        align-items center
      .origin
        overflow hidden
        white-space nowrap
        text-overflow ellipsis
      .wechat .status
        display inline-block
        font-size 10px
        padding 3px
        color #fff
        letter-spacing 2px
        background #606366
        border-radius 3px
        transform scale(0.8)
        &.active
          background #329800
  .tab-bar
    padding 0
    background #ffffff
    border-bottom solid 1px #efefef
    .tab
      padding-top 18px
      padding-bottom 14px
      font-size 14px
      color #606366
      &_active
        color #409fff
  #tabs
    display flex
    flex-direction column
    flex 1
    overflow hidden
    .tab-panels
      flex 1
    .tab-panels-group
      height 100%
    .tab-panel
      height 100%
      position relative
    .send_chat
      border-top 1px solid #e3e4e6
      padding 20px
      .ivu-btn-primary
        background-color #409fff
        border-radius 3px
        height 40px
        padding 0 40px
  #basicInfo
    padding 10px 20px
    font-size 14px
    .info_detail
      padding-right 10px
      &>li
        margin-bottom 16px
        line-height 28px
        text-align left
        margin-bottom 16px
        display flex
        align-items center
        & > span
          display inline-block
          // float left
          width 56px
          color #979899
          text-align right
        & > div
          flex 1
          margin-left 18px
          color #000
          // input
          // border 1px solid #46b6ef
          // width 100px
          input[disabled]
            border none
          i
            text-align left
        .action
          .ivu-btn
            height 28px
            vertical-align middle
            background-color #e3e4e5
            border-radius 3px
            border solid 1px #e3e4e5
            color #606366
            padding 0 11px
            line-height normal
            &.active
              background-color #409fff
              color #fff
              border solid 1px #409fff
    .user_tags
      border-top 1px solid #e3e4e6
      padding 15px 0
      margin 0 -5px
      display block !important
      clear both
      color #fff
      &:after
        content ''
        display block
        clear both
        height 0
      li
        float left
        padding 0 9px
        line-height 28px
        border-radius 3px
        margin 5px
      .define
        cursor pointer
        background #fff !important
        border solid 1px #e3e4e5
        color #606366
  #interaction
    font-size 14px
    color #979899
    line-height 16px
    text-align left
    padding 0 20px
    .num_list
      display flex
      flex-wrap wrap
      padding-bottom 40px
      border-bottom solid 1px #e3e4e6
      margin-bottom 30px
      &>div
        margin-top 40px
        width 50%
        text-align center
        .num
          margin-bottom 8px
          font-size 30px
          color #409fff
          i
            line-height 0
            font-size 12px
    .time_list
      line-height 28px
      span
        margin-left 20px
  #track
    font-size 14px
    color #979899
    line-height 16px
    text-align left
    padding 40px 20px 40px 18px
    .track_wrap
      padding-left 30px
      li
        &:before
          position absolute
          top 1px
          left -23px
          content ''
          width 1px
          height 100%
          background #e3e4e6
        position relative
        padding-bottom 40px
        .track_cont, .track_time
          margin-top 8px
        .dot
          position absolute
          left -26px
          content ''
          width 8px
          height 8px
          background #cacbcc
          border-radius 50%
      li:first-of-type
        .track_title
          color #303133
        .track_cont
          font-size 12px
          color #303133
        .dot
          display flex
          align-items center
          justify-content center
          position absolute
          left -29px
          width 14px
          height 14px
          background #b2d9ff
          border-radius 50%
          &:before
            content ''
            width 7px
            height 7px
            background #409fff
            border-radius 50%
      li:last-of-type
        &:before
          height 0
@media screen and (-ms-high-contrast: none)
  #user_info
    .card_info
      background-image url('~@S/images/fans/shadow.png')
</style>
