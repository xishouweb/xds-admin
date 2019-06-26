<template>
  <div class="setting-poster">
    <div ref="canvas" class="setting-poster-canvas">
      <ScrollBar :style="scrollBarHeight">
        <div ref="backImg" id="drag-container" class="back-img">
          <img :src="imgsrc" alt="">
          <!-- 可以拖动 -->
          <div v-if="!disabled && imgsrc">
            <div ref="avatar"
              v-show="initCanvasInfo.avatar.show"
              class="setting-poster-avatar"
              v-drag="getAvatarPos"
              :style="initAvatarStyle"></div>
            <div ref="name" class="setting-poster-name"
              v-show="initCanvasInfo.name.show"
              v-drag="getNamePos"
              :style="initNameStyle">粉丝昵称</div>
            <div ref="qrCode" class="setting-poster-qrCode"
              v-drag="getQrCodePos"
              :style="initQrcodeStyle"
              :class="qrCodeTopClass"></div>
          </div>
          <!-- 不可以拖动 -->
          <div v-else class="move-disable">
            <div ref="avatar"
              v-show="initCanvasInfo.avatar.show"
              class="setting-poster-avatar"
              :style="initAvatarStyle"></div>
            <div ref="name" class="setting-poster-name"
              v-show="initCanvasInfo.name.show"
              :style="initNameStyle">粉丝昵称</div>
            <div ref="qrCode" class="setting-poster-qrCode"
              :style="initQrcodeStyle"
              :class="qrCodeTopClass"></div>
          </div>
        </div>
      </ScrollBar>
    </div>
    <div class="setting-poster-button" v-if="!disabled">
      <tencentUploadImg v-model="file"
        ref="upload"
        :onExceededSize="onExceededSize"
        :limitSize="2"
        :isAuto="false"
        :corTokenUrl="corTokenUrl">
        <Button style="width: 160px" type="primary">
          <span v-if="!imgsrc">上传背景图</span>
          <span v-else>更换背景图</span>
        </Button>
      </tencentUploadImg>
    </div>
    <p class="setting-poster-remind-text" v-if="!disabled">
      温馨提示：<br/>
      1.设计海报时需预留二维码和粉丝信息的位置。<br/>
      2.海报效果建议宽度在720px到1242px，建议尺寸750X1334px，大小在2M以内，格式为jpg。
    </p>

    <NewModal
      :header="modal.header"
      :maxZIndex="true"
      v-model="modal.show"
      width="464"
      @ok="modal.ok"
      :cancelBtn='false'
      confrim="知道了"
    >
      <div>{{modal.message}}</div>
    </NewModal>
  </div>
</template>

<script>
export default {
  name: "setting-poster",
  components: {
    tencentUploadImg: () => import('@/components/tencentUploadImg'),
  },
  data() {
    return {
      canvasScale: 1, // 将选择的尺寸按照统一比例缩小到画布， 如： 选择二维码尺寸 114 * 0.54 = 62， 62为画布上二维码的选择尺寸
      scrollBarOffsetHeight: 3, // scrollBar 因计算不准确的偏差值 3px
      file: {},
      corTokenUrl: {
        url: "/api/adminCenter/getTXCloudTokenByUploadCorpLogo",
        params: {}
      },
      imgsrc: "",
      tempImgSrc: "",
      // 节点
      canvas: null,
      backImg: null,
      name: null,
      avatar: null,
      qrCode: null,
      // 位置
      // 图片原尺寸
      imgOriginSize: {
        width: 324 * 2,
        height: 576 * 2
      },
      initCanvasInfo: this.canvasInfo || {
        name: {
          show: true,
          namePositionX: 24,
          namePositionY: 24,
          fontSize: 24,
          color: '#606366'
        },
        avatar: {
          show: true,
          avatarPositionX: 24,
          avatarPositionY: 24,
          size: 88,
          shape: 'FILLET',
        },
        qrCode: {
          show: true,
          posterQrCodePositionX: 24,
          posterQrCodePositionY: 24,
          size: 114
        }
      },
      // 头像，姓名，二位码位置
      position: {
        name: {},
        avatar: {},
        qrCode: {}
      },
      initNameStyle: {},
      initAvatarStyle: {},
      initQrcodeStyle: {},
      modal: {
        show: false,
        header: "图片尺寸",
        message: "",
        ok() {}
      }
    }
  },
  props: {
    value: {
      type: Object,
      default: function () { return {} }
    },
    disabled: {
      type: Boolean,
      default: () => false
    },
    initFile: { // 图片对象
      type: [Object, File],
      default: () => { return {} }
    },
    initBgImg: {
      type: String,
      default: () => ''
    },
    canvasInfo: { // 图片对象
      type: Object,
      default: () => {}
    }
  },
  watch: {
    // 选择文件成功
    file (nv) {
      if (nv.file) {
        this.clearStyle()
        this.tempImgSrc = nv.base64
        this.getImgOriginSize(nv.base64)
      }
    },
    // 修改时回填
    initBgImg(nv) {
      this.getImgOriginSize()
      // this.computedSize()
    },
    imgScale() {
      this.computedSize()
    },
    canvasInfo(nv) {
      this.initCanvasInfo = nv
      // this.initBgImg = nv.backgroundImage
      this.computedSize()
    }
  },
  computed: {
    totalScale() {
      return parseFloat((this.canvasScale * this.imgScale).toFixed(5))
    },
    imgScale() {
      // 324： 画布的宽度 324px
      return 324 / this.imgOriginSize.width
    },
    scrollBarHeight() {
      let h = this.imgScale * this.imgOriginSize.height
      return { height: (h >= 576 ? 576 : h) + this.scrollBarOffsetHeight + 'px' }
    },
    qrCodeTopClass() {
      let h = this.imgScale * this.imgOriginSize.height
      if (h >= 576) {
        return ['setting-poster-qrCode-top']
      }
    }
  },
  mounted() {
    this.getEl()
    this.file = this.initFile
    this.getImgOriginSize()
    this.computedSize()
  },
  methods: {
    computedSize() {
      this.computedNameStyle()
      this.computedAvatarStyle()
      this.computedQrcodeSize()
      this.$emit('input', this.position)
    },
    computedNameStyle() {
      let name = this.initCanvasInfo.name
      let totalScale = this.totalScale
      let _style = {
        fontSize: name.fontSize * totalScale + 'px',
        color: name.color,
        left: name.namePositionX * totalScale + "px",
        top: name.namePositionY * totalScale + "px"
      }

      if (name.namePositionY + name.size > this.imgOriginSize.height && !this.tempImgSrc) {
        delete _style.top
        this.position.name.y = this.imgOriginSize.height - name.size
        _style.bottom = "10px"
      }

      if (name.namePositionX + name.size * 4 > this.imgOriginSize.width && !this.tempImgSrc) {
        delete _style.left
        this.position.name.x = this.imgOriginSize.width - name.size * 4
        _style.right = "10px"
      }

      this.initNameStyle = _style
    },
    computedAvatarStyle() {
      let avatar = this.initCanvasInfo.avatar
      // shape: 1, // 1：圆角， 2： 原形 size: 88

      let size = avatar.size * this.totalScale
      let radius = avatar.shape === "FILLET" ? 5 : size / 2
      let _style = {
        width: size + 'px',
        height: size + 'px',
        borderRadius: radius + 'px',
        left: avatar.avatarPositionX * this.totalScale + "px",
        top: avatar.avatarPositionY * this.totalScale + "px"
      }

      if (avatar.avatarPositionY + avatar.size > this.imgOriginSize.height && !this.tempImgSrc) {
        delete _style.top
        this.position.avatar.y = this.imgOriginSize.height - avatar.size
        _style.bottom = "10px"
      }

      if (avatar.avatarPositionX + avatar.size > this.imgOriginSize.width && !this.tempImgSrc) {
        delete _style.left
        this.position.avatar.x = this.imgOriginSize.width - avatar.size
        _style.right = "10px"
      }
      this.initAvatarStyle = _style
    },
    computedQrcodeSize() {
      let qrCode = this.initCanvasInfo.qrCode
      let size = qrCode.size * this.totalScale
      let _style = {
        width: size + 'px',
        height: size + 'px',
        left: qrCode.posterQrCodePositionX * this.totalScale + "px",
        top: qrCode.posterQrCodePositionY * this.totalScale + "px"
      }
      if (qrCode.posterQrCodePositionY + qrCode.size > this.imgOriginSize.height && !this.tempImgSrc) {
        delete _style.top
        this.position.qrCode.y = this.imgOriginSize.height - qrCode.size
        _style.bottom = "10px"
      }
      if (qrCode.posterQrCodePositionX + qrCode.size > this.imgOriginSize.width && !this.tempImgSrc) {
        delete _style.left
        this.position.qrCode.x = this.imgOriginSize.width - qrCode.size
        _style.right = "10px"
      }
      this.initQrcodeStyle = _style
    },
    // 获取节点
    getEl() {
      this.canvas = this.$refs.canvas
      this.backImg = this.$refs.backImg
      this.name = this.$refs.name
      this.avatar = this.$refs.avatar
      this.qrCode = this.$refs.qrCode
    },
    // 上传图片后，清除之前的上样式
    clearStyle() {
      this.name && (this.initNameStyle = {})
      this.avatar && (this.initAvatarStyle = {})
      this.qrCode && (this.initQrcodeStyle = {})
    },
    // 获取名字的位置
    getNamePos(val) {
      this.setPostion('name', val, {
        fontSize: this.nameFontSize,
        color: this.nameColor
      })
    },
    // 获取头像的位置
    getAvatarPos(val) {
      this.setPostion('avatar', val, {
        width: this.avatarSize,
        height: this.avatarSize,
        shape: this.avatarShape
      })
    },
    // 获取qrcode的位置
    getQrCodePos(val) {
      this.setPostion('qrCode', val, {
        width: this.qrcodeSize,
        height: this.qrcodeSize
      })
    },
    // 保存坐标
    setPostion(key, val, info) {
      let pos = {
        x: val.x > 0 ? parseInt(val.x / this.imgScale) : 0,
        y: val.y > 0 ? parseInt(val.y / this.imgScale - this.scrollBarOffsetHeight) : 0,
      }
      this.position[key] = Object.assign({}, pos, info)
      this.$emit('input', this.position)
    },
    // 获取图片原始尺寸
    getImgOriginSize(url) {
      const image = new Image()
      image.onload = () => {
        this.judgeImgSize(image.width, image.height)
      }

      if (this.initBgImg && !url) {
        image.src = `http://${this.initBgImg}`
        this.tempImgSrc = `http://${this.initBgImg}`
      } else {
        image.src = url
      }
    },
    judgeImgSize(width, height) {
      if (width < 600 || width > 1242) {
        this.modal = {
          show: true,
          header: "图片尺寸",
          message: "图片宽度尺寸不符合要求，请上传宽度在600px到1242px之间的图片。",
          ok() {}
        }
        this.$emit("onSuccess", null)
      } else if (height < 600 || height > 2209) {
        this.modal = {
          show: true,
          header: "图片尺寸",
          message: "图片高度尺寸不符合要求，请上传高度在600px到2209px之间的图片。",
          ok() {}
        }
        this.$emit("onSuccess", null)
      } else {
        // 合适图片
        this.imgOriginSize = {
          width: width,
          height: height
        }
        this.imgsrc = this.tempImgSrc
        this.computedSize()
        this.$emit("onSuccess", this.file, this.imgScale)
      }
    },
    onExceededSize() {
      // 2M
      this.modal = {
          show: true,
          header: "图片尺寸",
          message: `图片大小超出2M，请上传大小在2M以内的图片`,
          ok() {}
        }
    },
    // 选择成功后自动初始位置
    getDefaultPosition() {
      this.position.name = {
        x: 0,
        y: 0
      }
      this.position.avatar = {
        x: 0,
        y: 0
      }
      this.position.qrCode = {
        x: 0,
        y: 0
      }
      this.$emit('input', this.position)
    }
  }
}
</script>

<style lang="stylus">
.setting-poster
  -moz-user-select none
  -khtml-user-select none
  user-select none
  width: 324px;
  .setting-poster-canvas
    position relative
    width: 324px;
    height: 576px;
    display flex
    align-items center
    background url("/static/images/settingPoster/bgimg.png") center center no-repeat
    background-size 100% 100%
    .back-img
      position relative
      width 100%
      max-height 100%
      img
        width 100%
    .setting-poster-avatar
      position absolute
      cursor move
      background red
      left 30px
      top 40px
      width 38px
      height 38px
      border solid 1px #ffffff
      border-radius 3px
      background url("/static/images/settingPoster/avatar.png") center center no-repeat
      background-size 100% 100%
      background-color #66b1ff
    .setting-poster-name
      position absolute
      cursor move
      left 78px
      top 53px
      letter-spacing 0px
      color #606366
    .setting-poster-qrCode
      position absolute
      cursor move
      left 132px
      bottom 50px
      width 62px
      height 62px
      background url("/static/images/settingPoster/qrCode.png") center center no-repeat
      background-size 100% 100%
    .setting-poster-qrCode-top
      top 464px
  .setting-poster-button
      width: 324px;
      margin 20px 0
      text-align center
  .setting-poster-remind-text {
    width: 345px;
    height: 67px;
    font-family: MicrosoftYaHei;
    font-size: 12px;
    font-weight: normal;
    font-stretch: normal;
    line-height: 18px;
    letter-spacing: 0px;
    color: #979899;
  }
  .move-disable
    .setting-poster-avatar, .setting-poster-name, .setting-poster-qrCode
      cursor unset
</style>
