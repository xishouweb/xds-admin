<template>
  <!-- weui编辑器 -->
  <div class="weui_editor">
    <!-- weui-UI -->
    <div class="weui_edui_wrap">
      <!-- weui工具栏 -->
      <div class="weui_editor_hd">
        <div class="weui_editor_toolbar_box_wrap" ref="toolbar">
          <weuiToolbar
            :toolStates="toolStates"
            :toolValues="toolValues"
            :imageFloatMask="imageMaskVisible"
            :selectOptions="selectOptions"
            :listVisible="listVisible"
            :maskVisible="toolbarMaskVisible"
            @on-editor-execCommand="execCommand"
            @on-maskvisible-change="onMaskVisibleChange"
          >
          </weuiToolbar>
        </div>
      </div>
      <slot name="editor-header"></slot>
      <div class="weui_editor_bd" ref="editorBody">
        <slot class="weui_editor_extra" name="header"></slot>
        <!-- <ScrollBar :style="editorBodyStyle"> -->
        <div class="weui_editor_body" :style="editorBodyStyle">
          <div ref="editor"></div>
        </div>
        <!-- </ScrollBar> -->
        <slot class="weui_editor_extra" name="footer"></slot>
      </div>
      <div class="weui_editor_ft"></div>
    </div>
    <slot class="weui_editor_loading" name="loading"></slot>
  </div>
</template>
<script type="text/ecmascript-6">
  import weuiToolbar from '../Toolbar'
  import './editor.stylus'
  import {selectOptions, ueConfig} from '../../config/config'
  import '../../config/ueditor.config'
  import '@S/ueditor/ueditor.all.min'
  import '@S/ueditor/lang/zh-cn/zh-cn'
  export default {
    name: 'weui-ueditor',
    components: {weuiToolbar},
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
      selectOptions() {
        return Object.assign({}, selectOptions, this.config.selectOptions)
      },
      editorBodyStyle() {
        return {height: ueConfig.initialFrameHeight + "px", overflowY: "auto"}
      }
    },
    data() {
      return {
        // 编辑器id
        id: 'weui_edui_' + Math.random(10),
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
        listVisible: !0,
        toolbarMaskVisible: !0,
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
        setTimeout(() => {
          this.setContent(this.content)
          this.$emit('on-editor-ready')
        }, 500)
      },
      setContent(value) {
        this.editor.setContent(value || this.content || this.Econtent || '')
      },
      execCommand(name, value, dir) {
        this.editor.execCommand(name, value, dir)
      },
      // 插入媒体
      mediaExecCommand(name, value, dir) {
        let range = this.editor.selection.getRange()
        if (range.endOffset) {
          this.editor.execCommand(name, value)
        } else {
          this.editor.setContent(value, true)
        }
      },
      // 获取内容getContent
      getContentHtml() {
        return this.editor.getContent()
      },
      // ueditor编辑器失去焦点事件
      lostBlur () {
        // this.editor.addListener('blur',function(editor) {
        //   // alert(132123)
        // })
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
       * @createdAt 2017-05-15T10:19:22+0800
       * @author yiwuyu
       */
      onContentChange() {
        this.editor.addListener('contentChange', function() {
          this.Econtent = this.editor.getContent()
        }.bind(this))
      },
      /**
       * 监听编辑器光标选取改变，触发对toolbars的遮罩和状态option切换
       * @createdAt 2017-05-15T10:20:24+0800
       * @author yiwuyu
       */
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
          // 图片浮动
          const dom = this.editor.selection.getRange().getClosedNode()
          if (dom && dom.tagName === 'IMG') {
            this.imageMaskVisible = !1
          } else {
            this.imageMaskVisible = !0
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
          this.toolbarMaskVisible = !1
          this.listVisible = !1
          this.$emit('focus', true)
        }.bind(this))
        this.editor.addListener('blur', function() {
          this.listVisible = !0
          this.$emit('focus', false)
        }.bind(this))
      },
      onMaskVisibleChange(val) {
        this.toolbarMaskVisible = !0
      }
    },
    mounted() {
      this.toolbar = this.$refs.toolbar
      this.$nextTick(() => {
        this.$refs.editor.id = this.id
        this.editor = this.UE.getEditor(this.id, ueConfig)
        this.editor.ready(() => {
          this.init()
          this.onContentChange()
          this.onSelectionChange()
          this.onFocus()
          this.bindScrollEvent()
          this.bindResizeEvent()
          this.lostBlur()
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
