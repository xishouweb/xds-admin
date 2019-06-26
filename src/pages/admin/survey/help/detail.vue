<template>
  <!-- 帮助详情（公告详情） -->
  <div class="detail-page">
    <p class="title_public">{{query.type === 'help' ? '使用帮助' : '公告通知'}}</p>
    <BScroll :offsetBottom="60" :data="curItem">
      <div class="text-box">
        <h3 class="title">{{curItem.title}}</h3>
        <p class="sub-title gray_color">
          <span v-if="curItem.time">{{curItem.time}}</span>
          <span>销大师运营部</span>
        </p>
        <div class="content" v-html="curItem.cont"></div>
      </div>
    </BScroll>
  </div>
</template>

<script>
  import mixin from '../mixin.js'
  export default {
    mixins: [mixin],
    data() {
      return {}
    },
    components: {},
    computed: {
      query() {
        return this.$route.query
      },
      curItem() { // 当前显示对象
        return this[this.query.type][this.query.id]
      }
    },
    created() {},
    watch: {},
    mounted() {},
    methods: {},
  }
</script>

<style lang="stylus">
  .detail-page
    height: 100%
    padding: 18px 20px 0
    background-color: #fff
    .text-box
      width: 1000px
      margin: 0 auto
      .title
        text-align: center
        font-size: 24px
        font-weight: normal
        padding-top: 50px
      .sub-title
        text-align: center
        padding: 16px 0 32px
        >span
          padding: 0 10px
      .content
        line-height: 2
        >div
          text-align: center
          padding: 10px 0
          >img
            max-width: 100%
</style>
