export default {
  columns(_this) {
    return [
      {
        type: 'selection',
        width: 60,
        align: 'center'
      },
      {
        title: '标题',
        key: 'title',
        render: (h, params) => {
          return h('div', [
            h('span', params.row.title)
          ])
        },
        ellipsis: true
      },
      {
        title: '创建时间',
        key: 'createTime',
        render: (h, params) => {
          let createTime
          if (params.row.createTime) {
            createTime = params.row.createTime.substring(0, 10)
          }
          return h('div', [
            h('span', createTime || 0)
          ])
        },
        ellipsis: true
      },
      {
        title: '操作',
        key: 'action',
        width: 300,
        render: (h, params) => {
          return h('div', [
            h('Button', {
              props: {
                type: 'ghost',
                size: 'small'
              },
              style: {
                marginRight: '5px',
                width: '77px'
              },
              on: {
                click: () => {
                  _this.edit(params.index, params.row)
                }
              }
            },[
              h('div', [
                h('span', {
                  class: {
                    icon: true
                  },
                  style: {
                    marginRight: '5px',
                    fontSize: '14px'
                  },
                  domProps: {
                    innerHTML: '&#xe61d;'
                  }
                }),
                h('span', '编辑')
              ])
            ]),
            h('Button', {
              props: {
                type: 'ghost',
                size: 'small'
              },
              on: {
                click: () => {
                  _this.delRepository(params.index, 'deleteRepository', params.row)
                }
              }
            },[
              h('div', [
                h('span', {
                  class: {
                    icon: true
                  },
                  style: {
                    marginRight: '5px',
                    fontSize: '14px'
                  },
                  domProps: {
                    innerHTML: '&#xe652;'
                  }
                }),
                h('span', '删除')
              ])
            ])
          ])
        }
      }
    ]
  }
}
