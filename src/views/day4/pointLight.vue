<template>
  <div ref="testBox" class="containerBox"></div>
</template>

<script setup>
import * as THREE from 'three'
import { ref, onMounted, onUnmounted } from 'vue'
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

  camera.position.set(5, 5, 5)
  // 创建地板
  createFloor()
  // 光源
  createLight()

  resizeRender()
})

// 创建光源
const createLight = () => {
  // 环境光：无方向，照亮场景中所有受光照影响的物体
  // 注意1：没有方向，不能投射阴影，只能照亮物体，但是没有光斑
  // 注意2：金属度 1，粗糙度 0，无环境贴图时，放射颜色为黑色，物体自身为黑色并不是灯光的问题
  // const light = new THREE.AmbientLight(0xffffff, 1) // 柔和的白光
  // scene.add(light)
  // 点光源（灯泡）
  // 作用：从一个点向各个方向发射的光源，模拟灯泡发出的光，有方向可以投影和光斑
  // 1. 创建 PointLight 点光源对象
  // 2. 创建 PointLightHelper 辅助对象观察所在位置
  const light = new THREE.PointLight(0xffffff, 1, 100)
  light.position.set(3, 3, 3)
  scene.add(light)
  // 点光源的辅助对象
  const sphereSize = 1
  const pointLightHelper = new THREE.PointLightHelper(light, sphereSize)
  scene.add(pointLightHelper)

  // 平行光：从一个方向发射过来平行光线
  // const directional = new THREE.DirectionalLight(0xffffff, 2) //颜色和光照强度
  // // 设置光的位置
  // directional.position.set(3, 3, 3)
  // // 添加到场景中
  // scene.add(directional)
  // // 平行光的辅助对象
  // // 参数1：平行光对象，参数2：模拟平行光光源的大小
  // const helper = new THREE.DirectionalLightHelper(directional, 1)
  // scene.add(helper)
}

const createFloor = () => {
  const geometry = new THREE.PlaneGeometry(10, 10)

  // 使用标准网格材质
  const material = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    side: THREE.DoubleSide
    // roughness: 1, // 粗糙度设置（0 光滑， 1 粗糙）
    // metalness: 0 // 金属度（光反射的光泽程度，1 是最高）
  })
  const plane = new THREE.Mesh(geometry, material)
  // console.log(plane)
  // plane.rotation.x = Math.PI
  plane.rotation.x = -Math.PI / 2 //-的2分之π  就是旋转180度
  scene.add(plane)
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
