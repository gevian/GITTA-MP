function LineProjector(glcanvas, surface, earth, projectionCenter) {
	this.scene = glcanvas.scene;
	this.glcanvas = glcanvas;
	this.surface = surface;
	this.earth = earth;
	this.projectionCenter = projectionCenter;
		
	glcanvas.glContainer.addEventListener( 'mousedown', this.setEarthIntersection.bind(this), true );
	
	this.lineMaterial = new THREE.LineBasicMaterial( { color: 0xff0000 } );

	this.lineGeometry = new THREE.Geometry();
	this.reset();

	this.line = new THREE.Line( this.lineGeometry, this.lineMaterial );
	this.line.frustumCulled = false;
	
	var _this = this;
	
	this.earthIntersection = new THREE.Vector3();

	
	this.disable();
}


LineProjector.prototype.reset = function()
{
	this.lineGeometry.vertices[0] = new THREE.Vector3();
	this.lineGeometry.vertices[1] = new THREE.Vector3();
	
	this.lineGeometry.verticesNeedUpdate = true;
	
	this.disable();
}


LineProjector.prototype.setEarthIntersection = function(event)
{
	event.preventDefault();
	
	if (!event.shiftKey) 
		return
	
	var x = event.clientX - this.glcanvas.glContainer.offsetLeft;
	var y = event.clientY - this.glcanvas.glContainer.offsetTop;
	
	var raycaster = new THREE.Raycaster();
	var mouse = new THREE.Vector2();
	
	mouse.x =   ( x / this.glcanvas.renderer.domElement.clientWidth  ) * 2 - 1;
	mouse.y = - ( y / this.glcanvas.renderer.domElement.clientHeight ) * 2 + 1;
	
	raycaster.setFromCamera( mouse, this.glcanvas.camera );
	
	var projectionWorldPosition = this.projectionCenter.sphere.getWorldPosition();
	
	var intersectsSurface = raycaster.intersectObject( this.earth.earthMesh );
	if ( intersectsSurface.length > 0 ) {
		
		this.earthIntersection = intersectsSurface[0].point.clone();
		this.enable();
		this.updateLine();
		
	}
}


LineProjector.prototype.updateLine = function()
{
	if (this.state == "Disabled")
		return
	

	var projectionWorldPosition = this.projectionCenter.sphere.getWorldPosition();
	var directionVector = this.earthIntersection.clone().sub(projectionWorldPosition).normalize();
	
	var auxiliaryRaycaster = new THREE.Raycaster(projectionWorldPosition, directionVector.clone());
	
	var auxiliaryIntersectsSurface = auxiliaryRaycaster.intersectObject( this.surface.mesh );
	
	if ( auxiliaryIntersectsSurface.length > 0 ) {

		this.lineGeometry.vertices[0] = auxiliaryIntersectsSurface[0].point.clone();
		this.lineGeometry.vertices[1] = projectionWorldPosition;
		
		this.lineGeometry.verticesNeedUpdate = true;
	}
	else // no intersection with surface (ray has theoretically infinite length)
	{

		this.lineGeometry.vertices[0] = projectionWorldPosition.clone().add(directionVector.clone().multiplyScalar(1000));
		this.lineGeometry.vertices[1] = projectionWorldPosition;
		
		this.lineGeometry.verticesNeedUpdate = true;
	}
}



LineProjector.prototype.enable = function()
{
	this.scene.add(this.line);
	this.state = "Enabled";
}

LineProjector.prototype.disable = function()
{
	this.scene.remove(this.line);
	this.state = "Disabled";
}



