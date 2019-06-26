/**
 *Creates an instance of parabola.
 * @param {*} arg
 *  options : {
 *    startElement
 *    targetElement
 *    innerHTML
 *    speed: 166.67, // 每帧移动的像素大小，每帧（对于大部分显示屏）大约16~17毫秒
 *    curvature: 0.001, // 实际指焦点到准线的距离，你可以抽象成曲率，这里模拟扔物体的抛物线，因此是开口向下的
 *    progress () { },
 *    complete () {}
 *  }
 * @memberof parabola
 */

class Parabola {
  constructor(arg) {
    const defaults = {
      speed: 166.67, // 每帧移动的像素大小，每帧（对于大部分显示屏）大约16~17毫秒
      curvature: 0.002, // 实际指焦点到准线的距离，你可以抽象成曲率，这里模拟扔物体的抛物线，因此是开口向下的
      progress() {},
      complete() {}
    }

    this.moveStyle = null
    this.moveElement = null
    this.rectElement = {}
    this.rectTarget = {}
    // 移动元素的中心点位置，目标元素的中心点位置
    this.centerElement = {}
    this.centerTarget = {}
    // 目标元素的坐标位置
    this.coordElement = {}
    this.coordTarget = {}
    this.params = Object.assign({}, defaults, arg)

    // 根据两点坐标以及曲率确定运动曲线函数（也就是确定a, b的值）
    /* 公式： y = a*x*x + b*x + c;
    */
    this.a = this.params.curvature
    this.b = 0
    this.c = 0

    // 是否执行运动的标志量
    this.flagMove = true
  }

  selectMoveStyle() {
      let moveStyle = "margin"
      let testDiv = document.createElement("div")
      if ("oninput" in testDiv) {
        ["", "ms", "webkit"].forEach(function (prefix) {
          var transform = prefix + (prefix ? "T" : "t") + "ransform"
          if (transform in testDiv.style) {
            moveStyle = transform
          }
        })
      }
      this.moveStyle = moveStyle
  }
  createMoveElement () {
    let element = this.params.startElement
    let testDiv = document.createElement("div")
    testDiv.innerHTML = this.params.innerHTML || 'test div'
    testDiv.style.position = "absolute"
    testDiv.style.zIndex = "1000"
    testDiv.style.left = element.getBoundingClientRect().left + 'px'
    testDiv.style.top = element.getBoundingClientRect().top + 'px'
    testDiv.style.overflow = "hidden"

    document.body.appendChild(testDiv)
    this.moveElement = testDiv
    return this
  }

  mark() {
    let element = this.params.startElement
    let target = this.params.targetElement
    if (this.flagMove === false) return this
    if (typeof this.coordElement.x === "undefined") this.position()
    element.setAttribute("data-center", [this.coordElement.x, this.coordElement.y].join())
    target.setAttribute("data-center", [this.coordTarget.x, this.coordTarget.y].join())
    return this
  }

  position() {
    let element = this.params.startElement
    let target = this.params.targetElement
    let flagMove = this.flagMove
    let moveStyle = this.moveStyle
    if (flagMove === false) return this

    const scrollLeft = document.documentElement.scrollLeft || document.body.scrollLeft
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop
    // 初始位置
    if (moveStyle === "margin") {
      element.style.marginLeft = element.style.marginTop = "0px"
    } else {
      element.style[moveStyle] = "translate(0, 0)"
    }

    // 四边缘的坐标
    this.rectElement = element.getBoundingClientRect()
    this.rectTarget = target.getBoundingClientRect()

    // 移动元素的中心点坐标
    this.centerElement = {
      x: this.rectElement.left + (this.rectElement.right - this.rectElement.left) / 2 + scrollLeft,
      y: this.rectElement.top + (this.rectElement.bottom - this.rectElement.top) / 2 + scrollTop
    }

    // 目标元素的中心点位置
    this.centerTarget = {
      x: this.rectTarget.left + (this.rectTarget.right - this.rectTarget.left) / 2 + scrollLeft,
      y: this.rectTarget.top + (this.rectTarget.bottom - this.rectTarget.top) / 2 + scrollTop
    }

    // 转换成相对坐标位置
    this.coordElement = {
      x: 0,
      y: 0
    }
    this.coordTarget = {
      x: -1 * (this.centerElement.x - this.centerTarget.x),
      y: -1 * (this.centerElement.y - this.centerTarget.y)
    }

    /*
      * 因为经过(0, 0), 因此c = 0
      * 于是：
      * y = a * x*x + b*x;
      * y1 = a * x1*x1 + b*x1;
      * y2 = a * x2*x2 + b*x2;
      * 利用第二个坐标：
      * b = (y2+ a*x2*x2) / x2
      */
    // 于是
    this.b = (this.coordTarget.y - this.a * this.coordTarget.x * this.coordTarget.x) / this.coordTarget.x
    return this
  }
  // 按照这个曲线运动
  move() {
    let flagMove = this.flagMove
    let moveStyle = this.moveStyle
    let moveElement = this.moveElement
    let coordTarget = this.coordTarget
    // 如果曲线运动还没有结束，不再执行新的运动
    if (flagMove === false) return this

    let startx = 0
    let rate = this.coordTarget.x > 0 ? 1 : -1

    const step = () => {
      let a = this.a
      let b = this.b
      let params = this.params
      // 切线 y'=2ax+b
      var tangent = 2 * a * startx + b // = y / x
      // y*y + x*x = speed
      // (tangent * x)^2 + x*x = speed
      // x = Math.sqr(speed / (tangent * tangent + 1));
      startx = startx + rate * Math.sqrt(params.speed / (tangent * tangent + 1))

      // 防止过界
      if ((rate === 1 && startx > coordTarget.x) || (rate == -1 && startx < coordTarget.x)) {
        startx = coordTarget.x
      }
      let x = startx
      let y = a * x * x + b * x

      // 标记当前位置，这里有测试使用的嫌疑，实际使用可以将这一行注释
      // element.setAttribute("data-center", [Math.round(x), Math.round(y)].join())

      // x, y目前是坐标，需要转换成定位的像素值
      if (moveStyle === "margin") {
        moveElement.style.marginLeft = x + "px"
        moveElement.style.marginTop = y + "px"
      } else {
        moveElement.style[moveStyle] = `translate(${x}px, ${y}px)`
        // moveElement.style[moveStyle] = "translate(" + [x + "px", y + "px"].join() + ")"
      }

      if (startx !== coordTarget.x) {
        params.progress(x, y)
        window.requestAnimationFrame(step)
      } else {
        // 运动结束，回调执行
        document.body.removeChild(moveElement)
        params.complete()
        this.flagMove = true
      }
    }
    window.requestAnimationFrame(step)
    this.flagMove = false
    return this
  }

  init() {
    let element = this.params.startElement
    let target = this.params.targetElement
    if (element && target && element.nodeType === 1 && target.nodeType === 1) {
      this.selectMoveStyle()
      this.createMoveElement()
      this.position().mark().move()
    }
  }
}

export default Parabola
