<template>
  <div id="allTag">
    <TagSelect v-if="item.fansWxTagDtos.length>0" v-for="item in value" :key="item.groupId" :specialGroup="item.specialGroup" v-model="item.fansWxTagDtos" :title="item.name" :groupId="item.groupId"></TagSelect>
  </div>
</template>

<script>
import TagSelect from './TagSelect'
export default {
  props: {
    value: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  components: { TagSelect },
  data() {
    return {}
  },
  watch: {
    value: {
      // 将值赋值给状态
      handler(val) {
      },
      deep: true
    }
  },
  methods: {}
}
</script>

<style lang="stylus">
#allTag
  font-size 14px
  color #303133
  .tagGroup
    margin-bottom 10px
    margin-right 20px
  .tagHeader
    margin-bottom 16px
    .selectAll
      float right
      font-size 12px
      cursor pointer
      &.isAll
        color #409fff
  .tagList
    font-size 14px
    line-height 28px
    .tag
      cursor pointer
      position relative
      display inline-block
      margin-right 16px
      box-sizing border-box
      border solid 1px #cacbcc
      border-radius 16px
      padding 0 14px
      color #606366
      line-height 32px
      margin-bottom 10px
      &:hover
        color #409fff
        border solid 1px #409fff
      &-default:hover
        border solid 1px #59acff
        background #fff
        color #59acff
      &-checked
        background #409fff
        border solid 1px #409fff
        color #fff
        &:hover
          color #fff
      &-disabled
        background-color #f2f4f5
        border solid 1px #dcdcdc
        color #606366
        cursor not-allowed
        &:hover
          border solid 1px #dcdcdc
          color #606366
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

