"use strict";

var gl;
var program;
var scene;

var buffers = {};
var textures = {};
var matrices = {};

var settings = {
	numOfSamples: 1,
	samplingMode: 0,
	refractionEnabled: 0,
	maxRecursionDepth: 1,
	backgroundColor: [0.1, 0.1, 0.1],
	ambientLight: [0.05, 0.05, 0.05],
	rotationAngle: [0.0, 0.0]
}

var camera = {
	FOV: 45.0,
	FOVTangent: Math.tan(45.0 * Math.PI / 360.0),
	eye: vec3.fromValues(-10.0, 0.0, -10.0)
};

function initGL() {
	gl.clearColor(settings.backgroundColor[0], settings.backgroundColor[1], settings.backgroundColor[2], 1.0);
    gl.disable(gl.DEPTH_TEST); 	
}

function initMatrices() {
	matrices.modelMatrix = mat4.create();	
	mat4.identity(matrices.modelMatrix);

	matrices.viewMatrix = mat4.create();
	mat4.lookAt(matrices.viewMatrix, camera.eye, [0.0, 0.0, 0.0], [0.0, 1.0, 0.0]);	

	matrices.projectionMatrix = mat4.create();
	mat4.perspective(matrices.projectionMatrix, camera.FOV, gl.canvas.clientWidth / gl.canvas.clientHeight, 0.001, 100.0);	
}

function initProgram() {
	try {
		program = WGL.createProgramFromScripts(gl, "vert-shader", "frag-shader");
	} 
	catch (err) {		
		alert(err.toString());
	}
}

function initBuffers() {
    var vertices = [
    	-1.0, -1.0,  0.0,
       	1.0, -1.0,  0.0,
        1.0,  1.0,  0.0,
        -1.0,  1.0,  0.0
    ];

    var indices = [
        0, 1, 2,
        2, 3, 0
    ];

	if (buffers.vertexBuffer === undefined) {
		buffers.vertexBuffer = gl.createBuffer();
	}		
	if (buffers.indexBuffer === undefined) {
		buffers.indexBuffer = gl.createBuffer();
	}
	
	gl.bindBuffer(gl.ARRAY_BUFFER, buffers.vertexBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);		

	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indexBuffer);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

	buffers.numOfIndices = indices.length;
}

function randomArray(size) {
	var randoms = [];
	for (let i = 0; i < size; i++) {
		randoms.push(Math.random());
	}
	return randoms;
}

function initTextures() {
	const numOfRandoms = 4096;

	var randoms = randomArray(numOfRandoms);

	textures.randTexture = gl.createTexture();
	textures.randTextureSize = numOfRandoms;

  	gl.bindTexture(gl.TEXTURE_2D, textures.randTexture);

 	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
   	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
   	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.R16F,
                numOfRandoms, 1, 0, gl.RED, gl.FLOAT,
                new Float32Array(randoms));
}

function initScene() {
	scene = new Scene();
	scene.initDefault();
}

function getInvertedMatrix(matrix) {
	var inverted = mat4.create();
	mat4.invert(inverted, matrix);
	return inverted;
}

function setProgramUniforms() {
    gl.activeTexture(gl.TEXTURE0);
    gl.uniform1i(gl.getUniformLocation(program, "randoms"), 0);    
 	gl.bindTexture(gl.TEXTURE_2D, textures.randTexture);

 	gl.uniform1i(gl.getUniformLocation(program, "randomsSize"), textures.randTextureSize);

	gl.uniform1i(gl.getUniformLocation(program, "numOfSamples"), settings.numOfSamples);      
    gl.uniform1i(gl.getUniformLocation(program, "samplingMode"), settings.samplingMode);
    gl.uniform1i(gl.getUniformLocation(program, "refractionEnabled"), settings.refractionEnabled);        
    gl.uniform1i(gl.getUniformLocation(program, "maxRecursionDepth"), settings.maxRecursionDepth);
    gl.uniform3fv(gl.getUniformLocation(program, "backgroundColor"), settings.backgroundColor);
    gl.uniform3fv(gl.getUniformLocation(program, "ambientLight"), settings.ambientLight);        

    gl.uniformMatrix4fv(gl.getUniformLocation(program, "camToWorld"), false, getInvertedMatrix(matrices.viewMatrix));    
    gl.uniform2fv(gl.getUniformLocation(program, "windowSize"), vec2.fromValues(gl.canvas.clientWidth, gl.canvas.clientHeight));    
    gl.uniform1f(gl.getUniformLocation(program, "cameraFOV"), camera.FOV);   
    gl.uniform1f(gl.getUniformLocation(program, "fovTangent"), camera.FOVTangent);         

    var rotationMatrix = mat4.create();
    mat4.fromYRotation(rotationMatrix, settings.rotationAngle[0]);
    mat4.rotateX(rotationMatrix, rotationMatrix, settings.rotationAngle[1]);

    var modelViewMatrix = mat4.create();
	mat4.multiply(modelViewMatrix, rotationMatrix, matrices.modelMatrix);	

	if (scene !== undefined) {
    	scene.setProgramUniforms(gl, program, modelViewMatrix);
	}
}

function drawGL() {
	gl.clearColor(settings.backgroundColor[0], settings.backgroundColor[1], settings.backgroundColor[2], 1.0);
	gl.viewport(0, 0, gl.canvas.clientWidth, gl.canvas.clientHeight);

	gl.clear(gl.COLOR_BUFFER_BIT);	

	gl.useProgram(program);

	setProgramUniforms();

	var positionLocation = gl.getAttribLocation(program, "vertex");

	gl.bindBuffer(gl.ARRAY_BUFFER, buffers.vertexBuffer);
	gl.enableVertexAttribArray(positionLocation);
	gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);		

	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indexBuffer);	

	gl.drawElements(gl.TRIANGLES, buffers.numOfIndices, gl.UNSIGNED_SHORT, 0);		
}

function rotateModel() {
	mat4.rotate(matrices.modelMatrix, matrices.modelMatrix, -Math.PI/(4*180.0), [0, 1, 0]);
}

function init() {
	try {
		gl = WGL.getGLContextFromCanvas("canvas");
	} 
	catch (err) {
		alert(err.toString());
	}	
	initGL();
	initMatrices();
	initProgram();
	initBuffers();
	initTextures();
	initScene();
}

function render() {	
	WGL.fitViewportToCanvas(gl);	
	drawGL();	
	//rotateModel();
	//requestAnimationFrame(render);		
}

function setMaxDepth(depth) {
	settings.maxRecursionDepth = depth;
}

function setSamples(samples) {
	settings.numOfSamples = samples;
}

function setSamplingMode(samplingMode) {
	settings.samplingMode = samplingMode;
}

function enableTransparency(enabled) {
	settings.refractionEnabled = enabled;
}

function setBackgroundColor(rgb) {
	settings.backgroundColor = rgb;
}

function rotateScene(dx, dy) {
	settings.rotationAngle[0] += dx;
	settings.rotationAngle[1] += dy;
}

function randomScene(numOfObjects) {
	if (scene !== null) {
		scene.clearObjects();
		for (let i = 0; i < numOfObjects; i++) {
			scene.addRandomObject();
		}
	}
}

function addRandomObjectToScene() {
	if (scene !== null) {
		scene.addRandomObject();
	}
}

function clearScene() {
	if (scene !== null) {
		scene.clearObjects();
	}
}
