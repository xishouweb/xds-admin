export default {
  titleName: '企业管理',
  titleBtnName: '添加',
  handleAlltypes: ['批量删除', '批量禁用'],
  actionItems: {
    'show': '详情',
    'cancelTop': '取消置顶',
    'modify': '修改',
    'setTop': '置顶',
    'unbind': '解绑',
    'stop': '停用',
    'start': '启用',
    'delete': '删除'
  },
  action(that) {
    const fn = that.handle
    let self = this
    return {
      title: '操作',
      key: 'action',
      minWidth: 60,
      align: 'center',
      render: (h, params) => {
        let actions = {
          show: function () {
            return h('div', {
              class: 'action-item',
              on: {
                click: (e) => {
                  document.documentElement.click()
                  window.event ? window.event.cancelBubble = true : e.stopPropagation()
                  fn('show', params.row.eeId)
                }
              }
            }, self.actionItems.show)
          },
          cancelTop: function () {
            return h('div', {
              class: 'action-item',
              on: {
                click: (e) => {
                  // window.event ? window.event.cancelBubble = true : e.stopPropagation()
                  fn('cancelTop', params.row.eeId)
                  document.documentElement.click()
                }
              }
            }, self.actionItems.cancelTop)
          },
          modify: function (e) {
            return h('div', {
              class: 'action-item',
              on: {
                click: () => {
                  // window.event ? window.event.cancelBubble = true : e.stopPropagation()
                  fn('modify', params.row.eeId, 0)
                  document.documentElement.click()
                }
              }
            }, self.actionItems.modify)
          },
          setTop() {
            return h('div', {
              class: 'action-item',
              on: {
                click: () => {
                  fn('setTop', params.row.eeId)
                  document.documentElement.click()
                }
              }
            }, self.actionItems.setTop)
          },
          unbind() {
            return h('div', {
              class: 'action-item',
              on: {
                click: () => {
                  fn('unbind', params.row.eeId)
                  document.documentElement.click()
                }
              }
            }, self.actionItems.unbind)
          },
          stop() {
            return h('div', {
              class: 'action-item',
              on: {
                click: () => {
                  fn('stop', params.row.eeId)
                  document.documentElement.click()
                }
              }
            }, self.actionItems.stop)
          },
          start() {
            return h('div', {
              class: 'action-item',
              on: {
                click: () => {
                  fn('start', params.row.eeId)
                  document.documentElement.click()
                }
              }
            }, self.actionItems.start)
          },
          delete: function () {
            return h('div', {
              class: 'action-item',
              on: {
                click: () => {
                  fn('delete', params.row.eeId)
                  document.documentElement.click()
                }
              }
            }, self.actionItems.delete)
          }
        }
        let actionFnArr = function () {
          let arr = []
          let param = params.row
          let keysArr = []
          if (param.status === 3) {
            keysArr = ['show', 'modify', 'stop', 'delete']
          }
          if (param.status === 1) {
            keysArr = ['show', 'modify', 'stop', 'delete', 'unbind', 'delete']
          }
          if (param.status === 2) {
            keysArr = ['show', 'modify', 'start', 'delete']
          }
          if (param.status === 5) {
            keysArr = ['show', 'modify', 'stop', 'delete']
          }
          if (param.topval > -1) {
            keysArr.push('cancelTop')
          } else {
            keysArr.push('setTop')
          }
          if (param.joinStatus === 1) {
            keysArr.push('unbind')
          }
          for (let key of Object.keys(self.actionItems)) {
            if (keysArr.includes(key)) {
              arr.push(actions[key]())
            }
          }
          return arr
        }
        return h('div',
          {
            on: {
              click (e) {
                e.stopPropagation()
              }
            }
          },
          [
            h('Poptip', {
              props: {
                value: params.row.showPop,
                trigger: "click",
                'popper-class': 'action',
                placement: 'left-start',
                transfer: true
              }
            }, [
              h('div', {
                class: 'cursor'
              }, [
                  h('Icon', {
                    on: {
                      click () {
                        that.closePoptip(params.index)
                      }
                    },
                    class: 'process_btn',
                    attrs: {
                      type: "ios-more"
                    }
                  })
                ]),
              h('div', {
                slot: "content"
              }, actionFnArr())
            ])
          ]
        )
      }
    }
  },
  addInput: [
    {
      name: 'name',
      title: '员工姓名',
      val: ''
    },
    {
      name: 'phone',
      title: '手机号码',
      val: ''
    },
    {
      name: 'gender',
      title: '性别',
      val: '1'
    },
    {
      name: 'duty',
      title: '职务',
      val: ''
    },
    {
      name: 'zuoxi',
      title: '坐席',
      val: ''
    },
    {
      name: 'zuoxiCode',
      title: '坐席编号',
      val: ''
    },
    {
      name: 'zuoxiTip',
      title: '坐席备注',
      val: ''
    }
  ],
  columns(fn) {
    return [{
      // fixed: 'left',
      type: 'selection',
      width: 50,
      align: 'center'
    },
    {
      title: '姓名',
      key: 'name',
      minWidth: 70
    },
    {
      title: '手机号',
      key: 'mobile',
      minWidth: 110
    },
    {
      title: '部门',
      key: 'apartment',
      minWidth: 120,
      render: (h, params) => {
        let data = params.row.apartment
        return h('span',
        {
          class: "text_over",
          domProps: {
            title: data,
          },
          style: {display: "block"},
        }, data)
      }
    },
    {
      title: '职务',
      key: 'duty',
      minWidth: 100
    },
    {
      title: '分配坐席',
      key: 'seatStatus',
      minWidth: 70,
      render: (h, params) => {
        let data = params.row.seatStatus
        switch (data) {
          case 0:
            return h('div', {}, [
              h('span', '未分配')
            ])
          case 1:
            return h('span', '已分配')
          default:
            return h('span', data)
        }
      }
    },
    {
      title: '员工状态',
      key: 'status',
      minWidth: 120,
      render: (h, params) => {
        let data = params.row.status
        switch (data) {
          case 3:
            return h('div', {}, [
              h('span', {class: 'mr10'}, '未加入'),
              h('span', {
                class: 'cursor like_a',
                on: {
                  click: (e) => {
                    window.event ? window.event.cancelBubble = true : e.stopPropagation()
                    fn('askFor', params.row.eeId)
                  }
                }
              }, '邀请')
            ])
          case 1:
            return h('span', '正常')
          case 5:
            return h('div', {}, [
              h('span', {class: 'mr10'}, '已退出'),
              h('span', {
                class: 'cursor like_a',
                on: {
                  click: (e) => {
                    window.event ? window.event.cancelBubble = true : e.stopPropagation()
                    fn('askFor', params.row.eeId)
                  }
                }
              }, '邀请')
            ])
          case 2:
            return h('span', '停用')
          default:
            break
        }
      }
    },
    {
      title: '员工微信',
      key: 'accountNickName',
      minWidth: 130,
      render: (h, params) => {
        let data = params.row
        switch (data.joinStatus) {
          case 0:
            return h('span', '--')
          case 1:
            let arr = []
            if (data.picUrl) {
              arr = [
                h('img', {
                  class: 'img_portrait',
                  attrs: {src: data.picUrl},
                }),
                h('span', {class: 'wechat_name'}, data.accountNickName)
              ]
            } else {
              arr = [
                h('span', {class: 'wechat_name'}, data.accountNickName)
              ]
            }
            return h('div', arr)
          default:
            return h('span', '--')
        }
      }
    },
    {
      title: '加入时间',
      key: 'addTime',
      show: false,
      minWidth: 120
    },
    {
      title: '添加时间',
      key: 'createTime',
      show: false,
      minWidth: 120
    }
    ]
  },
  datas: [{
    name: '郭军',
    mobile: '18612345678',
    apartment: '销售一部',
    duty: '销售顾问',
    zuoxi: 0,
    status: 0,
    wechat: 'sjofw'
  }
  ],
  // 用户详情
  details: [
  {
    name: 'picUrl',
    title: '',
    val: ''
  },
  {
    name: 'nickname',
    title: '员工姓名',
    val: ''
  },
  {
    name: 'mobile',
    title: '手机号码',
    val: ''
  },
  {
    name: 'sex',
    title: '性别',
    val: 1
  },
  {
    name: 'deptName',
    title: '部门',
    deptId: -1,
    val: ''
  },
  {
    name: 'postName',
    title: '职务',
    val: ''
  },
  {
    name: 'zuoxi',
    title: '坐席',
    val: ''
  },
  {
    name: 'seatNo',
    title: '坐席编号',
    val: ''
  },
  {
    name: 'seatName',
    title: '坐席备注',
    val: ''
  },
  {
    name: 'identity',
    title: '身份',
    val: ''
  },
  {
    name: 'status',
    title: '员工状态',
    val: 0
  },
  {
    name: 'addTime',
    title: '加入时间',
    val: ''
  },
  {
    name: 'createTime',
    title: '添加时间',
    val: ''
  },
  {
    name: 'joinStatus',
    title: '加入状态',
    val: ''
  }
  ],
  systems: [
    {
      name: '企业管理系统',
      obj: {}
    },
    {
      name: '聊天管理系统',
      obj: {}
    },
    {
      name: '客户端系统',
      obj: {}
    }
  ],
  // 权限内容
  systems1: [{
    name: '企业管理系统',
    obj: {
      publicCode: {
        name: '公众号列表',
        data: [{
          name: 'addCode',
          cont: '添加公众号',
          id: 0,
          isSelect: true
        },
        {
          name: 'onekey',
          cont: '一键同步',
          id: 1,
          isSelect: true
        },
        {
          name: 'dismiss',
          cont: '接触授权',
          id: 2,
          isSelect: false
        },
        {
          name: 'reGive',
          cont: '重新授权',
          id: 3,
          isSelect: false
        },
        {
          name: 'delList',
          cont: '删除',
          id: 4,
          isSelect: false
        }
        ]
      },
      stuff: {
        name: '员工管理',
        data: [{
          name: 'frame',
          cont: '部门架构',
          id: 5,
          isSelect: true
        },
        {
          name: 'stuffList',
          cont: '员工列表',
          id: 6,
          isSelect: true
        }
        ]
      },
      selfMenu: {
        name: '自定义菜单',
        data: [{
          name: 'delMenu',
          cont: '删除菜单',
          id: 7,
          isSelect: true
        },
        {
          name: 'addMenu',
          cont: '添加菜单',
          id: 8,
          isSelect: false
        },
        {
          name: 'saveMenu',
          cont: '保存菜单',
          id: 9,
          isSelect: false
        },
        {
          name: 'publish',
          cont: '发布菜单',
          id: 10,
          isSelect: false
        }
        ]
      }
    }
  },
  {
    name: '聊天管理系统',
    obj: {
      chats: {
        name: '会话管理',
        data: [{
          name: 'check',
          cont: '查看会话',
          id: 11,
          isSelect: true
        },
        {
          name: 'addLabel',
          cont: '添加菜单',
          id: 12,
          isSelect: false
        },
        {
          name: 'forceChat',
          cont: '强制聊天',
          id: 13,
          isSelect: false
        },
        {
          name: 'sendMsg',
          cont: '发送图片',
          id: 14,
          isSelect: false
        },
        {
          name: 'chat',
          cont: '会话聊天',
          id: 15,
          isSelect: false
        }
        ]
      }
    }
  }
  ],
  delTips: '您正在删除该员工，删除后绑定员工的微信用户无法进入企业，确定要删除吗？',
  startTips: '您正在启用该员工，启用后员工之前的所有操作权限恢复，确定要启用吗？',
  unbindTips: '您正在解绑该员工，解绑后员工微信不显示你的企业，确定要解绑吗？',
  forbidTips: '禁用后，所有用户无法进入该企业管理后台，无法继续服务该企业下的所有公众号。',
  detailTitle: '企业详情',
  delWithChild: '请先删除子部门',
  delWithUsers: '请先删除部门下员工',
  stopTips: '您正在停用该员工，停用后员工的所有权限都无法使用，无法登陆企业后台，确定要停用吗？'
}
