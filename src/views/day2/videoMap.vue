<template>
  <div ref="testBox" class="containerBox"></div>
  <video src="" ref="videoBox" style="display: none"></video>
</template>

<script setup>
import * as THREE from 'three'
import Stats from 'three/examples/jsm/libs/stats.module.js' //  单独引入 stats 组件 性能监视器
import { OrbitControls } from 'three/addons/controls/OrbitControls.js' //轨道控制器
import { ref, onMounted } from 'vue'
const videoBox = ref()
const testBox = ref()
// 创建 场景 摄像机 渲染器
let scene, camera, renderer
// 轨道控制器
let controls = ''
// 性能监视器
let stats = ''

// 新建分组
let group = new THREE.Group()
onMounted(() => {
  // 初始化
  init()
  // 创建轨道控制器
  createControls()
  // 添加坐标轴
  createHelper()
  // 创建立方体
  // createCube()
  // 双击删除立方体
  // removeCube()
  // 创建多个缓冲几何体
  // createGeometry()
  // 创建点球体
  // createSphere()
  // 创建线球体
  // createLine()
  // 创建全景贴图
  // createMap()
  // 立方体贴图
  // createCubeImg()
  // 视频纹理
  createPlanMap()
  // 创建性能监视器
  createStats()
  // 渲染
  renderLoop()
  // 监听浏览器的宽高变化
  resizeRender()
})

const init = () => {
  scene = new THREE.Scene()
  camera = new THREE.PerspectiveCamera(75, testBox.value.clientWidth / testBox.value.clientHeight, 0.1, 1000)
  camera.position.z = 5 //让z轴前进5个单位  不让z轴前进  看不到东西
  renderer = new THREE.WebGLRenderer({ antialias: true }) //设置antialias为true就没有锯齿了
  renderer.setSize(testBox.value.clientWidth, testBox.value.clientHeight)
  testBox.value.appendChild(renderer.domElement)
}

const createControls = () => {
  controls = new OrbitControls(camera, renderer.domElement)
}

const createHelper = () => {
  const axesHelper = new THREE.AxesHelper(5)
  // console.log(axesHelper)
  scene.add(axesHelper)
}

const createStats = () => {
  // 记得在循环渲染中调用 stats.update()
  stats = new Stats()
  stats.setMode(0) //0先显示fps 1先显示ms 2先显示mb
  stats.domElement.style.position = 'absolute'
  stats.domElement.style.left = '0'
  stats.domElement.style.top = '0'
  // 渲染到body上
  testBox.value.appendChild(stats.domElement)
}

const createPlanMap = () => {
  // 因为git上传有显示 所以没有吧视频上传  自己随便找一个视频就行

  videoBox.value.src = '/video/mouse_cat.mp4'
  videoBox.value.muted = true // 静音
  videoBox.value.addEventListener('loadedmetadata', () => {
    // 加载视频完成
    videoBox.value.play() // 开始播放视频
  })
  // 创建平面缓冲几何体（PlaneGeometry）
  const geometry = new THREE.PlaneGeometry(1, 0.5)
  // 创建纹理
  const texture = new THREE.VideoTexture(videoBox.value)
  // 创建材质
  const material = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide }) //双面渲染
  //  创建网格物体
  const plane = new THREE.Mesh(geometry, material)
  // 添加到场景中
  scene.add(plane)

  // 点击按钮->播放声音
  const button = document.createElement('button')
  button.innerHTML = '播放'
  button.style.position = 'fixed'
  button.style.left = '0'
  button.style.bottom = '0'
  document.body.appendChild(button)
  button.addEventListener('click', () => {
    videoBox.value.muted = !videoBox.value.muted // 关闭静音
  })
}

const resizeRender = () => {
  window.addEventListener('resize', () => {
    renderer.setSize(testBox.value.clientWidth, testBox.value.clientHeight) //场景的宽高
    camera.aspect = testBox.value.clientWidth / testBox.value.clientHeight //摄像机的宽高
    camera.updateProjectionMatrix()
  })
}
const renderLoop = () => {
  requestAnimationFrame(renderLoop)
  controls?.update() //更新轨道控制器
  stats?.update() //更新监视器
  renderer.render(scene, camera)
}
</script>

<style scoped>
.containerBox {
  position: relative;
  width: 100%;
  height: 100%;
}
</style>
