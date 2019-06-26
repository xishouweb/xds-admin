<template>
<row class="card2">
  <Col span="12"  style="padding-right: 10px;">
    <div class="survey-part">
      <div class="part-title">
        <div class="title-left">
          累计访问量
          <Poptip trigger="hover" transfer placement="right-start"  popper-class="poptip-text" >
            <i class="icon" style="color: #979899;">&#xe635;</i>
            <div slot="content" style="width: 227px; whiteSpace: normal">
              <p>来访人次：所有来访的人次，包含粉丝发消息事件和粉丝触发活跃和非活跃事件，同一粉丝多次来访则计为多次。</p>
              <p>来访人数：所有来访的去重人数，包含粉丝发消息事件和粉丝触发活跃和非活跃事件，以来访时间48小时为单位计算，即从粉丝来访开始48小时内同一粉丝多次来访则计为1人，从最后一次互动开始算起脱离超出48小时后再次互动则再计为1人。</p>
              <p>互动人次：通过所有互动事件的人次，包含粉丝发消息事件和粉丝触发活跃事件，同一粉丝多次互动则计为多次。</p>
              <p>互动人数：通过所有互动事件的人数，包含粉丝发消息事件和粉丝触发活跃事件，以触发互动事件的时间48小时为单位计算，即从粉丝触发互动事件开始48小时内同一粉丝多次互动则计为1人，从最后一次互动开始算起脱离超出48小时后再次互动则再计为1人。</p>
            </div>
          </Poptip>
        </div>
        <div class="title-right">
          <div class="today page-link" @click="more('/admin/statistics/views')">更多</div>
        </div>
      </div>
      <div class="part-card-content">
       <chart
        :forbiddenTime="forbiddenTime"
        :initDateType="initDateType"
        :selectType="1"
        :dataType="typeViews"
        :statisCountData="statisCountDataViews"
        :initTimeRange="[prevParams.startTime, prevParams.endTime]"
        :statisList="statisMapListViews"
        @changeSelection="viewsStatics">
        </chart>
      </div>
    </div>
  </Col>

   <Col span="12" style="padding-left: 10px;">
   <div class="survey-part">
    <div class="part-title">
      <div class="title-left">
        累计客服会话
        <Poptip trigger="hover" transfer placement="right-start"  popper-class="poptip-text" >
          <i class="icon" style="color: #979899;">&#xe635;</i>
          <div slot="content" style="width: 227px; whiteSpace: normal">
            <p>会话消息条数：客服发送消息的消息条数，同一客服发送多条会话消息计为多条，群发消息、智能接待消息不包含在内。</p>
            <p>会话消息人数：客服与粉丝对话的人数，同一粉丝多次会话计为1人。</p>
            <p>强制会话次数：客服强制发送消息的次数。</p>
          </div>
        </Poptip>
      </div>
      <div class="title-right">
        <div class="today page-link" @click="more('/admin/statistics/sessions')">更多</div>
      </div>
    </div>
    <div class="part-card-content">
      <chart
      :forbiddenTime="forbiddenTime"
      :initDateType="initDateType"
      :selectType="1"
      :dataType="typeSessions"
      :statisCountData="statisCountDataSessions"
      :statisList="statisMapListSessions"
      :initTimeRange="[prevParams.startTime, prevParams.endTime]"
      @changeSelection="sessinoStatics"></chart>
    </div>
   </div>
  </Col>
</Row>
</template>

<script>
import chart from '@/pages/admin/statistics/components/drawStaticsPic.vue'
import { mapState } from "vuex"
import dayjs from 'dayjs'
import {
  getSeatConvrStatisticsList,
  getAppaccountConvrStatisticsList
} from '@/api/statics.js'
export default {
  components: {
    chart
  },
  data() {
    return {
      prevParams: {
        startTime: dayjs().subtract(7, 'day').format("YYYY-MM-DD HH:mm:ss"),
        endTime: dayjs().subtract(1, 'day').format("YYYY-MM-DD HH:mm:ss")
      },
      forbiddenTime: [1,2,3],
      initDateType: "4",
      statisCountDataViews: {

      },
      statisMapListViews: [],
      typeViews: [
        {
          name: "来访人次",
          type: "visitTotalCount",
        },
        {
          name: "来访人数",
          type: "visitCount",
        },
        {
          name: "互动人次",
          type: "interactNum", // msgCount + activeEventCount
        },
        {
          name: "互动人数",
          type: "interactCount",
        }
      ],
      statisCountDataSessions: {},
      statisMapListSessions: [],
      typeSessions: [
        {
          name: "会话消息条数",
          type: "msgCount",
        },
        {
          name: "会话消息人数",
          type: "eventCount",
        },
        {
          name: "强制发送次数",
          type: "massPreviewCount",
        }
      ],
    }
  },
  computed: {
    ...mapState({
      publicList: state => state.publicAccount.publicAccountList,
    })
  },
  watch: {
    publicList(nv) {
      this.sessinoStatics()
      this.viewsStatics()
    }
  },
  mounted() {
    this.sessinoStatics()
    this.viewsStatics()
  },
  methods: {
    more(url) {
      this.$router.push({path: url})
    },
    async viewsStatics(params) {
      if (!this.publicList.length) {
        this.statisCountDataViews = {
            visitTotalCount: 0,
            visitCount: 0,
            interactCount: 0,
            interactNum: 0
        }
        this.statisMapListViews = [{
          visitTotalCount: 0,
            visitCount: 0,
            interactCount: 0,
            interactNum: 0
        }]
        return
      }

      params && (this.prevParams = params)
      let _param = params || this.prevParams
      let param = {
        countType: 'day',
        startTime: dayjs(_param.startTime).format("YYYY-MM-DD HH:mm:ss"),
        endTime: dayjs(_param.endTime).format("YYYY-MM-DD HH:mm:ss"),
        appaccountIds: (this.publicList || []).map(item => item.appAccountId)
      }
      let res = await getAppaccountConvrStatisticsList(param)
      if (res.code === 1) {
        let visitTotalCount = 0
        let visitCount = 0
        let interactCount = 0
        let interactNum = 0

        this.statisMapListViews = res.data.map(item => {
          visitTotalCount += item.visitTotalCount
          visitCount += item.visitCount
          interactCount += item.interactCount
          interactNum += item.msgCount + item.activeEventCount
          return {
              ...item,
              interactNum: item.msgCount + item.activeEventCount
            }
        })
        this.statisCountDataViews = {
            visitTotalCount,
            visitCount,
            interactCount,
            interactNum,
        }
      } else {
        // this.$Message.error(res.message)
      }
    },
    async sessinoStatics (params) {
      if (!this.publicList.length) {
        this.statisCountDataSessions = {
            msgCount: 0,
            eventCount: 0,
            massPreviewCount: 0,
            seatQdCount: 0
        }
        this.statisMapListSessions = [{
          msgCount: 0,
            eventCount: 0,
            massPreviewCount: 0,
            seatQdCount: 0
        }]
        return
      }
      params && (this.prevParams = params)
      let _param = params || this.prevParams
      let param = {
        seatId: this.seatId,
        countType: 'day',
        startTime: dayjs(_param.startTime).format("YYYY-MM-DD HH:mm:ss"),
        endTime: dayjs(_param.endTime).format("YYYY-MM-DD HH:mm:ss"),
        appaccountIds: (this.publicList || []).map(item => item.appAccountId)
      }
      let res = await getSeatConvrStatisticsList(param)
      if (res.code === 1) {
        let msgCount = 0
        let eventCount = 0
        let massPreviewCount = 0
        let seatQdCount = 0

        this.statisMapListSessions = res.data.map(item => {
          msgCount += item.msgCount
          eventCount += item.eventCount
          massPreviewCount += item.massPreviewCount
          seatQdCount += item.seatQdCount
          return {
              ...item
            }
        })

        this.statisCountDataSessions = {
            msgCount,
            eventCount,
            massPreviewCount,
            seatQdCount
        }
      } else {
        // this.$Message.error(res.message)
      }
    },
  }
}
</script>

