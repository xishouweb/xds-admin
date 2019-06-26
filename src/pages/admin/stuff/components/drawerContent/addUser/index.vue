<template>
  <div id="addUser">
    <div class="top_step">
        <Steps :current="curId">
            <Step title="基本信息"></Step>
            <Step title="权限设置"></Step>
            <Step title="邀请加入"></Step>
        </Steps>
    </div>
    <div class="component">
      <RightSet v-show="curId === 1" :systems="systems" :isEdit="true" class="right_set" :style="{height: height + 'px'}" ref="rightSet"></RightSet>
      <BScroll v-show="curId !== 1" :data="dataSatau">
        <data-loading :dataSatau="dataSatau">
            <AddInput v-show="curId === 0" ref="addInput" :height='height'></AddInput>
            <WeCode v-show="curId === 2" ref="weCode" :datas="weCodeData" :curApart="curApart">
                <p><span class="icon suc_color">&#xe688;</span> 员工创建成功!</p>
                <p>将二维码截图或保存后发送给员工,员工可用微信扫码加入企业</p>
            </WeCode>
        </data-loading>
      </BScroll>

    </div>
    <div class="handles save_data">
      <i-button type="primary" @click="goNext" v-show="curId === 0" class="width_bg">保存并下一步</i-button>
      <i-button type="primary" @click="goNext" v-show="curId === 1" class="width_bg">完成并邀请</i-button>
      <i-button type="primary" @click="cancel" v-show="curId === 2" class="width_bg">完成</i-button>
      <i-button type="primary" @click="addMore" v-show="curId === 2" class="width_bg">继续添加</i-button>
      <i-button @click="preStep" v-show="curId === 1">上一步</i-button>
      <i-button @click="cancel" v-show="curId === 0 || (curId === 1)">取消</i-button>
    </div>
    <NewModal
      :header="modal.header"
      :maxZIndex="true"
      v-model="modal.show"
      width="464"
      confrim="立即升级"
      @ok="modal.ok"
    >
      <div>{{modal.message}}</div>
    </NewModal>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import AddInput from './addInput'
import WeCode from './weCode'
import RightSet from '@/components/GroupCheckBox'

export default {
  data() {
    return {
      canClick: true, // 控制提交按钮是否可以点击
      curId: 0,
      dataSatau: 2,
      systems: [],
      eeId: null,
      inviteCode: null,
      inputVals: null,
      weCodeData: {},
      height: 0,
      isChatRight: false,
      modal: {
        header: "员工数量不足",
        show: false,
        ok: () => {
            let corpId = this.getCookie('currentCorp').applyId
            let corpName = this.getCookie('currentCorp').corpName
            let obj = {
              corpId: corpId,
              corpName: corpName
            }
            this.setPayStatu(obj)
        }
      }
    }
  },

  computed: {
    ...mapState({
      curApart: state => state.stuff.currentTreeNode,
    }),
  },
  components: { AddInput, WeCode, RightSet },
  mounted() {
      let val = document.getElementById('addUser').getBoundingClientRect().height
      this.height = val - 97 > 0 ? val - 97 : 0
  },
  methods: {
    ...mapActions({
      setPayStatu: 'pay/setPayStatu',
      getTree: 'stuff/getTree'
    }),
    preStep() {
        this.curId--
    },
    addMore() {
        this.curId = 0
        this.$refs['addInput'].init()
    },
    ajaxData(key, index) {
        this.getRightsList({platformType: key}).then((res) => {
            let obj = {}
            let show = true
            if (res.code === 1) {
              let orderData = res.data.sort(this.sortBy('authRoleOrder', "max"))
              for (let item of orderData) {
                  obj[item.groupName] = obj[item.groupName] || {}
                  // item.roleName === item.groupName && (obj[item.groupName].authRoleOrder = item.authRoleOrder)
                  obj[item.groupName].name = item.groupName
                  obj[item.groupName].data = obj[item.groupName].data || []

                  obj[item.groupName].data.push({
                    cont: item.roleName,
                    id: item.roleId,
                    groupName: item.groupName,
                    isSelect: false,
                    ...item
                  })
                }
            }
            this.systems[index].obj = obj
            this.systems[index].show = show
            this.$set(this, 'systems', this.deepCopy(this.systems))
        })
    },
    getGroupData() {
        this.systems = [
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
        ]
        this.ajaxData('PC_WEB_ADMIN', 0)
        // 如果坐席权限没开，则聊天权限不能选择
        if (this.isChatRight) {
            this.ajaxData('PC_WEB_CHAT', 1)
            this.ajaxData('PC_DESKTOP_CHAT', 2)
        } else {
            this.systems = this.systems.slice(0, 1)
        }
    },
    goNext() {
      if (!this.canClick) { return }
      this.canClick = false
      setTimeout(() => {
        this.canClick = true
      }, 100)
      if (this.curId === 0) {
          this.$refs['addInput'].getParams((data) => {
            this.inputVals = data
            this.isChatRight = !!data.seatId
            this.curId = 1
            this.getGroupData()
          })
      } else if (this.curId === 1) {
          let obj = this.inputVals
          let ids = this.$refs['rightSet'].getSysId()
          if ((!ids || !ids.length)) {
              this.$Message.error('请至少选择一个权限')
              return false
          }
          let obj1 = {'addRoleIds': ids, deptId: this.curApart.id}
          let param = {...{}, ...obj, ...obj1}
          this.dataSatau = 1
          this.addUser(param).then((res) => {
              this.dataSatau = 2
              if (res.code === 1) {
                  this.curId = 2
                  this._BUS.$emit('getUsers', 'addUser')
                  let eeId = res.data.eeId
                  this.$Message.success('添加员工成功')
                  this.getTree()
                  this.formWecode({id: eeId}).then((response) => {
                      if (response.code === 1) {
                          this.weCodeData = response.data
                      } else {
                          this.modal.message = response.message
                          this.modal.show = true
                      }
                  })
              } else {
                  this.$Message.error(res.message)
                  return false
              }
          })
      }
    },
    cancel() {
      this.$emit('close')
    }
  }
}
</script>

<style lang="stylus">
@import '~@/assets/stylus/index'
#addUser
    height:100%
    relative()
    .top_step
        .ivu-steps-title
            mb(0)
            mr(4px)
        >div
            padt(30px)
            padl(50px)
            padb(20px)
    .component
        height:80%
        .right_set
            overflow-y: auto
</style>
