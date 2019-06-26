import api from "./index"

// 公众号类型和认证状态判断
export async function validCssAppAccountType(params) {
  return api.post("/api/channelQrCode/validCssAppAccountType", params)
}
// 移动二维码主题到指定分组
export async function updateThemeToGroup(params) {
  return api.post("/api/channelQrCode/updateThemeToGroup", params)
}

// 查询公众号下客服列表
export async function selectAllSeat(params) {
  return api.post("/api/channelQrCode/selectAllSeat", params)
}

// 查询公众号下客服列表
export async function selectAllDept(params) {
  return api.post("/api/channelQrCode/selectAllDept", params)
}

// 查询所有的员工（带搜索
export async function selectAllEmployee(params) {
  return api.post("/api/channelQrCode/selectAllEmployee", params)
}

// 根据id集合删除二维码
export async function deleteGchannelQrCodeByIds(params) {
  return api.post("/api/channelQrCode/deleteGchannelQrCodeByIds", params)
}

// 根据二维码查询二维码详情
export async function queryGchannelQrCodeById(params) {
  return api.post("/api/channelQrCode/queryGchannelQrCodeById", params)
}

// 查询渠道二维码列表
export async function getGchannelQrCodeListByPage(params) {
  return api.post("/api/channelQrCode/getGchannelQrCodeListByPage", params)
}

// 获取已使用的二维码数量和套餐二维码总数量
export async function getQrCodeNum(params) {
  return api.post("/api/channelQrCode/getQrCodeNum", params)
}

// 修改渠道二维码
export async function updateGchannelQrCode(params) {
  return api.post("/api/channelQrCode/updateGchannelQrCode", params)
}

// 新增二维码
export async function saveQrCode(params) {
  return api.post("/api/channelQrCode/saveQrCode", params)
}

// 能否新增二维码
export async function canSaveQrCode(params) {
  return api.post("/api/channelQrCode/canSaveQrCode", params)
}

// 删除二维码主题分类
export async function deleteGroup(params) {
  return api.post("/api/channelQrCode/deleteGroupM", params)
}

// 查询渠道二维码分组列表
export async function queryCssGroup(params) {
  return api.post("/api/channelQrCode/queryCssGroupM", params)
}

// 删除二维码主题
export async function deleteGchannelQrCodeTheme(params) {
  return api.post("/api/channelQrCode/deleteGchannelQrCodeTheme", params)
}

// 添加或修改二维码主题
export async function saveOrUpdateGchannelQrCodeTheme(params) {
  return api.post("/api/channelQrCode/saveOrUpdateGchannelQrCodeTheme", params)
}

// 查询渠道二维码主题列表
export async function getGchannelQrCodeThemeListByPage(params) {
  return api.post("/api/channelQrCode/getGchannelQrCodeThemeListByPage", params)
}

// 获取部门员工
export async function getAllDeptAndEmp(params) {
  // return api.post("/api/stuff/getTree", params)
  return api.post("/api/channelQrCode/getAllDeptAndEmp", params)
}


//
export async function getChannelQrCodeThemeStatisticsList(params) {
  return api.post("/api/channelQrCode/getChannelQrCodeThemeStatisticsList", params)
}

//
export async function getChannelQrCodeThemeStatistics(params) {
  return api.post("/api/channelQrCode/getChannelQrCodeThemeStatistics", params)
}

//
export async function getChannelQrCodeStatisticsList(params) {
  return api.post("/api/channelQrCode/getChannelQrCodeStatisticsList", params)
}

//
export async function getChannelQrCodeStatistics(params) {
  return api.post("/api/channelQrCode/getChannelQrCodeStatistics", params)
}

// 下载指定大小的渠道二维码图片
export async function getChannelQrCodeImage(params) {
  return api.post("/api/channelQrCode/getChannelQrCodeImage", params)
}

// 智能接待部分
// 获取智能接待配置信息
export async function updateQueryIntelligentReception(params) {
  return api.post("/api/intelligentReception/updateQueryIntelligentReception", params)
}

// 修改智能接待配置信息
export async function updateScenesSet(params) {
  return api.post("/api/intelligentReception/updateScenesSet", params)
}

// 获取智能接待任务列表
export async function queryTaskList(params) {
  return api.post("/api/intelligentReception/queryTaskList", params)
}

// 判断能否新建接待任务
export async function canSaveTask(params) {
  return api.post("/api/intelligentReception/canSaveTask", params)
}

// 新建智能接待任务
export async function saveIntelligentReceptionTask(params) {
  return api.post("/api/intelligentReception/saveIntelligentReceptionTask", params)
}

// 修改智能接待任务
export async function updateIntelligentReceptionTask(params) {
  return api.post("/api/intelligentReception/updateIntelligentReceptionTask", params)
}

// 删除智能接待任务
export async function deleteIntelligentReceptionTask(params) {
  return api.post("/api/intelligentReception/deleteIntelligentReceptionTask", params)
}
