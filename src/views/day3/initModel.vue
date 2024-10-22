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
  initModel()
  // 光源
  createLight()
  // 监听轨道控制器 旋转/拖拽等事件 方便找到驾驶位的坐标
  controls.addEventListener('change', () => {
    // console.log(camera.position) //摄像机的位置
    // console.log(controls.target) //正在观察的坐标点对象
  })

  // 双击进入驾驶位
  window.addEventListener('dblclick', e => {
    // 在上面监听轨道控制的 方法中 找到定位复制过来
    camera.position.set(0.37, 1.1, -0.62)
    // 影响轨道控制器观察的目标位置（聚焦点）->影响摄像机查看的角度
    controls.target = new THREE.Vector3(0.08, 0.52, 0.49)
  })

  resizeRender()
})

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
