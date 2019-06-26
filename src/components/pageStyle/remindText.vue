<template>
    <p class="gray-text">
      <slot></slot>
    </p>
</template>

<script>
export default {
  name: "gray-text",
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
.gray-text
    display: inline-block
.gray-text
    height: 12px;
    font-family: MicrosoftYaHei;
    font-size: 12px;
    font-weight: normal;
    font-stretch: normal;
    letter-spacing: 0px;
    color: #979899;
</style>
