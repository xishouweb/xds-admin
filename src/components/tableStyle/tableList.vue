<template>
  <div id="ykt-table-list">
      <div
          v-for="(item, index) in list"
          :key="index"
          style="margin-bottom: 49px"
      >
        <div class="li_wrap">
          <div class="deep_wrap">
              <slot v-bind:="item"></slot>

              <Poptip
                placement="right-start"
                class="badge-more"
                transfer
                trigger="hover"
                popper-class="media-popperTemp"
              ><div ><i class="icon">&#xe608;</i></div>
                <div slot="content" class="action-list">
                  <ul>
                    <li @click="modityTemp(item)">修改</li>
                    <li @click="delTemp(item, 1)">删除</li>
                  </ul>
                </div>
              </Poptip>
          </div>
        </div>
      </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
  export default {
    name: 'ykt-table-list',
    components: {
    },
    data() {
      return {
        showModal: false,
        showOverView: false,
        coverType: true,
        overviewIndex: 0,
        currentMedia: {},
        mediaType: {
          news: "PicText",
          image: "PicTemp"
        },
        checkedType: this.selectType,
        selectedList: [],
        activeIdx: 0,
        imgList: this.list,
      }
    },
    props: ["list", "type", "gutter", "size", "width", "height", "selectType"],
    watch: {
      selectType(nv) {
        this.showOverView = false
        this.checkedType = nv
        if (nv === 'mulite') {
          if (this.type) { this.coverType = true }
        } else {
          // this.coverType = false
        }
      }
    },
    computed: {
      ...mapGetters({
        currPublic: 'publicAccount/curPublic'
      }),
      col() {
        return String(parseInt((document.documentElement.clientWidth - 540) / 280))
      }
    },
    mounted() {
      this.init()
    },
    methods: {
      init() {
        this.$emit('on-change', this.imgList[0])
      },
      chooseIdx(idx) {
        this.activeIdx = idx
        let selectedItem = this.list[idx]
        if (this.checkedType === 'mulite') {
          if (!selectedItem.checked) {
            this.$set(selectedItem , "checked", true)
            this.selectedList.push(selectedItem)
          } else {
            let index = this.selectedList.indexOf(selectedItem)
            this.$set(selectedItem , "checked", false)
            this.selectedList.splice(index, 1)
          }
          this.$emit('on-change', this.selectedList)
        } else {
          this.$emit('on-change', selectedItem)
        }
      },
      overview(index) {
        this.overviewIndex = index
        this.showOverView = true
      },
      modalConfirm() {
        this.delTemp()
      },
      modityTemp(item) {
        this.$emit('modify', item)
      },
      async delTemp(item, showModal) {
        if (showModal) {
          this.showModal = true
          this.currentMedia = item
        } else {
          let param = {
            type: this.type,
            mediaId: this.currentMedia.mediaId,
            appAccountId: this.currPublic.appAccountId
          }
          let res = await this.$post(this.Path.deleteMedia, param)
          res = res.data
          if (res.code === 1) {
            this.$Message.success('删除成功！')
            this.$emit('delete')
            this.showModal = false
          } else {
            if (res.message.errcode === 48005) {
              this.$Message.error(res.message.errmsg)
            } else {
              this.$Message.error('删除失败！')
            }
          }
        }
      }
    }
  }
</script>
<style lang="stylus">
@import '~@/assets/stylus/index'
  #ykt-table-list
    // height 600px
    height 100%
    .waterfall-item
      padding 14px

    .li_wrap
      display inline-block
      position relative
      margin 2px
      boxSizing()
      .badge, .badge-hover
        display none
        position absolute
        bottom 0px
        right 0px
      .badge-more
        display none
        position absolute
        bottom 12px
        right 10px
      .badge-more
        color #979899
        display block
      .deep_wrap
        cursor pointer
        position relative
        boxSizing()
        transform-origin:center center
        transition: 0.2s all cubic-bezier(.46, 1, .23, 1.52);
        radius(5px)
      &:hover, &.active
        z-index 2
        padb(0px)
        .deep_wrap
          // margin-top:-1px
          bgColor()
          boxShadow(-1px 2px 10px 2px #ccc)

      &:hover
        .badge-more i
          color #409fff
        .badge-hover
          display block
          i
            color #979899
      &.active
        .deep_wrap
          boxShadow(-1px 2px 10px 2px #409fff)
          border_(#409fff)
        .badge
          display block
          i
            color #409fff
  .media-popperTemp.ivu-poptip-popper
    min-width auto
    .ivu-poptip-arrow:after
      left: 0px !important
    .ivu-poptip-inner
      box-shadow 0px 2px 6px 0px rgba(0, 0, 0, 0.35) !important
      border none !important
      .ivu-poptip-body
        padding 0 !important
    .action-list
      width 90px
      padding 10px 0
      text-align center
      cursor pointer
      li
        line-height 30px
        &:not(.disabled):hover
          background #409eff
          color #fff
          a
            color #fff
        &.disabled
          a
            color #cacbcc
            pointer-events none

</style>
