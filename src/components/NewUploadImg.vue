/**
 *   limitSize:     // 单位： M
 *   uploadServer:  // 接受文件的服务器 node服务器
 *   uploadUrl:     // 上传接口
 *   overviewUrl:   // 读取图片接口
 *   uploadSucess:  // 上传成功事件
 *   uploadFail:    // 上传失败事件
 */
<template>
<div class="ykt-owly-upload">
    <div class="ykt-owly-upload-content" @click.stop="handleClick">
        <input class="ykt-owly-upload-input" :accept="accept" @change="handleChange" type="file" ref="input" id="ykt-owly-upload" v-if="!disabled">
        <div class="ykt-owly-upload-action" v-if="$slots.default">
          <slot></slot>
        </div>
        <div class="ykt-owly-upload-action" v-else>
            <Button v-if="type === 'button'" class="ykt-owly-upload-button">上传文件</Button>
            <div v-if="type === 'coverImg'" class="ykt-owly-upload-coverImg">
              <span v-if="!file.url && !file.base64">
                <i class="icon">&#xe623;</i> <br/>点击添加图片
              </span>
              <img v-else :src="file | urlFilter" alt="图片">
            </div>
            <div v-if="type === 'avatar'" class="ykt-owly-upload-avatar">
              <span v-if="!file.url && !file.base64">
                <i class="icon">&#xe623;</i>
                 <br/>上传
                </span>
                <img v-else :src="file | urlFilter " alt="图片">
            </div>
        </div>
    </div>
</div>
</template>

<script>
// 只支持上传单张图片, 替换删除之前图片， 校验文件大小， 是否只考虑上传到腾讯云中算成功
// 选取值，再根据参数上传参数
import COS from 'cos-js-sdk-v5'
import { fileSuffix } from "@/utils/util.js"
export default {
  name: 'uploadfile',
  props: {
    value: {
      // 默认值
      type: Object,
      default() {
        return {}
      }
    },
    business: {
      type: String,
      default: ''
    },
    action: {
      // 上传到其他服务器，如本地文件服务，存在上传到其他服务器
      type: String,
    },
    corTokenUrl: {
      // 获取临时
      type: Object,
      default() {
        return {
          url: '/api/getCorUploadToken',
          params: {}
        }
      }
    },
    isAuto: {
      // 是否自动上传,,由于和其他资源一起上传，不设置自动上传
      type: Boolean,
      default: true
    },
    isCor: {
      // 是否启动腾讯云上传
      type: Boolean,
      default: true
    },
    limitSize: {
      // 单位： M
      type: Number,
      default: 3
    },
    type: {
      // 样式类型
      type: String,
      default: 'button'
    },
    base64: {
      // base64
      type: Boolean,
      default: true
    },
    accept: {
      // 文件可接受类型
      type: String,
      default: 'image/*'
    },
    format: {
      // 用于格式校验提示
      type: Array,
      default () {
          return []
      }
    },
    multiple: {
      // 多图上传
      type: Boolean,
      default: false
    },
    slice: {
      // 分片上传
      type: Boolean,
      default: false
    },
    onSuccess: {
      // 上传成功钩子
      type: Function,
      default () {
          return {}
      }
    },
    onFail: {
      // 上传失败钩子
      type: Function,
      default () {
          return {}
      }
    },
    onExceededSize: {
      // 文件大小验证钩子
      type: Function,
      default () {
          return {}
      }
    },
    onFormatError: {
      type: Function,
      default () {
        return {}
      }
    },
    disabled: {
      type: Boolean,
      default () {
        return false
      }
    }
  },
  data() {
    return {
      cor: null,
      Bucket: '',
      Region: '',
      path: '',
      token: {},
      file: this.value || {} // 文件对象, 包含文件name, size, url, file, base64
    }
  },
  watch: {
    value(val) {
      this.file = val
    }
  },
  created() {
    if (this.isCor) { // 实例化
      this.cos = new COS({
        getAuthorization: (options, callback) => { // 每次执行操作都会调用
          callback(this.token)
        }
      })
    }
  },
  beforeDestroy() {
    this.cos = null
  },
  methods: {
    handleClick() {
      this.$refs.input.click()
    },
    handleChange(e) {
      const files = e.target.files
      if (!files) {
          return
      }
      // 将原来的文件腾讯云文件删除
      if (this.file.url && this.file.url.includes('myqcloud.com')) {
        this.deleteCor(this.file.url)
      }
      this.uploadFiles(files)
      this.$refs.input.value = null
    },
    uploadFiles (files) {
      let postFiles = Array.prototype.slice.call(files)
      if (!this.multiple) postFiles = postFiles.slice(0, 1)
      if (postFiles.length === 0) return
      postFiles.forEach(file => {
          this.upload(file) // 上传单个文件
      })
    },
    upload (file) { // 用于文件校验过滤
      // check format
      if (this.format.length) {
        const fileType = file.name.split('.').pop().toLocaleLowerCase()
        const checked = this.format.some(item => item.toLocaleLowerCase() === fileType)
        if (!checked) {
            this.onFormatError(file)
            return false
        }
      }
      // check maxSize
      if (this.limitSize) {
          if (file.size > this.limitSize * 1024 * 1024) {
              this.onExceededSize(file)
              return false
          }
      }
      // 开始上传对文件进行封装
      this.handleStart(file)
      if (this.isAuto) { // 用于自动上传
        // 上传文件到腾讯云服务
        this.isCor && this.postCor(file)
        // 上传到其他服务器
        this.action && this.postAction(file)
      }
    },
    async deleteCor(url) {
      // xingke-1252004410.cos.ap-shanghai.myqcloud.com/1mb.zip
      // 0: "xingke-1252004410"
      // 1: "ap-shanghai"
      // 2: "1mb.zip"
      const arr = url.split(/\.cos\.|\.myqcloud\.com\//)
      return new Promise((resolve,reject) => {
        this.cos.deleteObject({
          Bucket: arr[0],
          Region: arr[1],
          Key: arr[2]
          }, function(err, data) {
              if (!err) {
                resolve(data)
              }
          })
      })
    },
    async postCor(file) { // 上传文件到腾讯云中
      // const fileName = this.genUUID(10) + file.name
      // 先获取参数，再上传
      if (!this.corTokenUrl.params.size) {
        return
      }
      let res = await this.$post(this.corTokenUrl.url, this.corTokenUrl.params)
      res = res.data
      if (res.code !== 1) {
        this.handleFail()
        this.$Message.error(res.message)
        return
      }

      const mediaId = res.data.mediaId
      const fileName = res.data.fileName + '.' + fileSuffix(file.name)

      this.Bucket = res.data.bucket
      this.Region = res.data.region
      this.path = res.data.filePath
      this.token = {
        TmpSecretId: res.data.tmpSecretId,
        TmpSecretKey: res.data.tmpSecretKey,
        XCosSecurityToken: res.data.sessionToken,
        ExpiredTime: res.data.expiredTime
      }
      this.file = {
        ...this.file,
        objectStoreType: res.data.objectStoreType,
        seqTokenId: res.data.seqTokenId
      }
      return new Promise((resolve,reject) => {
        if (this.slice) { // 分片上传
          this.cos.sliceUploadFile({
            Bucket: this.Bucket,
            Region: this.Region,
            Key: this.path + fileName,
            Body: file,
            onProgress: (progressData) => {
                this.handleProgress(file, progressData)
            },
            }, (err, data) => {
                if (err) {
                  this.handleFail(file, err)
                  reject(new Error('error'))
                } else {
                  this.handleSuccess(file, data)
                  resolve({response: data.Location, mediaId})
                }
            })
          } else {
            this.cos.putObject({
                Bucket: this.Bucket,
                Region: this.Region,
                Key: this.path + fileName,
                Body: file,
                onProgress: (progressData) => {
                    this.handleProgress(file, progressData)
                },
            }, (err, data) => {
                if (err) {
                  this.handleFail(file, err)
                  reject(new Error('error'))
                } else {
                  if (data.statusCode === 200) {
                    this.handleSuccess(file, data.Location)
                    resolve({response: data.Location, mediaId})
                  } else {
                    this.handleFail(file, null)
                    reject(new Error('error'))
                  }
                }
            })
          }
        })
    },
    postAction(file) { // 上传到其他服务器中
        let formData = new FormData()
        formData.append('file', file)
        // const xhr = new XMLHttpRequest()
        // const action = this.action
        // xhr.onload = () => {
        //   if (xhr.status < 200 || xhr.status >= 300) {
        //       return this.onFail(file,null)
        //   }
        //    console.log('upload img', xhr.responseText)
        //   this.handlePostActionSuccess(xhr.responseText)
        //   // this.onSuccess(file, JSON.parse(xhr.responseText))
        // }
        // xhr.open('post', action, true)
        // xhr.send(formData)

        this.$post(this.action, formData).then(res => {
          console.log('upload img', res)
          this.handlePostActionSuccess(res.data)
        }).catch(() => {
          return this.onFail(file,null)
        })
    },
    handlePostActionSuccess(data) {
      this.$emit("onSuccess", data)
    },
    handleProgress (file, progressData) {
      this.onProgress(file, progressData)
    },
    handleSuccess (file, url) { // cor的data响应数据
      this.onSuccess(file, url, this.file)
      this.$emit('input', { ...this.file, url })
    },
    handleFail (file, err) {
      this.onFail(file, file)
    },
    handleStart (file) {
      let newfile = {
        name: file.name,
        size: file.size,
        file
      }
      if (this.base64) {
        let reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onloadend = () => {
          newfile.base64 = reader.result
          this.$emit('input', newfile)
        }
      } else {
        this.$emit('input', newfile)
      }
    },
    genUUID(len) {
      len = len || 6
      len = parseInt(len, 10)
      len = isNaN(len) ? 6 : len
      var seed = '0123456789abcdefghijklmnopqrstubwxyzABCEDFGHIJKLMNOPQRSTUVWXYZ'
      var seedLen = seed.length - 1
      var uuid = ''
      while (len--) {
        uuid += seed[Math.round(Math.random() * seedLen)]
      }
      return uuid + '-'
    }
  },
  filters: {
    urlFilter(file) {
      if (file.base64) {
        return file.base64
      } else {
        if (file.url.includes('https://') || file.url.includes('http://')) {
          return file.url
        } else {
          return 'https://' + file.url
        }
      }
    }
  }
}
</script>

<style lang="stylus">
.ykt-owly-upload
  display inline-block
  .ykt-owly-upload-content
    position relative
    cursor pointer
    .ykt-owly-upload-input
      display none
    .ykt-owly-upload-button
      width 70px
      height 28px
      padding 0
      background-color #409eff
      border-radius 3px
      color #fff
    .ykt-owly-upload-coverImg
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
        width 100%
        height 100%
    .ykt-owly-upload-avatar
      width 100%
      height 100%
      position relative
      &:hover
        opacity 1
      .img
        width 100%
        height 100%
      &-again
        position absolute
        transition all 0.2s
        width 100%
        height 100%
        left 0
        top 0
        text-align center
        line-height 60px
        opacity 0
        background-color rgba(0, 0, 0, 0.3)
        border-radius 3px
        color #ffffff
        font-size 12px
</style>
