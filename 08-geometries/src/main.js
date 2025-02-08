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
// const geometry = new THREE.BoxGeometry(1, 1, 1, 2, 2, 2);
const geometry = new THREE.BufferGeometry();

const count = 50;
const positionsArray = new Float32Array(count * 3 * 3);

for (let i = 0; i < count * 3 * 3; i++) {
	positionsArray[i] = (Math.random() - 0.5) * 4;
}

const positionsAttribute = new THREE.BufferAttribute(positionsArray, 3);

geometry.setAttribute('position', positionsAttribute);

const material = new THREE.MeshBasicMaterial({
	color: 0xff0000,
	wireframe: true,
});
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// Sizes
const sizes = {
	width: window.innerWidth,
	height: window.innerHeight,
};

window.addEventListener('resize', () => {
	// 更新尺寸
	sizes.width = window.innerWidth;
	sizes.height = window.innerHeight;
	// 更新相机宽高比
	camera.aspect = sizes.width / sizes.height;
	// 更新投影矩阵
	camera.updateProjectionMatrix();
	// 更新渲染器
	renderer.setSize(sizes.width, sizes.height);
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

window.addEventListener('dblclick', () => {
	const fullscreen =
		document.fullscreenElement || document.webkitPullscreenElement;
	if (!fullscreen) {
		if (canvas.requestFullscreen) {
			canvas.requestFullscreen();
		} else if (canvas.webkitRequestFullscreen) {
			canvas.webkitRequestFullscreen();
		}
	} else {
		if (document.exitFullscreen) {
			document.exitFullscreen();
		} else if (document.webkitExitFullscreen) {
			document.webkitExitFullscreen();
		}
	}
});

// Camera
const camera = new THREE.PerspectiveCamera(
	75,
	sizes.width / sizes.height,
	0.1,
	100,
);

camera.position.z = 3;
camera.lookAt(mesh.position);
scene.add(camera);

// 控制器 Controls
const controls = new OrbitControls(camera, canvas);
// 阻尼效果 - 下面的tick每一帧需要更新控制器
controls.enableDamping = true;

// 轴辅助线
// const axesHelper = new THREE.AxesHelper(2);
// scene.add(axesHelper);

// Renderer
const renderer = new THREE.WebGLRenderer({
	canvas: canvas,
});

renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

renderer.render(scene, camera);

const clock = new THREE.Clock();
const tick = () => {
	const elapsedTime = clock.getElapsedTime();
	// 控制器更新
	controls.update();

	// Render
	renderer.render(scene, camera);

	// Call tick again on the next frame
	window.requestAnimationFrame(tick);
};

tick();
