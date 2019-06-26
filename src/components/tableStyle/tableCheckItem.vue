<template>
    <span class="ykt-table-check-item">
      <i @click="checkCur"><Checkbox v-model="checked"></Checkbox></i><slot></slot>
    </span>
</template>
<script>
import tableMixin from './tableMixin.js'
    export default {
      name: 'ykt-table-check-item',
      data() {
          return {
            checked: false,
            parentTableNode: null
          }
      },
      props: ['param', 'index'],
      mixins: [tableMixin],
      created() {
        this.parentTableNode = this.findParent("ykt-Table")
      },
      mounted() {
        this.onCheckedAll(this.check)
        this.parentTableNode.$emit('check-item-mounted', true)
      },
      watch: {
        checked(nv) {
          if (nv) {
            this.pushCur()
          } else {
            this.deleteCur()
          }
        }
      },
      methods: {
        // 全选及取消全选
        check(status) {
          this.checked = status
        },
        // 单选事件
        checkCur() {
          this.checked = !this.checked
        },
        pushCur() {
          let index = this.index
          let param = this.param
          let selection = this.parentTableNode.selection
          let length = selection.push({index, param})
          let checkedAll = (length === this.parentTableNode.totalCheckItems)
          this.checkItemEemitCheckedAll(checkedAll, this.parentTableNode, selection)
        },
        deleteCur() {
          let index = this.parentTableNode.selection.findIndex(item => item.index === this.index)
          this.parentTableNode.selection.splice(index, 1)
          let selection = this.parentTableNode.selection
          // let checkedAll = (this.parentTableNode.selection.length !== this.parentTableNode.totalCheckItems)
          this.checkItemEemitCheckedAll(false, this.parentTableNode, selection)
        }
      },
      beforeDestroy() {
        this.parentTableNode.$emit('check-item-mounted', false)
        this.deleteCur()
      }
    }
</script>
<style lang="stylus">
// @import '~@/assets/stylus/index'

//   #ykt-table-check-item
</style>
