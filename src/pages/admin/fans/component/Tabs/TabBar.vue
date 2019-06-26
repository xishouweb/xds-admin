<template>
  <div class="tab-bar" :class="{'tab-bar_inline': inline}">
    <slot>
      <tab v-for="item in data" :label="item.label" :value="item.value" :icon="item.icon" :key="item.value">
      </tab>
    </slot>
    <div v-if="showSlider" ref="slider" class="tab-bar-slider"></div>
  </div>
</template>
<script>
  import { findIndex } from './utils'
  import Tab from './TabItem.vue'
  export default {
    name: 'tabBar',
    components: {
      Tab
    },
    props: {
      value: { // 列表值中的一个值
        type: [String, Number],
        required: true
      },
      data: { // 列表
        type: Array,
        default () {
          return []
        }
      },
      inline: { // 图标的显示状态
        type: Boolean,
        default: false
      },
      showSlider: { // 是否显示下划线
        type: Boolean,
        default: true
      },
      useTransition: { // 下划线过渡
        type: Boolean,
        default: true
      }
    },
    created () {
      this.tabs = [] // 设置初始状态
    },
    mounted () { // 初始设置位置
      this._updateSliderStyle()
    },
    methods: {
      addTab (tab) {
        this.tabs.push(tab)
      },
      removeTab (tab) {
        const index = this.tabs.indexOf(tab)
        if (index > -1) this.tabs.splice(index, 1)
      },
      trigger (value) { // 点击触发事件
        // emit click event as long as tab is clicked
        this.$emit('click', value)
        // only when value changed, emit change & input event
        if (value !== this.value) {
          const changedEvents = ['input', 'change']
          changedEvents.forEach((eventType) => {
            this.$emit(eventType, value)
          })
        }
      },
      _updateSliderStyle () { // 是展示线和设置线的宽度和位置
        /* istanbul ignore if */
        if (!this.showSlider) return
        const slider = this.$refs.slider // 获取线dom
        this.$nextTick(() => {
          const { width, index } = this._getSliderWidthAndIndex()
          slider.style.width = `${width}px`
          this.setSliderTransform(this._getOffsetLeft(index))
        })
      },
      setSliderTransform (offset) { // 获取线的偏移位置
        const slider = this.$refs.slider
        if (typeof offset === 'number') {
          offset = `${offset}px`
        }
        if (slider) { // 设置过渡和偏移位置
          if (this.useTransition) slider.style.transition = `transform 0.2s linear`
          slider.style.transform = `translateX(${offset}) translateZ(0)`
        }
      },
      _getSliderWidthAndIndex () { // 获取当前的索引和width
        let width = 0
        let index = 0
        if (this.tabs.length > 0) {
          index = findIndex(this.tabs, (tab) => tab.value === this.value)
          width = this.tabs[index].$el.children[0].clientWidth
        }
        return {
          width,
          index
        }
      },
      _getOffsetLeft (index) { // 根据索引获取偏移位置
        return this.tabs[index].$el.children[0].offsetLeft
      }
    },
    watch: {
      value () { // 根据值更新位置
        this._updateSliderStyle()
      }
    }
  }
</script>
<style lang="stylus">
.tab-bar {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6px 0 8px;
  background: #fff;
}
.tab-bar_inline {
  .tab {
    display: flex;
    align-content: center;
    justify-content: center;
  }
}

.tab-bar-slider {
  position: absolute;
  left: 0;
  bottom: 0;
  height: 2px;
  width: 20px;
  background-color: #1C94F8;
}
</style>
