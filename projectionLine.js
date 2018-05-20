function ProjectionLine(glcanvas, surface, earth, projectionCenter) {
	this.scene = glcanvas.scene;
	this.glcanvas = glcanvas;
	this.surface = surface;
	this.earth = earth;
	this.projectionCenter = projectionCenter;
	
	glcanvas.glContainer.addEventListener( 'mousedown', onMouseDown, true );
	
	this.raycaster = new THREE.Raycaster();
	this.mouse = new THREE.Vector2();
	
	this.lineMaterial = new THREE.LineBasicMaterial( { color: 0xff0000 } );

	this.lineGeometry = new THREE.Geometry();
	this.lineGeometry.vertices.push( new THREE.Vector3() );
	this.lineGeometry.vertices.push( new THREE.Vector3() );

	this.line = new THREE.Line( this.lineGeometry, this.lineMaterial );
	this.line.frustumCulled = false;
	
	this.glcanvas.scene.add( this.line );
	
	var _this = this;
	function onMouseDown( event ) {		
		event.preventDefault();
		
		if (!event.shiftKey) 
			return
		
		var x = event.clientX - _this.glcanvas.glContainer.offsetLeft;
		var y = event.clientY - _this.glcanvas.glContainer.offsetTop;
		
		_this.mouse.x =   ( x / _this.glcanvas.renderer.domElement.clientWidth  ) * 2 - 1;
		_this.mouse.y = - ( y / _this.glcanvas.renderer.domElement.clientHeight ) * 2 + 1;
		
		_this.raycaster.setFromCamera( _this.mouse, _this.glcanvas.camera );
		
		var intersectsSurface = _this.raycaster.intersectObject( _this.surface.mesh );
		
		if ( intersectsSurface.length > 0 ) {
			
			_this.lineGeometry.vertices[0] = intersectsSurface[0].point.clone();
			_this.lineGeometry.vertices[1] = _this.projectionCenter.sphere.position.clone();
			
			_this.lineGeometry.verticesNeedUpdate = true;
		} else {
			/*
			var intersectsEarth = _this.raycaster.intersectObject( _this.earth.earthMesh );
			if ( intersectsEarth.length > 0 ) {
			
				_this.lineGeometry.vertices[0] = intersectsEarth[0].point.clone();
				_this.lineGeometry.vertices[1] = _this.projectionCenter.sphere.position.clone();
				
				_this.lineGeometry.verticesNeedUpdate = true;
			}
			*/
		}
	}
}

ProjectionLine.prototype.reset = function()
{
	this.lineGeometry.vertices[0] = new THREE.Vector3();
	this.lineGeometry.vertices[1] = new THREE.Vector3();
	
	this.lineGeometry.verticesNeedUpdate = true;
}
