import {
  getFansPosterStatisticsList,
  getFansPosterTemplateStatisticsList,
  queryPosterByPage,
  saveOrUpdatePostertTemplate,
  deletePosterTemplate,
  updatePosterTemplateGroup,
  getPosterTemplate,
  getPosterTemplateByPage,
  validCssAppAccountType,
  updateGetPosterCloudToken,
  saveOrUpdateGroup,
  updateGroupOrder,
  getFansPosterTemplateStatisticsInfo,
  getFansPosterInfo,
  deleteGroup,
  queryCssGroup,
  getFansPosterImageById
} from '@/api/poster'

import { sessionStorageSaveOrRead, deepCopy } from '@/utils/util.js'

function sortGrouplist(data) {
  let total = 0
  data.forEach(item => {
    total += item.count || 0
    item.groupType === 0 && (item.groupOrder = 0)
  })
  data.sort((item1, item2) => {
    return item1.groupOrder - item2.groupOrder
  })
  return [{ name: '全部', count: total }, ...data] || []
}

function findDefauleId(group) {
  let find = group.find(item => item.groupType === 0)
  return find ? find['groupId'] : null
}
const state = {
  loading: false,
  posterList: {
    totalCount: 0,
    records: []
  },
  qrCodeThemeName: sessionStorageSaveOrRead('QRCODE_THEME_NAME') || '--',
  posterGroupList: [],
  currentQrCode: sessionStorageSaveOrRead('MODIFY_QRCODE') || {},
  qrCodeNum: {}, // 二维码数量和套餐二维码总数量
  canCreateQrCode: false,
  newCreatedPoster: null
}

const getters = {
  getQrCodeThemeName: state => {
    return state.qrCodeThemeName
  },
  getLoadingStatus: state => state.loading,
  getposterGroupList: state => state.posterGroupList,
  posterDefaultGroupId: state => findDefauleId(state.posterGroupList),
  getCurrentQrCode: state => deepCopy(state.currentQrCode),
  getQrCodeNumber: state => deepCopy(state.qrCodeNum),
  getCanCreateQrCode: state => state.canCreateQrCode
}

const mutations = {
  SET_QRCODE_THEME_NAME(state, data) {
    sessionStorageSaveOrRead('QRCODE_THEME_NAME', data)
    state.qrCodeThemeName = data
  },
  SET_QRCODE_NUMBER(state, data) {
    state.qrCodeNum = {
      ...data,
      lavePackageQrLimitNum: data.packageQrLimitNum - data.qrLimitNum || 0, // 永久二维码剩余
      lavePackageQrNum: data.packageQrNum - data.qrNum || 0 // 临时二维码剩余
    }
  },
  SET_LOADING(state, data) {
    state.loading = data
  },

  SET_POSTER_GROUPLIST(state, data) {
    state.posterGroupList = data
  },
  SET_POSTER_LIST(state, data) {
    state.posterList = data
  },
  SET_CURRENT_QR_CODE(state, data) {
    sessionStorageSaveOrRead('MODIFY_QRCODE', data)
    state.currentQrCode = data
  },
  SET_CAN_CREATE_QR_CODE(state, data) {
    state.canCreateQrCode = data
  },
  SET_NEW_CREATED_POSTER(state, data) {
    state.newCreatedPoster = data
  }
}

const actions = {
  async getFansPosterStatisticsList({ commit }, payload) {
    commit('SET_LOADING', true)
    const res = await getFansPosterStatisticsList(payload)
    commit('SET_LOADING', false)
    return res
  },
  async getFansPosterTemplateStatisticsList({ commit }, payload) {
    commit('SET_LOADING', true)
    const res = await getFansPosterTemplateStatisticsList(payload)
    commit('SET_LOADING', false)
    if (res.code === 1) {
      commit('SET_CAN_CREATE_QR_CODE', true)
    } else {
      commit('SET_CAN_CREATE_QR_CODE', false)
    }
    return res
  },
  // 获取分组列表
  async queryCssGroup({ commit }, payload) {
    commit('SET_LOADING', true)
    const res = await queryCssGroup(payload)
    commit('SET_LOADING', false)
    let data = res.code === 1 ? sortGrouplist(res.data) : []
    commit('SET_POSTER_GROUPLIST', data)
  },

  async queryPosterByPage({ commit }, payload) {
    commit('SET_LOADING', true)
    const res = await queryPosterByPage(payload)
    commit('SET_LOADING', false)
    return res
  },
  async saveOrUpdatePostertTemplate({ commit }, payload) {
    commit('SET_LOADING', true)
    const res = await saveOrUpdatePostertTemplate(payload)
    commit('SET_LOADING', false)
    return res
  },
  // 删除海报模板
  async deletePosterTemplate({ commit }, payload) {
    commit('SET_LOADING', true)
    const res = await deletePosterTemplate(payload)
    commit('SET_LOADING', false)
    return res
  },
  // 获取海报模板
  async getPosterTemplate({ commit }, payload) {
    const res = await getPosterTemplate(payload)
    return res
  },
  async updatePosterTemplateGroup({ commit }, payload) {
    commit('SET_LOADING', true)
    const res = await updatePosterTemplateGroup(payload)
    commit('SET_LOADING', false)
    return res
  },
  // 获取海报模板列表
  async getPosterTemplateByPage({ commit }, payload) {
    commit('SET_LOADING', true)
    const response = await getPosterTemplateByPage(payload)
    commit('SET_LOADING', false)
    if (response.code === 1 && response.data) {
      commit('SET_POSTER_LIST', response.data)
    }
    return response
  },
  async validCssAppAccountType({ commit }, payload) {
    commit('SET_LOADING', true)
    const res = await validCssAppAccountType(payload)
    commit('SET_LOADING', false)
    if (res.code === 1) {
      commit('SET_CURRENT_QR_CODE', res.data)
    } else {
      commit('SET_CURRENT_QR_CODE', {})
    }
    return res
  },
  async updateGetPosterCloudToken({ commit }, payload) {
    commit('SET_LOADING', true)
    const res = await updateGetPosterCloudToken(payload)
    commit('SET_LOADING', false)
    if (res.code === 1) {
      commit('SET_CURRENT_QR_CODE', res.data)
    } else {
      commit('SET_CURRENT_QR_CODE', {})
    }
    return res
  },
  async saveOrUpdateGroup({ commit }, payload) {
    commit('SET_LOADING', true)
    const res = await saveOrUpdateGroup(payload)
    commit('SET_LOADING', false)
    if (res.code === 1) {
      commit('SET_CURRENT_QR_CODE', res.data) // 保存二维码详情
    } else {
      commit('SET_CURRENT_QR_CODE', {})
    }
    return res
  },
  async updateGroupOrder({ commit }, payload) {
    commit('SET_LOADING', true)
    const res = await updateGroupOrder(payload)
    commit('SET_LOADING', false)
    if (res.code === 1) {
      commit('SET_CURRENT_QR_CODE', res.data) // 保存二维码详情
    } else {
      commit('SET_CURRENT_QR_CODE', {})
    }
    return res
  },
  async getFansPosterTemplateStatisticsInfo({ commit }, payload) {
    commit('SET_LOADING', true)
    const res = await getFansPosterTemplateStatisticsInfo(payload)
    commit('SET_LOADING', false)
    if (res.code === 1) {
      commit('SET_CURRENT_QR_CODE', res.data) // 保存二维码详情
    } else {
      commit('SET_CURRENT_QR_CODE', {})
    }
    return res
  },
  async getFansPosterInfo({ commit }, payload) {
    commit('SET_LOADING', true)
    const res = await getFansPosterInfo(payload)
    commit('SET_LOADING', false)
    if (res.code === 1) {
      commit('SET_CURRENT_QR_CODE', res.data) // 保存二维码详情
    } else {
      commit('SET_CURRENT_QR_CODE', {})
    }
    return res
  },
  async deleteGroup({ commit }, payload) {
    commit('SET_LOADING', true)
    const res = await deleteGroup(payload)
    commit('SET_LOADING', false)
    if (res.code === 1) {
      commit('SET_CURRENT_QR_CODE', res.data) // 保存二维码详情
    } else {
      commit('SET_CURRENT_QR_CODE', {})
    }
    return res
  },
  // 根据裂变海报id获取裂变海报图片
  async getFansPosterImageById({ commit }, payload) {
    commit('SET_LOADING', true)
    const res = await getFansPosterImageById(payload)
    commit('SET_LOADING', false)
    return res
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
