import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r115/build/three.module.js';

import { Particles } from './particles.js';

var renderer, scene, camera, particles, clock;

function setupScene() {
  renderer = new THREE.WebGLRenderer();
  
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  document.body.appendChild(renderer.domElement);
  
  clock = new THREE.Clock();
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.01, 20);

  window.addEventListener('resize', resize, false);
  
  particles = new Particles();
  
  var mesh = particles.getMesh();
  mesh.position.z = -7;
  
  scene.add(mesh);
}

function resize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
function animate(now) {
  requestAnimationFrame(animate);
  var delta = clock.getDelta();
  particles.update(delta);
  renderer.render(scene, camera);
}

setupScene();
animate();
