<template>
  <ul class="new-graphic" :style="{width: width + 'px'}">
    <li v-for="(item, index) in list" :key="index" @click="selectCur(index)" >
      <div class="content" :class="{'create-active': index === activeIndex}" v-if="index === 0">
        <div class="big-img-content">
          <img class="big-img img-background" :src="item.picurl | urlFilter" alt="">
          <p class="big-title">{{item.title | filtersTitle}}</p>
        </div>
      </div>
      <div class="content no-border-top" v-else :class="{'create-active': index === activeIndex}">
        <p class="small-title">{{item.title}}</p>
        <img class="small-img img-background" :src="item.picurl | urlFilter" alt="">
      </div>
      <div class="scan" v-if="list.length > 1">
        <div>
          <i class="icon" @click.stop="moveup(item, index)" v-if="index!= 0">&#xe639;</i>
          <i class="icon" @click.stop="movedown(item, index)" v-if="index != list.length-1">&#xe638;</i>
        </div>
         <i class="icon last" style="color: #f56c6c" @click.stop="action('remove', item, index)">&#xe703;</i>
      </div>
    </li>
  </ul>
</template>
<script>

export default {
  name: 'new-graphic',
  props: {
    width: {
      type: [String, Number],
      default: 228
    },
    list: {
      type: Array,
      default() {
        return []
      }
    }
  },
  filters: {
    filtersTitle(val) {
      if (!val) {
        return '标题'
      }
      return val.length > 28 ? val.substring(0,17) + '…' : val
    }
  },
  computed: {

  },
  data() {
    return {
      activeIndex: 0
    }
  },
  methods: {
    selectCur(index) {
      this.activeIndex = index
      this.$emit('currIndex', index)
    },
    action(type, item, index) {
      this.list.splice(index, 1)
      this.$emit('currIndex', index)
    },
    moveup(item, index) {
      this.swapArray(this.list, index, index - 1)
    },
    movedown(item, index) {
      this.swapArray(this.list, index, index + 1)
    },
    swapArray(arr, index1, index2) {
      // 互换相关属性
      let _index = arr[index1].index
      arr[index1].index = arr[index2].index
      arr[index2].index = _index

      arr[index1] = arr.splice(index2, 1, arr[index1])[0]
      return arr
    },
  }
}
</script>
<style lang="stylus" scoped>
.new-graphic  li
    position relative
    .scan
      display none
      position absolute
      padding 0 20px
      height 40px
      line-height 40px
      bottom 0
      left 0
      width 100%
      background-color: rgba(0,0,0,.3);
      color: #ffffff;
      .icon
        font-size 24px
        margin-right  10px
        cursor pointer
    &:hover
      .scan
        display flex
        justify-content space-between
        align-items center

  .content
    display flex
    padding 10px
    align-items center
    border: solid 1px #e3e4e5;
    .big-img-content
      position relative
      width 100%
      height: 100px;
      background #b1b2b3
      text-align center
      .big-img
        max-width 100%
        max-height 100%
      .big-title
        display flex
        align-items center
        text-align left
        position absolute
        text-overflow: ellipsis;
        padding 0 10px
        height 32px
        line-height 16px
        font-size 13px
        bottom 0
        left 0
        width 100%
        overflow hidden
        letter-spacing: 0px;
        background-color: rgba(0,0,0,.3);
        color: #ffffff;
    .small-img
      display block
      width 50px
      height 50px
    .small-title
      flex 1
  .big-img, .small-img
    background #b1b2b3
  .no-border-top
    border-top 0px !important
  .create-active
    box-shadow -1px 0px 0px 3px rgba(64,159,255,0.54)
    border 1px solid #409fff
</style>
