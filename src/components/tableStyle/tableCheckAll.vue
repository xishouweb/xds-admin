<template>
    <span id="ykt-table-setect-all">
      <i><Checkbox v-model="checkedAll" @on-change="setAllChoose"> 全选</Checkbox></i>
    </span>
</template>
<script>
import tableMixin from './tableMixin.js'
    export default {
      name: 'ykt-table-check-all',
      data() {
          return {
          }
      },
      mixins: [tableMixin],
      mounted() {
        this.onCheckedAll()
      },
      methods: {
        // 全选及取消全选
        setAllChoose(val) {
          // this.checkedAll = val
          this.checkedAllOrNone()
        }
      }
    }
</script>
<style lang="stylus">
//   #ykt-table-setect-all
</style>
