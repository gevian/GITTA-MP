var vertexShaderSource = `
    varying vec4 globalPosition;
    varying vec4 globalPositionRolled;
	varying vec4 globalPositionTorus;
	
	uniform int keepVertices;
	
	uniform float projTorusScale;
	uniform mat4 projTorusMatrix;
	
    void main() {
        gl_Position =   projectionMatrix * 
                        modelViewMatrix * 
                        vec4(position,1.0);
						
		globalPosition = modelMatrix * vec4(position, 1.0);
		
		if (keepVertices == 1)
		{
			globalPositionRolled = modelMatrix * vec4(color, 1.0);
		}
		else
		{
			globalPositionRolled = globalPosition;
		}
		
		globalPositionTorus = projTorusMatrix * vec4(normal * projTorusScale, 1.0);
    }
`;

var fragmentShaderSource = `
    uniform sampler2D tCountries;
    uniform sampler2D tGraticule;
    uniform sampler2D tTissot;
	
	uniform float opacity;
	
    varying vec4 globalPosition;
    varying vec4 globalPositionRolled;
	varying vec4 globalPositionTorus;
		
	#define M_PI 3.1415926535897932384626433832795
	float radius = 1.0;
	
	
	vec2 xyz2latlon(vec3 xyz)
	{
		float r = sqrt(xyz.x * xyz.x + xyz.y * xyz.y + xyz.z * xyz.z);
		float azimuthal = atan(-xyz.z, xyz.x);
		float polar = acos(-xyz.y / r); 
		
		return vec2(azimuthal, polar);
	}
	
	
	vec3 point_on_sphere(vec3 projection_center, vec3 fragment_location)
	{
		vec3 origin = projection_center;
		vec3 dir_vector = normalize(fragment_location - projection_center);
		
		float a = -dot(dir_vector, origin);
		
		float b = (dot(dir_vector, origin) * dot(dir_vector, origin)) - (length(origin) * length(origin)) + (radius * radius);
		
		
		// no intersection
		if (b < 0.0)
		{
			return vec3(-1000.0, -1000.0, -1000.0);
		}
		else if (b == 0.0) // one intersection
		{
			return origin + a * dir_vector;	
		}
		

		// two intersections
		float c = sqrt(b);
		float d1 = a + c;
		float d2 = a - c;
		
		float d = max(d1, d2);
		
		return origin + d * dir_vector;
	}
	
	
    void main() {
		//vec3 p = point_on_sphere(projOrigin, globalPositionRolled.xyz);
		vec3 p = point_on_sphere(globalPositionTorus.xyz, globalPositionRolled.xyz);
		
		if (p.x < -999.0)
		{
			gl_FragColor = vec4(0.5, 0.5, 0.5, opacity);
		}
		else
		{
			vec2 latlon = xyz2latlon(p);

			float azimuthalNorm = (latlon[0]) / (2.0 * M_PI) + 0.5; 
			float polarNorm = (latlon[1] / M_PI);
			
			vec2 uv_comp = vec2(azimuthalNorm, polarNorm);
					
			vec4 color;
			vec4 CCountries = texture2D(tCountries, uv_comp);
			vec4 CGraticule = texture2D(tGraticule, uv_comp);
			vec4 CTissot = texture2D(tTissot, uv_comp);
			
			color = CCountries;
			color = vec4(color.rgb * color.a * (1.0 - CGraticule.a) + CGraticule.a * CGraticule.rgb, 1.0);
			color = vec4(color.rgb * color.a * (1.0 - CTissot.a) + CTissot.a * CTissot.rgb, 1.0);
			
			gl_FragColor = vec4(color.rgb, opacity);
			//gl_FragColor = globalPositionTorus;
			//gl_FragColor = vec4(azimuthalNorm, azimuthalNorm, azimuthalNorm, 1.0);
		}
	}
`;





function Surface(scene, earth) {
	this.scene = scene;
    this.earth = earth;
	
	this.state = "Initializing";
	var preGeometry = new THREE.CylinderGeometry(1, 1, 4, 512, 1, true);
	
	this.geometry = new THREE.Geometry(); 
	//this.geometry.computeVertexNormals();

	var torusVecs = [];
	
	this.quads = [];
	
	var pgFaces = preGeometry.faces;
	var pgVertices = preGeometry.vertices;

	for (var i = 0; i < pgFaces.length / 2.0; i++)
	{
		var f1 = pgFaces[i*2];
		var f2 = pgFaces[i*2+1];
		
		var a = pgVertices[f1.a].clone();
		var b = pgVertices[f1.b].clone();
		var c = pgVertices[f1.c].clone();
		var d = pgVertices[f2.b].clone();
		
		var cl = this.geometry.vertices.length;
		
		this.geometry.vertices.push(a);
		this.geometry.vertices.push(b);
		this.geometry.vertices.push(c);
		this.geometry.vertices.push(d);

		var upperFace = new THREE.Face3( cl, cl+1, cl+2 );
		var lowerFace = new THREE.Face3( cl+1, cl+3, cl+2 );

		// we use the color channel as a substitute for another geometry
		// custom attributes are not (easily?) supported by geometry classes and the geometrybuffer classes are somewhat cumbersome to use
		
		//console.log(a.x, a.y, a.z);
		//console.log(b.x, b.y, b.z);

		upperFace.vertexColors[0] = new THREE.Color(a.x, a.y, a.z);
		upperFace.vertexColors[1] = new THREE.Color(b.x, b.y, b.z);
		upperFace.vertexColors[2] = new THREE.Color(c.x, c.y, c.z);
		
		lowerFace.vertexColors[0] = new THREE.Color(b.x, b.y, b.z);
		lowerFace.vertexColors[1] = new THREE.Color(d.x, d.y, d.z);
		lowerFace.vertexColors[2] = new THREE.Color(c.x, c.y, c.z);
		
		// the same hack: we store the torus coordinates in the vertex normals
		upperFace.vertexNormals[0] = new THREE.Vector3(-a.x, 0, -a.z);
		upperFace.vertexNormals[1] = new THREE.Vector3(-b.x, 0, -b.z);
		upperFace.vertexNormals[2] = new THREE.Vector3(-c.x, 0, -c.z);
		
		lowerFace.vertexNormals[0] = new THREE.Vector3(-b.x, 0, -b.z);
		lowerFace.vertexNormals[1] = new THREE.Vector3(-d.x, 0, -d.z);
		lowerFace.vertexNormals[2] = new THREE.Vector3(-c.x, 0, -c.z);
		
		this.geometry.faces.push( upperFace );
		this.geometry.faces.push( lowerFace );
							
		this.quads.push({"ul": a, "ll": b, "ur": c, "lr": d, "uf": upperFace, "lf": lowerFace});
	}
		
	this.startTime = new Date();
	this.maxTime = 2;

	this.fractionPerSecond = 1 / this.maxTime;
	this.quadsPerSecond = this.fractionPerSecond * this.quads.length;

	this.secondsPerQuad = this.quads.length / this.maxTime;
	
	this.lastQuadInverse = this.quads.length - 1;
	this.overallTInverse = 0;
	this.remainingQuadsFloatInverse = 0;
	
	
	this.lastQuad = 0;
	this.overallT = 0;
	this.remainingQuadsFloat = 0;
	
    this.countriesTexture = new THREE.TextureLoader().load('images/Countries.png');
    this.tissotTexture    = new THREE.TextureLoader().load('images/Tissot.png');
    this.graticuleTexture = new THREE.TextureLoader().load('images/Graticule.png');
    this.emptyTexture     = new THREE.TextureLoader().load('images/Empty.png');
    
	var uniforms = {
		tCountries: { type: "t", value: this.countriesTexture },
		tGraticule: { type: "t", value: this.graticuleTexture },
		tTissot:    { type: "t", value: this.tissotTexture },
		projTorusScale: { type: "f", value: 1.0 },
		projTorusMatrix: { type: 'm4', value: new THREE.Matrix4()},
		opacity:    { type: "f", value: 1.0 }, // Note: if not 1.0, set transparent of material to true
		keepVertices: { type: "i", value: 0 }
	};
    
    this.scene = scene; 
	
    this.material = new THREE.ShaderMaterial( {
													uniforms: uniforms,
													vertexShader: vertexShaderSource,
													fragmentShader: fragmentShaderSource,
                                                    side: THREE.DoubleSide,
													vertexColors: THREE.VertexColors,
                                                    transparent: false
                                                } );

	this.mesh = new THREE.Mesh( this.geometry, this.material );	
	
    this.earthCenter = new THREE.Object3D();
	
    this.earthCenter.add(this.mesh);
	this.scene.add(this.earthCenter);	
	
	this.updateGeometry();
	
	this.enableForms = function(){};
	this.disableForms = function(){};
		
	this.state = "Waiting";
}


Surface.prototype.updateGeometry = function()
{	
	this.geometry.computeFaceNormals();
	//this.geometry.computeVertexNormals();
	
	var n1 = this.quads[0].uf.normal;
	var n2 = this.quads[1].uf.normal;
	
	this.angle = -n2.angleTo(n1);
}


Surface.prototype.rotateVertex = function(vertex, angle, loc, axis)
{	
	vertex.sub(loc).applyAxisAngle(axis, angle).add(loc);
}

Surface.prototype.rotateVertexInverse = function(vertex, angle, loc, axis)
{	
	vertex.sub(loc).applyAxisAngle(axis, -angle).add(loc);
}



Surface.prototype.setOrientation = function(lat, lon, rot)
{
    this.earthCenter.rotation.z = lat;
    this.earthCenter.rotation.y = lon;
    this.mesh.rotation.y = rot;
}


Surface.prototype.setGeometryOffset = function(offset)
{
    this.mesh.position.y = offset;
}


Surface.prototype.setAxisLength = function(length)
{
	for (var i = 0; i < this.quads.length; i++)
	{	
		this.quads[i].ul.y = length / 2.0;
		this.quads[i].ur.y = length / 2.0;
		this.quads[i].ll.y = -length / 2.0;
		this.quads[i].lr.y = -length / 2.0;
	}
	
	this.geometry.verticesNeedUpdate = true;
	
	this.updateGeometry();
}

Surface.prototype.setTopRadius = function(radius)
{
	for (var i = 0; i < this.quads.length; i++)
	{	
		var ulV = new THREE.Vector3(this.quads[i].ul.x, 0, this.quads[i].ul.z).normalize().multiplyScalar(radius);
		this.quads[i].ul.x = ulV.x;
		this.quads[i].ul.z = ulV.z;
		
		var urV = new THREE.Vector3(this.quads[i].ur.x, 0, this.quads[i].ur.z).normalize().multiplyScalar(radius);
		this.quads[i].ur.x = urV.x;
		this.quads[i].ur.z = urV.z;
	}
	
	this.geometry.verticesNeedUpdate = true;
	
	this.updateGeometry();
}

Surface.prototype.setBottomRadius = function(radius)
{
	for (var i = 0; i < this.quads.length; i++)
	{	
		var llV = new THREE.Vector3(this.quads[i].ll.x, 0, this.quads[i].ll.z).normalize().multiplyScalar(radius);
		this.quads[i].ll.x = llV.x;
		this.quads[i].ll.z = llV.z;
		
		var lrV = new THREE.Vector3(this.quads[i].lr.x, 0, this.quads[i].lr.z).normalize().multiplyScalar(radius);
		this.quads[i].lr.x = lrV.x;
		this.quads[i].lr.z = lrV.z;
	}
	
	this.geometry.verticesNeedUpdate = true;
	
	this.updateGeometry();
}

Surface.prototype.rollAnimated = function(t)
{
	this.overallT += t;
	
	var quadsToRotateFloat = this.overallT * this.quadsPerSecond;
	var quadsToRotateInt = Math.floor(quadsToRotateFloat);
	
	if (quadsToRotateInt < 1.0)
	{
		return;
	}
	
	var excessTime = quadsToRotateInt / this.quadsPerSecond;
	this.overallT -= excessTime;
	
	
	var start = this.lastQuad;
	var end = Math.min(start + quadsToRotateInt, this.quads.length);
	
	if (end > this.quads.length)
	{
		return false;
	}
	
	this.lastQuad = end;

	for (var a = start; a < end; a++)
	{
		var ul = this.quads[a].ul.clone();
		var ll = this.quads[a].ll.clone();
		
		ul.sub(ll);
		ll.addScaledVector(ul, 0.5);
		ul.normalize();
		
		var axis = ul.clone();
		var loc = ll.clone();
	
		for (var i = a; i < this.quads.length; i++)
		{	
			this.rotateVertex(this.quads[i].ul, this.angle, loc, axis);
			this.rotateVertex(this.quads[i].ll, this.angle, loc, axis);
			this.rotateVertex(this.quads[i].ur, this.angle, loc, axis);
			this.rotateVertex(this.quads[i].lr, this.angle, loc, axis);
		}
	}
	
	this.geometry.verticesNeedUpdate = true;
	
	if (end == this.quads.length)
	{
		return true;
	}
	else
	{
		return false;
	}
}

Surface.prototype.unrollAnimated = function(t)
{
	this.overallTInverse += t;	
	
	var quadsToRollFloat = this.overallTInverse * this.quadsPerSecond;
	var quadsToRotateInt = Math.floor(quadsToRollFloat);
	
	if (quadsToRotateInt < 1.0)
	{
		return false;
	}
	
	var excessTime = quadsToRotateInt / this.quadsPerSecond;
	this.overallTInverse -= excessTime;

	var numQuads = quadsToRotateInt;
	
	
	var start = this.lastQuadInverse;
	var end = Math.max(start - numQuads, 0);
	
	if (end < 0)
	{
		return false;
	}
	
	this.lastQuadInverse = end;

	for (var a = start; a > end; a--)
	{
		var ul = this.quads[a].ul.clone();
		var ll = this.quads[a].ll.clone();
		
		ul.sub(ll);
		ll.addScaledVector(ul, 0.5);
		ul.normalize();
		
		var axis = ul.clone();
		var loc = ll.clone();

		for (var i = a; i < this.quads.length; i++)
		{	
			this.rotateVertexInverse(this.quads[i].ul, this.angle, loc, axis);
			this.rotateVertexInverse(this.quads[i].ll, this.angle, loc, axis);
			this.rotateVertexInverse(this.quads[i].ur, this.angle, loc, axis);
			this.rotateVertexInverse(this.quads[i].lr, this.angle, loc, axis);
		}
	}
	
	this.geometry.verticesNeedUpdate = true;
	
	if (end == 0)
	{
		return true;
	}
	else
	{
		return false;
	}
	
}


Surface.prototype.update = function(delta)
{
	if (this.state == "Rolling")
	{
		var result = this.rollAnimated(delta);	
		
		if (result)
		{
			this.state = "Rolled";
		}
	}
	else if (this.state == "Unrolling")
	{
		var result = this.unrollAnimated(delta);
		
		if (result)
		{
			this.mesh.material.uniforms.keepVertices.value = 0;
			this.state = "Waiting";
			this.enableForms(true);
		}			
	}
}

Surface.prototype.roll = function()
{
	this.lastQuad = 1;
	this.overallT = 0;
	this.remainingQuadsFloat = 0;
	
	var faces = this.geometry.faces;
	var vertices = this.geometry.vertices;
	
	for (var i = 0; i < faces.length; i++)
	{
		var face = faces[i];
		var a = vertices[face.a];
		var b = vertices[face.b];
		var c = vertices[face.c];
		
		face.vertexColors[0].copy(new THREE.Color(a.x, a.y, a.z));
		face.vertexColors[1].copy(new THREE.Color(b.x, b.y, b.z));
		face.vertexColors[2].copy(new THREE.Color(c.x, c.y, c.z));
	}
	
	this.geometry.colorsNeedUpdate = true;

	this.mesh.material.uniforms.keepVertices.value = 1;
	
	this.state = "Rolling";
}

Surface.prototype.unroll = function()
{
	this.state = "Unrolling";
	this.lastQuadInverse = this.quads.length - 1;
	this.overallTInverse = 0;
	this.remainingQuadsFloatInverse = 0;	
}

Surface.prototype.toggleRoll = function()
{
	if (this.state == "Rolling" || this.state == "Unrolling")
	{
		return;
	}
	else if (this.state == "Waiting")
	{
		this.disableForms(true);
		this.roll();
	}
	else if (this.state == "Rolled")
	{
		this.unroll();
	}
	
}

Surface.prototype.setProjectionTorusParams = function(scale, transformMatrix)
{
    this.mesh.material.uniforms.projTorusScale.value = scale;
    this.mesh.material.uniforms.projTorusMatrix.value = transformMatrix;
}

Surface.prototype.setFormsCallbacks = function(enableForms, disableForms)
{
	this.enableForms = enableForms;
	this.disableForms = disableForms;
}

Surface.prototype.enableBordersTexture = function()
{
    this.mesh.material.uniforms.tCountries.value = this.countriesTexture;
}

Surface.prototype.disableBordersTexture = function()
{
    this.mesh.material.uniforms.tCountries.value = this.emptyTexture;    
}

Surface.prototype.enableGraticuleTexture = function()
{
    this.mesh.material.uniforms.tGraticule.value = this.graticuleTexture;
}

Surface.prototype.disableGraticuleTexture = function()
{
    this.mesh.material.uniforms.tGraticule.value = this.emptyTexture;    
}

Surface.prototype.enableTissotTexture = function()
{
    this.mesh.material.uniforms.tTissot.value = this.tissotTexture;
}

Surface.prototype.disableTissotTexture = function()
{
    this.mesh.material.uniforms.tTissot.value = this.emptyTexture;    
}





