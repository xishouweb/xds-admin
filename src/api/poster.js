import api from './index'

// 根据分类查询裂变海报统计列表count
export async function getFansPosterStatisticsList(params) {
  return api.post('/api/posterTemplate/getFansPosterStatisticsList', params)
}
export async function getFansPosterStatistics(params) {
  return api.post('/api/posterTemplate/getFansPosterStatistics', params)
}
// 根据分类查询裂变海报模板统计列表count	POST
export async function getFansPosterTemplateStatisticsList(params) {
  return api.post('/api/posterTemplate/getFansPosterTemplateStatisticsList', params)
}
// 获取海报列表	POST
export async function queryPosterByPage(params) {
  return api.post('/api/posterTemplate/queryPosterByPage', params)
}
// 新建或修改海报模板
export async function saveOrUpdatePostertTemplate(params) {
  return api.post('/api/posterTemplate/saveOrUpdatePostertTemplate', params)
}
// 批量删除海报模板
export async function deletePosterTemplate(params) {
  return api.post('/api/posterTemplate/deletePosterTemplate', params)
}
// 批量修改海报模板分组
export async function updatePosterTemplateGroup(params) {
  return api.post('/api/posterTemplate/updatePosterTemplateGroup', params)
}
// 获取海报模板详情
export async function getPosterTemplate(params) {
  return api.post('/api/posterTemplate/getPosterTemplate', params)
}
// 获取海报模板列表
export async function getPosterTemplateByPage(params) {
  return api.post('/api/posterTemplate/getPosterTemplateByPage', params)
}
// 公众号类型和认证状态判断
export async function validCssAppAccountType(params) {
  return api.post('/api/posterTemplate/validCssAppAccountType', params)
}
// 获取上传,修改裂变海报背景图token
export async function updateGetPosterCloudToken(params) {
  return api.post('/api/posterTemplate/updateGetPosterCloudToken', params)
}
// 新建或修改分组
export async function saveOrUpdateGroup(params) {
  return api.post('/api/posterTemplate/saveOrUpdateGroup', params)
}
// 移动分组
export async function updateGroupOrder(params) {
  return api.post('/api/posterTemplate/updateGroupOrder', params)
}
// 裂变海报模板统计
export async function getFansPosterTemplateStatisticsInfo(params) {
  return api.post('/api/posterTemplate/getFansPosterTemplateStatistics', params)
}
// 获取裂变海报详情
export async function getFansPosterInfo(params) {
  return api.post('/api/posterTemplate/getFansPosterInfo', params)
}
// 删除裂变海报模板分类
export async function deleteGroup(params) {
  return api.post('/api/posterTemplate/deleteGroup', params)
}
// 查询裂变海报模板分组列表
export async function queryCssGroup(params) {
  return api.post('/api/posterTemplate/queryCssGroup', params)
}

// 根据裂变海报id获取裂变海报图片
export async function getFansPosterImageById(params) {
  return api.post('/api/posterTemplate/getFansPosterImageById', params)
}

