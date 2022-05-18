const scene = new THREE.Scene();

//立方体几何体
const geometry = new THREE.BoxGeometry(200, 200, 200);
const geometry2 = new THREE.BoxGeometry(5000000, 5000000, 5000000);

// 加载贴图
function loadtexture(url) {
  const loader = new THREE.TextureLoader();
  const texture = loader.load(url);
  const basicMaterial = new THREE.MeshBasicMaterial({
    map: texture,
    side: THREE.DoubleSide,
  })
  return basicMaterial;
}

// 前、后、上、下、左、右
let ary = [
  loadtexture('./img/a.jpg'),
  loadtexture('./img/b.jpg'),
  loadtexture('./img/c.jpg'),
  loadtexture('./img/d.jpg'),
  loadtexture('./img/e.jpg'),
  loadtexture('./img/f.jpg'),
]

let ary2 = [
  loadtexture('./img/ga.jpg'),
  loadtexture('./img/gb.jpg'),
  loadtexture('./img/gc.jpg'),
  loadtexture('./img/gd.jpg'),
  loadtexture('./img/ge.jpg'),
  loadtexture('./img/gf.jpg'),
]
// 材质
const material = new THREE.MultiMaterial(ary);
const material2 = new THREE.MultiMaterial(ary2);

const mesh = new THREE.Mesh(geometry, material);  //网格模型对象Mesh
scene.add(mesh); //网格模型添加到场景中

const mesh2 = new THREE.Mesh(geometry2, material2);
scene.add(mesh2);

/**
 * 相机设置
 */
var width = window.innerWidth; //窗口宽度
var height = window.innerHeight; //窗口高度
var k = width / height; //窗口宽高比
var s = 200000000; //三维场景显示范围控制系数，系数越大，显示的范围越大
//创建相机对象
var camera = new THREE.PerspectiveCamera(100, k, 1, s); // 透视投影相机
// var camera = new THREE.OrthographicCamera(-s * k, s * k, s, -s, 1, 1000); // 正投影相机
camera.position.set(200, 200, 300); //设置相机位置
camera.lookAt(scene.position); //设置相机方向(指向的场景对象)
/**
 * 创建渲染器对象
 */
var renderer = new THREE.WebGLRenderer();
renderer.setSize(width, height);//设置渲染区域尺寸
renderer.setClearColor(0xb9d3ff, 1); //设置背景颜色
document.body.appendChild(renderer.domElement); //body元素中插入canvas对象


function render() {
  //执行渲染操作   指定场景、相机作为参数
  renderer.render(scene, camera);
  requestAnimationFrame(render);
}
render();
var controls = new THREE.OrbitControls(camera,renderer.domElement);//创建控件对象

