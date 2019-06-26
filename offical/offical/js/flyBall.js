function Ball(v, $box) {
  this.dat = v
  this.$ball = $('<div>' + v.text + '</div>')
  this.$ball.addClass(this.dat.class)
  var time = this.dat.hz ? (this.dat.hz / 1000 + 's') : '3s'
  this.$ball.css({
      width: this.dat.width + 'px',
      height: this.dat.width + 'px',
      fontSize: this.dat.fontSize,
      color: this.dat.color,
      backgroundColor: this.dat.bg,
      position: 'absolute',
      transform: 'translate(' + this.dat.x + 'px,' + this.dat.y + 'px)',
      transition: 'all linear ' + time // hz改变位置的频率
  })
  $box.append(this.$ball)
  this.setAnimate()
}
Ball.prototype.getRandom = function(start, r) {
  r = r === undefined ? 30 : r // 移动半径值
  var random = Math.random() * 2 - 1 // 获取-1到1之间的随机数
  return (start + random * r) + 'px'
}
Ball.prototype.setAnimate = function() {
  var that = this
  setInterval(function () {
      that.$ball.css({
        transform: 'translate(' + that.getRandom(that.dat.x) + ',' + that.getRandom(that.dat.y) + ')',
      })
  }, that.dat.hz || 2000)
}
