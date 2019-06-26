import expressionList from '@/utils/expression.js'

export const filtTags = (val) => {
  return val.replace(/(<\/?[a-z]+[^>]*\/?>)|(&nbsp;)/g,'')
}
export const insertToTags = (val) => {
  val = val.replace(/(&nbsp;)|(\\n)|↵/g, '<div><br></div>')
    .replace(/"(.*)"/, "$1")
    .replace(/\$\{nickName\}/g, '[粉丝昵称]') //  昵称
  return val
}

const _filterTags = (val) => {
  val = val.replace(/(<\/?[a-z]+[^>]*\/?>)|(&nbsp;)/g,'')
        .replace(/\[粉丝昵称\]/g, '${nickName}') // [粉丝昵称] ：${nickName}
  return val
}

const _addTags = (val) => {
  //  换行符
  val = val.replace(/(&nbsp;)|(\\n)|↵/g, '<div><br></div>')
      .replace(/"(.*)"/, "$1")
      .replace(/\$\{nickName\}/g, '[粉丝昵称]') //  昵称
  //  表情
  function changeAltToSrc(str) {
    let arr = str.match(/\[(.{1,2}?)\]/g) || []
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
  val = changeAltToSrc(val)
  return val
}

const _changeMenu = (subMenuList) => {
  let arr = subMenuList
  arr.forEach(item => {
    if (item.key === "text") {
      item.value = _addTags(item.value)
    }
    item.subMenu && _changeMenu(item.subMenu)
  })

  return arr
}


export const filterTags = _filterTags
export const addTags = _addTags
export const changeMenu = _changeMenu



