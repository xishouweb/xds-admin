<template>
  <div id="graphicList">
    <ScrollBar v-if="list && list.length">
     <Waterfall style="width: 705px" :data="list" >
      <template>
        <WaterfallItem
            class="waterfall-item"
            v-for="(item, index) in list"
            :width="230"
            :key="index"
        >
          <div @click="chooseIdx(index)" class="li_wrap" :class="{'active': activeIdx === index}">
            <div class="deep_wrap" >
              <MessageTemplate :template="item"></MessageTemplate>
            </div>
            <div class="badge"><i class="icon">&#xe637;</i></div>
          </div>
        </WaterfallItem>
      </template>
    </Waterfall>
    </ScrollBar>
    <div class="no-data"> 暂无模板 </div>
  </div>
</template>
<script>
import MessageTemplate from './MessageTemplate'
import {Waterfall, WaterfallItem} from 'vue2-waterfall'
export default {
    name: 'graphicList',
    data() {
      return {
        activeIdx: null,
        graphicList: this.list,
        selectedFlag: null,
      }
    },
    props: ["list", "preScanType"],
    mounted() {
      // this.init()
      // this.$root.Bus.$on("preScanSelectGraphic", (data) => {
      //   this.selectedFlag = data.thumbMediaId
      //   this.$emit('on-change', data)
      // })
    },
    components: {
      MessageTemplate,
      Waterfall,
      WaterfallItem
    },
    methods: {
      // init() {
        // this.$emit('on-change', this.list[0])
      // },
      chooseIdx(idx) {
        this.activeIdx = idx
        this.$emit('on-change', this.list[idx])
      },
    }
  }
</script>
<style lang="stylus">
@import '~@/assets/stylus/index'
  #graphicList
    height 100%
    .waterfall-item
      padding 10px
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
          boxShadow(-1px 2px 12px 3px #409fff)
          border_(#409fff)
        .badge
          display block
          height: 16px
          width: 16px
          line-height: 1
          position absolute
          bottom 0
          right 0
          i
            color #409fff
    .no-data
      text-align center
      line-height 300px
      font-size: 30px
      color: #bbbfc5
</style>
