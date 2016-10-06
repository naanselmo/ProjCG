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

Character.prototype.rotateX = function(angle) {
  this.object3D.rotateX(angle);
};

Character.prototype.rotateY = function(angle) {
  this.object3D.rotateY(angle);
};

Character.prototype.rotateZ = function(angle) {
  this.object3D.rotateZ(angle);
};
