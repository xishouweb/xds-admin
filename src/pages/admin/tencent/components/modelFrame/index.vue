<template>
<div class="model-frame-mask">
  <div id="modelFrame" >
    <div class="model-header">
      <slot name="header"></slot>
    </div>
    <div class="container">
      <div class="model-left">
          <slot name="label"></slot>
      </div>
      <div class="right">
        <div class="action">
          <searchinput clearable class="searchinput" @change="getKeyWord" :placeholder="placeholder"></searchinput>
          <div class="upload">
            <slot name="action"></slot>
          </div>
        </div>
        <div class="main-container">
          <slot name="main"></slot>
        </div>
      </div>
    </div>
    <div class="pagenation" v-show="totalPage > pageSize">
      <Page :styles="{height: '28px'}"
        :total="totalPage"
        :page-size='pageSize'
        :current="currPage"
        @on-change="change"
        @on-page-size-change="pageSizeChange"
        size="small" show-total show-elevator show-sizer  />
    </div>
    <div class="footer">
      <slot name="footer"></slot>
    </div>
  </div>
</div>
</template>
<script>
import searchinput from './searchInput'
  export default {
    name: 'modelFrame',
    components: {
      searchinput
    },
    props: {
      totalPage: {
        type: Number,
        default() { return 0 }
      },
      pageSize: {
        type: Number,
        default() { return 10 }
      },
      currPage: {
        type: Number,
        default() { return 1 }
      },
      placeholder: {
        type: String,
        default: "搜索文章标题"
      }
    },
    data() {
      return {
        page: {
          size: this.pageSize,
          page: this.currPage
        },
        maskbg: null
      }
    },
    methods: {
      close() {
        this.$emit('close', false)
      },
      getKeyWord(keyword) {
        this.$emit('changeKeyword', keyword)
      },
      change(page) {
        this.page.page = page
        this.pageChange()
      },
      pageSizeChange(pageSize) {
        this.page.size = pageSize
        this.pageChange()
      },
      pageChange() {
        this.$emit('pageChange', this.page)
      },
      createMask(bool) {
        if (bool) {
          let div = document.createElement('DIV')
          div.id = "model-frame-mask"
          div.className = 'mask'
          document.querySelector('body').appendChild(div)
          this.maskbg = div
        } else {
          // this.maskbg.remove() // remove()方法不兼容IE
          document.querySelector('body').removeChild(this.maskbg)
        }
      }
    },
    beforeDestroy() {

    },
  }
</script>
<style lang="stylus">
@import "~@/assets/stylus/index.styl"
#modelFrame
  width: 885px;
  height: 740px;
  background-color: #ffffff;
  box-shadow: 1px 0px 6px 0px rgba(0, 0, 0, 0.2);
  border-radius: 3px;
  border: solid 1px #cacbcc;
  padding 20px
  css3Middle()
  overflow hidden
  .model-header
    height 20px
    line-height 20px
    margin-bottom 20px
    font-size: 18px;
    .title
      display inline-block
      width 820px
    .close
      display inline-block
      width 10px
      cursor pointer
  .container
    display table-row
    height: 550px;

    .model-left
      display table-cell
      vertical-align: top;
      width: 160px;
      height: 550px;
      .label
        padding-top 15px
        li
          font-size: 14px
          color: #606366;
          margin-bottom 30px
          cursor pointer
          overflow hidden
          text-overflow: ellipsis;
          &.active
            color #409fff

    .right
      display table-cell
      vertical-align: top;
      width: 704px;
      .action
        height 30px
        line-height 30px
        #search_input
          display inline-block
          width 400px
        .upload
          display inline-block
          text-align right
          width 295px
      .main-container
        margin 20px 0
        width: 704px;
        height: 500px;
        background-color: #f7f9fa;
        overflow-y auto

  .pagenation
    text-align right
    .ivu-page.mini .ivu-page-options-elevator input

    .ivu-page-options-elevator input:hover
      border-color #66b1ff !important
  .footer
    text-align right
    margin 30px 0
    button
      width 60px
      height 32px
      ml(20px)
    .cancel
      background #ffffff
.model-frame-mask
  position: fixed;
  width 100%
  height: 100%;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(55, 55, 55, .6)
  z-index: 98;
</style>

