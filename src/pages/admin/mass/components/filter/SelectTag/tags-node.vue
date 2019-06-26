<template>
  <div class="tags" v-if="group">
    <!-- 当前组数据 -->
    <p class="tags-header">
      {{group.name}}
      <!-- <span v-if="group.isRadio">（单选）</span> -->
      <span
        class="tags-action"
        :class="{'tags-action-checked': isEqual }"
        @click="checkAll(isEqual)"
        v-if="group.fansWxTagDtos"
      >{{isEqual ? '取消全选': '全选'}}</span>
    </p>
    <!-- 标签列表 -->
    <div class="tags-content" v-if="group.fansWxTagDtos">
        <!-- v-for="v in group.tags" -->
      <div
        class="tags-item"
        v-for="(v, i) in group.fansWxTagDtos"
        :key="v.tagId"
        :class="{'tags-item-checked': v.checked}"
        @click="tagTap(i)"
      >
        <span>{{v.tagName}}</span>
      </div>
    </div>
  </div>
</template>

<script>
import _ from "lodash"
import findParent from "./find-parent"
export default {
  name: "tags-node",
  mixins: [findParent],
  props: {
    group: { // 标签分组及标签
      type: Object,
      default() {
        return {
          id: 1,
          name: "数字",
          mode: "checkbox", // 多选和单选
          children: [
            {
              id: "11",
              name: "11"
            },
            {
              id: "12",
              name: "12"
            }
          ]
        }
      }
    },
    dex: null, // 当前分组索引
    type: {
      type: String,
      default: "undeleted" // 不可移除的 deleted,可移除的
    },
    needRadio: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    isEqual() { // 判断当前组是否处于全选状态
      if (this.group && this.group.fansWxTagDtos) {
        let tags = this.group.fansWxTagDtos
        let num = 0
        tags.forEach(v => {
          if (v.checked) { num++ }
        })
        return !!(num === tags.length)
      }
    }
  },
  watch: {
  },
  created() {
    this.findParent("tags-container")
  },
  methods: {
    checkAll(check) { // 全选、取消全选
      // this.$root.Bus.$emit('on-checkAll', this.dex, !check)
      this.$emit('on-checkAll', this.dex, !check)
    },
    tagTap(dex) { // 点击标签
      // this.$root.Bus.$emit('on-check', this.dex, dex)
      this.$emit('on-check', this.dex, dex)
      // if (this.group.isRadio && this.needRadio) {
      //   this.setCheck(false)
      //   v.checked = true
      // } else {
      //   v.checked = !v.checked
      // }
    },
    // setCheck(bool) { // 统一设置当前组内标签状态
    //   if (this.group.fansWxTagDtos && this.group.fansWxTagDtos.length) {
    //     this.group.fansWxTagDtos.forEach(v => {
    //       v.checked = bool
    //     })
    //   }
    // },
  }
}
</script>

<style lang="stylus">
.tags
  margin-bottom 20px
.tags-header
  margin-bottom 16px
  span
    color #909499
  .tags-action
    float right
    font-size 12px
    cursor pointer
    &-checked
      color #409fff
.tags-content
  font-size 14px
  line-height 28px
  .tags-item
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
    &-delete
      border solid 1px #409eff
      color #409eff
      .icon
        font-size 12px
        cursor pointer
</style>
