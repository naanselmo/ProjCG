// Global scope
var camera, scene, renderer, ambientLight, inputHandler, player, enemies, gameWidth, gameHeight;

/**
 * Creates an orthographic camera
 */
function createOrthographicCamera() {
  'use strict';

  var scaling = Math.min(renderer.getSize().width/gameWidth, renderer.getSize().height/gameHeight);
  var scalingWidth = (renderer.getSize().width/gameWidth)/scaling;
  var scalingHeight = (renderer.getSize().height/gameHeight)/scaling;

  var cameraWidth = gameWidth*scalingWidth;
  var cameraHeight = gameHeight*scalingHeight;
  camera = new THREE.OrthographicCamera(cameraWidth/(-2), cameraWidth/(2), cameraHeight/(2), cameraHeight/(-2), -50, 50 );
  console.log(cameraWidth, cameraHeight);
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
  if (camera.isOrthographicCamera) {
    createOrthographicCamera();
  } else {
    createPerspectiveCamera();
  }
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

  // Set the world height and width
  gameWidth = 200;
  gameHeight = 100;

  // Create components
  createScene();
  createRenderer();
  createAmbientLight();
  createOrthographicCamera();

  // Create input listener
  inputHandler = new InputHandler();

  // Add player
  player = new Player(0, -40);
  scene.add(player);

  // Add enemies
  enemies = new EnemyGroup();
  for (var i = 0; i < 4; i++) {
    for (var j = 0; j < 5; j++) {
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
