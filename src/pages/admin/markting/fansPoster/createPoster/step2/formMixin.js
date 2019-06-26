import { localSaveOrRead } from "@/utils/util.js"
export default {
  data() {
    return {
      isSaving: false,
      autoTags: [1, 1, 1], // 是否自动打标签
      formValidate: {
        isGeneratePosterReply: null, // 生成海报回复
        generatePosterReplyContent: null,
        isActivityProgressReply: null, // 活动进展通知
        activityProgressReplyContent: null,
        isActivityCompletionReply: null, // 活动完成通知
        activityCompletionReplyContent: null
      }
    }
  },
  watch: {
    autoTags: { // 开关状态变更
      handler(newV) {
        this.$root.Bus.$emit('calcScrollHeight') // 重新计算页面高度并设置滚动条高度
        let arr = ['isGeneratePosterReply', 'isActivityProgressReply', 'isActivityCompletionReply']
        arr.forEach((v, i) => {
          this.formValidate[v] = newV[i] ? 'REPLAY' : 'NO_REPLAY'
        })
      },
      deep: true
    }
  },
  methods: {
    // 提交保存
    async saveFrom() {
      let param = {
        appAccountId: this.curPublic.appAccountId,
        ...this.formValidate }
      // 修改的时候回额外多出的参数
      delete param.createId
      delete param.createTime
      delete param.actualFollowNum
      delete param.followersNum
      delete param.cancelFollowNum
      delete param.invitedNum
      delete param.isAttentionReply
      delete param.participateNum
      delete param.scanNum
      delete param.status
      delete param.updateId
      delete param.updateTime
      delete param.replyDetailDtoList
      delete param.activeTagList
      delete param.receiveTagList
      delete param.receiveTagtype
      delete param.activityCompletionReply
      delete param.activityProgressReply
      // "xds-10-1-1255528578.cos.ap-shanghai.myqcloud.com/img/poster/25/1-1-1e49a17f31ce144bd8e56794c6523f1d.jpg"
      param.backgroundImage = param.backgroundImage.replace(/.*\.com(.*)$/, "$1")
      // param.generatePosterReplyContent = filterTags(param.generatePosterReplyContent)
      let res = await this.saveOrUpdatePostertTemplate(param)
      this.isSaving = false
      if (res.code === 1) {
        if (this.$route.query.posterId) { // modify 提示
          this.$Message.success('粉丝海报修改成功')
        } else {
          this.$Message.success('裂变海报模板创建成功。')
        }
        this.afterSave(res)
      } else {
        this.$Message.error(res.message)
      }
    },
    // 上传第一步的图片
    async beforeSave() {
      if (this.file) {
        const { response } = await this.wxUpload.uploding()
        if (response) {
          this.formValidate.backgroundImage = response.replace(/.*\.com(.*)$/, "$1")
          this.saveFrom()
        } else {
          this.isSaving = false
          this.$Message.error('背景图上传失败')
        }
      } else if (!this.file && this.formValidate.backgroundImage) {
        this.saveFrom()
      } else if (!this.file && !this.formValidate.backgroundImage) {
        this.$Message.error('请返回上一步，并选择图片')
      }
    },
    // 保存成功后
    afterSave(data) {
      if (!localSaveOrRead('fromPage') || localSaveOrRead('fromPage') === 'actionPoster') {
        this.$router.push({name: "actionPoster"})
      } else if (localSaveOrRead('fromPage') === 'posterList') {
        this.$router.push({ name: "posterList",query: {id: data.data, name: this.formValidate.posterTemplateName} })
      } else {
        this.setNewCreatedPoster(data.data)
        this.$router.push({name: localSaveOrRead('fromPage')})
      }
      this.saveFormData()
    },
    async handleSubmit (name) { // 点击确定按钮
      if (this.$route.meta.leaveIntercept !== undefined) {
        this.$route.meta.leaveIntercept = false
      }
      // 活动进展通知
      if (this.formValidate.isGeneratePosterReply === 'REPLAY' && !this.formValidate.generatePosterReplyContent) {
        this.$Message.info("请输入生成海报回复")
        return
      }
      if (this.formValidate.isActivityProgressReply === 'REPLAY' && !this.formValidate.activityProgressReplyContent) {
        this.$Message.info("请选择活动进展通知")
        return
      }
      if (this.formValidate.isActivityCompletionReply === 'REPLAY' && !this.formValidate.activityCompletionReplyContent) {
        this.$Message.info("请选择活动完成通知")
        return
      }
      if (!this.isSaving) {
        this.isSaving = true
        this.beforeSave()
      }
    },
    handleReset (name) {
        this.$refs[name].resetFields()
        this.$router.push({name: "actionPoster"})
    }
  }
}
