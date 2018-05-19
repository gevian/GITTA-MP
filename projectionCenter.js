function ProjectionCenter(scene) {
	this.scene = scene;
	this.sphere = new THREE.Mesh(new THREE.SphereGeometry(0.1, 32, 32),
								 new THREE.MeshBasicMaterial({color: 0xffff00}));

	//scene.add(this.sphere);

	this.earthCenter = new THREE.Object3D();
	this.lightCenter = new THREE.Object3D();
	
	this.earthCenter.add(this.lightCenter);
	this.lightCenter.add(this.sphere);
	
	this.scene.add(this.earthCenter);
}


ProjectionCenter.prototype.setOrientation = function(lat, lon)
{
	this.earthCenter.rotation.z = lat;
	this.earthCenter.rotation.y = lon;
}

ProjectionCenter.prototype.setVerticalOffset = function(offset)
{
	this.sphere.position.y = offset;
}


ProjectionCenter.prototype.setHorizontalOffset = function(offset)
{
	this.sphere.position.x = offset;
}

ProjectionCenter.prototype.setRotation = function(rotation)
{
	this.lightCenter.rotation.y = rotation;
}
