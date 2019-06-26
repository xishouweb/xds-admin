<template>
  <div id="graphic" v-if="showMedia">
    <modelFrame
    :totalPage="totalPage"
        :pageSize="pageSize"
        :currPage="currPage"
        @changeKeyword="getKeyWord"
        @pageChange="pageChange">
      <template slot="header">
        <span class="title">选择裂变海报</span>
        <span class="close" @click="close"><i class="icon">&#xe674;</i></span>
      </template>
      <template slot="label">
        <labelList :labelList="labelList" @selectGroup="selectGroup"></labelList>
      </template>
      <template slot="action">
        <Button size="small" type="primary" style="width: 100px" @click="toCreatePoster">新建裂变海报</Button>
      </template>
      <template slot="main">
        <Loading v-show="!groupList.length" :loading="loading">暂无海报</Loading>
        <linkList v-show="groupList.length" @on-change="getPicText" :list="groupList"></linkList>
      </template>
      <template slot="footer">
        <Button size="small" type="primary" @click="submit">确定</Button>
        <Button class="cancel" size="small" @click="cancel">取消</Button>
      </template>
    </modelFrame>
  </div>
</template>
<script>
import { mapState, mapGetters, mapActions } from "vuex"
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
        audio: {},
        labelList: [],
        title: null,
        groupId: null,
        groupList: [],
        graphic: {},
        metarialType: "posterTemplate",
      }
    },
  computed: {
    ...mapState({
      currPublic: state => state.publicAccount.curPublic,
      totalCount: state => state.poster.posterList.totalCount
    }),
    ...mapGetters({
      getposterGroupList: "poster/getposterGroupList",
      posterDefaultGroupId: "poster/posterDefaultGroupId"
    })
  },
  watch: {
    currPublic(nv) {
      nv.serviceTypeInfo === 2 && this.init()
    }
  },
    mounted() {
      this.init()
      document.body.appendChild(this.$el)
    },
    methods: {
      ...mapActions({
        queryCssGroup: "poster/queryCssGroup",
        getPosterTemplateByPage: "poster/getPosterTemplateByPage",
      }),
      async init() {
        // 获取标签
        if (!this.currPublic) return
        let param = {
          appAccountId: this.currPublic.appAccountId,
          type: this.metarialType
        }
        await this.queryCssGroup(param)
        this.labelList = this.deepCopy(this.getposterGroupList)
        this.getGroupList()
      },
      async getGroupList(arg) {
        this.loading = true
        // 获取列表
        let param = {
          groupId: this.groupId,
          posterTemplateName: this.title,
          appAccountId: this.currPublic.appAccountId,
          offset: (this.currPage - 1) * this.pageSize,
          limit: this.pageSize
        }
        let res = await this.getPosterTemplateByPage(param)

        this.loading = false
        if (res.code === 1) {
          res = res.data
          this.groupList = res.records || []
          this.totalPage = res.totalCount
          this.currPage = parseInt(res.offset / res.limit) + 1
          this.pageSize = res.limit
        } else {
          this.$Message.error(res.mmessage)
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
        this.getGroupList()
      },
      close() {
        this.$emit('close', false)
      },
      submit() {
        this.$emit('submit', this.graphic, 'poster')
      },
      cancel() {
        this.close()
      },
      getPicText(picText) {
        this.graphic = picText
      },
      toCreatePoster() {
        this.close()
        this.$nextTick(() => {
          if (this.$route.meta.leaveIntercept !== undefined) { // 该类跳转不显示页面离开提示
            this.$route.meta.leaveIntercept = false
          }
          this.$router.push({name: 'createPoster', params: {groupId: this.groupId || this.posterDefaultGroupId}})
        })
      }
    }
  }
</script>
<style lang="stylus">
// @import "~@/assets/stylus/index.styl"
// #graphic
//   width: 885px;
//   height: 740px;
//   background-color: #ffffff;
//   box-shadow: 1px 0px 6px 0px rgba(0, 0, 0, 0.2);
//   border-radius: 3px;
//   border: solid 1px #cacbcc;
//   padding 20px
//   css3Middle()
</style>

