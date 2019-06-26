<template>
  <div id="company">
    <div class="title">我的企业</div>
    <data-loading :data-satau='loadingImg' @reload="reload">
      <div class="no-table-list" v-show="corpData.length<=0">
        <div class="no-img"><img src="@/assets/images/nocorp.png" alt=""></div>
        <div class="no-text">你当前尚未加入企业</div>
        <Button class="no-btn" type="primary" @click="createCompany()">创建新企业</Button>
      </div>
      <div class="company-table-list" v-show="corpData.length>0">
        <table class="table">
          <tr class="tr-item">
            <th class="th-item">企业名称</th>
            <th class="th-item">公众号</th>
            <th class="th-item">绑定手机号</th>
            <th class="th-item">您的身份</th>
            <th class="th-item">套餐版本</th>
            <th class="th-item">套餐有效时间</th>
            <th class="th-item">套餐状态</th>
            <th class="th-item">操作</th>
          </tr>
          <tr class="loading-item" v-show="loadingStatu === 2">
            <th colspan="7" class="loading">
              <Spin fix>
                <Icon type="load-c" size=40 class="spin-icon-load"></Icon>
                <div>loading</div>
              </Spin>
            </th>
          </tr>
          <tr class="tr-item tr-td-item" v-for="(item ,index) in corpData" :key="index">
            <td class="td-item">
              <div class="default-name" v-if="idx!=index">
                <span class="span company-name" :title="item.corpName">{{item.corpName}}</span>
                <span class="span dingWidth">
                  <Icon class="edit-icon handle" title="修改" size="18" @click="nameEdit(index,item.corpName)" type="edit"></Icon>
                </span>
              </div>
              <div class="edit" v-if="idx===index">
                <Input ref="inputFocusCrop" v-model="companyName" placeholder="请输入企业名称" style="maxWidth: 200px"></Input>
                <span class="span handle" @click="saveEdit(item.applyId)">保存</span>
                <span class="span handle" @click="cancelEdit">取消</span>
              </div>
            </td>
            <td class="td-item">
            {{item.appidNum}}
            </td>
            <td class="td-item">
            {{item.mobile}}
            </td>
            <td class="td-item">
            <span v-show="item.identity==1">管理员</span>
            <span v-show="item.identity==0">普通员工 <span v-if="item.eeStatus === 2">（停用）</span></span>
            </td>
            <td class="td-item">
              <span>{{item.version}}</span>
              <span class="span handle" v-show="item.packStatus=='ACTIVE'||item.packStatus=='EXPIRE'||item.packStatus=='DISABLED'" @click="upgrade(item.applyId, item.packStatus, item)">续费升级</span>
              <span class="span handle pay" v-show="item.packStatus=='DOING'" @click="checkOrder(item.applyId, item)">立即付款</span>
            </td>
            <td class="td-item">
            <span class="span" v-if="item.startTime&&item.endTime">{{item.startTime.substring(0,10)}}至{{item.endTime.substring(0,10)}}</span>
            <span class="span" v-if="!item.startTime||!item.endTime">- -</span>
            </td>
            <td class="td-item">
              <span v-show="item.packStatus=='ACTIVE'">正常</span>
              <span v-show="item.packStatus=='DISABLED'">停用</span>
              <span v-show="item.packStatus=='EXPIRE'">已过期</span>
              <span v-show="item.packStatus=='FORBIDDEN'">禁用</span>
              <span v-show="item.packStatus=='DOING'">新创建</span>
            </td>
            <td class="td-item">
            <Button class="goto" type="primary" v-show="item.packStatus!=='DISABLED' && item.packStatus!=='DOING'" @click="goCorp(item.packStatus, item, item.eeStatus)">进入管理</Button>
            <Button class="goto" type="primary" v-show="item.packStatus=='ACTIVE'" @click="enterCustomerSystem(item)">客服系统</Button>
            <Button @click="exitCorp(item.applyId, 1, item.corpName)" v-show="item.identity!==1">退出企业</Button>
            <Button @click="exitCorp(item.applyId, 2, item.corpName)" v-show="item.identity==1 && item.packStatus=='ACTIVE'">停用</Button>
            <Button @click="exitCorp(item.applyId, 3, item.corpName)" v-show="item.identity==1 && item.packStatus=='DISABLED'">启用</Button>
            <Button @click="exitCorp(item.applyId, 4, item.corpName)" v-show="item.identity==1 && item.packStatus=='DOING'">删除</Button>
            </td>
          </tr>
        </table>
        <div class="page">
          <!-- <Page :total="40" size="small" @on-change="changePage"></Page> -->
        </div>
        <div>
          <Button @click="createCompany()" type="primary">创建新企业</Button>
        </div>
      </div>
    </data-loading>

    <div class="footer-banner">
      <img src="@/assets/images/footer-banner.png" alt="">
    </div>
    <NewModal
      v-model="isAuditOrder"
      header="订购提醒"
      confrim="查看详情"
      content="当前企业有未完成订单，无法创建新企业，您可查看该订单详情。"
      @ok="setIsOrder(3)"
    ></NewModal>
    <common-modal ref="addCompany" header="创建提示" :content="addCompanyContent" confrim="知道了" :cancelBtn="false"></common-modal>
    <common-modal ref="stopCorp" header="停用企业" content="您正在停用该企业，停用后您将无法继续为该企业下的公众号提供管理和服务，当您启用后方可使用" @ok="stopCorp"></common-modal>
    <common-modal ref="delCorp" header="删除企业" content="您正在删除该企业，确定删除么？" @ok="delCorp"></common-modal>
    <common-modal ref="exitCorp" header="退出企业" content="退出企业后您将无法继续为该公司下的公众号提供管理和服务。" @ok="asyncOK"></common-modal>
    <common-modal ref="startCorp" header="启用企业" content="您正在启用该企业，启用后您将继续为该公司下的公众号提供管理和服务。" @ok="startCorp"></common-modal>
    <common-modal ref="expire" header="已过期提示" confrim="立即升级" content="该企业套餐已过期，请升级后继续使用。如有问题，请咨询销大师客服人员，谢谢。" @ok="upgradeExpire" ></common-modal>
    <common-modal ref="forbidden" header="禁用提示" content="该企业已被禁用，您暂时无法操作，请联系销大师客服人员" confrim="知道了" :cancelBtn="false"></common-modal>
    <common-modal ref="tingyong" header="企业停用" content="该企业已停用，无法进入企业管理，如需启用，请联系销大师客服人员" confrim="知道了" :cancelBtn="false"></common-modal>
    <common-modal ref="staffStop" header="员工停用" content="你的员工身份已停用，无法进入企业管理，如需启用，请联系管理员。" confrim="知道了" :cancelBtn="false"></common-modal>
    <common-modal ref="addCompanyPay" header="创建提示" content="存在待付款的企业，无法创建新企业，请先前往付款。" @ok="goCreatCompany" confrim="去支付"></common-modal>
    <NewModal v-model="showModel" header="停用提醒" content="当前企业为停用，请先启用后再续费升级。"></NewModal>
    <!-- 客服系统校验 -->
    <common-modal ref="customerSystem" header="操作提示" :content="enterCustomerTip" confrim="知道了" :cancelBtn="false"></common-modal>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import {
  getUserCorpAuthMulti,
  updateCorpName,
  savelogoutCompany,
  checkCreateCorpApply,
  updateCorpStatusByCorpId,
  saveloginCompany,
  getPersonalInfo
} from '@/api/query'
import { getCookieSession } from "@/utils/cookies"
import Const from './const'
export default {
  data() {
    return {
      // 点击修改企业名称的索引值
      isAuditOrder: false,
      idx: -1,
      const: Const,
      companyName: '',
      loadingStatu: 1,
      modal6: false,
      loading: true,
      corpData: [],
      addCompanyContent: '',
      applyId: '',
      offset: 0,
      showModel: false,
      loadingImg: 1,
      isStart: 1,
      saveStepsData: {
        current: 0,
        name: 'createCompany'
      },
      enterCustomerTip: ''
    }
  },
  mounted() {
    this.getUserCorpAuthMulti()
    this.getPersonalInfo()
    this.queryQcCloudUrlRequestName()
  },
  methods: {
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
    // 获得公司列表
    getUserCorpAuthMulti() {
      // let params = {
      //   offset: this.offset,
      //   limit: 10,
      //   // ASC
      //   order: 'ASC'
      // }
      // this.loadingStatu = 1
      getUserCorpAuthMulti().then(data => {
        if (data.code === 1) {
          // this.loadingStatu = 2
          this.loadingImg = 2
          this.corpData = data.data
        }
      })
    },
    reload() {
      this.getUserCorpAuthMulti()
    },
    isDisable(corpId, packStatus, item) {
      this.getExistOrder({ corpId: corpId }).then(data => {
        if (data.code === 1) {
          if (data.data.corpPackStatus === 'FORBIDDEN') {
            this.$refs.forbidden.showModal()
          } else if (data.data.corpPackStatus === 'DISABLED') {
            if (data.data.isBuy) {
              // this.localStorageSaveOrRead('currentCorp', item)
              let obj = {
                corpId: corpId,
                corpName: item.corpName
              }
              this.setPayStatu(obj)
            } else {
              this.showModel = true
            }
          } else {
            let obj = {
              corpId: corpId,
              corpName: item.corpName
            }
            // this.localStorageSaveOrRead('currentCorp', item)
            this.setPayStatu(obj)
          }
        } else {
          this.$Message.error(data.message)
        }
      })
    },
    checkCreateCorpApply() {
      checkCreateCorpApply().then(data => {
        this.setCorpPackage({})
        switch (data.code) {
          case 1:
            if (data.data.isBuy) {
              this.localStorageSaveOrRead('orderId', data.data.orderId)
              this.localStorageSaveOrRead('corpId', data.data.corpId)
              if (data.data.orderStatus === 3) {
                this.localStorageRemove('status', data.data.orderStatus)
                this.isAuditOrder = true
              } else {
                this.$refs.addCompanyPay.showModal()
              }
            } else {
              this.localStorageRemove('saveStepsData')
              this.localStorageRemove('orderPayPrice')
              this.localStorageRemove('companyParams')
              this.localStorageRemove('orderId')
              this.localStorageRemove('status')
              this.localStorageRemove('corpId')
              this.localStorageRemove('isCreatCompany')
              this.localStorageRemove('corpName')
              this.localStorageRemove('nextOrderStep')
              this.localStorageSaveOrRead('isCreatCompany', true)
              this.$router.push({ name: 'createCompany' })
            }
            break
          case 3529:
            this.addCompanyContent = '请先将未添加公众号的企业添加公众号。'
            this.$refs.addCompany.showModal()
            break
          case 3528:
            this.addCompanyContent = '您最多可创建10个企业。'
            this.$refs.addCompany.showModal()
            break
          case 3555:
            this.addCompanyContent = '请先将未付款的企业完成付款'
            this.$refs.addCompany.showModal()
            break
          default:
            this.addCompanyContent = data.message || '抱歉！暂时不能创建'
            this.$refs.addCompany.showModal()
            break
        }
      })
    },
    changePage(page) {
      this.offset = (page - 1) * 10
      // this.getUserCorpAuthMulti()
    },
    updateCorpName(params) {
      updateCorpName(params).then(data => {
        this.idx = -1
        switch (data.code) {
          case 1:
            this.$Message.success('修改成功')
            this.getUserCorpAuthMulti()
            break
          case 3515:
            this.$Message.error('修改失败！此公司已被注册')
            break
          case 3520:
            this.$Message.error('修改失败！公司不存在或不可用')
            break
          default:
            break
        }
      }).catch(() => {
        this.idx = -1
        this.$Message.error('修改失败！服务器出现问题')
      })
    },
    // 进入公司信息
    saveloginCompany(param, name) {
      let obj = {
        corpId: param
      }
      saveloginCompany(obj).then(data => {
        if (data.code === 1) {
          if (!data.data.menuTree) {
            this.$Message.error('非常抱歉，您暂无权限，不能进入管理')
            return
          }
          let navMenu = this.doneData(
            data.data.menuTree,
            this.const.unfoldData
          )
          this.localStorageSaveOrRead("menuTree", JSON.stringify(data.data.menuTree))
          this.localStorageSaveOrRead("secondMenu", navMenu.allSecondObj)
          this.localStorageSaveOrRead("mainMenu", navMenu.mainMenuList)

          this.setMenuList(navMenu)
          this.$router.push({ name: name })
        } else {
          // debugger
          this.localStorageRemove('currentCorp')
          switch (data.code) {
            case 3563:
              this.$refs.staffStop.showModal()
              break
            case 3531:
              this.$refs.expire.showModal()
              break
            case 3560:
              this.$refs.tingyong.showModal()
              break
            case 3561:
              this.$refs.forbidden.showModal()
              break
            default:
              this.$Message.error(data.message)
              break
          }
          location.reload()
        }
      })
    },
    doneData(newArr, oldArr) {
      if (newArr.length < 0) {
        return
      }
      let arr = []
      let obj = {}
      newArr = newArr.sort(this.sortBy("menuOrder"))
      for (let index = 0; index < newArr.length; index++) {
        if (newArr[index].subMenu.length > 0) {
          newArr[index].subMenu = newArr[index].subMenu.sort(
            this.sortBy("menuOrder")
          )
        }
      }
      for (let i = 0; i < newArr.length; i++) {
        newArr[i].isSecond = false
        for (let j = 0; j < oldArr.length; j++) {
          if (newArr[i].menuName === oldArr[j].menuName) {
            if (newArr[i].subMenu.length > 0) {
              newArr[i].isSecond = true
            }
            let assignObj = Object.assign({}, oldArr[j], newArr[i])
            arr.push(assignObj)
            if (newArr[i].subMenu.length > 0) {
              obj[newArr[i].menuUrl] = {}
              obj[newArr[i].menuUrl].name = newArr[i].menuName
              obj[newArr[i].menuUrl].list = newArr[i].subMenu
            }
          }
        }
      }
      let rules = {
        fontClass: "fontClass",
        menuName: "menuName",
        isSecond: "isSecond",
        menuUrl: "menuUrl",
        icon: 'icon'
      }
      let mainMenu = this.transformData(arr, rules)
      return {
        allSecondObj: obj,
        mainMenuList: mainMenu
      }
    },
    savelogoutCompany(params) {
      savelogoutCompany(params).then(data => {
        if (data.code === 1) {
          this.$Message.success('退出成功')
          this.getUserCorpAuthMulti()
        }
      })
    },
    setCurrentCokie(val) {
      this.saveStepsData.current = val
      this.localStorageSaveOrRead('saveStepsData', this.saveStepsData)
    },
    checkOrder(applyId, item) {
      let params = {
        corpId: applyId,
        corpName: item.corpName
      }
      this.getExistOrder({ corpId: applyId }).then(data => {
        if (data.code === 1) {
          this.setCorpPackage({})
          // this.localStorageSaveOrRead('currentCorp', item)
          if (data.data.isBuy && data.data.orderStatus === 0) {
            this.goCreatCorp(applyId, data.data.orderId)
          } else {
            this.localStorageSaveOrRead('isCreatCompany', true)
            this.setPayStatu(params)
          }
        } else {
          this.$Message.error(data.message)
        }
      })
    },
    goCreatCompany() {
      this.goCreatCorp()
    },
    goCreatCorp(applyId, orderId) {
      if (applyId) {
        this.localStorageSaveOrRead('orderId', orderId)
        this.localStorageSaveOrRead('corpId', applyId)
      }
      this.localStorageSaveOrRead('isCreatCompany', true)
      this.saveStepsData.name = 'createCompany'
      this.setCurrentCokie(2)
      this.$router.push({ name: 'createCompany' })
    },
    updateCorpStatusByCorpId(params) {
      updateCorpStatusByCorpId(params)
        .then(data => {
          if (data.code === 1) {
            if (this.isStart === 1) {
              this.$Message.success('停用成功')
            } else if (this.isStart === 2) {
              this.$Message.success('启用成功')
            } else {
              this.$Message.success('删除成功')
            }
            this.getUserCorpAuthMulti()
          } else {
            this.$Message.error(data.message || '操作失败')
          }
        })
        .catch(() => {
          this.$Message.error('操作失败')
        })
    },
    nameEdit(idx, name) {
      this.idx = idx
      this.companyName = name
      this.$nextTick(() => {
        this.$refs.inputFocusCrop[idx].focus()
      })
    },
    saveEdit(applyId) {
      if (this.companyName.trim().length > 100) {
        this.$Message.error('修改失败！公司名称长度不能大于100')
        return
      }
      let params = {
        applyId,
        corpName: this.companyName.trim()
      }
      this.updateCorpName(params)
    },
    exitCorp(applyId, idx, corpName) {
      this.applyId = applyId
      this.corpName = corpName
      if (idx === 1) {
        this.$refs.exitCorp.showModal()
      } else if (idx === 2) {
        this.$refs.stopCorp.showModal()
      } else if (idx === 3) {
        this.$refs.startCorp.showModal()
      } else {
        this.$refs.delCorp.showModal()
      }
    },
    goCorp(comboStatus, item, staffStatus) {
      this.applyId = item.applyId
      this.corpName = item.corpName
      if (comboStatus === 'EXPIRE') {
        this.$refs.expire.showModal()
      } else if (comboStatus === 'DISABLED') {
        this.$refs.disabled.showModal()
      } else if (comboStatus === 'FORBIDDEN') {
        this.$refs.forbidden.showModal()
      } else if (staffStatus === 2) {
        this.$refs.staffStop.showModal()
      } else {
        let currentCorp = {
          applyId: item.applyId,
          corpName: item.corpName
        }
        this.setCookie('currentCorp', currentCorp)
        // 重置企业相关信息
        localStorage.removeItem('curAccount')
        this.localStorageSaveOrRead('currentCorp', currentCorp)
        this.saveloginCompany(item.applyId, 'survey')
      }
    },
    cancelEdit() {
      this.idx = -1
    },
    startCorp() {
      this.isStart = 2
      let obj = {
        corpIdList: [this.applyId],
        status: 'ACTIVE'
      }
      this.updateCorpStatusByCorpId(obj)
    },
    stopCorp() {
      this.isStart = 1
      let obj = {
        corpIdList: [this.applyId],
        status: 'DISABLED'
      }
      this.updateCorpStatusByCorpId(obj)
    },
    delCorp() {
      this.isStart = 3
      let obj = {
        corpIdList: [this.applyId],
        status: 'DELETE'
      }
      this.updateCorpStatusByCorpId(obj)
    },
    asyncOK() {
      this.savelogoutCompany({ corpId: this.applyId })
    },
    upgrade(corpId, packStatus, item) {
      this.setCorpPackage({})
      this.isDisable(corpId, packStatus, item)
    },
    upgradeExpire() {
      this.setPayStatu({ corpId: this.applyId, corpName: this.corpName })
    },
    createCompany() {
      this.checkCreateCorpApply()
    },
    validEnterCustomer(item) {
      this.enterCustomerTip = '操作提示'
      this.$refs.customerSystem.showModal()
      // this.isDisable(item.applyId, item.packStatus, item)
    },
    enterCustomerSystem(item) {
      let CHAT_URL = process.env.CHAT_BASE_URL
      if (CHAT_URL) {
        let sessionId = getCookieSession()
        let applyId = item.applyId
        let uid = item.userId
        window.open(`${CHAT_URL}/?sid=${sessionId}&corpId=${applyId}&uid=${uid}`)
      } else {
        console.error('请填写要跳转的地址')
      }
    },
    ...mapActions({
      setIsOrder: 'pay/setIsOrder',
      setPayStatu: 'pay/setPayStatu',
      setCorpPackage: 'survey/setCorpPackage',
      setMenuList: 'nav/setMenuList',
      queryQcCloudUrlRequestName: 'public/queryQcCloudUrlRequestName'
    })
  }
}
</script>

<style lang="stylus">
@import '~@/assets/stylus/mixin'
#company
  padding 42px 43px 160px
  .title
    font-size 20px
  .no-table-list
    position relative
    margin-top 100px
    text-align center
    .no-img
      display inline-block
    .no-text
      font-size 16px
      margin-top 30px
    .no-btn
      margin-top 30px
      width 160px
  .company-table-list
    min-height 350px
    position relative
    margin-top 30px
    .table
      text-align left
      width 100%
      .tr-item
        height 60px
        line-height 60px
        border-bottom solid 1px #e9eaec
        .th-item
          color #848484
          text-align left
        .td-item
          .default-name
            padding-right 25px
            position relative
            .edit-icon
              position absolute
              right 20px
              top 20px
              width 20px
              height 20px
              display none
          .goto
            margin-right 10px
          .handle
            margin-left 6px
            color #409eff
            cursor pointer
          .pay
            color #f56c6c
          .span
            line-height 1
            display inline-block
            &.company-name
              max-width 150px
              no-wrap()
          .dingWidth
            width 18.25px
          .c-tooltip
            white-space normal
      .loading-item
        .loading
          position relative
          height 300px
      .tr-td-item .td-item:hover
        .default-name
          .edit-icon
            display inline-block
    .page
      margin-top 50px
      clear()
      .ivu-page
        float right
  .footer-banner
    position absolute
    bottom -2px
    left 0
    width 100%
    img
      width 100%
      height 100%
</style>


