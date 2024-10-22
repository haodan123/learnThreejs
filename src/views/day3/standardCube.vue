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

  camera.position.z = 5

  // 环境贴图网格材质
  initStandardCube()
  // 光源
  createLight()

  resizeRender()
})

// 创建光源
const createLight = () => {
  // 环境光：无方向，照亮场景中所有受光照影响的物体
  const light = new THREE.AmbientLight(0xffffff) // 柔和的白光
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
