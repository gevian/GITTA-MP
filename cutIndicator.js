function CutIndicator(surface, scene) {
	this.surface = surface;
	this.scene = scene;
	this.sphere = new THREE.Mesh(new THREE.SphereGeometry(0.05, 32, 32),
								 new THREE.MeshBasicMaterial({color: 0xff0000}));

	scene.add(this.sphere);
	
	this.mesh = this.surface.mesh;
	
	this.updateGeometry();
}


CutIndicator.prototype.updateGeometry = function()
{   
    var ll = new THREE.Vector3();
    ll.fromBufferAttribute(this.surface.stripes[0].bufferGeometry.attributes.position, this.surface.stripes[0].idxLeft[0]);
    
	//console.log(this.surface.mesh.matrixWorld);
	var midPos = ll.applyMatrix4( this.mesh.matrixWorld );

	this.sphere.position.set(midPos.x, midPos.y, midPos.z);
}
