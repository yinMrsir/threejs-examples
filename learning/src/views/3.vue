<template>
  <div ref="canvasRef"></div>
</template>

<script setup lang="ts">
import * as THREE from 'three'
import {onMounted, ref} from "vue";
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import {AnimationAction} from "three/src/animation/AnimationAction";
const canvasRef = ref<HTMLDivElement|null>(null)

// 场景
const scene = new THREE.Scene()

// 相机
const camera = new THREE.PerspectiveCamera(50, 2, 0.1, 10000)
camera.position.y = 200
camera.position.z = 500
camera.lookAt(scene.position)

// 渲染器
const renderer = new THREE.WebGLRenderer()
renderer.setClearColor('#f2f2f2')
renderer.setSize(600, 300)
renderer.setAnimationLoop(render)

// 辅助线
scene.add(new THREE.AxesHelper(1000))

// 鼠标控件
new OrbitControls(camera, renderer.domElement)

{
  const light = new THREE.HemisphereLight( '#ffffff', '#000000', 3 );
  scene.add( light );
}

onMounted(() => {
  canvasRef.value?.appendChild(renderer.domElement)
})

let actions: AnimationAction[] = []
let mixer: THREE.AnimationMixer | null = null
const loader = new FBXLoader()
loader.load('/Naruto.fbx', (mesh) => {
  console.log(mesh)
  mesh.position.y = 110
  scene.add(mesh)

  mixer = new THREE.AnimationMixer(mesh)
  for (let i = 0; i < mesh.animations.length; i++) {
    actions[i] = mixer.clipAction(mesh.animations[i])
  }
  actions[24].play()

})

let keyNumber = 24
document.onkeydown = function (ev) {
  if (ev && ev.code === 'Space') {
    keyNumber++
    if (keyNumber >= actions.length -1) {
      keyNumber = 0
      actions[actions.length -1].stop()
    } else {
      actions[keyNumber - 1].stop()
    }
    actions[keyNumber].play()
  }
}


let clock = new THREE.Clock()
function render() {
  if(mixer) {
    mixer.update(clock.getDelta())
  }
  renderer.render(scene, camera)
}

</script>
