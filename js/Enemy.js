/**
 * Enemy class, inherits from Character
 */
Enemy.prototype = Object.create(Character.prototype);
Enemy.prototype.constructor = Enemy;
function Enemy(x, y, z) {
  'use strict';

  Character.call(this, x, y, z);
  var speed = 10;
  this.object3D.add(new THREE.Mesh(new THREE.BoxGeometry( 1, 1, 1 ), new THREE.MeshBasicMaterial( { color: 0x00ff00 } )));

  Enemy.prototype.animate = function(delta) {
  };
}
