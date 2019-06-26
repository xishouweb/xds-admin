<template>
  <div class="wechatContent">
    <!-- 主菜单 -->
    <div class="weixin-menu-detail weixin-nodone" v-if="contentParams.level===0 || contentParams.level===-1">
      <div class="content-center" v-if="contentParams.level===0">
        点击左侧菜单进行编辑操作
      </div>
      <div class="content-center" v-if="contentParams.level===-1">
        请通过拖拽左边的菜单进行排序
      </div>
    </div>
    <!-- 主菜单 -->
    <div class="weixin-menu-detail" v-if="contentParams.level===1">
      <div class="menu-title">
          <div class="menu-name">{{contentParams.menu[contentParams.selectedMenuIndex].name}}</div>
          <div class="menu-del" @click="openDelModal(contentParams.currentMenu.menuId)">删除菜单</div>
      </div>
      <div class="menu-content">
        <div class="menu-input-group">
          <div class="menu-label">菜单名称</div>
          <div class="menu-input">
              <Input type="text" name="name" placeholder="请输入菜单名称" class="menu-input-text" v-model.trim="contentParams.menu[contentParams.selectedMenuIndex].name" @on-blur="nameBlur" @on-change="checkMenuName(contentParams.menu[contentParams.selectedMenuIndex].name)">
                </Input>
                <p class="menu-tips" style="color: #f56c6c;" v-show="contentParams.menuNameBounds === 2">字数超过上限</p>
                <p class="menu-tips" style="color: #f56c6c;" v-show="contentParams.menuNameBounds === 3">请输入菜单名称</p>
                <p class="menu-tips">字数不超过8个汉字或16个字母</p>
          </div>
        </div>
        <div v-if="contentParams.menu[contentParams.selectedMenuIndex].subMenu.length==0">
          <div class="menu-input-group nomargin">
              <div class="menu-label">菜单内容</div>
              <div class="menu-input menu-radio">
                <RadioGroup v-model="contentParams.menu[contentParams.selectedMenuIndex].type" @on-change="typeChange">
                  <Radio label="click" v-show="contentParams.menu[contentParams.selectedMenuIndex].type === 'click'">发送消息</Radio>
                  <Radio label="media_id" v-show="contentParams.menu[contentParams.selectedMenuIndex].type === 'media_id'">发送消息</Radio>
                  <Radio label="media_id" v-if="(contentParams.menu[contentParams.selectedMenuIndex].type === 'view' || contentParams.menu[contentParams.selectedMenuIndex].type === 'markting' || contentParams.menu[contentParams.selectedMenuIndex].type === 'miniprogram') && constMidiaIdType.indexOf(workStorage) >= 0">发送消息</Radio>
                  <Radio label="click" v-if="(contentParams.menu[contentParams.selectedMenuIndex].type === 'view' || contentParams.menu[contentParams.selectedMenuIndex].type === 'markting' || contentParams.menu[contentParams.selectedMenuIndex].type === 'miniprogram') && constMidiaIdType.indexOf(workStorage) < 0">发送消息</Radio>
                  <Radio label="view">跳转网页</Radio>
                  <Radio label="miniprogram">跳转小程序</Radio>
                  <Radio label="markting">营销</Radio>
                </RadioGroup>
              </div>
          </div>
          <div class="menu-content-type">
            <!-- 营销编辑器 -->
            <MarktingMenuContentType :type="type" v-model="errNoData" :messageContent="contentParams.currentMenu" @sendType="setType"  v-show="contentParams.currentMenu.type =='markting'"></MarktingMenuContentType>
            <!-- 发送消息编辑器 -->
            <Minprogram ref="miniprogram" :messageContent="contentParams.currentMenu" v-if="contentParams.currentMenu.type =='miniprogram'"></Minprogram>
            <MenuContentType :type="type" v-model="errNoData" :messageContent="contentParams.currentMenu" @sendType="setType"
            v-show="contentParams.currentMenu.type!=='view' && contentParams.currentMenu.type !=='markting' && contentParams.currentMenu.type !=='miniprogram'"></MenuContentType>
            <!-- 跳转网页 -->
            <div v-show="contentParams.currentMenu.type==='view'" class="menu-content-url">
              <div class="tips">订阅者点击该子菜单会跳到以下链接</div>
              <div class="input">
                <span class="urlAddress">页面地址</span>
                <Input type="text" name="name" placeholder="请输入菜单名称" class="menu-input-text" v-model="contentParams.menu[contentParams.selectedMenuIndex].view"  @on-blur="urlBlur">
                </Input>
              </div>
            </div>
            <!-- 没有菜单时提示 -->
            <div v-show="contentParams.currentMenu.type==='view'&&errNoData===2" class="err-text">
              请设置当前菜单内容
            </div>
            <div v-show="contentParams.currentMenu.type==='miniprogram'&&errNoData===4" class="err-text">
              请将带 * 的填写完整或者备用网页url字节超过1024
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 子菜单 -->
    <div class="weixin-menu-detail" v-if="contentParams.level===2">
      <div class="menu-title">
          <div class="menu-name">{{contentParams.menu[contentParams.selectedMenuIndex].subMenu[contentParams.selectedSubMenuIndex].name}}</div>
          <div class="menu-del" @click="openDelModal(contentParams.currentMenu.menuId)">删除子菜单</div>
      </div>
      <div class="menu-content">
        <div class="menu-input-group">
            <div class="menu-label">子菜单名称</div>
            <div class="menu-input">
                <Input type="text" placeholder="请输入子菜单名称" class="menu-input-text" v-model.trim="contentParams.menu[contentParams.selectedMenuIndex].subMenu[contentParams.selectedSubMenuIndex].name" @on-blur="nameBlur" @on-change="checkMenuName(contentParams.menu[contentParams.selectedMenuIndex].subMenu[contentParams.selectedSubMenuIndex].name)">
                </Input>
                <p class="menu-tips" style="color: #f56c6c;" v-show="contentParams.menuNameBounds === 2">字数超过上限</p>
                <p class="menu-tips" style="color: #f56c6c;" v-show="contentParams.menuNameBounds === 3">请输入子菜单名称</p>
                <p class="menu-tips">字数不超过20个汉字或40个字母</p>
            </div>
        </div>
        <div class="menu-input-group">
            <div class="menu-label">子菜单内容</div>
            <div class="menu-input menu-radio">
              <RadioGroup v-model="contentParams.menu[contentParams.selectedMenuIndex].subMenu[contentParams.selectedSubMenuIndex].type" @on-change="typeChange">
                <Radio label="media_id" v-show="contentParams.menu[contentParams.selectedMenuIndex].subMenu[contentParams.selectedSubMenuIndex].type === 'media_id'">发送消息</Radio>
                <Radio label="click" v-show="contentParams.menu[contentParams.selectedMenuIndex].subMenu[contentParams.selectedSubMenuIndex].type === 'click'">发送消息</Radio>
                <Radio label="media_id" v-if="(contentParams.menu[contentParams.selectedMenuIndex].subMenu[contentParams.selectedSubMenuIndex].type === 'view' || contentParams.menu[contentParams.selectedMenuIndex].subMenu[contentParams.selectedSubMenuIndex].type === 'markting' || contentParams.menu[contentParams.selectedMenuIndex].subMenu[contentParams.selectedSubMenuIndex].type === 'miniprogram') && constMidiaIdType.indexOf(workStorage) >= 0">发送消息</Radio>
                <Radio label="click" v-if="(contentParams.menu[contentParams.selectedMenuIndex].subMenu[contentParams.selectedSubMenuIndex].type === 'view' || contentParams.menu[contentParams.selectedMenuIndex].subMenu[contentParams.selectedSubMenuIndex].type === 'markting' || contentParams.menu[contentParams.selectedMenuIndex].subMenu[contentParams.selectedSubMenuIndex].type === 'miniprogram') && constMidiaIdType.indexOf(workStorage) < 0">发送消息</Radio>
                <Radio label="view">跳转网页</Radio>
                <Radio label="miniprogram">跳转小程序</Radio>
                <Radio label="markting">营销</Radio>
              </RadioGroup>
            </div>
        </div>
        <div class="menu-content-type">
          <!-- 营销编辑器 -->
          <MarktingMenuContentType :type="type" v-model="errNoData" :messageContent="contentParams.currentMenu" @sendType="setType"
          v-show="contentParams.currentMenu.type =='markting'"></MarktingMenuContentType>
          <!-- 发送消息编辑器 -->
          <MenuContentType :type="type" v-model="errNoData" :messageContent="contentParams.currentMenu" @sendType="setType"
          v-show="contentParams.currentMenu.type!=='view' && contentParams.currentMenu.type !=='markting' && contentParams.currentMenu.type !=='miniprogram'"></MenuContentType>
          <!-- 跳转网页 -->
          <Minprogram ref="miniprogram" :messageContent="contentParams.currentMenu" v-if="contentParams.currentMenu.type =='miniprogram'"></Minprogram>
          <div v-show="contentParams.currentMenu.type==='view'" class="menu-content-url">
            <div class="tips">订阅者点击该子菜单会跳到以下链接</div>
            <div class="input">
              <span class="urlAddress">页面地址</span>
              <Input type="text" name="name" placeholder="请输入菜单名称" class="menu-input-text" v-model="contentParams.menu[contentParams.selectedMenuIndex].subMenu[contentParams.selectedSubMenuIndex].view" @on-blur="urlBlur">
              </Input>
            </div>
          </div>
          <!-- 没有菜单时提示 -->
          <div v-show="contentParams.currentMenu.type==='view'&&errNoData===2" class="err-text">
            请设置当前菜单内容
          </div>
          <div v-show="contentParams.currentMenu.type==='miniprogram'&&errNoData===4" class="err-text">
            请将带 * 的填写完整或者备用网页url字节超过1024
          </div>
        </div>
      </div>
    </div>
    <div class="done-btn" :class="{personMenu: type==='personalizedMenu'}" v-if="contentParams.level!==-1">
      <Button class="save-btn" type="primary" v-if="contentParams.menu.length>0" @click="saveAndIssue">保存并发布</Button>
      <!-- <Button class="watch-btn" type="ghost" v-if="contentParams.menu.length>0">预览</Button> -->
      <Button class="watch-btn" type="ghost"  @click="lastStep" v-if="type==='personalizedMenu'">上一步</Button>
      <Button class="watch-btn" type="ghost" v-if="type==='personalizedMenu'" @click="cancelPersonMenu">取消</Button>
    </div>
    <NewModal v-model="delModal" header="删除菜单" :content="delContent" @ok="delOk"></NewModal>
    <NewModal v-model="tipsModal" header="操作提示" :content="tipsModalContent" confrim="知道了"
      :cancelBtn="false"></NewModal>
    <NewModal v-model="saveModal" header="确认发布" content="发布成功后会覆盖原版本，且将在24小时内对所有用户生效，确认发布？" @ok="handle"></NewModal>
  </div>
</template>
<script>
/* eslint-disable */
import {mapState} from 'vuex'
import MenuContentType from './menuContentType'
import MarktingMenuContentType from './marktingMenuContentType'
import Minprogram from '../miniprogram'
import {deepClone} from '@/utils/util'
import { setTimeout } from 'timers';
export default {
  name: 'wechatContent',
  props: {
    contentParams: {
      default: () => {
        return {}
      },
      type: Object
    },
    type: {
      default: '',
      type: String
    }
  },
  watch: {
    '$route.meta.intercept'(v) {
    },
    'contentParams.currentMenu.menuId'(val) {
      this.updateParams.menuId = val
      if (!this.menuName) {
        if (this.contentParams.selectedMenuIndex !== '' && this.contentParams.selectedSubMenuIndex === '') {
          this.contentParams.menu[this.contentParams.selectedMenuIndex].nameCopy = this.contentParams.menu[this.contentParams.selectedMenuIndex].name
        } else if (this.contentParams.selectedMenuIndex !== '' && this.contentParams.selectedSubMenuIndex !== '') {
          this.contentParams.menu[this.contentParams.selectedMenuIndex].subMenu[this.contentParams.selectedSubMenuIndex].nameCopy = this.contentParams.menu[this.contentParams.selectedMenuIndex].subMenu[this.contentParams.selectedSubMenuIndex].name
        }
      }
    },
    'contentParams.currentMenu.name'(val) {
      this.menuName = val
    },
    'contentParams.currentMenu.parentId'(val) {
      this.updateParams.parentId = val
    },
    'contentParams.menu': {
      handler() {
        if (this.contentParams.selectedMenuIndex !== '' && this.contentParams.selectedSubMenuIndex === '') {
          this.contentParams.currentMenu = this.contentParams.menu[this.contentParams.selectedMenuIndex]
        } else if (this.contentParams.selectedMenuIndex !== '' && this.contentParams.selectedSubMenuIndex !== '') {
          this.contentParams.currentMenu =  this.contentParams.menu[this.contentParams.selectedMenuIndex].subMenu[this.contentParams.selectedSubMenuIndex]
        }
      },
      deep: true
    }
  },
  computed: {
    ...mapState({
      appAccountId: state => state.publicAccount.curPublic.appAccountId
    })
  },
  data() {
    return {
      // 营销里面的key类型
      oldType: this.contentParams.currentMenu.type,
      tipsModal: false,
      tipsModalContent: '',
      constMarkting: ['posterTemplate'],
      constMidiaIdType: ['video', 'voice', 'image', 'news'],
      delContent: '',
      delModal: false,
      saveModal: false,
      menuSelectType: '',
      delMenuId: null,
      updateParams: {
        appAccountId: '',
        menuId: this.contentParams.currentMenu.menuId,
        name: this.contentParams.currentMenu.name,
        parentId: this.contentParams.currentMenu.parentId,
        type: this.contentParams.currentMenu.type,
        key: this.contentParams.currentMenu.key,
        value: null
      },
      menuName: this.contentParams.currentMenu.nameCopy,
      workStorage: 'text',
      errNoData: 1,
      constSaveAndIssue: false
    }
  },
  mounted() {
    setTimeout(() => {
      this.cancelIntercept()
    },500)
    this.$root.Bus.$on('errNoData', () => {
      this.errNoData = 1
    })
    this.$root.Bus.$on('messageChange', (message, key, type, textLength = 0) => {
      if (!this.constSaveAndIssue) {
        console.log(this.contentParams.selectedMenuIndex, this.contentParams.selectedSubMenuIndex,message, key, type)
        if (this.contentParams.selectedMenuIndex !== '' && this.contentParams.selectedSubMenuIndex === '') {
          // this.contentParams.menu[this.contentParams.selectedMenuIndex].type = type
          this.contentParams.menu[this.contentParams.selectedMenuIndex][key] = message
          this.contentParams.menu[this.contentParams.selectedMenuIndex].value = message
          if (key === 'text') {
            this.contentParams.menu[this.contentParams.selectedMenuIndex].textLength = textLength
            if (textLength < 0) {
              this.errNoData = 3
            } else {
              this.errNoData = 1
            }
          }
        } else if (this.contentParams.selectedMenuIndex !== '' && this.contentParams.selectedSubMenuIndex !== '') {
          // this.contentParams.menu[this.contentParams.selectedMenuIndex].subMenu[this.contentParams.selectedSubMenuIndex].type = type
          this.contentParams.menu[this.contentParams.selectedMenuIndex].subMenu[this.contentParams.selectedSubMenuIndex][key] = message
          this.contentParams.menu[this.contentParams.selectedMenuIndex].subMenu[this.contentParams.selectedSubMenuIndex].value= message
          if (key === 'text') {
            this.contentParams.menu[this.contentParams.selectedMenuIndex].subMenu[this.contentParams.selectedSubMenuIndex].textLength = textLength
            if (textLength < 0) {
              this.errNoData = 3
            } else {
              this.errNoData = 1
            }
          }
        }
        if(key !== 'text') {
          this.setType(key)
        }
      }
      this.constSaveAndIssue = false
    })
    this.$root.Bus.$on('updateIdxOrder', () => {
      this.updateWxMenu(true)
    })
    this.$root.Bus.$on('checkMenuValid', () => {
      this.chekedMenu(this.contentParams.menu, 'subMenu')
    })

  },
  methods: {
    // 删除自定义菜单
    deleteWxMenu(level) {
      if (this.contentParams.selectedMenuIndex !== '' && this.contentParams.selectedSubMenuIndex === '') {
        this.contentParams.menu.splice(this.contentParams.selectedMenuIndex, 1)
      } else if (this.contentParams.selectedMenuIndex !== '' && this.contentParams.selectedSubMenuIndex !== '') {
        this.contentParams.menu[this.contentParams.selectedMenuIndex].subMenu.splice(this.contentParams.selectedSubMenuIndex, 1)
      }
      this.contentParams.level = 0
      this.contentParams.selectedMenuIndex = ''
      this.contentParams.selectedSubMenuIndex = ''
      this.pageChange()
    },
    // 批量保存菜单
    async saveBatchWxMenu(type) {
      let menu = deepClone(this.contentParams.menu)
      menu = menu.map((item) => {
        if (item.subMenu && item.subMenu.length > 0) {
          item.subMenu.map((_item) => {
            if (_item.type === 'markting') {
              _item.type = 'click'
            }
            if (_item.type === 'miniprogram' && typeof _item.value === 'object') {
              if (_item.value.url.indexOf('http://') < 0) {
                _item.value.url = 'http://' + _item.value.url
              }
              _item.value = JSON.stringify(_item.value)
            }
            delete _item.text
            delete _item.news
            delete _item.image
            delete _item.voice
            delete _item.video
            delete _item.file
            delete _item.template
            delete _item.posterTemplate
            delete _item.textLength
            delete _item.uuid
            delete _item.miniprogram
            delete _item.view
            delete _item.nameCopy
            return _item
          })
        }
        if (item.type === 'markting') {
          item.type = 'click'
        }
        if (item.type === 'miniprogram' && typeof item.value === 'object') {
          if (item.value.url.indexOf('http://') < 0) {
            item.value.url = 'http://' + item.value.url
          }
          item.value = JSON.stringify(item.value)
        }
        delete item.text
        delete item.news
        delete item.image
        delete item.voice
        delete item.video
        delete item.file
        delete item.template
        delete item.posterTemplate
        delete item.textLength
        delete item.uuid
        delete item.miniprogram
        delete item.view
        delete item.nameCopy
        return item
      })
      let params = {
        menuType: '',
        cssWxMenuDtos: menu,
        appAccountId: this.appAccountId
      }
      if (type === 'personalizedMenu') {
        params.menuType = 'CUSTOM_RULE'
      } else {
        params.menuType = 'CUSTOM_MENU'
      }
      let data = await this.post(this.fylPath.saveBatchWxMenu, params)
      return data
    },
    // 自定义菜单保存并发布
    saveAndPublishWxMenu() {
      let params = {
        appAccountId: this.appAccountId
      }
      this.post(this.fylPath.saveAndPublishWxMenu, params).then(data => {
        if (data.code === 1) {
          this.cancelIntercept()
          this.$Message.success('保存并发布成功')
        } else if (data.code === 6706 || data.code === 101) {
          this.$root.Bus.$emit('refreshModal')
        } else {
          this.$Message.error(data.message.errmsg || data.message)
        }
      })
    },
    // 个性化菜单修改保存并发布
    updateAndPublishWxMenu() {
      let cookieParams = this.localStorageSaveOrRead('personalMenuItem')
      let params = {
        id: cookieParams.id,
        appAccountId: this.appAccountId,
        country: cookieParams.country,
        province: cookieParams.province,
        city: cookieParams.city,
        clientPlatformType: cookieParams.clientPlatformType,
        language: cookieParams.language,
        matchRuleName: cookieParams.matchRuleName,
        sex: cookieParams.sex,
        tagIds: cookieParams.tagIds
      }
      this.post(this.fylPath.updateAndPublishWxMenu, params).then(data => {
        if (data.code === 1) {
          this.$Message.success('保存成功')
          this.$router.push({name: 'personalizedMenu'})
        } else {
          this.$Message.error(data.message.errmsg || data.message)
        }
      })
    },
    // 个性化菜单新增并保存
    personSaveWxMenu() {
      let cookieParams = this.localStorageSaveOrRead('personalMenuItem')
      let params = {
        appAccountId: this.appAccountId,
        country: cookieParams.country,
        province: cookieParams.province,
        city: cookieParams.city,
        clientPlatformType: cookieParams.clientPlatformType,
        language: cookieParams.language,
        matchRuleName: cookieParams.matchRuleName,
        sex: cookieParams.sex,
        tagIds: cookieParams.tagIds
      }
      this.post(this.fylPath.personSaveWxMenu, params).then(data => {
        if (data.code === 1) {
          this.cancelIntercept()
          this.$Message.success('保存成功')
          this.$router.push({name: 'personalizedMenu'})
        } else {
          this.$Message.error(data.message.errmsg || data.message)
        }
      })
    },
    // 自定义菜单修改
    updateWxMenu(saveAndIssue) {
      this.pageChange()
      if (saveAndIssue) {
        let isSubmit = this.chekedMenu(this.contentParams.menu, 'subMenu')
        console.log(this.errNoData)
        if (isSubmit) {
          this.saveModal = true
          // this.$root.Bus.$emit('emitCalcChecked')
        }
      }
    },
    typeChange(type) {
      this.errNoData = 1
      if (this.contentParams.selectedMenuIndex !== '' && this.contentParams.selectedSubMenuIndex === '') {
        if (type === 'view' || type === 'miniprogram') {
          if ((this.oldType === 'click' || this.oldType === 'media_id') && type !== 'click') {
            this.workStorage = this.contentParams.currentMenu.key || 'text'
          }
          this.contentParams.menu[this.contentParams.selectedMenuIndex].key = type
        } else if (type === 'markting') {
          if ((this.oldType === 'click' || this.oldType === 'media_id') && type !== 'click') {
            this.workStorage = this.contentParams.currentMenu.key || 'text'
          }
          if (this.constMarkting.indexOf(this.contentParams.menu[this.contentParams.selectedMenuIndex].key) < 0) {
            this.contentParams.menu[this.contentParams.selectedMenuIndex].key = 'posterTemplate'
          }
        } else {
          this.contentParams.menu[this.contentParams.selectedMenuIndex].key = this.workStorage || 'text'
        }
      } else if (this.contentParams.selectedMenuIndex !== '' && this.contentParams.selectedSubMenuIndex !== '') {
        if (type === 'view' || type === 'miniprogram') {
          if ((this.oldType === 'click' || this.oldType === 'media_id') && type !== 'click') {
            this.workStorage = this.contentParams.currentMenu.key || 'text'
          }
          console.log(this.workStorage)
          this.contentParams.menu[this.contentParams.selectedMenuIndex].subMenu[this.contentParams.selectedSubMenuIndex].key = type
        } else if (type === 'markting') {
          if ((this.oldType === 'click' || this.oldType === 'media_id') && type !== 'click') {
            this.workStorage = this.contentParams.currentMenu.key || 'text'
          }
          if (this.constMarkting.indexOf(this.contentParams.menu[this.contentParams.selectedMenuIndex].subMenu[this.contentParams.selectedSubMenuIndex].key) < 0) {
            this.contentParams.menu[this.contentParams.selectedMenuIndex].subMenu[this.contentParams.selectedSubMenuIndex].key = 'posterTemplate'
          }
        } else {
          this.contentParams.menu[this.contentParams.selectedMenuIndex].subMenu[this.contentParams.selectedSubMenuIndex].key = this.workStorage || 'text'
        }
      }
      this.oldType = type
      this.updateWxMenu()
    },
    // saveAndIssue 点击发布并保存
    setType(key, saveAndIssue, type) {
      // if (!this.menuName) {
      //   return
      // }
      this.errNoData = 1
      if (this.contentParams.selectedMenuIndex !== '' && this.contentParams.selectedSubMenuIndex === '') {
        if (type) {
          this.contentParams.menu[this.contentParams.selectedMenuIndex].type = type
        }
        this.contentParams.menu[this.contentParams.selectedMenuIndex].key = key
        this.contentParams.menu[this.contentParams.selectedMenuIndex].value =  this.contentParams.menu[this.contentParams.selectedMenuIndex][key]
        this.updateParams.value =  this.contentParams.menu[this.contentParams.selectedMenuIndex][key]
      } else if (this.contentParams.selectedMenuIndex !== '' && this.contentParams.selectedSubMenuIndex !== '') {
        if (type) {
          this.contentParams.menu[this.contentParams.selectedMenuIndex].subMenu[this.contentParams.selectedSubMenuIndex].type = type
        }
        this.contentParams.menu[this.contentParams.selectedMenuIndex].subMenu[this.contentParams.selectedSubMenuIndex].key = key
        console.log(key)
        this.updateParams.value =  this.contentParams.menu[this.contentParams.selectedMenuIndex].subMenu[this.contentParams.selectedSubMenuIndex][key]
        this.contentParams.menu[this.contentParams.selectedMenuIndex].subMenu[this.contentParams.selectedSubMenuIndex].value = this.updateParams.value
      }
      this.updateParams.key = key
      if (this.updateParams.value) {
        if (this.updateParams.key === 'text') {
          let str = this.updateParams.value.replace(/<(?!img).*?>/g, '').replace(/&nbsp;/g, '')
          if (!str) {
            if (saveAndIssue) {
              this.errNoData = 2
            }
          } else {
            this.updateWxMenu(saveAndIssue)
          }
        } else {
          this.updateWxMenu(saveAndIssue)
        }
      } else {
        this.updateWxMenu(saveAndIssue)
      }
      // if (!this.updateParams.value && saveAndIssue) {
      //   this.errNoData = 2
      // }
    },
    // 提交保存自定义菜单
    async handle() {
      let res = await this.saveBatchWxMenu(this.type)
      if (res.code === 1) {
        if (this.type === 'personalizedMenu') {
          if (this.localStorageSaveOrRead('personalMenuItem').newCreate) {
            this.personSaveWxMenu()
          } else {
            this.updateAndPublishWxMenu()
          }
        } else {
          this.saveAndPublishWxMenu()
        }
      } else {
        this.$Message.error(res.message)
      }
    },
    openDelModal(delMenuId) {
      this.delModal = true
      if (this.contentParams.level === 1 && this.contentParams.menu.length === 1 && this.type !== 'personalizedMenu') {
        this.delContent = `您正在删除最后一个自定义菜单，删除后会导致个性化菜单也被删除，确定要删除吗？`
      } else {
        this.delContent = `删除后“${this.contentParams.currentMenu.name}”菜单下设置的内容将被删除，确定删除菜单吗？`
      }

      this.delMenuId = delMenuId
    },
    delOk() {
      this.delMenu()
    },
    async saveAndIssue() {
      this.constSaveAndIssue = true
      if (this.contentParams.menuNameBounds !== 1) {
        return
      }
      if (this.contentParams.currentMenu.type === 'miniprogram') {
        let bool = true
        if (this.$refs.miniprogram) {
          bool = await this.$refs.miniprogram.handlerMiniprogram()
        }
        if (bool) {
          this.setType(this.contentParams.currentMenu.key, true)
        }
      } else {
        this.setType(this.contentParams.currentMenu.key, true)
      }
    },
    cancelPersonMenu() {
      this.$router.push({name: 'personalizedMenu'})
    },
    lastStep() {
      this.$emit('lastStep', 0)
    },
    // 删除菜单
    delMenu: function() {
      this.deleteWxMenu(this.contentParams.level)
    },
    urlBlur() {
      this.setType(this.contentParams.currentMenu.key)
    },
    nameBlur() {
      this.setType(this.contentParams.currentMenu.key, null)
    },
    // 检查菜单名称长度
    checkMenuName: function(val) {
      if (this.getMenuNameLen(val) === 0) {
        this.contentParams.menuNameBounds = 3
      } else if (this.contentParams.level === 1 && this.getMenuNameLen(val) <= 16) {
        this.contentParams.menuNameBounds = 1
      } else if (this.contentParams.level === 2 && this.getMenuNameLen(val) <= 40) {
        this.contentParams.menuNameBounds = 1
      } else {
        this.contentParams.menuNameBounds = 2
      }
    },
    // 获取菜单名称长度
    getMenuNameLen: function(val) {
      var len = 0
      for (var i = 0; i < val.length; i++) {
        var a = val.charAt(i)
        /* eslint-disable */
        a.match(/[^\x00-\xff]/gi) != null ? (len += 2) : (len += 1)
        /* eslint-enable */
      }
      return len
    },
    // 检查菜单是否都保存完毕
    chekedMenu(obj, str) {
      if (obj.length > 0) {
        for (let i = 0; i < obj.length; i++) {
          let subMenuArr = obj[i][str]
          if (subMenuArr.length > 0) {
            for (let j = 0; j < subMenuArr.length; j++) {
              let str = subMenuArr[j].value
              console.log(subMenuArr[j])
              if (subMenuArr[j].key === 'text') {
                if (subMenuArr[j].textLength < 0) {
                  this.contentParams.level = 2
                  this.contentParams.selectedMenuIndex = i
                  this.contentParams.selectedSubMenuIndex = j
                  this.contentParams.currentMenu = this.contentParams.menu[i].subMenu[j]
                  this.errNoData = 3
                  return false
                }
                str = str.replace(/<(?!img).*?>/g, '').replace(/&nbsp;/g, '')
              }
              if (subMenuArr[j].key === 'miniprogram') {
                if (this.getMenuNameLen(subMenuArr[j].miniprogram.url) > 1024 || subMenuArr[j].miniprogram.url.length <= 0 || subMenuArr[j].miniprogram.appid.length <= 0 || subMenuArr[j].miniprogram.pagepath.length <= 0) {
                  this.contentParams.level = 2
                  this.contentParams.selectedMenuIndex = i
                  this.contentParams.selectedSubMenuIndex = j
                  this.contentParams.currentMenu = this.contentParams.menu[i].subMenu[j]
                  this.errNoData = 4
                  return false
                }
              }
              if (!str) {
                this.contentParams.level = 2
                this.contentParams.selectedMenuIndex = i
                this.contentParams.selectedSubMenuIndex = j
                this.contentParams.currentMenu = this.contentParams.menu[i].subMenu[j]
                this.errNoData = 2
                return false
              }
            }
          } else {
            let str = obj[i].value
            if (obj[i].key === 'text') {
              if (obj[i].textLength < 0) {
                this.contentParams.level = 1
                this.contentParams.selectedMenuIndex = i
                this.contentParams.selectedSubMenuIndex = ''
                this.contentParams.currentMenu = this.contentParams.menu[i]
                this.errNoData = 3
                return false
              }
              str = str.replace(/<(?!img).*?>/g, '').replace(/&nbsp;/g, '')
            }
            if (obj[i].key === 'miniprogram') {
              if (this.getMenuNameLen(obj[i].miniprogram.url) > 1024 || obj[i].miniprogram.url.length <= 0 || obj[i].miniprogram.appid.length <= 0 || obj[i].miniprogram.pagepath.length <= 0) {
                this.contentParams.level = 1
                this.contentParams.selectedMenuIndex = i
                this.contentParams.selectedSubMenuIndex = ''
                this.contentParams.currentMenu = this.contentParams.menu[i]
                this.errNoData = 4
                return false
              }
            }
            if (!str) {
              this.contentParams.level = 1
              this.contentParams.selectedMenuIndex = i
              this.contentParams.selectedSubMenuIndex = ''
              this.contentParams.currentMenu = this.contentParams.menu[i]
              this.errNoData = 2
              return false
            }
          }
        }
        this.errNoData = 1
        return true
      }
    },
    pageChange() { // 页面内容有修改时打开页面离开提示
      if (this.$route.meta.leaveIntercept !== undefined) {
        this.$route.meta.leaveIntercept = true // 打开页面离开提示
      }
    },
    cancelIntercept() { // 取消页面关闭拦截
      if (this.$route.meta.leaveIntercept !== undefined) {
        this.$route.meta.leaveIntercept = false // 取消页面离开提示
      }
    }
  },
  destroyed() {
    this.$root.Bus.$off('messageChange')
    this.$root.Bus.$off('updateIdxOrder')
    this.$root.Bus.$off('errNoData')
    this.$root.Bus.$off('checkMenuValid')
  },
  components: {
    MenuContentType,
    MarktingMenuContentType,
    Minprogram
  }
}
</script>
<style lang="stylus">
@import '~@/assets/stylus/mixin'
.wechatContent
  // min-width 760px
  position relative
  .weixin-menu-detail
    height 620px
    border solid 1px #e3e4e5
    position relative
    &.weixin-nodone
      border none
      .content-center
        position absolute
        left 50%
        top 50%
        color #979899
        transform translate(-50%, -50%)
    .menu-title
      clear()
      height 50px
      line-height 50px
      border-bottom solid 1px #e3e4e5
      .menu-name
        float left
        margin-left 20px
      .menu-del
        float right
        margin-right 20px
        cursor pointer
        &:hover
          color #409fff
    .menu-content
      padding 30px 30px 0
      .menu-input-group
        clear()
        &:nth-of-type(1)
          margin-bottom 27px
          &.nomargin
            margin-bottom 0
        .menu-label
          line-height 40px
          float left
        .menu-radio
          line-height 38px
        .menu-input
          margin-left 30px
          float left
          .menu-tips
            margin-top 10px
            color #979899
            font-size 12px
      .menu-content-type
        .err-text
          font-size 12px
          color: #f56c6c
          margin-top 10px
        .menu-content-url
          height 161px
          border solid 1px #e3e4e5
          padding-left 24px
          .tips
            color #979899
            margin-top 29px
          .input
            margin-top 20px
            clear()
            .urlAddress
              line-height 40px
              float left
              margin-right 30px
            .menu-input-text
              float left
              width 360px
  .done-btn
    margin-top 20px
    text-align center
    .save-btn
      width 170px
    .watch-btn
      margin-left 60px
      width 110px
    &.personMenu
      .save-btn
        width 110px
      .watch-btn
        margin-left 30px
        width 110px
</style>
