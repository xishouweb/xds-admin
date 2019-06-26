
<template>
  <div class="syncTencent">
    <Drawer v-model="showModal" titleTips="同步管理">
      <div slot="content">
        <div class="sync-tips">
          <p class="tips-item">温馨提示：</p>
          <p class="tips-item">1、为了您更好的使用销大师，销大师提供微信公众平台数据同步服务的功能，同步管理可从微信平台同步以下数据信息至销大师。</p>
          <p class="tips-item">2、数据信息越多，同步时间稍长，请您耐心等待。</p>
        </div>
        <div class="refresh" @click="refresh">
          <span class="icon">&#xe62b;</span>
          <span class="refresh-text">刷新</span>
        </div>
        <data-loading @reload="reload" :data-satau='loadingStatu'>
          <div class="sync-table">
            <div class="sync-header">
              <div class="sync-content">
                <Checkbox v-model="selectAll" @on-change="changeAll"><span class="margin-span">同步内容</span></Checkbox>
              </div>
              <div class="status">同步状态</div>
              <div class="number">同步次数(天)</div>
              <div class="time">最近同步时间</div>
            </div>
            <div class="sync-wrapper">
              <div class="sync-item" v-if="!(serviceTypeInfo!=2&&item.itemValue==='TEMPLATE')" v-for="(item, index) in syncData" :key="index">
                 <!-- 粉丝同步 -->
                <div class="one-leave" v-if="item.itemValue == 'USER_INFO'">
                  <div class="one-item">
                    <Checkbox
                      :disabled="item.synNum >= item.packageNum"
                      @on-change="changeHandle(item)"
                      :value="checkSyncValue.indexOf(item.itemValue) > -1 || item.synStatus===1">
                      <span class="margin-span">{{item.itemName}}</span>
                    </Checkbox>
                  </div>
                  <div class="one-item" :class="item | filtersClass">{{item | remindText}}</div>
                  <div class="one-item" :class="item | filtersClass">{{item.synNum || 0}} / {{item.packageNum || 0}}</div>
                  <div class="one-item" :class="item | filtersClass">{{item.synTime || '--'}}</div>
                </div>
                <!-- 媒体素材同步 -->
                <template v-else-if="item.itemValue == 'MEDIA'">
                  <div class="one-leave">
                    <div class="one-item">
                      <Checkbox :disabled="item.synStatus===1" @on-change="changeHandle(item)" :value="checkSyncValue.indexOf(item.itemValue) > -1 || item.synStatus===1">
                        <span class="margin-span">{{item.itemName}}</span>
                      </Checkbox>
                    </div>
                  </div>
                  <!-- 媒体素材（子集）同步 -->
                  <div class="two-leave" v-for="(twoItem, idx) in item.subSynList" :key="idx">
                    <div class="two-item differ">
                      <Checkbox @on-change="changeHandle(twoItem)"
                        :disabled="twoItem.synNum >= twoItem.packageNum"
                        :value="checkSyncValue.indexOf(twoItem.itemValue) > -1 || twoItem.synStatus===1">
                        <span class="margin-span">{{twoItem.itemName}}</span>
                      </Checkbox>
                    </div>
                    <div class="two-item"
                      :class="twoItem | filtersClass">{{twoItem | remindText}}</div>
                    <div class="two-item"
                      :class="twoItem | filtersClass">{{twoItem.synNum || 0}} / {{twoItem.packageNum || 0}}</div>
                    <div class="two-item"
                      :class="twoItem | filtersClass">{{twoItem.synTime || '--'}}</div>
                  </div>
                </template>
                <!-- 其他同步 -->
                <div class="one-leave" v-else>
                  <div class="one-item">
                    <Checkbox :disabled="item.synStatus===1" @on-change="changeHandle(item)" :value="checkSyncValue.indexOf(item.itemValue) > -1 || item.synStatus===1">
                      <span class="margin-span">{{item.itemName}}</span>
                    </Checkbox>
                  </div>
                  <div class="one-item" :class="{active:item.synStatus===0,unactive:item.synStatus===1}">{{item.synStatus | statusFilter}}</div>
                  <div class="one-item" :class="{active:item.synStatus===0,unactive:item.synStatus===1}">{{item.synNum || 0}} / {{item.packageNum || 0}}</div>
                  <div class="one-item" :class="{active:item.synStatus===0,unactive:item.synStatus===1}">{{item.synTime || '--'}}</div>
                </div>

              </div>
            </div>
          </div>
        </data-loading>
      </div>
      <div slot="footer">
        <Button class="footer-btn" type="primary" @click="syncConfirm">同步</Button>
        <Button class="footer-btn" type="ghost"  @click="syncCancel">取消</Button>
      </div>
    </Drawer>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import {updateCssWxPublicAccountDataToDb} from '@/api/query'
export default {
  model: {
    prop: 'ansyDrawer',
    event: 'changeStatu'
  },
  props: {
    ansyDrawer: {
      default: false,
      type: Boolean
    },
    serviceTypeInfo: {
      default: 0,
      type: Number
    },
    appAccountId: {
      default: -1,
      type: [Number, String]
    }
  },
  data() {
    return {
      checkSyncValue: [],
      syncBtn: false,
      selectAll: false,
      loadingStatu: 1,
      syncData: [],
      constArr: ['MEDIA_NEWS', 'MEDIA_VIDEO', 'MEDIA_IMG', 'MEDIA_VOICE']
    }
  },
  filters: {
    statusFilter(val) {
      switch (val) {
        case 0:
          return '同步成功'
        case 1:
          return '同步中'
        default:
          return '--'
      }
    },
    remindText(val) {
      let packageNum = val.packageNum || 0
      let synNum = val.synNum || 0
      return synNum >= packageNum ? '已同步' : '同步成功'
    },
    filtersClass(val) {
      let classList = []
      val.synStatus === 0 && classList.push('active')
      val.synStatus === 1 && classList.push('unactive')
      val.synNum >= val.packageNum && classList.push('unactive')
      return classList
    }
  },
  watch: {
    appAccountId(val) {
      this.syncData = []
      this.checkSyncValue = []
      this.loadingStatu = 1
      this.queryCssSynList()
    },
    syncData: {
      handler(newval, oldval) {
        if (oldval.length > 0) {
          newval.forEach((item, index) => {
            if ((newval[index].synStatus === 0 && oldval[index].synStatus === 1) || this.syncBtn && (newval[index].synStatus === 0 && oldval[index].synStatus === 0)) {
              let parentIdx = this.checkSyncValue.indexOf(newval[index].itemValue)
              if (parentIdx > -1) {
                this.checkSyncValue.splice(parentIdx, 1)
              }
            }
            if (item.subSynList && item.subSynList.length > 0) {
              item.subSynList.forEach((_item, idx) => {
                if ((newval[index].subSynList[idx].synStatus === 0 && oldval[index].subSynList[idx].synStatus === 1) || this.syncBtn && (newval[index].subSynList[idx].synStatus === 0 && oldval[index].subSynList[idx].synStatus === 0)) {
                  let childrenIdx = this.checkSyncValue.indexOf(newval[index].subSynList[idx].itemValue)
                  if (childrenIdx > -1) {
                    this.checkSyncValue.splice(childrenIdx, 1)
                  }
                }
              })
            }
          })
        }
      },
      deep: true
    },
    checkSyncValue: {
      handler(val) {
        if (val.length === this.syncSelect.length) {
          this.selectAll = true
        } else {
          this.selectAll = false
        }
        // 判断该数组是否包含二级菜单
        let flag = this.isContained(val, this.constArr)
        let index = val.indexOf('MEDIA')
        if (flag) {
          if (index < 0) {
            this.checkSyncValue.push('MEDIA')
          }
        } else {
          if (index >= 0) {
            this.checkSyncValue.splice(index, 1)
          }
        }
      },
      deep: true
    }
  },
  computed: {
    ...mapGetters({
      loginCompanyData: 'survey/getSaveloginCompany'
    }),
    showModal: {
      get() {
        return this.ansyDrawer
      },
      set(val) {
        this.$emit('changeStatu', val)
      }
    },
    syncSelect() {
      if (this.serviceTypeInfo === 2) {
        return [
          'USER_INFO',
          'MEDIA',
          'MEDIA_NEWS',
          'MEDIA_VIDEO',
          'MEDIA_IMG',
          'MEDIA_VOICE',
          'CUSTOMER_MENU',
          'TEMPLATE',
          'MENU'
        ]
      } else {
        return [
          'USER_INFO',
          'MEDIA',
          'MEDIA_NEWS',
          'MEDIA_VIDEO',
          'MEDIA_IMG',
          'CUSTOMER_MENU',
          'MEDIA_VOICE',
          'MENU'
        ]
      }
    }
  },
  methods: {
    // 企业端公众号查询同步状态
    async queryCssSynList(refresh) {
      let params = {
        appAccountId: this.appAccountId
      }
      const response = await this.post(this.fylPath.queryCssSynList, params)
      const { data, code, message } = response
      if (code === 1) {
        this.loadingStatu = 2
        this.syncData = data
        if (refresh) {
          this.$Message.success('刷新成功')
        }
      } else {
        this.loadingStatu = 3
        this.$Message.error(message)
      }
    },
    // 公众号信息一键同步
    updateCssWxPublicAccountDataToDb() {
      let updatePublicAccountData = JSON.parse(JSON.stringify(this.checkSyncValue))
      let index = updatePublicAccountData.indexOf('MEDIA')
      if (index > -1) {
        updatePublicAccountData.splice(index, 1)
      }
      let obj = {
        updatePublicAccountData: updatePublicAccountData,
        eeId: this.loginCompanyData.employeeData.eeId,
        appAccountId: this.appAccountId
      }
      updateCssWxPublicAccountDataToDb(obj).then(data => {
        switch (data.code) {
          case 1:
            this.$Message.success('数据同步中')
            this.queryCssSynList()
            break
          default:
            break
        }
      })
    },
    changeAll(val) {
      if (val) {
        this.checkSyncValue = this.syncSelect.slice()
      } else {
        this.checkSyncValue = []
      }
    },
    changeHandle(item) {
      let index = this.checkSyncValue.indexOf(item.itemValue)
      if (index > -1) {
        this.checkSyncValue.splice(index, 1)
        // 如果点击的是媒体素材同步，对下面的二级进行处理
        if (item.itemValue === 'MEDIA') {
          this.constArr.forEach((ite) => {
            let idx = this.checkSyncValue.indexOf(ite)
            if (idx > -1) {
              this.checkSyncValue.splice(idx, 1)
            }
          })
        }
      } else {
        this.checkSyncValue.push(item.itemValue)
        // 如果点击的是媒体素材同步，对下面的二级进行处理
        if (item.itemValue === 'MEDIA') {
          this.constArr.forEach((ite) => {
            let idx = this.checkSyncValue.indexOf(ite)
            if (idx < 0) {
              this.checkSyncValue.push(ite)
            }
          })
        }
      }
    },
    reload() {},
    syncConfirm() {
      if (this.checkSyncValue.length > 0) {
        this.syncBtn = true
        this.updateCssWxPublicAccountDataToDb()
      } else {
        this.$Message.warning('请选择同步内容')
      }
    },
    syncCancel() {
      this.$emit('changeStatu', false)
    },
    refresh() {
      this.syncBtn = false
      this.queryCssSynList('refresh')
    },
    isContained(a, b) {
      if (!(a instanceof Array) || !(b instanceof Array)) return false
      if (a.length < b.length) return false
      var aStr = a.toString()
      for (var i = 0, len = b.length; i < len; i++) {
        if (aStr.indexOf(b[i]) == -1) return false
      }
      return true
    }
  }
}
</script>
<style lang="stylus">
.syncTencent
  .sync-tips
    color #606366
    line-height 24px
  .refresh
    display flex
    justify-content flex-end
    margin-top 15px
    cursor pointer
    color #606366
    .icon
      margin-right 5px
  .sync-table
    margin-top 20px
    .margin-span
      margin-left 3px
    .sync-header
      color #606366
      display flex
      height 45px
      align-items center
      background-color #f7f9fa
      >div
        padding-left: 20px
      .sync-content
        flex 1.2
        // margin-left 20px
        .margin-span
          font-weight bold
      .status
        flex 1
        font-weight bold
      .time
        flex 1.2
        font-weight bold
      .number
        flex 1
        font-weight bold
    .sync-wrapper
      .sync-item
        .one-leave, .two-leave
          display flex
          align-items center
          height 60px
          border-bottom solid 1px #edeff0
          .one-item, .two-item
            white-space: nowrap;
            flex 1
            &.active
              color #409eff
            &.unactive
              color #787c80
            &.unactive2
              color #ccc
          .one-item:first-child, .two-item:first-child, .last-item
            padding-left 20px
            flex: 1.2
          .differ
            flex-basis 20px
            .ivu-checkbox-wrapper
              padding-left 20px
.footer-btn
  width 120px
  margin-right 20px
.footer-btn:nth-last-of-type(1)
  margin-right 0
</style>


