import {queryPosterByPage} from '@/api/poster'
import dayjs from 'dayjs'
export default {
  data() {
    return {
      tableParam: {
        totalPage: 0,
        pageSize: 10,
        currPage: 1,
        keyword: null,
        groupId: null,
        id: null,
        sort: null,
        order: null
      },
      successStatus: {
        0: '完成',
        1: '未完成'
      },
      list: null,
      table: {
        noDatatext: "暂无裂变海报",
        columns: [
          {
            type: 'selection',
            width: 60,
            align: 'center'
          },
          {
            title: "裂变海报ID",
            key: "fansPosterNo",
            minWidth: 90
          },
          {
            title: "粉丝昵称/姓名",
            key: "fansNickname",
            minWidth: 110,
            render: (h, params) => {
              let img = params.row.headImageUrl
              let name = params.row.fansName || '--'
              let nickName = params.row.fansNickname
              return (
                <div class="basicInfo">
                  <img src={img} />
                  <div class="right">
                    <p class="nickName">{nickName}</p>
                    <p class="name">{name}</p>
                  </div>
                </div>
              )
            }
          },
          {
            title: "累计扫码次数",
            key: "scanNum",
            sortable: true,
            minWidth: 120,
            render: (h, params) => {
              let scanNum = params.row.scanNum
              return (
                <span>
                  {scanNum || 0}
                </span>
              )
            }
          },
          {
            title: "累计关注人数",
            key: "followersNum",
            sortable: true,
            minWidth: 120,
            render: (h, params) => {
              let followersNum = params.row.followersNum
              return (
                <span>
                  {followersNum || 0}
                </span>
              )
            }
          },
          {
            title: "已邀请数量",
            key: "actualFollowNum",
            sortable: true,
            minWidth: 100,
            render: (h, params) => {
              let actualFollowNum = params.row.actualFollowNum
              return (
                <span>
                  {actualFollowNum || 0}
                </span>
              )
            }
          },
          {
            title: "已取消",
            key: "cancelFollowNum",
            sortable: true,
            minWidth: 90,
            render: (h, params) => {
              let cancelFollowNum = params.row.cancelFollowNum
              return (
                <span>
                  {cancelFollowNum || 0}
                </span>
              )
            }
          },
          {
            title: '还需关注数',
            key: 'stillNeedFollowersNum',
            sortable: true,
            minWidth: 120,
            render: (h, params) => {
              let stillNeedFollowersNum = params.row.stillNeedFollowersNum
              return (
                <span>
                  {stillNeedFollowersNum || 0}
                </span>
              )
            }
          },
          {
            title: '到期时间',
            key: 'expireTime',
            sortable: true,
            minWidth: 160,
            render: (h, params) => {
              let expireTime = params.row.expireTime
              const timeTxt = dayjs(expireTime).format('YYYY-MM-DD HH:mm')
              return (
                <span>
                  {timeTxt}
                </span>
              )
            }
          },
          // {
          //   title: "关注状态",
          //   key: "followedNum",
          //   sortable: true,
          //   minWidth: 120
          // },
          {
            title: '任务完成状态',
            key: 'completeStatus',
            sortable: true,
            minWidth: 100,
            render: (h,params) => {
              let status = params.row.completeStatus
              let color = status === 0 ? '#409fff' : '#f56c6c'
              let text = this.successStatus[status]
              return h('div',{
                style: {
                  fontSize: '14px',
                  color: color
                }
              }, text)
            }
          },
          {
            title: '操作',
            key: 'action',
            minWidth: 90,
            fixed: 'right',
            align: "center",
            renderHeader: (h) => {
              return h('div', {
                style: {
                  display: 'flex',
                  alignItems: 'center',
                  position: "relative"
                }
              }, [
                h('p', {
                  style: {
                    marginRight: '10px'
                  }
                }, '操作'),
                h('Poptip', {
                  style: {
                    cursor: 'pointer',
                  },
                  props: {
                    placement: 'left-start',
                    transfer: true,
                    trigger: "hover"
                  }
                }, [
                  h('a',[
                    h('i', {
                      class: 'icon',
                      style: {
                        fontSize: '15px'
                      },
                      domProps: {
                        innerHTML: '&#xe635;'
                      }
                    }),
                  ]),
                  h('div', {
                    slot: 'content',
                    style: {
                      fontSize: '14px',
                      width: '380px',
                      whiteSpace: 'normal'
                    },
                  }, [
                    h('h4', '累计扫码次数'),
                    h('div', {class: "popip-text"},'累计用户扫码次数，用户扫描一次则计一次，同一用户多次扫描则计多次。'),
                    h('h4', '累计关注人数'),
                    h('div', {class: "popip-text"}, '累计扫码后关注的用户数量，包含关注状态为已关注和已取消的，同一用户多次扫描后关注再取消关注则只计1次，不重复计算。'),
                    h('h4', '已邀请数量'),
                    h('div', {class: "popip-text"}, '通过自己的裂变海报关注进来的粉丝数量且关注状态为关注中的粉丝数量。同一用户多次扫描后关注再取消关注则只计1次。'),
                    h('h4', '已取消'),
                    h('div', {class: "popip-text"}, '通过裂变海报关注后的粉丝的关注状态为已取消，即取消关注的粉丝数。')
                  ])
                ])
              ])
            },
            render: (h, params) => {
              return h(
                'div',
                [
                  h('Button', {
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
                    style: { marginRight: '10px', width: "60px" },
                    on: {
                        click: () => {
                          this.show(params.row)
                        }
                    }
                  }, '详细')
                ]
              )
            }
          }
        ],
        datas: []
      }
    }
  },
  mounted() {
   this.getTableList()
  },
  methods: {
    getTableList(arg = {}) {
      // arg : 在筛选抽屉中组件中会传参进来
      let _param = this.tableParam
      _param.id = this.$route.query.id
      let param = {
        id: _param.id,
        appAccountId: this.currPublic.appAccountId,
        offset: (_param.currPage - 1) * _param.pageSize,
        limit: _param.pageSize,
        sort: _param.sort,
        order: _param.order,
        expireStatus: arg.expireStatus,
        completeStatus: arg.completeStatus,
        conditionStr: _param.keyword
      }
      queryPosterByPage(param)
      .then(res => {
       if (res.code === 1) {
         let dat = res.data
         let dataRecords = dat.records

         this.tableParam = Object.assign({}, this.tableParam, {
          totalPage: dat.totalCount,
          pageSize: dat.limit,
          currPage: parseInt(dat.offset / dat.limit) + 1
        })

         this.table = { ...this.table, datas: dataRecords }
       } else {
        this.$Message.error("数据加载失败！")
       }
      })
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
      this.getTableList()
    },
    show(data) {
      this.$emit('openDrawer', {
        show: true,
        type: "info",
        title: '裂变海报详情',
        current: data
      })
    },
    modify(data) {
      this.drawer = { show: true, title: '修改分组', type: 'theme', current: data }
    }
  }
}
