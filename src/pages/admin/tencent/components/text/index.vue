<template>
  <div class="text-editor">
    <div class="editor-main">
      <editor ref="xkeditor"
      @on-editor-ready="onReady"
      @on-change="onContentChange"
      @focus="onfocus"></editor>
    </div>
    <div class="inser-content">
      <div class="inser-item">
        <Poptip v-model="facePop" popper-class="custom-pop" placement="top-start" trigger="hover">
          <span class="icon">&#xe647;</span>
          <template slot="content">
            <div class="face-pop">
              <!-- 表情 -->
              <expression @chooseEmoji="selectFace"></expression>
            </div>
          </template>
        </Poptip>
      </div>
      <div class="inser-item" @click.stop>
        <Poptip v-model="linkPop" popper-class="custom-pop" placement="top-start">
          <span class="icon" style="font-size: 19px">&#xe61e;</span>
          <template slot="content">
            <div class="link-pop" @click.stop>
              <div class="link-item">
                <div class="link-label">链接文字</div>
                <div class="link-input">
                  <Input v-model="textLink" placeholder="请输入链接文字"></Input>
                </div>
              </div>
              <div class="link-item">
                <div class="link-label">链接地址</div>
                <div class="link-input">
                  <Input v-model="addressLink" placeholder="请输入带http的完整链接地址"></Input>
                </div>
              </div>
              <div class="link-bottom">
                <div class="bottom-right">
                  <Button type="primary" size="small" @click="confirmLink">确定</Button>
                  <Button type="ghost" size="small" @click="cancelLink">取消</Button>
                </div>
              </div>
            </div>
          </template>
        </Poptip>
      </div>
      <!-- 快捷插入 -->
      <div class="inser-item flex">
        <div class="insert flex">
          <template v-for="(v, i) in notFansPageInsertCont">
            <p :key="i" v-if="i < 9" @click="showFansName(v)">{{v}}</p>
          </template>
        </div>
        <Poptip v-model="showMoreInsert" placement="right-end" v-if="notFansPageInsertCont.length > 9">
          <i class="icon moreInsertIcon">&#xe608;</i>
          <ul class="moreInsert" slot="content">
            <template v-for="(v, i) in notFansPageInsertCont">
              <li :key="i" v-if="i >= 9" @click="showFansName(v)">{{v}}</li>
            </template>
          </ul>
        </Poptip>
      </div>
      <div class="inser-item inser-tips">
        <span class="right-span">还可输入 <span class="text-num">{{calcLength}}</span> 字，按下<span class="text-num">Enter</span>键换行</span>
      </div>
    </div>
  </div>
</template>
<script>
import {mapState} from 'vuex'
import { addTags, filterTags } from './textHtmlChange'
import { localSaveOrRead } from "@/utils/util.js"
import editor from '@/components/wxEditor/components/Editor/editor.1.vue'
import expression from '@/components/expression/expression.vue'
const TEXTMAXNUM = 600
export default {
  name: 'textEditor',
  props: {
    messageContent: {
      default: () => {},
      type: Object
    },
    type: {
      default: '',
      type: String
    },
    insertTags: {
      type: [String, Array],
      default: ''
    }
  },
  components: {
    expression,
    editor
  },
  watch: {
    messageContent: {
      handler(newVal, oldVal) {
        if (newVal.key === 'text' && newVal.type === 'click') {
          if (oldVal.uuid) {
            if (newVal.uuid !== oldVal.uuid) {
              this.editor.setContent(addTags(this.messageContent.text))
              this.textLength = this.filterText(this.messageContent.text, TEXTMAXNUM)
            }
          } else {
            if (newVal.uuid !== oldVal.uuid) {
              this.editor.setContent(addTags(this.messageContent.text))
              this.textLength = this.filterText(this.messageContent.text, TEXTMAXNUM)
            }
          }
        }
      },
      deep: true
    }
  },
  data() {
    return {
      editor: null,
      textLength: TEXTMAXNUM,
      chineseInput: false,
      linkPop: false,
      facePop: false,
      addressLink: '',
      textLink: '',
      groupId: null,
      faceList: [],
      showMoreInsert: false, // 控制更多快捷插入内容的显示
      insertCont: [ // 快捷插入内容
        '[粉丝昵称]', '[分享者昵称]', '[客服名称]', '[海报名称]',
        '[需要关注数]', '[已邀请数量]', '[已取关数]','[还需关注数]',
        '[累计关注数]','[活动有效期]','[裂变海报有效期]'
      ],
    }
  },
  computed: {
    ...mapState({
      appAccountId: state => state.publicAccount.curPublic.appAccountId,
      principalName: state => state.publicAccount.curPublic.principalName
    }),
    // 字体长度的过滤
    calcLength() {
      return this.textLength > 0 ? this.textLength : 0
    },
    // 只有裂变海报相关页面有多个选项
    notFansPageInsertCont() {
      // console.log(this.$route, localSaveOrRead('fromPage'))
      let fromPage = localSaveOrRead('fromPage')
      let list = (fromPage === "infoList0" || fromPage === "infoList1") ? []
                : this.$route.fullPath.includes('/markting/fansPoster') ? ['[粉丝昵称]', '[分享者昵称]', '[客服名称]', '[海报名称]']
                : ['[粉丝昵称]']
      return this.insertTags === "ALL" ? this.insertCont : list
    }
  },
  mounted() {
    this.init()
    this.$root.Bus.$on('clearText', () => {
      this.editor.setContent('')
    })
    document.addEventListener('click', (e) => {
      e.stopPropagation()
      this.showMoreInsert = false
      this.cancelLink()
    })
  },
  methods: {
    init() {
      this.editor = this.$refs.xkeditor
    },
    onReady() {
      this.messageContent && this.editor.setContent(addTags(this.messageContent.text))
    },
    onContentChange(html) {
      let filterHtml = filterTags(html)
      this.$root.Bus.$emit('messageChange', filterHtml, 'text', 'click', this.textLength)
      this.textLength = this.filterText(filterHtml, TEXTMAXNUM)
    },
    onfocus(bool, html) {
      // bool true focus, bool false blur
      if (!bool) {
        let filterHtml = filterTags(html)
        this.$root.Bus.$emit('messageChange', filterHtml, 'text', 'click', this.textLength)
      }
    },
    selectFace(title, url) {
      let img = `<img style="width:20px;height:20px;" src=${url} alt="[${title}]">`
      this.$refs.xkeditor.execCommand('inserthtml',img)
    },
    showFansName(v) { // 插入快捷插入内容
      // let str = `<span style="color:#409fff">${v}</span>`
      let str = `<img src="/static/images/material/${v}.png">`
      this.$refs.xkeditor.execCommand('inserthtml',str)
    },
    confirmLink() { // 插入超链接
      this.linkPop = false
      let str = `<a style="color:#409fff" href=${this.addressLink}>${this.textLink}</a>`
      this.$refs.xkeditor.execCommand('inserthtml',str)
      this.textLink = ''
      this.addressLink = ''
    },
    cancelLink() { // 关闭超链接编辑框
      this.linkPop = false
    },
    filterText(str, num) {
      str = str || ''
      str = str.replace(/&nbsp;/g, '')
      let strLen = str.length
      return num - strLen
    }
  },
  destroyed() {
    this.$root.Bus.$off('clearText')
  }
}
</script>

<style lang="stylus">
@import '~@/assets/stylus/mixin'
.custom-pop
  .face-pop
    width 350px
    padding 20px
    .face-item
      display inline-block
      margin-left 10px
      cursor pointer
      .img
        width 20px
        height 20px
  .link-pop
    width 386px
    padding 30px 20px 0
    .link-item
      line-height 40px
      &:nth-of-type(1)
        margin-bottom 15px
      clear()
      .link-label
        float left
        margin-right 10px
      .link-input
        float left
        width 280px
    .link-bottom
      margin-top 20px
      margin-bottom 30px
      clear()
      .bottom-right
        float right
        .ivu-btn
          width 70px
          margin-left 20px
.text-editor
  .editor-main
    height 260px
    .w-e-toolbar
      display none
    .w-e-text-container
      height 260px !important
      border none !important
      .w-e-text
        overflow auto
  .inser-content
    height 40px
    line-height 40px
    border-top solid 1px #e3e4e6
    clear()
    .inser-item
      float left
      margin-left 30px
      color #606366
      cursor pointer
      &:hover
        .icon
          color #409fff
      .ivu-poptip-popper[x-placement^=top] .ivu-poptip-arrow
        border-top-color #cacbcc
      .ivu-poptip-popper
        .ivu-poptip-content
          .ivu-poptip-inner
            border-radius 3px
            box-shadow 1px 0px 6px 0px rgba(0, 0, 0, 0.2)
            border: solid 1px #cacbcc
            .ivu-poptip-body
              padding: 0
      .icon
        display inline-block
      // .fans-name
      //   &:hover
      //     color #409fff
      .insert
        // height: 40px
        >p
          padding: 0 6px
          &:hover
            color: #409fff
      .ivu-poptip-body-content
        overflow: visible
      .ivu-poptip
        height: 40px
      .ivu-poptip-rel
        height: 40px
      .moreInsert
        // margin: 0 -16px
        >li
          height: 30px
          line-height: 30px
          cursor: pointer
          padding: 0 16px
          &:hover
            color: #409eff
            background-color: #f2f4f5
      .moreInsertIcon
        color: #409fff
        font-size: 28px
        cursor: pointer
        margin-left: 10px
    .inser-tips
      float right
      margin-right 30px
      .right-span
        color: #979899
        display inline-block
        .text-num
          color #606366
</style>

