<template>
<div>
  <div class="WXgraphic">
    <div class="editor">
      <wangEditor ref="wxeditor" :graphic="formValidate" :editIndex='editIndex'>
      </wangEditor>
    </div>

    <Form ref="formValidate" :model="formValidate" :label-width="0" :rules="ruleValidate">
        <div class="originLink">
          <div class="form">
            <Checkbox v-model="formValidate.originLink">原文链接</Checkbox>
            <FormItem label="" prop="url">
              <Input v-show="formValidate.originLink" v-model="formValidate.url" placeholder="请输入完整的链接地址"></Input>
            </FormItem>
            <FormItem label="分组">
              <Select v-model="currGroupId">
                  <Option v-for="(item, index) in getGraphicGroupList.slice(1, getGraphicGroupList.length)"
                    :key="index"
                  :value="item.groupId">{{item.name}}</Option>
              </Select>
            </FormItem>
          </div>
        </div>

        <div class="form">
          <div style="height: 70px; line-height: 70px">发布样式编辑</div>
          <FormItem label="封面" prop="picurl">
            <div>
              <NewUploadImg v-model="file"
                ref="upload"
                :action="uploadAction"
                @onSuccess="uploadSuccess"
                :corTokenUrl="corTokenUrl">
                <Button class="upload" type="ghost" style="width: 102px">从本地上传</Button>
              </NewUploadImg>
              <Button @click="openMpictures" type="ghost">从图片库中选择</Button>
            </div>
            <div style="color: #979899; font-size: 12px; height: 43px; line-height: 43px">封面预览</div>
            <div class="WXgraphic-img">
              <Icon class="WXgraphic-img-loading spin-icon-load" type="load-c" size="40" v-if="uploadingCover"></Icon>
              <span v-if="!formValidate.picurl"> + </span>
              <img :src="formValidate.picurl | urlFilter" alt="">
            </div>
          </FormItem>

          <Checkbox v-model="formValidate.showCoverPic" :trueValue="1" :falseValue="0" >在正文顶部显示封面</Checkbox>
          <FormItem label="摘要" prop="digest">
              <Input class="digest" v-model="formValidate.digest" type="textarea" :autosize="{minRows: 5,maxRows: 10}" placeholder="选填，如果不填写会默认抓取正文前54个字"></Input>
          </FormItem>
        </div>
    </Form>
  </div>

  <component class="pic-modal-box" style="z-index: 20000;" :is="mediaType[type]" v-model="showMedia" @submit="getMpicture" >
    <!-- <div class="modal-header" slot="modalheader">
      <Steps :current="currentStep" size="small">
        <Step title="选择图片"></Step>
        <Step title="裁切图片"></Step>
      </Steps>
    </div>
    <div slot="content" v-if="currentStep == 1">
      <EditPic @prevstep="currentStep = 0" @done="editPicDone"  @close="showMedia = false" :initPic="editPicMedia.url"></EditPic>
    </div> -->
  </component>

  <common-modal
      ref="wxmodal"
      :closable="false"
      header="操作提示"
      :content="modalContent"
      confrim="知道了"
      :cancelBtn="false"
    ></common-modal>
</div>
</template>
<script>
import wangEditor from './wangEditor'
// import EditPic from './editPic' // 暂时不用
import { mapGetters } from 'vuex'
import mixin from '../../components/mixin.js'
import mediaTagMixin from './mediaTagMixin.js'

export default {
  name: 'WXgraphic',
  components: {
    wangEditor,
    // EditPic, // 暂时不用
    Mpictures: () => import("../../components/pictures/"),
    NewUploadImg: () => import('@/components/NewUploadImg.vue')
  },
  computed: {
    ...mapGetters({
      currPublic: 'publicAccount/curPublic',
      mediaId: 'tencent/mediaId',
      imageDefaultGroupId: 'tencent/imageDefaultGroupId',
      getGraphicGroupList: 'tencent/getGraphicGroupList'
    })
  },
  props: ['list', 'editIndex'],
  mixins: [mixin, mediaTagMixin],
  data() {
    const validatorDigest = (rule, value, callback) => {
      if (value.length > 120) {
        callback(new Error('最多120个字'))
      } else {
        callback()
      }
    }
    return {
      showMedia: false,
      modalContent: '',
      type: '',
      mediaType: {
        img: "Mpictures",
      },
      currentStep: 0,
      currGroupId: null,
      formValidate: this.list[0] || {},
      editPicMedia: {},
      imageGroupId: null,
      ruleValidate: {
            picurl: [
              { required: true, message: '请选择封面图片', trigger: 'change' }
            ],
            url: [
              { required: true, message: '请输入原文链接', trigger: 'blur' }
            ],
            digest: [
              { required: true, validator: validatorDigest, trigger: 'change' }
            ],
        },
      uploadingCover: false,
      updating: false // true: 正在提交图文， false：没有提交、提交结束
    }
  },
  watch: {
    editIndex(nv) {
      this.formValidate = this.list[nv]
    },
    list(nv) {
      this.formValidate = this.list[this.editIndex]
    }
  },
  created() {
    this.getAllGroupList()
  },
  mounted() {
    this.currGroupId = parseInt(this.$route.params.groupId)
    this.formValidate = this.list[0]
  },
  methods: {
    getAllGroupList() {
      // 分组媒体类型,news:图文;image:图片;voice:语音;video:视屏;"file":文件
      if (!this.getGraphicGroupList.length) {
        this.$store.dispatch("tencent/queryCssGroup", {
          type: "news",
          appAccountId: this.currPublic.appAccountId
        })
      }
    },
    mediaExecCommand(name, value) {
      this.$refs.wxeditor.mediaExecCommand(name, value)
    },
    handleSubmit (afterSave) {
      this.$refs.formValidate.validate((valid) => {
          if (valid && !this.updating) {
            this.updating = true
            if (this.mediaId) {
              this.saveModify(afterSave)
            } else {
              this.saveNew(afterSave)
            }
          }
      })
    },
    // 保存新建图文
    async saveNew(afterSave) {
      if (!this.currPublic) return
      let errType = 0
      let articles = this.list.map(item => {
        !item.title && (errType = 1)
        !item.content && (errType = 3)

        item.digest = item.digest || item.contentText.substring(0, 54)
        // 本地数据库保存一份数据
        const localContent = item.content
        item.content = this.mediaTagAttrChange(item.content) // 方法调用自 mediaTagMixin.js
        item.content.length > 20000 && (errType = 4)

        return Object.assign(
            this._transformData(item, {
                title: 'title',
                thumbMediaId: 'thumbMediaId',
                author: 'author',
                digest: 'digest',
                showCoverPic: 'showCoverPic',
                content: 'content',
                url: 'contentSourceUrl'
            }), {
              showCoverPic: item.showCoverPic - 0,
              localContent
            })
      })

      this.newsError(errType)
      if (errType) return

      let param = {
        appAccountId: this.currPublic.appAccountId,
        groupId: this.currGroupId,
        mediaId: this.mediaId,
        articles: articles
      }

      let res = await this.$post(this.Path.saveMediaNews, param)
      this.updating = false
      if (res.data.code === 1) {
        this.$Message.success('图文消息新建成功')
        let mediaId = res.data.data.media_id
        this.$store.commit('tencent/SET_NEW_CREATED_GRAPHIC', mediaId)
        afterSave && afterSave()
      } else {
        let errcode = res.data.message.errcode || null
        if (errcode) {
          this.wxErrModal(errcode, res.data.message.errmsg)
        } else {
          this.$Message.error(res.data.message)
        }
      }
    },
    // 保存修改图文
    async saveModify(fn) {
      if (!this.currPublic) return
      let errType = 0
      let articles = this.list.map(item => {
        !item.title && (errType = 1)
        !item.content && (errType = 3)
        const localContent = item.content
        item.content = this.mediaTagAttrChange(item.content) // 方法调用自 mediaTagMixin.js
        item.content.length > 20000 && (errType = 4)
        return Object.assign(
          this._transformData(item, {
            id: 'id',
            mediaId: 'mediaId',
            title: 'title',
            thumbMediaId: 'thumbMediaId',
            author: 'author',
            digest: 'digest',
            showCoverPic: 'showCoverPic',
            content: 'content',
            url: 'contentSourceUrl',
            index: "index"
          }), {
            showCoverPic: item.showCoverPic - 0,
            localContent
          })
      })

      this.newsError(errType)
      if (errType) return

      let param = {
        appAccountId: this.currPublic.appAccountId,
        groupId: this.currGroupId,
        mediaId: this.mediaId,
        articles: articles
      }

      let res = await this.$post(this.Path.updateMediaNews, param)
      this.updating = false
      if (res.data.code === 1) {
        this.$Message.success('图文消息修改成功')
        if (this.$route.query.appAccountId) {
          window.close()
        } else {
          this.$router.push({name: 'material'})
        }
      } else {
        let errcode = res.data.message.errcode || null
        if (errcode) {
          this.wxErrModal(errcode, res.data.message.errmsg)
        } else {
          this.$Message.error(res.data.message)
        }
      }
    },
    newsError(num) {
      if (num === 1) {
        this.$Message.error('请填写图文消息标题')
      } else if (num === 3) {
        this.$Message.error('请填写图文消息内容')
      } else if (num === 4) {
        this.$Message.error('正文最多2万字符。')
      }
      this.updating = false
    },
    getMpicture(material) {
      // 暂时不用
      // this.currentStep = 1
      // this.editPicMedia = material
      this.formValidate.picurl = material.cloudUrl
      this.formValidate.thumbMediaId = material.mediaId
      this.showMedia = false
    },
    openMpictures() {
      this.showMedia = true
      this.type = 'img'
    },
    editPicDone(option) {
      this.currentStep = 0
      this.showMedia = false
      this.formValidate.picurl = option.smallUrl
      this.formValidate.thumbMediaId = this.editPicMedia.mediaId
    },
    uploadSuccess(path) {
      this.uploadingCover = true
      let params = {
          metarialType: 'image',
          groupId: this.imageDefaultGroupId,
          busiType: 1,
          appAccountId: this.currPublic.appAccountId,
          fileOnlinePath: path
        }
      this.saveMedia(params)
    },
    afterSaveMedia(data) {
      this.uploadingCover = false
      this.formValidate.picurl = data.response
      this.formValidate.thumbMediaId = data.mediaId
    },
    wxErrModal(errcode, content) {
      if (errcode === 61023) {
        this.modalContent = '当前公众号由于微信原因无法继续操作，请先在当前公司解除授权后再重新授权给销大师。'
      } else {
        this.modalContent = content
      }
      this.$refs.wxmodal.showModal()
    }
  }
}
</script>
<style lang="stylus">
  .WXgraphic
    .ivu-form-item-required .ivu-form-item-label:before
      content: '*';
      display: none;
      margin-right: 4px;
      line-height: 1;
      font-family: SimSun;
      font-size: 14px;
      color: #ff3300;
    .originLink
      padding 40px 0
      line-height 30px
      border-bottom 1px solid #e3e4e6
    .form
      padding 0 90px
      .WXgraphic-img
        display flex
        justify-content center
        align-items center
        width: 270px;
        height: 150px;
        background-color: #e3e4e5;
        span
          font-size 48px;
          color: #ffffff;
        img
          max-width 100%
          max-height 100%
        .WXgraphic-img-loading
          color #409eff
          position absolute
          transform translate(-50%, -50%)
      .ivu-form-item-label
        display: block;
        text-align left !important
        float: none !important
    .editor
      height 680px
    .digest textarea
      text-indent 30px
  // 暂时不用
  // .pic-modal-box
  //   .modal-header
  //     position absolute
  //     top 60px
  //     left 275px
  //     z-index 20
  //     width 440px
  //   #modelFrame
  //     .pagenation
  //       margin-top -20px
  //     .container .right
  //       padding-bottom 0
  //       .main-container
  //         height 454px
  //   .model-header
  //     margin-bottom 55px !important
</style>
