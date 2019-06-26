<template>
<div class="material-picture-container">
  <Frame
        :totalPage="listParam.totalPage"
        :pageSize="listParam.pageSize"
        :currPage="listParam.currPage"
        @pageChange="pageChange">

      <template slot="header">
        <HeaderAction placeholder="输入图片名称搜索" :info="numberInfo"
        @searchKeyWord="getKeyWord"
        @headerAction="selectSource"
        @upload="headerActionUpload" :type="sourceType" label3="上传图片"></HeaderAction>
      </template>

      <template slot="label">
        <LabelList
        :labelList="labelList"
        :type='sourceType'
        :ableActionIndex="3"
        :totalCount='totalCount'
        @createNew="createNewLabel"
        @selectGroup="selectLabel"
        @deleteGroup="init"></LabelList>
      </template>
      <template slot="main-header">
        <div class="cloud-action" v-show="sourceType != 'wx'">
          <SortAndType @update="sort"></SortAndType>
          <div class="cloud-action-btn">
            <Button size="small" @click="deleteAll" >批量删除</Button>
            <Button  size="small" @click="clearAll">一键清理</Button>
          </div>
        </div>
      </template>
      <template slot="main">
        <Loading v-show="!linkList.groupList.length" :loading="loading">暂无图片</Loading>
        <LinkList v-show="linkList.groupList.length"
        @modify="imgModify"
        @delete="imgDelete"
        @on-change="getSelectedLinkListItem"
        :list="linkList.groupList"
        :selectType="linkList.type"
        :type="metarialType" size="large" gutter="10" width="230" height="143"></LinkList>
      </template>
  </Frame>

  <Drawer v-model="drawer.show" :titleTips="drawer.title" :isScroll="false" width ="530px" ref="Drawer">
    <div slot="content">
      <DrawerContent :drawer="drawer" :labelList="labelList" :metarialType="metarialType" v-if="drawer.show"
          @refreshLabelList="init" @uploadSuccess="uploadSuccess"></DrawerContent>
    </div>
  </Drawer>

  <Modal title="删除提示" v-model="modalInfo.showModal" class-name="self-center-modal">
      <div>{{modalInfo.deleteMsg}}</div>
      <div slot="footer">
        <template v-if="modalInfo.type!==3">
          <Button type="primary" @click.stop="modalConfirm">确定</Button>
          <Button type="ghost" @click.stop="modalInfo.showModal = false">取消</Button>
        </template>
        <Button v-else type="primary" @click.stop="modalInfo.showModal = false">知道了</Button>
      </div>
  </Modal>

</div>
</template>
<script>
import Frame from '../Frame/'
import LabelList from '../Frame/labelList'
import LinkList from '../Frame/linkList/'
import HeaderAction from '../Frame/headerAction'
import SortAndType from '../Frame/sortAndType'
import DrawerContent from './drawerContent'
import { mapGetters } from 'vuex'
import cloudMixin from '../cloudMixin'
export default {
  name: 'material-picture',
  components: {
    Frame,
    LabelList,
    LinkList,
    HeaderAction,
    SortAndType,
    DrawerContent,
    Loading: () => import("@/pages/admin/tencent/components/Loading.vue"),
  },
  mixins: [cloudMixin],
  data() {
    return {
        loading: false,
        metarialType: "image",
        drawer: {
          show: false,
          title: '',
          type: '',
          currentGroup: {}
        },
        listParam: {
          totalPage: 0,
          pageSize: 10,
          currPage: 1,
          title: null,
          groupId: null,
        },
        linkList: {
          type: 'single',
          selected: [],
          groupList: [],
        },
        sourceType: 'cloud',
        activeIndex: 0,
        audio: {},
        labelList: [],
        numberInfo: {
          wx: 0,
          cloud: 0
        },
        modalInfo: {
          deleteMsg: '',
          showModal: false,
          type: 1
        }
      }
  },
  computed: {
    ...mapGetters({
      currPublic: 'publicAccount/curPublic',
      getImageGroupList: 'tencent/getImageGroupList',
      getCloudMediaCount: 'tencent/getCloudMediaCount',
    }),
    totalCount() {
      return this.sourceType === 'wx' ? this.numberInfo.wx : this.numberInfo.cloud
    }
  },
  watch: {
    currPublic(nv) {
      this.init()
      this.listParam = {
        totalPage: 0,
        pageSize: 10,
        currPage: 1,
        title: null,
        groupId: null
      }
      this.getGroupList()
    }
  },
  mounted() {
    this.getGroupList(true)
    this.sourceType = 'wx'
    this.init()
    this.getGroupList()
  },
  methods: {
    async init() {
      // 获取标签
      if (!this.currPublic) return
      let param = {
        appAccountId: this.currPublic.appAccountId,
        type: 'image'
      }

      if (this.sourceType === 'wx') {
        await this.$store.dispatch('tencent/queryCssGroup', param)
        this.labelList = this.deepCopy(this.getImageGroupList)
        this.numberInfo.wx = this.labelList[0].count
        this.getCurrentGroupId()
      } else {
        this.queryMsgGroup(param).then(res => {
          this.labelList = res
          // this.numberInfo.cloud = this.labelList[0].count
        }).catch(err => {
          this.$Message.error(err.message)
        })
      }
    },
    async getGroupList(first) {
      this.loading = true
      // 获取列表
      let _param = this.listParam
      let param = {
        groupId: _param.groupId,
        title: _param.title,
        appAccountId: this.currPublic.appAccountId,
        offset: (_param.currPage - 1) * _param.pageSize,
        limit: _param.pageSize
      }
      if (this.sourceType === 'wx') {
        let res = await this.$post(this.Path.queryCssMediaImgList, param)
        this.loading = false
        if (res.data.code === 1) {
          res = res.data.data
          this.listParam = Object.assign({}, this.listParam, {
            totalPage: res.totalCount,
            pageSize: res.limit,
            currPage: parseInt(res.offset / res.limit) + 1
          })
          this.$set(this.linkList, "groupList", res.records || [])
        } else {
          this.$Message.error(res.data.mmessage)
        }
      } else {
        delete param.groupId
        param.sort = _param.sort
        param.order = _param.order
        param.seatId = _param.seatId
        this.queryTmpMediaImgList(param).then(res => {
          if (res.code === 1) {
            if (!first) {
              this.loading = false
              this.listParam = Object.assign({}, this.listParam, {
                totalPage: res.data.totalCount,
                pageSize: res.data.limit,
                currPage: parseInt(res.data.offset / res.data.limit) + 1
              })
              this.$set(this.linkList, "groupList", res.data.records || [])
            }
            if (!_param.seatId) {
              this.numberInfo.cloud = res.data.totalCount
            }
          } else {
            this.errorCloudData(res)
          }
        })
      }
    },
    getKeyWord(keyword) {
      // 根据数据获取列表
      this.listParam.pageSize = 10
      this.listParam.currPage = 1
      this.listParam.title = keyword
      this.getGroupList()
    },
    pageChange(param) {
      // 翻页获取列表
      this.listParam.pageSize = param.size
      this.listParam.currPage = param.page
      this.getGroupList()
    },
    getSelectedLinkListItem(item) {
      this.linkList.selected = item
    },
    uploadSuccess() {
      this.init()
      this.getGroupList()
    },
    getCurrentGroupId(groupId) {
      if (groupId) {
        this.currentGroupId = groupId
      } else {
        let group = this.labelList.find(item => item.groupType === 0)
        this.currentGroupId = group.groupId
      }
      this.$store.commit('tencent/SET_GROUPID', this.currentGroupId)
    },
    // header 相关方法
    selectSource(sourceType) {
      // 选择素材来源
      this.sourceType = sourceType
      if (sourceType === 'wx') {
        this.linkList.type = 'single'
      } else {
        this.linkList.type = 'mulite'
      }
      this.listParam = {
          totalPage: 0,
          pageSize: 10,
          currPage: 1,
          title: null,
          groupId: null,
        }
      this.init()
      this.getGroupList()
    },
    createNewLabel(type, data) {
      if (type === 'modify') {
        this.drawer = {show: true, title: '修改分组', type: 'create', currentGroup: data}
      } else {
        this.drawer = {show: true, title: '新建分组', type: 'create', currentGroup: data}
      }
    },
    headerActionUpload() {
      this.drawer = {
        show: true,
        title: '上传图片',
        type: 'upload',
        groupId: this.listParam.groupId
      }
    },
    sort(param) {
      // 时间和类型排序
      let sortType = param.split('/')
      this.listParam.sort = sortType[0]
      this.listParam.order = sortType[1]
      this.getGroupList()
    },
    selectLabel(param) {
      // 分组相关操作
      this.listParam.pageSize = 10
      this.listParam.currPage = 1
      this.listParam.groupId = param.groupId
      this.listParam.seatId = param.seatId
      this.drawer.currentGroup = param
      this.getGroupList()
    },
    deleteAll() {
      let list = this.linkList.selected
      if (list && list.length) {
        this.modalInfo.deleteMsg = "删除后点击查看聊天内容中存放在云服务空间的图片将不存在，确定批量删除图片吗？"
        this.modalInfo.showModal = true
        this.modalInfo.type = 1
      } else {
        this.$Message.error('至少选择一个')
      }
    },
    clearAll() {
      this.modalInfo.deleteMsg = "删除后点击查看聊天内容中的存放在云服务空间的图片将不存在，确定批量删除图片吗？"
      this.modalInfo.showModal = true
      this.modalInfo.type = 2
    },
    async modalConfirm() {
      if (this.modalInfo.type === 1) {
        let param = {
          appAccountId: this.currPublic.appAccountId,
          idList: this.linkList.selected.map(item => item.id),
          seatId: this.listParam.seatId,
          type: this.metarialType,
        }
        this.deleteCssTmpMedia(param).then(res => {
          if (res.code === 1) {
            this.$Message.success('删除成功！')
            this.modalInfo.showModal = false
            this.loading = true
            setTimeout(() => {
              this.init()
              this.getGroupList()
            }, 2000)
          } else {
            this.errorCloudData(res)
          }
        }).catch(() => {
          this.$Message.error('删除失败！')
        })
      } else {
        let param = {
          type: this.metarialType,
          appAccountId: this.currPublic.appAccountId,
          seatIdList: this.listParam.seatId ? [this.listParam.seatId] : []
        }
        this.deleteTmpMediaByGroup(param).then(res => {
          if (res.code === 1) {
            this.$Message.success('删除成功！')
            this.modalInfo.showModal = false
            this.init()
            this.getGroupList()
          } else {
            this.errorCloudData(res)
          }
        }).catch(() => {
          this.$Message.error('删除失败！')
        })
      }
    },
    imgModify(item) {
      this.drawer = {
        show: true,
        title: '修改图片',
        type: 'modify',
        disabled: true,
        currentMedia: item
        }
    },
    imgDelete() {
      this.init()
      this.getGroupList()
    }
  }
}
</script>
<style lang="stylus">
@import '~@/assets/stylus/mixin'
.material-picture-container
  background #fff
  padding 0 20px
  .cloud-action
    position relative
  .cloud-action-btn
    position absolute
    right 0
    top 0
    button
      width: 80px;
      height: 32px;
      line-height 20px
      background-color: #ffffff;
      border-radius: 3px;
      border: solid 1px #e3e4e5;
</style>
