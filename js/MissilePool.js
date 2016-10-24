function MissilePool() {
  'use strict';

  this.missiles = [];
  this.deadMissiles = [];
}

MissilePool.prototype.setPosition = function (x, y, z) {
  'use strict';

  missile.object3D.position.set(x, y, z);
};

MissilePool.prototype.requestMissile = function (x, y, z) {
  'use strict';

  var missile = null;
  if (this.deadMissiles.length > 0) {
    missile = this.popDead();
    missile.setVisible(true);
    missile.setPosition(x, y, z);
    missile.boundingBox.setFromObject(missile.object3D);
  } else {
    missile = new Missile(x, y, z);
    scene.add(missile);
    this.push(missile);
  }

  return missile;
};

MissilePool.prototype.push = function (missile) {
  this.missiles.push(missile);
};

MissilePool.prototype.pop = function () {
  return this.missiles.pop();
};

MissilePool.prototype.pushDead = function (missile) {
  this.deadMissiles.push(missile);
};

MissilePool.prototype.popDead = function () {
  return this.deadMissiles.pop();
};
