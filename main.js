import * as THREE from 'three';
import { Texture } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import { FlakesTexture } from 'three/examples/jsm/textures/FlakesTexture.js';
import { Reflector } from 'three/examples/jsm/objects/Reflector.js';
import { ReflectorForSSRPass } from 'three/examples/jsm/objects/ReflectorForSSRPass.js';
import { SSRPass } from 'three/examples/jsm/postprocessing/SSRPass.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader.js';
import { VSMShadowMap } from 'three';
import { DoubleSide } from 'three';

//tạo scene
const scene = new THREE.Scene();

//lấy size màn hình thiết bị
const size = {
    width: window.innerWidth,
    height: window.innerHeight
}

//loading model
let shark, shark2, tree, human, human2;
let mixerShark, mixerShark2, mixerTree, mixerHuman, mixerHuman2;
let actionShark, actionShark2, actionTree, actionHuman, actionHuman2;

const loader = new GLTFLoader();

//loading shark model
loader.load('./assets/shark.glb', function (gltf) {
    shark = gltf.scene;
    gltf.scene.castShadow = true;
    gltf.scene.traverse(function (node) {
        if (node.isMesh) {
            node.castShadow = true;
            // node.receiveShadow = true;
        }
    });

    shark.rotation.set(0, Math.PI / 4, 0);
    shark.scale.set(10, 10, 10);
    shark.position.set(20, 0, 50);

    scene.add(shark);

    mixerShark = new THREE.AnimationMixer(shark);
    actionShark = gltf.animations;
    console.log(actionShark);
    mixerShark.clipAction(actionShark[0]).play();
}, undefined, function (error) {
    console.error(error);
})


loader.load('./assets/shark2.glb', function (gltf) {
    shark2 = gltf.scene;
    gltf.scene.castShadow = true;
    gltf.scene.traverse(function (node) {
        if (node.isMesh) {
            node.castShadow = true;
            // node.receiveShadow = true;
        }
    });

    shark2.rotation.set(0, Math.PI / 4, 0);
    shark2.scale.set(10, 10, 10);
    shark2.position.set(50, 0, 20);

    scene.add(shark2);

    mixerShark2 = new THREE.AnimationMixer(shark2);
    actionShark2 = gltf.animations;
    console.log(actionShark2);
    mixerShark2.clipAction(actionShark2[2]).play();
}, undefined, function (error) {
    console.error(error);
})

//loading human model
loader.load('./assets/human.glb', function (gltf) {
    human = gltf.scene;
    gltf.scene.castShadow = true;
    gltf.scene.traverse(function (node) {
        if (node.isMesh) {
            node.castShadow = true;
            // node.receiveShadow = true;
        }
    });

    human.scale.set(2.5, 2.5, 2.5);
    human.position.set(30, 0, 0);
    human.rotation.set(0, Math.PI / 5, 0);

    scene.add(human);

    mixerHuman = new THREE.AnimationMixer(human);
    actionHuman = gltf.animations;
    console.log(actionHuman);
    mixerHuman.clipAction(actionHuman[0]).play();
}, undefined, function (error) {
    console.error(error);
})

//loading human model
loader.load('./assets/human2.glb', function (gltf) {
    human2 = gltf.scene;
    gltf.scene.castShadow = true;
    gltf.scene.traverse(function (node) {
        if (node.isMesh) {
            node.castShadow = true;
            // node.receiveShadow = true;
        }
    });

    human2.scale.set(2.5, 2.5, 2.5);
    human2.position.set(0, 0, 20);
    human2.rotation.set(0, Math.PI / 5, 0);

    scene.add(human2);

    mixerHuman2 = new THREE.AnimationMixer(human2);
    actionHuman2 = gltf.animations;
    console.log(actionHuman2);
    mixerHuman2.clipAction(actionHuman2[1]).play();
}, undefined, function (error) {
    console.error(error);
})

//loading tree model
loader.load('./assets/tree.glb', function (gltf) {
    tree = gltf.scene;
    gltf.scene.castShadow = true;
    gltf.scene.traverse(function (node) {
        if (node.isMesh) {
            node.castShadow = true;
            // node.receiveShadow = true;
        }
    });

    tree.position.set(-35, 0, 0);
    tree.rotation.set(0, -Math.PI / 4, 0);
    tree.scale.set(10, 10, 10);

    scene.add(tree);

    mixerTree = new THREE.AnimationMixer(tree);
    actionTree = gltf.animations;

    actionTree.forEach(animateTree);
    function animateTree(item, index, arr) {
        mixerTree.clipAction(arr[index]).play();
    }

}, undefined, function (error) {
    console.error(error);
})

//tạo normal map
const textureLoader = new THREE.TextureLoader();
const normalMapTexture = textureLoader.load("./assets/normal.jpg");
normalMapTexture.wrapS = THREE.RepeatWrapping;
normalMapTexture.wrapT = THREE.RepeatWrapping;

const brickMapTexture = textureLoader.load("./assets/brick_diffuse.jpg")
brickMapTexture.wrapS = THREE.RepeatWrapping;
brickMapTexture.wrapT = THREE.RepeatWrapping;

//thêm environment map
const hdrEquirect = new RGBELoader().load(
    "./assets/empty_warehouse_01_2k.hdr",
    () => {
        hdrEquirect.mapping = THREE.EquirectangularReflectionMapping;
    }
);

//Tạo perspetive trong camera
const camera = new THREE.PerspectiveCamera(75, size.width / size.height, 0.1, 1000);

// camera.position.set(130, 130, 200);
camera.position.set(80, 80, 100);
// const cameraHelper = new THREE.CameraHelper(camera);
// scene.add(cameraHelper);

//Tạo renderer
const renderer = new THREE.WebGL1Renderer({
    canvas: document.querySelector('#bg'),
    alpha: true,
    antialias: true
})

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(size.width, size.height);

//bật shadow map cho renderer
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.VSMShadowMap;

//đổi color
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.25;
renderer.isWebGLMultipleRenderTargets = true;

//tạo lighting
const light = new THREE.PointLight(0xffffff, 0.6, 0, 2);
light.position.set(16, 16, 0);
light.castShadow = true;
light.shadowDarkness = 0.5;
light.shadow.camera.near = 0.5;
light.shadow.camera.far = 5000;
light.shadow.camera.left = -50;
light.shadow.camera.bottom = -50;
light.shadow.camera.right = 50;
light.shadow.camera.top = 50;
light.shadow.mapSize.width = 2048;
light.shadow.mapSize.height = 2048;
light.shadow.bias = -0.001;

const light2 = new THREE.PointLight(0xffff00, 0.6, 0, 2);
light2.position.set(0, 16, 16);
light2.castShadow = true;
light2.shadowDarkness = 0.5;
light2.shadow.camera.near = 0.5;
light2.shadow.camera.far = 5000;
light2.shadow.camera.left = -50;
light2.shadow.camera.bottom = -50;
light2.shadow.camera.right = 50;
light2.shadow.camera.top = 50;
light2.shadow.mapSize.width = 2048;
light2.shadow.mapSize.height = 2048;
light2.shadow.bias = -0.001;

const light3 = new THREE.PointLight(0xff0000, 0.6, 0, 2);
light3.position.set(-8, 16, -8);
light3.castShadow = true;
light3.shadowDarkness = 0.5;
light3.shadow.camera.near = 0.5;
light3.shadow.camera.far = 5000;
light3.shadow.camera.left = -50;
light3.shadow.camera.bottom = -50;
light3.shadow.camera.right = 50;
light3.shadow.camera.top = 50;
light3.shadow.mapSize.width = 2048;
light3.shadow.mapSize.height = 2048;
light3.shadow.bias = -0.001;

//Thêm light Helper chỉ vị trí lighting
const lightHelper = new THREE.PointLightHelper(light);
const lightHelper2 = new THREE.PointLightHelper(light2);
const lightHelper3 = new THREE.PointLightHelper(light3);

// scene.add(lightHelper, lightHelper2, lightHelper3);

//Thêm lightCamera chỉ góc ánh sáng lighting
const lightCamera = new THREE.CameraHelper(light.shadow.camera);
const lightCamera2 = new THREE.CameraHelper(light2.shadow.camera);
const lightCamera3 = new THREE.CameraHelper(light3.shadow.camera);

// scene.add(lightCamera, lightCamera2, lightCamera3);

//Tạo control
const controls = new OrbitControls(camera, renderer.domElement);

//Thêm texture cho background
const sceneBackground = new THREE.TextureLoader().load('./assets/sky.jpg');
scene.background = sceneBackground;

//Thêm bóng distro
const ballGeometry = new THREE.SphereGeometry(10, 20, 20);
const ballMaterial = new THREE.MeshNormalMaterial({
    flatShading: true
});

const ball = new THREE.Mesh(ballGeometry, ballMaterial);
ball.position.set(100, 150, 100);
// ball.castShadow = true;
ball.add(light, light2, light3);
scene.add(ball);

// thêm sàn nhà
const floorMaterial = new THREE.MeshStandardMaterial({
    // color: 0xffffff,
    map: brickMapTexture
})
const floorGeometry = new THREE.BoxGeometry(150, 150, 5);
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.set(-Math.PI / 2, 0, 0);
floor.castShadow = false;
floor.receiveShadow = true;
floor.position.y = -3;
scene.add(floor);

//thêm gương
const mirrorOptions = {
    clipBias: 0,
    textureWidth: window.innerWidth * window.devicePixelRatio,
    textureHeight: window.innerHeight * window.devicePixelRatio,
    color: 0x777777,
    multisample: 4,
    recursion: 1
}

const mirrorGeometry = new THREE.BoxGeometry(150, 150);

const mirror1 = new Reflector(mirrorGeometry, mirrorOptions);
const mirror2 = new Reflector(mirrorGeometry, mirrorOptions);
const mirror3 = new Reflector(mirrorGeometry, mirrorOptions);

mirror2.position.set(-75, 74, 0);
mirror3.position.set(0, 74, -75)

mirror1.rotation.set(-Math.PI / 2, 0, 0);
mirror2.rotation.set(0, Math.PI / 2, 0);
mirror3.rotation.set(0, 0, 0);

scene.add(mirror2, mirror3);
// scene.add(mirror1);

const clock = new THREE.Clock();

//Tạo 2 đèn cho sàn nhảy disco
const lambGeometry = new THREE.IcosahedronGeometry(15, 0);
const lambMaterial = new THREE.MeshPhongMaterial({
    // roughness: 0.07,
    // transmission: 1,
    // thickness: 1.5,
    envMap: hdrEquirect,
    // envMapIntensity: 1.5,
    // clearcoat: 1,
    // clearcoatRoughness: 0.1,
    normalMap: normalMapTexture,
    // clearcoatNormalMap: normalMapTexture
});

const lamb_1 = new THREE.Mesh(lambGeometry, lambMaterial);
const lamb_2 = new THREE.Mesh(lambGeometry, lambMaterial);
lamb_1.castShadow = true;
lamb_2.castShadow = true;
lamb_1.position.set(-30, 20, 60);
lamb_2.position.set(60, 20, -30);
scene.add(lamb_1, lamb_2);

//add music
const listener = new THREE.AudioListener();
camera.add(listener);

const sound = new THREE.Audio(listener);

const audioLoader = new THREE.AudioLoader();
audioLoader.load('./assets/background_sound.ogg', function (buffer) {
    sound.setBuffer(buffer);
    sound.setLoop(true);
    sound.setVolume(0.5);
    sound.play();
});

//tạo composer
const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
composer.addPass(new UnrealBloomPass({ x: 1024, y: 1024 }, 1.0, 0.0, 0.75, 1));

const pixelRatio = renderer.getPixelRatio();
let effectFXAA = new ShaderPass(FXAAShader);
effectFXAA.material.uniforms['resolution'].value.x = 1 / (window.innerWidth * pixelRatio);
effectFXAA.material.uniforms['resolution'].value.y = 1 / (window.innerHeight * pixelRatio);
composer.addPass(effectFXAA);

//Hàm loop render mỗi khi có update trong màn hình
function animate() {
    // requestAnimationFrame(animate);

    const delta = clock.getDelta();

    if (mixerShark) mixerShark.update(delta);
    if (mixerHuman) mixerHuman.update(delta);
    if (mixerTree) mixerTree.update(delta);
    if (mixerHuman2) mixerHuman2.update(delta);
    if (mixerShark2) mixerShark2.update(delta);
    ball.rotation.y += 0.01;

    lamb_1.rotation.y += -0.01;
    lamb_2.rotation.y += 0.01;

    controls.update();

    // renderer.render(scene, camera);
    composer.render();
}

renderer.setAnimationLoop(animate)