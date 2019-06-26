<template>
<div class="material-graphic-container">
  <BScroll :offsetBottom="20">
    <div>
      <div class="graphic-material-graphic">
        <div class="graphic-left">
          <div class="graphic-left-li title">图文列表</div>
          <div class="graphic-left-li show-template">
            <NewGraphicTemp :list="newsList" @currIndex="(index) => {editNewsIndex = index}"></NewGraphicTemp>

            <div style="margin-top :10px" class="graphic-action">
               <Poptip v-model="showAddGraphic" placement="bottom">
                  <span style="font-size: 48px;">+</span>
                  <div slot="content">
                      <ul class="graphic-actionWrap">
                        <li
                          class="graphic-actionWrap-item"
                          v-for="(_item, _index) in Operations"
                          :key="_index"
                          @click="groupAction(null, _item.type)"
                        > <i class="icon" v-html="_item.icon"></i> {{_item.title}}</li>
                      </ul>
                  </div>
              </Poptip>
            </div>
          </div>
        </div>

        <div class="graphic-center">
          <ul class="graphic-tabs">
            <li class="graphic-tab-li" :class="{'graphic-active': tabIndex === 0}" @click="selectTab(0)">新建微信图文消息</li>
            <li class="graphic-tab-li" :class="{'graphic-active': tabIndex === 1}" @click="selectTab(1)">外链图文</li>
          </ul>
          <div>
            <!-- 编辑图文，外链图文-->
            <component :is="graphicType[tabIndex]" ref="editorComponent" :list="newsList" :editIndex="editNewsIndex"></component>
          </div>
        </div>
        <div class="graphic-right">
          <div class="graphic-right-li title">多媒体</div>
          <ul class="graphic-right-li">
            <li @click="selectMedia('img')"> <i class="icon">&#xe6f7;</i> 图片</li>
            <!-- 暂时不用 -->
            <!-- <li @click="selectMedia('video')"> <i class="icon">&#xe624;</i> 视频</li> -->
            <!-- <li @click="selectMedia('voice')"> <i class="icon">&#xe71e;</i> 语音</li> -->
          </ul>
        </div>
      </div>
      <div class="graphic-btns">
        <Button size="small" type="primary" @click="save">保存</Button>
        <!-- <Button size="small" @click="saveAndSend" style="margin-left: 8px">保存并群发</Button> -->
        <Button size="small" @click="cancle">取消</Button>
      </div>

      <component style="z-index: 20000" preScanType="select" :is="mediaType[type]" v-model="showMedia" @submit="getMaterial"></component>
    </div>
  </BScroll>
  <!-- 离开页面时的弹框提示 -->
  <exit-page-modal></exit-page-modal>
</div>
</template>
<script>
import NewGraphicTemp from './NewGraphicTemp'
import BulletBox from "@/components/BulletBox.vue"
import Const from "./const.js"
import Mgraphic from "../../components/graphic/"
import Outlink from "./outlink"
import WXgraphic from "./WXgraphic"
import ImgPlaceholder from "@/components/ImgPlaceholder"
import Mpictures from "../../components/pictures/"
import { mapGetters } from 'vuex'
export default {
  name: 'material-graphic',
  components: {
    BulletBox,
    NewGraphicTemp,
    Mgraphic,
    Outlink,
    WXgraphic,
    ImgPlaceholder,
    Mpictures,
    Maudio: () => import("../../components/audio/"),
    Mvideo: () => import("../../components/video/"),
    Mfiles: () => import("../../components/files/"),
    // Temp: () => import("../../components/template/temp")
  },
  props: ['graphicModify', "groupId"],
  data() {
    return {
      showBulletBox: false,
      showMedia: false,
      position: { x: 0, y: 0 },
      graphicType: { 0: "WXgraphic", 1: "Outlink" },
      tabIndex: 0,
      tabDisable: false,
      type: '',
      mediaType: {
        // 素材类：弹窗出组件名
        news: "Mgraphic",
        img: "Mpictures",
        voice: "Maudio",
        video: "Mvideo",
        file: "Mfiles",
        template: "Mtemplate"
      },
      showAddGraphic: false, // 控制添加、选中图文气泡的显示
      Operations: [
        { title: "写新图文", type: "create", icon: '&#xe61d;' },
        { title: "选择图文", type: "select", icon: '&#xe629;' }
      ],
      news: this.deepCopy(Const),
      editNewsIndex: 0,
      newsList: [this.deepCopy(Const)],
      // insertEditor: true // 判断素材是否添加到编辑器， true：添加到富文本编辑器，false：添加到新建图文或封面图片
    }
  },
  computed: {
    ...mapGetters({
      currPublic: 'publicAccount/curPublic'
    })
  },
  watch: {
    editNewsIndex(nv) {
      this.init(nv)
    }
  },
  created() {
    this.on(document.body, 'click', () => {
      this.showAddGraphic = false
    })
  },
  mounted() {
    let mediaId = this.$route.query.mediaId
    let type = parseInt(this.$route.query.type)
    if (this.graphicModify) {
      this.$store.commit('tencent/SET_MEDIA', this.graphicModify.mediaId)
      this.$store.commit('tencent/SET_GROUPID', this.graphicModify.groupId)
      if (type === 1) {
          // 非外链图文
          this.tabIndex = 0
          this.news.graphicType = 1
          this.getMediaIdDetailData({
            mediaId: mediaId,
            type: "news"
          })
        } else {
          // 外链图文
          this.tabIndex = 1
          this.news.graphicType = 2
          this.initOutLink(this.graphicModify)
        }
    } else {
      this.$store.commit('tencent/SET_MEDIA', null)
      this.init(0)
    }
  },
  methods: {
    init(nv) {
      if (this.newsList[nv].graphicType === 1) {
        this.tabIndex = 0
        this.tabDisable = true
      } else if (this.newsList[nv].graphicType === 2) {
        this.tabIndex = 1
        this.tabDisable = true
      } else {
        this.tabDisable = false
      }
    },
    // 新建图文，选择图文操作 弹框交互操作
    operation(_event, item, index) {
      this.showBulletBox = !this.showBulletBox
      let clientRect = _event.target.getBoundingClientRect()
      let position = {
        x: Math.round(clientRect.left),
        y: Math.round(clientRect.top),
        w: Math.round(clientRect.width),
        h: Math.round(clientRect.height)
      }
      this.position = {
        x: position.x - 55,
        y: position.y + 48
      }
    },
    // 新建图文，选择图文操作
    groupAction(data, type) {
      this.position.y = this.position.y + 70
      this.showBulletBox = false
      if (type === 'create') { // 新建图文
        this.createGraphic()
      } else if (type === 'select') { // 选择图文
        this.selectMedia('news')
      }
    },
    // 新建图文
    async createGraphic(param) {
      this.editNewsIndex++
      let news = this.deepCopy(this.news)
      if (param) { // 选择的图文
        let res = await this.getMediaIdDetailData({
          mediaId: param.mediaId,
          type: "news",
          isSelect: true
        })
        news = res[param.index]
      } else {
        news.content = "<p></p>"
      }
      this.newsList.push(news)
    },
    //
    addImg(param) {
      this.newsList[this.editNewsIndex].content += param
    },
    // 选择素材类型
    selectMedia(arg) {
      this.type = arg
      this.showMedia = true
    },
    // 获取选中的素材 《图片》
    async getMaterial(material) {
      this.showMedia = false
      if (this.type === "news") {
        console.log(33,material)
        this.createGraphic(material)
      } else if (this.type === 'img') {
        // 想编辑器插入媒体
        this.$refs.editorComponent.mediaExecCommand("inserthtml", `<p><img alt="${material.url}" src="http://${material.cloudUrl}" /></p>`)
      } else if (this.type === 'video') {
        this.$refs.editorComponent.mediaExecCommand("inserthtml", `<p><video alt="${material.url}" src="http://${material.cloudUrl}" controls="controls"></video></p>`)
      } else if (this.type === 'voice') {
        this.$refs.editorComponent.mediaExecCommand("inserthtml",
        `<p><p style="display: none">${JSON.stringify(material)}</p><audio src="http://${material.cloudUrl}" controls="controls"></audio></p>`)
      }
    },
    // 选择新建或外链图文
    selectTab(param) {
      if (this.tabDisable) return
      this.tabIndex = param
    },
    // 根据media-id获取图文， 非外链
    async getMediaIdDetailData(arg) {
      // arg.isSelect: true 是在弹框中选取到的
      let param = {
          mediaId: arg.mediaId,
          type: arg.type
        }

        let res = await this.$post(this.Path.getMediaIdDetailData, param)
        res = res.data
        if (res.code === 1 && !arg.isSelect) {
          this.newsList = this.initMediaTemp(res.data)
        }
        if (arg.isSelect) {
          return this.initMediaTemp(res.data)
        }
    },
    initMediaTemp(data) {
      return data.detailList.map(item => Object.assign({}, this.news, item, {
        picurl: item.thumbCloudUrl || item.thumbUrl,
        url: item.contentSourceUrl
        }))
    },
    // 获取 外链图文
    initOutLink(data) {
      this.newsList = data.articles.map(item => Object.assign({}, this.news, item))
    },
    // 保存
    save() {
      if (this.$route.meta.leaveIntercept !== undefined) {
        this.$route.meta.leaveIntercept = false
      }
      this.$refs.editorComponent.handleSubmit(this.cancle)
    },
    saveAndSend() {
      alert('暂时没有此功能')
    },
    // 取消
    cancle() {
      // 返回图文页面 / 返回菜单页面 / 自动回复页面
      if (this.$route.query.appAccountId) {
        window.close()
      } else {
        this.$router.push({name: 'material'})
      }
    }
  }
}
</script>
<style lang="stylus">
@import '~@/assets/stylus/mixin'
.material-graphic-container
  margin-top 10px
  background-color #ffffff
  border-radius 3px
  .graphic-material-graphic
    width 100%
    clear()
    .graphic-left, .graphic-right
      float left
      width 290px
    .graphic-center
      float left
      width calc(100% - 580px)
      border-left 1px solid #e3e4e6
      border-right 1px solid #e3e4e6

    .graphic-left
      padding 0 30px
      .graphic-left-li
        margin-top 30px

    .graphic-tabs
      border-bottom 1px solid #e3e4e6
      clear()
    .graphic-tab-li
      float left
      height 60px
      line-height 60px
      color: #979899;
      margin-left 50px
      cursor pointer
      &.graphic-active
        color: #409fff;

    .graphic-right
      padding 0 30px
      .graphic-right-li
        cursor pointer
        margin-top 30px
        li
          height 60px
          line-height 60px
          border-bottom 1px solid #e3e4e6;
  .graphic-btns
    height 60px
    line-height 60px
    border-top 1px solid #e3e4e6
    text-align center
    button
      width 110px
  .graphic-action
    width: 228px;
    height: 120px;
    text-align center
    border: dashed 1px #e3e4e5;
    background #fff
    span
      width: 48px;
      font-size 48px;
      padding-top: 33px;
      display: inline-block;
      color: #cacbcc;
      cursor pointer
  .graphic-actionWrap
    width: 110px !important
    text-align center
    .graphic-actionWrap-item
      cursor pointer
      padding 15px 0 !important
      height 45px !important
      color: #606366 !important
      &:hover
        color: #409fff !important
    .graphic-active
      color #409eff !important
</style>
