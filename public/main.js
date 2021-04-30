import * as THREE from "/build/three.module.js";
import { GLTFLoader } from "/loaders/GLTFLoader.js";
import { OrbitControls } from "/jsm/controls/OrbitControls.js";

function handle_load(gltf) {
  const mesh = gltf.scene.children[2];
  scene.add(mesh);
  mesh.position.z = 0;
  mesh.position.y = 1;
}

function init() {
  var scene = new THREE.Scene();
  // var gui = new dat.GUI();

  var loader = new GLTFLoader();
  loader.load("die-alpha.gltf", handle_load);

  var enableFog = false;

  if (enableFog) {
    scene.fog = new THREE.FogExp2(0xffffff, 0.2);
  }

  var plane = getPlane(30);
  var directionalLight = getDirectionalLight(1);
  var sphere = getSphere(0.05);
  var box = getBox(1, 1, 1);

  plane.name = "plane-1";
  box.position.y = box.geometry.parameters.height / 2;
  plane.rotation.x = Math.PI / 2;
  directionalLight.position.x = 13;
  directionalLight.position.y = 10;
  directionalLight.position.z = 10;
  directionalLight.intensity = 2;

  scene.add(plane);
  directionalLight.add(sphere);
  scene.add(directionalLight);
  // scene.add(box);

  // gui.add(directionalLight, "intensity", 0, 10);
  // gui.add(directionalLight.position, "x", 0, 20);
  // gui.add(directionalLight.position, "y", 0, 20);
  // gui.add(directionalLight.position, "z", 0, 20);

  var camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    1,
    1000
  );

  camera.position.x = 1;
  camera.position.y = 2;
  camera.position.z = 5;

  camera.lookAt(new THREE.Vector3(0, 0, 0));

  var renderer = new THREE.WebGLRenderer({ antialiasing: true });
  renderer.shadowMap.enabled = true;
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor("rgb(120, 120, 120)");
  document.getElementById("webgl").appendChild(renderer.domElement);

  var controls = new OrbitControls(camera, renderer.domElement);

  update(renderer, scene, camera, controls);

  return scene;
}

function getBox(w, h, d) {
  var geometry = new THREE.BoxGeometry(w, h, d);
  var material = new THREE.MeshPhongMaterial({
    color: "rgb(120, 120, 120)",
  });
  var mesh = new THREE.Mesh(geometry, material);
  mesh.castShadow = true;

  return mesh;
}

function getPlane(size) {
  var geometry = new THREE.PlaneGeometry(size, size);
  var material = new THREE.MeshPhongMaterial({
    color: "rgb(120, 120, 120)",
    side: THREE.DoubleSide,
  });
  var mesh = new THREE.Mesh(geometry, material);
  mesh.receiveShadow = true;

  return mesh;
}

function getSphere(size) {
  var geometry = new THREE.SphereGeometry(size, 24, 24);
  var material = new THREE.MeshBasicMaterial({
    color: "rgb(255, 255, 255)",
  });
  var mesh = new THREE.Mesh(geometry, material);

  return mesh;
}

function getPointLight(intensity) {
  var light = new THREE.PointLight(0xffffff, intensity);
  light.castShadow = true;

  return light;
}

function getSpotLight(intensity) {
  var light = new THREE.SpotLight(0xffffff, intensity);
  light.castShadow = true;

  light.shadow.bias = 0.001;
  light.shadow.mapSize.width = 2048;
  light.shadow.mapSize.height = 2048;

  return light;
}

function getDirectionalLight(intensity) {
  var light = new THREE.DirectionalLight(0xffffff, intensity);
  light.castShadow = true;

  light.shadow.camera.left = -10;
  light.shadow.camera.bottom = -10;
  light.shadow.camera.right = 10;
  light.shadow.camera.top = 10;

  return light;
}

function update(renderer, scene, camera, controls) {
  renderer.render(scene, camera);

  controls.update();

  requestAnimationFrame(function () {
    update(renderer, scene, camera, controls);
  });
}

var scene = init();
