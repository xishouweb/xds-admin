<template>
  <div class="uploadPic">

    <div style="padding: 50px" v-if="drawer.type == 'create'">
      <Form ref="formGroupName" :model="drawer.currentGroup" :rules="ruleGroupName" :label-width="90">
        <FormItem label="分组名称" :model="drawer.currentGroup" prop="name">
          <Input v-model="drawer.currentGroup.name" placeholder="请填写分组名称，不超过10个字" style="width: 330px" />
        </FormItem>
      </Form>
    </div>
    <!-- 上传 -->
    <div style="padding: 30px" v-else-if="drawer.type == 'upload'">
      <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="90">
        <FormItem label="语音内容" prop="size">
              <div v-if="file.size" class="upload-file">
                  <AudioTemp :audio="formValidate" :showInfo="true"></AudioTemp>
              </div>

              <div class="upload-remind-text" v-if="!uploading && formValidate.source"><i class="icon" style="color: #329800">&#xe749;</i>上传成功！</div>
              <div class="upload-remind-text" v-if="uploading && file.size">
                  <i class="icon spin-icon-load" style="display: inline-block;">&#xe630;</i> 上传中...
              </div>
              <NewUploadImg ref="upload" v-model="file"
              accept="audio/*"
              :isAuto="false"
              :disabled="drawer.disabled"
              :corTokenUrl="corTokenUrl">
                <Button class="button">选择语音</Button>
              </NewUploadImg>
              <div style="color: #979899;font-size: 12px;line-height: 18px;">
                <span>格式支持mp3、wma、wav、amr，文件大小不超过2M，语音时长不超过60S</span>
              </div>
          </FormItem>
          <FormItem label="语音名称" prop="title" >
              <Input v-limitLength.14="formValidate.title" v-model="formValidate.title" placeholder="语音名称，不超过14个字" ></Input>
          </FormItem>
          <FormItem label="分组">
              <Select v-model="formValidate.groupId">
                  <Option v-for="(item, index) in labelList.slice(1, labelList.length)" :key="index" :value="item.groupId">{{item.name}}</Option>
              </Select>
          </FormItem>
      </Form>
    </div>

    <!-- 修改 -->
    <div style="padding: 30px" v-else>
      <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="90">
        <FormItem label="语音内容" prop="source" :disabled="drawer.type == 'modify'">
              <div style="{background: #f3f3f3}" class="upload-file" :class="{'disabled-upload': this.drawer.disabled}">
                  <AudioTemp :audio="formValidate" :showInfo="true"></AudioTemp>
              </div>
          </FormItem>
          <FormItem label="语音名称" prop="title" >
              <Input v-limitLength.14="formValidate.title" v-model="formValidate.title" placeholder="语音名称，不超过14个字" :disabled="this.drawer.disabled"></Input>
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
import mixin from '../../components/mixin.js'
export default {
  name: 'drawerContent',
  components: {
    AudioTemp: () => import("../Frame/table/AudioTemp"),
    NewUploadImg: () => import('@/components/NewUploadImg.vue')
  },
  props: ['labelList', 'drawer', 'metarialType'],
  mixins: [mixin],
  data() {
    return {
        file: {},
        newLabelName: '',
        corTokenUrl: {
          url: this.Path.updateGetCloudToken,
          params: {}
        },
        formValidate: {
            title: '',
            url: '',
            groupId: '',
            source: "",
            size: ""
        },
        ruleValidate: {
            title: [
                { required: true, message: '请输入语音名称', trigger: 'blur' }
            ],
            size: [
              { required: true, type: "number", message: '请选择语音文件', trigger: 'change' },
              { required: true, type: "number", max: 2 * 1024 * 1024, message: '语音文件不能大于2M', trigger: 'change' }
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
      audioDefaultGroupId: 'tencent/audioDefaultGroupId',
      getAudioGroupList: 'tencent/getAudioGroupList'
    })
  },
  watch: {
    file(nv) {
      if (this.drawer.type === "upload") {
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
            groupId: this.drawer.groupId || this.audioDefaultGroupId,
            size: ''
        }
      }
    },
    handleSubmit () {
        this.$refs.formValidate.validate((valid) => {
            if (valid) {
              this.uploading = true
              this.handleSaveMedia()
            }
        })
    },
    handleReset (name) {
        this.$refs.formValidate.resetFields()
    },
    saveNew() {
      if (this.drawer.type === 'create') {
        this.createNewGroup()
      } else if (this.drawer.type === 'upload') {
        // 保存提交
        this.formValidate.source = this.file.name
        this.handleSubmit()
      } else {
        this.updatedMedia()
      }
    },
    async createNewGroup() {
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
          if (this.getAudioGroupList.length > 50 && !this.drawer.currentGroup.groupId) {
            this.$Message.info('最多可新建50个分组')
            return
          }
          let res = await this.$post(this.Path.saveOrUpdateGroup, param)
          res = res.data
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
      let param = {
          groupId: this.formValidate.groupId || this.drawer.currentMedia.groupId,
          mediaId: this.drawer.currentMedia.mediaId,
          appAccountId: this.currPublic.appAccountId,
          type: this.metarialType
      }
      let res = await this.$post(this.Path.updateMedia, param)
      if (res.data.code === 1) {
        this.$Message.success('修改成功！')
        this.drawer.show = false
        this.$emit('uploadSuccess')
      } else {
        this.$Message.warning(res.data.message)
      }
    },
    cancleDrawer() {
      this.drawer.show = false
    },
    handleSaveMedia() {
      let params = {
          metarialType: this.metarialType,
          groupId: this.formValidate.groupId,
          title: this.formValidate.title,
          busiType: 1,
          appAccountId: this.currPublic.appAccountId
        }
      this.saveMedia(params)
    },
    afterSaveMedia(data) {
      this.uploading = false
      this.formValidate.source = data.response
      this.drawer.show = false
      this.$emit("uploadSuccess")
    },
    saveMediaFail(data) {
      this.uploading = false
    }
  }
}
</script>
<style lang="stylus">
  .uploadPic
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
