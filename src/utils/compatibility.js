/**
 * ie9的兼容性处理
 *1. requestAnimationFrame polyfill
 */
(function () {
  var lastTime = 0
  var vendors = ['webkit', 'moz']
  for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
    window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame']
    window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame']
  }

  if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = function (cb, element) {
      var currTime = new Date().getTime()
      var timeToCall = Math.max(0, 16.7 - (currTime - lastTime))
      var id = window.setTimeout(function () {
        // eslint-disable-next-line
        cb(currTime + timeToCall)
      }, timeToCall)
      lastTime = currTime + timeToCall
      return id
    }
  }
  if (!window.cancelAnimationFrame) {
    window.cancelAnimationFrame = function (id) {
      clearTimeout(id)
    }
  }
  if (!('classList' in document.documentElement)) {
    Object.defineProperty(HTMLElement.prototype, 'classList', {
      get: function() {
        let self = this
        function update(fn) {
          return function(value) {
            let classes = self.className.split(/\s+/g)
            let index = classes.indexOf(value)
            fn(classes, index, value)
            self.className = classes.join(' ')
          }
        }
        return {
          remove: update(function(classes, index) {
            if (~index) classes.splice(index, 1)
          })
        }
      }
    })
  }
}())
