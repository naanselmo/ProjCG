/**
 * Player class, inherits from Character
 */
Player.prototype = Object.create(Character.prototype);
Player.prototype.constructor = Player;
function Player(x, y, z) {
  'use strict';

  Character.call(this, x, y, z);
  var speed = 50;
  this.object3D.add(new THREE.Mesh(new THREE.BoxGeometry( 1, 1, 1 ), new THREE.MeshBasicMaterial( { color: 0x00ff00 } )));

  Player.prototype.animate = function(delta) {
    var boundingBox = new THREE.Box3().setFromObject(this.object3D);

    if(inputHandler.isPressed(37)) { // Left arrow key
      if ((boundingBox.min.x + -1*speed*delta) > camera.left) {
        this.translateX(-1*speed*delta);
      } else {
        // Out of bounds, move against the wall
        this.translateX(camera.left - boundingBox.min.x);
      }
    }
    /*if(inputHandler.isPressed(38)) { // Up arrow key
      if ((boundingBox.max.y + speed*delta) < camera.top) {
        this.translateY(speed*delta);
      } else {
        // Out of bounds, move against the wall
        this.translateY(camera.top - boundingBox.max.y);
      }
    }*/
    if(inputHandler.isPressed(39)) { // Right arrow key
      if ((boundingBox.max.x + speed*delta) < camera.right) {
        this.translateX(speed*delta);
      } else {
        // Out of bounds, move against the wall
        this.translateX(camera.right - boundingBox.max.x);
      }
    }
    /*if(inputHandler.isPressed(40)) { // Down arrow key
      if ((boundingBox.min.y + -1*speed*delta) > camera.bottom) {
        this.translateY(-1*speed*delta);
      } else {
        // Out of bounds, move against the wall
        this.translateY(camera.bottom - boundingBox.min.y);
      }
    }*/
  };
}
