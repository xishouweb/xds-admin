<template>
  <!-- 模板消息组件 -->
  <div class="template-msgCard" :style="{'maxWidth': filtWidth}">
    <!-- 失效图标 -->
    <i class="iconfont close" v-if="template.status === 0">&#xe75f;</i>
    <div class="template-head">
      <div class="template-title">
        <span>{{template.title}}</span>
        <!-- 详情链接图标 -->
        <i class="icon temp-mp" v-if="template.jumpType === 2">&#xe68f;</i>
        <a class="temp-link" v-else-if="template.linkAddress || template.url" :data-href="template.linkAddress || template.url">
          <i class="icon">&#xe61e;</i>
        </a>
      </div>
      <p class="template-date" v-if="template.createTime">{{template.createTime | filtTime}}</p>
    </div>
    <div class="template-body">
      <p
        v-if="template.templateDateList"
        class="template-txt"
        v-html="formatCont(template.content, template.templateDateList)"
      ></p>
      <p
        v-if="template.templateDataList"
        class="template-txt"
        v-html="formatCont(template.content, template.templateDataList)"
      ></p>
        <!-- v-html="formatCont(template.content, template.templateDataList || template.templateDateList)" -->
    </div>
    <div class="template-footer">
      <div class="template-txt">{{template.name}}</div>
    </div>
    <div class="hand" v-show="showHand">
      <i class="icon" @click.stop="handTap(1)">&#xe61d;</i>
      <i class="icon" @click.stop="handTap(2)">&#xe652;</i>
    </div>
  </div>
</template>

<script>
import { tempFilterTags, tempAddTags } from '@/pages/admin/tencent/components/text/textHtmlChange.js'
export default {
    name: "template-m",
    data() {
      return {}
    },
    props: {
      template: { // 模板消息详细内容
        type: Object,
        default: () => { return {} }
      },
      showHand: { // 控制操作按钮的显示
        type: Boolean,
        default: false
      },
      maxWidth: { // 最大宽度
        type: [Number, String],
        default: ''
      },
    },
    filters: {
      filtTime(val) { // 过滤掉创建时间中的时分秒
        if (val) {
          val = val.split(/\s/g)
          return val[0]
        }
      }
    },
    computed: {
      filtWidth() {
        let val = this.maxWidth
        if (!val) { return '100%' }
        val += ''
        val += (val.indexOf('px') === -1) ? 'px' : ''
        return val
      }
    },
    methods: {
      formatCont(cont, list) {
        cont = (cont || '').replace(/\n/g, "<br/>")
        let newCont = cont.replace(/{{.+?}}/g, function(txt) {
          let value
          if (list && list.length) {
            list.forEach(item => {
              if (txt.includes(item.key)) {
                value = item.value
                  ? `<span style="color:${item.color}">${tempAddTags(item.value)}</span>`
                  : ""
              }
            })
            return value
          }
        })
        // 对内容头无内容移除换行
        newCont = newCont.replace(/^(<br\/>)+/, "")
        return newCont
      },
      handTap(v) { // 点击操作按钮
        if (v === 1) {
          this.$emit('updata')
        } else if (v === 2) {
          this.$emit('delete')
        }
      },
    }
}
</script>

<style lang="stylus">
.template-msgCard
    text-align left
    position relative
    width 100%
    min-width: 210px
    background-color #ffffff
    border solid 1px #e3e4e5
    padding 15px 15px 0
    line-height 20px
    &:hover
      box-shadow 0px 3px 12px 0px rgba(0, 0, 0, 0.25)
      .template-action
        color #409eff
    &.disabled
      opacity 0.3
      .template-close
        position absolute
        font-size 80px
        left 50%
        top 50%
        transform translateX(-50%) translateY(-50%)
      .template-title .template-action.template-del
        float right
        font-size 14px
        opacity 1
    .temp-link, .temp-mp
      color: #b1b2b2
      float: right
    .temp-link:hover
      cursor: pointer
      color: #409fff
    .template-head
      .template-title
        position relative
        font-size 16px
        color #000
      .template-date
        font-size 12px
        color #8c8c8c
    .template-body
      color #000000
      padding-bottom 13px
      font-size 14px
      .template-txt
        margin-top 30px
        word-break break-all
    .template-footer
      border-top solid 1px #e3e4e6
      font-size 12px
      line-height 36px
    .hand
      display: flex
      position: absolute
      bottom: 0
      right: -60px
      >i
        font-size: 18px
        color: #979899
        margin-left: 10px
        cursor pointer
</style>
