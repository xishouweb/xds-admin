import {
  queryCssGroup,
  queryMsgGroup } from "@/api/publicNum"
const state = {
  accountLoading: false,
  publicAccountList: [],
  groupId: null,
  mediaId: null,
  curPublic:
    localStorage.getItem("curAccount") !== "undefined"
      ? JSON.parse(localStorage.getItem("curAccount"))
      : {},
  graphicGroupList: [],
  imageGroupList: [],
  audioGroupList: [],
  videoGroupList: [],
  fileGroupList: [],
  newCreatedGraphic: null,
  newCreateTemplateMsgId: null,
  cloudMediaCount: {}
}

function sortGrouplist(data) {
  let total = 0
  data.forEach(item => {
    total += item.count || 0
  })
  data.sort((item1, item2) => {
    return item1.groupOrder - item2.groupOrder
  })
  return [{ name: "全部", count: total }, ...data] || []
}

function findDefauleId(group) {
  let find = group.find(item => item.groupType === 0)
  return find ? find["groupId"] : 0
}

const getters = {
  publicAccountList: state => state.publicAccountList,
  validPublicAList: state => {
    return state.publicAccountList.filter(item => item.status === 1)
  },
  hasAccount: state => state.publicAccountList.length,
  hasValidAccount: state => {
    return state.publicAccountList.some(item => item.status === 1)
  },
  accountLoading: state => state.accountLoading,
  curPublic: state => state.curPublic,
  groupId: state => state.groupId,
  mediaId: state => state.mediaId,
  getGraphicGroupList: state => state.graphicGroupList,
  getImageGroupList: state => state.imageGroupList,
  getAudioGroupList: state => state.audioGroupList,
  getVideoGroupList: state => state.videoGroupList,
  getFileGroupList: state => state.fileGroupList,
  graphicDefaultGroupId: state => findDefauleId(state.graphicGroupList),
  imageDefaultGroupId: state => findDefauleId(state.imageGroupList),
  audioDefaultGroupId: state => findDefauleId(state.audioGroupList),
  videoDefaultGroupId: state => findDefauleId(state.videoGroupList),
  fileDefaultGroupId: state => findDefauleId(state.fileGroupList),
  getCloudMediaCount: state => state.cloudMediaCount
}

const mutations = {
  SET_CLOUD_MEDIA_COUNT(state, data) {
    state.cloudMediaCount = data
  },
  SET_ACCOUNTLOADING(state, data) {
    state.accountLoading = data
  },
  SET_PUBLICACCOUNTLIST(state, data) {
    state.publicAccountList = data
  },
  SET_CORPINFO(state, data) {
    state.curPublic = data
  },
  SET_GROUPID(state, data) {
    state.groupId = data
  },
  SET_MEDIA(state, data) {
    state.mediaId = data
  },
  SET_GRAHPIC_GROUPLIST(state, data) {
    state.graphicGroupList = data
  },
  SET_IMAGE_GROUPLIST(state, data) {
    state.imageGroupList = data
  },
  SET_AUDIO_GROUPLIST(state, data) {
    state.audioGroupList = data
  },
  SET_VIDEO_GROUPLIST(state, data) {
    state.videoGroupList = data
  },
  SET_FILE_GROUPLIST(state, data) {
    state.fileGroupList = data
  },
  SET_NEW_CREATED_GRAPHIC(state, data) {
    state.newCreatedGraphic = data
  },
  SET_CREATED_TEMPLATE_MSG_ID(state, data) {
    state.newCreateTemplateMsgId = data
  }
}

const actions = {
  async queryCssGroup({ commit }, payload) {
    // 分组媒体类型,news:图文;image:图片;voice:语音;video:视屏;file:文件
    const res = await queryCssGroup(payload)
    let data = res.code === 1 ? sortGrouplist(res.data) : []
    if (payload.type === "news") {
      commit("SET_GRAHPIC_GROUPLIST", data)
    } else if (payload.type === "image") {
      commit("SET_IMAGE_GROUPLIST", data)
    } else if (payload.type === "voice") {
      commit("SET_AUDIO_GROUPLIST", data)
    } else if (payload.type === "video") {
      commit("SET_VIDEO_GROUPLIST", data)
    } else if (payload.type === "file") {
      commit("SET_FILE_GROUPLIST", data)
    }
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}

