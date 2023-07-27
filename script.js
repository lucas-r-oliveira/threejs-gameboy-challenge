import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';

THREE.ColorManagement.enabled = false

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
//TODO: configure static folder
 */
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("/static/draco/");

const gltfLoader = new GLTFLoader();
gltfLoader.setDRACOLoader(dracoLoader);

let gameboy;
gltfLoader.load(
	"/static/gameboy_advance_sp/gba-draco.gltf",
	(gltf) => {
		console.log("loaded!");
		gameboy = gltf.scene



		scene.add(gameboy)

		// -- gameboy attributes
		gameboy.scale.set(10,10,10);
		//gameboy.position.y = -0.5
		//gameboy.position.x = 0.2
		gameboy.rotation.x = Math.PI /12


		console.log(gameboy)

		const screenFrameMaterial = gameboy.getObjectByName("TopScreen_Frame_geo_Gameboy_1002_MAT_0").material.clone()

		const params = {
			color: new THREE.Color(0xffffff),
			metalness: screenFrameMaterial.metalness,
			wireframe: false,
		}

		gameboy.getObjectByName("TopScreen_Frame_geo_Gameboy_1002_MAT_0").material = screenFrameMaterial;
		gameboy.getObjectByName("Top_LargeHinge_geo_Gameboy_1002_MAT_0").material = screenFrameMaterial;
		gameboy.getObjectByName("Top_SmallHinge_geo_Gameboy_1002_MAT_0").material = screenFrameMaterial;


		// -- gameboy gui folder
		const gameboyFolder = gui.addFolder("game boy");
		gameboyFolder.addColor(params, 'color')
			.onChange((color) => {
				//gameboy.getObjectByName("TopScreen_Frame_geo_Gameboy_1002_MAT_0").material.color.set(color);
				screenFrameMaterial.color.set(color);
				gameboy.getObjectByName("Base_geo_Gameboy_1001_MAT_0").material.color.set(color);

				params.color = color;

			})
		
		//gameboyFolder.add(screenFrameMaterial, 'roughness').min(0).max(10).step(0.01);
		gameboyFolder.add(screenFrameMaterial, 'metalness').min(0).max(1).step(0.01)
		gameboyFolder.add(params, 'wireframe')
			.onChange((v) => {
				screenFrameMaterial.wireframe = v;
				gameboy.getObjectByName("Base_geo_Gameboy_1001_MAT_0").material.wireframe = v;

				params.wireframe = v;
			});


	},
	(progress) => {
		console.log("loading...");
		console.log(progress);
	}

);

// Axes
const axesHelper = new THREE.AxesHelper();
scene.add(axesHelper);

const axesFolder = gui.addFolder("axes");
axesFolder.add(axesHelper, 'visible');
axesFolder.close();

/**
 * Textures
 */

/**
 * Fonts
 */

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
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.01, 100)
camera.position.x = -0.53
camera.position.y = 0.82
camera.position.z = 1.68
scene.add(camera)

const cameraFolder = gui.addFolder("camera");
cameraFolder.add(camera.position, 'x').min(-5).max(5).step(0.01);
cameraFolder.add(camera.position, 'y').min(-5).max(5).step(0.01);
cameraFolder.add(camera.position, 'z').min(-5).max(5).step(0.01);



// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Lights
 */
const lightsFolder = gui.addFolder('lights');
lightsFolder.close()

// -- Ambient Light
const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight)

const ambientLightFolder = lightsFolder.addFolder('ambient light');
ambientLightFolder.addColor(ambientLight, 'color');
ambientLightFolder.add(ambientLight, 'intensity').min(0).max(1).step(0.01);
ambientLightFolder.add(ambientLight, 'visible');


// -- Directional Light
const directionalLight = new THREE.DirectionalLight(0xffffff, 10)
const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight);
scene.add(directionalLight)
scene.add(directionalLightHelper)


directionalLight.position.x = 5;
directionalLight.position.y = 2;
directionalLight.position.z = 5;
directionalLightHelper.visible = false;

const directionalLightFolder = lightsFolder.addFolder('directional light');
directionalLightFolder.addColor(directionalLight, 'color');
directionalLightFolder.add(directionalLight, 'intensity').min(0).max(20).step(0.01);
directionalLightFolder.add(directionalLight.position, 'x').min(-5).max(5).step(0.01);
directionalLightFolder.add(directionalLight.position, 'y').min(-5).max(5).step(0.01);
directionalLightFolder.add(directionalLight.position, 'z').min(-5).max(5).step(0.01);

directionalLightFolder.add(directionalLight, 'visible').name("light visible");
directionalLightFolder.add(directionalLightHelper, 'visible').name("helper visible");


// -- Point Light
const pointLight = new THREE.PointLight(0xffffff, 2);
const pointLightHelper = new THREE.PointLightHelper(pointLight);
scene.add(pointLight)
scene.add(pointLightHelper);
pointLight.position.y = -0.5
pointLight.position.z = -2
pointLightHelper.visible = false;

const pointLightFolder = lightsFolder.addFolder('point light');
pointLightFolder.addColor(pointLight, 'color');
pointLightFolder.add(pointLight, 'intensity').min(0).max(10).step(0.01);
pointLightFolder.add(pointLight.position, 'x').min(-5).max(5).step(0.01);
pointLightFolder.add(pointLight.position, 'y').min(-5).max(5).step(0.01);
pointLightFolder.add(pointLight.position, 'z').min(-5).max(5).step(0.01);


pointLightFolder.add(pointLight, 'visible').name("light visible");
pointLightFolder.add(pointLightHelper, 'visible').name("helper visible");



/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.outputColorSpace = THREE.LinearSRGBColorSpace
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

	// Gameboy controls
	if (gameboy) {
		//FIXME: it's all crooked, because we've changed z's rotation prior
		//gameboy.rotation.y = elapsedTime / 10
	}

	// Helper controls
	directionalLightHelper.update();

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()