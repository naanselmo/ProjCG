/**
 * A class that will handle the HUD
 */
function HeadsUpDisplay() {
  'use strict';

  this.right = 100;
  this.top = 50;
  this.scene = new THREE.Scene();
  this.camera = new THREE.OrthographicCamera();
  this.camera.near = -1000 - 25;
  this.camera.far = -1000 + 25;
  this.lives = [];
  this.livesCount = 0;
  for (var s = 0; s < 3; s++) {
    var spaceship = createSpaceship(Player.basicMaterial, this.right - 10 * (1 + s), this.top - 8, 1000);
    this.scene.add(spaceship);
    this.lives[s] = spaceship;
    this.livesCount++;
  }
  this.missiles = [];
  this.missileCount = 0;
  for (var m = 0; m < 5; m++) {
    var missile = createMissile(Missile.basicMaterial, this.right - 7 * (1 + m), this.top - 20, 1000);
    this.scene.add(missile);
    this.missiles[m] = missile;
    this.missileCount++;
  }
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
 * Remove lives
 */
HeadsUpDisplay.prototype.loseLife = function () {
  'use strict';

  if (this.livesCount === 0) {
    return;
  }

  this.lives[--this.livesCount].visible = false;
};

/**
 * Gain lives
 */
HeadsUpDisplay.prototype.gainLife = function () {
  'use strict';

  this.lives[this.livesCount++].visible = true;
};

/**
 * Remove missiles
 */
HeadsUpDisplay.prototype.loseMissile = function () {
  'use strict';

  if (this.missilesCount === 0) {
    return;
  }

  this.missiles[--this.missileCount].visible = false;
};

/**
 * Gain missiles
 */
HeadsUpDisplay.prototype.gainMissile = function () {
  'use strict';

  this.missiles[this.missileCount++].visible = true;
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