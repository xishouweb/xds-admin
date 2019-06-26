<template>
  <div id="message-temp" v-if="showMedia">
    <modelFrame
      ref="frame"
      :totalPage="totalPage"
      :pageSize="pageSize"
      :currPage="currPage"
      @pageChange="pageChange"
    >
      <!-- 头部 -->
      <template slot="header">
        <span class="title">模板消息</span>
        <span class="close" @click="close"><i class="icon">&#xe674;</i></span>
      </template>
      <!-- 导航 -->
      <template slot="nav">
        <ul class="model-nav flex">
          <li :class="{active: navIndex === 0}" @click='navCut(0)'>选择模板消息</li>
          <li :class="{active: navIndex === 1}" @click='navCut(1)'>新建模板消息</li>
        </ul>
      </template>
      <!-- 侧边栏 -->
      <template slot="label">
        <template v-if="navIndex === 0">
          <labelList :labelList="labelList" @selectGroup="selectGroup"></labelList>
        </template>
        <template v-if="navIndex === 1">
          <labelList :labelList="labelList1" :id="templateId" @selectGroup="cutTemp" :showKey="['title']"></labelList>
        </template>
      </template>
      <!-- 控件 -->
      <template slot="action" v-if="navIndex === 0">
        <searchinput class="searchinput" @change="getKeyWord" :placeholder="placeholder"></searchinput>
        <div class="upload">
          <!-- <Button size="small" type="primary" style="width: 100px" @click="toAddTemplate">新建模板消息</Button> -->
        </div>
      </template>
      <!-- 主体 -->
      <template slot="main">
        <template v-if="navIndex === 0">
          <!-- 选择 模块 -->
          <linkList @on-change="getPicText" :list="groupList" :preScanType="preScanType"></linkList>
        </template>
        <div style="height: 100%;" v-if="navIndex === 1">
          <!-- 新建 模块 -->
          <scroll-bar>
            <div style="padding: 0 50px 220px 0;">
              <templateForm
                ref="tempForm"
                :insert="insert"
                :templateId="templateId"
                :templateData="this.deepCopy(tempData)"
              ></templateForm>
            </div>
          </scroll-bar>
        </div>
      </template>
      <!-- 底部 -->
      <template slot="footer">
        <Button size="small" type="primary" @click="submit" :disabled="navIndex === 0 && !this.graphic.content">确定</Button>
        <Button class="cancel" size="small" @click="cancel">取消</Button>
      </template>
    </modelFrame>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import modelFrame from './modelFrame/index'
import linkList from './linkList'
import labelList from './modelFrame/labelList'
import searchinput from './modelFrame/searchInput'
import templateForm from './modelFrame/templateForm'
  export default {
    name: 'message-temp',
    components: {
      modelFrame,
      linkList,
      labelList,
      searchinput,
      templateForm
    },
    model: {
      prop: "showMedia",
      event: "close"
    },
    props: {
      showMedia: {
        type: Boolean,
        default: false
      },
      placeholder: {
        type: String,
        default: "搜索模板名称、标题"
      },
      navDex: { // 导航索引
        type: Number,
        default: 0
      },
      preScanType: String,
      tempData: Object, // 模板消息对象
      insert: [String, Array],
    },
    watch: {
      showMedia(v) {
        if (!v) {
          this.$refs.frame.createMask(0) // 移除灰色背景元素
        }
      },
      navDex(v) {
        this.navIndex = v
      },
      tempData: {
        deep: true,
        handler(nv) {
          this.getTempId()
        }
      }
    },
    data() {
      return {
        navIndex: 0,
        activeIndex: 0,
        totalPage: 20,
        pageSize: 10,
        currPage: 1,
        audio: {},
        labelList: [],
        labelList1: null, // 模板列表
        templateId: null, // 选中模板id
        initTempId: null, // 初始模板id
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
    mounted() {
      this.init()
      this.getTemplate()
      this.navIndex = this.navDex || 0
      document.body.appendChild(this.$el)
    },
    methods: {
      async init() { // 获取模板消息分组
        let param = {
          appAccountId: this.currPublic.appAccountId,
          type: 'template'
        }
        let res = await this.$post(this.Path.queryTemplateCssGroup, param)
        let total = 0
        const dat = res.data.data || []
        dat.forEach(item => { total += item.count || 0 })
        dat.sort((item1, item2) => { return item1.groupOrder - item2.groupOrder })
        this.labelList = [{name: "全部", count: total}, ...res.data.data] || []
        this.getCurrentGroupId()
        this.getGroupList()
      },
      async getGroupList(arg) { // 获取模板消息列表
        let param = {
          groupId: this.groupId,
          condition: this.title,
          appAccountId: this.currPublic.appAccountId,
          offset: (this.currPage - 1) * this.pageSize,
          limit: this.pageSize
        }
        let res = await this.$post(this.Path.getCustomTemplateListByPage, param)
        res = res.data.data
        this.groupList = res.records || []
        this.totalPage = res.totalCount
        this.currPage = parseInt(res.offset / res.limit) + 1
        this.pageSize = res.limit
      },
      getTemplate() { // 获取模板列表
        this.post(this.Path.getWechatTemplateList, {
          appAccountId: this.currPublic.appAccountId
        }).then(res => {
          if (res.code === 1) {
            this.labelList1 = res.data
            if (!this.templateId && res.data.length) {
              this.getTempId()
            }
          } else {
            this.$Message.error(res.message)
          }
        })
      },
      getTempId(list) { // 获取当前模板id
        if (this.tempData) {
          this.templateId = this.tempData.templateId || this.labelList1[0].templateId
        } else {
          this.templateId = this.labelList1[0].templateId
        }
      },
      navCut(v) { // 导航切换函数
        this.navIndex = v
        if (v === 0) { this.graphic = {} }
        this.$emit('navChange', v)
      },
      getKeyWord(keyword) { // 根据关键词获取模板消息列表
        this.title = keyword
        this.getGroupList()
      },
      pageChange(param) { // 翻页获取列表
        this.pageSize = param.size
        this.currPage = param.page
        this.getGroupList()
      },
      selectGroup(item, index) { // 切换标签获取列表
        this.activeIndex = index
        this.groupId = this.labelList[index].groupId || ''
        this.getCurrentGroupId(this.groupId)
        this.getGroupList()
      },
      cutTemp(v, i) { // 切换模板
        this.templateId = v.templateId
        this.$emit('cutTemp')
      },
      close() {
        this.$emit('close', false)
      },
      submit() { // 提交
        if (this.navIndex === 0) { // 选择模板
          this.$emit('submit', this.graphic, 'click')
        } else { // 编辑模板
          let valid = this.$refs.tempForm.linkBlur()
          if (!valid) { return }
          this.$emit('submit')
        }
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
        this.$router.push({name: 'messageTAdd', params: {step: 0}})
      }
    }
  }
</script>
<style lang="stylus">
@import "~@/assets/stylus/index.styl"
#message-temp
  // width: 885px;
  width: 950px
  height: 740px;
  background-color: #ffffff;
  box-shadow: 1px 0px 6px 0px rgba(0, 0, 0, 0.2);
  border-radius: 3px;
  border: solid 1px #cacbcc;
  padding 20px
  css3Middle()
  // .vue-waterfall
    // height: 100%
    // height: 500px
  .model-nav
    padding-bottom: 10px
    >li
      font-size: 14px
      cursor: pointer
      padding: 0 17px
      height: 32px
      line-height: 1.2
      border-bottom: 2px solid transparent
      &.active
        color: #409eff
        border-color: #409eff
  #search_input
    display inline-block
    width 400px
  .upload
    display inline-block
    text-align right
    width 295px
</style>

