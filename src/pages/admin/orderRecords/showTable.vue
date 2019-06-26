<template>
  <div id="showTable">
    <table width="100%">
      <thead>
        <tr>
          <td v-for="(item, index) in columns" :key="index" v-html="item" :style="{width: item === '订购人微信' && '170px'}"></td>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td v-for="(item, index) in datas" v-html="item" :key="index" :class="{'allMiddle': allMiddle}"></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script>
  export default {
    name: 'showTable',
    data() {
      return {}
    },
    props: ['datas', 'allMiddle', 'columns'],
    methods: {

    }
  }
</script>
<style lang="stylus">
@import '~@/assets/stylus/index'
    #showTable
      clear()
      display:block
      table
        td:first-child
          padl(10px)
        thead
          borb()
          td
            vertical(40px)
          tr
            bgColor(#f7f9fa)
        tbody
          tr
            height: 86px
            td
              relative()
              >div
                fl()
                margin: auto auto
              >span
                inline()
                line-height:70px
            .allMiddle
              >span
                line-height:84px
    #showTable
      borb(1px solid #ddd)
      .priceObj
        position:absolute
        top:-3px
        left:0
        p
          mt(30px)
        span
          text-decoration line-through
          color(#979899)
      .userObj
        absolute()
        top: 28px
        left:0
        img
          fl()
          width:35px
          height:35px
          mr(5px)
          radius(3px)
        .infos
          fl()
          p
            width 120px
            ellipsis()
      span
        inline()
        vertical(20px)
      .process
        .process_wrap
          padt(25px)
          p
            inline()
            height:30px
            line-height:28px
            radius(3px)
            width:80px
            center()
            cursor()
            border: 1px solid #ededed
          .pay_now
            color()
            mr(6px)
            bgColor(text_color)
</style>
