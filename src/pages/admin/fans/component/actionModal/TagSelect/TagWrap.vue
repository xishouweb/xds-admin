<template>
  <div class="tagListWrap">
    <ScrollBar>
      <TagList
        v-for="item in list"
        :defaultValue="filterSelectedTag(item.id)"
        :list="item.fansWxTagDtos"
        :title="item.name"
        :id="item.id"
        :single="item.specialGroup === 1"
        v-if="item.fansWxTagDtos"
        :key="item.id"
        @change="changeSelected"
      ></TagList>
    </ScrollBar>
  </div>
</template>

<script>
import TagList from "./TagList"
export default {
  name: "tag-wrap",
  components: { TagList },
  props: {
    id: {
      type: [String, Number],
      default: ''
    },
    defaultValue: {
      type: Array,
      default() {
        return []
      }
    },
    list: {
      type: Array,
      default: () => {
        return []
      }
    },
  },
  data() {
    return {
      selectedTags: this.defaultValue
    }
  },
  watch: { // 触发change事件,groupId
    // defaultValue(val) {
    //   this.selectedTags = val
    // },
    selectedTags(val) {
      this.$emit('change', {id: this.id, value: val})
    },
  },
  methods: {
    filterSelectedTag(id) {
      const selectValue = this.selectedTags.filter(item => item.id === id)[0]
      if (selectValue) {
        return selectValue.value
      } else {
        return []
      }
      // return []
    },
    changeSelected(val) {
      if (this.selectedTags.some(item => item.id === val.id)) {
        if (val.value.length) {
          // 替换
          this.selectedTags = this.selectedTags.map(item => {
            if (item.id === val.id) {
              item.value = val.value
            }
            return item
          })
        } else {
          // 移除
          this.selectedTags = this.selectedTags.filter(
            item => item.id !== val.id
          )
        }
      } else {
        // 添加
        this.selectedTags = [...this.selectedTags, val]
      }
    }
  }
}
</script>

<style lang="stylus">
.tagModal
  display flex
  align-items center
  justify-content center
  .ivu-modal
    top 0
  .ivu-modal-content
    box-shadow 0px 1px 6px 0px
    rgba(0, 0, 0, 0.2)
    border-radius 3px
    border solid 1px #cacbcc
  .ivu-modal-footer
    border-top none
  .footer
    border-top 1px solid #e9eaec
    padding 20px 0 8px
  .ivu-modal-header
    border none
    .ivu-modal-header-inner
      font-size 18px
      font-weight normal
      color #303133
  .ivu-modal-header
    padding 20px 20px 0
  .ivu-modal-body
    padding 0 20px 20px
  .ivu-tabs-tab
    padding 32px 22px 18px 10px
  .ivu-tabs-ink-bar
    visibility hidden
    display none
.tagListWrap
  max-height 420px
  height 240px
  font-size 14px
  color #303133
  .tagGroup
    margin-bottom 20px
  .tagHeader
    margin-bottom 16px
    .selectAll
      float right
      font-size 12px
      &.isAll
        color #409fff
  .tagList
    font-size 14px
    line-height 28px
    .tag
      position relative
      display inline-block
      margin-right 16px
      margin-bottom 18px
      box-sizing border-box
      background-color #ffffff
      border-radius 3px
      border solid 1px #dcdcdc
      padding 0 14px
      color #606366
      line-height 30px
      cursor pointer
      transition color 0.2s linear, background-color 0.2s linear, border 0.2s linear, box-shadow 0.2s linear, -webkit-box-shadow 0.2s linear
      &:hover
        border solid 1px #409eff
        color #409eff
      &-checked
        border solid 1px #409eff
        color #409eff
      .ivu-icon
        display none
        font-size 16px
        color rgba(0, 0, 0, 0.5)
        position absolute
        top -6px
        right -4px
      &-remove:hover
        .ivu-icon
          display block
</style>

