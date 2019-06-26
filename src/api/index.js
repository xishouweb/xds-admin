import axios from 'axios'
import store from '@/store'
import {
  getCookieSession,
  setCookieSession,
  getToken,
  setToken
} from '@/utils/cookies'
// 普通请求

const service = axios.create({
  withCredentials: false, // 允许携带cookie
  timeout: 60000,
  baseURL: process.env.API_ROOT
})
// respone interceptor
service.interceptors.response.use(
  response => {
    let data = response.data
    if (data.code === 200) {
      store.dispatch('user/setMessage', 2)
    } else if (data.code >= 201 && data.code <= 299) {
      store.dispatch('user/setMessage', 3)
    } else if (data.code === 1) {
      store.dispatch('user/setMessage', 1)
    }
    return response
  },
  error => {
    // Message.error({ content: error, duration: 10 })
    return Promise.reject(error)
  })
service.interceptors.request.use(
  config => {
    return config
  },
  err => {
    return Promise.reject(err)
  }
)

function toType(obj) {
  return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase()
}
function filterNull(o) {
  for (var key in o) {
    if (o[key] === null) {
      delete o[key]
    }
    if (toType(o[key]) === 'string') {
      o[key] = o[key].trim()
    } else if (toType(o[key]) === 'object') {
      o[key] = filterNull(o[key])
    } else if (toType(o[key]) === 'array') {
      o[key] = filterNull(o[key])
    }
  }
  return o
}
function getData(url, paramsData) {
  return new Promise((resolve, reject) => {
    service.get(url, {
      params: paramsData
    }).then((res) => {
      resolve(res.data)
    }).catch((err) => {
      let res = err.response
      if (res) {
        reject(err)
      }
    })
  })
}
function getPostData(url, paramsData) {
  return new Promise((resolve, reject) => {
    service.post(url, paramsData).then((res) => {
      resolve(res.data)
    }).catch((err) => {
      let res = err.response
      if (res) {
        reject(err)
      }
    })
  })
}
function apiGetSessionId() {
  return new Promise((resolve, reject) => {
    service.get('/api/getSessionId').then((res) => {
      res.data.sessionId = res.data.sessionId
      resolve(res.data)
    }).catch((err) => {
      let res = err.response
      if (res) {
        reject(err)
      }
    })
  })
}
// get 请求
function getApiAxios(url, params, isSaveToken) {
  if (params) {
    params = filterNull(params)
  } else {
    params = {}
  }
  let obj = {}
  let sessionId = getCookieSession()
  let timestamp = new Date()
  obj.timestamp = timestamp.getTime()
  if (!isSaveToken) {
    let token = getToken()
    if (token) {
      setToken(token, 0.5)
    }
  }
  if (sessionId) {
    obj.sessionId = sessionId
    setCookieSession(sessionId, 0.5)
    let paramsData = Object.assign({}, params, obj)
    return getData(url, paramsData)
  } else {
    return apiGetSessionId().then(data => {
      if (data.sessionId) {
        setCookieSession(data.sessionId, 0.5)
        obj.sessionId = data.sessionId
        let paramsData = Object.assign({}, params, obj)
        return getData(url, paramsData)
      }
    })
  }
}
// post 请求
function postApiAxios(url, params) {
  if (params) {
    params = filterNull(params)
  } else {
    params = {}
  }
  let obj = {}
  let sessionId = getCookieSession()
  let token = getToken()
  if (token) {
    setToken(token, 0.5)
  }
  if (sessionId) {
    obj.sessionId = sessionId
    setCookieSession(sessionId, 0.5)
    let paramsData = Object.assign({}, params, obj)
    return getPostData(url, paramsData)
  } else {
    return apiGetSessionId().then(data => {
      setCookieSession(data.sessionId, 0.5)
      obj.sessionId = data.sessionId
      let paramsData = Object.assign({}, params, obj)
      return getPostData(url, paramsData)
    })
  }
}
function httpPost(url, args) {
  if (args) {
    args = filterNull(args)
  } else {
    args = {}
  }
  args.sessionId = getCookieSession()

  return new Promise(function (resolve, reject) {
    service
      .post(url, args)
      .then(function (r) {
        resolve(r)
      })
      .catch(function (err) {
        reject(err)
      })
  })
}

// 上传请求 超长延时 timeout 时分钟
const uploadService = axios.create({
  withCredentials: false, // 允许携带cookie
  timeout: 1000 * 60 * 10,
  baseURL: process.env.API_ROOT
})
// respone interceptor
uploadService.interceptors.response.use(
  response => {
    let data = response.data
    if (data.code >= 200 && data.code <= 299) {
      store.dispatch("user/setMessage", 2)
    } else if (data.code === 1) {
      store.dispatch("user/setMessage", 1)
    }
    return response
  },
  error => {
    // Message.error({ content: error, duration: 10 })
    return Promise.reject(error)
  }
)
uploadService.interceptors.request.use(
  config => {
    return config
  },
  err => {
    return Promise.reject(err)
  }
)

function uploadHttpPost(url, args) {
  if (args) {
    args = filterNull(args)
  } else {
    args = {}
  }
  args.sessionId = getCookieSession()
  return new Promise(function(resolve, reject) {
    uploadService
      .post(url, args)
      .then(function(r) {
        resolve(r)
      })
      .catch(function(err) {
        reject(err)
      })
  })
}


export default {
  get: function(url, params, isSaveToken) {
    return getApiAxios(url, params, isSaveToken)
  },
  post: function(url, params) {
    return postApiAxios(url, params)
  },
  $get: function(url, params, isSaveToken) {
    return getApiAxios(url, params, isSaveToken)
  },
  $post: function(url, params) {
    return httpPost(url, params)
  },
  $uploadPost: function(url, params) {
    return uploadHttpPost(url, params)
  }
}
