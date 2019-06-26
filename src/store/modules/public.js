import { queryQcCloudUrlRequestName } from '@/api/app.js'
import {localStorageSaveOrRead} from '@/utils/util'
const state = {
  showModal: false, // 控制离开页面提示的显示
  to: null, // 路由守卫时的next()函数
  cloudUrl: ''
}
const getters = {

}
const mutations = {
  SET_SHOWMODAL(state, showModal) {
    state.showModal = showModal
  },
  SET_TO(state, to) {
    state.to = to
  },
  SET_CLOUD_URL(state, data) {
    localStorageSaveOrRead('CLOUDURL', data)
    state.cloudUrl = data
  }
}

const actions = {
  async queryQcCloudUrlRequestName({ commit }, payload) {
    let res = await queryQcCloudUrlRequestName({
      type: 1,
      ...payload
    })
    commit('SET_CLOUD_URL', res)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
