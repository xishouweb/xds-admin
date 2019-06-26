// 来访欢迎语
<template>
  <div id="greetReply" class="reply-page">
    <BScroll class="reply-scroll">
      <Layout>
        <Sider class="greet-left" width=70>回复内容</Sider>
        <Content class="greet-right">
          <!-- 编辑区域 -->
          <div class="edit-box" :class="{warn: editWarn}" v-if="flush">
            <menuContentType :messageContent="content" @sendType="setType"></menuContentType>
            <p class="input-warn">{{warnText}}</p>
          </div>

          <div class="greet-btn">
            <Button type="primary" @click="save">保存</Button>
            <Button @click="cancel" :disabled="disabled">删除回复</Button>
          </div>
        </Content>
      </Layout>
    </BScroll>
  </div>
</template>

<script>
  import menuContentType from '../components/WechatContent/menuContentType'
  export default {
    name: "greetreply",
    data() {
      return {
        disabled: true, // 控制删除按钮是否可用
        editWarn: false, // 是否显示警告
        warnText: '', // 警告语
        flush: true, // 强制刷新编辑器组件变量
        content: {
          key: 'text',
          text: '',
        }
      }
    },
    props: ['check','appAccountId'],
    components: {
      menuContentType,
    },
    watch: {
      appAccountId() {
        this.getReply()
      }
    },
    mounted() {
      this.$emit('cut',1)
      this.getReply()

      this.$root.Bus.$on('messageChange', (dat, typ, type, len) => { // 获取编辑器内容
        this.content[typ] = dat
        if (len) {
          this.content.len = len
        }
        this.editWarn = false
      })
    },
    methods: {
      getReply() { // 获取当前回复内容
        if (this.appAccountId) {
          this.post(this.Path.replySeach,{
            // sessionId:'',// 会话id，可省略，自动发送
            appAccountId: this.appAccountId, // 应用id,必传项
            autoreplyType: 2, // 回复类型
          }).then(dat => {
            if (dat.code === 1) {
              dat = dat.data
              this.content.key = dat.msgType || 'text'
              this.content[this.content.key] = dat.content
              // this.menuId = dat.content
              if (dat.content === null) {
                this.disabled = true
              } else {
                this.disabled = false
              }
            } else {
              this.content.key = 'text'
            }
          })
        }
      },
      setType(typ) { // 切换编辑类型
        this.content.key = typ
        this.content[typ] = this.content[typ] || ''
      },
      audit() { // 检测编辑区是否为空
        this.editWarn = false
        let cont = this.content[this.content.key]
        if (cont === '' || cont === null) {
          this.editWarn = true
          this.warnText = '请添加回复内容'
        } else if (this.content.len < 0) {
          this.editWarn = true
          this.warnText = '回复内容不能超过600字'
        }
        return this.editWarn
      },
      save() { // 保存
        if (!this.audit()) {
          this.post(this.Path.replyUpdata,{
            appAccountId: this.appAccountId, // 应用id,必传项
            msgType: this.content.key, // 消息类型
            content: this.content[this.content.key],
            autoreplyType: 2, // 回复类型
          }).then(dat => {
            if (dat.code === 1) {
              this.disabled = false
              this.$Message.success('保存成功！')
            } else {
              this.$Message.error(dat.message)
            }
          })
        }
      },
      cancel() { // 点击删除回复按钮，显示对话框
        this.$emit('show')
      },
      del() { // 删除回复
        this.post(this.Path.replyDel,{
          // sessionId:'', //会话id，可省略，自动发送
          appAccountId: this.appAccountId, // 应用id,必传项
          autoreplyType: 2, // 回复类型
        }).then(dat => {
          if (dat.code === 1) {
            this.flush = false
            this.$nextTick(() => { this.flush = true })
            this.$root.Bus.$emit('clearText') // 清空编辑内容
            this.editWarn = false
            this.disabled = true
            this.$Message.success('删除来访欢迎语成功！')
            this.content = {
              key: 'text',
              text: ''
            }
          } else {
            this.$Message.error(dat.message)
          }
        })
      }
    }
  }
</script>

<style lang="stylus">
#greetReply
  .ivu-layout
    background-color transparent !important
  .ivu-layout-sider
    background-color transparent !important

  .greet-right
    margin-left 10px
  .greet-btn
    margin-top 40px
    font-size 0
    button
      font-size 14px
      line-height 1
      margin-right 30px
      padding-left 40px
      padding-right 40px
</style>
