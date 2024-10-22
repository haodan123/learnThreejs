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

onMounted(() => {
  const obj = useThreeInit(testBox.value)
  scene = obj.scene
  camera = obj.camera
  renderer = obj.renderer
  controls = obj.controls

  camera.position.z = 5
  // 光源
  createLight()

  // 世界坐标 和模型坐标
  initCoordinate()

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
