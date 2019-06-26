export default {
  filters: {
    creater(val) { // 过滤创建人信息
      if (!val) { return '' }
      let nv = val.replace('<', '(').replace('>', ')')
      return nv
    },
    filtTime(val) { // 过滤创建、发送时间的秒值
      if (!val) { return '' }
      return val.slice(0, -3)
    }
  },
  data() {
    return {
      noData: [ // 列表为空显示内容
        '<p class="noData">标准群发消息为空</p>',
        '<p class="noData">高级群发消息为空</p>',
        '<p class="noData">客服群发消息为空</p>',
        '<p class="noData">模板群发消息为空</p>'
      ],
      handList: [ // 操作按钮数据
        { text: '详情', key: 'detail' },
        { text: '修改', key: 'updata' },
        { text: '复制', key: 'copy' },
        { text: '取消群发', key: 'cancel' },
        { text: '删除', key: 'delete' }
      ],
      modText: [ // 标题与对话信息
        ['复制群发内容','复制后生成一条新的消息群发并可再次修改内容。确定要复制该群发消息吗？'],
        ['删除群发','删除后你将无法找回该条群发记录，确定要删除吗？'],
        ['取消群发','取消后不占用剩余消息条数。确定要取消该群发消息吗？']
      ],
      contType: {
        text: '文本',
        image: '图片',
        voice: '语音',
        video: '视频',
        news: '图文',
        file: '文件',
        template: '模板'
      },
      Const: [
        {
          title: '群发ID',
          key: 'msgNo',
          width: 100
        },
        {
          title: '群发名称',
          key: 'msgName',
          minWidth: 230,
          render: (h,o) => {
            return h('p', {
              class: 'text_over'
            }, o.row.msgName)
          }
        },
        {
          title: '发送内容类型',
          key: 'msgType',
          width: 140,
          render: (h, o) => {
            let typ = o.row.msgType
            return h('p', this.contType[typ])
          }
        },
        {
          title: '创建时间',
          key: 'createTime',
          width: 180,
          render: (h,o) => {
            let time = o.row.createTime
            time = time.slice(0,-3)
            return h('p', { }, time)
          }
        },
        {
          title: '发送时间',
          key: 'sendTime',
          width: 180,
          render: (h,o) => {
            let time = o.row.sendTime
            if (time) { time = time.slice(0,-3) }
            return h('p', { }, time)
          }
        },
        {
          title: '预估人数',
          key: 'estimateNumber',
          width: 150,
          renderHeader: (h) => {
            return h('div', {
              style: {
                display: 'flex',
                alignItems: 'center',
                position: "relative"
              }
            }, [
              h('span', {
                style: {
                  marginRight: '10px'
                }
              }, '预估人数'),
              h('Poptip', {
                style: {
                  cursor: 'pointer'
                },
                props: {
                  trigger: 'hover',
                  placement: 'right-start',
                  transfer: true
                }
              }, [
                h('a',[
                  h('i', {
                    class: 'icon',
                    style: {
                      fontSize: '14px'
                    },
                    domProps: {
                      innerHTML: '&#xe635;'
                    }
                  }),
                ]),
                h('div', {
                  slot: 'content',
                  style: {
                    whiteSpace: 'normal',
                    width: '220px'
                  },
                  domProps: {
                    innerHTML: `预估人数为新建群发时根据群发对象计算的预估人数，与实际发送人数可能会不同。`
                  }
                })
              ])
            ])
          }
        },
        {
          title: '实际发送',
          key: 'actualNumber',
          width: 150,
          render: (h,o) => {
            return h('p', {}, o.row.actualNumber || 0)
          },
          renderHeader: (h) => {
            return h('div', {
              style: {
                display: 'flex',
                alignItems: 'center',
                position: "relative"
              }
            }, [
              h('span', {
                style: {
                  marginRight: '10px'
                }
              }, '实际发送'),
              h('Poptip', {
                style: {
                  cursor: 'pointer'
                },
                props: {
                  trigger: 'hover',
                  placement: 'right-start',
                  transfer: true
                }
              }, [
                h('a',[
                  h('i', {
                    class: 'icon',
                    style: {
                      fontSize: '14px'
                    },
                    domProps: {
                      innerHTML: '&#xe635;'
                    }
                  }),
                ]),
                h('div', {
                  slot: 'content',
                  style: {
                    width: '260px',
                    whiteSpace: 'normal'
                  },
                  domProps: {
                    innerHTML: `
                      预估人数与实际发送成功人数可能会不同，可能会是以下原因：<br>
                      1、群发时粉丝互动已超过48小时。<br>
                      2、粉丝已取消关注。<br>
                      3、公众号授权状态异常。<br>
                      4、群发时素材缺失（例如：群发图片已删除）<br>
                      5、公众号在其他第三方平台也设置了客服消息导致冲突。<br>
                      6、当日累计客服消息次数达到50万上限。
                    `
                  }
                })
              ])
            ])
          }
        },
        {
          title: '发送成功',
          key: 'successNumber',
          width: 150,
          render: (h,o) => {
            return h('p', {}, o.row.successNumber || 0)
          }
        },
        {
          title: '发送状态',
          key: 'sendStatus',
          width: 150,
          renderHeader: (h) => {
            return h('div', {
              style: {
                display: 'flex',
                alignItems: 'center',
                position: "relative"
              }
            }, [
              h('span', {
                style: {
                  marginRight: '10px'
                }
              }, '发送状态'),
              h('Poptip', {
                style: {
                  cursor: 'pointer'
                },
                props: {
                  trigger: 'hover',
                  placement: 'bottom-end',
                  transfer: true
                }
              }, [
                h('a',[
                  h('i', {
                    class: 'icon',
                    style: {
                      fontSize: '14px'
                    },
                    domProps: {
                      innerHTML: '&#xe635;'
                    }
                  }),
                ]),
                h('div', {
                  slot: 'content',
                  style: {
                    width: '240px',
                    whiteSpace: 'normal'
                  },
                  domProps: {
                    innerHTML: `
                    发送失败可能是以下原因：<br>
                    1、微信公众平台接口调用失败。<br>
                    2、群发对象没有一个用户。<br>
                    3、群发对象时有用户，但没有一个发送成功的用户。
                    `
                  }
                })
              ])
            ])
          },
          render: (h,o) => {
            let status = o.row.sendStatus
            let text = ['发送失败','待发送','发送中','发送完成','取消发送','发送中']
            let clas = ['err_color','','','text_color','gray_color','']
            return h('div', {
              class: clas[status]
            }, text[status])
            }
        },
        {
          title: '操作',
          key: 'operations',
          width: 100,
          align: 'center',
          render: (h, o) => {
            return h('Poptip', {
              props: {
                value: o.row.show, // 控制气泡提示的显示
                placement: 'left-start',
                transfer: true,
                width: '94',
                popperClass: 'poptip-mass'
              }
            }, [
              h("Icon", {
                props: {
                  type: "ios-more",
                },
                style: {
                  fontSize: "24px",
                  cursor: 'pointer'
                },
                on: {
                  click: () => {
                    this.closePoptip(o.index)
                    this.handDex = o.index
                  }
                }
              }),
              h('ul', {
                slot: 'content',
                class: 'display-list'
              }, this.handBtn(h))
            ])
          }
        }
      ]
    }
  },
  methods: {
    // 关闭气泡函数（操作按钮）
    closePoptip(dex) {
      const list = this.massList
      this.closePop(list, 'show', dex)
    }
  }
}
