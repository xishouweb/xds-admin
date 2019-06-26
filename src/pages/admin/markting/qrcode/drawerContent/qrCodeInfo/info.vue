<template>
  <div class="qr-code-information-info">
    <div class="qr-code-information-info-container">
      <qrCode :data="drawer"></qrCode>
    </div>
    <pragraphTitle>渠道二维码基本信息</pragraphTitle>
    <div class="qr-code-information-info-container">
      <Row class="row">
        <Col class="label" span="4">名称</Col>
        <Col span="8">{{drawer.qrCodeName | filterString}}</Col>
      </Row>
      <Row class="row">
        <Col class="label" span="4">ID</Col>
        <Col span="8">{{drawer.qrCodeNo || drawer.id | filterString}}</Col>
        <Col class="label" span="4">类型</Col>
        <Col span="8">{{drawer.qrCodeType | type}}</Col>
      </Row>
      <Row class="row">
        <Col class="label" span="4">所属主题</Col>
        <Col span="8">{{getQrCodeThemeName | filterString}}</Col>
        <Col class="label" span="4">到期时间</Col>
        <Col span="8">{{drawer.qrCodeEffectiveDate || '永久' | filterTime }}</Col>
      </Row>
      <Row class="row">
        <Col class="label" span="4">创建时间</Col>
        <Col span="8">{{drawer.createTime | filterString | filterTime}}</Col>
      </Row>
    </div>
    <pragraphTitle>渠道二维码内容信息</pragraphTitle>
    <div class="qr-code-information-info-container">
      <Row class="row">
        <Col class="label" span="6">接待客服/部门</Col>
        <Col span="18">
          <div v-if="drawer.customerService &&  drawer.customerService.length">
            <p style="line-height: 1.2;" v-html="displayServer(drawer.customerService)"></p>
          </div>
          <div v-else>{{drawer.customerServiceType | customerServiceType}}</div>
        </Col>
      </Row>
      <Row class="row">
        <Col class="label" span="6">自动打标签</Col>
        <Col span="18">
          <div v-if="drawer.tagNames && drawer.tagNames.length">
            <!-- <span
              class="replay"
              v-for="(item, index) in drawer.tagNames"
              :key="index"
              style="marginRight: 5px"
            >{{item}}</span> -->
            <p v-html="drawer.tagNames.join('<strong> / </strong>')"></p>
          </div>
          <div v-else>无</div>
        </Col>
      </Row>
      <Row class="row">
        <Col class="label" span="6">回复内容</Col>
        <Col span="18">
          <div v-if="drawer.replyDate && drawer.replyDate.length">
            <div class="replay" v-for="(item, index) in replyDate" :key="index">
              <div class="label-text">{{contTit[index]}} :</div>
              <mediaTemplate :media="item"></mediaTemplate>
            </div>
          </div>
          <div v-else>无</div>
        </Col>
      </Row>
    </div>
  </div>
</template>
<script>
import qrCode from "./qrCode"
import pragraphTitle from "@/components/pageStyle/pragraphTitle"
import { mapGetters } from 'vuex'
export default {
  components: {
    qrCode,
    pragraphTitle,
    mediaTemplate: () => import("@/components/mediaTemplate")
  },
  props: {
    drawer: {
      type: Object,
      default: () => {}
    },
    param: {
      type: String,
      default: () => ""
    }
  },
  data() {
    return {
      ruleGroupName: {
        name: [
          { required: true, message: "分组名称不可为空", trigger: "blur" },
          {
            required: true,
            max: 10,
            message: "不能超过10个汉字",
            trigger: "change"
          }
        ]
      },
      contTit: [
        "回复内容一",
        "回复内容二",
        "回复内容三",
        "回复内容四",
        "回复内容五"
      ]
      // 回复的消息类型text:文本 news：图文 image：图片 voice：语音 video：视频 file：文件 template：模板消息
    }
  },
  filters: {
    type(val) {
      // /二维码类型QR_STR_SCENE:临时的字符串参数值 "QR_LIMIT_STR_SCENE": 永久的	是	[string]/
      return val === "QR_LIMIT_STR_SCENE" ? "永久二维码" : "临时二维码"
    },
    customerServiceType(val) {
      // 1：指定客服或指定部门 3：不限 4：不指定客服'
      return val === 3 ? '不限' : val === 4 ? '不指定客服' : '无'
    },
    filterTime(val) {
      return (val || '').replace(/:\d{2}$/, '')
    }
  },
  computed: {
    ...mapGetters({
      getQrCodeThemeName: "markting/getQrCodeThemeName"
    }),
    replyDate() {
      this.sortReplayList(this.drawer.replyDate)
      return this.drawer.replyDate
    }
  },
  methods: {
    sortReplayList(val) {
      (val || []).sort((item1,item2) => {
        return item1.contentSort - item2.contentSort
      })
      return val
    },
    displayServer(val) {
      // 部门 2233
      // 客服 '王群英-ZX001-正常'
      // val.sort((a, b) => {
      //   return b.indexOf('-') - a.indexOf('-')
      // })
      return val.map(item => {
        let text = item.split('-')
        text[1] = text[1] ? `(${text[1]})` : ''
        text[2] = !text[2] ? '' : text[2] !== '正常' ? `<span class="ser-badge">${text[2]}</span>` : ''
        return `${text[0]}${text[1]}${text[2]}`
      }).join('<strong> / </strong>')
    }
  }
}
</script>
<style lang="stylus">
.qr-code-information-info
  .qr-code-information-info-container
    padding 40px 20px
    .row
      margin-bottom 30px
      &:last-child
        margin-bottom 0
    .label
      color #606366
    .label-text
      color #606366
      margin-bottom 20px
    .replay
      padding 20px 0
      border-bottom 1px solid #e3e4e5
      &:first-child
        padding-top 0
    .ser-badge
      display inline-block
      margin 0 5px
      padding 0 5px
      height: 15px;
      background-color: #b1b2b3;
      border-radius: 3px;
      color: #ffffff;
</style>
