<script setup>
import * as THREE from "three";
import mapJson from "./china.json";
import * as d3geo from 'd3-geo';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

console.log(mapJson);
// 相机
const camera = new THREE.PerspectiveCamera(
  70,
  window.innerWidth / window.innerHeight,
  0.01,
  10000
);
camera.position.z = 1000;
// 场景
const scene = new THREE.Scene();

// 渲染器
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setAnimationLoop(animation);
renderer.setClearColor('#f2f2f2');
document.body.appendChild(renderer.domElement);

function animation() {
  renderer.render(scene, camera);
}

new OrbitControls(camera, renderer.domElement)

function createColor() {
  let color = '#';
  for (let index = 0; index < 6; index++) {
    color += parseInt(Math.random() * 16).toString(16)
  }
  return color;
}

// 设置中心点位置
const position = d3geo.geoMercator().center([112.988094, 28.193106]).scale(800).translate([0 , 0]);
// 循环画区域
mapJson.features.forEach(value => {
  renderMapChildren(value.geometry.coordinates[0][0], '#d13a34'); //'#d13a34'
})

function renderMapChildren(data, color) {
  const point = [];

  data.forEach((value) => {
    point.push(new THREE.Vector2(position(value)[0], -position(value)[1]));
  });

  const shape = new THREE.Shape(point);

  const extrudeSettings = {
    steps: 2,
    depth: 16,
    bevelEnabled: true,
    bevelThickness: 1,
    bevelSize: 1,
    bevelOffset: 0,
    bevelSegments: 1
  };

  const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
  // geometry.center();
  // geometry.scale(500, 500, 500);
  const material = new THREE.MeshBasicMaterial({
    color,
    opacity: 0.6,
    transparent: true,
  });

  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);
}
</script>

<template>
  <div></div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
}
</style>
