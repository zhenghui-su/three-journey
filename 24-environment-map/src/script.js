import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import GUI from 'lil-gui';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import { EXRLoader } from 'three/examples/jsm/loaders/EXRLoader.js';
import { GroundedSkybox } from 'three/examples/jsm/objects/GroundedSkybox.js';

/**
 * Loaders
 */
const gltfLoader = new GLTFLoader();
const cubeTextureLoader = new THREE.CubeTextureLoader();
const rgbeLoader = new RGBELoader();
const exrLoader = new EXRLoader();
const textureLoader = new THREE.TextureLoader();

/**
 * Base
 */
// Debug
const gui = new GUI();
const global = {};

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();
/**
 * Update all Materials
 */
const updateAllMaterials = () => {
	scene.traverse((child) => {
		if (child.isMesh && child.material.isMeshStandardMaterial) {
			// child.material.envMap = environmentMap;
			child.material.envMapIntensity = global.envMapIntensity;
		}
	});
};

/**
 * Environments map
 */
scene.backgroundBlurriness = 0;
scene.backgroundIntensity = 1;

gui
	.add(scene, 'backgroundBlurriness')
	.min(0)
	.max(1)
	.step(0.001)
	.name('backgroundBlurriness');
gui
	.add(scene, 'backgroundIntensity')
	.min(0)
	.max(10)
	.step(0.001)
	.name('backgroundIntensity');

// Global intensity
global.envMapIntensity = 1;
gui
	.add(global, 'envMapIntensity')
	.min(0)
	.max(10)
	.step(0.001)
	.onChange(updateAllMaterials);

// LDR cube Texture
// const environmentMap = cubeTextureLoader.load([
// 	'/environmentMaps/0/px.png',
// 	'/environmentMaps/0/nx.png',
// 	'/environmentMaps/0/py.png',
// 	'/environmentMaps/0/ny.png',
// 	'/environmentMaps/0/pz.png',
// 	'/environmentMaps/0/nz.png',
// ]);
// scene.environment = environmentMap;
// scene.background = environmentMap;

// HDR (RGBE) equirectangular
// rgbeLoader.load('/environmentMaps/blender-2k.hdr', (environmentMap) => {
// 	// 等距原型反射贴图
// 	environmentMap.mapping = THREE.EquirectangularReflectionMapping;
// 	scene.background = environmentMap;
// 	scene.environment = environmentMap;
// });

// EXR
// exrLoader.load('/environmentMaps/nvidiaCanvas-4k.exr', (environmentMap) => {
// 	environmentMap.mapping = THREE.EquirectangularReflectionMapping;
// 	scene.background = environmentMap;
// 	scene.environment = environmentMap;
// });

// const environmentMap = textureLoader.load(
// 	'/environmentMaps/blockadesLabsSkybox/anime_art_style_japan_streets_with_cherry_blossom_.jpg',
// );
// environmentMap.mapping = THREE.EquirectangularReflectionMapping;
// environmentMap.colorSpace = THREE.SRGBColorSpace;

// scene.background = environmentMap;
// scene.environment = environmentMap;

// Ground projected skybox
// rgbeLoader.load('/environmentMaps/2/2k.hdr', (environmentMap) => {
// 	environmentMap.mapping = THREE.EquirectangularReflectionMapping;
// 	scene.environment = environmentMap;

// 	// Skybox
// 	const skybox = new GroundedSkybox(environmentMap, 1, 1);
// 	skybox.position.y = -4;

// 	skybox.scale.setScalar(50);
// 	scene.add(skybox);
// });

/**
 * Real time environment map
 */
const environmentMap = textureLoader.load(
	'/environmentMaps/blockadesLabsSkybox/interior_views_cozy_wood_cabin_with_cauldron_and_p.jpg',
);
environmentMap.mapping = THREE.EquirectangularReflectionMapping;
environmentMap.colorSpace = THREE.SRGBColorSpace;

scene.background = environmentMap;

// Holy dount
const holyDount = new THREE.Mesh(
	new THREE.TorusGeometry(8, 0.5),
	new THREE.MeshBasicMaterial({
		color: new THREE.Color(10, 4, 2),
	}),
);
holyDount.layers.enable(1);
holyDount.position.y = 3.5;
scene.add(holyDount);

// Cube render target
const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(256, {
	type: THREE.HalfFloatType, // 半浮点类型
});

scene.environment = cubeRenderTarget.texture;

// Cube Camera
const cubeCamera = new THREE.CubeCamera(0.1, 100, cubeRenderTarget);
cubeCamera.layers.set(1);

/**
 * Torus Knot
 */
const torusKnot = new THREE.Mesh(
	new THREE.TorusKnotGeometry(1, 0.4, 100, 16),
	new THREE.MeshStandardMaterial({
		roughness: 0,
		metalness: 1,
		color: 0xaaaaaa,
	}),
);
torusKnot.position.x = -4;
torusKnot.position.y = 4;
scene.add(torusKnot);

/**
 * Models
 */
gltfLoader.load('/models/FlightHelmet/glTF/FlightHelmet.gltf', (gltf) => {
	gltf.scene.scale.set(10, 10, 10);
	scene.add(gltf.scene);
	updateAllMaterials();
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
camera.position.set(4, 5, 4);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.target.y = 3.5;
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
	// Time
	const elapsedTime = clock.getElapsedTime();

	// Real time environment map
	if (holyDount) {
		holyDount.rotation.x = Math.sin(elapsedTime) * 2;

		cubeCamera.update(renderer, scene);
	}

	// Update controls
	controls.update();

	// Render
	renderer.render(scene, camera);

	// Call tick again on the next frame
	window.requestAnimationFrame(tick);
};

tick();
