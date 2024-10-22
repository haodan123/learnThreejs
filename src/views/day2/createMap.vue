<template>
  <div ref="testBox" class="containerBox"></div>
</template>

<script setup>
import * as THREE from 'three'
import Stats from 'three/examples/jsm/libs/stats.module.js' //  单独引入 stats 组件 性能监视器
import { OrbitControls } from 'three/addons/controls/OrbitControls.js' //轨道控制器
import { ref, onMounted } from 'vue'

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

  // 创建全景贴图
  createMap()
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

const createMap = () => {
  // 1. 创建球体几何图形
  const geometry = new THREE.SphereGeometry(1, 32, 16) //第二个参数一般是第三个参数的二倍
  // 2. 使用纹理加载器并创建网格材质对象
  // 纹理
  const texture = new THREE.TextureLoader().load('image/earth/earth.png')
  // 材质设置map
  const material = new THREE.MeshBasicMaterial({ map: texture })
  // 3. 创建网格物体
  const sphere = new THREE.Mesh(geometry, material)
  scene.add(sphere)
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
