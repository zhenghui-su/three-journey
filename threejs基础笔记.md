## three 基础

### 创建基础立方体

通过 three 创建物体，分几个，场景、立方体、材质，然后通过立方体和材质创建网格，将网格添加到场景中，然后通过添加相机来观察，最后创建渲染器渲染创建。

首先 html 文件很简单，注意有个`canvas`标签及其引入对应的文件即可

```html
<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="UTF-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<title>Document</title>
	</head>

	<body>
		<canvas class="webgl"></canvas>
		<script src="./three.module.min.js" type="module"></script>
		<script src="./script.js" type="module"></script>
	</body>
</html>
```

随后就照着上面的步骤，写入如下

```js
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
// camera.position.y = -1;
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
```

这些是基本的，照这样写完然后打开你会看到一个红色立方体，如下：

![image-20250130135345960](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250130135345960.png)

### 基本项目

上面我们是通过普通 js 和 html 来做的，但我们平时都是通过项目，three 也提供了 npm 包，所以我们可以通过 npm 来下载

```bash
npm install three
```

在创建初始项目时候，也可以通过我的脚手架`szh-cli`来创建基本 demo，提供了模板

![image-20250130135621447](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250130135621447.png)

打开下载启动后就是一个红色物体，该基础 demo 只使用 vite 和 three，ts 可根据需要配置

### 物体对象和组

#### position 对象

上面创建的 geometry、mesh 等，他们都有几个基本对象，比如 position。

我们可以通过更改 position 来改变位置，position 是一个 Vector3 的向量，分为 x、y、z 三个轴，注意，在 threejs 中 y 轴默认向上

```js
const mesh = new THREE.Mesh(geometry, material);
mesh.position.x = 0.7;
mesh.position.y = -0.6;
mesh.position.z = 1;
```

当然由于 position 是一个向量，所以他有一个方法`length()`即大小：

```js
console.log(mesh.position.length());
```

如果学过数学，就知道还有个东西叫归一化，position 作为向量自然也是有的：

```js
console.log(mesh.position.normalize());
```

上面设置 x、y、z 要写三次，可以通过`set`方法来快速，也可以如`setX`单独设置：

```js
mesh.position.set(0.7, -0.6, 1);
mesh.position.setX(1);
```

我们想知道某个东西距离另一个东西有多远，可以通过`distanceTo`来查看：

```js
console.log(mesh.position.distanceTo(camera.position));
```

#### rotation 对象

上面 position 是位置，这里的 rotation 自然就是旋转了，我们可以通过它来旋转物体：

```js
mesh.rotation.x = 1;
mesh.rotation.y = 2;
mesh.rotation.z = 3;
```

其中有个小点，想让轴旋转半个圈这种，例如 90 度，通过`Math.PI`圆周率即可：

```js
mesh.rotation.x = Math.PI * 0.25;
mesh.rotation.y = Math.PI * 0.25;
mesh.rotation.z = Math.PI * 0.25;
```

轴的旋转顺序按照你书写的顺序，如果想指定可以通过`reorder`来：

```js
mesh.rotation.reorder('ZYX');
```

#### scale 对象

这个就和上面一样，就是控制物体的缩放：

```js
mesh.scale.x = 1.5;
mesh.scale.y = 0.5;
mesh.scale.z = 0.5;
```

#### 轴辅助线

有些时候我们不知道 x、y、z 轴在哪个方向，可以通过设置轴辅助线来辅助：

```js
// Axes Helper
const axesHelper = new THREE.AxesHelper(2);
scene.add(axesHelper);
```

其中参数是长度，可以自行设置

#### group 组

有些时候，我们做完某个小场景，发现整体位置偏了一点，但一个个移动很麻烦，为了解决这个问题，three 引入了组的概念，通过`Group`创建：

```js
const group = new THREE.Group();
```

在我们创建物体后，将物体添加到 group，然后在场景中添加 group：

```js
const cubeA = new THREE.Mesh(
	new THREE.BoxGeometry(1, 1, 1),
	new THREE.MeshBasicMaterial({ color: 'blue' }),
);
const cubeB = new THREE.Mesh(
	new THREE.BoxGeometry(1, 1, 1),
	new THREE.MeshBasicMaterial({ color: 'green' }),
);

cubeB.position.x = 2;

group.add(cubeA);
group.add(cubeB);

scene.add(group);
```

这样我们发现这个小场景的物体比如需要整体旋转或移动，我们通过改变 group 就可以改变组里所有的立方体了：

```js
group.rotation.x = 1;
```

### Animation 动画

在 threejs 中想要实现动画，一般需要通过配合帧的绘制，我们可以通过浏览器的`requestAnimationFrame`来实现：

```js
const tick = () => {
	// 渲染更新
	renderer.render(scene, camera);

	window.requestAnimationFrame(tick);
};
tick();
```

然后在`tick`函数中来改变上面物体的对象来实现动画，一般有 2 种方式

#### Clock 方式

通过 three 自带的`Clock`可以获取过去了多少时间，从而实现动画：

```js
const clock = new THREE.Clock();
const tick = () => {
	const elapsedTime = clock.getElapsedTime();

	// 更新对象
	mesh.rotation.y = elapsedTime * Math.PI;
	// 	mesh.position.x = Math.sin(elapsedTime);
	// 	mesh.position.y = Math.cos(elapsedTime);
	// 渲染更新
	renderer.render(scene, camera);

	window.requestAnimationFrame(tick);
};
tick();
```

#### gsap 库

另一种就是不自己计算，通过`gasp`库，但每帧绘制也要重新 render

通过`npm i gasp`下载库，然后如下：

```js
gsap.to(mesh.position, { duration: 1, delay: 1, x: 2 });
gsap.to(mesh.position, { duration: 1, delay: 2, x: 0 });
const tick = () => {
	// 渲染更新
	renderer.render(scene, camera);

	window.requestAnimationFrame(tick);
};
tick();
```

当然通过`Date.now()`计算也可以，不过比较麻烦就不推荐了。

### Cameras 相机

本小节讲下相机，上面我们用的都是透视型相机，具体参数如下：

```js
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
```

然后我们可以看看另一种正交型相机：

```js
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
const aspectRatio = sizes.width / sizes.height;
const camera = new THREE.OrthographicCamera(
	-1 * aspectRatio, // left
	1 * aspectRatio, // right
	1, // top
	-1, // bottom
	0.1, // near plane
	100, // far plane
);
```

#### 瞄向

创建了相机，我们如何控制它瞄向某个点呢？通过`lookAt`，我们可以让他瞄准网格

```js
camera.lookAt(mesh.position);
```

#### 控制器-小例子

我们可以先通过监听鼠标移动获取到鼠标坐标：

```js
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
```

然后通过控制器 Controls 来控制，控制器就是用于控制 camera 相机的，我们可以拖动等，比如让最终位置的 y 坐标为 1，注意控制器需要单独引入：

```js
import { OrbitControls } from 'three/examples/jsm/Addons.js';

// 控制器 Controls
const controls = new OrbitControls(camera, canvas);
controls.target.y = 1;
controls.update(); // 修改后需要update更新
```

还可以添加一个阻尼效果：

```js
// 阻尼效果 - 下面的tick每一帧需要更新控制器
controls.enableDamping = true;
// ...
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
```

这样就可以拖动查看整个立方体，上面中注释的是一个小例子，让 camera 可以一直改变位置，这样看起来物品就旋转起来了，它是通过我们获取的 cursor 对象值来实现。

### 全屏和设置大小

#### 浏览器全屏

浏览器全屏很简单，将之前的 sizes 设置为`inner`即可：

```js
// Sizes
const sizes = {
	width: window.innerWidth,
	height: window.innerHeight,
};
```

#### 样式解决

当然，由于浏览器有默认样式，我们需要清除一下：

```css
* {
	margin: 0;
	padding: 0;
}
```

当然现在还有滚动条，不够完美，可以解决一下，用什么都行：

```css
.webgl {
	position: fixed;
	top: 0;
	left: 0;
}
```

这样就完美浏览器全屏了，当然有些电脑浏览器可能在拖动时可能会有蓝色线条在最外面，因此我们可以解决一下：

```css
.webgl {
	position: fixed;
	top: 0;
	left: 0;
	outline: none;
}
```

还有个触控板的小问题，当我们禁止一下控制器的触控：

```js
controls.enabled = false;
```

然后触控板去滚动，正常会不让我们超出边界，但有可能会有 bug，因此为了防止，直接禁止是最简单的：

```css
html,
body {
	overflow: hidden;
}
```

#### 重新计算

当我们拖动浏览器，如果超出最开始的宽度或高度，会有白色部分，我们应该解决一下，让他重新计算这个宽度和高度，通过监听事件然后更新即可：

```js
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
});
```

#### 像素比

每台设备都有自己的像素比，你可以通过`window.devicePixelRatio`来查看

像素比越高，画面越是精细，但同时渲染更多像素设备压力会更高。

three 的 renderer 也可以设置自己的渲染像素比，通过`setPixelRatio`：

```js
renderer.setPixelRatio(window.devicePixelRatio);
```

大部分情况下，我们可以通过和设备像素比来比较设置，这样不会对设备压力很高：

```js
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
```

同时这个代码也可以放到`resize`中，防止不同的屏幕的渲染问题：

```js
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
```

#### 全屏

我们还想实现想玩游戏那会一样，无浏览器无边框，真正的全屏。触发全屏的方式可以自己设置，这里使用双击事件来设置：

```js
window.addEventListener('dblclick', () => {
	if (!document.fullscreenElement) {
		// 特定元素全屏
		canvas.requestFullscreen();
	} else {
		document.exitFullscreen();
	}
});
```

当然这个方式没啥问题，但是它在 Safari 浏览器上有可能不行，因此需要解决一下兼容性：

```js
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
```

其实就是加上了前缀，其他没啥区别。

### Geometries 几何体

几何体由各个顶点组成，每个顶点都生成了一个粒子，它们之间形成了面。

在顶点中，存储了 position、UV 坐标、法线 Normal 等等你想存储的值。

这只是一个概念，在后续我们会自己生成顶点粒子和各个面，目前只需用内置的几何体。

Three 内置了很多几何体，你可以通过文档查看示例，这边列出一些：

- BoxGeometry 方形几何体
- PlaneGeometry 平面几何体
- CircleGeometry 圆形几何体
- ConeGeometry 圆锥几何体
- CylinderGeometry 圆柱几何体
- RingGeometry 环状几何体
- TorusGeometry 圆形环状几何体
- TorusKnotGeometry 环面结几何体
- DodecahedronGeometry 十二面几何体
- OctahedronGeometry 八面几何体
- Tetrahedron 四面几何体
- SphereGeometry 球形几何体（参数改改可作为行星）
- ShapeGeometry 心形几何体（基于贝塞尔曲线）
- TubeGeometry 管道几何体
- TextGeometry 文字几何体（3D 文字）

当然你可以用这些几何体做出不错的场景，不过大型的还是推荐使用建模软件比较合适

#### 参数

我们还是使用 BoxGeometry 作为例子，我们讲一下参数：

- width：x 轴大小
- height：y 轴大小
- depth：z 轴大小
- widthSegments：x 轴分段
- heightSegments：y 轴分段
- depthSegments：z 轴分段

下面的三个参数是用于控制顶点之间连接形成的面分段形成的三角形，比如设为 2，如下"十字"分段：

![image-20250130170109495](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250130170109495.png)

它一般干嘛用，假如我们使用平面几何体创建类似地形的效果，我们想让这个地形上面有效果如高原等，只靠原来的四个顶点不可能实现，因此通过分段，这样这个几何体上就会有很多的顶点，通过移动各个顶点，就会形成很多细节的地形。

我们可以试试效果：

```js
const geometry = new THREE.BoxGeometry(1, 1, 1, 2, 2, 2);
const material = new THREE.MeshBasicMaterial({
	color: 0xff0000,
	wireframe: true,
});
```

给材质加上`wireframe`配置，你会看到划分的三角形：

![image-20250130170656638](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250130170656638.png)

#### 缓冲几何体 BufferGeometry

在了解 BufferGeometry 之前，我们需要知道如何存储一个几何体，很简单，我们只需要通过存储顶点就知道整个几何体的构成。

因此我们通过`Float32Array`来存储：

```js
const positionsArray = new Float32Array(9);

positionsArray[0] = 0;
positionsArray[1] = 0;
positionsArray[2] = 0;

positionsArray[3] = 0;
positionsArray[4] = 1;
positionsArray[5] = 0;

positionsArray[6] = 1;
positionsArray[7] = 0;
positionsArray[8] = 0;
```

每三个一组，分别对应一个顶点的 x、y、z 数据，总共三个顶点。当然这个代码有点多，我们可以通过直接一个数组：

```js
const positionsArray = new Float32Array([
	0,
	0,
	0, // 第一个顶点
	0,
	1,
	0, // 第二个顶点
	1,
	0,
	0, // 第三个顶点
]);
```

接下来通过`BufferAttribute`创建属性，指定每个顶点接受的值数量：

```js
const positionsAttribute = new THREE.BufferAttribute(positionsArray, 3);
```

接下来就是创建缓冲几何体，将属性发送到该几何体并设置为 position：

```js
const geometry = new THREE.BufferGeometry();
geometry.setAttribute('position', positionsAttribute);
```

最后我们会呈现出一个三角形：

![image-20250130172329036](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250130172329036.png)

上面的设置属性，`position`换成别的就不显示了，因为它最后会被着色器读取，当然这个着色器是 Three 是自己内置的。

当然这只是一个，接下来我们创建多个：

```js
const geometry = new THREE.BufferGeometry();

const count = 50;
const positionsArray = new Float32Array(count * 3 * 3);

for (let i = 0; i < count * 3 * 3; i++) {
	positionsArray[i] = (Math.random() - 0.5) * 4;
}

const positionsAttribute = new THREE.BufferAttribute(positionsArray, 3);

geometry.setAttribute('position', positionsAttribute);
```

最后运行如下：

![image-20250130182944690](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250130182944690.png)

我们也可以修改 count 的数量，比如 5000：

![image-20250130183043777](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250130183043777.png)

### Debug UI

我们创建物体的时候，会有很多数值需要调整，如果每次自己调整然后去查看浏览器，这样会比较麻烦且费劲。

我们可以使用一些调试 UI 工具，帮助我们快速调整属性，下面列出一些：

- dat.GUI => 已经不在更新，可替换为 lil-gui
- control-panel
- ControlKit
- Guify
- Oui

下面我们使用 lil-gui，它可以帮助我们快速找到场景的属性值，如相机的位置，调整方向，颜色等等。

将之前的项目还原到初始，然后记得安装`gsap`库和` lil-gui`库：

```js
npm i gsap lil-gui
```

#### 初始化 gui

在项目中引入，并初始化：

```js
import GUI from 'lil-gui';

/**
 * GUI
 */
const gui = new GUI();
```

保存，随后就会看到右上角出现一个东西：

![image-20250131131853659](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250131131853659.png)

目前它还是空的，但我们可以往里面添加很多东西，然后进行微调

#### 添加 mesh 的 y 轴

我们先添加网格的 position 的 y 轴：

```js
// Debug
gui.add(mesh.position, 'y');
```

然后页面上右上角就会出现这个属性，我们可以输入改变值：

![image-20250131132507069](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250131132507069.png)

但输入数字不是很实用，因此我们可以调整为最小和最大数值并设置 step：

```js
gui.add(mesh.position, 'y', -1, 1, 0.01);
```

这样调整的时候就可以拖动改变，可以更加精细的调整：

![image-20250131132722737](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250131132722737.png)

如果使用`dat.GUI`也一样，只是样式可能不同，我们可以加上另外两个轴

```js
gui.add(mesh.position, 'y', -1, 1, 0.01);
gui.add(mesh.position, 'x', -1, 1, 0.01);
gui.add(mesh.position, 'z', -1, 1, 0.01);
```

![image-20250131133028532](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250131133028532.png)

当然这个也不一定要放到参数，还可以通过方法添加，如下：

```js
gui.add(mesh.position, 'y').min(-3).max(3).step(0.01);
```

这样更直观并且后续有些方法可以链式调用，因为有些不能放进 add 中

#### 控制属性的名字

目前这个属性在 Debug UI 上就叫 y，我们可以通过 name 方法改变名字：

```js
gui.add(mesh.position, 'y').min(-3).max(3).step(0.01).name('elevation');
```

这样上面显示的就是这个了：

![image-20250131133606672](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250131133606672.png)

#### 控制布尔值

我们还可以控制布尔值，mesh 上有一个 visible 可见的布尔值属性：

```js
gui.add(mesh, 'visible');
```

然后你会看到一个 checkbox，我们如果取消勾选，mesh 就不可见了：

![image-20250131133920463](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250131133920463.png)

#### 控制线框模式

我们尝试控制一下物体的材质 Material：

```js
gui.add(material, 'wireframe');
// gui.add(mesh.material, 'wireframe'); 这个也可以访问
```

这也是一个布尔值，选择勾选会切换到线框模式：

![image-20250131134112585](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250131134112585.png)

#### 控制颜色

控制颜色就不在使用`add`方法了，我们使用`addColor`方法，因为你传如`0x00ff00`的字符串，计算机会认为这是数字，`add`就会认为这是一个区间，所以需要单独的一个方法`addColor`：

```js
gui.addColor(material, 'color');
```

##### 老版本 threejs 问题

请确保 three 的版本是最新的，因为老版本我们访问`material.color`它的结果是一个类，而`addColor`需要传入对象，如果是老版本的 threejs，则需要自己创建一个对象然后将其放入 gui，最后手动更新 material：

```js
// threejs新版本 0.172.0无需查看这段
const parameters = {
	color: 0xff0000,
};
gui.addColor(parameters, 'color').onChange(() => {
	material.color.set(parameters.color);
});
```

新版本 three 无需在意上面的，保存查看，我们可以改变物体的材质颜色：

![image-20250131135132572](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250131135132572.png)

#### 控制函数执行

我们还可以给 UI 加上函数执行，记得`add`的第一个参数是一个对象：

```js
const obj = {
	spin: () => {
		gsap.to(mesh.rotation, {
			duration: 1,
			y: mesh.rotation.y + 10,
		});
	},
};
gui.add(obj, 'spin');
```

然后保存，点击右上角的 spin 按钮，物体就会旋转：

![image-20250131135840074](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250131135840074.png)

你可以根据需要随时添加属性，建议在写项目的过程中就顺便添加，如果打算在完成之后添加所有，那将会花费更多的时间去查看之前的属性。

### Textures 纹理

本节聊聊 Textures 纹理，它覆盖在几何体的表面。纹理分很多，常见如下：

- Albedo：反照率纹理，就是直接应用到几何体上的颜色
- Alpha：透明纹理，灰度图像，白色可见，黑色不可见
- Displacement：位移纹理，灰度图像，用于移动顶点，白色顶点上升，黑色顶点下降，灰色顶点不动（通过它可以创建地形这种）
- Normal：法线纹理，可以增加细节，用于光影光照效果，顶点固定
- AmbientOcclusion：环境光遮蔽纹理，他会在缝隙中加入假阴影，增加细节
- Metalenss：金属纹理，灰度图像，创造反射的效果
- Roughness：粗糙纹理，灰度图像，类似粗糙质感，涉及光的散射（比如地毯几乎不反光很粗糙）

这些纹理遵循 PBR，即基于物理的渲染，它们基于现实的算法模型，从而获取逼真的效果，大部分建模软件如 Blender 也遵循 PBR，Three 也是，这意味着你们使用相同的纹理效果渲染结果都会是一样的。

#### 加载纹理

纹理其实就是图片，我们如何在项目加载图片呢？一般使用 Vite 可以直接引入图片，它会自己加载图片的 url：

```js
import image from './1.png';
```

当然更简单的是放入 public，它会自动拥有一个 url，在你启动的本地服务器加入对应的路径即可加载，注意不需要加上 public，如下：

![image-20250131144834324](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250131144834324.png)

这样我们就可以在代码中直接加载图片，先使用原生 JavaScript：

```js
const image = new Image();
image.onload = () => {
	console.log('image loaded');
};
image.src = '/textures/door/color.jpg';
```

这样就是成功加载了图片，然后就可以加载纹理了：

```js
image.onload = () => {
	const texture = new THREE.Texture(image);
	console.log(texture);
};
```

打印就可以看到纹理：

![image-20250131145505202](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250131145505202.png)

不过我们无法在作用域外访问它，可以修改一下，将其放到外部：

```js
const texture = new THREE.Texture(image);
image.onload = () => {
	texture.needsUpdate = true;
};
```

这样就是告诉 Three 需要更新纹理，然后将其应用到材质中：

```js
const material = new THREE.MeshBasicMaterial({ map: texture });
```

保存，就可以看到纹理应用到上面了：

![image-20250131145955322](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250131145955322.png)

#### 纹理加载器

上面的原生方法不错，接下来我们使用 Three 自带的纹理加载器，更简单：

```js
const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load('/textures/door/color.jpg');
```

它还可以加载多个纹理，并且拥有几个函数：

```js
const texture = textureLoader.load(
	'/textures/door/color.jpg',
	() => {
		console.log('loaded');
	},
	() => {
		console.log('progess');
	},
	() => {
		console.log('error');
	},
);
```

不过不建议使用 progress，它基本不起作用，我也不懂咋用，后续会介绍大文件的进度条替代方案。

#### LoadingManger

LoadingManger 是为了实现资源共享，目前我们只有纹理加载器，后续可能有模型，字体等加载器，我们希望明确这些加载的相关事件，通过它可以统一管理这些加载器：

```js
const loadingManager = new THREE.LoadingManager();
const textureLoader = new THREE.TextureLoader(loadingManager);
```

只需要创建后，在每个加载器中加入参数即可，它还有几个函数：

```js
loadingManager.onStart = () => {
	console.log('onStart');
};
loadingManager.onLoad = () => {
	console.log('onLoad');
};
loadingManager.onProgress = () => {
	console.log('onProgress');
};
loadingManager.onError = () => {
	console.log('onError');
};
```

#### 加载多个纹理

我们加载一下刚刚说到的几个纹理，命名一下：

```js
const colorTexture = textureLoader.load('/textures/door/color.jpg');
const alphaTexture = textureLoader.load('/textures/door/alpha.jpg');
const heightTexture = textureLoader.load('/textures/door/height.jpg');
const normalTexture = textureLoader.load('/textures/door/normal.jpg');
const ambientOcclusionTexture = textureLoader.load(
	'/textures/door/ambientOcclusion.jpg',
);
const metalnessTexture = textureLoader.load('/textures/door/metalness.jpg');
const roughnessTexture = textureLoader.load('/textures/door/roughness.jpg');
```

加载后，会看到控制台有 7 个 onProgress：

![image-20250131151527809](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250131151527809.png)

#### UV 展开

当你使用不同的几何体去加载这个纹理，你可能会发现拉伸，重复等，这是因为 Three 通过 UV 展开来加载纹理。

UV 展开就像打开立方体的表面，你得到一个方形，如下：

![image-20250131152047142](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250131152047142.png)

展开后你就会得到一个 UV 坐标系，每个坐标代表一个顶点。

我们可以通过方法查看这个 uv 坐标：

```js
console.log(geometry.attributes.uv);
```

和我们之前的展示的 Buffer 几何体存储的其实一样的：

![image-20250131152258281](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250131152258281.png)

纹理就会通过 UV 坐标将图片应用到几何体上。

#### 纹理变换

##### 重复

我们可以重复纹理：

```js
colorTexture.repeat.x = 2;
colorTexture.repeat.y = 3;
```

还可以这样重复整个贴图：

```js
colorTexture.wrapS = THREE.RepeatWrapping;
colorTexture.wrapT = THREE.RepeatWrapping;
```

也可以选择镜像重复贴图

```js
colorTexture.wrapS = THREE.MirroredRepeatWrapping;
colorTexture.wrapT = THREE.MirroredRepeatWrapping;
```

##### 偏移

我们还可以使用偏移：

```js
colorTexture.offset.x = 0.5;
colorTexture.offset.y = 0.5;
```

##### 旋转

也支持旋转，π 等于半圈

```js
colorTexture.rotation = Math.PI * 0.25;
```

它可以支持哪个顶点旋转：

```js
colorTexture.center.x = 0.5;
colorTexture.center.y = 0.5;
```

#### 滤镜和 MIP 映射

MIP 映射就是创建映射面，每次是之前的一半，直到 1\*1，GPU 会根据可见像素运用不同的版本，所以有可能你放大观察会有模糊的效果。

当纹理像素比渲染像素小，比如你缩小立方体，它会调用**缩小滤镜**，默认采用**线性滤镜**，我们可以改变这个滤镜，换为**最近邻滤镜**如下：

```js
colorTexture.minFilter = THREE.NearestFilter;
```

我们可以换一个纹理：

```js
const colorTexture = textureLoader.load('/textures/checkerboard-1024x1024.png');
```

当你放大，会看到各个小方块：

![image-20250131155509577](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250131155509577.png)

当你缩小，就会产生奇怪的现象，它叫摩尔纹：

![image-20250131155532790](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250131155532790.png)

当纹理图片不够大，你放大的时候，渲染时像素被拉伸，是因为调用了**放大滤镜**，我们可以换一个纹理：

```js
const colorTexture = textureLoader.load('/textures/checkerboard-8x8.png');
```

你会明显的看到模糊效果：

![image-20250131155858043](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250131155858043.png)

要解决就和上面一样，调用`magFilter`：

```js
colorTexture.magFilter = THREE.NearestFilter;
```

对比一下，这样就没有模糊了，非常的锐利：

![image-20250131160116605](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250131160116605.png)

这种需要根据你项目的需要调整，我们可以加载一个 mc 的钻石块纹理：

```js
const colorTexture = textureLoader.load('/textures/minecraft.png');
```

可以看到很清晰：

![image-20250131160351526](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250131160351526.png)

如果我们换成线性，即注释掉刚刚的那行滤镜改变，就会非常模糊：

![image-20250131160441483](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250131160441483.png)

当我们设置了`minFilter`和`magFilter`时，我们就应该让 Three 不再生成 MIP 映射了，这样可以提高性能：

```js
colorTexture.generateMipmaps = false;
```

#### 格式和优化

创建纹理或者从网上获取纹理时，我们需要注意三个点：

- 纹理文件大小
- 纹理的大小即分辨率
- 嵌入纹理的数据

用户加载网站需要下载纹理文件，因此尽量让文件体积小，你可以通过 TinyPNG 网站压缩图片，不过压缩后图片可能会变化可以调试看看。

当纹理越小即分辨率越小，文件越轻，GPU 压力越小，尽量提供小的纹理

注意使用 MIP 映射时，图像相当于两倍的像素量，当我们使用它，我们需要能被 2 整除的纹理分辨率，如 512×512，因为 MIP 映射会一直除 2，如果不能被 2 整除，Three 会调整你的图像分辨率，这样效率更差且图片效果不好

当使用透明图像时，找到平衡点，是使用 png 或者两倍的 jpg，当使用法线纹理时，我们需要精确的数据，所以通常为 png 格式因为它是无损压缩，我们还可以将多个数据放到一个纹理中。

最后，如何寻找纹理，一般通过网络查找，可以通过下面网站：

- [poliigon.com](https://www.poliigon.com)
- [3dtextures.me](https://www.3dtextures.me)
- [arroway-textures.ch](https://www.arroway-textures.ch)

当然还可以通过自己创建纹理，如通过`Substance Designer`，它通过节点创建纹理。

### Materials 材质

材质其实就是给几何体的每个可见像素上色，如果像素不可见它就不会工作。决定材质颜色的是通过着色器，目前我们只需要了解 Three 自带的着色器，无需自己编写。

#### 初始化

让我们将项目回到最开始，红色立方体也不需要，我们要从头创建网格和材质等：

```js
import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

// Sizes
const sizes = {
	width: window.innerWidth,
	height: window.innerHeight,
};

window.addEventListener('resize', () => {
	// Update size
	sizes.width = window.innerWidth;
	sizes.height = window.innerHeight;
	// Update camera
	camera.aspect = sizes.width / sizes.height;
	camera.updateProjectionMatrix();
	// Update Renderer
	renderer.setSize(sizes.width, sizes.height);
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.z = 3;
scene.add(camera);

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// Renderer
const renderer = new THREE.WebGLRenderer({
	canvas: canvas,
});

renderer.setSize(sizes.width, sizes.height);
renderer.render(scene, camera);
const tick = () => {
	// Update Controls
	controls.update();

	// Render
	renderer.render(scene, camera);

	// Call tick again on the next frame
	window.requestAnimationFrame(tick);
};

tick();
```

#### 创建基础

回到初始，然后创建材质和一个球体、一个平面和一个圆环：

```js
const material = new THREE.MeshBasicMaterial();

const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), material);
sphere.position.x = -1.5;

const plane = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), material);

const torus = new THREE.Mesh(
	new THREE.TorusGeometry(0.3, 0.2, 16, 32),
	material,
);
torus.position.x = 1.5;

scene.add(sphere, plane, torus);
```

保存后查看如下：

![image-20250131195710812](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250131195710812.png)

我们只用了一个材质，因此改变它就能改变所有，默认白色。

#### 添加动画

接下来我们添加上动画：

```js
const clock = new THREE.Clock();
const tick = () => {
	const elapsedTime = clock.getElapsedTime();

	// Update Objects
	sphere.rotation.y = 0.1 * elapsedTime;
	plane.rotation.y = 0.1 * elapsedTime;
	torus.rotation.y = 0.1 * elapsedTime;

	sphere.rotation.x = 0.15 * elapsedTime;
	plane.rotation.x = 0.15 * elapsedTime;
	torus.rotation.x = 0.15 * elapsedTime;

	// Update Controls
	controls.update();

	// Render
	renderer.render(scene, camera);

	// Call tick again on the next frame
	window.requestAnimationFrame(tick);
};

tick();
```

#### 加载纹理

接下来加上纹理：

```js
const textureLoader = new THREE.TextureLoader();

const doorColorTexture = textureLoader.load('textures/door/color.jpg');
const doorAlphaTexture = textureLoader.load('textures/door/alpha.jpg');
const doorAmbientOcclusionTexture = textureLoader.load(
	'textures/door/ambientOcclusion.jpg',
);
const doorHeightTexture = textureLoader.load('textures/door/height.jpg');
const doorNormalTexture = textureLoader.load('textures/door/normal.jpg');
const doorMetalnessTexture = textureLoader.load('textures/door/metalness.jpg');
const doorRoughnessTexture = textureLoader.load('textures/door/roughness.jpg');
```

#### 加载 matcap 和 gradient 纹理

```js
const matcapTexture = textureLoader.load('/textures/matcaps/1.png');
const gradientTexture = textureLoader.load('/textures/gradients/3.jpg');
```

#### MeshBasicMaterial 网格基础材质

显然`MeshBasicMaterial`是最基础的材质，不过还需介绍属性：

- `color`：颜色，传入字符串或颜色
- `map`：纹理，传入 Texture
- `wireframe`：线框模式，传入布尔值
- `transparent`：允许透明，传入布尔值
- `opacity`：透明度，需要设置`transparent`为 true
- `alphaMap`：设置`alpha`透明材质，也需设置允许透明
- `side`：侧面属性，允许三个值
  - `THREE.FrontSide`：默认值，能看到前侧
  - `THREE.BackSide`：能看到后侧
  - `THREE.DoubleSide`：前后都可以看到

#### MeshNormalMaterial 网格法线材质

接下来是网格法线材质，法线是信息，包含面向的方向等信息

```js
const material = new THREE.MeshNormalMaterial();
```

为什么需要法线，这和光的反射，散色有关，当你需要光照射这个物体的时候，它们之间的结果需要通过它来确定。

网格法线材质和基础材质属性差不多，新增一个属性：

- `flatShading`：是否使用平面着色，传入布尔值

效果如下，会看到渲染在上面的是一个个平面

![image-20250131202638621](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250131202638621.png)

网格法线材质一般用于调试法线纹理，可以直接看到法线纹理的效果，当然也可以直接使用，如果你喜欢这个颜色。

#### MeshMatcapMaterial 网格自由材质

`MeshMatcapMaterial`会利用法线作为参照，从纹理中选取正确的颜色：

```js
const material = new THREE.MeshMatcapMaterial({
	matcap: matcapTexture,
});
```

对比一下，这两个基本颜色是一样的：

![image-20250131203100979](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250131203100979.png)

这样我们模拟阴影和光，即便场景中无光。

当然，我们可以通过[matcaps](https://github.com/nidorx/matcaps)开源项目找到很多材质球，不过确保使用它们时有相应许可，或者可以自己使用 3D 软件制作。

#### MeshDepthMaterial 网格深度材质

`MeshDepthMaterial`如果靠近相机近点，它会将几何体涂抹成白色，如果靠远一些就会变黑，如下：

![image-20250131203741334](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250131203741334.png)

这非常适合做一些雾效或预处理，这可以做出类似寂静岭的效果。

#### Lights

后面我们会专门讲述光源，本节我们只需简单添加环境光：

```js
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 30);
pointLight.position.x = 2;
pointLight.position.y = 3;
pointLight.position.z = 4;
scene.add(pointLight);
```

刷新后看不到变化，因为光不对深度材质起作用，我们换一个材质

#### MeshLambertMaterial 网格朗伯材质

`MeshLambertMaterial`是一个对光有反应的材质：

```js
const material = new THREE.MeshLambertMaterial();
```

当我们运用它后，查看就会发现几何体被点亮了：

![image-20250131204716574](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250131204716574.png)

当然我们有一些新特性和光有关，不过不急，我们有更多的材质。

`MeshLambertMaterial`确实不错，不过拉近线条有点模糊

#### MeshPhongMaterial 网格冯氏材质

它和上面的差不多一样，不过刚刚的线条模糊就消失了，而且更加亮了，还会发现光反射：

```js
const material = new THREE.MeshPhongMaterial();
```

它唯一的缺点是性能不如`MeshLambertMaterial`，不过物体较小的时候性能不是问题。

###### shininess

它还有新属性`shininess`：材质的光泽度。

```js
material.shininess = 1000;
```

保存会发现更加亮了，他会增加光反射：

![image-20250131222200230](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250131222200230.png)

##### specular

你还可以改变它的高亮，它和颜色一样，必须是三色：

```js
material.specular = new THREE.Color(0xff0000);
```

保存会发现红色的光反射：

![image-20250131222425941](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250131222425941.png)

#### MeshToonMaterial 网格卡通材质

顾名思义，它是卡通风格的，可以直接用：

```js
const material = new THREE.MeshToonMaterial();
```

保存查看，立方体变成卡通风格的：

![image-20250131222632378](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250131222632378.png)

##### 渐变控制

我们可以通过渐变控制它：

```js
material.gradientMap = gradientTexture;
```

保存查看会发现没有卡通风格了，因为我们的纹理很小，所以 MIP 映射会出现问题，解决的方法就是之前讲过的使用最近邻滤镜：

```js
gradientTexture.minFilter = THREE.NearestFilter;
gradientTexture.magFilter = THREE.NearestFilter;
gradientTexture.generateMipmaps = false;
```

重新查看：

![image-20250131223531663](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250131223531663.png)

#### MeshStandardMaterial 网格标准材质

网格标准材质经常使用，它支持光反应，且更逼真，遵循 PBR 规则，可以调整粗糙度和金属度，两个属性的范围为 0-1：

```js
const material = new THREE.MeshStandardMaterial();
material.metalness = 1;
material.roughness = 0.65;
```

保存查看：

![image-20250131223919781](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250131223919781.png)

当然它也支持纹理`map`，这里就不贴图了。

```js
material.map = doorColorTexture;
```

##### Debug UI

属性调整不容易方便我们调试，我们创建一个 Debug UI：

```js
import GUI from 'lil-gui';

const gui = new GUI();

// ...在Material之后
gui.add(material, 'metalness').min(0).max(1).step(0.0001);
gui.add(material, 'roughness').min(0).max(1).step(0.0001);
```

##### aoMap

它也支持环境遮蔽纹理，它可以增加阴影效果，但支持它需要提供另一组 UV 坐标：

```js
material.aoMap = doorAmbientOcclusionTexture;
sphere.geometry.setAttribute(
	'uv2',
	new THREE.BufferAttribute(sphere.geometry.attributes.uv.array, 2),
);
plane.geometry.setAttribute(
	'uv2',
	new THREE.BufferAttribute(plane.geometry.attributes.uv.array, 2),
);
torus.geometry.setAttribute(
	'uv2',
	new THREE.BufferAttribute(torus.geometry.attributes.uv.array, 2),
);
```

这样看起来缝隙处有着阴影更加逼真：

![image-20250131225654046](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250131225654046.png)

我们可以设置 ao 映射强度，并放入到 Debug UI：

```js
material.aoMapIntensity = 1;

gui.add(material, 'aoMapIntensity').min(0).max(10).step(0.0001);
```

![image-20250131230021055](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250131230021055.png)

##### displacementMap 置换贴图

我们还可以设置置换贴图其实就是位移或高度纹理：

```js
material.displacementMap = doorHeightTexture;
```

当然看起来很乱，我们慢慢修正：

![image-20250131230253683](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250131230253683.png)

首先因为我们的顶点不够，所以有些没有顶起来：

```js
const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 64, 64), material);
const plane = new THREE.Mesh(new THREE.PlaneGeometry(1, 1, 100, 100), material);
const torus = new THREE.Mesh(
	new THREE.TorusGeometry(0.3, 0.2, 64, 128),
	material,
);
```

然后这个效果太强了，我们需要减少一些：

```js
material.displacementScale = 0.05;
```

通过这个属性调整后，能看到一些凸起：

![image-20250131230658884](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250131230658884.png)

可以放入 Debug UI 慢慢调试：

```js
gui.add(material, 'displacementScale').min(0).max(1).step(0.0001);
```

##### metalnessMap 和 roughnessMap

金属度和粗糙度纹理也可以加载：

```js
material.metalnessMap = doorMetalnessTexture;
material.roughnessMap = doorRoughnessTexture;
```

记得把上面的属性注释了，它们会相互影响。

##### normalMap 法线贴图

法线纹理自然也可以加载：

```js
material.normalMap = doorNormalTexture;
```

质感不错很逼真：

![image-20250131231224825](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250131231224825.png)

还可以调整法线比例：

```js
material.normalScale.set(0.5, 0.5);
```

##### alphaMap 透明度贴图

我们还可以加载透明度纹理：

```js
material.transparent = true; // 前置
material.alphaMap = doorAlphaTexture;
```

看起来不错：

![image-20250131231633053](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250131231633053.png)

#### MeshPhysicalMaterial 网格物理材质

它和标准材质基本一样，但增加了一层透明图层，更加逼真。

看你的项目需要，如果不需要不建议使用它，性能压力高。

#### PointsMaterial 点材质

点材质后续会有专门的章节讲解，现在不急

#### ShaderMaterial 和 RawShaderMaterial

着色器材质和原始着色器材质会在专门的着色器章节讲解，但需要创建自己的材质的时候使用

#### EnvironmentMap 环境贴图

现在我们可以使用一个很酷的东西，环境贴图，它可以提供场景外的贴图，既可以给光亮也可以反射，我们可以使用一下。

我们首先把材质的都注释，只保留金属度和粗糙度：

```js
const material = new THREE.MeshStandardMaterial();
material.metalness = 0.7;
material.roughness = 0.2;
```

加载环境贴图方法很多，Three 支持立方体环境贴图，我们需要通过`CubeTextureLoader`加载立方体纹理：

```js
const cubeTextureLoader = new THREE.CubeTextureLoader();
// ...
const environmentMapTexture = cubeTextureLoader.load([
	'textures/environmentMaps/0/px.jpg', // 正x
	'textures/environmentMaps/0/nx.jpg', // 负x
	'textures/environmentMaps/0/py.jpg', // 正y
	'textures/environmentMaps/0/ny.jpg', // 负y
	'textures/environmentMaps/0/pz.jpg', // 正z
	'textures/environmentMaps/0/nz.jpg', // 负z
]);
```

然后给材质的`envMap`属性赋值它即可使用：

```js
material.envMap = environmentMapTexture;
```

Debug UI 调整一下粗糙度可以直接看到环境反射到立方体上：

![image-20250131232919265](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250131232919265.png)

当然如何寻找环境贴图，首先除非是个人项目否则确保你可以商用，你可以通过如[Poly Haven](https://polyhaven.com/)寻找然后下载：

![image-20250131233357584](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250131233357584.png)

下载后它是一张环境，而我们之前是立方体的 6 个贴图，然后你可以通过[HDRI-to-CubeMap](https://matheowis.github.io/HDRI-to-CubeMap)这个来上传贴图，它可以将其变为立方体贴图：

![image-20250131233700727](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250131233700727.png)

点击 save 即可保存下载，选择一下方向即可：

![image-20250131233824655](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250131233824655.png)

本节材质就到这里了

### 3D Text

本节我们将实现类似 3D 字体的效果。

#### 字体样式

Three 提供了字体立方体，但我们需要提供字体样式，如何获取它呢？

- 可以自己转换，使用[facetype.js](https://gero3.github.io/facetype.js/)上传字体转换
- 另一种方法是使用 Three 自带的，在`three/examples/fonts/`中

我们使用自带的`helvetiker_regular.typeface.json`，复制到`static`中的`fonts`文件夹，接下来我们加载

#### FontLoader

Three 提供了类似纹理一样的加载器，字体加载器`FontLoader`，使用即可：

```js
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
// ...
const fontLoader = new FontLoader();
fontLoader.load(
	'/fonts/helvetiker_regular.typeface.json',
	() => {
		console.log('loaded');
	},
	() => {
		console.log('progress');
	},
	() => {
		console.log('error');
	},
);
```

#### TextGeometry

我们只需要第一个 loaded，然后通过`TextGeometry`创建立方体：

```js
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
// ...
const fontLoader = new FontLoader();
fontLoader.load('/fonts/helvetiker_regular.typeface.json', (font) => {
	const textGeometry = new TextGeometry('Hello Three.js', {
		font: font, // 字体
		size: 0.5, // 字体大小
		depth: 0.2, // 厚度或者深度
		curveSegments: 12, // 圆弧分段数
		bevelEnabled: true, // 是否有边缘即斜面
		bevelThickness: 0.03, // 边缘厚度
		bevelSize: 0.02, // 边缘大小
		bevelOffset: 0, // 边缘偏移
		bevelSegments: 5, // 边缘分段数
	});
	const textMaterial = new THREE.MeshBasicMaterial();
	const textMesh = new THREE.Mesh(textGeometry, textMaterial);
	scene.add(textMesh);
});
```

保存后就可以看到字体了：

![image-20250201134104501](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250201134104501.png)

#### 去除立方体和调整相关

我们把下面的立方体去掉，你还可以开启线框模式查看：

```js
textMaterial.wireframe = true;
```

可以看到三角形有点多：

![image-20250201134423761](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250201134423761.png)

我们需要优化一下性能，让圆弧的三角形减少点，这两个参数调整：

```js
curveSegments: 5, // 圆弧分段数
bevelSegments: 4, // 边缘分段数
```

然后文字打开不在中间，我们需要让他居中，可以开启轴辅助工具确认：

```js
// Axes helper
const axesHelper = new THREE.AxesHelper(2);
scene.add(axesHelper);
```

可以看到 z 应该朝向我们，x 朝向右边了：

![image-20250201134847499](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250201134847499.png)

#### 边界

我们需要让文字居中，可以使用边界方法，边界就是立方体所占据的空间，Three 提供了方法可以计算立方体的边界，需要注意先计算再访问，不计算是 null

```js
textGeometry.computeBoundingBox();
console.log(textGeometry.boundingBox);
```

它其实就是坐标，通过它我们就可以知道文本的大小，然后移动一半即可：

```js
textGeometry.translate(
	-textGeometry.boundingBox.max.x * 0.5,
	-textGeometry.boundingBox.max.y * 0.5,
	-textGeometry.boundingBox.max.z * 0.5,
);
```

虽然看起来居中，不过因为我们上面参数加上了厚度，还需减掉这块：

```js
textGeometry.translate(
	-(textGeometry.boundingBox.max.x - 0.02) * 0.5,
	-(textGeometry.boundingBox.max.y - 0.02) * 0.5,
	-(textGeometry.boundingBox.max.z - 0.03) * 0.5,
);
textGeometry.computeBoundingBox();
console.log(textGeometry.boundingBox);
```

我们重新计算，然后查看结果，值基本相反就证明基本居中了：

![image-20250201140301237](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250201140301237.png)

#### center

当然边界盒子的方法好复杂，我们只是练习一下，还有更简单的方法：

```js
textGeometry.center();
```

Three 提供了这个方法，让我们更加方便操作了。

#### MeshMatcapMaterial

为了让文字更好看，我们可以使用`MeshMatcapMaterial`材质渲染：

```js
const textureLoader = new THREE.TextureLoader();
const matcapTexture = textureLoader.load('/textures/matcaps/1.png');
// ...
const textMaterial = new THREE.MeshMatcapMaterial({
	matcap: matcapTexture,
});
```

记得删除线框模式，保存查看，不错，随后可以把轴辅助线删除了

![image-20250201140923825](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250201140923825.png)

#### 添加甜甜圈即环形立方体

我们在它周围添加多个甜甜圈，然后随机移动它：

```js
for (let i = 0; i < 100; i++) {
	const dountGeometry = new THREE.TorusGeometry(0.3, 0.2, 20, 45);
	const dountMaterial = new THREE.MeshMatcapMaterial({
		matcap: matcapTexture,
	});
	const dountMesh = new THREE.Mesh(dountGeometry, dountMaterial);
	dountMesh.position.x = (Math.random() - 0.5) * 10;
	dountMesh.position.y = (Math.random() - 0.5) * 10;
	dountMesh.position.z = (Math.random() - 0.5) * 10;
	scene.add(dountMesh);
}
```

然后我们调整一下旋转角度，要不然朝向一致了：

```js
dountMesh.rotation.x = Math.random() * Math.PI;
dountMesh.rotation.y = Math.random() * Math.PI;
```

然后调整一下缩放，让它们大小随机：

```js
const scale = Math.random();
dountMesh.scale.set(scale, scale, scale);
```

值得注意的是，不要如下的操作：

```js
dountMesh.scale.x = Math.random();
dountMesh.scale.y = Math.random();
dountMesh.scale.z = Math.random();
```

因为这样就不是等比缩放，会让甜甜圈长的很奇怪，我们需要让 x、y、z 缩放固定

![image-20250201141918835](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250201141918835.png)

#### 优化性能

上面看起来不错，不过耗时还是挺多的，你可以使用`console.time`和`console.timeEnd`计算甜甜圈的生成时间，还是很久的。

我们需要改进一下，将几何体和材质放到外部，因为它们是一样的：

```js
const dountGeometry = new THREE.TorusGeometry(0.3, 0.2, 20, 45);
const dountMaterial = new THREE.MeshMatcapMaterial({
	matcap: matcapTexture,
});

for (let i = 0; i < 100; i++) {
	// ...
}
```

这样就不会重复创建同一个材质和立方体了，同时我们发现甜甜圈和文字用的是一个材质，我们也可以优化：

```js
const material = new THREE.MeshMatcapMaterial({
	matcap: matcapTexture,
});
// ...
const textMesh = new THREE.Mesh(textGeometry, material);
// ...
for (let i = 0; i < 100; i++) {
	const dountMesh = new THREE.Mesh(dountGeometry, material);
}
```

查看，确实不错！

![image-20250201142553719](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250201142553719.png)

### Lights 灯光

之前我们已经简单的使用过灯光，本节我们详细聊聊。

#### 初始化

下面是初始代码：

```js
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
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

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 50);
pointLight.position.x = 2;
pointLight.position.y = 3;
pointLight.position.z = 4;
scene.add(pointLight);

/**
 * Objects
 */
// Material
const material = new THREE.MeshStandardMaterial();
material.roughness = 0.4;

// Objects
const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), material);
sphere.position.x = -1.5;

const cube = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.75, 0.75), material);

const torus = new THREE.Mesh(
	new THREE.TorusGeometry(0.3, 0.2, 32, 64),
	material,
);
torus.position.x = 1.5;

const plane = new THREE.Mesh(new THREE.PlaneGeometry(5, 5), material);
plane.rotation.x = -Math.PI * 0.5;
plane.position.y = -0.65;

scene.add(sphere, cube, torus, plane);

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

	// Update objects
	sphere.rotation.y = 0.1 * elapsedTime;
	cube.rotation.y = 0.1 * elapsedTime;
	torus.rotation.y = 0.1 * elapsedTime;

	sphere.rotation.x = 0.15 * elapsedTime;
	cube.rotation.x = 0.15 * elapsedTime;
	torus.rotation.x = 0.15 * elapsedTime;

	// Update controls
	controls.update();

	// Render
	renderer.render(scene, camera);

	// Call tick again on the next frame
	window.requestAnimationFrame(tick);
};

tick();
```

你可以先移除灯光部分，我们会详细讲解这块。

#### AmbitionLight 环境光

首先是环境光，创建它需要`AmbitionLight`实例，第一个参数是颜色，第二个参数是灯光亮度：

```js
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
// 也可以不传参数使用属性的方式设置
scene.add(ambientLight);
```

保存后能显示了，不过由于光线是均匀分布的因此立方体并不显眼

![image-20250201164035977](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250201164035977.png)

我们也可以将属性加入到 gui 用于调试：

```js
gui.add(ambientLight, 'intensity').min(0).max(1).step(0.01);
```

#### DirectionalLight 方向光

我们可以通过`DirectionalLight`创建定向光：

```js
const directionalLight = new THREE.DirectionalLight(0x00ffff, 0.3);
scene.add(directionalLight);
```

保存后会发现就像从上面照下来光一样：

![image-20250201164238927](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250201164238927.png)

参数和环境光一样，但我们要换方向呢？其实就是调整位置：

```js
directionalLight.position.set(1, 0.25, 0);
```

很明显的看到它改变方向了：

![image-20250201164457499](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250201164457499.png)

这点在用于阴影的时候还是很有用的。

#### HemisphereLight 半球型灯光

我们通过`HemisphereLight`创建半球型的灯光：

```js
const hemisphereLight = new THREE.HemisphereLight(0xff0000, 0x0000ff, 0.3);
scene.add(hemisphereLight);
```

然后把其他两个添加光先注释一下，先看上面是红色：

![image-20250201164922189](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250201164922189.png)

再看下面是蓝色：

![image-20250201164948506](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250201164948506.png)

中间颜色是它们混合颜色有点像紫色：

![image-20250201165029432](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250201165029432.png)

现在我们就懂了，第一个参数颜色光从上方射出，第二个参数颜色光从下方射出，中间部分会混合在一起。

之前的注释可以恢复了。

#### PointLight 点光

我们可以通过`PointLight`创建点光：

```js
const pointLight = new THREE.PointLight(0xff9000, 0.5);
scene.add(pointLight);
```

我们会很明显看到一个小光源在照亮：

![image-20250201165439687](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250201165439687.png)

当然我们还可以改变这个点光源的位置：

```js
pointLight.position.set(1, -0.5, 1);
```

这样就非常明显看到了：

![image-20250201165636071](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250201165636071.png)

当然`PointLight`还有两个属性：

- `distance`：距离，即光能照射的距离，超过就没有光了
- `decay`：衰减，即光衰减的速度

#### RectAreaLight 矩形区域光

我们可以通过`RectAreaLight`创建矩形区域的光：

```js
const rectAreaLight = new THREE.RectAreaLight(0x4e00ff, 2, 1, 1);
scene.add(rectAreaLight);
```

多出的两个参数就是`width`和`height`即宽度和高度。

很明显的看到一个矩形区域的光在照射：

![image-20250201170154375](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250201170154375.png)

它有点像摄影棚里面的灯光照射，会往外扩散但主要朝向一个位置

我们可以调整一下，把其他几个光注释一下，这样明显多了：

![image-20250201170324622](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250201170324622.png)

不过需要注意，该光源只能在`MeshStandardMaterial`和`MashPhysicalMaterial`两个材质中工作，如果你使用其他材质它不会生效。

我们也可以改变灯光位置和调整方向(利用 lookAt 定位）：

```js
rectAreaLight.position.set(-1.5, 0, 1.5);
rectAreaLight.lookAt(new THREE.Vector3());
```

#### SpotLight 聚光灯

我们可以通过`SpotLight`创建聚光灯，就像手电筒一样：

```js
const spotLight = new THREE.SpotLight('orange', 10, 10, Math.PI * 0.1, 0.25, 1);
spotLight.position.set(0, 2, 3);
scene.add(spotLight);
```

前两个参数一样，解释一下另外几个参数：

- `distance`：光能照射到的距离，距离越近越亮
- `angle`：光的照射角度
- `penumbra`：边缘半影比例，如果为 0 边缘就会很清晰
- `decay`：光的衰减效果

查看，很明显的一个聚光灯效果：

![image-20250201184437193](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250201184437193.png)

当然我们也可以调整位置，不过这次需要通过`target`：

```js
scene.add(spotLight.target);
spotLight.target.position.x = -0.75;
```

这样才能移动最终结果位置：

![image-20250201185048304](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250201185048304.png)

#### Performance 性能

加上灯光会影响性能，以上灯光的性能损耗如下举例可参考：

- 较低损耗：`AmbientLight`和`HemisphereLight`
- 中等损耗：`DirectionalLight`和`PointLight`
- 较高损耗：`SpotLight`和`RectAreaLight`

你可以根据项目需求选择好不同的灯光效果。

#### Bake

如果场景中需要移动，且有光照，我们更推荐通过 Bake 烘焙的方式，即将灯光、阴影和照明效果全部放入到纹理之中，这样能比添加光源更加节省性能和更容易开发。

#### Helper

光源定位可能是一件很难的事，Three 提供了`Helper`的方式来帮助我们：

```js
// Helpers
const hemisphereLightHelper = new THREE.HemisphereLightHelper(
	hemisphereLight,
	0.2,
);
scene.add(hemisphereLightHelper);

const directionalLightHelper = new THREE.DirectionalLightHelper(
	directionalLight,
	0.2,
);
scene.add(directionalLightHelper);

const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.2);
scene.add(pointLightHelper);

const spotLightHelper = new THREE.SpotLightHelper(spotLight);
scene.add(spotLightHelper);
```

保存查看，四个光源都定位显示了：

![image-20250201190542257](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250201190542257.png)

`RectAreaLight`比较特殊，单独引入一下：

```js
import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper.js';
// ...
const rectAreaLightHelper = new RectAreaLightHelper(rectAreaLight);
scene.add(rectAreaLightHelper);
```

成功显示出来：

![image-20250201190739940](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250201190739940.png)

### Shadows 阴影

上面讲解了灯光，那么光照过去应该出现阴影，本节就聊聊它。

#### 初始代码

先提供一下这小节的初始代码：

```js
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
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

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 1);
gui.add(ambientLight, 'intensity').min(0).max(3).step(0.001);
scene.add(ambientLight);

// Directional light
const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
directionalLight.position.set(2, 2, -1);
gui.add(directionalLight, 'intensity').min(0).max(3).step(0.001);
gui.add(directionalLight.position, 'x').min(-5).max(5).step(0.001);
gui.add(directionalLight.position, 'y').min(-5).max(5).step(0.001);
gui.add(directionalLight.position, 'z').min(-5).max(5).step(0.001);
scene.add(directionalLight);

/**
 * Materials
 */
const material = new THREE.MeshStandardMaterial();
material.roughness = 0.7;
gui.add(material, 'metalness').min(0).max(1).step(0.001);
gui.add(material, 'roughness').min(0).max(1).step(0.001);

/**
 * Objects
 */
const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), material);

const plane = new THREE.Mesh(new THREE.PlaneGeometry(5, 5), material);
plane.rotation.x = -Math.PI * 0.5;
plane.position.y = -0.5;

scene.add(sphere, plane);

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
```

打开，就会看到球有一部分阴影：

![image-20250201232221964](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250201232221964.png)

上面阴影即核心阴影，阴影总是 3D 的难题，使用 Blender 等软件涉及到光线追踪来实现，它非常耗时，因此我们需要性能优秀的方案，Three 有内置的实现，虽然它并不完美，但它简单且快速：

- 当你渲染时，Three 会为每个支持阴影的光源进行渲染
- 当渲染到光源时，Three 会将在位置放一个相机然后生成灯光渲染结果，材质会被替换为`MeshDepthMaterial`以便获取深度信息
- 灯光渲染结果存储在纹理，它被称为阴影纹理
- 阴影纹理可以运用到材质上，随后被投射到几何体

#### Start Shadows 启动阴影

要启用阴影，首先检查渲染器的属性`shadowMap.enabled`开启：

```js
renderer.shadowMap.enabled = true;
```

接下来就是看立方体是否可以接收阴影和投射阴影，我们需要让球投射阴影到平面上，因此球投射，平面接收：

```js
sphere.castShadow = true; // 投射阴影
// ...
plane.receiveShadow = true; // 接收阴影
```

接下来我们需要打开灯光阴影，需注意支持灯光阴影的只有如下：

- `PointLight`
- `DirectionalLight`
- `SpotLight`

#### 处理平行光阴影

处理一下我们的`DirectionalLight`：

```js
directionalLight.castShadow = true;
```

保存后，你立马就能看到平面上出现了球的投射阴影：

![image-20250201234252904](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250201234252904.png)

##### 优化平行光阴影

目前看着这个阴影还是有很多缺点，我们一步步来优化。

首先是优化渲染尺寸，因为阴影纹理贴图是有宽高的，因此可以调整

```js
directionalLight.shadow.mapSize.width = 1024;
directionalLight.shadow.mapSize.height = 1024;
```

请记住一定使用 2 的幂次值，涉及到 MIP 映射的原因。

接下来我们可以调整阴影的相机，平行光的相机是正交型的，你可以通过`shadow.camera`访问它的相关属性，我们需要找到近平面和远平面的最佳参数。

可以添加一个`CameraHelper`来帮助我们寻找：

```js
const directionalLightCameraHelper = new THREE.CameraHelper(
	directionalLight.shadow.camera,
);
scene.add(directionalLightCameraHelper);
```

蓝色是光源，绿色是近平面和远平面：

![image-20250201235714475](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250201235714475.png)

很明显的远平面太过遥远，近平面也可以稍微近点，调整一下：

```js
directionalLight.shadow.camera.near = 1;
directionalLight.shadow.camera.far = 6;
```

这样看起来不错：

![image-20250201235933676](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250201235933676.png)

##### Amplitude 振幅

从画出的线框可以看出，现在的纹理生成范围有点太大了，我们可以缩小一些，相机有左右上下的范围，调整一下：

```js
directionalLight.shadow.camera.top = 2;
directionalLight.shadow.camera.right = 2;
directionalLight.shadow.camera.bottom = -2;
directionalLight.shadow.camera.left = -2;
```

缩小了不少：

![image-20250202000518545](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250202000518545.png)

这样子不错了，我们可以将`CameraHelper`隐藏：

```js
directionalLightCameraHelper.visible = false;
```

##### 控制阴影模糊半径

我们还可以调整平行光的阴影半径：

```js
directionalLight.shadow.radius = 10;
```

这样它的边缘更模糊了：

![image-20250202000839518](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250202000839518.png)

#### 阴影算法

接下来说一下 Three 可用的几个阴影算法：

- `THREE.BasicShadowMap`：基础算法，性能好画质低
- `THREE.PCFShadowMap`：PCF 算法，默认采用，性能稍差画质不错
- `THREE.PCFSoftShadowMap`：比上面加上了软化效果
- `THREE.VSMShadowMap`：VSM 算法，性能较差，画质不错

你可以改变渲染器的`shadowMap.type`来选择使用哪个：

```js
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
```

注意，阴影半径在`PCFSoftShadowMap`不起作用，因此不模糊：

![image-20250202001330426](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250202001330426.png)

#### 处理聚光灯阴影

前面讲过聚光灯也支持阴影，让我们试试：

```js
const spotLight = new THREE.SpotLight(0xffffff, 5, 10, Math.PI * 0.3);

spotLight.castShadow = true;

spotLight.position.set(0, 2, 2);
scene.add(spotLight);
scene.add(spotLight.target);
```

为了明显点你可以降低前面两个的光强度，可以看到平面上的阴影：

![image-20250202002158940](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250202002158940.png)

我们可以加上`CameraHelper`辅助一下：

```js
const spotLightCameraHelper = new THREE.CameraHelper(spotLight.shadow.camera);
scene.add(spotLightCameraHelper);
```

不过这个混合阴影还是不太好看，因此建议不要多个光源产生阴影

##### 优化聚光灯阴影

和之前的一样，优化调整一下，注意聚光灯的相机是透视型相机，我们还需控制相机视野角度：

```js
spotLight.castShadow = true;
spotLight.shadow.mapSize.width = 1024;
spotLight.shadow.mapSize.height = 1024;
spotLight.shadow.camera.fov = 30; // 相机视锥体的角度
spotLight.shadow.camera.near = 1;
spotLight.shadow.camera.far = 6;
```

然后就可以隐藏辅助工具：

```js
spotLightCameraHelper.visible = false;
```

#### 处理点光阴影

接下来创建`PointLight`相关：

```js
const pointLight = new THREE.PointLight(0xffffff, 5);

pointLight.castShadow = true;

pointLight.position.set(-1, 1, 0);
scene.add(pointLight);
const pointLightCameraHelper = new THREE.CameraHelper(pointLight.shadow.camera);
scene.add(pointLightCameraHelper);
```

为了明显，我将前面的光强度都降低，能明显看到投影：

![image-20250202003728516](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250202003728516.png)

不过你会注意到点光源采用的是透视型相机，这是因为点光源会向各个方向散发光，因此通过透视相机将其放到不同方向(6 个)，最终来形成阴影。

##### 优化点光阴影

我们继续之前操作，优化：

```js
pointLight.shadow.mapSize.width = 1024;
pointLight.shadow.mapSize.height = 1024;
pointLight.shadow.camera.near = 0.1;
pointLight.shadow.camera.far = 5;
```

然后关闭辅助：

```js
pointLightCameraHelper.visible = false;
```

然后随便调整不同光的强度，可以看到三个阴影：

![image-20250202004409093](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250202004409093.png)

#### 预渲染阴影

很明显，制作阴影是件困难的事情，尤其在阴影过多的场景，解决的一大方法就是之前所说过的烘焙即预渲染，我们将阴影也放入纹理中，就不在需要实时阴影，我们可以试试。

首先我们需要禁止阴影渲染，这样就不需要注释之前的：

```js
directionalLight.castShadow = false;
spotLight.castShadow = false;
pointLight.castShadow = false;
renderer.shadowMap.enabled = false;
```

然后我们可以使用一下预渲染的纹理，图片如下：

![image-20250202004916893](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250202004916893.png)

加载一下这个纹理：

```js
const textureLoader = new THREE.TextureLoader();
const bakedShadow = textureLoader.load('textures/bakedShadow.jpg');
// ...
const plane = new THREE.Mesh(
	new THREE.PlaneGeometry(5, 5),
	new THREE.MeshBasicMaterial({
		map: bakedShadow,
	}),
);
```

然后保存，查看：

![image-20250202005519880](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250202005519880.png)

需要注意你移动球体后可能会看到奇怪的现象，因为它嵌在平面上。

#### 加载简单阴影纹理

还有一种解决方案是通过`alphaMap`然后将其渲染，如下：

![image-20250202005803481](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250202005803481.png)

我们将之前的材质恢复，然后加载这个纹理：

```js
const simpleShadow = textureLoader.load('textures/simpleShadow.jpg');
```

随后我们需要在球体下面创建阴影：

```js
const sphereShadow = new THREE.Mesh(
	new THREE.PlaneGeometry(1.5, 1.5),
	new THREE.MeshBasicMaterial({
		color: 0x000000,
		transparent: true, // 前置必须
		alphaMap: simpleShadow,
	}),
);
sphereShadow.rotation.x = -Math.PI * 0.5;
sphereShadow.position.y = plane.position.y + 0.01;

scene.add(sphereShadow);
```

保存查看，效果不错：

![image-20250202010252749](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250202010252749.png)

#### 加载动画

我们给这个球体加上动画，更酷炫：

```js
const tick = () => {
	const elapsedTime = clock.getElapsedTime();

	// Update sphere
	sphere.position.x = Math.cos(elapsedTime) * 1.5;
	sphere.position.z = Math.sin(elapsedTime) * 1.5;
	sphere.position.y = Math.abs(Math.sin(elapsedTime * 3));
	// ...
};
```

这样小球就跳动起来了！

![image-20250202010530078](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250202010530078.png)

不过我们还需更新阴影，他现在停在原地了：

```js
const tick = () => {
	//...

	// Update shadow
	sphereShadow.position.x = sphere.position.x;
	sphereShadow.position.z = sphere.position.z;
	sphereShadow.material.opacity = (1 - sphere.position.y) * 0.7;
	// ...
};
```

接近平面时，阴影变浓：

![image-20250202010857468](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250202010857468.png)

远离平面时，阴影变淡：

![image-20250202010939483](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250202010939483.png)

Great！我们完成了，当然你可以再控制一些细节，不过我们就到这吧。

### Haunted House 鬼屋例子制作

本小节我们来制作一个屋子的例子，同时巩固之前的知识。

#### 初始代码

如下：

```js
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Timer } from 'three/addons/misc/Timer.js';
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

/**
 * House
 */
// Temporary sphere
const sphere = new THREE.Mesh(
	new THREE.SphereGeometry(1, 32, 32),
	new THREE.MeshStandardMaterial({ roughness: 0.7 }),
);
scene.add(sphere);

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight('#ffffff', 0.5);
scene.add(ambientLight);

// Directional light
const directionalLight = new THREE.DirectionalLight('#ffffff', 1.5);
directionalLight.position.set(3, 2, -8);
scene.add(directionalLight);

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
camera.position.x = 4;
camera.position.y = 2;
camera.position.z = 5;
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
const timer = new Timer();

const tick = () => {
	// Timer
	timer.update();
	const elapsedTime = timer.getElapsed();

	// Update controls
	controls.update();

	// Render
	renderer.render(scene, camera);

	// Call tick again on the next frame
	window.requestAnimationFrame(tick);
};

tick();
```

其中`Timer`解释一下，它和`Clock`差不多，不过修复了一些 bug，通过`timer.update`手动更新，在切换 tab 的时候尤为明显，你可以用它代替`Clock`

#### 一些建议

在建造之前，我们需要明确单位，单位 1 在各个场景下可能不一样，比如在房子是 1m，城市是 1km，物体是 1cm，因此需要明确好。

#### 建造地板

我们首先创建地板即`floor`：

```js
// Floor
const floor = new THREE.Mesh(
	new THREE.PlaneGeometry(20, 20),
	new THREE.MeshStandardMaterial(),
);
scene.add(floor);
```

我们使用了网格标准材质，这是为了后续的逼真效果。接下来是调整，我们会发现地板的方向错了，需要调整一下：

```js
floor.rotation.x = -Math.PI * 0.5;
```

#### 分组

房子的立方体很多，因此我们建立 Group 方便后续如果需要统一调整：

```js
// House container
const house = new THREE.Group();
scene.add(house);
```

后续我们只需添加到`house`即可，而不需要添加到`scene`。

#### 建造 house

##### walls 墙壁

先建造墙壁`walls`：

```js
// Walls
const walls = new THREE.Mesh(
	new THREE.BoxGeometry(4, 2.5, 4),
	new THREE.MeshStandardMaterial(),
);
house.add(walls);
```

查看一下，起作用了：

![image-20250202165654650](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250202165654650.png)

不过有点矮，我们加高一些：

```js
walls.position.y += 1.25;
```

##### 可选提取

我们创建 walls 的时候立方体传入固定值，我们提取出去方便后续维护修改

```js
const houseMeasurements = {
	width: 4,
	height: 2.5,
	depth: 4,
};
//...
const walls = new THREE.Mesh(
	new THREE.BoxGeometry(
		houseMeasurements.width,
		houseMeasurements.height,
		houseMeasurements.depth,
	),
	new THREE.MeshStandardMaterial(),
);
```

当然如果觉得麻烦也可以选择不提取，自己可以选择喜好的。

##### Roof 屋顶

接下来是添加 Roof 屋顶，我们想要一个金字塔像样子的，不过你会搜索不到，不过我们可以使用圆锥体立方体，通过属性`raidaiSegments`为 4 即可得到，第三个参数就是这个属性：

```js
// Roof
const roof = new THREE.Mesh(
	new THREE.ConeGeometry(3.5, 1.5, 4),
	new THREE.MeshStandardMaterial(),
);
house.add(roof);
```

生成了不过位置不太对，调整一下：

```js
roof.position.y = 2.5 + 0.75;
```

2.5 是 walls 的高，那 0.75 呢？其实参考如下图就知道了：

![image-20250202171000602](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250202171000602.png)

我们需要往上加一些才能正好让底部贴着 walls，不过它还是有点歪歪的

![image-20250202171222000](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250202171222000.png)

我们需要旋转一下它，至于角度也容易，一般都是通过 π 来计算：

```js
roof.rotation.y = Math.PI * 0.25;
```

很不错，完美贴合：

![image-20250202171357168](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250202171357168.png)

##### Door 门

接下来是建造 Door 门，我们通过平面立方体创建：

```js
// Door
const door = new THREE.Mesh(
	new THREE.PlaneGeometry(2.2, 2.2),
	new THREE.MeshStandardMaterial(),
);
house.add(door);
```

不过我们需要放大才能看见，这个位置不太对，移动一下：

```js
door.position.y = 1;
door.position.z = 2;
```

当然因为它和 walls 材质一样所以合在一起了，为了明显，加个颜色

```js
const door = new THREE.Mesh(
	new THREE.PlaneGeometry(2.2, 2.2),
	new THREE.MeshStandardMaterial({
		color: 'red',
	}),
);
```

你会看到奇怪的现象，我们称为`z-fighting`即 z 轴冲突：

![image-20250202172125631](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250202172125631.png)

当它们位于同一个位置，GPU 不知道谁在谁的前面，因此就出现这个现象，解决方法也很简单，只需要让门往前移动一点点：

```js
door.position.z = 2 + 0.01;
```

很好，没有冲突了：

![image-20250202172310678](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250202172310678.png)

我们可以把红色去掉了，后续再加上纹理。

##### Bushes 灌木丛

接下来我们要建造各式各样的灌木丛，因此材质和立方体要提取：

```js
// Bushes
const bushGeometry = new THREE.SphereGeometry(1, 16, 16);
const bushMaterial = new THREE.MeshStandardMaterial();
```

然后创建不同的灌木丛 mesh：

```js
const bush1 = new THREE.Mesh(bushGeometry, bushMaterial);
bush1.scale.set(0.5, 0.5, 0.5);
bush1.position.set(0.8, 0.2, 2.2);

const bush2 = new THREE.Mesh(bushGeometry, bushMaterial);
bush2.scale.set(0.25, 0.25, 0.25);
bush2.position.set(1.4, 0.1, 2.1);

const bush3 = new THREE.Mesh(bushGeometry, bushMaterial);
bush3.scale.set(0.4, 0.4, 0.4);
bush3.position.set(-0.8, 0.1, 2.2);

const bush4 = new THREE.Mesh(bushGeometry, bushMaterial);
bush4.scale.set(0.15, 0.15, 0.15);
bush4.position.set(-1, 0.05, 2.6);

house.add(bush1, bush2, bush3, bush4);
```

保存查看，看起来不错：

![image-20250202173012463](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250202173012463.png)

#### Grave 坟墓

既然是鬼屋，附近也要有坟墓，我们创建一下：

```js
// Graves
const graveGeometry = new THREE.BoxGeometry(0.5, 0.8, 0.2);
const graveMaterial = new THREE.MeshStandardMaterial();
```

不过它不是房子 house 的一部分，因此我们单独创建一个 Group：

```js
const graves = new THREE.Group();
scene.add(graves);
```

坟墓很多，我们使用循环快速创建：

```js
for (let i = 0; i < 30; i++) {
	// Mesh
	const grave = new THREE.Mesh(graveGeometry, graveMaterial);

	// Add to graves group
	graves.add(grave);
}
```

接下来是坟墓位置，我们想要一个介于 0 到整圆的随机角度，这样就可以随机位置出现坟墓：

```js
const angle = Math.random() * Math.PI * 2;
```

接下来通过`sin`和`cos`正弦余弦函数可以得到-1 到+1，因此发送同一个 angle 会得到同样的结果，通过它来得到 x 和 z：

```js
const x = Math.sin(angle);
const z = Math.cos(angle);
```

然后将其作为位置传给坟墓：

```js
grave.position.x = x;
grave.position.z = z;
```

不过你会发现这个圆太小了，因此我们可以让他半径大点：

```js
const radius = 4;
const x = Math.sin(angle) * radius;
const z = Math.cos(angle) * radius;
```

看起来很不错：

![image-20250202174423651](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250202174423651.png)

不过我们还是想让他有些近有些远，通过随机数让他介于 3-7 之间：

```js
const radius = 3 + Math.random() * 4;
```

看起来不过，接下来调整一下 y，让他有些埋地深有些浅：

```js
grave.position.y = Math.random() * 0.4;
```

然后现在它们朝向一致，我们需要随机旋转一下：

```js
grave.rotation.x = (Math.random() - 0.5) * 0.4;
grave.rotation.y = (Math.random() - 0.5) * 0.4;
grave.rotation.z = (Math.random() - 0.5) * 0.4;
```

很不错！看着像乱葬岗了：

![image-20250202174946449](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250202174946449.png)

#### 地板 Texturing 纹理化

接下来我们给不同的立方体添加上纹理，让其更加真实，let go！

##### 地板边缘化

首先是地板的边缘处理，我们需要让他模糊看不清：

```js
/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();

// Floor
const floorAlphaTexture = textureLoader.load('./floor/alpha.jpg');

/**
 * House
 */
// Floor
const floor = new THREE.Mesh(
	new THREE.PlaneGeometry(20, 20),
	new THREE.MeshStandardMaterial({
		transparent: true,
		alphaMap: floorAlphaTexture,
	}),
);
```

记得前置条件是允许`transparent`，查看：

![image-20250202183340518](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250202183340518.png)

##### 纹理寻找

你可以通过 Poly Haven 寻找自己喜欢的纹理，我选择了[Coast Sand Rocks 02](https://polyhaven.com/zh/a/coast_sand_rocks_02)，这个纯看自己喜欢，选择 1k，压缩包，设置如下：

![image-20250202184753848](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250202184753848.png)

随后下载解压，将图片提取一下，放入 floor 文件夹。

##### 加载四个纹理

然后我们加载一下：

```js
const floorColorTexture = textureLoader.load(
	'./floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_diff_1k.jpg',
);
const floorARMTexture = textureLoader.load(
	'./floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_arm_1k.jpg',
);
const floorNormalTexture = textureLoader.load(
	'./floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_nor_gl_1k.jpg',
);
const floorDisplacementTexture = textureLoader.load(
	'./floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_disp_1k.jpg',
);
```

##### 使用颜色纹理

随后我们可以使用一下：

```js
const floor = new THREE.Mesh(
	new THREE.PlaneGeometry(20, 20),
	new THREE.MeshStandardMaterial({
		transparent: true,
		alphaMap: floorAlphaTexture,
		map: floorColorTexture,
	}),
);
```

OK，我们显示出来了：

![image-20250202185847713](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250202185847713.png)

##### 优化纹理

首先这些纹理都很大，我们可以通过`repeat`的方式来优化：

```js
floorColorTexture.repeat.set(8, 8);
floorARMTexture.repeat.set(8, 8);
floorNormalTexture.repeat.set(8, 8);
floorDisplacementTexture.repeat.set(8, 8);
```

不过看起来有点小问题，最后一个像素被拉伸到最后，因此出现奇怪的现象。

这是因为 WebGL 的默认工作，我们可以指定一下重复：

```jsj
floorColorTexture.wrapS = THREE.RepeatWrapping;
floorARMTexture.wrapS = THREE.RepeatWrapping;
floorNormalTexture.wrapS = THREE.RepeatWrapping;
floorDisplacementTexture.wrapS = THREE.RepeatWrapping;

floorColorTexture.wrapT = THREE.RepeatWrapping;
floorARMTexture.wrapT = THREE.RepeatWrapping;
floorNormalTexture.wrapT = THREE.RepeatWrapping;
floorDisplacementTexture.wrapT = THREE.RepeatWrapping;
```

看起来还可以，Great！

![image-20250202190316418](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250202190316418.png)

不过看起来颜色有点小怪，可以通过指定方式 SRGB 正确编码：

```js
floorColorTexture.colorSpace = THREE.SRGBColorSpace;
```

现在就是正确的了：

![image-20250202190614699](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250202190614699.png)

##### 应用其他纹理

然后我们把其他几个纹理也用上：

```js
const floor = new THREE.Mesh(
	new THREE.PlaneGeometry(20, 20),
	new THREE.MeshStandardMaterial({
		transparent: true,
		alphaMap: floorAlphaTexture,
		map: floorColorTexture,
		aoMap: floorARMTexture,
		roughnessMap: floorARMTexture,
		metalnessMap: floorARMTexture,
		normalMap: floorNormalTexture,
		displacementMap: floorDisplacementTexture,
	}),
);
```

当然应用后你会发现地形上升了，这是因为`displacementMap`将移动实际顶点，它不像普通地图一样伪造，因此我们需要增加顶点的数量：

```js
const floor = new THREE.Mesh(
	new THREE.PlaneGeometry(20, 20, 100, 100),
	//...
);
```

看起来很棒，我们有地形了：

![image-20250202191118557](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250202191118557.png)

不过注意，顶点太多有影响性能，因此根据需要添加。

看起来这些地形凸起有点强，我们可以控制减少点：

```js
const floor = new THREE.Mesh(
	new THREE.PlaneGeometry(20, 20, 100, 100),
	new THREE.MeshStandardMaterial({
		//...
		displacementMap: floorDisplacementTexture,
		displacementScale: 0.3,
	}),
);
```

我们还发现整个地形都上升了一部分，我们可以通过`displacementBias`属性来调整，不过为了找到正确，我们加入 debug UI 方便调整：

```js
gui
	.add(floor.material, 'displacementScale')
	.min(0)
	.max(1)
	.step(0.001)
	.name('floorDisplacementScale');
gui
	.add(floor.material, 'displacementBias')
	.min(-1)
	.max(1)
	.step(0.001)
	.name('floorDisplacementBias');
```

当你找到对应的值，你可以添加到属性中：

```js
const floor = new THREE.Mesh(
	new THREE.PlaneGeometry(20, 20, 100, 100),
	new THREE.MeshStandardMaterial({
		// ...
		displacementMap: floorDisplacementTexture,
		displacementScale: 0.3,
		displacementBias: -0.2,
	}),
);
```

#### 墙壁 Texturing 纹理化

接下来处理墙壁，资源地址：[castle_brick_broken_06](https://polyhaven.com/zh/a/castle_brick_broken_06)，如果下载了上面的，设置只需要去掉 Displacement 即可，我们不需要它，然后操作一样解压放入 wall 文件夹中

##### 加载纹理

和之前一样，加载一下：

```js
// Wall
const wallColorTexture = textureLoader.load(
	'./wall/castle_brick_broken_06_1k/castle_brick_broken_06_diff_1k.jpg',
);
const wallARMTexture = textureLoader.load(
	'./wall/castle_brick_broken_06_1k/castle_brick_broken_06_arm_1k.jpg',
);
const wallNormalTexture = textureLoader.load(
	'./wall/castle_brick_broken_06_1k/castle_brick_broken_06_nor_gl_1k.jpg',
);
```

然后一样，调整颜色纹理编码：

```js
wallColorTexture.colorSpace = THREE.SRGBColorSpace;
```

然后在墙壁使用：

```js
const walls = new THREE.Mesh(
	new THREE.BoxGeometry(4, 2.5, 4),
	new THREE.MeshStandardMaterial({
		map: wallColorTexture,
		aoMap: wallARMTexture,
		roughnessMap: wallARMTexture,
		metalnessMap: wallARMTexture,
		normalMap: wallNormalTexture,
	}),
);
```

看起来很棒：

![image-20250202193312113](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250202193312113.png)

#### 屋顶 Texturing 纹理化

资源地址：[roof_slates_02](https://polyhaven.com/zh/a/roof_slates_02)，和墙壁一样不用改了，下载解压放到 roof 文件夹

##### 加载纹理

然后一样加载：

```js
// Roof
const roofColorTexture = textureLoader.load(
	'./roof/roof_slates_02_1k/roof_slates_02_diff_1k.jpg',
);
const roofARMTexture = textureLoader.load(
	'./roof/roof_slates_02_1k/roof_slates_02_arm_1k.jpg',
);
const roofNormalTexture = textureLoader.load(
	'./roof/roof_slates_02_1k/roof_slates_02_nor_gl_1k.jpg',
);

roofColorTexture.colorSpace = THREE.SRGBColorSpace;
```

使用：

```js
const roof = new THREE.Mesh(
	new THREE.ConeGeometry(3.5, 1.5, 4),
	new THREE.MeshStandardMaterial({
		map: roofColorTexture,
		aoMap: roofARMTexture,
		roughnessMap: roofARMTexture,
		metalnessMap: roofARMTexture,
		normalMap: roofNormalTexture,
	}),
);
```

然后优化，重复：

```js
roofColorTexture.repeat.set(3, 1);
roofARMTexture.repeat.set(3, 1);
roofNormalTexture.repeat.set(3, 1);

roofColorTexture.wrapS = THREE.RepeatWrapping;
roofARMTexture.wrapS = THREE.RepeatWrapping;
roofNormalTexture.wrapS = THREE.RepeatWrapping;
```

然后这屋顶还有问题，它纹理是歪着的，还有它的光源反射不太对，这是由于纹理展开等原因导致的，较难解决，不过我们可以给出两个：

- 第一个是通过 Blender 等建模软件来解决，我们以后会学习
- 第二个是通过自己创建几何体，需要自己设置位置，UV 等信息，工作量很大

虽然这个屋顶有缺陷，不过我们还是用着，另外两个工作量大先不急。

#### 灌木丛 Texturing 纹理化

资源地址：[leaves_forest_ground](https://polyhaven.com/zh/a/leaves_forest_ground)，设置一样，解压放入 bush 中

##### 加载纹理

```js
const bushColorTexture = textureLoader.load(
	'./bush/leaves_forest_ground_1k/leaves_forest_ground_diff_1k.jpg',
);
const bushARMTexture = textureLoader.load(
	'./bush/leaves_forest_ground_1k/leaves_forest_ground_arm_1k.jpg',
);
const bushNormalTexture = textureLoader.load(
	'./bush/leaves_forest_ground_1k/leaves_forest_ground_nor_gl_1k.jpg',
);

bushColorTexture.colorSpace = THREE.SRGBColorSpace;
```

然后复制：

```js
bushColorTexture.repeat.set(2, 1);
bushARMTexture.repeat.set(2, 1);
bushNormalTexture.repeat.set(2, 1);

bushColorTexture.wrapS = THREE.RepeatWrapping;
bushARMTexture.wrapS = THREE.RepeatWrapping;
bushNormalTexture.wrapS = THREE.RepeatWrapping;
```

使用：

```js
const bushMaterial = new THREE.MeshStandardMaterial({
	map: bushColorTexture,
	aoMap: bushARMTexture,
	roughnessMap: bushARMTexture,
	metalnessMap: bushARMTexture,
	normalMap: bushNormalTexture,
});
```

看起来还行，不过它也有小问题，球体展开后导致这个：

![image-20250202195730069](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250202195730069.png)

解决方式第一个也是建模软件，不过我们还有更简单的：

```js
bush1.rotation.x = -0.75;
bush2.rotation.x = -0.75;
bush3.rotation.x = -0.75;
bush4.rotation.x = -0.75;
```

将他隐藏起来，我们最开始看不到就行：

![image-20250202200017844](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250202200017844.png)

不过他们的颜色不够绿，我们可以修改一下材质：

```js
const bushMaterial = new THREE.MeshStandardMaterial({
	color: '#ccffcc',
	//...
});
```

看起来很不错：

![image-20250202200204515](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250202200204515.png)

#### 坟墓 Texturing 纹理化

资源地址：[plastered_stone_wall](https://polyhaven.com/zh/a/plastered_stone_wall)，其他一样。

##### 加载

```js
// Grave
const graveColorTexture = textureLoader.load(
	'./grave/plastered_stone_wall_1k/plastered_stone_wall_diff_1k.jpg',
);
const graveARMTexture = textureLoader.load(
	'./grave/plastered_stone_wall_1k/plastered_stone_wall_arm_1k.jpg',
);
const graveNormalTexture = textureLoader.load(
	'./grave/plastered_stone_wall_1k/plastered_stone_wall_nor_gl_1k.jpg',
);

graveColorTexture.colorSpace = THREE.SRGBColorSpace;

graveColorTexture.repeat.set(0.3, 0.4);
graveARMTexture.repeat.set(0.3, 0.4);
graveNormalTexture.repeat.set(0.3, 0.4);
```

然后使用：

```js
const graveMaterial = new THREE.MeshStandardMaterial({
	map: graveColorTexture,
	aoMap: graveARMTexture,
	roughnessMap: graveARMTexture,
	metalnessMap: graveARMTexture,
	normalMap: graveNormalTexture,
});
```

不过纹理有点被拉扯，这也是没法，我们就先不处理。

#### 门 Texturing 纹理化

##### 加载

用的之前的，直接搞：

```js
// Door
const doorColorTexture = textureLoader.load('./door/color.jpg');
const doorAlphaTexture = textureLoader.load('./door/alpha.jpg');
const doorAmbientOcclusionTexture = textureLoader.load(
	'./door/ambientOcclusion.jpg',
);
const doorHeightTexture = textureLoader.load('./door/height.jpg');
const doorNormalTexture = textureLoader.load('./door/normal.jpg');
const doorMetalnessTexture = textureLoader.load('./door/metalness.jpg');
const doorRoughnessTexture = textureLoader.load('./door/roughness.jpg');

doorColorTexture.colorSpace = THREE.SRGBColorSpace;
```

然后使用，记得使用了位移图纹理要增加顶点，然后调整属性：

```js
const door = new THREE.Mesh(
	new THREE.PlaneGeometry(2.2, 2.2, 100, 100),
	new THREE.MeshStandardMaterial({
		map: doorColorTexture,
		transparent: true,
		alphaMap: doorAlphaTexture,
		aoMap: doorAmbientOcclusionTexture,
		roughnessMap: doorRoughnessTexture,
		metalnessMap: doorMetalnessTexture,
		normalMap: doorNormalTexture,
		displacementMap: doorHeightTexture,
		displacementScale: 0.15,
		displacementBias: -0.04,
	}),
);
```

看起来不错：

![image-20250202211431374](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250202211431374.png)

#### Lights 添加光

接下来为了渲染氛围，自然就需要光源了。

##### 调整颜色和强度

首先调整光源的颜色和强度：

```js
const ambientLight = new THREE.AmbientLight('#86cdff', 0.275);
//...
const directionalLight = new THREE.DirectionalLight('#86cdff', 1);
```

有那个感觉了：

![image-20250202211831259](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250202211831259.png)

##### 添加门灯

我们要在门上添加一个灯，以便照明：

```js
// Door light
const doorLight = new THREE.PointLight('#ff7d46', 5);
doorLight.position.set(0, 2.2, 2.5);
house.add(doorLight);
```

看起来不错：

![image-20250202212612589](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250202212612589.png)

#### Ghost 添加鬼魂

目前我们还没学到建模，因此这里的鬼魂使用旋转的灯来代替。

##### 添加 ghost

我们使用点光源：

```js
/**
 * Ghosts
 */
const ghost1 = new THREE.PointLight('#8800ff', 6);
const ghost2 = new THREE.PointLight('#ff0088', 6);
const ghost3 = new THREE.PointLight('#ff0000', 6);
scene.add(ghost1, ghost2, ghost3);
```

然后我们需要制作动画，让他们围绕房子旋转：

```js
const tick = () => {
	// Timer
	timer.update();
	const elapsedTime = timer.getElapsed();

	// Ghost
	const ghost1Angle = elapsedTime * 0.5;
	ghost1.position.x = Math.cos(ghost1Angle) * 4;
	ghost1.position.z = Math.sin(ghost1Angle) * 4;

	// Update controls
	controls.update();

	// Render
	renderer.render(scene, camera);

	// Call tick again on the next frame
	window.requestAnimationFrame(tick);
};
```

很棒，旋转起来了：

![image-20250202213303581](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250202213303581.png)

然后我们需要让 ghost 向上向下，使用 sin 和 cos 有点太规律了，我们可以使用在线工具[desmos](https://www.desmos.com/calculator?lang=zh-CN)自己添加公式测试：

![image-20250202213835058](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250202213835058.png)

你可以随意取值等，我们就用这个吧：

```js
ghost1.position.y =
	Math.sin(ghost1Angle) *
	Math.sin(ghost1Angle * 2.34) *
	Math.sin(ghost1Angle * 3.45);
```

这样它就有时向上有时向下。

另外两个就可以复制了，改一下半径啥的即可：

```js
const ghost2Angle = -elapsedTime * 0.38;
ghost2.position.x = Math.cos(ghost2Angle) * 5;
ghost2.position.z = Math.sin(ghost2Angle) * 5;
ghost2.position.y =
	Math.sin(ghost2Angle) *
	Math.sin(ghost2Angle * 2.34) *
	Math.sin(ghost2Angle * 3.45);

const ghost3Angle = elapsedTime * 0.23;
ghost3.position.x = Math.cos(ghost3Angle) * 6;
ghost3.position.z = Math.sin(ghost3Angle) * 6;
ghost3.position.y =
	Math.sin(ghost3Angle) *
	Math.sin(ghost3Angle * 2.34) *
	Math.sin(ghost3Angle * 3.45);
```

#### Shadows 添加阴影

##### 添加阴影

既然有了光，那么也要有阴影，我们来添加一下。

```js
/**
 * Shadows
 */
// Renderer
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// Cast and receive
directionalLight.castShadow = true;
ghost1.castShadow = true;
ghost2.castShadow = true;
ghost3.castShadow = true;

walls.castShadow = true;
walls.receiveShadow = true;
roof.castShadow = true;
floor.receiveShadow = true;
```

然后坟墓的要单独通过组循环处理：

```js
for (const grave of graves.children) {
	grave.castShadow = true;
	grave.receiveShadow = true;
}
```

##### 优化性能

太多的阴影会影响性能，我们可以通过调整分辨率、相机区域、近平面和远平面来优化一下：

```js
// Mapping
directionalLight.shadow.mapSize.width = 256;
directionalLight.shadow.mapSize.height = 256;
directionalLight.shadow.camera.top = 8;
directionalLight.shadow.camera.right = 8;
directionalLight.shadow.camera.bottom = -8;
directionalLight.shadow.camera.left = -8;
directionalLight.shadow.camera.near = 1;
directionalLight.shadow.camera.far = 20;
```

然后是幽灵 Ghost 的阴影优化：

```js
ghost1.shadow.mapSize.width = 256;
ghost1.shadow.mapSize.height = 256;
ghost1.shadow.camera.far = 10;

ghost2.shadow.mapSize.width = 256;
ghost2.shadow.mapSize.height = 256;
ghost2.shadow.camera.far = 10;

ghost3.shadow.mapSize.width = 256;
ghost3.shadow.mapSize.height = 256;
ghost3.shadow.camera.far = 10;
```

#### Sky 添加天空

真实的场景应该还有个天空，让我们添加一下：

```js
import { Sky } from 'three/addons/objects/Sky.js';
//...
/**
 * Sky
 */
const sky = new Sky();
scene.add(sky);
```

当然在默认情况下，你什么都看不到，我们只需要调整一下，更多得详细解释会在后面的章节：

```js
sky.material.uniforms['turbidity'].value = 10;
sky.material.uniforms['rayleigh'].value = 3;
sky.material.uniforms['mieCoefficient'].value = 0.1;
sky.material.uniforms['mieDirectionalG'].value = 0.95;
sky.material.uniforms['sunPosition'].value.set(0.3, -0.038, -0.95);
```

然后移动相机你能看到，不过缩放不太对，我们调整一下：

```js
sky.scale.set(100, 100, 100);
// 同样值可以用 sky.scale.setScalar(100)
```

没问题了，很棒：

![image-20250202225501610](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250202225501610.png)

#### Fog 添加雾气

鬼屋的气氛应该还要有雾气，让我们添加：

```js
/**
 * Fog
 */
scene.fog = new THREE.Fog('#04343f', 1, 13);
```

它很简单，参数就是`color`、`near`和`far`。

不过我们可以通过`FogExp2`来添加，它更真实：

```js
scene.fog = new THREE.FogExp2('#04343f', 0.1);
```

参数就是`color`和`density`，第二个是雾气密度。

很棒，我们离远点就会被雾气遮盖：

![image-20250202230035141](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250202230035141.png)

#### 优化项目

当你加载的时候，可以注意网络资源，会发现很大

![image-20250202230322895](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250202230322895.png)

优化方法是可以将 jpg 格式换成 webp 格式，它既可以压缩且不会损失数据。

你可以使用 [Squoosh](https://squoosh.app/)在线网站上传，可以看到压缩的差异，且可以导出你需要的图片格式。

你还可以使用 [CloudConvert](https://cloudconvert.com/image-converter)来使用相同统一多次转换。

当然你还可以通过 [TinyPNG](https://tinypng.com/)选择图片格式，然后上传很快就得到所需要的压缩图片了。

你可以根据你的需要选择网站，然后压缩图片等。

本项目最终代码:

```js
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Sky } from 'three/addons/objects/Sky.js';
import { Timer } from 'three/addons/misc/Timer.js';
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

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();

// Floor
const floorAlphaTexture = textureLoader.load('./floor/alpha.jpg');
const floorColorTexture = textureLoader.load(
	'./floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_diff_1k.jpg',
);
const floorARMTexture = textureLoader.load(
	'./floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_arm_1k.jpg',
);
const floorNormalTexture = textureLoader.load(
	'./floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_nor_gl_1k.jpg',
);
const floorDisplacementTexture = textureLoader.load(
	'./floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_disp_1k.jpg',
);

floorColorTexture.colorSpace = THREE.SRGBColorSpace;

floorColorTexture.repeat.set(8, 8);
floorARMTexture.repeat.set(8, 8);
floorNormalTexture.repeat.set(8, 8);
floorDisplacementTexture.repeat.set(8, 8);

floorColorTexture.wrapS = THREE.RepeatWrapping;
floorARMTexture.wrapS = THREE.RepeatWrapping;
floorNormalTexture.wrapS = THREE.RepeatWrapping;
floorDisplacementTexture.wrapS = THREE.RepeatWrapping;

floorColorTexture.wrapT = THREE.RepeatWrapping;
floorARMTexture.wrapT = THREE.RepeatWrapping;
floorNormalTexture.wrapT = THREE.RepeatWrapping;
floorDisplacementTexture.wrapT = THREE.RepeatWrapping;

// Wall
const wallColorTexture = textureLoader.load(
	'./wall/castle_brick_broken_06_1k/castle_brick_broken_06_diff_1k.jpg',
);
const wallARMTexture = textureLoader.load(
	'./wall/castle_brick_broken_06_1k/castle_brick_broken_06_arm_1k.jpg',
);
const wallNormalTexture = textureLoader.load(
	'./wall/castle_brick_broken_06_1k/castle_brick_broken_06_nor_gl_1k.jpg',
);

wallColorTexture.colorSpace = THREE.SRGBColorSpace;

// Roof
const roofColorTexture = textureLoader.load(
	'./roof/roof_slates_02_1k/roof_slates_02_diff_1k.jpg',
);
const roofARMTexture = textureLoader.load(
	'./roof/roof_slates_02_1k/roof_slates_02_arm_1k.jpg',
);
const roofNormalTexture = textureLoader.load(
	'./roof/roof_slates_02_1k/roof_slates_02_nor_gl_1k.jpg',
);

roofColorTexture.colorSpace = THREE.SRGBColorSpace;

roofColorTexture.repeat.set(3, 1);
roofARMTexture.repeat.set(3, 1);
roofNormalTexture.repeat.set(3, 1);

roofColorTexture.wrapS = THREE.RepeatWrapping;
roofARMTexture.wrapS = THREE.RepeatWrapping;
roofNormalTexture.wrapS = THREE.RepeatWrapping;

// Bush
const bushColorTexture = textureLoader.load(
	'./bush/leaves_forest_ground_1k/leaves_forest_ground_diff_1k.jpg',
);
const bushARMTexture = textureLoader.load(
	'./bush/leaves_forest_ground_1k/leaves_forest_ground_arm_1k.jpg',
);
const bushNormalTexture = textureLoader.load(
	'./bush/leaves_forest_ground_1k/leaves_forest_ground_nor_gl_1k.jpg',
);

bushColorTexture.colorSpace = THREE.SRGBColorSpace;

bushColorTexture.repeat.set(2, 1);
bushARMTexture.repeat.set(2, 1);
bushNormalTexture.repeat.set(2, 1);

bushColorTexture.wrapS = THREE.RepeatWrapping;
bushARMTexture.wrapS = THREE.RepeatWrapping;
bushNormalTexture.wrapS = THREE.RepeatWrapping;

// Grave
const graveColorTexture = textureLoader.load(
	'./grave/plastered_stone_wall_1k/plastered_stone_wall_diff_1k.jpg',
);
const graveARMTexture = textureLoader.load(
	'./grave/plastered_stone_wall_1k/plastered_stone_wall_arm_1k.jpg',
);
const graveNormalTexture = textureLoader.load(
	'./grave/plastered_stone_wall_1k/plastered_stone_wall_nor_gl_1k.jpg',
);

graveColorTexture.colorSpace = THREE.SRGBColorSpace;

graveColorTexture.repeat.set(0.3, 0.4);
graveARMTexture.repeat.set(0.3, 0.4);
graveNormalTexture.repeat.set(0.3, 0.4);

// Door
const doorColorTexture = textureLoader.load('./door/color.jpg');
const doorAlphaTexture = textureLoader.load('./door/alpha.jpg');
const doorAmbientOcclusionTexture = textureLoader.load(
	'./door/ambientOcclusion.jpg',
);
const doorHeightTexture = textureLoader.load('./door/height.jpg');
const doorNormalTexture = textureLoader.load('./door/normal.jpg');
const doorMetalnessTexture = textureLoader.load('./door/metalness.jpg');
const doorRoughnessTexture = textureLoader.load('./door/roughness.jpg');

doorColorTexture.colorSpace = THREE.SRGBColorSpace;

/**
 * House
 */
// Floor
const floor = new THREE.Mesh(
	new THREE.PlaneGeometry(20, 20, 100, 100),
	new THREE.MeshStandardMaterial({
		transparent: true,
		alphaMap: floorAlphaTexture,
		map: floorColorTexture,
		aoMap: floorARMTexture,
		roughnessMap: floorARMTexture,
		metalnessMap: floorARMTexture,
		normalMap: floorNormalTexture,
		displacementMap: floorDisplacementTexture,
		displacementScale: 0.3,
		displacementBias: -0.2,
	}),
);
floor.rotation.x = -Math.PI * 0.5;
scene.add(floor);

gui
	.add(floor.material, 'displacementScale')
	.min(0)
	.max(1)
	.step(0.001)
	.name('floorDisplacementScale');
gui
	.add(floor.material, 'displacementBias')
	.min(-1)
	.max(1)
	.step(0.001)
	.name('floorDisplacementBias');

// House container
const house = new THREE.Group();
scene.add(house);

// Walls
const walls = new THREE.Mesh(
	new THREE.BoxGeometry(4, 2.5, 4),
	new THREE.MeshStandardMaterial({
		map: wallColorTexture,
		aoMap: wallARMTexture,
		roughnessMap: wallARMTexture,
		metalnessMap: wallARMTexture,
		normalMap: wallNormalTexture,
	}),
);
walls.position.y += 1.25;
house.add(walls);

// Roof
const roof = new THREE.Mesh(
	new THREE.ConeGeometry(3.5, 1.5, 4),
	new THREE.MeshStandardMaterial({
		map: roofColorTexture,
		aoMap: roofARMTexture,
		roughnessMap: roofARMTexture,
		metalnessMap: roofARMTexture,
		normalMap: roofNormalTexture,
	}),
);
roof.position.y = 2.5 + 0.75;
roof.rotation.y = Math.PI * 0.25;
house.add(roof);

// Door
const door = new THREE.Mesh(
	new THREE.PlaneGeometry(2.2, 2.2, 100, 100),
	new THREE.MeshStandardMaterial({
		map: doorColorTexture,
		transparent: true,
		alphaMap: doorAlphaTexture,
		aoMap: doorAmbientOcclusionTexture,
		roughnessMap: doorRoughnessTexture,
		metalnessMap: doorMetalnessTexture,
		normalMap: doorNormalTexture,
		displacementMap: doorHeightTexture,
		displacementScale: 0.15,
		displacementBias: -0.04,
	}),
);
door.position.y = 1;
door.position.z = 2 + 0.01;
house.add(door);

// Bushes
const bushGeometry = new THREE.SphereGeometry(1, 16, 16);
const bushMaterial = new THREE.MeshStandardMaterial({
	color: '#ccffcc',
	map: bushColorTexture,
	aoMap: bushARMTexture,
	roughnessMap: bushARMTexture,
	metalnessMap: bushARMTexture,
	normalMap: bushNormalTexture,
});

const bush1 = new THREE.Mesh(bushGeometry, bushMaterial);
bush1.scale.set(0.5, 0.5, 0.5);
bush1.position.set(0.8, 0.2, 2.2);
bush1.rotation.x = -0.75;

const bush2 = new THREE.Mesh(bushGeometry, bushMaterial);
bush2.scale.set(0.25, 0.25, 0.25);
bush2.position.set(1.4, 0.1, 2.1);
bush2.rotation.x = -0.75;

const bush3 = new THREE.Mesh(bushGeometry, bushMaterial);
bush3.scale.set(0.4, 0.4, 0.4);
bush3.position.set(-0.8, 0.1, 2.2);
bush3.rotation.x = -0.75;

const bush4 = new THREE.Mesh(bushGeometry, bushMaterial);
bush4.scale.set(0.15, 0.15, 0.15);
bush4.position.set(-1, 0.05, 2.6);
bush4.rotation.x = -0.75;

house.add(bush1, bush2, bush3, bush4);

// Graves
const graveGeometry = new THREE.BoxGeometry(0.5, 0.8, 0.2);
const graveMaterial = new THREE.MeshStandardMaterial({
	map: graveColorTexture,
	aoMap: graveARMTexture,
	roughnessMap: graveARMTexture,
	metalnessMap: graveARMTexture,
	normalMap: graveNormalTexture,
});

const graves = new THREE.Group();
scene.add(graves);

for (let i = 0; i < 30; i++) {
	const angle = Math.random() * Math.PI * 2;
	const radius = 3 + Math.random() * 4;
	const x = Math.sin(angle) * radius;
	const z = Math.cos(angle) * radius;

	// Mesh
	const grave = new THREE.Mesh(graveGeometry, graveMaterial);

	grave.position.x = x;
	grave.position.y = Math.random() * 0.4;
	grave.position.z = z;

	grave.rotation.x = (Math.random() - 0.5) * 0.4;
	grave.rotation.y = (Math.random() - 0.5) * 0.4;
	grave.rotation.z = (Math.random() - 0.5) * 0.4;

	// Add to graves group
	graves.add(grave);
}

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight('#86cdff', 0.275);
scene.add(ambientLight);

// Directional light
const directionalLight = new THREE.DirectionalLight('#86cdff', 1);
directionalLight.position.set(3, 2, -8);
scene.add(directionalLight);

// Door light
const doorLight = new THREE.PointLight('#ff7d46', 5);
doorLight.position.set(0, 2.2, 2.5);
house.add(doorLight);

/**
 * Ghosts
 */
const ghost1 = new THREE.PointLight('#8800ff', 6);
const ghost2 = new THREE.PointLight('#ff0088', 6);
const ghost3 = new THREE.PointLight('#ff0000', 6);
scene.add(ghost1, ghost2, ghost3);

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
camera.position.x = 4;
camera.position.y = 2;
camera.position.z = 5;
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
 * Shadows
 */
// Renderer
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// Cast and receive
directionalLight.castShadow = true;
ghost1.castShadow = true;
ghost2.castShadow = true;
ghost3.castShadow = true;

walls.castShadow = true;
walls.receiveShadow = true;
roof.castShadow = true;
floor.receiveShadow = true;

for (const grave of graves.children) {
	grave.castShadow = true;
	grave.receiveShadow = true;
}

// Mapping
directionalLight.shadow.mapSize.width = 256;
directionalLight.shadow.mapSize.height = 256;
directionalLight.shadow.camera.top = 8;
directionalLight.shadow.camera.right = 8;
directionalLight.shadow.camera.bottom = -8;
directionalLight.shadow.camera.left = -8;
directionalLight.shadow.camera.near = 1;
directionalLight.shadow.camera.far = 20;

ghost1.shadow.mapSize.width = 256;
ghost1.shadow.mapSize.height = 256;
ghost1.shadow.camera.far = 10;

ghost2.shadow.mapSize.width = 256;
ghost2.shadow.mapSize.height = 256;
ghost2.shadow.camera.far = 10;

ghost3.shadow.mapSize.width = 256;
ghost3.shadow.mapSize.height = 256;
ghost3.shadow.camera.far = 10;

/**
 * Sky
 */
const sky = new Sky();
sky.scale.set(100, 100, 100);
scene.add(sky);

sky.material.uniforms['turbidity'].value = 10;
sky.material.uniforms['rayleigh'].value = 3;
sky.material.uniforms['mieCoefficient'].value = 0.1;
sky.material.uniforms['mieDirectionalG'].value = 0.95;
sky.material.uniforms['sunPosition'].value.set(0.3, -0.038, -0.95);

/**
 * Fog
 */
// scene.fog = new THREE.Fog('#04343f', 1, 13);
scene.fog = new THREE.FogExp2('#04343f', 0.1);

/**
 * Animate
 */
const timer = new Timer();

const tick = () => {
	// Timer
	timer.update();
	const elapsedTime = timer.getElapsed();

	// Ghost
	const ghost1Angle = elapsedTime * 0.5;
	ghost1.position.x = Math.cos(ghost1Angle) * 4;
	ghost1.position.z = Math.sin(ghost1Angle) * 4;
	ghost1.position.y =
		Math.sin(ghost1Angle) *
		Math.sin(ghost1Angle * 2.34) *
		Math.sin(ghost1Angle * 3.45);

	const ghost2Angle = -elapsedTime * 0.38;
	ghost2.position.x = Math.cos(ghost2Angle) * 5;
	ghost2.position.z = Math.sin(ghost2Angle) * 5;
	ghost2.position.y =
		Math.sin(ghost2Angle) *
		Math.sin(ghost2Angle * 2.34) *
		Math.sin(ghost2Angle * 3.45);

	const ghost3Angle = elapsedTime * 0.23;
	ghost3.position.x = Math.cos(ghost3Angle) * 6;
	ghost3.position.z = Math.sin(ghost3Angle) * 6;
	ghost3.position.y =
		Math.sin(ghost3Angle) *
		Math.sin(ghost3Angle * 2.34) *
		Math.sin(ghost3Angle * 3.45);

	// Update controls
	controls.update();

	// Render
	renderer.render(scene, camera);

	// Call tick again on the next frame
	window.requestAnimationFrame(tick);
};

tick();
```

### Particles 粒子

#### 初始代码

本节我们聊聊粒子相关的内容，下面是项目初始代码：

```js
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'

/**
 * Base
 */
// Debug
const gui = new GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 3
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
```

#### 创建粒子

让我们来创建第一个粒子，首先需要几何体和材质：

```js
const particleGeometry = new THREE.SphereGeometry(1, 32, 32);
const particleMaterial = new THREE.PointsMaterial({
    size: 0.02,
    sizeAttenuation: true,
})
```

参数`size`就是粒子大小，`sizeAttenuation`就是大小衰减，即粒子离摄像机越远它就越小，靠近会变大。

然后是创建粒子，或者叫点：

```js
// Point
const particles = new THREE.Points(particleGeometry, particleMaterial);
scene.add(particles);
```

保存查看，Great：

![image-20250203165447194](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250203165447194.png)

#### 创建自定义立方体

我们运用学习过的东西创建自己的立方体，练习一下：

```js
const particleGeometry = new THREE.BufferGeometry();
const count = 500;

const positions = new Float32Array(count * 3);

for (let i = 0; i < count * 3; i++) {
	positions[i] = (Math.random() - 0.5) * 5;
}
particleGeometry.setAttribute(
	'position',
	new THREE.BufferAttribute(positions, 3),
);
```

保存查看，看起来很酷，像星空：

![image-20250203170016541](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250203170016541.png)

你可以调整数量，以及材质大小等，根据喜欢。

#### 改变属性

##### 颜色

我们可以改变粒子颜色，通过材质：

```js
particleMaterial.color = new THREE.Color('#ff88cc');
```

看起来不错：

![image-20250203171451468](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250203171451468.png)

##### 纹理

当然你也可以使用纹理：

```js
const textureLoader = new THREE.TextureLoader();
const particleTexture = textureLoader.load('/textures/particles/11.png')
//...
particleMaterial.map = particleTexture;
```

加载成功：

![image-20250203171841235](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250203171841235.png)

粒子的资源地址：[particle-pack](https://www.kenney.nl/assets/particle-pack)，它是CC0许可，随便用。

你也可以自己画图创建，如果你愿意的话。

#### 修复问题

如果仔细观察会发现它有部分区域遮挡了后面的粒子，需要修复一下，使用`alphaMap`，记得前置条件：

```js
particleMaterial.transparent = true;
particleMaterial.alphaMap = particleTexture;
```

现在可以看见，不过你还是能看见粒子的边缘有黑黑的，这是因为粒子按照顺序绘制，GPU需要确定哪个是前面，这算一个bug，不过不好解决，有几个方法：

##### alphaTest减少

首先使用`alphaTest`让GPU尽量让纹理的黑色部分不渲染：

```js
particleMaterial.alphaTest = 0.001;
```

不过如果仔细观察，你还是能看到这个，在移动时不明显。

#### depthTest停止

第二个方法是停用深度检测，让GPU只绘制不判断在前在后：

```js
particleMaterial.depthTest = false;
```

看起来没啥问题，不过关闭深度检测可能会出现奇怪的bug，比如我随便添加一个立方体：

```js
const cube = new THREE.Mesh(
	new THREE.BoxGeometry(1, 1, 1),
	new THREE.MeshBasicMaterial(),
);
scene.add(cube);
```

你会发现你能看到立方体后面的粒子，这是不应该的：

![image-20250203173256435](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250203173256435.png)

因此场景中有其他物体或粒子颜色不同，不应该关闭深度检测。

##### depthWrite深度写入

第三个方法是关闭深度写入`depthWrite`，即不让WebGL去写入深度缓冲区，这确实是个有效方法：

```js
particleMaterial.depthWrite = false;
```

看起来问题解决，立方体也不会透视了：

![image-20250203173809556](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250203173809556.png)

##### blending混合

第四种方法不同于前面，要关闭深度写入，然后使用加法混合：

```js
particleMaterial.depthWrite = false;
particleMaterial.blending = THREE.AdditiveBlending;
```

它会将颜色叠加到已有的颜色，不过注意它会影响性能。

#### 粒子不同颜色

让我们给每个粒子一个随机的颜色：

```js
const colors = new Float32Array(count * 3);
for (let i = 0; i < count * 3; i++) {
	positions[i] = (Math.random() - 0.5) * 5;
    colors[i] = Math.random();
}
particleGeometry.setAttribute(
	'color',
	new THREE.BufferAttribute(colors, 3),
);
```

当然我们要告诉材质使用顶点颜色，注释基础颜色：

```js
// particleMaterial.color = new THREE.Color('#ff88cc');
particleMaterial.vertexColors = true;
```

看起来很棒！

![image-20250203184304775](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250203184304775.png)

#### 添加动画

##### 整体动画

我们可以给粒子添加上动画，就像其他一样：

```js
const tick = () => {
	const elapsedTime = clock.getElapsedTime();

    // Update particles
    particles.rotation.y = elapsedTime * 0.2;

	// Update controls
	controls.update();

	// Render
	renderer.render(scene, camera);

	// Call tick again on the next frame
	window.requestAnimationFrame(tick);
};
```

##### 单独动画

整体的动画固然不错，但我想分别控制每个粒子，当然我们可以通过访问立方体属性来访问到数组，数组存放了每个粒子的位置

```js
const tick = () => {
	const elapsedTime = clock.getElapsedTime();

	// Update particles
	// particles.rotation.y = elapsedTime * 0.2;

    for (let i = 0; i < count; i++) {
        // x_index
        const i3 = i * 3;
        const x = particleGeometry.attributes.position.array[i3];
        // change position_y
        particleGeometry.attributes.position.array[i3 + 1] = Math.sin(elapsedTime + x);
    }
    // need to update
    particleGeometry.attributes.position.needsUpdate = true;
	// Update controls
	controls.update();

	// Render
	renderer.render(scene, camera);

	// Call tick again on the next frame
	window.requestAnimationFrame(tick);
};
```

通过它你能够得到一个波浪的效果，当然它更新了大量粒子，因此它的压力可能较大，如果觉得卡可以降低粒子数量。

![image-20250203185635200](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250203185635200.png)

如果还是想优化，那么就是使用自定义的着色器，而不是使用`PointsMaterial`材质，后面会详细学习。

### Galaxy Generatory银河生成器

本节我们通过上一节学到的粒子来创建一个自己的银河。

#### 初始代码

这是初始的代码：

```js
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'

/**
 * Base
 */
// Debug
const gui = new GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Test cube
 */
const cube = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial()
)
scene.add(cube)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 3
camera.position.y = 3
camera.position.z = 3
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
```

#### 创建基础

可以先把立方体移除，然后我们先创建立方体及其位置：

```js
/**
 * Galaxy
 */
const paramters = {
	count: 1000,
};
const generateGalaxy = () => {
	const geometry = new THREE.BufferGeometry();

	const positions = new Float32Array(paramters.count * 3);

	for (let i = 0; i < paramters.count; i++) {
		const i3 = i * 3;
		positions[i3] = (Math.random() - 0.5) * 3;
		positions[i3 + 1] = (Math.random() - 0.5) * 3;
		positions[i3 + 2] = (Math.random() - 0.5) * 3;
	}

	geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
};
generateGalaxy();
```

随后设置材质相关，通过粒子：

```js
const paramters = {
	count: 1000,
    size: 0.02,
};
const generateGalaxy = () => {
	// ...  
    // Material
    const material = new THREE.PointsMaterial({
        size: paramters.size,
        sizeAttenuation: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
    })
};
```

然后加上这些粒子：

```js
const generateGalaxy = () => {
	// ...
    // Points
    const points = new THREE.Points(geometry, material);
    scene.add(points);
};
```

当然可以把我们的参数放入到Debug UI：

```js
gui
	.add(paramters, 'count')
	.min(100)
	.max(1000000)
	.step(100)
	.onFinishChange(generateGalaxy);
gui
	.add(paramters, 'size')
	.min(0.001)
	.max(0.1)
	.step(0.001)
	.onFinishChange(generateGalaxy);
```

记得`onFinishChange`即变化后重新调用生成，同时我们应该在调整后把之前的对象删除，因此调整一下：

```js
let geometry = null;
let material = null;
let points = null;
const generateGalaxy = () => {
	geometry = new THREE.BufferGeometry();
    //...
	material = new THREE.PointsMaterial({
		size: paramters.size,
		sizeAttenuation: true,
		depthWrite: false,
		blending: THREE.AdditiveBlending,
	});
	//...
	points = new THREE.Points(geometry, material);
	scene.add(points);
};
```

把他们提出去，然后在每次生成的时候判断：

```js
const generateGalaxy = () => {
    /**
     * Destroy old galaxy
     */
    if (points !== null) {
        geometry.dispose();
        material.dispose();
        scene.remove(points);
    }
    //...
}
```

这样就可以随便调整值，同时也会随时改变页面显示。

#### 创建分支

我们要创建一个螺旋星系，接下来就是这个形状：

![image-20250206154432674](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250206154432674.png)

首先我们会看到里面有个中心点，因此有个半径：

```js
const paramters = {
	count: 100000,
	size: 0.01,
    radius: 5,
};
//...
gui
	.add(paramters, 'radius')
	.min(0.01)
	.max(20)
	.step(0.01)
	.onFinishChange(generateGalaxy);
```

然后我们来创建线，先把粒子放到线上：

```js
const generateGalaxy = () => {
	//...
	for (let i = 0; i < paramters.count; i++) {
		const i3 = i * 3;

		const radius = Math.random() * paramters.radius;

		positions[i3] = radius;
		positions[i3 + 1] = 0;
		positions[i3 + 2] = 0;
	}
	//...
};
```

接下来是创建几个分支线，我们放到参数里面：

```js
const paramters = {
	count: 100000,
	size: 0.01,
	radius: 5,
    branches: 3,
};
//...
gui.add(paramters, 'branches')
	.min(2)
	.max(20)
	.step(1)
	.onFinishChange(generateGalaxy);
```

然后在for循环里面生成分支的角度，通过模运算我们得到固定的0 1 2等值，然后除以分支数以及乘π，这样就可以得到角度，通过sin和cos乘半径得到位置

可以参考图：

![image-20250206160011019](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250206160011019.png)

```js
const generateGalaxy = () => {
	// ...
	for (let i = 0; i < paramters.count; i++) {
		const i3 = i * 3;

		const radius = Math.random() * paramters.radius;
        const branchesAngle = (i % paramters.branches) / paramters.branches * Math.PI * 2;

		positions[i3] = Math.cos(branchesAngle) * radius;
		positions[i3 + 1] = 0;
		positions[i3 + 2] = Math.sin(branchesAngle) * radius;
	}
	// ...
};
```

查看，我们就得到了是三个线：

![image-20250206160150454](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250206160150454.png)

#### 添加旋转角度

接下来我们需要让它旋转，变为螺旋样式，加到参数：

```js
const paramters = {
	count: 100000,
	size: 0.01,
	radius: 5,
	branches: 3,
    spin: 1,
};
//...
gui
	.add(paramters, 'spin')
	.min(-5)
	.max(5)
	.step(0.001)
	.onFinishChange(generateGalaxy);
```

然后在其中添加旋转：

```js
	for (let i = 0; i < paramters.count; i++) {
		const i3 = i * 3;

		const radius = Math.random() * paramters.radius;
		const spinAngle = radius * paramters.spin;
        const branchesAngle =
			((i % paramters.branches) / paramters.branches) * Math.PI * 2;

		positions[i3] = Math.cos(branchesAngle + spinAngle) * radius;
		positions[i3 + 1] = 0;
		positions[i3 + 2] = Math.sin(branchesAngle + spinAngle) * radius;
	}
```

看看样子不错：

![image-20250206160833589](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250206160833589.png)

#### 添加随机性

目前粒子都分布在线上，我们需要随机性，添加到参数：

```js
const paramters = {
	count: 100000,
	size: 0.01,
	radius: 5,
	branches: 3,
	spin: 1,
    randomness: 0.2
};
//...
gui.add(paramters, 'randomness')
	.min(0)
	.max(2)
	.step(0.001)
	.onFinishChange(generateGalaxy);
```

然后运用随机性：

```js
	for (let i = 0; i < paramters.count; i++) {
		const i3 = i * 3;

		const radius = Math.random() * paramters.radius;
		const spinAngle = radius * paramters.spin;
		const branchesAngle =
			((i % paramters.branches) / paramters.branches) * Math.PI * 2;

		const randomX = (Math.random() - 0.5) * paramters.randomness * radius;
		const randomY = (Math.random() - 0.5) * paramters.randomness * radius;
		const randomZ = (Math.random() - 0.5) * paramters.randomness * radius;

		positions[i3] = Math.cos(branchesAngle + spinAngle) * radius + randomX;
		positions[i3 + 1] = randomY;
		positions[i3 + 2] = Math.sin(branchesAngle + spinAngle) * radius + randomZ;
	}
```

看看不错，调高随机性可以分布的更多：

![image-20250206161307969](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250206161307969.png)

#### 添加随机强度

上面的随机性值还算是一个固定的直线，我们需要让他变为曲线，这样竖着看就不像一个立方体，添加随机强度到参数：

```js
const paramters = {
	//...
    randomnessPower: 3,
};
//...
gui
	.add(paramters, 'randomnessPower')
	.min(1)
	.max(10)
	.step(0.001)
	.onFinishChange(generateGalaxy);
```

然后通过`pow`来做运算：

```js
const randomX = Math.pow(Math.random(), paramters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1);
const randomY = Math.pow(Math.random(), paramters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1);
const randomZ = Math.pow(Math.random(), paramters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1);
```

#### 添加颜色

接下来我们添加颜色：

```js
const paramters = {
	//...
    insideColor: '#ff6030',
    outsideColor: '#1b3984'
};
//...
gui.addColor(paramters, 'insideColor').onFinishChange(generateGalaxy);
gui.addColor(paramters, 'outsideColor').onFinishChange(generateGalaxy);
```

然后运用到材质：

```js
	material = new THREE.PointsMaterial({
		size: paramters.size,
		sizeAttenuation: true,
		depthWrite: false,
		blending: THREE.AdditiveBlending,
        vertexColors: true,
	});
```

当然我们还需要创建一个新属性：

```js
    const colors = new Float32Array(paramters.count * 3);

	for (let i = 0; i < paramters.count; i++) {
        // ...
        // Color
        colors[i3] = 1;
        colors[i3 + 1] = 0;
        colors[i3 + 2] = 0;
    }
	geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
```

先看看有没有，有红色就行，然后我们创建内圈和外圈颜色，随后混合它，然后添加到rgb：

```js
	const colorInside = new THREE.Color(paramters.insideColor);
	const colorOutside = new THREE.Color(paramters.outsideColor);
	for (let i = 0; i < paramters.count; i++) {
		//...
		// Color
		const mixedColor = colorInside.clone();
		mixedColor.lerp(colorOutside, radius / paramters.radius);

		colors[i3 + 0] = mixedColor.r;
		colors[i3 + 1] = mixedColor.g;
		colors[i3 + 2] = mixedColor.b;
	}
```

看起来很不错：

![image-20250206164101093](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250206164101093.png)

我们就完成这个了，你还可以调整参数以及添加更多参数等。

### Scroll based animation滚动动画

我们来学习如何使用Three让摄像机随着用户滚动而滚动。

#### 初始代码

这是项目的初始代码：

```js
import * as THREE from 'three'
import GUI from 'lil-gui'

/**
 * Debug
 */
const gui = new GUI()

const parameters = {
    materialColor: '#ffeded'
}

gui
    .addColor(parameters, 'materialColor')

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Test cube
 */
const cube = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ color: '#ff0000' })
)
scene.add(cube)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 6
scene.add(camera)

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
```

如果不能滚动，是因为css文件有个`overflow: hidden`注释一下

还有部分用户滚动到底部可能会有白边，取决于操作系统，解决一下

```js
const renderer = new THREE.WebGLRenderer({
	canvas: canvas,
	alpha: true,
});
```

我们允许透明度，然后处理一下背景的颜色：

```css
html {
	background: #1e1a20;
}
```

#### 创建对象

先把测试的立方体移除，然后创建新的：

```js
const mesh1 = new THREE.Mesh(
	new THREE.TorusGeometry(1, 0.4, 16, 60),
	new THREE.MeshBasicMaterial({ color: '#ff0000' }),
);
const mesh2 = new THREE.Mesh(
	new THREE.ConeGeometry(1, 2, 32),
	new THREE.MeshBasicMaterial({ color: '#ff0000' }),
);
const mesh3 = new THREE.Mesh(
	new THREE.TorusKnotGeometry(0.8, 0.35, 100, 161),
	new THREE.MeshBasicMaterial({ color: '#ff0000' }),
);
scene.add(mesh1, mesh2, mesh3);
```

当然如果查看会发现比较奇怪，我们会处理一下的。

#### 改进材质

我们只用了基础材质，为了好看，我们可以换一下：

```js
const material = new THREE.MeshToonMaterial({
	color: parameters.materialColor,
});
const mesh1 = new THREE.Mesh(
    new THREE.TorusGeometry(1, 0.4, 16, 60),
    material
);
const mesh2 = new THREE.Mesh(
    new THREE.ConeGeometry(1, 2, 32),
    material
);
const mesh3 = new THREE.Mesh(
	new THREE.TorusKnotGeometry(0.8, 0.35, 100, 161),
	material,
);
```

当然你会看到全黑的部分。

#### 添加灯光

`MeshToonMaterial`是依赖光的材质，因此我们需要添加Light：

```js
/**
 * Lights
 */
const directionalLight = new THREE.DirectionalLight('#ffffff', 1);
directionalLight.position.set(1, 1, 0);
scene.add(directionalLight);
```

现在能看到了，不过Debug UI调整颜色的时候没改变，修正一下：

```js
gui 
    .addColor(parameters, 'materialColor')
    .onChange(() => {
		material.color.set(parameters.materialColor);
	});
```

#### 添加纹理

如果你查看文档，会发现这个材质支持渐变，因此我们加载一下纹理来获取更多的色阶效果：

```js
// Texture
const textureLoader = new THREE.TextureLoader();
const gradientTexture = textureLoader.load('textures/gradients/3.jpg');
```

然后在材质中使用它：

```js
const material = new THREE.MeshToonMaterial({
	color: parameters.materialColor,
    gradientMap: gradientTexture,
});
```

看起来很不错：

![image-20250206212524582](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250206212524582.png)

当然感觉有点怪，少了点阴影，我们改一下映射：

```js
gradientTexture.magFilter = THREE.NearestFilter;
```

这样看起来更棒了：

![image-20250206212956616](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250206212956616.png)

#### 修改位置

我们把刚刚的立方体部分往下移动，现在还是重合的：

```js
const objectsDistance = 4;
//...
mesh1.position.y = -objectsDistance * 0;
mesh2.position.y = -objectsDistance * 1;
mesh3.position.y = -objectsDistance * 2;
```

#### 添加动画

我们添加一下动画让场景更生动：

```js
const sectionMeshes = [mesh1, mesh2, mesh3];
//...
const tick = () => {
	const elapsedTime = clock.getElapsedTime();

    // Animate meshes
    for (const mesh of sectionMeshes) {
        mesh.rotation.x = elapsedTime * 0.1;
        mesh.rotation.y = elapsedTime * 0.12;
    }

	// Render
	renderer.render(scene, camera);

	// Call tick again on the next frame
	window.requestAnimationFrame(tick);
};
```

#### 修改相机

接下来修改相机，让其在滚动的时候视角也动，首先获取滚动值：

```js
/**
 * Scroll
 */
let scrollY = window.scrollY;

window.addEventListener('scroll', () => {
	scrollY = window.scrollY;
});
```

接下来在`tick`中修改相机，这里要计算一下距离：

```js
const tick = () => {
	//...
    // Animate camera
    camera.position.y = - scrollY / sizes.height * objectsDistance;
	// ...
};
```

就是除以视口高度然后乘刚刚的距离就是物体的移动距离

#### 修改物体x

这个简单就是让物体不挡住文字即可：

```js
mesh1.position.x = 2;
mesh2.position.x = -2;
mesh3.position.x = 2;
```

#### 光标

接下来添加光标相关，通过鼠标控制物体移动：

```js
/**
 * Cursor
 */
const cursor = {
	x: 0,
	y: 0,
};

window.addEventListener('mousemove', (event) => {
	cursor.x = event.clientX / sizes.width - 0.5;
	cursor.y = event.clientY / sizes.height - 0.5;
});
```

这样值左右上下移动的时候是正负交替，然后修改相机：

```js
const tick = () => {
	//...
	const parallaxX = cursor.x;
	const parallaxY = -cursor.y;
	camera.position.x = parallaxX;
	camera.position.y = parallaxY;
    //...
}
```

现在移动物体会靠近，当然你会发现滚动不起作用了。

#### 修正问题

我们通过`Group`来解决这个问题，创建一个组：

```js
const cameraGroup = new THREE.Group();
scene.add(cameraGroup);
// Base camera
const camera = new THREE.PerspectiveCamera(
	35,
	sizes.width / sizes.height,
	0.1,
	100,
);
camera.position.z = 6;
cameraGroup.add(camera);
```

然后我们不再移动相机，而是移动组：

```js
const tick = () => {
	//...
	const parallaxX = cursor.x;
	const parallaxY = -cursor.y;
	cameraGroup.position.x = parallaxX;
	cameraGroup.position.y = parallaxY;
    //...
}
```

这样就可以滚动，同时也可以通过鼠标来做移动。

#### 顺滑效果

现在我们移动是直接修改过去，我们让其每帧的时候移动一点，更加顺滑，越近速度越慢：

```js
	cameraGroup.position.x += (parallaxX - cameraGroup.position.x) * 0.1;
	cameraGroup.position.y += (parallaxY - cameraGroup.position.y) * 0.1;
```

当然还有问题，如果是高频显示器，屏幕刷新率很高，这个公式就会被一直调用，速度会变快，因此我们修改一下：

```js
const clock = new THREE.Clock();
let previousTime = 0;
const tick = () => {
	const elapsedTime = clock.getElapsedTime();
    const deltaTime = elapsedTime - previousTime;
    previousTime = elapsedTime;

	// Animate camera
	camera.position.y = (-scrollY / sizes.height) * objectsDistance;

	const parallaxX = cursor.x * 0.5;
	const parallaxY = -cursor.y * 0.5;
	cameraGroup.position.x += (parallaxX - cameraGroup.position.x) * 5 * deltaTime;
	cameraGroup.position.y += (parallaxY - cameraGroup.position.y) * 5 * deltaTime;
}
```

#### 添加粒子

现在背景都是黑的，不好看，我们加点粒子加点深度：

```js
/**
 * Particles
 */
const particlesCount = 200;
const positions = new Float32Array(particlesCount * 3);

for (let i = 0; i < particlesCount; i++) {
	const i3 = i * 3;
	positions[i3 + 0] = (Math.random() - 0.5) * 10;
	positions[i3 + 1] =
		objectsDistance * 0.5 -
		Math.random() * objectsDistance * sectionMeshes.length;
	positions[i3 + 2] = (Math.random() - 0.5) * 10;
}
const particlesGeometry = new THREE.BufferGeometry();
particlesGeometry.setAttribute(
	'position',
	new THREE.BufferAttribute(positions, 3),
);
const particlesMaterial = new THREE.PointsMaterial({
	size: 0.03,
	sizeAttenuation: true,
	color: parameters.materialColor,
});
const particles = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particles);
```

这样背景就有点点星光的样子：

![image-20250206221544728](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250206221544728.png)

当然颜色也要修改：

```js
gui.addColor(parameters, 'materialColor').onChange(() => {
	material.color.set(parameters.materialColor);
	particlesMaterial.color.set(parameters.materialColor);
});
```

#### 简单旋转

当我们旋转到对应物体，我们让物体旋转，先得到对应物体：

```js
let scrollY = window.scrollY;
let currentSection = 0;

window.addEventListener('scroll', () => {
	scrollY = window.scrollY;

    const newSection = Math.round(scrollY / sizes.height);

    if (newSection !== currentSection) {
        currentSection = newSection;
        console.log(currentSection);
    }
});
```

这样我们就能获取，接下来还是使用`gsap`库来做：

```js
window.addEventListener('scroll', () => {
	scrollY = window.scrollY;

	const newSection = Math.round(scrollY / sizes.height);

	if (newSection !== currentSection) {
		currentSection = newSection;

		gsap.to(sectionMeshes[currentSection].rotation, {
			duration: 1.5,
			ease: 'power2.inOut',
			x: '+=6',
			y: '+=3',
            z: '+=1.5'
		});
	}
});
```

当然你会发现不起作用，因为`tick`里面我们需要修正：

```js
	// Animate meshes
	for (const mesh of sectionMeshes) {
		mesh.rotation.x += deltaTime * 0.1;
		mesh.rotation.y += deltaTime * 0.12;
	}
```

这样就完成了，可以多学学，下面是完整代码：

```js
import * as THREE from 'three';
import GUI from 'lil-gui';
import gsap from 'gsap';

/**
 * Debug
 */
const gui = new GUI();

const parameters = {
	materialColor: '#ffeded',
};

gui.addColor(parameters, 'materialColor').onChange(() => {
	material.color.set(parameters.materialColor);
	particlesMaterial.color.set(parameters.materialColor);
});

// Texture
const textureLoader = new THREE.TextureLoader();
const gradientTexture = textureLoader.load('textures/gradients/3.jpg');
gradientTexture.magFilter = THREE.NearestFilter;
/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

/**
 * Objects
 */
const objectsDistance = 4;
const material = new THREE.MeshToonMaterial({
	color: parameters.materialColor,
	gradientMap: gradientTexture,
});
const mesh1 = new THREE.Mesh(new THREE.TorusGeometry(1, 0.4, 16, 60), material);
const mesh2 = new THREE.Mesh(new THREE.ConeGeometry(1, 2, 32), material);
const mesh3 = new THREE.Mesh(
	new THREE.TorusKnotGeometry(0.8, 0.35, 100, 161),
	material,
);
mesh1.position.y = -objectsDistance * 0;
mesh2.position.y = -objectsDistance * 1;
mesh3.position.y = -objectsDistance * 2;

mesh1.position.x = 2;
mesh2.position.x = -2;
mesh3.position.x = 2;

scene.add(mesh1, mesh2, mesh3);

const sectionMeshes = [mesh1, mesh2, mesh3];

/**
 * Particles
 */
const particlesCount = 200;
const positions = new Float32Array(particlesCount * 3);

for (let i = 0; i < particlesCount; i++) {
	const i3 = i * 3;
	positions[i3 + 0] = (Math.random() - 0.5) * 10;
	positions[i3 + 1] =
		objectsDistance * 0.5 -
		Math.random() * objectsDistance * sectionMeshes.length;
	positions[i3 + 2] = (Math.random() - 0.5) * 10;
}
const particlesGeometry = new THREE.BufferGeometry();
particlesGeometry.setAttribute(
	'position',
	new THREE.BufferAttribute(positions, 3),
);
const particlesMaterial = new THREE.PointsMaterial({
	size: 0.03,
	sizeAttenuation: true,
	color: parameters.materialColor,
});
const particles = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particles);
/**
 * Lights
 */
const directionalLight = new THREE.DirectionalLight('#ffffff', 1);
directionalLight.position.set(1, 1, 0);
scene.add(directionalLight);

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
 * Cursor
 */
const cursor = {
	x: 0,
	y: 0,
};

window.addEventListener('mousemove', (event) => {
	cursor.x = event.clientX / sizes.width - 0.5;
	cursor.y = event.clientY / sizes.height - 0.5;
});

/**
 * Camera
 */
// Group
const cameraGroup = new THREE.Group();
scene.add(cameraGroup);
// Base camera
const camera = new THREE.PerspectiveCamera(
	35,
	sizes.width / sizes.height,
	0.1,
	100,
);
camera.position.z = 6;
cameraGroup.add(camera);

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
	canvas: canvas,
	alpha: true,
});
renderer.setClearAlpha(1);
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Scroll
 */
let scrollY = window.scrollY;
let currentSection = 0;

window.addEventListener('scroll', () => {
	scrollY = window.scrollY;

	const newSection = Math.round(scrollY / sizes.height);

	if (newSection !== currentSection) {
		currentSection = newSection;

		gsap.to(sectionMeshes[currentSection].rotation, {
			duration: 1.5,
			ease: 'power2.inOut',
			x: '+=6',
			y: '+=3',
			z: '+=1.5',
		});
	}
});

/**
 * Animate
 */
const clock = new THREE.Clock();
let previousTime = 0;
const tick = () => {
	const elapsedTime = clock.getElapsedTime();
	const deltaTime = elapsedTime - previousTime;
	previousTime = elapsedTime;

	// Animate camera
	camera.position.y = (-scrollY / sizes.height) * objectsDistance;

	const parallaxX = cursor.x * 0.5;
	const parallaxY = -cursor.y * 0.5;
	cameraGroup.position.x +=
		(parallaxX - cameraGroup.position.x) * 5 * deltaTime;
	cameraGroup.position.y +=
		(parallaxY - cameraGroup.position.y) * 5 * deltaTime;

	// Animate meshes
	for (const mesh of sectionMeshes) {
		mesh.rotation.x += deltaTime * 0.1;
		mesh.rotation.y += deltaTime * 0.12;
	}

	// Render
	renderer.render(scene, camera);

	// Call tick again on the next frame
	window.requestAnimationFrame(tick);
};

tick();
```

### Physics物理特效

本节我们要介绍Three里面的物理学，Github：[three-journey](https://github.com/zhenghui-su/three-journey)

#### 初始代码

js文件初始代码：

```js
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'

/**
 * Debug
 */
const gui = new GUI()

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const cubeTextureLoader = new THREE.CubeTextureLoader()

const environmentMapTexture = cubeTextureLoader.load([
    '/textures/environmentMaps/0/px.png',
    '/textures/environmentMaps/0/nx.png',
    '/textures/environmentMaps/0/py.png',
    '/textures/environmentMaps/0/ny.png',
    '/textures/environmentMaps/0/pz.png',
    '/textures/environmentMaps/0/nz.png'
])

/**
 * Test sphere
 */
const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 32, 32),
    new THREE.MeshStandardMaterial({
        metalness: 0.3,
        roughness: 0.4,
        envMap: environmentMapTexture,
        envMapIntensity: 0.5
    })
)
sphere.castShadow = true
sphere.position.y = 0.5
scene.add(sphere)

/**
 * Floor
 */
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10),
    new THREE.MeshStandardMaterial({
        color: '#777777',
        metalness: 0.3,
        roughness: 0.4,
        envMap: environmentMapTexture,
        envMapIntensity: 0.5
    })
)
floor.receiveShadow = true
floor.rotation.x = - Math.PI * 0.5
scene.add(floor)

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 2.1)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.camera.left = - 7
directionalLight.shadow.camera.top = 7
directionalLight.shadow.camera.right = 7
directionalLight.shadow.camera.bottom = - 7
directionalLight.position.set(5, 5, 5)
scene.add(directionalLight)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(- 3, 3, 3)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
```

#### 物理计算库

为了方便，我们应该使用库，这边列出几个物理库：

- 3D物理库：

  - Ammo.js

  - Cannon.js

  - Oimo.js

- 2D物理库：

  - Matter.js

  - P2.js

  - Planck.js
  - Box2D.js

接下来是将Three与物理库结合，我们选择`Cannon.js`，比较简单。

你可以安装一下`npm i --save cannon`，然后引入：

```js
import CANNON from 'cannon'
```

#### 创建物理世界

我们现在拥有地面和球体，接下来创建物理世界，让他动起来：

```js
/**
 * Physics
 */
const world = new CANNON.World();
world.gravity.set(0, -9.82, 0);
```

我们创建物理世界并且改变重力，这样就能模拟真实世界。注意的是我们是向下的重力，因此是y轴，在Three中y是向下的。

接下来需要在这个物理世界中加入球体，需用到`Body`，在创建它之前我们需要有`Shape`形状，这就和Three的网格Mesh一样，需要材质和立方体：

```js
// Sphere
const sphereShape = new CANNON.Sphere(0.5);
```

然后通过`Shape`创建`Body`：

```js
const sphereBody = new CANNON.Body({
	mass: 1,
	position: new CANNON.Vec3(0, 3, 0),
	shape: sphereShape,
});
```

然后将其加入到世界中：

```js
world.addBody(sphereBody);
```

当然现在没反应，是因为我们需要让物理世界更新，因此可以让他自行更新。

#### 更新物理世界

更新物理世界我们需要使用`step`函数，我们需要每一帧更新因此在`tick`中写：

```js
const clock = new THREE.Clock();
let oldElapsedTime = 0;
const tick = () => {
	const elapsedTime = clock.getElapsedTime();
    const deltaTime = elapsedTime - oldElapsedTime;
    oldElapsedTime = elapsedTime;

	// Update physics world
	world.step(1 / 60, deltaTime, 3);
	//...
};
```

在`step`函数中我们需要提供三个参数：

- 固定时间戳，我们一般设置1/60，即60帧分之1
- 从上一步开始经过的时间，我们计算得出
- 在出现问题的时候比如物理延迟的时候，环境可以提供多少次迭代

当然还是看不到效果，你可以通过打印`sphereBody.position.y`来查看物体值。

接下来就是将物理世界的坐标传给Three的物体坐标：

```js
    sphere.position.copy(sphereBody.position);
```

这样就能看到物体掉下来了，当然你也可以单独赋值坐标x、y、z。

#### 创建物理地面

球体目前会直接穿过地面，因此我们需要在物理世界中创建这个地面让他不掉下来：

```js
// Floor
const floorShape = new CANNON.Plane();
const floorBody = new CANNON.Body({
	mass: 0,
	shape: floorShape,
});
world.addBody(floorBody);
```

`mass`参数为0就是代表这个物体固定不会动，还有Body的参数也可以通过属性和函数来添加，如`floorBody.mass = 0`和`floorBody.addShape(floorShape)`

当然你现在会看到物体掉的位置不太对，其实是因为我们如果不旋转Three的地面，就会发现地面的方向是竖着的，因此这里物理世界的地面也是这样，我们需要旋转。

不过在`Cannon`中旋转较为困难，因为它只支持四元数，通过`setFromAxisAngle`，第一个参数是轴它是Vec3对象，第二个参数是旋转角度：

```js
floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(-1, 0, 0), Math.PI * 0.5);
```

这样物体就正正好掉到我们的地面上了，注意如果没出现可能是你的旋转方向错了。

#### 添加材质模拟弹性

现在球体掉下来的时候没有弹性，我们给他添加上物理材质：

```js
// Materials
const concreteMaterial = new CANNON.Material('concrete');
const plasticMaterial = new CANNON.Material('plastic');
```

接下来是创建接触材质，模拟混凝土和塑料碰撞的样子：

```js
const concretePlasticContactMaterial = new CANNON.ContactMaterial(
	concreteMaterial,
	plasticMaterial,
	{
		friction: 0.1, // 摩擦力
		restitution: 0.7, // 回弹系数
	},
);
world.addContactMaterial(concretePlasticContactMaterial)
```

当然现在结果还是没有变化，因为我们需要在创建`Body`的时候指定材质：

```js
const sphereBody = new CANNON.Body({
	//...
    material: plasticMaterial,
});
//...
const floorBody = new CANNON.Body({
	//...
    material: concreteMaterial,
});
```

这样子就能看到球体弹跳了，看起来不错。

#### 简化代码

我们会发现这个流程代码有点多，因此我们接下来简化代码，只使用一个：

```js
const defaultMaterial = new CANNON.Material('default');
const defaultContactMaterial = new CANNON.ContactMaterial(
	defaultMaterial,
	defaultMaterial,
	{
		friction: 0.1, // 摩擦力
		restitution: 0.7, // 回弹系数
	},
);
world.addContactMaterial(defaultContactMaterial);
// 下面的Body的Material也改
```

你会发现效果没有差别，不过我们还可以不给Body添加材质，直接给世界添加默认材质

```js
world.defaultContactMaterial = defaultContactMaterial;
```

你会发现是一样的，这样就可以让我们的世界只使用一个，在大部分情况下够用了。

#### 控制物体

接下来我们可以控制物体相关，如下：

- 通过`applyForce`可以给物体施加一个力，像真实世界一样

- 通过`applyImpulse`可以给物体施加一个冲量，它增加的是物体的速度

- 通过`applyLocalForce`可以给某个坐标施加局部力

- 通过`applyLocalImpulse`可以给某个坐标施加局部冲量

我们使用施加力试试，将物体推向某个方向，同时选择施加力的点为中心：

```js
sphereBody.applyLocalForce(
	new CANNON.Vec3(150, 0, 0),
	new CANNON.Vec3(0, 0, 0),
);
```

通过它我们可以模拟风，让它吹着物体跑：

```js
const tick = () => {
	//...
	// Update physics world
	sphereBody.applyForce(new CANNON.Vec3(-0.5, 0, 0), sphereBody.position);

	world.step(1 / 60, deltaTime, 3);
	//...
}
```

你会看到物体先朝某个方向动，然后停止朝相反的方向运动。

#### 创建函数

代码长度有点多，我们把球体的`Body`和Three中的球体删除，然后创建一个生成函数

```js
/**
 * Utils
 */
const createSphere = (radius, position) => {
	// Three.js mesh
	const mesh = new THREE.Mesh(
		new THREE.SphereGeometry(radius, 20, 20),
		new THREE.MeshStandardMaterial({
			metalness: 0.3,
			roughness: 0.4,
			envMap: environmentMapTexture,
		}),
	);
	mesh.castShadow = true;
	mesh.position.copy(position);
	scene.add(mesh);

	// Cannon.js body
	const shape = new CANNON.Sphere(radius);
	const body = new CANNON.Body({
		mass: 1,
		position: new CANNON.Vec3(0, 3, 0),
		shape,
		material: defaultMaterial,
	});
	body.position.copy(position);
	world.addBody(body);
};
```

然后调用它：

```js
createSphere(0.5, { x: 0, y: 3, z: 0 });
```

接下来是通过一个数组包含所需更新的对象，然后更新：

```js
const objectsToUpdate = [];
const createSphere = (radius, position) => {
	//...
    // Save in objects to update
    objectsToUpdate.push({
        mesh,
        body
    });
};
//...
const tick = () => {
    //...
    for (const object of objectsToUpdate) {
        object.mesh.position.copy(object.body.position);
    }
    //...
};
```

这样我们就方便了，比如我在创建一个：

```js
createSphere(0.5, { x: 2, y: 3, z: 2 });
```

接下来我们将东西添加到gui，因此需要一个对象：

```js
/**
 * Debug
 */
const gui = new GUI();
const debugObject = {};
debugObject.createSphere = () => {
	createSphere(0.5, { x: 0, y: 3, z: 0 });
};
gui.add(debugObject, 'createSphere');
```

这样点击右上角的按钮就可以添加一个球体了，我们在弄点随机位置：

```js
debugObject.createSphere = () => {
	createSphere(Math.random() * 0.5, {
		x: (Math.random() - 0.5) * 3,
		y: Math.random() * 3,
		z: (Math.random() - 0.5) * 3,
	});
};
```

接下来点击会出现大小和位置随机的球体，看起来不错。

#### 优化代码

接下来我们优化一下，radius通过缩放来设置半径。

```js
const sphereGeometry = new THREE.SphereGeometry(1, 20, 20);
const sphereMaterial = new THREE.MeshStandardMaterial({
	metalness: 0.3,
	roughness: 0.4,
	envMap: environmentMapTexture,
});
const createSphere = (radius, position) => {
	// Three.js mesh
	const mesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
	mesh.castShadow = true;
	mesh.scale.set(radius, radius, radius);
    //...
}
```

这样用的都是一个，性能优化一下。

#### 练习：盒子Box

接下来是练习，我们用Box盒子而不是球体，你可以自己练习一下流程：

```js
// Create box
const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
const boxMaterial = new THREE.MeshStandardMaterial({
	metalness: 0.3,
	roughness: 0.4,
	envMap: environmentMapTexture,
});
const createBox = (width, height, depth, position) => {
	// Three.js mesh
	const mesh = new THREE.Mesh(boxGeometry, boxMaterial);
	mesh.castShadow = true;
	mesh.scale.set(width, height, depth);
	mesh.position.copy(position);
	scene.add(mesh);

	// Cannon.js body
	const shape = new CANNON.Box(
		new CANNON.Vec3(width * 0.5, height * 0.5, depth * 0.5),
	);
	const body = new CANNON.Body({
		mass: 1,
		position: new CANNON.Vec3(0, 3, 0),
		shape,
		material: defaultMaterial,
	});
	body.position.copy(position);
	world.addBody(body);

	// Save in objects to update
	objectsToUpdate.push({
		mesh,
		body,
	});
};
```

其实没区别，唯一注意的是Cannon的Box是从中心点计算长宽高，因此只需一半。

然后加到gui中：

```js
debugObject.createBox = () => {
	createBox(Math.random(), Math.random(), Math.random(), {
		x: (Math.random() - 0.5) * 3,
		y: Math.random() * 3,
		z: (Math.random() - 0.5) * 3,
	});
};
gui.add(debugObject, 'createBox');
```

创建成功了，看起来不错：

![image-20250212184428855](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250212184428855.png)

不过它的物理特性有点怪，如果一个盒子的部分撞到另一个应该旋转，需要调整一下：

```js
const tick = () => {
	//...
	for (const object of objectsToUpdate) {
		object.mesh.position.copy(object.body.position);
		object.mesh.quaternion.copy(object.body.quaternion);
	}
	//...
}
```

通过直接复制四元数即可解决了，这样盒子就会是东倒西歪的：

![image-20250212184753371](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250212184753371.png)

#### 性能

需要注意，Cannon是默认通过监测一个对象是否碰撞另一个，这样一个一个的，因此对象过多的时候会对CPU压力大，这个过程是叫做原始广义监测。

因此我们还可以使用其他广义监测，下面是列举：

- NativeBroadphase：默认的原始广义监测，每个Body都监测是否碰撞另一个
- GridBroadphase：网格化广义监测，就是分出网格，当一个物体要碰撞，就会和同一个网格的其他物体进行检测测试，因此性能较好。唯一的问题是如果物体速度过快可能检测会出现bug。
- SAPBroadphase（Sweep And Prune）：扫掠和修剪法，它会在轴上进行测试，它比网格也较好，唯一问题是物体运动过快可能会碰不到。

让我们试试吧，这样能提高性能：

```js
world.broadphase = new CANNON.SAPBroadphase(world);
```

当然这样不错，不过有部分物体它不动了就应该不用测了，即让它休眠：

```js
world.allowSleep = true;
```

#### 事件

接下来我们来看看事件，我们可以给球体的碰撞添加上声音：

```js
const hitSound = new Audio('/sounds/hit.mp3');
const playHitSound = () => {
	hitSound.play();
};
```

然后我们在创建物体后监听事件：

```js
const createBox = (width, height, depth, position) => {
	//...
	body.addEventListener('collide', playHitSound)
	//...
}
```

这样Box的盒子碰撞的时候就会听到声音，不过你会听到声音不太对，是连续的而不是叠加的，尤其是多个物体同时碰撞，我们修正一下：

```js
const playHitSound = () => {
	hitSound.currentTime = 0; // 重置音频播放位置
	hitSound.play();
};
```

不过这样的声音看起来有点多并且嘈杂，因此我们可以检测只有碰撞力度足够才有声：

```js
const playHitSound = (collision) => {
	// 获取冲击力
	const impactStrength = collision.contact.getImpactVelocityAlongNormal();

	if (impactStrength > 1.5) {
		hitSound.currentTime = 0; // 重置音频播放位置
		hitSound.play();
	}
};
```

不过这个声音太规律了，我们可以调整一下音量：

```js
const playHitSound = (collision) => {
	// 获取冲击力
	const impactStrength = collision.contact.getImpactVelocityAlongNormal();

	if (impactStrength > 1.5) {
		hitSound.volume = Math.random(); // 设置随机音量
		hitSound.currentTime = 0; // 重置音频播放位置
		hitSound.play();
	}
};
```

#### 删除物体

有些时候太多物体，我们可以创建一个重置按钮：

```js
debugObject.reset = () => {
	for (const object of objectsToUpdate) {
		// Remove body
		object.body.removeEventListener('collide', playHitSound);
		world.remove(object.body);

		// Remove mesh
		scene.remove(object.mesh);
	}
	// 清空对象数组
	objectsToUpdate.splice(0, objectsToUpdate.length);
};
gui.add(debugObject, 'reset');
```

#### 设置约束

你还可以给物体之间设置约束，如下：

- HingeConstraint：铰链约束，就像一扇铰链门一样转动
- DistanceConstraint：距离约束，让物体之间保持相同的距离
- LockConstraint：固定约束，就是绑定成一个整体，同时旋转移动
- PointToPointConstraint：点对点约束，就像在特定位置粘合东西一样

#### 更多

Cannon还有很多，类，事件等等，你可以查看Github的官方文档，不过遗憾的是它已经很久没有更新了，幸运的是有人fork并且修复问题添加一些更新。

你可以通过`npm i --save cannon-es`来下载，Github地址：[cannon-es](https://github.com/pmndrs/cannon-es)

当然你还可以使用`Ammo.js`，它通过Bullet和c++来编写，Github地址：[ammo.js](https://github.com/kripken/ammo.js)，它还支持WebAssembly，它较难理解，不过它支持的东西也更多。

或者还有`Physijs`，它理念是无需先创建网格再添加物体，只需要创建它的网格，它帮你两个事情都做了，不过出错时不容易找出问题，Github地址：[physijs](https://github.com/chandlerprall/Physijs)

在后面我们通过react来创建Three项目时，还可以使用别的物理库。

### Imported Models导入模型

接下来聊如何导入外部的模型文件，如 GLTF，后面我们会学习如何自己创建模型。

3D模型的文件格式有很多，因为加载文件的时候有不同的需要，有些时候需要加密，有些时候需要专门针对某个软件等等，有的格式很轻便但可能会少一些数据，有的格式很大比较全面但可能会导致网站卡顿，有的格式是开源的，有的格式是二进制因此无法修改等等，你还可以自己导出一个格式的数据。

常见的有`OBJ`、`FBX`、`STL`、`PLY`、`COLLADA`、`3DS`、`GLTF`，目前`GLTF`能满足我们大部分的需求，它的发明者同样也是OpenGL、WebGL的开发者，因此很适合我们，该格式正在成为一种标准。

它还提供了一些gltf的样本模型库：[glTF-Sample-Assets](https://github.com/KhronosGroup/glTF-Sample-Assets)，你可以免费使用。

#### glTF的不同形式

##### glTF

glTF也是有各个形式的，首先是glTF，它包含三个文件：

- glTF：存储了相机，资源引入等数据
- bin：二进制数据，类似一个带有顶点相关数据的几何体
- png：纹理图片

##### glTF-Binary

它只有一个文件：`glb`格式，它包含了上面的所有数据，它是二进制因此加载更容易，唯一的问题是无法修改数据，比如纹理。

##### glTF-Draco

它和glTF差别不大，主要区别是它的大小更加轻便。

##### glTF-Embedded

它也只有一个文件即`gltf`，不过它将纹理和Buffer数据直接嵌入到这里了。不过我们一般不使用，它的体积是最大的。

#### 导入鸭子GLTF

GLTF是比较真实的模型，因此一般采用PBR材质。

接下来我们加载GLTF，首先是导入GLTFLoader，需要单独导入：

```js
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
```

然后创建加载器，随后加载：

```js
/**
 * Models
 */
const gltfLoader = new GLTFLoader();
gltfLoader.load(
	'/models/Duck/glTF/duck.gltf',
	(gltf) => {
		console.log('success');
		console.log(gltf);
	},
	(progress) => {
		console.log(progress);
	},
	(error) => {
		console.log(error);
	},
);
```

当然，我们现在用不到后面两个回调，可以删除，然后我们可以看看`gltf`参数：

![image-20250213005643910](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250213005643910.png)

- animations：动画相关
- asset：资源相关
- cameras：相机相关
- parser：解析器相关
- scene：单个场景
- scenes：多个场景，这代表你可以导出多个场景，但只有一个文件
- userData：用户数据

`scene`是一个Group，因此我们可以访问它的children即对象组，再查看它的children就会发现相机和网格：

![image-20250213010052251](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250213010052251.png)

我们找到模型在哪了，我们可以直接添加组内的所有子元素或者直接添加组：

```js
gltfLoader.load('/models/Duck/glTF/Duck.gltf', (gltf) => {
	scene.add(gltf.scene.children[0]);
});
```

成功，看起来很不错：

![image-20250213010455763](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250213010455763.png)

当然你还可以试试其他的文件夹的格式，除了Draco都是可以的，这个我们后面解释。

#### 导入FlightHelmet

我们试试另一个模型：

```js
gltfLoader.load('/models/FlightHelmet/glTF/FlightHelmet.gltf', (gltf) => {
	scene.add(gltf.scene.children[0]);
});
```

你会发现显示不全，可能是眼镜或者别的，我们没有完全的头盔，原因很简单，我们只加载了一部分，这个gltf有很多元素，因此我们需要循环添加：

```js
	for (const child of gltf.scene.children) {
        scene.add(child);
    }
```

好像没问题？不过查看会发现它们是乱的或者少了，这是因为每次添加的时候会自动移除这个场景，解决方法有两个。

首先是`while`然后判断：

```js
	while (gltf.scene.children.length) {
		const child = gltf.scene.children[0];
		scene.add(child);
	}
```

这样不错，不过有些人不想使用while，第二个方案是使用新数组而不是使用原来的：

```js
    const children = [...gltf.scene.children];
    for (const child of children) {
        scene.add(child);
    }
```

这两个方法都可以解决，看起来不错：

![image-20250213011454690](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250213011454690.png)

当然这是为了练习，我们还可以直接添加，因为`gltf.scene`是一个Group：

```js
gltfLoader.load('/models/FlightHelmet/glTF/FlightHelmet.gltf', (gltf) => {
    scene.add(gltf.scene);
});
```

#### Draco压缩

让我们回到刚刚的鸭子模型，加载Draco：

```js
gltfLoader.load('/models/Duck/glTF-Draco/Duck.gltf', (gltf) => {
	scene.add(gltf.scene.children[0]);
});
```

会发现报错，因为现在还不支持Draco，我们需要采用专门的`DRACOLoader`：

```js
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
//...
const dracoLoader = new DRACOLoader();
```

Draco还支持WebAssembly和Worker，因此我们可以让它更快，找到`node_modules\three\examples\jsm\libs\draco`文件夹复制到静态文件夹，它里面包含了wasm文件，这样就会在不同线程中运行。

让我们指定DracoLoader的解码路径：

```js
dracoLoader.setDecoderPath('/draco/');
```

当然现在模型还是不能使用，我们需要设置gltfLoader的Draco加载器：

```js
gltfLoader.setDRACOLoader(dracoLoader);
```

这样就成功导入了，并且加载速度更快体积更小：

![image-20250213012921701](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250213012921701.png)

我们使用DracoLoader首先需要导入，然后可以使用解码类，使用Draco的场景就是如果有大型文件，通过它能够减少很多的体积。

#### 加载动画

gltf还有一个好处就是可以加载动画，我们加载一个狐狸模型：

```js
gltfLoader.load('/models/Fox/glTF/Fox.gltf', (gltf) => {
	scene.add(gltf.scene);
});
```

当然你会发现模型很大，我们需要解决，缩小一下即可：

```js
gltfLoader.load('/models/Fox/glTF/Fox.gltf', (gltf) => {
    gltf.scene.scale.set(0.025, 0.025, 0.025)
	scene.add(gltf.scene);
});
```

接下来我们如何处理动画呢？我们查看`gltf.animations`就会看到动画的数据。

我们需要创建动画混合器，它就像一个播放器，将动画的关键帧播放：

```js
let mixer;
gltfLoader.load('/models/Fox/glTF/Fox.gltf', (gltf) => {
    mixer = new THREE.AnimationMixer(gltf.scene);
    // 获取动画的动画片段动作
    const action = mixer.clipAction(gltf.animations[0]);
    // 播放
    action.play();

    gltf.scene.scale.set(0.025, 0.025, 0.025)
	scene.add(gltf.scene);
});
```

当然你会发现还不行，这是因为我们需要让他知道要更新，因此到`tick`：

```js
const clock = new THREE.Clock();
let previousTime = 0;
const tick = () => {
	const elapsedTime = clock.getElapsedTime();
	const deltaTime = elapsedTime - previousTime;
	previousTime = elapsedTime;

	// Update mixer
	if (mixer) { // 加载模型需要时间因此需要判断才能更新
		mixer.update(deltaTime);
	}
    //...
}
```

这样狐狸就会播放第一个动画片段，看起来不错。

#### Three.js Editor

最后说一下Three.js Editor，它是一个在线模型编辑网站，地址：[Editor](https://threejs.org/editor/)

你可以直接导入外部模型，它就像一个小型的3D软件，你可以查看等操作：

![image-20250213014647419](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250213014647419.png)

它看起来很棒，你还可以自己创建一些模型然后导出。

### Raycaster and Mouse Events光线投射器和鼠标事件

通过光线投射器可以用于不少场景，如测试是否命中，距离，是否相关等。

#### 初始代码

```js
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'

/**
 * Base
 */
// Debug
const gui = new GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Objects
 */
const object1 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    new THREE.MeshBasicMaterial({ color: '#ff0000' })
)
object1.position.x = - 2

const object2 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    new THREE.MeshBasicMaterial({ color: '#ff0000' })
)

const object3 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    new THREE.MeshBasicMaterial({ color: '#ff0000' })
)
object3.position.x = 2

scene.add(object1, object2, object3)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 3
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
```

#### 创建Raycaster

让我们试试创建，然后是创建光的起点以及它的方向，最后运用到投射器：

```js
/**
 * Raycaster
 */
const ratcaster = new THREE.Raycaster();
const rayOrigin = new THREE.Vector3(-3, 0, 0);
const rayDirection = new THREE.Vector3(10, 0, 0);
rayDirection.normalize();

ratcaster.set(rayOrigin, rayDirection);
```

当然现在没什么效果，因为我们还没开始投射。

#### 投射光线

我们有两种方式投射方式，就是一个测试单个对象或测试多个对象：

```js
const intersect = ratcaster.intersectObject(object2);
console.log(intersect);
const intersects = ratcaster.intersectObjects([object1, object2, object3]);
console.log(intersects);
```

当然你会发现单个对象输出也是数组，因为有可能你会多次穿过同一个物体。

`intersect`的参数结果如下：

- distance：离光线起点的距离长度
- face：立方体面向光线的朝向
- faceIndex：面向的索引
- object：立方体网格对象
- point：交点处
- uv：uv坐标

#### 移动的物体投射

如果物体是随时移动的，那么光线投射器就需要在每个tick中重新获取：

```js
const tick = () => {
	const elapsedTime = clock.getElapsedTime();

	// Animate objects
	object1.position.y = Math.sin(elapsedTime * 0.3) * 1.5;
	object2.position.y = Math.sin(elapsedTime * 0.4) * 1.5;
	object3.position.y = Math.sin(elapsedTime * 1.4) * 1.5;

	// Cast a ray
	const rayOrigin = new THREE.Vector3(-3, 0, 0);
	const rayDirection = new THREE.Vector3(1, 0, 0);
	rayDirection.normalize();

	ratcaster.set(rayOrigin, rayDirection);

    const objectsToTest = [object1, object2, object3]
    const intersects = ratcaster.intersectObjects(objectsToTest)
    console.log(intersects)

	// Update controls
	controls.update();

	// Render
	renderer.render(scene, camera);

	// Call tick again on the next frame
	window.requestAnimationFrame(tick);
};
```

这样就能获取到与光线相交的物体，我们将相交的涂成蓝色，没有的就红色：

```js
    for (const object of objectsToTest) {
		object.material.color.set('#ff0000');
	}

	for (const intersect of intersects) {
		intersect.object.material.color.set('#0000ff');
	}
```

可以看到相交的就变成蓝色了：

![image-20250216225608784](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250216225608784.png)

#### 测试鼠标悬停

让我们注释之前的光线投射器代码，让我们测试鼠标是否在物体上：

```js
/**
 * Mouse
 */
const mouse = new THREE.Vector2();

window.addEventListener('mousemove', (event) => {
	mouse.x = (event.clientX / sizes.width) * 2 - 1;
	mouse.y = -(event.clientY / sizes.height) * 2 + 1;
});
```

先获取鼠标位置，然后去tick中：

```js
const tick = () => {
	//...
	ratcaster.setFromCamera(mouse, camera);

	const objectsToTest = [object1, object2, object3];
	const intersects = ratcaster.intersectObjects(objectsToTest);

	for (const object of objectsToTest) {
		object.material.color.set('#ff0000');
	}
	for (const intersect of intersects) {
		intersect.object.material.color.set('#0000ff');
	}
	//...
}
```

这样鼠标悬停时就会变蓝，离开就变红色：

![image-20250216230733482](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250216230733482.png)

如果你只想测试最近的，它是按距离排序的，所以可以根据这个来操作。

#### 测试是否有悬停

我们可以测试一下是否有悬停，通过比对之前和现在的intersect：

```js
let currentIntersect = null;
const tick = () => {
	//...
	if (intersects.length) {
		if (!currentIntersect) {
			console.log('mouse enter');
		}
		currentIntersect = intersects[0];
	} else {
		if (currentIntersect) {
			console.log('mouse leave');
		}
		currentIntersect = null;
	}
    //...
}
```

这样鼠标悬停移入移出的时候就可以监听到了。

#### 鼠标点击事件

接下来我们测试鼠标的点击事件：

```js
window.addEventListener('click', () => {
	if (currentIntersect) {
		console.log('click on a sphere');
	}
});
```

这样只有在点击到球体的时候才会输出，是不是很像一个射击游戏。

如果你想知道是哪个球体被点击，也很简单：

```js
window.addEventListener('click', () => {
	if (currentIntersect) {
		switch (currentIntersect.object) {
			case object1:
				console.log('click on object 1');
				break;
			case object2:
				console.log('click on object 2');
				break;
			case object3:
				console.log('click on object 3');
				break;
		}
	}
});
```

#### 模型测试

我们刚刚用的都是网格，接下来我们换成模型，其实也没差别：

```js
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
//...
/**
 * Models
 */
const gltfLoader = new GLTFLoader();
gltfLoader.load('/models/Duck/glTF-Binary/Duck.glb', (gltf) => {
	gltf.scene.position.y = -1.2;
	scene.add(gltf.scene);
});
/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight('#ffffff', 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight('#ffffff', 0.5);
directionalLight.position.set(1, 2, 3);
scene.add(directionalLight);
```

接下来就是，鼠标悬停时，鸭子变大，离开鸭子变小，在tick中，先获取：

```js
	const modelIntersects = ratcaster.intersectObject(gltf.scene);
```

当然会发现问题，首先是gltf不在作用域，其次是gltf加载会耗时，因此我们需要解决：

```js
let model = null;
const gltfLoader = new GLTFLoader();
gltfLoader.load('/models/Duck/glTF-Binary/Duck.glb', (gltf) => {
	model = gltf.scene;
	model.position.y = -1.2;
	scene.add(model);
});
//...
const tick = () => {
    //...
    if (model) {
	    const modelIntersects = ratcaster.intersectObject(model);
    }
    //...
}
```

注意我们使用了单个对象，因为模型是一个组，这两个方法都会默认调用递归来访问子元素，因此不需要担心获取不到网格，你还可以通过第二个参数控制递归是否开启。

接下来就是改变鸭子的缩放：

```js
if (model) {
		const modelIntersects = ratcaster.intersectObject(model);
		if (modelIntersects.length) {
			model.scale.set(1.2, 1.2, 1.2);
		} else {
			model.scale.set(1, 1, 1);
		}
	}
```

这样悬停的时候就会变大，离开就会变小。

### Custom Model With Blender 用Blender制作模型

本节我们学习如何用Blender制作自己的模型，官网下载：[blender](https://www.blender.org/download/)

当然还有许多3D软件，如C4D，我们选择Blender首先是因为它免费，性能不错，文件体积很小，支持大多数操作系统，社区庞大，操作简单等原因。

打开后根据所需设置，可以调整中文，然后界面UI如下：

![image-20250217150031976](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250217150031976.png)

我们分几个区域：

- 3D视图区域：中间的模型展示区
- 时间轴：下面的时间轴一般用于制作动画
- 大纲区域：右上方的模型大纲
- 属性区域：模型的具体属性

#### 创建3D视图和区域

点击左下角的小图标创建一个新的3D视图：

![image-20250217150805019](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250217150805019.png)

接下来就是创建新区域，首先分割现有的区域，将鼠标移动到区域最左边，看到光标切割

![image-20250217151126857](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250217151126857.png)

当然还可以分割出更多，还可以垂直分割，随意发挥：

![image-20250217151412762](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250217151412762.png)

然后我们将几个区域合并，只需要在区域的边角拖动，方向朝要减除的区域即可：

![image-20250217151748106](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250217151748106.png)

#### 控制视图

##### 旋转、放大、平移

你可以通过按下鼠标中键即按下滚轮拖动来控制围绕视点旋转，还可以通过Shift+滚动来平移视图，还可以滚动来放大缩小视图，通过它我们就能找到适合的角度，自己试试。

你还可以通过这里来控制它们：

![image-20250217153230461](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250217153230461.png)

你有可能遇到无法放大的问题，这是因为视角的原因导致，如下：

![image-20250217153610743](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250217153610743.png)

通过ctrl+shift+鼠标中键按下即可无限制移动，即可解决视角问题。

##### 视图导航

你可以通过shift+反引号即`符号进入视图导航，还可以通过左上角编辑-偏好设置-键盘映射，随后搜索视图导航，更改你想要的快捷方式：

![image-20250217154324195](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250217154324195.png)

启动它有点像第一人称一样，光标如下，退出只需左键按一下即可：

![image-20250217154535596](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250217154535596.png)

在这个模式下，还可以通过方向键来放大缩小平移。

##### 视图相机切换

你可以通过小键盘上的5来切换一下模式，查看左上角，这样就不是透视视图了：

![image-20250217154938285](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250217154938285.png)

##### 特定轴

我们可以通过小键盘1、3、7分别控制相机放到Y、X、Z轴上，通过Ctrl+数字可以控制放到相反的对应轴上，你也可以点击右上角小图标的字符切换：

![image-20250217155940857](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250217155940857.png)

值得注意的是在Blender中默认是Z轴朝上的，不用担心，这可以随意改变。

##### 摄像机视角

通过小键盘的0可以切换到摄像机视角，来看看自己的模型怎么样：

![image-20250217160134153](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250217160134153.png)

##### 重置

如果你控制视图后找不到原来的模型了，通过Shift+C即可重置，对准场景：

![image-20250217160306580](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250217160306580.png)

##### 聚焦

你可能会遇到需要聚焦某个东西，先点击该东西，然后按下小键盘的句号即可聚集：

![image-20250217160446896](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250217160446896.png)

这里不局限于物体模型，还可以是光源等。

##### 关注并隐藏其他

如果你只想关注某个物体，而不想看别的，点击它然后按下斜杠即除号：

![image-20250217160935181](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250217160935181.png)

会发现光源和小物体都没了。

#### 控制物体

你可以点击某个物体选中它，也可以通过Shift+点击选中多个物体，会有颜色轮廓：

![image-20250217161334544](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250217161334544.png)

你还可以重复Shift+点击来取消刚刚的选中。

当你点击某个物体，然后不小心再点击选错，通过Ctrl+Z来撤销之前的操作。

如果要选中所有，通过键盘A键即All即可选中所有物体，再按就是取消选中。

你还可以通过按B来画框选中，或者按C来画圆选中物体，圆通过滚轮控制大小。

#### 控制物体对象

##### 创建物体

让我们创建物体，首先是鼠标在视图区域，然后Shift+A创建：

![image-20250217162306694](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250217162306694.png)

选择UV球即经纬球，被立方体挡住了。

##### 删除物体

我们点击立方体，然后按X去除它：

![image-20250217162451030](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250217162451030.png)

##### 创建属性控制

在创建的时候，左下角会出现控制这个球体的属性：

![image-20250217162617090](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250217162617090.png)

通过它来修改球的各项东西，如果找不到可以按下F9来显示它，部分键盘是Fn+F9。

##### 隐藏物体

上面我们知道通过/来只关注一个，还可以通过H键来只隐藏一个物体：

![image-20250217163122284](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250217163122284.png)

还可以通过Alt+H来显示所有隐藏的物体，有的键盘可能是Option+H。

要隐藏未选中的对象可以通过Shift+H，显示就用Alt+H即可。

如果发现无法显示物体，可能是键盘冲突，改一下映射或者点击大纲的眼睛即可显示：

![image-20250217164822933](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250217164822933.png)

##### 物体调整

选中物体，然后通过左边菜单来控制物体移动，如果没菜单按T即可显示：

![image-20250217165005820](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250217165005820.png)

这三个分别是移动、旋转、缩放，当然还有快捷键，G调整位置，R调整选择，S调整缩放

如果想精准的沿着某个轴，只需要G按下后，然后按下X、Y、Z轴对应的字符即可。

如果只想水平运动，不想上下，按下G后Shift+Z即可排除Z轴。

#### 模式选择

现在是物体模式，我们可以移动物体，我们还可以通过左上角来切换不同模式：

![image-20250217212824202](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250217212824202.png)

当然还有快捷键 Ctrl + Tab即可出现一个圆形菜单：

![image-20250217212929101](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250217212929101.png)

切换到编辑模式，通过左上角的选择，可以选择顶点、边、面，让物体形状不同：

![image-20250217213621036](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250217213621036.png)

当然还可以通过键盘的1、2、3来选择对应的模式，还可以按Tab键退出编辑模式。

#### 物体渲染模式

现在所有的物体都是同样的材质，我们可以通过Z键切换到材质预览。现在看不出啥，当我们添加了颜色和纹理的时候就可以显现了。

Z的模式中也有我们熟悉的线框模式，还有一个特别的渲染模式，让物体更真实：

![image-20250217214607832](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250217214607832.png)

#### 属性菜单

右下角的属性区域有很多不同的图标，我们来看看。

首先是物体菜单，选中一个物体，然后点击右下角的图标，通过它们输入更加精准的值：

![image-20250217214920924](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250217214920924.png)

下面一个是修改器，可以选择自己喜欢的：

![image-20250217215206245](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250217215206245.png)

倒数的第二个是材质，你可以选择自己的材质或创建：

![image-20250217215249958](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250217215249958.png)

默认的材质是BSDF，它遵循PBR原则。

切换到渲染模式，然后查看上面，会发现渲染引擎是EEVEE：

![image-20250217220236551](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250217220236551.png)

它的性能不错，也挺真实，另外的WorkBench即工作台性能出色，但不真实，Cycles性能较差，而真实程度最高，因为它能处理光线的反弹，用到光线追踪。

再提一嘴，如果你想渲染，通过F12即可渲染，有的需要加上Fn键：

![image-20250217221102543](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250217221102543.png)

点击左上角的图像，里面即可保存图片。

#### 搜索

有些时候你会不知道功能位置，你可以通过F3来搜索，这样可以启动各个功能：

![image-20250217221334460](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250217221334460.png)

#### 保存启动文件

让我们从头，删除所有东西，a键然后x键，然后只创建一个立方体：

![image-20250217221802451](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250217221802451.png)

随后添加一个点光源，通过G移动它：

![image-20250217222016396](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250217222016396.png)

然后选中光源，点击右下角的光源设置，调整强度：

![image-20250217222144847](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250217222144847.png)

接着是下面的区域，我想要换成X和Z轴，还有线框模式：

![image-20250217222307128](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250217222307128.png)

这样子，我们就可以保存启动文件，下次启动的时候默认就是它：

![image-20250217222410186](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250217222410186.png)

#### 制作模型

OK，简要的功能都熟悉了，我们开始做模型，做一个汉堡。

##### 单位比例

首先是确保单位比例，我们会发现有很多网格，并且物体属性也显示了米为单位：

![image-20250217222755418](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250217222755418.png)

不过如果是cm，blender里面显示太小了，我们可以把一个单位看为一厘米来做。

当然如果不喜欢m，通过场景属性就可以更改为自适应，和Three一样：

![image-20250217223036596](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250217223036596.png)

##### 底部面包

做一个汉堡的底部面包，删除立方体，然后创建圆柱体，调整缩放：

![image-20250217223503037](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250217223503037.png)

看着不错，不过可以用更好的技巧，回到立方体，然后进入编辑模式来缩放：

![image-20250217223707069](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250217223707069.png)

我们会发现缩放还是1:1:1，这样很棒。

接下来使用修改器，添加一个表面细分修改器：

![image-20250217224003772](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250217224003772.png)

你就会得到类似的球体：

![image-20250217224053464](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250217224053464.png)

对它右键，让它表面光滑：

![image-20250217224250777](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250217224250777.png)

可以调整右边的层级增加更多细节：

![image-20250217224334286](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250217224334286.png)

看起来是圆，如果我们进入编辑模式，就会发现它还是立方体，操作立方体就容易许多了

![image-20250217224806612](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250217224806612.png)

选择底面，然后G键调整位置底面的Z轴：

![image-20250217225043602](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250217225043602.png)

然后再移动上面的Z轴：

![image-20250217225150570](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250217225150570.png)

接下来我们来增加多边形，通过循环切割，Ctrl + R键，选中垂直分割，往上移动：

![image-20250217225501947](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250217225501947.png)

下面可以再平整一些，通过再次Ctrl + R来分割：

![image-20250217225651783](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250217225651783.png)

然后调整一下厚度，有点太厚了：

![image-20250217225854865](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250217225854865.png)

看起来不错，我们可以先保存吧，Ctrl + S或Command+S即可：

![image-20250217230222448](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250217230222448.png)

##### 肉饼

复制这个物体，Ctrl+C复制Ctrl+V粘贴，然后G+Z调整Z轴位置：

![image-20250217230918421](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250217230918421.png)

然后进入编辑模式微调肉饼，做成你喜欢的样子：

![image-20250217232104291](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250217232104291.png)

##### 芝士片或者奶酪

下面做芝士片，需要创建平面，调整缩放记得进入编辑缩放，然后调整位置：

![image-20250217232412530](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250217232412530.png)

现在只有四个顶点，我们添加一下细分：

![image-20250217232456953](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250217232456953.png)

调整如下：

![image-20250217232635184](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250217232635184.png)

然后通过选择边缘角落的顶点，激活比例或衰减编辑，可以按O键：

![image-20250217233022280](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250217233022280.png)

然后使用锐化效果，只在z轴让它掉落：

![image-20250217233156973](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250217233156973.png)

然后移动Z轴，随意调整成喜欢的样子：

![image-20250217233830088](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250217233830088.png)

右键开启平滑，然后加点厚度，修改器选择实体化，调整高度即可。

##### 顶部面包

接下来就是顶部，复制底部，然后R旋转，X轴固定，然后Ctrl旋转会磁性：

![image-20250217234751095](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250217234751095.png)

这看起来非常棒！我们可以调整让他更圆：

![image-20250217234925715](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250217234925715.png)

##### 添加材质

接下来我们来添加材质，我们加点颜色即可，调整到渲染模式确保灯光足够。

先顶部面包，选择材质，调整颜色和粗糙度：

![image-20250217235741606](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250217235741606.png)

然后是底部的，直接用原来的，然后是肉饼，材质如下：

![image-20250218000122863](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250218000122863.png)

最后是奶酪片或芝士片：

![image-20250218000233619](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250218000233619.png)

你可以自己做的好看一些：

![image-20250218000256532](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250218000256532.png)

#### 导出模型

我们做完了，接下来是导出这个模型，注意只选中这个模型，灯光不要选中，然后文件-导出-gltf2：

![image-20250218000539029](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250218000539029.png)

导出设置如下：

![image-20250218001142468](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250218001142468.png)

压缩可开启或不开启，看你喜好。

然后代码引入：

```js
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import GUI from 'lil-gui'

/**
 * Base
 */
// Debug
const gui = new GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Models
 */
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('/draco/')

const gltfLoader = new GLTFLoader()
gltfLoader.setDRACOLoader(dracoLoader)

let mixer = null

gltfLoader.load(
    '/models/hamburger.glb',
    (gltf) =>
    {
        scene.add(gltf.scene)
    }
)

/**
 * Floor
 */
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(50, 50),
    new THREE.MeshStandardMaterial({
        color: '#444444',
        metalness: 0,
        roughness: 0.5
    })
)
floor.receiveShadow = true
floor.rotation.x = - Math.PI * 0.5
scene.add(floor)

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 2.4)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 1.8)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.camera.left = - 7
directionalLight.shadow.camera.top = 7
directionalLight.shadow.camera.right = 7
directionalLight.shadow.camera.bottom = - 7
directionalLight.position.set(5, 5, 5)
scene.add(directionalLight)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(- 8, 4, 8)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.target.set(0, 1, 0)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()
let previousTime = 0

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime

    if(mixer)
    {
        mixer.update(deltaTime)
    }

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
```

看起来很棒，我们就成功自己创建模型了：

![image-20250218001226280](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250218001226280.png)

看起来和软件中颜色不一样，这个东西我们会在后面用更逼真的效果渲染。

