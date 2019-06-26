<template>
  <div id="search_input">
    <span class="icon seach_icon" style="top: 0" @click="getlist">&#xe634;</span>
    <input clearable v-model="inputVal" :class="isFocus ? 'focus' : ''" type="text" :placeholder="placeholder" @keyup.enter="getlist">
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
    props: {
      placeholder: {
        type: String,
        default: "搜索文章标题"
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
    padding 0 0px 10px
    // line-height: 30px
    relative()
    .seach_icon
      absolute()
      font-size: 20px;
      left: 6px;
      // top: 5px;
      cursor: pointer
    placeholder(#cacbcc)
    >input
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
