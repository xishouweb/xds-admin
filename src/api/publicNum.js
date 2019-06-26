import api from './index'

// 根据类型获取分组列表
export async function queryCssGroup(params) {
  return api.post('/api/wxPublicAccount/queryCssGroup', params)
}

