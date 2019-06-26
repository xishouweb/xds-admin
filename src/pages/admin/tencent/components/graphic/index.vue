<template>
  <div id="graphic" v-if="showMedia" >
    <modelFrame
        :totalPage="totalPage"
        :pageSize="pageSize"
        :currPage="currPage"
        @changeKeyword="getKeyWord"
        @pageChange="pageChange">
      <template slot="header">
        <span class="title">选择图文</span>
        <span class="close" @click="close"><i class="icon">&#xe674;</i></span>
      </template>
      <template slot="label">
        <labelList :labelList="labelList" @selectGroup="selectGroup"></labelList>
      </template>
      <template slot="action">
        <Button size="small" type="primary" @click="toNewGrapicPage">新建图文</Button>
      </template>
      <template slot="main">
         <Loading v-show="!groupList.length" :loading="loading">暂无图文</Loading>
        <linkList v-show="groupList.length" @on-change="getPicText" :list="groupList" :preScanType="preScanType"></linkList>
      </template>
      <template slot="footer">
        <Button size="small" type="primary" @click="submit" >确定</Button>
        <Button class="cancel" size="small" @click="cancel">取消</Button>
      </template>
    </modelFrame>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { localSaveOrRead } from "@/utils/util.js"
import modelFrame from '../modelFrame/index'
import linkList from './linkList'
import labelList from '../modelFrame/labelList'
  export default {
    name: 'graphic',
    components: {
      modelFrame,
      linkList,
      labelList,
      Loading: () => import("@/pages/admin/tencent/components/Loading.vue")
    },
    model: {
      prop: "showMedia",
      event: "close"
    },
    props: ['showMedia', "preScanType"],
    data() {
      return {
        loading: false,
        activeIndex: 0,
        totalPage: 0,
        pageSize: 10,
        currPage: 1,
        labelList: [],
        title: null,
        groupId: null,
        groupList: [],
        graphic: {}
      }
    },
    computed: {
      ...mapGetters({
        currPublic: 'publicAccount/curPublic',
        graphicDefaultGroupId: "tencent/graphicDefaultGroupId"
      }),
      // 图文素材列表newNumType
      newsNumType() { // 单图文， 多图文
        return ['infoList2','qrcodeEdit','createPoster',
                'createMass2','keyReply', 'greetReply', 'concernReply', 'addReply',
                'customMenu', 'createTask', "modifyMenu"
                ].includes(this.$route.name) ? 1 : null
      },
      newsType() { // 1:非外链图文, 2:外链图文
        let type = null
        // 不支持外链图文组件列表
        let notOutLinkComponents = ['qrcodeEdit','createPoster', 'createTask', 'createMass0', "createMass1"]
        // 支持外链图文组件列表
        let outLinkComponents = []
        if (notOutLinkComponents.includes(this.$route.name)) {
          type = 1
        } else if (outLinkComponents.includes(this.$route.name)) {
          type = 2
        }
        return type
      },
    },
    mounted() {
      this.init()
      document.body.appendChild(this.$el)
    },
    methods: {
      async init() {
        // 获取标签
        let param = {
          appAccountId: this.currPublic.appAccountId,
          newsNum: this.newsNumType,
          type: 'news',
          newsType: this.newsType
        }
        let res = await this.$post(this.Path.queryCssGroup, param)
        let total = 0
        res.data.data.forEach(item => { total += item.count || 0 })
        res.data.data.sort((item1, item2) => { return item1.groupOrder - item2.groupOrder })
        this.labelList = [{name: "全部", count: total}, ...res.data.data] || []
        this.getCurrentGroupId()
        this.getGroupList()
      },
      async getGroupList(arg) {
        this.loading = true
        // 获取列表
        let param = {
          groupId: this.groupId,
          title: this.title,
          appAccountId: this.currPublic.appAccountId,
          offset: (this.currPage - 1) * this.pageSize,
          limit: this.pageSize,
          newsNum: this.newsNumType,
          type: this.newsType
        }
        let res = await this.$post(this.Path.queryCssMediaNewsList, param)
        this.loading = false
        if (res.data.code === 1) {
          res = res.data.data
          this.groupList = res.records || []
          this.totalPage = res.totalCount
          this.currPage = parseInt(res.offset / res.limit) + 1
          this.pageSize = res.limit
        } else {
          this.$Message.error(res.data.mmessage)
        }
      },
      getKeyWord(keyword) {
        // 根据数据获取列表
        this.pageSize = 10
        this.currPage = 1
        this.title = keyword
        this.getGroupList()
      },
      pageChange(param) {
        // 翻页获取列表
        this.pageSize = param.size
        this.currPage = param.page
        this.getGroupList()
      },
      selectGroup(item, index) {
        // 切换标签获取列表
        this.pageSize = 10
        this.currPage = 1
        this.activeIndex = index
        this.groupId = this.labelList[index].groupId || ''
        this.getCurrentGroupId(this.groupId)
        this.getGroupList()
      },
      close() {
        this.$emit('close', false)
      },
      submit() {
        if (this.graphic.mediaId) {
          console.log(22, this.graphic)
          this.$emit('submit', this.graphic, 'media_id')
        } else {
          this.$Message.error('请选择图文')
        }
      },
      cancel() {
        this.close()
      },
      getPicText(picText) {
        // 得到选中的图文
        console.log(11, picText)
        this.graphic = picText
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
      async toNewGrapicPage() {
        let id = await this.judgeDefaultGroupId()
        this.close()
        this.$nextTick(() => {
          if (this.$route.meta.leaveIntercept !== undefined) { // 该类跳转不显示页面离开提示
            this.$route.meta.leaveIntercept = false
          }
          window.open(`${location.origin}/admin/admin/tencent/material/new/${id}?appAccountId=${this.currPublic.appAccountId}`)
        })
      },
      // 判断graphicDefaultGroupId是否存在
      async judgeDefaultGroupId() {
        let id = this.currentGroupId || this.graphicDefaultGroupId
        if (!id) {
          await this.$store.dispatch("tencent/queryCssGroup", {
            type: "news",
            appAccountId: this.currPublic.appAccountId,
          })
          id = this.graphicDefaultGroupId
        }
        return id
      },
    },
    beforeDestroy() {
      if (this.transfer) {
        document.body.removeChild(this.$el)
      }
    }
  }
</script>
