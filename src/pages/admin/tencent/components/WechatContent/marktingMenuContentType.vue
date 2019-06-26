<template>
  <div class="menuContentType">
    <div class="content-wrapper" :class="{errBorder: errNoData === 2 || errNoData === 3}">
      <!-- <div class="content-icon" v-if="showType">
        <div
          v-for="(item, index) in contentIcon"
          class="content-icon-item"
          @click.stop="selectType(index, item.key, item.type)"
          :class="{active: keyType===item.key}"
          :key="index"
        >
          <span class="icon" v-html="item.icon"></span>
          <div class="content-text">{{item.text}}</div>
        </div>
      </div> -->
      <div class="content-item">
        <MaterialType :type="type" ref="material" :noType="noType" :messageContent="messageContent" :keyType="keyType"></MaterialType>
      </div>
    </div>
    <div class="err-text" v-show="errNoData === 2">{{errText[0]}}</div>
    <div class="err-text" v-show="errNoData === 3">{{errText[1]}}</div>
  </div>
</template>
<script>
import Const from './const'
import MaterialType from './markting'
export default {
  name: 'marktingMenuContentType',
  components: {
    MaterialType,
  },
  model: {
    prop: 'errNoData',
    event: 'changeStatu'
  },
  props: {
    // 1: 正常 2：菜单内容为空 3：自定义text类型的文本超过设置长度
    errNoData: {
      default: 1,
      type: Number
    },
    errText: {
      default: () => ['请设置当前菜单内容','不能超过600个字符'],
      type: Array
    },
    messageContent: {
      default: () => {},
      type: Object
    },
    type: {
      default: '',
      type: String
    },
    showType: { // 是否显示类型切换栏
      default: true,
      type: Boolean
    },
    noType: { // 不需要的编辑类型
      default: () => [],
      type: Array
    }
  },
  computed: {
    keyType: {
      get() {
        return this.messageContent.key
      },
      set() {
      }
    }
  },
  watch: {
    noType() {
      this.clearNoType()
    }
  },
  data() {
    return {
      contentIcon: Const.contentIcon,
      showMedia: false,
      material: {},
    }
  },
  mounted() {
    this.clearNoType()
  },
  methods: {
    clearNoType() { // 清除不需要的类型的图标
      if (this.noType.length) {
        let icon
        this.noType.forEach(typ => {
          icon = this.contentIcon.filter(v => v.key !== typ)
        })
        this.contentIcon = icon
      }
    },
    selectType(idx, keyType, type) {
      if (this.keyType === keyType) {
         return
      }
      this.keyType = keyType
      this.$emit('sendType', keyType, null, type)
    },
    selectFromMaterial() {
      this.showMedia = true
    },
    getMaterial(material) {
      this.showMedia = false
      this.material = material
    },
    uploadSuccess(path) {
    }
  }
}
</script>
<style lang="stylus">
@import '~@/assets/stylus/mixin'
.menuContentType
  display block
  position: relative
  .content-wrapper
    border solid 1px #e3e4e5
    &.errBorder
      border solid 1px #f56c6c
    .content-icon
      padding-left 25px
      min-height 60px
      background-color #f7f9fa
      clear()
      .content-icon-item
        cursor pointer
        float left
        margin-right 40px
        &:nth-last-of-type(1)
          margin-right 0
        &.active
          color #409fff
        &:hover
          color #409fff
        .icon
          display inline-block
        .content-text
          display inline-block
  .err-text
    position: absolute
    left: 0
    bottom: -22px
    font-size 12px
    line-height: 1
    color: #f56c6c
</style>
