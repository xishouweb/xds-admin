// 公众号模块数据仓库

const state = {
  editType: 'add', // addReply页面状态，edit:'编辑回复',add:'添加回复'
}

const getters = {
  getEditType: state => state.editType,
}

const mutations = {
  SET_EDITTYPE(state,editType) {
    state.editType = editType
  }
}

const action = {
  setEditType({commit},editType) {
    commit('SET_EDITTYPE', editType)
  },
}

export default{
  namespaced: true, // 启用命名空间
  state, // 基本数据
  getters, // 获取状态（数据）方法
  mutations, // 更新状态方法
  action, // 异步更新数据方法
}