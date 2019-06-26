<template>
  <div class="headerSubtitle">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "headerSubtitle",

  data() {
    return {

    }
  },
  mounted() {

  },

  methods: {


  }
}
</script>

<style lang="stylus">
.headerSubtitle
  height 34px
  border-top 1px solid #edeff0
  margin-bottom 20px
  >p
    font-size: 12px;
    line-height: 34px;
    font-weight 700
    span
      font-weight 600
      color #606366
    i
      color: #409eff;
</style>
