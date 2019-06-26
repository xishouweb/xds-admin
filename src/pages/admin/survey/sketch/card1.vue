<template>
<Row class="card1">
  <Col span="12"  style="padding-right: 10px;">
    <data-loading :dataSatau="customerLoad">
      <div class="survey-part">
        <div class="part-title">
          <div class="title-left">
            用户概况
            <Poptip trigger="hover" transfer placement="right-start"  popper-class="poptip-text" >
              <i class="icon" style="color: #979899;">&#xe635;</i>
              <div slot="content" style="width: 227px; whiteSpace: normal">
                <p>粉丝总数：关注过公众号的粉丝数量，包含已取消的数量。</p>
                <p>关注中人数：累计关注中的人数。</p>
                <p>已取消人数：关注后取消关注的人数。</p>
              </div>
            </Poptip>
          </div>
          <div class="title-right">
            <div class="today page-link" @click="more(customer.url)">更多</div>
          </div>
        </div>
        <Row class="part-card-content">
          <Col span="8">
            <div class="part-center text-center">
              <div class="part-tit">粉丝总数</div>
              <div class="part-num">{{customer.total || 0}}</div>
            </div>
          </Col>
          <Col span="8">
            <div class="part-center text-center">
              <div class="part-tit">关注中人数</div>
              <div class="part-num">{{customer.close || 0}}</div>
            </div>
          </Col>
          <Col span="8">
            <div class="part-center text-center">
              <div class="part-tit">已取消人数</div>
              <div class="part-num">{{customer.cancle || 0}}</div>
            </div>
          </Col>
        </Row>
        <div class="survey-part-sub-text">更新时间：{{customer.time}}</div>
      </div>
    </data-loading>
  </Col>

  <Col span="12" style="padding-left: 10px;">
    <data-loading :dataSatau="keyNumberLoad">
      <div class="survey-part">
        <div class="part-title">
          <div class="title-left">
            昨日关键指标
            <Poptip trigger="hover" transfer placement="right-start"  popper-class="poptip-text" >
              <i class="icon" style="color: #979899;">&#xe635;</i>
              <div slot="content" style="width: 227px; whiteSpace: normal">
                <p>新增人数：新关注的去重用户数。</p>
                <p>净增人数：净增长的去重关注用户数。</p>
                <p>已取消人数：取消关注的去重用户数。</p>
              </div>
            </Poptip>
          </div>
          <div class="title-right">
            <div class="today page-link" @click="more(keyNumber.url)">更多</div>
          </div>
        </div>
        <Row class="part-card-content">
          <Col span="8">
            <div class="part-center text-center">
              <div class="part-tit">新增人数</div>
              <div class="part-num">{{keyNumber.new || 0}}</div>
            </div>
          </Col>
          <Col span="8">
            <div class="part-center text-center">
              <div class="part-tit">净增人数</div>
              <div class="part-num">{{keyNumber.clear || 0}}</div>
            </div>
          </Col>
          <Col span="8">
            <div class="part-center text-center">
              <div class="part-tit">已取消人数</div>
              <div class="part-num">{{keyNumber.cancle || 0}}</div>
            </div>
          </Col>
        </Row>
      </div>
    </data-loading>
  </Col>

</Row>
</template>

<script>
import { mapState } from "vuex"
import dayjs from 'dayjs'
import {
  getPublicAccountUserCount,
  getPublicAccountUserPage,
  getPublicAccountUserYesterdayCount
} from '@/api/statics.js'
export default {
  data() {
    return {
      customerLoad: 1,
      keyNumberLoad: 1,
      prevParams: {
        startTime: dayjs().subtract(31, 'day').format("YYYY-MM-DD HH:mm:ss"),
        endTime: dayjs().subtract(1, 'day').format("YYYY-MM-DD HH:mm:ss")
      },
      customer: {
        url: '/admin/statistics/users',
        total: 0,
        close: 0,
        cancle: 0,
        time: dayjs().format("YYYY-MM-DD HH:mm:ss"),
      },
      keyNumber: {
        url: '/admin/statistics/users',
        new: 0,
        clear: 0,
        cancle: 0
      }
    }
  },
  filters: {
    zero(val) {
      return val || 0
    }
  },
  computed: {
    ...mapState({
      publicList: state => state.publicAccount.publicAccountList,
    })
  },
  watch: {
    publicList: {
      handler(val) {
        this.getPublicAccountUserCount()
        this.getPublicAccountUserYesterdayCount()
      },
      immediate: true
    }
  },

  methods: {
    more(url) {
      this.$router.push({path: url})
    },
    async getPublicAccountUserCount(appIdList) {
      let param = {
        appAccountIdList: (this.publicList || []).map(item => item.appAccountId)
      }
      let {code, data, message} = await getPublicAccountUserCount(param)
      if (code === 1) {
        this.customerLoad = 2
        this.customer = {...this.customer,
            total: data.totalCancelUser + data.cumulateUser,
            close: data.cumulateUser,
            cancle: data.totalCancelUser,
            time: dayjs().format("YYYY-MM-DD 00:00:00"),
        }
      } else {
        this.customer = {...this.customer,
            total: 0,
            close: 0,
            cancle: 0,
            time: dayjs().format("YYYY-MM-DD 00:00:00"),
        }
        this.customerLoad = 3
        // this.$Message.error(message)
      }
    },
    async getPublicAccountUserYesterdayCount(params) {
      if (!this.publicList.length) {
        this.keyNumberLoad = 2
        this.keyNumber = {
          ...this.keyNumber,
          new: 0,
          clear: 0,
          cancle: 0
        }
        return
      }

      let _param = params || this.prevParams
      let param = {
        // fromDate: dayjs(_param.startTime).format("YYYY-MM-DD HH:mm:ss"),
        // toDate: dayjs(_param.endTime).format("YYYY-MM-DD HH:mm:ss"),
        appAccountIdList: (this.publicList || []).map(item => item.appAccountId)
      }
      let res = await getPublicAccountUserYesterdayCount(param)
      if (res.code === 1) {
        this.keyNumberLoad = 2
        let clear = res.data.totalNewUser - res.data.totalCancelUser
        this.keyNumber = {...this.keyNumber,
          new: res.data.totalNewUser,
          clear: (clear < 0) ? 0 : clear,
          cancle: res.data.totalCancelUser
        }
      } else {
        this.keyNumberLoad = 3
        // this.$Message.error(res.message)
      }
    },
  }
}
</script>

