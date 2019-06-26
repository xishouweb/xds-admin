import {localStorageSaveOrRead} from '@/utils/util'
const state = {
  collapsed: true,
  routerInfo: {},
  secondMenu: {},
  mainMenuList: localStorageSaveOrRead('mainMenu') || [],
  allSecondObj: localStorageSaveOrRead('secondMenu') || {},
  menuTree: localStorageSaveOrRead('menuTree') || {}
}
const getters = {
  getCollapsed: state => state.collapsed,
  getRouterInfo: state => state.routerInfo,
  getSecondMenu: state => state.secondMenu,
  getAllSecondObj: state => state.allSecondObj,
  getMainMenuList: state => state.mainMenuList
}
const mutations = {
  SET_COLLAPSED(state, collapsed) {
    state.collapsed = collapsed
  },
  SET_ROUTERINFO(state, routerInfo) {
    state.routerInfo = routerInfo
  },
  SET_SECONDMENU(state, secondMenu) {
    state.secondMenu = secondMenu
    localStorageSaveOrRead('subSecondMenu', secondMenu)
  },
  SET_ALLSECONDOBJ(state, allSecondObj) {
    state.allSecondObj = allSecondObj
  },
  SET_MAINMENULIST(state, mainMenuList) {
    state.mainMenuList = mainMenuList
  }
}
const actions = {
  // 用户名登录
  setCollapsed({commit}, collapsed) {
    commit('SET_COLLAPSED', collapsed)
  },
  setRouterInfo({commit}, routerInfo) {
    commit('SET_ROUTERINFO', routerInfo)
  },
  setSecondMenu({commit}, secondMenu) {
    commit('SET_SECONDMENU', secondMenu)
  },
  setMenuList({commit}, obj) {
    commit('SET_ALLSECONDOBJ', obj.allSecondObj)
    commit('SET_MAINMENULIST', obj.mainMenuList)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
