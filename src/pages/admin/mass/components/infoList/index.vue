<template>
  <!-- 消息列表 -->
  <div class="infoList-page">
    <BScroll :data="massList">
      <p class="title_public">{{pageTit[pageDex]}}</p>
      <!-- 页面简介 -->
      <page-intro
        v-if="massNum"
        :pageDex="pageDex"
        :publicType="publicType"
        :massNum="massNum"
      ></page-intro>

      <!-- 操作栏 -->
      <div class="flexB">
        <Button type="primary" class="cetate-btn" @click="creatTap()">新建群发消息</Button>
        <div class="flexC">
          <SearchBox
            v-model="searchWord"
            :search="search"
            holder="输入群发名称或创建人搜索"
          ></SearchBox>
          <i class="icon redraw" @click="getMassList">&#xe62b;</i>
        </div>
      </div>

      <!-- 群发列表及分页器 -->
      <div class="info-list clear">
        <!-- 群发列表 -->
        <div class="info-table">
          <BScroll ref="bscroll" :offsetBottom="80" :maxHeight="400" :data="massList">
            <Table
              v-if="Const"
              highlight-row
              ref="currentRowTable"
              :columns="Const"
              :data="massList"
              :loading="listLoading"
              :no-data-text="noData[pageDex]"
              class="samll-table"
              @click.native.stop
            ></Table>
          </BScroll>
        </div>
        <!-- 分页器 -->
        <div class="info-page">
          <Page
            show-total
            :show-sizer="total > 10"
            :show-elevator="total > 10"
            :total="total"
            :class="{hidePage: total <= 10}"
            @on-change="offsetChange"
            @on-page-size-change="numChange"
          ></Page>
        </div>
        <div style="clear:both;"></div>
      </div>

    </BScroll>

    <!-- 显示详情抽屉 -->
    <Drawer v-model="drawer.show" :titleTips="drawer.tit" :width="drawer.width" @close="drawerClose">
      <div slot="content" class="drawer-cont" v-if="massDetail">
        <mass-detail
          ref="drawerCont"
          :myFansGroup="myFansGroup"
          :massDetail="massDetail"
          :contType="contType"
          :massObj="massObj"
          :time="time"
          :myService="myService"
          :myTags="myTags"
        ></mass-detail>
      </div>
      <!-- 底部按钮 -->
      <div slot="footer" class="drawer-foot" v-if="massDetail">
        <template v-for="(v,i) in handBtn('detail')">
          <Button v-if="i > 0" :key="i" :type="i === 1 ? 'primary' : null" @click="hand(v.key)">
            {{v.text}}
          </Button>
        </template>
        <Button @click="hand('close')">取消</Button>
      </div>
    </Drawer>

    <!-- 对话框 -->
    <new-modal
      v-if="mod.text"
      v-model="mod.show"
      :header="mod.text[0]"
      :content="mod.text[1]"
      @ok="ok"
      @close="close"
      @cancel="close"
    ></new-modal>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import mixin from "./infoListMixin.js"
import { mapGetters } from 'vuex'
import {
  queryKfGroupList, // 获取所属粉丝分组列表
} from '@/api/fans.js'
export default {
  mixins: [mixin],
  data() {
    return {
      pageDex: null, // 页面索引
      pageTit: ['标准群发','高级群发','客服消息群发','模板消息群发'], // 页面标题
      // 群发类型   标准群发  高级群发  客服消息群发  模板消息群发
      massType: ['STANDARD_GROUP','SENIOR_GROUP','CUSTOMER_SERVICE_GROUP','TEMPLATE_GROUP'],
      massNum: null, // 群发次数信息0：今日次数，1：剩余发送数量
      searchWord: "", // 搜索关键词
      // 列表相关数据
      isShow: false, // 查看更多
      more: true, // 控制查看更多按钮现实变量
      handDex: null, // 当前操作数据索引
      time: null,
      massList: [], // 列表数据
      massDetail: null, // 群发消息详情
      total: null, // 群发消息总数
      offset: 0, // 页码
      num: 10, // 单页显示群发消息数量
      drawer: { // 抽屉相关数据
        show: false,
        width: '530px',
        tit: '群发消息详情',
      },
      mod: { // 对话框相关数据
        show: true,
        text: null, // 标题与对话信息
        type: null, // 操作类型
      },
      massObjHeight: 0, // 群发对象标签高度
      massObj: null, // 群发对象数据
      myFansGroup: [], // 选中分组
      myService: [], // 选中客服
      myTags: [], // 选中标签
      listLoading: true, // 群发列表loading动画
    }
  },
  props: ['appAccountId', 'publicType'],
  components: {
    pageIntro: () => import('./pageIntro.vue'),
    massDetail: () => import('./massDetail.vue')
  },
  mounted() {
    this.on(document.body, 'click', this.closePoptip)
    this.pageDex = this.$route.meta.dex
    // this.getMassList()
    this.getMassNum()
  },
  computed: {
    ...mapGetters({
      curPublic: 'publicAccount/curPublic'
    }),
    nowMass() { // 返回当前操作群发消息
      return this.massList[this.handDex] || []
    },
  },
  watch: {
    appAccountId() {
      this.getMassList()
      this.getMassNum()
    }
  },
  methods: {
    getFansTag(ids) { // 获取标签数据
      if (!this.appAccountId) { return }
      this.post(this.Path.getWxGroupAndTagList, {
        appAccountId: this.appAccountId
      }).then(res => {
        if (res.code !== 1) { return }
        // 筛选出选中标签
        if (!ids || !ids.length) { return }
        let groups = res.data.fansGroupAndTagDtos || []
        if (!groups || !groups.length) { return }
        this.myTags.length = 0
        groups.forEach(k => {
          let tags = k.fansWxTagDtos
          if (!tags || !tags.length) { return }
          tags.forEach(v => {
            if (ids.indexOf(v.tagId) >= 0) {
              this.myTags.push(v.tagName)
            }
          })
        })
      })
    },
    getFansGroup(groupIds, tagIds) { // 获取选中粉丝分组名称,筛选选中标签
      if (groupIds && groupIds.length) {
        queryKfGroupList()
        .then(res => {
          if (res !== 1) return
          if (!res.groupInfoList || !res.groupInfoList.length) return
          res.groupInfoList.forEach(v => {
            if (groupIds.indexOf(v.fsGroupId) >= 0) {
              this.myFansGroup.push(v.fsGroupName)
            }
          })
        })
      }
    },
    getService(ids) { // 获取坐席列表（客服列表）
      if (this.appAccountId && ids && ids.length) {
        this.$get(this.Path.getSeatList, {
          limit: 100,
          appAccountId: this.appAccountId // 公众号id
        }).then(dat => {
          if (dat.code === 1) {
            let list = dat.data.records
            if (!list.length) { return }
            this.myService.length = 0
            list.forEach(v => {
              if (ids.indexOf(v.id) >= 0) {
                this.myService.push(v.eeName)
              }
            })
          }
        })
      }
    },
    getMassList() { // 获取群发列表
      if (this.appAccountId && this.curPublic.status === 1) {
        this.listLoading = true
        this.post(this.Path.getMassList, {
          appAccountId: this.appAccountId,
          offset: this.offset * this.num,
          limit: this.num,
          condition: this.searchWord || null, // 搜索条件
          groupType: this.massType[this.pageDex] // 群发类型
        }).then(res => {
          this.listLoading = false
          if (res.code === 1) {
            this.massList = res.data.records
            this.total = res.data.totalCount
          } else {
            this.$Message.error(res.message)
          }
        })
      }
    },
    getMassInfo(id) { // 获取群发消息详情
      this.post(this.Path.getMassInfo, {
        id: id,
        appAccountId: this.appAccountId
      }).then(res => {
        if (res.code === 1) {
          this.massDetail = res.data
          this.massObj = res.data.objectContent
          this.getFansGroup(this.massObj.fsGroupId)
          this.getFansTag(this.massObj.tagIdList)
          this.getService(this.massObj.kfSeatId)
          let start = this.massDetail.objectContent.convStartTime
          start = start ? start.replace(' ', 'T') : start
          let end = this.massDetail.objectContent.convEndTime
          end = end ? end.replace(' ', 'T') : end
          if (!start && !end) {
            this.time = '不限'
            return
          }
          let difDay = dayjs(end).diff(dayjs(start), 'day')
          let difNow = dayjs(dayjs()).diff(dayjs(start), 'day')
          switch (difNow) {
            case 0:
              this.time = '今天'
              break
            case 1:
              this.time = '昨天'
              break
            case 2:
              this.time = difDay === 2 ? '近48小时' : '7'
              break
            case 7:
              this.time = difDay === 7 ? '近7天' : '7'
              break
            case 15:
              this.time = difDay === 15 ? '近15天' : '7'
              break
            case 30:
              this.time = difDay === 30 ? '近30天' : '7'
              break
            default:
              this.time = '7'
          }
          let startDate = this.massDetail.objectContent.convStartTime
          startDate = startDate ? startDate.slice(0, 10) : startDate
          let endDate = this.massDetail.objectContent.convEndTime
          endDate = startDate ? endDate.slice(0, 10) : endDate
          this.time = this.time === '7' ? [startDate, endDate] : this.time
        } else {
          this.$Message.error(res.message)
        }
      })
    },
    delMass() { // 删除群发消息
      this.post(this.Path.delMass, {
        appAccountId: this.appAccountId,
        id: this.nowMass.id
      }).then(res => {
        if (res.code === 1) {
          this.drawer.show = false
          this.$Message.success('删除成功')
          this.getMassList()
        } else {
          this.$Message.error(res.message)
        }
      })
    },
    cancelSend() { // 取消群发
      this.post(this.Path.cancesSend, {
        appAccountId: this.appAccountId,
        id: this.nowMass.id
      }).then(res => {
        if (res.code === 1) {
          this.getMassList()
          this.$Message.success('取消群发成功')
        } else {
          this.$Message.error(res.message)
        }
      })
    },
    getMassNum() { // 获取剩余群发次数
      if (this.appAccountId && this.curPublic.status === 1) {
        this.post(this.Path.getMassNum, {
          appAccountId: this.appAccountId,
          groupType: this.massType[this.pageDex]
        }).then(res => {
          this.getMassList()
          if (res.code === 1) {
            let countNum = res.data.countNum || 0
            let sendNum = res.data.sendNum || 0
            this.massNum = [countNum, sendNum]
          } else {
            this.massNum = [0, 0]
            this.$Message.error(res.message)
          }
        })
      }
    },
    creatTap(id, type) { // 点击新建、修改、复制按钮
      let query = {}
      if (id) { query.id = id }
      if (type) { query.type = type } // 不传为新建，updata:修改, copy:复制
      this.$router.push({
        path: this.$route.fullPath.replace('infoList','createMass'),
        query: query
      })
    },
    search() { // 搜索事件
      this.getMassList()
    },
    offsetChange(code) { // 页码变化
      this.offset = code - 1
      this.getMassList()
    },
    numChange(num) { // 单页显示群发消息数量变化
      this.num = num
      this.getMassList()
    },
    handBtn(h) { // 返回当前状态对应所需按钮的数据或render数组
      let status = this.nowMass ? this.nowMass.sendStatus : null
      let list = this.handList
      let dom = []
      switch (status) {
        case 0:
        case 4: list = [list[0], list[2], list[4]]; break
        case 1: list = list.slice(0, 4); break
        case 2:
        case 3:
        case 5: list = [list[0], list[2]]; break
      }
      if (h === 'detail') { return list }
      list.forEach((v, i) => {
        const render = h('li', {
          on: {
            click: () => {
              this.hand(v.key)
              document.body.click()
            }
          }
        }, v.text)
        dom.push(render)
      })
      return dom
    },
    hand(typ) { // 点击操作按钮
      this.mod.type = typ // 保存操作类型
      switch (typ) {
        case 'detail':
          this.getMassInfo(this.nowMass.id)
          this.drawer.show = true
          break
        case 'updata':
          this.creatTap(this.nowMass.id, typ)
          break
        case 'copy':
          this.mod.show = true
          this.mod.text = this.modText[0]
          break
        case 'delete':
          this.mod.show = true
          this.mod.text = this.modText[1]
          break
        case 'cancel':
          this.mod.show = true
          this.mod.text = this.modText[2]
          break
        case 'close':
          this.drawerClose()
          break
      }
    },
    drawerClose() {
      this.drawer.show = false
    },
    ok() { // 对话框确定按钮点击事件
      switch (this.mod.type) {
        case 'copy':
          this.creatTap(this.nowMass.id, 'copy')
          break
        case 'delete':
          this.delMass()
          break
        case 'cancel':
          this.cancelSend()
          break
      }
      this.close()
    },
    close() { // 对话框取消、关闭按钮点击事件
      this.mod.show = false
    }
  }
}
</script>

<style lang="stylus">
.infoList-page
  padding-right: 20px
.info-table
  .ivu-poptip
    font-size: 0
// 操作控件
.cetate-btn {
  width: 116px;
  background-color: #409eff;
  border-radius: 3px;
  margin-top: 30px;
}
.redraw
  color: #909499
  margin-left: 20px
  cursor: pointer
  &:hover
    color: #409eff
// 消息列表
.info-list {
  min-height: 400px;
  position: relative;
  padding-bottom: 20px;
  margin-top: 20px;
}
.display-list
  >li
    width: 94px;
    cursor: pointer
    color: #303133;
    font-size: 14px;
    line-height: 28px;
    text-align: center;
    &:hover
      color: #fff
      background-color: #409eff
.poptip-mass
  min-width: 108px !important
  .ivu-poptip-body-content
    overflow: visible
  .ivu-poptip-body
    padding-left: 0
    padding-right: 0
.noData
  height: 120px
  line-height: 120px
  color: #787c80
// 分页器
.info-page
  float: right
  margin-top: 19px
  .hidePage li
    display: none !important
  .ivu-select-single .ivu-select-selection
    height: 32px !important
    .ivu-select-selected-value
      height: 30px !important
      line-height: 30px !important
  .ivu-page-options-elevator input
    height: 32px
// 抽屉部分
.drawer-cont
  padding: 10px 25px 10px 20px
.drawer-foot
  button
    margin: 0 10px
</style>
