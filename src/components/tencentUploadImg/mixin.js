import { getCookieSession } from "@/utils/cookies"
import { fileSuffix } from "@/utils/util.js"
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      file: {},
      corTokenUrl: {
        url: this.Path.updateGetCloudToken,
        params: {}
      },
      queryMediaExitedTime: 2,
      uploadApi: this.Path.autoSaveMedia,
      format: "doc,xls,ppt,pdf,rar,zip",
      uploadAction: "/api/tempStorage" // 自动上传
    }
  },
  computed: {
    ...mapGetters({
      currPublic: "publicAccount/curPublic"
    })
  },
  methods: {
    saveMedia: async function (params) {
      /**
       * params = {
            type: this.metarialType,
            groupId: this.groupId,
            size: this.file.size,
            busiType: 1,
            appAccountId: this.currPublic.appAccountId
            desc: '',
            fileSourceType:
            fileOnlinePath
          };
       */
      // 1.合并参数
      let param = {
        ...params,
        size: this.file.size,
        name: this.file.name
      }

      // 2.请求corTokenUrl， 并拿到 Tencent 云的保存地址
      this.corTokenUrl.params = {
        type: param.metarialType,
        groupId: param.groupId,
        size: param.size,
        busiType: param.busiType,
        appAccountId: param.appAccountId
      }
      const { response, mediaId } = await this.$refs["upload"].postCor(this.file.file)
      param.response = response
      param.mediaId = mediaId

      // 3.提交文件到node服务器
      if (param.metarialType !== "file") {
        if (param.fileOnlinePath) {
          this.autoSaveMedia(param)
        } else {
          this.notFile(param)
        }
      } else {
        this.isFile(param)
      }
    },
    async notFile(param) {
      // session, add type  node 3 image, audio, video(介绍), file
      const formData = new FormData()
      formData.append("seqTokenId", this.file.seqTokenId)
      formData.append("title", param.title || this.file.name)
      formData.append("file", this.file.file)
      formData.append("sessionId", getCookieSession())
      formData.append("appAccountId", param.appAccountId)
      formData.append("cloudUrl", param.response)
      formData.append("metarialType", param.metarialType)
      if (param.metarialType === "video") {
        // 视频媒体必须传 desc
        formData.append("desc", param.desc || this.file.name)
      }
      let res = await this.$uploadPost("/api/wxPublicAccount/syncSaveMedia", formData)
      if (res.data.code === 1) {
        // 异步确认资源上传成功
        // 图片在文章配图时没有media
        !res.data.mediaId && (res.data.mediaId = param.mediaId)
        this.queryMediaExited({ ...param, ...res.data })
      } else {
        this.$Message.warning(res.data.message)
      }
    },
    autoSaveMedia: async function (param) {
      // session, add type  node 3 image, audio, video(介绍), file
      const params = {
        "seqTokenId": this.file.seqTokenId,
        "appAccountId": param.appAccountId,
        "title": param.fileName || this.file.name,
        "cloudUrl": param.response,
        "metarialType": param.metarialType,
        "sessionId": getCookieSession(),
        "fileOnlinePath": param.fileOnlinePath
      }
      if (param.metarialType === "video") {
        // 视频媒体必须传 desc
        params.desc = param.desc || this.file.name
      }
      let res = await this.$post(this.Path.autoSaveMedia, params)
      if (res.data.code === 1) {
        // 异步确认资源上传成功
        this.queryMediaExited({ ...param, ...res.data })
      } else {
        this.$Message.warning(res.data.message)
      }
    },
    async queryMediaExited(data) {
      let param = {
        mediaId: data.mediaId,
        type: data.metarialType,
        appAccountId: data.appAccountId,
        busiType: data.busiType
      }
      let res = await this.$post(this.Path.queryMediaExited, param)
      if (res.data.code === 1) {
        this.$Message.success("保存成功！")
        this.file = {}
        this.afterSaveMedia && this.afterSaveMedia({ ...data, ...res.data })
      } else {
        if (this.queryMediaExitedTime) {
          setTimeout(() => {
            this.queryMediaExited(data)
          }, 3000)
          this.queryMediaExitedTime--
        } else {
          this.queryMediaExitedTime = 2
          this.saveMediaFail && this.saveMediaFail()
          this.$Message.error(res.data.message)
        }
      }
    },
    async isFile(param) {
      if (!this.format.includes(fileSuffix(this.file.name))) {
        this.$Message.error("文件格式错误！")
        this.file = {}
        return
      }

      let params = {
        format: fileSuffix(this.file.name),
        name: this.file.name,
        size: this.file.size,
        appAccountId: param.appAccountId,
        groupId: param.groupId,
        type: param.fileSourceType, // 1：本地文件 ， 2：资源文件
        url: param.response
      }

      let res = await this.$post(this.Path.saveOrUpdateCssFile, params)
      if (res.data.code === 1) {
        this.$Message.success("保存成功！")
        this.afterSaveMedia &&
          this.afterSaveMedia({ response: param.response, ...res.data })
      } else {
        this.$Message.error(res.data.message)
      }
      this.file = {}
    },
  }
}
