<template>
  <div id="webuploader">
      <div class="btn-text">上传图片</div>
      <div id="webuploader-hide-block" ref="webuploaderhideblock">
        <div id="webuploader-pickfiles" class="cursor">上传图片</div>
      </div>
  </div>
</template>

<script>
/* eslint-disable */
  export default {
    name: "webuploader",
    props: {
        url: {
            type: String,
            default: function () { return "/" }
        },
        swfPath: {
            type: String,
            default: function () { return './static/webuploader/Uploader.swf' }
        }
    },
    data() {
        return {
          initUrl: this.url + '/webuploader/upload',
          initSwfPath: this.swfPath,
          btnId: '#webuploader-pickfiles'
        }
    },
    mounted() {
      WebUploader && this.init()
    },
    methods: {
      uploadStart(file) {
        this.$emit('uploadStart', file)
      },
      uploadSuccess(file, data) {
        this.$emit('uploadSuccess', file, data)
      },
      uploadComplete(file) {
        this.$emit('uploadComplete', file)
      },
      uploadProgress(file, percentage) {
        this.$emit('uploadProgress', file, percentage)
      },
      init() {
          let _vue = this
          WebUploader.Uploader.register({
            "before-send-file": "beforeSendFile",
            "before-send": "beforeSend",
            "after-send-file": "afterSendFile"
          }, {
              beforeSendFile: function (file) {
                  var task = new jQuery.Deferred()
                  var md5 = file.md5
                  var size = file.size
                  var ext = file.ext
                  var uploader = this.owner
                  mi.uploadService.callGet("filecheck?md5={md5}&size={size}&ext={ext}", { md5: md5, size: size, ext: ext }, function (data) {
                      if (data.exists) {
                          file.path = data.path
                          uploader.skipFile(file)
                          task.reject()
                      } else {
                          task.resolve()
                      }
                  }, function (err) {
                      task.resolve()
                  })
                  return jQuery.when(task)
              },
              beforeSend: function (block) {
                  // 分片验证是否已传过，用于断点续传
                  var task = new jQuery.Deferred()
                  var md5 = block.file.md5
                  var ext = block.file.ext
                  mi.uploadService.callGet("chunkcheck?md5={md5}&chunk={chunk}&size={size}&ext={ext}", { md5: md5, chunk: block.chunk, size: block.file.size, ext: ext }, function (data) {
                      if (data.exists) {
                          task.reject()
                      } else {
                          task.resolve()
                      }
                  }, function (err) {
                      task.resolve()
                  })
                  return jQuery.when(task)
              },
              afterSendFile: function (file) {
                  var md5 = file.md5
                  var chunkSize = this.options.chunkSize
                  var size = file.size
                  var chunksTotal = 0
                  if ((chunksTotal = Math.ceil(file.size / chunkSize)) > 1) {
                      // 合并请求
                      var task = new jQuery.Deferred()
                      mi.uploadService.callPost("chunksmerge", {
                          size: size,
                           chunks: chunksTotal,
                           ext: file.ext,
                           md5: md5
                      }, function (data) {
                          file.path = data.Path
                          task.resolve()
                      }, function (error) {
                          task.reject()
                      })
                      return jQuery.when(task)
                  } else {
                  }
              }
          })
          function initUploadBrz() {
              var info = { md5: "" }
              if (window.wu) {
                  window.wu.destroy()
              }
              window.wu = WebUploader.create({
                  pick: _vue.btnId,
                  swf: _vue.initSwfPath,
                  server: _vue.initUrl,
                  chunked: true,
                  formData: info,
                  fileNumLimit: 1,
                  // 只允许选择图片文件。
                  accept: {
                      title: 'Images',
                      extensions: 'gif,jpg,jpeg,bmp,png',
                      mimeTypes: 'image/*'
                  }
              }).on('fileQueued', function (file) {
                  var up = this
                  this.md5File(file, 0, 1 * 1024 * 1024).progress(function (percentage) {
                  }).then(function (ret) {
                      file.md5 = ret
                      up.options.formData.md5 = ret
                      up.upload()
                  })
              }).on("uploadStart", function (file) {
                 _vue.uploadStart(file)
              }).on("uploadSuccess", function (file, data) {
                  if (data && data.path) {
                      file.path = data.path
                  }
                  _vue.uploadSuccess(file, data)
              }).on("uploadComplete", function (file) {
                  _vue.uploadComplete(file)
              }).on("uploadProgress", function (file, percentage) {
                 _vue.uploadProgress(file, percentage)
              }).on("error", function (code, file) {
                   _vue.$emit('uploadFail', file)
                })
          };
          window.initUploadBrz = initUploadBrz
          initUploadBrz()
      }
    }
  }
</script>

<style>
#webuploader{
    width: 70px;
    height: 28px;
    position: relative;
}
#webuploader .btn-text ,#webuploader-hide-block{
    width: 70px;
    height: 28px;
    line-height: 28px;
    text-align: center;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 10;
}
#webuploader-hide-block{
    opacity: 0;
    z-index: 20;
}
</style>
