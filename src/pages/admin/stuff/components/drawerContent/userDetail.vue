<template>
  <div id="drawerDetail">
    <div class="switch">
      <p :class="{'active': (activeId === 0)}" @click="setActive(0)">基本信息</p>
      <p :class="{'active': (activeId === 1)}" @click="setActive(1)" >权限设置</p>
    </div>

    <data-loading :dataSatau="dataSatau">
      <BaseInfo v-show="activeId === 0" ref="baseInfo" :height='height' :isEdit="isEdit" @setSeat="setSeat"></BaseInfo>
      <RightSet v-if="activeId === 1" class="right_set" ref="rightSet" :style="{height: height + 'px'}" :isEdit="isEdit" :systems="roleList"></RightSet>
    </data-loading>
    <ul class="handles" v-if='!isEdit'>
      <li v-for="(item, key ,index) in actions" :key="index" @click="handle(key, item)">
        {{item}}
      </li>
    </ul>
    <div class="handles save_data" v-if='isEdit'>
      <i-button type="primary" @click="saveData">保存</i-button>
      <i-button @click="cancel">取消</i-button>
    </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import BaseInfo from './baseInfo'
import RightSet from '@/components/GroupCheckBox'
import Const from '../../const'
export default {
  data() {
    return {
      activeId: 0,
      actionItems: {},
      isEdit: false,
      details: {},
      systems: [
        {
          name: '企业管理系统',
          obj: {}
        },
        {
          name: '聊天管理系统',
          obj: {}
        },
        {
          name: '客户端系统',
          obj: {}
        }
      ],
      userRights: [],
      dataSatau: 1,
      actions: {},
      height: 0,
      seatStatus: false,
    }
  },
  computed: {
    ...mapGetters({
      curUser: 'stuff/getCurUser'
    }),
    roleList() {
      if (this.seatStatus) {
        return this.systems
      } else {
        return this.systems.slice(0, 1)
      }
    }
  },
  watch: {
    curUser() {
      this.seatStatus = this.curUser.kfId
    }
  },
  props: ['userId', 'isModify'],
  created() {
    this.init()
    this.isEdit = this.isModify
  },
  mounted() {
    let val = document.getElementById('drawerDetail').getBoundingClientRect().height
    this.height = val - 70 > 0 ? val - 70 : 0
  },
  methods: {
    init() {
      // 增加返回按钮
      let obj = this.deepCopy(Const.actionItems)
      delete obj.show
      obj.goback = '返回'
      this.actionItems = obj
      this.getUserDetail()
      this.getUserRights()
    },
    showRules(param) {
      let obj = {}
      let keysArr = []
      if (param.status === 3) {
        keysArr = ['modify', 'stop', 'delete']
      }
      if (param.status === 1) {
        keysArr = ['modify', 'stop', 'delete', 'unbind', 'delete']
      }
      if (param.status === 2) {
        keysArr = ['modify', 'start', 'delete']
      }
      if (param.status === 5) {
        keysArr = ['modify', 'stop', 'delete']
      }
      if (param.topval > -1) {
        keysArr.push('cancelTop')
      } else {
        keysArr.push('setTop')
      }
      if (param.joinStatus === 1) {
        keysArr.push('unbind')
      }
      for (let key of Object.keys(this.actionItems)) {
        if (keysArr.includes(key)) {
          obj[key] = this.actionItems[key]
        }
      }
      obj.goback = "返回"
      return obj
    },
    getUserDetail() {
      let id = this.userId
      id && this.userDetail({id: id}).then((res) => {
        this.dataSatau = 2
        if (res.code === 1) {
          this.$store.commit('stuff/SET_CUR_USER', this.deepCopy(res.data))
          this.actions = this.showRules(res.data)
        } else {
          this.$Message.error('请求员工详情错误')
        }
      })
    },
    getUserRights() {
      let id = this.userId
      this.userRightsList({id: id}).then((res) => {
        this.dataSatau = 2
        if (res.code === 1) {
          this.userRights = res.data
          this.getGroupData()
        }
      })
    },
    getGroupData() {
      this.ajaxData('PC_WEB_ADMIN', 0)
      this.ajaxData('PC_WEB_CHAT', 1)
      this.ajaxData('PC_DESKTOP_CHAT', 2)
    },
    ajaxData(key, index) {
        this.getRightsList({platformType: key}).then((res) => {
          this.dataSatau = 2
          let obj = {}
          let show = false
          if (res.code === 1) {
              let orderData = res.data.sort(this.sortBy('authRoleOrder', "max"))
              for (let item of orderData) {
                  obj[item.groupName] = obj[item.groupName] || {}
                  // item.roleName === item.groupName && (obj[item.groupName].authRoleOrder = item.authRoleOrder)
                  obj[item.groupName].name = item.groupName
                  obj[item.groupName].data = obj[item.groupName].data || []

                  let isSelect = this.userRights.includes(item.roleId)
                  isSelect && (show = true)
                  obj[item.groupName].data.push({
                      cont: item.roleName,
                      id: item.roleId,
                      groupName: item.groupName,
                      isSelect,
                      ...item
                  })
              }
          }
          this.systems[index].obj = obj
          this.systems[index].show = show
          this.$set(this, 'systems', this.deepCopy(this.systems))
        })
    },
    setActive(idx) {
      this.activeId = idx
    },
    setSeat(seatStatus) {
      this.seatStatus = seatStatus
    },
    saveData() {
      let baseInfo = this.$refs.baseInfo
      let rightSet = this.$refs.rightSet
      if (this.activeId === 0) {
        if (this.isEdit) {
          baseInfo.submit(() => {
            this.handle('goback')
            this._BUS.$emit('getUsers')
            this._BUS.$emit('getTreeData')
          })
        }
      } else {
        let id = this.userId
        let ids = rightSet.getSysId()
        if (!ids || !ids.length) {
          this.$Message.error('请至少选择一个权限')
          return false
        }
        this.modifyUserRole({eeId: id, addRoleIds: ids}).then((res) => {
            if (res.code === 1) {
              this.handle('goback')
              this._BUS.$emit('getUsers')
            }
          })
      }
    },
    handle(key) {
      if (key === 'modify') return (this.isEdit = true)
      this._BUS.$emit('handle', key, this.userId)
    },
    cancel() {
      let idx = this.activeId
      this.init()
      this.activeId = idx
      this.isEdit = false
    }
  },
  components: { BaseInfo, RightSet }
}
</script>

<style lang="stylus">
@import '~@/assets/stylus/index'
#drawerDetail
  height 100%
  width 100%
  relative()
  .right_set
    overflow-y:auto
  .switch
    border-bottom 1px solid #efefef
    width:100%
    height:50px
    // setStart()
    p
      fl()
      // fn(18px)
      line-height 49px
      width 100px
      cursor()
      center()
      &.active
        color(text_color)
        border-bottom 1px solid text_color
        // mb(-1px)
</style>
