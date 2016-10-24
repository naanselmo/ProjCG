/**
 * Missile class, inherits from Character
 */
Missile.prototype = Object.create(Character.prototype);
Missile.prototype.constructor = Missile;

function Missile(x, y, z) {
  'use strict';

  Character.call(this, x, y, z);
  this.maxVelocity = 10;

  var model = createMissile(0, 0, 0);
  // TODO : put the shot smaller 
  model.scale.set(0.4, 0.4, 0.4);
  this.object3D.add(model);
  this.boundingBox.setFromObject(this.object3D);
  this.boundingSphere.set(this.boundingBox.getCenter(), Math.max(this.boundingBox.getSize().x, this.boundingBox.getSize().y, this.boundingBox.getSize().z) / 2);
}

function createMissile(x,y,z){
//	var geometry = new THREE.CylinderGeometry( 7, 1, 16, 8);
	var geometry = new THREE.SphereGeometry( 1, 32, 32 );
  var material = new THREE.MeshBasicMaterial( {color: 0xffff00} );
	var missile = new THREE.Mesh( geometry, material );
  missile.rotateX (Math.PI) ;
	return missile;
};
Missile.prototype.destroy = function () {
  // TODO: What happens when this object is destroyed
  Character.prototype.destroy.call(this); // DESTROYS OBJECT3D!
};

Missile.prototype.animate = function (delta) {
  // TODO: Set acceleration in the Y direction (this.acceleration is a 3D vector)
  this.acceleration.setY(10);
  Character.prototype.animate.call(this, delta);
};

Missile.prototype.handleOutOfBounds = function (boundary) {
  // TODO: Handle out of bounds for the missile
  if (boundary == 1 || boundary == 3) {
    // Right or Left
  } else if (boundary == 2 || boundary == 4) {
    // Bottom or Top
    missilePool.kill(this);
  }
};

Missile.prototype.detectCollisions = function () {
  // TODO: Collision detection using the raycaster
  var collidableObjects = enemies;
  for (var i = 0; i < collidableObjects.length; i++) {
    if (collidableObjects[i] !== this && this.boundingSphere.intersectsSphere(collidableObjects[i].boundingSphere)) {
      this.handleCollision(collidableObjects[i]);
    }
  }
};

Missile.prototype.handleCollision = function (collisionObject) {
  // TODO: Handle collision - what happens when the shot hits the enemy
  collisionObject.destroy(); // Destroys the object it hit
  missilePool.kill(this);    // Destroys the shot itself

};
