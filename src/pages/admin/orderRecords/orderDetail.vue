<template>
  <div id="orderDetail">
    <data-loading :dataSatau="dataSatau">
      <div class="order_title">
        <OrderTitle :details="details"></OrderTitle>
      </div>
      <div class="common_table mt25">
        <p class="table_title" v-if="details.status === 0 && originOrder.goodsName">新订购服务</p>
        <ShowTable :datas="tableDatas" :columns="Const.curOrderColumn"></ShowTable>
      </div>
      <div class="common_table mt25" v-if="details.status === 0 && originOrder.goodsName">
        <p class="table_title">原订购服务</p>
        <ShowTable :datas="originTables" :allMiddle="true" :columns="Const.originOrderColumn"></ShowTable>
      </div>
      <div v-if="details.status === 0 && originOrder.goodsName" class="mt25">
        <CalcMoney :total='toFix(details.goodsNumPrice / 100)' :orderPayprice="details.orderPayprice" :deduction="toFix(originOrder.minusPrice / 100)" :status="details.status"></CalcMoney>
      </div>
      <div class="pay_list" v-if="details.payDetailList && (details.payDetailList.length > 1) && (this.details.status !== 0)">
        <PayList :details="details"></PayList>
      </div>
      <div v-if="showRealPay()" class="mt25 fr realPay">
        <RealPay :status="details.status" :realPay="toFix(details.orderPayprice / 100)"></RealPay>
      </div>
      <PayImg v-if="showPayImg()" class="mt25" :details="details"></PayImg>
      <div class="bottom_p">
        <div class="checkInfo" v-if="details.status === 4 && details.payDetailList[0].authMisc">
          <h3>审核备注</h3>
          <span>{{details.payDetailList && details.payDetailList[0].authTime}}</span>
          <p>{{details.payDetailList && details.payDetailList[0].authMisc}}</p>
        </div>
        <div class="order_btns mt25">
          <Button @click="handle('orderGoback')">返回</Button>
          <Button v-if="details.status === 4 || (details.status === 0)" @click="handle('cancelOrder', details)">取消订单</Button>
          <Button type="primary" v-if="details.status === 0" @click="handle('orderPayNow', details)">立即付款</Button>
          <Button type="primary" v-if="drawerDetail && details.status === 4" @click="restartOrder">重新订购</Button>
        </div>
      </div>
    </data-loading>
  </div>
</template>
<script>
  import OrderTitle from './orderTitle'
  import ShowTable from './showTable'
  import CalcMoney from './calcMoney'
  import PayImg from './payImg'
  import RealPay from './realPay'
  import PayList from './payList'
  import Const from './const'
  import {
    getPersonalInfo
  } from '@/api/query'
  export default {
    name: 'orderDetail',
    data() {
        return {
          details: {},
          originOrder: {},
          tableDatas: [],
          originTables: [],
          dataSatau: 2,
          Const: Const
        }
    },
    props: ['orderInfo', 'drawerDetail'],
    created() {
      this._BUS.$on('refreshOrderDetail', () => {
        this.getDetails()
      })
      this.getDetails()
    },
    mounted() {
      this.$root.Bus.$emit('calcScrollHeight')
    },
    components: { OrderTitle, ShowTable, CalcMoney, PayImg, RealPay, PayList },
    methods: {
      isCancel() {
        if (this.details.status === 0 || this.details.status === 4) {
          return true
        }
      },
      getPersonalInfo() {
        getPersonalInfo().then(data => {
          if (data.code === 1) {
            let tokenData = {}
            tokenData.corpList = (data.data.corpList && data.data.corpList.length) || 0
            tokenData = Object.assign({}, this.getToken(), tokenData)
            this.setToken(tokenData, 0.5)
          }
        })
      },
      // 获取现有的订单
      getDetails() {
        this.dataSatau = 1
        let param = {
          orderId: this.orderInfo.orderId,
          corpId: this.orderInfo.corpId
        }
        this.ajaxOrderDetail(param).then((res) => {
          this.dataSatau = 2
          if (res.code === 1) {
            this.getPersonalInfo()
            this.details = res.data
            this.details.status === 0 && this.getOriginOrder()
            this.installNowOrder()
          } else {
            this.$Message.error(res.message)
            this.handle('orderGoback')
          }
        })
      },
      // 获取使用中的订单
      getOriginOrder() {
        this.ajaxUsingMenu({corpId: this.orderInfo.corpId}).then((res) => {
          if (res.code === 1) {
            if (res.data) {
              this.originOrder = res.data
              this.installOriginOrder()
            }
          }
        })
      },
      timeHandle(item) {
        return (item.timeUnitNum + item.timeUnit) || '1年'
      },
      installNowOrder() {
        let priceObj = '<div class="priceObj">' +
            '<p>￥' + this.toFix(this.details.goodsDiscountsPrice / 100) + '</p>' +
            '<span>￥' + this.toFix(this.details.goodsPrice / 100) + '</span>' +
          '</div>'
        let userObj = '<div class="userObj">' +
            (this.details.picUrl ? '<img src="' + this.details.picUrl + '" />' : '') +
            '<div class="infos">' +
              '<p>' + this.details.orderNickname + '</p>' +
              (this.details.orderMobile ? '<p>' + this.details.orderMobile + '</p>' : '') +
            '</div>' +
          '</div>'
        this.tableDatas = [
          '<span>' + this.details.goodsName + '</span>',
          priceObj,
          '<span>x' + this.details.goodsNum + '</span>',
          userObj,
          '<span>' + this.timeHandle(this.details) + '</span>',
          '<span>￥' + this.toFix(this.details.goodsNumPrice / 100) + '</span>'
        ]
      },
      installOriginOrder() {
        function filterTime(str) {
          return str ? new Date(str).toLocaleString().replace(/(.*?)\s.*/, "$1") : str
        }
        this.originTables = [
          '<span>' + this.originOrder.goodsName + '</span>',
          '<span>￥' + this.toFix(this.originOrder.goodsPrice / 100) + '</span>',
          '<span>x' + this.originOrder.goodsNum + '</span>',
          '<span>￥' + this.toFix(this.originOrder.orderPayprice / 100) + '</span>',
          '<span>' + filterTime(this.originOrder.startTime) + ' —— ' + filterTime(this.originOrder.endTime) + '</span>',
          '<span>' + this.originOrder.leftDay + '天</span>',
          '<span class="err_color">￥' + this.toFix(this.originOrder.minusPrice / 100) + '</span>',
        ]
      },
      showPayImg() {
        return ((this.details.payDetailList && this.details.payDetailList.length && (this.details.payDetailList[0].payType === 3) && this.details.status === 1) || (this.details.status === 5) || (this.details.status === 3) || (this.details.status === 4)) && (this.details.payDetailList && this.details.payDetailList.length < 2)
      },
      showRealPay() {
        return (((this.details.status === 0 && !this.originOrder.goodsName) || (this.details.status === 2) || (this.details.status === 6) || (this.details.status === 1 && this.details.payDetailList[0] && (this.details.payDetailList[0].payType !== 3))) && (this.details.payDetailList && this.details.payDetailList.length < 2))
      },
      handle(key, param) {
        if (this.drawerDetail) {
          if (param) {
            this.$root.Bus.$emit('hideFullPageDrawer', true)
            this._BUS.$emit('handleOrder', key, param)
          } else {
            this.$root.Bus.$emit('hideFullPageDrawer', false)
          }
        } else {
          this._BUS.$emit('handleOrder', key, param)
        }
      },
      restartOrder() {
        this.localStorageSaveOrRead('orderId', this.orderInfo.orderId)
        // this.localStorageSaveOrRead('corpId', this.orderInfo.corpId)
        this.$emit('restartOrder')
      },
    }
  }
</script>
<style lang="stylus">
@import '~@/assets/stylus/index'
  #orderDetail
    .mt25
      mt(25px)
    .order_title
      mt(50px)
    .common_table
      .table_title
        font-weight:bold
        mt(28px)
        mb(10px)
    .realPay
      overflow hidden
      fr()
    .bottom_p
      width: 100%
      clear()
      .checkInfo
        max-width 420px
        fl()
        mt(25px)
        h3
          fl()
          mb(10px)
          mr(10px)
          fn(14px)
        span
          fl()
        p
          clear()
          color(err_color)
      .order_btns
        fr()
        button
          mr(10px)
</style>
