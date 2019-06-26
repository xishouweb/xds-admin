<template>
  <div class="header-title" :class="{'header-title-border': border}">
    <p>
      <slot></slot>
    </p>
  </div>
</template>

<script>
export default {
  name: "header-title",
  props: {
    border: {
      type: Boolean,
      default: false
    }
  },
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

<style lang="stylus" scope>
.header-title
  height: 70px
  line-height 70px
  p
    font-family: MicrosoftYaHei
    font-size: 18px
    font-weight: 700
    color: #0c0c0d
.header-title-border
  border-bottom solid 1px #e3e5e6
</style>
