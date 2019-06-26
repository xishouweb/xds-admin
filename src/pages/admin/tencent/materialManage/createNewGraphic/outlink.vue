<template>
  <div class="outlink">
     <Form ref="outlink" :model="formValidate" :rules="ruleValidate" :label-width="0">
        <FormItem label="标题" prop="title">
            <Input v-model="formValidate.title" placeholder="请输入标题，不超过64个字"></Input>
        </FormItem>
        <FormItem label="链接地址" prop="url">
            <Input v-model="formValidate.url" placeholder="请输入完整链接地址"></Input>
        </FormItem>
        <FormItem label="分组">
          <Select v-model="currGroupId">
              <Option v-for="(item, index) in getGraphicGroupList.slice(1, getGraphicGroupList.length)"
                :key="index"
                @click.native="selectedGroup(item, item.groupType)"
              :value="item.groupId">{{item.name}}</Option>
          </Select>
        </FormItem>
        <FormItem label="封面" prop="picurl">
          <NewUploadImg v-model="file"
              ref="upload"
              :action="uploadAction"
              @onSuccess="uploadSuccess"
              :corTokenUrl="corTokenUrl">
              <Button class="upload" type="ghost" style="width: 102px">从本地上传</Button>
            </NewUploadImg>
          <Button @click="openMpictures" type="ghost">从图片库中选择</Button>
          <div style="color: #979899;">
            <span>封面预览（图片建议尺寸：900* 500px）</span>
          </div>
          <div class="img">
            <span v-if="!formValidate.picurl"> + </span>
            <img :src="formValidate.picurl | urlFilter" alt="">
          </div>
        </FormItem>
        <FormItem label="摘要" prop="description" >
            <Input v-model="formValidate.description" type="textarea" :autosize="{minRows: 6,maxRows: 10}" placeholder="选填，如果不填写会默认抓取正文前54个字"></Input>
        </FormItem>
    </Form>

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
import { mapGetters } from 'vuex'
import EditPic from './editPic'
// import Const from "./const.js"
import mixin from '../../components/mixin.js'
export default {
  name: 'outlink',
  components: {
    EditPic,
    Mpictures: () => import("../../components/pictures/"),
    NewUploadImg: () => import('@/components/NewUploadImg.vue')
  },
  mixins: [mixin],
  props: ['list', 'editIndex'],
  data() {
    return {
        showMedia: false,
        modalContent: '',
        type: '',
        mediaType: {
          img: "Mpictures",
        },
        currentStep: 0,
        editPicMedia: {},
        formValidate: this.list[0],
        ruleValidate: {
            title: [
              { required: true, message: '请输入标题', trigger: 'blur' },
              { required: true, type: 'string', length: 10, message: '最多64个字', trigger: 'blur' }
            ],
            url: [
                { required: true, message: '请填写完整链接地址', trigger: 'blur' }
            ],
            picurl: [
                { required: true, message: '请上传图片', trigger: 'change' }
            ],
            description: [
              { required: true, message: '请输入摘要', trigger: 'blur' },
              { required: true, max: 120, message: '最多120个字', trigger: 'change' }
            ]
        },
        currGroupId: null,
        updating: false // true: 正在提交图文， false：没有提交、提交结束
    }
  },
  watch: {
    editIndex(nv) {
      this.formValidate = this.list[nv]
    }
  },
  computed: {
    ...mapGetters({
      currPublic: 'publicAccount/curPublic',
      mediaId: 'tencent/mediaId',
      imageDefaultGroupId: 'tencent/imageDefaultGroupId',
      getGraphicGroupList: 'tencent/getGraphicGroupList'
    })
  },
  created() {
    this.getAllGroupList()
  },
  mounted() {
    this.currGroupId = parseInt(this.$route.params.groupId)
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
    handleSubmit(afterSave) {
      this.$refs.outlink.validate((valid) => {
        if (valid && !this.updating) {
          this.updating = true
          this.saveOutlink(afterSave)
        }
      })
    },
    handleReset (name) {
      this.$refs.outlink.resetFields()
    },
    uploadSucess(data) {
      this.formValidate.picurl = this.Path.overview + '?fileId=' + data
    },
    async saveOutlink(afterSave) {
      if (!this.currPublic) return
      let articles = this.list.map(item => {
        return Object.assign(
            this._transformData(item, {
                title: 'title',
                url: "url",
                description: "description",
                picurl: "picurl",
                id: "id",
                index: "index"
            }))
      })
      let param = {
        appAccountId: this.currPublic.appAccountId,
        groupId: this.currGroupId,
        mediaId: this.mediaId,
        articles: articles
      }
      let res = await this.$post(this.Path.saveOrUpdateUrlNews, param)
      this.updating = false
      if (res.data.code === 1) {
        this.$Message.success('外链图文消息新建成功')
        this.$store.commit('tencent/SET_NEW_CREATED_GRAPHIC', param)
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
    getMpicture(material) {
      // debugger
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
      this.formValidate.picurl = option.smallUrl || option.img
    },
    uploadSuccess(path) {
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
  .outlink
    padding 40px 80px
    .img
      width: 270px;
      height: 150px;
      line-height 150px
      text-align center
      background-color: #e3e4e5;
      span
        width: 60px;
        height: 48px;
        font-size 48px;
        color: #ffffff;
      img
        max-width 100%
        max-height 100%
    .ivu-form .ivu-form-item-label
      display: block;
      text-align left !important
      float: none !important
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
