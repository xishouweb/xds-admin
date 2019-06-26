<template>
  <div id="template-list">
    <ScrollBar>
     <Waterfall>
        <WaterfallItem
            class="waterfall-item"
            v-for="(item, index) in list"
            :key="index"
            :width="230"
        >
          <div @click="chooseIdx(index)" class="li_wrap" :class="{'active': activeIdx === index}">
            <div class="deep_wrap" >
              <MessageTemplate :template="item"></MessageTemplate>
            </div>
            <div class="badge"><i class="icon">&#xe637;</i></div>
          </div>
        </WaterfallItem>
    </Waterfall>
    </ScrollBar>
  </div>
</template>
<script>
import MessageTemplate from '@/components/mediaTemplate/MessageTemplate'
import {Waterfall, WaterfallItem} from 'vue2-waterfall'
  export default {
    name: 'template-list',
    data() {
      return {
        activeIdx: -1,
        selectedFlag: null,
      }
    },
    props: ["list"],
    mounted() {
      // this.init()
      this.$root.Bus.$on("preScanSelectGraphic", (data) => {
        this.selectedFlag = data.thumbMediaId
        this.$emit('on-change', data)
      })
    },
    components: {
      MessageTemplate,
      Waterfall,
      WaterfallItem
    },
    methods: {
      init() {
        this.$emit('on-change', this.list[0])
      },
      chooseIdx(idx) {
        this.activeIdx = idx
        this.$emit('on-change', this.list[idx])
      },
    }
  }
</script>
<style lang="stylus">
@import '~@/assets/stylus/index'
  #template-list
    height 100%
    .waterfall-item
      padding 10px
      min-width: 230px
    .li_wrap
      position relative
      margin-bottom 10px
      boxSizing()
      .badge
        display none
      .deep_wrap
        position relative
        // flex_()
        boxSizing()
        transform-origin:center center
        transition: 0.3s all cubic-bezier(.46, 1, .23, 1.52);
        radius(5px)
      &:hover, &.active
        z-index 2
        padb(0px)
        .deep_wrap
          margin-top:-3px
          bgColor()
          boxShadow(-1px 2px 12px 3px #ccc)
      &.active
        .deep_wrap
          border 2px solid #409fff
        .badge
          height 16px
          line-height 16px
          display block
          position absolute
          bottom 0
          right 0
          i
            color #409fff
</style>
