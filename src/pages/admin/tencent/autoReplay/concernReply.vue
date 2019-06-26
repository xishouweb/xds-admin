// 被关注回复
<template>
  <div id="concernReply" class="reply-page">
    <BScroll class="reply-scroll">

      <reply
        ref="reply"
        :replayList="editCont"
        :doSave="save"
        :del="{'fn': cancel, 'disabled': disabled}"
      ></reply>

      <!-- <Layout>
        <Sider class="greet-left" width=70>回复内容</Sider>

        <Content class="greet-right">
          <div class="edit-box" :class="{warn: editWarn}" v-if="flush">
            <menuContentType :messageContent="content" @sendType="setType"></menuContentType>
            <p class="input-warn">{{warnText}}</p>
          </div>

          <div class="greet-btn">
            <Button type="primary" @click="save">保存</Button>
            <Button @click="cancel" :disabled="disabled">删除回复</Button>
          </div>
        </Content>
      </!-->
    </BScroll>
  </div>
</template>

<script>
  import menuContentType from '../components/WechatContent/menuContentType'
  export default{
    data() {
      return {
        disabled: true, // 控制删除按钮是否可用
        editWarn: false, // 是否显示警告
        warnText: '', // 警告语
        flush: true, // 强制刷新编辑器组件变量
        editCont: null, // 被关注回复数据
        // content: {
        //   key: 'text',
        //   text: ''
        // },
      }
    },
    props: ['check','appAccountId'],
    components: {
      menuContentType,
      reply: () => import('@/components/mediaTemplate/replay')
    },
    watch: {
      appAccountId() {
        this.getReply()
      }
    },
    mounted() {
      this.$emit('cut',2)
      this.getReply()

      // this.$root.Bus.$on('messageChange', (dat, typ, type, len) => { // 获取编辑器内容
      //   this.content[typ] = dat
      //   if (len) {
      //     this.content.len = len
      //   }
      //   this.editWarn = false
      // })
    },
    methods: {
      getReply() { // 获取当前回复内容
        if (this.appAccountId) {
          this.post(this.Path.replySeach,{
            appAccountId: this.appAccountId, // 应用id,必传项
            // autoreplyType: 3, // 回复类型
          }).then(dat => {
            if (dat.code === 1) {
              dat = dat.data
              console.log(dat.length)
              console.log(dat[0].content)
              if (!dat.length || !dat[0].content) {
                this.disabled = true
                return
              }
              this.disabled = false
              console.log(this.disabled)
              this.editCont = []
              dat.forEach((v,i) => {
                const cont = v.content
                this.editCont.push({
                  key: v.msgType,
                  [v.msgType]: cont,
                  contentOrder: v.contentOrder,
                  menuId: '123'
                })
              })
              if (this.editCont.length > 0) {
                this.editCont.sort((a,b) => a.contentOrder - b.contentOrder)
              }
              // this.content.key = dat.msgType || 'text'
              // this.content[this.content.key] = dat.content
              // if (dat.content === null) {
              //   this.disabled = true
              // } else {
              //   this.disabled = false
              // }
            } else {
              this.content.key = 'text'
            }
          })
        }
      },
      // setType(typ) { // 切换编辑类型
      //   this.content.key = typ
      //   this.content[typ] = this.content[typ] || ''
      //   this.editWarn = false
      // },
      // audit() { // 检测编辑区是否有空内容
      //   this.editWarn = false
      //   let cont = this.content[this.content.key]
      //   if (cont === '' || cont === null) {
      //     this.editWarn = true
      //     this.warnText = '请添加回复内容'
      //   } else if (this.content.len < 0) {
      //     this.editWarn = true
      //     this.warnText = '回复内容不能超过600字'
      //   }
      //   return this.editWarn
      // },
      doSave(list, msg) { // 保存接口（交互函数）
        this.post(this.Path.replyUpdata,{
          appAccountId: this.appAccountId, // 应用id,必传项
          replies: list,
          // autoreplyType: 3, // 回复类型
          // msgType: this.content.key, // 消息类型
          // content: this.content[this.content.key],
        }).then(dat => {
          if (dat.code === 1) {
            this.disabled = !!msg
            this.$Message.success(msg || '保存成功！')
            if (msg) {
              this.editCont[0].menuId = '123'
            }
          } else {
            this.$Message.error(dat.message)
          }
        })
      },
      save(list) { // 保存
        console.log(list)
        let arr = []
        list.forEach((v,i) => {
          const cont = v[v.key]
          arr.push({
            msgType: v.key,
            content: cont,
            contentOrder: i,
          })
        })
        this.doSave(arr)
      },
      cancel() { // 点击删除回复按钮，显示对话框
        this.$emit('show')
      },
      del() { // 删除回复
        this.editCont = [{
          msgType: 'text',
          content: null,
          contentOrder: 0,
        }]
        this.doSave(this.editCont, '删除被关注回复成功！')
        // this.post(this.Path.replyDel,{
        //   appAccountId: this.appAccountId, // 应用id,必传项
        //   autoreplyType: 3, // 回复类型
        // }).then(dat => {
        //   if (dat.code === 1) {
        //     this.flush = false
        //     this.$nextTick(() => { this.flush = true })
        //     this.$root.Bus.$emit('clearText') // 清空编辑内容
        //     this.editWarn = false
        //     this.disabled = true
        //     this.$Message.success('删除被关注回复成功！')
        //     this.content = {
        //       key: 'text',
        //       text: ''
        //     }
        //   } else {
        //     this.$Message.error(dat.message)
        //   }
        // })
      }
    }
  }
</script>

<style lang="stylus">
#concernReply
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
