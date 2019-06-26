function sortGrouplist(data) {
  let total = 0
  data.forEach(item => {
    total += item.count || 0
    item.name = item.groupName
  })

  return [{ name: "全部", count: total }, ...data] || []
}



export default {
  data() {
    return {}
  },
  methods: {
    // 一键清理
    deleteTmpMediaByGroup: async function(params) {
      let res = await this.$post(this.Path.deleteTmpMediaByGroup, params)
      res = res.data
      return new Promise((resolve, reject) => {
        if (res.code === 1) {
          resolve(res)
        } else {
          reject(res)
        }
      })
    },
    // 批量删除云服务空间文件
    deleteCssTmpMedia: async function(params) {
      let res = await this.$post(this.Path.deleteCssTmpMedia, params)
      res = res.data
      return new Promise((resolve, reject) => {
        if (res.code === 1) {
          resolve(res)
        } else {
          reject(res)
        }
      })
    },
    // 根据类型获得分组列表
    queryMsgGroup: async function(params) {
      let res = await this.$post(this.Path.queryMsgGroup, params)
      res = res.data
      return new Promise((resolve, reject) => {
        if (res.code === 1) {
          resolve(sortGrouplist(res.data))
        } else {
          reject(res)
        }
      })
    },
    // 获取视频素材列表
    queryTmpMediaVideoList: async function(params) {
      let res = await this.$post(this.Path.queryTmpMediaVideoList, params)
      res = res.data
      return new Promise((resolve, reject) => {
        if (res.code === 1) {
          resolve(res)
        } else {
          reject(res)
        }
      })
    },
    // 获取语音素材列表
    queryTmpMediaVoiceList: async function(params) {
      let res = await this.$post(this.Path.queryTmpMediaVoiceList, params)
      res = res.data
      return new Promise((resolve, reject) => {
        if (res.code === 1) {
          resolve(res)
        } else {
          reject(res)
        }
      })
    },
    // 获取文件列表
    queryTmpFileList: async function(params) {
      let res = await this.$post(this.Path.queryTmpFileList, params)
      res = res.data
      return new Promise((resolve, reject) => {
        if (res.code === 1) {
          resolve(res)
        } else {
          resolve(res)
        }
      })
    },
    // 获取图片素材列表
    queryTmpMediaImgList: async function(params) {
      let res = await this.$post(this.Path.queryTmpMediaImgList, params)
      res = res.data
      return new Promise((resolve, reject) => {
        if (res.code === 1) {
          resolve(res)
        } else {
          resolve(res)
        }
      })
    },
    errorCloudData(res) {
      if (res.code === 5301) {
        this.modalInfo.deleteMsg = "正在删除中……"
        this.modalInfo.showModal = true
        this.modalInfo.type = 3
      } else {
        this.$Message.error(res.mmessage)
      }
    }
  }
}
