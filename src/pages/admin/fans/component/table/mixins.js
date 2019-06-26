// 场景常量
const subscribeScene = {
  ADD_SCENE_SEARCH: '搜索公众号',
  ADD_SCENE_ACCOUNT_MIGRATION: '公众号迁移',
  ADD_SCENE_PROFILE_CARD: '名片分享',
  ADD_SCENE_QR_CODE: '扫描二维码',
  ADD_SCENE_PROFILE_LINK: '图文页内名称点击',
  ADD_SCENE_PROFILE_ITEM: '图文页右上角菜单',
  ADD_SCENE_PAID: '支付后关注',
  ADD_SCENE_OTHERS: '其他',
  ADD_SCENE_UNKNOWN_CHANNEL_QR_CODE: '未知渠道二维码',
  ADD_SCENE_UNKNOWN_FANS_POSTER: '未知裂变海报'
}
// 性别常量
const SEX = {
  0: '未知',
  1: '男',
  2: '女'
}

const defaultFields = [
  {
    type: 'selection',
    width: 60,
    align: 'center',
    isSelected: true,
    fixed: 'left'
  },
  {
    title: '粉丝昵称/姓名',
    key: 'nickName',
    fixed: 'left',
    isDisabeld: true, // 是否禁用可选
    isSelected: true, // 禁用及选择状态
    minWidth: 200,
    render: (h, params) => {
      let headImgUrl = params.row.headImgUrl
      let nickName = params.row.nickName
      let name = params.row.name
      return (
        <div class='basicInfo'>
          <img src={headImgUrl} />
          <div class='right'>
            <p class='nickName'>{nickName}</p>
            <p class='name'>{name || '--'}</p>
          </div>
        </div>
      )
    }
  },
  {
    title: '公众号/来源',
    key: 'subscribeScene',
    fixed: 'left',
    width: 140,
    isDisabeld: true, // 是否禁用可选
    isSelected: true,
    render: (h, params) => {
      let publicAccount = params.row.wxPublicAccountName
      let specificSourceName = params.row.specificSourceName
      let source = params.row.subscribeScene
      return (
        <div class='wrap'>
          <p class='txt1'>{publicAccount || '--'}</p>
          <p
            class='txt2'
            title={specificSourceName || subscribeScene[source] || '--'}
          >
            {specificSourceName || subscribeScene[source] || '--'}
          </p>
        </div>
      )
    }
  },
  {
    title: '联系电话',
    key: 'phone',
    isSelected: true,
    minWidth: 150,
    render: (h, params) => {
      let phone = params.row.phone
      return (
        <div class='wrap'>
          <p class='txt1'>{phone || '--'}</p>
        </div>
      )
    }
  },
  {
    title: '所属客服',
    key: 'kfSeatId',
    minWidth: 160,
    isSelected: true,
    render: (h, params) => {
      let eeName = params.row.eeName
      let seatNo = params.row.seatNo
      const node = seatNo ? (
        <p class='txt1'>
          {eeName || '--'} ({seatNo})
        </p>
      ) : (
        <p class='txt1'>--</p>
      )
      return <div class='wrap'>{node}</div>
    }
  },
  {
    title: '关注状态',
    key: 'subscribe',
    minWidth: 120,
    isSelected: true,
    render: (h, params) => {
      let subscribe = params.row.subscribe
      return (
        <div class='wrap'>
          <p class='txt1'>{subscribe ? '已关注' : '已取消'}</p>
        </div>
      )
    }
  },
  {
    title: '互动数',
    key: 'conversationNum',
    sortable: true,
    minWidth: 150,
    isSelected: true,
    render: (h, params) => {
      let conversationNum = params.row.conversationNum
      let messageNum = params.row.messageNum
      return (
        <div class='wrap'>
          <p class='txt1'>
            粉丝来访：
            {conversationNum || 0}
          </p>
          <p class='txt1'>
            粉丝消息：
            {messageNum || 0}
          </p>
        </div>
      )
    }
  },
  {
    title: '标签',
    key: 'fansWxTagDtos',
    width: 300, // 必须有
    isSelected: true,
    render: (h, params) => {
      const fansTags = params.row.fansWxTagDtos
      return h('Tags', {
        props: {
          rows: 1,
          tags: fansTags || []
        }
      })
    }
  },
  {
    title: '最后互动时间',
    key: 'conversationActiveTime',
    width: 200,
    isSelected: true,
    sortable: true,
    render: (h, params) => {
      let conversationActiveTime = params.row.conversationActiveTime
      return (
        <div class='wrap'>
          <p class='txt1'>{conversationActiveTime || '--'}</p>
        </div>
      )
    }
  },
  {
    title: '性别',
    key: 'sex',
    isSelected: false,
    minWidth: 150,
    render: (h, params) => {
      let sex = params.row.sex
      return (
        <div class='wrap'>
          <p class='txt1'>{SEX[sex]}</p>
        </div>
      )
    }
  },
  {
    title: '年龄',
    key: 'age',
    isSelected: false,
    minWidth: 150,
    render: (h, params) => {
      let age = params.row.age
      return (
        <div class='wrap'>
          <p class='txt1'>{age || '--'}</p>
        </div>
      )
    }
  },
  {
    title: '地区',
    key: 'kfSetArea',
    isSelected: false,
    minWidth: 150,
    render: (h, params) => {
      let area =
        params.row.kfSetArea ||
        params.row.wxSetArea
      area = area ? area.replace(/,/g, '') : area
      return (
        <div class='wrap'>
          <p class='txt1'>{area || '--'}</p>
        </div>
      )
    }
  },
  {
    title: '微信号',
    key: 'weChat',
    isSelected: false,
    minWidth: 150,
    render: (h, params) => {
      let weChat = params.row.weChat
      return (
        <div class='wrap'>
          <p class='txt1'>{weChat || '--'}</p>
        </div>
      )
    }
  },
  {
    title: 'QQ',
    key: 'qq',
    isSelected: false,
    minWidth: 150,
    render: (h, params) => {
      let qq = params.row.qq
      return (
        <div class='wrap'>
          <p class='txt1'>{qq || '--'}</p>
        </div>
      )
    }
  }
]

export default {
  data() {
    const selectedFields = defaultFields.filter(item => item.isSelected) // 可选择被选中的
    const seletedFieldKeys = selectedFields.map(item => item.key) //
    return {
      selectedFields: seletedFieldKeys,
      selectedColumns: [
        ...defaultFields,
        {
          title: '操作',
          key: 'action',
          fixed: 'right',
          width: 140,
          isDisabeld: true,
          isSelected: true, // 禁用及选择状态
          render: (h, params) => {
            let subscribe = params.row.subscribe
            if (!subscribe) {
              return h('div', [
                h(
                  'Button',
                  {
                    props: { size: 'small', type: 'primary' },
                    style: { width: '50px', marginRight: '10px' },
                    on: {
                      click: () => {
                        this.showFan(params.row)
                      }
                    }
                  },
                  '详细'
                ),
                h(
                  'Button',
                  {
                    props: { size: 'small' },
                    on: {
                      click: () => {
                        this.deleteFan(params.row)
                      }
                    }
                  },
                  '删除'
                )
              ])
            } else {
              return h('div', [
                h(
                  'Button',
                  {
                    props: { size: 'small', type: 'primary' },
                    style: { width: '50px', marginRight: '10px' },
                    on: {
                      click: () => {
                        this.showFan(params.row)
                      }
                    }
                  },
                  '详细'
                )
              ])
            }
          }
        }
      ],
      columns: [
        ...selectedFields,
        {
          title: '操作',
          key: 'action',
          fixed: 'right',
          width: 140,
          isDisabeld: true,
          isSelected: true,
          render: (h, params) => {
            let subscribe = params.row.subscribe
            if (!subscribe) {
              return h('div', [
                h(
                  'Button',
                  {
                    props: { size: 'small', type: 'primary' },
                    style: { width: '50px', marginRight: '10px' },
                    on: {
                      click: () => {
                        this.showFan(params.row)
                      }
                    }
                  },
                  '详细'
                ),
                h(
                  'Button',
                  {
                    props: { size: 'small' },
                    on: {
                      click: () => {
                        this.deleteFan(params.row)
                      }
                    }
                  },
                  '删除'
                )
              ])
            } else {
              return h('div', [
                h(
                  'Button',
                  {
                    props: { size: 'small', type: 'primary' },
                    style: { width: '50px', marginRight: '10px' },
                    on: {
                      click: () => {
                        this.showFan(params.row)
                      }
                    }
                  },
                  '详细'
                )
              ])
            }
          }
        }
      ], // 表格默认
      action: {
        title: '操作',
        key: 'action',
        fixed: 'right',
        width: 140,
        isDisabeld: true,
        isSelected: true,
        render: (h, params) => {
          let subscribe = params.row.subscribe
          if (!subscribe) {
            return h('div', [
              h(
                'Button',
                {
                  props: { size: 'small', type: 'primary' },
                  style: { width: '50px', marginRight: '10px' },
                  on: {
                    click: () => {
                      this.showFan(params.row)
                    }
                  }
                },
                '详细'
              ),
              h(
                'Button',
                {
                  props: { size: 'small' },
                  on: {
                    click: () => {
                      this.deleteFan(params.row)
                    }
                  }
                },
                '删除'
              )
            ])
          } else {
            return h('div', [
              h(
                'Button',
                {
                  props: { size: 'small', type: 'primary' },
                  style: { width: '50px', marginRight: '10px' },
                  on: {
                    click: () => {
                      this.showFan(params.row)
                    }
                  }
                },
                '详细'
              )
            ])
          }
        }
      }
    }
  },
  watch: {
    selectedFields: {
      handler(val) {
        const selectedFields = defaultFields.filter(item => {
          return this.selectedFields.includes(item.key)
        })
        this.columns = [...selectedFields, this.action]
      },
      deep: true
    }
  }
}
