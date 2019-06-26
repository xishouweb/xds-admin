let CHAT_URL = process.env.CHAT_BASE_URL

export default {
  data() {
    return {}
  },
  methods: {
    beforeGo(param) {

    },
    goTargetSys() {
      if (CHAT_URL) {
        let sessionId = getCookieSession()
        let applyId = value.applyId
        let uid = value.userId
        let fansId = value.fansId
        const baseUrl = `${CHAT_URL}/login?sid=${sessionId}&corpId=${applyId}&uid=${uid}`
        const url = fansId ? `${baseUrl}&fansId=${fansId}` : baseUrl
        el.onclick = function() {
          window.open(url)
        }
      } else {
        console.error('请填写要跳转的地址')
      }
    }
  },
}
