<template>
  <div class="pic_text" @mouseenter.stop="allEnter" :style="{width: width+'px'}">
    <!-- 第一幅为大图片 -->
    <div class="big img-background" @mouseenter.stop="bigEnter" :style="{ height: parseInt(width/1.81) + 'px'}">
      <!--  -->
      <img
        v-if="bigList.cloudThumbUrl || bigList.picurl || bigList.thumbUrl"
        :src="(bigList.cloudThumbUrl || bigList.picurl || bigList.thumbUrl) | urlFilter">
      <p class="img_detail" :style="{height: styleSize[size].img_detail, lineHeight: styleSize[size].img_detail}">{{bigList.title}}</p>
      <!-- hover 遮盖层 -->
      <PreScan
      v-show="bigScan"
      :position=" smallList.length ? 'first' : 'one'"
      :type="size"
      class="scan"
      @click="bigScan = false"
      :val="bigList.url"
      :isOutLink="isOutLink"
      :data="bigList"></PreScan>
    </div>
    <!-- 其他为小图片 -->
    <div class="small_wrap">
      <ul class="small" v-if="smallList.length">
        <li v-for="(item, idx) in smallList" :key="idx" :style="{height: styleSize[size].smallList}">
          <a target="_blank" class="small_a">
            <div class="small-content">
              <p class="min-tit">{{item.title}}</p>
              <div class="small-img img-background">
                <img
                v-if="item.cloudThumbUrl || item.picurl || item.thumbUrl"
                :src="(item.cloudThumbUrl || item.picurl || item.thumbUrl) | urlFilter "
                :style="{height: styleSize[size].smallimg, width: styleSize[size].smallimg}">
              </div>
            </div>
          </a>
          <!-- hover 遮盖层 -->
          <PreScan v-show="smallScan" :type="size" class="scan" :val="item.url" :data="item"
          :isOutLink="isOutLink"
            :position="(idx + 1) == smallList.length ? 'last' : '' "></PreScan>
        </li>
      </ul>
      <div class="side_part" v-show="news.articles.length === 1">
        <div class="img_descript">
          <p class="text_over2" v-if="bigList.digest">{{bigList.digest}}</p>
          <p class="text_over2" v-else>{{bigList.description}}</p>
        </div>
      </div>
      <div class="detail_btn" v-if="news.articles.length === 1">
        <span>详情</span>
        <i class="icon">&#xe7da;</i>
      </div>
      <div class="bottom_detail" v-if="size != 'move'">
        <div class="user_info" v-if="size === 'large'">
          <span>{{news.updateTime | filterDate}}</span>
        </div>
        <div class="user_info" v-if="size === 'small'">
          <span>更新时间</span>
          <i>{{news.updateTime | filterDate}}</i>
        </div>
      </div>
    </div>
    <slot></slot>
  </div>
</template>

<script>
import PreScan from './PreScan'
export default {
    name: "pic_text",
    components: {
      PreScan
    },
    data() {
      return {
        allScan: true,
        smallScan: true,
        bigScan: true,
        styleSize: {
          small: {

          },
          large: {
            img_detail: "40px",
            smallimg: "44px",
            smallList: "54px"
          },
          move: {
            img_detail: "40px",
            smallimg: "44px",
            smallList: "54px"
          }
        }
      }
    },
    props: {
      size: {
        type: String,
        default: () => { return 'small' }
      },
      news: {
        type: Object,
        default: () => { return {} }
      },
      type: {
        type: String,
        default: 'sucai'
      },
      width: {
        type: [Number,String],
        default: () => { return 209 }
      },
      coverType: {
        type: Boolean,
        default: () => { return false }
      }
    },
    computed: {
      bigList() {
        let articles = this.news.articles
        return articles.length ? articles[0] : {}
      },
      smallList() {
        let articles = this.news.articles
        this.maxNews(articles)
        return articles.length > 1 ? articles.slice(1) : []
      },
      isOutLink() {
        return this.news.type === 2
      }
    },
    methods: {
      allEnter() {
        if (this.type === 'sucai') {
          this.allScan = true
        } else if (this.type === 'shoucang') {

        }
      },
      bigEnter() {
        if (this.type === 'sucai') {
          this.allScan = true
        } else if (this.type === 'shoucang') {

        }
      },
      maxNews(arr) {
        let _arr = this.deepCopy(arr)
        if (arr.length > 9) {
          arr = _arr.splice(0, 9)
          this.$Message.warning('图文不能多于9条！')
        }
      }
    }
}
</script>

<style lang="stylus" scoped>
@import '~@/assets/stylus/index.styl'
  .min-tit, .img_detail
    text-align: left
    overflow: hidden
    text-overflow ellipsis
    white-space nowrap
  .min-tit
    width: calc(100% - 44px)
  .split_line
    relative()
    z-index:1
    bort()

  .pic_text
    relative()
    border-bottom 1px solid #e3e4e6;
    fn(0)
    .big
      relative()
      inline()
      ellipsis()
      width 100%
      height: 116.667px
      fn(14px)
      &:hover
        .scan
          visibility visible
      .scan
        visibility hidden
      img
        radiusTop(5px)
        width: 100%
        height:100%
      p
        absolute()
        width: 100%
        ellipsis()
        vertical(32px)
        color()
        bottom: 0
        alignL()
        font-size: 14px;
        padding: 0 15px
        bgColor(rgba(0, 0, 0 , 0.3))
    .small_wrap
      padding 10px 0
      .side_part
        // margin 10px 0
        padding 10px 13px
        width 100%
        overflow hidden
        &:before
          display:table
          content: ''
        .img_descript
          borb()
          padding-bottom 10px
          p
            white-space: pre-wrap
            alignL()
            height: 30px
            line-height: 1.4
            fn(12px)
            overflow:hidden
            color(#606366)
      .detail_btn
        margin 20px 0
        height 12px
        line-height 12px
        padding 0 15px
        fn(14px)
        setBetween()
        color(deep_color)
        span
          height: 14px;
          font-family: MicrosoftYaHei;
          font-size: 14px;
          line-height: 20px;
          color: #303133;
        i
          width: 7px;
          font-size: 13px;
          color: #979899;
      .bottom_detail
        height 12px
        line-height 12px
        margin 10px 0
        fn(14px)
        padding:0 15px
        .user_info
          setStart()
          fn(12px)
          color(#979899)
          span
            mr(10px)
      .small
        color(#333)
        fn(14px)
        li
          width 100%
          overflow hidden
          padding 5px 13px
          margin 6px 0
          relative()
          &:hover
            .scan
              visibility visible
          .scan
            visibility hidden
          .small_a
            display:block
            color:inherit
            .small-content
              setBetween()
              .small-img
                width: 32px
                height: 32px

              span
                text-align left
                ellipsis()
                width:120px
</style>
