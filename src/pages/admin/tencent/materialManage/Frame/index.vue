<template>
  <div class="modelFrame-page">
    <div class="model-header">
      <slot name="header"></slot>
    </div>
    <div class="container">
      <div class="left" :style="{width: leftWidth}">
        <slot name="label"></slot>
      </div>
      <div class="right" :style="{width: `calc(100% - ${leftWidth})`}">
        <slot name="main-header"></slot>
        <BScroll :offsetBottom="80" >
        <div class="main-container">
          <slot name="main"></slot>
        </div>
        </BScroll>
      </div>

      <div class="news-pagenation" v-show="totalPage > 10">
        <Page :styles="{height: '28px'}"
          :total="totalPage"
          :page-size='pageSize'
          :current="currPage"
          @on-change="change"
          @on-page-size-change="pageSizeChange"
          size="small" show-total show-elevator show-sizer  />
      </div>
    </div>

    <div class="footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>
<script>
import searchinput from './searchInput'

  export default {
    name: 'modelFrame-page',
    components: {
      searchinput
    },
    props: {
      labelList: {
        type: Array,
        default() { return [] }
      },
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
      offSetHeight: {
        type: Number,
        default() { return 0 }
      },
      leftWidth: {
        type: String,
        default: "240px"
      }
    },
    computed: {
      leftHeight() {
        return { height: (this.screenH - 294) + 'px' }
      },
      rightMainHeight() {
        return { height: (this.screenH - 294 - 60) + 'px' }
      }
    },
    data() {
      return {
        screenH: document.body.clientHeight || document.documentElement.clientHeight,
        page: {
          size: this.pageSize,
          page: this.currPage
        }
      }
    },
    mounted() {
      window.onresize = () => {
        this.screenH = document.body.clientHeight || document.documentElement.clientHeight
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
      }
    }
  }
</script>
<style lang="stylus">
@import "~@/assets/stylus/index.styl"
.modelFrame-page
  position relative
  width 100%
  .container
    width 100%
    clear()
    .left
      float left
      vertical-align: top;
    .right
      float left
      vertical-align: top;
      .main-container
        height 100%
        overflow-y auto
  .news-pagenation
    position fixed
    right 70px
    bottom: 34px
    text-align right
  .footer
    text-align right
    button
      width 60px
      height 32px
      ml(20px)
    .cancel
      background #ffffff
</style>

