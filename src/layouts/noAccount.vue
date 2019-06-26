<template>
<div>
  <div class="tips-wrapper">
    <div class="noImg">
      <img src="@/assets/images/admin/noTencent.png" alt>
    </div>
    <div class="tip-1">您尚未添加任何公众号</div>
    <div class="tip"></div>
    <!-- <div class="tip-2">当前套餐版本最多支持{{corpInfoData.packAppidNum}}个公众号，如需更多服务请<span @click="upgrade"> 升级</span></div>
    <Button class="tip-3" type="primary" @click="addTencent">添加公众号</Button>-->
  </div>
  <div class="bottom-tip">
    <div class="explain">授权说明</div>
    <div>1、公众号分为四种类型：非认证订阅号、认证订阅号、非认证服务号、认证服务号。销大师支持认证服务号和认证订阅号，不支持非认证服务号和非认证订阅号。</div>
    <div>2、授权绑定公众号后，可在销大师系统使用自定义菜单、自动回复、消息群发等功能。</div>
    <div>3、不同类型的公众号，接口权限不一样，在销大师系统可使用的功能也不一样。认证服务号拥有最多的接口权限，销大师系统相应的拥有最多的功能。</div>
    <div>4、一个微信公众号仅可绑定一个企业；绑定之后支持解除绑定。</div>
    <div>5、为保证所有功能的正常使用，授权时请保持默认选择，把权限统一授权给销大师。</div>
  </div>
</div>
</template>

<script>
export default {

}
</script>
<style lang="stylus" scoped>
    .tips-wrapper
      text-align center
      height 495px
      border-bottom solid 1px #e3e5e6
      .tip-1
        margin-top 30px
        font-size 16px
      .tip-2
        margin-top 15px
        span
          color #409eff
          cursor pointer
      .tip-3
        width 200px
        margin-top 20px
    .bottom-tip
      div
        margin-top 10px
      .explain
        margin-top 40px
</style>
