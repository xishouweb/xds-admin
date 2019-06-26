/**
 *   limitSize:     // 单位： M
 *   uploadServer:  // 接受文件的服务器 node服务器
 *   uploadUrl:     // 上传接口
 *   overviewUrl:   // 读取图片接口
 *   uploadSuccess:  // 上传成功事件
 *   uploadFail:    // 上传失败事件
 */
<template>
<div class="owly-upload">

    <div class="owly-upload-content">
        <div class="owly-upload-img" >
          <img v-show="imgUrl" :src="imgUrl | urlFilter"/>
          <p v-show="imgUrl" class="look-img-shadow flexC" @click="showBigImg">
            <i class="icon">&#xe7d4;</i>
            <span> 点击查看大图</span>
          </p>
        </div>
        <div class="owly-upload-img-left">
            <div class="owly-upload-info" v-if="!uploadErr">图片大小不超过3M</div>
            <div class="owly-upload-info upload-error" v-else>上传失败，图片大小不能超过3M</div>

            <tencentUploadImg v-model="file"
              ref="upload"
              :onExceededSize="onExceededSize"
              :onSuccess="onSuccess"
              :limitSize="3"
              :corTokenUrl="corTokenUrl">
                <Button class="owly-upload-button">{{changeText}}</Button>
            </tencentUploadImg>
        </div>
    </div>
        <!-- title="付款凭证" -->
    <Modal
        class="big-img"
        v-model="modal"
        style="z-index: 10001;position: fixed;"
        width="800">
        <img width='100%' height="500" :src="imgUrl | urlFilter" />
        <div slot="footer"></div>
    </Modal>
</div>
</template>

<script>

import { localStorageSaveOrRead } from '@/utils/util.js'
import tencentUploadImg from '@/components/tencentUploadImg'

export default {
  name: 'uploadPayVoucher',
  components: {
    tencentUploadImg
  },
  data() {
    return {
      file: {},
      corTokenUrl: {
        url: "/api/pay/getTXCloudTokenByPayVoucher",
        params: { orderId: localStorageSaveOrRead('orderId') }
      },
      changeText: '上传图片',
      isShowBigImg: false,
      uploadErr: false,
      imgUrl: '',
      modal: false
    }
  },
  watch: {
    // file (nv) {
    //   if (nv.url) {
    //     this.uploadSuccess(nv.url)
    //   }
    // }
  },
  methods: {
    onSuccess(file, url) {
      this.imgUrl = url
      this.changeText = '更换图片'
      this.uploadSuccess(url)
    },
    onExceededSize() {
      this.uploadErr = true
    },
    uploadSuccess(data) {
      data && this.$emit('uploadSuccess', data.split('cloud.com')[1])
    },
    showBigImg() {
        this.modal = true
    },
  }
}
</script>

<style lang="stylus">
.owly-upload
  position relative
  .close-btn
    position absolute
    left 170px
    top -13px
    font-size 20px
    color #cacbcc
    border-radius 50%
    cursor pointer
  .owly-upload-content
    position relative
    overflow hidden
    .owly-upload-img
      position: relative
      width 178px
      height 100px
      overflow hidden
      float left
      cursor pointer
      border-radius 3px
      background-color #e3e4e6
      background-image url('../../../static/icon/bg-img.jpg')
      background-position center
      background-repeat no-repeat
      img
        width 100%
      .look-img-shadow
        color: #fff
        visibility: hidden
        opacity: 0
        background-color: rgba(0, 0, 0, .4)
        position: absolute
        height: 100%
        width: 100%
        left: 0
        top: 0
      &:hover
        .look-img-shadow
          visibility: initial
          opacity: 1
    .owly-upload-img-left
      float left
      height 100px
    .owly-upload-info
      font-size 12px
      padding 10px
      color #979899
    .upload-error
      color #f00
    .owly-upload-button
      margin-left 10px
      margin-top 34px
      width 70px
      height 28px
      padding 0
      background-color #409eff
      border-radius 3px
      color #fff
    .owly-upload-input
      display none
.big-img
  .ivu-modal-close
    right: -30px
    top: -15px
    i
      font-size: 48px
  .ivu-modal-body
    padding: 8px 0
  .ivu-modal-header
    border-bottom 0px solid #e3e8ee
  .ivu-modal-footer
    padding: 0
    border-top 0px solid #e3e8ee
</style>
