<template>
  <div id="picturesList">
    <ScrollBar>
      <div class="waterfall-item">
        <div v-for="(item, index) in list" :key="index" @click="chooseIdx(index)" class="li_wrap" :class="{'active': activeIdx === index}">
          <div class="deep_wrap">
            <PicTemp :type="2" v-show="true" :picture="item"></PicTemp>
            <div class="badge"><i class="icon">&#xe637;</i></div>
          </div>
        </div>
      </div>
    </ScrollBar>
  </div>
</template>
<script>
import PicTemp from './PicTemp'
  export default {
    name: 'picturesList',
    data() {
      return {
        activeIdx: -1,
      }
    },
    props: ["list"],
    mounted() {
      // this.init()
    },
    components: {
      PicTemp,

    },
    methods: {
      init() {
        this.$emit('on-change', this.list[0])
      },
      chooseIdx(idx) {
        this.activeIdx = idx
        this.$emit('on-change', this.list[idx])
      }
    }
  }
</script>
<style lang="stylus">
@import '~@/assets/stylus/index'
  #picturesList
    height 100%
    .waterfall-item
      padding 14px
    .li_wrap
      display inline-block
      position relative
      width 225px
      height 164px
      boxSizing()
      .badge
        display none
      .deep_wrap
        position relative
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
          boxShadow(-1px 2px 10px 2px #ccc)
      &.active
        .deep_wrap
          boxShadow(-1px 2px 10px 2px #409fff)
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
