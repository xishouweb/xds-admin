<template>
  <div id="graphicList">
    <ScrollBar>
     <Waterfall class="waterfall-item">
      <template>
        <WaterfallItem
            class="waterfall-item"
            v-for="(item, index) in list"
            :width="226"
            :key="index"
            style="margin-bottom: 15px"
        >
          <div v-if="preScanType == 'select'" class="li_wrap" >
            <div class="deep_wrap">
              <PicText :news="item" :preScanType="preScanType" :selectedFlag="selectedFlag"></PicText>
            </div>
            <div class="badge" v-if="item.articles.length"><i class="icon">&#xe637;</i></div>
          </div>
          <div v-else @click="chooseIdx(index)" class="li_wrap" :class="{'active': activeIdx === index}">
            <div class="deep_wrap" >
              <PicText :news="item"></PicText>
            </div>
            <div class="badge" v-if="item.articles.length" ><i class="icon">&#xe637;</i></div>
          </div>
        </WaterfallItem>
      </template>
    </Waterfall>
    </ScrollBar>
  </div>
</template>
<script>
import PicText from './PicText'
import {Waterfall, WaterfallItem} from 'vue2-waterfall'
  export default {
    name: 'graphicList',
    data() {
      return {
        activeIdx: -1,
        graphicList: this.list,
        selectedFlag: null,
      }
    },
    props: ["list", "preScanType"],
    mounted() {
      // this.init()
      this.$root.Bus.$on("preScanSelectGraphic", (data) => {
        console.log(data)
        this.selectedFlag = data.id
        this.$emit('on-change', data)
      })
    },
    components: {
      PicText,
      Waterfall,
      WaterfallItem
    },
    methods: {
      init() {
        this.chooseIdx(0)
      },
      chooseIdx(idx) {
        this.activeIdx = idx
        let graphic = this.list[idx]
        if (graphic && graphic.articles.length) {
          this.$emit('on-change', this.list[idx])
        }
      },
    },
    beforeDestroy() {
      this.$root.Bus.$off("preScanSelectGraphic")
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
      width 210px
      boxSizing()
      box-shadow 0 1px 20px 0px rgba(125,125,125,0.1)
      .badge
        display none
      .deep_wrap
        overflow: hidden;
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
          height 16px
          line-height 16px
          display block
          position absolute
          bottom 0
          right 0
          i
            color #409fff
</style>
