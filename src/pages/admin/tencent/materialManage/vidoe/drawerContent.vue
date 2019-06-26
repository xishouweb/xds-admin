<template>
  <div class="upload-video-drawer">
    <div style="padding: 50px" v-if="drawer.type == 'create'">
      <Form ref="formGroupName" :model="drawer.currentGroup" :rules="ruleGroupName" :label-width="90">
        <FormItem label="分组名称" :model="drawer.currentGroup" prop="name">
          <Input v-model="drawer.currentGroup.name" placeholder="请填写分组名称，不超过10个字" style="width: 330px" />
        </FormItem>
      </Form>
    </div>

    <div style="padding: 30px" v-else>
      <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="90">
        <FormItem label="上传视频" prop="title">
          <Input v-limitLength.21="formValidate.title" v-model="formValidate.title" placeholder="视频名称，不超过21个字" :disabled="this.drawer.disabled"></Input>
        </FormItem>
        <FormItem label="视频内容" prop="source">
              <div>
                <div class="upload-file" v-if="file.name || formValidate.cloudUrl" :class="{'disabled-upload': this.drawer.disabled}">
                  <VideoTemp :video="formValidate" :showInfo="true"></VideoTemp>
                </div>
                <div class="upload-remind-text" v-if="!uploading && formValidate.source">
                  <i class="icon" style="color: #329800">&#xe749;</i>上传成功！</div>
                <div class="upload-remind-text" v-if="uploading">
                  <i class="icon spin-icon-load" style="display: inline-block;">&#xe630;</i> 上传中...
                </div>
              </div>
              <NewUploadImg class="upload-button" ref="upload" v-model="file"
              v-if="!drawer.disabled"
              :limitSize="10"
              accept="video/*"
              :isAuto="false"
              :corTokenUrl="corTokenUrl"
              :onFail="saveMediaFail"
              >
                <Button class="button">选择视频</Button>
              </NewUploadImg>
              <div class="text remind-text" v-if="!this.drawer.disabled" >
                <span>视频不能超过10M，超过10M的视频可至腾讯视频上传后添加，也可通过添加视频详情页链接以及公众号文章链接插入视频，视频时长不少于1秒，不多于10小时，支持MP4格式。</span>
              </div>
          </FormItem>
          <FormItem label="视频介绍" prop="description" class="description-container">
              <Input v-model="formValidate.description" type="textarea" :autosize="{minRows: 4,maxRows: 8}" placeholder="请填写视频介绍" :disabled="this.drawer.disabled"></Input>
              <div class="description-badge text">{{formValidate.description.length}}/120</div>
          </FormItem>
          <FormItem label="分组">
              <Select v-model="formValidate.groupId">
                  <Option v-for="(item, index) in labelList.slice(1, labelList.length)" :key="index" :value="item.groupId">{{item.name}}</Option>
              </Select>
          </FormItem>
      </Form>
    </div>

    <div class="drawer-footer">
      <Button style="width: 120px; margin-right: 15px" type="primary" @click="saveNew" :disabled="uploading">保存</Button>
      <Button style="width: 120px; margin-right: 15px" @click="cancleDrawer">取消</Button>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { getCookieSession } from "@/utils/cookies"
import mixin from '../../components/mixin.js'

export default {
  name: 'drawerContent',
  components: {
    VideoTemp: () => import("../Frame/table/vidoeTemp"),
    NewUploadImg: () => import('@/components/NewUploadImg.vue')
  },
  props: ['labelList', 'drawer', 'metarialType'],
  mixins: [mixin],
  data() {
    return {
        file: {},
        corTokenUrl: {
          url: this.Path.updateGetCloudToken,
          params: {}
        },
        newLabelName: '',
        uploadUrl: '',
        formValidate: {
            title: '',
            url: '',
            description: '',
            picUrl: '',
            groupId: ""
        },
        ruleValidate: {
            title: [
                { required: true, message: '请填写标题', trigger: 'blur' }
            ],
            source: [
                { required: true, message: '请选择视频', trigger: 'change' }
            ],
            description: [
                { required: true, message: '请选填写视频介绍', trigger: 'change' }
            ],
        },
        ruleGroupName: {
          name: [
            { required: true, message: '分组名称不可为空', trigger: 'blur' },
            { required: true, max: 10, message: '不能超过10个汉字', trigger: 'change' }
          ],
        },
        uploading: false
    }
  },
  computed: {
    ...mapGetters({
      currPublic: 'publicAccount/curPublic',
      videoDefaultGroupId: 'tencent/videoDefaultGroupId',
      getVideoGroupList: 'tencent/getVideoGroupList'
    })
  },
  watch: {
    file(nv) {
      if (this.drawer.type === 'upload') {
        this.formValidate.title = this.formValidate.title || nv.name
        this.formValidate.size = nv.size
      }
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      this.uploading = false
      if (this.drawer.type === 'modify') {
        this.formValidate = this.deepCopy(this.drawer.currentMedia)
        this.file = { ...this.file, url: this.drawer.currentMedia.cloudUrl, base64: "" }
      } else {
        this.file = {}
        this.formValidate = {
            title: '',
            url: '',
            description: '',
            picUrl: '',
            groupId: this.drawer.groupId || this.videoDefaultGroupId
        }
      }
    },
    handleSubmit () {
      this.$refs.formValidate.validate((valid) => {
          if (valid) {
            this.handleSaveMedia()
          } else {
            this.uploading = false
          }
      })
    },
    handleReset (name) {
      this.$refs.formValidate.resetFields()
    },
    saveNew() {
      if (this.drawer.type === 'create') {
        this.createNewGroup()
      } else if (this.drawer.type === 'modify') {
        this.updatedMedia()
      } else {
        this.formValidate.source = this.file.name
        this.handleSubmit()
      }
    },
    async createNewGroup() {
      this.uploading = true
      this.$refs.formGroupName.validate(async (valid) => {
        if (valid) {
            let param = {
                groupId: this.drawer.currentGroup.groupId,
                appAccountId: this.currPublic.appAccountId,
                name: this.drawer.currentGroup.name,
                type: this.metarialType
            }
            if (!this.drawer.currentGroup.name.trim()) {
              this.$Message.info('请输入分组名称')
              return
            }
            if (this.getVideoGroupList.length > 50 && !this.drawer.currentGroup.groupId) {
              this.$Message.info('最多可新建50个分组')
              return
            }
            let res = await this.$post(this.Path.saveOrUpdateGroup, param)
            res = res.data
            this.uploading = false
            if (res.code === 1) {
              this.$Message.success('保存成功！')
              this.drawer.show = false
              this.$emit('refreshLabelList')
            } else {
              this.$Message.error(res.message)
            }
        }
      })
    },
    async updatedMedia() {
      this.uploading = true
      let param = {
          groupId: this.formValidate.groupId || this.drawer.currentMedia.groupId,
          mediaId: this.drawer.currentMedia.mediaId,
          appAccountId: this.currPublic.appAccountId,
          type: this.metarialType
      }
      let res = await this.$post(this.Path.updateMedia, param)
      this.drawer.show = false
      this.$emit('uploadSuccess')
    },
    cancleDrawer() {
      this.drawer.show = false
    },
    handleSaveMedia() {
      this.uploading = true
      let params = {
          metarialType: this.metarialType,
          groupId: this.formValidate.groupId,
          busiType: 1,
          title: this.formValidate.title,
          appAccountId: this.currPublic.appAccountId,
          desc: this.formValidate.description
        }
      this.saveMedia(params)
    },
    afterSaveMedia(data) {
      this.uploading = false
      this.formValidate.source = data.response
      this.$emit("uploadSuccess")
      this.drawer.show = false
    },
    saveMediaFail(data) {
      this.uploading = false
    }
  }
}
</script>
<style lang="stylus">
  .upload-video-drawer
    .img
      width: 180px;
      height: 100px;
      line-height 20px
      text-align center
      border: 1px dashed #e3e4e5;

      i
        display inline-block
        margin-top 30px
        font-size 30px
        cursor pointer
      span
        width: 60px;
        font-size 14px;
        color: #cacbcc;
      img
        max-width 100%
        max-height 100%
    .drawer-footer
      border-top: solid 1px #edeff0;
      position: absolute;
      background-color: #fff;
      left: 0;
      bottom: 0;
      width: 100%;
      height: 60px;
      line-height: 60px;
      text-align: center;
      z-index 12
    .description-container
      position relative
    .description-badge
      position absolute
      bottom 0
      right 2px
      height: 25px;
      color: #cacbcc;
    .remind-text
      color: #979899
      font-size: 12px
      line-height: 18px
    .upload-file
      padding 33px 20px
      border-radius: 3px;
      border: solid 1px #e3e4e5;
      margin-bottom 5px
    .upload-remind-text
      padding-bottom 10px
    .disabled-upload
      background-color: #f2f4f5;
      cursor not-allowed
      .icon
        color: #cacbcc !important
      span
        color: #cacbcc;
</style>
