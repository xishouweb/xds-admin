<template>
  <!-- 公众号验证（多种情况统一验证） -->
  <div class="publicVerify" v-if="status">
    <noPublic v-if="status === 1"></noPublic>
    <noValidPublic v-else-if="status === 2"></noValidPublic>
    <notAvailable v-else-if="status === 3"></notAvailable>
    <noCertificate v-else-if="status === 4"></noCertificate>
    <noValidService v-else-if="status === 5" :text="text1"></noValidService>
    <unValidAccount v-else-if="status === 6" :title="text2[0]" :subTitle="text2[1]"></unValidAccount>
    <!-- 离开页面时的弹框提示 -->
    <exit-page-modal></exit-page-modal>
  </div>
</template>
<script>
  import { mapState } from 'vuex'
  export default {
    name: 'publicVerify',
    model: {
      prop: 'status',
      event: 'model'
    },
    props: {
      isService: { // 是否为只支持服务号的服务,默认false
        type: Boolean,
        default: false
      },
      status: { // 状态(与检测结果绑定),默认 0正常
        type: Number,
        default: 0
      },
      text1: { // 无可用服务号提示信息
        type: Array,
        default() {
          return ['', '当前企业暂无服务号，暂不支持该功能']
        }
      },
      text2: { // 当前公众号不是服务号提示信息
        type: Array,
        default() {
          return [
            "当前公众号为订阅号，无法设置渠道二维码",
            "渠道二维码功能只支持服务号，您可前往“公众号管理”添加服务号在设置"
          ]
        }
      }
    },
    data() {
      return {}
    },
    created() {
      if (this.verifyResult > 0 && this.$route.meta.leaveIntercept !== undefined) {
        this.$route.meta.leaveIntercept = false
      }
      this.$emit('model', this.verifyResult)
    },
    watch: {
      verifyResult(v) {
        if (v > 0 && this.$route.meta.leaveIntercept !== undefined) {
          this.$route.meta.leaveIntercept = false
        }
        this.$emit('model', v)
      }
    },
    components: {
      noPublic: () => import('./noPublic.vue'), // 未添加公众号，对应检测结果 1
      noValidPublic: () => import('./noValidPublic.vue'), // 无可用公众号，对应检测结果 2
      notAvailable: () => import('./notAvailable.vue'), // 当前公众号不可用，对应检测结果 3
      noCertificate: () => import('./noCertificate.vue'), // 当前公众号未认证，对应检测结果 4
      noValidService: () => import('./noValidService.vue'), // 无可用服务号，对应检测结果 5
      unValidAccount: () => import('./unValidAccount.vue'), // 当前公众号是订阅号，对应检测结果 6
    },
    computed: {
      ...mapState({
        publicList: state => state.publicAccount.publicAccountList, // 未筛选的公众号列表
        curPublic: state => state.publicAccount.curPublic, // 当前公众号
      }),
      verifyResult() { // 检测结果
        let result = 0
        if (!this.publicList || !this.publicList.length) {
          result = 1
        } else {
          // 已认证并且为启用状态，表示可用
          let usable = this.publicList.filter(v => v.status === 1 && v.verifyTypeInfo >= 0)
          if (!usable || !usable.length) {
            result = 2
          } else {
            if (this.curPublic.status !== 1) {
              result = 3
            } else {
              if (this.curPublic.verifyTypeInfo < 0) {
                result = 4
              } else {
                if (this.isService) { // 是否只支持服务号
                  // 过滤出服务号
                  let service = this.publicList.filter(v => v.serviceTypeInfo === 2)
                  //  && v.verifyTypeInfo >= 0 && v.status === 1
                  if (!service || !service.length) {
                    result = 5
                  } else {
                    result = (this.curPublic.serviceTypeInfo === 2) ? result : 6
                  }
                }
              }
            }
          }
        }
        return result
      }
    }
  }
</script>

<style lang="stylus">
  .publicVerify
    position: relative
    height 100%
    border-top: 1px solid transparent
    .publicCut-box
      position: absolute
      top: -14px
      left: 0
    .content-box
      min-height: 800px
      margin-top: 30px
      padding: 8px 20px 0
      background-color: #fff
</style>
