function MissilePool(maxMissiles) {
  this.maxMissiles = maxMissiles;
  this.missiles = [];
  this.deadMissiles = [];
}

MissilePool.prototype.requestMissile = function (x, y, z) {
  if (this.deadMissiles.length > 0) {
    var missile = this.deadMissiles.pop();
    // TODO: Implement a setVisible(true|false)
    missile.object3D.visible = true;
    // TODO: missile.setPosition(x, y, z);
    missile.object3D.position.set(x, y, z);
    return missile;
  }

  if (this.missiles.length < this.maxMissiles) {
    var missile = new Missile(x, y, z);
    scene.add(missile);
    this.missiles.push(missile);
    return missile;
  }

  return null;
};

MissilePool.prototype.kill = function (missile) {
  // TODO: Implement a setVisible(true|false)
  missile.object3D.visible = false;
  this.deadMissiles.push(missile);
};
