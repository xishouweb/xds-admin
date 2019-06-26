<template>
  <div>
      <ul class="OwO-items">
        <li class="OwO-item" v-for="(oitem,index) in OwOlist" :key="index" @click="chooseEmoji(oitem.title,oitem.url)">
           <img :src="oitem.url" :title="oitem.title" />
        </li>
      </ul>
  </div>
</template>
<script>
import expressionList from '@/utils/expression.js'
export default {
   data() {
     return {
       OwOlist: expressionList
     }
   },
   methods: {
     chooseEmoji: function(title, url) {
      //  this.textarea
      this.$emit('chooseEmoji', title, url)
     }
   }
}
</script>

<style lang="stylus" scoped>
  .OwO-items
    display flex
    flex-wrap wrap
    width 320px

    li,img
      border 1px solid #fafafa
      width 20px
      height 20px

</style>

