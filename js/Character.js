/**
 * Character class
 */
function Character(x, y, z) {
  'use strict';

  this.object3D = new THREE.Object3D();
  this.object3D.position.set(x || 0, y || 0, z || 0);
  this.boundingBox = new THREE.Box3();

  this.toMove = new THREE.Vector2(0, 0);
  this.velocity = new THREE.Vector2(0, 0);
  this.acceleration = new THREE.Vector2(0, 0);
  this.maxVelocity = 0;
  this.toRotate = new THREE.Vector3(0, 0, 0);
  this.rotationVelocity = new THREE.Vector3(0, 0, 0);
  this.maxRotation = 0;
}

Character.prototype.animate = function (delta) {};

Character.prototype.move = function (delta) {
  this.boundingBox.setFromObject(this.object3D);

  // Increase velocity and check velocity limit
  this.velocity.add(this.acceleration.multiplyScalar(delta));
  this.velocity.clampLength(0, this.maxVelocity);
  this.toMove.copy(this.velocity);

  // Rotate object and check toRotate limit
  this.toRotate.copy(this.rotationVelocity.multiplyScalar(delta));
  this.toRotate.clampLength(0, this.maxRotation - Math.sign(this.getRotation().dot(this.rotationVelocity)) * this.getRotation().length());

  if (this.isOutOfBounds()) {
    this.handleOutOfBounds();
  }

  if (this.isColliding()) {
    this.handleCollision();
  }

  this.translateScene(this.toMove.multiplyScalar(delta));
  this.rotate(this.toRotate);
};

// TODO: Add out of bounds detection
Character.prototype.isOutOfBounds = function () {
  return false;
};

// TODO: Add out of bounds handling
Character.prototype.handleOutOfBounds = function () {};

// TODO: Add collision detection
Character.prototype.isColliding = function () {
  return false;
};

// TODO: Add collision handling
Character.prototype.handleCollision = function () {};

Character.prototype.translate = function (vectorDistance) {
  this.translateX(vectorDistance.x);
  this.translateY(vectorDistance.y);
};

Character.prototype.translateX = function (distance) {
  this.object3D.translateX(distance);
};

Character.prototype.translateY = function (distance) {
  this.object3D.translateY(distance);
};

Character.prototype.translateScene = function (vectorDistance) {
  this.translateSceneX(vectorDistance.x);
  this.translateSceneY(vectorDistance.y);
};

Character.prototype.translateSceneX = function (distance) {
  this.object3D.position.x += distance;
};

Character.prototype.translateSceneY = function (distance) {
  this.object3D.position.y += distance;
};

Character.prototype.rotate = function (vectorAngle) {
  this.rotateX(vectorAngle.x);
  this.rotateY(vectorAngle.y);
  this.rotateZ(vectorAngle.z);
};

Character.prototype.rotateX = function (angle) {
  this.object3D.rotateX(angle);
};

Character.prototype.rotateY = function (angle) {
  this.object3D.rotateY(angle);
};

Character.prototype.rotateZ = function (angle) {
  this.object3D.rotateZ(angle);
};

Character.prototype.getRotation = function () {
  return new THREE.Vector3(this.getRotationX(), this.getRotationY(), this.getRotationZ());
};

Character.prototype.getRotationX = function () {
  return this.object3D.rotation.x;
};

Character.prototype.getRotationY = function () {
  return this.object3D.rotation.y;
};

Character.prototype.getRotationZ = function () {
  return this.object3D.rotation.z;
};
