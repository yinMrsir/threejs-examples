<template>
  <div ref="canvasRef"></div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import * as THREE from "three";
import * as dat from 'dat.gui';

const canvasRef = ref<HTMLDivElement | null>(null);
const defaultConfig = {
  width: window.innerWidth,
  height: window.innerHeight,
};

const controls = new class controls {
  rotationSpeed: number;
  constructor() {
    this.rotationSpeed = 0.02;
  }
  addBox() {
    // 立方体
    var cubeSize = Math.ceil((Math.random() * 3));
    const boxGeometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
    const boxmaterial = new THREE.MeshPhysicalMaterial({ color: Math.random() * 0xffffff });
    const box = new THREE.Mesh(boxGeometry, boxmaterial);
    box.castShadow = true;
    box.position.x = -30 + Math.round((Math.random() * geometry.parameters.width));
    box.position.y = Math.round((Math.random() * 5));
    box.position.z = -20 + Math.round((Math.random() * geometry.parameters.height));

    scene.add(box);
  }
}

const gui = new dat.GUI();
gui.add(controls, 'rotationSpeed', 0, 1);
gui.add(controls, 'addBox');

// 场景
const scene = new THREE.Scene();
// 相机
const camera = new THREE.PerspectiveCamera(
  45,
  defaultConfig.width / defaultConfig.height,
  0.1,
  1000
);
camera.position.x = -50;
camera.position.y = 40;
camera.position.z = 30;
camera.lookAt(scene.position);
// 渲染器
const renderer = new THREE.WebGLRenderer();
renderer.setClearColor("#f2f2f2");
renderer.setAnimationLoop(renderScene);
renderer.setSize(defaultConfig.width, defaultConfig.height);
renderer.shadowMap.enabled = true;

// 底部平面
const geometry = new THREE.PlaneGeometry(60, 40, 1, 1);
const material = new THREE.MeshLambertMaterial({ color: "#999999" });
const plane = new THREE.Mesh(geometry, material);
plane.rotation.x = -0.5 * Math.PI;
plane.position.set(15, 0, 0);
plane.receiveShadow = true;
scene.add(plane);

// 光照
const spotLight = new THREE.SpotLight();
spotLight.position.set(-30, 40, 30);
spotLight.castShadow = true;
spotLight.shadow.mapSize = new THREE.Vector2(1024, 1024);

scene.add(spotLight);

onMounted(() => {
  canvasRef.value?.appendChild(renderer.domElement);
});

function renderScene() {
  scene.traverse(function (e) {
      if (e instanceof THREE.Mesh && e != plane) {
          e.rotation.x += controls.rotationSpeed;
          e.rotation.y += controls.rotationSpeed;
          e.rotation.z += controls.rotationSpeed;
      }
  });
  renderer.render(scene, camera);
}

</script>
