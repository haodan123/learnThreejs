<template>
  <div ref="testBox" class="containerBox"></div>
  <video src="" ref="videoBox" style="display: none"></video>
  <span style="color: #fff; display: none" ref="spanBox">我是文字</span>
</template>

<script setup>
import * as THREE from 'three'
import Stats from 'three/examples/jsm/libs/stats.module.js' //  单独引入 stats 组件 性能监视器
import { OrbitControls } from 'three/addons/controls/OrbitControls.js' //轨道控制器
import { CSS3DRenderer, CSS3DObject } from 'three/addons/renderers/CSS3DRenderer.js' //css3d渲染器

import { ref, onMounted } from 'vue'
const videoBox = ref()
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
  // createPlanMap()
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

const createCubeImg = () => {
  // 1. 调整摄像机位置到盒子中间
  // 不能给 0 的原因：轨道控制器内部会取出摄像机初始位置坐变化
  camera.position.z = 0.1
  // 创建立方缓冲几何体
  const geometry = new THREE.BoxGeometry(1, 1, 1)
  // 加载不同纹理图片 并创建材质对象六个
  const imgUrlArr = ['posx.jpg', 'negx.jpg', 'posy.jpg', 'negy.jpg', 'posz.jpg', 'negz.jpg']
  //设置当前纹理加载器公共的基本路径
  const textureLoader = new THREE.TextureLoader()
  textureLoader.setPath('image/park/')
  // 设置六个面
  const materialArr = imgUrlArr.map(item => {
    const texture = textureLoader.load(item)
    // three.js 颜色通道为 rgb 颜色（为了防止图片太浅,图片不清晰）
    texture.colorSpace = THREE.SRGBColorSpace
    // 生成材质
    return new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide }) //加上 side然后把摄像机放到立方体里面 就变成全景公园了
  })

  // 创建网格物体并加入场景
  const cube = new THREE.Mesh(geometry, materialArr)
  // 2. 调整立方体沿着 z 轴做 -1 缩小（镜面翻转）
  cube.scale.set(1, 1, -1)
  scene.add(cube)
}

const createMap = () => {
  // 1. 创建球体几何图形
  const geometry = new THREE.SphereGeometry(1, 32, 16)
  // 2. 使用纹理加载器并创建网格材质对象
  // 纹理
  const texture = new THREE.TextureLoader().load('image/earth/earth.png')
  // 材质设置map

  const material = new THREE.MeshBasicMaterial({ map: texture })
  // 3. 创建网格物体
  const sphere = new THREE.Mesh(geometry, material)
  scene.add(sphere)
}

const createLine = () => {
  // 球形
  // const SphereGeo = new THREE.SphereGeometry(1, 32, 16) //一般第二个参数是第三个参数的二倍

  // // 创建线材质
  // const Linematerial = new THREE.LineBasicMaterial({
  //   color: 0x6600ff, //材质的颜色(Color)，默认值为白色 (0xffffff)。
  //   linewidth: 1, //控制线宽。默认值为 1。
  //   linecap: 'round', //定义线两端的样式。可选值为 'butt', 'round' 和 'square'。默认值为 'round'。
  //   linejoin: 'round' //定义线连接节点的样式。可选值为 'round', 'bevel' 和 'miter'。默认值为 'round'
  // })
  // // 创建线球体对象 Lines
  // const sphere = new THREE.Line(SphereGeo, Linematerial) //球形
  // // sphere.position.set(2, 2, 2)
  // // 添加到场景
  // scene.add(sphere) //球形

  // 线
  const material = new THREE.LineBasicMaterial({
    color: 0x0000ff
  })
  const points = []
  points.push(new THREE.Vector3(-3, 0, 0))
  points.push(new THREE.Vector3(0, 3, 0))
  points.push(new THREE.Vector3(3, 0, 0))
  const geometry = new THREE.BufferGeometry().setFromPoints(points)
  // const line = new THREE.Line(geometry, material) //线段不会自动闭合
  // const line = new THREE.LineLoop(geometry, material) //线段会自动闭合
  const line = new THREE.LineSegments(geometry, material) //按顺序 一对点链接一条线  点必须是双数
  scene.add(line)
}

const createSphere = () => {
  // 球形
  const SphereGeo = new THREE.SphereGeometry(1, 32, 16) //一般第二个参数是第三个参数的二倍

  // 创建点材质
  const Pointmaterial = new THREE.PointsMaterial({ color: 0x6600ff, size: 0.03 }) //size太大就看不出形状了
  // 创建点对象 Points
  const sphere = new THREE.Points(SphereGeo, Pointmaterial) //球形
  sphere.position.set(2, 2, 2)
  // 添加到场景
  scene.add(sphere) //球形
}

// 创建多个缓冲几何体
const createGeometry = () => {
  // 创建集合图形
  // 圆形
  const circleGeo = new THREE.CircleGeometry(1, 32) //第一个参数:半径是几个单位 第二个参数:越大圆就越圆
  // 正方形
  const PlaneGeo = new THREE.PlaneGeometry(1, 1) //宽高
  // 球形  //参数1:圆的半径 参数2:垂直分段数（沿着纬线分段），最小值为2，默认值为16。 参数3:指定水平（经线）起始角度，默认值为0。
  const SphereGeo = new THREE.SphereGeometry(1, 32, 16) //一般第二个参数是第三个参数的二倍

  // 创建网格材质
  const material = new THREE.MeshBasicMaterial({ color: 0xffff00, side: THREE.DoubleSide }) //第二个参数是圆形的背面也渲染
  // material.side = THREE.DoubleSide //这种方法也 可以跟上面一样

  // 创建网格对象
  const circle = new THREE.Mesh(circleGeo, material) //圆形
  const plane = new THREE.Mesh(PlaneGeo, material) //正方形
  plane.position.set(-2, -2, -2)
  const sphere = new THREE.Mesh(SphereGeo, material) //球形
  sphere.position.set(2, 2, 2)

  // 添加到场景中
  scene.add(circle) //圆形
  scene.add(plane) //正方形
  scene.add(sphere) //球形
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
</script>

<style scoped>
.containerBox {
  position: relative;
  /* width: 100%;
  height: 100%; */
  width: 100vw;
  height: 100vh;
}
</style>
