import api from './index'

// 获取所有公众号粉丝列表
export async function queryAllFans(params) {
  return api.post('/api/fans/getAllFansUserList', params)
}

// 获取所有公众号列表
export async function queryPublicAccountList(params) {
  return api.get('/api/tencent/getPublicAccountList', params)
}


// 获取所属粉丝列表
export async function queryKfGroupList(params) {
  return api.post('/api/fans/getKfFansGroupList', params)
}

// 获取粉丝详情
export async function queryFan(params) {
  return api.post('/api/fans/getFansDetail', params)
}

// 修改粉丝扩展信息
export async function updateFansExtInfo(params) {
  return api.post('/api/fans/updateFansExtInfo', params)
}
// 修改粉丝专属信息
export async function updateExclusiveSeat(params) {
  return api.post('/api/fans/updateExclusiveSeat', params)
}
// 获取筛选条件
export async function querySelectConditions(params) {
  return api.post('/api/fans/getFsSelectConditionsList', params)
}
// 获取筛选条件
export async function querySelectCondition(params) {
  return api.post('/api/fans/getFsSelectConditions', params)
}
// 获取筛选条件
export async function addSelectCondition(params) {
  return api.post('/api/fans/addFsSelectConditions', params)
}
// 删除筛选条件
export async function deleteSelectCondition(params) {
  return api.post('/api/fans/deleteFsSelectConditions', params)
}

// 根据客服Id获取公众号列表
export async function queryPublicsBySeat(params) {
  return api.post('/api/fans/getPublicBySeat', params)
}

// 根据所有标签
export async function queryTags(params) {
  return api.post('/api/fans/getWxGroupAndTagList', params)
}


//
export async function updateWxGroupByOrder(params) {
  return api.post('/api/fans/updateWxGroupByOrder', params)
}
//
export async function updateWxGroup(params) {
  return api.post('/api/fans/updateWxGroup', params)
}

//
export async function saveWxGroup(params) {
  return api.post('/api/fans/saveWxGroup', params)
}

//
export async function deleteWxGroup(params) {
  return api.post('/api/fans/deleteWxGroup', params)
}

// 获取粉丝标签
export async function getTagsBySeatId(params) {
  return api.post('/api/fans/getTagsBySeatId', params)
}

export async function updateBatchSetUserTag(params) {
  return api.post('/api/fans/updateBatchSetUserTag', params)
}
export async function getSeatList(params) {
  return api.post('/api/fans/getSeatList', params)
}

export async function updateKfSeatSet(params) {
  return api.post('/api/fans/updateKfSeatSet', params)
}

export async function updateKfSeat(params) {
  return api.post('/api/fans/updateKfSeat', params)
}

export async function updateWxGroupByMove(params) {
  return api.post('/api/fans/updateWxGroupByMove', params)
}

export async function updateBatchSetFansUserTagSingle(params) {
  return api.post('/api/fans/updateBatchSetFansUserTagSingle', params)
}
export async function updateWxGroupByMoveSingle(params) {
  return api.post('/api/fans/updateWxGroupByMoveSingle', params)
}
export async function updateFansKfSeatId(params) {
  return api.post('/api/fans/updateFansKfSeatId', params)
}

// 发起会话
export async function createConversation(params) {
  return api.post('/api/fans/createConversation', params)
}

// 会话互动统计
export async function getConversationStatistics(params) {
  return api.post('/api/fans/getInteractiveStatistics', params)
}
// 粉丝轨迹
export async function getFansRecord(params) {
  return api.post('/api/fans/getConversationMessageByGroup', params)
}

// 省市区接口
export async function queryProvince(params) {
  return api.post('/api/fans/updateWxGroupByMove', params)
}

export async function queryCity(params) {
  return api.post('/api/fans/updateFansKfSeatId', params)
}

export async function deleteFans(params) {
  return api.post('/api/fans/deleteFans', params)
}

// 同步粉丝
export async function syncFans(params) {
  return api.post('/api/tencent/updateCssWxPublicAccountDataToDb', params)
}
// 渠道二维码
// 查询渠道二维码分组列表
export async function queryQrcodeGroup(params) {
  return api.post("/api/channelQrCode/queryCssGroupM", params)
}
// 查询渠道二维码主题列表
export async function getGchannelQrCodeThemeListByPage(params) {
  return api.post("/api/channelQrCode/getGchannelQrCodeThemeListByPage", params)
}
// 查询渠道二维码列表
export async function getGchannelQrCodeListByPage(params) {
  return api.post("/api/channelQrCode/getGchannelQrCodeListByPage", params)
}

// 裂变海报
// 查询裂变海报模板分组列表
export async function queryPosterGroup(params) {
  return api.post('/api/posterTemplate/queryCssGroup', params)
}
// 获取海报模板列表
export async function getPosterTemplateByPage(params) {
  return api.post('/api/posterTemplate/getPosterTemplateByPage', params)
}
