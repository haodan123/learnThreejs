<template>
  <div ref="testBox" class="containerBox"></div>
</template>

<script setup>
import * as THREE from 'three'
import { ref, onMounted ,onUnmounted} from 'vue'
// import { CSS3DRenderer, CSS3DObject } from 'three/addons/renderers/CSS3DRenderer.js' //css3d渲染器
import { CSS3DObject } from 'three/addons/renderers/CSS3DRenderer.js' //css3d渲染器
import { useThreeInit } from '@/composables'
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js' //辅助工具
// 引入加载 gltf/glb 模型文件的加载器
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
const testBox = ref()
// 创建 场景 摄像机 渲染器
let scene, camera, renderer
// 轨道控制器
let controls
//调试工具
let gui
let cubeObj //立方体对象
onUnmounted(() => {
  if (gui) {
    gui.domElement.remove() // 从 DOM 中移除 GUI 元素
  }
})

onMounted(() => {
  const obj = useThreeInit(testBox.value)
  scene = obj.scene
  camera = obj.camera
  renderer = obj.renderer
  controls = obj.controls

  camera.position.z = 5
  // 普通材质
  // initMeshBasic()
  // Lambert网格材质
  // initLambert()
  // Phong网格材质
  // initPhong()
  // 标准网格材质
  // initStandard()
  // 环境贴图网格材质
  // initStandardCube()
  // Physical物理网格材质
  // initPhysical()
  // 认识模型和使用
  // initModel()
  // 光源
  createLight()

  // 世界坐标 和模型坐标
  initCoordinate()

  // 监听轨道控制器 旋转/拖拽等事件 方便找到驾驶位的坐标
  // controls.addEventListener('change', () => {
  // console.log(camera.position) //摄像机的位置
  // console.log(controls.target) //正在观察的坐标点对象
  // })

  // 双击进入驾驶位
  // window.addEventListener('dblclick', e => {
  //   // 在上面监听轨道控制的 方法中 找到定位复制过来
  //   camera.position.set(0.37, 1.1, -0.62)
  //   // 影响轨道控制器观察的目标位置（聚焦点）->影响摄像机查看的角度
  //   controls.target = new THREE.Vector3(0.08, 0.52, 0.49)
  // })

  resizeRender()
})

// 世界坐标 和模型坐标
const initCoordinate = () => {
  // 物体1：绿色立方体
  const geometry = new THREE.BoxGeometry(1, 1, 1)
  const material = new THREE.MeshBasicMaterial({
    color: 0x00ff00
  })
  const mesh = new THREE.Mesh(geometry, material)
  mesh.castShadow = true
  scene.add(mesh)
  gui = new GUI()

  gui.add(mesh.position, 'x', 0, 3, 0.01).name('位移x')
  gui.add(mesh.position, 'y', 0, 3, 0.01).name('位移y')
  gui.add(mesh.position, 'z', 0, 3, 0.01).name('位移z')

  gui.add(mesh.rotation, 'x', 0, 2 * Math.PI).name('旋转x')
  gui.add(mesh.rotation, 'y', 0, 2 * Math.PI).name('旋转y')
  gui.add(mesh.rotation, 'z', 0, 2 * Math.PI).name('旋转z')

  gui.add(mesh.scale, 'x', 0, 3, 0.01).name('缩放x')
  gui.add(mesh.scale, 'y', 0, 3, 0.01).name('缩放y')
  gui.add(mesh.scale, 'z', 0, 3, 0.01).name('缩放z')

  const helper = new THREE.AxesHelper(2)
  // 某个物体上也可以加坐标系辅助对象
  mesh.add(helper)
}

// 创建光源
const createLight = () => {
  // 环境光：无方向，照亮场景中所有受光照影响的物体
  const light = new THREE.AmbientLight(0xffffff, 1) // 柔和的白光
  scene.add(light)

  // 平行光：从一个方向发射过来平行光线
  const directional = new THREE.DirectionalLight(0xffffff, 2) //颜色和光照强度
  // 设置光的位置
  directional.position.set(3, 3, 3)
  // 添加到场景中
  scene.add(directional)
  // 平行光的辅助对象
  // 参数1：平行光对象，参数2：模拟平行光光源的大小
  const helper = new THREE.DirectionalLightHelper(directional, 1)
  scene.add(helper)
}

// 认识模型和使用
const initModel = () => {
  // 模型：包含网格，材质，贴图等信息的集合物体
  // 模型文件：分为 .gltf, .glb, .fbx 等等类型
  // 使用：借助 three.js 提供的 GLTFLoader 加载器可以加载 .gltf / .glb 模型文件，得到模型对象

  const loader = new GLTFLoader()
  loader.load('model/ferrari.glb', gltf => {
    const model = gltf.scene
    // model.position.set(-1, 1, 0)
    // 遍历物体内部每个小物体组成
    model.traverse(obj => {
      console.log(obj)
      if (obj.name === 'Object_3') {
        // 车身
        // 改变颜色
        // obj.material.color = new THREE.Color('red')
      }
    })

    // 把模型添加到场景中
    scene.add(model)
  })
}

// Physical物理网格材质
// MeshPhysicalMaterial
const initPhysical = () => {
  // 创建几何图形
  const geometry = new THREE.SphereGeometry(1, 32, 16)
  // 创建纹理
  // 1. 使用 CubeTextureLoader （立方体纹理加载器）- 6 个面的图片，得到纹理对象
  const cubeTL = new THREE.CubeTextureLoader()
  const cubeTexture = cubeTL.setPath('image/sky/').load(['px.jpg', 'nx.jpg', 'py.jpg', 'ny.jpg', 'pz.jpg', 'nz.jpg'])

  // 把纹理添加到MeshPhysicalMaterial材质中  MeshPhysicalMaterial材质需要配合光照才能显示
  // 2. 设置给物体的 envMap 环境贴图属性
  const material = new THREE.MeshPhysicalMaterial({
    envMap: cubeTexture, //环境贴图
    roughness: 0, // 粗糙度设置（0 光滑， 1 粗糙）
    metalness: 1, // 金属度（光反射的光泽程度，1 是最高）
    // 1. 设置清漆度（0 - 1）
    clearcoat: 1,
    // 2. 设置清漆度的粗糙度
    clearcoatRoughness: 0
  })
  // 3. 借助 GUI 工具，修改物体材质的粗糙 度和金属度观察效果

  //  创建网格材质，装入纹理
  const sphere = new THREE.Mesh(geometry, material)
  // console.log(sphere)
  gui = new GUI()
  // console.log(group.children[0])
  // const markIcon = group.children[0]
  const folder1 = gui.addFolder('金属度和粗糙度')

  folder1.add(material, 'roughness', 0, 1.0, 0.01)
  folder1.add(material, 'metalness', 0, 1.0, 0.01)
  folder1.add(material, 'clearcoat', 0, 1.0, 0.01)
  folder1.add(material, 'clearcoatRoughness', 0, 1.0, 0.01)

  // 天空盒子 给场景添加一个天空的背景
  scene.background = cubeTexture
  // 添加到场景
  scene.add(sphere)
}
// Standard网格材质 环境贴图
const initStandardCube = () => {
  // 创建几何图形
  const geometry = new THREE.SphereGeometry(1, 32, 16)
  // 创建纹理
  // 1. 使用 CubeTextureLoader （立方体纹理加载器）- 6 个面的图片，得到纹理对象
  const cubeTL = new THREE.CubeTextureLoader()
  const cubeTexture = cubeTL.setPath('image/sky/').load(['px.jpg', 'nx.jpg', 'py.jpg', 'ny.jpg', 'pz.jpg', 'nz.jpg'])

  // 把纹理添加到Standard材质中  Standard材质需要配合光照才能显示
  // 2. 设置给物体的 envMap 环境贴图属性
  const material = new THREE.MeshStandardMaterial({
    envMap: cubeTexture, //环境贴图
    roughness: 0, // 粗糙度设置（0 光滑， 1 粗糙）
    metalness: 1 // 金属度（光反射的光泽程度，1 是最高）
  })
  // 3. 借助 GUI 工具，修改物体材质的粗糙 度和金属度观察效果

  //  创建网格材质，装入纹理
  const sphere = new THREE.Mesh(geometry, material)
  // console.log(sphere)
  gui = new GUI()
  // console.log(group.children[0])
  // const markIcon = group.children[0]
  const folder1 = gui.addFolder('金属度和粗糙度')

  folder1.add(material, 'roughness', 0, 1.0, 0.01)
  folder1.add(material, 'metalness', 0, 1.0, 0.01)

  // 天空盒子 给场景添加一个天空的背景
  scene.background = cubeTexture
  // 添加到场景
  scene.add(sphere)
}

// Standard网格材质
const initStandard = () => {
  // 创建几何图形
  const geometry = new THREE.SphereGeometry(1, 32, 16)
  // 创建纹理
  const textureLoader = new THREE.TextureLoader()
  const texture = textureLoader.load('/texture/one/basecolor.jpg')
  texture.colorSpace = THREE.SRGBColorSpace //让贴图更清晰

  // 透明度贴图
  const alphaTexture = textureLoader.load('texture/one/opacity.jpg')
  alphaTexture.colorSpace = THREE.SRGBColorSpace

  // 环境纹理贴图
  const aoTexture = textureLoader.load('texture/one/ambientOcclusion.jpg')
  aoTexture.colorSpace = THREE.SRGBColorSpace
  // 注意：ao 环境遮挡贴图只对"环境光"做计算

  // 粗糙度的贴图
  const roughnessTexture = textureLoader.load('texture/one/roughness.jpg')
  roughnessTexture.colorSpace = THREE.SRGBColorSpace

  // 金属度的贴图
  const metalnessTexture = textureLoader.load('texture/one/metalness.jpg')
  metalnessTexture.colorSpace = THREE.SRGBColorSpace

  // 位移贴图
  const displacementTexture = textureLoader.load('texture/one/displace_height.jpg')
  displacementTexture.colorSpace = THREE.SRGBColorSpace

  // 法线贴图
  const normalTexture = textureLoader.load('texture/one/normal.jpg')
  normalTexture.colorSpace = THREE.SRGBColorSpace

  // 把纹理添加到Standard材质中  Standard材质需要配合光照才能显示
  const material = new THREE.MeshStandardMaterial({
    // color: 0xffff00,
    // alphaMap: alphaTexture, //透明贴图
    // transparent: true, //支持透明度的渲染  不开启所有透明都无效
    // opacity: 1, //透明度
    // aoMap: aoTexture //环境纹理贴图 模拟的光效 让图片看起来更真实
    map: texture, //贴图
    roughness: 1, // 粗糙度设置（0 光滑， 1 粗糙）
    roughnessMap: roughnessTexture, //粗糙度贴图
    metalness: 1, // 金属度（光反射的光泽程度，1 是最高）
    metalnessMap: metalnessTexture, // 金属度贴图
    displacementMap: displacementTexture, // 位移贴图
    displacementScale: 0.2, // 位移范围（0-1）
    normalMap: normalTexture // 法线贴图（影响光照）
  })

  //  创建网格材质，装入纹理
  const sphere = new THREE.Mesh(geometry, material)

  // 扩展：给目标物体设置第二组 UV 坐标（影响贴图像素点转换对应映射过程）
  // 当 aoMap 直接无效果的时候，设置第二组 UV 坐标来影响贴图贴过来时的明暗效果
  // sphere.geometry.attributes.uv.array
  sphere.geometry.setAttribute('uv2', new THREE.BufferAttribute(sphere.geometry.attributes.uv.array, 2))
  // console.log(sphere)
  // 添加到场景
  scene.add(sphere)
}

// Phong网格材质
const initPhong = () => {
  // 创建几何图形
  const geometry = new THREE.SphereGeometry(1, 32, 16)
  // 创建纹理
  const textureLoader = new THREE.TextureLoader()
  const texture = textureLoader.load('/texture/one/basecolor.jpg')
  texture.colorSpace = THREE.SRGBColorSpace //让贴图更清晰

  // 透明度贴图
  const alphaTexture = textureLoader.load('texture/one/opacity.jpg')
  alphaTexture.colorSpace = THREE.SRGBColorSpace

  // 环境纹理贴图
  const aoTexture = textureLoader.load('texture/one/ambientOcclusion.jpg')
  aoTexture.colorSpace = THREE.SRGBColorSpace
  // 注意：ao 环境遮挡贴图只对"环境光"做计算

  // 把纹理添加到Phong材质中  Phong材质需要配合光照才能显示
  const material = new THREE.MeshPhongMaterial({
    // color: 0xffff00,
    // alphaMap: alphaTexture, //透明贴图
    // transparent: true, //支持透明度的渲染  不开启所有透明都无效
    // opacity: 1, //透明度
    map: texture, //贴图
    shininess: 100, // 灯光照下来  高亮的程度，越高的值越闪亮。默认值为 30
    aoMap: aoTexture //环境纹理贴图 模拟的光效 让图片看起来更真实
  })

  //  创建网格材质，装入纹理
  const sphere = new THREE.Mesh(geometry, material)

  // 扩展：给目标物体设置第二组 UV 坐标（影响贴图像素点转换对应映射过程）
  // 当 aoMap 直接无效果的时候，设置第二组 UV 坐标来影响贴图贴过来时的明暗效果
  // sphere.geometry.attributes.uv.array
  sphere.geometry.setAttribute('uv2', new THREE.BufferAttribute(sphere.geometry.attributes.uv.array, 2))
  // console.log(sphere)
  // 添加到场景
  scene.add(sphere)
}
// Lambert网格材质
const initLambert = () => {
  // 创建几何图形
  const geometry = new THREE.SphereGeometry(1, 32, 16)
  // 创建纹理
  const textureLoader = new THREE.TextureLoader()
  const texture = textureLoader.load('/texture/one/basecolor.jpg')
  texture.colorSpace = THREE.SRGBColorSpace //让贴图更清晰

  // 透明度贴图
  const alphaTexture = textureLoader.load('texture/one/opacity.jpg')
  alphaTexture.colorSpace = THREE.SRGBColorSpace

  // 环境纹理贴图
  const aoTexture = textureLoader.load('texture/one/ambientOcclusion.jpg')
  aoTexture.colorSpace = THREE.SRGBColorSpace
  // 注意：ao 环境遮挡贴图只对"环境光"做计算

  // 把纹理添加到Lambert材质中  lambert材质需要配合光照才能显示
  const material = new THREE.MeshLambertMaterial({
    // color: 0xffff00,
    // alphaMap: alphaTexture, //透明贴图
    // transparent: true, //支持透明度的渲染  不开启所有透明都无效
    // opacity: 1, //透明度
    map: texture, //贴图
    aoMap: aoTexture //环境纹理贴图 模拟的光效 让图片看起来更真实
  })

  //  创建网格材质，装入纹理
  const sphere = new THREE.Mesh(geometry, material)

  // 扩展：给目标物体设置第二组 UV 坐标（影响贴图像素点转换对应映射过程）
  // 当 aoMap 直接无效果的时候，设置第二组 UV 坐标来影响贴图贴过来时的明暗效果
  // sphere.geometry.attributes.uv.array
  sphere.geometry.setAttribute('uv2', new THREE.BufferAttribute(sphere.geometry.attributes.uv.array, 2))
  // console.log(sphere)
  // 添加到场景
  scene.add(sphere)
}

// 普通材质
const initMeshBasic = () => {
  // 创建几何图形
  const geometry = new THREE.SphereGeometry(1, 32, 16)
  // 创建纹理
  const textureLoader = new THREE.TextureLoader()
  const texture = textureLoader.load('/texture/one/basecolor.jpg')
  texture.colorSpace = THREE.SRGBColorSpace //让贴图更清晰

  // 透明度贴图
  const alphaTexture = textureLoader.load('texture/one/opacity.jpg')
  alphaTexture.colorSpace = THREE.SRGBColorSpace

  // 环境纹理贴图
  const aoTexture = textureLoader.load('texture/one/ambientOcclusion.jpg')
  aoTexture.colorSpace = THREE.SRGBColorSpace

  // 把纹理添加到材质中
  const material = new THREE.MeshBasicMaterial({
    // color: 0xffff00,
    // alphaMap: alphaTexture, //透明贴图
    // transparent: true, //支持透明度的渲染  不开启所有透明都无效
    // opacity: 1, //透明度
    map: texture, //贴图
    aoMap: aoTexture //环境纹理贴图 模拟的光效 让图片看起来更真实
  })

  //  创建网格材质，装入纹理
  const sphere = new THREE.Mesh(geometry, material)

  // 扩展：给目标物体设置第二组 UV 坐标（影响贴图像素点转换对应映射过程）
  // 当 aoMap 直接无效果的时候，设置第二组 UV 坐标来影响贴图贴过来时的明暗效果
  // sphere.geometry.attributes.uv.array
  sphere.geometry.setAttribute('uv2', new THREE.BufferAttribute(sphere.geometry.attributes.uv.array, 2))
  // console.log(sphere)
  // 添加到场景
  scene.add(sphere)
}

// 监听浏览器宽高
const resizeRender = () => {
  window.addEventListener('resize', () => {
    renderer.setSize(testBox.value.clientWidth, testBox.value.clientHeight) //场景的宽高
    camera.aspect = testBox.value.clientWidth / testBox.value.clientHeight //摄像机的宽高
    // css3dRenderer.setSize(testBox.value.clientWidth, testBox.value.clientHeight) //3d渲染的宽高

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
</style>
