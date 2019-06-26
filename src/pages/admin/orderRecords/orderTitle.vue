<template>
  <div id="orderTitle">
    <div class="left">
      <Row type="flex" justify="center" align="middle" class="rows">
       <Col class="left_wrap">
        <span class="icon" :class="leftObj.className" value="待支付" v-html="leftObj.icon"></span>
        <Row type="flex" align="middle" justify="center" class="title_des">
          <Col><h3>{{leftObj.name}}</h3></Col>
          <Col v-if="leftObj.tips && (details.status - 0 !== 0)"><i>{{leftObj.tips}}</i></Col>
          <Col v-if="details.status - 0 === 0">
            剩余<CountDown color="inherit" :creatTime="details.orderCreateTime" :serviceTime="details.curTime" @payInvalid="orderInvalid"></CountDown>
          </Col>
        </Row>
       </Col>
       <Col class="tip" v-if="leftObj.restTip">
        {{leftObj.restTip}}
       </Col>
      </Row>
    </div>
    <!-- <div class="split_line"></div> -->
    <div class="right lightGray_color" style="max-width: 50%">
      <Row type="flex" justify="start" align="middle" class="right_list">
       <Col v-for="(item, key, index) in rightObj" :key="index" v-if="item">
          <span>{{key}}</span> <i style="display: inline-block;width: 200px; text-overflow: ellipsis; white-space: nowrap; overflow: hidden;">{{item}}</i>
       </Col>
      </Row>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'orderTitle',
    data() {
        return {
          detailArr: [],
          leftObj: {},
          rightObj: {}
        }
    },
    props: ['details'],
    watch: {
      details() {
        if (this.details.orderId !== undefined) {
          this.transferStatus()
        }
      }
    },
    components: {},
    methods: {
      // 订单过期
      orderInvalid() {
        this._BUS.$emit('handleOrder', 'orderClose', this.details)
      },
      transferStatus() {
        let list = this.details.payDetailList
        switch (this.details.status - 0) {
          // 待付款
          case 0:
            this.leftObj = {
              name: '待付款...',
              restTip: '该订单为您保留48小时, 48小时之后如果还未付款, 系统将自动取消订单',
              className: 'unpay',
              icon: '&#xe6ab;'
            }
            this.rightObj = {
              '订购企业': this.details.corpName,
              '订单编号': this.details.orderId,
              '创建时间': this.details.orderCreateTime
            }
            break
          // 订单完成
          case 1:
            this.leftObj = {
              name: '订单完成 ！',
              className: 'success',
              icon: '&#xe749;'
            }
            this.rightObj = {
              '订购企业': this.details.corpName,
              '订单编号': this.details.orderId
            }
            if (list.length === 1) {
              this.rightObj['支付单号'] = list[0].payOrderNo
              this.rightObj['支付流水号'] = list[0].batchNo
            }
            this.rightObj['创建时间'] = this.details.orderCreateTime
            if (list.length === 1) {
              this.rightObj['付款时间'] = list[0].payTime
              list[0].payType === 3 && (this.rightObj['上传凭证时间'] = list[0].uploadVoucherTime)
            }
            break
          // 订单关闭
          case 2:
            this.leftObj = {
              name: '订单关闭 ！',
              className: 'error',
              icon: '&#xe703;'
            }
            this.rightObj = {
              '订购企业': this.details.corpName,
              '订单编号': this.details.orderId,
              '创建时间': this.details.orderCreateTime,
              '关闭时间': this.details.orderUpdateTime
            }
            break
          // 待审核
          case 3:
            this.leftObj = {
              name: '待审核...',
              className: 'unpay',
              icon: '&#xe60e;'
            }
            this.rightObj = {
              '订购企业': this.details.corpName,
              '订单编号': this.details.orderId
            }
            if (list.length === 1) {
              this.rightObj['支付单号'] = list[0].payOrderNo
              this.rightObj['支付流水号'] = list[0].batchNo
            }
            this.rightObj['创建时间'] = this.details.orderCreateTime
            if (list.length === 1) {
              list[0].payType === 3 && (this.rightObj['上传凭证时间'] = list[0].uploadVoucherTime)
            }
            break
          // 审核失败
          case 4:
            this.leftObj = {
              name: '审核失败 ！',
              className: 'error',
              icon: '&#xe61a;'
            }
            this.rightObj = {
              '订购企业': this.details.corpName,
              '订单编号': this.details.orderId
            }
            list.length === 1 && (this.rightObj['支付单号'] = list[0].payOrderNo)
            this.rightObj['创建时间'] = this.details.orderCreateTime
            if (list.length === 1) {
              list[0].payType === 3 && (this.rightObj['上传凭证时间'] = list[0].uploadVoucherTime)
            }
            break
          // 审核成功
          case 5:
            this.leftObj = {
              name: '审核成功 ！',
              className: 'success',
              icon: '&#xe60f;'
            }
            this.rightObj = {
              '订购企业': this.details.corpName,
              '订单编号': this.details.orderId
            }
            if (list.length === 1) {
              this.rightObj['支付单号'] = list[0].payOrderNo
              this.rightObj['支付流水号'] = list[0].batchNo
            }
            this.rightObj['创建时间'] = this.details.orderCreateTime
            if (list.length === 1) {
              list[0].payType === 3 && (this.rightObj['上传凭证时间'] = list[0].uploadVoucherTime)
            }
            this.rightObj['审核时间'] = this.details.authTime
            break
          // 订单异常
          case 6:
            this.leftObj = {
              name: '订单处理中...',
              className: 'unpay',
              icon: '&#xe610;'
            }
            this.rightObj = {
              '订购企业': this.details.corpName,
              '订单编号': this.details.orderId,
              '创建时间': this.details.orderCreateTime
            }
            break
          default:
            break
        }
        list.length === 1 && (this.leftObj.tips = '支付方式：' + this.transferPayType(list[0].payType))
      },
      transferPayType(payType) {
        return payType === 1 ? '微信公众号支付' : payType === 2 ? '支付宝支付' : payType === 3 ? '银行汇款' : '微信H5支付'
      }
    }
  }
</script>
<style lang="stylus" scoped>
@import '~@/assets/stylus/index'
  #orderTitle
    bgColor(#f7f9fa)
    height:183px
    padding:25px
    .left
      fl()
      height:100%
      width:50%
      padt(10px)
      .rows
        height:100%
        .left_wrap
          inline()
          .icon
            fl()
            fn(46px)
            mt(-5px)
            mr(3px)
          .unpay
            color(#ffbc58)
          .success
            color(#3fb838)
          .error
            color(err_color)
          img
            width:40px
            height 40px
            fl()
            mr(8px)
          .title_des
            fl()
            height:40px
            .ivu-col
              width:100%
              h3
                fn(16px)
                weight()
                mb(5px)
        .tip
          fn(12px)
          color(#979899)
          line-height:16px
          center()
    .right
      height:100%
      width 40%
      fr()
      borl()
      vertical-align middle
      // width:45%
      width: 350px
      center()
      .right_list
        height:100%
        color: #979899
        .ivu-col
          width:100%
          alignL()
          ellipsis()
          padl(20px)
          color: #979899
          span
            mr(2px)
            width: 85px
            fl()
          i
            fl()
</style>
