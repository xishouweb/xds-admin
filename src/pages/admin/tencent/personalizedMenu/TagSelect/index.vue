<template>
  <div id="allTag">
    <ScrollBar>
      <TagSelect @singleFalse="singleFalse" v-if="item.fansWxTagDtos" :single="single" v-for="item in value" :key="item.groupId" :specialGroup="item.specialGroup" v-model="item.fansWxTagDtos" :title="item.name" :groupId="item.groupId"></TagSelect>
    </ScrollBar>
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
    },
    single: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    value: {
      handler(val) {
      },
      deep: true
    }
  },
  methods: {
    singleFalse() {
      this.$emit('singleFalse')
      // this.value = this.value.map((item) => {
      //   if (item.fansWxTagDtos) {
      //     item.fansWxTagDtos = item.fansWxTagDtos.map(_item => {
      //       return {..._item, flag: false}
      //     })
      //   }
      //   return item
      // })
    }
  },
  components: { TagSelect }
}
</script>

<style lang="stylus">
#allTag
  margin-top 15px
  height 240px
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
      border-radius 14px
      padding 0 14px
      color #606366
      line-height 26px
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

