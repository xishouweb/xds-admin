let api = '/api'
export default {
  // 个性化
  getWxMenuList: api + "/wechat/wxMenu/getWxMenuList", // 个性化菜单列表
  getWxMenuListByPage: api + "/wechat/wxMenuMatchRule/getWxMenuListByPage", // 个性化菜单列表(分页)
  saveWxMenu: api + "/wechat/wxMenuMatchRule/saveWxMenu", // 个性化菜单新增
  saveAndPublishWxMenu: api + "/wechat/wxMenuMatchRule/saveAndPublishWxMenu", // 个性化菜单新增并保存
  deleteWxMenu: api + "/wechat/wxMenuMatchRule/deleteWxMenu", // 个性化菜单删除
  updateWxMenuDisable: api + "/wechat/wxMenuMatchRule/updateWxMenuDisable", // 个性化菜单禁用
  updateWxMenuEnable: api + "/wechat/wxMenuMatchRule/updateWxMenuEnable", // 个性化菜单启用
  updateAndPublishWxMenu:
    api + "/wechat/wxMenuMatchRule/updateAndPublishWxMenu", // 个性化菜单修改保存并发布
  // 素材管理
  queryMediaExited: api + "/wxPublicAccount/queryMediaExited",
  autoSaveMedia: api + "/wxPublicAccount/autoSaveMedia",
  saveMedia: api + "/wxPublicAccount/saveMedia", // 新增其他素材
  updateMedia: api + "/wxPublicAccount/updateMedia", // 修改其他素材
  deleteMedia: api + "/wxPublicAccount/deleteMedia", // 删除素材
  getCssFileList: api + "/wxPublicAccount/getCssFileList", // 个性化获取文件列表单启用
  saveOrUpdateCssFile: api + "/wxPublicAccount/saveOrUpdateCssFile", // 添加或修改文件
  deleteCssFile: api + "/wxPublicAccount/deleteCssFile", // 删除文件
  saveOrUpdateGroup: api + "/wxPublicAccount/saveOrUpdateGroup", // 新建或修改分组
  deleteGroup: api + "/wxPublicAccount/deleteGroup", // 删除分组
  updateGroupOrder: api + "/wxPublicAccount/updateGroupOrder", // 移动分组
  queryCssGroup: api + "/wxPublicAccount/queryCssGroup", // 根据类型获取分组列表
  queryCssMediaVoiceList: api + "/wxPublicAccount/queryCssMediaVoiceList", // 获取语音素材列表
  queryCssMediaImgList: api + "/wxPublicAccount/queryCssMediaImgList", // 获取图片素材列表
  queryCssMediaNewsList: api + "/wxPublicAccount/queryCssMediaNewsList", // 获取图文素材列表
  queryCssMediaVideoList: api + "/wxPublicAccount/queryCssMediaVideoList", // 获取视屏素材列表
  getCssWxMediaInfo: api + "/wxPublicAccount/getCssWxMediaInfo", // 获取图文详情
  saveMediaNews: api + "/wxPublicAccount/saveMediaNews", // 新增图文素材
  updateMediaNews: api + "/wxPublicAccount/updateMediaNews", // 修改图文素材
  downWxMediaVoice: api + "/wxPublicAccount/downWxMediaVoice", // 下载语音素材
  queryCssMediaCount: api + "/wxPublicAccount/queryCssMediaCount", // 获取素材总数配置
  saveOrUpdateUrlNews: api + "/wxPublicAccount/saveOrUpdateUrlNews", // 上传或修改外链图文
  getMediaIdDetailData: api + "/wxPublicAccount/getMediaIdDetailData",
  saveWXMedia: api + "/wxPublicAccount/saveWXMedia", // 微信上传完成后保存数据
  getWXUploadUrl: api + "/wxPublicAccount/getWXUploadUrl", // 获取微信上传链接
  saveCloudFile: api + "/wxPublicAccount/saveCloudFile", // 云服务器上传
  updateGetCloudToken: api + "/wxPublicAccount/updateGetCloudToken", // 销大师公众号素材管理菜单，上传除图文外的微信素材获取上传token
  // 云空间
  deleteTmpMediaByGroup: api + '/cssWxTmpMedia/deleteTmpMediaByGroup', // 一键清理
  deleteCssTmpMedia: api + '/cssWxTmpMedia/deleteCssTmpMedia', // 批量删除云服务空间文件
  queryMsgGroup: api + '/cssWxTmpMedia/queryMsgGroup', // 根据类型获得分组列表
  queryTmpMediaVideoList: api + '/cssWxTmpMedia/queryTmpMediaVideoList', // 获取视频素材列表
  queryTmpMediaVoiceList: api + '/cssWxTmpMedia/queryTmpMediaVoiceList', // 获取语音素材列表
  queryTmpFileList: api + '/cssWxTmpMedia/queryTmpFileList', // 获取文件列表
  queryTmpMediaImgList: api + '/cssWxTmpMedia/queryTmpMediaImgList', // 获取图片素材列表
}
