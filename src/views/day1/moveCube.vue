<script setup>
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js' //轨道控制器
import * as dat from 'dat.gui' //gui库
import { onMounted } from 'vue'
import { ref, onUnmounted } from 'vue'
// 1.场景 摄像机 渲染器  用ref会报未知错误  先不用响应式数据
let scene = ''
let camera = ''
let renderer = ''
// 轨道控制器
let controls = ''
// 立方体
let cube = ''
// dom盒子
const testBox = ref()
// gui调试工具
let gui = ''

// 初始化函数 初始三要素
const init = () => {
  //2. 创建场景
  scene = new THREE.Scene()
  // 3.创建透视摄像机摄像机
  // 参数1：垂直角度（建议 75），视野范围
  // 参数2：宽高比（建议与画布相同宽高），物体绘制比例
  // 参数3：近截面距离摄像机距离
  // 参数4：远截面距离摄像机距离
  // camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
  camera = new THREE.PerspectiveCamera(75, testBox.value.clientWidth / testBox.value.clientHeight, 0.1, 1000)
  //摄像机向z轴移动五个单位 以便能看到3d效果 (默认摄像机和物体的坐标都在原点)
  camera.position.z = 5
  // 4. 创建渲染器，并设置画布大小，添加到 DOM 显示  antialias设置为true后 盒子的边框就没有锯齿状了
  renderer = new THREE.WebGLRenderer({ antialias: true })
  // renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setSize(testBox.value.clientWidth, testBox.value.clientHeight)

  // renderer.setSize(100, 100)
  // console.log(testBox.value.clientWidth,testBox.value.clientWidth)  //获取dom的宽高
  // 把画面添加到页面上
  // document.body.appendChild(renderer.domElement)
  testBox.value.appendChild(renderer.domElement)
  // // 传入场景和摄像机 渲染
  // renderer.render(scene, camera)
}
// 创建立方体
const createCube = () => {
  // 目标：three.js 绘制立方体
  // 1. 创建图形，宽高深为 1 单位
  const geometry = new THREE.BoxGeometry(1, 1, 1) //宽高深
  // 2. 创建材质，颜色为绿色 0x00ff00
  const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
  // 3. 创建网格物体对象，传入图形和材质
  cube = new THREE.Mesh(geometry, material)

  // 4. 把物体加入到场景中
  // 注意1：摄像机需要拉远一些才能看到物体
  // 注意2：渲染器需要调用 render 才能渲染画面（等待物体添加到场景后，再调用）
  scene.add(cube)
}

// 创建坐标轴
const createHelper = () => {
  const axesHelper = new THREE.AxesHelper(5) //添加坐标轴  5是线段的长度
  scene.add(axesHelper) //添加到场景中
}

// 创建轨道控制器
const createControls = () => {
  // 参数一相机 参数二  渲染的dom
  controls = new OrbitControls(camera, renderer.domElement) //轨道控制器,加了就可以用鼠标滑动了
  // 1.阻尼效果   阻尼效果要配合controls.unpdate使用 必须在渲染循环中调用
  controls.enableDamping = true
  // 阻尼的值 默认0.05  越低转动越慢
  controls.dampingFactor = 0.05 //
  // 2.自动旋转轨道控制器
  // controls.autoRotate = true
  // 3. 垂直和水平旋转，角度范围控制
  // 垂直旋转(0上面 Math.PI下面)
  controls.maxPolarAngle = Math.PI
  // controls.maxPolarAngle = 1  //设置为1就不能往下滑动太多
  controls.minPolarAngle = 0
  // 水平旋转
  // 这个设置只能看到后面 左边 右边  看不到前面
  // controls.maxAzimuthAngle = 1.5 * Math.PI
  // controls.minAzimuthAngle = 0.5 * Math.PI
  // 4. 摄像机移动范围控制
  // controls.maxDistance = 10 //最多放大到10个单位
  // controls.minDistance = 2 //最小缩小到2个单位
}
const resizeRender = () => {
  window.addEventListener('resize', () => {
    renderer.setSize(testBox.value.clientWidth, testBox.value.clientHeight) //场景的宽高
    camera.aspect = testBox.value.clientWidth / testBox.value.clientHeight //摄像机的宽高
    camera.updateProjectionMatrix()
  })
}

// 移动旋转盒子
const moveCube = () => {
  // 1. 位移 position 属性
  cube.position.x = 1
  cube.position.y = 2
  cube.position.z = 0
  cube.position.set(1, 2, 0) //x,y,z
  // 2. 旋转 rotation 属性   Math.PI =180度
  // 在轴的正方向来看物体 默认是绕着轴进行逆时针旋转
  cube.rotation.x = Math.PI / 4
  cube.rotation.set(Math.PI / 4, 0, 0) //x,y,z
  // 3. 缩放 scale 属性
  cube.scale.x = 1
  cube.scale.set(1, 1, 1)
}

// GUI的工具
const createGui = () => {
  // 1. 创建 GUI 对象
  gui = new dat.GUI()
  gui.domElement.style.position = 'absolute'
  gui.domElement.style.top = '0'
  gui.domElement.style.right = '0'

  testBox.value.appendChild(gui.domElement) // 将 GUI 添加到指定的容器中
  // console.log(gui)
  // 2. 添加具体控制器使用
  // gui.add()添加图形用户界面工具
  // 参数1:关联DOM对象,js对象,3D物体对象
  // 参数2:对象中的某个属性,给这个属性关联用户界面工具(从而快速调整它的值)
  gui.add(document, 'title') //字符串 出现输入框
  // 控制立方体的显示隐藏
  gui.add(cube, 'visible') //布尔值 出现单选按框
  // gui.add(cube, 'position')
  // 轨道控制器回归到初始角度
  gui.add(controls, 'reset') //函数 出现按钮
  // 控制立方体的颜色  必须用three种自带的color函数才能控制颜色
  // console.log(cube)
  // gui.addColor(cube.material, 'color')
  const colorObj = {
    color: `#${cube.material.color.getHexString()}`
  }
  gui.addColor(colorObj, 'color').onChange(val => {
    cube.material.color = new THREE.Color(val)
  })
  // 创建分组 控制立方体的位置
  const floder = gui.addFolder('位移') //创建一个分组
  // 参数3最小值范围 参数4最大值范围 参数5 左右滑动的步长
  floder.add(cube.position, 'x', 0, 5, 0.1)
  floder.add(cube.position, 'y', 0, 5, 0.1)
  floder.add(cube.position, 'z', 0, 5, 0.1)

  // 下拉菜单( 第三个参数为对象时 变成下拉菜单)
  gui
    .add({ type: '1' }, 'type', {
      方案1: '1',
      方案2: '2',
      方案3: '3'
    })
    .onChange(val => {
      switch (val) {
        case '1': //方案1
          cube.position.set(0, 0, 0)
          break
        case '2': //方案2
          cube.position.set(1, 1, 1)

          break
        case '3': //方案3
          cube.position.set(2, 2, 2)

        default:
          break
      }
    })
}

// 循环渲染
const renderLoop = () => {
  // 根据浏览器,刷新帧率,递归调用渲染循环,不断更新场景动画,最新状态
  requestAnimationFrame(renderLoop) //刷新浏览器的函数,不断的递归这个函数 类似setInterval 只有窗口在可视的时候才会调用
  // 手动js代码更新摄像机信息,必须调用轨道控制的update方法
  controls.update()
  cube.rotation.x += 0.01 //旋转立方体
  cube.rotation.y += 0.01 //旋转立方体
  renderer.render(scene, camera)
}
onMounted(() => {
  // 初始化
  init()
  // 轨道控制器
  createControls()
  // 创建坐标轴
  createHelper()
  // 创建立方体
  createCube()
  // 变换立方体
  moveCube()
  // 创建gui工具
  createGui()
  // 渲染数渲染
  renderLoop()
  // 监听浏览器的宽高变化
  resizeRender()
})
onUnmounted(() => {
  if (gui) {
    // console.log(gui)
    // gui.destroy() // 销毁 dat.GUI 实例，移除所有控制项和 DOM
    gui.domElement.remove() // 从 DOM 中移除 GUI 元素
  }
})
</script>

<template>
  <div class="testBox" ref="testBox"></div>
</template>

<style>
.testBox {
  position: relative;
  width: 100%;
  height: 100%;
}
</style>
