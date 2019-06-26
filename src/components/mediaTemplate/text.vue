<template>
  <div class="media-text-view" v-html="textToHtml"></div>
</template>

<script>
import { addTags } from '@/pages/admin/tencent/components/text/textHtmlChange.js'
// import { addTags } from '@/utils/textHtmlChange.js'
export default {
  name: "media-text",
  props: {
    text: {
      type: String,
      default: () => {}
    }
  },
  computed: {
    textToHtml() {
      return addTags(this.text, 'span')
    }
  },
  data() {
    return {}
  },
  mounted() {
  },
  methods: {
  }
}
</script>

<style lang="stylus">
  .media-text-view
    line-height 20px
</style>

