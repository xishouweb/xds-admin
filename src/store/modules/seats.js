const state = {
  seatsInfo: {},
  firstStepData: {},
  secondStepData: {},
  thirdStepData: {},
  corpPackRoleList: []
}
const getters = {
  getSeatsInfo: state => state.seatsInfo,
  getCorpPackRoleList: state => state.corpPackRoleList,
  getFirstStepData: state => state.firstStepData,
  getSecondStepData: state => state.secondStepData,
  getThirdStepData: state => state.thirdStepData
}
const mutations = {
  SET_SEATSINFO(state, seatsInfo) {
    state.seatsInfo = seatsInfo
  },
  SET_FIRSTSTEPDATA(state, firstStepData) {
    state.firstStepData = firstStepData
  },
  SET_SECONDSTEPDATA(state, secondStepData) {
    state.secondStepData = secondStepData
  },
  SET_THIRDSTEPDATA(state, thirdStepData) {
    state.thirdStepData = thirdStepData
  },
  SET_CORPPACKROLE(state, corpPackRoleList) {
    state.corpPackRoleList = corpPackRoleList
  },
}
const actions = {
  setSeatsInfo({commit}, seatsInfo) {
    commit('SET_SEATSINFO', seatsInfo)
  },
  setFirstStepData({commit}, firstStepData) {
    commit('SET_FIRSTSTEPDATA', firstStepData)
  },
  setSecondStepData({commit}, secondStepData) {
    commit('SET_FIRSTSTEPDATA', secondStepData)
  },
  setThirdStepData({commit}, thirdStepData) {
    commit('SET_FIRSTSTEPDATA', thirdStepData)
  },
  setCorpPackRoleList({commit}, corpPackRoleList) {
    corpPackRoleList = JSON.parse(JSON.stringify(corpPackRoleList))
    commit('SET_CORPPACKROLE', corpPackRoleList)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
