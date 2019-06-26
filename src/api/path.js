
import tencent from './tencent'
import fylPath from './fylPath'

const api = "/api"
const ENV_URL = process.env.MOBILE_BASE_URL
const CHAT_URL = process.env.CHAT_BASE_URL
export default {
  ENV_URL: ENV_URL,
  CHAT_URL,
  uploadfile: api + "/uploadfile",
  downloadfile: api + "/downloadfile",

  getTree: api + "/stuff/getTree", // 获取部门树
  creatApart: api + "/stuff/creatApart", // 创建部门
  delApart: api + "/stuff/delApart", // 删除部门
  getUsers: api + "/stuff/getUsers", // 获取部门下的员工（包括查询）
  modifyApart: api + "/stuff/modifyApart", // 修改部门
  addApart: api + "/stuff/addApart", // 修改部门
  addUser: api + "/stuff/addUser", //  添加员工
  setTopUser: api + "/stuff/setTopUser", // 置顶用户
  cancelTopUser: api + "/stuff/cancelTopUser", // 取消置顶用户
  searchOption: api + "/stuff/searchOption", // 查询列表内容
  moveApart: api + "/stuff/moveApart", // 移动部门

  formWecode: api + "/stuff/formWecode", // 生成邀请二维码
  unbindUser: api + "/stuff/unbindUser",
  isAddUserAvail: api + "/stuff/isAddUserAvail", // 查询是否可以添加员工
  processUser: api + "/stuff/processUser", // 批量停用启用删除员工
  modifyUserDetail: api + "/stuff/modifyUserDetail", // 修改员工详情
  modifyUserRole: api + "/stuff/modifyUserRole", // 修改员工角色
  userRightsList: api + "/stuff/userRightsList", // 员工权限列表
  userDetail: api + "/stuff/userDetail", // 查询员工详情
  setUserZuoxi: api + "/stuff/setUserZuoxi", // 员工分配坐席
  addRights: api + "/stuff/addRights", // 添加权限
  updateRole: api + "/stuff/updateRole", // 保存或更新角色
  addMultiRights: api + "/stuff/addMultiRights", // 根据角色添加多个权限
  createCompany: api + "/stuff/createCompany", // 创建公司
  enterCompany: api + "/stuff/enterCompany", // 进入公司
  getRightsList: api + "/stuff/getRightsList", // 查询公司套餐的权限列表
  zuoxiList: api + "/stuff/zuoxiList", // 获取坐席列表
  // 坐席相关
  getSeat: api + "/seats/getIntoSeatList", // 企业端进入坐席管理接口（坐席列表）
  getPhotoToken: api + "/seats/getTXCloudTokenByUploadSeatHeadImg", // 获取上传坐席头像token
  /**
    订单相关
   */
  dateList: api + "/order/dateList", // 时间列表相关
  menuList: api + "/order/menuList", // 套餐列表
  recordsList: api + "/order/recordsList", // 订单列表
  orderStatus: api + "/order/orderStatus", // 订单状态列表
  orderDetail: api + "/order/orderDetail", // 订单详情
  usingMenu: api + "/order/usingMenu", // 原订单

  /* 自动回复 */
  replyList: api + "/autoreplyRule/getCssAutoreplyRuleListByPage", // 关键词回复(列表)
  replyAdd: api + "/autoreplyRule/saveOrUpdateCssAutoreplyRule", // 关键词回复(添加、修改、禁/启用)
  replyDelRule: api + "/autoreplyRule/deleteCssAutoreplyRule", // 关键词回复规则(删除规则)
  replyDetail: api + "/autoreplyRule/getCssAutoreplyRuleInfo", // 关键词回复规则(详情)
  replyDelCont: api + "/autoreplyRule/deleteCssAutoreplyRuleContent", // 关键词回复规则(删除回复内容)
  replySort: api + "/autoreplyRule/updateCssAutoreplyRuleContentOrder", // 关键词回复(修改顺序)
  replyUpdata: api + "/autoreplyRule/saveOrUpdateAutoreplyTypeCssAutoreplyRule", // 被关注回复 与 收到消息回复 (添加、修改)
  replySeach: api + "/autoreplyRule/getCssAutoreplyRuleByAutoreplyType", // 被关注回复 与 收到消息回复 (查询)
  replyDel: api + "/autoreplyRule/deleteAutoreplyTypeCssAutoreplyRule", // 被关注回复 与 收到消息回复 (删除)
  replyState: api + "/autoreplyRule/getCssAutoreplyRuleStatus", // 三类自动回复状态:是否开启 (查询)
  replyUpState: api + "/autoreplyRule/updateCssAutoreplyRuleStatus", // 三类自动回复状态 (修改)
  replyNum: api + "/autoreplyRule/getAutoreplyRuleMaxCount", // 获取自动回复数量

  /**
   * 设置》分配规则、接待组设置
   */
  getSetting: api + "/corp/item/getCorpItemValueByCorpSystem", // 获取设置信息
  setSetting: api + "/corp/item/updateCorpItemValueByCorpSystem", // 修改设置信息
  getReception: api + "/corp/item/getCorpItemValueByCorpAppId", // 获取接待组设置信息
  setReception: api + "/corp/item/updateCorpItemValueByCorpAppId", // 修改接待组设置信息
  getSeatList: api + "/seats/getSeatList", // 获取坐席列表

  // getSwitch: api + "/corp/item/load", // 获取开关状态
  // setSwitch: api + "/corp/item/save", // 设置开关状态
  // initSeting: api + "/corp/item/saveInitSeting", // （分配规则、接待组设置、会话设置）生成默认设置

  /* 消息群发 */
  addTemplateMass: api + "/cssGroupSending/saveOrUpdatecssGroupSendingTemplate", // 模板消息群发（新增、修改）
  addServiceMass: api + "/cssGroupSending/saveCssGroupSending", // 高级、客服消息群发（新增）
  upServiceMass: api + "/cssGroupSending/updateCssGroupSending", // 高级、客服消息群发（修改）
  getMassNum: api + "/cssGroupSending/getNounData", // 高级、客服、模板消息群发（配额信息）
  delMass: api + "/cssGroupSending/deleteCssGroupSending", // 高级、客服、模板消息群发（删除）
  cancesSend: api + "/cssGroupSending/cancelCssGroupSending", // 高级、客服、模板消息群发（取消发送）
  getMassList: api + "/cssGroupSending/getCssGroupSendingListByPage", // 高级、客服、模板消息群发（获取列表）
  getMassInfo: api + "/cssGroupSending/getCssGroupSendingInfo", // 高级、客服、模板消息群发（获取详情）
  getFansCount: api + "/cssGroupSending/getFansUserCount", // 获取群发预估人数
  getSeatId: api + "/cssGroupSending/getSeatId", // 获取当前用户的坐席id

  ...fylPath,
  ...tencent
}
