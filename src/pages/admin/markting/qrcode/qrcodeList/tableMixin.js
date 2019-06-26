export default {
  data() {
    return {
      tableParam: {
        totalPage: 0,
        pageSize: 10,
        currPage: 1,
        keyword: null,
        groupId: null,
        sort: null,
        order: null
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
        noDatatext: '二维码列表为空',
        columns: [
          {
            // fixed: 'left',
            type: 'selection',
            width: 60,
            align: 'center'
          },
          {
            title: '二维码ID',
            key: 'qrCodeNo',
            minWidth: 110
          },
          {
            title: '二维码名称',
            key: 'qrCodeName',
            minWidth: 110
          },
          {
            title: '接待客服/部门',
            key: 'customerService',
            minWidth: 120,
            render: (h, params) => {
              // * 指定客服或指定部门 SEAT_OR_DEPT_SPECIFIED(1),
              // * 不限 UMLIMITED(3),
              // * 不指定 UNSPECIFIED(4);
              const customerServiceType = params.row.customerServiceType === 3 ? '不限客服' : '不指定客服'

              const customerService = params.row.customerService
              if (customerService && customerService.length) {
                const txt = customerService.join(' / ')
                return h(
                  'p',
                  {
                    style: {
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }
                  },
                  txt
                )
              } else {
                return h('span', customerServiceType)
              }
            }
          },
          {
            title: '二维码类型',
            key: 'qrCodeType',
            minWidth: 100
          },
          {
            title: '累计扫码次数',
            key: 'scanNum',
            sortable: true,
            minWidth: 130,
            render: (h, params) => {
              const scanNum = params.row.scanNum
              return h('span', scanNum || 0)
            }
          },
          {
            title: '累计关注人数',
            key: 'followersNum',
            sortable: true,
            minWidth: 130,
            render: (h, params) => {
              const followersNum = params.row.followersNum
              return h('span', followersNum || 0)
            }
          },
          {
            title: '关注中',
            key: 'followedNum',
            sortable: true,
            minWidth: 120,
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
            width: 260,
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
                    'p',
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
                      h('i', {
                        class: 'icon',
                        style: {
                          fontSize: '15px',
                        },
                        domProps: {
                          innerHTML: '&#xe635;'
                        }
                      }),
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
              return h('div', [
                h(
                  'Button',
                  {
                    props: {
                      type: 'primary',
                      size: 'small',
                      options: {
                        modifiers: {
                          preventOverflow: {
                              boundariesElement: 'viewport'
                          }
                        }
                      }
                    },
                    style: { marginRight: '10px', width: '60px' },
                    on: {
                      click: () => {
                        this.show(params.row)
                      }
                    }
                  },
                  '详细'
                ),
                h(
                  'Button',
                  {
                    props: {
                      size: 'small'
                    },
                    style: { marginRight: '10px', width: '60px' },
                    on: {
                      click: () => {
                        this.modify(params.row)
                      }
                    }
                  },
                  '修改'
                ),
                h(
                  'Button',
                  {
                    props: {
                      size: 'small'
                    },
                    style: { marginRight: '10px', width: '60px' },
                    on: {
                      click: () => {
                        this.delete(params.row)
                      }
                    }
                  },
                  '删除'
                )
              ])
            }
          }
        ],
        datas: []
      }
    }
  },
  created() {
    this.tableParam.qrCodeThemeId = parseInt(this.$route.params.id)
  },
  methods: {
    // table相关操作
    async getTableData() {
      let _param = this.tableParam
      let param = {
        qrCodeType: this.qrCodeType === '-1' ? null : this.qrCodeType,
        qrCodeThemeId: _param.qrCodeThemeId,
        condition: _param.keyword,
        appAccountId: this.currPublic.appAccountId,
        offset: (_param.currPage - 1) * _param.pageSize,
        limit: _param.pageSize,
        sort: _param.sort,
        order: _param.order
      }
      let res = await this.getGchannelQrCodeListByPage(param)
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
      } else if (param.key) {
        // 累计扫码次数  scan_num  累计关注人数 followers_num 关注中 followed_num   已取消    cancel_follow_num
        this.tableParam.sort = param.key
        this.tableParam.order = param.order
      } else {
        this.resetTableParam()
        this.tableParam.pageSize = param.size
        this.tableParam.currPage = param.page
      }
      this.getTableData()
    },
    // 详细
    async show(data) {
      let param = {
        appAccountId: this.currPublic.appAccountId,
        id: data.id
      }
      let res = await this.queryGchannelQrCodeById(param)

      if (res.code === 1) {
        res.data.qrCodeNo = data.qrCodeNo
        this.drawer = {
          show: true,
          title: data.qrCodeName,
          type: 'info',
          current: res.data,
          width: '680px',
          deleteFn: () => this.delete(data),
          modifyFn: () => this.modify(data)
        }
      } else {
        this.$Message.error('详情加载失败！')
      }
    },
    async modify(data) {
      this.$router.push({
        name: 'qrcodeEdit',
        params: { themeId: this.qrCodeThemeId },
        query: { id: data.id }
      })
    },
    delete(data) {
      const deleteFn = async () => {
        let data = this.modal.data
        let ids = Array.isArray(data) ? data.map(item => item.id) : [data.id]
        let param = {
          appAccountId: this.currPublic.appAccountId,
          qrCodeThemeId: this.tableParam.qrCodeThemeId,
          idList: ids
        }
        let res = await this.deleteGchannelQrCodeByIds(param)
        if (res.code === 1) {
          this.$Message.success('删除成功！')
          this.modal = {}
          this.drawer = {}
          this.getTableData()
        } else {
          this.$Message.error('删除失败！')
        }
      }
      this.modal = {
        show: true,
        header: '删除',
        message:
          '删除后，粉丝仍然可以通过该渠道二维码关注公众号，但不回复渠道二维码相应的回复内容，不设置接待客服，不自动打标签。确定要删除吗？',
        data: data,
        ok: deleteFn
      }
    }
  }
}
