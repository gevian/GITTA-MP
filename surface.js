var vertexShaderSource = `
    varying vec4 globalPosition;
    varying vec4 globalPositionRolled;
	varying vec4 globalPositionTorus;
	
	uniform int keepVertices;
	
	uniform float projTorusScale;
	uniform mat4 projTorusMatrix;
	
	attribute vec3 positionRolled;
	attribute vec3 positionProjectionCenter;
	
    void main() {
        gl_Position =   projectionMatrix * 
                        modelViewMatrix * 
                        vec4(position,1.0);
						
		globalPosition = modelMatrix * vec4(position, 1.0);
		
		if (keepVertices == 1)
		{
			globalPositionRolled = modelMatrix * vec4(positionRolled, 1.0);
		}
		else
		{
			globalPositionRolled = globalPosition;
		}
		
		globalPositionTorus = projTorusMatrix * vec4(positionProjectionCenter * projTorusScale, 1.0);
    }
`;

var fragmentShaderSource = `
    uniform sampler2D tCountries;
    uniform sampler2D tGraticule;
    uniform sampler2D tTissot;
	
    uniform float projTorusScale;
	uniform mat4 projTorusMatrix;
    
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
        
        vec3 globalPositionTorus = normalize(vec3(-globalPositionRolled.x, 0.0, -globalPositionRolled.z)) * projTorusScale;
        
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
			//gl_FragColor = vec4(projTorusScale, 0.0, 0.0, 1.0);
			//gl_FragColor = vec4(azimuthalNorm, azimuthalNorm, azimuthalNorm, 1.0);
			//gl_FragColor = vec4(globalPositionTorus.y, 0.0, 0.0, 1.0);
		}
	}
`;



function Quad(bufferGeometry, faceIdx0, faceIdx1) {
	
	this.bufferGeometry = bufferGeometry;
	this.positionAttribute = this.bufferGeometry.attributes.position;
	this.faceIdx0 = faceIdx0;
	this.faceIdx1 = faceIdx1;
		
	this.f0idx0 = bufferGeometry.index.array[faceIdx0];
	this.f0idx1 = bufferGeometry.index.array[faceIdx0 + 1];
	this.f0idx2 = bufferGeometry.index.array[faceIdx0 + 2];
	
	this.f1idx0 = bufferGeometry.index.array[faceIdx1];
	this.f1idx1 = bufferGeometry.index.array[faceIdx1 + 1];
	this.f1idx2 = bufferGeometry.index.array[faceIdx1 + 2];

}

Quad.prototype.getUL = function()
{
	var ul = new THREE.Vector3();
	ul.fromBufferAttribute( this.positionAttribute, this.f0idx0 );
	return ul;
}

Quad.prototype.setUL_XYZ = function(x,y,z)
{
	this.positionAttribute.setXYZ(this.f0idx0, x, y, z);
}

Quad.prototype.setUL_XZ = function(x, z)
{
	this.positionAttribute.setX(this.f0idx0, x);
	this.positionAttribute.setZ(this.f0idx0, z);
}

Quad.prototype.setUL_Y = function(y)
{
	this.positionAttribute.setY(this.f0idx0, y);
}

Quad.prototype.getLL = function()
{
	var ll = new THREE.Vector3();
	ll.fromBufferAttribute( this.positionAttribute, this.f0idx1 );
	return ll;
}

Quad.prototype.setLL_XYZ = function(x,y,z)
{
	this.positionAttribute.setXYZ(this.f0idx1, x, y, z);
}

Quad.prototype.setLL_XZ = function(x, z)
{
	this.positionAttribute.setX(this.f0idx1, x);
	this.positionAttribute.setZ(this.f0idx1, z);
}

Quad.prototype.setLL_Y = function(y)
{
	this.positionAttribute.setY(this.f0idx1, y);
}

Quad.prototype.getUR = function()
{
	var ur = new THREE.Vector3();
	ur.fromBufferAttribute( this.positionAttribute, this.f0idx2 );
	return ur;
}

Quad.prototype.setUR_XYZ = function(x,y,z)
{
	this.positionAttribute.setXYZ(this.f0idx2, x, y, z);
}

Quad.prototype.setUR_XZ = function(x, z)
{
	this.positionAttribute.setX(this.f0idx2, x);
	this.positionAttribute.setZ(this.f0idx2, z);
}

Quad.prototype.setUR_Y = function(y)
{
	this.positionAttribute.setY(this.f0idx2, y);
}

Quad.prototype.getLR = function()
{
	var lr = new THREE.Vector3();
	lr.fromBufferAttribute( this.positionAttribute, this.f1idx1 );
	return lr;
}

Quad.prototype.setLR_XYZ = function(x,y,z)
{
	this.positionAttribute.setXYZ(this.f1idx1, x, y, z);
}

Quad.prototype.setLR_XZ = function(x, z)
{
	this.positionAttribute.setX(this.f1idx1, x);
	this.positionAttribute.setZ(this.f1idx1, z);
}

Quad.prototype.setLR_Y = function(y)
{
	this.positionAttribute.setY(this.f1idx1, y);
}

Quad.prototype.getNormal = function()
{
	var vA = new THREE.Vector3(), vB = new THREE.Vector3(), vC = new THREE.Vector3();	
	var cb = new THREE.Vector3(), ab = new THREE.Vector3();
	
	vA.fromBufferAttribute( this.positionAttribute, this.f0idx0 );
	vB.fromBufferAttribute( this.positionAttribute, this.f0idx1 );
	vC.fromBufferAttribute( this.positionAttribute, this.f0idx2 );
	
	cb.subVectors( vC, vB );
	ab.subVectors( vA, vB );
	cb.cross( ab );

	cb.normalize();
	
	return cb;
}



function Stripe(bufferGeometry, idxLeft, idxRight) {
    this.bufferGeometry = bufferGeometry;
    this.idxLeft  = idxLeft;
    this.idxRight = idxRight;
}


Stripe.prototype.getNormal = function()
{
	var vA = new THREE.Vector3(), vB = new THREE.Vector3(), vC = new THREE.Vector3();	
	var cb = new THREE.Vector3(), ab = new THREE.Vector3();
	
	vA.fromBufferAttribute( this.bufferGeometry.attributes.position, this.idxLeft[0] );
	vB.fromBufferAttribute( this.bufferGeometry.attributes.position, this.idxLeft[1] );
	vC.fromBufferAttribute( this.bufferGeometry.attributes.position, this.idxRight[0] );
	cb.subVectors( vC, vB );
	ab.subVectors( vA, vB );
	cb.cross( ab );

	cb.normalize();
	
	return cb;
}



function Surface(scene, earth) {
	this.scene = scene;
    this.earth = earth;
	
	this.state = "Initializing";
	
    
    // simplified cylinder geometry adapted from https://github.com/mrdoob/three.js/blob/master/src/geometries/CylinderGeometry.js
    this.bufferGeometry = new THREE.BufferGeometry();
    
    
    this.topRadius = 1.0;
    this.bottomRadius = 1.0;
    
    var segmentsRadial = 128;
    var segmentsHeight = 64;
    
    var indices = [];
    var position = [];
    
    var px, py, pz; // vertex position
    
    var indexArray = [];
    var index = 0;
    var x, y;
    for (y = 0; y <= segmentsHeight; y++)
    {
        var indexRow = [];
        
        var v = y / segmentsHeight;
        for (x = 0; x <= segmentsRadial; x++)
        {
            var u = x / segmentsRadial;
            var theta = u * 2 * Math.PI;
            
            px = Math.sin(theta);
            py = v - 0.5; // centers the cylinder to zero along the y axis (vertices get built up from bottom to top)
            pz = Math.cos(theta);
            position.push(px, py, pz);
            
            indexRow.push(index++);
        }
        
        indexArray.push(indexRow);
    }
        
    this.stripes = [];
    for (x = 0; x < segmentsRadial; x++) {        
        var idxLeft = [];
        var idxRight = [];
        for (y = 0; y < segmentsHeight; y++) {

            // face indices
            var a = indexArray[ y ][ x ];
            var b = indexArray[ y + 1 ][ x ];
            var c = indexArray[ y + 1 ][ x + 1 ];
            var d = indexArray[ y ][ x + 1 ];

            // faces
            indices.push( a, b, d );
            indices.push( b, c, d );
            
            if (y == 0)
            {
                idxLeft.push(a);
                idxRight.push(d);                
            }
            
            idxLeft.push(b);
            idxRight.push(c);
        }
        
        this.stripes.push(new Stripe(this.bufferGeometry, idxLeft, idxRight));
    }
    
    this.bufferGeometry.setIndex( indices );
    this.bufferGeometry.addAttribute('position', new THREE.Float32BufferAttribute(new Float32Array(position), 3))
    this.bufferGeometry.addAttribute('positionRolled', new THREE.Float32BufferAttribute(new Float32Array(position), 3))
    this.bufferGeometry.computeVertexNormals();
    
    this.countriesTexture = new THREE.TextureLoader().load('images/Countries.png');
    this.tissotTexture    = new THREE.TextureLoader().load('images/Tissot.png');
    this.graticuleTexture = new THREE.TextureLoader().load('images/Graticule.png');
    this.emptyTexture     = new THREE.TextureLoader().load('images/Empty.png');
    
	var uniforms = {
		tCountries:      { type: "t", value: this.countriesTexture },
		tGraticule:      { type: "t", value: this.graticuleTexture },
		tTissot:         { type: "t", value: this.tissotTexture },
		projTorusScale:  { type: "f", value: 1.0 },
		projTorusMatrix: { type: 'm4', value: new THREE.Matrix4()},
		opacity:         { type: "f", value: 1.0 }, // Note: if not 1.0, set transparent of material to true
		keepVertices:    { type: "i", value: 0 }
	};
    
    this.scene = scene; 
	
    this.material = new THREE.ShaderMaterial( {
												uniforms: uniforms,
												vertexShader: vertexShaderSource,
												fragmentShader: fragmentShaderSource,
												side: THREE.DoubleSide,
												transparent: false
                                } );
                                
	this.mesh = new THREE.Mesh( this.bufferGeometry, this.material );	
    
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
	var n1 = this.stripes[0].getNormal();
	var n2 = this.stripes[1].getNormal();
	
	this.angle = -n2.angleTo(n1);
}


Surface.prototype.rotateQuad = function(index, angle, loc, axis)
{		
	var lr = this.bufferQuads[index].getLR();
	lr.sub(loc).applyAxisAngle(axis, angle).add(loc);
	this.bufferQuads[index].setLR_XYZ(lr.x, lr.y, lr.z);
	
	var ur = this.bufferQuads[index].getUR();
	ur.sub(loc).applyAxisAngle(axis, angle).add(loc);
	this.bufferQuads[index].setUR_XYZ(ur.x, ur.y, ur.z);
}

Surface.prototype.rotateQuadInverse = function(index, angle, loc, axis)
{	
	var lr = this.bufferQuads[index].getLR();
	lr.sub(loc).applyAxisAngle(axis, -angle).add(loc);
	this.bufferQuads[index].setLR_XYZ(lr.x, lr.y, lr.z);
	
	var ur = this.bufferQuads[index].getUR();
	ur.sub(loc).applyAxisAngle(axis, -angle).add(loc);
	this.bufferQuads[index].setUR_XYZ(ur.x, ur.y, ur.z);
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
    
    this.mesh.scale.y = length;
}

Surface.prototype.computeRadii = function()
{
    var diff = this.topRadius - this.bottomRadius;
	for (var i = 0; i < this.stripes.length; i++)
	{	
        var stripe = this.stripes[i];
        var idxLeft = stripe.idxLeft;
        
        for (var a = 0; a < idxLeft.length; a++)
        {
            var multiplier = a / (idxLeft.length - 1);
            var radius = this.bottomRadius + diff * multiplier;
            var leftVec = new THREE.Vector3();
            leftVec.fromBufferAttribute(stripe.bufferGeometry.attributes.position, idxLeft[a]);
            leftVec.y = 0;
            leftVec.normalize().multiplyScalar(radius);
            
            stripe.bufferGeometry.attributes.position.setX(idxLeft[a], leftVec.x);
            stripe.bufferGeometry.attributes.position.setZ(idxLeft[a], leftVec.z);
        }
        
        if (i == this.stripes.length-1)
        {
            var idxRight = stripe.idxRight;
            for (var a = 0; a < idxRight.length; a++)
            {
                var multiplier = a / (idxRight.length - 1);
                var radius = this.bottomRadius + diff * multiplier;
                var rightVec = new THREE.Vector3();
                rightVec.fromBufferAttribute(stripe.bufferGeometry.attributes.position, idxRight[a]);
                rightVec.y = 0;
                rightVec.normalize().multiplyScalar(radius);
                
                stripe.bufferGeometry.attributes.position.setX(idxRight[a], rightVec.x);
                stripe.bufferGeometry.attributes.position.setZ(idxRight[a], rightVec.z);
            }
        }
    }

    this.bufferGeometry.attributes.position.needsUpdate = true;
	
	this.updateGeometry();
}

Surface.prototype.setTopRadius = function(radius)
{
    this.topRadius = parseFloat(radius);
    this.computeRadii();
}

Surface.prototype.setBottomRadius = function(radius)
{
    this.bottomRadius = parseFloat(radius);
    this.computeRadii();
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
	var end = Math.min(start + quadsToRotateInt, this.stripes.length);
	
	if (end > this.stripes.length)
	{
		return false;
	}
	
	this.lastQuad = end;


	for (var a = start; a < end; a++)
	{
		var ul = this.bufferQuads[a].getUL().clone();
		var ll = this.bufferQuads[a].getLL().clone();
		
		ul.sub(ll);
		ll.addScaledVector(ul, 0.5);
		ul.normalize();
		
		var axis = ul.clone();
		var loc = ll.clone();
	
		for (var i = a; i < this.bufferQuads.length; i++)
		{	
			this.rotateQuad(i, this.angle, loc, axis);
		}
	}
	
	
	this.bufferGeometry.attributes.position.needsUpdate = true;
	
	if (end == this.bufferQuads.length)
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
		var ul = this.bufferQuads[a].getUL();
		var ll = this.bufferQuads[a].getLL();
		
		ul.sub(ll);
		ll.addScaledVector(ul, 0.5);
		ul.normalize();
		
		var axis = ul.clone();
		var loc = ll.clone();

		for (var i = a; i < this.bufferQuads.length; i++)
		{	
			this.rotateQuadInverse(i, this.angle, loc, axis);
		}
	}
	
	this.bufferGeometry.attributes.position.needsUpdate = true;
	
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
	
	// freeze vertex positions
	this.bufferGeometry.attributes.positionRolled.array.set(this.bufferGeometry.attributes.position.array);
	this.bufferGeometry.attributes.positionRolled.needsUpdate = true;
	
	this.mesh.material.uniforms.keepVertices.value = 1;
	
	this.state = "Rolling";
}

Surface.prototype.unroll = function()
{
	this.state = "Unrolling";
	this.lastQuadInverse = this.bufferQuads.length - 1;
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





