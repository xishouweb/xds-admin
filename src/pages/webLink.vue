<template>
  <div id="webLink">
    <div class="title">所有页面链接</div>
    <div class="link-wrapper">
      <Button class="link-item" v-for="(item, idx) in data" @click="routerLink(item.name)" :key="idx" type="primary">{{item.linkName}}</Button>
    </div>
    
  </div>
</template>

<script>
export default {
  data() {
    return {
      data: [
        {
          linkName: '登录',
          name: 'login'
        },
        {
          linkName: '注册',
          name: 'register'
        },
        {
          linkName: '注册协议',
          name: 'agreement'
        },
        {
          linkName: '主页',
          name: 'home'
        },
        {
          linkName: '公司列表',
          name: 'company'
        },
        {
          linkName: '个人信息',
          name: 'personInfo'
        },
        {
          linkName: '创建新企业',
          name: 'createCompany'
        },
        {
          linkName: '修改手机号',
          name: 'editPhone'
        },
        {
          linkName: '概况',
          name: 'survey'
        },
        {
          linkName: '授权',
          name: 'authorization'
        },
        {
          linkName: '公众号',
          name: 'tencentManage'
        }
      ]
    }
  },
  methods: {
    routerLink(name) {
      let routeData
      if (name === 'register') {
        routeData = this.$router.resolve({
          name: name,
          params: {
            step: 0
          }
        })
      } else {
        routeData = this.$router.resolve({
          name: name
        })
      }
      window.open(routeData.href, '_blank')
    }
  }
}
</script>

<style lang="stylus">
@import '~@/assets/stylus/mixin'
#webLink
  padding 42px 43px 20px 43px
  .title
    font-size 20px
  .link-wrapper
    margin-top 30px
    .link-item
      margin-left 30px
</style>
