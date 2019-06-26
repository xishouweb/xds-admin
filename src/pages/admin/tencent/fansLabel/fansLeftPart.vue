<template>
  <div class="fansLeftPart">
    <div class="partone">
      <Button type="ghost" @click="createAndModify('create')" size="small">创建分组</Button>
      <!-- <Button type="ghost" size="small">复制标签分组</Button>
      <Button type="ghost" size="small" @click="createLabelGroup">创建分组</Button> -->
      <Button type="ghost" size="small" @click="createAndModify('copyGroup')">复制分组及标签</Button>
    </div>
    <div class="parttwo">
      <BScroll class="fansLeft-scroll">
        <Group @createAndModify="createAndModify" :groupData="groupData"></Group>
      </BScroll>
    </div>
  </div>
</template>
<script>
import Group from './group'
export default {
  name: 'fansLeftPart',
  props: {
    groupData: {
      type: Object,
      default: () => {}
    },
    drawer: {
      type: Object,
      default: () => {}
    },
    // 可用公众号数量
    usablePublicNum: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      showCreateAndModify: false,
      titleTips: '',
      createAndModifyType: ''
    }
  },
  mounted() {
  },
  methods: {
    createAndModify(type, item) {
      this.drawer.type = type
      switch (type) {
        case 'create':
          this.$root.Bus.$emit('checkTagAndTagGroup', 'ADD_GROUP')
          this.drawer.title = '创建分组'
          this.drawer.id = null
          this.drawer.name = ''
          this.drawer.specialGroup = 'NO'
          break
        case 'modifyGroup':
          this.drawer.show = true
          this.drawer.title = '修改分组'
          this.drawer.id = item.id
          this.drawer.name = item.name
          this.drawer.specialGroup = item.specialGroup === 1 ? 'YES' : 'NO'
          break
        case 'copyGroup':
          this.$root.Bus.$emit('checkTagAndTagGroup', 'COPY_TAG_GROUP')
          this.drawer.title = '复制标签分组'
          break
        default:
          break
      }
    }
    // createLabelGroup() {
    //   this.drawer.show = true
    //   this.drawer.title = "创建分组"
    //   this.drawer.type = 'create'
    // },
    // copyLabelGroup() {
    //   this.drawer.show = true
    //   this.drawer.title = "复制标签分组"
    //   this.drawer.type = 'copy'
    // }
  },
  components: {
    Group
  }
}
</script>
<style lang="stylus">
.fansLeft-scroll>div:first-child
  padding-right: 10px
.fansLeftPart
  height 100%
  display flex
  flex-direction column
  padding-bottom 20px
  .partone
    display flex
    padding 25px 20px 20px
    justify-content space-between
    flex-shrink 0
  .parttwo
    flex 1
  .btn
    .ivu-btn
      width 120px
      &:first-of-type
        margin-right 15px
</style>


