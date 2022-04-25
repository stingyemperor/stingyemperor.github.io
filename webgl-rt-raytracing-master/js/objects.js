"use strict";

class Material {
	constructor(diffuse, specular, shininess) {
		this.diffuse = diffuse;
		this.specular = specular;
		this.shininess = shininess;
		this.refractionCoeff = 0.0;
		this.refractionIndex = 1.0;
	}

	makeTransparent(refrCoeff, refrIndex) {
		this.refractionCoeff = refrCoeff;
		this.refractionIndex = refrIndex;
	}
}

class Sphere {
	constructor(position, radius, materialId) {
		this.position = position;
		this.radius = radius;
		this.materialId = materialId;
	}
}

class LightSource {
	constructor(position, color) {
		this.position = position;
		this.color = color;
	}
}

function scaleV(vector, coeff) {
	var scaled = vec3.create();
	vec3.scale(scaled, vector, coeff);
	return scaled;
}

class Scene {
	constructor() {
		this.materials = [];
		this.lightSources = [];
		this.objects = [];
	}

	addMaterial(material) {
		this.materials.push(material);
		return this.materials.length - 1;
	}

	getMaterial(index) {
		return this.materials[index];
	}

	addLight(lightSource) {
		this.lightSources.push(lightSource);
	}

	addObject(obj) {
		this.objects.push(obj);
	}

	addRandomObject(maxPos = 4.6, minRad = 0.4, maxRad = 1.6) {
		var pos = [2 * maxPos * Math.random() - maxPos, 
				   2 * maxPos * Math.random() - maxPos, 
				   2 * maxPos * Math.random() - maxPos];
	   	const radius = (maxRad - minRad) * Math.random() + minRad;		
	   	const diffuse = [Math.random(), Math.random(), Math.random()];
	   	const diffCoeff = Math.random(); 
	   	const specCoeff = 1.0 - diffCoeff;  
	   	const shininess = 1000 * Math.random();
	   	const materialId = this.addMaterial(new Material (scaleV(diffuse, diffCoeff), scaleV(diffuse, specCoeff), shininess));
    	this.getMaterial(materialId).makeTransparent(Math.random(), 0.5 + Math.random());
    	this.addObject(new Sphere(pos, radius, materialId));
	}	

	clearObjects() {
		this.objects = [];
		this.materials = [];
	}

	initDefaultLights() {
		this.addLight(new LightSource ([-15, 15, -15], [1.0, 1.0, 1.0]));
    	this.addLight(new LightSource ([1, 1, 0], [0.2, 0.2, 1.0]));
    	this.addLight(new LightSource ([0, -10, 6], [1.0, 0.2, 0.2]));    
	}

	initDefault() {
		var red = [1, 0.3, 0.3];		
    	var blue = [0.3, 0.3, 1];
    	var green = [0.3, 1, 0.3];
    	var white = [0.8, 0.8, 0.8];
    	var yellow = [1, 1, 0.3];
    	var purple = [1, 0.3, 1];

    	var redMat = this.addMaterial(new Material (scaleV(red, 0.4), scaleV(red, 0.6), 250.0));
    	var blueMat = this.addMaterial(new Material (scaleV(blue, 0.4), scaleV(blue, 0.6), 50.0));
    	var greenMat = this.addMaterial(new Material (scaleV(green, 0.8), scaleV(green, 0.2), 10.0));
    	var whiteMat = this.addMaterial(new Material (scaleV(white, 0.9), scaleV(white, 0.1), 50.0));
    	var yellowMat = this.addMaterial(new Material (scaleV(yellow, 0.1), scaleV(yellow, 0.9), 500.0));
    	var purpleMat = this.addMaterial(new Material (scaleV(purple, 0.6), scaleV(purple, 0.4), 30.0));    

    	this.getMaterial(blueMat).makeTransparent(0.9, 1.03);
    	this.getMaterial(redMat).makeTransparent(0.6, 0.8);

    	this.addObject(new Sphere ([0, 2, 1], 1.5, blueMat));
    	this.addObject(new Sphere ([1, -2, 4], 2.0, redMat));
    	this.addObject(new Sphere ([0, -2, -3], 1.0, greenMat));
    	this.addObject(new Sphere ([1.5, 0.5, -2], 1.0, whiteMat));
    	this.addObject(new Sphere ([-2, 1, 5], 0.7, yellowMat));
    	this.addObject(new Sphere ([-2.2, 0, 2], 1.0, whiteMat));
    	this.addObject(new Sphere ([1, 1, 4], 0.7, purpleMat));    

    	this.initDefaultLights();	
	}

	setProgramUniforms(gl, program, modelViewMatrix) {
		gl.uniform1i(gl.getUniformLocation(program, "numOfSpheres"), this.objects.length);
		this.objects.forEach((sphere, index) => {
			var pos = vec3.create();
			vec3.transformMat4(pos, sphere.position, modelViewMatrix);
			gl.uniform3fv(gl.getUniformLocation(program, `spheres[${index}].position`), pos);
			gl.uniform1f(gl.getUniformLocation(program, `spheres[${index}].radius`), sphere.radius);
			gl.uniform1i(gl.getUniformLocation(program, `spheres[${index}].materialId`), sphere.materialId);
		});

		gl.uniform1i(gl.getUniformLocation(program, "numOfLightSources"), this.lightSources.length);
		this.lightSources.forEach((light, index) => {
			var pos = vec3.create();
			vec3.transformMat4(pos, light.position, modelViewMatrix);
			gl.uniform3fv(gl.getUniformLocation(program, `lightSources[${index}].position`), pos);
			gl.uniform3fv(gl.getUniformLocation(program, `lightSources[${index}].color`), light.color);			
		});
		
		this.materials.forEach((material, index) => {
			gl.uniform3fv(gl.getUniformLocation(program, `materials[${index}].diffuse`), material.diffuse);
			gl.uniform3fv(gl.getUniformLocation(program, `materials[${index}].specular`), material.specular);
			gl.uniform1f(gl.getUniformLocation(program, `materials[${index}].shininess`), material.shininess);
			gl.uniform1f(gl.getUniformLocation(program, `materials[${index}].refractionCoeff`), material.refractionCoeff);
			gl.uniform1f(gl.getUniformLocation(program, `materials[${index}].refractionIndex`), material.refractionIndex);
		});			              
	}
}
