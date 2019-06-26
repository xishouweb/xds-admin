
// 关键词回复
<template>
  <div class="key-reply clear">
    <!-- 列表 -->
    <template v-if="listTit">
      <BScroll :offsetBottom="100">
      <Table class="replyList" :columns="listTit" :data="pageList" :no-data-text="noData"></Table>
      </BScroll>
    </template>
    <!-- 分页 -->
    <template v-if="total > 10">
      <Page
       class="replyPage"
       :total="total"
       size="small"
       show-total
       show-sizer
       show-elevator
       @on-change="change"
       @on-page-size-change="changeNum"
      />
    </template>

    <!-- 对话框 -->
    <new-modal v-model="showModal" :header="modText[0]" :content="modText[1]" @ok="ok"></new-modal>

  </div>
</template>

<script>
  import Const from "./const.js"

  export default{
    name: 'keyReply',
    data() {
      return {
        pageNum: 10, // 每页显示条数
        pageDex: 1, // 当前显示页码
        total: null, // 总数量
        nowReply: null, // 当前操作回复内容
        handTyp: '', // 操作类型use：禁/启用，del:删除
        nowInfo: null, // 当前操作对象信息
        showModal: false, // 控制对话框的显示
        modText: [], // 对话框显示内容
        pageList: [], // 当前页显示内容
        noData: '<p class="noData">关键词回复为空</p>',
        replyTyp: {
          text: '【文字】',
          news: '【图文】',
          image: '【图片】',
          voice: '【语音】',
          video: '【视频】',
          file: '【文件】',
          template: '【模板】'
        },
        listTit: Const.listTit(this) // 表格数据格式
      }
    },
    props: ['appAccountId'],
    mounted() {
      this.$emit('cut',0)
      this.getList()
    },
    watch: {
      appAccountId() {
        this.getList()
      }
    },
    computed: {},
    methods: {
      getList(word) { // 获取关键词回复列表
        if (this.appAccountId) {
          this.post(this.Path.replyList,{
            appAccountId: this.appAccountId, // 应用号id，必传
            limit: this.pageNum, // 单页显示条数
            offset: (this.pageDex - 1) * 10, // 页码索引
            condition: word || '', // 搜索关键字
          }).then(dat => {
            if (dat.code === 1) {
              this.total = dat.data.totalCount
              this.pageList = dat.data.records
            }
          })
        }
      },
      change(dex) { // 页码变更
        this.pageDex = dex
        this.$nextTick(() => {
          this.$root.Bus.$emit('calcScrollHeight') // 重新计算页面高度并设置滚动条高度
        })
        this.getList()
      },
      changeNum(num) { // 单页显示数量变更
        this.pageNum = num
        this.$nextTick(() => {
          this.$root.Bus.$emit('calcScrollHeight') // 重新计算页面高度并设置滚动条高度
        })
        this.getList()
      },
      search(word) { // 查询函数
        this.getList(word)
      },
      ok() { // 对话框确认事件
        if (this.handTyp === 'use') { // 禁用/启用操作
          let tex = this.nowReply.status === 1 ? '禁用' : '启用'
          let status = this.nowReply.status === 1 ? 0 : 1
          let list = this.nowReply.cssAutoreplyRuleContents
          list.forEach(v => {
            delete v.details
            delete v.autorelyRuleId
            delete v.contentTitle
          })
          // 调用接口修改启用状态
          this.post(this.Path.replyAdd,{
            appAccountId: this.appAccountId,
            id: this.nowReply.id,
            ruleName: this.nowReply.ruleName,
            keyWord: this.nowReply.keyWord,
            matchingType: this.nowReply.matchingType,
            status: status,
            cssAutoreplyRuleContentList: list,
          }).then(dat => {
            if (dat.code === 1) {
              this.nowReply.status = status
              this.$Message.success(tex + '成功！')
            } else {
              this.$Message.error(dat.message)
            }
          })
        } else if (this.handTyp === 'del') { // 删除操作
          this.post(this.Path.replyDelRule,{
            appAccountId: this.appAccountId, // 应用id,必传项
            id: this.nowReply.id, // 关键词回复规则id必传
          }).then(dat => {
            if (dat.code === 1) {
              this.getList()
              this.$Message.success('删除成功！')
            }
          })
        }
      }
    }
  }
</script>
<style lang="stylus">
.key-reply
  &:after
    content ''
    display block
    clear both
  .replyList
    button
      height 30px
      line-height 1
      font-size 14px
      padding-left 14px
      padding-right 14px
    span
      line-height 1
      font-size 14px
  .noData
    line-height: 120px;
    color: #787c80
  .replyPage
    margin-top 20px
    padding-bottom 30px
    display inline-block
    float right
    li
      color #606366
      border none
      background-color #f2f4f5
      &.ivu-page-item-active
        color #ffffff
        background-color #409eff
      &:hover
        background-color #409eff
        a
          color #ffffff
    input
      height 100%
</style>
