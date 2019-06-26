<template>
  <div class="fans-poster" :style="initSize[size]['boxSize']">
    <div class="fans-poster-img" :style="initSize[size]['imgSize']" @click="clickTarget">
      <!-- <img src="https://img02.sogoucdn.com/app/a/100520021/c92aad6b1c3cbeb05d350f58dec185c1" alt=""> -->
      <img :src="media.backgroundImage | urlFilter">
    </div>
    <div class="fans-poster-message" v-if="size === 'default'">
      <div class="fans-poster-title" @click="clickTarget">{{media.posterTemplateName}}</div>
      <div class="fans-poster-time">{{media.updateTime | time}}</div>
      <Row class="row">
        <Col class="label" span="6"><span>参与人数</span></Col>
        <Col class="label" span="6">{{media.participateNum}}</Col>
        <Col class="label" span="6"><span>累计扫码</span></Col>
        <Col class="label" span="6">{{media.scanNum}}</Col>
      </Row>
      <Row class="row">
        <Col class="label" span="6"><span>累计关注</span></Col>
        <Col class="label" span="6">{{media.followersNum}}</Col>
        <Col class="label" span="6"><span>已邀请</span></Col>
        <Col class="label" span="6">{{media.actualFollowNum}}</Col>
      </Row>
      <Row class="row">
        <Col class="label" span="6"><span>已取消</span></Col>
        <Col class="label" span="6">{{media.cancelFollowNum}}</Col>
      </Row>
      <div style="color: #f2686c" v-if="media.status !== 'ACTIVE'"><i class="icon">&#xe6b3;</i> 已失效</div>
    </div>
    <div class="fans-poster-message" v-if="size === 'small'">
      <div class="fans-poster-title">{{media.posterTemplateName}}</div>
      <div class="fans-poster-time">{{media.updateTime}}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "media-template",
  components: {

  },
  props: {
    media: {
      type: Object,
      default: () => {}
    },
    size: {
      type: String,
      default: () => "default"
    }
  },
  filters: {
    time(val) {
      return !val ? '--' : val.replace(/:\d{2}/, '')
    }
  },
  data() {
    return {
      initSize: {
        default: {
          boxSize: {width: "428px", height: "230px"},
          imgSize: {width: "140px", height: "200px"}
        },
        small: {
          boxSize: {width: "320px", height: "106px"},
          imgSize: {width: "60px", height: "86px"}
        }
      }
    }
  },
  methods: {
    clickTarget() {
      this.$emit('clickTarget', this.media)
    }
  }
}
</script>

<style lang="stylus">
  .fans-poster
    display flex
    width 428px
    height 230px
    padding 10px
    .fans-poster-img
      cursor pointer
      display flex
      align-items center
      flex-grow 0
      width: 140px;
      height: 200px;
      background-color: #e5e5e5;
      overflow hidden
      img
        width 100%
    .fans-poster-message
      flex-grow 1
      padding 20px
      .fans-poster-title
        cursor pointer
        font-size: 16px;
        line-height: 24px;
        color: #303133;
      .fans-poster-time
        font-family: MicrosoftYaHei;
        font-size: 12px;
        line-height: 28px;
        color: #979899;
        margin-bottom 25px
      .row
        margin-bottom 15px
        color: #606366;
        .label
          font-size: 14px
    .fans-poster-message-small
      flex-grow 1
      padding 0px
</style>

