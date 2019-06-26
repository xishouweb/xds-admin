
export default {
  methods: {
    filtCont(val) { // 过滤发送内容
      val = (val || '').replace(/\$\{nickName\}/g, '[粉丝昵称]')
        .replace(/\\n/g, '')
        .replace(/<\/*[(br)|(a)|(span)|(p)|(div)|(h1)|(h2)|(h3)|(h4)|(h5)|(h6)][^>]*>/g, '')
      return val
    }
  },
  data() {
    return {
      noDatatext: '暂无任务',
      contType: {
        text: '文本',
        image: '图片',
        voice: '语音',
        video: '视频',
        news: '图文',
        file: '文件',
        template: '模板'
      },
      columns: [
        {
          type: 'index',
          title: '序号',
          maxWidth: 80
        },
        {
          title: '发送内容',
          key: 'sendContent',
          render: (h, o) => {
            return h('p', {
              style: {
                width: '100%'
              },
              class: 'text_over'
            }, this.filtCont(o.row.sendContent))
          }
        },
        {
          title: '发送时间间隔',
          key: 'intervals',
          render: (h, o) => {
            let time = o.row.intervals
            let hour = Math.floor(time / 60)
            let min = time % 60 + '分钟'
            time = hour ? hour + '小时' + min : min
            return h('p', {
              class: 'text_over'
            }, time)
          }
        },
        {
          title: '累计发送次数',
          key: 'sendCount',
          render: (h, o) => {
            return h('p', {}, o.row.sendCount || 0)
          }
        },
        {
          title: '状态',
          key: 'status',
          maxWidth: 200,
          render: (h,o) => {
            return h('i-switch', {
              props: {
                value: o.row.status
              },
              nativeOn: {
                input: (v) => {
                  this.value = v
                }
              },
              on: {
                'on-change': (val) => {
                  o.row.status = val
                  setTimeout(() => {
                    o.row.status = !val
                  }, 10)
                  this.hand('status', o.index)
                }
              }
            })
          }
        },
        {
          title: '操作',
          maxWidth: 200,
          render: (h,o) => {
            return h('div', {
              class: 'table-btns'
            }, [
              h('i-button', {
                on: {
                  click: () => {
                    this.hand('updata', o.index)
                  }
                }
              }, '修改'),
              h('i-button', {
                on: {
                  click: () => {
                    this.hand('delete', o.index)
                  }
                }
              }, '删除'),
            ])
          }
        }
      ],
    }
  },
}
