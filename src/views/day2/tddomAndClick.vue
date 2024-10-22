<template>
  <div ref="testBox" class="containerBox"></div>
  <span style="color: #fff; display: none" ref="spanBox">我是文字</span>
</template>

<script setup>
import * as THREE from 'three'
import Stats from 'three/examples/jsm/libs/stats.module.js' //  单独引入 stats 组件 性能监视器
import { OrbitControls } from 'three/addons/controls/OrbitControls.js' //轨道控制器
import { CSS3DRenderer, CSS3DObject } from 'three/addons/renderers/CSS3DRenderer.js' //css3d渲染器

import { ref, onMounted } from 'vue'
const spanBox = ref()

const testBox = ref()
// 创建 场景 摄像机 渲染器
let scene, camera, renderer
// 轨道控制器
let controls = ''
// 性能监视器
let stats = ''
//标签渲染器  css转3d用
let labelRenderer = ''
// 新建分组
let group = new THREE.Group()
onMounted(() => {
  // 初始化
  init()
  // 创建轨道控制器
  createControls()
  // 添加坐标轴
  createHelper()
  // 把css转换到threejs中
  domTo3D()
  // css3d渲染过来的点击事件
  bindClick()
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

const domTo3D = () => {
  // 1. 准备原生 DOM 标签
  const tag = spanBox.value

  tag.style.pointerEvents = 'all'
  tag.addEventListener('click', e => {
    alert('dom 被点击了')
    e.stopPropagation() //阻止事件冒泡
  })
  // 2. 引入 CSS3DObject, CSS3DRenderer 并把 DOM 转换成 3D 物体并加入到场景中
  const tag3d = new CSS3DObject(tag)
  console.log(tag, tag3d)
  scene.add(tag3d)

  // labelRenderer必须在循环渲染中不断调用
  labelRenderer = new CSS3DRenderer()
  // 原生标签的 px 的值会平移到 3d 空间中作为单位  缩小16倍
  tag3d.scale.set(1 / 16, 1 / 16, 1 / 16)
  labelRenderer.setSize(testBox.value.clientWidth, testBox.value.clientHeight)
  labelRenderer.domElement.style.pointerEvents = 'none' // 在什么条件下让标签触发鼠标交互事件
  labelRenderer.domElement.style.position = 'fixed'
  labelRenderer.domElement.style.left = '0'
  labelRenderer.domElement.style.top = '0'
  testBox.value.appendChild(labelRenderer.domElement)
  // 重要：CSS3DRenderer 是一个新的渲染器需要在循环调用中使用并适配
}

const bindClick = () => {
  window.addEventListener('click', e => {
    // 定义光线投射对象
    const raycaster = new THREE.Raycaster()
    // 定义二维向对象(保存转换后的平面 x,y坐标值)
    const pointer = new THREE.Vector2()
    // 把屏幕坐标 => WebGL设备坐标
    // 将鼠标位置归一化为设备坐标。x 和 y 方向的取值范围是 (-1 to +1)
    pointer.x = (e.clientX / testBox.value.clientWidth) * 2 - 1
    pointer.y = -(e.clientY / testBox.value.clientHeight) * 2 + 1

    // 更新摄像机和鼠标之间的连线（位置）
    raycaster.setFromCamera(pointer, camera)
    // 获取这条线穿过了哪些物体，收集成一个数组
    const list = raycaster.intersectObjects(scene.children)

    console.log(list)
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
  // 也要让 DOM 渲染器不断更新不同角度的最新画面
  labelRenderer.render(scene, camera)
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
