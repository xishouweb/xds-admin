export default {
  columns: [
    '订购服务',
    '服务期限',
    '单价',
    '数量',
    '订购人微信',
    '实付款(元)',
    '订单状态',
    '交易操作'
  ],
  curOrderColumn: [
    '订购服务',
    '单价(元)',
    '数量',
    '订购人微信',
    '服务期限',
    '小计(元)'
  ],
  originOrderColumn: [
    '订购服务',
    '单价(元)',
    '数量',
    '实付款(元)',
    '套餐有效时间',
    '剩余服务期限',
    '抵扣小计(元)'
  ],
  payListColumn(fn) {
    return [
    {
      title: '支付单号',
      key: 'payOrderNo',
    },
    {
      title: '支付流水号',
      key: 'batchNo',
    },
    {
      title: '交易状态',
      key: 'payStatus',
      render(h, params) {
        let data = params.row
        let text = data.payStatus === 1 ? '交易成功' : '已提交'
        return h('span', text)
      }
    },
    {
      title: '实付款(元)',
      key: 'orderPayprice',
    },
    {
      title: '支付方式',
      key: 'payType',
      render(h, params) {
        let data = params.row
        let text = data.payType === 1 ? '微信公众号支付' : data.payType === 2 ? '支付宝支付' : data.payType === 3 ? '银行汇款' : '微信H5支付'
        return h('span', text)
      }
    },
    {
      title: '付款时间',
      key: 'payTime',
    },
    {
      title: '付款信息',
      render: (h, params) => {
        let data = params.row
        if (data.payType === 3) {
          return h('span', {
            class: 'cursor text_color',
            on: {
              click: () => {
                fn(data)
              }
            }
          }, '查看详情')
        }
        return h('span', '')
      }
    }
    ]
  },
  columns1: [
    '订购服务',
    '服务期限',
    '单价',
    '数量',
    '订购人微信',
    '小计'
  ],
  delTips: '您正在删除该员工，删除后绑定员工的微信用户无法进入企业，确定要删除吗？',
  startTips: '您正在启用该员工，启用后员工之前的所有操作权限恢复，确定要启用吗？',
  unbindTips: '您正在解绑该员工，解绑后员工微信不显示你的企业，确定要解绑吗？',
  forbidTips: '禁用后，所有用户无法进入该企业管理后台，无法继续服务该企业下的所有公众号。',
  detailTitle: '企业详情',
  delWithChild: '请先删除子部门',
  delWithUsers: '清先删除部门下员工',
  stopTips: '您正在停用该员工，停用后员工的所有权限都无法使用，无法登陆企业后台，确定要停用吗？'
}
