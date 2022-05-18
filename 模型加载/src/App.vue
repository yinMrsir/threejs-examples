<script>
import { defineComponent, onMounted } from "vue";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

export default defineComponent({
  setup() {
    onMounted(() => {
      // init

      const camera = new THREE.PerspectiveCamera(
        70,
        window.innerWidth / window.innerHeight,
        1,
        1000
      );
      camera.position.set(25, 5, 31);

      const scene = new THREE.Scene();

      const loader = new GLTFLoader();
      loader.load("/奥迪Audi A7 55 TFSI汽车.glb", (gltf) => {
        gltf.scene.getObjectByName("Body_Part_Hood").material =
          new THREE.MeshLambertMaterial({
            color: 0x996633,
          });

        gltf.scene.getObjectByName("Body_Part_Front_Bumper").material =
          new THREE.MeshLambertMaterial({
            color: 0x996633,
          });

        gltf.scene.getObjectByName("Body_Part_Wind_Shield").material =
          new THREE.MeshLambertMaterial({
            opacity: 0.1,
          });

        scene.add(gltf.scene);
      });

      // const ax = new THREE.AxesHelper(250);
      // scene.add(ax);

      var directionalLight = new THREE.DirectionalLight(0xffffff, 0.3);
      directionalLight.position.set(400, 200, 300);
      scene.add(directionalLight);
      // 平行光2
      var directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.6);
      directionalLight2.position.set(-300, 600, -300);
      scene.add(directionalLight2);
      //环境光
      var ambient = new THREE.AmbientLight(0xffffff, 0.5);
      scene.add(ambient);

      const renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setClearColor(0xffffff);
      renderer.setAnimationLoop(animation);
      document.body.appendChild(renderer.domElement);

      // animation

      function animation() {
        renderer.render(scene, camera);
      }

      new OrbitControls(camera, renderer.domElement);
    });
  },
});
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
