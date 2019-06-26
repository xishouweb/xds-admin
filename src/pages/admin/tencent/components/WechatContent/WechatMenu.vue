<template>
  <div class="wechatMenu">
    <!-- 预览窗 -->
    <div class="weixin-preview">
      <div class="weixin-hd">
        <div class="weixin-title">{{principalName}}</div>
      </div>
      <div class="weixin-bd">
        <moveList axis="x"
          v-model="menuParams.menu"
          :canMove="canMove && firstMenuMove"
          :selectedIndex="selectedMenuIndex"
          @moveStart="menuStartMove('first')"
          @moveEnd="firstMenuMoveEnd"
          class="weixin-menu"
          id="weixin-menu">
          <moveItem v-for="(btn, i) in menuParams.menu" :index="i" :key="i" class="menu-item" :style="menuItemWidth" :class="{current:selectedMenuIndex===i&&selectedMenuLevel()==1&&!beginOrder}">
            <div class="menu-item-container" @click="selectedMenu(i,$event)">
              <div class="menu-item-title">
                <i class="icon_menu_dot" v-if="btn.subMenu.length>0&&!beginOrder"></i>
                <i class="icon_menu_dot" v-if="beginOrder"></i>
                <span>{{ btn.name }}</span>
              </div>

              <moveList axis="y"
              v-model="btn.subMenu"
              v-if="selectedMenuIndex===i"
              :canMove="canMove && subMenuMove"
              @moveStart="menuStartMove('sub')"
              @moveEnd="secMenuMoveEnd"
              :class="{unactive: clearBottom}"
              class="weixin-sub-menu" >
                <moveItem v-for="(sub, i2) in btn.subMenu" :index="i2"  v-bind:key="i2" class="menu-sub-item"
                :class="{current:selectedSubMenuIndex===i2&&selectedMenuLevel()==2&&!beginOrder}">
                  <div class="menu-sub-item-container" @click.stop="selectedSubMenu(i2,$event)">
                  <div class="menu-item-title">
                      <i class="icon_menu_dot" v-if="beginOrder"></i>
                      <span>{{sub.name}}</span>
                  </div>
                  </div>
                </moveItem>
                <div v-if="btn.subMenu.length<5&&!beginOrder" class="menu-sub-item" @click.stop="addMenu(2, i)">
                  <div class="menu-item-title">
                    <i class="icon icon14_menu_add">&#xe623;</i>
                  </div>
                </div>
                <i class="menu-arrow arrow_out"></i>
                <i class="menu-arrow arrow_in"></i>
              </moveList>
            </div>
          </moveItem>
          <li class="menu-item" :style="menuItemWidth" :class="{noMenu: menuParams.menu.length === 0}" v-if="menuParams.menu.length<3&&!beginOrder" @click="addMenu(1, 0)"> <i class="icon icon14_menu_add">&#xe623;<span v-if="menuParams.menu.length === 0" class="add-menu">添加菜单</span></i></li>
        </moveList>
        <span class="keyboard">
          <span class="icon">&#xe84e;</span>
        </span>
      </div>
    </div>
    <div class="order-menu">
      <Button class="btn" type="ghost" v-if="menuParams.menu.length>1&&!beginOrder" @click="menuOrder">菜单排序</Button>
      <div class="disable-btn" v-if="menuParams.menu.length<=1">菜单排序</div>
      <Button class="btn" type="ghost" v-if="beginOrder" @click="doneOrder">完成</Button>
    </div>
    <NewModal :maskClosable="false" :cancelBtn="false" v-model="refreshWechatList" confrim="重新加载" header="操作提示" content="当前公众号菜单正在同步中，请稍后再试。" @ok="getWxMenuList(menuListParams, true)"></NewModal>
  </div>
</template>
<script>
/* eslint-disable */
import {mapState} from 'vuex'
const CUSTOMMENU = 'CUSTOM_MENU'
const CUSTOMRULE = 'CUSTOM_RULE'
import { moveList, moveItem } from '@/components/sortMuneOrder'
import Const from './const'
export default {
  name: 'wechatmenu',
  components: {
    moveList,
    moveItem
  },
  props: {
    menuParams: {
      default: () => {
      },
      type: Object
    },
    type: {
      default: '',
      type: String
    }
  },
  data() {
    return {
      refreshWechatList: false,
      addWxMenu: false,
      canMove: false, //
      firstMenuMove: false,
      subMenuMove: false,
      reorderMenuList: [], // 需要提交的菜单组
      a: 0,
      beginOrder: false,
      menu: [], // 当前菜单
      selectedMenuIndex: '', // 当前选中菜单索引
      selectedSubMenuIndex: '', // 当前选中子菜单索引
      isPostPrev: true,
      clearBottom: false,
      material: {
        title: '',
        url: '',
        thumb_url: ''
      },
      menuListParams: {
        appAccountId: null,
        menuType: this.type === 'personalizedMenu' ? CUSTOMRULE : CUSTOMMENU,
        matchruleId: this.type === 'personalizedMenu' ? this.localStorageSaveOrRead('personalMenuItem').id : null
      }
    }
  },
  computed: {
    menuItemWidth() {
      let len = (this.menuParams.menu && this.menuParams.menu.length) || 0
      let width
      if (len === 0) {
        width = 100
      } else if (len === 3 || this.beginOrder) {
        width = 100 / len
      } else {
        width = 100 / (len + 1)
      }
      return {
        width: `${width}%`
      }
    },
    ...mapState({
      appAccountId: state => state.publicAccount.curPublic.appAccountId,
      principalName: state => state.publicAccount.curPublic.principalName
    })
  },
  watch: {
    menuParams: {
      handler(val) {
        this.selectedMenuIndex = this.menuParams.selectedMenuIndex
        this.selectedSubMenuIndex = this.menuParams.selectedSubMenuIndex
      },
      deep: true
    },
    appAccountId(val) {
      this.$root.Bus.$emit('errNoData', false)
      this.getWxMenuList(this.menuListParams, true)
    }
  },
  mounted() {
    this.getWxMenuList(this.menuListParams, true)
    this.$root.Bus.$on('refreshMenuList', (val) => {
      this.getWxMenuList(this.menuListParams)
      if (val) { // 是否发送上一个菜单的请求
        this.isPostPrev = false
      }
    })
    this.$root.Bus.$on('refreshModal', (val) => {
      this.refreshWechatList = true
    })
    this.$root.Bus.$on('emitCalcChecked', (val) => {
      this.emitCalcChecked()
    })
  },
  methods: {
    // 拖动开始
    menuStartMove(menu) {
      if (menu !== 'sub') {
        console.log('start')
        this.firstMenuMove = true
        this.subMenuMove = false
      } else {
        this.firstMenuMove = false
        this.subMenuMove = true
      }
    },
    // 一级菜单拖动结束
    firstMenuMoveEnd(index, selectedIndex, reorderList) {
      this.reorderMenuList = reorderList
      this.selectedMenu(selectedIndex, "after")
    },
    // 二级菜单拖动结束
    secMenuMoveEnd(index, selectedIndex, reorderList) {
      this.reorderMenuList = reorderList
    },
    // 添加自定义菜单
    saveWxMenu(level, index) {
      if (index || index === 0) {
        this.menuParams.menu[index].subMenu.push(Const.menuTemplate(level))
        this.selectedSubMenuIndex = this.menuParams.menu[this.selectedMenuIndex].subMenu.length - 1
        // 向主菜单传递事件
        this.menuParams.level = 2
        this.menuParams.selectedMenuIndex = this.selectedMenuIndex
        this.menuParams.selectedSubMenuIndex = this.selectedSubMenuIndex
        this.menuParams.currentMenu = this.menuParams.menu[this.selectedMenuIndex].subMenu[this.selectedSubMenuIndex]
      } else {
        this.menuParams.menu.push(Const.menuTemplate(level))
        this.selectedMenuIndex = this.menuParams.menu.length - 1
        this.selectedSubMenuIndex = ''
        // 向主菜单传递事件
        this.menuParams.level = 1
        this.menuParams.selectedMenuIndex = this.selectedMenuIndex
        this.menuParams.selectedSubMenuIndex = this.selectedSubMenuIndex
        this.menuParams.currentMenu = this.menuParams.menu[this.selectedMenuIndex]
      }
      // let params = {
      //   appAccountId: this.appAccountId,
      //   isMenuOpen: 'YES',
      //   name: level === 1 ? '菜单名称' : '子菜单名称',
      //   parentId: id,
      //   type: 'click',
      //   key: 'text',
      //   value: '',
      //   menuType: this.type === 'personalizedMenu' ? CUSTOMRULE : CUSTOMMENU,
      //   matchruleId: this.type === 'personalizedMenu' ? this.localStorageSaveOrRead('personalMenuItem').id : ''
      // }
      // if (this.addWxMenu) {
      //   return
      // }
      // this.addWxMenu = true
      // this.post(this.fylPath.saveWxMenu, params).then(data => {
      //   this.addWxMenu = false
      //   if (data.code === 1) {

      //     this.getWxMenuList(this.menuListParams, level)
      //   } else if (data.code === 6706) {
      //     this.refreshWechatList = true
      //   } else {
      //     this.$Message.error(data.message)
      //   }
      // })
    },
    // isChecked 是否要重新默认选中
    getWxMenuList(params, isChecked) {
      let PATH
      if (this.type === 'personalizedMenu' && this.localStorageSaveOrRead('personalMenuItem').newCreate) {
        PATH = this.fylPath.getUnPublishWxMenuList
        params.menuType = null
      } else {
        PATH = this.fylPath.getWxMenuList
        params.menuType = this.type === 'personalizedMenu' ? CUSTOMRULE : CUSTOMMENU
      }
      params.appAccountId = this.appAccountId
      this.post(PATH, params).then(data => {
        if (data.code === 1) {
          let _data = data.data || []
          this.$root.Bus.$emit('loadingStatu', 2)
          this.menuParams.menu = this.regroup(_data)
          console.log(this.menuParams.menu)
          // if (level === 1) {
          //   this.selectedMenuIndex = this.menuParams.menu.length - 1
          //   this.selectedSubMenuIndex = ''
          //   // 向主菜单传递事件
          //   this.menuParams.level = 1
          //   this.menuParams.selectedMenuIndex = this.selectedMenuIndex
          //   this.menuParams.selectedSubMenuIndex = this.selectedSubMenuIndex
          //   this.menuParams.currentMenu = this.menuParams.menu[this.selectedMenuIndex]
          // } else if (level === 2) {
          //   this.selectedSubMenuIndex = this.menuParams.menu[this.selectedMenuIndex].subMenu.length - 1
          //   // 向主菜单传递事件
          //   this.menuParams.level = 2
          //   this.menuParams.selectedMenuIndex = this.selectedMenuIndex
          //   this.menuParams.selectedSubMenuIndex = this.selectedSubMenuIndex
          //   this.menuParams.currentMenu = this.menuParams.menu[this.selectedMenuIndex].subMenu[this.selectedSubMenuIndex]
          // }
          if (isChecked) {
            this.calcChecked(this.menuParams.menu, 'subMenu')
          }
        } else if (data.code === 6706) {
          this.refreshWechatList = true
        } else {
          this.$root.Bus.$emit('loadingStatu', 3)
          this.$Message.error(data.message)
        }
      })
    },
    // 重组菜单列表
    regroup(arr) {
      let rules = {
        menuId: 'menuId',
        parentId: 'parentId',
        appId: 'appId',
        isMenuOpen: 'isMenuOpen',
        createTime: 'createTime',
        createId: 'createId',
        updateTime: 'updateTime',
        updateId: 'updateId',
        type: 'type',
        name: 'name',
        value: 'value',
        url: 'url',
        view: 'view',
        key: 'key',
        miniprogram: 'miniprogram',
        subMenu: 'subMenu',
        text: 'text',
        news: 'news',
        image: 'image',
        voice: 'voice',
        video: 'video',
        file: 'file',
        template: 'template',
        nameCopy: 'name',
        posterTemplate: 'posterTemplate',
        textLength: 'textLength',
        uuid: 'uuid'
      }
      let menu = this.transformData(arr, rules, false, 'subMenu', 'key', 'value')
      return menu
    },
    //添加菜单
    addMenu: function(level, index) {
      if (level == 1 && this.menuParams.menu.length < 3) {
        this.doneVaildName()
        this.saveWxMenu(level)
      }
      if (level == 2 && this.menuParams.menu[this.selectedMenuIndex].subMenu.length < 5) {
        this.doneVaildName()
        this.saveWxMenu(level, index)
      }
    },
    // 选中菜单级别
    selectedMenuLevel: function() {
      if (this.selectedMenuIndex !== '' && this.selectedSubMenuIndex === '') {
        // 主菜单
        // this.menuParams.level = 1
        return 1
      } else if (
        this.selectedMenuIndex !== '' &&
        this.selectedSubMenuIndex !== ''
      ) {
        // this.menuParams.level = 2
        // 子菜单
        return 2
      } else {
        // this.menuParams.level = 0
        // 未选中任何菜单
        return 0
      }
    },
    doneVaildName() {
      if (this.menuParams.menuNameBounds !== 1) {
        if (this.menuParams.selectedMenuIndex !== '' && this.menuParams.selectedSubMenuIndex === '') {
          this.menuParams.menu[this.menuParams.selectedMenuIndex].name = this.menuParams.menu[this.menuParams.selectedMenuIndex].nameCopy
        } else if (this.menuParams.selectedMenuIndex !== '' && this.menuParams.selectedSubMenuIndex !== '') {
          this.menuParams.menu[this.menuParams.selectedMenuIndex].subMenu[this.menuParams.selectedSubMenuIndex].name = this.menuParams.menu[this.menuParams.selectedMenuIndex].subMenu[this.menuParams.selectedSubMenuIndex].nameCopy
        }
        this.menuParams.menuNameBounds = 1
      }
    },
    // 选中主菜单
    selectedMenu: function(i, event) {
      // after : 拖动结束
      if (this.beginOrder || event === "after") {
        return
      }
      this.doneVaildName()
      // 选中菜单隐藏错误
      // this.$root.Bus.$emit('menuErr', false)
      // 选中当前菜单提交上一个菜单内容
      // if (this.menuParams.menuNameBounds === 1 && this.isPostPrev && event !== "after") {
      //   this.$root.Bus.$emit('submitMenu')
      // }
      this.isPostPrev = true
      this.selectedSubMenuIndex = ''
      this.selectedMenuIndex = i
      var selectedMenu = this.menuParams.menu[this.selectedMenuIndex]
      console.log(this.menuParams.menu)
      // 检查名称长度
      this.checkMenuName(selectedMenu.name)
      // 向主菜单传递事件
      this.menuParams.level = 1
      this.menuParams.currentMenu = []
      this.menuParams.currentMenu = selectedMenu
      this.menuParams.selectedMenuIndex = this.selectedMenuIndex
      this.menuParams.selectedSubMenuIndex = this.selectedSubMenuIndex
    },
    // 选中子菜单
    selectedSubMenu: function(i, event) {
      this.doneVaildName()
      // after : 拖动结束
      if (this.beginOrder || event === "after") {
        return
      }
      this.$root.Bus.$emit('menuErr', false)
      // 选中当前菜单提交上一个菜单内容
      // if (this.menuParams.menuNameBounds === 1 && this.isPostPrev) {
      //   this.$root.Bus.$emit('submitMenu')
      // }
      this.isPostPrev = true
      this.selectedSubMenuIndex = i
      var selectedSubMenu = this.menuParams.menu[this.selectedMenuIndex].subMenu[
        this.selectedSubMenuIndex
      ]
      this.checkMenuName(selectedSubMenu.name)
      // 向主菜单传递事件
      this.menuParams.currentMenu = []
      this.menuParams.currentMenu = selectedSubMenu
      this.menuParams.selectedMenuIndex = this.selectedMenuIndex
      this.menuParams.selectedSubMenuIndex = this.selectedSubMenuIndex
      this.menuParams.level = 2
    },
    // 检查菜单名称长度
    checkMenuName: function(val) {
      if (this.getMenuNameLen(val) === 0) {
        this.menuParams.menuNameBounds = 3
      } else if (
        this.selectedMenuLevel() == 1 &&
        this.getMenuNameLen(val) <= 16
      ) {
        this.menuParams.menuNameBounds = 1
      } else if (
        this.selectedMenuLevel() == 2 &&
        this.getMenuNameLen(val) <= 40
      ) {
        this.menuParams.menuNameBounds = 1
      } else {
        this.menuParams.menuNameBounds = 2
      }
    },
    // 获取菜单名称长度
    getMenuNameLen: function(val) {
      var len = 0
      for (var i = 0; i < val.length; i++) {
        var a = val.charAt(i)
        a.match(/[^\x00-\xff]/gi) != null ? (len += 2) : (len += 1)
      }
      return len
    },
    // 菜单排序
    menuOrder() {
      // if (this.menuParams.menuNameBounds !== 1) {
      //   return
      // }
      // this.$root.Bus.$emit('checkMenuValid')
      this.canMove = true
      this.beginOrder = true
      this.menuParams.level = -1
      // 点击菜单排序后如果选中的子菜单length为0 则清除子菜单样式
      if (this.menuParams.menu[this.selectedMenuIndex].subMenu.length === 0) {
        this.clearBottom = true
      } else {
        this.clearBottom = false
      }
    },
    doneOrder() {
      this.canMove = false
      this.beginOrder = false
      this.clearBottom = false
      // this.$root.Bus.$emit('updateIdxOrder')
      this.emitCalcChecked()
    },
    emitCalcChecked() {
      this.calcChecked(this.menuParams.menu, 'subMenu')
    },
    calcChecked(obj, str) {
      if (obj.length > 0) {
        if (obj[0][str].length > 0) {
          this.menuParams.level = 2
          this.selectedMenuIndex = 0
          this.selectedSubMenuIndex = 0
          this.menuParams.selectedMenuIndex = this.selectedMenuIndex
          this.menuParams.selectedSubMenuIndex = this.selectedSubMenuIndex
          this.menuParams.currentMenu = this.menuParams.menu[this.selectedMenuIndex].subMenu[this.selectedSubMenuIndex]
        } else {
          this.menuParams.level = 1
          this.selectedMenuIndex = 0
          this.selectedSubMenuIndex = ''
          this.menuParams.selectedMenuIndex = this.selectedMenuIndex
          this.menuParams.selectedSubMenuIndex = this.selectedSubMenuIndex
          this.menuParams.currentMenu = this.menuParams.menu[this.selectedMenuIndex]
        }
      } else {
        this.menuParams.level = 0
        this.menuParams.menu = []
        this.menuParams.selectedMenuIndex = ''
        this.menuParams.selectedSubMenuIndex = ''
        this.menuParams.menuNameBounds = 1
        this.menuParams.currentMenu = {}
      }
    },
    // 修改菜单排序
    updateIdxOrder() {
      let params = {
        appAccountId: this.appAccountId,
        idxList: this.reorderMenuList.map((item, index) => {
          return {
             id: item.menuId,
             idx: index
          }
        })
      }
      this.post(this.fylPath.updateIdxOrder, params).then(data => {
        if (data.code === 1) {
          this.getWxMenuList(this.menuListParams)
          this.$Message.success('菜单排序成功')
          this.reorderMenuList = []
        } else if (data.code === 6706) {
          this.refreshWechatList = true
        } else {
          this.$Message.error(data.message)
        }
      })
    },
  },
  destroyed() {
    this.$root.Bus.$off('refreshMenuList')
    this.$root.Bus.$off('emitCalcChecked')
  }
}
</script>
<style lang="stylus">
@import '~@/assets/stylus/mixin'
.wechatMenu
  width 100%
  height 100%
  .weixin-preview
    position relative
    height 620px
    border 1px solid #e7e7eb
    .weixin-hd
      position relative
      text-align center
      color #fff
      height 54px
      background transparent url('../../../../../assets/images/tencent/menu_head.png') no-repeat 0 0
      .weixin-title
        position absolute
        bottom 10px
        width 100%
    .weixin-bd
      position absolute
      bottom 0
      left 0
      right 0
      height 56px
      border-top 1px solid #e7e7e7
      background-position 0 0
      background-repeat no-repeat
      padding-left 47px
      margin-bottom 0px
      font-size 12px
      .keyboard
        position absolute
        text-align center
        height 100%
        width 47px
        left 0
        top 0
        .icon
          font-size 30px
          display inline-block
          vertical-align middle
          line-height 56px
          color rgb(113, 117, 123)
      .weixin-menu
        position relative
        .icon14_menu_add
          color #cacbcc
        .menu-item-title
          width 100%
          overflow hidden
          white-space nowrap
          text-overflow ellipsis
          box-sizing border-box
          .icon_menu_dot
            background url('../../../../../assets/images/tencent/index_z354723.png') 0px -36px no-repeat
            width 7px
            height 7px
            vertical-align middle
            display inline-block
            margin-right 2px
            margin-top -2px
        .menu-item
          float left
          line-height 56px
          height 56px
          text-align center
          width 33.33%
          border-left 1px solid #e7e7e7
          cursor pointer
          color #616161
          &.noMenu
            border 1px solid #409fff
            .icon
              color #409fff
              .add-menu
                margin-left 10px
                color #409fff
          &.current
            border 1px solid #409fff
            background #fff
            color #409fff
            &:hover
              background #fff
              color #409fff
          &:hover
            color #000
          .menu-item-container
            position relative
          .weixin-sub-menu
            position absolute
            bottom 63px
            left 0
            right 0
            border-top 1px solid #d0d0d0
            margin-bottom 0px
            background #fafafa
            display block
            padding 0
            &.unactive
              display none
            &.show
              display block
            .menu-sub-item
              line-height 56px
              height 56px
              text-align center
              width 100%
              border 1px solid #d0d0d0
              border-top-width 0px
              cursor pointer
              color #616161
              float left
              &.current
                border 1px solid #409fff
                background #fff
                color #409fff
                &:hover
                  background #fff
              &:hover
                background #eee
              .menu-sub-item-container
                position relative
              .menu-item-title
                padding-left 5px
                padding-right 5px
            .menu-arrow
              position absolute
              left 50%
              margin-left -6px
            .arrow_in
              bottom -4px
              display inline-block
              width 0px
              height 0px
              border-width 6px 6px 0px
              border-style solid dashed dashed
              border-color #fafafa transparent transparent
            .arrow_out
              bottom -5px
              display inline-block
              width 0px
              height 0px
              border-width 6px 6px 0px
              border-style solid dashed dashed
              border-color #d0d0d0 transparent transparent
  .order-menu
    margin-top 20px
    text-align center
    .btn
      width 110px
    .disable-btn
      display inline-block
      cursor not-allowed
      width 110px
      height 40px
      line-height 40px
      background-color #e3e4e5
      border-radius 3px
      border solid 1px #e3e4e5
</style>
