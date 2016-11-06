/**
 * Enemy class, inherits from Character
 */
Enemy.prototype = Object.create(Character.prototype);
Enemy.prototype.constructor = Enemy;

function Enemy(x, y, z) {
  'use strict';

  Character.call(this, x, y, z);
  this.maxVelocity = 20;

  var model = createEnemy(0, 0, 0);
  model.scale.set(0.4, 0.4, 0.4);
  this.object3D.add(model);
  this.boundingBox.setFromObject(this.object3D);
  this.boundingSphere.set(this.boundingBox.getCenter(), Math.max(this.boundingBox.getSize().x, this.boundingBox.getSize().y, this.boundingBox.getSize().z) / 2);
}

Enemy.prototype.destroy = function () {
  'use strict';

  for (var i = enemies.length - 1; i >= 0; i--) {
    if (enemies[i] === this) {
      enemies.splice(i, 1);
    }
  }
  Character.prototype.destroy.call(this);
};

Enemy.prototype.handleOutOfBounds = function (boundary) {
  'use strict';

  if (boundary == 1 || boundary == 3) {
    this.toMove.setX(0);
    this.velocity.setX(-1 * this.velocity.x);
  } else if (boundary == 2 || boundary == 4) {
    this.toMove.setY(0);
    this.velocity.setY(-1 * this.velocity.y);
  }
};

Enemy.prototype.handleCollision = function (collisionObject) {
  'use strict';

  this.toMove.multiplyScalar(0);
  this.velocity.negate();
};

/**
 * Returns the enemy object.
 *
 * @param {Number} x
 * @param {Number} y
 * @param {Number} z
 * @returns {THREE.Object3D} Enemy object
 */
function createEnemy(x, y, z) {
  'use strict';

  // Make the main body, the other things will attach.
  var enemy = createEnemyBody(0, 0, 0);

  // makes the dome and the base
  enemy.add(createDome(0, 0, 0));
  enemy.add(createBase(0, 0, 0));

  return enemy;
}

/**
 * Returns the dome of the enemy.
 *
 * @param {Number} x
 * @param {Number} y
 * @param {Number} z
 * @returns The dome object of the enemy
 */
function createDome(x, y, z) {
  'use strict';

  // Creates dome.
  var mesh = new THREE.Mesh(createDome.geometry, createDome.material);
  mesh.position.set(x, y, z);

  return mesh;
}
createDome.geometry = new THREE.SphereGeometry(4.5, 32, 32, 0, 3, 0, 3);
createDome.material = new THREE.MeshBasicMaterial({
  color: 0x333333,
  wireframe: false
});

/**
 * Returns a foot of the enemy spaceship.
 *
 * @param {Number} x
 * @param {Number} y
 * @param {Number} z
 * @param {Number} par1     direction in the x-axis of the foot
 * @param {Number} par2     direction in the y-axis of the foot
 * @param {Number} par3     direction in the z-axis of the foot
 * @returns The body object of the spaceship
 */
function createFoot(x, y, z, par1, par2, par3) {
  'use strict';

  // Creates a foot with 3 cubes
  var foot = new THREE.Object3D();
  var mesh = new THREE.Mesh(createFoot.geometry, createFoot.material);
  mesh.position.set(x, y, z);
  foot.add(mesh);
  for (var i = 0; i < 2; i++) {
    mesh = new THREE.Mesh(createFoot.geometry, createFoot.material);
    mesh.position.set(x + par1, y + par2, z + par3);
    foot.add(mesh);
  }
  return foot;
}
createFoot.geometry = new THREE.CylinderGeometry(0.5, 1, 0.5);
createFoot.material = new THREE.MeshBasicMaterial({
  color: 0x00ff00,
  wireframe: false
});

/**
 * Returns the base of the enemy.
 *
 * @param {Number} x
 * @param {Number} y
 * @param {Number} z
 * @returns The base object of the enemy
 */
function createBase(x, y, z) {
  'use strict';

  var base = new THREE.Object3D();

  base.add(createFoot(x + 3, y - 2, z - 2.5, 0.5, -0.5, -0.5));
  base.add(createFoot(x - 3, y - 2, z - 2.5, -0.5, -0.5, -0.5));
  base.add(createFoot(x, y + 2, z - 2.5, 0, 0.5, -0.5));

  return base;
}
createBase.material = new THREE.MeshBasicMaterial({
  color: 0x00ff00,
  wireframe: false
});

/**
 * Returns the body of the enemy.
 *
 * @param {THREE.Material} material
 * @param {Number} x
 * @param {Number} y
 * @param {Number} z
 * @returns The body object of the enemy
 */
function createEnemyBody(x, y, z) {
  'use strict';

  // Creates body.
  var mesh = new THREE.Mesh(createEnemyBody.geometry, createEnemyBody.material);
  mesh.position.set(x, y, z);

  return mesh;
}
createEnemyBody.geometry = new THREE.TorusGeometry(6.5, 2, 8, 20, 6.3);
createEnemyBody.material = new THREE.MeshBasicMaterial({
  color: 0x00ff00,
  wireframe: false
});
