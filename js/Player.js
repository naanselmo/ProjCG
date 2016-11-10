/**
 * Player class, inherits from Character
 */
Player.prototype = Object.create(Character.prototype);
Player.prototype.constructor = Player;

function Player(x, y, z) {
  'use strict';

  Character.call(this, x, y, z);
  this.maxVelocity = 50;
  this.maxRotation = Math.PI / 6;
  this.missileClock = new THREE.Clock();
  this.missileCooldown = 0.5;
  this.missileCooldownLeft = this.missileCooldown;
  this.missileMaxCharge = 5;
  this.missileCharge = this.missileMaxCharge;

  this.basicMaterial = Player.basicMaterial;
  this.phongMaterial = Player.phongMaterial;
  this.lambertMaterial = Player.lambertMaterial;
  this.material = this[materialToUse];

  var model = createSpaceship(this.material, 0, 0, 0);
  model.scale.set(1, 1, 1);
  this.object3D.add(model);
  this.boundingBox.setFromObject(this.object3D);
  this.boundingSphere.set(this.boundingBox.getCenter(), Math.max(this.boundingBox.getSize().x, this.boundingBox.getSize().y, this.boundingBox.getSize().z) / 2);
}
Player.basicMaterial = new THREE.MeshBasicMaterial({
  color: 0x22cc22
});
Player.phongMaterial = new THREE.MeshPhongMaterial({
  color: 0x22cc22,
  specular: 0x444444,
  shininess: 40,
  shading: THREE.SmoothShading
});
Player.lambertMaterial = new THREE.MeshLambertMaterial({
  color: 0x22cc22
});

Player.prototype.animate = function (delta) {
  'use strict';

  var noInput = true;

  if (inputHandler.isHeldDown(37)) { // Left arrow key
    if (this.velocity.x > 0) { // Increased acceleration when switching directions
      this.acceleration.setX(-50);
    } else {
      this.acceleration.setX(-25);
    }
    this.rotationVelocity.setY(-1 * Math.PI / 3);
    noInput = !noInput;
  }
  if (inputHandler.isHeldDown(39)) { // Right arrow key
    if (this.velocity.x < 0) { // Increased acceleration when switching directions
      this.acceleration.setX(50);
    } else {
      this.acceleration.setX(25);
    }
    this.rotationVelocity.setY(Math.PI / 3);
    noInput = !noInput;
  }
  if (noInput) {
    this.acceleration.setX(-1 * Math.sign(this.velocity.x) * Math.min(25, Math.abs(this.velocity.x) / delta));
    this.rotationVelocity.setY(-1 * Math.sign(this.getRotationY()) * Math.min(Math.PI / 3, Math.abs(this.getRotationY()) / delta));
  }

  // Check for missile restock now
  this.missileCooldownLeft -= this.missileClock.getDelta();
  while (this.missileCharge < this.missileMaxCharge && this.missileCooldownLeft <= 0) {
    this.missileCooldownLeft += this.missileCooldown;
    this.missileCharge++;
  }
  if (this.missileCharge >= this.missileMaxCharge) {
    this.missileCooldownLeft = this.missileCooldown;
  } else {
    this.missileCooldownLeft = Math.max(this.missileCooldownLeft, 0);
  }

  if (inputHandler.isPressed(66)) { // B key
    if (this.missileCharge > 0) {
      this.missileCharge--;
      missilePool.requestMissile(this.getPositionX(), this.getPositionY() + 6.5, this.getPositionZ());
    }
  }

  Character.prototype.animate.call(this, delta);
};

Player.prototype.handleOutOfBounds = function (boundary) {
  'use strict';

  this.toMove.multiplyScalar(0);
  this.velocity.multiplyScalar(-0.5);
  this.toRotate.multiplyScalar(0);
};

Player.prototype.handleCollision = function (collisionObject) {
  'use strict';

  this.toMove.multiplyScalar(0);
  this.velocity.multiplyScalar(0);
};

/**
 * Creates a new spaceship object3d model.
 * @param  {THREE.Material} material The material of the model.
 * @param  {number} x The x coordinate of the original position of the model.
 * @param  {number} y The y coordinate of the original position of the model.
 * @param  {number} z The z coordinate of the original position of the model.
 * @return {THREE.Object3D}  The object3d model.
 */
function createSpaceship(material, x, y, z) {
  'use strict';
  // Create the body
  var body = modelBody(material);
  // Create the windshield
  var windshield = modelWindshield(material);
  windshield.position.y = 0.5;
  body.add(windshield);
  // Create the wings
  var winds = modelWinds(material);
  winds.position.y = 0.50;
  body.add(winds);
  // Set the spaceship position.
  body.position.set(x, y, z);
  return body;
}

function modelBody(material) {
  'use strict';
  var body = new THREE.Object3D();

  // Create the custom mesh.
  var geometry = new THREE.Geometry();
  // The vertexes
  geometry.vertices = [
    // top base vertexes
    new THREE.Vector3(-2, 0, 0),
    new THREE.Vector3(0, 6, 0),
    new THREE.Vector3(2, 0, 0),
    // bottom base ones
    new THREE.Vector3(-1, 0, -1.5),
    new THREE.Vector3(-0.5, 3, -1.5),
    new THREE.Vector3(0.5, 3, -1.5),
    new THREE.Vector3(1, 0, -1.5),
  ];
  // The faces
  geometry.faces = [
    // top base face
    new THREE.Face3(0, 2, 1),
    // turbos face
    new THREE.Face3(3, 6, 2),
    new THREE.Face3(3, 2, 0),
    // bottom face
    new THREE.Face3(3, 4, 6),
    new THREE.Face3(6, 4, 5),
    // bottom face to the tip
    new THREE.Face3(5, 4, 1),
    // left face
    new THREE.Face3(4, 3, 0),
    new THREE.Face3(1, 4, 0),
    // right face
    new THREE.Face3(2, 6, 5),
    new THREE.Face3(2, 5, 1)
  ];
  // Compute face normals
  geometry.computeFaceNormals();
  geometry.computeVertexNormals();

  var mesh = new THREE.Mesh(geometry, material);
  body.add(mesh);
  return body;
}

function modelWindshield(material) {
  'use strict';
  var windshield = new THREE.Object3D();

  var geometry = new THREE.Geometry();
  geometry.vertices = [
    // The back of the windshield
    new THREE.Vector3(0, 0, 0),
    // The middle of the windshield
    new THREE.Vector3(-1, 1, 0),
    new THREE.Vector3(1, 1, 0),
    new THREE.Vector3(-0.5, 1, 0.75),
    new THREE.Vector3(0.5, 1, 0.75),
    // Front of the windshield
    new THREE.Vector3(-0.5, 2, 0.75),
    new THREE.Vector3(0.5, 2, 0.75),
    new THREE.Vector3(-0.25, 3, 0),
    new THREE.Vector3(0.25, 3, 0),
  ];

  geometry.faces = [
    // Back faces
    new THREE.Face3(0, 3, 1),
    new THREE.Face3(0, 4, 3),
    new THREE.Face3(0, 2, 4),
    // Front faces
    new THREE.Face3(3, 4, 6),
    new THREE.Face3(3, 6, 5),
    new THREE.Face3(5, 6, 8),
    new THREE.Face3(5, 8, 7),
    // Laterals
    new THREE.Face3(1, 3, 5),
    new THREE.Face3(1, 5, 7),
    new THREE.Face3(4, 2, 6),
    new THREE.Face3(6, 2, 8)
  ];
  // Compute face normals
  geometry.computeFaceNormals();
  geometry.computeVertexNormals();

  var mesh = new THREE.Mesh(geometry, material);
  windshield.add(mesh);
  return windshield;
}

function modelWinds(material) {
  'use strict';
  var wind = new THREE.Object3D();

  var geometry = new THREE.Geometry();
  geometry.vertices = [
    // middle top
    new THREE.Vector3(0, 0, 0), //0
    new THREE.Vector3(0, 3, 0), //1
    // right wing vertices
    new THREE.Vector3(4.5, 0, -1), //2
    new THREE.Vector3(4, 1.5, -1.5), //3

    // middle bottom
    new THREE.Vector3(0, 0, -1), //4
    new THREE.Vector3(0, 3, -1), //5

    // left wing vertices
    new THREE.Vector3(-4.5, 0, -1), //6
    new THREE.Vector3(-4, 1.5, -1.5), //7
  ];

  geometry.faces = [
    // Right wing Top face
    new THREE.Face3(0, 2, 1),
    new THREE.Face3(2, 3, 1),
    // Right wing Bottom face
    new THREE.Face3(2, 4, 5),
    new THREE.Face3(3, 2, 5),
    // Right wing Back face
    new THREE.Face3(0, 4, 2),
    // Right wing Front face
    new THREE.Face3(3, 5, 1),

    // Left wing Top face
    new THREE.Face3(6, 0, 1),
    new THREE.Face3(7, 6, 1),
    // Left wing Bottom face
    new THREE.Face3(5, 4, 6),
    new THREE.Face3(6, 7, 5),
    // Left wing Back face
    new THREE.Face3(6, 4, 0),
    // Left wing Front face
    new THREE.Face3(1, 5, 7),
  ];
  // Compute face normals
  geometry.computeFaceNormals();
  geometry.computeVertexNormals();

  var mesh = new THREE.Mesh(geometry, material);
  wind.add(mesh);

  return wind;
}
