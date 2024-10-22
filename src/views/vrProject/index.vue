<template>
  <div ref="testBox" class="containerBox"></div>
</template>

<script setup>
import * as THREE from 'three'
import { ref, onMounted } from 'vue'
// import { CSS3DRenderer, CSS3DObject } from 'three/addons/renderers/CSS3DRenderer.js' //css3d渲染器
import { CSS3DObject } from 'three/addons/renderers/CSS3DRenderer.js' //css3d渲染器
import { useThreeInit } from '@/composables'
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js' //辅助工具

const testBox = ref()
// 创建 场景 摄像机 渲染器
let scene, camera, renderer
// 轨道控制器
let controls
//调试工具
let gui
let cubeObj //立方体对象

onMounted(() => {
  const obj = useThreeInit(testBox.value)

  scene = obj.scene
  camera = obj.camera
  renderer = obj.renderer
  controls = obj.controls
  camera.position.z = 0.1 //z轴正0.1 做全景效果
  // 让轨道控制器不能垂直看向地面
  controls.minPolarAngle = 0.25 * Math.PI
  // 限制轨道控制器的滚轮缩放
  controls.enableZoom = false

  // 创建立方体
  cubeObj = createCube()
  // 先渲染第一个场景的信息
  setMaterialCube(sceneInfoObj.one)

  // 初始化gui
  // initGui()
  // 点击事件
  bindClick()

  // 监听浏览器
  resizeRender()
})

// 当前空间所有标记都放到组里管理
const group = new THREE.Group()
// 目标4：创建第一个场景（数据->视图）
// 4.1 定义数据对象相关属性和值
const sceneInfoObj = {
  one: {
    publicPath: 'technology/1/', //路径前缀
    // 正方体的六面图片 根据右左上下前后的顺序排列
    imgUrlArr: ['px.jpg', 'nx.jpg', 'py.jpg', 'ny.jpg', 'pz.jpg', 'nz.jpg'],
    markList: [
      {
        name: 'landMark',
        imgUrl: 'other/landmark.png',
        wh: [0.05, 0.05], //标点的宽高  因为盒子的宽高就一个单位 0.05 足够
        position: [-0.46, -0.11, -0.11],
        rotation: [1.42, 0.68, 1.63],
        targetAttr: 'two' //下一个场景数据对象的属性名
      }
    ]
  },
  two: {
    publicPath: 'technology/2/', //路径前缀
    // 正方体的六面图片 根据右左上下前后的顺序排列
    imgUrlArr: ['px.jpg', 'nx.jpg', 'py.jpg', 'ny.jpg', 'pz.jpg', 'nz.jpg'],
    markList: [
      {
        name: 'landMark',
        imgUrl: 'other/landmark.png',
        wh: [0.05, 0.05], //标点的宽高  因为盒子的宽高就一个单位 0.05 足够
        position: [0.47, -0.2, 0],
        rotation: [1.48, 0.26, -1.78],
        targetAttr: 'one' //上一个场景数据对象的属性名
      },
      {
        name: 'landMark',
        imgUrl: 'other/landmark.png',
        wh: [0.05, 0.05], //标点的宽高  因为盒子的宽高就一个单位 0.05 足够
        position: [-0.46, -0.16, -0.3],
        rotation: [1.21, 0.78, 0],
        targetAttr: 'three' //下一个场景数据对象的属性名
      }
    ]
  },
  three: {
    publicPath: 'technology/3/',
    imgUrlArr: ['px.jpg', 'nx.jpg', 'py.jpg', 'ny.jpg', 'pz.jpg', 'nz.jpg'],
    markList: [
      {
        name: 'landMark',
        imgUrl: 'other/landmark.png',
        wh: [0.05, 0.05],
        position: [0.4, -0.18, 0.32],
        rotation: [-1.53, -0.04, -1.26],
        targetAttr: 'two' // 目标场景信息对象属性
      },
      {
        name: 'landMark',
        imgUrl: 'other/landmark.png',
        wh: [0.05, 0.05],
        position: [0.32, -0.16, -0.33],
        rotation: [1.46, 0.1, -0.17],
        targetAttr: 'four' // 目标场景信息对象属性
      }
    ]
  },
  four: {
    publicPath: 'technology/4/',
    imgUrlArr: ['px.jpg', 'nx.jpg', 'py.jpg', 'ny.jpg', 'pz.jpg', 'nz.jpg'],
    markList: [
      {
        name: 'landMark',
        imgUrl: 'other/landmark.png',
        wh: [0.05, 0.05],
        position: [-0.35, -0.22, 0.4],
        rotation: [-0.85, -0.45, -1.8],
        targetAttr: 'three' // 目标场景信息对象属性
      },
      {
        name: 'dom',
        position: [0.49, 0, 0],
        rotation: [0, -0.5 * Math.PI, 0],
        targetAttr: 'five', // 目标场景信息对象属性
        active(e) {
          setMaterialCube(sceneInfoObj.five)
        }
      }
    ]
  },
  five: {
    publicPath: 'technology/5/',
    imgUrlArr: ['px.jpg', 'nx.jpg', 'py.jpg', 'ny.jpg', 'pz.jpg', 'nz.jpg'],
    markList: [
      {
        name: 'landMark',
        imgUrl: 'other/landmark.png',
        wh: [0.03, 0.03],
        position: [-0.05, -0.05, 0.4],
        rotation: [1.21, -0.15, -0.69],
        targetAttr: 'four' // 目标场景信息对象属性
      },
      {
        name: 'video',
        imgUrl: 'video/movie.mp4',
        wh: [0.2, 0.1],
        position: [0.49, 0.04, 0.045],
        rotation: [0, -0.5 * Math.PI, 0]
      }
    ]
  }
}

// 创建立方体
const createCube = () => {
  const geometry = new THREE.BoxGeometry(1, 1, 1)
  const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
  const cube = new THREE.Mesh(geometry, material)
  cube.scale.set(1, 1, -1) //给z轴设置-1 让贴图不要镜像
  //添加到长距离
  scene.add(cube)
  return cube
}

// 删除标点
const clear = () => {
  // 拷贝一份 防止在删除的时候影像数组的长度
  // console.log(group)
  if (gui) {
    gui.domElement.remove() // 从 DOM 中移除 GUI 元素
  }

  const list = [...group.children]
  list.forEach(item => {
    // console.log(item)
    // 如果不是 dom转3d的元素
    if (!item.isCSS3DObject) {
      item.geometry.dispose() //删除图形
      item.material.dispose() //删除材质
    }
    group.remove(item) //在组里删除标点
  })
}

// 4.2 准备创建纹理贴图函数
const setMaterialCube = infoObj => {
  // console.log(infoObj)
  // 每次创建纹理时 都吧上一次创建的删除掉
  clear()
  const { publicPath, imgUrlArr, markList } = infoObj
  //设置当前纹理加载器公共的基本路径
  const textureLoader = new THREE.TextureLoader()
  textureLoader.setPath(publicPath)
  // 遍历纹理对象 贴到立方体上
  const materialArr = imgUrlArr.map(item => {
    // 创建六个纹理 贴上去
    const texture = textureLoader.load(item)
    // three.js 颜色通道为 rgb 颜色（为了防止图片太浅,图片不清晰）
    texture.colorSpace = THREE.SRGBColorSpace
    // 生成材质
    return new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide })
  })
  // 设置立方体的纹理
  cubeObj.material = materialArr
  // 4.3 准备创建地上热点标记函数
  markList.forEach(markObj => {
    if (markObj.name == 'landMark') {
      createLandMark(markObj)
    }
    if (markObj.name == 'dom') {
      createDomMark(markObj)
    }
    if (markObj.name == 'video') {
      createVideoMark(markObj)
    }
  })
  // 把所有标点都放到组里 方便删除新增  然后把组添加到场景里
  scene.add(group)
}
// 创建地上热点暴击函数
const createLandMark = markObj => {
  // const geometry = new THREE.PlaneGeometry(markObj.wh[0], markObj.wh[1])
  const geometry = new THREE.PlaneGeometry(...markObj.wh)
  const material = new THREE.MeshBasicMaterial({
    side: THREE.DoubleSide,
    map: new THREE.TextureLoader().load(markObj.imgUrl), //渲染标点纹理
    transparent: true //定义此材质是否透明  透明纹理
  })
  const plane = new THREE.Mesh(geometry, material)
  plane.position.set(...markObj.position) //标点的位置角度
  plane.rotation.set(...markObj.rotation) //标点的旋转角度

  // 给标点加一个name 方便做点击事件的时候区分
  plane.name = 'mark'
  // 把标点对应的数据传到对象里 方便点击事件的时候区分
  plane.userData = markObj
  // 用gui来调试mark标点的位置结束后注释或者删除就行
  // initGui(plane)
  // 把标点都添加到一个组里 方便删除
  group.add(plane)
}
// 4.4 准备 dat.gui 工具函数调整位置

// 目标5：创建第二个场景
// 5.1 定义场景里数据对象相关属性和值（这次有 2 个地上热点标记）
// 5.2 与 3D 物体交互事件绑定
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
    const obj = list.find(item => item.object.name === 'mark') //找到name为mark的标点
    if (!obj) return
    // console.log(obj)
    const objData = sceneInfoObj[obj.object.userData.targetAttr]
    // 重新渲染场景 和标点
    setMaterialCube(objData)
  })
}
// 准备创建 DOM 标记的函数
const createDomMark = markObj => {
  const tag = document.createElement('span')
  tag.className = 'mark-style'
  tag.innerHTML = '前进'
  tag.style.pointerEvents = 'all' //让标点可以被点机
  tag.addEventListener('click', e => {
    // e.stopPropagation()
    markObj.active()
  })
  // 吧创建的dom对象转换成3d物体
  const tag3d = new CSS3DObject(tag)
  // console.log(tag3d)
  // 吧转换成3d后的dom字体大小 缩小
  tag3d.scale.set(1 / 800, 1 / 800, 1 / 800)
  tag3d.position.set(...markObj.position) //调整位置
  tag3d.rotation.set(...markObj.rotation) //调整旋转
  // 把dom标记添加到组里
  group.add(tag3d)
}

// 创建视频标记的函数
const createVideoMark = markObj => {
  const video = document.createElement('video')

  video.src = markObj.imgUrl //设置视频路径
  video.muted = true //设置成静音浏览器才能自动播放视频
  video.addEventListener('loadedmetadata', () => {
    // 视频加载完就直接播放
    video.play()
  })

  // 创建平面缓冲几何体（PlaneGeometry）
  // const geometry = new THREE.PlaneGeometry(1, 0.5)
  const geometry = new THREE.PlaneGeometry(...markObj.wh) //参数是宽高
  // 创建视频纹理
  const texture = new THREE.VideoTexture(video)
  // 创建材质
  const material = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide }) //双面渲染
  //  创建网格物体
  const plane = new THREE.Mesh(geometry, material)
  plane.position.set(...markObj.position)
  plane.rotation.set(...markObj.rotation)
  // 添加到组中
  group.add(plane)
}

// 初始化gui
const initGui = obj => {
  gui = new GUI()
  // console.log(group.children[0])
  // const markIcon = group.children[0]
  const markIcon = obj
  const folder1 = gui.addFolder('位移')

  folder1.add(markIcon.position, 'x', -1, 1.0, 0.01)
  folder1.add(markIcon.position, 'y', -1, 1.0, 0.01)
  folder1.add(markIcon.position, 'z', -1, 1.0, 0.01)
  const folder2 = gui.addFolder('旋转')
  folder2.add(markIcon.rotation, 'x', -1, 1.0, 0.01)
  folder2.add(markIcon.rotation, 'y', -1, 1.0, 0.01)
  folder2.add(markIcon.rotation, 'z', -1, 1.0, 0.01)
}

// 监听浏览器宽高
const resizeRender = () => {
  window.addEventListener('resize', () => {
    renderer.setSize(testBox.value.clientWidth, testBox.value.clientHeight) //场景的宽高
    camera.aspect = testBox.value.clientWidth / testBox.value.clientHeight //摄像机的宽高
    css3dRenderer.setSize(testBox.value.clientWidth, testBox.value.clientHeight) //3d渲染的宽高

    camera.updateProjectionMatrix()
  })
}
</script>

<style>
.containerBox {
  position: relative;
  width: 100vw;
  height: 100vh;
}
.mark-style {
  padding: 5px;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  cursor: pointer;
}
</style>
