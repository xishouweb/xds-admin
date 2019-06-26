import { getCookieSession } from "@/utils/cookies"

export default {
  data() {
    return {
      file: {},
      corTokenUrl: {
        url: this.Path.updateGetCloudToken,
        params: {}
      },
      imageGroupId: null
    }
  },
  created() {
    this.GetImageGroupId()
  },
  methods: {
    async GetImageGroupId() {
      // 获取标签
      if (!this.currPublic) return
      let param = {
        appAccountId: this.currPublic.appAccountId,
        type: 'image'
      }
      let res = await this.$post(this.Path.queryCssGroup, param)
      try {
        res.data.data.sort((item1, item2) => { return item1.groupOrder - item2.groupOrder })
        this.imageGroupId = res.data.data[0].groupId
      } catch (err) {
        console.error(err)
      }
    },
    uploadSuccess: function (params) {
      this.saveMedia(params)
    },
    saveMedia: async function(data) {
      this.corTokenUrl.params = {
        type: 'image',
        groupId: this.imageGroupId,
        size: this.file.size,
        busiType: 1,
        appAccountId: this.currPublic.appAccountId
      }
      const response = await this.$refs["upload"].postCor(this.file.file)
      this.formValidate.picurl = response
      // session, add type  node 3 image, audio, video(介绍), file
      const param = {
        "seqTokenId": this.file.seqTokenId,
        "appAccountId": this.currPublic.appAccountId,
        "title": this.file.name,
        "cloudUrl": response,
        "metarialType": this.metarialType,
        "sessionId": getCookieSession(),
        fileOnlinePath: data
      }
      let res = await this.$post(this.Path.autoSaveMedia, param)
      if (res.data.code === 1) {
        this.$Message.success("保存成功！")
        this.formValidate.thumbMediaId = res.data.mediaId
        this.file = {}
      } else {
        this.$Message.warning(res.data.message)
      }
    }
  }
}
