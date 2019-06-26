<template>
  <div id="mediaList-m">
      <div v-if="type==='news'">
        <Waterfall class="waterfall-item-m">
          <template>
              <WaterfallItem
                v-for="(item, index) in initList"
                :width="320"
                :key="index"
                style="margin-bottom: 30px;"
              >
                <div class="li_wrap">
                  <div
                    class="deep_wrap"
                  >
                    <component :is="mediaType[type]" style="background: #f7f9fa"
                      :coverType="coverType"
                      :size="size"
                      :width="width"
                      :height="height"
                      :news="item"
                      :picture="item"></component>

                      <!-- 图文 -->
                      <div
                        class="badge-more"
                        @mouseover="operation($event, item, index)"
                        @mouseleave="showBulletBox = false"
                      >
                        <i class="icon">&#xe608;</i>
                      </div>

                  </div>
                </div>
              </WaterfallItem>
            </template>
        </Waterfall>
      </div>
      <!-- 非瀑布 图片 -->
      <div class="waterfall-item-m waterfall-item-m-pic" v-else>
        <div v-for="(item, index) in initList" :key="index" @click="chooseIdx(item, index)" class="li_wrap "
        :class="{'active': checkedType === 'mulite' && item.checked }"
        :style="{margin: gutter+'px'}">
          <div class="deep_wrap">
            <component :is="mediaType[type]"
              @coverAction="overview(index)"
              :coverType="coverType"
              :size="size"
              :width="width"
              :height="height"
              :news="item"
              :picture="item"></component>
              <Poptip
                v-if="checkedType == 'single'"
                trigger="hover"
                placement="right-start"
                class="badge-more"
                transfer
                popper-class="media-popperTemp">
                <div><i class="icon">&#xe608;</i></div>
                <div slot="content" class="action-list">
                  <ul>
                    <li @click="modityTemp(item)">修改</li>
                    <li @click="delTemp(item, 1)">删除</li>
                  </ul>
                </div>
              </Poptip>
            <div v-if="checkedType != 'single'" class="badge-hover"><i class="icon">&#xe637;</i></div>
            <div v-if="checkedType != 'single'" class="badge"><i class="icon">&#xe637;</i></div>
          </div>
        </div>
      </div>

    <overviewImg v-model="showOverView" :list="list" :index="overviewIndex" transfer></overviewImg>
      <BulletBox
        :position="position"
        transfer
        v-if="showBulletBox"
        @mouseleave.native="showBulletBox = false"
        @mouseenter.native="showBulletBox = true"
      >
        <ul class="actionWrap">
          <li @click="modityTemp(0)">修改</li>
          <li @click="delTemp(0, 1)">删除</li>
        </ul>
      </BulletBox>

    <Modal title="删除提示" v-model="showModal" class-name="self-center-modal">
      <div>确定删除吗？</div>
      <div slot="footer">
        <Button type="primary" @click.stop="modalConfirm">确定</Button>
        <Button type="ghost" @click.stop="showModal = false">取消</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import {Waterfall, WaterfallItem} from 'vue2-waterfall'
import BulletBox from "@/components/BulletBox.vue"
  export default {
    name: 'mediaList-m',
    components: {
      PicText: () => import("./PicText"),
      PicTemp: () => import("./PicTemp"),
      overviewImg: () => import("@/components/overviewImg/index"),
      Waterfall,
      WaterfallItem,
      BulletBox
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
        initList: this.list,
        checkedType: this.selectType,
        selectedList: [],
        activeIdx: 0,
        currentIndex: 0,
        currentGroup: {},
        position: { x: 0, y: 0 },
        showBulletBox: false
      }
    },
    props: ["list", "type", "gutter", "size", "width", "height", "selectType"],
    watch: {
      selectType(nv) {
        this.showOverView = false
        this.checkedType = nv
        if (nv === 'mulite') {
          if (this.type) { this.coverType = true }
        }
      },
      list(nv) {
        this.initList = this.deepCopy(nv.map(i => {
          return {
            ...i,
            checked: false,
          }
        }))
      }
    },
    computed: {
      ...mapGetters({
        currPublic: 'publicAccount/curPublic'
      })
    },
    methods: {
      chooseIdx(data, idx) {
        this.activeIdx = idx
        let selectedItem = data
        if (this.checkedType === 'mulite') {
          this.$set(selectedItem , "checked", !selectedItem.checked)
          this.$emit('on-change', this.initList.filter(i => i.checked))
        } else {
          this.$emit('on-change', this.initList.filter(i => i.checked))
        }
      },
      overview(index) {
        this.showOverView = true
        this.overviewIndex = index
      },
      modalConfirm() {
        this.delTemp()
      },
      modityTemp(item) {
        this.showBulletBox = false
        this.$emit('modify', item || this.currentGroup)
      },
      async delTemp(item, showModal) {
        this.showBulletBox = false
        if (showModal) {
          this.showModal = true
          this.currentMedia = item || this.currentGroup
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
            if (res.message && res.message.errcode === 48005) {
              this.$Message.error(`图文消息素材被引用到自定义菜单或个性化菜单或自动回复中，不可删除。`)
            } else {
              this.$Message.error('删除失败！')
            }
          }
        }
      },
      getCurrentGroup(item, index) {
        // this.currentIndex = index
        this.currentGroup = item
        this.showBulletBox = false
        this.$emit("selectGroup", item)
      },
      operation(_event, item, index) {
        // 选中
        // this.currentIndex = index
        this.currentGroup = item
        this.showBulletBox = true
        this.$emit("selectGroup", item)
        // 交互操作
        let clientRect = _event.target.getBoundingClientRect()
        let position = {
          x: Math.round(clientRect.left),
          y: Math.round(clientRect.top),
          w: Math.round(clientRect.width),
          h: Math.round(clientRect.height)
        }
        this.position = {
          x: position.x + position.w + 10,
          y: position.y - 15
        }
      },
    }
  }
</script>
<style lang="stylus">
@import '~@/assets/stylus/index'
  #mediaList-m
    height 100%
    .waterfall-item-m
      padding 2px
    .li_wrap
      display inline-block
      position relative
      .badge, .badge-hover
        display none
        position absolute
        bottom 0px
        right 0px
      .badge-more
        position absolute
        bottom 27px
        right 22px
        font-size 16px
        color #979899
      .deep_wrap
        padding 10px
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
    .waterfall-item-m-pic .li_wrap .deep_wrap
      padding 5px 0
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
