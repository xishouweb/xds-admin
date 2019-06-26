<template>
  <!-- 操作按钮组(在列表中使用出现问题，待修改) -->
  <Poptip :trigger="trigger" :placement="placement" transfer>
    <slot></slot>
    <ul class="handel-list" slot="content">
      <template v-for="(v, i) in buttons">
        <li :key="i" @click="handle(v.key)">{{v.text}}</li>
      </template>
    </ul>
  </Poptip>
</template>

<script>
  export default {
    data() {
      return {

      }
    },
    porps: {
      trigger: { // 触发方式
        type: String,
        default: 'click'
      },
      placement: { // 出现位置
        type: String,
        default: 'left-start'
      },
      buttons: { // 按钮列表
        type: Array,
        default() {
          return [
            {
              text: '修改',
              key: 'updata'
            },
            {
              text: '复制',
              key: 'copy'
            },
            {
              text: '删除',
              key: 'delete'
            }
          ]
        }
      }
    },
    components: {},
    computed: {},
    methods: {
      handle(type) { // 点击操作按钮
        this.$emit('handle', type) // type为操作类型
      }
    },
  }
</script>

<style lang="stylus">
.handel-list
  padding: 10px 0
  >li
    height: 30px
    line-height: 30px
    text-align: center
    cursor: pointer
    &:hover
      color: #fff
      background-color: #409eff
</style>
