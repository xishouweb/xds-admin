<template>
    <div id="table-page">
          <div class="common_pro">
            <div class="left_pro" v-if="!noLeft">
              <div class="checkbox">
                  <tableCheckAll></tableCheckAll>
              </div>

              <slot v-bind:selection="selection">
                <i-button size="small" @click="handle('delete')">批量删除</i-button>
                <i-button size="small" @click="handle('stop')">批量停用</i-button>
              </slot>
            </div>
            <div class="pages" >
              <Page v-if="totalPage > 10" :styles="{height: '28px'}"
                :total="totalPage"
                :page-size='pageSize'
                :current="currPage"
                @on-change="change"
                @on-page-size-change="pageSizeChange"
                size="small" show-total show-elevator show-sizer />
              <div v-else style="text-align: right;margin-top:15px">共 {{totalPage}} 条</div>
            </div>
          </div>
    </div>
</template>
<script>
import tableMixin from './tableMixin.js'
    export default {
      name: 'ykt-table-page',
      components: {
        tableCheckAll: () => import('./tableCheckAll')
      },
      data() {
          return {
            page: {
              size: this.pageSize,
              page: this.currPage
            }
          }
      },
      mixins: [tableMixin],
      props: {
        totalPage: {
          type: Number,
          default() { return 0 }
        },
        pageSize: {
          type: Number,
          default() { return 10 }
        },
        currPage: {
          type: Number,
          default() { return 1 }
        },
        noLeft: {
          type: Boolean,
          default() { return false }
        },
      },
      mounted() {
        this.onCheckedAll()
      },
      methods: {
        change(page) {
          this.page.page = page
          this.pageChange()
        },
        pageSizeChange(pageSize) {
          this.page.size = pageSize
          this.pageChange()
        },
        pageChange() {
          this.$emit('pageChange', this.page)
        },
        handle(type) {
          if (!this.selection.length) {
            return (this.$Message.error('请至少选择一项'))
          }
          switch (type) {
            case "delete":
              break
            default:
              break
          }
        }
      }
    }
</script>
<style lang="stylus">
@import '~@/assets/stylus/index'

  #table-page
    .common_pro
      // setBetween()
      mt(20px)
      .left_pro
        fl()
        > *
          fl()
          margin:0 5px
          bgColor()
        .checkbox
          mt(8px)
          fl()
          mr(20px)
      .pages
        align-self flex-end
        fr()
        mt(-5px)
</style>
