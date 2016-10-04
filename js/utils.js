/**
 * Add a given THREE.Object3D or Character to the scene
 * @param {Object} object Object to add
 */
THREE.Scene.prototype.add = function ( object ) {
  if ( arguments.length > 1 ) {
    for ( var i = 0; i < arguments.length; i ++ ) {
      this.add( arguments[ i ] );
    }
    return this;
  }

  if ( object === this ) {
    console.error( "THREE.Object3D.add: object can't be added as a child of itself.", object );
    return this;
  }

  if ( (object && object.isObject3D) ) {
    if ( object.parent !== null ) {
      object.parent.remove( object );
    }
    object.parent = this;
    object.dispatchEvent( { type: 'added' } );
    this.children.push( object );
  } else if (object instanceof Character) {
    this.add(object.object3D);
  } else {
    console.error( "THREE.Object3D.add: object not an instance of THREE.Object3D.", object );
  }
  return this;
};
