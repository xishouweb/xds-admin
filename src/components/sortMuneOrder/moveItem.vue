<template>
  <div class="move-box-item"
    v-drag.mousedown.mouseup.stop="onmoving"
    :class="{'position': absolute,
            'clicked': clicked
    }"
    @mousedown.stop="getCurrentItem(index)">
    <slot></slot>
  </div>
</template>

<script>
export default {
  data() {
    return {
      clicked: false,
      parent: null,
    }
  },
  inject: ['moveParent'],
  props: ['index'],
  computed: {
    absolute() {
      return (this.parent.mouseStatus || "up") === "down" && this.parent.canMove
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      this.parent = this.$parent
    },
    onmoving(value) {
      if (value === 'up') {
        this.clicked = false
        this.moveParent.mouseStatus = value
        this.moveParent.resetStyle()
        this.moveParent.reverse()
      } else if (value === 'down') {
        this.clicked = true
        this.$nextTick(() => {
          this.moveParent.mouseStatus = value
        })
        this.moveParent.getInitPosList()
      } else {
        this.moveParent.currentItem.x = value.x
        this.moveParent.currentItem.y = value.y
      }
    },
    getCurrentItem(index) {
      this.moveParent.currentItem = this.moveParent.itemList[index]
      this.moveParent.beforeMove()
    }
  }
}
</script>

<style>
  .move-box .position {
    position: absolute !important;
  }
  .move-box .clicked {
      z-index: 10;
      background: #fff
  }
</style>
