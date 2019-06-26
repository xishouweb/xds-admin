export default {
  data() {
    return {
      columns: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '坐席编号',
          key: 'seatNo',
          render: (h, params) => {
            return h('div', params.row.seatNo || '--')
          }
        },
        {
          title: '坐席备注',
          key: 'remark',
          render: (h, params) => {
            return h(
              'div',
              {
                class: {
                  noWrap: true
                },
                attrs: {
                  title: params.row.remark
                }
              },
              params.row.remark || '--'
            )
          }
        },
        {
          title: '坐席状态',
          key: 'status',
          render: (h, params) => {
            let statu = params.row.status
            statu =
              statu === 1
                ? '正常'
                : statu === 2 ? '停用' : statu === 3 ? '禁用' : '未分配'
            return h('div', statu || '--')
          }
        },
        {
          title: '在线状态',
          key: 'onlineStatus',
          render: (h, params) => {
            let statu = params.row.onlineStatus
            statu =
              statu === 'ON_LINE'
                ? '在线'
                : statu === 'OFF_LINE' ? '离线' : ''
            return h('div', statu || '--')
          }
        },
        {
          title: '员工姓名',
          key: 'eeName',
          render: (h, params) => {
            return h('div', params.row.eeName || '--')
          }
        },
        {
          title: '职位',
          key: 'positionName',
          checked: false,
          render: (h, params) => {
            return h('div', params.row.positionName || '--')
          }
        },
        {
          title: '分配时间',
          key: 'distributionTime',
          checked: false,
          render: (h, params) => {
            return h('div', (params.row.distributionTime && params.row.distributionTime.substring(0, 16)) || '--')
          }
        },
        {
          title: '手机号',
          key: 'mobile',
          render: (h, params) => {
            return h('div', params.row.mobile || '--')
          }
        },
        {
          title: '部门',
          key: 'deptName',
          render: (h, params) => {
            return h(
              'div',
              {
                class: {
                  noWrap: true
                },
                attrs: {
                  title: params.row.deptName
                }
              },
              params.row.deptName || '--'
            )
          }
        },
        {
          title: '操作',
          key: 'action',
          width: 80,
          render: (h, params) => {
            const that = this
            return h(
              'div',
              {
                on: {
                  click: e => {
                    e.stopPropagation()
                  }
                }
              },
              [
                h(
                  'Poptip',
                  {
                    props: {
                      value: params.row.showPop, // 控制气泡提示的显示
                      transfer: true,
                      placement: 'left-start',
                      'popper-class': 'seat'
                    }
                  },
                  [
                    h('Icon', {
                      props: {
                        type: 'more',
                        size: '18'
                      },
                      attrs: {
                        title: '操作'
                      },
                      style: {
                        cursor: 'pointer'
                      },
                      on: {
                        click() {
                          that.closePop(that.seatListData, 'showPop', params.index)
                          that.showSet = false
                        }
                      }
                    }),
                    h(
                      'div',
                      {
                        slot: 'content',
                        on: {
                          click: () => {
                            document.body.click()
                          }
                        }
                      },
                      [
                        h(
                          'ul',
                          {
                            class: {
                              'ul-list': true
                            }
                          },
                          [
                            h(
                              'li',
                              {
                                class: {
                                  'li-item': true,
                                  isHideAction: false
                                },
                                on: {
                                  click: (e) => {
                                    // e.stopPropagation()
                                    this.getSeatDetail(
                                      params.row.id,
                                      'seatsInfo'
                                    )
                                  }
                                }
                              },
                              '详细'
                            ),
                            h(
                              'li',
                              {
                                class: {
                                  'li-item': true,
                                  isHideAction: params.row.status === 3
                                },
                                on: {
                                  click: () => {
                                    this.getSeatDetail(
                                      params.row.id,
                                      'editSeats'
                                    )
                                  }
                                }
                              },
                              '修改'
                            ),
                            h(
                              'li',
                              {
                                class: {
                                  'li-item': true,
                                  isHideAction:
                                    params.row.status !== 1 &&
                                    params.row.status !== 2
                                },
                                on: {
                                  click: () => {
                                    this.ids = [params.row.id]
                                    this.operationStatus = 'REMOVE'
                                    this.selectAction('deallocate')
                                  }
                                }
                              },
                              '解除'
                            ),
                            h(
                              'li',
                              {
                                class: {
                                  'li-item': true,
                                  isHideAction: params.row.status !== 1
                                },
                                on: {
                                  click: () => {
                                    this.ids = [params.row.id]
                                    this.operationStatus = 'BLOCK_UP'
                                    this.selectAction('stopSeats')
                                  }
                                }
                              },
                              '停用'
                            ),
                            h(
                              'li',
                              {
                                class: {
                                  'li-item': true,
                                  isHideAction: params.row.status !== 2
                                },
                                on: {
                                  click: () => {
                                    this.ids = [params.row.id]
                                    this.operationStatus = 'ACTIVE'
                                    this.selectAction('start')
                                  }
                                }
                              },
                              '启用'
                            )
                          ]
                        )
                      ]
                    )
                  ]
                )
              ]
            )
          }
        }
      ]
    }
  }
}
