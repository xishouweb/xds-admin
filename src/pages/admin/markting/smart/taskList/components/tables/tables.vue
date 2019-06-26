<template>
  <!-- 列表及新建任务按钮 -->
  <div id="table-smart" v-if="columns">
    <new-table :columns="columns" :datas="list" :noDatatext="noDatatext" :bscroll="'div'">
      <div slot="header">
        <i-button class="btn-create-pattern" type="primary" @click="create">新建任务</i-button>
      </div>
    </new-table>
  </div>
</template>

<script>
  import mixin from './tableMixin.js'
  export default {
    mixins: [mixin],
    props: ['datas'],
    data() {
      return {
        list: JSON.parse(JSON.stringify(this.datas))
      }
    },
    components: {
      newTable: () => import('@/components/tableStyle/tables.vue')
    },
    watch: {
      datas: {
        deep: true,
        handler(nv) {
          this.list = JSON.parse(JSON.stringify(nv))
        }
      }
    },
    mounted() {},
    computed: {},
    methods: {
      create() { // 跳转到新建任务页
        this.$emit('create')
      },
      hand(typ, dex) { // 操作函数
        this.$emit('hand', typ, dex)
      }
    },
  }
</script>

<style lang="stylus">
#table-smart
  .ivu-table
    table
      width: 100% !important
  .remind-box
    color: #606366
    font-size: 12px
    position: relative
    .pattern-hz
      position: absolute
      right: 20px
      bottom: 10px
      >p
        margin-right: 20px
        line-height: 30px
        float: left
      .ivu-select-single .ivu-select-selection
        height: 30px
      .ivu-select-selected-value
        height: 30px
        line-height: 30px
  .btn-create-pattern
    margin: 20px 0
  .table-btns
    button
      width: 60px
      height: 30px
      padding: 0
      line-height: 30px
      margin-right: 16px
</style>
