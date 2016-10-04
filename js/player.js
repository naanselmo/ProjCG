/**
 * Player class, inherits from Character
 */
Player.prototype = Object.create(Character.prototype);
Player.prototype.constructor = Player;
function Player() {
  'use strict';
  Character.call(this);
}
