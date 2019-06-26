/* eslint-disable */
let sid = Cookies.get('session')
let CONST_LOCATION = location.hostname
let CONST_API
switch (CONST_LOCATION) {
  case 'localhost':
    CONST_API = ''
    break
  case 'xdstest.xingke100.com':
    CONST_API = 'http://apitest.xingke100.com'
    break
  case 'xingke100.com':
    CONST_API = 'https://api.xingke100.com'
    break
  case 'xiaodashi.com':
    CONST_API = 'https://api.xiaodashi.com'
    break
  default:
    break
}
var API = {
  userInfo: Cookies.get('token') ? JSON.parse(Cookies.get('token')) : '',

  download: function() {
    axios.post(CONST_API + "/api/adminUser/queryCurrVersion").then(function(res) {
      let data = res.data
      if (data.code) {
        let cloud = CONST_API === 'http://apitest.xingke100.com' ? 'https://xds-10-2-1255528578.cos-website.ap-shanghai.myqcloud.com' : 'https://xds-10-1-1255528578.cos-website.ap-shanghai.myqcloud.com'
        $("#downloadBtn").attr('href', cloud + data.data.installUpdateUrl)
        $("#version").text(data.data.outsideVersion)
        $("#time").text((data.data.publishTime || '').split(' ')[0].replace(/-{1}/g, '.'))
      }
    })
  },
  logOut: function () {
    axios.get(CONST_API + "/api/adminCenter/logout?timestamp=1555162977040&sessionId=" + sid).then(function(res) {
      let data = res.data
      console.log(res)
      if (data.code === 1) {
        Cookies.remove('token')
        localStorage.clear()
        $(window).attr('location','/')
      }
    })
  }
}
