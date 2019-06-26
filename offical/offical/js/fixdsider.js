$(document).ready(function() {
  var html =
  '<div class="fix-Side">' +
    '<ul id="side">' +
      '<li>' +
        '<img class="qq" src="offical/img/icon_5QQ.png"/>' +
        '<a target=_blank href="http://wpa.qq.com/msgrd?v=3&uin=603837686&site=qq&menu=yes">' +
          '<p class="tip">在线<br>咨询</p>' +
        '</a>' +
      '</li>' +
      '<li>' +
        '<i class="before"></i>' +
        '<img class="telimg" src="offical/img/icon_5phone.png"/>' +
        '<div class="tel">400-1622-800</div>' +
        '<p class="tip">联系<br>电话</p>' +
      '</li>' +
      '<li>' +
        '<i class="before"></i>' +
        '<img class="erweimaimg" src="offical/img/icon_5code.png"/>' +
        '<div class="erweima">' +
          '<img src="offical/img/index/foot_qrcode.png"/>' +
          '<span>销大师官方微信</span>' +
        '</div>' +
        '<p class="tip">扫码<br>关注</p>' +
      '</li>' +
      '<li class="toTop">' +
        '<i class="before"></i>' +
        '<img class="topimg" src="offical/img/icon_5top.png"/>' +
        '<p class="tip">回到<br>顶部</p>' +
      '</li>' +
    '</ul>' +
  '</div>'

  $('body').append(html)
  // 移入移除事件
  var oLi = $('#side>li')
  oLi.each(function(i, v) {
    // if (i < oLi.length - 1) {
      $(v).hover(
        function() {
          $('.user-op').slideUp()
          $(this).addClass('hover')
            .css('background','#409fff')
          if (i < oLi.length - 2) {
            oLi.eq(i + 1).find('.before').hide()
          }
        }, function() {
          $(this).removeClass('hover')
            .css('background','#177ee5')
          if (i < oLi.length - 2) {
            oLi.eq(i + 1).find('.before').show()
          }
        }
      )
    // }
  })
  // 返回顶部
  $('#side .toTop').click(function() {
    $('html , body').animate({scrollTop: 0},'slow')
  })
})
