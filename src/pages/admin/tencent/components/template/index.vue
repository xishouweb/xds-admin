<template>
  <div id="graphic" v-if="showMedia">
    <modelFrame
    :totalPage="totalPage"
        :pageSize="pageSize"
        :currPage="currPage"
        @changeKeyword="getKeyWord"
        @pageChange="pageChange">
      <template slot="header">
        <span class="title">模板消息</span>
        <span class="close" @click="close"><i class="icon">&#xe674;</i></span>
      </template>
      <template slot="label">
        <labelList :labelList="labelList" @selectGroup="selectGroup"></labelList>
      </template>
      <template slot="action">
        <Button size="small" type="primary" style="width: 100px" @click="toAddTemplate">新建模板消息</Button>
      </template>
      <template slot="main">
        <Loading v-show="!groupList.length" :loading="loading">暂无模板</Loading>
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
import { mapGetters } from 'vuex'
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
        graphic: {}
      }
    },
    computed: {
      ...mapGetters({
        currPublic: 'publicAccount/curPublic'
      })
    },
    watch: {
      showMedia(nv) {
        if (nv) {
          this.init()
        }
      }
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
          type: 'template'
        }
        let res = await this.$post(this.Path.queryTemplateCssGroup, param)
        let total = 0;
        (res.data.data || []).forEach(item => { total += item.count || 0 })
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
          condition: this.title,
          appAccountId: this.currPublic.appAccountId,
          offset: (this.currPage - 1) * this.pageSize,
          limit: this.pageSize
        }
        let res = await this.$post(this.Path.getCustomTemplateListByPage, param)

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
        this.pageSize = 10
        this.currPage = 1
        // 根据数据获取列表
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
        this.groupId = this.labelList[index].groupId || null
        this.getCurrentGroupId(this.groupId)
        this.getGroupList()
      },
      close() {
        this.$emit('close', false)
      },
      submit() {
        this.$emit('submit', this.graphic, 'click')
      },
      cancel() {
        this.close()
      },
      getPicText(picText) {
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
      toAddTemplate() {
        this.close()
        this.$nextTick(() => {
         if (this.$route.meta.leaveIntercept !== undefined) { // 该类跳转不显示页面离开提示
            this.$route.meta.leaveIntercept = false
          }
          window.open(`${location.origin}/admin/admin/tencent/messageTemplate/messageTAdd/0?appAccountId=${this.currPublic.appAccountId}`)
          // this.$router.push({name: 'messageTAdd', params: {step: 0}})
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

