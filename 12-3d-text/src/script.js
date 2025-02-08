import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import GUI from 'lil-gui';

/**
 * Base
 */
// Debug
const gui = new GUI();

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

// Axes helper
// const axesHelper = new THREE.AxesHelper(2);
// scene.add(axesHelper);

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const matcapTexture = textureLoader.load('/textures/matcaps/1.png');
/**
 * Fonts
 */
const fontLoader = new FontLoader();
fontLoader.load('/fonts/helvetiker_regular.typeface.json', (font) => {
	const textGeometry = new TextGeometry('Hello Three.js', {
		font: font, // 字体
		size: 0.5, // 字体大小
		depth: 0.2, // 厚度或者深度
		curveSegments: 5, // 圆弧分段数
		bevelEnabled: true, // 是否有边缘即斜面
		bevelThickness: 0.03, // 边缘厚度
		bevelSize: 0.02, // 边缘大小
		bevelOffset: 0, // 边缘偏移
		bevelSegments: 4, // 边缘分段数
	});
	// textGeometry.computeBoundingBox();
	// textGeometry.translate(
	// 	-(textGeometry.boundingBox.max.x - 0.02) * 0.5,
	// 	-(textGeometry.boundingBox.max.y - 0.02) * 0.5,
	// 	-(textGeometry.boundingBox.max.z - 0.03) * 0.5,
	// );
	textGeometry.center();

	const material = new THREE.MeshMatcapMaterial({
		matcap: matcapTexture,
	});
	const textMesh = new THREE.Mesh(textGeometry, material);
	scene.add(textMesh);

	const dountGeometry = new THREE.TorusGeometry(0.3, 0.2, 20, 45);

	for (let i = 0; i < 100; i++) {
		const dountMesh = new THREE.Mesh(dountGeometry, material);

		dountMesh.position.x = (Math.random() - 0.5) * 10;
		dountMesh.position.y = (Math.random() - 0.5) * 10;
		dountMesh.position.z = (Math.random() - 0.5) * 10;

		dountMesh.rotation.x = Math.random() * Math.PI;
		dountMesh.rotation.y = Math.random() * Math.PI;

		const scale = Math.random();
		dountMesh.scale.set(scale, scale, scale);

		scene.add(dountMesh);
	}
});

/**
 * Sizes
 */
const sizes = {
	width: window.innerWidth,
	height: window.innerHeight,
};

window.addEventListener('resize', () => {
	// Update sizes
	sizes.width = window.innerWidth;
	sizes.height = window.innerHeight;

	// Update camera
	camera.aspect = sizes.width / sizes.height;
	camera.updateProjectionMatrix();

	// Update renderer
	renderer.setSize(sizes.width, sizes.height);
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
	75,
	sizes.width / sizes.height,
	0.1,
	100,
);
camera.position.x = 1;
camera.position.y = 1;
camera.position.z = 2;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
	canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
	const elapsedTime = clock.getElapsedTime();

	// Update controls
	controls.update();

	// Render
	renderer.render(scene, camera);

	// Call tick again on the next frame
	window.requestAnimationFrame(tick);
};

tick();
