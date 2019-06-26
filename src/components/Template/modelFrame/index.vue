<template>
  <div id="messagemodelFrame" >
    <!-- 头部 -->
    <div class="model-header">
      <slot name="header"></slot>
    </div>
    <!-- 导航 -->
    <div class="model-Nav">
      <slot name="nav"></slot>
    </div>
    <div class="container flex">
      <!-- 侧边栏 -->
      <div class="model-left">
          <slot name="label"></slot>
      </div>
      <div class="right">
        <!-- 控件栏 -->
        <div class="action">
          <!-- <searchinput class="searchinput" @change="getKeyWord" :placeholder="placeholder"></searchinput> -->

          <!-- <div class="upload"> -->
            <slot name="action"></slot>
          <!-- </div> -->
        </div>
        <!-- 主体 -->
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
</template>
<script>
// import searchinput from './searchInput'
  export default {
    name: 'messagemodelFrame',
    // components: {
    //   searchinput
    // },
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
      // placeholder: {
      //   type: String,
      //   default: "搜索文章标题"
      // }
    },
    data() {
      return {
        page: {
          size: this.pageSize,
          page: this.currPage
        },
        mask: null, // 灰色遮罩节点
      }
    },
    created() {
      this.createMask(1)
    },
    methods: {
      close() {
        this.$emit('close', false)
      },
      // getKeyWord(keyword) {
      //   this.$emit('changeKeyword', keyword)
      // },
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
          this.mask = div
          document.body.appendChild(div)
        } else {
          // document.querySelector('#model-frame-mask').remove() // 不兼容IE
          // document.querySelector('body').removeChild(document.querySelector('#model-frame-mask'))
          try {
            document.body.removeChild(this.mask)
          } catch (err) {
            // console.log(err)
          }
        }
      }
    },
    beforeDestroy() {
      this.createMask(0)
    },
  }
</script>
<style lang="stylus">
@import "~@/assets/stylus/index.styl"
#messagemodelFrame
  width:950px
  // height: 740px;
  // background-color: #ffffff;
  // box-shadow: 1px 0px 6px 0px rgba(0, 0, 0, 0.2);
  // border-radius: 3px;
  // border: solid 1px #cacbcc;
  padding 20px
  css3Middle()
  overflow hidden
  .model-header
    height 20px
    line-height 20px
    margin-bottom 15px
    font-size: 18px
    .title
      display inline-block
    .close
      display inline-block
      width 18px
      cursor pointer
      float: right
  .container
    // display table-row
    height: 550px;

    .model-left
      // display table-cell
      // vertical-align: top;
      width: 160px;
      height: 550px;
      flex: none
    .right
      // display table-cell
      // vertical-align: top;
      // width: 704px;
      flex: 1
      .action
        // margin-bottom: -10px
        // height 30px
        // line-height 30px
        // #search_input
        //   display inline-block
        //   width 400px
        // .upload
        //   display inline-block
        //   text-align right
        //   width 295px
      .main-container
        margin-bottom: 20px
        // width: 704px;
        height: 500px;
        background-color: #f7f9fa;
        overflow-y auto

  .pagenation
    text-align right

  .footer
    text-align right
    margin 10px 0
    button
      width 60px
      height 32px
      ml(20px)
    .cancel
      background #ffffff
.mask
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(55, 55, 55, .6);
  height: 100%;
  z-index: 98;
</style>

