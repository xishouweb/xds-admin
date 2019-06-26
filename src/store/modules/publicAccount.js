import _ from 'lodash'
import { queryPublicAccountList } from '@/api/app'
import {localStorageSaveOrRead} from '@/utils/util'
// 用于保存全局应用状态
const state = {
  urlAppAccountId: null,
  accountLoading: false,
  originPublicAccountList: [], // 未排序的公众号列表
  publicAccountList: [], // 排序过后的公众号列表
  curPublic: localStorage.getItem('curAccount')
    ? JSON.parse(localStorage.getItem('curAccount'))
    : {}
}

const getters = {
  accountLoading: state => state.accountLoading,
  validPublicAccount: state => {
    return state.publicAccountList.filter(item => item.status === 1)
  },
  hasAccount: state => state.publicAccountList.length,
  hasValidAccount: state => {
    return state.publicAccountList.some(item => item.status === 1)
  },
  curPublic: state => state.curPublic,
  hasWepiaoer: state => { // 是否有可用服务号
    return state.publicAccountList.some(item => item.serviceTypeInfo === 2)
  }
}

const mutations = {
  SET_ACCOUNTLOADING(state, payload) {
    state.accountLoading = payload
  },
  SET_ORIGINACCOUNTLIST(state, payload) {
    state.originPublicAccountList = payload
  },
  SET_ACCOUNTLIST(state, payload) {
    state.publicAccountList = payload
  },
  SET_CURPUBLICACCOUNT(state, payload) {
    state.curPublic = payload
    // 当URL中有appAccountId=?, 将全局写死appAccountId
    if (/.+appAccountId=(\d+).*/.test(location.href)) {
      state.urlAppAccountId = location.href.replace(/.+appAccountId=(\d+).*/, '$1')
      state.curPublic = {...state.curPublic, appAccountId: parseInt(state.urlAppAccountId)}
    }

    localStorage.setItem('curAccount', JSON.stringify(payload || {}))
  }
}

const actions = {
  // 页面初始化， 登陆进入初始化，刷新初始化
  async queryPublicAccountList({ commit }, payload = {}) {
    let params = {
      corpId: localStorageSaveOrRead('currentCorp').applyId
    }
    commit('SET_ACCOUNTLOADING', true)
    const response = await queryPublicAccountList(params)
    if (response.code === 1 && response.data) {
      const filterData = _.filter(response.data, (item) => item.status <= 2)
      const sortData = _.sortBy(filterData, ['status','privilegedTime'])
      commit('SET_ACCOUNTLOADING', false)
      commit('SET_ORIGINACCOUNTLIST', response.data)
      commit('SET_ACCOUNTLIST', sortData)
      // 获取当前公众号
      if (!localStorage.getItem('curAccount')) {
        commit('SET_CURPUBLICACCOUNT', sortData[0])
      } else {
        // 存在
        const curPublic = JSON.parse(localStorage.getItem('curAccount'))
        /* curPublic存在时应用公众号列表中的公众号对象替换curPublic，因为公众号的状态有可能已经改变 */
        let nowPublic = null
        sortData.forEach(v => {
          if (v.appAccountId === curPublic.appAccountId) {
            nowPublic = v
          }
        })
        commit('SET_CURPUBLICACCOUNT', nowPublic || sortData[0] || {})
        // if (!sortData.some(item => item.appAccountId === curPublic.appAccountId)) {
        //   commit('SET_CURPUBLICACCOUNT', sortData[0] || {})
        // }
      }
    }
    return response
  },
  // 切换重置
  async resetPublicAccountList({ commit }, payload = {}) {
    let params = {
      corpId: localStorageSaveOrRead('currentCorp').applyId
    }
    const response = await queryPublicAccountList(params)
    if (response.code === 1 && response.data) {
      const filterData = _.filter(response.data, (item) => item.status <= 2)
      const sortData = _.sortBy(filterData, ['status','privilegedTime'])
      commit('SET_ORIGINACCOUNTLIST', response.data)
      commit('SET_ACCOUNTLIST', sortData)
      // 获取当前公众号
      commit('SET_CURPUBLICACCOUNT', sortData[0] || {})
    }
    return response
  },
  // 公众号操作同步,是否禁用了当前公众号，重置
  async actionPublicAccountList({ commit }, payload = {}) {
    let params = {
      corpId: localStorageSaveOrRead('currentCorp').applyId
    }
    const response = await queryPublicAccountList(params)
    if (response.code === 1 && response.data) {
      const filterData = _.filter(response.data, (item) => item.status <= 2)
      const sortData = _.sortBy(filterData, ['status','privilegedTime'])
      commit('SET_ORIGINACCOUNTLIST', response.data)
      commit('SET_ACCOUNTLIST', sortData)
      // 获取当前公众号
      let curPublic = JSON.parse(localStorage.getItem('curAccount'))
      curPublic = sortData.find(item => item.appAccountId === curPublic.appAccountId) || {}
      if (curPublic.status !== 1) { // 被停用重置
        commit('SET_CURPUBLICACCOUNT', sortData[0] || {})
      }
    }
    return response
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
