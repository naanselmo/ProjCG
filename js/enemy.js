/**
 * Enemy class, inherits from Character
 */
Enemy.prototype = Object.create(Character.prototype);
Enemy.prototype.constructor = Enemy;
function Enemy() {
  'use strict';
  Character.call(this);
}
