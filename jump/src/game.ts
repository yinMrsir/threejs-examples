import * as THREE from "three";

class Game {
  config: {
    background: number; // 背景颜色
    cubeColor: number; // 盒子颜色
    cubeWidth: number; // 方块宽度
    cubeHeight: number; // 方块高度
    cubeDeep: number; // 方块深度
    jumperWidth: number;
    jumperHeight: number;
    jumperDeep: number;
    jumperColor: number;
  };
  scene: THREE.Scene;
  renderer: THREE.WebGLRenderer;
  camera: THREE.OrthographicCamera;
  size: { width: number; height: number; k: number; s: number };
  cubes: THREE.Mesh<THREE.BoxGeometry, THREE.MeshLambertMaterial>[];
  cameraPos: { current: THREE.Vector3; next: THREE.Vector3; };
  jumper: THREE.Mesh<THREE.BoxGeometry, THREE.MeshLambertMaterial> | undefined;
  jumperStat: { ready: boolean; };
  constructor() {
    this.config = {
      background: 0x282828,
      cubeColor: 0xbebebe,
      cubeWidth: 4,
      cubeHeight: 2,
      cubeDeep: 4,
      jumperColor: 0x232323,
      jumperWidth: 1, // jumper宽度
      jumperHeight: 2, // jumper高度
      jumperDeep: 1 // jumper深度
    };
    this.size = {
      width: window.innerWidth,
      height: window.innerHeight,
      k: window.innerWidth / window.innerHeight,
      s: 15,
    };
    this.cubes = [];
    this.jumperStat = {
      ready: false,
    }
    // 场景
    this.scene = new THREE.Scene();
    // 相机位置
    this.cameraPos = {
      current: new THREE.Vector3(0, 0, 0),
      next: new THREE.Vector3(),
    }
    // 相机
    this.camera = new THREE.OrthographicCamera(
      -this.size.s * this.size.k,
      this.size.s * this.size.k,
      this.size.s,
      -this.size.s,
      0,
      5000
    );
    // 渲染器
    this.renderer = new THREE.WebGLRenderer({ antialias: true });

    const axesHelper = new THREE.AxesHelper(15);
    this.scene.add(axesHelper);
  }

  init() {
    this._setCamera();
    this._renderer();
    this._createBox();
    this._createBox();
    this._setLight();
    this._updateCamera();
    this._createJumper();

    const canvas = document.querySelector('canvas');
    canvas?.addEventListener('mousedown', () => {
      this._handlerMouseDown();
    });

    canvas?.addEventListener('mouseup', () => {
      this._handlerMouseUp();
    })

  }

  _handlerMouseDown() {
    if (this.jumper && this.jumper.scale.y > 0.02 && !this.jumperStat.ready) {
      this.jumper.scale.y -= 0.01;
      requestAnimationFrame(() => {
        this._handlerMouseDown();
      })
    }
  }

  _handlerMouseUp() {
    this.jumperStat.ready = true;
  }

  _setCamera() {
    this.camera.position.set(100, 100, 100);
    this.camera.lookAt(this.scene.position);
  }

  _renderer() {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setClearColor(this.config.background);
    this.renderer.setAnimationLoop(() => this._render());
    document.body.appendChild(this.renderer.domElement);
  }

  _render() {
    this.renderer.render(this.scene, this.camera);
  }

  _createBox() {
    const geometry = new THREE.BoxGeometry(
      this.config.cubeWidth,
      this.config.cubeHeight,
      this.config.cubeDeep
    );
    const material = new THREE.MeshLambertMaterial({
      color: this.config.cubeColor,
    });
    const mesh = new THREE.Mesh(geometry, material);
    if (this.cubes.length) {
      const nextDir = Math.random() > 0.5 ? "left" : "right";
      mesh.position.x = this.cubes[this.cubes.length - 1].position.x;
      mesh.position.y = this.cubes[this.cubes.length - 1].position.y;
      mesh.position.z = this.cubes[this.cubes.length - 1].position.z;
      if (nextDir === "left") {
        mesh.position.x = mesh.position.x - Math.random() * 10 - 6;
      } else {
        mesh.position.z = mesh.position.z - Math.random() * 10 - 6;
      }
    }
    this.cubes.push(mesh);

    this.scene.add(mesh);
    if (this.cubes.length > 1) {
      this._updateCameraPos();
    }
  }

  _updateCameraPos() {
    const lastIndex = this.cubes.length - 1;
    const pointA = {
      x: this.cubes[lastIndex].position.x,
      z: this.cubes[lastIndex].position.z,
    };
    const pointB = {
      x: this.cubes[lastIndex - 1].position.x,
      z: this.cubes[lastIndex - 1].position.z,
    };
    const pointR = new THREE.Vector3();
    pointR.y = 0;
    pointR.x = (pointA.x + pointB.x) / 2;
    pointR.z = (pointA.z + pointB.z) / 2;

    this.cameraPos.next = pointR
    this._updateCamera()
  }

  _updateCamera() {    
    const c = {
      x: this.cameraPos.current.x,
      y: this.cameraPos.current.y,
      z: this.cameraPos.current.z,
    }

    const n = {
      x: this.cameraPos.next.x,
      y: this.cameraPos.next.y,
      z: this.cameraPos.next.z,
    }

    if (c.x > n.x || c.z > n.z) {
      this.cameraPos.current.x -= 0.1;
      this.cameraPos.current.z -= 0.1;
      if (this.cameraPos.current.x - this.cameraPos.next.x < 0.05) {
        this.cameraPos.current.x = this.cameraPos.next.x
      }
      if (this.cameraPos.current.z - this.cameraPos.next.z < 0.05) {
          this.cameraPos.current.z = this.cameraPos.next.z
      }
      this.camera.lookAt(new THREE.Vector3(c.x, 0, c.z))
      this._render();
      requestAnimationFrame(() => {
          this._updateCamera()
      })
    }

  }

  _setLight() {
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.1);
    directionalLight.position.set(3, 10, 5);
    this.scene.add(directionalLight);

    const light = new THREE.AmbientLight(0xffffff, 0.3);
    this.scene.add(light);
  }

  // 初始化jumper：游戏主角
  _createJumper() {
    const material = new THREE.MeshLambertMaterial({ color: this.config.jumperColor })
    const geometry = new THREE.BoxGeometry(this.config.jumperWidth, this.config.jumperHeight, this.config.jumperDeep)
    geometry.translate(0, 1, 0)
    const mesh = new THREE.Mesh(geometry, material)
    mesh.position.y = 1
    this.jumper = mesh
    this.scene.add(this.jumper)
}
}

export default Game;
