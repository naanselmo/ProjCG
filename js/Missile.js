/**
 * Missile class, inherits from Character
 */
Missile.prototype = Object.create(Character.prototype);
Missile.prototype.constructor = Missile;
function Missile(x, y, z) {
  'use strict';

  Character.call(this, x, y, z);
  var model = createMissile(0, 0, 0);
  model.scale.set(0.4, 0.4, 0.4);
  this.object3D.add(model);
  this.speed = 10;
  this.acceleration = 2; 
  // no processColision pedir ao pool para matar a bala
}
function createMissile(x,y,z){
	var geometry = new THREE.CylinderGeometry( 7, 1, 16, 8);
	var material = new THREE.MeshBasicMaterial( {color: 0xffff00} );
	var missile = new THREE.Mesh( geometry, material );
	return missile;

}
