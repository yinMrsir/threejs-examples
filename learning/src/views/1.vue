<script setup lang="ts">
import * as THREE from "three";
import * as dat from "dat.gui";
import { ref, onMounted } from "vue";
import { initStats } from "../js/utils";

const canvasRef = ref<HTMLDivElement | null>(null);

const controls = {
  rotationSpeed: 0.02,
  bouncingSpeed: 0.03,
};

const gui = new dat.GUI();
gui.add(controls, "rotationSpeed", 0, 0.5);
gui.add(controls, "bouncingSpeed", 0, 0.5);

const stats = initStats(0);
let width = window.innerWidth;
let height = window.innerHeight;
// 场景
const scene = new THREE.Scene();
// 相机
const camera = new THREE.PerspectiveCamera(45, width / height, 1, 1000);
scene.add(camera);
camera.position.set(-30, 40, 30);
camera.lookAt(scene.position);

// 渲染器
const renderer = new THREE.WebGLRenderer();
renderer.setClearColor("#ffffff");
renderer.setSize(width, height);
renderer.setAnimationLoop(renderScene);
renderer.shadowMap.enabled = true;

// 底部平面
const geometry = new THREE.PlaneGeometry(60, 20);
const material = new THREE.MeshLambertMaterial({ color: "#999999" });
const plane = new THREE.Mesh(geometry, material);
plane.rotation.x = -0.5 * Math.PI;
plane.position.set(15, 0, 0);
plane.receiveShadow = true;
scene.add(plane);

// 正方体
const boxGeometry = new THREE.BoxGeometry(4, 4, 4);
const boxMaterial = new THREE.MeshPhysicalMaterial({ color: "#ff0000" });
const box = new THREE.Mesh(boxGeometry, boxMaterial);
box.position.set(0, 4, 0);
box.castShadow = true;
scene.add(box);

// 球体
const sphereGeometry = new THREE.SphereGeometry(2);
const sphereMaterial = new THREE.MeshPhysicalMaterial({ color: "#00ff00" });
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphere.position.set(30, 2, 0);
sphere.castShadow = true;
scene.add(sphere);

// 光源
const spotLight = new THREE.SpotLight(0xffffff);
spotLight.position.set(-40, 60, -10);
spotLight.castShadow = true;
spotLight.shadow.mapSize = new THREE.Vector2(1024, 1024);

scene.add(spotLight);

// 辅助线
const axesHelper = new THREE.AxesHelper(100);
scene.add(axesHelper);

// const helper = new THREE.CameraHelper(spotLight.shadow.camera);
// scene.add(helper);


var step = 0;

function renderScene() {
  stats.update();

  box.rotation.x += controls.rotationSpeed;
  box.rotation.y += controls.rotationSpeed;
  box.rotation.z += controls.rotationSpeed;

  step += controls.bouncingSpeed;
  sphere.position.x = 20 + 10 * Math.cos(step);
  sphere.position.y = 2 + 10 * Math.abs(Math.sin(step));

  renderer.render(scene, camera);
}

window.addEventListener("resize", onResize, false);

function onResize() {
  width = window.innerWidth;
  height = window.innerHeight;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
}

onMounted(() => {
  canvasRef.value?.appendChild(renderer.domElement);
});
</script>

<template>
  <div>
    <div ref="canvasRef"></div>
  </div>
</template>

<style scoped>
* {
  margin: 0;
  padding: 0;
}
</style>
