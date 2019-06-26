<template>
  <div >
    <drawer titleTips="坐席详细" :isScroll="false" v-model="showSeatsInfo" :isCloseHeghtLight="heghtLightStatu">
      <div class="seats-info" slot="content">
        <div class="tab-wrapper">
          <Tabs v-model="TabsVal" @on-click="tabCut" :animated="false">
            <TabPane label="坐席信息" name="1">
              <BScroll :offsetBottom="59" :data="seatsInfo.seatNo">
                <div class="info-scroll">
                  <div class="info-wrapper">
                    <div class="info-wrapper-item">
                      <div class="info-key">坐席编号</div>
                      <div class="info-data">{{seatsInfo.seatNo || "--"}}</div>
                    </div>
                    <div class="info-wrapper-item">
                      <div class="info-key">坐席备注</div>
                      <div class="info-data">{{seatsInfo.remark || "--"}}</div>
                    </div>
                    <div class="info-wrapper-item">
                      <div class="info-key">所属企业</div>
                      <div class="info-data">{{seatsInfo.corpName || "--"}}</div>
                    </div>
                    <div class="info-wrapper-item">
                      <div class="info-key">坐席状态</div>
                      <div class="info-data">{{status || "--"}}</div>
                    </div>
                  </div>
                  <div class="info-wrapper">
                    <div class="info-wrapper-item">
                      <div class="info-key">分配员工</div>
                      <div class="info-data">{{seatsInfo.eeName || "--"}}</div>
                    </div>
                    <div class="info-wrapper-item">
                      <div class="info-key">分配时间</div>
                      <div class="info-data">{{seatsInfo.distributionTime || "--"}}</div>
                    </div>
                    <div class="info-wrapper-item">
                      <div class="info-key">在线状态</div>
                      <div class="info-data">{{seatsInfo.onlineStatus | onlineStatus}}</div>
                    </div>
                    <!-- <div class="info-wrapper-item">
                      <div class="info-key">最近在线</div>
                      <div class="info-data">{{seatsInfo.lastOnlineTime || "--"}}</div>
                    </div> -->
                  </div>
                  <div class="info-wrapper">
                    <div class="info-wrapper-item">
                      <div class="info-key">员工手机</div>
                      <div class="info-data">{{seatsInfo.mobile || "--"}}</div>
                    </div>
                    <div class="info-wrapper-item">
                      <div class="info-key">员工部门</div>
                      <div class="info-data">{{seatsInfo.deptName || "--"}}</div>
                    </div>
                    <div class="info-wrapper-item">
                      <div class="info-key">员工职位</div>
                      <div class="info-data">{{seatsInfo.postName || "--"}}</div>
                    </div>
                  </div>
                </div>
              </BScroll>
            </TabPane>
            <TabPane label="坐席权限" name="2">
              <div class="noseatDate" v-show="seatsInfo.authIds && !seatsInfo.authIds.length">
                <div class="item img"><img src="@/assets/images/admin/icon.png" alt=""></div>
                <div class="item tip">您还没有坐席权限</div>
                <div class="item btn"><Button type="primary" @click="setAuthSeat">设置坐席权限</Button></div>
              </div>
              <div class="info-scroll" v-show="seatsInfo.authIds && seatsInfo.authIds.length">
                <div class="limit-name" v-show="seatsInfo.seatPublicNumDetailDtos">
                  <div class="limit-title">分配公众号</div>
                  <div class="limit-account-list">
                    <template v-for="(item, index) in sortDetailDtos">
                      <div v-if="item.status !== 4" class="list-item" :key="index" :class="{'un-active': item.status!==1}">
                        <div class="left">
                          <img :src="item.headImg || defaultImg" alt="">
                        </div>
                        <div class="right">
                          <div class="text">{{item.nickName}}</div>
                          <div class="statu">状态：
                            <span v-show="item.status === 1">正常</span>
                            <span v-show="item.status === 2">停用</span>
                            <span v-show="item.status === 0">禁用</span>
                            <span v-show="item.status === 3">未授权</span>
                          </div>
                        </div>
                      </div>
                    </template>
                  </div>
                </div>
                <div class="list-name">
                  <GroupCheckBox :systems="roleList"></GroupCheckBox>
                </div>
              </div>
            </TabPane>
            <TabPane label="个性化坐席" name="3">
              <div class="noseatDate" v-show="!seatsInfo.seatPublicNumDetailDtos">
                <div class="item img"><img src="@/assets/images/admin/icon.png" alt=""></div>
                <div class="item tip">您还没个性化坐席</div>
                <div class="item small-tip">如需个性化坐席请先设置坐席权限</div>
                <div class="item btn"><Button type="primary" @click="setAuthSeat">设置坐席权限</Button></div>
              </div>
              <BScroll :offsetBottom="59" :data="seatsInfo.seatPublicNumDetailDtos">
                <div class="info-scroll individuation" v-show="seatsInfo.seatPublicNumDetailDtos">
                  <template  v-for="(item, index) in seatsInfo.seatPublicNumDetailDtos" >
                    <FoldPanel :isFold="true" v-if="item.status !== 4" :key="index">
                      <div slot="title">
                        <div class="menu-tit" :class="{'un-active': item.status!=1}">
                          <div class="menu-float img default-seat-img"><img :src="item.headImg | urlFilter" alt=""></div>
                          <div class="menu-float text">{{item.nickName}}</div>
                          <div class="menu-float tips" v-show="item.status === 2">停用</div>
                          <div class="menu-float tips" v-show="item.status === 0">禁用</div>
                          <div class="menu-float tips" v-show="item.status === 3">未授权</div>
                        </div>
                      </div>
                      <div slot="container">
                        <div class="menu-con" :class="{'un-active': item.status!=1}">
                          <div class="menu-con-item">
                            <span class="item-name">坐席昵称</span>
                            <span class="item-info">{{item.seatNickName || item.nickName}}</span>
                          </div>
                          <div class="menu-con-item">
                            <span class="item-name">坐席头像</span>
                            <span class="item-info default-seat-img">
                              <img :src="item.conditionalHeadImg || item.headImg | urlFilter" alt="">
                              <!-- <UploadImg :isUpload="false" v-if="item.conditionalHeadImg || item.headImg" :imgSrc="(item.conditionalHeadImg || item.headImg) | urlFilter"></UploadImg> -->
                            </span>
                          </div>
                        </div>
                      </div>
                    </FoldPanel>
                  </template>
                </div>
              </BScroll>
            </TabPane>
          </Tabs>
        </div>
      </div>
      <div slot="footer" class="footer-wrapper">
        <Button class="footer-btn" @click="editInfo" type="ghost">修改</Button>
        <Button class="footer-btn" v-show="seatsInfo.status == 1 || seatsInfo.status == 2" @click="selectAction('deallocate', seatsInfo.id)" type="ghost">解除</Button>
        <Button class="footer-btn" v-show="seatsInfo.status == 1" @click="selectAction('stopSeats', seatsInfo.id)" type="ghost">停用</Button>
        <Button class="footer-btn" v-show="seatsInfo.status == 2" @click="selectAction('start', seatsInfo.id)" type="ghost">启用</Button>
        <Button class="footer-btn" @click="back()" type="ghost">返回</Button>
      </div>
    </drawer>
    <common-modal ref="deallocateInfo" header="解除分配" content="您正在解除该坐席的员工分配，解除后该坐席无法为企业提供服务，需重新分配客服后才能使用该坐席，确定解除分配吗？" @ok="deallocate"></common-modal>
    <common-modal ref="stopInfo" header="停用" content="您正在停用该坐席，停用后该坐席无法为企业提供服务，需重新启用坐席后才能使用该坐席功能，确定停用吗？" @ok="stopSeats"></common-modal>
  </div>
</template>
<script>
import {mapGetters} from 'vuex'
import GroupCheckBox from '@/components/GroupCheckBox'
import UploadImg from '@/components/UploadImg'
export default {
  props: {
    editTabsVal: {
      type: String,
      default: '1'
    }
  },
  data() {
    return {
      tabDex: 1,
      heghtLightStatu: true,
      TabsVal: '1',
      showSeatsInfo: false,
      copyCorpPackRoleList: [],
      defaultImg: `${process.env.SELF_BASE_URL}/logo.png`
    }
  },
  filters: {
    onlineStatus(val) {
      return val === 'ON_LINE' ? '在线' : val === 'OFF_LINE' ? "离线" : '--'
    }
  },
  computed: {
    status() {
      let statu = this.seatsInfo.status
      return statu === 1 ? '正常' : statu === 2 ? '停用' : statu === 3 ? '禁用' : '未分配'
    },
    ...mapGetters({
      seatsInfo: 'seats/getSeatsInfo',
      corpPackRoleList: 'seats/getCorpPackRoleList'
    }),
    sortDetailDtos() {
      if (this.seatsInfo.seatNo) {
        let arr = this.deepCopy(this.seatsInfo.seatPublicNumDetailDtos)
        arr = (arr || []).map(item => {
          item.st = item.status === 1 ? -1 : item.status
          return item
        }).sort((a,b) => a.st - b.st)
        console.log(arr)
        return arr
      }
    },
    roleList() {
      console.log(this.copyCorpPackRoleList)
      return this.copyCorpPackRoleList
    }
  },
  watch: {
    editTabsVal(val) {
      this.TabsVal = val
    },
    showSeatsInfo(val) {
      if (!val) {
        this.TabsVal = '1'
      } else {
        this.init()
      }
    },
    TabsVal: {
      handler() {
        this.$root.Bus.$emit('manualRefresh')
      },
      immediate: true
    },
    seatsInfo(val) {
      console.log(val)
      // this.arrContant()
    }
  },
  methods: {
    init() {
      this.copyCorpPackRoleList = this.deepCopy(this.corpPackRoleList)
      if (this.seatsInfo.authIds && this.seatsInfo.authIds.length > 0) {
        for (let i = 0; i < this.copyCorpPackRoleList.length; i++) {
          for (let k in this.copyCorpPackRoleList[i].obj) {
            let obj = this.copyCorpPackRoleList[i].obj[k]
            for (let j = 0; j < obj.data.length; j++) {
              let roleId = obj.data[j].id
              if (this.seatsInfo.authIds.includes(roleId)) {
                obj.data[j].isSelect = true
                this.copyCorpPackRoleList[i].show = true
              }
            }
          }
        }
      }
      console.log(this.copyCorpPackRoleList)
    },
    setAuthSeat() {
      this.hideSeatsInfo()
      this.$emit('editInfoSeats', '2')
    },
    showDrawer() {
      this.showSeatsInfo = true
    },
    hideSeatsInfo() {
      this.showSeatsInfo = false
    },
    editInfo() {
      this.$emit('editInfoSeats', this.TabsVal)
      this.heghtLightStatu = false
      this.hideSeatsInfo()
    },
    selectAction(name, id) {
      let operationStatus
      let ids = [id]
      if (name === 'deallocate') {
        operationStatus = 'REMOVE'
      } else if (name === 'stopSeats') {
        operationStatus = 'BLOCK_UP'
      } else {
        operationStatus = 'ACTIVE'
      }
      this.$emit('openModal', name, ids, operationStatus)
    },
    back() {
      this.hideSeatsInfo()
      this.heghtLightStatu = true
    },
    deallocate() {},
    stopSeats() {},
    tabCut(v) {
      this.tabDex = v
    }
  },
  components: {
    GroupCheckBox,
    UploadImg
  }
}
</script>
<style lang="stylus">
@import '~@/assets/stylus/index'
@import '~@/assets/stylus/mixin'
.seats-info
  .tab-wrapper
    padding-top 20px
    .noseatDate
      text-align center
    .info-scroll
      padding-top 1px
      .info-wrapper
        margin-top 50px
        &:nth-of-type(1)
          margin-top 34px
        .info-wrapper-item
          padding-left 20px
          margin-bottom 30px
          .info-key
            display inline-block
            margin-right 26px
          .info-data
            width: 470px
            line-height 18px
            vertical-align middle
            display inline-block
      .limit-name
        margin-top 10px
        .limit-title
          height 40px
          line-height 40px
          background-color: #e6edf5
          padding-left 20px
        .limit-account-list
          margin-top 18px
          padding-left 20px
          padding-right 20px
          clear()
          .list-item
            margin-bottom 30px
            width 50%
            float left
            .left
              float left
              img
                width 40px
                height 40px
                margin-right 10px
            .right
              width 121px
              float left
              .text
                no-wrap()
              .statu
                no-wrap()
                margin-top 12px
          .un-active
            color #979899
        .limit-account-list-item
          margin-top 20px
          .container-item
            display inline-block
            padding 10px 0
            margin-top 10px
            margin-right 100px
            &:nth-of-type(4n)
              margin-right 10px
  .footer-wrapper
      .footer-btn
        width 65px !important
  .ivu-menu-submenu-title
    padding-top 22px
    padding-bottom 22px
    padding-right 0
    borb()
  .ivu-menu-item
    display inline-block !important
  .ivu-menu-item-active:not(.ivu-menu-submenu)
    bgColor(inherit)
    color(inherit)
    &:after
      width 0
  .ivu-menu-vertical.ivu-menu-light:after
    width 0
  .ivu-menu-submenu-title-icon
    color #409eff
  .ivu-menu-vertical .ivu-menu-item:hover, .ivu-menu-vertical .ivu-menu-submenu-title:hover
    background-color #fff
  .ivu-menu-vertical .ivu-menu-item
    cursor default
  .ivu-menu-light.ivu-menu-vertical .ivu-menu-item-active:not(.ivu-menu-submenu)
    bgColor(inherit)
    color(inherit)
    border-right none
    &:after
      width 0
  .ivu-menu-submenu-title > i, .ivu-menu-submenu-title span > i
    margin-right 0
  .individuation
    padding-right 20px
    padding-left 20px
    .fold-panel .fold-title
      border-top solid 1px #e3e4e6
      border-bottom none
    .ivu-menu-submenu-title
      border-top solid 1px #e3e4e6
      border-bottom none
    .menu-tit
      display inline-block
      clear()
      .menu-float
        float left
        height 20px
        line-height 20px
        margin-right 10px
      .img
        width 20px
        height 20px
        img
          width 20px
          height 20px
      .tips
        background-color #cacbcc
        padding 0 10px
        color #ffffff
        font-size 12px
        border-radius 3px
    .menu-con
      .menu-con-item
        margin-top 40px
        margin-bottom 40px
        clear ()
        .item-name
          float left
          margin-right 25px
        .item-info
          float left
          &.default-seat-img
            width 60px
            height 60px
          img
            width 60px
            height 60px
    .un-active
      color #979899
</style>


