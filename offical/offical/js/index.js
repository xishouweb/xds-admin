var appMaster = {

    preLoader: function() {
        imageSources = []
        $('img').each(function() {
            var sources = $(this).attr('src')
            imageSources.push(sources)
        })
        if ($(imageSources).load()) {
            $('.pre-loader').fadeOut('slow')
        }
    },

    smoothScroll: function() {
        // Smooth Scrolling
        $('a[href*=#]:not([href=#carousel-example-generic])').click(function() {
            if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
                var target = $(this.hash)
                target = target.length ? target : $('[name=' + this.hash.slice(1) + ']')
                if (target.length) {
                    $('html,body').animate({
                        scrollTop: target.offset().top
                    }, 1000)
                    return false
                }
            }
        })
    },

    reviewsCarousel: function() {
        // Reviews Carousel
        $('.review-filtering').slick({
            slidesToShow: 1,
            slidesToScroll: 1,
            dots: true,
            arrows: false,
            autoplay: true,
            autoplaySpeed: 5000
        })
    },

    screensCarousel: function() {
        // Screens Carousel
        $('.filtering').slick({
            slidesToShow: 4,
            slidesToScroll: 4,
            dots: false,
            responsive: [{
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2,
                    infinite: true,
                    dots: true
                }
            }, {
                breakpoint: 600,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2
                }
            }, {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }]
        })

        $('.js-filter-all').on('click', function() {
            $('.filtering').slickUnfilter()
            $('.filter a').removeClass('active')
            $(this).addClass('active')
        })

        $('.js-filter-one').on('click', function() {
            $('.filtering').slickFilter('.one')
            $('.filter a').removeClass('active')
            $(this).addClass('active')
        })

        $('.js-filter-two').on('click', function() {
            $('.filtering').slickFilter('.two')
            $('.filter a').removeClass('active')
            $(this).addClass('active')
        })

        $('.js-filter-three').on('click', function() {
            $('.filtering').slickFilter('.three')
            $('.filter a').removeClass('active')
            $(this).addClass('active')
        })
    },

    animateScript: function() {
        $('.scrollpoint.sp-effect1').waypoint(function() { $(this).toggleClass('active'); $(this).toggleClass('animated fadeInLeft') },{offset: '100%'})
        $('.scrollpoint.sp-effect2').waypoint(function() { $(this).toggleClass('active'); $(this).toggleClass('animated fadeInRight') },{offset: '100%'})
        $('.scrollpoint.sp-effect3').waypoint(function() { $(this).toggleClass('active'); $(this).toggleClass('animated fadeInDown') },{offset: '100%'})
        $('.scrollpoint.sp-effect4').waypoint(function() { $(this).toggleClass('active'); $(this).toggleClass('animated fadeIn') },{offset: '100%'})
        $('.scrollpoint.sp-effect5').waypoint(function() { $(this).toggleClass('active'); $(this).toggleClass('animated fadeInUp') },{offset: '100%'})
    },

    revSlider: function() {
        var docHeight = 850
        var mainSlider = $('#tp-banner').revolution({
          delay: 9000,
          fullWidth: 'on',
          startheight: 850,
          hideThumbs: 10,
          // navigationArrows: "none"
        })
    },

    scrollMenu: function() {
      var num = 50 // number of pixels before modifying styles
      let top = null
      let $side = $('#side>.toTop')
      let $nav = $('nav')

      $(window).bind('scroll', function () {
        top = $(window).scrollTop()
        // 控制头部导航栏的样式变化
        if (top > num) {
          $nav.addClass('scrolled')
          $(".login-btn").addClass("btnbg").removeClass('login-btn')
        } else {
          $nav.removeClass('scrolled')
          $(".btnbg").addClass("login-btn").removeClass('btnbg')
        }
        // 控制侧边栏的显示与隐藏
        if (top >= $(window).height() / 3) {
          $side.show()
        } else {
          $side.hide()
        }
      })
    },
    placeHold: function() {
        // run Placeholdem on all elements with placeholders
        Placeholdem(document.querySelectorAll('[placeholder]'))
    },
   scroll: function() {
   var scrollTop = window.pageYOffset || document.documentElement.scrollTop
  if (scrollTop > 185) {
     $("nav").addClass('scrolled')
  }
   }
} // AppMaster
// 模块三的轮播效果
function switchContent() {
    var index = $(this).index()
    if (index == 0) {
        $("#features .part3_leftimg1").fadeIn().siblings().fadeOut()
        $(this).addClass("part3-background").removeClass("part3-nonebackground")
          .siblings("li").addClass("part3-nonebackground").removeClass("part3-background")
    } else if (index == 1) {
        $("#features .part3_leftimg2").fadeIn().siblings().fadeOut()
       $(this).addClass("part3-background").removeClass("part3-nonebackground")
        .siblings("li").addClass("part3-nonebackground").removeClass("part3-background")
    } else if (index == 2) {
        $("#features .part3_leftimg3").fadeIn().siblings().fadeOut()
       $(this).addClass("part3-background").removeClass("part3-nonebackground")
        .siblings("li").addClass("part3-nonebackground").removeClass("part3-background")
    } else {
        $("#features .part3_leftimg4").fadeIn().siblings().fadeOut()
       $(this).addClass("part3-background").removeClass("part3-nonebackground")
        .siblings("li").addClass("part3-nonebackground").removeClass("part3-background")
    }
}
// function autoSwitch() {

// }
// function removeautoscorll(){
//
// }

// 实现图片的预加载
function preloadImg(srcArr) {
    if (srcArr instanceof Array) {
        for (var i = 0; i < srcArr.length; i++) {
            var oImg = new Image()
            oImg.src = srcArr[i]
        }
    }
}
// 聊天自动滚动

function startmarquee(lh,speed,delay) {
    var t
    var oHeight = 386 /** div的高度 **/
   var p = false
   var o = document.getElementById("chatauto")
   var preTop = 0
   o.scrollTop = 0
   function start() {
       t = setInterval(scrolling,speed)
       o.scrollTop += 1
   }
   function scrolling() {
       if (o.scrollTop % lh != 0 && o.scrollTop % (o.scrollHeight - oHeight - 1) != 0) {
           preTop = o.scrollTop
           o.scrollTop += 1
           if (preTop >= o.scrollHeight || preTop == o.scrollTop) {
               o.scrollTop = 0
           }
       } else {
           clearInterval(t)
           setTimeout(start,delay)
       }
   }
   setTimeout(start,delay)
}

$(document).ready(function() {
    appMaster.smoothScroll()

    appMaster.reviewsCarousel()

    appMaster.screensCarousel()

    appMaster.animateScript()

    appMaster.revSlider()

    appMaster.scrollMenu()

    appMaster.placeHold()
    appMaster.scroll()
    // appMaster.part3settimeout();
//    autoSwitch();
var autoscorll = setInterval(function() {
    var next = $('#part3 .part3-background').next()
    if (next.length == 0) {
        next = $('#part3 li:first')
    }
    switchContent.call(next)
}, 2000)
 $("#part3 li").click(function() {
    window.clearInterval(autoscorll)
 })

    startmarquee(100,0,1000)
    $("#part3 li").click(function () {
        switchContent.call(this)
    })

   $("#about #parttop li ").hover(function() {
       var index = $(this).index()
       if (index == 1) {
        $(this).find('.boxT ').removeClass('bgtop')
       } else {
        $(this).find('.boxT ').addClass('bgtop')
       }
   },function() {
       $(this).find('.boxT ').removeClass('bgtop')
       $("#parttop li:eq(1)").find('.boxT').addClass('bgtop')
   })
   $("#about #partup li ").hover(function() {
    var index = $(this).index()
       if (index == 1) {
        $(this).find('.boxT ').addClass('bgup')
       } else {
        $(this).find('.boxT ').removeClass('bgup')
       }
},function() {
    $(this).find('.boxT ').addClass('bgup')
    $("#partup li:eq(1)").find('.boxT').removeClass('bgup')
})
// $(".navbar-nav>li>a").hover(function() {
//     $(this).find('.select').addClass('selecthover').removeClass("select")
// },function() {
//     $(this).find('.selecthover ').removeClass('selecthover').addClass('select')
// })
// $(".sub-nav li a").hover(function() {
//    $(this).find('p span').css('color','#409fff')
//     $(this).find('p').css('color','#409fff')
// },function() {
//      $(this).find('p span').css('color','#303133')
//     $(this).find('p').css('color','#979899')
// })
    // $(".smallnav ul li .nav1-icon").hover(function() {
    //     $(this).children().css('color','#409fff')
    // }, function() {
    //     $(this).children().css('color','#979899')
    // })
   // 头部下拉
      //  $('.navbar-nav li').hover(function() {
      // $(this).children('.sub-nav').stop().slideDown()
      // // $(this).children('.sub-nav').stop().slideDown();
      //  },function() {
      //      $(this).children('.sub-nav').stop().slideUp()
      //  // $(this).children('.sub-nav').stop().slideUp();
      //  })
//        $("#select ul li a").hover(function() {
//            $(this).css('color','#409fff');
//        }, function() {
//            $(this).css('color','#979899');
//        })

      //  $(".fix-Side ul li").hover(function() {
      //     $(this).addClass('hover')
      //       $(this).css('background','#409fff')
      //   }, function() {
      //       $(this).css('background','#177ee5')
      //      $(this).removeClass('hover')
      //   })
      //  $('.fix-Side ul li:last').click(function() {
      //        $('html , body').animate({scrollTop: 0},'slow')
      // })
})
