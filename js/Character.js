/**
 * Character class
 */
function Character(x, y, z) {
  'use strict';

  this.object3D = new THREE.Object3D();
  this.object3D.position.set(x || 0, y || 0, z || 0);
  this.boundingBox = new THREE.Box3();
  this.boundingSphere = new THREE.Sphere();
  this.boundingMovement = new THREE.Vector3(0, 0, 0);

  this.toMove = new THREE.Vector3(0, 0, 0);
  this.velocity = new THREE.Vector3(0, 0, 0);
  this.acceleration = new THREE.Vector3(0, 0, 0);
  this.maxVelocity = 0;
  this.toRotate = new THREE.Vector3(0, 0, 0);
  this.rotationVelocity = new THREE.Vector3(0, 0, 0);
  this.maxRotation = 0;
}

Character.prototype.destroy = function () {
  'use strict';

  scene.remove(this.object3D);
};

Character.prototype.animate = function (delta) {
  'use strict';

  this.updateVectors(delta);
};

Character.prototype.updateVectors = function (delta) {
  'use strict';

  // Increase velocity and check velocity limit
  this.velocity.add(this.acceleration.multiplyScalar(delta));
  this.velocity.clampLength(0, this.maxVelocity);
  this.toMove.copy(this.velocity).multiplyScalar(delta);

  // Rotate object and check toRotate limit
  this.toRotate.copy(this.rotationVelocity.multiplyScalar(delta));
  this.toRotate.clampLength(0, this.maxRotation - Math.sign(this.getRotation().dot(this.rotationVelocity)) * this.getRotation().length());

  // Move the boundingBox and the boundingSphere so they're used for collision and boundary checks
  this.boundingMovement.copy(this.toMove);
  this.boundingBox.translate(this.boundingMovement);
  this.boundingSphere.center.add(this.boundingMovement);
};

Character.prototype.checkConditions = function () {
  'use strict';

  this.detectOutOfBounds();
  this.detectCollisions();
};

Character.prototype.updatePositions = function () {
  'use strict';

  this.translateScene(this.toMove);
  this.rotate(this.toRotate);
  this.boundingBox.translate(this.boundingMovement.negate().add(this.toMove));
  this.boundingSphere.center = this.boundingBox.getCenter();
};

Character.prototype.detectOutOfBounds = function () {
  'use strict';

  if (this.toMove.x >= 0 && this.boundingBox.max.x > gameWidth / 2) {
    this.handleOutOfBounds(1); // Right boundary hit
  } else if (this.toMove.x <= 0 && this.boundingBox.min.x < -gameWidth / 2) {
    this.handleOutOfBounds(3); // Left boundary hit
  } else if (this.toMove.y >= 0 && this.boundingBox.max.y > gameHeight / 2) {
    this.handleOutOfBounds(2); // Top boundary hit
  } else if (this.toMove.y <= 0 && this.boundingBox.min.y < -gameHeight / 2) {
    this.handleOutOfBounds(4); // Bottom boundary hit
  }
};

Character.prototype.handleOutOfBounds = function (boundary) {};

Character.prototype.detectCollisions = function () {
  'use strict';

  var collidableObjects = [player].concat(enemies);
  for (var i = 0; i < collidableObjects.length; i++) {
    if (collidableObjects[i] !== this && this.boundingSphere.intersectsSphere(collidableObjects[i].boundingSphere) && this.boundingBox.intersectsBox(collidableObjects[i].boundingBox)) {
      this.handleCollision(collidableObjects[i]);
    }
  }
};

Character.prototype.handleCollision = function (collisionObject) {};

Character.prototype.isVisible = function () {
  'use strict';

  return this.object3D.visible;
};

Character.prototype.translate = function (vectorDistance) {
  'use strict';

  this.translateX(vectorDistance.x);
  this.translateY(vectorDistance.y);
};

Character.prototype.translateX = function (distance) {
  'use strict';

  this.object3D.translateX(distance);
};

Character.prototype.translateY = function (distance) {
  'use strict';

  this.object3D.translateY(distance);
};

Character.prototype.translateScene = function (vectorDistance) {
  'use strict';

  this.translateSceneX(vectorDistance.x);
  this.translateSceneY(vectorDistance.y);
};

Character.prototype.translateSceneX = function (distance) {
  'use strict';

  this.object3D.position.x += distance;
};

Character.prototype.translateSceneY = function (distance) {
  'use strict';

  this.object3D.position.y += distance;
};

Character.prototype.rotate = function (vectorAngle) {
  'use strict';

  this.rotateX(vectorAngle.x);
  this.rotateY(vectorAngle.y);
  this.rotateZ(vectorAngle.z);
};

Character.prototype.rotateX = function (angle) {
  'use strict';

  this.object3D.rotateX(angle);
};

Character.prototype.rotateY = function (angle) {
  'use strict';

  this.object3D.rotateY(angle);
};

Character.prototype.rotateZ = function (angle) {
  'use strict';

  this.object3D.rotateZ(angle);
};

Character.prototype.getPosition = function () {
  'use strict';

  return new THREE.Vector3(this.getPositionX(), this.getPositionY(), this.getPositionZ());
};

Character.prototype.getPositionX = function () {
  'use strict';

  return this.object3D.position.x;
};

Character.prototype.getPositionY = function () {
  'use strict';

  return this.object3D.position.y;
};

Character.prototype.getPositionZ = function () {
  'use strict';

  return this.object3D.position.z;
};

Character.prototype.getRotation = function () {
  'use strict';

  return new THREE.Vector3(this.getRotationX(), this.getRotationY(), this.getRotationZ());
};

Character.prototype.getRotationX = function () {
  'use strict';

  return this.object3D.rotation.x;
};

Character.prototype.getRotationY = function () {
  'use strict';

  return this.object3D.rotation.y;
};

Character.prototype.getRotationZ = function () {
  'use strict';

  return this.object3D.rotation.z;
};
