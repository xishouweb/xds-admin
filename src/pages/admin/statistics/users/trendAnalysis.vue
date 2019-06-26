<template>
  <div class="margintb30">
    <div class="paddingb30">
      <span class="border-left">趋势分析</span>
      <Poptip trigger="hover" transfer placement="right-start"  popper-class="poptip-text" >
        <i class="icon" style="color: #979899;">&#xe635;</i>
        <div slot="content" style="width: 227px; whiteSpace: normal">
          <p class="pop-h">累计关注人数</p>
          <p class="pop-p">当前关注的用户总数。</p>
          <p class="pop-h">新增人数</p>
          <p class="pop-p">新关注的去重用户数。</p>
          <p class="pop-h">净增关注人数</p>
          <p class="pop-p">净增长的去重关注用户数。</p>
          <p class="pop-h">已取消人数</p>
          <p class="pop-p">取消关注的去重用户数。</p>
        </div>
      </Poptip>
    </div>

    <chart
      :forbiddenTime="forbiddenTime"
      :initDateType="initDateType"
      :dataType="typeChat"
      :statisCountData="statisCountDataChat"
      :statisList="statisMapListChat"
      :initTimeRange="[prevParams.startTime, prevParams.endTime]"
      @changeSelection="chatList"
      @data-create="getTableDate">
    </chart>

    <detailedData :data="tableData"></detailedData>
  </div>
</template>

<script>
import chart from '@/pages/admin/statistics/components/drawStaticsPic.vue'
import dayjs from 'dayjs'
import {
  getPublicAccountUserPage,
} from '@/api/statics.js'
export default {
  components: {
    chart,
    detailedData: () => import('./detailedData.vue'),
  },
  data() {
    return {
      prevParams: {
        startTime: dayjs().subtract(8, 'day').format("YYYY-MM-DD HH:mm:ss"),
        endTime: dayjs().subtract(1, 'day').format("YYYY-MM-DD HH:mm:ss")
      },
      tableData: [],
      forbiddenTime: [1,2,3],
      initDateType: "4",
      statisCountDataChat: {},
      statisMapListChat: [],
      typeChat: [
        {
          name: "累计关注人数",
          type: "totalCumulateUser",
        },
        {
          name: "新增人数",
          type: "totalNewUser",
        },
        {
          name: "净增人数",
          type: "clear", // totalNewUser - totalCancelUser
        },
        {
          name: "已取消人数",
          type: "totalCancelUser",
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
      params && (this.prevParams = params)
      let _param = params || this.prevParams
      let param = {
        fromDate: dayjs(_param.startTime).format("YYYY-MM-DD HH:mm:ss"),
        toDate: dayjs(_param.endTime).format("YYYY-MM-DD HH:mm:ss"),
        appAccountIdList: this.currentPublic
      }
      let res = await getPublicAccountUserPage(param)
      if (res.code === 1) {
        this.statisCountDataChat = {
          "totalCumulateUser": res.data.totalCumulateUser,
          "totalNewUser": res.data.totalNewUser,
          "clear": res.data.totalNewUser - res.data.totalCancelUser || 0,
          "totalCancelUser": res.data.totalCancelUser
        }

        this.statisMapListChat = res.data.publicAccountUserSourceList.map(item => {
          return {
              "totalCumulateUser": item.cumulateUser,
              "totalNewUser": item.newUser,
              "clear": item.newUser - item.cancelUser || 0,
              "totalCancelUser": item.cancelUser,
              "recordTime": null,
              "year": dayjs(item.refDate).year(),
              "month": dayjs(item.refDate).month() + 1,
              "day": dayjs(item.refDate).date()
            }
        })
      } else {
         this.statisCountDataChat = {
          "totalCumulateUser": 0,
          "totalNewUser": 0,
          "clear": 0,
          "totalCancelUser": 0
        }
        this.statisMapListChat = [{
            "totalCumulateUser": 0,
            "totalNewUser": 0,
            "clear": 0,
            "totalCancelUser": 0,
            "recordTime": null,
            "year": 0,
            "month": 0,
            "day": 0
          }]
      }
    },

    getTableDate(data) {
      this.tableData = data
      console.log(data)
    }
  }
}
</script>


