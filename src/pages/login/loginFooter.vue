<template>
  <footer class="login-footer-wrapper">
    <div class="footerdiv flex">
      <div style="width: 215px;padding: 0;float: left;">
        <ul class="textleft firstul" style="border-right: 1px solid #0f1626;">
          <li class="textsize-first">关注我们</li>
          <li><img class="foot-qrcode" src="/static/images/login/foot_qrcode.png" /></li>
          <li style="margin-top: 15px;">扫码关注销大师</li>
        </ul>
      </div>
      <div style="width:690px;float:left;overflow: hidden;">
        <ul
          class="textleft"
          style="float: left;margin-left:85px;display: inline-block;"
        >
          <li class="textsize-first">产品</li>
          <li class="margin-bottom-25">
            <a href="Socialmarketing.html">社交营销系统</a>
          </li>
          <li><a href="Intelligentreception.html">智能客服系统</a></li>
        </ul>
        <ul
          class="textleft"
          style="float: left;margin-left:85px;display: inline-block;"
        >
          <li class="textsize-first">价格</li>
          <li class="margin-bottom-25"><a href="price.html">试用版</a></li>
          <li class="margin-bottom-25"><a href="price.html">入门版</a></li>
          <li class="margin-bottom-25"><a href="price.html">专业版</a></li>
          <li><a href="price.html">旗舰版</a></li>
        </ul>
        <ul
          class="textleft"
          style="float: left;margin-left:85px;display: inline-block;"
        >
          <li class="textsize-first">下载</li>
          <li class="margin-bottom-25">
            <a href="download.html">下载客户端</a>
          </li>
        </ul>
        <ul
          class="textleft"
          style="float: left;margin-left:85px;display: inline-block;"
        >
          <li class="textsize-first">关于我们</li>
          <li class="margin-bottom-25"><a href="aboutus.html">关于团队</a></li>
          <li class="margin-bottom-25"><a href="corporateculture.html">企业文化</a></li>
          <li class="margin-bottom-25"><a href="joinus.html">加入我们</a></li>
        </ul>
      </div>
      <div style="width:375px;overflow:hidden;float:right">
        <ul class="textleft">
          <li class="textsize-first">联系我们</li>
          <li class="margin-bottom-25">咨询热线：</li>
          <li class="margin-bottom-25">
            <strong style="color:#fff;font-size: 16px;margin-right: 10px;"
              >400-1622-800</strong
            >(周一至周五：9:00~17:30)
          </li>
          <li class="margin-bottom-25">咨询邮箱：zx@xiaodashi.com</li>
          <li>公司地址：杭州市绍兴路文源创意产业园6号楼1层</li>
        </ul>
      </div>
    </div>
    <div class="rights">
      <a href="#" style="float:left">
        <img src="/static/images/login/foot_logo.png" alt="" class="logo" />
      </a>
      <p style="float: right;color:#787c80">
        Copyright &copy; 2016-2019杭州星客互联科技有限公司
        All Rights Reserved浙ICP备16035416
      </p>
    </div>
  </footer>
</template>

<script>
export default {}
</script>

<style lang="stylus">
.login-footer-wrapper
  padding-top 49px
  padding-bottom  15px
  background-color #01081a
  text-align center
  color #909499
  footer
    background #01081a
  .footerdiv
    width 1200px
    overflow hidden
    margin 0 auto
  .textleft
    text-align left
  a
    color #666666
    cursor pointer
  li
    color #666666
  .textsize-first
    font-size 16px
    color #cacbcc
    margin-bottom 40px
  .bodernone
    margin 0
    padding 0
  img
    width auto
  /* .firstul:after{
    position: absolute;
    top: 0px;
    right: 34px;
    width: 1px;
    height: 212px;
    content: "";
    background: #616060;
  } */
  .social a
    border 2px solid #ffffff
  .social a i
    color #ffffff
  .social a:hover
    background #ffffff
  .social a:hover i
    color #66cdcc
  .rights
    color #ffffff
    width 1200px
    margin 0 auto
    /* clear: both; */
    overflow hidden
    padding-top 22px
    margin-top 64px
    border-top 1px solid #0f1626
  .rights a
    color #ffffff
    font-weight 300
    text-decoration none
  .social
    display block
    margin-top 30px
  .margin-bottom-25
    margin-bottom 25px
  .social a
    margin 0 8px
    padding 15px
    -webkit-border-radius 50%
    -moz-border-radius 50%
    -ms-border-radius 50%
    -o-border-radius 50%
    border-radius 50%
    display inline-block
    -webkit-transition all 0.25s ease-in-out
    -moz-transition all 0.25s ease-in-out
    -ms-transition all 0.25s ease-in-out
    -o-transition all 0.25s ease-in-out
    transition all 0.25s ease-in-out
  .social a i
    width 1em
  .rights
    margin-top 30px
  .rights a
    text-decoration underline
    -webkit-transition all 0.25s ease-in-out
    -moz-transition all 0.25s ease-in-out
    -ms-transition all 0.25s ease-in-out
    -o-transition all 0.25s ease-in-out
    transition all 0.25s ease-in-out
    font-weight bold
  .rights a:hover
    text-decoration none
  .foot-qrcode
    width 126px
    height 126px
</style>
