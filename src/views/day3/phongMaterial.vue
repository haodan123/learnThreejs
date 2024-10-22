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

  // Phong网格材质
  initPhong()
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
