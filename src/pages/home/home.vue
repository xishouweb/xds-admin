<template>
  <div id="home" ref="home">
    <common-banner></common-banner>
    <div id="platform" ref="platform" class="home-wrapper">
      <div class="platform-wrapper wrapper-item">
        <div class="float-left part1">
          <div class="p1">销大师—企业级微信CRM平台</div>
          <div class="p2">社交化流量时代助力新销售</div>
          <div class="bottom">
            <div class="p3">销大师是一款为企业提供营销价值的公众号运营服务系统。</div>
            <div class="p4">
              旨在帮助解决企业销售难、沟通难、营销难等问题，帮助企业在移动社交时代下创造私域流量，降低企业沟通成本，拓宽企业营销渠道，更大的挖掘用户价值。提供智能客服系统，互动营销，CRM整合分析等应用工具。
            </div>
          </div>
        </div>
        <div class="float-left part2">
          <img src="@/assets/images/home/rect.png" alt="">
        </div>
      </div>
    </div>
    <div id="product" ref="product" class="home-wrapper">
      <div class="product-wrapper wrapper-item">
        <div class="title1">产品介绍</div>
        <div class="title2">Product Introduction</div>
        <div class="content">
          <div class="float-left">
            <div class="img">
              <img src="@/assets/images/home/tongji.png" alt="">
            </div>
            <div class="p1">微信CRM系统</div>
            <div class="p2">数据资产管理工具</div>
            <div class="line"></div>
            <div class="p3">
              强大的粉丝画像及管理功能，多维度智能标签化， 从数据追踪和分析工具入手，帮助品牌提升营销效率，挖掘更多有价值的销售信息。
            </div>
          </div>
          <div class="float-left">
            <div class="img">
              <img src="@/assets/images/home/server.png" alt="">
            </div>
            <div class="p1">智能客服系统</div>
              <div class="p2">一对多的沟通服务</div>
              <div class="line"></div>
              <div class="p3">
                多公众号接入，多用户咨询，多客服协作，多种沟通方式，让客服智能，让沟通简单，筛选出的用户推送精准的信息，内容更准确，营销更高效，真正做到精细化运营。
              </div>
          </div>
          <div class="float-left">
            <div class="img">
              <img src="@/assets/images/home/erweima.png" alt="">
            </div>
            <div class="p1">百万渠道二维码</div>
            <div class="p2">精准监控粉丝来源</div>
            <div class="line"></div>
            <div class="p3">
              销大师可以根据企业不同的推广渠道生成不同二维码，当客户扫码后，即可统计渠道来源，哪个渠道有效、哪个性价比高，一清二楚，让企业广告投放更精准更有效。
            </div>
          </div>
        </div>
      </div>
    </div>
    <div id="service" ref="service" class="home-wrapper">
      <div class="service-wrapper wrapper-item">
        <div class="title1">服务优势</div>
        <div class="title2">安全、计算、监控、存储，你所需要的一切，我们均以领先的水平为你提供。</div>
        <div class="content">
          <div class="float-left">
            <div class="img">
              <img src="@/assets/images/home/1.png" alt="">
            </div>
            <div class="p1">消息必达</div>
            <div class="p2">保证消息安全收发，服务顺畅</div>
          </div>
          <div class="float-left">
            <div class="img">
              <img src="@/assets/images/home/2.png" alt="">
            </div>
            <div class="p1">客服工具</div>
            <div class="p2">客户咨询，即时处理</div>
          </div>
          <div class="float-left">
            <div class="img">
              <img src="@/assets/images/home/3.png" alt="">
            </div>
            <div class="p1">运营支持</div>
            <div class="p2">商学院模式教学，好学好用</div>
          </div>
          <div class="float-left">
            <div class="img">
              <img src="@/assets/images/home/4.png" alt="">
            </div>
            <div class="p1">双重保障</div>
            <div class="p2">安全与稳定性双重保障</div>
          </div>
        </div>
      </div>
    </div>
    <div id="contact" ref="contact" class="home-wrapper">
    </div>
  </div>
</template>

<script>
import CommonBanner from '@/layouts/CommonBanner'
import {mapGetters} from 'vuex'
export default {
  mounted() {
    this.$nextTick(() => {
      let num = this.$refs[this.anchor].offsetTop
      this.scrollAnchor(num)
    })
  },
  computed: {
    ...mapGetters({
      anchor: 'user/getAnchor'
    })
  },
  methods: {
    scrollAnchor(num) {
       document.documentElement.scrollTop = num
    }
  },
  watch: {
    anchor(val) {
      let num = this.$refs[val].offsetTop
      this.scrollAnchor(num)
    }
  },
  components: {
    CommonBanner
  }
}
</script>

<style lang="stylus">
@import './home'
#home
  .product
    width 100%
    img
      width 100%
</style>
