import * as THREE from 'three';
import eyeModel from './eyeClass.js';
import { sharedState } from './sharedState.js';

const mainTitle = document.querySelector('.main-title');
const hoverEyeSize = 0.25;
const lerpSpeed = 0.2;

// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  50, 
  window.innerWidth / window.innerHeight, 
  0.1, 
  1000
);
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
  alpha: true,
  antialias: true
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000, 0);
camera.position.setZ(5);

// Create eye models
const eye1 = new eyeModel(scene, camera, {
  position: { x: 3.5, y: 1.5, z: 0.5 },
  scale: { x: 1, y: 1, z: 1 }
});

const eye2 = new eyeModel(scene, camera, {
  position: { x: -3.5, y: -0.5, z: 0 },
  scale: { x: 1, y: 1, z: 1 }
});

const eye3 = new eyeModel(scene, camera, {
  position: { x: 0, y: -2, z: 0.5 },
  scale: { x: 1, y: 1, z: 1 }
});

const eye4 = new eyeModel(scene, camera, {
  position: { x: -1.5, y: 2, z: 0.5 },
  scale: { x: 0.8, y: 0.8, z: 0.8 }
});

const eye5 = new eyeModel(scene, camera, {
  position: { x: 3.75, y: -2, z: 0.5 },
  scale: { x: 0.5, y: 0.5, z: 0.5 }
});

const eyes = [eye1, eye2, eye3, eye4, eye5];

// Title hover interactions
mainTitle.addEventListener('mouseenter', () => {
  eyes.forEach((eye) => {
    if (eye.model && eye.targetScale) {
      eye.targetScale.set(
        eye.model.scale.x + hoverEyeSize,
        eye.model.scale.y + hoverEyeSize,
        eye.model.scale.z + hoverEyeSize
      );
    }
  });
});

mainTitle.addEventListener('mouseleave', () => {
  eyes.forEach((eye) => {
    if (eye.model && eye.targetScale) {
      eye.targetScale.set(
        eye.model.scale.x - hoverEyeSize,
        eye.model.scale.y - hoverEyeSize,
        eye.model.scale.z - hoverEyeSize
      );
    }
  });
});

// Lighting
const ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.5);
const pointLight = new THREE.PointLight(0xFFFFFF, 3, 0, 0.5);
pointLight.position.set(-0.25, 0.5, 1);
scene.add(pointLight, ambientLight);

// Window resize handler
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Animation loop
function animate(time) {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  
  //This is how to control threshold
  let fftSize = THREE.MathUtils.mapLinear(sharedState.fftData.size, 150, 300, 0.8, 1.5);
    eyes.forEach((eye) => {
      eye.update();
      if (eye.model && eye.targetScale){
        eye.targetScale.set(fftSize, fftSize, fftSize);
        eye.model.scale.lerp(eye.targetScale, lerpSpeed);
        // eye.model.scale.set(
        //   eye.model.scale.x *= coef,
        //   eye.model.scale.y *= coef,
        //   eye.model.scale.z *= coef,
        // );
      }
    })
  console.log(sharedState.fftData.size);

  // const coef = THREE.MathUtils.mapLinear(Math.sin(time / 800), -1, 1, 1, 1.01);
  
  // eyes.forEach((eye) => {
  //   eye.update();
  //   if (eye.model && eye.targetScale) {
  //     eye.model.scale.lerp(eye.targetScale, lerpSpeed);
  //     eye.model.scale.set(
  //       eye.model.scale.x * coef,
  //       eye.model.scale.y * coef,
  //       eye.model.scale.z * coef
  //     );
  //   }
  // });
}

animate();

console.log('Three.js scene initialized');