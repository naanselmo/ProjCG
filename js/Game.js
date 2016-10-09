// Global scope
var camera, scene, renderer, ambientLight, inputHandler, player, enemies;

/**
 * Creates a camera
 */
function createCamera() {
  'use strict';

  var factor = 10;
  camera = new THREE.OrthographicCamera(window.innerWidth/(-2*factor), window.innerWidth/(2*factor), window.innerHeight/(2*factor), window.innerHeight/(-2*factor), -100, 100 );
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

function toggleWireframe(objectToTraverse) {
  var stateFound = false;
  var wireframeState;
  if (objectToTraverse.object3D) {
    toggleWireframe(objectToTraverse.object3D);
  } else {
    objectToTraverse.traverse(function(object3D) {
      if (object3D.hasOwnProperty("material")) {
        if (!stateFound) {
          stateFound = true;
          wireframeState = !object3D.material.wireframe;
        }
        object3D.material.wireframe = wireframeState;
      }
    });
  }
}

/**
 * Adjusts the game after resize occurred
 */
function onResize() {
  'use strict';

  // Recreate the camera and reset the renderer sizes
  createCamera();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

/**
 * Renders the game
 */
function render() {
  'use strict';

  renderer.render(scene, camera);
}

/**
 * Animates the game
 */
function animate() {
  "use strict";

  // Wait for frame
  requestAnimationFrame(animate);

  // Animate every relevant object
  var delta = animate.clock.getDelta();
  player.animate(delta);
  enemies.animate(delta);

  // If A was pressed, toggle wireframe
  if(inputHandler.isPressed(65)) {
    toggleWireframe(scene);
  }

  // Render
  render();
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

  // Create input listener
  inputHandler = new InputHandler();

  // Add player
  player = new Player(0, -40);
  scene.add(player);

  // Add enemies
  enemies = new EnemyGroup();
  for (var i = 0; i < 5; i++) {
    for (var j = 0; j < 9; j++) {
      enemies.object3D.add(new Enemy(-40 + j*9, 35 - i*9).object3D);
    }
  }
  scene.add(enemies.object3D);

  // Create clock and begin animating
  animate.clock = new THREE.Clock();
  animate();

  // Add event listeners
  window.addEventListener("resize", onResize);
}
