function CutIndicator(surface, scene) {
	this.surface = surface;
	this.scene = scene;
	this.sphere = new THREE.Mesh(new THREE.SphereGeometry(0.05, 32, 32),
								 new THREE.MeshBasicMaterial({color: 0xff0000}));

	scene.add(this.sphere);
	
	this.referencePoint = this.surface.quads[0].ll;
	this.mesh = this.surface.mesh;
	
	this.updateGeometry();
}


CutIndicator.prototype.updateGeometry = function()
{
	//console.log(this.surface.mesh.matrixWorld);
	var midPos = this.referencePoint.clone().applyMatrix4( this.mesh.matrixWorld );

	this.sphere.position.set(midPos.x, midPos.y, midPos.z);
}
