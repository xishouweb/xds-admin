<template>
<div class="mask" @click="close($event)"  v-if="value">
  <div id="mask-modal-on" :style="{'width': width + 'px'}" :class="[propClass]" @click.stop>
    <slot name="header"></slot>
    <slot></slot>
    <slot name="footer"></slot>
  </div>
</div>
</template>
<script>
  export default {
    name: 'MaskModal',
    props: {
      value: {
        type: Boolean,
        default() { return false }
      },
      width: {
        type: [Number, String],
        default() { return '' }
      },
      propClass: {
        type: String,
        default() { return '' }
      },
      transfer: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {

      }
    },
    mounted() {
      if (this.transfer) {
        document.body.appendChild(this.$el)
      }
    },
    methods: {
      close(event) {
        this.$emit('input', false)
      }
    },
  }
</script>
<style lang="stylus">
@import "~@/assets/stylus/index.styl"
#mask-modal-on
  box-shadow: 1px 0px 6px 0px rgba(0, 0, 0, 0.2);
  position fixed
  z-index 100
  left 50%
  top 50%
  transform translate(-50%, -50%)
  z-index 1000
  border-radius 3px
  overflow hidden
  .model-header
    font-size: 18px;
.mask
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(55, 55, 55, .6);
  height: 100%;
  z-index: 500;
</style>

