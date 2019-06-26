<template>
  <div id="tables">

    <BScroll :offsetBottom="120" :data="datas">
    <table width="100%" id="table">
      <thead>
        <tr>
          <td v-for="(item, index) in columns" :key="index">{{item}}</td>
        </tr>
      </thead>
      <tbody v-if="datas.length">
        <tr v-for="(item, index) in datas" :key="index">
          <td v-for="(obj, key, idx) in item" :key="idx">
            <div class="firstObj" v-if="key === 'firstObj'">
              <div :style="{width: width + 'px'}">
                <span>{{obj.orderTime | filterSaveDate}}</span>
                订单编号：{{obj.orderCode}}
              </div>
              <p>{{obj.serviceName}}</p>
              <!-- <span>({{obj.activity}})</span> -->
            </div>
            <div v-if="key === 'timeLimit'">{{obj}}</div>
            <div class="priceObj" v-if="key === 'priceObj'">
              <p>￥{{toFix(obj.originPrice / 100)}}</p>
              <span>￥{{toFix(obj.price / 100)}}</span>
            </div>
            <div v-if="key === 'quantity'">x{{obj}}</div>
            <div class="userObj" v-if="key === 'userObj'">
              <img v-if="obj.orderChannel !== 2" :src="obj.picUrl"/>
              <div class="infos fl">
                <p>{{obj.nickName}}</p>
                <p v-if="obj.orderChannel !== 2">{{obj.mobile}}</p>
              </div>
            </div>
            <div class="payObj" v-if="key === 'payObj'">
              <p>￥{{toFix(obj.moneyPaid / 100)}}</p>
              <p>{{transferPay(obj.payWay)}}</p>
            </div>
            <div class="payStatus" v-if="key === 'status'">
              <p :class="transferStatus(obj, 1)">{{transferStatus(obj)}}</p>
              <span class="cursor" @click="handle('orderShow', {orderId: item.firstObj.orderId, status: item.status, corpId: item.firstObj.corpId})">订单详情</span>
            </div>
          </td>
          <td class="process">
            <div class="process_wrap">
              <p v-if="datas[index].status - 0 === 0" class="pay_now" @click.stop="handle('orderPayNow', {orderId: item.firstObj.orderId, status: item.status, corpId: item.firstObj.corpId})">立即支付</p>
              <p v-if="datas[index].status - 0 === 0 || (datas[index].status - 0 === 4)" @click="handle('cancelOrder', {orderId: item.firstObj.orderId, status: item.status, corpId: item.firstObj.corpId})">取消订单</p>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <div v-if="!datas.length" class="no_datas">暂无数据</div>
    </BScroll>
  </div>
</template>
<script>
  import Const from './const'
  export default {
    name: 'tables',
    data() {
      return {
        width: 500,
        columns: Const.columns
      }
    },
    props: {
      datas: {
        type: Array,
        default() { return [] }
      }
    },
    mounted() {
      console.log(this.datas)
      this.getWidth()
      window.onresize = () => {
        this.getWidth()
      }
    },
    // watch() {
      // datas: {
      //   deep: true,
      //   handle (nv) {
      //     console.log(nv)
      //   }
      // }
    // },
    components: {},
    methods: {
      transferPay(val) {
        // console.log(val)
        // return val === 1 ? '微信公众号支付' : val === 2 ? '支付宝支付' : val === 3 ? '银行汇款' : '微信H5支付'
        let arr = ['微信付款', '支付宝支付', '银行汇款']
        let text = ''
        if (val && val.length) {
          val.forEach(v => {
            text += ('/' + arr[v - 1])
          })
          text = text.slice(1)
        }
        return text
      },
      transferStatus(val, bool) {
        switch (val - 0) {
          // 待付款
          case 0:
            return bool ? 'unpay' : '待付款'
          // 订单完成
          case 1:
            return bool ? '' : '订单完成'
          // 订单关闭
          case 2:
            return bool ? '' : '订单关闭'
          // 待审核
          case 3:
            return bool ? 'uncheck' : '待审核'
          // 评审成功
          case 4:
            return bool ? 'error' : '审核失败'
          // 评审失败
          case 5:
            return bool ? 'success' : '审核成功'
          // 评审失败
          case 6:
            return bool ? 'error' : '订单处理中'
          // 评审失败
          case 9:
            return bool ? '' : '删除'
          default:
            return val
        }
      },
      getWidth() {
        this.width = document.getElementById('table') && document.getElementById('table').getBoundingClientRect().width
      },
      handle(key, param) {
        this._BUS.$emit('handleOrder', key, param)
      }
    }
  }
</script>
<style lang="stylus">
@import '~@/assets/stylus/index'
    #tables
      clear()
      display:block
      // mt(85px)
      .no_datas
        padt(15px)
        center()
      table
        tr
          td
            padding:10px
            padl(5px)
            &:before
              display:table
              content:''
            >div
              padt(35px)
        thead
          borb()
          td
            vertical(40px)
            color #606366
            font-weight 700
          tr
            bgColor(#f7f9fa)
        tbody
          td
            padt(40px)
            div
              font-weight: 600

    #tables
      borb(1px solid #ddd)
      padb(20px)
      .firstObj
        relative()
        p
          font-weight: 600
        >div
          absolute()
          top: -30px
          left:-5px
          padl(5px)
          vertical(40px)
          bgColor(#f2f4f5)
          span
            font-weight: 600
      .priceObj
        p
          font-weight: 600
        span
          text-decoration line-through
          color(#979899)
      .userObj
        img
          fl()
          width:35px
          height:35px
          mr(5px)
          radius(3px)
        p
          font-weight: 600
      .payStatus
        p, span
          font-weight: 600
        .unpay
          color(#f49e1d)
        .uncheck
          color(#f49e1d)
        .success
          color(#3fb838)
        .error
          color(err_color)
        span:hover
          color(text_color)
      p
        padb(5px)
      span
        inline()
        vertical(20px)
      .payObj
        p
          font-weight: 600
      .process
        .process_wrap
          // padt(25px)
          p
            inline()
            height:30px
            line-height:28px
            radius(3px)
            width:80px
            center()
            cursor()
            border: 1px solid #ededed
          .pay_now
            color()
            mr(6px)
            bgColor(text_color)
</style>
