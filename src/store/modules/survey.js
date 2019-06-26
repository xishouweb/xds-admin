const state = {
  // 公司套餐信息
  corpPackageData: {},
  // 获取公司统计信息
  corpInfoData: {
    loadingDataStatu: 1
  },
  // 关键指标
  keyIndicatorsData: {
    loadingDataStatu: 1
  },
  // 公司信息
  saveloginCompany: {}
}
const getters = {
  getCorpPackage: state => state.corpPackageData,
  getCorpInfo: state => state.corpInfoData,
  getKeyIndicators: state => state.keyIndicatorsData,
  getSaveloginCompany: state => state.saveloginCompany
}
const mutations = {
  SET_CORPPACKAGE(state, corpPackageData) {
    state.corpPackageData = corpPackageData
  },
  SET_CORPINFO(state, corpInfoData) {
    state.corpInfoData = corpInfoData
  },
  SET_KEYINDICATORS(state, keyIndicatorsData) {
    state.keyIndicatorsData = keyIndicatorsData
  },
  SET_SAVELOGINCOMPANY(state, saveloginCompany) {
    state.saveloginCompany = saveloginCompany
  }
}
const actions = {
  // 用户名登录
  setCorpPackage({commit}, corpPackageData) {
    commit('SET_CORPPACKAGE', corpPackageData)
  },
  setSaveloginCompany({commit}, saveloginCompany) {
    commit('SET_SAVELOGINCOMPANY', saveloginCompany)
  },
  setCorpInfo({commit}, corpInfoData) {
    commit('SET_CORPINFO', corpInfoData)
  },
  setKeyIndicators({commit}, keyIndicatorsData) {
    commit('SET_KEYINDICATORS', keyIndicatorsData)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
