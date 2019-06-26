<template>
  <div class="event-type">
    <div class="icon" v-html="eventType.icon"></div>
    <div class="type_text" v-html="eventType.text"></div>
  </div>
</template>
<script>
export default {
  name: 'eventType',
  props: {
    item: {
      type: Object,
      default:() => {}
    }
  },
  computed: {
    eventType() {
      switch (this.item.code) {
        case 'subscribe':
          return {
            icon: '&#xe692;',
            text: '关注公众号'
          }
        case 'unsubscribe':
          return {
            icon: '&#xe65d;',
            text: '取消关注'
          }
        case 'SCAN':
          return {
            icon: '&#xe712;',
            text: '扫码'
          }
        case 'LOCATION':
          return {
            icon: '&#xe631;',
            text: '当前位置'
          }
        case 'CLICK':
          return {
            icon: '&#xe62e;',
            text: '点击菜单'
          }
        default:
          return {
            icon: '&#xe62d;',
            text: '发消息'
          }
      }
    }
  }
}
</script>
<style lang="stylus">
.event-type
  display flex
  align-items center
  .icon
    font-size 18px
    color #606366
  .type_text
    color #303133
    font-size 16px
    margin-left 8px
    font-weight bold
</style>

