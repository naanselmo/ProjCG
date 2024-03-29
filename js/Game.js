// Global scope
var cameraHandler, scene, renderer, lightingHandler, inputHandler, player, enemies, gameWidth, gameHeight, missilePool, materialToUse, lastMaterialToUse, headsUpDisplay, gamePaused, gameOver, textureLoader;

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
  renderer.autoClear = false;

  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);
}

/**
 * Toggles wireframe for the selected traversable object
 * @param {Scene, Object3D, Character} objectToTraverse Object and its sub-objects to traverse and toggle wireframe
 */
function toggleWireframe(objectToTraverse) {
  var wireframeState;
  if (objectToTraverse.object3D) {
    toggleWireframe(objectToTraverse.object3D);
  } else {
    objectToTraverse.traverse(function (object3D) {
      if (object3D.hasOwnProperty("material")) {
        if (typeof (wireframeState) === 'undefined') {
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

  // Resize the current camera.
  cameraHandler.resize();
  headsUpDisplay.resize();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

/**
 * Renders the game
 */
function render() {
  'use strict';

  renderer.render(scene, cameraHandler.getCamera());
  renderer.clear(false, true, false);
  headsUpDisplay.render();
}

/**
 * Enters Game Over state
 */
function endGame() {
  gameOver = true;
  headsUpDisplay.endGame();
}

/**
 * Restarts the game
 */
function restart() {
  'use strict';

  // Clear the input handler
  inputHandler.clear();

  // Destroy player, enemies, and missiles
  player.destroy();
  for (var d = 0; d < enemies.length; d++) {
    enemies[d].destroy(false);
  }
  for (var m = 0; m < missilePool.missiles.length; m++) {
    missilePool.missiles[m].destroy();
  }

  // Add player
  player = new Player(0, -40);
  scene.add(player);

  // Add enemies
  enemies = [];
  for (var i = 0; i < 5; i++) {
    for (var j = 0; j < 5; j++) {
      var enemy = new Enemy(-24 + j * 12, 35 - i * 12);
      enemy.velocity.set(Math.random() - 0.5, Math.random() - 0.5, 0).normalize().multiplyScalar(enemy.maxVelocity);
      enemies.push(enemy);
      scene.add(enemy);
    }
  }

  // Create clock and begin animating
  animate.clock = new THREE.Clock();

  // Pause disabled on start, game not over yet
  gamePaused = false;
  gameOver = false;

  headsUpDisplay.restartGame();
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
  var i = 0;
  var objectsToIterate = [player].concat(enemies).concat(missilePool.missiles);

  // If A was pressed, toggle wireframe
  if (inputHandler.isPressed(65) && !gameOver) {
    toggleWireframe(scene);
  }

  // If S is pressed, pause the game
  if (inputHandler.isPressed(83) && !gameOver) {
    gamePaused = !gamePaused;
    headsUpDisplay.togglePause();
    inputHandler.clear();
  }

  // If R is pressed after game over, restart the game
  if (inputHandler.isPressed(82) && gameOver) {
    restart();
    return;
  }

  objectsToIterate = objectsToIterate.concat(missilePool.deadMissiles);

  if (!gameOver && inputHandler.isPressed(71)) {
    if (materialToUse == "phongMaterial") {
      materialToUse = "lambertMaterial";
    } else if (materialToUse == "lambertMaterial") {
      materialToUse = "phongMaterial";
    } else {
      materialToUse = lastMaterialToUse;
    }

    for (i = 0; i < objectsToIterate.length; i++) {
      var character = objectsToIterate[i];
      character.setMaterial(character[materialToUse]);
    }
  }

  if (!gameOver && inputHandler.isPressed(76)) {
    if (materialToUse == "basicMaterial") {
      materialToUse = lastMaterialToUse;
    } else {
      lastMaterialToUse = materialToUse;
      materialToUse = "basicMaterial";
    }

    for (i = 0; i < objectsToIterate.length; i++) {
      var character = objectsToIterate[i];
      character.setMaterial(character[materialToUse]);
    }
  }

  // All of these tasks are independent and could be parallelized
  // If only Javascript supported decent threading...

  if (!gamePaused && !gameOver) {
    for (i = 0; i < objectsToIterate.length; i++) {
      if (objectsToIterate[i].isVisible()) {
        objectsToIterate[i].animate(delta);
      }
    }

    for (i = 0; i < objectsToIterate.length; i++) {
      if (objectsToIterate[i].isVisible()) {
        objectsToIterate[i].checkConditions();
      }
    }

    for (i = 0; i < objectsToIterate.length; i++) {
      if (objectsToIterate[i].isVisible()) {
        objectsToIterate[i].updatePositions();
      }
    }
  }

  // Update all cameras.
  cameraHandler.update(delta);

  // Update the HUD
  headsUpDisplay.update(delta);

  // Update all the lights.
  lightingHandler.update(delta);

  // Render
  render();
}
/**
 * Creates a background with an image texture
 */

function createTexture() {
  textureLoader.load('textures/background1.jpg',
    function (texture) {
      var geometry = new THREE.PlaneGeometry(gameWidth, gameHeight);
      var material = new THREE.MeshBasicMaterial({
        map: texture
      });
      var background = new THREE.Mesh(geometry, material);
      background.position.z = -3;
      scene.add(background);
    });
}

/**
 * Initializes key variables and starts the game
 */
function init() {
  'use strict';

  // Set the world height and width
  gameWidth = 200;
  gameHeight = 100;

  // Pause disabled on start, game not over yet
  gamePaused = false;
  gameOver = false;

  // Set starting material
  materialToUse = "lambertMaterial";
  lastMaterialToUse = materialToUse;

  // Create the texture loader
  textureLoader = new THREE.TextureLoader();

  // Create components
  createScene();
  createRenderer();

  // Create the lighting handler.
  lightingHandler = new LightingHandler();

  //Create background texture
  createTexture();

  // Create missilePool
  missilePool = new MissilePool();

  // Create input listener
  inputHandler = new InputHandler();

  // Add player
  player = new Player(0, -40);
  scene.add(player);

  // Add enemies
  enemies = [];
  for (var i = 0; i < 5; i++) {
    for (var j = 0; j < 5; j++) {
      var enemy = new Enemy(-24 + j * 12, 35 - i * 12);
      enemy.velocity.set(Math.random() - 0.5, Math.random() - 0.5, 0).normalize().multiplyScalar(enemy.maxVelocity);
      enemies.push(enemy);
      scene.add(enemy);
    }
  }

  // Create camera handler. Create the handler after player since some cameras
  // depend on the player's position.
  cameraHandler = new CameraHandler();

  // Create the HUD
  headsUpDisplay = new HeadsUpDisplay();

  // Create clock and begin animating
  animate.clock = new THREE.Clock();
  animate();

  // Add event listeners
  window.addEventListener("resize", onResize);
}
