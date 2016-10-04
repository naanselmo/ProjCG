// Character:
//  - Mesh
//  - Texture
//  - Lights
//  - ...
// Player (inherits Character):
//  - InputListener
// Enemy (inherits Character):
//  - Artificial Intelligence (?)
// var EnemyGroup[x][y]:
//  - Enemy
// Main:
//  - Camera
//  - Renderer
//  - Scene
//  - Lights
//  - InputListener

// Global scope
var camera, scene, renderer, ambientLight;

/**
 * Creates a camera
 */
function createCamera() {
  'use strict';

  camera = new THREE.OrthographicCamera(window.innerWidth/(-2), window.innerWidth/(2), window.innerHeight/(2), window.innerHeight/(-2), -1000, 1000 );
}

/**
 * Creates the scene
 */
function createScene() {
  'use strict';

  scene = new THREE.Scene();
}

/**
 * Creates the renderer
 */
function createRenderer() {
  'use strict';

  renderer = new THREE.WebGLRenderer();

  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);
}

/**
 * Creates an ambient light
 */
function createAmbientLight() {
  'use strict';

  ambientLight = new THREE.AmbientLight( Math.random() * 0x10 );
	scene.add( ambientLight );
}

/**
 * Adjusts the game after resize occurred
 */
function onResize() {
  'use strict';

  // Recreate the camera and reset the renderer sizes
  camera = new THREE.OrthographicCamera(window.innerWidth/(-2), window.innerWidth/(2), window.innerHeight/(2), window.innerHeight/(-2), -1000, 1000 );
  renderer.setSize(window.innerWidth, window.innerHeight);
}

/**
 * Renders the game
 */
function render() {
  'use strict';

  // Always request frame before rendering
  requestAnimationFrame(render);
  renderer.render(scene, camera);
}

/**
 * Initializes key variables and starts the game
 */
function init() {
  'use strict';

  // Create components
  createScene();
  createCamera();
  createRenderer();
  createAmbientLight();

  // Add player
  scene.add(new Player());

  // Begin rendering
  render();

  // Add event listeners
  window.addEventListener("resize", onResize);
}
