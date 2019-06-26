<template>
  <div class="header-action">
    <div class="cell" >
      <div class="header-action-btns" v-if="!$slots.left">
        <span class="btn" :class="{active: activeIndex === 'wx'}" @click="select('wx')">{{label1}}(共<span>{{info.wx}}</span>条)</span>
        <span class="btn" :class="{active: activeIndex === 'cloud'}" @click="select('cloud')">{{label2}}(<span>{{info.cloud}}</span>)</span>
      </div>
      <slot name="left"></slot>
    </div>
    <div class="cell cell-right" v-show="type == 'wx'">
      <div>
        <Button class="upload" type="primary" :style="{width: label3.length * 14 + 36 + 'px'}" @click="upload">{{label3}}</Button>
      </div>
      <div class="search-input">
        <SearchBox
          v-model="keyWord"
          :width="'220px'"
          :search="getKeyword"
          :holder="placeholder"
        ></SearchBox>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'header-action',
    props: {
      info: {
        type: Object,
        default() {
          return {
            wx: 0,
            cloud: 0
          }
        }
      },
      type: {
        type: String,
        default() { return 'wx' }
      },
      placeholder: {
        type: String,
        default() { return '输入图片名称搜索' }
      },
      label1: {
        type: String,
        default() { return '微信素材' }
      },
      label2: {
        type: String,
        default() { return '云服务空间' }
      },
      label3: {
        type: String,
        default() { return '上传文件' }
      },
    },
    watch: {
      info (nv) {
        this.initWxNum = nv.wx
        this.initCloudNum = nv.cloud
      }
    },
    data() {
      return {
        initWxNum: 0,
        initCloudNum: 0,
        activeIndex: 'wx',
        keyWord: '',
      }
    },
    mounted() {
      this.init()
    },
    methods: {
      init() {
        this.initWxNum = this.info.wx
        this.initCloudNum = this.info.cloud
      },
      select(index) {
        this.activeIndex = index
        this.$emit('headerAction', index)
      },
      upload() {
        this.$emit('upload', "upload")
      },
      getKeyword() {
        this.$emit('searchKeyWord', this.keyWord)
      }
    }
  }
</script>
<style lang="stylus">
@import "~@/assets/stylus/index.styl"
  .header-action
    width 100%
    padding 20px 0
    clear()
    .cell
      float left
      width 50%
      .header-action-btns
        width: 282px;
        background-color: #f2f4f5;
        border-radius: 3px;
        clear()
        .btn
          float left
          display inline-block
          width: 140px;
          height: 40px;
          line-height 40px
          text-align center
          font-size: 14px;
          cursor pointer
        .active
          color: #ffffff;
          background-color: #409eff;
          border-radius: 3px
    .cell-right
      text-align right
      > div
        float right
    .search-input
      margin-right: 20px
    .upload
      display inline-block
      max-width 116px
</style>

