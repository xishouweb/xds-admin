<template>
  <div>
    <DataLoading v-show="uploadingStatusMixin" remindText="上传中..." :dataSatau="1" style="position: absolute"> </DataLoading>
    <!-- 文本编辑组件， -->
    <TextEditor
      v-show="metarialType === 'text'"
      :type="type"
      :insertTags="insertTags"
      :messageContent="messageContent"></TextEditor>
    <!-- 素材弹框 -->
    <component
      v-if="metarialType !== 'text'"
      :is="mediaType[metarialType][0]"
      v-model="showMedia"
      @submit="getMaterial"></component>


    <div class="placement-container" v-show="metarialType !== 'text'">
      <div v-if="getMuneMaterial" class="material-placement">
        <ScrollBar>
          <div class="material-box"
          :style="materialBoxWidth"
          ref="materialBox">
              <!-- 素材模板 -->
              <component @hook:updated="materialBoxMounted"
              :is="mediaType[metarialType][3]"
              :news="getMuneMaterial"
              :audio="getMuneMaterial"
              :file="getMuneMaterial"
              :picture="getMuneMaterial"
              :video="getMuneMaterial"
              :template="getMuneMaterial"
              :media="getMuneMaterial"
              size="small"
              ></component>
              <div ref="materialAction" class="material-action" slot="content">
                  <span class="icon edit" @click="edit">&#xe61d;</span>
                  <span class="icon delete" @click="del">&#xe652;</span>
              </div>
          </div>
        </ScrollBar>
      </div>
      <template v-else>
        <div class="placement">
            <div class="row1"><span class="icon" @click="selectFromMaterial">&#xe601;</span></div>
            <div class="row2">{{mediaType[metarialType][1]}}</div>
        </div>
        <div class="placement" v-if="mediaType[metarialType][2]">
          <div class="row1" v-if="metarialType == 'news'">
            <span class="icon" @click="toNewGrapicPage">&#xe601;</span>
          </div>
          <div class="row1" v-else-if="metarialType == 'template'">
            <span class="icon" @click="toAddTemplatePage">&#xe601;</span>
          </div>
          <div class="row1" v-else>
            <!-- 属性来自mixin -->
            <NewUploadImg v-model="file"
                ref="upload"
                :limitSize="mediaType[metarialType][5]"
                :action="uploadAction"
                @onSuccess="uploadSuccess"
                :onFail="uploadFail"
                :accept="mediaType[metarialType][7]"
                :corTokenUrl="corTokenUrl">
                <span class="icon">&#xe601;</span>
            </NewUploadImg>
          </div>
          <div class="row2">{{mediaType[metarialType][2]}}</div>
        </div>
      </template>
    </div>
  </div>
</template>
<script>
import mixin from "../mixin.js"
import { mapState, mapGetters } from 'vuex'
import { localSaveOrRead } from "@/utils/util.js"
import TextEditor from "../text/"
import Mgraphic from "../graphic/"
import Mpictures from "../pictures/"
import Maudio from "../audio/"
import Mvideo from "../video/"
import Mfiles from "../files/"
import Mtemplate from "../template/"
import Poster from "../poster/"

export default {
  name: 'materialType',
  components: {
    TextEditor,
    Mgraphic,
    Mpictures,
    Maudio,
    Mvideo,
    Mfiles,
    Mtemplate,
    Poster,
    PicText: () => import("../graphic/PicText"),
    PicTemp: () => import("../pictures/PicTemp"),
    AudioTemp: () => import("../audio/AudioTemp"),
    VidoeTemp: () => import("../video/vidoeTemp"),
    FileTemp: () => import("../files/FileTemp"),
    Temp: () => import("@/components/mediaTemplate/MessageTemplate"),
    PosterTemp: () => import("@/components/mediaTemplate/posterTemp.vue"),
    NewUploadImg: () => import('@/components/NewUploadImg.vue')
  },
  data() {
    return {
      showMedia: false,
      typeIndex: 0,
      mediaType: {
        text: ["TextEditor", "", "", "", {}, 0, null, ''],
        // 素材类：[弹窗出组件名，提示文字， 提示文字， 素材模板组件, 素材内容, limitSize, groupId]
        news: ["Mgraphic", "从图文素材中选择", "新建图文", "PicText", {}, 0, null, ''],
        image: ["Mpictures", "从图片素材中选择", "上传图片", "PicTemp", {}, 2, null, 'image/*'],
        voice: ["Maudio", "从语音素材中选择", "上传语音", 'AudioTemp', {}, 10, null, 'audio/*'],
        video: ["Mvideo", "从视频素材中选择", "上传视频", "VidoeTemp", {}, 10, null, 'video/*'],
        file: ["Mfiles", "从文件素材中选择", "上传文件", "FileTemp", {}, 10, null, 'file/*'],
        template: ["Mtemplate", "从模板消息中选择", "新建模板消息", "Temp", {}, 10, null, '']
      },
      menuId: 0,
      material: null,
    }
  },
  props: {
    keyType: {
      default: '',
      type: String
    },
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
  watch: {
    messageContent: {
      immediate: true,
      handler(nv, ov) {
        console.log(nv)
        this.menuId = nv.menuId
        if (nv.key !== 'text') {
          this.showMedia = false
          if (nv.key === 'template') { // 消息模板
            if (nv.templateCont) {
              this.setMuneMaterial(nv.templateCont)
            } else {
              this.getMediaIdDetailData({
                mediaId: parseInt(nv.value) || nv[nv.key],
                type: 'template'
              })
            }
          } else { // 素材
            let constArr = ['image', 'news', 'voice', 'video', 'file', 'template', 'posterTemplate']
            if (constArr.indexOf(nv.key) >= 0) {
              this.getMediaIdDetailData({
                mediaId: nv.value || nv[nv.key],
                type: nv.key === 'image' ? 'img' : nv.key
              })
            }
          }
        } else {
          this.showMedia = true
        }
      },
      deep: true
    }
  },
  computed: {
    materialBoxWidth() {
      let w = 'video,voice,file'.includes(this.metarialType)
      ? '333px' : 'news'.includes(this.metarialType) ? '210px' : '222px'

      return { width: w }
    },
    metarialType() {
      let currentComponentTypes = 'text,news,image,voice,video,file,template'
      return currentComponentTypes.includes(this.messageContent.key) ? this.messageContent.key : 'text'
    },
    groupId() {
      return this.mediaType[this.metarialType][6]
    },
    getMuneMaterial() {
      return this.mediaType[this.metarialType][4][this.menuId] || ''
    },
    ...mapState('tencent', {
      newCreatedGraphic: state => state.newCreatedGraphic,
      newCreateTemplateMsgId: state => state.newCreateTemplateMsgId
    }),
    ...mapGetters({
      graphicDefaultGroupId: 'tencent/graphicDefaultGroupId',
      imageDefaultGroupId: 'tencent/imageDefaultGroupId',
      audioDefaultGroupId: 'tencent/audioDefaultGroupId',
      videoDefaultGroupId: 'tencent/videoDefaultGroupId',
      fileDefaultGroupId: 'tencent/fileDefaultGroupId'
    })
  },
  mixins: [mixin],
  mounted() {
    if (localSaveOrRead('fromPage') === "newgraphic") {
      if (this.newCreatedGraphic) {
        this.getMediaIdDetailData({
          mediaId: this.newCreatedGraphic,
          type: 'news'
        })
      }
      this.$store.dispatch('tencent/SET_NEW_CREATED_GRAPHIC', null)
    } else if (localSaveOrRead('fromPage') === "messageTAdd") {
      if (this.newCreateTemplateMsgId) {
        this.getMediaIdDetailData({
            mediaId: this.newCreateTemplateMsgId,
            type: "template"
          })
      }
    }
    this.defaultGroupId()
  },
  methods: {
    defaultGroupId() {
      this.mediaType["news"].splice(6, 1, this.graphicDefaultGroupId)
      this.mediaType["image"].splice(6, 1, this.imageDefaultGroupId)
      this.mediaType["voice"].splice(6, 1, this.audioDefaultGroupId)
      this.mediaType["video"].splice(6, 1, this.videoDefaultGroupId)
      this.mediaType["file"].splice(6, 1, this.fileDefaultGroupId)
    },
    selectFromMaterial() {
      this.showMedia = true
    },
    // 拿到选中的媒体
    getMaterial(material, type) {
      this.showMedia = false
      this.setMuneMaterial(material)
    },
    // 设置菜单媒体 以及对应的 内容
    setMuneMaterial(material) {
      let muneMaterial = this.mediaType[this.metarialType][4]
      muneMaterial[this.menuId] = material
      this.mediaType[this.metarialType].splice(4, 1, muneMaterial)
      // 提交到微信菜单
      if (material) this.updateMessageContent(material)
    },
    updateMessageContent(material) {
      let type = ["news","image","voice","video"].includes(this.metarialType) ? 'media_id' : 'click'
      if (material) {
        let mediaId = material.mediaId || material.id
        // if (this.metarialType === "file") {
        //   mediaId = material.url
        // }
        this.$root.Bus.$emit('messageChange', mediaId, this.metarialType, type, material)
      } else {
        this.$root.Bus.$emit('messageChange', '', this.metarialType, type, {})
      }
    },
    // 编辑选中的媒体
    edit() {
      this.showMedia = true
    },
    // 删除选中的媒体
    del() {
      this.material = null
      this.setMuneMaterial(null)
      this.$root.Bus.$emit('material')
      this.updateMessageContent()
    },
    materialBoxMounted() {
      let materialAction = this.$refs.materialAction
      let xpos = this.$refs.materialBox.getBoundingClientRect()
      let height = xpos.bottom - xpos.top
      materialAction.style.top = (height <= 240 ? height : 240) - 30 + 'px'
    },
    // 通过mediaId获取素材内容
    async getMediaIdDetailData(arg) {
      let param = {
          mediaId: arg.mediaId,
          type: arg.type
        }
      if (param.mediaId && !this.getMuneMaterial) {
        let res = await this.$post(this.Path.getMediaIdDetailData, param)
        res = res.data
        if (res.code === 1) {
          this.initMediaTemp(res.data)
        }
      }
    },
    initMediaTemp(data) {
      let initData = null
      if (this.metarialType === 'news') {
        initData = {
          ...data.cssWxMediaNewsExtend,
          articles: data.detailList.map(item => Object.assign({}, item, {cloudThumbUrl: item.thumbUrl}))
        }
      } else if (this.metarialType === 'template') {
        initData = {...data, templateDateList: JSON.parse(data.contentValue)}
      } else {
        initData = data
      }
      this.setMuneMaterial(initData)
    },
    // 去往新建图文页
    async toNewGrapicPage() {
      await this.judgeNewsDefaultGroupId()
      window.open(`${location.origin}/admin/admin/tencent/material/new/${this.graphicDefaultGroupId}?appAccountId=${this.currPublic.appAccountId}`)
      // this.$router.push({name: "newgraphic", params: {groupId: await this.judgeNewsDefaultGroupId()}})
    },
    // 判断graphicDefaultGroupId是否存在
    async judgeNewsDefaultGroupId() {
      let id = this.groupId
      if (!id) {
        await this.$store.dispatch("tencent/queryCssGroup", {
          type: this.metarialType,
          appAccountId: this.currPublic.appAccountId,
        })
      }
    },
    // 去往新建消息模板页
    toAddTemplatePage() {
      // this.$router.push({name: 'messageTAdd', params: {step: 0}})
      window.open(`${location.origin}/admin/admin/tencent/messageTemplate/messageTAdd/0?appAccountId=${this.currPublic.appAccountId}`)
    },
    uploadFail() {
      this.uploadingStatusMixin = false
    },
    // 上传文件成功
    async uploadSuccess(path) {
      await this.judgeNewsDefaultGroupId()
      this.defaultGroupId() // groupid异步加载过来的
      let params = {
          metarialType: this.metarialType,
          groupId: this.groupId,
          busiType: 1,
          appAccountId: this.currPublic.appAccountId,
          fileOnlinePath: path,
          fileSourceType: 1,
        }
      if (this.metarialType === 'file') {
        params.busiType = 3
      }
      this.saveMedia(params)
    },
    // 上传文件成功
    afterSaveMedia(data) {
      let metarialType = this.metarialType
      let media = {
          appAccountId: this.currPublic.appAccountId,
          groupId: this.mediaType[this.metarialType][6],
          updateTime: (new Date()).toLocaleDateString(),
          cloudType: '',
          cloudUrl: null,
          mediaId: null,
          size: null,
          status: 1,
          title: '',
          type: 1
        }
      if (metarialType === "image") {
        Object.assign(media, {
          cloudUrl: data.response,
          size: data.size,
          title: data.name,
          mediaId: data.mediaId
        })
      } else if (metarialType === "voice") {
        Object.assign(media, {
          cloudUrl: data.response,
          size: data.size,
          title: data.name,
          mediaId: data.mediaId
        })
      } else if (metarialType === "video") {
        Object.assign(media, {
          downUrl: data.response,
          size: data.size,
          title: data.name,
          mediaId: data.mediaId,
          description: data.name
        })
      } else if (metarialType === "file") {
        Object.assign(media, {
          mediaId: data.data.id,
          url: data.response,
          size: data.size,
          name: data.name,
          time: (new Date()).toLocaleDateString()
        })
      }
      this.setMuneMaterial(media)
    }
  }
}
</script>
<style lang="stylus">
@import '~@/assets/stylus/mixin'
  .placement-container
    width 100%
    height 300px
    padding 30px 0
    .material-placement
      height 100%
    .material-box
      position relative
      margin-left 30px
      border-radius: 3px;
      border: solid 1px #e3e4e5;
      width: 210px;
      &:hover
        color: #333333
        .edit, .delete
          cursor pointer
          display inline
      .edit, .delete
          display none

      .user_detail
        display none !important
      .picCard
        padding 0
      .video-temp-discription-title
        width 235px !important
        overflow hidden
        white-space nowrap
        text-overflow:ellipsis
      .material-action
        height 40px
        line-height 40px
        width: 60px;
        position: absolute;
        bottom: 0px;
        right: -60px;
        text-align: right;
        .icon
          color: #979899;
          &:hover
            color: #000;
    .ivu-poptip-inner
      width: 100%;
      background-color none !important
      box-shadow: none !important

  .placement
    float left
    padding-top 88px
    text-align center
    width: calc(50% - 45px);
    height: 240px;
    margin-left 30px
    border: solid 1px #e3e4e5;
    .row1
      height 40px
      color: #cacbcc;
      .icon
        font-size 40px
        cursor pointer
    .row2
      padding-top 10px
      color: #979899;

</style>


