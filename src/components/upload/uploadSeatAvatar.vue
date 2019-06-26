<template>
  <div class="uploadLogo">
    <tencentUploadImg v-model="file" ref="upload" :corTokenUrl="corTokenUrl">
      <div class="uploadLogo-upload-img">
        <img :src="selectPhoto || imgSrc | urlFilter" alt="">
        <div class="upload-again">重新上传</div>
      </div>
    </tencentUploadImg>
  </div>
</template>
<script>
import tencentUploadImg from '@/components/tencentUploadImg'
const ROOT = '/api'
export default {
  name: 'uploadHeadImg',
  props: {
    imgSrc: {
      default: '',
      type: String
    },
    uploadServer: {
      // 接受文件的服务器 node
      type: String,
      default: ROOT
    },
    idx: { // 当前操作公众号索引
      default: 0,
      type: Number
    },
    seatId: { // 坐席id
      default: null,
      type: Number
    }
  },
  data() {
    return {
      file: {},
      selectPhoto: null, // 当前选中但未保存的头像
    }
  },
  watch: {
    file (nv) {
      if (nv.url) {
        this.selectPhoto = nv.base64
        this.$emit('change', nv, nv.name, this.idx)
      }
    }
  },
  computed: {
    corTokenUrl() {
      return {
        url: this.Path.getPhotoToken,
        params: { id: this.seatId }
      }
    },
    defaultUrl() {
      if (this.file.url) {
        return this.file.url
      } else {
        return this.imgSrc ? this.imgSrc : `${process.env.SELF_BASE_URL}/logo.png`
      }
    }
  },
  methods: {
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
    background-size cover
    background-image url('../../assets/images/avatar.png')
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


