// 关键词回复列表格式
// import { addTags } from '@/utils/textHtmlChange.js'
import { addTags } from '@/pages/admin/tencent/components/text/textHtmlChange.js'
export default {
  listTit(that) {
    return [
      {
        title: '规则名称',
        key: 'ruleName',
        render: (h,o) => {
          return h('p', {
            class: 'text_over'
          },o.row.ruleName)
        }
      },
      {
        title: '关键词',
        key: 'keyWord',
        render: (h,o) => {
          return h('p', {
            class: 'text_over'
          },o.row.keyWord)
        }
      },
      {
        title: '回复内容',
        key: 'cont',
        render: (h,o) => {
          let dat = o.row.cssAutoreplyRuleContents[0]
          if (!dat) { return }
          let typ = that.replyTyp[dat.msgType]
          let txt = ''
          if (dat.msgType === 'text') {
            txt = addTags(dat.content, 'span')
          }
          return h('p', {
            class: 'text_over',
            domProps: {
              innerHTML: typ + txt
            }
          })
        }
      },
      {
        title: '累计回复次数',
        key: 'replyNum',
        width: 160
      },
      {
        title: '状态',
        key: 'status',
        width: 160,
        render: (h,o) => {
          if (o.row.status === 1) {
            return h('span',{},'正常')
          } else {
            return h('span',{},'禁用')
          }
        }
      },
      {
        title: '操作',
        key: 'hand',
        width: 240,
        render: (h,o) => {
          let tex = o.row.status === 1 ? '禁用' : '启用'
          return h('div',[
            h('Button',{
              props: {
                type: 'primary',
                size: 'small'
              },
              style: {
                marginRight: '10px',
              },
              on: {
                click: () => { // 编辑按钮点击事件
                  that.$router.push({
                    path: 'addReply',
                    query: {
                      id: o.row.id,
                    }
                  })
                  // that.$store.commit('vipcn/SET_EDITTYPE','edit') // 变更vipcn模块中editType的状态值
                }
              }
            },'编辑'),
            h('Button',{
              props: {
                size: 'small'
              },
              style: {
                marginRight: '10px'
              },
              on: {
                click: () => { // 禁用、启用按钮点击事件
                  that.handTyp = 'use'
                  that.showModal = true
                  that.nowIndex = o.index
                  that.modText = [tex + '提示','是否要' + tex + '此关键词？']
                  that.nowReply = that.pageList[o.index]
                }
              }
            },tex),
            h('Button',{
              props: {
                size: 'small'
              },
              style: {
              },
              on: {
                click: () => { // 删除按钮事件
                  that.handTyp = 'del'
                  that.showModal = true
                  that.nowIndex = o.index
                  that.modText = ['删除回复','删除后，关注该公众号的用户将不再接收该回复，确定删除？']
                  that.nowReply = that.pageList[o.index]
                }
              }
            },'删除')
          ])
        }
      },
    ]
  }
}
