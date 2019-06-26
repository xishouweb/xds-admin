import dayjs from 'dayjs'
import { localStorageSaveOrRead } from '@/utils/util'
export default {
  urlFilter(src) {
    if (!src) {
      return ""
    } else if (src && src.includes('myqcloud.com')) { // 腾讯云地址
      if (src.includes('https://') || src.includes('http://')) {
        return src
      } else {
        return 'https://' + src
      }
    } else if (src.indexOf('/') === 0) {
      return `http://${localStorageSaveOrRead('CLOUDURL')}${src}`
    } else {
      return src
    }
  },
  defaultMerial(src) {
    return src || require('@S/images/material/default.png')
  },
  fileSizeFilter(size) {
    // size 单位byte
    if (size < 1024) {
      return size + 'B'
    } else if (size < 1024 * 1024) {
      return (size / 1024).toFixed(3) + 'KB'
    } else {
      return (size / (1024 * 1024)).toFixed(3) + 'MB'
    }
  },
  filterSaveDate(str) {
    return str ? str.replace(/(.*?)\s.*/, '$1') : str
  },
  filterTimelength: val => {
    let time = val || 0
    let date = new Date(time)
    time = date.toGMTString(time).substring(17, 25)
    time = !val
      ? '--'
      : (time === '00:00:00'
          ? time.substring(7) + '.' + date.getMilliseconds()
          : time.substring(0, 2) === '00'
          ? time.substring(3)
          : time) + '"'

    return time
  },
  filterDate: val => {
    if (!val) {
      return '--'
    }
    const week = {
      0: '周日',
      1: '周一',
      2: '周二',
      3: '周三',
      4: '周四',
      5: '周五',
      6: '周六'
    }
    let _date = val
    const weekIndex = new Date(_date).getDay()

    let time = _date.substring(11, 16)
    let today = new Date().toLocaleDateString()
    today = new Date(today).getTime()
    let date = _date.substring(0, 10)
    date = new Date(date).getTime()

    let days = (today - date) / 1000 / 60 / 60 / 24
    if (days <= 0) {
      _date = time
    } else if (days > 0 && days <= 1) {
      _date = '昨天 ' + time
    } else if (days > 1 && days < 6) {
      _date = week[weekIndex] + ' ' + time
    }
    return _date
  },
  filterString(val) {
    return val || '--'
  },
  filterWxAvatar(val, target) {
    if (val) {
      return val.replace(/(.+\/)(\d+)/g, ($0, $1) => {
        return $1 + target
      })
    }
    return val
  },
  filtTags(val) {
    // 过滤标签
    return val.replace(/(<\/?[a-z]+[^>]*\/?>)|(&nbsp;)/g, '')
  },
  filtLine(val) {
    // 过滤换行符
    return val.replace(/\\n/g, '')
  },
  filtSecs(val) {
    // 过滤掉时间数据中的秒值
    return val.slice(0, -3)
  },
  chatFilterDate(val, type) {
    if (!val) {
      return '--'
    }
    const week = {
      0: '周日',
      1: '周一',
      2: '周二',
      3: '周三',
      4: '周四',
      5: '周五',
      6: '周六'
    }
    // let _date = val.toString().length < 13 ? val * 1000 : val
    let _date = val
    let days = dayjs(dayjs(new Date()).format('YYYY-MM-DD')).diff(
      dayjs(dayjs(_date).format('YYYY-MM-DD')),
      'day'
    )
    let fromatDate = '--'
    if (days <= 0) {
      fromatDate = dayjs(_date).format('HH:mm')
    } else if (days > 0 && days <= 1) {
      fromatDate = '昨天'
    } else if (days <= 6) {
      fromatDate = week[dayjs(_date).day()]
    } else {
      fromatDate = dayjs(_date).format('YYYY-MM-DD')
    }
    if (type === 'content') {
      if (days <= 0) {
        fromatDate = dayjs(_date).format(' HH:mm:ss')
      } else {
        fromatDate = dayjs(_date).format('YYYY-MM-DD HH:mm:ss')
      }
    } else if (type === 'notSecond') {
      if (days <= 0) {
        fromatDate = dayjs(_date).format(' HH:mm')
      } else {
        fromatDate = dayjs(_date).format('YYYY-MM-DD HH:mm')
      }
    }
    return fromatDate
  },
  todayTimeOtherDate(val, type) { // 当天显示时间其他显示日期
    if (!val) {
      return '--'
    }
    let _date = val
    let days = dayjs(dayjs(new Date()).format('YYYY-MM-DD')).diff(
      dayjs(dayjs(_date).format('YYYY-MM-DD')),
      'day'
    )
    let fromatDate = '--'
    if (days <= 0) {
      fromatDate = dayjs(_date).format('HH:mm')
    } else {
      fromatDate = dayjs(_date).format('YYYY-MM-DD')
    }
    return fromatDate
  },
  addComma(num) {
    num = (num || 0).toString()
    return num.replace(/(\d)(?=(\d{3})+$)/g, "$1,")
  }
}
