<template>
  <!-- 带清空按钮的搜索框组件 -->
  <div id="search-box">
    <Input
      :style="{'width': inputWidth}"
      :placeholder="holder"
      v-model="keyword"
      @on-keyup="keyup"
      @on-enter="search"
      @on-change="changed"
    >
      <div class="search-append" slot="append">
        <Icon type="ios-close-outline" v-if="keyword" @click="clearFn"></Icon>
        <Icon type="ios-search-strong" @click="search"></Icon>
      </div>
    </Input>
  </div>
</template>

<script>
  export default {
    props: {
      value: { // 双向绑定的输入内容
        type: String,
        default: ''
      },
      holder: { // 提示语
        type: String,
        default: '请输入搜索关键字'
      },
      search: { // 搜索函数
        type: Function,
        default: () => {}
      },
      width: { // 宽度
        type: String,
        default: '260px'
      },
      change: { // change事件
        type: Function,
        default: () => {}
      },
      clear: { // 点击清空按钮时的事件处理
        type: Function,
        default: () => {}
      }
    },
    data() {
      return {
        keyword: this.value
      }
    },
    components: {},
    computed: {
      inputWidth() { // 返回String类型的输入框宽度
        let w = this.width
        if (typeof w === 'number') {
          w = w + 'px'
        } else {
          if (w.indexOf('px') === -1) {
            w = w + 'px'
          }
        }
        return w
      }
    },
    watch: {
      value(v) {
        this.keyword = v
      }
    },
    methods: {
      changed() {
        this.$emit('input', this.keyword)
        this.$emit('search', this.keyword)
        this.change(this.keyword)
      },
      keyup() {
        this.$emit('search', this.keyword)
        this.$emit('input', this.keyword)
      },
      clearFn() {
        this.$emit('search', this.keyword)
        this.$emit('input', '')
        this.clear()
      }
    },
  }
</script>

<style lang="stylus">
  #search-box
    // display: inline-block
    .ivu-input-group-append
      position: absolute
      z-index: 3
      right: 0
      top: 1px
      width: auto
      border: 0
      padding-left: 0
      padding-right: 0
      background-color: transparent !important
    input
      border-radius: 4px
      padding-right: 64px
    .search-append
      position: relative
      width: auto
      padding: 0 5px
      i
        color: #999
        font-size: 18px
        padding: 6px 5px
        cursor: pointer
</style>
