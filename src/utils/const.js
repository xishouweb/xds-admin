export default {
  tencentRules: {
    appAccountId: 'appAccountId',
    lockInStatus: 'lockInStatus',
    headImg: 'headImg',
    principalName: 'principalName',
    status: 'status'
  },
  msgBodyTypeTransfrom: {
    1: 'TEXT',
    2: 'IMAGE',
    3: 'VOICE',
    4: 'VIDEO',
    5: 'TEXT',
    6: 'NEWS',
    7: 'MPNEWS',
    8: 'LINK',
    9: 'TEMPLATE',
    50: 'EVENT'
  },
  messageCodeAndKey: {
    1: {
      type: 'SYS_MSG_NOTICE',
      name: '平台系统通知'
    },
    2: {
      type: 'SYS_MSG_CONVR_START',
      name: '客服对话开始通知'
    },
    3: {
      type: 'SYS_MSG_CONVR_END',
      name: '客服对话结束通知'
    },
    4: {
      type: 'WX_ERROR_MSG',
      name: '微信异常消息类型'
    },
    50: {
      type: 'SYS_MSG_TEAM_ON',
      name: '参与协作通知'
    },
    51: {
      type: 'SYS_MSG_FANS_OFF',
      name: '粉丝取消关注后聊天关闭通知'
    },
    52: {
      type: 'SYS_MSG_SEAT_OFF',
      name: '粉丝与坐席关系取消聊天关闭通知'
    },
    100: {
      type: 'WX_KF_MSG',
      name: '微信客服消息'
    },
    150: {
      type: 'WX_EVENT_SUBSCRIBE',
      name: '关注事件消息'
    },
    285: {
      type: 'SEAT_EVENT_UPDATE_FANS_SEAT',
      name: '客服设置所属事件'
    },
    180: {
      type: 'WX_EVEN_LOCATION',
      name: '微信客服事件消息-地理位置'
    },
    152: {
      type: 'WX_EVEN_CLICK',
      name: '微信客服事件消息-点击菜单拉取消息时的事件推送'
    },
    153: {
      type: 'WX_EVEN_VIEW',
      name: '微信客服事件消息-点击菜单跳转链接时的事件推送'
    },
    159: {
      type: 'WX_EVENT_CHANNEL_QR_CODE_SCAN',
      name: '扫码二维码-渠道二维码已关注事件'
    },
    160: {
      type: 'WX_EVENT_CHANNEL_QR_CODE_SUBSCRIBE',
      name: '扫码二维码-渠道二维码关注事件'
    },
    161: {
      type: 'WX_EVENT_FANS_POSTER_SUBSCRIBE',
      name: '扫码二维码-裂变海报关注事件'
    },
    154: {
      type: 'WX_EVENT_AUTOREPLY',
      name: '自动回复'
    },
    162: {
      type: 'WX_EVENT_FANS_POSTER_SCAN',
      name: '扫码二维码-裂变海报已关注事件'
    },
    163: {
      type: 'WX_EVENT_SCAN_OTHER_QR',
      name: '扫码二维码-其它类型的扫码事件消息'
    },
    164: {
      type: 'WX_EVENT_SCAN_LOGIN',
      name: '扫码二维码-登陆平台事件消息'
    },
    280: {
      type: 'WX_EVENT_SCRAMBLE_SUCCESS',
      name: '客服抢单成功事件'
    },
    281: {
      type: 'WX_EVENT_DELETE_ASSIS_SEAT',
      name: '客服关闭协作客服事件'
    },
    179: {
      type: 'WX_EVENT_OTHER_SUBSCRIBE',
      name: '扫码二维码-其它类型的扫码关注事件消息'
    },
    199: {
      type: 'WX_EVENT_UN_SUBSCRIBE',
      name: '取消关注事件消息'
    },
    200: {
      type: 'KF_MASS_MSG',
      name: '客服群发消息'
    },
    201: {
      type: 'KF_MASS_WX_KF_MSG',
      name: '客服群发微信消息'
    },
    202: {
      type: 'KF_MASS_WX_TEMPLATE_MSG',
      name: '客服群发微信模板'
    },
    203: {
      type: 'KF_MASS_WX_PREVIEW_MSG',
      name: '客服群发微信预览'
    },
    250: {
      type: 'SEAT_KF_MSG',
      name: '坐席客服消息'
    },
    251: {
      type: 'SEAT_WECHAT_KF_MSG',
      name: '坐席微信客服消息'
    },
    252: {
      type: 'SEAT_WECHAT_MASS_PREVIEW_MSG',
      name: '坐席微信群发预览消息'
    },
    282: {
      type: 'SEAT_EVENT_FS_MOBILE_PACKET',
      name: '客服移动分组'
    },
    283: {
      type: 'SEAT_EVENT_SET_FANS_TAG',
      name: '设置粉丝标签'
    },
    300: {
      type: 'SYS_MSG_REQ_TEAM_ON',
      name: '请求协作'
    },
    301: {
      type: 'INTELLIGENT_RECEPTION_SYSTEM_MESSAGE',
      name: '智能接待系统消息'
    },
    284: {
      type: 'SEAT_EVENT_REQ_TEAM_ON',
      name: '请求协作'
    },
    302: {
      type: 'SYS_EVENT_AUTOREPLY',
      name: '自动回复'
    },
    182: {
      type: 'WX_EVENT_JUMP_URL',
      name: '点击菜单跳转链接事件消息'
    },
    181: {
      type: 'WX_EVENT_JUMP_MINPROGRAM',
      name: '点击菜单跳转小程序事件消息'
    }
  }
}
