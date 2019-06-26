<template>
    <div class="tableHeader">
        <div class="tableHeader-left">
          <slot name="left" v-bind:selection="selection"></slot>
        </div>
        <div class="right_pro">
          <slot name="right-bf"></slot>
          <SearchBox
            v-if="search"
            v-model="searchInput"
            :search="getKeyWord"
            :holder="placeholder"
            :width="inputWidth"
          ></SearchBox>
          <!-- <TableInput v-if="search" v-model="searchInput" :placeholder="placeholder" :inputWidth="inputWidth"  @search="getKeyWord"> -->
          <!-- </TableInput> -->
          <div class="line-height" v-if="filter">
            <div class="icon operation-icon" @click="handleFilter">&#xe748;</div>
          </div>
          <div class="line-height" v-if="csv">
            <span class="icon" @click="exportCsv">&#xe66c;</span>
          </div>
        </div>
    </div>
</template>
<script>
import tableMixin from './tableMixin.js'
import TableInput from './tableInput'
export default {
  name: 'ykt-table-header',
  components: { TableInput },
  data() {
      return {
        searchInput: '',
        parent: null,
        selection: []
      }
  },
  mixins: [tableMixin],
  props: {
    placeholder: {
      type: String,
      default: ''
    },
    inputWidth: {
      type: [String, Number],
      default: 200
    },
    csv: { // 打印csv文件
      type: Boolean,
      default: true
    },
    filter: {
      type: Boolean,
      default: false
    },
    search: {
      type: Boolean,
      default: true
    }
  },
  mounted() {
    this.onCheckedAll()
  },
  methods: {
    getKeyWord() {
      this.$emit('search', this.searchInput)
      // this.searchInput.trim() && (this.$emit('search', this.searchInput))
    },
    exportCsv() {
      this.findParent("ykt-Table").$emit("exportCsv")
    },
    // 过滤按钮
    handleFilter() {
      this.$emit('filterTable')
    }
  }
}
</script>
<style lang="stylus">
@import '~@/assets/stylus/index'
  .tableHeader
    display flex
    justify-content: space-between
    setBetween()
    mb(20px)
    > div
      flex-grow 1
    .tableHeader-left button
      margin-right 10px
    .right_pro
      display flex
      justify-content:  flex-end
      > *
        margin-right 10px
      .search_input
        fl()
        border_()
        vertical(40px)
        radius(3px)
        relative()
        min-width:200px
        input
          absolute()
          left:10px
          top:0
          height:100%
          bottom:0
          right:30px
        i
          absolute()
          right:0
          width:28px
          cursor()
          fn(20px)
          color(#aaa)
      >.ivu-icon
        cursor()
        width 30px
        height 30px
        fn(14px)
        text-align center
        border 1px solid #ddd
      >span, .pop_span
        fl()
        margin:0 10px
        mt(10px)
        cursor()
        fn(18px)
        &:hover
          color(text_color)
      .pop_span
        mt(8px)
        fn(24px)
      .pop_span:hover
        color(text_color)
    .line-height
      line-height 42px
      color #909499
      .icon
        cursor pointer
</style>
