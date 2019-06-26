<template>
  <div class="header-remind">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "header-remind",

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
.header-remind
  padding: 20px 20px 25px;
  background-color: #fffaf2;
  >p
    font-size: 12px;
    line-height: 24px;
    i
      color: #409eff;
  strong
    display inline-block
    margin-right 40px
    font-size: 16px;
    color: #409eff;
    font-weight: 700;
</style>
