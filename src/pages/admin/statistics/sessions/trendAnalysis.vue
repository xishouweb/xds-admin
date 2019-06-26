<template>
  <div class="margintb30 card-border paddingb30" >
    <chart
      :forbiddenTime="forbiddenTime"
      :initDateType="initDateType"
      :selectType="0"
      :dataType="typeChat"
      :statisCountData="statisCountDataChat"
      :statisList="statisMapListChat"
      :initTimeRange="[prevParams.startTime, prevParams.endTime]"
      @changeSelection="chatList"
      @data-create="getTableDate">
      <div slot="label" class="border-left">
        <span >趋势分析</span>
      </div>
    </chart>

    <detailedData :data="tableData"></detailedData>
  </div>
</template>

<script>
import chart from '@/pages/admin/statistics/components/drawStaticsPic.vue'
import dayjs from 'dayjs'
import {
  getSeatConvrStatisticsList
} from '@/api/statics.js'
export default {
  components: {
    chart,
    detailedData: () => import('./detailedData.vue'),
  },
  data() {
    return {
      prevParams: {
        startTime: dayjs().subtract(7, 'day').format("YYYY-MM-DD HH:mm:ss"),
        endTime: dayjs().subtract(1, 'day').format("YYYY-MM-DD HH:mm:ss")
      },
      tableData: [],
      forbiddenTime: [1,2,3],
      initDateType: "4",
      statisCountDataChat: {},
      statisMapListChat: [],
      typeChat: [
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
        },
        {
          name: "抢单次数",
          type: "seatQdCount",
        }
      ],
    }
  },
  props: ['currentPublic', 'seatId'],
  mounted() {
    this.chatList()
  },
  watch: {
    currentPublic(nv) {
      this.chatList()
    },
    seatId(nv) {
      this.chatList()
    }
  },
  methods: {
    async chatList(params) {
      if (!this.currentPublic.length) {
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
        appaccountIds: this.currentPublic
      }

      let res = await getSeatConvrStatisticsList(param)
      if (res.code === 1) {
        let msgCount = 0
        let eventCount = 0
        let massPreviewCount = 0
        let seatQdCount = 0

        this.statisMapListChat = res.data.map(item => {
          msgCount += item.msgCount
          eventCount += item.eventCount
          massPreviewCount += item.massPreviewCount
          seatQdCount += item.seatQdCount
          return {
              ...item
            }
        })

        this.statisCountDataChat = {
            msgCount,
            eventCount,
            massPreviewCount,
            seatQdCount
        }
      } else {
        // this.$Message.error(res.message)
      }
    },

    getTableDate(data) {
      this.tableData = data
      console.log(data)
    }
  }
}
</script>


