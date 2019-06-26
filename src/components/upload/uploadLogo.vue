<template>
  <div class="uploadLogo">
    <tencentUploadImg v-model="file" ref="upload" :corTokenUrl="corTokenUrl">
      <div class="uploadLogo-upload-img">
        <img :src="defaultUrl | urlFilter" alt="">
        <div class="upload-again">重新上传</div>
      </div>
    </tencentUploadImg>
  </div>
</template>
<script>
import tencentUploadImg from '@/components/tencentUploadImg'
const ROOT = '/api'
export default {
  name: 'uploadLogo',
  props: {
    imgSrc: {
      default: '',
      type: String
    },
    uploadServer: {
      // 接受文件的服务器 node
      type: String,
      default: ROOT
    }
  },
  data() {
    return {
      file: {},
      corTokenUrl: {
        url: "/api/adminCenter/getTXCloudTokenByUploadCorpLogo",
        params: {}
      }
    }
  },
  watch: {
    file (nv) {
      if (nv.url) {
        this.uploadLogo(nv.url)
      }
    }
  },
  computed: {
    defaultUrl() {
      if (this.file.url) {
        return this.file.url
      } else {
        return this.imgSrc ? this.imgSrc : `${process.env.SELF_BASE_URL}/logo.png`
      }
    }
  },
  methods: {
    uploadLogo(url) { // 上传logo图片路径
      let obj = {
        logo: url.split('cloud.com')[1]
      }
      this.$get(this.fylPath.updateCorpLogo, obj).then(res => {
        if (res.code === 1) {
          this.$Message.success('保存成功')
          this.uploadSucess(res.data.data)
        } else {
          this.$Message.error('保存失败')
          this.uploadFail(res.message)
        }
      })
    },
    uploadSucess(data) {
      this.$emit('uploadSucess', data)
    },
    uploadFail(data) {
      this.$emit('uploadFail', data)
    },
  },
  components: {
    tencentUploadImg
  }
}
</script>
<style lang="stylus">
.uploadLogo
  width 100%
  height 100%
  cursor pointer
  position relative
  .uploadLogo-upload-img
    width 60px
    height 60px
    position relative
    img
      width 100%
      height 100%
    .upload-again
      // display none
      position absolute
      transition all 0.2s
      width 100%
      height 100%
      left 0
      top 0
      text-align center
      line-height 60px
      opacity 0
      background-color rgba(0, 0, 0, .3)
      border-radius 3px
      color #ffffff
      font-size 12px
      &:hover
        opacity 1
</style>


