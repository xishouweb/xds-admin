import COS from 'cos-js-sdk-v5'
import { fileSuffix } from "@/utils/util.js"
import { Message } from 'iview'
import Api from '@/api/index'

class WxUpload {
  constructor (corTokenUrl, file) {
    this.token = null
    this.cor = null
    this.Bucket = ''
    this.Region = ''
    this.path = ''
    this.token = {}
    this.corTokenUrl = corTokenUrl
    this.file = file || {} // 文件对象, 包含文件name, size, url, file, base64
    this.createCos()
  }

  createCos () {
    this.cos = new COS({
      getAuthorization: (options, callback) => { // 每次执行操作都会调用
        callback(this.token)
      }
    })
  }

  async uploding () {
    let file = this.file
    let mediaId = null
    let fileName = null
    let res = await Api.$post(this.corTokenUrl.url, this.corTokenUrl.params)
    res = res.data
    if (res.code !== 1) {
      Message.error(res.message)
      return
    } else {
      mediaId = res.data.mediaId
      fileName = res.data.fileName + '.' + fileSuffix(file.name)
    }

    this.Bucket = res.data.bucket
    this.Region = res.data.region
    this.path = res.data.filePath
    this.token = {
      TmpSecretId: res.data.tmpSecretId,
      TmpSecretKey: res.data.tmpSecretKey,
      XCosSecurityToken: res.data.sessionToken,
      ExpiredTime: res.data.expiredTime
    }
    // this.file = {
    //   ...this.file,
    //   objectStoreType: res.data.objectStoreType,
    //   seqTokenId: res.data.seqTokenId
    // }

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
  }

  handleProgress(file, progressData) {

  }

  handleFail(file, err) {

  }

  handleSuccess(file, res) {

  }
}

export default (corTokenUrl, file) => {
  return new WxUpload(corTokenUrl, file)
}
