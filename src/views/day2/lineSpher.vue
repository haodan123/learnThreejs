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

onMounted(() => {
  // 初始化
  init()
  // 创建轨道控制器
  createControls()
  // 添加坐标轴
  createHelper()

  // 创建线球体
  createLine()

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

const createLine = () => {
  // 球形
  const SphereGeo = new THREE.SphereGeometry(1, 32, 16) //一般第二个参数是第三个参数的二倍

  // 创建线材质
  const Linematerial = new THREE.LineBasicMaterial({
    color: 0x6600ff, //材质的颜色(Color)，默认值为白色 (0xffffff)。
    linewidth: 1, //控制线宽。默认值为 1。
    linecap: 'round', //定义线两端的样式。可选值为 'butt', 'round' 和 'square'。默认值为 'round'。
    linejoin: 'round' //定义线连接节点的样式。可选值为 'round', 'bevel' 和 'miter'。默认值为 'round'
  })
  // 创建线球体对象 Lines
  const sphere = new THREE.Line(SphereGeo, Linematerial) //球形
  // sphere.position.set(2, 2, 2)
  // 添加到场景
  scene.add(sphere) //球形

  // 线
  const material = new THREE.LineBasicMaterial({
    color: 0x0000ff
  })
  const points = []
  points.push(new THREE.Vector3(-3, 0, 0))
  points.push(new THREE.Vector3(0, 3, 0))
  points.push(new THREE.Vector3(3, 0, 0))
  const geometry = new THREE.BufferGeometry().setFromPoints(points)
  const line = new THREE.Line(geometry, material)
  scene.add(line)
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
