export default {
  data() {
    let self = this
    return {
      tableParam: {
        totalPage: 0,
        pageSize: 10,
        currPage: 1,
        keyword: null,
        groupId: null
      },
      actionList: [
        // 操作按钮数据
        {
          text: '新建二维码',
          key: 'create'
        },
        {
          text: '查看二维码',
          key: 'show'
        },
        {
          text: '查看数据',
          key: 'overviewData'
        },
        {
          text: '修改',
          key: 'modify'
        },
        {
          text: '删除',
          key: 'delete'
        }
      ],
      table: {
        outputFileName: "渠道二维码主题",
        noDatatext: '暂无二维码主题，您可先新建二维码主题，然后再新建二维码。',
        columns: [
          {
            // fixed: 'left',
            type: 'selection',
            width: 60,
            align: 'center'
          },
          {
            title: '二维码主题',
            key: 'themeName',
            minWidth: 380
          },
          {
            title: '二维码总数',
            key: 'count',
            sortable: true,
            minWidth: 110,
            render: (h, params) => {
              const count = params.row.count
              return h('span', count || 0)
            }
          },
          {
            title: '累计扫码次数',
            key: 'scanNum',
            sortable: true,
            minWidth: 120,
            render: (h, params) => {
              const scanNum = params.row.scanNum
              return h('span', scanNum || 0)
            }
          },
          {
            title: '累计关注人数',
            key: 'followersNum',
            sortable: true,
            minWidth: 100,
            render: (h, params) => {
              const followersNum = params.row.followersNum
              return h('span', followersNum || 0)
            }
          },
          {
            title: '关注中',
            key: 'followedNum',
            sortable: true,
            minWidth: 70,
            render: (h, params) => {
              const followedNum = params.row.followedNum
              return h('span', followedNum || 0)
            }
          },
          {
            title: '已取消',
            key: 'cancelFollowNum',
            sortable: true,
            minWidth: 120,
            render: (h, params) => {
              const cancelFollowNum = params.row.cancelFollowNum
              return h('span', cancelFollowNum || 0)
            }
          },
          {
            title: '操作',
            key: 'action',
            minWidth: 60,
            align: 'center',
            renderHeader: h => {
              return h(
                'div',
                {
                  style: {
                    display: 'flex',
                    alignItems: 'center',
                    position: 'relative'
                  }
                },
                [
                  h(
                    'span',
                    {
                      style: {
                        marginRight: '10px'
                      }
                    },
                    '操作'
                  ),
                  h(
                    'Poptip',
                    {
                      style: {
                        cursor: 'pointer'
                      },
                      props: {
                        placement: 'left-start',
                        transfer: true,
                        trigger: "hover"
                      }
                    },
                    [
                      h('a', [
                        h('i', {
                          class: 'icon',
                          style: {
                            fontSize: '15px'
                          },
                          domProps: {
                            innerHTML: '&#xe635;'
                          }
                        })
                      ]),
                      h(
                        'div',
                        {
                          slot: 'content',
                          style: {
                            fontSize: '14px',
                            width: '380px',
                            whiteSpace: 'normal'
                          },
                        },
                        [
                          h('h4', '累计扫码次数'),
                          h(
                            'div',
                            {class: "popip-text"},
                            '累计用户扫码次数，用户扫描一次则计一次，同一用户多次扫描则计多次。'
                          ),
                          h('h4', '累计关注人数'),
                          h(
                            'div',
                            {class: "popip-text"},
                            '累计扫码后关注的用户数量，同一用户多次扫描后关注再取消关注则只计1次，不重复计算。'
                          ),
                          h('h4', '关注中'),
                          h(
                            'div',
                            {class: "popip-text"},
                            '通过渠道二维码关注后的粉丝的关注状态仍为关注中。'
                          ),
                          h('h4', '已取消'),
                          h(
                            'div',
                            {class: "popip-text"},
                            '通过渠道二维码关注后的粉丝的关注状态为已取消，即取消关注的粉丝数。'
                          )
                        ]
                      )
                    ]
                  )
                ]
              )
            },
            render: (h, params) => {
              const createAction = (type, text) => {
                return h(
                  'div',
                  {
                    class: 'action-item',
                    on: {
                      click: e => {
                        self.action(type, params.row)
                        // document.documentElement.click()
                        self.closePoptip()
                      }
                    }
                  },
                  text
                )
              }
              let actions = {}
              self.actionList.forEach(item => {
                actions[item.key] = createAction(item.key, item.text)
              })
              let actionFnArr = function() {
                let arr = []
                let keysArr = []
                keysArr = ['create', 'show', 'overviewData', 'modify', 'delete']
                keysArr.forEach(key => {
                  arr.push(actions[key])
                })
                return arr
              }
              return h(
                'div',
                {
                  on: {
                    click(e) {
                      e.stopPropagation()
                    }
                  }
                },
                [
                  h(
                    'Poptip',
                    {
                      props: {
                        value: params.row.show, // 控制操作按钮的显示
                        padding: '8px 0px',
                        trigger: 'click',
                        'popper-class': 'action',
                        placement: 'left-start',
                        transfer: true,
                        options: {
                          modifiers: {
                            preventOverflow: {
                                boundariesElement: 'viewport'
                            }
                          }
                        }
                      }
                    },
                    [
                      h('div', { class: 'cursor' }, [
                        h('Icon', {
                          on: {
                            click() {
                              self.closePoptip(params.index) // 当前项状态取反，其余项关闭
                            }
                          },
                          class: 'process_btn',
                          attrs: { type: 'ios-more' }
                        })
                      ]),
                      h('div', { slot: 'content' }, actionFnArr())
                    ]
                  )
                ]
              )
            }
          }
        ],
        datas: []
      }
    }
  },
  methods: {
    // 关闭气泡函数（操作按钮）
    closePoptip(dex) {
      const list = this.table.datas
      this.closePop(list, 'show', dex) // 公共方法，见util.js
    },
    // table相关操作
    async getTableData() {
      let _param = this.tableParam
      let param = {
        condition: _param.keyword,
        appAccountId: this.currPublic.appAccountId,
        offset: (_param.currPage - 1) * _param.pageSize,
        limit: _param.pageSize,
        sort: _param.sort,
        order: _param.order
      }
      if (_param.groupId !== -1) {
        param.groupId = _param.groupId
      }
      let res = await this.getGchannelQrCodeThemeListByPage(param)
      if (res.code === 1) {
        this.tableParam = Object.assign({}, this.tableParam, {
          totalPage: res.data.totalCount,
          pageSize: res.data.limit,
          currPage: parseInt(res.data.offset / res.data.limit) + 1
        })
        this.$set(this.table, 'datas', res.data.records || [])
      } else {
        this.$Message.error('数据加载失败！')
      }
    },
    resetTableParam() {
      this.tableParam.pageSize = 10
      this.tableParam.currPage = 1
    },
    // 翻页获取列表
    pageChange(param) {
      if (typeof param === 'string') {
        this.resetTableParam()
        this.tableParam.keyword = param
      } else if (param.size) {
        this.tableParam.pageSize = param.size
        this.tableParam.currPage = param.page
      } else if (param.key) {
        // 累计扫码次数  scan_num  累计关注人数 followers_num 关注中 followed_num   已取消    cancel_follow_num
        this.resetTableParam()
        this.tableParam.sort = param.key
        this.tableParam.order = param.order
      }
      this.getTableData()
    },

    // table 操作
    action(typ, data) {
      document.body.click()
      switch (typ) {
        case 'create': {
          this.canCreateOrNot(data)
          break
        }
        case 'show': {
          this.setQrCodeThemeName(data.themeName)
          this.$router.push({ name: 'qrcodeList', params: { id: data.id } })
          break
        }
        case 'overviewData': {
          this.setQrCodeThemeName(data.themeName)
          this.drawer = {
            show: true,
            title: data.themeName,
            width: '640px',
            type: 'statis',
            params: data,
            fn: this.canCreateOrNot
          }
          // 获取统计数据
          // const id = data.id
          // const appAccountId = this.currPublic.appAccountId
          // this.getStatisCount({ id, appAccountId, countType: 'month' })
          break
        }
        case 'modify': {
          this.modify(data)
          break
        }
        case 'delete': {
          this.delete(data)
          break
        }
      }
    },
    // 检测当前公众号下能否新建二维码
    async canCreateOrNot(data) {
      let param = {appAccountId: this.currPublic.appAccountId}
      await this.canSaveQrCode(param) // 判断当前公众号是否可以新建二位码
      await this.getQrCodeNum(param) // 获取二维码的数量
      if (!(this.getQrCodeNumber.lavePackageQrLimitNum + this.getQrCodeNumber.lavePackageQrNum)) {
        // 无剩余
        this.$Message.error("当前公众号无剩余可用的永久二维码/临时二维码。")
      } else if (this.getCanCreateQrCode !== true) {
        // 在创建中
        this.$Message.error(this.getCanCreateQrCode)
      } else {
        this.setQrCodeThemeName(data.themeName)
        this.$router.push({ name: 'qrcodeEdit', params: { themeId: data.id } })
      }
    },
    modify(data) {
      this.drawer = {
        show: true,
        title: '修改二维码主题',
        type: 'theme',
        current: data
      }
    },
    delete(data) {
      const deleteFn = async () => {
        let data = this.modal.data
        let ids = Array.isArray(data) ? data.map(item => item.id) : [data.id]
        let param = {
          appAccountId: this.currPublic.appAccountId,
          themeIds: ids
        }
        let res = await this.deleteGchannelQrCodeTheme(param)
        if (res.code === 1) {
          this.$Message.success('删除成功！')
          this.getTableData()
          this.modal = {}
        } else {
          this.$Message.error('删除失败！')
        }
      }
      this.modal = {
        show: true,
        header: '删除',
        message: '删除后，二维码主题和主题下的二维码全部被删除，确定要删除吗？',
        data: data,
        ok: deleteFn
      }
    }
  }
}
