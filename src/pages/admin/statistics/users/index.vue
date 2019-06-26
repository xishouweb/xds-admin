<template>
  <div class="statistics-page">
    <div class="title-height">
    <HeaderTitle>用户概况
      <Poptip trigger="hover" transfer placement="right-start"  popper-class="poptip-text" >
        <i class="icon" style="color: #979899;">&#xe635</i>
        <div slot="content" style="width: 227px; whiteSpace: normal">
          <p>统计企业下所有正常状态且已认证公众号和用户的整体数据，整体掌握各公众号的运营状态。</p>
        </div>
      </Poptip>
    </HeaderTitle>

    <div class="paddingb30 bottom-line">
      <selectAppAcount style="display: inline-block" @on-change="getcurrentType">
        <span class="text-light">选择公众号：</span>
      </selectAppAcount>
    </div>

    </div>

    <BScroll :offsetBottom="20" :data="data1">
      <Row class="paddingb30 bottom-line">
        <Col class="paddingtb30" :lg="12" :md="24" :sm="24" :xs="24">
          <baseData :data="data1"></baseData>
        </Col>
        <Col class="paddingtb30" style="border-left: 1px solid #edeff0;" :lg="12" :md="24" :sm="24" :xs="24">
          <sourseStatic :data="data1"></sourseStatic>
        </Col>
      </Row>

      <trendAnalysis :currentPublic="currentPublic"></trendAnalysis>
    </BScroll>
  </div>
</template>

<script>
import {
  getPublicAccountUserPage,
  getPublicAccountUserCount
} from '@/api/statics.js'
export default {
  components: {
    HeaderTitle: () => import('@/components/pageStyle/headerTitle.vue'),
    baseData: () => import('./baseData'),
    sourseStatic: () => import('./sourseStatic.vue'),
    trendAnalysis: () => import('./trendAnalysis.vue'),
    selectAppAcount: () => import('../components/selectAppAcount.vue'),
  },
  data() {
    return {
      currentPublic: [],
      data1: [],
    }
  },
  methods: {
    getcurrentType(appIdList) {
      this.currentPublic = appIdList
      this.getPublicAccountUserCount(appIdList)
    },
    async getPublicAccountUserCount(appIdList) {
      let param = {
        appAccountIdList: appIdList
      }
      let {code, data, message} = await getPublicAccountUserCount(param)
      if (code === 1) {
        this.data1 = data
      } else {
        this.data1 = []
        // this.$Message.error(message)
      }
    }
  }
}
</script>

<style lang="stylus">
@import '../statistics.styl'
</style>
