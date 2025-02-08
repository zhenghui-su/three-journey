import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';

// Cursor
const cursor = {
	x: 0,
	y: 0,
};
window.addEventListener('mousemove', (event) => {
	// -0.5 用于靠左值为-0.5 靠右为0.5
	cursor.x = event.clientX / sizes.width - 0.5;
	// 在threejs中y轴认为向上, 因此前面加个负号
	cursor.y = -(event.clientY / sizes.height - 0.5);
});

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

// Objects
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// Sizes
const sizes = {
	width: 800,
	height: 600,
};

// Camera
/**
 * PerspectiveCamera 透视型相机
 * @param 1. Field of View (FOV) 视野角度 越大物体显示越小 一般推荐45 - 75
 * @param 2. Aspect Ratio 宽高比
 * @param 3. Near Plane 近平面 一般0.1 默认1
 * @param 4. Far Plane 远平面 一般100 默认 1000
 * 近距和远距不要过于极端，在后续与其他物体合一起容易出bug
 **/
const camera = new THREE.PerspectiveCamera(
	75,
	sizes.width / sizes.height,
	0.1,
	100,
);
/**
 * OrthographicCamera 正交型相机
 * @param 1. Left 左边界
 * @param 2. Right 右边界
 * @param 3. Top 上边界
 * @param 4. Bottom 下边界
 * @param 5. Near Plane 近平面 一般0.1 默认1
 * @param 6. Far Plane 远平面 一般100 默认 1000
 * 它是一个方形渲染, 因此会受到物体Sizes的影响, 比如x或y轴被压缩
 * 解决方法是保持宽高比
 */
// const aspectRatio = sizes.width / sizes.height;
// const camera = new THREE.OrthographicCamera(
// 	-1 * aspectRatio, // left
// 	1 * aspectRatio, // right
// 	1, // top
// 	-1, // bottom
// 	0.1, // near plane
// 	100, // far plane
// );
// camera.position.x = 2;
// camera.position.y = 2;
camera.position.z = 3;
camera.lookAt(mesh.position);
scene.add(camera);

// 控制器 Controls
const controls = new OrbitControls(camera, canvas);
// 阻尼效果 - 下面的tick每一帧需要更新控制器
controls.enableDamping = true;
// controls.target.y = 1;
// controls.update();

// 轴辅助线
const axesHelper = new THREE.AxesHelper(2);
scene.add(axesHelper);

// Renderer
const renderer = new THREE.WebGLRenderer({
	canvas: canvas,
});

renderer.setSize(sizes.width, sizes.height);
renderer.render(scene, camera);

const clock = new THREE.Clock();
const tick = () => {
	const elapsedTime = clock.getElapsedTime();

	// Update objects
	// mesh.rotation.y = elapsedTime;

	// Update camera
	// camera.position.x = Math.sin(cursor.x * Math.PI * 2) * 3;
	// camera.position.z = Math.cos(cursor.x * Math.PI * 2) * 3;
	// camera.position.y = cursor.y * 5;
	// camera.lookAt(mesh.position);

	// 控制器更新
	controls.update();

	// Render
	renderer.render(scene, camera);

	// Call tick again on the next frame
	window.requestAnimationFrame(tick);
};

tick();
