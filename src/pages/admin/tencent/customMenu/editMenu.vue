<template>
  <div class="editMenu">
    <div class="item-left">
      <WechatMenu :type="type" :menuParams="passParams"></WechatMenu>
    </div>
    <div class="item-right">
      <WechatContent :type="type" v-if="Object.keys(passParams.currentMenu).length > 0" :contentParams="passParams" @lastStep="lastStep"></WechatContent>
    </div>
  </div>
</template>
<script>
import WechatMenu from '../components/WechatContent/WechatMenu'
import WechatContent from '../components/WechatContent/'
export default {
  name: 'customMenuEditMenu',
  props: {
    type: {
      default: '',
      type: String
    }
  },
  data() {
    return {
      passParams: {
        level: 0,
        menu: [],
        selectedMenuIndex: '',
        selectedSubMenuIndex: '',
        menuNameBounds: 1,
        currentMenu: {}
      }
    }
  },
  methods: {
    updataMenuDone(params) {
      this.passParams = params
    },
    lastStep(val) {
      this.$emit('lastStep', val)
    },
    saveMenuSuccess(data) {

    }
  },
  components: {
    WechatMenu,
    WechatContent
  }
}
</script>
<style lang="stylus">
@import '~@/assets/stylus/mixin'
.editMenu
  padding-bottom 20px
  min-height 650px
  position relative
  clear()
  .item-left
    float left
    width 314px
  .item-right
    float left
    margin-left 30px
    width calc(100% - 344px)
</style>


