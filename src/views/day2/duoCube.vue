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
  // 创建立方体
  createCube()
  // 双击删除立方体
  removeCube()

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

const createCube = () => {
  // 创建5个随机颜色随机位置的立方体
  // 1. 定义数据对象，描绘每个立方体的信息

  const cubeInfoArr = []
  for (let i = 0; i < 5; i++) {
    cubeInfoArr.push({
      color: `rgb(${Math.floor(Math.random() * (255 - 0 + 1) + 0)}, ${Math.floor(Math.random() * (255 - 0 + 1) + 0)}, ${Math.floor(Math.random() * (255 - 0 + 1) + 0)})`, //颜色
      w: Math.floor(Math.random() * (3 - 1 + 1) + 1), //宽
      h: Math.floor(Math.random() * (3 - 1 + 1) + 1), //高
      d: Math.floor(Math.random() * (3 - 1 + 1) + 1), //深度
      x: Math.floor(Math.random() * (3 - -3 + 1) + -3), //x轴位置
      y: Math.floor(Math.random() * (3 - -3 + 1) + -3), //y轴位置
      z: Math.floor(Math.random() * (3 - -3 + 1) + -3) //z轴位置
    })
  }
  cubeInfoArr.forEach(item => {
    const geometry = new THREE.BoxGeometry(item.w, item.h, item.d)
    const material = new THREE.MeshBasicMaterial({ color: item.color })
    const cube = new THREE.Mesh(geometry, material) //添加图形数据 和材质数据
    cube.name = 'cu'
    cube.position.set(item.x, item.y, item.z)
    group.add(cube) //把立方体添加到分组里
    // scene.add(cube)
  })
  scene.add(group) //把分组添加到场景里
}

const removeCube = () => {
  // console.log(scene, group)
  window.addEventListener('dblclick', () => {
    // const cubeArr = scene.children.filter(item => item.name === 'cu') //场景筛选
    const cubeArr = group.children.filter(item => item.name === 'cu') //分组筛选
    // console.log(group, cubeArr)
    const cube = cubeArr[0]
    // console.log(cube)
    if (cube) {
      cube.geometry.dispose() // 移除图形数据
      cube.material.dispose() // 移除材质数据
      // scene.remove(cube)//场景中移除物体
      group.remove(cube) //分组中移除物体
    }
  })
}

const resizeRender = () => {
  window.addEventListener('resize', () => {
    renderer.setSize(testBox.value.clientWidth,testBox.value.clientHeight) //场景的宽高
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
