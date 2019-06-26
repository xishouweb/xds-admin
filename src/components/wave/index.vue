<template>
  <div class="wave-box">
    <!-- canvas粒子波浪效果 -->
    <div id="wave" ref="wave"></div>
    <div class="wave-shadow"></div>
  </div>
</template>

<script>
  // 该组件注释代码可实现 鼠标移动时波浪角度跟随变化效果，慎删。
  import THREE from './three.min'
  export default {
    data() {
      return {}
    },
    components: {},
    computed: {},
    created() {},
    watch: {},
    mounted() {
      this.$nextTick(() => {
        const el = this.$refs.wave
        if (!el) { return }

        const SEPARATION = 100
        const AMOUNTX = 50
        const AMOUNTY = 50
        // const MAXY = -110 // mouseY的最大值

        let windowHalfX = window.innerWidth / 2
        let windowHalfY = window.innerHeight / 2

        let container
        let camera, scene, renderer
        let particles, particle
        let count = 0
        let mouseX = -1 * windowHalfX // 设置初始角度为鼠标在左上角时的角度
        let mouseY = -1 * windowHalfY


        init()
        animate()

        function init() {
          container = document.createElement('div')
          // document.body.appendChild(container)
          el.appendChild(container)
          camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000)
          camera.position.z = 1000
          scene = new THREE.Scene()
          particles = []
          let PI2 = Math.PI * 2
          let material = new THREE.ParticleCanvasMaterial({
            // color: '#fff', // 有效，因为圆点默认是白色，所以可省略
            // color: 0xff0000, // 有效
            // color: 'rgba(255, 0, 0, 0.1)', 无效
            // color: THREE.setStyle('rgba(255, 0, 0, 0.1)'), 无效
            program: function (context) {
              context.beginPath()
              context.arc(0, 0, 1, 0, PI2, true)
              context.fill()
            }
          })
          let i = 0
          for (let ix = 0; ix < AMOUNTX; ix++) {
            for (let iy = 0; iy < AMOUNTY; iy++) {
              particle = particles[ i++ ] = new THREE.Particle(material)
              particle.position.x = ix * SEPARATION - ((AMOUNTX * SEPARATION) / 2)
              particle.position.z = iy * SEPARATION - ((AMOUNTY * SEPARATION) / 2)
              scene.add(particle)
            }
          }
          renderer = new THREE.CanvasRenderer()
          renderer.setSize(window.innerWidth - 16, window.innerHeight - 16) // 控制canvas的大小，减去16是为了不覆盖滚动条
          container.appendChild(renderer.domElement)
          // document.addEventListener('mousemove', onDocumentMouseMove, false)
          // document.addEventListener('touchstart', onDocumentTouchStart, false)
          // document.addEventListener('touchmove', onDocumentTouchMove, false)
          window.addEventListener('resize', onWindowResize, false)
        }
        function onWindowResize() { // 屏幕大小变化时的处理
          windowHalfX = window.innerWidth / 2
          windowHalfY = window.innerHeight / 2
          camera.aspect = window.innerWidth / window.innerHeight
          camera.updateProjectionMatrix()
          renderer.setSize(window.innerWidth, window.innerHeight)
        }
        // function onDocumentMouseMove(event) { // 波浪角度变化函数
        //   mouseX = event.clientX - windowHalfX
        //   mouseY = event.clientY - windowHalfY * 2
        //   if (mouseY >= MAXY) {
        //     mouseY = MAXY
        //   }
        // }
        // function onDocumentTouchStart(event) {
        //   if (event.touches.length === 1) {
        //     event.preventDefault()
        //     mouseX = event.touches[ 0 ].pageX - windowHalfX
        //     mouseY = event.touches[ 0 ].pageY - windowHalfY
        //   }
        // }
        // function onDocumentTouchMove(event) {
        //   if (event.touches.length === 1) {
        //     event.preventDefault()
        //     mouseX = event.touches[ 0 ].pageX - windowHalfX
        //     mouseY = event.touches[ 0 ].pageY - windowHalfY
        //   }
        // }
        function animate() {
          requestAnimationFrame(animate)
          render()
        }
        function render() {
          camera.position.x += (mouseX - camera.position.x) * 0.05
          camera.position.y += (-mouseY - camera.position.y) * 0.05
          camera.lookAt(scene.position)
          let i = 0
          for (let ix = 0; ix < AMOUNTX; ix++) {
            for (let iy = 0; iy < AMOUNTY; iy++) {
              particle = particles[ i++ ]
              particle.position.y = (Math.sin((ix + count) * 0.3) * 50) + (Math.sin((iy + count) * 0.5) * 50)
              particle.scale.x = particle.scale.y = (Math.sin((ix + count) * 0.3) + 1) * 2 + (Math.sin((iy + count) * 0.5) + 1) * 2
            }
          }
          renderer.render(scene, camera)
          count += 0.06 // 增量可控制动画速度
        }
      })
    },
    methods: {},
  }
</script>

<style lang="stylus">
  .wave-box
    overflow: hidden
    .wave-shadow
      position: absolute
      top: 0
      left: 0
      right: 0
      bottom: 0
      background-image url('../../assets/images/login-bg.png')
      background-size: 100% 100%
      opacity: 0.8
  #wave
    position: relative
    height: 100%
    width: 100%
    // height: calc(100% -16px)
    // width: calc(100% -16px)
    overflow: hidden
</style>
