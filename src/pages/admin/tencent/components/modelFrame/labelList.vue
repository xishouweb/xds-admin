<template>
    <ScrollBar>
      <ul class="label">
        <li :class="{active: index === activeIndex}" v-for="(label, index) in labelList" :key="index" @click="selectGroup(label, index)">
              <span class="label-name">{{label.name}}</span>
              <span class="label-count" v-show="label.count">({{label.count}})</span>
        </li>
      </ul>
    </ScrollBar>
</template>

<script>
export default {
  name: "modalGroup",
  data() {
    return {
      activeIndex: 0,
    }
  },
  props: {
    width: {
      type: [String, Number],
      default() { return 160 }
    },
    liHeight: {
      type: [String, Number],
      default() { return 160 }
    },
    labelList: {
      type: Array,
      default() { return [] }
    }
  },
  methods: {
    selectGroup(item, index) {
      this.activeIndex = index
      this.$emit('selectGroup', item, index)
    },
  }
}
</script>

<style lang="stylus" scoped>
.label
    padding-top 15px
    li
      height 15px
      line-height 15px
      font-size: 14px
      color: #606366;
      margin-bottom 30px
      cursor pointer
      display flex

      &.active
        color #409fff
      span
        display inline-block
      .label-name
        overflow hidden
        white-space nowrap
        text-overflow: ellipsis;
        max-width 80%
      .label-count
        width 20%
</style>
