<template>
  <div class="orderPay">
    <div class="orderpay-wrapper">
      <Menus :menuList='menuList' @curMenu="getCurMenu"></Menus>
      <a class="version" :href="BASE_URL_CONST+'/price.html'" target="_blank">
        <Icon type="ios-arrow-right"></Icon>
        <span>了解服务套餐版本详情</span>
      </a>
      <div class="buy-info">
        <div class="new-info">
          <p class="title">新订购服务</p>
          <tablePay tableType="new" :buyInfo="newInfo"></tablePay>
        </div>
        <div class="old-info" v-if="type !== 'createCompany' && oldInfo.goodsName">
          <p class="title">原订购服务</p>
          <tablePay tableType="old" :buyInfo="oldInfo"></tablePay>
        </div>
      </div>
      <div class="order-summary">
        <div class="prev-wrapper">
          <div class="total order-item">
            <div class="order-float">
              <span class="span1">付款合计</span>
              <span class="span2 fixed-width">¥ {{newPrice}}</span>
            </div>
          </div>
          <div class="discount order-item" v-if="type !== 'createCompany' && oldInfo.goodsName">
            <div class="order-float">
              <span class="span1">抵扣小计</span>
              <span class="span2 fixed-width">¥ {{oldPrice}}</span>
            </div>
          </div>
        </div>
        <div class="actual order-item">
          <div class="order-float">
            <span class="span1">实付款</span>
            <span class="span2" v-if="calcPrice !== 'NaN'"><span class="fuhao">¥</span> {{calcPrice || 0}}元</span>
            <span class="span3"><Poptips width="217" content="实付款=付款小计-抵扣合计"></Poptips></span>
          </div>
        </div>
        <div class="order-company order-item">
          <div class="order-float">
            <span class="span1">订购企业</span>
            <span class="span2 company-color">{{companyName}}</span>
          </div>
        </div>
      </div>
      <div class="submit">
        <!-- <div class="submit-left">
          <span class="check">
            <Checkbox v-model="single">我已阅读并同意<span><router-link :to="{name:'agreement'}" target="_blank">《迎客通在线订购协议》</router-link></span>，付款完成后可在发票管理中申请开票。</Checkbox>
          </span>
        </div> -->
        <div class="submit-right">
          <Button class="cancel" @click="cancel" type="ghost">取消</Button>
          <Button class="cancel" v-if="type=='createCompany'" @click="lastStep" type="ghost">上一步</Button>
          <Button class="tijiao" @click="submit" type="error">提交订单</Button>
        </div>
      </div>
    </div>
    <NewModal v-model="xiajia" header="套餐下架" confrim="重新购买" content="您所选的套餐刚刚已被下架，请重新选择其他套餐版本购买" :cancelBtn="false"></NewModal>
    <NewModal v-model="isOrder" header="订购提醒" confrim="去支付" content="当前企业有待付款订单，您可直接去支付或者重新订购" cancelText="重新订购" @ok="goPay" @cancel="restartPay"></NewModal>
    <NewModal v-model="reloadPage" header="订购提醒" confrim="确认" content="当前套餐已发生变化，如果继续订购，请刷新当前页面。" cancelText="取消" @ok="refreshPage"></NewModal>
  </div>
</template>
<script>
import Menus from './menus'
import tablePay from './tablePay'
import {
  getCurOrderDetail,
  saveOrderInfo,
  saveCorpCreateApplyForOrder
} from '@/api/query'
export default {
  name: '',
  props: {
    type: {
      type: String,
      default: 'upgrade'
    },
    creatCorpName: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      isOrder: false,
      reloadPage: false,
      xiajia: false,
      newInfo: {},
      oldInfo: {},
      originOldInfo: {},
      menuList: [],
      submitLoading: false,
      saveOrderData: {},
      corpOrderData: {},
      dateArr: [],
      curMenuGroup: null,
      usingItem: {},
      // 用于展示不同的套餐背景图
      classList: ['bg0', 'bg1', 'bg2', 'bg3', 'bg4', 'disabled']
    }
  },
  computed: {
    newPrice() {
      return (
        this.newInfo.countPrice && this.insertPoint(this.newInfo.countPrice || 0)
      )
    },
    oldPrice() {
      return (
        this.oldInfo.minusPrice && this.insertPoint(this.oldInfo.minusPrice)
      )
    },
    calcPrice() {
      return (this.newInfo.countPrice || 0) - (this.oldInfo.minusPrice || 0) < 0 ? '0.01' : this.insertPoint(this.newInfo.countPrice - (this.oldInfo.minusPrice || 0))
    },
    companyName() {
      return this.creatCorpName || this.localStorageSaveOrRead('corpName')
    }
  },
  created() {
    this.init()
  },
  components: { Menus, tablePay },
  methods: {
    init() {
      this.ajaxRecordList()
      if (this.type === 'upgrade') {
        this.getCurOrderDetail()
      }
    },
    cancel() {
      if (this.type === 'createCompany') {
        if (this.getToken().corpList === 0) {
          location.href = process.env.MOBILE_BASE_URL + '/index.html'
        } else {
          this.$router.push({ name: 'company' })
        }
      } else {
        this.$root.Bus.$emit('hideFullPageDrawer', false)
      }
    },
    lastStep() {
      this.$emit('lastStep', 0)
    },
    refreshPage() {
      location.reload()
    },
    ajaxRecordList() {
      // 获取套餐列表
      this.ajaxMenuList({ corpId: this.localStorageSaveOrRead('corpId') }).then(
        res => {
          if (res.code === 1) {
            this.handleMenu(res.data)
          }
        }
      )
    },
    // 获取时间列表
    // getDateArr() {
    //   this.ajaxDateList({ itemKey: 'ValidDay', limit: 9999, offset: 0 }).then(
    //     res => {
    //       if (res.code === 1) {
    //         this.dateArr = res.data.records

    //       }
    //     }
    //   )
    // },
    // 获取公司当前订购服务
    getCurOrderDetail() {
      let params = {
        corpId: this.localStorageSaveOrRead('corpId')
      }
      getCurOrderDetail(params).then(data => {
        if (data.code === 1) {
          if (data.data) {
            this.originOldInfo = {
              goodsName: data.data.goodsName,
              goodsDiscountsPrice: this.insertPoint(
                data.data.goodsDiscountsPrice
              ),
              goodsNum: data.data.goodsNum,
              orderPayprice: this.insertPoint(data.data.orderPayprice),
              validTime:
                data.data.createTime.substring(0, 10) +
                ' —— ' +
                data.data.endTime.substring(0, 10),
              leftDay: data.data.leftDay + '天',
              minusPrice: data.data.minusPrice
            }
            if (this.usingItem.group === this.curMenuGroup) {
              this.oldInfo = {
                minusPrice: 0
              }
            } else {
              this.oldInfo = JSON.parse(JSON.stringify(this.originOldInfo))
            }
          }
        } else {
          this.$Message.error(data.message)
        }
      })
    },
    // 保存订单
    saveOrderInfo(params) {
      if (this.submitLoading) {
        return
      }
      this.submitLoading = true
      saveOrderInfo(params).then(data => {
        switch (data.code) {
          case 1:
            this.localStorageSaveOrRead('orderId', data.data.orderId)
            if (params.orderPayprice === 0) {
              // this.$emit('submitOrder', 2)
              this.$emit('nextOrderStep', 1)
            } else {
              this.$emit('submitOrder', 1)
            }
            break
          case 6620:
            this.localStorageSaveOrRead('orderId', data.data.orderId)
            this.isOrder = true
            break
          case 2130:
            this.reloadPage = true
            break
          case 6628:
            this.xiajia = true
            break
          default:
            this.$Message.error(data.message || '提交失败')
            break
        }
        this.submitLoading = false
      })
    },
    // 保存创建公司并创建订单
    saveCorpCreateApplyForOrder(params) {
      if (this.submitLoading) {
        return
      }
      this.submitLoading = true
      saveCorpCreateApplyForOrder(params).then(data => {
        switch (data.code) {
          case 1:
            this.localStorageSaveOrRead('orderId', data.data.orderId)
            this.localStorageSaveOrRead('corpId', data.data.corpId)
            if (params.orderPayprice === 0) {
              // this.$emit('submitOrder', 2)
              this.$emit('nextOrderStep', 3)
            } else {
              this.$emit('submitOrder', 2)
            }
            // this.$emit('submitOrder')
            break
          case 2130:
            this.reloadPage = true
            break
          case 6628:
            this.xiajia = true
            break
          default:
            this.$Message.error(data.message || '提交失败')
            break
        }
        this.submitLoading = false
      })
    },
    submit() {
      if (this.type === 'createCompany') {
        this.corpOrderData = this.localStorageSaveOrRead('companyParams') || {}
        this.saveOrderData.corpId = null
        this.saveOrderData.reOrder = null
        this.saveOrderData.packId = this.saveOrderData.packageId
        this.saveOrderData.orderPayprice =
          this.newInfo.countPrice - (this.oldInfo.minusPrice || 0) < 0
            ? 1
            : this.newInfo.countPrice - (this.oldInfo.minusPrice || 0)
        this.saveOrderData.packageId = null
        let params = Object.assign({}, this.corpOrderData, this.saveOrderData)
        this.saveCorpCreateApplyForOrder(params)
      } else {
        this.saveOrderData.reOrder = 0
        this.saveOrderData.orderPayprice =
          this.newInfo.countPrice - (this.oldInfo.minusPrice || 0) < 0
            ? 1
            : this.newInfo.countPrice - (this.oldInfo.minusPrice || 0)
        this.saveOrderInfo(this.saveOrderData)
      }
    },
    goPay() {
      this.$emit('submitOrder')
    },
    restartPay() {
      this.saveOrderData.reOrder = 1
      this.saveOrderInfo(this.saveOrderData)
    },
    handleMenu(list) {
      let arr = []
      // 先将套餐根据套餐级别排序,方便找出推荐的套餐
      list.sort((a, b) => {
        return a.leave - b.leave
      })
      /*
        recommendIdx： 推荐套餐的index
        recommendLeave: 推荐套餐的级别值leave
      */
      let recommendIdx = list.findIndex(item => {
        return item.recommend === 1
      })
      let recommendLeave
      recommendIdx > -1 && (recommendLeave = list[recommendIdx].leave)
      /*
        usingIdx 正在使用套餐的index
        usingLeave: 正在使用套餐的级别值leave
      */
      let usingIdx = list.findIndex(item => {
        return item.id === item.corpPackageId
      })
      let usingLeave = -1
      if (usingIdx > -1) {
        this.usingItem = list[usingIdx]
        usingLeave = list[usingIdx].leave
      }
      // recommendIdx = -1
      // 如果没有推荐的套餐
      if (recommendIdx === -1) {
        if (usingIdx > -1) {
          let idx = list.findIndex(item => {
            return item.leave > usingLeave && item.group !== list[usingIdx].group
          })
          // 如果有比使用套餐级别大的套餐, 且该套餐不和使用中的套餐同组，则推荐套餐为该套餐
          if (idx > -1) {
            list[idx].recommend = 1
          } else {
            // 否则推荐套餐为正在使用中的套餐
            list[usingIdx].recommend = 1
          }
        } else {
          let menu = list.find(item => {
            return item.isFreeMenu === false
          })
          menu.recommend = 1
          usingLeave = menu.leave
        }
      } else {
        // 如果有推荐的套餐
        // 如果使用中的套餐级别大于推荐的级别，则推荐的套餐为使用中的套餐, 推荐图标不显示（notShowRecommend控制)
        if (usingIdx > -1 && (usingLeave > recommendLeave)) {
          list[recommendIdx].recommend = 2
          list[usingIdx].recommend = 1
          list[usingIdx].notShowRecommend = true
        }
      }
      // 组装数组，将同组数值放在一个对象下面
      for (let item of list) {
        // 转换时间单位
        item.dateUnit = this.transferUnit(item)
        let isGroup = list.find(val => {
          return val.group && (val.group === item.group) && (val.id !== item.id)
        })
        if (isGroup) {
          let allFalse = true
          for (let n of arr) {
            if (n.group && n.group === item.group) {
              allFalse = false
              n.arr.push(item)
            }
          }
          if (allFalse) {
            arr.push({
              group: item.group,
              name: item.name,
              summary: item.summary,
              arr: [item],
              mostBuyNum: item.mostBuyNum
            })
          }
        } else {
          arr.push(item)
        }
      }
      /*
        判断如何显示各数据
        val.isVailUse 套餐是否可选
        val.isUsing 是否在使用中
        val.recommend 是否为推荐套餐
       */
      for (let val of arr) {
        let isUsing = false
        if (val.arr) {
          val.arr.sort((a, b) => {
            return a.leave - b.leave
          })
          val.isVailUse = val.arr[val.arr.length - 1].leave >= usingLeave
          val.maxLeave = val.arr[val.arr.length - 1].leave
          val.minLeave = val.arr[0].leave
          !val.isVailUse &&
            (val.content = '该版本低于当前使用的版本, 不支持续费升级')
          val.recommend =
            val.arr.findIndex(item => {
              return item.recommend === 1
            }) > -1
          isUsing = val.arr.find(item => {
            return item.corpPackageId === item.id
          })
          val.notShowRecommend =
            val.arr.findIndex(item => {
              return item.notShowRecommend === true
            }) > -1
        } else {
          isUsing = val.corpPackageId === val.id
          val.isVailUse = val.leave >= usingLeave
          !val.isVailUse &&
            (val.content = '该版本低于当前使用的版本, 不支持续费升级')
          if (val.isFreeMenu && !val.freePackageSelect) {
            val.isVailUse = false
            val.content = '您已使用过' + val.name + ', 不可重复订购。'
          } else if (val.isFreeMenu && val.freePackageSelect) {
            val.isVailUse = true
          }
        }
        val.isUsing = isUsing
      }
      arr.map((item, index) => {
        return (item.className = 'bg' + index)
      })
      // 为各个套餐添加不同的class,用于背景颜色区别
      arr.map((item, idx) => {
        return (
          !item.isVailUse &&
          (item.className = this.classList[this.classList.length - 1])
        )
      })
      this.menuList = arr.slice()
      this.$root.Bus.$emit('refreshBScroll',this.menuList)
    },
    transferUnit(item) {
      if (!(item.timeUnitNum + '' + item.timeUnit) || (item.timeUnitNum + '' + item.timeUnit === '1年')) return '年'
      return item.timeUnitNum + '' + item.timeUnit
    },
    getCurMenu(obj, num) {
      if (obj) {
        console.log(obj)
        this.curMenuGroup = obj.group
        if (this.usingItem) {
          if (this.usingItem.group === this.curMenuGroup) {
            this.oldInfo = {
              minusPrice: 0
            }
          } else {
            this.oldInfo = JSON.parse(JSON.stringify(this.originOldInfo))
          }
        }
        this.saveOrderData = {
          corpId: this.localStorageSaveOrRead('corpId'),
          packageId: obj.id,
          packageNum: num,
          orderPayprice: '',
          reOrder: 0,
          packageValidDay: obj.validDay,
          packageDiscountsPrice: obj.discountsPrice
        }
        this.newInfo = {
          name: obj.name,
          discountsPrice: this.insertPoint(obj.discountsPrice),
          num: num,
          dateUnit: obj.timeUnitNum * num + obj.timeUnit,
          countPrice: obj.discountsPrice * num
        }
      }
    }
  }
}
</script>
<style lang="stylus" scoped>
@import '~@/assets/stylus/mixin'
.orderPay
  .orderpay-wrapper
    .buy-info
      .new-info, .old-info
        margin-top 29px
        .title
          margin-bottom 13px
          font-weight bold
    .version
      display flex
      flex-direction row-reverse
      color #409eff
      cursor pointer
      align-items center
      .ivu-icon
        margin-left 5px
        font-size 16px
    .order-summary
      background-color #f7f9fa
      padding 20px
      text-align right
      .prev-wrapper
        text-align left
        padding-left 100px
        padding-bottom 15px
        display inline-block
        border-bottom solid 1px #cacbcc
      .order-item
        text-align left
        clear()
        .order-float
          float right
          .span1, .span2, .span3
            display inline-block
          .span1
            margin-right 12px
            color #525253
          .span2
            color #606366
          .fixed-width
            width 78px
            text-align right
          .company-color
            color #303133
            max-width 200px
            vertical-align top
            no-wrap()
      .discount
        margin-top 15px
      .actual
        margin-bottom 20px
        margin-top 15px
        .order-float
          .span2
            color #f56c6c
            font-size 30px
          .fuhao
            font-size 14px
    .submit
      margin-top 20px
      clear()
      .submit-left
        float left
        margin-top 14px
        .check
          span
            a
              color #409eff
              cursor pointer
              &:hover
                color #409eff
                cursor pointer
      .submit-right
        float right
        .cancel
          width 100px
          margin-right 20px
        .tijiao
          width 100px
          background-color #f56c6c
          border-color #f56c6c
</style>
