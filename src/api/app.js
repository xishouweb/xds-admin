import api from './index'

export async function queryPublicAccountList(params) {
  return api.get('/api/tencent/getPublicAccountList', params)
}
// 根据业务类型获取腾讯云cos文件访问域名 刘源
export async function queryQcCloudUrlRequestName(params) {
  return api.post('/api/wxPublicAccount/queryQcCloudUrlRequestName', params).then(res => res.data)
}
