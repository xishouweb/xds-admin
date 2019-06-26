<template>
  <div class="weui_editor_bd" ref="editorBody">
    <div class="weui_editor_body" :style="editorBodyStyle">
      <div ref="editor" @keypress.shift="shiftkey"></div>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
  import {menuConfig} from '../../config/config'
  import '../../config/ueditor.config'
  import '@S/ueditor/ueditor.all.min'

  export default {
    name: 'menu-ueditor',
    props: {
      content: {
        type: String,
        default: ''
      },
      config: {
        type: Object,
        default() {
          return {}
        }
      },
      editorTopOffset: {
        type: Number,
        default: 0
      }
    },
    computed: {
      editorBodyStyle() {
        return {height: menuConfig.initialFrameHeight + "px", overflowY: "auto"}
      }
    },
    data() {
      return {
        // 编辑器id
        id: 'menu' + Math.random(100),
        UE: window.UE || null,
        editor: null,
        Econtent: '',
        // 工具条状态和数据
        toolStates: {
          // 是否可操作 -1:不可用 0:可用 1:已操作
          undo: -1,
          redo: -1,
          blockquote: 0,
          horizontal: 0,
          removeformat: 0,
          formatmatch: 0,
          bold: 0,
          italic: 0,
          underline: 0,
          indent: 0
        },
        // 子组件的值，必须确保在此注册才能监听动态数据双向绑定
        toolValues: {
          fontsize: '16px',
          forecolor: '',
          backcolor: '',
          justify: '',
          imagefloat: '',
          lineheight: '',
          rowspacingtop: '',
          rowspacingbottom: '',
          insertorderedlist: '',
          insertunorderedlist: ''
        },
        imageMaskVisible: !1
      }
    },
    watch: {
      content(nv) {
        this.setContent(nv)
      }
    },
    methods: {
      init() {
          // this.setContent(this.content)
          this.$emit('on-editor-ready')
      },
      setContent(value) {
        this.Econtent = value
        this.editor && this.editor.setContent(value || this.content || this.Econtent || '')
      },
      execCommand(name, value, dir) {
        this.editor.execCommand(name, value, dir)
      },
      // 插入媒体
      mediaExecCommand(name, value, dir) {
        this.editor.execCommand(name, value)
      },
      // 获取内容getContent
      getContentHtml() {
        return this.editor.getContent()
      },
      // ueditor mouseout
      mouseOut () {
        this.editor.addListener('mouseout',(editor) => {
          this.$emit('mouseOut')
        })
      },
      onScroll() {
        const toolbar = this.toolbar.getBoundingClientRect()
        const editorBody = this.$refs.editorBody.getBoundingClientRect()
        try {
          if (editorBody.top - toolbar.top >= toolbar.height) {
            this.toolbar.style.cssText = this.toolbar.parentNode.style.cssText = ''
          }
          if (toolbar.top < this.editorTopOffset) {
            this.toolbar.style.cssText = `top:${this.editorTopOffset}px;position:fixed;width:${editorBody.width}px`
            this.toolbar.parentNode.style.cssText = `height:${toolbar.height}px`
          }
        } catch (e) {
          console.warn(e)
        }
      },
      onResize() {
        try {
          if (this.toolbar.style.cssText) {
            const toolbar = this.toolbar.getBoundingClientRect()
            const editorBody = this.$refs.editorBody.getBoundingClientRect()
            this.toolbar.style.cssText = `top:${this.editorTopOffset}px;position:fixed;width:${editorBody.width}px`
            this.toolbar.parentNode.style.cssText = `height:${toolbar.height}px`
          }
        } catch (e) {
          console.warn(e)
        }
      },
      getContent(type, fn) {
        type = type || 'Content'
        return this.editor[`get${type}`](fn)
      },
      /**
       * 监听ueditor 编辑器内容更改，返回给editor-component
       */
      onContentChange(fn) {
        this.editor.addListener('contentChange', function() {
          this.Econtent = this.editor.getContent()
          this.$emit('on-change', this.Econtent)
        }.bind(this))
      },
      shiftkey() {
        this.editor.addListener('keypress',(ss) => {
          console.log(ss)
        })
      },
      onSelectionChange() {
        this.editor.addListener('selectionchange', function() {
          const statelist = Object.keys(this.toolStates)
          const valuelist = Object.keys(this.toolValues)

          for (let item of statelist) {
            this.toolStates[item] = this.editor.queryCommandState(item)
          }
          for (let item of valuelist) {
            if (item.indexOf('rowspacing') > -1) {
              // rowspacing的值比较特别
              this.toolValues[item] = this.editor.queryCommandValue('rowspacing', item.replace('rowspacing', ''))
            } else {
              this.toolValues[item] = this.editor.queryCommandValue(item) + ''
            }
          }
        }.bind(this))
      },
      bindScrollEvent() {
        this.offScrollEvent()
        if (window.addEventListener) {
          window.addEventListener('scroll', this.onScroll, false)
        } else if (window.attachEvent) {
          window.attachEvent('scroll', this.onScroll)
        } else {
          window['onscroll'] = this.onScroll
        }
      },
      offScrollEvent() {
        if (window.removeEventListener) {
          window.removeEventListener('scroll', this.onScroll, false)
        } else if (window.detachEvent) {
          window.detachEvent('scroll', this.onScroll)
        } else {
          window['onscroll'] = function() {}
        }
      },
      bindResizeEvent() {
        this.offResizeEvent()
        if (window.addEventListener) {
          window.addEventListener('resize', this.onResize, false)
        } else if (window.attachEvent) {
          window.attachEvent('resize', this.onResize)
        } else {
          window['onresize'] = this.onResize
        }
      },
      offResizeEvent() {
        if (window.removeEventListener) {
          window.removeEventListener('resize', this.onResize, false)
        } else if (window.detachEvent) {
          window.detachEvent('resize', this.onResize)
        } else {
          window['onresize'] = function() {}
        }
      },
      onFocus() {
        this.editor.addListener('focus', function() {
          this.$emit('focus', true, this.Econtent)
        }.bind(this))
        this.editor.addListener('blur', function(str) {
          this.Econtent = this.editor.getContent()
          this.$emit('focus', false, this.Econtent)
        }.bind(this))
      },
    },
    mounted() {
      this.$nextTick(() => {
        this.$refs.editor.id = this.id
        this.editor = this.UE.getEditor(this.id, menuConfig)
        this.editor.ready(() => {
          this.init()
          this.onContentChange()
          this.onSelectionChange()
          this.onFocus()
          this.bindScrollEvent()
          this.bindResizeEvent()
          this.mouseOut()
        })
      })
    },
    beforeDestroy() {
      this.offScrollEvent()
      this.offResizeEvent()
    },
    actived() {
      this.bindScrollEvent()
      this.bindResizeEvent()
    },
    inactived() {
      this.offScrollEvent()
      this.offResizeEvent()
    }
  }
</script>
