// Global scope
var cameraHandler, scene, renderer, lightingHandler, inputHandler, player, enemies, gameWidth, gameHeight, missilePool;

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
  renderer.setSize(window.innerWidth, window.innerHeight);
}

/**
 * Renders the game
 */
function render() {
  'use strict';

  renderer.render(scene, cameraHandler.getCamera());
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

  // All of these tasks are independent and could be parallelized
  // If only Javascript supported decent threading...

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

  // Update all cameras.
  cameraHandler.update(delta);

  // Update all the lights.
  lightingHandler.update(delta);

  // If A was pressed, toggle wireframe
  if (inputHandler.isPressed(65)) {
    toggleWireframe(scene);
  }

  if (inputHandler.isPressed(71)) {
    for (i = 0; i < objectsToIterate.length; i++) {
      var character = objectsToIterate[i];
      if (character.getMaterial() == character.lambertMaterial){
        character.setMaterial(character.phongMaterial);
      }else if (character.getMaterial() == character.phongMaterial){
        character.setMaterial(character.lambertMaterial);
      } else {character.setMaterial(character.getLastMaterial());  }  

    }
  }

  if (inputHandler.isPressed(76)) {
    for (i = 0; i < objectsToIterate.length; i++) {
      var character = objectsToIterate[i];
       if (character.getMaterial() == character.basicMaterial){
        character.setMaterial(character.getLastMaterial());
      }else{
        character.setLastMaterial(character.getMaterial());
        character.setMaterial(character.basicMaterial);
      }    
    }
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

  // Create the lighting handler.
  lightingHandler = new LightingHandler();

  // Create clock and begin animating
  animate.clock = new THREE.Clock();
  animate();

  // Add event listeners
  window.addEventListener("resize", onResize);
}
