<template>
  <div class="tab-panels" ref="panels">
    <div class="tab-panels-group" ref="panelsGroup">
      <slot>
        <tab-panel v-for="item in data" :value="item.value" :key="item.value">
          {{item.value}}
        </tab-panel>
      </slot>
    </div>
  </div>
</template>
<script>
  import TabPanel from './TabPanel.vue'
  import { findIndex } from './utils'
  export default {
    name: 'tab-panels',
    props: {
      value: {
        type: [String, Number]
      },
      data: {
        type: Array,
        default () {
          return []
        }
      }
    },
    created () { // 记录子列表
      this.panels = []
    },
    mounted () { // 设置位置
      this._move(this.value)
    },
    methods: {
      _move(value) { // 根据索引，，将父元素偏移
        const curIndex = findIndex(this.panels, panel => panel.value === value)
        /* istanbul ignore if */
        if (curIndex === -1) {
          return
        }
        const panelsGroup = this.$refs.panelsGroup
        const distance = -(curIndex * 100)
        // this.$nextTick(() => {
        //   panelsGroup.style.cssText = `transform: translateX(${distance}%);height: ${panelsGroup.children[curIndex].offsetHeight}px`
        // })
        panelsGroup.style.transform = `translateX(${distance}%)`
        // panelsGroup.style.height = `${panelsGroup.children[curIndex].offsetHeight}px`
      },
      addPanel (panel) {
        this.panels.push(panel)
      },
      removePanel (panel) {
        const index = this.panels.indexOf(panel)
        if (index > -1) this.panels.splice(index, 1)
      }
    },
    watch: { // 监听设置位置
      value (newV) {
        this._move(newV)
      }
    },
    components: { TabPanel }
  }
</script>
<style lang="stylus">
.tab-panels {
  position: relative;
  overflow: hidden;
}

.tab-panels-group {
  display: flex;
  align-items: flex-start;
  transition: all 0.4s cubic-bezier(0.86, 0, 0.07, 1);
}
</style>
