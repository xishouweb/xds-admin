<template>
  <div id="search_input">
    <span class="icon seach_icon">&#xe634;</span>
    <input v-model="inputVal" :class="isFocus ? 'focus' : ''" type="text" placeholder="搜索文章标题" @keyup.enter="getlist">
    <!-- <i class="icon clear" @click="clear" v-show="inputVal">&#xe617;</i> -->
  </div>
</template>

<script>
  export default {
    name: "index",
    data() {
      return {
        isFocus: false,
        inputVal: ''
      }
    },
    methods: {
      getlist() {
        this.$emit("change", this.inputVal)
      }
    }
  }
</script>

<style lang="stylus" scoped>
  @import '~@/assets/stylus/index.styl'
  #search_input
    width 170px
    padding 10px 0px
    relative()
    .seach_icon
      absolute()
      font-size: 20px;
      left: 6px;
      top: 10px;
      placeholder(#cacbcc)
    input
      display inline-block
      width: 230px
      height: 30px
      line-height 30px
      font-size 16px
      padding-left: 37px
      background-color: #f2f4f5;
      radius(13px)
    .clear
      absolute()
      right: 20px;
      top: 17px;
      cursor: pointer;
</style>
