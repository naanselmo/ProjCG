/**
 * Character class
 */
function Character() {
  'use strict';

  this.object3D = new THREE.Object3D();
  var geometry = new THREE.BoxGeometry( 10, 10, 10 );
  var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
  this.object3D.add(new THREE.Mesh(geometry, material));
}
