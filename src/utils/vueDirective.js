/* eslint-disable */
import { getCookieSession } from '@/utils/cookies'

export default {
  focus: {
    inserted: function(el) {
      // 聚焦元素
      el.focus()
    }
  },
  filterSpecialChar: {
    update: function(el, { value, modifiers }, vnode) {
      try {
        let input = null
        for (let i = 0; i < el.children.length; i++) {
          if (el.children[i].tagName === 'INPUT') {
            input = el.children[i]
            break
          }
        }
        if (!input.value) {
          return false
        }
        input.value = input.value
          .replace(/[^\a-\z\A-\Z0-9\u4E00-\u9FA5]/g, '')
          .replace(' ', '')

        input.dispatchEvent(new Event(modifiers.lazy ? 'change' : 'input'))
      } catch (e) {}
    }
  },
  limitLength: {
    update: function(el, { value, modifiers }, vnode) {
      try {
        let input = null
        if (el.tagName === 'INPUT') {
          input = el
        } else {
          for (let i = 0; i < el.children.length; i++) {
            if (el.children[i].tagName === 'INPUT') {
              input = el.children[i]
              break
            }
          }
        }
        if (!input.value) {
          return false
        }
        let text = value.replace(' ', '')
        let len = Object.keys(modifiers)[0]
        input.value = text ? text.substring(0, len) : text
        input.dispatchEvent(new Event(modifiers.lazy ? 'change' : 'input'))
      } catch (e) {}
    }
  },
  limitNumber: {
    update: function(el, { value, modifiers }, vnode) {
      try {
        let input = null
        if (el.tagName === 'INPUT') {
          input = el
        } else {
          for (let i = 0; i < el.children.length; i++) {
            if (el.children[i].tagName === 'INPUT') {
              input = el.children[i]
              break
            }
          }
        }
        if (!input.value) {
          return false
        }
        input.value = input.value.replace(/^0(\d)/g, '$1')
        let decimal = Object.keys(modifiers)[0] // 小数位长度

        if (decimal) {
          let regexp =  new RegExp(`\\.((\\d{0,${decimal}}).*)`, 'g')
          input.value = input.value.replace(/[^\d\.]/g, '').replace(regexp, '.$2')
        } else {
          input.value = input.value.replace(/[^\d]/g, '')
        }

        input.dispatchEvent(new Event(modifiers.lazy ? 'change' : 'input'))
      } catch (e) {}
    }
  },
  goChatServer(el, { value }) {
    // 配置地址
    let CHAT_URL = process.env.CHAT_BASE_URL
    if (CHAT_URL) {
      let sessionId = getCookieSession()
      let applyId = value.applyId
      let uid = value.userId
      let fansId = value.fansId
      const baseUrl = `${CHAT_URL}/?sid=${sessionId}&corpId=${applyId}&uid=${uid}`
      const url = fansId ? `${baseUrl}&fansId=${fansId}` : baseUrl
      el.onclick = function() {
        window.open(url)
      }
    } else {
      console.error('请填写要跳转的地址')
    }
  },
  setScrollBoxHeight: {
    inserted: function(el, { value, modifiers }) {
      // 设置滚动框高度
      const resize = () => {
        let offSetTop = el.getBoundingClientRect().top
        let screenH = document.body.clientHeight || document.documentElement.clientHeight
        let manOffsetHeight = parseInt(Object.keys(modifiers)[0]) || 0
          el.style.height = (screenH - offSetTop - manOffsetHeight) + 'px'
      }
      resize();
      window.addEventListener("resize", () => {
        resize();
      })
    }
  },
  drag: {
    bind:function (el, binding) {
    let oDiv = el;   //当前元素
    let self = this;  //上下文

    oDiv.onmousedown = function (e) {
      binding.modifiers.mousedown && (binding.value("down"))
      let parent = document.getElementById('drag-container') || document.body
      let parentPos = {
        left: parent.getBoundingClientRect().left,
        top: parent.getBoundingClientRect().top,
        width: parent.getBoundingClientRect().right - parent.getBoundingClientRect().left,
        height: parent.getBoundingClientRect().bottom - parent.getBoundingClientRect().top
      }
     //鼠标按下，计算当前元素距离可视区的距离
        let disX = e.clientX - oDiv.offsetLeft;
        let disY = e.clientY - oDiv.offsetTop;
        let disW = oDiv.getBoundingClientRect().right - oDiv.getBoundingClientRect().left
        let disH = oDiv.getBoundingClientRect().bottom - oDiv.getBoundingClientRect().top
        let isCanMove = true
        document.onmousemove = function (e) {
          //通过事件委托，计算移动的距离
          let l = e.clientX - disX;
              l < 0 && (l = 0)
              l + disW > parentPos.width && ( l =  parentPos.width - disW )

          let t = e.clientY - disY;
              t < 0 && (t = 0)
              t + disH > parentPos.height && ( t =  parentPos.height - disH )

          //移动当前元素
            oDiv.style.left = l + 'px';
            oDiv.style.top = t + 'px';
          //将此时的位置传出去
            // binding.value({x:e.pageX,y:e.pageY})
          // 将此事的相对位置传出去
            binding.value({x:l,y:t})
        };
        document.onmouseup = function (e) {
            binding.modifiers.mouseup && (binding.value('up'))
            document.onmousemove = null;
            document.onmouseup = null;
         };
      };
    }
  }

}
