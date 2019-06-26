<template>
  <div class="statistics-page">
    <div class="title-height">
      <HeaderTitle>客服会话统计
        <Poptip trigger="hover" transfer placement="right-start"  popper-class="poptip-text" >
          <i class="icon" style="color: #979899;">&#xe635</i>
          <div slot="content" style="width: 227px; whiteSpace: normal">
            <p>统计分析客服工作量。</p>
          </div>
        </Poptip>
      </HeaderTitle>

      <div class="paddingb30 bottom-line">
        <selectAppAcount style="display: inline-block" @on-change="getcurrentType">
          <span class="text-light">选择公众号：</span>
        </selectAppAcount>
        <div style="display: inline-block">
        选择客服：
        <Select :value="defaultAll" size="small" style="width:164px" @on-change="getcurrentService">
          <Option :value="-1">全部客服</Option>
          <Option v-for="(item, index) in showSeatList"
            :name="item.appAccountId"
            :key="index" :value="item.seatId">{{item.nickname}}({{item.seatNo}})</Option>
        </Select>
        </div>
      </div>
    </div>



    <BScroll :offsetBottom="20" :data="total" class="paddingb30">
    <div class="paddingt40">
      <div class="card-border key-number">
        <div class="s-title text-dark">
          <p class="border-left">
            关键指标
              <Poptip trigger="hover" transfer placement="right-start"  popper-class="poptip-text" >
              <i class="icon" style="color: #979899;">&#xe635</i>
              <div slot="content" style="whiteSpace: normal">
                <p class="pop-h">累计</p>
                <p class="pop-p">以绑定公众号到我们系统开始算起，截止到昨天的累计数据。</p>
                <p class="pop-h">今天</p>
                <p class="pop-p">今天的数据。</p>
              </div>
            </Poptip>
          </p>
        </div>
        <div class="paddingtb30">
          <Row style="height: 148px">
            <Col span="6" class="center first">
              <p class="text-light">
                会话消息条数
                <Poptip trigger="hover" transfer placement="right-start"  popper-class="poptip-text" >
                  <i class="icon" style="color: #979899;">&#xe635</i>
                  <div slot="content" style="width: 227px; whiteSpace: normal">
                    <p>客服发送消息的消息条数，同一客服发送多条会话消息计为多条，群发消息、智能接待消息不包含在内。</p>
                  </div>
                </Poptip>
              </p>
              <div class="text-dark fn28 padding20">
                <div class="first-child padding10">累计</div>
                {{total.msgCount | addComma}}
              </div>
              <div class="text-light fn20">
                <div class="first-child">今天</div>
                {{today.msgCount | addComma}}
              </div>
            </Col>
            <Col span="6" class="center">
              <p class="text-light">
                会话消息人数
                <Poptip trigger="hover" transfer placement="right-start"  popper-class="poptip-text" >
                  <i class="icon" style="color: #979899;">&#xe635</i>
                  <div slot="content" style="width: 227px; whiteSpace: normal">
                    <p>客服与粉丝对话的人数，同一粉丝多次会话计为1人。</p>
                  </div>
                </Poptip>
              </p>
              <div class="text-dark fn28 padding20">
                {{total.converCount | addComma}}
              </div>
              <div class="text-light fn20">
                {{today.converCount | addComma}}
              </div>
            </Col>
            <Col span="6" class="center">
              <p class="text-light">
                强制发送次数
                <Poptip trigger="hover" transfer placement="right-start"  popper-class="poptip-text" >
                  <i class="icon" style="color: #979899;">&#xe635</i>
                  <div slot="content" style="width: 227px; whiteSpace: normal">
                    <p>客服强制发送消息的次数。</p>
                  </div>
                </Poptip>
              </p>
              <div class="text-dark fn28 padding20">
                {{total.massPreviewCount | addComma}}
              </div>
              <div class="text-light fn20">
                {{today.massPreviewCount | addComma}}
              </div>
            </Col>
            <Col span="6" class="center">
              <p class="text-light">
                抢单次数
                <Poptip trigger="hover" transfer placement="right-start"  popper-class="poptip-text" >
                  <i class="icon" style="color: #979899;">&#xe635</i>
                  <div slot="content" style="width: 227px; whiteSpace: normal">
                    <p>客服在抢单模式下的抢单数量。只在抢单模式下显示。</p>
                  </div>
                </Poptip>
              </p>
              <div class="text-dark fn28 padding20">
                {{total.seatQdCount | addComma}}
              </div>
              <div class="text-light fn20">
                {{today.seatQdCount | addComma}}
              </div>
            </Col>
          </Row>
        </div>
      </div>

      <trendAnalysis :seatId="seatId" :currentPublic="currentPublic"></trendAnalysis>
    </div>
    </BScroll>
  </div>
</template>

<script>
import { mapState } from "vuex"
import {
  getRepSeatConvrToday,
  getRepSeatConvrStatistics,
  getKfSeatList
} from '@/api/statics.js'
export default {
  components: {
    HeaderTitle: () => import('@/components/pageStyle/headerTitle.vue'),
    trendAnalysis: () => import('./trendAnalysis.vue'),
    selectAppAcount: () => import('../components/selectAppAcount.vue'),
  },
  computed: {
    ...mapState({
      currentPublicNo: state => state.publicAccount.curPublic,
      publicList: state => state.publicAccount.publicAccountList
    }),
    showSeatList() {
      return this.seatList.filter(item => {
        return this.currentPublic.includes(item.appaccountId)
      })
    }
  },
  data() {
    return {
      seatList: [],
      seatId: null,
      currentPublic: [],
      defaultAll: -1,
      data: [],
      today: {},
      total: {}
    }
  },
  methods: {
    getcurrentService(seatid) {
      this.defaultAll = seatid
      this.seatId = seatid === -1 ? null : seatid
      this.getTodayData()
      this.getTotalData()
    },
    getcurrentType(appIdList) {
      this.defaultAll = -1
      this.currentPublic = appIdList
      this.getSeatList()
      this.getTodayData()
      this.getTotalData()
    },
    async getTodayData() {
      let res = await getRepSeatConvrToday({
        appaccountIds: this.currentPublic,
        seatId: this.seatId
        })
      if (res.code === 1) {
        this.today = res.data
      }
    },
    async getTotalData() {
      let res = await getRepSeatConvrStatistics({
        appaccountIds: this.currentPublic,
        seatId: this.seatId
        })
      if (res.code === 1) {
        this.total = res.data
      }
    },
    async getSeatList() {
      let res = await getKfSeatList({
        appaccountIds: this.currentPublic
        })
      if (res.code === 1) {
        this.seatList = res.data
      }
    }
  }
}
</script>

<style lang="stylus">
@import '../statistics.styl'
  .key-number
    .first
      position relative
      .first-child
        font-size 14px
        position absolute
        left 20px
    .ivu-col:not(.first)
      border-left: 1px solid #edeff0;

</style>
