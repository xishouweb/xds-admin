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
        var docHeight = $(window).height()

        var mainSlider = $('.tp-banner').revolution({
            delay: 9000,
            startwidth: 1170,
            startheight: 850,
            hideThumbs: 10,
            touchenabled: false,
            fullWidth: "off",
            hideTimerBar: "on",
            fullScreen: "on",
            onHoverStop: "off",
            fullScreenOffsetContainer: ""
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
    // 头部下拉
      $('.navbar-nav li').hover(function() {
        $(this).children('.sub-nav').stop().slideDown()
      },function() {
        $(this).children('.sub-nav').stop().slideUp()
      })
      $('.navbar-nav .account').on('click',function(e) {
        e.stopPropagation()
        $(this).children('.sub-nav').stop().slideDown()
      })

      $('body').on('click',function() {
        $('.navbar-nav .account').children('.sub-nav').stop().slideUp()
      })
//    $("#select ul li a").hover(function() {
//        $(this).css('color','#409fff');
//    }, function() {
//        $(this).css('color','#979899');
//    })
//    $('body').click(function(){
//            $("#select").empty().fadeOut().hide();
//    })
      $("#logOut").click(function() {
        API.logOut()
      })
})
