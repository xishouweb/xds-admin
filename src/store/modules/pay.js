import iView from 'iview'
import {getExistOrder} from '@/api/query'
import {localStorageRemove, localStorageSaveOrRead} from '@/utils/util'
const state = {
  // 1:关闭弹窗 2:全局打开有订单待支付的弹框 3:全局打开有待审核、审核成功、审核失败的订单
  isOrder: 1,
  // 1:关闭抽屉 2:全局打开抽屉
  isFullPage: 1,
  corpId: ''
}
const getters = {
  getIsOrder: state => state.isOrder,
  getIsFullPage: state => state.isFullPage,
  getCorpId: state => state.corpId
}
const mutations = {
  SET_ISORDER(state, isOrder) {
    state.isOrder = isOrder
  },
  SET_ISFULLPAGE(state, isFullPage) {
    state.isFullPage = isFullPage
  },
  SET_CORPID(state, corpId) {
    state.corpId = corpId
  }
}
const actions = {
  // 用户名登录
  setIsOrder({commit}, isOrder) {
    commit('SET_ISORDER', isOrder)
  },
  setIsFullPage({commit}, isFullPage) {
    commit('SET_ISFULLPAGE', isFullPage)
  },
  setCorpId({commit}, corpId) {
    commit('SET_CORPID', corpId)
  },
  setPayStatu({commit}, obj) {
    let params = {
      corpId: obj.corpId
    }
    getExistOrder(params).then((data) => {
      if (data.code === 1) {
        localStorageSaveOrRead('corpName', obj.corpName)
        localStorageSaveOrRead('corpId', params.corpId)
        if (data.data.isBuy) {
          let orderId = data.data.orderId
          let status = data.data.orderStatus
          localStorageSaveOrRead('orderId', orderId)
          localStorageSaveOrRead('status', status)
          commit('SET_CORPID', params.corpId)
          switch (data.data.orderStatus) {
            case 0:
              commit('SET_ISORDER', 2)
              break
            case 4:
              commit('SET_ISORDER', 4)
              break
            default:
              commit('SET_ISORDER', 3)
              break
          }
        } else {
          localStorageRemove('orderId')
          localStorageRemove('status')
          commit('SET_ISFULLPAGE', 2)
        }
      } else {
        localStorageRemove('status')
        localStorageRemove('orderId')
        localStorageRemove('corpId')
        localStorageRemove('corpName')
        commit('SET_ISORDER', 1)
        commit('SET_ISFULLPAGE', 1)
        iView.Message.error(data.message)
      }
    })
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
