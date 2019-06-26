import componentModules from '@/utils/components'
import Request from '@/api/request'
import flyRequest from '@/api/fylRequest'
import * as Cookies from '@/utils/cookies'
import * as Utils from '@/utils/util'
import vueDirectives from './vueDirective'

const ENV_URL = process.env.MOBILE_BASE_URL

function action(str = '') {
  if (str === null) {
    str = ''
  }
  return str
}
export default {
  install(Vue, options) {
    Request()
    flyRequest()
    Vue.prototype.BASE_URL_CONST = ENV_URL
    Vue.prototype.constRedirectUrl = ENV_URL + '/admin/authorization'
    Vue.prototype.qrcodeUrl = ENV_URL + '/mobile/pay'
    Vue.prototype.ltIE10 = function (data) {
      let ie = navigator.appVersion.match(/MSIE\s(.+?);/i) || [0, 100000]
      return (parseInt(ie[1]) < 10)
    }
    Vue.prototype.isIE = function () {
      if (!!window.ActiveXObject || "ActiveXObject" in window) {
        return true
      } else {
        return false
      }
    }
    Vue.prototype.deepCopy = function (data) {
      return JSON.parse(JSON.stringify(data))
    }
    // 将分换算成元并保留两位小数
    Vue.prototype.insertPoint = function (str) {
      // str = str.toString()
      // if (str.length === 1) {
      //   str = '00' + str
      // } else if (str.length === 2) {
      //   str = '0' + str
      // }
      // let len = str.length - 2
      // let newStr = str.substring(0, len) + '.' + str.substring(len, str.length)
      let newStr = (str / 100).toFixed(2)
      return newStr
    }
    Vue.prototype.bodyClick = function (data) {
      return document.body.click()
    }
    // 两个父子关系的数组去重
    Vue.prototype.ArrDistinct = function (arr1, arr2) {
      let result = arr1.filter(function (item1) {
        return arr2.every(function (item2) {
          return item2.id !== item1.id
        })
      })
      return result
    }
    // 数据转化
    Vue.prototype.transformData = function (obj, rules = {}, reverse, subobj, type, value) {
      // obj: 数据 object / array 类型
      // rules：需要将相关将属性转换的规则；{ 当前属性名：改变后属性名}
      // subobj： 树的子节点属性名
      // reverse: 翻转将属性转换的规则
      // type 和 value 是专门对自定义菜单和个性化菜单的菜单数据进行处理
      let reverseRules = {}
      if (reverse) {
        for (let key in rules) {
          reverseRules[rules[key]] = key
        }
        rules = reverseRules
      }
      const transform = function (obj, rules, subobj) {
        let temp = {}
        let constMarkting = ['posterTemplate']
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
            if (type) {
              if (!obj[type]) {
                obj[type] = 'text'
              }
              if (!obj['type']) {
                obj['type'] = 'click'
              }
              temp[key] = action(obj[rules[key]])
              if (key === 'uuid') {
                temp.uuid = Utils.uuid()
              }
              if (key === 'miniprogram' && obj[type] !== 'miniprogram') {
                temp.miniprogram = {
                  appid: '',
                  pagepath: '',
                  url: ''
                }
              }
              if (key === obj[type]) {
                temp[obj[type]] = action(obj[value])
                if (key === 'text') {
                  let reg = new RegExp('\\[userName\\]', 'g')
                  temp[obj[type]] = (temp[obj[type]] && temp[obj[type]].replace(reg, '[粉丝昵称]')) || ''
                }
                if (constMarkting.indexOf(key) >= 0) {
                  temp.type = 'markting'
                }
                if (key === 'miniprogram') {
                  temp.miniprogram = JSON.parse(obj[value])
                }
              }
            } else {
              // temp[rules[key]] = obj[key]
              if (key === 'type' && temp[key] === 'markting') {
                continue
              }
              temp[key] = obj[rules[key]]
            }
          }
        }
        return temp
      }
      if (Array.isArray(obj)) {
        return obj.map(item => transform(item, rules, subobj))
      }
      return transform(obj, rules, subobj)
    }
    // 将有父子关系的数据转换成树形结构数据
    Vue.prototype.toTreeData = function (data, attributes) {
      let resData = data
      let tree = []
      for (let i = 0; i < resData.length; i++) {
        if (resData[i].resParentId === attributes.rootId) {
          let obj = {
            id: resData[i][attributes.id],
            name: resData[i][attributes.name],
            urlName: resData[i][attributes.urlName],
            menuLevel: resData[i][attributes.menuLevel],
            menuPosition: resData[i][attributes.menuPosition],
            children: []
          }
          tree.push(obj)
          resData.splice(i, 1)
          i--
        }
      }
      run(tree)

      function run(chiArr) {
        if (resData.length !== 0) {
          for (let i = 0; i < chiArr.length; i++) {
            for (let j = 0; j < resData.length; j++) {
              if (chiArr[i].id === resData[j][attributes.parentId]) {
                let obj = {
                  id: resData[i][attributes.id],
                  name: resData[i][attributes.name],
                  urlName: resData[i][attributes.urlName],
                  menuLevel: resData[i][attributes.menuLevel],
                  menuPosition: resData[i][attributes.menuPosition],
                  children: []
                }
                chiArr[i].children.push(obj)
                resData.splice(j, 1)
                j--
              }
            }
            run(chiArr[i].children)
          }
        }
      }
      return tree
    }
    // 对一个对象数组按照对象某个属性进行排序
    Vue.prototype.sortBy = function (str, compare) {
      if (compare === 'max') {
        return function (obj1, obj2) {
          return obj2[str] - obj1[str]
        }
      } else {
        return function (obj1, obj2) {
          return obj1[str] - obj2[str]
        }
      }
    }
    // 每隔三位小数加逗号
    Vue.prototype.addComma = function (num) {
      num = (num || 0).toString()
      var result = ''
      while (num.length > 3) {
        result = ',' + num.slice(-3) + result
        num = num.slice(0, num.length - 3)
      }
      if (num) {
        result = num + result
      }
      return result
    }

    Vue.prototype.openMessage = (arg, fn) => {
      let html = ''
      if (!arg.bool) {
        html = '<span style="color: #C44DDC">' + arg.str + '</span>'
      } else {
        html = '<i style="color: red">' + arg.str + '</i>'
      }
      arg.ele.$alert(html, arg.title, {
        dangerouslyUseHTMLString: true,
        showClose: false,
        callback: () => {
          if (fn) fn()
        }
      })
    }
    Vue.prototype.addUploadUrl = (url, arr) => {
      let _arr = []
      arr.forEach((item, index) => {
        _arr.push(url + item)
      })
      return _arr
    }
    Vue.prototype.dedupe = function (array) {
      return Array.from(new Set(array))
    }
    Vue.prototype.isArray = function (obj) {
      return Object.prototype.toString.call(obj) === '[object Array]'
    }
    // 全局监听click事件，用于全局点击的时候隐藏内容
    Vue.prototype.globalClick = function (callback) {
      document.getElementById('app').onclick = function () {
        callback()
      }
    }
    Vue.prototype._BUS = new Vue()
    Vue.prototype.format = function (millisecond, fmt) {
      millisecond = (millisecond + '0000').slice(0, 13)

      const time = new Date(parseInt(millisecond))
      const o = {
        'M+': time.getMonth() + 1,
        'd+': time.getDate(),
        'h+': time.getHours(),
        'm+': time.getMinutes(),
        's+': time.getSeconds(),
        'q+': Math.floor((time.getMonth() + 3) / 3),
        'S': time.getMilliseconds()
      }

      if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (time.getFullYear() + '').substr(4 - RegExp.$1.length))
      }

      for (let k in o) {
        if (new RegExp('(' + k + ')').test(fmt)) {
          fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
        }
      }

      return fmt
    }
    Vue.prototype._computedTreeTotal = function (obj, rules, subobj, ruleSumItem, expand) {
      // obj: 整个树
      // rules：需要将相关将属性转换的规则；{ 当前节点新增属性名：父节点属性名}
      // subobj： 树的子节点属性名
      // ruleSumItem: 树的累计属性名
      // add
      // 展开的深度
      let expandDeep = 3
      let currentDeep = 0
      const copyTarget = (obj, objIndex, rules, subobj, ruleSumItem, arr, childflag, currflag) => {
        // 判断展开
        if (currentDeep < expandDeep) obj.expand = true
        currentDeep++

        let temp = {}
        temp['flag'] = childflag || 'tree'

        let _arr = arr || []
        _arr.push(temp)
        _arr.forEach(item => {
          // 继承操作
          if (temp['flag'].includes(item.flag)) {
            item[ruleSumItem] === undefined && (item[ruleSumItem] = 0)
            item[ruleSumItem] += obj[rules[ruleSumItem]] || 0
          }
          // 统计计算
          if (currflag === item.flag) {
            for (let key in rules) {
              if (key !== ruleSumItem) {
                temp[key] = item[rules[key]]
              } else {
                temp[key] = 0
              }
            }
          }
        })

        for (let key in obj) {
          if (key === subobj && Array.isArray(obj[subobj])) {
            temp[key] = []
            obj[key].forEach((item, index) => {
              let childflag = temp.flag + "-" + index
              let currflag = temp.flag
              temp[key].push(copyTarget(item, index, rules, subobj, ruleSumItem, _arr, childflag, currflag))
            })
          } else {
            temp[key] = obj[key]
          }
        }
        return temp
      }
      if (Array.isArray(obj)) {
        return obj.map((item, index) => copyTarget(item, index, rules, subobj, ruleSumItem))
      } else {
        return copyTarget(obj, 0, rules, subobj, ruleSumItem)
      }
    }

    for (let key in Cookies) {
      Vue.prototype[key] = Cookies[key]
    }
    for (let key in Utils) {
      Vue.prototype[key] = Utils[key]
    }
    // 将plugins下面所有的vue组件注册为全局组件
    for (let key in componentModules) {
      Vue.component(key, componentModules[key])
    }
    // 添加v-directive
    for (let key in vueDirectives) {
      Vue.directive(key, vueDirectives[key])
    }
  }
}
