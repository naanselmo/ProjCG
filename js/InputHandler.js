/**
 * InputHandler class
 */
function InputHandler() {
  'use strict';

  var keysPressed = {};
  this.isPressed = function(key) {
    return keysPressed[key];
  };

  document.addEventListener('keydown', function(e) {
    //console.log("Pressed " + e.keyCode);
    keysPressed[e.keyCode] = true;
  }, false);

  document.addEventListener('keyup', function(e) {
    //console.log("Let go " + e.keyCode);
    keysPressed[e.keyCode] = false;
  }, false);
}
