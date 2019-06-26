<template>
  <Button :type="type" @click="saveNew" :disabled="uploading">
    <slot></slot>
  </Button>
</template>

<script>
export default {
  name: "time-bittom",
  props: {
    type: {
      type: String,
      default: ''
    }
  }
}
</script>
