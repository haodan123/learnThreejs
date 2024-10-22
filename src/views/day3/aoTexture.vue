<template>
  <div ref="testBox" class="containerBox"></div>
</template>

<script setup>
import * as THREE from 'three'
import { ref, onMounted } from 'vue'
import { useThreeInit } from '@/composables'
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js' //辅助工具
const testBox = ref()
// 创建 场景 摄像机 渲染器
let scene, camera, renderer
// 轨道控制器
let controls
//调试工具
let gui

onMounted(() => {
  const obj = useThreeInit(testBox.value)
  scene = obj.scene
  camera = obj.camera
  renderer = obj.renderer
  controls = obj.controls

  camera.position.z = 5
  initBase()

  resizeRender()
})

// 透明贴图
const initBase = () => {
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
