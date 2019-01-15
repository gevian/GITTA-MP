function CutIndicator(surface, scene) {
	this.surface = surface;
	this.scene = scene;

    // sprite texture taken from https://en.wikipedia.org/wiki/File:Scissors_icon_black.svg
    this.spriteMap = new THREE.TextureLoader().load( "images/Scissors_icon_black.svg.png" );
    this.spriteMaterial = new THREE.SpriteMaterial( { map: this.spriteMap, color: 0xffffff } );
    this.sprite = new THREE.Sprite( this.spriteMaterial );
    this.sprite.scale.set(0.2, 0.2, 1)
    scene.add( this.sprite );                                         
	
	this.mesh = this.surface.mesh;
	
	this.updateGeometry();
}


CutIndicator.prototype.updateGeometry = function()
{   
    var ll = new THREE.Vector3();
    ll.fromBufferAttribute(this.surface.stripes[0].bufferGeometry.attributes.position, this.surface.stripes[0].idxLeft[0]);
    
	//console.log(this.surface.mesh.matrixWorld);
	var midPos = ll.applyMatrix4( this.mesh.matrixWorld );

	this.sprite.position.set(midPos.x, midPos.y, midPos.z);
}
