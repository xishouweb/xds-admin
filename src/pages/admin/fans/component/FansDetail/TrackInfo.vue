<template>
  <div class="track-info info-content" v-html="infoContent">
  </div>
</template>
<script>
import {filterContextMap} from '@/utils/util'
export default {
  name: 'trackInfo',
  props: {
    color: {
      type: String,
      default: '#409fff'
    },
    item: {
      type: [Object, Array]
    }
  },
  computed: {
    infoContent() {
      let contextMap = this.item.contextMap
      switch (this.item.msgType) {
        case 'SEAT_EVENT_UPDATE_FANS_SEAT':
          return `<span style="color: ${this.color}">【${contextMap.SEAT_UPDATE_FANS_ORIGINAL_KF_NAME || '-'}${contextMap.SEAT_UPDATE_FANS_ORIGINAL_KF_NO || '-'}】</span>将该所属粉丝转移给<span style="color: ${this.color}">【${contextMap.SEAT_UPDATE_FANS_TARGET_KF_NAME || ''}${contextMap.SEAT_UPDATE_FANS_TARGET_KF_NO || ''}】</span>`
        case 'WX_EVENT_JUMP_URL':
          return `粉丝点击菜单<span style="color: ${this.color}"><a style="font-size: 12px;" class="tiaozhuan" target="_blank" href="${filterContextMap(contextMap)}">【点击查看菜单跳转网址】</a></span>`
        case 'WX_EVENT_JUMP_MINPROGRAM':
          return `粉丝点击菜单<span style="color: ${this.color}">【小程序】</span>`
        case 'SYS_MSG_NOTICE':
          return `取消公众号`
        case 'SYS_MSG_CONVR_START':
          return `客服对话开始通知`
        case 'SYS_MSG_CONVR_END':
          return `客服对话结束通知`
        case 'WX_ERROR_MSG':
          return `微信异常消息类型`
        case 'SYS_MSG_TEAM_ON':
          return `参与协作通知`
        case 'SYS_MSG_FANS_OFF':
          return `取消关注后聊天关闭通知`
        case 'SYS_MSG_SEAT_OFF':
          return `与坐席关系取消聊天关闭通知`
        case 'WX_EVENT_UN_SUBSCRIBE':
          return `取消关注公众号`
        case 'WX_EVENT_SUBSCRIBE':
          return `通过<span style="color: ${this.color}">【${this.filterSubscribe(contextMap)}】</span>关注公众号`
        case 'WX_EVENT_OTHER_SUBSCRIBE':
          return `其他类型扫码关注公众号`
        case 'WX_EVENT_FANS_POSTER_SUBSCRIBE':
          return `粉丝扫描裂变海报<span style="color: ${this.color}">【${filterContextMap(contextMap)}】</span>关注公众号`
        case 'WX_EVENT_CHANNEL_QR_CODE_SUBSCRIBE':
          return `扫描渠道二维码<span style="color: ${this.color}">【${contextMap.QR_CODE_CHANNEL}】</span>关注公众号`
        case 'WX_EVEN_LOCATION':
          return `获取粉丝地理位置<span style="color: ${this.color}" class="info-key">【<span class="no_wrap">${this.detailName}</span><a style="font-size: 12px;" class="tiaozhuan" target="_blank" href="https://apis.map.qq.com/uri/v1/marker?marker=coord:${contextMap.EVENT_LOCATION_LATITUDE},${contextMap.EVENT_LOCATION_LONGITUDE};title:${this.simpleName};addr:${this.detailName}&referer=LM5BZ-HMNWP-QJEDT-VJIRJ-RQ2ST-ZVB5Q">点击查看</a>】</span>`
        case 'WX_EVEN_CLICK':
          return `点击菜单<span style="color: ${this.color}">【${filterContextMap(contextMap)}】</span>拉取`
        case 'WX_EVEN_VIEW':
          return `点击菜单<span style="color: ${this.color}">【${filterContextMap(contextMap)}】</span>跳转链接`
        case 'WX_EVENT_FANS_POSTER_SCAN':
          return `扫描裂变海报<span style="color: ${this.color}">【${filterContextMap(contextMap)}】</span>`
        case 'WX_EVENT_CHANNEL_QR_CODE_SCAN':
          return `扫描渠道二维码<span style="color: ${this.color}">【${contextMap.QR_CODE_CHANNEL}】</span>`
        case 'SYS_EVENT_AUTOREPLY':
          return `系统自动回复内容`
        case 'WX_EVENT_SCRAMBLE_SUCCESS':
          return `客服<span style="color: ${this.color}">【${contextMap.SEAT_SCRAMBLE_ORDER_SEAT_NAME}${contextMap.SEAT_SCRAMBLE_ORDER_SEAT_ID}】</span>抢单成功`
        case 'WX_EVENT_DELETE_ASSIS_SEAT':
          return `客服<span>【${contextMap.CONVR_CLOSE_SEAT_NAME}】</span>关闭<span>【${contextMap.CONVR_CLOSE_ASSIS_SEAT_NAME}】</span>协作客服`
        case 'SEAT_EVENT_REQ_TEAM_ON':
          return `<span>【${contextMap.REQUEST_KF_NAME}${contextMap.REQUEST_SEAT_NO}】</span>请求<span>【${contextMap.COOPERATION_KF_NAME}${contextMap.COOPERATION_SEAT_NO}】</span>协作。<span style="display:${!contextMap.REQUEST_COOPERATION_REASON ? 'none' : 'inline'}">协作原因: ${contextMap.REQUEST_COOPERATION_REASON}</span>`
        case 'SEAT_EVENT_FS_MOBILE_PACKET':
          return `客服将粉丝从<span style="color: ${this.color}">${contextMap.FANS_OLD_GROUP_NAME}</span>移动到<span style="color: ${this.color}">${contextMap.FANS_NEW_GROUP_NAME}</span>`
        case 'SEAT_EVENT_SET_FANS_TAG':
          return `<span>${filterContextMap(contextMap)}</span>`
        case "INTELLIGENT_RECEPTION_SYSTEM_MESSAGE":
          if (contextMap.INTELLIGENT_RECEPTION_START_DATE) {
            return `智能接待开始`
          } else {
            return `智能接待结束`
          }
        case "WX_EVENT_SCAN_OTHER_QR":
          return `粉丝扫描【${contextMap.QR_CODE_OTHER}】`
        case "WX_EVENT_SCAN_LOGIN":
          return `粉丝通过扫描【${contextMap.EVENT_SCAN_LOGIN_QR_CODE}】二维码登陆`
        default:
          return ''
      }
    }
  },
  methods: {
    filterSubscribe(obj) {
      for (let k in obj) {
        switch (k) {
          case 'ADD_SCENE_SEARCH':
            return '搜索公众号'
          case 'ADD_SCENE_ACCOUNT_MIGRATION':
            return '公众号迁移'
          case 'ADD_SCENE_PROFILE_CARD':
            return '名片分享'
          case 'ADD_SCENE_QR_CODE':
            return '扫描二维码'
          case 'ADD_SCENE_PROFILE_LINK':
            return '图文页内名称点击'
          case 'ADD_SCENE_PROFILE_ITEM':
            return '图文页右上角菜单'
          case 'ADD_SCENE_PAID':
            return '支付后关注'
          case 'ADD_SCENE_OTHERS':
            return '其他'
          default:
            return '--'
        }
      }
    }
  }
}
</script>
<style lang="stylus">
.track-info
  &.info-content
    display inline-block
    width 100%
    overflow hidden
    text-overflow ellipsis
    white-space nowrap
</style>

