<template>
  <div id="stuffData">
    <Drawer v-model="drawer" :titleTips="drawerTitle" :isScroll="false" :showFooter="false" ref="Drawer" @close="handle('goback')">
      <div slot="content">
        <UserDetail v-if="filter('UserDetail')" :userId="userId" :isModify='isModify' @close="closeDrawer"></UserDetail>
        <Filters ref="filters" v-show="filter('Filters')" :stuffStatus="stuffStatus" :zuoxiStatus="zuoxiStatus"></Filters>

        <div v-if="filter('WeCode')" class="ask_for">
          <WeCode :datas="weCodeData" :curApart="currentTreeNode">
            <div>
              <p>立即邀请<span class="text_color"> {{weCodeData && weCodeData.nickname}} ( 手机号 : {{weCodeData && weCodeData.mobile}}) </span>加入企业</p>
              <p>将二维码截图或保存后发送给员工,员工可用微信扫码加入企业</p>
            </div>
          </WeCode>
          <div class="handles">
            <i-button @click="drawer = false" class="return">返回</i-button>
          </div>
        </div>
      </div>
    </Drawer>

    <div class="cont">
        <div class="fn18">{{currentTreeNode.label}}({{currentTreeNode.eeNum}})</div>
        <div class="process">
            <span @click="handle('addApart')">添加子部门</span>
            | <span @click="handle('modifyApart')">修改</span>
            | <span @click="handle('delApart')">删除</span>
        </div>
        <div class="border"></div>
        <data-loading :dataSatau="dataSatau">
          <Tables ref="tables" :columns="columns" :datas="datas" :pageTotal='pageTotal'></Tables>
        </data-loading>
    </div>

    <Modal :title="modalTitle" v-model="showModal" class-name="self-center-modal">
        <div v-html="modalCont"></div>
        <div slot="footer">
          <Button type="primary" @click.stop="modalConfirm">{{confirmCont}}</Button>
          <Button @click.stop="showModal = false">取消</Button>
        </div>
    </Modal>
  </div>
</template>

<script>
import UserDetail from './components/drawerContent/userDetail'
import Filters from './filter'
import WeCode from './components/drawerContent/addUser/weCode'
import Tables from './components/tables'

import Const from './const'
import { mapState, mapGetters, mapActions } from 'vuex'
export default {
  data() {
    return {
      // 坐席列表和坐席状态
      stuffStatus: [],
      zuoxiStatus: [],
      pageTotal: 0,
      curProcess: '',
      // 是否为增加子部门
      isAdd: true,
      userId: null,
      isModifyApart: false,
      nowCompo: 'Filters',
      drawer: false,
      showModal: false,
      drawerTitle: '',
      corId: -1,
      modalTitle: '',
      action: Const.action(this),
      modalCont: '',
      loading: false,
      columns: [],
      dataSatau: 2,
      actionItems: Const.actionItems,
      isAllChoosed: false,
      datas: [],
      curUserList: [],
      curUserDepthList: [],
      weCodeData: {},
      isModify: false,
      confirmCont: '确定'
    }
  },
  props: {
    treeNode: {
      type: Object,
      default: () => { return {} }
    }
  },
  computed: {
    ...mapState({
      currentTreeNode: state => state.stuff.currentTreeNode
    }),
    ...mapGetters({
      currApart: 'stuff/getCurrApart',
      fitlerOpt: 'stuff/getFitlerOpt',
      fitlerName: 'stuff/getFitlerName',
      selectRows: 'stuff/getSelectRows',
      isTop: 'stuff/getIsTop',
      saveloginData: 'survey/getSaveloginCompany',
    })
  },
  created() {
    this.dataSatau = 1
    this.$store.commit('stuff/SET_FILTE_NAME', null)
    this.init()
    // 获取筛选列表
    this.getFilterOption()
    // 获取用户列表
    this._BUS.$on('getUsers', (key) => {
      this.getStuffData(key)
    })
    this._BUS.$on('showFilter', (param) => {
      this.showFilter(param)
    })
    this._BUS.$on('apartProcess', (key, node) => {
      key === 'addApart' && this.handle(key, node)
      key === 'modifyApart' && this.handle(key)
      key === 'delApart' && this.handle(key)
    })
    this._BUS.$on('setColumn', arr => {
      this.$set(this, 'columns', arr)
    })
    this._BUS.$on('handle', (key, param) => {
      this.handle(key, param)
    })
  },
  mounted() {
    this.on(document.body, 'click', this.closePoptip)
  },
  components: { UserDetail, Filters, WeCode, Tables },
  methods: {
    ...mapActions({
      setPayStatu: 'pay/setPayStatu',
      getTree: 'stuff/getTree'
    }),
    init() {
      this.columns = Const.columns(this.handle)
      this.columns.push(this.action)
      this.columns.map(item => {
        if (item.show !== false) {
          return (item.show = true)
        } else {
          return item
        }
      })
    },
    getStuffData(key) {
      this._BUS.$emit('tableLoading', true)
      let tableComponent = this.$refs.tables
      if (tableComponent) {
        let pageObj = tableComponent.pageParam
        let param = {
          addTimeQ: null,
          name: this.fitlerName,
          order: "DESC",
          seatStatusQ: null,
          sort: null,
          statusQ: null,
          limit: null,
          offset: null,
          isTop: Boolean(this.isTop),
          deptId: this.currentTreeNode.id || this.currApart.id || null
        }
        param = {...param, ...pageObj}
        if (this.fitlerOpt) {
          param = Object.assign(param, this.fitlerOpt)
        }
        this.getStuff(param).then((res) => {
          this.dataSatau = 2
          let rules = {
            nickname: 'name',
            mobile: 'mobile',
            deptName: 'apartment',
            postName: 'duty',
            applyId: 'applyId',
            status: 'status',
            eeId: 'eeId',
            userId: 'userId',
            entryDate: 'entryDate',
            identity: 'identity',
            joinStatus: 'joinStatus',
            addTime: 'addTime',
            createTime: 'createTime',
            seatStatus: 'seatStatus',
            deptId: 'deptId',
            sex: 'sex',
            corpId: 'corpId',
            postId: 'postId',
            topval: 'topval',
            remark: 'remark',
            seatName: 'seatName',
            seatNo: 'seatNo',
            picUrl: 'picUrl',
            accountNickName: 'accountNickName'
          }
          this._BUS.$emit('tableLoading', false)
          this._BUS.$emit('setNotChoose')
          if (res.code === 1) {
            this.pageTotal = res.data.totalCount
            let arr = res.data.records
            if (arr.length) {
              this.datas = arr.map(item => this._transformData(item, rules))
            } else {
              this.datas = []
            }
          } else {
            this.$Message.error(res.message)
            this.dataSatau = 3
          }
        })
      }
    },
    getFilterOption() {
      let param = {
        "itemKey": ""
      }
      let param1 = this.deepCopy(param)
      let param2 = this.deepCopy(param)
      param1.itemKey = 'XDS_EEMNG_EESTATUS'
      param2.itemKey = 'XDS_EEMNG_SEAT_STATUS'
      this.queryTItemValueByPager(param1).then((res) => {
        if (res.code === 1 && res.data) {
          let arr = res.data ? res.data : []
          arr.unshift({itemKey: "XDS_EEMNG_EESTATUS", itemValue: null, itemName: "全部",})
          this.stuffStatus = arr
        }
      })
      this.queryTItemValueByPager(param2).then((res) => {
        if (res.code === 1 && res.data) {
          let arr = res.data ? res.data : []
          arr.unshift({itemKey: "XDS_EEMNG_SEAT_STATUS", itemValue: null, itemName: "全部",})
          this.zuoxiStatus = arr
        }
      })
    },
    showFilter({nowCompo, drawerTitle}) {
      this.nowCompo = nowCompo
      this.drawer = true
      this.drawerTitle = drawerTitle
    },
    filter(name) {
      return this.nowCompo === name
    },
    unbindUsers() {
      let param = {
        id: this.curUserList[0]
      }
      this.unbindUser(param).then((res) => {
        if (res.code === 1) {
          this.getStuffData()
          this.clear()
        } else {
          this.$Message.error(res.message)
        }
      })
    },
    delCurApart() {
      this.delApart({id: this.currApart.id}).then((res) => {
        if (res.code === 1) {
          this.$Message.success('删除成功')
          this._BUS.$emit('delAparts')
          this.clear()
        }
      })
    },
    processUsers(key) {
      let param = {
        eeIdList: this.curUserList,
        status: key
      }
      if (key === 0) {
        this.delUser(param).then((res) => {
          if (res.code === 1) {
            this._BUS.$emit('treeUserNumDel', this.curUserDepthList)
            this.$Message.success('删除成功')
            this.getTree()
          } else {
            this.$Message.error(res ? res.message : '删除失败！')
          }
          this.clear('delUser')
        })
      } else if (key === 1) {
        this.startUser(param).then((res) => {
          if (res.code === 1) {
            this.$Message.success('启用成功')
          } else {
            this.$Message.error(res.message)
          }
          this.clear()
        })
      } else if (key === 2) {
        this.stopUser(param).then((res) => {
          if (res.code === 1) {
            this.$Message.success('停用成功')
          } else {
            this.$Message.error(res.message)
          }
          this.clear()
        })
      }
    },
    setParam(param) {
      if (param !== undefined) {
        this.curUserList = [param]
      } else {
        if (this.selectRows.length) {
          this.curUserList = this.selectRows.map((item) => {
            return item.eeId
          })
          this.curUserDepthList = this.selectRows.map((item) => {
            return item.deptId
          })
        } else {
          this.$Message.info('至少选择一项')
          return false
        }
      }
      return true
    },
    setTops(eeId) {
      this.setTopUser({id: eeId}).then((res) => {
        if (res.code === 1) {
          this.clear()
        }
      })
    },
    askForUser(eeId) {
      this.formWecode({id: eeId}).then((data) => {
          this.weCodeData = data.data
      })
    },
    cancelTop(eeId) {
      this.cancelTopUser({id: eeId}).then((res) => {
        if (res.code === 1) {
          this.clear()
        }
      })
    },
    valAddUser() {
      this.isAddUserAvail().then((res) => {
        if (res.code === 1) {
          this.drawer = true
          this.nowCompo = 'AddUser'
          this.drawerTitle = "添加员工"
        } else if (res.code === 3539) {
          this.showModal = true
          this.modalTitle = '员工数量不足'
          this.modalCont = `当前套餐版本最多支持${this.saveloginData.employeeNum || 0}个员工，如需更多服务请升级`
          this.confirmCont = '立即升级'
          this.curProcess = 'addUser'
        } else {
          this.$Message.error(res.message)
        }
      })
      return true
    },
    clear(key) {
      this.showModal = false
      this.getStuffData(key)
      this.handle('goback')
    },
    upgrade() {
      let obj = {
        corpId: this.localStorageSaveOrRead('currentCorp').applyId,
        corpName: this.localStorageSaveOrRead('currentCorp').corpName
      }
      this.setPayStatu(obj)
    },
    modalConfirm() {
      switch (this.curProcess) {
        case 'unbind':
          this.unbindUsers()
          break
        case 'stop':
          this.processUsers(2)
          break
        case 'start':
          this.processUsers(1)
          break
        case 'deleteUser':
          this.processUsers(0)
          break
        case 'delApart':
          this.delCurApart()
          break
        case 'addUser':
          this.showModal = false
          this.upgrade()
          break
        default:
          break
      }
    },
    handle(type, param) {
      let title = ''
      let cont = ''
      switch (type) {
        case 'show':
          this.drawer = true
          this.nowCompo = 'UserDetail'
          this.drawerTitle = '员工详情'
          this.userId = param
          this.isModify = false
          break
        case 'modify':
          this.drawer = true
          this.nowCompo = 'UserDetail'
          this.drawerTitle = '员工修改'
          this.userId = param
          this.isModify = true
          break
        case 'setTop':
          this.curProcess = 'setTop'
          this.setTops(param)
          break
        case 'cancelTop':
          this.cancelTop(param)
          break
        case 'unbind':
          title = '解绑'
          this.curProcess = 'unbind'
          this.setParam(param)
          this.showModal = true
          cont = Const.unbindTips
          break
        case 'stop':
          title = '停用'
          if (!this.setParam(param)) return false
          this.curProcess = 'stop'
          this.showModal = true
          cont = Const.stopTips
          break
        case 'start':
          title = '启用'
          this.setParam(param)
          this.curProcess = 'start'
          this.showModal = true
          cont = Const.startTips
          break
        case 'delete':
          title = '删除'
          if (!this.setParam(param)) return false
          this.curProcess = 'deleteUser'
          this.showModal = true
          cont = Const.delTips
          break
        case 'goback':
          this.isModify = false
          this.drawer = false
          this.nowCompo = ''
          break
        case 'addUser':
          this.valAddUser()
          break
        case 'askFor':
          this.nowCompo = 'WeCode'
          this.drawer = true
          this.drawerTitle = "邀请加入"
          this.askForUser(param)
          break
        case 'addApart':
          this.treeNode.treeCurrentNodeOperations('addChild')
          break
        case 'modifyApart':
          this.treeNode.treeCurrentNodeOperations('modify')
          break
        case 'delApart':
          this.treeNode.treeCurrentNodeOperations('delete')
          break
        case 'updateMenu':
          this.drawer = false
          this.upgrade()
          break
        default:
          break
      }
      if (this.showModal) {
        this.modalTitle = title
        this.modalCont = cont
        this.confirmCont = '确定'
      }
      this.bodyClick()
    },
    closeDrawer() {
      this.isModify = false
      this.drawer = false
      this.nowCompo = ''
    },
    closePoptip(dex) { // 关闭操作按钮
      this.closePop(this.datas, 'showPop', dex)
    }
  },
  beforeDestroy() {
    this._BUS.$off('getUsers')
    this._BUS.$off('showFilter')
    this._BUS.$off('apartProcess')
    this._BUS.$off('setColumn')
    this._BUS.$off('handle')
  }
}
</script>
<style>
.self-center-modal.ivu-modal-wrap{
  top:50%;
  transform: translateY(-50%)
}
.action.ivu-poptip-popper {
  width: 100px !important;
  min-width: 100px;
}
.action.ivu-poptip-popper .ivu-poptip-arrow{
  top: 20px;
}
.ivu-poptip-popper .ivu-poptip-body{
  padding:8px 16px
}
.action.ivu-poptip-popper .ivu-poptip-body {
  text-align: center;
  padding: 10px 0;
}
.action.ivu-poptip-popper .ivu-poptip-body .action-item {
  height: 30px;
  line-height:30px;
}
.action.ivu-poptip-popper .ivu-poptip-body .action-item:hover {
  background-color: #409eff;
  cursor: pointer;
  color: #fff;
}
</style>
<style lang="stylus">
@import '~@/assets/stylus/index'
.ivu-poptip-popper
  min-width:0
.ivu-poptip-body
  // padding:0
.modal_link
  padding 3px 5px
  inline()
  border 1px solid blue
  color(blue)
.handles
  setMiddle()
  absolute()
  bottom -40px
  right 0
  left 0
  bgColor()
  border-top 1px solid #f0f2f3
  padding 20px 30px
  padb(0)
  center()
  li
    padding: 0 10px
  button
    padding:0 15px
  button,li
    inline()
    cursor()
    vertical(40px)
    center()
    radius(3px)
    margin:0 10px
    border:1px solid #ddd
    &.width_bg
      color()
      border:none
.ask_for
  height:100%
  relative()
  .text_color
    color(text_color)

#stuffData
  height 100%
  width 100%
  .ivu-table-cell
    height 60px
    line-height 60px
  .drawer_footer
    .ivu-btn
      vertical(40px)
      padding: 0 5px
      &.width_bg
        bgColor(skyblue)
        color()
  .cont
    height:100%
    div.fn18
      mb(10px)
    .process
      color(light_color)
      span
        color(text_color)
        cursor()
    .border
      border-bottom 1px solid #dddddd
      margin 20px 0
</style>
