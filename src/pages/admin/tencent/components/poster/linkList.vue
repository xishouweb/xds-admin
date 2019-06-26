<template>
  <div id="poster-modal-temp">
    <ScrollBar>
      <div class="water-item-box">
        <div
            class="waterfall-item"
            v-for="(item, index) in list"
            :key="index"
        >
          <div @click="chooseIdx(index, item)" class="li_wrap" :class="{'active': activeIdx === index}">
            <div class="deep_wrap" >
              <posterTemp :media="item" size="small"></posterTemp>
            </div>
            <div class="badge"><i class="icon">&#xe637;</i></div>
          </div>
        </div>
      </div>
    </ScrollBar>
  </div>
</template>
<script>
import posterTemp from "@/components/mediaTemplate/posterTemp.vue"
  export default {
    name: 'poster-modal-temp',
    data() {
      return {
        activeIdx: -1,
        posterList: this.list,
        selectedFlag: null,
      }
    },
    props: ["list"],
    mounted() {
      this.$root.Bus.$on("preScanSelectGraphic", (data) => {
        this.selectedFlag = data.thumbMediaId
        this.$emit('on-change', data)
      })
    },
    components: {posterTemp},
    methods: {
      init() {
        this.$emit('on-change', this.list[0])
      },
      chooseIdx(idx, item) {
        this.activeIdx = idx
        this.$emit('on-change', item)
      },
    }
  }
</script>
<style lang="stylus">
@import '~@/assets/stylus/index'
  #poster-modal-temp
    height 100%
    .water-item-box
      display flex
      flex-wrap wrap
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
          height 16px
          line-height 16px
          display block
          position absolute
          bottom 0
          right 0
          i
            color #409fff
</style>
