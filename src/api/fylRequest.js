import Path from './fylPath'
import Vue from 'vue'
import Api from './index'

export default function () {
  Vue.prototype.post = function(url, args) {
    return Api.post(url, args)
  }
  Vue.prototype.getExistOrder = function (args) {
    return Api.get(Path.existOrder, args)
  }
  Vue.prototype.getCancelOrder = function (args) {
    return Api.get(Path.cancelOrder, args)
  }
  Vue.prototype.queryTItemValueByPager = function (args) {
    return Api.get(Path.queryTItemValueByPager, args)
  }
}