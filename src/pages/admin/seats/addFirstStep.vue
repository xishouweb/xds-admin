<template>
  <div class="add-first-step">
    <div class="steps-item">
      <div class="steps-item-left">坐席编号</div>
      <div class="steps-item-right">{{seatNum}}</div>
    </div>
    <div class="steps-item">
      <div class="steps-item-left">坐席备注</div>
      <div class="steps-item-right">
        <Input class="markSeats" v-model="formInfo.remark" clearable placeholder="请填写坐席备注，例如：售后客服"></Input>
      </div>
    </div>
    <div class="steps-item">
      <div class="steps-item-left">分配员工</div>
      <div class="steps-item-right" @click.stop="showAssignStaff" >
        <Input class="assignStaff" v-model="formInfo.stuff" :icon="showIcon" readonly placeholder="请选择分配员工"></Input>
      </div>
    </div>
    <div class="del-stuff" @click="delStuff" v-if="formInfo.stuff!=='' && isAdd">
      解除该员工
    </div>

    <Modal v-model="assignStaffModel" width="620" @on-cancel="cancelokSync">
      <p slot="header">
        <span>分配员工</span>
      </p>
      <div class="assignStaff-wrapper">
        <div>
          正在为 <span class="staff-num">坐席编号：<span>{{seatNum}}</span> </span> 分配员工
        </div>
        <div class="assignStaff-main">
          <div class="staff-tree">
            <scroll-bar>
              <SeatsTree v-if="assignStaffModel"  @getCurrentNode="getCurrentNode"></SeatsTree>
            </scroll-bar>
          </div>
          <div class="staff-item">
            <div class="staff-item-wrapper">
              <div class="search">
                <Input placeholder="请输入姓名搜索" v-model="searchName" icon="ios-search-strong"></Input>
              </div>
              <data-loading :data-satau="loading.staff" @reload="reload">
                <div class="staff-list">
                  <scroll-bar>
                    <div class="staff-list-wrapper">
                      <ul>
                        <li v-for="(item,index) in NewItems" :key="index" :class="{active:currentStuffIdx==index}" class="staff-list-item" @click="selectStuff(item, index)">{{item.nickname}}</li>
                      </ul>
                    </div>
                  </scroll-bar>
                </div>
              </data-loading>
            </div>
          </div>
        </div>
      </div>
      <div slot="footer">
        <div class="currentStaff">当前选择的员工&nbsp;&nbsp;&nbsp;<span class="currentStaff-name">{{currentStuffName}}</span></div>
        <Button type="primary" @click.stop="okSync">确定</Button>
        <Button type="ghost" @click.stop="cancelokSync">取消</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import SeatsTree from './seatsTree'
export default {
  name: 'addFirstStep',
  props: {
    isAdd: {
      type: Boolean,
      default: false
    },
    createSeat: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      formInfo: {
        remark: '',
        stuff: ''
      },
      seatNum: '',
      searchName: '',
      currentStuffIdx: -1,
      currentStuffName: '',
      assignStaffModel: false,
      stuffData: [],
      eeId: '',
      eeIdCopy: '',
      loading: {
        staff: 1
      },
      currentVal: ''
    }
  },
  mounted() {
    if (this.isAdd) {
      this.seatNum = this.createSeat.seatNo
    } else {
      this.seatNum = this.seatsInfo.seatNo
      this.formInfo.remark = this.seatsInfo.remark || ''
      this.eeId = this.seatsInfo.eeId || ''
      this.formInfo.stuff = this.seatsInfo.eeName || ''
    }
  },
  watch: {
    assignStaffModel(val) {
      console.log(val)
    },
    seatsInfo: {
      // xuyuan xiu gai
      handler(newVal, oldVal) {
        this.seatNum = this.seatsInfo.seatNo
        this.formInfo.remark = this.seatsInfo.remark || ''
        this.eeId = this.seatsInfo.eeId || ''
        this.formInfo.stuff = this.seatsInfo.eeName || ''
      },
      deep: true
    },
    'createSeat.seatNo'(val) {
      this.seatNum = this.createSeat.seatNo
    }
  },
  computed: {
    NewItems() {
      var NewItems = []
      this.stuffData.map(item => {
        if (item.nickname.search(this.searchName) !== -1) {
          NewItems.push(item)
        }
      })
      return NewItems
    },
    showIcon() {
      return this.formInfo.stuff !== '' ? 'arrow-swap' : 'plus'
    },
    ...mapGetters({
      firstStepData: 'seats/getFirstStepData',
      seatsInfo: 'seats/getSeatsInfo' // 异步获取的给回调
    })
  },
  methods: {
    reload() {
      this.getCurrentNode(this.currentVal)
    },
    iterateCurrNode(val) {
      if (val.currentNode) {
        return this.iterateCurrNode(val.currentNode)
      } else {
        return val
      }
    },
    getCurrentNode(val) {
      this.currentVal = val
      let node = this.iterateCurrNode(val)
      this.loading.staff = 1
      let param = {
        limit: 10000,
        deptId: node.id
      }
      this.getStuff(param)
        .then(res => {
          if (res.code === 1) {
            this.loading.staff = 2
            this.stuffData = res.data.records
          } else {
            this.loading.staff = 3
          }
        })
        .catch(() => {
          this.loading.staff = 3
        })
    },
    showAssignStaff() {
      this.assignStaffModel = true
    },
    isGoNext() {
      return {
        remark: this.formInfo.remark || '',
        eeId: this.eeId || null,
        seatId: this.createSeat.id
      }
    },
    delStuff() {
      this.formInfo.stuff = ''
      this.currentStuffIdx = -1
      this.currentStuffName = ''
      this.eeId = ''
    },
    okSync() {
      this.assignStaffModel = false
      this.formInfo.stuff = this.currentStuffName
      this.eeId = this.eeIdCopy
    },
    cancelokSync() {
      this.assignStaffModel = false
      this.currentStuffIdx = -1
      this.currentStuffName = ''
    },
    selectStuff(name, index) {
      this.currentStuffIdx = index
      this.currentStuffName = name.nickname
      this.eeIdCopy = name.eeId
    },
    ...mapActions({
      setFirstStepData: 'seats/setFirstStepData'
    })
  },
  components: {
    SeatsTree
  }
}
</script>
<style lang="stylus">
@import '~@/assets/stylus/mixin'
.add-first-step
  .del-stuff
    margin-left 76px
    display inline-block
    cursor pointer
    color #409eff
  .steps-item
    height 40px
    line-height 40px
    margin-bottom 30px
    clear()
    &:nth-of-type(3)
      margin-bottom 20px
    .steps-item-left
      float left
      margin-right 15px
    .steps-item-right
      float left
      .markSeats
        width 360px
      .assignStaff
        width 180px
.currentStaff
  float left
  margin-top 9px
  .currentStaff-name
    color #48a2ff
.assignStaff-wrapper
  .staff-num
    color #48a2ff
  .assignStaff-main
    clear()
    margin-top 30px
    .staff-tree
      float left
      width 49.2%
      height 428px
      padding-top 10px
      margin-right 1.6%
      border solid 1px #edeff0
      background-color rgb(237, 239, 240)
      .owly-parent-node
        background-color rgb(237, 239, 240)
      .owly-child-node-opened.display-children-node:before
        background-color rgb(237, 239, 240)
      .display-children-node:before
        background-color rgb(237, 239, 240)
      .owly-tree-root.owly-no-child .no-child-node, .display-children-node:after
        border-bottom 1px solid #cacbcc
    .staff-item
      width 49.2%
      float left
      height 428px
      border solid 1px #edeff0
      .staff-item-wrapper
        .search
          padding 10px
        .staff-list
          height 368px
          .staff-list-wrapper
            padding 6px 10px
            .staff-list-item
              height 40px
              line-height 40px
              padding-left 20px
              cursor pointer
              &.active
                background-color #409eff
                color #ffffff
              &:hover
                background-color #409eff
                color #ffffff
</style>


