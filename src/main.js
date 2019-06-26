// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import utils from '@/utils/index'
import router from './router'
import store from './store'

import iView from 'iview'
// import 'iview/dist/styles/iview.css'
import '@/assets/stylus/iview.less'
import '@/assets/stylus/index.styl'
import '@/utils/compatibility'
import strPro from '@/utils/methods'
import '@/router/routerBefore'
import VueQriously from "vue-qriously"
import vueFilters from "./utils/vueFilters"
import VueClipboards from 'vue-clipboards'
Vue.use(VueClipboards)

Object.keys(vueFilters).forEach(key => {
  Vue.filter(key, vueFilters[key])
})

Vue.use(VueQriously)
Vue.use(iView)
Vue.use(strPro)
Vue.use(utils)
Vue.config.productionTip = false
iView.Message.config({
  duration: 3
})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>',
  data: {
    Bus: new Vue()
  }
})
