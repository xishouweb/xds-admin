import dayjs from 'dayjs'
/* eslint-disable */
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}
export function localStorageSaveOrRead(key, val) {
  if (val) {
    localStorage[key] = JSON.stringify(val)
  } else {
    if (localStorage[key]) {
      return JSON.parse(localStorage[key])
    } else {
      return null
    }
  }
}

export function localStorageRemove(key) {
  if (localStorage[key]) {
    localStorage.removeItem(key)
  }
}

export function sessionStorageSaveOrRead(key, val) {
  if (val) {
    sessionStorage[key] = JSON.stringify(val)
  } else {
    if (sessionStorage[key]) {
      return JSON.parse(sessionStorage[key])
    } else {
      return {}
    }
  }
}
export function shuffle(arr) {
  let _arr = arr.slice()
  for (let i = 0; i < _arr.length; i++) {
    let j = getRandomInt(0, i)
    let t = _arr[i]
    _arr[i] = _arr[j]
    _arr[j] = t
  }
  return _arr
}

export function isNumber(inputData) {
  if (parseFloat(inputData).toString() === 'NaN') {
    return false
  } else {
    return true
  }
}
// 计算字符串的长度 单字节占一个 中文占两个
export function strLen(str) {
  var len = 0
  for (var i=0; i < str.length; i++) {
    var c = str.charCodeAt(i)
  //单字节加1
    if ((c >= 0x0001 && c <= 0x007e) || (0xff60<=c && c<=0xff9f)) {
      len++
    } else {
      len+=2
    }
  }
  return len
}
export function debounce(func, delay) {
  let timer
  return function(...args) {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      func.apply(this, args)
    }, delay)
  }
}

export function uuid() {
  var s = []
  var hexDigits = '0123456789abcdef'
  for (var i = 0; i < 36; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1)
  }
  s[14] = '4' // bits 12-15 of the time_hi_and_version field to 0010
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1) // bits 6-7 of the clock_seq_hi_and_reserved to 01
  s[8] = s[13] = s[18] = s[23] = '-'

  var uuid = s.join('')
  return uuid
}
export function DateDiff(sDate1) {
  // sDate1和sDate2是2002-12-18格式
  let sDate2 = Thistime()
  let aDate, oDate1, oDate2, iDays
  aDate = sDate1.split('-')
  oDate1 = new Date(aDate[1] + '-' + aDate[2] + '-' + aDate[0]) // 转换为12-18-2002格式
  aDate = sDate2.split('-')
  oDate2 = new Date(aDate[1] + '-' + aDate[2] + '-' + aDate[0])
  iDays = parseInt((oDate1 - oDate2) / 1000 / 60 / 60 / 24) // 把相差的毫秒数转换为天数
  return iDays
}

function Thistime() {
  // 当前日期
  let date = new Date()
  let year = date.getFullYear()
  let month = date.getMonth() + 1
  let day = date.getDate()
  let time = year + '-' + month + '-' + day
  return time
}

// 每隔三位小数加逗号
export function addComma(num) {
  num = (num || 0).toString()
  // var result = ''
  // while (num.length > 3) {
  //   result = ',' + num.slice(-3) + result
  //   num = num.slice(0, num.length - 3)
  // }
  // if (num) {
  //   result = num + result
  // }
  return num.replace(/(\d)(?=(\d{3})+$)/g, "$1,")
}

export function _transformData(obj, rules = {}, reverse, subobj) {
  let reverseRules = {}
  if (reverse) {
    for (let key in rules) {
      reverseRules[rules[key]] = key
    }
    rules = reverseRules
  }
  const transform = function(obj, rules, subobj) {
    let temp = {}
    for (let key in rules) {
      if (key === subobj && obj[key]) {
        if (Array.isArray(obj[key])) {
          temp[rules[key]] = []
          obj[key].forEach(_item => {
            temp[rules[key]].push(transform(_item, rules, subobj))
          })
        } else {
          temp[rules[key]] = transform(obj[key], rules, subobj)
        }
      } else {
        temp[rules[key]] = obj[key]
      }
    }
    return temp
  }
  return transform(obj, rules, subobj)
}

export function deepClone(obj) {
  let objClone = Array.isArray(obj) ? [] : {}
  if (obj && typeof obj === 'object') {
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        // 判断ojb子元素是否为对象，如果是，递归复制
        if (obj[key] && typeof obj[key] === 'object') {
          objClone[key] = deepClone(obj[key])
        } else {
          // 如果不是，简单复制
          objClone[key] = obj[key]
        }
      }
    }
  }
  return objClone
}

export function divideGroup(arr, groupName) {
  let map = {}
  let dest = []
  for (var i = 0; i < arr.length; i++) {
    var ai = arr[i]
    if (!map[ai.groupName]) {
      dest.push({
        groupName: ai.groupName,
        data: [ai],
        roleId: [ai.roleId]
      })
      map[ai.groupName] = ai
    } else {
      for (var j = 0; j < dest.length; j++) {
        var dj = dest[j]
        if (dj.groupName === ai.groupName) {
          dj.data.push(ai)
          dj.roleId.push(ai.roleId)
          break
        }
      }
    }
  }
  return dest
}
// 两个数组去重（1）
export function ArrDistinct(arr1, arr2) {
  let result = arr1.filter(function(item1) {
    return arr2.every(function(item2) {
      return item2.id !== item1.id
    })
  })
  return result
}

export function toFix(val, num) {
  let n = num === undefined ? 2 : num
  if (parseFloat(val).toString() === 'NaN') {
    return '--'
  } else {
    return (parseInt(val * 100) / 100).toFixed(n)
  }
}

export function skipUrl(url) {
  if (!!window.ActiveXObject || 'ActiveXObject' in window) {
    let newLink = document.createElement('a')
    newLink.href = url
    newLink.target = '_blank'
    document.body.appendChild(newLink)
    newLink.click()
    document.body.removeChild(newLink)
  } else {
    location.href = url
  }
}

// 格式化时间
export function formatDateTime(date) {
  let y = date.getFullYear()
  let m = date.getMonth() + 1
  m = m < 10 ? '0' + m : m
  let d = date.getDate()
  d = d < 10 ? '0' + d : d
  let h = date.getHours()
  h = h < 10 ? '0' + h : h
  let minute = date.getMinutes()
  minute = minute < 10 ? '0' + minute : minute
  let second = date.getSeconds()
  second = second < 10 ? '0' + second : second
  return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second
}

export function IsURL(str_url) {
  var strRegex =
    '^((https|http|ftp|rtsp|mms)?://)' +
    "?(([0-9a-z_!~*'().&=+$%-]+: )?[0-9a-z_!~*'().&=+$%-]+@)?" + //ftp的user@
    '(([0-9]{1,3}.){3}[0-9]{1,3}' + // IP形式的URL- 199.194.52.184
    '|' + // 允许IP和DOMAIN（域名）
    "([0-9a-z_!~*'()-]+.)*" + // 域名- www.
    '([0-9a-z][0-9a-z-]{0,61})?[0-9a-z].' + // 二级域名
    '[a-z]{2,6})' + // first level domain- .com or .museum
    '(:[0-9]{1,4})?' + // 端口- :80
    '((/?)|' + // a slash isn't required if there is no file name
    "(/[0-9a-z_!~*'().;?:@&=+$,%#-]+)+/?)$"
  var re = new RegExp(strRegex)

  if (re.test(str_url)) {
    return true
  } else {
    return false
  }
}

export function fileSuffix(filename) {
  if (filename) {
    var index1 = filename.lastIndexOf('.')
    var index2 = filename.length
    var postf = filename.substring(index1 + 1, index2)
    return postf
  } else {
    return ''
  }
}

export function localSaveOrRead(key, val) {
  if (val) {
    localStorage[key] = JSON.stringify(val)
  } else {
    if (localStorage[key]) {
      return JSON.parse(localStorage[key])
    } else {
      return {}
    }
  }
}

export function deepCopy(data) {
  return JSON.parse(JSON.stringify(data))
}
// 去空格
export function filterWhiteSpace(str) {
  return str.replace(/\s/g, '')
}

export function on(ele, str, fn) {
  // 绑定事件兼容性写法
  if (ele.addEventListener) {
    ele.addEventListener(str, fn)
  } else if (ele.attachEvent) {
    ele.attachEvent('on' + str, fn)
  } else {
    ele['on' + str] = fn
  }
}
export function off(ele, str, fn) {
  // 解绑事件兼容性写法
  if (ele.removeEventListener) {
    ele.removeEventListener(str, fn)
  } else if (ele.detachEvent) {
    ele.detachEvent('on' + str, fn)
  } else {
    ele['on' + str] = null
  }
}
export function closePop(list, key, dex) {
  // 关闭poptip提示内容，参数（list:数据列表,key:控制poptip显示的字段名,dex:当前点击项索引）
  if (list && key) {
    if (dex !== undefined) {
      list.forEach((v, i) => {
        if (i !== dex) {
          this.$set(v, key, false)
        } else {
          this.$set(v, key, !v[key])
        }
      })
    } else {
      list.forEach(v => {
        this.$set(v, key, false)
      })
    }
  }
}

export function filterContextMap(contextMap) {
  let keyArr = Object.keys(contextMap)
  if (keyArr.length === 0) {
    return ''
  } else if (keyArr.length === 1) {
    return contextMap[keyArr[0]]
  }
  return contextMap
}

export function sortByChat(compare) {
  return function (obj1, obj2) {
    let createTime1 = unix((obj1.messageBody && obj1.messageBody.createTime) || obj1.createTime)
    let createTime2 = unix((obj2.messageBody && obj2.messageBody.createTime) || obj2.createTime)
    if (compare === 'max') {
      return createTime2 - createTime1
    }
    return createTime1 - createTime2
  }
}
export function sortBy(str, compare) {
  return function (obj1, obj2) {
    if (str === 'createTime') {
      let createTime1 = unix(obj1.createTime)
      let createTime2 = unix(obj2.createTime)
      if (compare === 'max') {
        return createTime2 - createTime1
      }
      return createTime1 - createTime2
    } else {
      if (compare === 'max') {
        return obj2[str] - obj1[str]
      }
      return obj1[str] - obj2[str]
    }
  }
}
const unix = function(val) {
  return dayjs(val).unix()
}
