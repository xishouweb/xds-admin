const apiHost = '/api'
export default {
  existOrder: apiHost + "/pay/getExistOrder",
  cancelOrder: apiHost + "/pay/getCancelOrder",
  // 修改公司logo
  updateCorpLogo: apiHost + "/set/updateCorpLogo",
  // 企业端公众号查询同步状态
  queryCssSynList: apiHost + "/tencent/queryCssSynList",
  // 获取公司混合信息
  getCorpInfoMulti: apiHost + "/set/getCorpInfoMulti",
  // 查询公司，套餐，员工状态
  getCorpEmpPacStatus: apiHost + "/set/getCorpEmpPacStatus",
  // 修改公司省市区
  updateCorpAddress: apiHost + "/set/updateCorpAddress",
  // 修改管理员员工姓名
  updateAdminEmployeeName: apiHost + "/set/updateAdminEmployeeName",
  // 删除图片
  deleteuploadfile: apiHost + "/deleteuploadfile",
  // 上传图片
  upload: apiHost + "/upload",
  // 查看图片
  overview: apiHost + "/overview",

  queryTItemValueByPager: apiHost + "/survey/queryTItemValueByPager",
  // 获取自定义菜单列表
  getWxMenuList: apiHost + "/customMenu/getWxMenuList",
  // 新增自定义菜单
  saveWxMenu: apiHost + "/customMenu/saveWxMenu",
  // 自定义菜单修改
  updateWxMenu: apiHost + "/customMenu/updateWxMenu",
  // 自定义菜单删除
  deleteWxMenu: apiHost + "/customMenu/deleteWxMenu",
  // 自定义菜单保存并发布
  saveAndPublishWxMenu: apiHost + "/customMenu/saveAndPublishWxMenu",
  // 自定义菜单保存并发布
  updateIdxOrder: apiHost + "/customMenu/updateIdxOrder",
  saveBatchWxMenu: apiHost + '/customMenu/saveBatchWxMenu', // 批量保存菜单
  // 自定义菜单同步
  updateWxMenuBySysn: apiHost + "/customMenu/updateWxMenuBySysn",
  queryCssMediaImgList: apiHost + "/customMenu/queryCssMediaImgList",
  queryCssGroup: apiHost + "/customMenu/queryCssGroup",
  // 个性化菜单保存并发布
  updateAndPublishWxMenu: apiHost + "/wechat/wxMenuMatchRule/updateAndPublishWxMenu",
  // updateAndPublishWxMenu: apiHost + "/wechat/updateAndPublishWxMenu",
  // 模板消息
  queryTemplateCssGroup: apiHost + "/templateMsg/queryTemplateCssGroup",
  deleteTemplateGroup: apiHost + "/templateMsg/deleteTemplateGroup",
  saveOrUpdateGroup: apiHost + "/templateMsg/saveOrUpdateGroup",
  updateGroupOrder: apiHost + "/templateMsg/updateGroupOrder",
  getCustomTemplateListByPage: apiHost + "/templateMsg/getCustomTemplateListByPage",
  getCssCustomTemplateInfo: apiHost + "/templateMsg/getCssCustomTemplateInfo",
  saveOrUpdateCssCustomTemplate: apiHost + "/templateMsg/saveOrUpdateCssCustomTemplate",
  deleteCssCustomTemplate: apiHost + "/templateMsg/deleteCssCustomTemplate",
  syncWechatTemplateList: apiHost + "/templateMsg/syncWechatTemplateList",
  getWechatTemplateList: apiHost + "/templateMsg/getWechatTemplateList",
  getWechatTemplate: apiHost + "/templateMsg/getWechatTemplate",
  // updateAndPublishWxMenu: apiHost + "/api/wechat/wxMenuMatchRule/updateAndPublishWxMenu",
  // 个性化菜单新增
  personSaveWxMenu: apiHost + "/wechat/wxMenuMatchRule/saveWxMenu",
  getUnPublishWxMenuList: apiHost + "/wechat/wxMenuMatchRule/getUnPublishWxMenuList", // 未添加自定义规则的菜单
  isCanSaveCustomerMenu: apiHost + "/wechat/wxMenuMatchRule/isCanSaveCustomerMenu", // 能否新建个性化菜单
  // 个性化菜单新增修改校验
  checkMathRuleData: apiHost + "/wechat/wxMenuMatchRule/checkMathRuleData",
  // '个性化菜单新增并保存'
  personSaveAndPublishWxMenu: apiHost + "/wechat/wxMenuMatchRule/saveAndPublishWxMenu",
  // // 获取公众号下所有标签分组及标签信息
  // getWxGroupAndTagList: apiHost + "/wechat/getWxGroupAndTagList",
  // 知识库
  queryKnowledgeBaseListByPage: apiHost + '/repository/queryKnowledgeBaseListByPage', // 知识库列表分页（包含搜索以及点击分组）
  updateOrSaveCorpKnowledgeBase: apiHost + '/repository/updateOrSaveCorpKnowledgeBase', // 知识库更新或者保存
  delCorpKnowledgeBase: apiHost + '/repository/delCorpKnowledgeBase', // 删除知识库
  saveOrUpdateCorpKnowledgeBaseGroup: apiHost + '/repository/saveOrUpdateCorpKnowledgeBaseGroup', // 更新或者保存知识库分组
  delCorpKnowledgeBaseGroup: apiHost + '/repository/delCorpKnowledgeBaseGroup', // 删除知识库分组
  changeCorpKnowledgeBaseGroupSort: apiHost + '/repository/changeCorpKnowledgeBaseGroupSort', // 调整知识库分组排序
  queryKnowledgeBaseGroupListInfo: apiHost + '/repository/queryKnowledgeBaseGroupListInfo', // 知识库分组列表以及总条数
  moveKnowledgeBase: apiHost + '/repository/moveKnowledgeBase', // 知识库移动
  delCorpKnowledgeBaseByIds: apiHost + '/repository/delCorpKnowledgeBaseByIds', // 根据ids批量删除知识库
  checkKnowledgeBaseGroup: apiHost + '/repository/checkKnowledgeBaseGroup', // 知识库分组检测
  // 粉丝标签
  getWxGroupAndTagList: apiHost + '/fansTag/getWxGroupAndTagList', // 获取公众号下所有标签分组及标签信息
  addOrUpdateWxTagGroup: apiHost + '/fansTag/addOrUpdateWxTagGroup ', // 添加或修改标签分组
  updateWxGroupSort: apiHost + '/fansTag/updateWxGroupSort ', // 上移下移修改分组操作
  deleteWxTagGroup: apiHost + '/fansTag/deleteWxTagGroup', // 删除标签分组
  getWxAppAccountList: apiHost + '/fansTag/getWxAppAccountList ', // 点击复制标签分组接口获取公众号列表
  updateCopyTagGroupFromOtherAppId: apiHost + '/fansTag/updateCopyTagGroupFromOtherAppId', // 复制标签分组
  updateCopyTagFromOtherAppId: apiHost + '/fansTag/updateCopyTagFromOtherAppId ', // 复制标签
  addOrUpdateWxTag: apiHost + '/fansTag/addOrUpdateWxTag', // 添加或修改标签
  updateWxTagSort: apiHost + '/fansTag/updateWxTagSort ', // 左右移动修改标签位置操作
  deleteWxTag: apiHost + '/fansTag/deleteWxTag ', // 删除标签
  updateWxTagGroup: apiHost + '/fansTag/updateWxTagGroup', // 设置标签分组
  getAndCheckTagAndTagGroup: apiHost + '/fansTag/getAndCheckTagAndTagGroup', // 设置标签分组
}
