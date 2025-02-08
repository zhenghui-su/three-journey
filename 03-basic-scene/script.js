import * as THREE from './three.module.min.js';
// 场景
const scene = new THREE.Scene();
// 立方体
const geometry = new THREE.BoxGeometry(1, 1, 1);
// 材质
const material = new THREE.MeshBasicMaterial({
	color: 'red',
});
// 网格, 通过立方体和材质创建
const mesh = new THREE.Mesh(geometry, material);
// 将网络添加到场景中
scene.add(mesh);
// 大小
const sizes = {
	width: 800,
	height: 600,
};
// 相机
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
// 设置相机位置
camera.position.z = 3;
camera.position.x = 2;
// camera.position.y = -;
scene.add(camera);
// 渲染器-渲染场景
const canvas = document.querySelector('.webgl');
const renderer = new THREE.WebGLRenderer({
	canvas,
});
// 设置渲染器大小
renderer.setSize(sizes.width, sizes.height);
// 渲染
renderer.render(scene, camera);
