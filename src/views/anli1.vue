<template>
  <div ref="testBox" class="containerBox"></div>
</template>

<script setup>
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js' //轨道控制器
import { ref, onMounted } from 'vue'

const testBox = ref()
// 创建 场景 摄像机 渲染器
let scene, camera, renderer
// 轨道控制器
let controls = ''
// 立方体
let cube = ''
onMounted(() => {
  // 初始化
  init()
  // 创建轨道控制器
  createControls()
  // 添加坐标轴
  createHelper()
  // 创建立方体
  createCube()
  // 渲染
  renderLoop()
  // 监听浏览器的宽高变化
  resizeRender()
})

const init = () => {
  scene = new THREE.Scene()
  camera = new THREE.PerspectiveCamera(75, testBox.value.clientWidth / testBox.value.clientWidth, 0.1, 1000)
  camera.position.z = 5 //让z轴前进5个单位  不让z轴前进  看不到东西
  renderer = new THREE.WebGLRenderer()
  renderer.setSize(testBox.value.clientWidth, testBox.value.clientWidth)
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

const createCube = () => {
  const geometry = new THREE.BoxGeometry(1, 1, 1)
  // const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
  const colorArr = ['red', 'green', 'blue', 'pink', 'orange', 'write']
  // 正方向的颜色渲染顺序是 右左 上下 前后
  const materialArr = colorArr.map(item => {
    return new THREE.MeshBasicMaterial({ color: item })
  })
  cube = new THREE.Mesh(geometry, materialArr)

  scene.add(cube)
}

const resizeRender = () => {
  window.addEventListener('resize', () => {
    renderer.setSize(testBox.value.clientWidth, testBox.value.clientWidth) //场景的宽高
    camera.aspect = testBox.value.clientWidth / testBox.value.clientWidth //摄像机的宽高
    camera.updateProjectionMatrix()
  })
}
const renderLoop = () => {
  requestAnimationFrame(renderLoop)
  controls.update()
  renderer.render(scene, camera)
}
</script>

<style scoped>
.containerBox {
  width: 100vw;
  height: 100vh;
}
</style>
