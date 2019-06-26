<template>
  <div class="header">
    <div>
      <div class="header-left">
          <a class="icon" href="/">
              <img :src="logourl" alt="icon">
          </a>
      </div>
      <div class="header-center">
        <Menu mode="horizontal" theme="light" :active-name="curMenu" @on-select="selectMenu" style="margin: 0 auto;">
          <MenuItem name="home">
            <a href="/index.html">
              <p class="menu-item" @click="subMenuTap">
                首页
              </p>
            </a>
          </MenuItem>
          <MenuItem name="product">
            <p class="menu-item" @click="subMenuTap('product')">
              <span>产品</span>
              <i class="icon">&#xe7d6;</i>
            </p>
            <div class="second" v-show="show.product">
              <ul class="flexC">
                <li class="second-item">
                  <img src="../../static/icon/icon_4shejiao.png" alt="">
                  <a href="/Socialmarketing.html">
                    <p>社交营销系统</p>
                    <span class="gray_color">丰富的营销利器，帮助企业精准引流</span>
                  </a>
                </li>
                <li class="second-item">
                  <img src="../../static/icon/icon_4zhineng.png" alt="">
                  <a href="/Intelligentreception.html">
                    <p>智能客服系统</p>
                    <span class="gray_color">高效接待客户，提高成交转化率</span>
                  </a>
                </li>
              </ul>
            </div>
          </MenuItem>
          <MenuItem name="service">
            <a href="/price.html">
              <p class="menu-item" @click="subMenuTap">价格</p>
            </a>
          </MenuItem>
          <MenuItem name="download">
            <a href="/download.html">
              <p class="menu-item" @click="subMenuTap">下载</p>
            </a>
          </MenuItem>
          <MenuItem name="contact">
            <p class="menu-item" @click="subMenuTap('contact')">
              <span>关于我们</span>
              <i class="icon">&#xe7d6;</i>
            </p>
            <div class="second" v-show="show.contact">
              <ul class="flexC">
                <li class="second-item">
                  <img src="../../static/icon/icon_4company.png" alt="">
                  <a href="/aboutus.html">
                    <p>关于团队</p>
                    <span>专注SAAS领域的企业服务</span>
                  </a>
                </li>
                <li class="second-item">
                  <img src="../../static/icon/icon_4team.png" alt="">
                  <a href="/corporateculture.html">
                    <p>企业文化</p>
                    <span>客户团队公司三者共赢发展</span>
                  </a>
                </li>
                <li class="second-item">
                  <img src="../../static/icon/icon_4join.png" alt="">
                  <a href="/joinus.html">
                    <p>加入我们</p>
                    <span>欢迎有梦想的青年加入</span>
                  </a>
                </li>
              </ul>
            </div>
          </MenuItem>
        </Menu>
      </div>
      <div class="header-right">
        <img class="ios-telephone" src="@/assets/images/home/icon-tel.png" alt="">
        <span class="callPhone">400-1622-800</span>
        <div class="login-before flex" v-show="userStatus == 1">
          <div>
            <router-link to="/login">登录</router-link>
          </div>
          <div>
            <p @click="toRegister">免费试用</p>
          </div>
        </div>
        <div class="login-after" v-show="userStatus == 2">
          <Dropdown trigger="click" @on-click="enterRoute">
            <div class="user">
              <div class="user-img">
                <img v-if="userStatus == 2" :src="userInfo.picUrl" alt="userImg">
              </div>
              <div class="user-name" v-if="userStatus == 2">{{userInfo.nickName}}</div>
              <Icon type="arrow-down-b"></Icon>
            </div>
            <DropdownMenu slot="list" class="userDrop">
              <DropdownItem name="company"><Icon size="16" type="home"></Icon>我的企业</DropdownItem>
              <DropdownItem name="personInfo"><Icon size="16" type="person"></Icon>个人信息</DropdownItem>
              <DropdownItem name="quit"><Icon size="16" type="power"></Icon>退出登录</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { logout } from '@/api/query'
import {mapActions} from 'vuex'
export default {
  data() {
    return {
      logourl: `${process.env.SELF_BASE_URL}/top_logo.png`,
      userInfo: this.getToken() || null,
      userStatus: 1,
      curMenu: null, // 当前导航项
      show: { // 控制子导航的显示
        product: false,
        contact: false,
      }
    }
  },
  mounted() {
    this.isLogin()
    console.log(process.env)
    this.on(document.body, 'click', () => {
      this.closeSecond()
      this.curMenu = null
    })
  },
  methods: {
    subMenuTap(menu) { // 二级导航的显示控制
      this.closeSecond(menu)
    },
    closeSecond(menu) { // 关闭子导航
      Object.keys(this.show).forEach(k => {
        if (k === menu) {
          this.show[k] = !this.show[k]
          if (!this.show[k]) {
            setTimeout(() => {
              this.curMenu = null
            }, 60)
          }
        } else {
          this.show[k] = false
        }
      })
    },
    enterRoute(name) {
      if (name !== 'quit') {
        this.$router.push({ name: name })
      } else {
        this.logout()
      }
    },
    selectMenu(name) {
      this.curMenu = name
      // this.setAnchor(name)
      // this.$router.push({ name: 'home' })
    },
    isLogin() {
      if (this.userInfo) {
        this.userStatus = 2
      } else {
        this.userStatus = 1
      }
    },
    logout() {
      logout().then(data => {
        if (data.code === 1) {
          this.removeToken()
          this.removeCookieSession()
          localStorage.clear()
          location.href = process.env.MOBILE_BASE_URL + '/index.html'
        }
      })
    },
    toRegister() {
      this.setStep(0)
      this.$router.push({name: 'register'})
    },
    ...mapActions({
      setStep: 'user/setStep',
      setAnchor: 'user/setAnchor'
    })
  }
}
</script>
<style lang="stylus" rel="stylesheet/stylus">
@import '~@/assets/stylus/mixin'
.header
  position fixed
  height 80px
  top 0
  left 0
  border-bottom solid 1px #dcdee2
  background-color #fff
  z-index 50
  width 100%
  min-width 1057px
  // clear()
  >div
    width: 100%
    max-width: 1520px
    margin: 0 auto
    display: flex
    align-items: center
    justify-content: space-between
  .header-left
    // float left
    // line-height 60px
    // margin-left 120px
    .icon
      cursor pointer
      display: flex
      height: 80px
      align-items: center
      img
        height 45px
      .text
        float left
        font-size 21px
        margin-left 5px
        color #0f0f0f
  .header-center
    height: 100%
    display flex
    align-items center
    .ivu-menu
      height: 80px
      .ivu-menu-horizontal .ivu-menu-item
        padding 0 35px
        height: 100%
  .header-right
    font-size 14px
    display flex
    align-items center
    .ios-telephone
      font-size 18px
      margin-right 8px
    .callPhone
      margin-right 20px
      font-size 16px
    .login-before
      clear()
      div
        // margin-top 13px
        float left
        cursor pointer
        height 34px
        line-height 34px
        border-radius 3px
        text-align center
        a
          color #409eff
          display inline-block
          width 100%
          height 100%
        &:nth-of-type(1)
          margin-right 34px
          width 90px
          border: solid 1px #409eff
        &:nth-of-type(2)
          width 110px
          background-color #409eff
          color #fff
    .login-after
      cursor pointer
      clear()
      .user
        line-height 60px
        .user-img
          float left
          margin-right 10px
          img
            width 36px
            height 36px
            border-radius 50%
            display inline-block
            vertical-align middle
        .user-name
          float left
          padding-right 10px
          max-width 90px
          no-wrap()
  .second
    position: fixed
    top: 81px
    left: 0
    right: 0
    background-color: #fff
    border-bottom: 1px solid rgb(243, 244, 246)
    box-shadow: 0px 2px 6px rgba(0, 51, 102, 0.15)
    ul
      width: 1200px
      margin: 0 auto
      .second-item
        width: 30%
        position: relative
        >img
          width: 18px
          height: 18px
          position: absolute
          top: 40px
          left: 8px
        >a
          display: block
          line-height: 1
          height: 120px
          padding: 28px 35px
          >p
            font-size: 16px
            line-height: 1
            padding: 12px 0
          >span
            font-size: 14px
        >a:hover
          >p, >span
            color: #409eff


  .menu-item
    font-size: 16px
    line-height: 80px
    >.icon
      font-size: 14px
      margin-left: 8px
</style>


