<script setup>
import * as THREE from "three";
import mapJson from "./map.json";
import * as d3geo from "d3-geo";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

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
renderer.setClearColor("#f2f2f2");
document.body.appendChild(renderer.domElement);

let activeIntersects = [];

function animation() {
  renderer.render(scene, camera);
}

new OrbitControls(camera, renderer.domElement);

function createColor() {
  let color = "#";
  for (let index = 0; index < 6; index++) {
    color += parseInt(Math.random() * 16).toString(16);
  }
  return color;
}

// 设置中心点位置
const position = d3geo
  .geoMercator()
  .center([116.405285, 39.904989])
  .scale(800)
  .translate([0, 0]);
// 循环画区域
mapJson.features.forEach((value) => {
  if (value.geometry.type === "MultiPolygon") {
    value.geometry.coordinates.forEach((v) => {
      v.forEach((c) => {
        renderMapChildren(c, "#d13a34", value.properties);
      });
    });
  }
  if (value.geometry.type === "Polygon") {
    value.geometry.coordinates.forEach((v) => {
      renderMapChildren(v, "#d13a34", value.properties);
    });
  }
});

function renderMapChildren(data, color, properties) {
  const provice = new THREE.Object3D();
  const point = [];
  const linePoints = [];

  data.forEach((value) => {
    const [x, y] = position(value);
    point.push(new THREE.Vector2(x, -y));
    linePoints.push(new THREE.Vector3(x, -y, 25));
  });

  const shape = new THREE.Shape(point);

  const extrudeSettings = {
    steps: 2,
    depth: 16,
    bevelEnabled: true,
    bevelThickness: 1,
    bevelSize: 1,
    bevelOffset: 0,
    bevelSegments: 1,
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
  provice.add(mesh);

  const lineGeometry = new THREE.BufferGeometry().setFromPoints(linePoints);
  const lineMaterial = new THREE.LineBasicMaterial({
    color: "#ffffff",
  });
  const line = new THREE.Line(lineGeometry, lineMaterial);
  provice.add(line);

  provice.properties = properties;
  scene.add(provice);
}

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

function onPointerMove(event) {
  debugger
  const info = document.querySelector("#info");
  // 将鼠标位置归一化为设备坐标。x 和 y 方向的取值范围是 (-1 to +1)

  pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

  // 通过摄像机和鼠标位置更新射线
  raycaster.setFromCamera(pointer, camera);

  if (activeIntersects.length) {
    for (let i = 0; i < activeIntersects.length; i++) {
      activeIntersects[i].object.material.color.set("#d13a34");
    }
  }

  // 计算物体和射线的焦点
  const intersects = raycaster.intersectObjects(scene.children);

  if (intersects.length && intersects[0].object.parent.properties) {
    info.innerHTML = intersects[0].object.parent.properties.name;
    info.style.left = event.clientX + "px";
    info.style.top = event.clientY + "px";
    info.style.display = "block";
  } else {
    info.style.display = "none";
  }

  activeIntersects = [];

  for (let i = 0; i < intersects.length; i++) {
    if (intersects[i].object.type === "Mesh") {
      activeIntersects.push(intersects[i]);
      intersects[i].object.material.color.set(0xff0000);
    }
  }
}

window.addEventListener("pointermove", onPointerMove);

const axesHelper = new THREE.AxesHelper( 500 );
scene.add( axesHelper );
</script>

<template>
  <div id="info"></div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
}
#info {
  position: absolute;
  background: rgba(0, 0, 0, 0.5);
  color: #fff;
  border-radius: 2px;
  padding: 5px 10px;
  left: 0;
  top: 0;
  display: none;
}
</style>
