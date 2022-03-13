
main();

//
// Start here
//
function main() {
  const canvas = document.querySelector("#glcanvas");
  const gl = canvas.getContext("webgl");
  // canvas.width = canvas.clientWidth;
  // canvas.height = canvas.clientHeight;
  var h = canvas.height;
  var w = canvas.width;

  // If we don't have a GL context, give up now

  if (!gl) {
    alert(
      "Unable to initialize WebGL. Your browser or machine may not support it."
    );
    return;
  }

  // Vertex shader program

  const vsSource = /*glsl */ `
    attribute vec3 aPosition;
   
    // uniform mat4 uModelViewMatrix;
    // uniform mat4 uProjectionMatrix;
    // varying vec4 vPosition;
    varying vec3 vPosition;

    void main(){
      // gl_Position = uProjectionMatrix*uModelViewMatrix*vec4(aPosition,1.0);
      gl_Position = vec4(aPosition,1.0);
      vPosition = aPosition;
    }

  `;

  // Fragment shader program

  const fsSource = /*glsl */ `
    precision mediump float;
    varying vec3 vPosition;

    struct Sphere{
      vec3 center;
      float radius;
      vec3 color;
    };

    struct Ray {
      vec3 origin;
      vec3 direction;
    };

    struct Light{
      vec3 position;
      float ambience;
      vec3 specular;
      vec3 diffuse;
    };

    Sphere spheres[1];
    Ray rays[1];
    Light light[1];

    void initialize(){
      float x = vPosition.x;
      float y = vPosition.y;
      float z = vPosition.z;
      float focalLength = 2.0;
      vec3 color = vec3(0.0,0.0,0.0);


      spheres[0].center = vec3 (-1.0, 1.0, 0.0);
      spheres[0].radius = 0.8;
      spheres[0].color = vec3(1.0, 0.0, 0.0);
      
      rays[0].origin = vec3(0.0, 0.0, 4.0);
      rays[0].direction = normalize(vec3(x-0.5,0.5-y,-focalLength));

      // light.position = vec3(uCursor.x,-uCursor.y,0.9);  //Cursor Position
      light[0].position = vec3(-1.0,0.5,1.0);
      
      light[0].ambience = 0.1;
    }

    vec3 checkIntersectSphere(Sphere sphere, Ray ray, Light light){

      vec3 sphereCenter = sphere.center;
      vec3 colorOfSphere = sphere.color;
      float radius = sphere.radius;
      vec3 cameraSource = ray.origin;
      vec3 cameraDirection = ray.direction;
      vec3 lightSource = light.position;
      float ambience = light.ambience;
      vec3 color = vec3(0.0, 0.0, 0.0);

      vec3 distanceFromCenter = (cameraSource-sphereCenter);
      float B = 2.0*dot(cameraDirection, distanceFromCenter);
      float C = dot(distanceFromCenter,distanceFromCenter) - pow(radius,2.0);
      float delta = pow(B,2.0) - 4.0*C;
      float t = 0.0;

      if(delta > 0.0){
        float sqRoot = sqrt(delta);
        float t1 = (-B + sqRoot)/2.0;
        float t2 = (-B - sqRoot)/2.0;
        t = min(t1,t2);
      }

      if(delta == 0.0){
        t = -B/2.0;
      }

      if(t>0.0){
        vec3 surfacePoint = cameraSource + (t*cameraDirection);
        vec3 surfaceNormal = normalize(surfacePoint-sphereCenter);
        color = colorOfSphere*(ambience + ((1.0-ambience)*max(0.0,dot(surfaceNormal,lightSource))));
      }
      return color;

    }

    void main(){
      initialize();
      vec3 color = checkIntersectSphere(spheres[0],rays[0],light[0]);
      gl_FragColor = vec4(color,1.0);
    }

    
  `;

  //Create shaderProgram

  const shaderProgram = initShaderProgram(gl, vsSource, fsSource);

  const programInfo = {
    program: shaderProgram,
    attribLocations: {
      vertexPosition: gl.getAttribLocation(shaderProgram, "aPosition"),
    },
    // uniformLocations: {
    //   scale: gl.getUniformLocation(
    //     shaderProgram,
    //     "scale"
    //   ),
    //   modelViewMatrix: gl.getUniformLocation(shaderProgram, "uModelViewMatrix"),
    // },
  };

  const buffers = initBuffers(gl);

  drawScene(gl, programInfo, buffers);
}

function initBuffers(gl) {
  var positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  const positions = [-1, 1, 1, 1, 1, 1, -1, -1, 1, 1, -1, 1];
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
  return { position: positionBuffer };
}

function drawScene(gl, programInfo, buffers) {
  gl.viewport(0, 0,gl.canvas.width,gl.canvas.height);
  gl.clearColor(0.0, 0.0, 0.0, 0.0);
  gl.clearDepth(1.0);
  gl.enable(gl.DEPTH_TEST);
  gl.depthFunc(gl.LEQUAL);
  
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // const fieldOfView = (45 * Math.PI) / 180;
  // const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
  // const zNear = 0.1;
  // const zFar = 100.0;
  // const projectionMatrix = glMatrix.mat4.create();

  // glMatrix.mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);

  // const modelViewMatrix = glMatrix.mat4.create();

  // glMatrix.mat4.translate(modelViewMatrix, modelViewMatrix, [.0, 0.0, 0.0]);

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);

  const numComponents = 3;
  const type = gl.FLOAT;
  const normalize = false;
  const stride = 0;
  const offset = 0;
  gl.vertexAttribPointer(
    programInfo.attribLocations.vertexPosition,
    numComponents,
    type,
    normalize,
    stride,
    offset
  );
  gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);

  gl.useProgram(programInfo.program);

  //Set Shader Uniforms

  

  // gl.uniformMatrix4fv(programInfo.uniformLocations.projectionMatrix,false,projectionMatrix);
  // gl.uniformMatrix4fv(programInfo.uniformLocations.modelViewMatrix,false,modelViewMatrix);

  {
    const offset = 0;
    const vertexCount = 4;
    gl.drawArrays(gl.TRIANGLE_STRIP, offset, vertexCount);
  }
}

//------------------------------- General Initialization --------------------------------

//
// Initialize a shader program, so WebGL knows how to draw our data
//
function initShaderProgram(gl, vsSource, fsSource) {
  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
  const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

  // Create the shader program

  const shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);

  // If creating the shader program failed, alert

  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert(
      "Unable to initialize the shader program: " +
        gl.getProgramInfoLog(shaderProgram)
    );
    return null;
  }

  return shaderProgram;
}

//
// creates a shader of the given type, uploads the source and
// compiles it.
//
function loadShader(gl, type, source) {
  const shader = gl.createShader(type);

  // Send the source to the shader object

  gl.shaderSource(shader, source);

  // Compile the shader program

  gl.compileShader(shader);

  // See if it compiled successfully

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert(
      "An error occurred compiling the shaders: " + gl.getShaderInfoLog(shader)
    );
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}
