/**
 * A class that will handle the HUD
 */
function HeadsUpDisplay() {
  'use strict';

  this.right = 100;
  this.top = 50;
  this.scene = new THREE.Scene();
  this.camera = new THREE.OrthographicCamera();
  this.camera.near = -25;
  this.camera.far = +25;
  this.lives = [];
  this.livesCount = 0;
  for (var s = 0; s < player.lives; s++) {
    var spaceship = createSpaceship(Player.basicMaterial, this.right + 2 - 11 * (1 + s), this.top - 8, 0);
    this.scene.add(spaceship);
    this.lives[s] = spaceship;
    this.livesCount++;
  }
  this.missiles = [];
  this.missileCount = 0;
  for (var m = 0; m < player.missileCharge; m++) {
    var missile = createMissile(Missile.basicMaterial, this.right - 7 * (1 + m), this.top - 15, 0);
    this.scene.add(missile);
    this.missiles[m] = missile;
    this.missileCount++;
  }
  textureLoader.load('textures/game_over.png', this.createGameOver);
  textureLoader.load('textures/game_paused.png', this.createGamePaused);
  this.resize();
}

/**
 * Renders the HUD
 */
HeadsUpDisplay.prototype.render = function () {
  'use strict';

  renderer.render(this.scene, this.camera);
};

/**
 * Create Game Over overlay
 */
HeadsUpDisplay.prototype.createGameOver = function (texture) {
  var geometry = new THREE.PlaneGeometry(headsUpDisplay.right * 2, headsUpDisplay.top * 2);
  var material = new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true,
    opacity: 1
  });
  headsUpDisplay.gameOverOverlay = new THREE.Mesh(geometry, material);
  headsUpDisplay.gameOverOverlay.visible = false;
  headsUpDisplay.scene.add(headsUpDisplay.gameOverOverlay);
  headsUpDisplay.gameOverOverlay.position.z = 10;
};

/**
 * Create Game Paused overlay
 */
HeadsUpDisplay.prototype.createGamePaused = function (texture) {
  var geometry = new THREE.PlaneGeometry(headsUpDisplay.right * 2, headsUpDisplay.top * 2);
  var material = new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true,
    opacity: 1
  });
  headsUpDisplay.gamePausedOverlay = new THREE.Mesh(geometry, material);
  headsUpDisplay.gamePausedOverlay.visible = false;
  headsUpDisplay.scene.add(headsUpDisplay.gamePausedOverlay);
  headsUpDisplay.gamePausedOverlay.position.z = 10;
};

/**
 * Remove lives
 */
HeadsUpDisplay.prototype.loseLife = function () {
  'use strict';

  if (this.livesCount === 0) {
    return;
  }

  this.livesCount--;
  this.lives[this.livesCount].visible = false;
};

/**
 * Gain lives
 */
HeadsUpDisplay.prototype.gainLife = function () {
  'use strict';

  if (!this.lives[this.livesCount]) {
    return;
  }

  this.lives[this.livesCount].visible = true;
  this.livesCount++;
};

/**
 * Remove missiles
 */
HeadsUpDisplay.prototype.loseMissile = function () {
  'use strict';

  if (this.missileCount === 0) {
    return;
  }

  this.missileCount--;
  this.missiles[this.missileCount].visible = false;
};

/**
 * Gain missiles
 */
HeadsUpDisplay.prototype.gainMissile = function () {
  'use strict';

  if (!this.missiles[this.missileCount]) {
    return;
  }

  this.missiles[this.missileCount].visible = true;
  this.missileCount++;
};

/**
 * Toggle pause menu
 */
HeadsUpDisplay.prototype.togglePause = function () {
  'use strict';

  this.gamePausedOverlay.visible = !this.gamePausedOverlay.visible;
};

/**
 * Ends the game
 */
HeadsUpDisplay.prototype.endGame = function () {
  'use strict';

  this.gameOverOverlay.visible = true;
};

/**
 * Restarts the game
 */
HeadsUpDisplay.prototype.restartGame = function () {
  'use strict';

  this.gameOverOverlay.visible = false;

  while (this.missileCount < player.missileCharge) {
    this.gainMissile();
  }

  while (this.livesCount < player.lives) {
    this.gainLife();
  }
};

/**
 * Resizes the HUD
 */
HeadsUpDisplay.prototype.resize = function () {
  'use strict';

  var scaling = Math.min(renderer.getSize().width / gameWidth, renderer.getSize().height / gameHeight);
  var scalingWidth = (renderer.getSize().width / gameWidth) / scaling;
  var scalingHeight = (renderer.getSize().height / gameHeight) / scaling;

  var cameraWidth = gameWidth * scalingWidth;
  var cameraHeight = gameHeight * scalingHeight;

  this.camera.left = cameraWidth / (-2);
  this.camera.right = cameraWidth / (2);
  this.camera.top = cameraHeight / (2);
  this.camera.bottom = cameraHeight / (-2);

  // Update the projection matrix.
  this.camera.updateProjectionMatrix();
};

/**
 * Updates the HUD
 */
HeadsUpDisplay.prototype.update = function () {
  'use strict';
};
