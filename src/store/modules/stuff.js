import {
  getTree,
} from '@/api/stuff.js'

function deepCopy(data) {
  const t = data === null ? '' : Array.isArray(data) ? "array" : typeof data === 'object' ? 'object' : ''
  let o

  if (t === 'array') {
    o = []
  } else if (t === 'object') {
    o = {}
  } else {
    return data
  }
  if (t === 'array') {
    for (let i = 0; i < data.length; i++) {
      o.push(deepCopy(data[i]))
    }
  } else if (t === 'object') {
    // init status
    if (data) {
      o.expend = false
      o.selected = false
      o['copyeeNum'] = data.eeNum
      o['id'] = data.key
      data['children'] = data['children'] || []
    }
    for (let i in data) {
      o[i] = deepCopy(data[i])
    }
  }
  return o
}

const sortTreeNode = (arr = []) => {
  arr.sort((item1, item2) => { return item1.deptOrder - item2.deptOrder })
  arr.forEach(item => {
      if (Array.isArray(item.children)) {
          sortTreeNode(item.children)
      }
  })
  return arr
}
const state = {
  corpkey: null, // 部门id
  fitlerOpt: null, // 筛选参数
  fitlerName: null, // 筛选姓名或手机
  addUserInfo: {}, // 添加员工信息(临时存储)
  addUserRights: [], // 添加员工权限
  currApart: null, // 被选中的部门
  selectRows: [], // 被选中的用户数组
  trees: [], // 树结构
  isPopTree: false, // 是否处于弹窗选择状态
  popCurApart: null, // 弹窗选择的部门
  curUser: null, // 正在操作的员工
  isTop: 1, // 是否将置顶内容放在最上方
  apartCount: 1, // 部门数
  filterData: null, // 保存筛选数据
  currentTreeNode: {},
  totalTree: [],
  selectedId: null
}

const getters = {
  getCorpkey: state => state.corpkey,
  getFitlerOpt: state => state.fitlerOpt,
  getFitlerName: state => state.fitlerName,
  getAddUserInfo: state => state.addUserInfo,
  getAddUserRights: state => state.addUserRights,
  getCurrApart: state => state.currApart,
  getSelectRows: state => state.selectRows,
  getTrees: state => state.trees,
  getIsPopTree: state => state.isPopTree,
  getPopApart: state => state.popCurApart,
  getCurUser: state => state.curUser,
  getIsTop: state => state.isTop,
  getApartCount: state => state.apartCount,
  getFilterData: state => state.filterData,

  getSelectedId: state => state.currentTreeNode.id || null
}

const mutations = {
  SET_Filter_DATA(state, val) {
    state.filterData = val
  },
  SET_APART_COUNT(state, val) {
    state.apartCount = val
  },
  SET_TOP(state, val) {
    state.isTop = val
  },
  SET_CUR_USER(state, val) {
    state.curUser = val
  },
  SET_POP_APART(state, val) {
    state.popCurApart = val
  },
  SET_IS_POPTREE(state, val) {
    state.isPopTree = val
  },
  SET_TREE(state, val) {
    state.trees = val
  },
  SET_SELECT_ROWS(state, val) {
    state.selectRows = val
  },
  SET_CORP_KEY(state, val) {
    state.corpkey = val
  },
  SET_FILTE_OPT(state, val) {
    state.fitlerOpt = val
  },
  SET_FILTE_NAME(state, val) {
    state.fitlerName = val
  },
  SET_USER_INFO(state, val) {
    state.addUserInfo = val
  },
  SET_USER_RIGHTS(state, val) {
    state.addUserRights = val
  },
  SET_CUR_APART(state, val) {
    state.currApart = val
  },
  SET_CUR_TREE_NODE(state, val) {
    state.currentTreeNode = val || {}
  },
  SET_TOTAL_TREE(state, val) {
    state.totalTree = val || []
  }
}
const actions = {
  // 用户名登录
  setCollapsed({ commit }, collapsed) {
    commit('SET_COLLAPSED', collapsed)
  },
  setRouterInfo({ commit }, routerInfo) {
    commit('SET_ROUTERINFO', routerInfo)
  },
  async getTree({ commit }, payload) {
    let res = await getTree(payload)
    if (res.code === 1) {
      let data = sortTreeNode(res.data) || []
      data = deepCopy(data)
      commit('SET_TOTAL_TREE', data)
      // commit('SET_CUR_TREE_NODE', data[0])
      return {...res, data: data}
    }
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
