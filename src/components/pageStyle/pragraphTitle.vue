<template>
    <p class="pragraph-title">
      <slot></slot>
    </p>
</template>

<script>
export default {
  name: "pragraph-title",
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
.pragraph-title
    padding-left 20px
    height: 40px;
    line-height 40px
    background-color: #e6edf5;
    font-size: 14px;
    font-weight: 700;
    color: #303133;
</style>
