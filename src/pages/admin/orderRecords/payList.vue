<template>
  <div id="payList">
    <p class="pay_title"><Icon type="android-time"></Icon> 支付单号记录</p>
    <Table :columns="columns" :data="payList"></Table>
    <SelfModal v-model="showPop" :zIndex="showPop && '0'" v-if="showPop">
      <div class="modal_cont">
        <div class="titles">
          <h3>付款方信息</h3>
          <Icon class="icons" type="ios-close-empty" size="36" @click="showPop = false"></Icon>
        </div>
        <Row type="flex" class="rows" aligin="top" v-for="(item, key, index) in popObj" :key="index">
          <Col class="first_col" v-if="key !== '打款凭证' || imgUrl">{{key}}</Col>
          <Col class="sec_col">
            <span v-if="key !== '打款凭证'">{{item}}</span>
            <ImgEnlarge v-if="key === '打款凭证' && imgUrl" :imgUrl="imgUrl |  urlFilter"></ImgEnlarge>
          </Col>
        </Row>
      </div>
    </SelfModal>
  </div>
</template>
<script>
  import Const from './const'
  export default {
    name: '',
    data() {
        return {
          columns: Const.payListColumn(this.showPayList),
          payList: [],
          showPop: false,
          popObj: {},
          imgUrl: ''
        }
    },
    props: ['details'],
    created() {
      this.init()
    },
    components: {},
    methods: {
      init() {
        if (this.details.corpId !== undefined) {
          let list = this.details.payDetailList
          if (list) {
            for (let val of list) {
              val.orderPayprice = (this.details.orderPayprice - 0) / 100
            }
            this.payList = list
          }
        }
      },
      showPayList(val) {
        if (val) {
          this.showPop = true
          // 读取图片地址 url拼接
          if (val.payVoucher) {
            this.imgUrl = val.payVoucher
          }
          this.popObj = {
            '名称': val.accountName,
            '账户': val.accountNo,
            '付款时间': val.payTime,
            '打款凭证': ''
          }
          if (this.details.status === 4) {
            this.popObj['审核失败原因'] = this.details.payDetailList && this.details.payDetailList[0].authMisc
            this.popObj['审核时间'] = this.details.payDetailList && this.details.payDetailList[0].authTime
          }
        }
      }
    }
  }
</script>
<style lang="stylus" scoped>
@import '~@/assets/stylus/index'
  #payList
    mt(20px)
    .pay_title
      vertical(30px)
      padl(10px)
      bold()
      fn(14px)
    .modal_cont
      width: 600px
      padding:20px
      padb(40px)
      bgColor()
      .titles
        overflow:hidden
        mb(45px)
        h3
          fn(18px)
          normal()
          fl()
          mt(8px)
        .icons
          fr()
          cursor()
      .rows
        mb(15px)
        line-height:18px
        .first_col
          width:120px
          padl(20px)
        .sec_col
          width: calc(100% - 140px)
        img
          height 100px
          width: 180px

</style>
