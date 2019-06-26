<template>
  <div id="seats">
      <data-loading @reload="reload" :data-satau='loadingStatu'>
        <div class="scroll-common-content">
          <div class="seats-main">
            <div class="common-title">
              坐席管理 <span class="common-tips">(共{{totalCount}}个坐席)</span>
            </div>
            <div class="noseats-wrapper" v-show="showNoData">
              <no-seats @upgrade="upgrade" @addSeats="addSeats"></no-seats>
            </div>
            <div class="operation-wrapper" v-show="!showNoData">
              <div class="operation">
                <div class="add-staff">
                  <Button type="primary" @click="addSeats">添加坐席</Button>
                </div>
                <div class="basic-operation">
                  <div class="operation-item">
                    <SearchBox
                      v-model="searchParams.seatNo"
                      :search="searchSeatsList"
                      :clear="searchSeatsList"
                      :holder="'填写坐席编号搜索'"
                      :width="'220px'"
                    ></SearchBox>
                  </div>
                  <div class="operation-item">
                    <div class="icon operation-icon" @click="handleFilter">&#xe748;</div>
                  </div>
                  <div class="operation-item">
                    <div class="icon operation-icon" @click="exportCsv">&#xe66c;</div>
                  </div>
                  <div class="operation-item">
                    <div class="icon operation-icon" @click="refresh">&#xe62b;</div>
                  </div>
                  <div class="operation-item" @click.stop>
                    <Poptip placement="right-start" v-model="showSet">
                      <div class="icon operation-icon size-same">&#xe633;</div>
                      <div class="api" slot="content">
                        <div class="title">选择项目</div>
                        <div class="content">
                          <CheckboxGroup v-model="setting" @on-change="settingChange">
                            <template v-for="(item, index) in deepColumns">
                              <Checkbox @click.native.stop :label="item.key" v-if="item.title" :key="index">{{item.title}}</Checkbox>
                            </template>
                          </CheckboxGroup>
                        </div>
                      </div>
                    </Poptip>
                  </div>
                </div>
              </div>
              <div class="table-list">
                <BScroll :offsetBottom="150" :data="seatListData">
                <Table
                  ref="table"
                  :loading="beginIntoLoading === 1"
                  @on-row-click="currentChange"
                  @on-selection-change="selectionChange"
                  :highlight-row="true"
                  :columns="columns"
                  :data="seatListData"
                >
                </Table>
                </BScroll>
              </div>
              <div class="page-batch">
                <div class="batch">
                  <div class="batch-item">
                    <Checkbox @on-change="allSelectList" :disabled="totalCount <= 0" v-model="single"><span class="text">全选</span></Checkbox>
                  </div>
                  <div class="batch-item">
                    <Button type="ghost" size="small" @click="batchStop">批量停用</Button>
                  </div>
                  <div class="batch-item">
                    <Button type="ghost" size="small" @click="batchSetLimit">批量设置权限</Button>
                  </div>
                </div>
                <div class="commom-page">
                  <Page :total="totalCount" v-show="totalCount > 10" show-total show-elevator show-sizer @on-change="pageChange" @on-page-size-change="pageSizeChange"></Page>
                </div>
              </div>
            </div>
          </div>
        </div>
      </data-loading>

    <drawer v-model="showFilter">
      <div slot="content">
        <div class="content-wrapper">
          <div class="content-item">
            <div class="content-left">
              坐席状态
            </div>
            <div class="content-right">
              <Button class="btn-item" v-for="(item, index) in seatStatus" :key="index" :class="{active:seatsStatuIdx==index}" @click="selectSeatsStatu(index, item.itemValue)" size="small" type="ghost">{{item.itemName}}</Button>
            </div>
          </div>
          <!-- <div class="content-item">
            <div class="content-left">
              在线状态
            </div>
            <div class="content-right">
              <Button class="btn-item" v-for="(item, index) in onlineStatus" :key="index" :class="{active:onlineStatuIdx==index}" @click="selectOnlineStatu(index ,item.itemValue)" size="small" type="ghost">{{item.itemName}}</Button>
            </div>
          </div> -->
        </div>
      </div>
      <div slot="footer">
        <div class="footer-wrapper">
          <Button class="footer-btn" type="primary" @click="filterComfirm">确定</Button>
          <Button class="footer-btn" type="ghost"  @click="filterCancel">取消</Button>
        </div>
      </div>
    </drawer>
    <DrawerNoSave :isScroll="false" v-model="showBatchLimit" titleTips="批量设置权限">
      <div class="batch-limit-wrapper" slot="content">
        <div class="noseatDate" v-show="accountList.length<=0">
          <div class="item img"><img src="@/assets/images/admin/icon.png" alt=""></div>
          <div class="item tip">您还没有绑定公众号</div>
          <div class="item btn"><Button type="primary" @click="addAccount">添加公众号</Button></div>
        </div>
        <div v-show="accountList.length>0">
          <seatsLimit ref="seatsLimit" :isAdd="true"></seatsLimit>
        </div>
      </div>
      <div slot="footer" class="footer-wrapper">
        <Button class="footer-btn" @click="saveSeatsInfo" type="primary">保存</Button>
        <Button class="footer-btn" @click="back" type="ghost">返回</Button>
      </div>
    </DrawerNoSave>
    <add-seats :createSeat="createSeat" @isJixuAdd="addSeats" ref="addSeats"></add-seats>
    <seats-info @openModal="openModal" :editTabsVal = "editTabsVal"  @editInfoSeats="editInfo" ref="seatsInfo"></seats-info>
    <edit-seats @editInfoSeat="editInfoSeat" :tabsVal="tabsVal" ref="editSeats"></edit-seats>
    <common-modal ref="deallocate" header="解除分配" content="您正在解除该坐席的员工分配，解除后该坐席无法为企业提供服务，需重新分配客服后才能使用该坐席，确定解除分配吗？" @ok="deallocate"></common-modal>
    <common-modal ref="stopSeats" header="停用" content="您正在停用该坐席，停用后该坐席无法为企业提供服务，需重新启用坐席后才能使用该坐席功能，确定停用吗？" @ok="stopSeats"></common-modal>
    <common-modal ref="batchStopSeats" header="批量停用" content="您正在批量停用坐席，停用后的坐席无法为企业提供服务，需重新启用坐席后才能使用该坐席功能，确定停用吗？" @ok="batchStopSeats"></common-modal>
    <common-modal ref="start" header="启用" content="确定启用该坐席吗？" @ok="startSeats"></common-modal>
    <common-modal ref="addseatsTips" header="坐席数量不足" confrim="立即升级" :content="content" @ok="upgrade" ></common-modal>
  </div>
</template>

<script>
import {
  getIntoSeatList,
  saveSeatNo,
  getSeatList,
  getSeatDetail,
  updateSeatStatus,
  updateSeatAuthByBatch,
  getPublicAccountList,
  queryCorpPackRoleList
} from '@/api/query'
import { mapActions, mapGetters } from 'vuex'
import noSeats from './noSeats'
import addSeats from './addSeats'
import seatsInfo from './seatsInfo'
import editSeats from './editSeats'
import seatsLimit from './seatsLimit'
import ConstCommon from '@/utils/const'
import mixin from './seatsMixin.js'
export default {
  mixins: [mixin],
  data() {
    return {
      showSet: false, // 控制右上角设置项的显示
      tencentRules: ConstCommon.tencentRules,
      updateAuthBatchParams: {
        seatIds: null,
        appAccountIds: null,
        authIds: null
      },
      accountList: this.localStorageSaveOrRead('accountList') || [],
      beginIntoLoading: 1,
      ids: '',
      operationStatus: '',
      createSeat: {},
      content: '',
      showNoData: false,
      loadingStatu: 1,
      intoSeatTotalCount: 0,
      intoList: [],
      totalCount: 0,
      searchParams: {
        offset: 0,
        limit: 10,
        seatNo: null,
        status: null,
        onlineStatus: null
      },
      showBatchLimit: false,
      tabsVal: '1',
      editTabsVal: '1',
      selectListData: [],
      onlineStatuIdx: 0,
      seatsStatuIdx: 0,
      seatsStatu: '',
      onlineStatu: '',
      showFilter: false,
      setting: [],
      single: false,
      deepColumns: [],
      seatListData: [],
      seatStatus: [
        {
          itemValue: null,
          itemName: '全部'
        }
      ],
      onlineStatus: [
        {
          itemValue: null,
          itemName: '全部'
        }
      ],
      systems: [
        {
          name: '聊天管理系统',
          obj: {}
        },
        {
          name: '客户端系统',
          obj: {}
        },
        // {
        //   name: '小程序',
        //   obj: {}
        // }
      ]
    }
  },
  created() {
    this.getItemValue('XDS_SEAT_STATUS')
    // this.getItemValue('XDS_SEAT_ON_LINE_STATUS')
    this.queryCorpPackRoleList('PC_WEB_CHAT', '聊天管理系统', 0)
    this.queryCorpPackRoleList('PC_DESKTOP_CHAT', '客户端系统', 1)
    // this.queryCorpPackRoleList('WX_MP_CHAT', '小程序', 2)
    this.$root.Bus.$on('refreshList', () => {
      this.getSeatList()
    })
    this.$root.Bus.$on('drawerClose', () => {
      this.$refs.table.clearCurrentRow()
    })
    this.deepColumns = this.columns.slice()
    let chooseObj = localStorage && JSON.parse(localStorage.getItem(this.installName('seat')))
    if (chooseObj) {
      this.setting = chooseObj
      this.settingChange()
    } else {
      this.checkSettingArr(this.deepColumns)
    }
    this.getIntoSeatList()
  },
  watch: {
    showBatchLimit(v) {
      if (v) {
        this.showSet = false
        this.closePop(this.seatListData, 'showPop') // 公共方法，见util.js
      }
    }
  },
  computed: {
    ...mapGetters({
      seatsInfo: 'seats/getSeatsInfo',
      corpInfoData: 'survey/getCorpInfo'
    })
  },
  mounted() {
    this.on(document.body, 'click', () => {
      this.showSet = false
      this.closePop(this.seatListData, 'showPop') // 公共方法，见util.js
    })
  },
  methods: {
    queryCorpPackRoleList(platformType, name, index) {
      let params = {
        platformType: platformType
      }
      queryCorpPackRoleList(params).then(data => {
        if (data.code === 1) {
          let obj = {}
          let show = false
          let orderData = data.data.sort(this.sortBy('authRoleOrder', "max"))
          for (let item of orderData) {
            obj[item.groupName] = obj[item.groupName] || {}
            // item.roleName === item.groupName && (obj[item.groupName].authRoleOrder = item.authRoleOrder)
            obj[item.groupName].name = item.groupName
            obj[item.groupName].data = obj[item.groupName].data || []

            let isSelect = (this.seatsInfo.authIds || []).includes(item.roleId)
                isSelect && (show = true)
            obj[item.groupName].data.push({
              cont: item.roleName,
              id: item.roleId,
              groupName: item.groupName,
              isSelect
            })
          }
          this.systems[index].obj = obj
          this.systems[index].name = name
          this.systems[index].show = show
          this.setCorpPackRoleList(this.systems)
        }
      })
    },
    openModal(name, ids, operationStatus) {
      this.ids = ids
      this.operationStatus = operationStatus
      this.selectAction(name)
    },
    // 获取公众号列表
    getPublicAccountList(name) {
      let params = {
        corpId: this.localStorageSaveOrRead('currentCorp').applyId
      }
      getPublicAccountList(params).then(data => {
        if (data.code === 1) {
          let tencentData = data.data
          let cookieTencentData = this.transformData(tencentData, this.tencentRules)
          this.localStorageSaveOrRead('accountList', cookieTencentData || [])
          this.$refs[name].showDrawer()
        } else {
          this.$Message.error('获取公众号列表失败')
        }
      })
    },
    editInfoSeat(id, name, val) {
      this.getSeatList()
      this.getSeatDetail(id, name, val)
    },
    updateSeatAuthByBatch() {
      updateSeatAuthByBatch(this.updateAuthBatchParams).then(data => {
        if (data.code === 1) {
          this.single = false
          this.showBatchLimit = false
          this.$Message.success('保存成功')
          this.getSeatList()
        }
      })
    },
    addAccount() {
      this.$router.push({ name: 'tencentManage' })
    },
    updateSeatStatus(params) {
      params = Object.assign(
        {},
        { operationStatus: this.operationStatus },
        { ids: params }
      )
      updateSeatStatus(params)
        .then(data => {
          if (data.code === 1) {
            this.getSeatList()
            if (params.ids.length === 1 && this.operationStatus !== 'BATCH_BLOCK_UP') {
              this.getSeatDetail(params.ids[0])
            }
            this.single = false
            switch (this.operationStatus) {
              case 'ACTIVE':
                this.$Message.success('启用坐席成功')
                break
              case 'BLOCK_UP':
                this.$Message.success('停用坐席成功')
                break
              case 'REMOVE':
                this.$Message.success('解除分配成功')
                break
              case 'BATCH_BLOCK_UP':
                this.$Message.success('批量停用坐席成功')
                break
              default:
                break
            }
          } else {
            this.$Message.error(data.message)
          }
        })
        .catch(() => {
          this.$Message.error('操作超时')
        })
    },
    getSeatDetail(param, name, val) {
      let params = {
        id: param
      }
      getSeatDetail(params).then(data => {
        if (data.code === 1) {
          this.localStorageSaveOrRead('seatsInfo', data.data)
          this.setSeatsInfo(data.data)
          if (val) {
            this.tabsVal = '1'
            this.editTabsVal = val
          }
          if (name) {
            return name
          }
        } else {
          this.$Message.error('获取详情失败')
        }
      }).then((data) => {
        if (data) {
          this.getPublicAccountList(data)
        }
      }).catch(() => {
        this.$Message.error('获取详情失败')
      })
    },
    // 获取坐席筛选的状态
    getItemValue(key) {
      let obj = {
        itemKey: key
      }
      this.queryTItemValueByPager(obj).then(data => {
        switch (data.code) {
          case 1:
            switch (key) {
              case 'XDS_SEAT_STATUS':
                this.seatStatus = this.seatStatus.concat(data.data.sort(this.sortBy('itemIdx')))
                break
              case 'XDS_SEAT_ON_LINE_STATUS':
                this.onlineStatus = this.onlineStatus.concat(data.data.sort(this.sortBy('itemIdx')))
                break
              default:
                break
            }
            break

          default:
            break
        }
      })
    },
    getIntoSeatList() {
      let params = {
        offset: 0,
        limit: 10
      }
      getIntoSeatList(params).then(data => {
        if (data.code === 1) {
          this.getSeatList()
          this.intoList = data.data.records
          this.intoSeatTotalCount = data.data.totalCount
          if (this.intoSeatTotalCount > 0 && this.intoList.length <= 0) {
            this.showNoData = true
          } else {
            this.showNoData = false
          }
        }
      })
    },
    saveSeatNo() {
      saveSeatNo().then(data => {
        if (data.code === 1) {
          this.createSeat = {
            id: data.data.id,
            seatNo: data.data.seatNo
          }
          this.getPublicAccountList('addSeats')
        } else {
          this.content = `当前套餐版本最多支持${
            this.corpInfoData.packSeatNum
          }个坐席，如需更多服务请升级。`
          this.$refs.addseatsTips.showModal()
        }
      })
    },
    reload() {
      this.getSeatList()
    },
    getSeatList() {
      this.beginIntoLoading = 1
      getSeatList(this.searchParams)
        .then(data => {
          if (data.code === 1) {
            this.loadingStatu = 2
            this.beginIntoLoading = 2
            this.seatListData = data.data.records
            this.totalCount = data.data.totalCount
          } else {
            this.loadingStatu = 3
          }
        })
        .catch(() => {
          this.loadingStatu = 3
        })
    },
    pageChange(val) {
      this.searchParams.offset = this.searchParams.limit * (val - 1)
      this.getSeatList()
    },
    pageSizeChange(val) {
      this.searchParams.limit = val
      this.getSeatList()
    },
    refresh() {
      this.getSeatList()
    },
    settingChange() {
      let arr = []
      arr.push(this.deepColumns[0])

      for (let j = 0; j < this.deepColumns.length; j++) {
        let deepColKey = this.deepColumns[j]
        for (let index = 0; index < this.setting.length; index++) {
          let settingKey = this.setting[index]
          if (settingKey === deepColKey.key) {
            arr.push(deepColKey)
            break
          }
        }
      }

      this.$set(this, 'columns', arr)
      let key = this.installName('seat')
      localStorage && localStorage.setItem(key, JSON.stringify(this.setting))
    },
    checkSettingArr(arr) {
      arr.forEach(item => {
        item.title && item.checked !== false && this.setting.push(item.key)
      })
      this.settingChange()
    },
    saveSeatsInfo() {
      this.updateAuthBatchParams.seatIds = []
      this.selectListData.forEach(item => {
        this.updateAuthBatchParams.seatIds.push(item.id)
      })
      let param = this.$refs['seatsLimit'].isGoNext()
      if (param) {
        this.updateAuthBatchParams.appAccountIds = param.appAccountIds || null
        this.updateAuthBatchParams.authIds = param.authIds || null
        this.updateSeatAuthByBatch()
      }
    },
    back() {
      this.showBatchLimit = false
    },
    editInfo(val) {
      this.editTabsVal = '1'
      this.tabsVal = '1'
      setTimeout(() => {
        this.tabsVal = val
        this.getPublicAccountList('editSeats')
      }, 1)
    },
    currentChange(currentRow, oldCurrentRow) {
      this.getSeatDetail(currentRow.id, 'seatsInfo')
    },
    searchSeatsList() {
      this.searchParams.offset = 0
      this.searchParams.limit = 10
      this.getSeatList()
    },
    upgrade() {
      let corpId = this.localStorageSaveOrRead('currentCorp').applyId
      let corpName = this.localStorageSaveOrRead('currentCorp').corpName
      let obj = {
        corpId: corpId,
        corpName: corpName
      }
      this.setPayStatu(obj)
    },
    selectAction(name) {
      this.$refs[name].showModal()
    },
    addSeats() {
      // if (
      //   (this.intoSeatTotalCount > 0 && this.intoList.length <= 0) ||
      //   this.intoSeatTotalCount < this.corpInfoData.packSeatNum
      // ) {
      this.localStorageSaveOrRead('seatsInfo', {})
      this.setSeatsInfo({})
      this.saveSeatNo()
      // } else {
      //   this.content = `当前套餐版本最多支持${
      //     this.corpInfoData.packSeatNum
      //   }个坐席，如需更多服务请升级。`
      //   this.$refs.addseatsTips.showModal()
      // }
    },

    deallocate() {
      this.updateSeatStatus(this.ids)
    },
    stopSeats() {
      this.updateSeatStatus(this.ids)
    },
    batchStopSeats() {
      this.updateSeatStatus(this.ids)
    },
    startSeats() {
      this.updateSeatStatus(this.ids)
    },
    exportCsv() {
      let seatListData = this.deepCopy(this.seatListData)
      seatListData = seatListData.map((item) => {
        let statu = item.status
        item.remark = item.remark || '--'
        item.eeName = item.eeName || '--'
        item.positionName = item.positionName || '--'
        item.mobile = item.mobile || '--'
        item.deptName = item.deptName || '--'
        item.distributionTime = (item.distributionTime && item.distributionTime.substring(0, 16)) || '--'
        item.status = (statu === 1 ? '正常' : statu === 2 ? '停用' : statu === 3 ? '禁用' : '未分配') || '--'
        item.onlineStatus = item.onlineStatus === 'ON_LINE' ? '在线' : item.onlineStatus === 'OFF_LINE' ? '离线' : '--'
        return item
      })
      this.$refs.table.exportCsv({
        filename: '坐席用户数据' + new Date().toLocaleDateString(),
        data: seatListData,
        columns: this.columns.filter((col, index) => index > 0 && index < this.columns.length - 1),
      })
    },
    batchStop() {
      if (this.selectListData.length === 0) {
        this.$Message.info('至少选择一项')
      } else {
        this.operationStatus = 'BATCH_BLOCK_UP'
        let arr = []
        this.selectListData.forEach(item => {
          arr.push(item.id)
        })
        this.ids = arr
        this.$refs.batchStopSeats.showModal()
      }
    },
    batchSetLimit() {
      if (this.selectListData.length === 0) {
        this.$Message.info('至少选择一项')
      } else {
        this.setSeatsInfo({})
        this.showBatchLimit = true
      }
    },
    allSelectList(val) {
      this.$refs.table.selectAll(val)
    },
    hideFilter() {
      this.showFilter = false
    },
    handleFilter() {
      this.showFilter = true
    },
    selectSeatsStatu(idx, value) {
      this.seatsStatuIdx = idx
      this.searchParams.status = value
    },
    selectOnlineStatu(idx, value) {
      this.onlineStatuIdx = idx
      this.searchParams.onlineStatus = value
    },
    filterComfirm() {
      this.hideFilter()
      this.getSeatList()
    },
    filterCancel() {
      this.hideFilter()
    },
    selectionChange(arr) {
      if (this.seatListData.length === arr.length) {
        this.single = true
      } else {
        this.single = false
      }
      this.selectListData = arr
    },
    // 公用方法，组装localStorage中存储的列表头显示数据的名称，为“用户id_公司id_页面名称”
    installName(pageName) {
      let userId = this.getToken().userId
      let applyId = this.localStorageSaveOrRead('currentCorp').applyId
      return userId + '_' + applyId + '_' + pageName
    },
    ...mapActions({
      setSeatsInfo: 'seats/setSeatsInfo',
      setPayStatu: 'pay/setPayStatu',
      setCorpPackRoleList: 'seats/setCorpPackRoleList'
    })
  },
  destroyed() {
    this.$root.Bus.$off('refreshList')
    this.$root.Bus.$off('drawerClose')
  },
  components: {
    noSeats,
    addSeats,
    seatsInfo,
    editSeats,
    seatsLimit
  }
}
</script>

<style lang="stylus">
@import './seats.styl'
  #seats
    .content-wrapper
      padding-top: 10px
    .operation-item
      .icon
        color: #909499
</style>


