/**
 * A class that will handle the HUD
 */
function HeadsUpDisplay() {
  'use strict';

  this.width = 2048;
  this.height = 1024;
  this.canvas = document.createElement('canvas');
  this.createCamera();
  this.bitmap = this.canvas.getContext('2d');
  this.scene = new THREE.Scene();
  this.texture = new THREE.Texture(this.canvas);
  this.texture.needsUpdate = true;
  this.material = new THREE.MeshBasicMaterial({
    map: this.texture
  });
  this.material.transparent = true;
  this.material.needsUpdate = true;
  this.scene.add(new THREE.Mesh(new THREE.PlaneGeometry(gameWidth, gameHeight), this.material));
  this.parameters = {};
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
 * Resizes the canvas and the HUD
 */
HeadsUpDisplay.prototype.resize = function () {
  'use strict';

  this.canvas.width = this.width;
  this.canvas.height = this.height;

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
  this.texture.needsUpdate = true;
  this.material.needsUpdate = true;
};

/**
 * Updates the HUD
 */
HeadsUpDisplay.prototype.update = function () {
  'use strict';

  this.bitmap.clearRect(0, 0, this.width, this.height);
  this.bitmap.font = 'Bold 20px Lucida Sans Unicode';
  this.bitmap.textAlign = 'left';
  this.bitmap.fillStyle = 'rgb(200, 200, 200)';
  var height = this.height / 8;
  for (var property in this.parameters) {
    this.bitmap.fillText(property + ": " + String(this.parameters[property]), this.width * (7 / 8), height);
    height += this.height / 32;
  }
};

HeadsUpDisplay.prototype.createCamera = function () {
  'use strict';

  this.camera = new THREE.OrthographicCamera();
  this.camera.near = -50;
  this.camera.far = 50;
};

HeadsUpDisplay.prototype.addParameter = function (parameter, value) {
  'use strict';

  this.parameters[parameter] = value || "";
  this.texture.needsUpdate = true;
  this.material.needsUpdate = true;
};

HeadsUpDisplay.prototype.removeParameter = function (parameter) {
  'use strict';

  delete this.parameters[parameter];
  this.texture.needsUpdate = true;
  this.material.needsUpdate = true;
};

HeadsUpDisplay.prototype.setParameter = function (parameter, value) {
  'use strict';

  this.parameters[parameter] = value;
  this.texture.needsUpdate = true;
  this.material.needsUpdate = true;
};
