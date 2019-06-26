<template>
  <div class="control-extra">
    <Poptip placement="bottom-end" transfer v-model="item.showPop">
      <a class="control-title" :class="{'text_color': nowDex === dex}" @click="hideOtherPop">详情</a>
      <div slot="content" class="control-cont" @click.stop>
        <div class="msgCard">
          <div class="body">
            <p class="txt" v-html="exampleTxt">
            </p>
          </div>
          <div class="footer">
            <div class="txt">详情</div>
          </div>
        </div>
      </div>
    </Poptip>
  </div>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      default: () => {
        return {}
      }
    },
    dex: Number, // 索引
    nowDex: Number // 当前查看详情索引
  },
  computed: {
    exampleTxt() {
      return this.item.example.replace(/\n/g, "<br/>")
    }
  },
  data() {
    return {
    }
  },
  methods: {
    hideOtherPop() {
      this.$emit('cut', this.dex)
    }
  }
}
</script>

<style lang="stylus">
  .ivu-poptip-inner
    white-space normal
    box-shadow 0px 2px 6px 0px rgba(0, 0, 0, 0.35)
    border solid 1px #e3e4e5
    .control-cont
      width 280px
      background-color #ffffff
      padding 15px 15px 0
      line-height 20px
      .txt
        white-space normal
      .msgCard
        &.disabled
          opacity  0.3
        .head
          .title
            font-size 16px
            color #000
          .action
            float right
          .date
            font-size 12px
            color #8c8c8c
        .body
          color #000000
          padding-bottom 13px
          font-size 14px
        .footer
          border-top solid 1px #e3e4e6
          font-size 12px
          line-height 36px
</style>
