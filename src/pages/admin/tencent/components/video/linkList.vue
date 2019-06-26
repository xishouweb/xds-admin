<template>
  <div id="videoList">
    <ScrollBar>
      <div class="waterfall-item">
        <div v-for="(item, index) in list" :key="index" @click="chooseIdx(index)" class="li_wrap" :class="{'active': activeIdx === index}">
          <div class="deep_wrap">
            <VidoeTemp :video="item"></VidoeTemp>
            <div class="badge"><i class="icon">&#xe637;</i></div>
          </div>
        </div>
      </div>
    </ScrollBar>
  </div>
</template>
<script>

import VidoeTemp from './vidoeTemp'
  export default {
    name: 'videoList',
    components: {
      VidoeTemp
      },
    data() {
      return {
        activeIdx: -1,
        audioList: this.list
      }
    },
    props: ['list'],
    mounted() {
      // this.init()
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
  #videoList
    height 100%
    .waterfall-item
      padding 20px 10px
    .li_wrap
      position relative
      height 80px

      boxSizing()
      .badge
        display none
      .deep_wrap
        position relative
        boxSizing()
        transform-origin:center center
        transition: 0.2s all cubic-bezier(.46, 1, .23, 1.52);
        radius(5px)
      &:hover, &.active
        z-index 2
        .deep_wrap
          bgColor()
          boxShadow(2px 0px 10px 2px #ccc)
      &.active
        .deep_wrap
          boxShadow(2px 0px 10px 2px #409fff)
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
