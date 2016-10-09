/**
 * Enemy class, inherits from Character
 */
Enemy.prototype = Object.create(Character.prototype);
Enemy.prototype.constructor = Enemy;
function Enemy(x, y, z) {
  'use strict';

  Character.call(this, x, y, z);
  var model = createEnemy(0, 0, 0)
  model.scale.set(0.4, 0.4, 0.4);
  this.object3D.add(model);

  Enemy.prototype.animate = function(delta) {
  };
}

function createEnemy(x, y, z){
    var materialDome = new THREE.MeshBasicMaterial({color: 0x333333, wireframe: false});
    var material = new THREE.MeshBasicMaterial( { color: 0x00ff00, wireframe: false } );

    // Make the main body, the other things will attach.
    var enemy = createEnemyBody(material, 0, 0, 0);

    // makes the dome and the base
    enemy.add(createDome(materialDome, 0, 0, 0));
    enemy.add(createBase(material,0,0,0));
    return enemy;
}

function createDome(material, x, y, z){
    // Creates dome.
    var dome = new THREE.Object3D();

    var geometry = new THREE.SphereGeometry( 4.5, 32, 32 ,0,3,0,3);
    var mesh = new THREE.Mesh( geometry, material );
    mesh.position.set(x, y, z);
    dome.add(mesh);

    return dome;
}

function createBase(material, x, y, z){
    // Creates base
    var base = new THREE.Object3D();

    // creates 3 feet , each one with 3 "boxes"
    var geometry = new THREE.BoxGeometry(0.5,0.5,0.5 );
    //first foot
    var mesh1 = new THREE.Mesh( geometry, material );
    mesh1.position.set(x+3, y-2, z-2.5);
    base.add(mesh1);
    var mesh1 = new THREE.Mesh( geometry, material );
    mesh1.position.set(x+3.5, y-2.5, z-3);
    base.add(mesh1);
     var mesh1 = new THREE.Mesh( geometry, material );
    mesh1.position.set(x+4, y-3, z-3.5);
    base.add(mesh1);

    // second foot
    var mesh2 = new THREE.Mesh( geometry, material );
    mesh2.position.set(x-3, y-2, z-2.5);
    base.add(mesh2);
    var mesh2 = new THREE.Mesh( geometry, material );
    mesh2.position.set(x-3.5, y-2.5, z-3);
    base.add(mesh2);
    var mesh2 = new THREE.Mesh( geometry, material );
    mesh2.position.set(x-4, y-3, z-3.5);
    base.add(mesh2);

    //third foot
    var mesh3 = new THREE.Mesh( geometry, material );
    mesh3.position.set(x, y+2, z-2.5);
    base.add(mesh3);
    var mesh3 = new THREE.Mesh( geometry, material );
    mesh3.position.set(x, y+2.5, z-3);
    base.add(mesh3);
    var mesh3 = new THREE.Mesh( geometry, material );
    mesh3.position.set(x, y+3, z-3.5);
    base.add(mesh3);
    return base;
}

function createEnemyBody(material, x, y, z){
    // Creates enemy body.
    var body = new THREE.Object3D();

    // Creates body.
    var geometry = new THREE.TorusGeometry( 6.5, 2, 8, 20,6.3 );
    var mesh = new THREE.Mesh( geometry, material );
    mesh.position.set(x,y,z);
    body.add(mesh);

    return body;
}
