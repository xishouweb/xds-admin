import {
  getQrCodeNum,
  queryCssGroup,
  updateGchannelQrCode,
  getGchannelQrCodeThemeListByPage,
  deleteGchannelQrCodeTheme,
  updateThemeToGroup,
  getGchannelQrCodeListByPage,
  deleteGchannelQrCodeByIds,
  queryGchannelQrCodeById,
  validCssAppAccountType,
  canSaveQrCode,
  getChannelQrCodeImage, // 下载指定大小的渠道二维码图片
 } from "@/api/markting"
import {
  sessionStorageSaveOrRead,
  deepCopy
} from '@/utils/util.js'

function sortGrouplist(data) {
  let total = 0
  data.forEach(item => {
    total += item.count || 0
    item.groupType === 0 && (item.groupOrder = 0)
  })
  data.sort((item1, item2) => {
    return item1.groupOrder - item2.groupOrder
  })
  return [{ name: "全部", groupId: -1, count: total }, ...data] || []
}

function findDefauleId(group) {
  let find = group.find(item => item.groupType === 0)
  return find ? find["groupId"] : null
}
const state = {
  loading: false,
  qrCodeThemeName: sessionStorageSaveOrRead('QRCODE_THEME_NAME') || '--',
  qrcodeGroupList: [],
  currentQrCode: sessionStorageSaveOrRead('MODIFY_QRCODE') || {},
  qrCodeNum: {}, // 二维码数量和套餐二维码总数量
  canCreateQrCode: false,
}

const getters = {
  getQrCodeThemeName: state => state.qrCodeThemeName,
  getLoadingStatus: state => state.loading,
  getQrcodeGroupList: state => state.qrcodeGroupList,
  qrcodeDefaultGroupId: state => findDefauleId(state.qrcodeGroupList),
  getCurrentQrCode: state => deepCopy(state.currentQrCode),
  getQrCodeNumber: state => deepCopy(state.qrCodeNum),
  getCanCreateQrCode: state => state.canCreateQrCode,
}

const mutations = {
  SET_QRCODE_THEME_NAME(state, data) {
    sessionStorageSaveOrRead('QRCODE_THEME_NAME', data)
    state.qrCodeThemeName = data
  },
  SET_QRCODE_NUMBER(state, data) {
    let laveQrLimitNum = data.packageQrLimitNum - data.qrLimitNum
    let laveQrNum = data.packageQrNum - data.qrNum

    state.qrCodeNum = {
      ...data,
      lavePackageQrLimitNum: laveQrLimitNum < 0 ? 0 : laveQrLimitNum, // 永久二维码剩余
      lavePackageQrNum: laveQrNum < 0 ? 0 : laveQrNum, // 临时二维码剩余
    }
  },
  SET_LOADING(state, data) {
    state.loading = data
  },
  SET_QRCODE_GROUPLIST(state, data) {
    state.qrcodeGroupList = data
  },
  SET_CURRENT_QR_CODE(state, data) {
    sessionStorageSaveOrRead('MODIFY_QRCODE', data)
    state.currentQrCode = data
  },
  SET_CAN_CREATE_QR_CODE(state, data) {
    state.canCreateQrCode = data
  }
}

const actions = {
  // 获取已使用的二维码数量和套餐二维码总数量
  async validCssAppAccountType({ commit }, payload) {
    commit("SET_LOADING", true)
    const res = await validCssAppAccountType(payload)
    commit("SET_LOADING", false)
    return new Promise((resolve, reject) => {
      resolve(res)
    })
  },
  // 检测当前主题下是否有二维码在创建中
  async canSaveQrCode({ commit }, payload) {
    commit("SET_LOADING", true)
    const res = await canSaveQrCode(payload)
    commit("SET_LOADING", false)
    if (res.code === 1) {
      commit("SET_CAN_CREATE_QR_CODE", true)
    } else {
      commit("SET_CAN_CREATE_QR_CODE", res.message)
    }
    // return new Promise((resolve, reject) => {
    //   resolve(res)
    // })
  },
  // 获取已使用的二维码数量和套餐二维码总数量
  async getQrCodeNum({ commit }, payload) {
    commit("SET_LOADING", true)
    const res = await getQrCodeNum(payload)
    commit("SET_LOADING", false)
    if (res.code === 1) {
      commit("SET_QRCODE_NUMBER", res.data)
    }
  },
  async queryCssGroup({ commit }, payload) {
    commit("SET_LOADING", true)
    // 分组媒体类型,channel_qr_code
    const res = await queryCssGroup(payload)
    commit("SET_LOADING", false)
    let data = res.code === 1 ? sortGrouplist(res.data) : []
    data = data.map(item => ({...item, id: item.groupId}))
    commit("SET_QRCODE_GROUPLIST", data)
  },
  // 移动主题
  async updateThemeToGroup({ commit }, payload) {
    commit("SET_LOADING", true)
    const res = await updateThemeToGroup(payload)
    commit("SET_LOADING", false)
    return new Promise((resolve, reject) => {
      resolve(res)
    })
  },
  // 主题list
  async getGchannelQrCodeThemeListByPage({ commit }, payload) {
    commit("SET_LOADING", true)
    const res = await getGchannelQrCodeThemeListByPage(payload)
    commit("SET_LOADING", false)
    return new Promise((resolve, reject) => {
      resolve(res)
    })
  },
  // delete主题
  async deleteGchannelQrCodeTheme({ commit }, payload) {
    commit("SET_LOADING", true)
    const res = await deleteGchannelQrCodeTheme(payload)
    commit("SET_LOADING", false)
    return new Promise((resolve, reject) => {
      resolve(res)
    })
  },
  // 提交修改de二位
  async updateGchannelQrCode({ commit }, payload) {
      const res = await updateGchannelQrCode(payload)
      return new Promise((resolve, reject) => {
        resolve(res)
      })
    },
  // 查询二维码list
  async getGchannelQrCodeListByPage({ commit }, payload) {
    commit("SET_LOADING", true)
    const res = await getGchannelQrCodeListByPage(payload)
    commit("SET_LOADING", false)
    return new Promise((resolve, reject) => {
        resolve(res)
    })
  },
  // 删除二位吗
  async deleteGchannelQrCodeByIds({ commit }, payload) {
    commit("SET_LOADING", true)
    const res = await deleteGchannelQrCodeByIds(payload)
    commit("SET_LOADING", false)
    return new Promise((resolve, reject) => {
        resolve(res)
    })
  },
  // 查询二位吗详情
  async queryGchannelQrCodeById({ commit }, payload) {
    commit("SET_LOADING", true)
    const res = await queryGchannelQrCodeById(payload)
    commit("SET_LOADING", false)
    return new Promise((resolve, reject) => {
      if (res.code === 1) {
        commit("SET_CURRENT_QR_CODE", res.data) // 保存二维码详情
        resolve(res)
      } else {
        commit("SET_CURRENT_QR_CODE", {})
        reject(res)
      }
    })
  },
  // 下载
  async getChannelQrCodeImage({ commit }, payload) {
    commit("SET_LOADING", true)
    const res = await getChannelQrCodeImage(payload)
    commit("SET_LOADING", false)
    return res
  },
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}

