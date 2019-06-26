import Vue from 'vue'
import iView from 'iview'
import router from './index'
import store from '@/store'
// import store from '@/store'
import { getToken, removeCookieSession, removeToken } from "@/utils/cookies"
import {localStorageRemove, localStorageSaveOrRead} from '@/utils/util'
function noSurvey(name, next, store) { // 当一级菜单没有概况的时候 跳到权限管理的第一个有权限的菜单
  let mainMenuList = store.state.nav.mainMenuList
  if (mainMenuList.length > 0) {
    let index = mainMenuList.findIndex(item => {
      return item.menuUrl === 'survey'
    })
    if (index >= 0) {
      next()
    } else {
      next({name: mainMenuList[0].menuUrl})
    }
  } else {
    next()
  }
}
Vue.use(iView)
console.log(process.env.MOBILE_BASE_URL)
// const LOGIN_PAGE_NAME = 'login'
router.beforeEach((to, from, next) => {
  let token = getToken()
  console.log(token)
  iView.LoadingBar.start()
  if (localStorageSaveOrRead('saveStepsData') && localStorageSaveOrRead('saveStepsData').name !== to.name) {
    localStorageRemove('saveStepsData')
    localStorageRemove('companyParams')
    localStorageRemove('orderId')
    localStorageRemove('status')
    localStorageRemove('corpId')
    localStorageRemove('orderPayPrice')
    localStorageRemove('isCreatCompany')
    localStorageRemove('corpName')
    localStorageRemove('nextOrderStep')
  }
  if (token) {
    if (to.meta.requireAuth) {
      if (to.name === 'company') {
        next()
      } else if (token.mobileStatus !== "BIND") {
        store.dispatch("user/setStep", 1)
        iView.Message.error("您还没有绑定手机，请先绑定手机")
        next({ name: "register" })
        if (from.name === "register") {
          iView.LoadingBar.finish()
        }
      } else if (token.corpList === 0) {
        store.dispatch("user/setStep", 2)
        iView.Message.error("您还没有绑定企业，请先绑定企业")
        next({ name: "register" })
        if (from.name === "register") {
          iView.LoadingBar.finish()
        }
      } else if (to.name === 'survey') {
        noSurvey(to.name, next, store)
      } else {
        next()
      }
    } else {
      if (!to.name) {
        location.href = process.env.MOBILE_BASE_URL + '/index.html'
        next()
        // next({
        //   name: 'home'
        // })
      } else if (token.mobileStatus !== 'BIND') {
        if (to.name === 'login') {
          store.dispatch('user/setStep', 1)
          next({
            name: 'register'
          })
        } else if (to.name === 'register') {
          store.dispatch('user/setStep', 1)
          next()
        } else if (to.name === 'survey') {
          noSurvey(to.name, next, store)
        } else {
          next()
        }
      } else if (token.corpList === 0) {
        if (to.name === 'login') {
          store.dispatch('user/setStep', 2)
          next({
            name: 'register'
          })
        } else if (to.name === 'register') {
          store.dispatch('user/setStep', 2)
          next()
        } else if (to.name === 'survey') {
          noSurvey(to.name, next, store)
        } else {
          next()
        }
      } else if (to.name === 'login' || to.name === 'register' || to.name === 'home') {
        location.href = process.env.MOBILE_BASE_URL + '/index.html'
        next()
      } else if (to.name === 'survey') {
        noSurvey(to.name, next, store)
      } else if (to.name) {
        next()
      } else {
        location.href = process.env.MOBILE_BASE_URL + '/index.html'
        next()
      }
    }
  } else {
    removeToken()
    removeCookieSession()
    localStorage.clear()
    if (to.meta.requireAuth) {
      next('login')
    } else if (to.name === 'survey') {
      next({name: noSurvey(to.name, next)})
    } else if (to.name) {
      next()
    } else {
      location.href = process.env.MOBILE_BASE_URL + '/index.html'
      next()
    }
  }
})
//   if (to.meta.requireAuth) {
//     if (token) {
//       if (token.mobileStatus !== "BIND") {
//         store.dispatch("user/setStep", 1)
//         iView.Message.error("您还没有绑定手机，请先绑定手机")
//         next({ name: "register" })
//         if (from.name === "register") {
//           iView.LoadingBar.finish()
//         }
//       } else if (token.corpList === 0) {
//         store.dispatch("user/setStep", 2)
//         iView.Message.error("您还没有绑定企业，请先绑定企业")
//         next({ name: "register" })
//         if (from.name === "register") {
//           iView.LoadingBar.finish()
//         }
//       } else {
//         next()
//       }
//     } else {
//       removeToken()
//       removeCookieSession()
//       localStorageRemove('accountList')
//       localStorageRemove('currentCorp')
//       localStorageRemove('preAuthCode')
//       localStorageRemove('saveStepsData')
//       localStorageRemove('companyParams')
//       localStorageRemove('orderId')
//       localStorageRemove('status')
//       localStorageRemove('seatsInfo')
//       localStorageRemove('corpId')
//       localStorageRemove('orderPayPrice')
//       localStorageRemove('corpName')
//       localStorageRemove('nextOrderStep')
//       localStorage.removeItem('secondMenu')
//       localStorage.removeItem('mainMenu')
//       localStorageRemove('isCreatCompany')
//       next({ name: "login" })
//     }
//   } else {
//     if (token) {
//       if (!to.name) {
//         next({
//           name: 'home'
//         })
//       } else if (token.mobileStatus !== 'BIND') {
//         if (to.name === 'login') {
//           store.dispatch('user/setStep', 1)
//           next({
//             name: 'register'
//           })
//         } else if (to.name === 'register') {
//           store.dispatch('user/setStep', 1)
//           next()
//         } else {
//           next()
//         }
//       } else if (token.corpList === 0) {
//         if (to.name === 'login') {
//           store.dispatch('user/setStep', 2)
//           next({
//             name: 'register'
//           })
//         } else if (to.name === 'register') {
//           store.dispatch('user/setStep', 2)
//           next()
//         } else {
//           next()
//         }
//       } else if (to.name === 'login' || to.name === 'register') {
//         next({
//           name: 'home'
//         })
//       } else if (to.name) {
//         next()
//       } else {
//         next({
//           name: 'home'
//         })
//       }
//     } else {
//       removeToken()
//       removeCookieSession()
//       localStorageRemove('accountList')
//       localStorageRemove('currentCorp')
//       localStorageRemove('preAuthCode')
//       localStorageRemove('saveStepsData')
//       localStorageRemove('companyParams')
//       localStorageRemove('orderId')
//       localStorageRemove('status')
//       localStorageRemove('seatsInfo')
//       localStorageRemove('corpId')
//       localStorageRemove('orderPayPrice')
//       localStorageRemove('corpName')
//       localStorageRemove('nextOrderStep')
//       localStorageRemove('secondMenu')
//       localStorageRemove('mainMenu')
//       localStorageRemove('isCreatCompany')
//       if (to.name) {
//         next()
//       } else {
//         next({
//           name: 'home'
//         })
//       }
//     }
//   }
// })

router.afterEach(route => {
  iView.LoadingBar.finish()
})
