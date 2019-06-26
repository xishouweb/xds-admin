<template>
<div class="wangeditor">
  <weuiEditor
  ref="editor"
  :editorTopOffset="10"
  :content="graphic.content"
  @mouseOut="editorMouseOut"
  >
     <div class="wangeditor-not-content" slot="editor-header">
        <div class="wangeditor-title" ref="title">
          <input type="text" placeholder="请在这里输入标题"
              :class="{isFocus: isFocus}"
               @focus="isFocus = true" @blur="isFocus = false"
             v-limitLength.64="graphic.title"
              v-model="graphic.title">
          <span class="wangeditor-title-limit" v-if='graphic.title.length'>{{graphic.title.length}}/64</span>
        </div>
        <div class="wangeditor-auther" ref="auther">
          <input
            :class="{isFocus: isFocus}"
            type="text"  placeholder="请输入作者" @focus="isFocus = true" @blur="isFocus = false" v-model="graphic.author" >
        </div>
        <div style="height: 1px;background-color: #f2f4f5;"></div>
    </div>
    </weuiEditor>
</div>
</template>

<script>
import weuiEditor from '@/components/wxEditor/components/Editor/editor'
export default {
  name: "wangeditor",
  data() {
    return {
      // content: '',
      editorContent: '',
      editor: null,
      holderText: this.placeholder,
      isFocus: false
    }
  },
  components: { weuiEditor },
  props: {
    placeholder: {
      type: String,
      default: () => {
        return "从这里开始写正文"
      }
    },
    graphic: {
      type: Object,
      default: () => {
        return {}
      }
    },
    editIndex: {
      type: Number,
      default: () => { return 0 }
    }
  },
  computed: {
    content() {
      return this.graphic.content || ''
    }
  },
  methods: {
    mediaExecCommand(name, value) {
      this.$refs.editor.mediaExecCommand(name, value)
    },
    getContent() {
      return this.$refs.editor.getContent()
    },
    editorMouseOut() {
      this.graphic.content = this.$refs.editor.getContent()
      this.graphic.contentText = this.$refs.editor.getContent('ContentTxt').replace(" ", '')
    }
  }
}
</script>

<style lang="stylus">
.wangeditor
  position relative
  .wangeditor-not-content
    background: #fff
    width 100%
    padding 0 40px
    top 27px
    input
      opacity 0.6
      display inline-block
      width calc(100% - 120px)
      &.isFocus
        opacity 1
  .w-e-text-container
    height 654px !important
    .w-e-text
      padding-top 150px !important
  .wangeditor-title
      height: 25px;
      font-size: 24px;
      color: #303133;
      margin 40px 0
    .wangeditor-title-limit
      width: 42px;
      height: 12px;
      font-size: 14px;
      color: #999999;
  .wangeditor-auther
    height: 14px;
    font-size: 14px;
    color: #999999;
    margin 30px 0
  #editorElem
    padding 0
    #initText:first-child
      // padding-top 150px
</style>
