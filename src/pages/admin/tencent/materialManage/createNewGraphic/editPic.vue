<template>
  <div class="edit-pic">
     <div class="material-graphic-header">
      <div class="edit-pic-title">选择图片</div>
      <div class="edit-pic-close" @click="$emit('close')"><i class="icon"></i></div>
    </div>
    <div class="edit-pic-container">
      <div class="edit-pic-left">
        <div class="edit-pic-col-title">裁剪封面</div>
        <div class="edit-pic-box">
          <div >
          <croppa
          @mouseup.native="createSelectedSize"
          ref="croppa"
          :width="option.width"
          :height="option.height"
          placeholder="Choose an image"
          :placeholder-font-size="0"
          :disabled="false"
          :prevent-white-space="false"
          :show-remove-button="false"
          :initial-image="option.img"
          @move="createSelectedSize"
          @zoom="createSelectedSize"
          ></croppa>
          <!-- 隐藏的 -->
          <croppa
          style="height: 0; width: 0; overflow: hidden"

          ref="croppa1"
          :width="280"
          :height="120"
          :initial-image="option.img"></croppa>
          </div>
        </div>

        <div class="edit-size-select">
          <Button size="small" :type="option.fixedNumber[0] == 2.35 ? 'primary' : 'ghost'" @click="createSelectedSize([2.35,1])">2.35:1</Button>
          <Button class="done" size="small" :type="option.fixedNumber[0] == 1 ? 'primary' : 'ghost'" @click="createSelectedSize([1,1])">1:1</Button>
          <button @click="download('image/jpeg', 0.8)">download 20% </button>
          <div class="text">可选择一个尺寸的封面单独裁剪</div>
        </div>
      </div>

      <div class="edit-pic-right">
        <div class="edit-pic-col-title edit-pic-padding">预览封面</div>
        <div class="edit-pic-selected-size edit-pic-padding" style="margin-bottom: 14px" :class="{'selected': editPicSelectedIndex === 0}" @click="selectedPic(0)">
          <div class="show-preview" :style="{'width': 236 + 'px', 'height': 100 + 'px',  'overflow': 'hidden'}">
              <img :src="option.smallUrl">
          </div>
          <div>图文封面（2.35：1）</div>
        </div>
        <div class="edit-pic-selected-size edit-pic-padding" :class="{'selected': editPicSelectedIndex === 1}" @click="selectedPic(1)">
          <div class="show-preview" :style="{'width': 236 + 'px', 'height': 236 + 'px',  'overflow': 'hidden'}">
              <img :src="option.bigUrl">
          </div>
          <div>转发封面（1：1）</div>
        </div>
      </div>
    </div>

    <div class="edit-pic-btn">
      <Button size="small"  @click="submit">上一步</Button>
      <Button class="done" type="primary" size="small" @click="done">完成</Button>
    </div>
  </div>
</template>

<script>
import { VueCropper } from 'vue-cropper'
import Vue from 'vue'

export default {
  name: "edit-pic",
  components: {
    VueCropper
  },
  props: ['initPic'],
  data() {
    return {
      option: {
        img: 'http://api.xingke100.com/123.jpg',
        size: 0.8,
        fixedNumber: [1,1],
        width: 280,
        height: 280,
        smallUrl: '',
        bigUrl: '',
        bigBlob: null,
        smallBlob: null,
        type: 'image/jpeg',
        compressionRate: 0.8
      },
      editPicSelectedIndex: 0,
      timerClear: ''
    }
  },
  mounted() {
    this.init()
  },
  destroyed() {
    clearInterval(this.timerClear)
  },
  methods: {
    init() {
      let counter = 5
      this.timerClear = setInterval(() => {
        this.getInitSmallSize()
        this.getBigSize()
        if (this.option.smallUrl && this.option.bigUrl && this.option.bigBlob && this.option.smallBlob) {
          clearInterval(this.timerClear)
        }
        if (!counter--) {
          clearInterval(this.timerClear)
        }
      }, 500)
    },
    submit() {
      this.$emit('prevstep')
    },
    done() {
      this.$emit('done', this.option)
    },
    selectedPic(index) {
      this.editPicSelectedIndex = index
    },
    createSelectedSize(size) {
      this.option.fixedNumber = size || this.option.fixedNumber
      this.option.height = this.option.width / this.option.fixedNumber[0]
      setTimeout(() => {
        if (this.option.fixedNumber[0] === 1) {
          this.getBigSize()
        } else {
          this.getSmallSize()
        }
      }, 500)
    },
    getSmallSize() {
      this.option.smallUrl = this.$refs.croppa.generateDataUrl()
      this.$refs.croppa.generateBlob((blob) => {
        this.option.smallBlob = blob
      }, this.option.type, this.option.compressionRate)
    },
    getInitSmallSize() {
      this.option.smallUrl = this.$refs.croppa1.generateDataUrl()
      this.$refs.croppa1.generateBlob((blob) => {
        this.option.smallBlob = blob
      }, this.option.type, this.option.compressionRate)
    },
    getBigSize() {
      this.option.bigUrl = this.$refs.croppa.generateDataUrl()
      this.$refs.croppa.generateBlob((blob) => {
        this.option.bigBlob = blob
      }, this.option.type, this.option.compressionRate)
    },
    download(type, compressionRate) {
      this.$refs.croppa.generateBlob((blob) => {
        var url = URL.createObjectURL(blob)
        var a = document.createElement('a')
        a.download = 'filename'
        a.href = url
        a.click()
        URL.revokeObjectURL(url)
      }, type, compressionRate)
    }
  }
}
</script>

<style lang="stylus">
.edit-pic
  height 720px
  justify-content space-between
.material-graphic-header
  display flex
  justify-content space-between
  .edit-pic-title
    font-size: 18px;
    color: #303133;
  .edit-pic-close
    cursor pointer
.edit-pic, .edit-pic-left, .edit-pic-right
  display flex
  flex-direction column
  .edit-pic-container
    height 540px
    padding-top 80px
    display flex
    flex-grow 1
    .edit-pic-left
      margin-right 37px
      .edit-pic-box
        flex-grow: 1;
        display flex
        align-items center
        background-color: #f2f4f5;
      .edit-size-select
        height: 70px;
        margin-top 20px
    .edit-pic-right
      border-left 1px solid #e3e4e5

  .edit-pic-selected-size
    display flex
    border-left:  5px solid rgba(0,0,0,0);
    &.selected
      border-left:  5px solid #409fff;
    .show-preview
      margin-right 10px
      img
        width 100%
        height 100%
  .edit-pic-btn
    padding-top 30px
    flex-basis 80px
    text-align right

    button
      width 80px
  .edit-pic-col-title
    height: 14px;
    font-size: 14px;
    color: #606366;
    margin-bottom 20px
  .edit-pic-padding
    padding-left 42px
  .text
    height: 12px;
    font-size: 12px;
    line-height: 28px;
    color: #979899;
</style>

