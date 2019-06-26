<template>
  <div id="payImg">
    <div class="img_wrap">
      <h4 class="img_title">付款方信息</h4>
      <ul v-if='getData("accountNo")'>
        <li v-for="(item, key, index) in detailInfo()" :key="index">
          <span>{{key}}</span>
          <i>{{item}}</i>
        </li>
      </ul>
      <div class="split_line" v-if='getData("accountNo") && getData("payVoucher")'></div>
      <div v-if='getData("payVoucher")'>
        <p>付款凭证</p>
        <ImgEnlarge :imgUrl='imgUrl | urlFilter' class="img" width="155px" height="95px" largeW="890px" largeH="500px"></ImgEnlarge>
      </div>
    </div>
    <RealPay :realPay="details.orderPayprice / 100" :status="details.status" class="fr"></RealPay>
  </div>
</template>
<script>
  import RealPay from './realPay'
  export default {
    name: 'payImg',
    data() {
      return {
        imgUrl: ''
      }
    },
    props: {
      realPay: {
        type: Number,
        default: 0
      },
      details: {
        type: Object
      }
    },
    created() {
      this.getImgUrl()
    },
    methods: {
      detailInfo() {
        return {
          '名称': this.getData('accountName'),
          '账号': this.getData('accountNo'),
          '付款时间': this.getData('payTime')
        }
      },
      getData(name) {
        return this.details.payDetailList.length ? this.details.payDetailList[0][name] : ''
      },
      getImgUrl() {
        if (this.getData("payVoucher")) {
          // 读取图片地址 url拼接
          this.imgUrl = this.getData("payVoucher")
        }
      }
    },
    components: {RealPay}
  }
</script>
<style lang="stylus" scoped>
@import '~@/assets/stylus/index'
  #payImg
    height:160px
    bgColor(#f7f9fa)
    padding: 15px 20px
    .img_wrap
      .img_title
        mb(14px)
      .img
        fl()
      p
        fl()
        mr(30px)
      .split_line
        fl()
        border-left: 1px solid #e3e4e6
        height: 100px
        margin: 0 50px
      ul
        fl()
        li
          overflow hidden
          line-height 30px
          span
            fl()
            width:90px
          i
            fl()
    .fr
      mt(60px)
</style>
