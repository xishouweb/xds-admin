import expressionList from '@/utils/expression.js'
// const expressionList = []
const specialStr = '👻🙏💪🎉😄😷😂😝😳😱😔😒'

const reverseKeyAndVal = (obj) => {
  let _obj = {}
  for (let key in obj) {
    _obj[obj[key]] = key
  }
  return _obj
}

const insertTags = {
  "粉丝昵称": 'nickName',
  "分享者昵称": 'sharerNickName',
  "客服名称": 'customerServiceName',
  "海报名称": 'posterName',
  "需要关注数": 'activityNeedFollowers',
  "已邀请数量": 'invitedNum',
  "已取关数": 'cancelFollowNum',
  "还需关注数": 'stillNeedFollowersNum',
  "累计关注数": 'followersNum',
  "活动有效期": 'activityValidityPeriod',
  "裂变海报有效期": 'fansPosterValidityTime',
  "链接": 'link'
}
const changeKeyAndValInsertTags = reverseKeyAndVal(insertTags)

const getPattern = (insertTags) => {
  let keys = Object.keys(insertTags).map(item => '\\[' + item + '\\]').join('|')
      keys = new RegExp(keys, 'g')
  // 新建temp模板
  let temp = Object.keys(insertTags).map(item => '\\[' + item + '\\]').join('|')
      temp = new RegExp(temp, 'g')
  let values = Object.values(insertTags).map(item => '\\$\\{' + item + '\\}').join('|')
      values = new RegExp(values, 'g')
  return {
    keyPattern: keys,
    valuePattern: values,
    tempPattern: temp
  }
}
// 图片表情
function changeAltToSrc(str) {
  let arr = str.match(/\[(.{1,3}?)\]/g) || []
  let replacecdList = []
  arr.forEach(item => {
    let val = item.replace(/\[(.*)\]/, '$1')
    let emoji = expressionList.find(item => item.title === val)
    if (emoji && !replacecdList.includes(val)) {
      replacecdList.push(val)
      let pattern = new RegExp(`\\[${val}\\]`, "g")
      str = str.replace(pattern, `<img style="width:20px;height:20px;" src="${emoji.url}" alt="[${emoji.title}]">`)
    }
  })
  return str
}
// 特殊表情符
function changeSpecialEmoji(val) {
  return val.replace(/👻|🙏|💪|🎉|😄|😷|😂|😝|😳|😱|😔|😒/g, $0 => {
    let emoji = expressionList.find(item => item.title === $0)
    if (emoji) {
      return `<img style="width:20px;height:20px;" src="${emoji.url}" alt="[${emoji.title}]">`
    } else {
      return $0
    }
  })
}

// 生成相关的pattern
const { keyPattern, valuePattern, tempPattern } = getPattern(insertTags)

// 自定义菜单编辑器
const _filterTags = (val) => {
  if (!val) return val
  // style
  val = val.replace(/\sstyle="(.)*?"/g, '')
  val = val.replace(/\s*target="_blank"\s*/g, '')
  val = val.replace(/\s+/g, ' ')
  val = val.replace(/<a href="javascript:void\(0\)">(.)*?<\/a>/g, "$1")
  // 表情 和 特殊表情
  val = val.replace(/<img[^\[]*(\[(.*?)\]).*?>/g, ($0, $1, $2) => {
    return specialStr.includes($2) ? $2 : $1
  })
  // 换行符
  // val = val.replace(/(<[(div)|(p)|(h1)|(h2)|(h3)|(h4)|(h5)|(h6)][^<]*>)/g, '\\n') // 将常用的文本起始块标签转换成换行符
  // val = val.replace(/^[\\\\n]+/, '') // 过滤掉开头的换行符
  val = val.replace(/<\/p><p>/gm, '\\n')
  val = val.replace(/(<br\/?>\s*)+/gm, '\\n')
  // 清楚非 a 标签
  val = val.replace(/<[^b\/a][^>]*?>|<\/[^a][^>]*?>|(&nbsp;)/g, '').replace(/^(\\n\s*)+/, '')

  // 清除空的a 标签
  val = val.replace(/<a[^>]*?><\/a>/g, '')
  // 清除插入tags [****]
  val = val.replace(keyPattern, $0 => {
    let key = $0.replace(/.*\[(.*?)\].*/g, "$1")
    return '${' + insertTags[key] + '}'
  })
  return val
}

const _addTags = (val, toType = 'img', inline = false) => {
  // toImg: 快捷插入内容转换成 图片/文本 标签
  if (!val) return val
  //  换行符
  if (!inline) { // 多行
    val = val.replace(/(&nbsp;)|(\\n)|↵/g, '<br/>')
  } else { // 单行
    val = val.replace(/(&nbsp;)|(\\n)|↵/g, '')
  }
  // 插入tags
  let pattern = valuePattern
  val = val.replace(pattern, $0 => {
    let result
    const key = $0.replace(/\$\{(.*?)\}/g, "$1")
    if (toType === 'img') {
      const baseSrc = '/static/images/material/'
      result = `<img src="${baseSrc}[${changeKeyAndValInsertTags[key]}].png">`
    } else if (toType === 'span') {
      result = `<span style="color:#409fff">[${changeKeyAndValInsertTags[key]}]</span>`
    } else if (toType === 'text') {
      result = `[${changeKeyAndValInsertTags[key]}]`
    }
    return result
  })
  val = val.replace(/(href=".*?")/g, '$1 style="color: rgb(64, 159, 255);" target="_blank"')
  // 图片表情
  val = changeAltToSrc(val)
  // 特殊表情符
  val = changeSpecialEmoji(val)
  return val
}

// 模板消息编辑
const _tempFilterTags = (val) => {
  if (!val) return val
  val = val.replace(/(<br>\s*)+/gm, '\\n')
  // 清除插入tags [****]
  val = val.replace(tempPattern, $0 => {
    let key = $0.replace(/\[(.*?)\]/g, "$1")
    return '${' + insertTags[key] + '}'
  })
  // console.log(val)
  return val
}
const _tempAddTags = (val, inline = false) => {
  if (!val) return val
  //  换行符
  if (!inline) { // 多行
    val = val.replace(/(&nbsp;)|(\\n)|↵/g, '<div><br></div>')
  } else { // 单行
    val = val.replace(/(&nbsp;)|(\\n)|↵/g, '')
  }
  // 插入tags
  let pattern = getPattern(insertTags).valuePattern
  val = val.replace(pattern, $0 => {
    let key = $0.replace(/\$\{(.*?)\}/g, "$1")
    return `[${changeKeyAndValInsertTags[key]}]`
  })

  return val
}
export const filterTags = (arg) => { return !arg ? arg : _filterTags(arg) }
export const addTags = (arg, inline) => { return !arg ? arg : _addTags(arg, inline) }
export const tempFilterTags = (arg) => { return !arg ? arg : _tempFilterTags(arg) }
export const tempAddTags = (arg, inline) => { return !arg ? arg : _tempAddTags(arg, inline) }
// str = `你好！！！`
// console.log(_filterTags(str))
