<template>
  <div id="records">
    <div class="title title_public">订单记录</div>
    <RightDrawer v-model="drawer" :titleTips="drawerTitle" :isScroll="false" width="70%" minWidth="800px" :showFooter="false" ref="Drawer">
      <div slot="content" style="width: 86%">
        <OrderDetail :orderInfo="curOrderInfo"></OrderDetail>
      </div>
    </RightDrawer>
    <div class="filter_wrap">
      <Filters ref="filter" :statusList="statusList"></Filters>
    </div>
    <data-loading :dataSatau="dataSatau">
      <Tables ref="tables" :datas="tableList"></Tables>
    </data-loading>
    <Pages ref="pages" :pageTotal='pageTotal'></Pages>
    <ModalS
      :modalTitle="modalTitle"
      v-model="modalShow"
      :okText="okText"
      :cancelText="cancelText"
      @modal-cancel="cancelHandle"
      @modal-confirm="confirmHandle"
      :content="tips"
      ></ModalS>
  </div>
</template>
<script>
import Filters from './filters'
import Tables from './tables'
import Pages from './pages'
import OrderDetail from './orderDetail'
// import Modals from './modals'
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'records',
  data() {
    return {
      drawer: false,
      drawerTitle: '订单详情',
      modalTitle: '',
      modalShow: false,
      pageTotal: 0,
      okText: '',
      cancelText: '',
      statusList: [], // 订单状态列表, 筛选下拉框内容
      tableList: [], // 表格数据
      tips: '',
      dataSatau: 2,
      curOrderInfo: {}, // 当前操作的订单
      key: ''
    }
  },
  created() {
    this._BUS.$on('handleOrder', (key, param) => {
      this.handle(key, param)
    })
    this.init()
  },
  computed: {
    ...mapGetters({
      corpInfo: 'survey/getSaveloginCompany'
    })
  },
  mounted() {
    this.getRecords()
  },
  components: { Filters, Tables, Pages, OrderDetail },
  methods: {
    init(val) {
      // this.getStatusList()
      this.getItemValue('XDS_ORDERMNG_ORDER_STATUS')
    },
    getItemValue(key) {
      let obj = {
        itemKey: key
      }
      this.queryTItemValueByPager(obj).then(res => {
        switch (res.code) {
          case 1:
            let arr = res.data || []
            arr.sort((a, b) => {
              return a.itemIdx - b.itemIdx
            })
            arr.unshift({itemKey: "XDS_ORDERMNG_ORDER_STATUS", itemValue: 1, itemName: "全部"})
            this.statusList = arr
            break
          default:
            break
        }
      })
    },
    // 获取订单列表
    getRecords() {
      this.dataSatau = 1
      let filterParam, pageParam
      let param = {}
      if (this.$refs.filter && this.$refs.pages) {
        filterParam = this.$refs.filter.getParams()
        pageParam = this.$refs.pages.getParams()
        param = { ...{}, ...filterParam, ...pageParam }
      } else {
        param = { limit: 10, offset: 0 }
      }
      this.ajaxRecordsList(param).then(res => {
        this.dataSatau = 2
        if (res.code === 1) {
          this.pageTotal = res.data ? res.data.totalCount : 0
          let arr = res.data ? res.data.records : []
          for (let item of arr) {
            item.timeLimit = this.timeHandle(item)
          }
          this.tableList = this.dealTableList(arr)
          this.$root.Bus.$emit('calcScrollHeight')
        } else {
          this.$Message.error(res.message)
        }
      })
    },
    timeHandle(item) {
      return item.timeUnitNum + item.timeUnit || '1年'
    },
    // 取消订单
    abondOrder(fn) {
      let param = {
        orderIds: [this.curOrderInfo.orderId],
        orderStatus: 'CANCEL',
        corpId: this.localStorageSaveOrRead('currentCorp').applyId
      }
      this.getCancelOrder(param).then(res => {
        this.wipeModal()
        if (res.code === 1) {
          fn ? fn() : this.$Message.success('订单取消成功')
          this.handle('getRecords')
        } else {
          this.$Message.error('订单取消失败')
        }
      })
    },
    // 处理订单数据
    dealTableList(list) {
      console.log(list)
      let a = list.map(item => {
        return {
          firstObj: {
            orderTime: item.orderCreateTime,
            orderCode: item.orderId,
            serviceName: item.goodsName,
            orderId: item.orderId,
            payOrderNo: item.payOrderNo,
            corpId: item.corpId
          },
          timeLimit: item.timeLimit,
          priceObj: {
            price: item.goodsPrice,
            originPrice: item.goodsDiscountsPrice
          },
          quantity: item.goodsNum,
          userObj: {
            picUrl: item.picUrl,
            mobile: item.orderMobile,
            nickName: item.orderNickname,
            orderChannel: item.orderChannel
          },
          payObj: {
            moneyPaid: item.orderPayprice,
            payWay: item.payTypeList
            // payWay: item.payType
          },
          status: item.status
        }
      })
      return a
    },
    // 弹窗确定按钮
    confirmHandle() {
      if (this.modalTitle === '取消订单') {
        this.abondOrder()
      } else if (this.modalTitle === '订单关闭') {
        this.abondOrder(() => {
          let corpId = this.localStorageSaveOrRead('currentCorp').applyId
          let corpName = this.localStorageSaveOrRead('currentCorp').corpName
          let obj = {
            corpId: corpId,
            corpName: corpName
          }
          this.setPayStatu(obj)
        })
      }
    },
    // 弹窗取消按钮
    cancelHandle() {
      if (this.modalTitle === '取消订单') {
      } else if (this.modalTitle === '订单关闭') {
        this._BUS.$emit('refreshOrderDetail')
      }
    },
    // 关闭modal
    wipeModal() {
      this.modalShow = false
      this.modalTitle = ''
      this.drawer = false
    },
    handle(key, param) {
      switch (key) {
        case 'orderShow':
          this.drawer = true
          this.curOrderInfo = param
          break
        case 'cancelOrder':
          this.modalTitle = '取消订单'
          this.modalShow = true
          this.curOrderInfo = param
          this.okText = '确定'
          this.cancelText = '再想想'
          this.tips = param.status === 0 ? '订单尚未付款, 确定要取消吗？' : '订单审核失败，您确定要取消吗？'
          break
        // 立即支付
        case 'orderPayNow':
          this.drawer = false
          this.localStorageSaveOrRead('orderId', param.orderId)
          this.localStorageSaveOrRead('corpId', param.corpId)
          this.localStorageSaveOrRead('corpName', this.localStorageSaveOrRead('currentCorp').corpName)
          this._BUS.$emit('orderPayNow')
          break
        case 'orderClose':
          this.modalTitle = '订单关闭'
          this.modalShow = true
          this.okText = '重新订购'
          this.cancelText = '订单详情'
          this.curOrderInfo = param
          this.tips =
            '您的订单未及时支付, 已自动关闭, 您可重新订购或查看订单详情。'
          break
        case 'getRecords':
          this.getRecords()
          break
        case 'orderGoback':
          this.drawer = false
          break
        default:
          break
      }
    },
    // 获取订单状态列表
    // getStatusList() {
    // ORDERMNG_orderStatus 订单状态 ORDERMNG_payee 收款方信息
    //   this.ajaxOrderStatus({ itemKey: 'ORDERMNG_orderStatus', limit: 9999, offset: 0 }).then((res) => {
    //     if (res.code === 1) {
    //       this.statusList = (res.data && res.data.records) || []
    //     }
    //   })
    // },
    ...mapActions({
      setPayStatu: 'pay/setPayStatu'
    })
  },
  beforeDestroy() {

  }
}
</script>
<style>
.ivu-table-row {
  margin-top: 30px;
}
</style>
<style lang="stylus">
@import '~@/assets/stylus/index'
#records
  .filter_wrap
    overflow hidden
    mt(30px)
    mb(15px)
</style>
