import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import back from './img/back.png'
import front from './img/front.png'
import top from './img/top.png'
import bottom from './img/bottom.png'
import left from './img/left.png'
import right from './img/right.png'

function App() {
  const ref = useRef()

  const loadTextrue = (url) => {
    const loader = new THREE.TextureLoader();
    const texture = loader.load(url)
    const material = new THREE.MeshBasicMaterial( {
      map: texture,
      side: THREE.DoubleSide,
    } ); 
    return material
  }

  useEffect(() => {
    // init
    const camera = new THREE.PerspectiveCamera(
      70,
      window.innerWidth / window.innerHeight,
      0.01,
      10
    );
    camera.position.z = 1;

    const scene = new THREE.Scene();
    const arr = [
      loadTextrue(back),
      loadTextrue(front),
      loadTextrue(top),
      loadTextrue(bottom),
      loadTextrue(left),
      loadTextrue(right),
    ]

    const geometry = new THREE.BoxGeometry(4, 4, 4);
    // const material = new THREE.MultiMaterial(arr);   0.141.0 版本不需要使用

    const mesh = new THREE.Mesh(geometry, arr);
    scene.add(mesh);

    // const ax = new THREE.AxesHelper();
    // scene.add(ax);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setAnimationLoop(animation);
    ref.current.appendChild(renderer.domElement)

    // animation

    function animation(time) {
      // mesh.rotation.x = time / 2000;
      // mesh.rotation.y = time / 1000;

      renderer.render(scene, camera);
    }

    const orbit = new OrbitControls(camera, renderer.domElement)
    orbit.enableZoom = false;
  }, []);

  return <>
    <div ref={ref} className="box"></div>
  </>;
}

export default App;
