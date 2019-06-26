/*
 * menuList 数组，处理后的套餐列表
 ******************************
 * 使用curMenu方法抛出被点击的套餐对象及数量
 */
<template>
  <div id="menus">
    <div class="cont_wrap" :style="{width: menuList.length ? (100 / menuList.length) + '%' : 0}"
      v-for="(item, index) in menuList" :key="index"
      :class="[selectedIdx === index ? 'selected' : '', item.className, item.isVailUse ? '' : 'disabled']"
      @click="setActive(item, index)">
      <div class="menus_wrap" >
        <div class="menu_title" :class="item.className">
          <div class="recommend" v-if="item.recommend === 1 && !item.notShowRecommend">
            <Triangle direction="topLeft" width="32" content='荐' bgColor="#f8461a"></Triangle>
          </div>
          <div class="menu_name">
            <h3>{{item.name}}</h3>
            <span v-if="item.isUsing">使用中</span>
          </div>
          <i class="suitable_num">{{item.summary}}</i>
        </div>
        <div class="diable_menu" v-if="!item.isVailUse">
          <h3>不可订购</h3>
          <Poptips placement="bottom" :content="item.content" width="160"></Poptips>
        </div>
        <div class="single_menu" v-if="showSingle(item, index)" :style="{marginBottom: (selectedIdx === index ? '20px': '60px')}">
          <span>¥<h3>{{item.arr ? item.arr[0].discountsPrice / 100 : item.discountsPrice / 100}}</h3>/{{item.arr ? item.arr[0].dateUnit : item.dateUnit}}</span>
          <p class="origin_text">¥{{item.arr ? item.arr[0].price / 100: item.price / 100}}/{{item.arr ? item.arr[0].dateUnit : item.dateUnit}}</p>
        </div>
        <div class="multiple_menu" v-if="showMultiple(item, index)" :style="{marginBottom: (selectedIdx === index ? '5px': '60px')}">
          <ul>
            <li v-for="(val, idx) in item.arr" :key="idx" @click.stop="childSetActive(val, index, idx)"
            :class="{'active': childFilter(index, idx)}">
              <span class="icons" v-if="childFilter(index, idx)">
                <Triangle direction="topRight" width="22" content='&#xe659;' bgColor="#f8461a"></Triangle>
              </span>
              <i>¥{{val.discountsPrice / 100}}/{{val.dateUnit}}</i>
            </li>
          </ul>
        </div>
        <div class="num_control" v-if="selectedIdx === index">
          <Input v-model="numInput" class="num_input" @on-blur="inputBlur(paramHandle(item))">
            <span slot="prepend" class="minus btn fn12" :class="{'disabled': minusDisable}" @click.stop="minusNum(paramHandle(item))">—</span>
            <span slot="append" class="plus btn fn20" :class="{'disabled': plusDisable}" @click.stop="plusNum(paramHandle(item))">+</span>
          </Input>
          <p class="num_tips">每个企业限购{{paramHandle(item) && (paramHandle(item).mostBuyNum - paramHandle(item).usedNum)}}件</p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    name: '',
    data() {
        return {
          numInput: 1,
          selectedIdx: -1,
          childActiveIdx: -1,
          minusDisable: true,
          plusDisable: false
        }
    },
    props: {
      menuList: {
        type: Array,
        default: () => { return [] }
      }
    },
    watch: {
      menuList(nv) {
        console.log(nv)
        this.menuList.length && this.init()
      }
    },
    components: {},
    methods: {
      init() {
        // 获取正在使用的套餐的角标
        this.menuList.forEach((item, idx) => {
          if (item.recommend === 1 || item.recommend === true) {
            this.selectedIdx = idx
            if (item.arr) {
              item.arr.forEach((val, index) => {
                val.recommend === 1 && (this.childActiveIdx = index)
              })
            }
          }
        })
        this.handleEmit(this.menuList[this.selectedIdx])
        console.log(this.menuList)
      },
      paramHandle(item) {
        return item.arr ? item.arr[this.childActiveIdx] : item
      },
      childFilter(index, idx) {
        return index === this.selectedIdx && (idx === this.childActiveIdx)
      },
      getChildIndex(item) {
        if (item.arr) {
          let idx = item.arr.findIndex((val) => {
            return val.recommend === true
          })
          return idx > -1 ? idx : 0
        }
        return -1
      },
      // 各大类套餐之间切换
      setActive(item, idx) {
        this.minusDisable = false
        this.plusDisable = false
        if (this.selectedIdx === idx) return false
        if (!item.isVailUse) return false
        this.childActiveIdx = this.getChildIndex(item)
        this.numInput = 1
        this.selectedIdx = idx
        this.handleEmit(item)
      },
      showSingle(item, index) {
        if (item.isVailUse) {
          if (!item.arr) {
            return true
          } else {
            return this.selectedIdx !== index
          }
        }
        return false
      },
      showMultiple(item, index) {
        return item.isVailUse && item.arr && (this.selectedIdx === index)
      },
      // 同组之间套餐切换
      childSetActive(val, index, idx) {
        // this.minusDisable = false
        // this.plusDisable = false
        this.childActiveIdx = idx
        this.numInput = 1
        this.handleEmit(val)
      },
      // 数字输入框失焦
      inputBlur(item) {
        if (this.isNumber(this.numInput)) {
          (this.numInput > item.mostBuyNum - item.usedNum) && (this.numInput = item.mostBuyNum - item.usedNum)
          this.numInput = parseInt(this.numInput)
        } else {
          this.numInput = 1
        }
        this.handleEmit(item)
      },
      plusNum(item) {
        if (this.numInput + 1 > item.mostBuyNum - item.usedNum) {
          this.plusDisable = true
        } else {
          this.minusDisable = false
          this.numInput += 1
          if (this.numInput === (item.mostBuyNum - item.usedNum)) {
            this.plusDisable = true
          }
          this.handleEmit(item)
        }
      },
      minusNum(item) {
        if (this.numInput < 2) {
          this.minusDisable = true
        } else {
          this.plusDisable = false
          this.numInput -= 1
          if (this.numInput === 1) {
            this.minusDisable = true
          }
          this.handleEmit(item)
        }
      },
      // 抛出数据
      handleEmit(obj) {
        if (obj && obj.arr) {
          this.emitSelect(obj.arr[this.childActiveIdx], this.numInput)
        } else {
          this.emitSelect(obj, this.numInput)
        }
      },
      emitSelect(obj, num) {
        this.$emit('curMenu', obj, num)
      }
    }
  }
</script>
<style lang="stylus">

@import '~@/assets/stylus/index'
  #menus
    ml(-15px)
    mr(-15px)
    .cont_wrap
      fl()
      padding: 0 5px
      &.bg0.selected
        .menus_wrap
          box-shadow 0px 0px 10px 0px #a4e305
          li.active
            border-color: #a4e305
          // .triangle
          //   border-top-color: #a4e305 !important
      &.bg1.selected
        .menus_wrap
          box-shadow 0px 0px 10px 0px #ffb505
          li.active
            border-color: #ffb505
          // .triangle
          //   border-top-color: #ffb505 !important
      &.bg2.selected
        .menus_wrap
          box-shadow 0px 0px 10px 0px #15a0f9
          li.active
            border-color: #15a0f9
          // .triangle
          //   border-top-color: #15a0f9 !important
      &.bg3.selected
        .menus_wrap
          box-shadow 0px 0px 10px 0px #ae20f7
          li.active
            border-color: #ae20f7
          // .triangle
          //   border-top-color: #ae20f7 !important
      &.bg4.selected
        .menus_wrap
          box-shadow 0px 0px 10px 0px #d22a01
          li.active
            border-color: #d22a01
          // .triangle
          //   border-top-color: #d22a01 !important
      &.disabled
        .menus_wrap
          cursor: not-allowed
          box-shadow none
      .ivu-input-group-append, .ivu-input-group-prepend
        padding:0
        width:24px
        height:100%
        relative()
      .ivu-input-group-append
        radiusRight(3px !important)
      .ivu-input-group-prepend
        radiusLeft(3px !important)
      .ivu-input
        height:30px
        center()
  #menus
    overflow:hidden
    padding: 10px
    padb(20px)
    .menus_wrap
      // width: 18%
      // mr(2.5%)
      border:1px solid #e5e5e5
      radius(3px)
      center()
      cursor()
      &:last-child
        mr(0)
      .menu_title
        relative()
        color()
        height 94px
        radiusTop(3px)
        &.bg0
          bgAll('/static/images/pay/bg0.png')
        &.bg1
          bgAll('/static/images/pay/bg1.png')
        &.bg2
          bgAll('/static/images/pay/bg2.png')
        &.bg3
          bgAll('/static/images/pay/bg3.png')
        &.bg4
          bgAll('/static/images/pay/bg4.png')
        &.disabled
          bgAll('/static/images/pay/disabled.png')
        .recommend
          absolute()
          top:0
          left:0
        .menu_name
          inline()
          mt(20px)
          mb(10px)
          h3, span
            fl()
          h3
            fn(24px)
            // font-weight:normal
          span
            color(#09bb07)
            vertical(20px)
            bgColor()
            fn(12px)
            padding: 0 7px
            radius(4px)
            mt(2px)
            ml(10px)
        .suitable_num
          fn(12px)
          block()
      .diable_menu
        mt(56px)
        mb(55px)
        h3
          color(#606366)
          normal()
          fn(24px)
          mb(12px)
      .single_menu
        mt(55px)
        mb(20px)
        color(#909499)
        h3
          inline()
          fn(36px)
          color(#303133)
          normal()
        p
          text-decoration:line-through
      .multiple_menu
        mt(28px)
        mb(5px)
        ul
          li
            inline()
            mb(15px)
            width:80%
            height 38px
            border-width:1px
            border-style:solid
            line-height:36px
            border-color:#e6e5e3
            relative()
            // &.active
            //   border-color:#ef5200
            .icons
              absolute()
              top: 0
              right:0
      .num_control
        mb(20px)
        .num_input
          width:90px
          margin:0 auto
          span.disabled
            color(#ccc)
        mt(4px)
        .btn
          absolute()
          left: 0
          right:0
          top:0
          bottom:0
          inline()
          line-height:28px
        .num_tips
          color(err_color)
          fn(12px)
          mt(6px)
</style>
