<template>
<div class="material-picture-container">
  <div class="material-fn" ref="materialFn" @click="materialFn">素材组合器({{picText.length}})</div>
  <Frame
        :totalPage="listParam.totalPage"
        :pageSize="listParam.pageSize"
        :currPage="listParam.currPage"
        leftWidth="250px"
        @pageChange="pageChange">

      <template slot="header">
        <HeaderAction placeholder="输入文章标题搜索" :info="numberInfo" @headerAction="selectSource" @upload="toNewGrapicPage" @searchKeyWord="getKeyWord" :type="sourceType" label3="新建图文素材">
          <div slot="left" style="color: #323333; line-height: 40px; height: 40px;font-size:16px">
            图文消息(共{{numberInfo.wx}}条)
          </div>
        </HeaderAction>
      </template>

      <template slot="label">

        <LabelList
        width="190px"
        :labelList="labelList"
        :type='sourceType'
        @createNew="createNewLabel"
        @selectGroup="selectLabel"
        @deleteGroup="init"></LabelList>
      </template>

      <template slot="main">
          <Loading v-show="!linkList.groupList.length" :loading="loading">暂无图文</Loading>
          <LinkList v-show="linkList.groupList.length"
          @on-change="getSelectedLinkListItem"
          @modify="graphicModify"
          @delete="graphicDelete"
          :list="linkList.groupList"
          :selectType="linkList.type" type="news" size="large" gutter="30" width="270" ></LinkList>
      </template>
  </Frame>

  <Drawer v-model="drawer.show" :titleTips="drawer.title" :isScroll="false" :width="drawer.width || '530px'"  ref="Drawer">
    <div slot="content" v-if="drawer.show">
      <DrawerContent
      :drawer="drawer"
      :labelList="labelList"
      :picText="picText"
      :metarialType="metarialType"
      @refreshLabelList="init"
      @refreshGroupList="getGroupList"></DrawerContent>
    </div>
  </Drawer>
</div>
</template>
<script>
import Frame from '../Frame/'
import LabelList from '../Frame/labelList'
import LinkList from '../Frame/linkList/'
import HeaderAction from '../Frame/headerAction'
import DrawerContent from './drawerContent'
import { mapGetters } from 'vuex'
import Parabola from '@/utils/parabola.js'
export default {
  name: 'material-news',
  components: {
    Frame,
    LabelList,
    LinkList,
    HeaderAction,
    DrawerContent,
    PicText: () => import("../Frame/linkList/PicText"),
    Loading: () => import("@/pages/admin/tencent/components/Loading.vue"),
  },
  data() {
    return {
        loading: false,
        totalGraphic: '', // 图文总条数
        metarialType: 'news',
        maxLength: 8, // 组合器最大条数
        currentGroupId: '',
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
          groupId: null
        },
        linkList: {
          type: 'single',
          selected: null,
          groupList: []
        },
        picText: {
          updateTime: '123',
          length: 0,
          articles: []
        },
        newLabelName: '',
        sourceType: 'wx',
        activeIndex: 0,
        currentGroup: {},
        audio: {},
        labelList: [],
        numberInfo: {
          wx: 0,
          cloud: 0
        }
      }
  },
  computed: {
    ...mapGetters({
      currPublic: 'publicAccount/curPublic',
      getGraphicGroupList: 'tencent/getGraphicGroupList',
      graphicDefaultGroupId: "tencent/graphicDefaultGroupId"
    })
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
    this.init()
    this.getGroupList()
    this.$root.Bus.$on('graphicPerScanAction', (item, target) => {
      this.graphicPerScanAction(item, target)
    })
  },
  methods: {
    async init() {
        // 获取标签
        if (!this.currPublic) return
        let param = {
          appAccountId: this.currPublic.appAccountId,
          type: 'news'
        }
        await this.$store.dispatch('tencent/queryCssGroup', param)
        this.labelList = this.deepCopy(this.getGraphicGroupList)
        // this.numberInfo.wx = this.labelList[0].count
        this.getCurrentGroupId()
      },
    async getGroupList(arg) {
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
      let res = await this.$post(this.Path.queryCssMediaNewsList, param)
      this.loading = false
      if (res.data.code === 1) {
        res = res.data.data
        this.listParam = Object.assign({}, this.listParam, {
          totalPage: res.totalCount,
          pageSize: res.limit,
          currPage: parseInt(res.offset / res.limit) + 1
        })
        if (!_param.groupId) {
          this.numberInfo.wx = res.totalCount
        }
        this.$set(this.linkList, "groupList", res.records || [])
      } else {
        this.$Message.error(res.data.message)
      }
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
    },
    createNewLabel(type, data) {
      if (type === 'modify') {
        this.drawer = { show: true, title: '修改分组', type: 'create', currentGroup: data }
      } else {
        this.drawer = { show: true, title: '新建分组', type: 'create', currentGroup: data }
      }
    },
    getKeyWord(keyword) {
      // 根据数据获取列表
      this.listParam.pageSize = 10
      this.listParam.currPage = 1
      this.listParam.title = keyword
      this.getGroupList()
    },
    // 分页
    pageChange(param) {
      // 翻页获取列表
      this.listParam.pageSize = param.size
      this.listParam.currPage = param.page
      this.getGroupList()
    },
    getSelectedLinkListItem(item) {
      // 得到选中的图文
      this.linkList.selected = item
    },
    selectLabel(param) {
      // 分组相关操作
      this.listParam.pageSize = 10
      this.listParam.currPage = 1
      this.listParam.groupId = param.groupId
      this.drawer.currentGroup = param
      this.getCurrentGroupId(param.groupId)
      this.getGroupList()
    },
    // 图片操作
    graphicPerScanAction(item, target) {
      let type = item.type
      let data = item.data
      let articles = this.picText.articles
      let index = articles.indexOf(data)
      if (type === 'add') { // 添加到组合器
        if (articles.length < this.maxLength) {
          let double = articles.some(item => item.mediaId === data.mediaId)
          if (!double) {
            this.picText.length = articles.push(data)
            this.parabola(target, item.data)
          } else {
            this.$Message.error("你已经添加了该图文，不能重复添加")
          }
        } else {
          this.$Message.error(`图文不能多于${this.maxLength}条！`)
        }
      } else if (type === 'remove') {
        this.picText.length--
        if (!this.picText.length) { this.drawer.show = false }
        articles.splice(index, 1)
      } else if (type === 'down') {
        articles[index] = articles[index + 1]
        articles[index + 1] = data
      } else if (type === 'up') {
        articles[index] = articles[index - 1]
        articles[index - 1] = data
      }
      this.picText = {
          updateTime: '123',
          length: this.picText.length,
          articles
      }
    },
    materialFn() {
      // 素材组合器
        this.drawer = Object.assign({}, this.drawer, {
          show: true,
          title: '素材组合器',
          type: 'combiner',
          width: '370px'})
    },
    async toNewGrapicPage() {
      let id = await this.judgeDefaultGroupId()
      this.$router.push({name: "newgraphic", params: {groupId: id}})
    },
    async graphicModify(item) {
      let id = await this.judgeDefaultGroupId()

      this.$router.push({
        name: "newgraphic",
        params: {graphicModify: item, groupId: id},
        query: {
          type: item.type,
          mediaId: item.mediaId
        }
        })
    },
    graphicDelete(item) {
      this.getGroupList()
    },
    // 判断graphicDefaultGroupId是否存在
    async judgeDefaultGroupId() {
      let id = this.listParam.groupId || this.graphicDefaultGroupId
      if (!id) {
        await this.$store.dispatch("tencent/queryCssGroup", {
          type: "news",
          appAccountId: this.currPublic.appAccountId,
        })
        id = this.graphicDefaultGroupId
      }
      return id
    },
    // 抛物线
    parabola(target, item) {
      let img = `<img style="width: 40px; height: 40px" src="http://${item.cloudThumbUrl}">`
      new Parabola({
        startElement: target.target,
        targetElement: this.$refs.materialFn,
        innerHTML: img,
        speed: 300,// 每帧移动的像素大小
        curvature: 0.0005,// 实际指焦点到准线的距离
      }).init()
    }
  },
  destroyed() {
     this.$root.Bus.$off('graphicPerScanAction')
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
  .material-fn
    cursor pointer
    width: 40px;
    height: 110px;
    background-color: #ffa826;
    border-radius: 3px;
    opacity: 0.7;
    color: #ffffff;
    position fixed
    top 50%
    right 0
    margin-top -60px
    padding 10px 13px
</style>
