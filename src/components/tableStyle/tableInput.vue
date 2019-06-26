<template>
  <!-- 该组件已过时，需要搜索框组件请使用SearchBox组件 -->
  <div class="table-search_input" :style="inputStyle">
    <input v-model="string" :placeholder="placeholder" @change="change" @keyup.enter="search">
    <i class="icon" @click="search">&#xe634;</i>
  </div>
</template>

<script>
export default {
  name: "table-input",
  props: {
    value: {
      type: String,
      default: ""
    },
    placeholder: {
      type: String,
      default: "搜索"
    },
    inputWidth: {
      type: [String, Number],
      default: 200
    }
  },
  data() {
    return {
      string: this.value
    }
  },
  computed: {
    inputStyle() {
      return { width: this.inputWidth + "px" }
    }
  },
  methods: {
    change() {
      this.$emit("input", this.string)
    },
    search() {
      this.$emit("search", this.string)
    }
  }
}
</script>

<style lang="stylus" scope>
@import '~@/assets/stylus/index'
.table-search_input
  fl()
  line-height 40px
  height 42px
  radius(3px)
  relative()
  border: solid 1px #e3e4e5;
  min-width 200px
  mr(10px)
  input
    absolute()
    left 10px
    top 1px
    height 38px
    right 40px

  // input::-webkit-input-placeholder
  //   color: #cacbcc;
  // input:-moz-placeholder
  //   color: white
  // input::-moz-placeholder
  //   color: #cacbcc;
  // input:-ms-input-placeholder
  //   color: #cacbcc;
  i
    absolute()
    right 0
    width 28px
    cursor()
    fn(20px)
    color(#aaa)
</style>


