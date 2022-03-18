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

uniform vec3 iResolution;

const float pi = 3.14159265359;

struct Sphere {
    vec3 center;
    float radius;
    vec3 color;
    float kd; //Diffuse
    float ks; //Specular
    float n; //Specular power
};
struct Plane {
    vec3 normal;
    float height;
    vec3 color;
    float kd; //Diffuse
    float ks; //Specular
    float n; //Specular power
};

struct Ray {
    vec3 origin;
    vec3 direction;
};
struct Light {
    vec3 position;
    vec3 color;
    float intensity;
};

bool intersect(float a, float b, float c, out float s1, out float s2) {

    float delta = b * b - (4.0 * a * c);
    if(delta < 0.0) {
        return false;
    }

    if(delta < 0.001) {
        s1 = s2 = (-b / (2.0 * a));
        return true;
    } else {
        s1 = (-b - sqrt(delta)) / (2.0 * a);
        s2 = (-b + sqrt(delta)) / (2.0 * a);
        return true;
    }
}

bool intersection_sphere(Ray ray, Sphere sphere, out float t) {

    vec3 x = ray.origin - sphere.center;
    float a = dot(ray.direction, ray.direction);
    float b = 2.0 * dot(ray.direction, x);
    float c = dot(x, x) - (sphere.radius * sphere.radius);
    float s1, s2;
    if(intersect(a, b, c, s1, s2)) {
        t = min(s1, s2);
        return true;
    }

    return false;
}

bool intersection_plane(Ray ray, inout Plane plane, out float t) {
    float a = -(dot(ray.origin, plane.normal) + plane.height);
    float b = dot(ray.direction, plane.normal);
    t = a / b;
    return t >= 0.0;
}

// vec3 sphereLighting(Sphere sphere, vec3 point, vec3 normal, Light light) {
//     vec3 lightPoint = point - light.position;
//     vec3 refl = reflect(-lightPoint, normal);
//     float cosTheta = dot(lightPoint, normal);
//     vec3 v = 2.0 * cosTheta * normal - lightPoint;

//     float cosAlpha = dot(v, lightPoint);
//     float ph = (sphere.kd / pi) + sphere.ks * ((sphere.n + 2.0) / (2.0 * pi)) * pow(cosAlpha, sphere.n);

//     return sphere.color*ph;
// }

vec3 sphereLighting(Sphere sphere, vec3 point, vec3 normal, Light light) {
    vec3 lightPoint = light.position - point;
    return sphere.color * max(dot(normal, lightPoint), 0.0) / length(lightPoint);
}

vec3 planeLighting(Plane plane, vec3 point, vec3 normal, Light light) {
    vec3 lightPoint = light.position - point;
    return plane.color * max(dot(normal, lightPoint), 0.0) / length(lightPoint);
}

void main() {

     vec2 uv = (gl_FragCoord.xy / iResolution.xy)/vec2(0.9,1.6);

    //Scene

    //Sphere
    Sphere sphere;
    sphere.center = vec3(0.0, 0.5, -5.0);
    sphere.radius = 1.0;
    sphere.color = vec3(1.0, 0.0, 0.0);
    sphere.kd = 1.0;
    sphere.ks = 1.0;
    sphere.n = 10.0;

    //Plane
    Plane plane;
    plane.normal = vec3(0.0, 1.0, 0.0);
    plane.height = 3.3;
    plane.color = vec3(0.0, 1.0, 0.0);
    plane.kd = 1.0;
    plane.ks = 1.0;
    plane.n = 10.0;

    //Light
    Light light;
    light.position = vec3(1.0, 3.0, 5.0);
    light.color = vec3(1.0, 1.0, 1.0);
    light.intensity = 3.0;

    //Ray
    Ray ray;
    ray.origin = vec3(0.0, 1.0, 0.0);
    ray.direction = vec3(-1.0 + 2.0 * uv, -1.0);

    //Intersection
    float t;
    
    if(intersection_sphere(ray, sphere, t)) {
        vec3 point = ray.origin + t * ray.direction;
        vec3 normal = point - sphere.center;
        gl_FragColor = vec4(sphereLighting(sphere, point, normal, light), 1.0);

    } else if(intersection_plane(ray, plane, t)) {
        vec3 point = ray.origin + t * ray.direction;
        gl_FragColor = vec4(planeLighting(plane, point, plane.normal, light), 1.0);
        
        Ray nr;
        nr.origin = point;
        nr.direction = point-light.position;
        

    } else {
      gl_FragColor = vec4(1.0, 0.5, 0.0, 1.0);
    }
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
    uniformLocations: {
      resolution:gl.getUniformLocation(shaderProgram, "iResolution"),
    },
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
  webglUtils.resizeCanvasToDisplaySize(gl.canvas);

  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
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

  gl.uniform3f(programInfo.uniformLocations.resolution,1280.0,720.0,1.0);

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
