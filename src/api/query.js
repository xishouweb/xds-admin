/**
 * Created by workpc on 18/1/29.
 */

import api from './index'
// import {this.getCookie} from '../utils/cookies'
const apiHost = ''
// 预览上传的fastfds服务的文件
// const preview_file = process.env.FILESERVER_ROOT
// 上传名片
export const uploadPostcard = (params) => api.get(apiHost + '/uploadpostcard', params)
// 下载名片
export const downloadPostcard = (params) => {
    let downLoadUrl = "/downloadpostcard" + '?' + params.fileName + "=" + params.filePath
    window.location.href = downLoadUrl
}
// 获得sessionId
export const getSessionId = () => api.get(apiHost + '/api/getSessionId')

// 生成二维码
export const getTmpQrcode = (params) => api.get(apiHost + '/api/adminUser/getTmpQrcode', params)
// 获取用户信息,企业信息等
export const getSession = () => {
    // this.localStorageSaveOrRead("loginFlag", "0", 1)
    // let loginFlag = this.localStorageSaveOrRead("loginFlag")

    return api.get(apiHost + '/api/adminUser/getSession')
}
// 获取默认免费信息 套餐id 套餐角色id 官方appid对应的accountid
export const getDefaultInfo = () => api.get(apiHost + '/api/adminUser/getDefaultInfo')
// 生成验证码
export const resendCode = (params) => api.get(apiHost + '/api/adminUser/resendCode', params)
// 加载系统配置内容树
export const loadTConfigListTree = (params) => api.get(apiHost + '/api/adminUser/loadTConfigListTree', params)
// 加载系统配置内容树
export const getValueByKeyAndPv = (params) => api.get(apiHost + '/api/adminUser/getValueByKeyAndPv', params)
// 保存创建公司申请
export const saveCorpCreateApply = (params) => api.get(apiHost + '/api/adminUser/saveCorpCreateApply', params)
// 获取当前用户创建或加入（中） 与 审核通过的 公司列表
export const getUserCorpAuthMulti = (params) => api.get(apiHost + '/api/adminCenter/getUserCorpAuthMulti', params)
// 修改企业名称
export const getTXCloudTokenByUploadCorpLogo = (params) => api.post(apiHost + '/api/adminCenter/getTXCloudTokenByUploadCorpLogo', params)
// 修改企业名称
export const updateCorpName = (params) => api.get(apiHost + '/api/adminCenter/updateCorpName', params)
// 个人信息修改
export const editUser = (params) => api.get(apiHost + '/api/adminCenter/editUser', params)
// 离开公司
export const savelogoutCompany = (params) => api.get(apiHost + '/api/adminCenter/savelogoutCompany', params)
// 修改公司和公司申请状态
export const updateCorpStatusByCorpId = (params) => api.get(apiHost + '/api/adminCenter/updateCorpStatusByCorpId', params)
// 新建企业检查
export const checkCreateCorpApply = () => api.get(apiHost + '/api/adminCenter/checkCreateCorpApply')
// 退出
export const logout = () => api.get(apiHost + '/api/adminCenter/logout')
// 修改绑定手机号,同时校验验证码
export const updateCorpMobileById = (params) => api.get(apiHost + '/api/adminCenter/updateCorpMobileById', params)
// 扫描二维码后,查看扫描结果
export const getScanResult = (params) => api.get(apiHost + '/api/adminCenter/getScanResult', params)
// 获取个人信息
export const getPersonalInfo = () => api.get(apiHost + '/api/adminCenter/getPersonalInfo')
// 获得关键指标
export const getKeyIndicators = (params) => api.get(apiHost + '/api/survey/getKeyIndicators', params)
// 获得公司状态
export const queryCompanyStats = (params, isSaveToken) => api.get(apiHost + '/api/survey/queryCompanyStats', params, isSaveToken)
// 进入公司信息
export const saveloginCompany = (params, isSaveToken) => api.get(apiHost + '/api/survey/saveloginCompany', params, isSaveToken)
// 获取公司统计信息
export const getCorpStatisticsInfo = (params) => api.get(apiHost + '/api/survey/getCorpStatisticsInfo', params)
// 根据id查询公司套餐
export const queryCorpPackageById = (params) => api.get(apiHost + '/api/survey/queryCorpPackageById', params)
// 查看授权状态
export const updateBindCorp = (params) => api.get(apiHost + '/api/survey/updateBindCorp', params)
// 获取公众号列表
export const getPublicAccountList = (params) => api.get(apiHost + '/api/tencent/getPublicAccountList', params)
// 判断是否可以添加公众号
export const checkAppIdNum = () => api.get(apiHost + '/api/tencent/checkAppIdNum')
// 删除微信公众号
export const updateCssWxPublicAccountStatusToDelete = (params) => api.get(apiHost + '/api/tencent/updateCssWxPublicAccountStatusToDelete', params)
// 操作解除授权按钮停用微信公众号
export const updateCssWxPublicAccountToAuthBlockUp = (params) => api.get(apiHost + '/api/tencent/updateCssWxPublicAccountToAuthBlockUp', params)
// 操作停用按钮停用微信公众号
export const updateCssWxPublicAccountToBlockUp = (params) => api.get(apiHost + '/api/tencent/updateCssWxPublicAccountToBlockUp', params)
// 禁用微信公众号
export const updateCssWxPublicAccountToDisabled = (params) => api.get(apiHost + '/api/tencent/updateCssWxPublicAccountToDisabled', params)
// 启用微信公众号
export const updateCssWxPublicAccountToActive = (params) => api.get(apiHost + '/api/tencent/updateCssWxPublicAccountToActive', params)
// 公众号信息一键同步
export const updateCssWxPublicAccountDataToDb = (params) => api.post(apiHost + '/api/tencent/updateCssWxPublicAccountDataToDb', params)
// 停用某用户
export const stopUser = (params) => api.get(apiHost + '/api/survey/getAuthUrl', params)
// 启用某用户
export const startUser = (params) => api.get(apiHost + '/api/survey/getAuthUrl', params)
// 删除用户
export const delUser = (params) => api.get(apiHost + '/api/survey/getAuthUrl', params)
// 修改某用户
export const modifyUser = (params) => api.get(apiHost + '/api/survey/getAuthUrl', params)
// 将某用户置顶
export const setTopUser = (params) => api.get(apiHost + '/api/survey/getAuthUrl', params)
// 解绑用户
export const unbindUser = (params) => api.get(apiHost + '/api/survey/getAuthUrl', params)
// 用来生成第三方授权url
export const getAuthUrl = (params) => api.get(apiHost + '/api/survey/getAuthUrl', params)
// 获取坐席列表
export const getIntoSeatList = (params) => api.get(apiHost + '/api/seats/getIntoSeatList', params)
// 点击添加坐席生成坐席编号
export const saveSeatNo = (params) => api.get(apiHost + '/api/seats/saveSeatNo', params)
// 保存坐席接口
export const saveSeat = (params) => api.post(apiHost + '/api/seats/saveSeat', params)
// 修改坐席接口
export const updateSeat = (params) => api.post(apiHost + '/api/seats/updateSeat', params)
// 获取坐席详情接口
export const getSeatDetail = (params) => api.get(apiHost + '/api/seats/getSeatDetail', params)
// 查询坐席列表接口
export const getSeatList = (params) => api.get(apiHost + '/api/seats/getSeatList', params)
// 批量为坐席修改公众号权限
export const updateSeatAuthByBatch = (params) => api.post(apiHost + '/api/seats/updateSeatAuthByBatch', params)
// 解除授权/停用/批量停用/启用统一调用接口
export const updateSeatStatus = (params) => api.post(apiHost + '/api/seats/updateSeatStatus', params)
// 查询公司套餐的权限列表
export const queryCorpPackRoleList = (params) => api.get(apiHost + '/api/survey/queryCorpPackRoleList', params)
// 修改坐席基本信息接口
export const updateSeatBaseInfo = (params) => api.get(apiHost + '/api/seats/updateSeatBaseInfo', params)
// 修改坐席权限接口
export const updateSeatAuth = (params) => api.post(apiHost + '/api/seats/updateSeatAuth', params)
// 修改个性化坐席接口
export const updateConditionalSeat = (params) => api.post(apiHost + '/api/seats/updateConditionalSeat', params)
// 是否存在待支付订单
export const getExistOrder = (params) => api.get(apiHost + '/api/pay/getExistOrder', params)
// 获取公司当前订购服务
export const getCurOrderDetail = (params) => api.get(apiHost + '/api/pay/getCurOrderDetail', params)
// 保存订单
export const saveOrderInfo = (params) => api.get(apiHost + '/api/pay/saveOrderInfo', params)
// 保存创建公司并创建订单
export const saveCorpCreateApplyForOrder = (params) => api.get(apiHost + '/api/pay/saveCorpCreateApplyForOrder', params)
// 进入确认付款页,扫码支付后,轮询查询订单简单详情
export const getSimpleDetail = (params) => api.get(apiHost + '/api/pay/getSimpleDetail', params)
// 订单详情(管理平台)
export const getOrderDetail = (params) => api.get(apiHost + '/api/pay/getOrderDetail', params)
// 付款凭证确认银行汇款
export const savePayVoucherTradeOrder = (params) => api.get(apiHost + '/api/pay/savePayVoucherTradeOrder', params)
// 付款方名称账号确认银行汇款
export const saveAccountTradeOrder = (params) => api.get(apiHost + '/api/pay/saveAccountTradeOrder', params)
// 是否能上传凭证
export const isCanPayVoucher = (params) => api.get(apiHost + '/api/pay/isCanPayVoucher', params)

export const saveWebAdminLoginBySession = (params) => api.post(apiHost + '/api/client/login/saveLoginBySession', params)
