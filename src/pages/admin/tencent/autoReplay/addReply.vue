
<template>
  <!-- 添加关键词回复 -->
  <div class="add-reply reply-page">
    <BScroll class="reply-scroll">
      <Form class="input-box" label-position="left" :label-width="124">
        <!-- 规则名称 -->
        <FormItem class="reply-input" :class="{warn:rule.warn}" label="规则名称">
          <Input class="rule" ref="ipt" v-model="rule.val" :placeholder="rule.holder" @on-keyup="keyup(1)" @on-blur="blur(1)">
            <span slot="append">{{size[0]+'/'+rule.max}}</span>
          </Input>
          <p class="input-warn">{{rule.warn}}</p>
        </FormItem>
        <!-- 关键词 -->
        <FormItem class="reply-input" :class="{warn:keyword.warn}" label="关键词">
          <Input class="keyword" v-model="keyword.val" :placeholder="keyword.holder" @on-keyup="keyup(2)" @on-blur="blur(2)">
            <Select slot="prepend" v-model="match">
              <Option value="0">半匹配</Option>
              <Option value="1">全匹配</Option>
            </Select>
            <span slot="append">{{size[1]+'/'+keyword.max}}</span>
          </Input>
          <p class="input-warn">{{keyword.warn}}</p>
        </FormItem>
      </Form>

      <reply
        ref="reply"
        :replayList="editCont"
        :doSave="save"
        :del="{'fn': cancel, 'disabled': disabled}"
      ></reply>

    </BScroll>
  </div>
</template>

<script>
  export default{
    data() {
      return {
        rule: {
          val: '', // 规则名称（输入）
          max: 60, // 最大输入长度
          holder: '请填写规则名称，不超过60个字',
          warn: false
        },
        keyword: {
          val: '', // 关键词（输入）
          max: 30, // 单个关键词的最大长度
          holder: '请填写关键词，多个关键词用英文分号;隔开，单个关键词不超过30个字',
          warn: false
        },
        disabled: true, // 控制删除按钮是否可用，保存之后变更为可用状态
        match: '0', // 匹配类型，默认为半匹配:0，全匹配：1
        reply: null, // 当前编辑规则信息
        editCont: null,
      }
    },
    props: ['check','appAccountId'],
    components: {
      reply: () => import('@/components/mediaTemplate/replay.vue')
    },
    computed: {
      size() { // 返回当前输入长度
        let arr = this.keyword.val.split(';')
        let len = arr[arr.length - 1].length
        return [this.rule.val.length,len]
      },
    },
    watch: {
    },
    created() {
      this.$emit('cut',3)
    },
    mounted() {
      this.$nextTick(() => {
        this.setWidth()
      })

      this.getReplyDetail()
    },
    methods: {
      setWidth() { // 设置规则名称输入框宽度
        const ipt = this.$refs.ipt.$el.getElementsByTagName('input')
        ipt[0].style.width = ipt[0].offsetWidth + 10 + 'px'
      },
      keyup(i) {
        this.blur(i) // 检测是否不为空
        if (i === 1) { // 处理规则名称输入
          if (this.rule.val.length > 60) {
            this.rule.warn = '规则名称最多60个字'
          }
        } else if (i === 2) { // 处理关键词输入
          let arr = this.keyword.val.split(';')
          this.keyword.warn = null
          arr.forEach(word => {
            if (word.length > 30) {
              this.keyword.warn = '单个关键词最多30个字'
            }
          })
        }
      },
      blur(i) { // 输入框失去焦点事件(检测输入框是否为空)
        let str = ''
        if (i === 1) {
          str = this.rule.val
          this.rule.warn = (str === '') ? '请填写规则名称，不超过60个字' : null
        } else if (i === 2) {
          str = this.keyword.val
          this.keyword.warn = (str === '') ? '关键词不能为空' : null
        }
      },
      getReplyDetail() { // 获取自动回复详情
        const query = this.$route.query
        if (query.id) {
          this.disabled = false
          // 获取当前需要编辑的回复内容并填充到页面上
          this.post(this.Path.replyDetail,{
            appAccountId: this.appAccountId, // 应用id,必传项
            id: Number(query.id), // 关键词回复规则id必传
          }).then(res => {
            if (res.code === 1) {
              let dat = this.reply = res.data // 当前规则数据
              let cont = dat.cssAutoreplyRuleContents
              this.keyword.val = dat.keyWord
              this.rule.val = dat.ruleName
              this.match = dat.matchingType.toString()
              this.editCont = []
              cont.forEach((v,i) => {
                const cont = v.content
                this.editCont.push({
                  key: v.msgType,
                  [v.msgType]: cont,
                  contentOrder: v.contentOrder,
                })
              })
              if (this.editCont.length > 0) {
                this.editCont.sort((a,b) => {
                  return a.contentOrder - b.contentOrder
                })
              }
            }
          })
        }
      },
      save(list) { // 保存
        this.blur(1)
        this.blur(2)
        if (!this.keyword.warn && !this.rule.warn && !this.$refs.reply.audit('save')) {
          let arr = []
          list.forEach((v,i) => {
            const cont = v[v.key]
            arr.push({
              msgType: v.key,
              content: cont,
              contentOrder: i,
            })
          })
          this.post(this.Path.replyAdd,{
            appAccountId: this.appAccountId,
            id: this.$route.query.id || null,
            ruleName: this.rule.val,
            keyWord: this.keyword.val,
            matchingType: Number(this.match),
            status: 1,
            cssAutoreplyRuleContentList: arr,
          }).then(dat => {
            if (dat.code === 1) {
              this.$Message.success('关键词规则保存成功')
              window.history.go(-1)
            } else {
              this.$Message.error(dat.message)
            }
          })
        }
      },
      cancel() { // 显示对话框
        this.$emit('show')
      },
      del() { // 删除回复
        this.post(this.Path.replyDelRule,{
          appAccountId: this.appAccountId,
          id: this.reply.id,
        }).then(dat => {
          if (dat.code === 1) {
            this.$Message.success('删除关键词回复规则成功！')
            this.$router.push('keyReply')
          } else {
            this.$Message.error(dat.message)
          }
        })
      }
    },
  }
</script>

<style lang="stylus">
// 规则与关键词输入
.input-box
  label
    padding 13px 12px 13px 0 !important
  .reply-input
    position: relative
    margin-bottom: 35px
.ivu-form-item-error .ivu-input-group-prepend,
.ivu-form-item-error .ivu-input-group-append
  background-color: transparent

.rule,.keyword
  input
    border-radius 4px !important
    padding-right 44px
  div
    background-color transparent
    position relative
    z-index 2
  .ivu-input-group-append
    left -44px
    border none
  .ivu-input-group-prepend
    width 104px
    border-radius 4px !important
    border-right 1px solid #d7dde4
.keyword
  input
    margin-left 10px
  .ivu-input-group-append
    left -34px
  .ivu-select-dropdown
    background-color #fff
// 回复内容部分
.reply-cont
  background-color #fff !important
  .ivu-layout-sider
    background-color: transparent !important
.greet-btn
  margin-top 40px
  font-size 0
  button
    font-size 14px
    line-height 1
    margin-right 30px
    padding-left 40px
    padding-right 40px
.reply-tit
  background-color transparent
// 提示信息
.ivu-message-info
  background-color #2d8cf0
.ivu-message-warning
  background-color #f90
</style>

