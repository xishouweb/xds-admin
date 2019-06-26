import api from "./index"

// 获取客服集合 yhc
export async function getKfSeatList(params) {
  return api.post("/api/adminstatics/getKfSeatList",params)
}
// 分页查询统计记录
export async function getSeatConvrStatisticsPagination(params) {
    return api.post("/api/adminstatics/getSeatConvrStatisticsPagination",params)
}
// 查询统计记录列表
export async function getSeatConvrStatisticsList(params) {
    return api.post("/api/adminstatics/getSeatConvrStatisticsList",params)
}
// 获取总统计
export async function getRepSeatConvrStatistics(params) {
    return api.post("/api/adminstatics/getRepSeatConvrStatistics",params)
}
// 获取今天统计记录
export async function getRepSeatConvrToday(params) {
    return api.post("/api/adminstatics/getRepSeatConvrToday",params)
}
// 查询总统计
export async function getRepAppaccountConvrStatistics(params) {
    return api.post("/api/adminstatics/getRepAppaccountConvrStatistics",params)
}
// 获取会话统计列表
export async function getAppaccountConvrStatisticsList(params) {
    return api.post("/api/adminstatics/getAppaccountConvrStatisticsList",params)
}
// 分页获取应用号会话统计
export async function getAppaccountConvrStatisticsPagination(params) {
    return api.post("/api/adminstatics/getAppaccountConvrStatisticsPagination",params)
}
// 获取当天会话统计
export async function getRepAppaccountConvrToday(params) {
    return api.post("/api/adminstatics/getRepAppaccountConvrToday",params)
}

// 根据时间段和公众号id列表获取统计结果 hhd
export async function getPublicAccountUserPage(params) {
  return api.post("/api/adminstatics/getPublicAccountUserPage", params)
}
// 获取统计总数 hhd
export async function getPublicAccountUserCount(params) {
  return api.post("/api/adminstatics/getPublicAccountUserCount", params)
}
// 获取昨日统计总数
export async function getPublicAccountUserYesterdayCount(params) {
  return api.post("/api/adminstatics/getPublicAccountUserYesterdayCount", params)
}

