import {
  queryAllFans,
  queryPublicAccountList,
  getSeatList,
  queryKfGroupList,
  saveWxGroup,
  updateWxGroup,
  deleteWxGroup,
  updateWxGroupByOrder,
  queryTags,
  updateFansExtInfo,
  getTagsBySeatId,
  updateBatchSetUserTag,
  updateKfSeatSet, // 设置坐席
  updateKfSeat, // 设置坐席，单个
  updateWxGroupByMove,
  queryFan,
  querySelectConditions,
  deleteSelectCondition,
  addSelectCondition,
  deleteFans,
  syncFans,
  updateExclusiveSeat,
  createConversation,
  getFansRecord,
  getConversationStatistics,
  queryPublicsBySeat,
  updateWxGroupByMoveSingle,
  updateBatchSetFansUserTagSingle
} from '@/api/fans'
import { localStorageSaveOrRead, sortBy } from '@/utils/util'
import utilConst from '@/utils/const'


const state = {
  allloading: false,
  groupLoading: false,
  seatLoading: false,
  publicAccountList: [],
  allFans: {
    totalCount: 0,
    records: []
  },
  seatInfoList: [],
  fansGroupList: {
    groupInfoList: []
  },
  curFans: {},
  fanTags: [], // 粉丝标签
  fansSeatTags: [], // 根据坐席和公众号的标签
  fanTagsByWx: {
    fansGroupAndTagDtos: []
  },
  condList: [],
  conversationStatistics: {}, // 会话互动统计
  fansRecord: [] // 粉丝轨迹
}

const getters = {
  formatFansGroups: state => {
    let { groupInfoList } = state.fansGroupList
    const all = { id: -1, name: '全部' }
    let newGroupInfoList = groupInfoList.map(item => {
      return {
        ...item,
        id: item.fsGroupId,
        name: item.fsGroupName
      }
    })
    const first = newGroupInfoList.filter(item => item.name === '未分组')
    let rest = newGroupInfoList.filter(item => item.name !== '未分组')
    rest = rest.sort((a, b) => {
      return a.groupOrder - b.groupOrder
    })
    newGroupInfoList = [all, ...first, ...rest]
    return newGroupInfoList
  },
  validPublicAList: state => {
    return state.publicAccountList.filter(item => item.status === 1)
  },
  condNameList: state => {
    return state.condList.map(item => item.selectName)
  },
  formatFansTags: state => {
    return state.fanTagsByWx.fansGroupAndTagDtos.map(item => {
      const children = (item.fansWxTagDtos || []).map(_item => {
        return { ..._item, id: _item.tagId, name: _item.tagName }
      })
      return {
        ...item,
        id: item.id,
        name: item.name,
        mode: item.specialGroup === 1 ? 'radio' : 'checkbox',
        children
      }
    })
  },
  formatFansTagsId: state => {
    return state.fanTagsByWx.fansGroupAndTagDtos.map(item => {
      const children = (item.fansWxTagDtos || []).map(_item => {
        return { ..._item, id: _item.id, name: _item.tagName }
      })
      return {
        ...item,
        id: item.id,
        name: item.name,
        mode: item.specialGroup === 1 ? 'radio' : 'checkbox',
        children
      }
    })
  },
  formatFansSeatTags: state => {
    return state.fansSeatTags.map(item => {
      const children = item.fansGroupAndTagDtos.map(item => {
        const children1 = (item.fansWxTagDtos || []).map(_item => {
          return { ..._item, id: _item.tagId, name: _item.tagName }
        })
        return {
          ...item,
          id: item.id,
          name: item.name,
          mode: item.specialGroup === 1 ? 'radio' : 'checkbox',
          children: children1
        }
      })
      return { id: item.appAccountId, name: item.wxAccountNumName, children }
    })
  }
}

const mutations = {
  SET_ALLLOADING(state, payload) {
    state.allloading = payload
  },
  SET_groupLOADING(state, payload) {
    state.groupLoading = payload
  },
  SET_SEATLOADING(state, payload) {
    state.seatLoading = payload
  },
  SET_CONDLIST(state, data) {
    state.condList = data
  },
  SET_PUBLICACCOUNTLIST(state, data) {
    state.publicAccountList = data
  },
  SET_ALLFANS(state, payload) {
    state.allFans = payload
  },
  SET_SEATLIST(state, payload) {
    let { records } = payload
    const firstTag = { id: -1, name: '全部用户' }
    const sencondTag = {
      id: 0,
      name: '无所属客服粉丝'
    }
    records = records.map(item => {
      return {
        id: item.id,
        name: (item.eeName || '--') + item.seatNo
      }
    })
    state.seatInfoList = [firstTag, sencondTag, ...records]
  },
  SET_GROUPLIST(state, payload) {
    state.fansGroupList = payload
  },
  SET_CURFANS(state, payload) {
    state.curFans = payload
  },
  CHANGE_CURFANS(state, payload) {
    state.curFans = { ...state.curFans, ...payload }
  },
  SET_FANSTAG(state, payload) {
    state.fanTags = payload
  },
  SET_FANSTAGBYSEAT(state, payload) {
    state.fansSeatTags = payload
  },
  SET_FANTagsByWx(state, payload) {
    state.fanTagsByWx = payload
  },
  // 粉丝轨迹
  SET_FANSRECORD(state, payload) {
    state.fansRecord = [...state.fansRecord, ...payload]
  },
   // 删除粉丝轨迹
   SET_CLEAR_RECORD(state) {
    state.fansRecord = []
  },
  // 会话互动统计
  SET_CONVERSATIONSTATISTICS(state, payload) {
    state.conversationStatistics = payload
  }
}
const actions = {
  // 根据坐席获取公众号
  async queryPublicsBySeat({ commit, state }, payload = {}) {
    const kfSeatId = state.fansGroupList.seatId
    const response = await queryPublicsBySeat({ ...payload, kfSeatId })
    if (response.code === 1 && response.data) {
      commit('SET_PUBLICACCOUNTLIST', response.data)
    }
    return response
  },
  async getPublicAccountList({ commit }, payload = {}) {
    const corpId = localStorageSaveOrRead('currentCorp').applyId
    const response = await queryPublicAccountList({ ...payload, corpId })
    if (response.code === 1 && response.data) {
      commit('SET_PUBLICACCOUNTLIST', response.data)
    }
    return response
  },
  async getAllList({ commit }, payload = {}) {
    commit('SET_ALLLOADING', true)
    const response = await queryAllFans({ ...payload })
    commit('SET_ALLLOADING', false)
    if (response.code === 1 && response.data) {
      commit('SET_ALLFANS', response.data)
    }
    return response
  },
  async getFan({ commit }, payload = {}) {
    const response = await queryFan({ ...payload })
    if (response.code === 1 && response.data) {
      commit('SET_CURFANS', response.data)
    }
    return response
  },
  async updateFansExtInfo({ dispatch }, payload = {}) {
    const response = await updateFansExtInfo({ ...payload })
    return response
  },
  async querySeatList({ commit }) {
    commit('SET_SEATLOADING', true)
    const response = await getSeatList({
      status: 'ACTIVE',
      offset: 0,
      limit: 30
    })
    commit('SET_SEATLOADING', false)
    if (response.code === 1 && response.data) {
      commit('SET_SEATLIST', response.data)
    }
    return response
  },
  async getGroupList({ commit }, payload = {}) {
    commit('SET_groupLOADING', true)
    const response = await queryKfGroupList(payload)
    commit('SET_groupLOADING', false)
    if (response.code === 1 && response.data) {
      commit('SET_GROUPLIST', response.data)
    }
    return response
  },
  async saveGroup({ dispatch }, payload = {}) {
    const response = await saveWxGroup({
      ...payload
    })
    if (response.code === 1 && response.data) {
      dispatch('getGroupList')
    }
    return response
  },
  async updateWxGroup({ state, dispatch }, payload = {}) {
    const response = await updateWxGroup({
      ...payload
    })
    if (response.code === 1) {
      dispatch('getGroupList')
    }
    return response
  },
  async deleteWxGroup({ state, dispatch }, payload = {}) {
    const response = await deleteWxGroup({
      ...payload
    })
    if (response.code === 1) {
      dispatch('getGroupList')
    }
    return response
  },
  async updateWxGroupByOrder({ state, dispatch }, payload = {}) {
    // const { fansGroupList } = state
    const response = await updateWxGroupByOrder({
      ...payload
    })
    if (response.code === 1) {
      dispatch('getGroupList')
    }
    return response
  },
  async getFansTags({ commit }, payload = {}) {
    const response = await queryTags(payload)
    if (response.code === 1 && response.data) {
      commit('SET_FANSTAG', response.fansGroupAndTagDtos)
    }
    return response
  },
  async getTagsBySeatId({ commit }, payload = {}) {
    // const { fansGroupList } = state
    const response = await getTagsBySeatId({
      ...payload
    })
    if (response.code === 1 && response.data) {
      let tags = response.data.list || []
      tags.forEach(group => {
        (group.fansGroupAndTagDtos || []).sort(sortBy('groupOrder')).forEach(item => {
          (item.fansWxTagDtos || []).sort(sortBy('tagOrder'))
        })
      })
      commit('SET_FANSTAGBYSEAT', tags)
    }
    return response
  },
  async getTagsByWx({ commit }, payload = {}) {
    const response = await getTagsBySeatId({
      ...payload
    })
    if (response.code === 1 && response.data) {
      let tags = response.data.list[0];
      (tags.fansGroupAndTagDtos || []).sort(sortBy('groupOrder')).forEach(item => {
        (item.fansWxTagDtos || []).sort(sortBy('tagOrder'))
      })
      commit('SET_FANTagsByWx', response.data.list[0])
    }
    return response
  },
  async updateBatchSetUserTag({ dispatch }, payload = {}) {
    const response = await updateBatchSetUserTag({
      ...payload
    })
    return response
  },
  async updateBatchSetFansUserTagSingle({ dispatch }, payload = {}) {
    const response = await updateBatchSetFansUserTagSingle({
      ...payload
    })
    return response
  },
  // 设置坐席
  async updateKfSeatSet({ dispatch }, payload = {}) {
    const response = await updateKfSeatSet({
      ...payload
    })
    return response
  },
  // 设置坐席
  async updateKfSeat({ dispatch }, payload = {}) {
    const response = await updateKfSeat({
      ...payload
    })
    return response
  },
  async updateWxGroupByMoveSingle({ dispatch }, payload = {}) {
    const response = await updateWxGroupByMoveSingle({
      ...payload
    })
    if (response.code === 1) {
      dispatch('getGroupList')
    }
    return response
  },
  async updateWxGroupByMove({ dispatch }, payload = {}) {
    const response = await updateWxGroupByMove({
      ...payload
    })
    if (response.code === 1) {
      dispatch('getGroupList')
    }
    return response
  },
  async queryCondList({ commit }, payload = {}) {
    const response = await querySelectConditions({
      ...payload
    })
    if (response.code === 1 && response.data) {
      commit('SET_CONDLIST', response.data)
    }
    return response
  },
  async addCond({ dispatch }, payload = {}) {
    const response = await addSelectCondition({
      ...payload
    })
    if (response.code === 1) {
      dispatch('queryCondList')
    }
    return response
  },
  async deleteCond({ dispatch }, payload = {}) {
    const response = await deleteSelectCondition({
      ...payload
    })
    if (response.code === 1) {
      dispatch('queryCondList')
    }
    return response
  },
  async deleteFans(_, payload = {}) {
    const response = await deleteFans(payload)
    return response
  },
  async syncFans(_, payload = {}) {
    const response = await syncFans(payload)
    return response
  },
  async updateExclusiveSeat(_, payload = {}) {
    const response = await updateExclusiveSeat(payload)
    return response
  },
  async createConversation(_, payload = {}) {
    const response = await createConversation(payload)
    return response
  },
  // 粉丝轨迹
  async getFansRecord({ commit, state }, payload) {
    let seatId = state.fansGroupList.seatId
    let limit = 20
    if (payload.offset === 1) {
      commit('SET_CLEAR_RECORD')
    }
    payload.offset = (payload.offset - 1) * limit
    let params = {
      seatId,
      offset: 0,
      limit,
      ...payload
    }
    const res = await getFansRecord(params)
    const { code, data } = res
    if (code === 1) {
      let len = (data.records && data.records.length) || 0
      if (len > 0) {
        let records = data.records.map(item => {
          let content = JSON.parse(item.content) || {}
          item.msgType = utilConst.messageCodeAndKey[item.msgType].type
          item.msgBodyType = utilConst.msgBodyTypeTransfrom[item.bodyType]
          item.createId = item.createId
          item.createTime = item.createTime
          item.code = content.code
          item.contextMap = content.contextMap
          delete item.head
          delete item.content
          return item
        })
        commit('SET_FANSRECORD', records.sort(sortBy('createTime','max')))
      } else {
        commit('SET_FANSRECORD', data.records || [])
      }
    } else {
      commit('SET_FANSRECORD', data.records || [])
    }
    return res
  },
  // 会话互动统计
  async getConversationStatistics({ commit, state }, payload) {
    let seatId = state.fansGroupList.seatId
    let params = {
      seatId,
      ...payload
    }
    const res = await getConversationStatistics(params)
    const { code, data } = res
    if (code === 1) {
      commit('SET_CONVERSATIONSTATISTICS', data)
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
