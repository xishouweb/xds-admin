<template>
  <div class="margintb30 card-border paddingb30">
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
        <span>趋势分析</span>
      </div>
    </chart>
    <detailedData :data="tableData"></detailedData>
  </div>
</template>

<script>
import chart from '@/pages/admin/statistics/components/drawStaticsPic.vue'
import dayjs from 'dayjs'
import {
  getAppaccountConvrStatisticsList
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
        endTime: dayjs().format("YYYY-MM-DD HH:mm:ss")
      },
      tableData: [],
      forbiddenTime: [1,2,3],
      initDateType: "4",
      statisCountDataChat: {},
      statisMapListChat: [],
      typeChat: [
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
          type: "interactCount",
        },
        {
          name: "互动人数",
          type: "interactNum", // msgCount + activeEventCount
        }
      ],
    }
  },
  props: ['currentPublic'],
  mounted() {
    this.chatList()
  },
  watch: {
    currentPublic(nv) {
      this.chatList()
    }
  },
  methods: {
    async chatList(params) {
      console.log(params)
      params && (this.prevParams = params)
      let _param = params || this.prevParams

      let param = {
        countType: 'day',
        startTime: dayjs(_param.startTime).format("YYYY-MM-DD HH:mm:ss"),
        endTime: dayjs(_param.endTime).format("YYYY-MM-DD HH:mm:ss"),
        appaccountIds: this.currentPublic
      }
      let res = await getAppaccountConvrStatisticsList(param)
      if (res.code === 1) {
        let visitTotalCount = 0
        let visitCount = 0
        let interactCount = 0
        let interactNum = 0

        this.statisMapListChat = res.data.map(item => {
          visitTotalCount += item.visitTotalCount
          visitCount += item.visitCount
          interactCount += item.interactCount
          interactNum += item.msgCount + item.activeEventCount
          return {
              ...item,
              interactNum: item.msgCount + item.activeEventCount
            }
        })
        this.statisCountDataChat = {
            visitTotalCount,
            visitCount,
            interactCount,
            interactNum,
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


