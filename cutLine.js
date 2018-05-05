function CutLine(surface, scene) {
	this.surface = surface;
	this.scene = scene;
	this.sphere = new THREE.Mesh(new THREE.SphereGeometry(0.1, 32, 32),
								 new THREE.MeshBasicMaterial({color: 0xffff00}));

	scene.add(this.sphere);

	this.earthCenter = new THREE.Object3D();

	this.earthCenter.add(this.sphere);
	this.scene.add(this.earthCenter);
}


CutLine.prototype.updateGeometry = function()
{
	this.earthCenter.rotation.z = lat;
	this.earthCenter.rotation.y = lon;
}
