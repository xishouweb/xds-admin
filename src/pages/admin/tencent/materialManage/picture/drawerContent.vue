<template>
  <div class="uploadPic">
    <div style="padding: 50px" v-if="drawer.type == 'create'">
      <Form ref="formGroupName" :model="drawer.currentGroup" :rules="ruleGroupName" :label-width="90">
        <FormItem label="分组名称" :model="drawer.currentGroup" prop="name">
          <Input v-model="drawer.currentGroup.name" placeholder="请填写分组名称，不超过10个字" style="width: 330px" />
        </FormItem>
      </Form>
    </div>

    <div style="padding: 30px" v-else>
      <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="90">
        <FormItem label="图片" prop="source" >
              <NewUploadImg ref="upload" type="coverImg" v-model="file"
              :isAuto="false"
              :limitSize="limitSize"
              :disabled="drawer.disabled"
              :corTokenUrl="corTokenUrl">
              </NewUploadImg>
              <div style="color: #979899;font-size: 12px;line-height: 18px;">
                <span>图片大小不超过{{limitSize}}M，支持bmp/png/jpeg/jpg/gif格式</span>
              </div>
          </FormItem>
          <FormItem label="图片标题" prop="title">
              <Input v-model="formValidate.title" ref="input" placeholder="图片标题，不超过12个字" v-limitLength.12="formValidate.title" :disabled="drawer.disabled"></Input>
          </FormItem>
          <FormItem label="分组">
              <Select v-model="formValidate.groupId">
                  <Option v-for="(item, index) in labelList.slice(1, labelList.length)" :key="index"
                    v-if="item.name != '文章配图'"
                    @click.native="selectedGroup(item, item.groupType)"
                  :value="item.groupId">{{item.name}}</Option>
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
    NewUploadImg: () => import('@/components/NewUploadImg.vue')
  },
  props: ['labelList', 'drawer', 'metarialType'],
  mixins: [mixin],
  data() {
    return {
        file: {},
        newLabelName: '',
        uploading: false,
        formValidate: {
            title: '',
            url: '',
            desc: '',
            picUrl: '',
            groupId: ''
        },
        limitSize: 2,
        corTokenUrl: {
          url: this.Path.updateGetCloudToken,
          params: {}
        },
        ruleValidate: {
          title: [
            { required: true, message: '请输入图片标题', trigger: 'blur' }
          ],
          source: [
            { required: true, message: '请上传图片', trigger: 'change' }
          ],
        },
        ruleGroupName: {
          name: [
            { required: true, message: '分组名称不可为空', trigger: 'blur' },
            { required: true, max: 10, message: '不能超过10个汉字', trigger: 'change' }
          ],
        }
    }
  },
  watch: {
    file(nv) {
      if (this.drawer.type === "upload") {
        this.formValidate.title = this.formValidate.title || nv.name
        this.formValidate.size = nv.size
      }
    },
  },
  computed: {
    ...mapGetters({
      currPublic: 'publicAccount/curPublic',
      imageDefaultGroupId: 'tencent/imageDefaultGroupId',
      getImageGroupList: 'tencent/getImageGroupList'
    })
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      if (this.drawer.type === "modify") {
        this.formValidate = this.deepCopy(this.drawer.currentMedia)
        this.file = { ...this.file, url: this.drawer.currentMedia.cloudUrl, base64: "" }
      } else {
        this.file = {}
        this.formValidate = {
          title: "",
          url: "",
          groupId: this.drawer.groupId || this.imageDefaultGroupId,
          source: "",
          desc: ""
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
    selectedGroup(item, type) {
      type === 1 ? (this.limitSize = 1) : (this.limitSize = 2)
    },
    saveNew() {
      if (this.drawer.type === 'create') {
        this.createNewGroup()
      } else if (this.drawer.type === 'modify') {
        this.imgModify()
      } else {
        // 保存提交
        this.formValidate.source = this.file.name
        this.handleSubmit()
      }
    },
    async createNewGroup() {
      if (this.drawer.currentGroup.groupId) {
        this.drawer.show = false
        return
      }
      this.$refs.formGroupName.validate(async (valid) => {
        if (valid) {
            let param = {
                groupId: this.drawer.currentGroup.groupId,
                appAccountId: this.currPublic.appAccountId,
                name: this.drawer.currentGroup.name,
                type: this.metarialType
            }
            if (!this.drawer.currentGroup.name || !this.drawer.currentGroup.name.trim()) {
              this.$Message.warning('请输入分组名称')
              return
            }
            if (this.getImageGroupList.length > 50 && !this.drawer.currentGroup.groupId) {
              this.$Message.info('最多可新建50个分组')
              return
            }
            let res = await this.$post(this.Path.saveOrUpdateGroup, param)
            if (res.data.code === 1) {
              this.$Message.success('保存成功！')
              this.drawer.show = false
              this.$emit('refreshLabelList')
            } else {
              this.$Message.warning(res.data.message)
            }
          }
      })
    },
    async imgModify() {
      let param = {
        type: this.metarialType,
        mediaId: this.drawer.currentMedia.mediaId,
        groupId: this.formValidate.groupId || this.drawer.currentMedia.groupId,
        appAccountId: this.drawer.currentMedia.appAccountId,
      }
      let res = await this.$post(this.Path.updateMedia, param)
      if (res.data.code === 1) {
        this.$Message.success('修改成功！')
        this.drawer.show = false
        this.$emit('refreshLabelList')
      } else {
        this.$Message.warning(res.data.message)
      }
    },
    cancleDrawer() {
      this.drawer.show = false
      this.$emit('uploadSuccess')
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
    saveMediaFail() {
      this.uploading = false
    }
  }
}
</script>
<style lang="stylus">
  .uploadPic
    .ivu-form-item-label
      text-align left !important
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
</style>
