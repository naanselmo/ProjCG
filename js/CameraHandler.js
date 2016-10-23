/**
 * A class that will handle all the cameras.
 * Will also change between them by pressing 1 for the first, 2 for the second
 * and so on.
 */
function CameraHandler(){
  'use strict';
  this.cameras = [];
  // Add all the cameras.
  this.cameras.push(new OrthographicCamera());
  this.cameras.push(new PerspectiveCamera());
  this.cameras.push(new FollowCamera());
  // Use the first camera by default.
  this.currentCamera = this.cameras[0];
}

/**
 * Update all of the cameras' information based on the delta time.
 * @param  {number} delta Time between frames.
 */
CameraHandler.prototype.update = function(delta){
  'use strict';
  // Check if there is any need to change camera.
  for (var i = 0; i < this.cameras.length; i++) {
    if(inputHandler.isPressed(49+i)){
      this.currentCamera = this.cameras[i];
      return;
    }
  }

  // Update all cameras, independently if they are being used or not!
  this.cameras.forEach(function (camera){
    camera.update(delta);
  });
}

/**
 * Calls the currentCamera's resize function.
 */
CameraHandler.prototype.resize = function () {
  'use strict';
  this.currentCamera.resize();
};

/**
 * Returns the current camera.
 * @return {THREE.Camera} The current camera.
 */
CameraHandler.prototype.getCamera = function () {
  'use strict';
  return this.currentCamera.camera;
};

/**
 * The Follow camera wrapper.
 * This camera will smoothly follow the player no matter what!
 * The camera parameters are picked randomly (no calculations needed), as long
 * as it stays behind the player.
 */
function FollowCamera() {
  'use strict';
  this.lerp = 3;
  this.camera = new THREE.PerspectiveCamera();
  this.resize();
}

/**
 * The function that will run whenever the viewport changes and the camera needs
 * to update it's view.
 */
FollowCamera.prototype.resize = function () {
  'use strict';
  this.camera.fov = 70;
  this.camera.aspect = window.innerWidth/window.innerHeight;
  this.camera.near = 0.1;
  this.camera.far = 1000;

  this.camera.position.set(player.getPositionX(), player.getPositionY()-10, 5);
  this.camera.up.set(0, 0, 1);
  this.camera.lookAt(new THREE.Vector3(player.getPositionX(), 0, 0));

  // Update the projection matrix.
  this.camera.updateProjectionMatrix();
};

/**
 * The update function of the camera. Responsible of smoothly following the player.
 * @param  {number} delta Time between frames.
 */
FollowCamera.prototype.update = function (delta) {
  'use strict';
  this.camera.position.x += (player.getPositionX() - this.camera.position.x) * this.lerp * delta;
};

/**
 * The Perspective camera wrapper.
 * This camera will be a perspective camera that will always show all the game
 * field on screen no matter what.
 */
function PerspectiveCamera() {
  'use strict';
  this.camera = new THREE.PerspectiveCamera();
  this.resize();
}

/**
 * The function that will run whenever the viewport changes and the camera needs
 * to update it's view.
 */
PerspectiveCamera.prototype.resize = function () {
  'use strict';
  // Thanks Nuno for the piece of magical code.
  var scaling = Math.min(renderer.getSize().width / gameWidth, renderer.getSize().height / gameHeight);
  var scalingWidth = (renderer.getSize().width / gameWidth) / scaling;
  var scalingHeight = (renderer.getSize().height / gameHeight) / scaling;
  var cameraWidth = gameWidth * scalingWidth;
  var cameraHeight = gameHeight * scalingHeight;

  // Choose an arbitrary fov, it doesn't matter anyway it will get deleted in the projection matrix.
  // Bigger fov = lesser distance and vice-versa.
  var fov = 70;
  // Calculate the distance of the camera to the game, so it shows the whole game, based on the fov and on the cameraHeight.
  // This will allow to show all the game by having the lower horizontal limit fill the viewport width.
  // This distance will make sure that no matter what fov you choose, it will make the whole horizontal limit to be inside the frustum,
  // and therefore the whole game.
  var distance = (cameraHeight*0.5) / Math.tan(fov/2*(Math.PI/180));

  // Rotate the camera in relation to the lower horizontal game limit. See drawing for demonstration.
  // This rotation is in degrees, and will make sure that the lower horizontal limit will still be on screen after the rotation.
  var angle = 30;
  var distanceZ = distance * Math.sin(angle*(Math.PI/180));
  var distanceY = distance * Math.cos(angle*(Math.PI/180));

  // Update the camera, with the calculated parameters.
  this.camera.fov = fov;
  this.camera.aspect = cameraWidth/cameraHeight;
  // Near will be near the lower horizontal limit. Notice the -distanceZ, its just to make sure
  // that when rotating, the near plane doesn't cut the elements that are close to the lower horizontal limit.
  this.camera.near = distance-distanceZ;
  // The same happens with the far plane.
  this.camera.far = distance+gameHeight+distanceZ;

  // Set the position of the camera by summing the distance in relation to the lower horizontal limit.
  this.camera.position.set(0, -(gameHeight/2)-distanceY, distanceZ);
  // Set the camera roll to upwards.
  this.camera.up.set(0, 0, 1);
  // Look at the center of the game.
  this.camera.lookAt(new THREE.Vector3(0, 0, 0));

  // Update the projection matrix.
  this.camera.updateProjectionMatrix();
};

/**
 * The update function of the camera.
 * @param  {number} delta Time between frames.
 */
PerspectiveCamera.prototype.update = function (delta) {
  'use strict';
};

/**
 * The Orthographic camera wrapper.
 * This camera is an orthographic camera that will display the whole game field
 * no matter what.
 */
function OrthographicCamera() {
  'use strict';
  this.camera = new THREE.OrthographicCamera();
  this.camera.near = -50;
  this.camera.far = 50;
  this.resize();
}

/**
 * The function that will run whenever the viewport changes and the camera needs
 * to update it's view.
 */
OrthographicCamera.prototype.resize = function () {
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
 * The update function of the camera.
 * @param  {number} delta Time between frames.
 */
OrthographicCamera.prototype.update = function (delta) {
  'use strict';
};
