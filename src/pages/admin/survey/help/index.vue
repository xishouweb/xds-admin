<template>
  <!-- 帮助列表（公告列表） -->
  <div class="help-page">
    <p class="title_public">{{query.type === 'help' ? '使用帮助' : '公告通知'}}</p>
    <BScroll :offsetBottom="30" :data="curList">
      <ul class="help-list">
        <template v-for="(v, i) in curList">
          <li class="flexB" :key="i" @click="go(i)">
            <p>{{v.title}}</p>
            <span class="lightGray_color" v-if="v.time">{{v.time}}</span>
          </li>
        </template>
      </ul>
      <div class="help-pages">
        <Page
          :class="{hidePage: curList.length <= 10}"
          :total="curList.length"
          show-total
        ></Page>
      </div>
    </BScroll>
  </div>
</template>

<script>
  import mixin from '../mixin.js'
  export default {
    mixins: [mixin],
    data() {
      return {
        // inform: [
        //   {
        //     title: '商品分析支持“知识付费商品”',
        //     time: '08/02'
        //   },
        //   {
        //     title: '知识付费支持公众号海报裂变',
        //     time: '07/02'
        //   },
        //   {
        //     title: '多网点支持生成网点及商品二维码多网点二维码多网点...',
        //     time: '07/02'
        //   }
        // ],
        // help: [
        //   {
        //     title: '如何添加员工和坐席',
        //     time: ''
        //   },
        //   {
        //     title: '如何使用群发功能',
        //     time: ''
        //   },
        //   {
        //     title: '多种营销方式详解',
        //     time: ''
        //   }
        // ]
      }
    },
    components: {},
    computed: {
      query() {
        return this.$route.query
      },
      curList() { // 当前展示的列表
        return this[this.query.type]
      }
    },
    created() {},
    watch: {},
    mounted() {},
    methods: {
      go(i) { // 跳转函数,i必传
        this.$router.push({
          path: '/admin/survey/detail',
          query: {
            id: i,
            type: this.query.type
          }
        })
      }
    },
  }
</script>

<style lang="stylus">
  .help-page
    height: 100%
    padding: 18px 20px 0
    background-color: #fff
    .help-list
      margin-top: 30px
      >li
        height: 60px
        cursor: pointer
        padding-right: 10px
        border-bottom: 1px solid #e3e4e6
        &:hover>p, &:hover>span
          color: #409eff
    .help-pages
      text-align: right
      padding: 10px 0
      .hidePage li
        display: none !important
</style>
