<template>
  <div class="seats-limit">
    <div class="seats-limit-wrapper">
      <div class="limit-wrapper-title">
        <!-- click.prevent.native -->
        <Checkbox :disabled="noUseappAccount" :indeterminate="indeterminate.accountIndeterminate" :value="checkAll.accountCheckAll" @click.prevent.native="accountHandleCheckAll">分配公众号</Checkbox>
      </div>
      <div class="limit-wrapper-content">
        <CheckboxGroup v-model="checkAllGroup.accountCheckAllGroup" @on-change="accountCheckAllGroupChange">
          <Checkbox :label="item.appAccountId" :disabled="item.status!=1" v-for="(item, index) in accountList" :key="index">
            <div class="list-item">
              <div class="left">
                <img :src="item.headImg || defaultImg" alt="">
              </div>
              <div class="right" :class="{'unActive':item.status!=1}">
                <div class="text">{{item.principalName}}</div>
                <div class="statu">状态：
                  <span class="menu-float tips" v-show="item.status === 1">正常</span>
                  <span class="menu-float tips" v-show="item.status === 2">停用</span>
                  <span class="menu-float tips" v-show="item.status === 0">禁用</span>
                  <span class="menu-float tips" v-show="item.status === 3">未授权</span>
                </div>
              </div>
            </div>
          </Checkbox>
        </CheckboxGroup>
      </div>
      <div>
        <GroupCheckBox ref="groupLimit" :systems="copyCorpPackRoleList" :isEdit="true"></GroupCheckBox>
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions, mapGetters, mapState } from 'vuex'
import {ArrDistinct} from '@/utils/util'
import GroupCheckBox from '@/components/GroupCheckBox'
export default {
  props: {
    isAdd: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      defaultImg: `${process.env.SELF_BASE_URL}/logo.png`,
      appAccountIdArr: [],
      disabledAllAccount: [],
      disabledAccount: [],
      copyCorpPackRoleList: [],
      noUseappAccount: false,
      systems: [
        {
          name: '分配权限',
          obj: {}
        }
      ],
      indeterminate: {
        accountIndeterminate: true
      },
      checkAll: {
        accountCheckAll: false
      },
      checkAllGroup: {
        accountCheckAllGroup: []
      }
    }
  },
  components: {
    GroupCheckBox
  },
  computed: {
    ...mapState({
      accountList: state => state.publicAccount.publicAccountList,
    }),
    ...mapGetters({
      secondStepData: 'seats/getSecondStepData',
      seatsInfo: 'seats/getSeatsInfo',
      corpPackRoleList: 'seats/getCorpPackRoleList'
    })
  },
  mounted() {
    this.appidChange()
    this.init()
    this.showCheckBoxStatu()
  },
  watch: {
    corpPackRoleList: {
      handler(newVal, oldVal) {
        this.init()
      },
      deep: true
    }
  },
  methods: {
    init() {
      this.copyCorpPackRoleList = this.deepCopy(this.corpPackRoleList)
      if (this.seatsInfo.seatNo) {
        if (this.seatsInfo.authIds && this.seatsInfo.authIds.length > 0) {
          for (let i = 0; i < this.copyCorpPackRoleList.length; i++) {
            for (let k in this.copyCorpPackRoleList[i].obj) {
              let obj = this.copyCorpPackRoleList[i].obj[k]
              for (let j = 0; j < obj.data.length; j++) {
                let roleId = obj.data[j].id
                obj.data[j].isSelect = this.seatsInfo.authIds.includes(roleId)
              }
            }
          }
        }
        if (this.seatsInfo.seatPublicNumDetailDtos && this.seatsInfo.seatPublicNumDetailDtos.length > 0) {
          this.seatsInfo.seatPublicNumDetailDtos.forEach(item => {
            if (item.status !== 1) {
              this.disabledAccount.push(item)
            }
            if (this.appAccountIdArr.indexOf(item.appAccountId) >= 0) {
              this.checkAllGroup.accountCheckAllGroup.push(item.appAccountId)
            }
          })
        }
      }
    },
    appidChange() {
      this.noUseappAccount = true
      this.accountList.forEach((item) => {
        this.appAccountIdArr.push(item.appAccountId)
        if (item.status !== 1) {
          this.disabledAllAccount.push(item.appAccountId)
        }
        if (item.status === 1) {
          this.noUseappAccount = false
        }
      })
    },
    isGoNext() {
      let authIds = this.$refs.groupLimit.getSysId()
      if (this.checkAllGroup.accountCheckAllGroup.length > 0 && authIds.length > 0) {
        return {
          authIds: authIds,
          appAccountIds: this.checkAllGroup.accountCheckAllGroup
        }
      } else {
        this.$Message.error('至少选择一个公众号和一个坐席权限')
        return false
      }
    },
    accountHandleCheckAll() {
      console.log(this.indeterminate.accountIndeterminate, this.checkAll.accountCheckAll)
      if (this.indeterminate.accountIndeterminate) {
        this.checkAll.accountCheckAll = false
      } else {
        this.checkAll.accountCheckAll = !this.checkAll.accountCheckAll
      }
      console.log(this.checkAll.accountCheckAll)
      this.indeterminate.accountIndeterminate = false
      if (this.checkAll.accountCheckAll) {
        console.log(this.appAccountIdArr, this.disabledAllAccount)
        // let appAccountIdArr = ArrDistinct(this.appAccountIdArr, this.disabledAllAccount)
        // appAccountIdArr = appAccountIdArr.concat(this.disabledAccount)
        // console.log(appAccountIdArr)
        this.checkAllGroup.accountCheckAllGroup = this.appAccountIdArr
      } else {
        this.checkAllGroup.accountCheckAllGroup = this.disabledAllAccount
      }
    },
    accountCheckAllGroupChange(data) {
      if (data.length === this.appAccountIdArr.length) {
        this.indeterminate.accountIndeterminate = false
        this.checkAll.accountCheckAll = true
      } else if (data.length > 0) {
        console.log(data.length)
        this.indeterminate.accountIndeterminate = true
        this.checkAll.accountCheckAll = false
      } else {
        this.indeterminate.accountIndeterminate = false
        this.checkAll.accountCheckAll = false
      }
    },
    showCheckBoxStatu() {
      if (this.checkAllGroup.accountCheckAllGroup.length === this.appAccountIdArr.length) {
        this.indeterminate.accountIndeterminate = false
        this.checkAll.accountCheckAll = true
      } else if (this.checkAllGroup.accountCheckAllGroup.length === 0) {
        this.indeterminate.accountIndeterminate = false
        this.checkAll.accountCheckAll = false
      } else {
        this.indeterminate.accountIndeterminate = true
        this.checkAll.accountCheckAll = false
      }
    },
    ...mapActions({
      setSecondStepData: 'seats/setSecondStepData'
    })
  }
}
</script>
<style lang="stylus">
@import '~@/assets/stylus/index'
@import '~@/assets/stylus/mixin'
.seats-limit
  .seats-limit-wrapper
    .limit-wrapper-title
      height 40px
      line-height 40px
      padding-left 20px
      background-color #e6edf5
    .menu-wrapper
      padding-right 20px
      padding-left 20px
      .menu-wrapper-list
        margin-top 20px
      .ivu-checkbox-group-item
        width 23%
        margin-top 20px
        // margin-right 65px
        &:nth-of-type(4n)
          margin-right 10px
    .limit-wrapper-title2
      margin-top 10px
    .limit-wrapper-content
      margin-top 40px
      .ivu-checkbox-group-item
        width 49%
        margin-right 0
        padding-left 20px
        margin-bottom 30px
      .ivu-checkbox
        vertical-align top
      .list-item
        display inline-block
        .left
          float left
          img
            width 40px
            height 40px
            margin-right 10px
        .right
          width 121px
          float left
          &.unActive
            color #979899
          .text
            no-wrap()
          .statu
            no-wrap()
            margin-top 12px
  .ivu-menu-submenu-title
    padding-top 22px
    padding-bottom 22px
    padding-right 0
    borb()
  .ivu-checkbox
    margin-right 7px
  .ivu-menu-item
    display inline-block !important
    .ivu-checkbox-wrapper
      margin-right 50px
      margin-bottom 20px
      &:nth-of-type(4n)
        margin-right 5px
  .ivu-menu-light.ivu-menu-vertical .ivu-menu-item-active:not(.ivu-menu-submenu)
    bgColor(inherit)
    color(inherit)
    border-right none
    &:after
      width 0
  .ivu-menu-vertical .ivu-menu-item
    cursor default
  .ivu-menu-vertical.ivu-menu-light:after
    width 0
  .ivu-menu-submenu-title-icon
    color #409eff
  .ivu-menu-vertical .ivu-menu-item:hover, .ivu-menu-vertical .ivu-menu-submenu-title:hover
    background-color #fff
  .ivu-menu-submenu-title > i, .ivu-menu-submenu-title span > i
    margin-right 0
  .limit-check-second
    display inline-block
</style>


