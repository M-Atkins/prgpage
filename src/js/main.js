import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
// import {TextGeometry} from 'three/examples/jsm/geometries/TextGeometry.js'
// import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';



var audio = new Audio("src/sounds/bgm.mp3");
audio.volume = 0.1;
alert(audio.volume);
audio.play();


const countEL = document.getElementById('count');




updateVisitCount();
function updateVisitCount() {
    fetch('https://api.countapi.xyz/update/m-atkins.github.io/7dac7959-b2a2-425f-a75e-93b128350abb/?amount=1')
    .then(res => res.json())
    .then(res => {
        countEL.innerHTML = res.value;
    })
}

const monkeyUrl = new URL('../assets/smol_ame.glb', import.meta.url);

const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#bg'),
  });

  
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);


renderer.setClearColor(0x000000);

const orbit = new OrbitControls(camera, renderer.domElement);

camera.position.set(10, 5, 5);
orbit.update();

orbit.autoRotate = true;
orbit.enablePan = false;
orbit.enableZoom = false;


// const grid = new THREE.GridHelper(30, 30);
// scene.add(grid);

const assetLoader = new GLTFLoader();

let mixer;
assetLoader.load(monkeyUrl.href, function(gltf) {
    const model = gltf.scene;
    scene.add(model);
    mixer = new THREE.AnimationMixer(model);
    const clips = gltf.animations;

    // Play a certain animation
    const clip = THREE.AnimationClip.findByName(clips, 'Animation');
    const action = mixer.clipAction(clip);
    action.play();

    // Play all animations at the same time
    // clips.forEach(function(clip) {
    //     const action = mixer.clipAction(clip);
    //     action.play();
    // });

}, undefined, function(error) {
    console.error(error);
});


const clock = new THREE.Clock();
function animate() {
    orbit.update();
    if(mixer)
        mixer.update(clock.getDelta());
    
    renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);

window.addEventListener('resize', function() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});