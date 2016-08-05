var THREE = require('three');
var Controller = require('velocitymodel').VelocityModel;

var K_P = 5;
var K_D = 5;
var DEFAULT_DT = 50;
var DEFAULT_ID = 'model';

var scene;
var camera;
var device;
var renderer;
var alphaController;
var betaController;
var gammaController;

function buildDevice() {
  var geometry = new THREE.BoxGeometry(10, 20, 1.5);
  var material = new THREE.MeshBasicMaterial({
    vertexColors: THREE.FaceColors,
    overdraw: 0.5
  });

  for (var i = 0; i < geometry.faces.length; i += 2) {
    var color = Math.random() * 0xffffff;
    geometry.faces[i].color.setHex(color);
    geometry.faces[i + 1].color.setHex(color);
  }

  return new THREE.Mesh(geometry, material);
}

function build3DModel(id, w, h) {
  var container = document.getElementById(id);
  var width = w || container.offsetWidth;
  var height = h || width;

  camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
  camera.position.y = -25;

  device = buildDevice();

  scene = new THREE.Scene();
  scene.add(device);

  camera.lookAt(scene.position);
  camera.updateMatrixWorld();

  renderer = new THREE.WebGLRenderer();
  renderer.setClearColor(0xffffff);
  renderer.setSize(width, height);
  container.appendChild(renderer.domElement);
}

function toRad(degrees) {
  return degrees * Math.PI / 180;
}

function render() {
  device.rotation.x = 0;
  device.rotation.y = 0;
  device.rotation.z = 0;

  device.rotateZ(alphaController.update());
  device.rotateX(betaController.update());
  device.rotateY(gammaController.update());

  renderer.render(scene, camera);
}

DeviceModel.prototype.getAxisAngles = function() {
  return {
    x: device.rotation.x,
    y: device.rotation.y,
    z: device.rotation.z
  };
};

DeviceModel.prototype.setEulerAngles = function(alpha, beta, gamma) {
  alphaController.setTarget(toRad(alpha));
  betaController.setTarget(toRad(beta));
  gammaController.setTarget(toRad(gamma));

  if (!gammaController.inside(gammaController.PID.target)) {
    alphaController.pos = alphaController.PID.target;
    alphaController.v = 0;
    betaController.pos = betaController.PID.target;
    betaController.v = 0;
  }
};

function DeviceModel(id, width, height, dt) {
  var ID = id || DEFAULT_ID;
  var DT = dt || DEFAULT_DT;

  alphaController = new Controller(K_P, K_D, DT / 1000, {
    min: 0,
    max: 2 * Math.PI,
    circular: true
  });
  betaController = new Controller(K_P, K_D, DT / 1000, {
    min: -Math.PI,
    max: Math.PI,
    circular: true
  });
  gammaController = new Controller(K_P, K_D, DT / 1000, {
    min: -Math.PI / 2,
    max: Math.PI / 2,
    circular: true
  });

  build3DModel(ID, width, height);
  setInterval(render, DT);
}

module.exports = DeviceModel;
