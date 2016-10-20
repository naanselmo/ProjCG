/**
 * Player class, inherits from Character
 */
Player.prototype = Object.create(Character.prototype);
Player.prototype.constructor = Player;
function Player(x, y, z) {
  'use strict';

  Character.call(this, x, y, z);
  var speed = 0;
  var acceleration = 50;
  var decceleration = 25;
  var maxSpeed = 50;
  var rotationSpeed = Math.PI/3;
  var maxAngle = Math.PI/6;
  var model = createSpaceship(0, 0, 0);
  model.scale.set(1, 1, 1);
  this.object3D.add(model);

  Player.prototype.animate = function(delta) {
    var boundingBox = new THREE.Box3().setFromObject(this.object3D);
    var noInput = true;
    var angle = this.getRotationY();
    var rotation = 0;

    if(inputHandler.isHeldDown(37)) { // Left arrow key
      if (speed > 0) { // Increased acceleration when switching directions
        speed -= Math.sign(speed)*Math.min(Math.abs(speed), decceleration*delta);
      }
      speed -= acceleration*delta;
      rotation -= rotationSpeed*delta;
      noInput = !noInput;
    }

    if ( inputHandler.isPressed(66)){
      // pedir à pool um missil numa determinada posiçao
      // determinar posição da nave
      console.log("Shots fired");
    }
    if(inputHandler.isHeldDown(39)) { // Right arrow key
      if (speed < 0) { // Increased acceleration when switching directions
        speed -= Math.sign(speed)*Math.min(Math.abs(speed), decceleration*delta);
      }
      speed += acceleration*delta;
      rotation += rotationSpeed*delta;
      noInput = !noInput;
    }
    if (noInput) {
      speed -= Math.sign(speed)*Math.min(Math.abs(speed), decceleration*delta);
      rotation -= Math.sign(angle)*Math.min(Math.abs(angle), rotationSpeed*delta);
    }

    // Rotation limit checks
    if (rotation !== 0){
      rotation = Math.sign(rotation)*Math.min(Math.abs(rotation), Math.abs(Math.sign(rotation)*maxAngle - angle));
    }

    // Speed limit checks
    if (speed !== 0){
      speed = Math.sign(speed)*Math.min(Math.abs(speed), maxSpeed);
    }

    if (speed > 0) { // Check collisions on the right
      if ((boundingBox.max.x + speed*delta) < (gameWidth/2)) {
        this.translateSceneX(speed*delta);
        this.rotateY(rotation);
      } else {
        // Out of bounds, bounce
        speed *= -0.5;
      }
    } else if (speed < 0) { // Check collisions on the left
      if ((boundingBox.min.x + speed*delta) > (-gameWidth/2)) {
        this.translateSceneX(speed*delta);
        this.rotateY(rotation);
      } else {
        // Out of bounds, bounce
        speed *= -0.5;
      }
    }
  };
}

/**
 * Returns the new spaceship object.
 *
 * @param {Number} x
 * @param {Number} y
 * @param {Number} z
 * @returns {THREE.Object3D} The spaceship object
 */
function createSpaceship(x, y, z) {
    var material = new THREE.MeshBasicMaterial({ color: 0x0ffff0, wireframe: false });
    var body = createSpaceshipBody(material, 0, 0, 0);
    var rightWing = createWing(material, 0, 0.75, 0);
    body.add(rightWing);
    body.add(flipY(rightWing.clone()));
    body.position.set(x, y, z);
    return body;
}

/**
 * Returns the body of the new spaceship.
 *
 * @param {THREE.Material} material
 * @param {Number} x
 * @param {Number} y
 * @param {Number} z
 * @returns The body object of the spaceship
 */
function createSpaceshipBody(material, x, y, z) {
    // Create main body.
    var body = new THREE.Object3D();
    var geometry = PyramidGeometry(4, 6, -2);
    var mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    body.add(mesh);

    // Create windshield
    var windshield = new THREE.Object3D();
    geometry = PyramidGeometry(2, -1, 1);
    mesh = new THREE.Mesh(geometry, material);
    windshield.add(mesh);

    geometry = PyramidGeometry(2, 2, 1);
    mesh = new THREE.Mesh(geometry, material);
    windshield.add(mesh);
    windshield.position.set(x, y + 1.5, z);
    body.add(windshield);

    // Create back spoilers.
    var rightSpoiler = createSpoiler(material, x + 0.5, y, z);
    body.add(rightSpoiler);
    body.add(flipY(rightSpoiler.clone()));

    // Create all exhaust pipes.
    var rightTurbo = createExhaustPipe(material, 0.5, 0, -0.5, 1, -0.5);
    body.add(rightTurbo); // Right exhaust pipe.
    body.add(flipY(rightTurbo.clone())); // Left exhaust pipe.
    body.add(createExhaustPipe(material, 0, 0, -1, 1, -0.5)); // Middle exhaust pipe.

    return body;
}

/**
 * Creates the wing object of the ship.
 *
 * @param {THREE.Material} material
 * @param {Number} x
 * @param {Number} y
 * @param {Number} z
 * @returns The wing object of the ship.
 */
function createWing(material, x, y, z) {
    var wing = new THREE.Object3D();
    // Create wing main frame.
    var mainFrame = new THREE.Object3D();
    var geometry = new THREE.BoxGeometry(3, 1, 0.5);
    var mesh = new THREE.Mesh(geometry, material);
    mainFrame.add(mesh);

    geometry = new THREE.BoxGeometry(3, 1, 0.5);
    mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.z = -36 * Math.PI / 180;
    mesh.position.set(0, 1, 0);

    mainFrame.position.set(x + 1.5, y + 0.5, z - 0.5);
    mainFrame.rotation.y = 20 * Math.PI / 180;
    mainFrame.add(mesh);
    wing.add(mainFrame);

    // Create turbo.
    var turbo = new THREE.Object3D();
    turbo.add(createExhaustPipe(material, 0, 0, 0, 2, 1));
    turbo.add(createExhaustPipe(material, 0, 0, 0, 2, -1));
    turbo.position.set(x + 3.5, y + 0.75, z - 1);
    wing.add(turbo);

    return wing;
}

/**
 * Creates the right spoiler object of the spaceship.
 *
 * @param {THREE.Material} material
 * @param {Number} x
 * @param {Number} y
 * @param {Number} z
 * @returns The object of the spoiler of the spaceship.
 */
function createSpoiler(material, x, y, z) {
    var spoiler = new THREE.Object3D();

    // Create the spoiler.
    geometry = new THREE.BoxGeometry(3, 0.75, 0.2);
    mesh = new THREE.Mesh(geometry, material);
    // Rotate it
    mesh.rotation.y = -75 * Math.PI / 180;
    mesh.position.set(x, y + 0.375, z); // y+0.75/2 para y comecar do 0
    spoiler.add(mesh);

    return spoiler;
}

/**
 * Creates a exhaust pipe object.
 *
 * @param {THREE.Material} material
 * @param {Number} x The center x cordinate
 * @param {Number} y The y cordinate based on the base of the escape
 * @param {Number} z The center z cordinate
 * @param {Number} width The width of the larger part of the escape
 * @param {Number} height The height of the escape. If height is negative it will flip the pipe.
 * @returns
 */
function createExhaustPipe(material, x, y, z, width, height) {
    var pipe = new THREE.Object3D();
    if (height < 0) {
        geometry = new THREE.CylinderGeometry(width / 2, width / 2 - width / 4, -height);
    } else {
        geometry = new THREE.CylinderGeometry(width / 2 - width / 4, width / 2, height);
    }
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y + height / 2, z);
    pipe.add(mesh);

    return pipe;
}

/**
 * Makes a custom pyramid.
 *
 * @param {Number} width The witdth of the irregular edge in the base.
 * @param {Number} height The height of the pyramid.
 * @param {Number} depth The depth of the pyramid.
 * @returns The custom pyramid geometry.
 */
function PyramidGeometry(width, height, depth) {
    var geometry = new THREE.Geometry();
    geometry.vertices = [
        // base bottom one
        new THREE.Vector3(0, 0, depth),
        // base same plane ones
        new THREE.Vector3(-width / 2, 0, 0),
        new THREE.Vector3(width / 2, 0, 0),
        // tip
        new THREE.Vector3(0, height, 0)
    ];

    geometry.faces = [
        // base face
        new THREE.Face3(0, 2, 1),
        // laterals faces
        new THREE.Face3(0, 1, 3),
        new THREE.Face3(0, 3, 2),
        new THREE.Face3(1, 2, 3)
    ];

    geometry.computeFaceNormals();
    geometry.computeVertexNormals();

    return geometry;
}

/**
 * Mirrors a object based on the zy plane.
 *
 * @param {THREE.Object3D} object3d The object to be mirrored.
 * @returns The mirrored object.
 */
function flipY(object3d) {
    var flipMatrix = (new THREE.Matrix4()).identity();
    flipMatrix.elements[0] = -1;
    object3d.applyMatrix(flipMatrix);
    return object3d;
}
