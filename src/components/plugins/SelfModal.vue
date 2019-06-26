/*
 *location 弹窗的位置，默认居中
 *showPop 是否显示弹窗
 */
<template>
    <div id="self_modal">
      <transition name="fade" mode="out-in">
        <div v-show="showPop" class="self_modal_wrap">
          <div class="self_modal_mask" @click.stop="hide"></div>
          <div :style="styleObj" class="self_modal_content" :id="id">
              <slot></slot>
          </div>
        </div>
      </transition>
    </div>
</template>

<script>
  export default {
    name: "detailPop",
    data() {
      return {
          isShow: false,
          style: {},
          id: new Date().getTime(),
          styleObj: {}
      }
    },
    model: {
        prop: 'showPop',
        event: 'close'
    },
    props: ['showPop', 'location', 'zIndex'],
    mounted() {
      this.$nextTick(() => {
        this.styleObj = this.getPostion()
      })
    },
    methods: {
      hide() {
          this.$emit('close', false)
      },
      getPostion() {
        let dom = document.documentElement.getBoundingClientRect()
        let obj = document.getElementById(this.id).getBoundingClientRect()
        return {
          marginTop: (dom.height - obj.height) / 2 + 'px',
          marginLeft: (dom.width - obj.width) / 2 + 'px'
        }
      },
      getStyle() {
        if (this.location) {
          switch (this.location) {
            case 'top': 
              return {
                  left: '50%',
                  top: '50px',
                  transform: 'translateX(-50%)'
              }
            case 'bottom': 
              return {
                  left: '50%',
                  bottom: '50px',
                  transform: 'translateX(-50%)'
              }
            case 'left': 
              return {
                  top: '50%',
                  left: '50px',
                  transform: 'translateY(-50%)'
              }
            case 'right': 
              return {
                  top: '50%',
                  right: '50px',
                  transform: 'translateY(-50%)'
              }
            default : 
                return {
                    left: '50%',
                    top: '50%',
                    transform: 'translate(-50%, -50%)'
                }
          }
        } else {
          return {
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)'
          }
        }
      }
    }
  }
</script>

<style lang="stylus" scoped>
  .slide-fade-enter-active, .slide-fade-leave-active
    transition all 2s ease-in-out
  .slide-fade-enter, .slide-fade-leave-to
    transition all 2s ease-in-out
    
  @import '~@/assets/stylus/index'
  #self_modal
    .self_modal_wrap
      fixed()
      top: 0
      left: 0
      right: 0
      bottom: 0
      z-index:9999
      .self_modal_mask
          position:absolute
          width:100%
          height:100%
          bgColor(rgba(0, 0, 0, 0.5))
      .self_modal_content
        relative()
        inline()
        bgColor()
</style>
