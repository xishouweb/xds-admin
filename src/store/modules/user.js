const state = {
  // session失效
  message: 1,
  test: 1,
  step: 0,
  anchor: 'home',
  overHidden: 1,
}
const getters = {
  getMessage: state => state.message,
  getTest: state => state.test,
  getStep: state => state.step,
  getAnchor: state => state.anchor,
  getOverStatu: state => state.overHidden
}
const mutations = {
  SET_STEP(state, step) {
    state.step = step
  },
  SET_MESSAGE(state, message) {
    state.message = message
  },
  STE_TEST(state, test) {
    state.test++
  },
  SET_ANCHOR(state, anchor) {
    state.anchor = anchor
  },
  SET_OVERSTATU(state, overHidden) {
    state.overHidden = overHidden
  }
}
const actions = {
  // 用户名登录
  setMessage({commit}, message) {
    commit('SET_MESSAGE', message)
  },
  setAnchor({commit}, anchor) {
    commit('SET_ANCHOR', anchor)
  },
  setStep({commit}, step) {
    commit('SET_STEP', step)
  },
  setOverStatu({commit}, overHidden) {
    commit('SET_OVERSTATU', overHidden)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
