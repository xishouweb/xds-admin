<template>
    <ul class="pic_text" :style="{width: width+'px'}"  >
      <li v-for="(item, index) in news.articles" :key="index">
        <!-- 第一幅为大图片 -->
        <div class="big-box" v-if="index === 0">
          <div class="big-container" :style="{ height: parseInt(width/1.81) + 'px'}">
            <img class="img-background" :src="(item.thumbCloudUrl || item.cloudThumbUrl || item.picurl || item.thumbUrl) | urlFilter">
            <p class="big-container-title text_over"
              :style="{height: styleSize[size].img_detail, lineHeight: styleSize[size].img_detail}"
            >{{item.title}}</p>
          </div>
          <div class="big-container-content" v-if="length === 1">
            <p class="big-container-content-p  text_over2">
              {{item.digest || item.description}}
            </p>
            <div class="big-container-info">
              <div>详情</div><div><i style="font-size: 18px;color: #979899">></i></div>
            </div>
          </div>
          <div class="pic-time" v-if="length === 1">
            <span>更新时间</span>
            <i>{{news.updateTime | todayTimeOtherDate}}</i>
          </div>
          <PreScan :selectedFlag="selectedFlag" :size="size" :position="length ? 'first' : 'one'" :type="preScanType" :data="item"></PreScan>
        </div>
        <!-- 其他为小图片 -->
        <div v-else class="small-box" :style="{height: styleSize[size].smallList}">
          <div class="small-container">
            <span class="text_over">{{item.title}}</span>
            <img class="img-background" :src="(item.cloudThumbUrl || item.picurl || item.thumbUrl) | urlFilter" :style="{height: styleSize[size].smallimg, width: styleSize[size].smallimg}">
          </div>
          <PreScan :selectedFlag="selectedFlag" :position="length ? 'first' : 'one'" :size="size" :type="preScanType" :data="item"></PreScan>
        </div>
      </li>

      <li v-if="!length">
        <!-- 图文为空 -->
        <div class="no-articles" :style="{ height: parseInt(width/1.81) + 'px'}">
          <p>
            当前图文内容不完整
            <br />
            无法选择
          </p>
        </div>
      </li>

      <li v-if="length > 1">
        <div class="pic-time">
          <span>更新时间</span>
          <i>{{news.updateTime | todayTimeOtherDate}}</i>
        </div>
      </li>
    </ul>
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
        default: () => { return 210 }
      },
      coverType: {
        type: Boolean,
        default: () => { return false }
      },
      selectedFlag: {
        type: [String, Number],
        default: ''
      },
      preScanType: {
        type: String,
        default: ''
      },
    },
    computed: {
      length() {
        return this.news.articles ? this.news.articles.length : 0
      }
    },
    methods: {
      maxNews(arr) {
        let _arr = this.deepCopy(arr)
        if (arr.length > 9) {
          arr = _arr.splice(0, 9)
          this.$Message.warning('图文不能多于8条！')
        }
      }
    }
}
</script>

<style lang="stylus">
padding = 13px
.pic_text
  overflow hidden
  text-align left
  .big-box,
  .small-box
    position relative
    width 100%
  .big-box
    margin-bottom 5px
  .no-articles
    display flex
    height 200px
    justify-content center
    text-align center
    align-items center
    font-size 16px
  .big-container
    position relative
    width 100%
    height 101px
    text-align center
    img
      max-width 100%
      max-height 100%
  .big-container-title
    padding 0 padding
    position absolute
    bottom 0
    left 0
    text-align left
    width 100%
    height: 33px;
    line-height 33px
    background-color: rgba(0,0,0,0.3)
    color: #ffffff;
    overflow hidden
    white-space nowrap
    text-overflow:ellipsis

  .big-container-content
    padding 0 padding
    .big-container-content-p
      height 52px
      padding 10px 0
      line-height 19px
      font-size: 12px;
      color: #606366;
      border-bottom 1px solid #e3e4e6;
      overflow hidden
    .big-container-info
      display flex
      justify-content space-between
      align-items center
      height 36px
      color: #303133
  .small-box
    position relative
    width 100%
  .small-container
    display flex
    justify-content space-between
    align-items center
    padding 10px padding
    color: #303133;
    span
      text-align left
      display block
      width calc(100% - 33px)
      height 33px
      line-height 33px
      overflow hidden
      white-space nowrap
      text-overflow ellipsis
      color: #303133;
    img
      width 33px
      height 33px
  .pic-time
    padding 5px padding
    font-size: 12px;
    color: #979899;
    padding-bottom 14px
</style>
