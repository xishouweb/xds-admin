import api from './index'

// getTree: "/api/stuff/getTree", // 获取部门树
export async function getTree(params) {
  return api.post('/api/stuff/getTree', params)
}
// creatApart: "/api/stuff/creatApart", // 创建部门
export async function creatApart(params) {
  return api.post('/api/stuff/creatApart', params)
}
// delApart: "/api/stuff/delApart", // 删除部门
export async function delApart(params) {
  return api.post('/api/stuff/delApart', params)
}
// getUsers: "/api/stuff/getUsers", // 获取部门下的员工（包括查询）
export async function getUsers(params) {
  return api.post('/api/stuff/getUsers', params)
}
// modifyApart: "/api/stuff/modifyApart", // 修改部门
export async function modifyApart(params) {
  return api.post('/api/stuff/modifyApart', params)
}
// addApart: "/api/stuff/addApart", // 修改部门
export async function getFansPosterStatisticsList(params) {
  return api.post('/api/stuff/getTree', params)
}
// addUser: "/api/stuff/addUser", //  添加员工
export async function addUser(params) {
  return api.post('/api/stuff/addUser', params)
}
// setTopUser: "/api/stuff/setTopUser", // 置顶用户
export async function setTopUser(params) {
  return api.post('/api/stuff/setTopUser', params)
}
// cancelTopUser: "/api/stuff/cancelTopUser", // 取消置顶用户
export async function cancelTopUser(params) {
  return api.post('/api/stuff/cancelTopUser', params)
}
// searchOption: "/api/stuff/searchOption", // 查询列表内容
export async function searchOption(params) {
  return api.post('/api/stuff/searchOption', params)
}
// moveApart: "/api/stuff/moveApart", // 移动部门
export async function moveApart(params) {
  return api.post('/api/stuff/moveApart', params)
}


