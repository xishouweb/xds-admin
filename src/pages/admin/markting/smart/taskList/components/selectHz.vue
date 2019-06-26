<template>
  <!-- 选中发送频率组件 -->
  <div class="send-hz" v-if="list">
    <p v-if="text">{{text}}</p>
    <i-select v-model="hz" @on-change="hzChange" style="width:100px; height:30px; text-align:center;">
      <i-option v-for="(v, i) in list" :value="v.itemValue" :key="i">{{v.itemName}}</i-option>
    </i-select>
  </div>
</template>

<script>
  export default {
    props: ['hz', 'text', 'list'],
    model: {
      prop: 'hz', // 指定v-model绑定的变量
      event: 'input' // 指定变更该变量的自定义事件
    },
    watch: {
      hz(nv) {
        this.$emit('input', nv)
      }
    },
    methods: {
      hzChange(v) {
        this.$root.Bus.$emit('hzChange', v)
      }
    },
  }
</script>

<style lang="stylus">
  .send-hz
    >p
      margin-right: 20px
      line-height: 30px
      float: left
    .ivu-select-single .ivu-select-selection
      height: 30px
    .ivu-select-selected-value, .ivu-select-placeholder
      height: 30px !important
      line-height: 30px !important
</style>
