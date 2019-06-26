<template>
    <ScrollBar>
      <ul class="labels" :style="'width:'+ width +'px'">
        <template v-for="(v, i) in labelList">
          <li :class="{active: i === activeIndex}" :key="i" @click="selectGroup(v, i)">
            <span class="label-name">{{v[showKey[0]]}}</span>
            <span class="label-count" v-show="v.count">({{v[showKey[1]]}})</span>
          </li>
        </template>
      </ul>
    </ScrollBar>
</template>

<script>
import BulletBox from "@/components/BulletBox.vue"
export default {
  name: "labelList",
  components: { BulletBox },
  data() {
    return {
      activeIndex: 0,
    }
  },
  props: {
    width: { // 宽度
      type: [String, Number],
      default() { return 160 }
    },
    liHeight: { // li的高度，暂时未使用该参数
      type: [String, Number],
      default() { return 40 }
    },
    labelList: { // 数据列表
      type: Array,
      default() { return [] }
    },
    showKey: { // 需要显示的属性名
      type: Array,
      default() {
        return ['name', 'count']
      }
    },
    id: { type: [String, Number] }, // 当前选中项id
  },
  watch: {
    id(newV) {
      if (newV) {
        this.getDex()
      } else {
        this.activeIndex = 0
      }
    }
  },
  mounted() {
    if (this.id) {
      this.getDex()
    }
  },
  methods: {
    getDex() { // 根据id获取默认选中索引
      this.labelList.forEach((v, i) => {
        if (v.templateId === this.id) {
          this.activeIndex = i
        }
      })
    },
    selectGroup(item, index) { // 项目切换
      this.activeIndex = index
      this.$emit('selectGroup', item, index)
    },
  }
}
</script>

<style lang="stylus" scoped>
.labels
    padding-top 15px
    li
      display: flex
      font-size: 14px
      color: #606366
      // margin-bottom 30px
      cursor pointer
      height: 40px
      line-height: 40px
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
