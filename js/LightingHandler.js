/**
 * A class that will handle all the lighting.
 * Will also listen to lighting-change commands and perform the changes
 */
function LightingHandler() {
  'use strict';

  this.lights = [];

  // Create the ambient light
  this.createAmbientLight();

  // Create the point lights
  var variation = 20;
  for (var x = 0; x < 3; x++) {
    for (var y = 0; y < 2; y++) {
      this.createPointLight(((gameWidth / 3) * x + gameWidth / 6) - gameWidth / 2 + (Math.random() - 0.5) * variation, ((gameHeight / 2) * y + gameHeight / 4) - gameHeight / 2 + (Math.random() - 0.5) * variation, 10);
    }
  }

  // Create the directional light
  this.createDirectionalLight();
}

/**
 * Update all of the lights' information based on the delta time.
 * @param  {number} delta Time between frames.
 */
LightingHandler.prototype.update = function (delta) {
  'use strict';

  if (inputHandler.isPressed(77)) { // M key
    this.toggleLights(AmbientLight);
  }
  if (inputHandler.isPressed(78)) { // N key
    this.toggleLights(DirectionalLight);
  }
  if (inputHandler.isPressed(67)) { // C key
    this.toggleLights(PointLight);
  }
};

LightingHandler.prototype.addLight = function (light) {
  this.lights.push(light);
  scene.add(light.light);
};

LightingHandler.prototype.createAmbientLight = function () {
  this.addLight(new AmbientLight());
};

LightingHandler.prototype.createPointLight = function (x, y, z) {
  this.addLight(new PointLight(x || 0, y || 0, z || 10));
};

LightingHandler.prototype.createSpotLight = function (x, y, z, target) {
  this.addLight(new SpotLight(x || 0, y || 0, z || 10, target && target.object3D ? target.object3D : new THREE.Object3D()));
};

LightingHandler.prototype.createDirectionalLight = function (x, y, z, target) {
  this.addLight(new DirectionalLight(x || 0, y || 0, z || 10, target && target.object3D ? target.object3D : new THREE.Object3D()));
};

LightingHandler.prototype.toggleLights = function (type) {
  for (i = 0; i < this.lights.length; i++) {
    if (this.lights[i] instanceof type) {
      this.lights[i].toggle();
    }
  }
};

function Light() {
  'use strict';

  this.swappedIntensity = 0;
}

Light.prototype.toggle = function () {
  var temp = this.swappedIntensity;
  this.swappedIntensity = this.light.intensity;
  this.light.intensity = temp;
};

AmbientLight.prototype = Object.create(Light.prototype);
AmbientLight.prototype.constructor = AmbientLight;

function AmbientLight() {
  'use strict';

  Light.call(this);

  var color = "#ffffff";
  var intensity = 0.01;

  this.light = new THREE.AmbientLight(color, intensity);
}

DirectionalLight.prototype = Object.create(Light.prototype);
DirectionalLight.prototype.constructor = DirectionalLight;

function DirectionalLight(x, y, z, target) {
  'use strict';

  Light.call(this);

  var color = "#ffffff";
  var intensity = 0.5;

  this.light = new THREE.DirectionalLight(color, intensity);
  this.light.position.set(x, y, z);
  this.light.target = target;
}

PointLight.prototype = Object.create(Light.prototype);
PointLight.prototype.constructor = PointLight;

function PointLight(x, y, z) {
  'use strict';

  Light.call(this);

  var color = "#fffaf4";
  var intensity = 0.5;
  var distance = 50;
  var decay = 2;

  this.light = new THREE.PointLight(color, intensity, distance, decay);
  this.light.position.set(x, y, z);
}

SpotLight.prototype = Object.create(Light.prototype);
SpotLight.prototype.constructor = SpotLight;

function SpotLight(x, y, z, target) {
  'use strict';

  Light.call(this);

  var color = "#fffaf4";
  var intensity = 1;
  var distance = 0.0;
  var angle = Math.PI / 2;
  var penumbra = 0.0;
  var decay = 2;

  this.light = new THREE.SpotLight(color, intensity, distance, angle, penumbra, decay);
  this.light.position.set(x, y, z);
  this.light.castShadow = false;
  this.light.target = target;
}

/**
 * Creates the lighting helper background
 */
function createLightingHelper() {
  var geometry = new THREE.PlaneGeometry(gameWidth, gameHeight, gameWidth * 2, gameHeight * 2);
  var material = new THREE.MeshLambertMaterial({
    color: 0x101010
  });
  var background = new THREE.Mesh(geometry, material);
  background.position.z = 0;
  scene.add(background);
}
