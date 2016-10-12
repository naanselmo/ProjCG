/**
 * Character class
 */
function Character(x, y, z) {
  'use strict';

  this.object3D = new THREE.Object3D();
  this.object3D.position.set(x || 0, y || 0, z || 0);
}

Character.prototype.animate = function(delta) {
};

Character.prototype.translateX = function(distance) {
  this.object3D.translateX(distance);
};

Character.prototype.translateY = function(distance) {
  this.object3D.translateY(distance);
};

Character.prototype.translateZ = function(distance) {
  this.object3D.translateZ(distance);
};

Character.prototype.translateSceneX = function(distance) {
  this.object3D.position.x += distance;
};

Character.prototype.translateSceneY = function(distance) {
  this.object3D.position.y += distance;
};

Character.prototype.translateSceneZ = function(distance) {
  this.object3D.position.z += distance;
};

Character.prototype.rotateX = function(angle) {
  this.object3D.rotateX(angle);
};

Character.prototype.rotateY = function(angle) {
  this.object3D.rotateY(angle);
};

Character.prototype.rotateZ = function(angle) {
  this.object3D.rotateZ(angle);
};

Character.prototype.getRotationX = function() {
  return this.object3D.rotation.x;
};

Character.prototype.getRotationY = function() {
  return this.object3D.rotation.y;
};

Character.prototype.getRotationZ = function() {
  return this.object3D.rotation.z;
};
