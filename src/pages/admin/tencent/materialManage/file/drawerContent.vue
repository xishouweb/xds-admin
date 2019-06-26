<template>
  <div class="upload-file-material">
    <div style="padding: 50px" v-if="drawer.type == 'create'">
      <Form ref="formGroupName" :model="drawer.currentGroup" :rules="ruleGroupName" :label-width="90">
        <FormItem label="分组名称" :model="drawer.currentGroup" prop="name">
          <Input v-model="drawer.currentGroup.name" placeholder="请填写分组名称，不超过10个字" style="width: 330px" />
        </FormItem>
      </Form>
    </div>
    <!-- 上传 -->
    <div style="padding: 30px" v-else>
      <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="90">
      <FormItem label="选择方式">
            <Select v-model="formValidate.type" :disabled="drawer.disabled" >
                <Option :value="1">本地文件</Option>
                <Option :value="2">外链文件</Option>
            </Select>
        </FormItem>
        <!-- 文件链接地址 -->
        <div v-if="formValidate.type == 2">
          <FormItem label="文件地址" prop="url">
              <Input v-model="formValidate.url"  placeholder="请填写完整的文件链接地址" :disabled="drawer.disabled"></Input>
          </FormItem>
          <FormItem label="文件大小" prop="size">
              <!-- <InputNumber  @on-change="changeSize" :disabled="drawer.disabled" style="width: 120px;"> -->
              <Input v-model="formValidate.size" v-limitNumber="formValidate.size" :disabled="drawer.disabled" style="width: 120px;"></Input>
              </InputNumber>
              <Select v-model="formValidate.units" :disabled="drawer.disabled" style="width: 77px;">
                  <Option value="KB">KB</Option>
                  <Option value="MB">MB</Option>
              </Select>
          </FormItem>
        </div>
        <!-- 本地上传 -->
        <div v-else >
            <FormItem label="文件内容" prop="url" >
                <div v-if="file.size || formValidate.size">
                  <div class="upload-file" :class="{'disabled-upload': this.drawer.disabled}">
                    <FileTemp :file="formValidate" :showInfo="true"></FileTemp>
                  </div>
                  <div class="upload-remind-text" v-if="!uploading && formValidate.source">
                    <i class="icon" style="color: #329800">&#xe749;</i>上传成功！</div>
                  <div class="upload-remind-text" v-if="uploading">
                    <i class="icon spin-icon-load" style="display: inline-block;">&#xe630;</i> 上传中...
                  </div>
                </div>
                 <NewUploadImg ref="upload" v-model="file"
                  v-if="!drawer.disabled"
                  accept="*/doc,*/xls,*/ppt"
                  :limitSize="10"
                  :onExceededSize="onExceededSize"
                  :slice="true"
                  :isAuto="false"
                  :disabled="drawer.disabled"
                  :corTokenUrl="corTokenUrl">
                    <Button class="button">选择文件</Button>
                  </NewUploadImg>
                <div class="text" v-if="!drawer.disabled" style="color: #979899;font-size: 12px;line-height: 18px;">
                  <span>文件不能超过10M，支持常见文件格式：doc、xls、ppt、pdf、rar、zip</span>
                </div>
            </FormItem>
        </div>
        <FormItem label="文件名称" prop="name">
            <Input v-limitLength.21="formValidate.name" v-model="formValidate.name"  placeholder="文件名称，不超过21个字"></Input>
        </FormItem>
        <FormItem label="分组">
             <Select v-model="formValidate.groupId">
                  <Option  v-for="(item, index) in labelList.slice(1, labelList.length)" :key="index"
                  :value="item.groupId">{{item.name}}</Option>
              </Select>
        </FormItem>
        </Form>
    </div>

    <div class="drawer-footer">
      <Button style="width: 120px; margin-right: 15px" type="primary" @click="saveNew" :disabled="creating">保存</Button>
      <Button style="width: 120px; margin-right: 15px" @click="cancleDrawer">取消</Button>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { IsURL } from "@/utils/util.js"
import mixin from '../../components/mixin.js'
export default {
  name: 'drawerContent',
  components: {
    FileTemp: () => import("../Frame/table/FileTemp"),
    NewUploadImg: () => import('@/components/NewUploadImg.vue')
  },
  props: ['labelList', 'drawer', 'metarialType'],
  mixins: [mixin],
  data() {
     const validateUrl = (rule, value, callback) => {
          if (!IsURL(value)) {
              callback(new Error('请输入正确的链接地址'))
          } else {
            callback()
          }
      }
    return {
        uploading: false,
        file: {},
        corTokenUrl: {
          url: this.Path.updateGetCloudToken,
          params: {}
        },
        newLabelName: '',
        creating: false,
        uploadUrl: '',
        formValidate: {
            type: 1,
            name: '',
            url: '',
            groupId: '',
            source: "",
            units: "KB",
            size: 0,
            format: ''
        },
        ruleValidate: {
            name: [
                { required: true, message: '请填写文件名称', trigger: 'blur' }
            ],
            url: [
                { required: true, message: '请填写完整的文件链接地址', trigger: 'change' },
                { required: true, validator: validateUrl, trigger: 'change' }
            ],
            size: [
              { required: true, message: '请填文件大小', trigger: 'change' }
            ]
        },
        ruleGroupName: {
          name: [
            { required: true, message: '分组名称不可为空', trigger: 'blur' },
            { required: true, max: 10, message: '不能超过10个汉字', trigger: 'change' }
          ],
        }
    }
  },
  computed: {
    ...mapGetters({
      currPublic: 'publicAccount/curPublic',
      fileDefaultGroupId: 'tencent/fileDefaultGroupId',
      getFileGroupList: 'tencent/getFileGroupList'
    })
  },
  watch: {
    file(nv) {
      if (this.drawer.type === 'upload') {
        this.formValidate.name = this.formValidate.name || nv.name
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
        this.formValidate = { ...this.formValidate, ...this.deepCopy(this.drawer.currentMedia) }
        this.file = { ...this.file, url: this.drawer.currentMedia.cloudUrl, base64: "" }
      } else {
        this.file = {}
        this.formValidate = {
          type: 1,
          name: '',
          url: '',
          groupId: this.drawer.groupId || this.fileDefaultGroupId,
          source: "",
          units: "KB",
          size: 0,
          http: "http://"
        }
      }
    },
    handleSubmit () {
      this.defaultUrl()
      this.$refs.formValidate.validate((valid) => {
          if (valid) {
            if (this.formValidate.type === 1) {
              this.uploading = true
              this.handleSaveMedia()
            } else {
              this.saveOutlink()
            }
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
        this.modifyFile()
      } else {
        this.handleSubmit()
      }
    },
    async createNewGroup() {
      this.$refs.formGroupName.validate(async (valid) => {
        if (valid) {
          this.creating = true
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
          if (this.getFileGroupList.length > 50 && !this.drawer.currentGroup.groupId) {
            this.$Message.info('最多可新建50个分组')
            return
          }
          let res = await this.$post(this.Path.saveOrUpdateGroup, param)
          this.creating = false
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
    async modifyFile() {
      this.creating = true
      let file = this.drawer.currentMedia
      let param = {
          id: file.id,
          name: this.formValidate.name || file.name,
          groupId: this.formValidate.groupId || file.groupId,
          size: file.size,
          type: file.type,
          url: file.url,
          appAccountId: file.appAccountId
        }
      let res = await this.$post(this.Path.saveOrUpdateCssFile, param)
      this.creating = false
      if (res.data.code === 1) {
        this.$Message.success("保存成功！")
        this.drawer.show = false
        this.$emit('uploadSuccess')
      } else {
        this.$Message.error(res.data.message)
      }
    },
    changeSize(val) {
      this.formValidate.size = val
    },
    cancleDrawer() {
      this.drawer.show = false
      this.$emit('refreshGroupList')
    },
    defaultUrl() {
      if (this.formValidate.type === 1) {
        this.formValidate.url = process.env.SELF_BASE_URL
      }
    },
    async saveOutlink() {
      let units = {
        // 最终转换成byte
        KB: 1024,
        MB: 1204 * 1024
      }
      let param = {
        name: this.formValidate.name,
        groupId: this.formValidate.groupId,
        size: parseInt(this.formValidate.size) * units[this.formValidate.units],
        type: this.formValidate.type,
        url: this.formValidate.url,
        appAccountId: this.currPublic.appAccountId
      }
      this.creating = true
      let res = await this.$post(this.Path.saveOrUpdateCssFile, param)
      this.creating = false
      if (res.data.code === 1) {
        this.$Message.success("保存成功！")
        this.drawer.show = false
        this.file = {}
        this.$emit("uploadSuccess")
      } else {
        this.$Message.warning(res.data.message)
      }
    },
    handleSaveMedia() {
      let params = {
          metarialType: this.metarialType,
          groupId: this.formValidate.groupId,
          busiType: 3,
          title: this.formValidate.name,
          fileSourceType: this.formValidate.type,
          appAccountId: this.currPublic.appAccountId
        }
      this.saveMedia(params)
    },
    afterSaveMedia(data) {
      this.creating = false
      this.uploading = false
      this.formValidate.url = data.response
      this.drawer.show = false
      this.$emit("uploadSuccess")
    },
    saveMediaFail(data) {
      this.uploading = false
    },
    onExceededSize() {
      this.$Message.error("文件不能大于10M!")
    }
  }
}
</script>
<style lang="stylus">
  .upload-file-material
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
