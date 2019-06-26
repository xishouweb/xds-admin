<template>
    <Modal
        class="upload-pingzheng"
        v-model="showModal"
        :title="title"
        :width="width"
        :mask-closable="true"
        @on-visible-change="visibleChange"
        @on-cancel="modalCancel">
        <div>
          <div class="title proof-bold">
            收款方信息
          </div>
          <Row class="row-msg">
            <Col span="5" >
              <span class="gray_color">收款方名称</span>
            </Col>
            <Col span="18">
              <span class="proof-bold">{{pingzhengInfo.payeeName}}</span>
            </Col>
          </Row>
          <Row class="row-msg">
            <Col span="5">
              <span class="gray_color">收款方开户行</span>
            </Col>
            <Col span="18">
              <span class="proof-bold">{{pingzhengInfo.bankName}}</span>
            </Col>
          </Row>
          <Row class="row-msg">
            <Col span="5">
              <span class="gray_color">收款方账号</span>
            </Col>
            <Col span="18">
              <span class="proof-bold">{{pingzhengInfo.bankAccount}}</span>
            </Col>
          </Row>
        </div>
        <div>
          <div class="title proof-bold">
            付款方信息（请填写好您的付款账号信息或付款凭证）
          </div>
          <Row class="row-msg">
            <Col span="3">
              <span class="gray_color">实付金额</span>
            </Col>
            <Col span="18">
              <span class="proof-bold">￥{{pingzhengInfo.realPayment}}</span>
            </Col>
          </Row>
        </div>
        <div class="row-msg">
            <RadioGroup v-model="pingzhengInfo.payType" @on-change="payTypeChange">
                <Radio label="0"><span class="proof-bold">名称账号信息</span></Radio>
                <Radio label="1"><span class="proof-bold">付款凭证</span></Radio>
            </RadioGroup>
        </div>
        <div v-show="pingzhengInfo.payType === '1'">
          <Row class="row-msg">
            <Col span="4">
              <span class="need"></span><span class="proof-bold">打款凭证</span>
            </Col>
            <Col span="18">
              <uploadVoucher @uploadSuccess="uploadSuccess" v-if="showModal && (pingzhengInfo.payType === '1')"></uploadVoucher>
              <div v-if="errorTips.payVoucher" class="err-tip pingzheng">请上传打款凭证</div>
            </Col>
          </Row>
        </div>
        <div v-show="pingzhengInfo.payType !== '1'">
          <Row class="row-msg">
            <Col span="4" style="line-height: 40px; ">
              <span class="need"></span><span class="proof-bold">名称</span>
            </Col>
            <Col span="18">
              <Input @on-blur="inputChange('accountName')" v-model="formParams.accountName" placeholder="请填写付款名称" style="width: 360px; "></Input>
              <div class="err-tip" v-if="errorTips.accountName">名称不能为空</div>
            </Col>
          </Row>
          <Row class="row-msg" style="line-height: 40px; ">
            <Col span="4">
              <span class="need"></span><span class="proof-bold">账号</span>
            </Col>
            <Col span="18">
              <Input @on-blur="inputChange('accountNo')" @on-change="accountChange" v-model="formParams.accountNo" placeholder="请填写付款账户" style="width: 360px;"></Input>
              <!-- <div class="err-tip" v-if="errorTips.accountNo">{{errorTextAccountNo}}</div> -->
              <div class="err-tip" v-if="errorTips.accountNo">{{errorTextAccountNo}}</div>
            </Col>
          </Row>
        </div>
        <div>
          <Row class="row-msg">
            <Col span="4" style="line-height: 40px;">
              <span style="color: transparent;">*</span><span class="proof-bold">付款时间</span>
            </Col>
            <Col span="18">
              <DatePicker format="yyyy-MM-dd HH:mm:ss" @on-change="dateChange"  type="datetime" placeholder="请选择付款时间" style="width: 228px;"></DatePicker>
            </Col>
          </Row>
        </div>
        <div slot="footer">
            <Button class="btns-sure" type="primary" @click="modalOk">确定</Button>
            <Button class="btns-cancel" type="ghost" size="large" @click="modalCancel">取消</Button>
        </div>
     </Modal>
</template>

<script>
import { savePayVoucherTradeOrder, saveAccountTradeOrder } from '@/api/query'
export default {
  name: 'modalValidateForm',
  components: {
    uploadVoucher: () => import('@/components/upload/uploadVoucher.vue')
  },
  model: {
    prop: 'modal',
    event: 'close'
  },
  props: {
    modal: {
      default: false,
      type: Boolean
    },
    title: {
      type: String,
      default: '上传凭证'
    },
    width: {
      type: String,
      default: '610'
    },
    labelWidth: {
      type: Number,
      default: 100
    },
    // 传递价钱和订单号的参数字段
    transferProps: {
      default: () => {},
      type: Object
    }
  },
  data() {
    return {
      // modal: false,
      pingzhengInfo: {
        payeeName: '杭州星客互联科技有限公司',
        bankName: '中国工商银行杭州市金辉支行',
        bankAccount: '1202 0526 0990 0046 277',
        realPayment: this.transferProps.orderPayprice,
        payType: '0',
        src: ''
      },
      formParams: {
        payTime: '',
        accountNo: '',
        accountName: '',
        payVoucher: ''
      },
      errorTips: {
        accountNo: false,
        accountName: false,
        payVoucher: false
      },
      errorTextAccountNo: ''
      // options: {
      //   shortcuts: [
      //     {
      //       text: 'Today',
      //       value() {
      //         return new Date()
      //       },
      //       onClick: picker => {
      //       }
      //     },
      //     {
      //       text: 'Yesterday',
      //       value() {
      //         const date = new Date()
      //         date.setTime(date.getTime() - 3600 * 1000 * 24)
      //         return date
      //       },
      //       onClick: picker => {
      //       }
      //     },
      //     {
      //       text: 'One week',
      //       value() {
      //         const date = new Date()
      //         date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
      //         return date
      //       },
      //       onClick: picker => {
      //       }
      //     }
      //   ]
      // }
    }
  },
  mounted() {},
  computed: {
    showModal: {
      get() {
        return this.modal
      },
      set() {}
    }
  },
  watch: {
  },
  methods: {
    // 付款方名称账号确认银行汇款
    saveAccountTradeOrder(params) {
      saveAccountTradeOrder(params).then(data => {
        switch (data.code) {
          case 1:
            this.$emit('success', 2)
            this.$emit('close', false)
            this.$Message.success('上传凭证成功')
            break
          case 110:
            this.$emit('close', false)
            this.$Message.error(data.message)
            break
          case 3550:
            this.$emit('close', false)
            this.$Message.error(data.message)
            break
          case 6601:
            this.$emit('close', false)
            this.$Message.error(data.message)
            break
          case 6605:
            this.$emit('close', false)
            this.$Message.error(data.message)
            break
          case 6606:
            this.$emit('close', false)
            this.$Message.error(data.message)
            break
          case 5503:
            this.$emit('close', false)
            this.$Message.error(data.message)
            break
          default:
            break
        }
      })
    },
    // 付款凭证确认银行汇款
    savePayVoucherTradeOrder(params) {
      savePayVoucherTradeOrder(params).then(data => {
        switch (data.code) {
          case 1:
            this.$emit('success', 2)
            this.$emit('close', false)
            this.$Message.success('上传凭证成功')
            break
          case 3550:
            this.$emit('close', false)
            this.$Message.error(data.message)
            break
          case 6601:
            this.$emit('close', false)
            this.$Message.error(data.message)
            break
          case 6605:
            this.$emit('close', false)
            this.$Message.error(data.message)
            break
          case 6606:
            this.$emit('close', false)
            this.$Message.error(data.message)
            break
          case 5503:
            this.$emit('close', false)
            this.$Message.error(data.message)
            break
          default:
            break
        }
      })
    },
    modalOk() {
      this.errorTips = {
        accountNo: false,
        accountName: false,
        payVoucher: false
      }
      if (this.pingzhengInfo.payType === '0') {
        if (this.formParams.accountName.trim() === '') {
          this.errorTips.accountName = true
        }
        if (this.formParams.accountNo.alltrim() === '') {
          this.errorTips.accountNo = true
          this.errorTextAccountNo = '账号不能为空'
        }
        // 账号检测功能关闭
        // else if (!this.isBankCard(this.formParams.accountNo.alltrim())) {
        //   this.errorTextAccountNo = '您输入的账号错误，请重新检查账号'
        //   this.errorTips.accountNo = true
        // }
        if (!this.errorTips.accountNo && !this.errorTips.accountName) {
          // 写提交代码
          let params = {
            orderId: this.localStorageSaveOrRead('orderId'),
            accountName: this.formParams.accountName.alltrim(),
            accountNo: this.formParams.accountNo.alltrim(),
            payTime: this.formParams.payTime
          }
          this.saveAccountTradeOrder(params)
        }
      } else {
        if (this.formParams.payVoucher === '') {
          this.errorTips.payVoucher = true
        }
        if (!this.errorTips.payVoucher) {
          // 写提交代码
          let params = {
            orderId: this.localStorageSaveOrRead('orderId'),
            payVoucher: this.formParams.payVoucher,
            payTime: this.formParams.payTime
          }
          this.savePayVoucherTradeOrder(params)
        }
      }
    },
    dateChange(val, newData) {
      this.formParams.payTime = val
    },
    accountChange() { // 账号输入框的change事件
      setTimeout(() => {
        this.formParams.accountNo =
          this.formParams.accountNo
          .replace(/[^\d]/g, '')
          .replace(/(\d{4})(?=\d)/g, '$1 ') // 过滤非数字，每4位数空一格
      }, 60)
    },
    inputChange(val) {
      if (val === 'accountName') {
        if (this.formParams.accountName === '') {
          this.errorTips.accountName = true
        } else {
          this.errorTips.accountName = false
        }
      } else {
        if (this.formParams.accountNo === '') {
          this.errorTips.accountNo = true
          this.errorTextAccountNo = '账号不能为空'
        } else {
          this.errorTips.accountNo = false
        }
      }
    },
    payTypeChange() {
      this.errorTips = {
        accountNo: false,
        accountName: false,
        payVoucher: false
      }
    },
    modalCancel() {
      this.$emit('close', false)
    },
    afterCancel(val) {
    },
    visibleChange(val) {
      this.$emit('visibleChange', val)
    },
    uploadSuccess(path) {
      this.errorTips.payVoucher = false
      this.formParams.payVoucher = path
    },
    /**
     * @author Rui.Zhang
     * @description 判断是否为银行卡号
     * @param {String} strCardNo 待校验的数据
     * @returns {Boolean}, true:是银行卡号
     **/
    isBankCard(strCardNo) {
      strCardNo = strCardNo || String(this)
      if (strCardNo.trim() === '' || strCardNo === undefined) {
        return false
      }
      var lastNum = strCardNo.substr(strCardNo.length - 1, 1) // 取出最后一位（与luhm进行比较）

      var first15Num = strCardNo.substr(0, strCardNo.length - 1) // 前15或18位
      var newArr = []
      for (var i = first15Num.length - 1; i > -1; i--) {
        // 前15或18位倒序存进数组
        newArr.push(first15Num.substr(i, 1))
      }
      var arrJiShu = [] // 奇数位*2的积 <9
      var arrJiShu2 = [] // 奇数位*2的积 >9

      var arrOuShu = [] // 偶数位数组
      for (var j = 0; j < newArr.length; j++) {
        if ((j + 1) % 2 === 1) {
          // 奇数位
          if (parseInt(newArr[j]) * 2 < 9) {
            arrJiShu.push(parseInt(newArr[j]) * 2)
          } else {
            arrJiShu2.push(parseInt(newArr[j]) * 2)
          }
        } else arrOuShu.push(newArr[j]) // 偶数位
      }

      var jishuchild1 = [] // 奇数位*2 >9 的分割之后的数组个位数
      var jishuchild2 = [] // 奇数位*2 >9 的分割之后的数组十位数
      for (var h = 0; h < arrJiShu2.length; h++) {
        jishuchild1.push(parseInt(arrJiShu2[h]) % 10)
        jishuchild2.push(parseInt(arrJiShu2[h]) / 10)
      }

      var sumJiShu = 0 // 奇数位*2 < 9 的数组之和
      var sumOuShu = 0 // 偶数位数组之和
      var sumJiShuChild1 = 0 // 奇数位*2 >9 的分割之后的数组个位数之和
      var sumJiShuChild2 = 0 // 奇数位*2 >9 的分割之后的数组十位数之和
      var sumTotal = 0
      for (var m = 0; m < arrJiShu.length; m++) {
        sumJiShu = sumJiShu + parseInt(arrJiShu[m])
      }

      for (var n = 0; n < arrOuShu.length; n++) {
        sumOuShu = sumOuShu + parseInt(arrOuShu[n])
      }

      for (var p = 0; p < jishuchild1.length; p++) {
        sumJiShuChild1 = sumJiShuChild1 + parseInt(jishuchild1[p])
        sumJiShuChild2 = sumJiShuChild2 + parseInt(jishuchild2[p])
      }
      // 计算总和
      sumTotal =
        parseInt(sumJiShu) +
        parseInt(sumOuShu) +
        parseInt(sumJiShuChild1) +
        parseInt(sumJiShuChild2)

      // 计算Luhm值
      var k = parseInt(sumTotal) % 10 === 0 ? 10 : parseInt(sumTotal) % 10
      var luhm = 10 - k
      if (Number(lastNum) === luhm) {
        return true
      } else {
        return false
      }
    }
  }
}
</script>

<style lang="stylus">
.upload-pingzheng
  .proof-bold
    // color: #666
    font-weight: 600
  .title
    padding-left 20px
    height 40px
    line-height 40px
    margin 10px 0
    background-color #e6edf5
  .row-msg
    padding-left 20px
    margin 20px 0
    .ivu-col
      position relative
      .err-tip
        position absolute
        color #f56c6c
        line-height 14px
        font-size 12px
        top 41px
      .pingzheng
        top 102px
  .need:before
    content '*'
    color #f00
  .btns-sure
    width 90px
    height 40px
    background-color #409eff
    border-radius 3px
  .btns-cancel
    width 90px
    height 40px
    border-radius 3px
  .ivu-modal-header-inner
    color #0c0c0d
    font-size 18px
  .ivu-modal-header
    border-bottom 0px solid #e3e8ee
  .ivu-modal-footer
    border-top 0px solid #e3e8ee
</style>
