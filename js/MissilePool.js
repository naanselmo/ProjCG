function MissilePool(maxMissiles) {
  this.maxMissiles = 10; // maxMissiles
  this.missiles = [];
  this.deadMissiles = [];
}

MissilePool.prototype.setVisible = function (state) {
  this.object3D.visible = state;
};


MissilePool.prototype.requestMaxMissiles = function () {
  return this.maxMissiles;
};

MissilePool.prototype.setPosition = function (x,y,z) {
  missile.object3D.position.set(x,y,z);
};

MissilePool.prototype.requestMissile = function (x, y, z) {
  var missile;
  if (this.deadMissiles.length > 0) {
    missile = this.deadMissiles.pop();
    // TODO: Implement a setVisible(true|false)
    missile.object3D.visible = true;
    // this.setVisible(true);

    // TODO: missile.setPosition(x, y, z);
    missile.object3D.position.set(x,y,z);
    //missile.setPosition(x, y, z);
    return missile;
  }

  if (this.missiles.length < this.maxMissiles) {
    missile = new Missile(x, y, z);
    scene.add(missile);
    this.missiles.push(missile);
    return missile;
  }

  return null;
};

MissilePool.prototype.kill = function (missile) {
  // TODO: Implement a setVisible(true|false)
  this.object3D.visible = false;
  // this.setVisible(false);
  this.deadMissiles.push(missile);
};
