/**
 * InputHandler class
 */
function InputHandler() {
  'use strict';

  var keysDown = {};
  var keysPressed = {};

  this.isHeldDown = function (key) {
    return keysDown[key];
  };

  this.isPressed = function (key) {
    var isPressed = keysPressed[key];
    keysPressed[key] = false;
    return isPressed;
  };

  this.clear = function(){
    for (var property in keysDown) {
        if (keysDown.hasOwnProperty(property)) {
            keysDown[property] = false;
        }
    }
    for (var property in keysPressed) {
        if (keysPressed.hasOwnProperty(property)) {
            keysPressed[property] = false;
        }
    }
  }

  document.addEventListener('keydown', function (e) {
    keysDown[e.keyCode] = true;
  }, false);

  document.addEventListener('keyup', function (e) {
    keysDown[e.keyCode] = false;
    keysPressed[e.keyCode] = true;
  }, false);
}
