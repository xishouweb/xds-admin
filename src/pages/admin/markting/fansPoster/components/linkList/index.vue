<template>
  <div class="ykt-table-wrapper">
    <div class="ykt-table-list">
      <div v-for="(item, index) in list" :key="index" style="margin: 0 30px 20px 0">
        <div class="li_wrap" :class="{selectAble: batchOperation}">
          <div class="deep_wrap">
            <posterTemp :media="item" @clickTarget="clickTarget"></posterTemp>
            <Poptip
              v-show="!batchOperation"
              placement="right-start"
              class="badge-more"
              transfer
              trigger="hover"
              popper-class="media-popperTemp"
            >
              <div>
                <i class="icon">&#xe608;</i>
              </div>
              <div slot="content" class="action-list">
                <ul>
                  <li @click="actions('show',item)">详情</li>
                  <li @click="actions('modify',item)">修改</li>
                  <li @click="actions('remove',item)">删除</li>
                </ul>
              </div>
            </Poptip>
            <tableCheckItem
              v-if="batchOperation"
              class="badge-more"
              style="display: block"
              :param="item"
              :index="index"
            ></tableCheckItem>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex"
import posterTemp from "@/components/mediaTemplate/posterTemp.vue"
export default {
  name: "ykt-table-list",
  components: {
    posterTemp,
    tableCheckItem: () => import("@/components/tableStyle/tableCheckItem.vue")
  },
  data() {
    return {
      showModal: false,
      showOverView: false,
      coverType: true,
      overviewIndex: 0,
      currentMedia: {},
      mediaType: {
        news: "PicText",
        image: "PicTemp"
      },
      checkedType: this.selectType,
      selectedList: [],
      activeIdx: 0,
      imgList: this.list
    }
  },
  props: {
    list: {
      type: Array,
      default: () => []
    },
    batchOperation: {
      type: Boolean,
      default: () => false
    }
  },
  watch: {},
  computed: {
    ...mapGetters({
      currPublic: "publicAccount/curPublic"
    })
  },
  methods: {
    actions(type, prarm) {
      this.$emit("action", type, prarm)
    },
    clickTarget(data) {
      this.$emit("action", 'show', data)
    }
  }
}
</script>
<style lang="stylus">
@import '~@/assets/stylus/index'
.ykt-table-list
  display flex
  flex-wrap wrap
  height 100%
  padding 5px
  .li_wrap
    position relative
    boxSizing()
    &.selectAbles
      border-radius 3px
      border solid 1px #e3e4e5
    .badge-more
      display none
      position absolute
      bottom 20px
      right 20px
    .badge-more
      cursor pointer
      color #979899
    .deep_wrap
      position relative
      boxSizing()
      transform-origin center center
      transition 0.2s all cubic-bezier(0.46, 1, 0.23, 1.52)
      radius(5px)
    &:hover, &.active
      z-index 2
      padb(0px)
      .deep_wrap
        bgColor()
        boxShadow(-1px 2px 10px 2px #ccc)
    &:hover
      .badge-more
        display block
        color #409fff
      .badge-hover
        display block
        i
          color #979899
    &.active
      .deep_wrap
        boxShadow(-1px 2px 10px 2px #409fff)
        border_(#409fff)
      .badge
        display block
        i
          color #409fff
.media-popperTemp.ivu-poptip-popper
  min-width auto
  .ivu-poptip-arrow:after
    left 0px !important
  .ivu-poptip-inner
    box-shadow 0px 2px 6px 0px rgba(0, 0, 0, 0.35) !important
    border none !important
    .ivu-poptip-body
      padding 0 !important
  .action-list
    width 90px
    padding 10px 0
    text-align center
    cursor pointer
    li
      line-height 30px
      &:not(.disabled):hover
        background #409eff
        color #fff
        a
          color #fff
      &.disabled
        a
          color #cacbcc
          pointer-events none
</style>
