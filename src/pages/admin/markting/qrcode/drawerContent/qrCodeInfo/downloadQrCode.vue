<template>
    <NewModal
      :header="modal.header"
      :maxZIndex="true"
      v-model="param.show"
      width="520"
      confrim="下载"
      @ok="modal.ok"
    >
      <Row class="download-qr-code">
          <Col span="8">
            <div class="img">
              <img :src="src || logourl" alt="">
            </div>
          </Col>
          <Col span="16">
            <div class="copy">
              <div class="text" style="color: #606366;">二维码尺寸</div>
              <Row>
                  <Col class="col" span="8"
                    v-for="(item, index) in btnList"
                    :key="index"
                    :class="{'active': index === activeIndex}">
                    <Button size='small' class="btn" @click="selected(item, index)">{{item}}PX</Button>
                  </Col>
              </Row>
            </div>
          </Col>
      </Row>
    </NewModal>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
const FileSaver = require('file-saver')
export default {
  name: 'downloadQrCode',
  props: {
    param: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
        logourl: `${process.env.SELF_BASE_URL}/logo.png`,
        activeIndex: 0,
        modal: {
          show: this.show,
          header: "下载二维码",
          message: "",
          confrim: "下载",
          ok() {}
        },
        btnList: [200,400,600,800,1000,1600,2000],
        size: 200,
        src: this.param.src || ''
    }
  },
  watch: {
    param(nv) {
      this.src = nv.url
    }
  },
  computed: {
    ...mapGetters({
      currPublic: "publicAccount/curPublic",
    })
  },
  mounted() {
    this.modal.ok = () => this.downloadFn()
  },
  methods: {
    ...mapActions({
      getChannelQrCodeImage: 'markting/getChannelQrCodeImage'
    }),
    selected(item, index) {
      this.activeIndex = index
      this.size = item
    },
    async downloadFn() {
      let param = {
        appAccountId: this.currPublic.appAccountId,
        qrCodeImageUrl: this.src,
        size: this.size
      }
      let res = await this.getChannelQrCodeImage(param)
      if (res.code === 1) {
        let base64 = `data:image/${res.data.imageType};base64,${res.data.base64StrImage}`
        this.downloadFile(base64, `${this.param.name}.${res.data.imageType}`)
      } else {
        this.$Message.error('下载失败！')
      }
    },
    downloadFile(content, fileName) { // 下载base64图片
        var base64ToBlob = function(code) {
            let parts = code.split(';base64,')
            let contentType = parts[0].split(':')[1]
            let raw = window.atob(parts[1])
            let rawLength = raw.length
            let uInt8Array = new Uint8Array(rawLength)
            for (let i = 0; i < rawLength; ++i) {
                uInt8Array[i] = raw.charCodeAt(i)
            }
            return new Blob([uInt8Array], {
                type: contentType
            })
        }
        let blob = base64ToBlob(content) // new Blob([content]);
        FileSaver.saveAs(blob, "image.jpg")

        // let aLink = document.createElement('a')
        // let evt = document.createEvent("HTMLEvents")
        // evt.initEvent("click", true, true) // initEvent 不加后两个参数在FF下会报错  事件类型，是否冒泡，是否阻止浏览器的默认行为
        // aLink.download = fileName
        // aLink.href = URL.createObjectURL(blob)
        // aLink.click()
    }
  }
}
</script>
<style lang="stylus">
.download-qr-code
    .active .btn
      color: #66b1ff;
      background-color: white;
      border-color: #66b1ff;
    .img
      flex-basis 150px
      width: 150px;
      height: 150px;
      margin-right 20px
      img
        width 100%
        height: 100%
    .copy
      flex-grow 1
      .btn
        width: 70px;
        height: 30px;
        padding: 5px;
        font-size: 14px;
        margin-top 10px
      .text
        font-size: 12px;
        color: #979899;
        margin-bottom 10px
        overflow hidden
        white-space nowrap
</style>
