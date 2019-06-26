<template>
<div v-if="showOverView" class="mask"  @click.stop="close">
  <div class="showpicture" :style="{width: size.width + 'px', height: size.height + 80 + 'px'}">
    <div class="showpicture-prev">
      <i class="icon" @click.stop="prev">&#xe606;</i>
    </div>
    <div class="showpicture-next">
      <i class="icon" @click.stop="next">&#xec7b;</i>
    </div>

    <div class="showpicture-header">
      <i class="icon" @click.stop="close" style="cursor: pointer">&#xe674;</i>
    </div>

    <imageView v-if="flash" ref="imgview"
      backgroud="rgba(0, 0, 0, .4);" :style="{width: size.width - 22 + 'px', height: size.height + 'px'}" class="showpicture-core"  :imgUrl="list[initIndex].cloudUrl | urlFilter"></imageView>
    <div class="showpicture-footer">
      <i class="icon" v-show="zoomoutAble" @click.stop="zoomout">&#xe603;</i>
      <i class="icon" v-show="zoominAble" @click.stop="zoomin">&#xe62c;</i>
      <i class="icon" @click.stop="rotateRight">&#xe628;</i>
    </div>
  </div>
</div>
</template>
<script>
import imageView from './OverViewImg'
export default {
  name: "overviewimg",
  components: {imageView},
  model: {
      prop: "showOverView",
      event: "close"
  },
  filters: {
      urlFilter(src) {
        if (src && src.includes('myqcloud.com')) {
          if (src.includes('https://') || src.includes('http://')) {
            return ""
          } else {
            return 'https://' + src
          }
        }
      }
    },
  props: {
    showOverView: {
      type: Boolean,
      default: false
    },
    size: {
      type: Object,
      default() {
        return {
          width: 430,
          height: 210
        }
      }
    },
    list: {
      type: Array,
      default() { return [] }
    },
    index: {
      type: Number,
      default: 0
    },
    transfer: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      flash: true,
      modal: false,
      initIndex: this.index,
      baseSize: {
        maxW: 0,
        maxH: 0,
        minW: 430,
        minH: 210
      },
      zoomoutAble: true,
      zoominAble: true
    }
  },
  watch: {
    index (nv) {
      this.initIndex = nv
    }
  },
  mounted() {
    if (this.transfer) {
      document.body.appendChild(this.$el)
    }
    this.baseSize.maxW = document.body.clientWidth || document.documentElement.clientWidth - 10
    this.baseSize.maxH = document.body.clientHeight || document.documentElement.clientHeight - 10
  },
  methods: {
    showBigImg() {
      this.modal = true
      this.imgUrl && (this.modal = true)
    },
    close() {
      this.$emit('close', false)
    },
    zoomout() {
      if (this.size.width * 2 <= this.baseSize.maxW && this.size.height * 2 <= this.baseSize.maxH) {
        this.zoominAble = true
        this.setFlash()
        this.size.width = this.size.width * 2
        this.size.height = this.size.height * 2
        if (this.size.width * 2 >= this.baseSize.maxW || this.size.height * 2 >= this.baseSize.maxH) {
          this.zoomoutAble = false
        }
      }
    },
    zoomin() {
      if (this.size.width / 2 >= this.baseSize.minW && this.size.height / 2 >= this.baseSize.minH) {
        this.zoomoutAble = true
        this.setFlash()
        this.size.width = this.size.width / 2
        this.size.height = this.size.height / 2

        if (this.size.width / 2 < this.baseSize.minW || this.size.height / 2 < this.baseSize.minH) {
          this.zoominAble = false
        }
      }
    },
    rotateRight() {
      this.$refs.imgview.rotateRight()
    },
    prev() {
      this.initIndex = this.initIndex <= 0 ? this.list.length - 1 : this.initIndex - 1
    },
    next() {
      this.initIndex = this.initIndex >= this.list.length - 1 ? 0 : this.initIndex + 1
    },
    setFlash() {
      this.flash = false
      setTimeout(() => {
        this.flash = true
      }, 10)
    }
  }
}
</script>

<style lang="stylus" scoped>
.mask
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100%;
  z-index: 500;
.showpicture
  width: 200px;
  height: 150px;
  background-color:  rgba(0, 0, 0, .4);
  box-shadow: 1px 0px 6px 0px rgba(0, 0, 0, 0.2);
  border-radius: 3px;
  border: solid 1px #cacbcc;
  padding 10px
  position fixed
  z-index 100
  left 50%
  top 50%
  transform translate(-50%, -50%)
  .showpicture-prev, .showpicture-next
    margin-top -18px
    position absolute
    top 50%
    right 20px
    z-index 1000
    cursor pointer
    width 36px
    height 36px
    line-height 36px
    text-align center
    border-radius 18px
    background-color:  rgba(0, 0, 0, 0.4);
    i
      color #ffffff
      font-size 24px

  .showpicture-prev
    left 20px
  .showpicture-header
    height 20px
    line-height 20px
    background-color #ffffff
    text-align right
  .showpicture-footer
    height 40px
    line-height 40px
    background-color #ffffff
    text-align center
    i
      color #606366
      font-size 24px
      cursor pointer
  .showpicture-core
    width: 100%
    height: 100%

</style>
