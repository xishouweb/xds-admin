<template>
  <div class="banner">
    <carousel :slides="slides" :inv="invTime"></carousel>
  </div>
</template>
<script>
import carousel from '@/layouts/Carousel'
export default {
  data() {
    return {
      invTime: 4000,
      slides: [
        {
          src: require('@/assets/images/home/banner2.jpg'),
          title: 'xxx1'
        },
        {
          src: require('@/assets/images/home/banner1.jpg'),
          title: 'xxx2'
        }
      ]
    }
  },
  components: {
    carousel
  }
}
</script>

<style lang="stylus">
.banner
  height 500px
  overflow hidden
  img
    width 100%
</style>
