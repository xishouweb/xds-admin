export default {
  data() {
    return {
      list: [ // 数据列表
        {
          key: 'XDS_CORP_SESSION_MSG',
          value: '',
          json: {
            name: '会话消息',
            desc: '开启后，分配粉丝给客服，同时分配消息给客服。'
          }
        },
        {
          key: 'XDS_CORP_CONDITIONAL_SEAT',
          value: '',
          json: {
            name: '个性化坐席',
            desc: '开启后，客服人员可设置自己的坐席昵称和头像。'
          }
        },
        {
          key: 'XDS_CORP_VISIT_NOT_SPEAK',
          value: '',
          json: {
            name: '来访未发言',
            desc: '开启后，客服人员可接待跟公众号产生互动事件的粉丝，互动包含扫码、点击菜单、获取地理位置等互动行为。关闭后，粉丝给公众号发消息仍可收到，但不接收粉丝互动事件。'
          }
        },
        {
          key: 'XDS_CORP_DISTRIBUTION_TIMEOUT',
          value: '',
          setEdit: false,
          json: {
            name: '抢单池超时时间',
            desc: '超时后，则粉丝不显示在抢单池中。',
          }
        },
        {
          value: '',
          setEdit: false,
          json: {
            name: '粉丝超时未回复',
            desc: '开启后，在设置的时间内客户没有新消息产生，系统将自动关闭会话，客户再发消息会触发重新分配。',
          },
          items: [
            {
              key: 'XDS_CORP_FANS_NOT_RESPONSE_SWITCH',
              value: '',
              json: {
                name: '超时时间'
              }
            },
            {
              key: 'XDS_CORP_FANS_NOT_RESPONSE_TIME',
              value: '',
              setEdit: false
            },
            {
              key: 'XDS_CORP_FANS_NOT_RESPONSE_CONTENT_SWITCH',
              value: '',
              json: {
                name: '回复内容'
              }
            },
            {
              key: 'XDS_CORP_FANS_NOT_RESPONSE_CONTENT',
              value: '您好，我们长时间没有收到您的回复，稍后将自动结束本次对话。如果还需帮助，欢迎随时联系我们。',
              setEdit: false
            }
          ]
        },
        {
          value: '',
          json: {
            name: '客服超时未回复',
            desc: '开启后，在设置的时间内客服没有回复客户，自动回复除外，系统将自动关闭会话，客户再发消息会触发重新分配。',
          },
          items: [
            {
              key: 'XDS_CORP_KEFU_NOT_RESPONSE_SWITCH',
              value: '',
              json: {
                name: '超时时间'
              }
            },
            {
              key: 'XDS_CORP_KEFU_NOT_RESPONSE_TIME',
              value: '',
              setEdit: false
            },
            {
              key: 'XDS_CORP_KEFU_NOT_RESPONSE_CONTENT_SWITCH',
              value: '',
              json: {
                name: '回复内容'
              }
            },
            {
              key: 'XDS_CORP_KEFU_NOT_RESPONSE_CONTENT',
              value: '您好，我们长时间没有收到您的回复，稍后将自动结束本次对话。如果还需帮助，欢迎随时联系我们。',
              setEdit: false
            }
          ]
        },
        {
          json: {
            name: '客服接待粉丝量',
          },
          items: [
            {
              key: 'XDS_CORP_IS_CHAT_FANS_NUM',
              value: '',
              setEdit: false,
              json: {
                name: '正在会话中',
                desc: '客服的正在会话列表中粉丝的最大接待量，当达到最大数量后如果再有粉丝产生会话消息或互动，则会把客服的正在会话列表中粉丝会话或互动时间最先的粉丝会话关闭。'
              }
            },
          ]
        }
      ],
    }
  }
}
