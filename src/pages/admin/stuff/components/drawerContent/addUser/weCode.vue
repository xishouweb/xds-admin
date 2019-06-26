<template>
  <div id="we_code">
    <div class="slot_p">
        <slot></slot>
    </div>
    <div class='code_part' id="postcard">
        <Row type="flex" justify="space-between" align="middle">
            <Col>
                <div class="left_p">
                    <div>
                        <h3>{{datas && datas.nickname}}</h3>
                        <p>{{corInfo.corpName}}</p>
                    </div>
                    <ul>
                        <li>
                            <p>手机号码</p>
                            <span>{{datas && datas.mobile}}</span>
                        </li>
                        <li>
                            <p>所属部门</p>
                            <span>{{curApart.label}}</span>
                        </li>
                        <li>
                            <p>职务</p>
                            <span>{{datas && datas.postName}}</span>
                        </li>
                        <li>
                            <p>坐席</p>
                            <span>{{datas && datas.seatNo}}</span>
                        </li>
                    </ul>
                </div>
            </Col>
            <Col>
                <div class="right_p" v-if="datas">
                    <data-loading :dataSatau="(!datas && !datas.url) ? 1 : 2">
                        <div class="img">
                            <img :src="base64qrcode" />
                        </div>
                    </data-loading>
                    <p>微信扫码加入企业</p>
                </div>
            </Col>
        </Row>
    </div>
    <Button class="save_btn" @click="createImg">保存到本地</Button>
    <!-- <div id="hello" style="float:left; width:98%;height:240px;border:1px solid red"></div> -->
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import html2canvas from 'html2canvas'
import {localStorageSaveOrRead} from '@/utils/util'
export default {
  data() {
    return {
      curId: 0,
      curCompo: '',
      ext: '.jpg',
      form: '',
      base64qrcode: '',
      uploadUrl: this.Path.uploadfile,
      downloadUrl: this.Path.downloadfile,
    }
  },
  computed: {
      ...mapGetters({
        'corInfo': 'survey/getSaveloginCompany'
      })
  },
  props: ['uploadurl', 'downloadurl','datas', 'curApart'],
  created() {
      if (this.datas && this.datas.url) {
          this.getQrcode(this.datas.url)
      }
  },
  watch: {
      datas: {
          handler(newVal, oldVal) {
              if (newVal && oldVal) {
                if (newVal.url !== oldVal.urs) {
                  this.getQrcode(newVal.url)
                }
              }
          },
          deep: true
      }
  },
  methods: {
    createImg() {
        html2canvas(document.querySelector("#postcard")).then(canvas => {
            const dataURL = canvas.toDataURL("image/png" + this.ext)
            if (this.isIE()) {
                // ie
                this.commit(dataURL)
            } else {
                this.downloadFile(this.datas.nickname, dataURL)
            }
        })
    },
    getQrcode(src) {
        this.$post(this.uploadUrl,{
            qrcodeSrc: `${src}&corpCompanyId=${localStorageSaveOrRead('currentCorp').applyId}`,
            type: "getWXqrcode"
         }).then(res => {
            this.base64qrcode = res.data.base64
        })
    },
    downloadFile(fileName, content) {
        let aLink = document.createElement('a')
        let blob = this.base64ToBlob(content) // new Blob([content]);
        let evt = document.createEvent("HTMLEvents")
        evt.initEvent("click", true, true)// initEvent 不加后两个参数在FF下会报错  事件类型，是否冒泡，是否阻止浏览器的默认行为
        aLink.download = fileName
        aLink.href = URL.createObjectURL(blob)

        // aLink.dispatchEvent(evt);
        aLink.click()
      },
    base64ToBlob(code) {
        let parts = code.split(';base64,')
        let contentType = parts[0].split(':')[1]
        let raw = window.atob(parts[1])
        let rawLength = raw.length
        let uInt8Array = new Uint8Array(rawLength)
        for (let i = 0; i < rawLength; ++i) {
          uInt8Array[i] = raw.charCodeAt(i)
        }
        return new Blob([uInt8Array], {type: contentType})
      },
    commit(base64) {
        this.$post(this.uploadUrl, {
            type: "base64",
            postcard: base64,
            name: this.datas.nickname}).then(res => {
            window.open(this.downloadUrl + '?name=' + res.data.store_path, "_self")
        })
    }
    }
}
</script>

<style lang="stylus">
@import '~@/assets/stylus/index'
#we_code
  width 100%
  height:100%
  .slot_p
    padding: 40px 24px
    p
      padding:5px 0
  .code_part
    border_()
    padding:40px 50px
    margin:40px
    mt(5px)
    mb(10px)
    radius(10px)
    box-shadow 0px 2px 10px 0 #ddd
    overflow:hidden
    .left_p
      width 250px
      fl()
      div
        mb(30px)
        h3
          mb(13px)
      ul
        li
          height:27px
          p
            fl()
            width:80px
          span
            width 170px
            fl()
            alignL()
            ellipsis()
    .right_p
      fr()
      .img
        width:150px
        height 150px
        bgColor(#fefefef)
        img
          width: 100%
          height: 100%
      p
        center()
        fn(12px)
        color(#909499)
.save_btn.save_btn
  bgColor(text_color)
  color()
  fr()
</style>
