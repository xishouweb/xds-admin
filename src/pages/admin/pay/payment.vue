<template>
  <div class="payment">
    <div class="time-data">
      <div class="left">
        <div class="left-part part1">
          <img src="@/assets/images/pay/paydone.png" alt="">
        </div>
        <div class="left-part part2">
          <p class="p1">订单提交成功，请尽快付款！</p>
          <p class="p2">该订单为您保留48小时，48小时之后如果还未付款，系统将自动取消该订单。</p>
        </div>
      </div>
      <div class="right">
        <div class="residue-data">
          <span class="text"><Icon type="ios-clock-outline" size="14"></Icon>剩余支付时间</span>
          <CountDown @payInvalid="payInvalid" v-if="orderDetailData.orderCreateTime" :validTime="orderDetailData.orderHour" :creatTime="orderDetailData.orderCreateTime" :serviceTime="orderDetailData.curTime"></CountDown>
        </div>
      </div>
    </div>
    <div class="info-list-wrapper">
      <Row>
        <Col span="8">
          <div class="info-tab">
            <div class="info-item info-item-1">
              <span class="text1">订单编号</span>
              <span class="text2">{{orderDetailData.orderId||0}}</span>
            </div>
            <div class="info-item">
              <span class="text1">订购企业</span>
              <span class="text2">{{orderDetailData.corpName}}</span>
            </div>
          </div>
        </Col>
        <Col span="8">
          <div class="info-tab info-tab1">
            <div class="info-item info-item-1">
              <span class="text1">订购版本</span>
              <span class="text2">{{orderDetailData.goodsName}}</span>
            </div>
            <div class="info-item">
              <span class="text1">服务期限</span>
              <span class="text2">{{orderDetailData.validDay}}</span>
            </div>
          </div>
        </Col>
        <Col span="8">
         <div class="info-last">
           <span class="text1">实付金额</span>
           <span class="text2"><span class="text3">¥</span> {{orderDetailData.orderPayprice}}元</span>
         </div>
        </Col>
      </Row>
    </div>
    <div class="pay-way">
      <div class="title">
        支付方式
      </div>
      <div class="pay-way-component">
        <PayWay @success="success" :transferProps="transferProps" @isStartInterval="isStartInterval"></PayWay>
      </div>
    </div>
    <NewModal v-model="payClose" header="订单关闭" :maskClosable="false" content="您的订单未及时支付，已自动关闭，您可重新订购或查看订单详情" confrim="重新订购" cancelText="订单详情" @ok="againPay" @cancel="toDetail"></NewModal>
    <NewModal v-model="isOrder" header="订购提醒" :maskClosable="false" confrim="去支付" content="当前企业有待付款订单，您可直接去支付或者重新订购" cancelText="重新订购" @ok="goPay" @cancel="restartPay"></NewModal>
  </div>
</template>
<script>
import PayWay from '@/pages/admin/pay/payWay'
import {getSimpleDetail, getOrderDetail} from '@/api/query'
const timerNum = 5000
export default {
  name: 'payment',
  data() {
    return {
      timer: null,
      isInterval: true,
      orderDetailData: {},
      payClose: false,
      isOrder: false,
      dateArr: [
        {itemKey: "ValidDay", itemValue: "15", itemName: "15天"},
        {itemKey: "ValidDay", itemValue: "180", itemName: "半年"},
        {itemKey: "ValidDay", itemValue: "30", itemName: "1个月"},
        {itemKey: "ValidDay", itemValue: "365", itemName: "一年"},
        {itemKey: "ValidDay", itemValue: "60", itemName: "2个月"},
        {itemKey: "ValidDay", itemValue: "7", itemName: "7天"},
        {itemKey: "ValidDay", itemValue: "90", itemName: "3个月"}
      ],
      transferProps: {}
    }
  },
  created() {
    // this.getOrderDetail()
  },
  mounted() {
    this.getOrderDetail()
    this.setIntervalDetail()
    // this.getSimpleDetail()
  },
  methods: {
    // 轮询查看订单状态
    getSimpleDetail() {
      let params = {
        orderId: this.localStorageSaveOrRead('orderId'),
        corpId: this.localStorageSaveOrRead('corpId'),
      }
      getSimpleDetail(params).then(data => {
        if (data.code === 1) {
          if (data.data.status === 1) {
            this.$emit('nextOrderStep', 1)
            clearInterval(this.timer)
          }
        }
      })
    },
    getOrderDetail() {
      let params = {
        orderId: this.localStorageSaveOrRead('orderId'),
        corpId: this.localStorageSaveOrRead('corpId'),
      }
      getOrderDetail(params).then(data => {
        switch (data.code) {
          case 1:
            this.localStorageSaveOrRead('corpName', data.data.corpName)
            this.localStorageSaveOrRead('orderPayPrice', this.insertPoint(data.data.orderPayprice))
            this.orderDetailData = data.data
            this.orderDetailData.validDay = data.data.timeUnitNum * data.data.goodsNum + data.data.timeUnit
            this.orderDetailData.orderPayprice = this.insertPoint(data.data.orderPayprice || 0)
            this.transferProps.orderPayprice = this.orderDetailData.orderPayprice
            this.transferProps.orderId = data.data.orderId
            // this.$root.Bus.$emit('refreshBScroll',this.orderDetailData)
            break
          default:
            this.$Message.error(data.message)
            break
        }
      })
    },
    setIntervalDetail() {
      this.timer = setInterval(() => {
        this.getSimpleDetail()
      }, timerNum)
    },
    isStartInterval(val) {
      if (val) {
        this.setIntervalDetail()
      } else {
        clearInterval(this.timer)
      }
    },
    transferUnit(item) {
      let result = this.dateArr.find((val) => {
        return val.itemValue - 0 === item.validDay - 0
      })
      return result.itemName
    },
    toDetail() {
      this.$router.push({name: 'records'})
    },
    againPay() {
      let params = {
        corpId: this.localStorageSaveOrRead('corpId'),
      }
      this.getExistOrder(params).then(data => {
        if (data.code === 1) {
          if (data.data.isBuy) {
            this.localStorageSaveOrRead('orderId', data.data.orderId)
            this.isOrder = true
          } else {
            this.$emit('restartOrder')
          }
        } else {
          this.$Message.error(data.message)
        }
      })
    },
    goPay() {
      this.getOrderDetail()
      this.setIntervalDetail()
    },
    restartPay() {
      this.$emit('restartOrder')
    },
    payInvalid() {
      clearInterval(this.timer)
      this.payClose = true
    },
    success(val) {
      this.$emit('nextOrderStep', val)
    }
  },
  components: {
    PayWay
  },
  destroyed() {
    clearInterval(this.timer)
  }
}
</script>
<style lang="stylus">
@import './pay'
</style>


