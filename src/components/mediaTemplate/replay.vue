<template>
    <div class="create-qr-code-repaly">
        <Layout class="reply-cont">
          <Sider class="reply-tit" width=124>
            <!-- 回复内容标题 -->
            <template v-for="(v, i) in contTit">
              <div class="tit" :key="i" v-if="i<replyNum" @click="cutEdit(i)">
                <Poptip class="tit-pop" trigger="hover" placement="right-start" >
                  <div class="tit-item flexC" :class="{'activ':editDex==i}">
                    <span>{{v}}</span>
                    <i v-if="replyNum > 1" class="icon">&#xe644;</i>
                  </div>
                  <div v-if="replyNum > 1" class="shadow" slot="content">
                    <p v-if="i>0" @click.stop="move(-1,i)">上移</p>
                    <p v-if="i<replyNum-1" @click.stop="move(1,i)">下移</p>
                    <p class="del" @click.stop="move(0,i)">删除</p>
                  </div>
                </Poptip>
              </div>
            </template>
            <!-- 添加一条回复内容 -->
            <div class="tit add-btn flexC" @click="addReply">
              <Icon type="plus" size="30" color="#cacbcc" />
            </div>
          </Sider>

          <Content class="reply-input">
            <!-- 编辑区域 -->
            <div class="edit-box" :class="{warn: editWarn}">
              <menuContentType :messageContent="content" @sendType="setType"></menuContentType>
              <p class="input-warn">{{editWarnText}}</p>
            </div>
            <div class="greet-btn" v-if="doSave || del.fn">
              <Button v-if="doSave" type="primary" @click="save">保存</Button>
              <Button v-if="del.fn" @click="del.fn" :disabled="del.disabled">删除回复</Button>
            </div>
          </Content>
        </Layout>
    </div>
</template>

<script>
import menuContentType from '@/pages/admin/tencent/components/WechatContent/menuContentType'
import { mapGetters } from 'vuex'
export default{
  name: "create-qr-code-repaly",
  data() {
    return {
      editWarn: false, // 回复内容是否为空
      editWarnText: '', // 回复内容不符合要求时的警告语
      replyNum: 1, // 回复内容条数，默认为1，最大为5
      reply: null, // 当前编辑规则信息
      editDex: 0, // 当前编辑内容的索引
      contTit: ['回复内容','回复内容二','回复内容三','回复内容四','回复内容五'],
      editCont: [{ key: 'text', text: '', contentOrder: 0, menuId: '111' }], // 回复内容（用于显示）
    }
  },
  props: {
    replayList: {
      type: Array,
      default: () => []
    },
    doSave: Function, // 保存事件
    del: { // 删除按钮对象
      type: Object,
      default() {
        return {
          disabled: false,
          fn: null
        }
      }
    },
  },
  components: {
    menuContentType,
  },
  computed: {
    ...mapGetters({
      currPublic: 'publicAccount/curPublic',
      getQrcodeGroupList: 'markting/getQrcodeGroupList',
      qrcodeDefaultGroupId: 'markting/qrcodeDefaultGroupId'
    }),
    content() { // 返回当前编辑对象
      return this.editCont[this.editDex]
    }
  },
  watch: {
    replyNum(v, o) {
      this.contTit[0] = v > 1 ? '回复内容一' : '回复内容'
    },
    replayList(nv) {
      nv.length && (this.renderContent())
    }
  },
  created() {
    this.$root.Bus.$on('messageChange', (dat, typ, type, len) => { // 获取编辑器内容
      this.editCont[this.editDex][typ] = dat
      if (len) {
        this.editCont[this.editDex].len = len
      }
      // this.audit()
      this.editWarn = false
    })
  },
  mounted() {
    this.replayList && this.replayList.length && (this.renderContent())
  },
  methods: {
    // 修改时数据回填
    renderContent() {
      if (!this.replayList || !this.replayList.length) { return }
      this.editCont = this.deepCopy(this.replayList)
      this.editCont.forEach((v, i) => {
        v.menuId = i
      })
      this.replyNum = this.editCont.length // 回复条数
      this.editDex = this.replyNum - 1
    },
    cutEdit(i) { // 切换编辑项
      // 切换时需变更menuId属性，否则同类型的回复内容不会被重新渲染
      this.$set(this.editCont[i], 'menuId', Date.now())
      this.editDex = i
    },
    audit(save) { // 检测编辑区是否有空内容
      this.editWarn = false
      this.editCont.forEach((v,i) => {
        let cont = v[v.key]
        // if (cont === '' || cont === null || cont === '<p><br></p>' || cont === '<p>&nbsp;</p>') {
        if (!cont) {
          this.editDex = i
          this.editWarnText = '请添加回复内容'
          this.editWarn = true
          setTimeout(() => { // 保证点击保存时的错误信息显示
            this.editWarn = true
          }, 60)
        } else if (v.len < 0) {
          this.editDex = i
          this.editWarnText = '回复内容不能超过600字'
          this.editWarn = true
          setTimeout(() => { // 保证点击保存时的错误信息显示
            this.editWarn = true
          }, 60)
        }
      })
      return this.editWarn
    },
    setType(typ) { // 设置编辑类型
      this.editCont[this.editDex].key = typ
      this.editCont[this.editDex][typ] = this.editCont[this.editDex][typ] || ''
      this.editWarn = false
    },
    addReply() { // 添加回复内容
      if (this.replyNum < 5) {
        this.replyNum++
        this.editDex = this.replyNum - 1
        this.editCont.push({
          key: 'text',
          text: '',
          contentOrder: this.editDex,
          menuId: Date.now()
        })
      } else {
        this.replyNum = 5
        this.$Message.warning('最多回复五条内容')
      }
    },
    move(typ,i) { // 移动与删除函数
      if (typ === 0) { // 删除
        this.editCont.splice(i,1)
        this.editDex = i === this.replyNum - 1 ? --i : i
        this.replyNum--
        // this.audit()
      } else if (typ === -1) { // 上移
        this.editCont.splice(i - 1,0,this.editCont[i])
        this.editCont.splice(i + 1,1)
        this.editDex = --i
      } else if (typ === 1) { // 下移
        this.editCont.splice(i + 2,0,this.editCont[i])
        this.editCont.splice(i,1)
        this.editDex = ++i
      }
    },
    save() { // 保存
      if (this.audit()) { return }
      if (this.doSave) {
        this.doSave(this.deepCopy(this.editCont))
      }
      let arr = []
      this.editCont.forEach((v,i) => {
        if (v[v.key]) {
          arr.push({
            msgType: v.key,
            content: v[v.key],
            contentOrder: i,
          })
        }
      })
      return arr
    }
  }
}
</script>

<style lang="stylus">
  .create-qr-code-repaly
    .reply-cont
      background-color #fff
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
      .tit
        color #303133
        height 60px
        width 112px
        font-size 14px
        line-height 60px
        text-align center
        cursor pointer
        border-top: solid 1px transparent
        border-left solid 1px #e3e4e5
        border-right solid 1px #e3e4e5
        border-bottom solid 1px #e3e4e5
        position relative
        &:first-child
          border-top solid 1px #e3e4e5
        .tit-item
          padding-right: 8px
          >i
            display: none
            font-size: 24px
            position: absolute
            right: 0
            top: 0
          &:hover
            color #409eff
            background-color #f7f9fa
            >i
              display: block
        .activ
          color #409eff
          background-color #f7f9fa
          &:after
            content ''
            display block
            width 8px
            height 8px
            position absolute
            right -4px
            top 50%
            margin-top -4px
            transform rotate(-45deg)
            background-color #f7f9fa
            border-right 1px solid #e3e4e5
            border-bottom 1px solid #e3e4e5

        .tit-pop
          width: 100%
          height: 58px
          overflow: hidden
          .ivu-poptip-rel
            width: 100%
          .ivu-poptip-body
            padding: 0
          .ivu-poptip-popper
            min-width: 0
          .shadow
            width: 94px
            padding: 11px 2px
            cursor: pointer
            >p
              line-height: 30px
              &:hover
                color: #fff
                background-color: #409eff
      .add-btn
        margin-top 10px
        line-height 70px
        border-top solid 1px #e3e4e5 !important

</style>
