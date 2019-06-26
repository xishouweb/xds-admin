// 因为IE不兼容es6所以不能用模板字符串
$(document).ready(function() {
  var html =
    '<div class="container nav-box" style="padding-top: 18px;padding-bottom: 18px; ">' +
      '<div class="navbar-header">' +
        '<button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1">' +
          '<span class="fa fa-bars fa-lg"></span>' +
        '</button>' +
        '<a class="navbar-brand" href="index.html"></a>' +
      '</div>' +
      '<div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">' +
        '<div class="nav navbar-nav navbar-right margin-top-7">' +
          '<div class="telphone telphone-icon navbar-left margin-right-10">' +
            '<h5>400-1622-800</h5>' +
          '</div>' +
          '<div class="navbar-left">'
  if (!API.userInfo) {
    html += '<a href="/admin/login" type="button" class="btns login-btn" id="login-btn">登录</a>' +
            '<button type="button" class="btns sy-btn">' +
              '<a style="color: #fff;" href="/admin/register">免费试用</a>' +
            '</button>'
  } else {
    html +=
            '<div class="account">' +
              '<div class="user">' +
                '<div class="user-img">' +
                  '<img src="' + API.userInfo.picUrl + '" alt="userImg">' +
                '</div>' +
                '<div class="user-name active">' + API.userInfo.nickName +
                  '<span class="glyphicon glyphicon-triangle-bottom"></span>' +
                '</div>' +
              '</div>' +
              '<div class="sub-nav user-op" >' +
                '<ul style="width:100%;margin:0 auto;">' +
                  '<li><a href="/admin/main/company">我的企业</a></li>' +
                  '<li><a href="/admin/main/personInfo">个人信息</a></li>' +
                  '<li id="logOut"><span href="#" >退出登录</span></li>' +
                '</ul>' +
              '</div>' +
            '</div>'
  }

  html +=
          '</div>' +
        '</div>' +
        '<ul class="nav navbar-nav navbar-right margin-right-20 ">' +
          '<li><a href="index.html">首页</a></li>' +
          '<li>' +
            '<a href="Socialmarketing.html">' +
              '产品<span class="select"></span>' +
            '</a>' +
            '<div id="select" class="sub-nav" style="display:none;width: 100%;position:fixed;background: #fff;height:120px;z-index: 999;left:0;top: 80px;border-bottom:1px solid #f3f4f6">' +
              '<div style="position:absolute; width:100%; height:2px; top: 0; left: 0; background: #e7e7e7; box-shadow: 0px 2px 6px rgba(0, 51, 102, 0.15);"></div>' +


              '<ul style="width:1200px;margin:0 auto;">' +
                '<li class="pro-1">' +
                  '<a href="Socialmarketing.html">' +
                    '<span>社交营销系统</span>' +
                    '<p>丰富的营销利器，帮助企业精准引流</p>' +
                  '</a>' +
                '</li>' +
                '<li class="pro-2">' +
                  '<a href="Intelligentreception.html">' +
                    '<span>智能客服系统</span>' +
                    '<p>高效接待客户，提高成交转化率</p>' +
                  '</a>' +
                '</li>' +
              '</ul>' +
            '</div>' +
          '</li>' +
          '<li ><a href="price.html">价格</a></li>' +
          '<li><a href="download.html">下载</a></li>' +
          '<li>' +
            '<a href="aboutus.html">' +
              '关于我们<span class="select"></span>' +
            '</a>' +
            '<div id="select" class="sub-nav" style="display:none;width: 100%;position:fixed;background: #fff;height:120px;z-index: 999;left:0;top: 80px;border-bottom:1px solid #f3f4f6">' +

            '<div style="position:absolute; width:100%; height:2px; top: 0; left: 0; background: #e7e7e7; box-shadow: 0px 2px 6px rgba(0, 51, 102, 0.15);"></div>' +
              '<ul style="width:1200px;margin:0 auto;">' +
                '<li class="pro-3">' +
                  '<a href="aboutus.html">' +
                    '<span>关于团队</span>' +
                    '<p>专注SAAS领域的企业服务</p>' +
                  '</a>' +
                '</li>' +
                '<li class="pro-4">' +
                  '<a href="corporateculture.html">' +
                    '<span>企业文化</span>' +
                    '<p>客户团队公司三者共赢发展</p>' +
                  '</a>' +
                '</li>' +
                '<li class="pro-5">' +
                  '<a href="joinus.html">' +
                    '<span>加入我们</span>' +
                    '<p>欢迎有梦想的青年加入</p>' +
                  '</a>' +
                '</li>' +
              '</ul>' +
            '</div>' +
          '</li>' +
        '</ul>' +
      '</div>' +
    '</div>'
  $("nav").append(html)

  $('.navbar-nav>li').hover(
    function() {
      $(this).children('.sub-nav').stop().slideDown()
      $('.user-op').slideUp()
    },function() {
      $(this).children('.sub-nav').stop().slideUp()
    }
  )

  // 百度统计分析代码
  var _hmt = _hmt || [];
  (function() {
    var hm = document.createElement("script")
    hm.src = "https://hm.baidu.com/hm.js?80e6084d9960c830df14c6ccc94b9d9f"
    var s = document.getElementsByTagName("script")[0]
    s.parentNode.insertBefore(hm, s)
  })()
})
