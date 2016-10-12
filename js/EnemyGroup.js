/**
 * EnemyGroup class
 */
function EnemyGroup() {
  'use strict';

  var speed = 15;
  this.object3D = new THREE.Object3D();

  EnemyGroup.prototype.animate = function(delta) {
    var boundingBox = new THREE.Box3().setFromObject(this.object3D);

    if ((boundingBox.min.x + speed*delta) > (-gameWidth/2) && (boundingBox.max.x + speed*delta) < (gameWidth/2)) {
      this.translateSceneX(speed*delta);
    } else {
      // Out of bounds, reverse direction
      speed *= -1;
      this.translateSceneX(speed*delta);
    }
  };
}

EnemyGroup.prototype.translateX = function(distance) {
  this.object3D.translateX(distance);
};

EnemyGroup.prototype.translateY = function(distance) {
  this.object3D.translateY(distance);
};

EnemyGroup.prototype.translateZ = function(distance) {
  this.object3D.translateZ(distance);
};

EnemyGroup.prototype.translateSceneX = function(distance) {
  this.object3D.position.x += distance;
};

EnemyGroup.prototype.translateSceneY = function(distance) {
  this.object3D.position.y += distance;
};

EnemyGroup.prototype.translateSceneZ = function(distance) {
  this.object3D.position.z += distance;
};

EnemyGroup.prototype.rotateX = function(angle) {
  this.object3D.rotateX(angle);
};

EnemyGroup.prototype.rotateY = function(angle) {
  this.object3D.rotateY(angle);
};

EnemyGroup.prototype.rotateZ = function(angle) {
  this.object3D.rotateZ(angle);
};
