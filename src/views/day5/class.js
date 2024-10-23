import { scene } from './utils/init' 
import * as THREE from 'three'
// 目标：创建 MySphere 类，并创建 5 个球体
// 1. 创建 BaseModel 提取公共属性和方法
// 2. 修改 MyCube 类继承自 BaseModal 类
// 3. 创建 MySphere 类并实例化 5 个球体

// 1. 创建 BaseModel 提取公共属性和方法
class BaseModel {
  constructor(scene) {
    // this: 子类对象
    this.model = null // 这个值是在子类 init 中后续创建和赋值
    this.scene = scene
    this.color = new THREE.Color(`rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`)
    this.position = [Math.floor(Math.random() * (5 - 0 + 1) + 0), Math.floor(Math.random() * (5 - 0 + 1) + 0), Math.floor(Math.random() * (5 - 0 + 1) + 0)]
  }
  randColor() {
    // this: 子类对象
    this.model.material.color = new THREE.Color(`rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`)
  }
}

// 2. 修改 MyCube 类继承自 BaseModal 类
// 继续：让父类往当前类实例化对象上，绑定属性和方法
class MyCube extends BaseModel {
  constructor(scene) {
    // 如果子类有 constructor，必须在第一行调用 super() 才能触发父类的构造方法并绑定公共属性和方法, super 会把当前锁在函数内 this 值传递给父类构造函数内 this 替换
    super(scene)
    this.size = [Math.floor(Math.random() * (3 - 1 + 1) + 1), Math.floor(Math.random() * (3 - 1 + 1) + 1), Math.floor(Math.random() * (3 - 1 + 1) + 1)]
    this.init()
  }
  init() {
    const geometry = new THREE.BoxGeometry(...this.size)
    const material = new THREE.MeshBasicMaterial({ color: this.color })
    const mesh = new THREE.Mesh(geometry, material)
    mesh.position.set(...this.position)
    this.scene.add(mesh)
    this.model = mesh
  }
  rotate() {
    this.model.rotation.set(0, Math.PI / 4, 0)
  }
}

// 3. 创建 MySphere 类并实例化 5 个球体
class MySphere extends BaseModel {
  constructor(scene) {
    super(scene)
    this.radius = Math.floor(Math.random() * (2 - 1 + 1) + 1)

    this.init()
  }
  init() {
    const geometry = new THREE.SphereGeometry(this.radius, 32, 16)
    const material = new THREE.MeshBasicMaterial({ color: this.color })
    this.model = new THREE.Mesh(geometry, material)
    this.model.position.set(...this.position)
    this.scene.add(this.model)
  }
}

const arr = []
for (let i = 0; i < 5; i++) {
  arr.push(new MySphere(scene))
  arr.push(new MyCube(scene))
}
