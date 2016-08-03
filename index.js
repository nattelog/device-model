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
  var geometry = new THREE.BoxGeometry(100, 200, 50);
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

  camera = new THREE.PerspectiveCamera(70, width / height, 1, 1000);
  camera.position.y = 150;
  camera.position.z = 500;

  device = buildDevice();
  device.position.y = 200;

  scene = new THREE.Scene();
  scene.add(device);

  renderer = new THREE.WebGLRenderer();
  renderer.setClearColor(0xf0f0f0);
  renderer.setSize(width, height);
  container.appendChild(renderer.domElement);
}

function toRad(degrees) {
  return degrees * Math.PI / 180;
}

function render() {
  var x = device.rotation.x;
  var y = device.rotation.y;
  var z = device.rotation.z;

  device.rotation.x = 0;
  device.rotation.y = 0;
  device.rotation.z = 0;

  device.rotateY(gammaController.update(y));
  device.rotateX(betaController.update(x));
  device.rotateZ(alphaController.update(z));

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
