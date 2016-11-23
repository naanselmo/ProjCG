/**
 * Missile class, inherits from Character
 */
Missile.prototype = Object.create(Character.prototype);
Missile.prototype.constructor = Missile;

function Missile(x, y, z) {
  'use strict';

  Character.call(this, x, y, z);
  this.maxVelocity = 50;

  this.basicMaterial = Missile.basicMaterial;
  this.phongMaterial = Missile.phongMaterial;
  this.lambertMaterial = Missile.lambertMaterial;
  this.material = this[materialToUse];

  var model = createMissile(this.material, 0, 0, 0);
  model.scale.set(0.4, 0.4, 0.4);
  this.object3D.add(model);
  this.boundingBox.setFromObject(this.object3D);
  this.boundingSphere.set(this.boundingBox.getCenter(), Math.max(this.boundingBox.getSize().x, this.boundingBox.getSize().y, this.boundingBox.getSize().z) / 2);
}
Missile.basicMaterial = new THREE.MeshBasicMaterial({
  color: 0xc0c011
});
Missile.phongMaterial = new THREE.MeshPhongMaterial({
  color: 0xc0c011,
  specular: 0x444444,
  shininess: 40,
  shading: THREE.SmoothShading
});
Missile.lambertMaterial = new THREE.MeshLambertMaterial({
  color: 0xc0c011
});

Missile.prototype.destroy = function () {
  'use strict';

  this.setVisible(false);
  this.velocity.multiplyScalar(0);
  missilePool.pushDead(this);
};

Missile.prototype.animate = function (delta) {
  'use strict';

  this.acceleration.setY(25);
  Character.prototype.animate.call(this, delta);
};

Missile.prototype.handleOutOfBounds = function (boundary) {
  'use strict';

  this.destroy();
};

Missile.prototype.handleCollision = function (collisionObject) {
  'use strict';

  collisionObject.destroy(); // Destroys the object it hit
  this.destroy(); // Destroys the shot itself
};

function createMissile(material, x, y, z) {
  'use strict';

  var missile = new THREE.Mesh(createMissile.geometry, material);
  missile.rotateX(Math.PI);
  missile.position.set(x, y, z);
  return missile;
}
createMissile.geometry = new THREE.SphereGeometry(1, 8, 8);
