<template>
  <div class="statistics-page">
    <div class="title-height">
    <HeaderTitle>访问量统计
      <Poptip trigger="hover" transfer placement="right-start"  popper-class="poptip-text" >
        <i class="icon" style="color: #979899;">&#xe635</i>
        <div slot="content" style="width: 227px; whiteSpace: normal">
          <p>统计分析某段时间整个企业或公众号的访问流量，了解运营趋势。</p>
        </div>
      </Poptip>
    </HeaderTitle>

    <div class="paddingb30 bottom-line">
      <selectAppAcount style="display: inline-block" @on-change="getcurrentType">
        <span class="text-light">选择公众号：</span>
      </selectAppAcount>
    </div>
    </div>

    <BScroll :offsetBottom="20" >
    <div class="paddingt40">
      <div class="card-border key-number">
        <div class="s-title text-dark">
          <p class="border-left">
            关键指标
              <Poptip trigger="hover" transfer placement="right-start"  popper-class="poptip-text" >
              <i class="icon" style="color: #979899;">&#xe635</i>
              <div slot="content" style="width: 227px; whiteSpace: normal">
                <p>统计企业下所有正常状态公众号和用户的整体数据，整体掌握各公众号的运营状态。</p>
              </div>
            </Poptip>
          </p>
        </div>
        <div class="paddingtb30">
          <Row style="height: 148px">
            <Col span="6" class="center first">
              <p class="text-light">
                来访人次
                <Poptip trigger="hover" transfer placement="right-start"  popper-class="poptip-text" >
                  <i class="icon" style="color: #979899;">&#xe635</i>
                  <div slot="content" style="width: 227px; whiteSpace: normal">
                    <p>所有来访的人次，包含粉丝发消息事件和粉丝触发活跃和非活跃事件，同一粉丝多次来访则计为多次。</p>
                  </div>
                </Poptip>
              </p>
              <div class="text-dark fn28 padding20">
                <div class="first-child padding10">累计</div>
                {{total.visitTotalCount | addComma}}
              </div>
              <div class="text-light fn20">
                <div class="first-child">今天</div>
                {{today.visitTotalCount | addComma}}
              </div>
            </Col>
            <Col span="6" class="center">
              <p class="text-light">
                来访人数
                <Poptip trigger="hover" transfer placement="right-start"  popper-class="poptip-text" >
                  <i class="icon" style="color: #979899;">&#xe635</i>
                  <div slot="content" style="width: 227px; whiteSpace: normal">
                    <p>所有来访的去重人数，包含粉丝发消息事件和粉丝触发活跃和非活跃事件，以来访时间48小时为单位计算，即从粉丝来访开始48小时内同一粉丝多次来访则计为1人，从最后一次互动开始算起脱离超出48小时后再次互动则再计为1人。</p>
                  </div>
                </Poptip>
              </p>
              <div class="text-dark fn28 padding20">
                {{total.visitCount | addComma}}
              </div>
              <div class="text-light fn20">
                {{today.visitCount | addComma}}
              </div>
            </Col>
            <Col span="6" class="center">
              <p class="text-light">
                互动人次
                <Poptip trigger="hover" transfer placement="right-start"  popper-class="poptip-text" >
                  <i class="icon" style="color: #979899;">&#xe635</i>
                  <div slot="content" style="width: 227px; whiteSpace: normal">
                    <p>通过所有互动事件的人次，包含粉丝发消息事件和粉丝触发活跃事件，同一粉丝多次互动则计为多次。</p>
                  </div>
                </Poptip>
              </p>
              <div class="text-dark fn28 padding20">
                {{total.interactNum | addComma}}
              </div>
              <div class="text-light fn20">
                {{today.interactNum | addComma}}
              </div>

            </Col>
            <Col span="6" class="center">
              <p class="text-light">
                互动人数
                <Poptip trigger="hover" transfer placement="right-start"  popper-class="poptip-text" >
                  <i class="icon" style="color: #979899;">&#xe635</i>
                  <div slot="content" style="width: 227px; whiteSpace: normal">
                    <p>通过所有互动事件的人数，包含粉丝发消息事件和粉丝触发活跃事件，以触发互动事件的时间48小时为单位计算，即从粉丝触发互动事件开始48小时内同一粉丝多次互动则计为1人，从最后一次互动开始算起脱离超出48小时后再次互动则再计为1人。</p>
                  </div>
                </Poptip>
              </p>
              <div class="text-dark fn28 padding20">
                {{total.interactCount | addComma}}
              </div>
              <div class="text-light fn20">
                {{today.interactCount | addComma}}
              </div>
            </Col>
          </Row>
        </div>
      </div>

      <trendAnalysis :currentPublic="currentPublic"></trendAnalysis>
    </div>
    </BScroll>
  </div>
</template>

<script>
import { mapState } from "vuex"
import {
  getRepAppaccountConvrToday,
  getRepAppaccountConvrStatistics
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
    })
  },
  data() {
    return {
      currentPublic: [],
      data: [],
      today: {
        visitTotalCount: 0,
        visitCount: 0,
        interactNum: 0,
        interactCount: 0,
      },
      total: {
        visitTotalCount: 0,
        visitCount: 0,
        interactNum: 0,
        interactCount: 0,
      }
    }
  },
  methods: {
    getcurrentType(appIdList) {
      this.currentPublic = appIdList
      this.getTodayData(appIdList)
      this.getTotalData(appIdList)
    },
    async getTodayData(appIdList) {
      let res = await getRepAppaccountConvrToday({appaccountIds: appIdList})
      if (res.code === 1) {
        this.today = res.data
        this.today.interactNum = res.data.msgCount + res.data.activeEventCount
      } else {
        this.today = {
          visitTotalCount: '--',
          visitCount: '--',
          interactNum: '--',
          interactCount: '--',
        }
      }
    },
    async getTotalData(appIdList) {
      let res = await getRepAppaccountConvrStatistics({appaccountIds: appIdList})
      if (res.code === 1) {
        this.total = res.data
        this.total.interactNum = res.data.msgCount + res.data.activeEventCount
      } else {
        this.total = {
          visitTotalCount: '--',
          visitCount: '--',
          interactNum: '--',
          interactCount: '--',
        }
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
