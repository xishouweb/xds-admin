<template>
  <div>
    <!-- current data -->
    <div class="tree-current"
      @mouseleave="hoverchange"
      :class="{'tree-selected': data.selected}">
      <!-- 背景色 -->
      <div class="tree-current-bg"></div>
      <!-- logo -->
      <div class="no-child-node" v-if="!data.children || !data.children.length"></div>
      <div v-else class="tree-circle" @click="showChildren(data)">
        <span class="tree-expend" v-if="data.expend">-</span>
        <span v-else>+</span>
      </div>
      <!-- content -->
      <div class="tree-current-relative" @click.stop="selected(data, index)">
          <div class="text-title">
            <div class="text-title-inner">{{data.label}}</div>
            <div class="num">（{{data.eeNum}}）</div>
          </div>
          <span class="operation-button" v-if="!noaction" @click.stop="actions($event, data, index)">
            <Icon type="android-more-vertical"></Icon>
          </span>
      </div>
    </div>
    <!-- children -->
    <div v-show="data.expend" class="tree-children" v-if="data.children && data.children.length">
      <template v-for="(item, index) in data.children">
        <tree-node
        :parent="data"
        :data="item"
        :index="index"
        :selectedId="selectedId"
        :noaction="noaction"
        :key="index"></tree-node>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  name: 'tree-node',
  props: {
    parent: {
      type: Object,
      default: () => { return [] }
    },
    data: {
      type: Object,
      default: () => { return {} }
    },
    index: {
      type: Number,
      default: 0
    },
    noaction: {
      type: Boolean,
      default: false
    },
    selectedId: {
      type: Number,
      default: -1
    }
  },
  inject: ['treeRoot'],
  data() {
    return {
    }
  },
  watch: {
    'data.children': {
      handler(nv, ov) {
        if (nv && nv.length) {
          this.data.eeNum = nv.reduce((acc, next) => acc + next.eeNum, this.data.copyeeNum)
          if (nv.some(node => node.expend)) {
            this.data.expend = true
          }
        } else {
          this.data.eeNum = this.data.copyeeNum
        }
      },
      deep: true
    },
    selectedId() {
      this.initSelected()
    }
  },
  created() {
    // this.count(this.data)
  },
  mounted() {
    this.count(this.data)
    this.initSelected()
    this.treeRoot.$on('selected', data => {
      if (data.id !== this.data.id) {
        this.data.selected = false
      }
    })
  },
  methods: {
    initSelected() { // 根据id初始化选中项
      if (this.data.id === this.selectedId) {
        this.data.selected = true
        this.selected(this.data, this.index)
        this.parent.expend = true
      }
    },
    count(data) {
      if (data.children && data.children.length) {
        data.eeNum = data.children.reduce((acc, next) => acc + next.eeNum, data.copyeeNum)
      } else {
        data.eeNum = data.copyeeNum
      }
    },
    showChildren(data) {
      data.expend = !data.expend
    },
    hoverchange(data) {
      this.treeRoot.$emit('hover-change', data)
    },
    // 获取当前按钮位置
    actionBottonPos(_event) {
      let clientRect = _event.target.getBoundingClientRect()
      return {
          x: Math.round(clientRect.left),
          y: Math.round(clientRect.top),
          w: Math.round(clientRect.width),
          h: Math.round(clientRect.height)
      }
    },
    //
    actions(event, data, index) {
      this.selected(data, index)
      let position = this.actionBottonPos(event)
      this.treeRoot.$emit('nodeActions', position)
    },
    selected(data, index) {
      data.selected = true

      let param = {
        parent: this.parent,
        brothers: this.parent.children,
        currentNode: data,
        currentIndex: index
      }
      this.treeRoot.$emit('selected', data, param)
    },
  }
}
</script>

<style lang="stylus">
hover-color = #e6f0f5
selected-color = #409eff
.tree-current
  user-select: none;
  position relative
  height 40px
  line-height 40px
  padding-left 26px
  cursor pointer
  white-space nowrap

  .tree-circle
    z-index 3
    position absolute
    width 14px
    height 14px
    text-align center
    line-height 14px
    border-radius 14px
    background #909499
    color #fff
    font-size 14px
    left: 0px;
    top: 13px;
    &:after
      display: block;
      content: "";
      width: 10px;
      height: 1px;
      border-top: 1px solid #d8dfe6;
      z-index: 10;
      margin-top: -7px;
      margin-left: 14px;
    .tree-expend
      font-size 18px
  .operation-button
    width 20px
    display none
    position absolute
    right 0px
    top 0
    font-size 24px
    cursor pointer
    text-align: center;

  .tree-current-relative
    padding-right 20px
    z-index: 2;
    position relative
    .text-title
      display inline-block
      position relative
      max-width calc(100% - 20px)
      padding-right 20px
      .text-title-inner
        white-space nowrap
        text-overflow ellipsis
        overflow: hidden;
    .num
      position: absolute;
      top: 0;
      left calc(100% - 20px)
      height 40px
      line-height 40px
  .tree-current-bg
    position: absolute;
    top: 0;
    right: 0;
    z-index: 0;
    cursor: pointer;
    height: 40px;
    width: 999px;
    background: #ffffff
  &:hover
    .operation-button
      display block
    .tree-current-bg
      background hover-color

  .no-child-node
    display: block;
    position: absolute;
    z-index: 10;
    width: 10px;
    height: 10px;
    top: 11px;
    left: 0;
    content: "";
    border: 1px solid #d8dfe6;
    border-top: none;
    border-right: none;

.tree-selected
  > .tree-current-bg
    background #409eff!important
  > .tree-circle
    background #fff
    color #409eff
    &:after
      border-top 1px solid #ffffff
  > .tree-current-relative
    .text-title, .num
      color #fff
  .operation-button
    color #fff

.tree-children
  padding-left 26px

</style>
