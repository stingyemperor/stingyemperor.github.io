var mouseFlag = 0; // 0 : moving ; 1: stop
var currentLight = 0;
var lightNum = 1;

var mouseXY = [];
mouseXY[0] = [0.3, -0.3]; //default light

var lightsPosition = 0;
var lightsOnly = 0;

var lightColor = [];
lightColor[0] = [1.0, 1.0, 1.0];

var lightIntensity = [];
lightIntensity[0] = 1.0;

var pointLightDis = [];
pointLightDis[0] = 0.5;

var pointLightDecay = [];
pointLightDecay[0] = 0.1;

var showDiffuse = [];
showDiffuse[0] = 1;

var showSpec = [];
showSpec[0] = 1;

function initParameters() {
  lightColor = [1.0, 1.0, 1.0];
  //baseColor = [0.0, 0.1, 0.0];
  lightIntensity[0] = 1.0;
  pointLightDis[0] = 0.5;
  pointLightDecay[0] = 0.0;
  showDiffuse[0] = 1;
  showSpec[0] = 1;

  styleBright = 0;
  styleDark = 1;

  alphaR = 1;
  alphaG = 1;
  alphaB = 1;
}

var currentLightLoc;
var lightNumLoc;
var mouseLoc;

var lightsOnlyLoc;
var lightColorLoc;
var lightIntensityLoc;
var pointLightDisLoc;
var pointLightDecayLoc;

var showDiffuseLoc;
var showSpecLoc;

var styleBrightLoc, styleDarkLoc;

var gl;
var points = [];
var colors = [];
var normals = [];
var texCoords = [];

var numVertices = 36;

var color0Loc;
var color1Loc;

var darkTexture, darkImage;
var lightTexture, lightImage;
var normalTexture, normalImage;

window.onload = function init() {
  var canvas = document.getElementById("gl-canvas");

  gl = WebGLUtils.setupWebGL(canvas);
  if (!gl) {
    alert("WebGL isn't available");
  }

  var context = canvas.getContext("webgl");

  colorCube();

  /////////////////  Configure WebGL  ////////////////////////

  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.clearColor(0.05, 0.05, 0.05, 1.0);

  gl.enable(gl.DEPTH_TEST);

  //////////////////  Load shaders and initialize attribute buffers  /////////////////

  var program = initShaders(gl, "vertex-shader", "fragment-shader");
  gl.useProgram(program);

  // Vertex positions
  // Load the data into the GPU
  var vBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW);

  // Associate out shader variables with our data buffer
  var vPosition = gl.getAttribLocation(program, "vPosition");
  gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vPosition);

  // Vertex normals
  // Load the data into the GPU
  var nBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, nBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(normals), gl.STATIC_DRAW);

  // Associate out shader variables with our data buffer
  var vNormal = gl.getAttribLocation(program, "vNormal");
  gl.vertexAttribPointer(vNormal, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vNormal);

  // Vertex texture coordinates
  // Load the data into the GPU
  var tBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, tBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(texCoords), gl.STATIC_DRAW);

  // Associate out shader variables with our data buffer
  var vTex = gl.getAttribLocation(program, "texcoord");
  gl.vertexAttribPointer(vTex, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vTex);

  initTextures();

  normalImage.src = "../images/escher/shape.png";
  requestCORSIfNotSameOrigin(normalImage, normalImage.src);
  console.log(normalImage.src);

  lightImage.src = "../images/escher/bright1.png";
  requestCORSIfNotSameOrigin(lightImage, lightImage.src);
  console.log(lightImage.src);

  darkImage.src = "../images/escher/dark.jpg";
  requestCORSIfNotSameOrigin(darkImage, darkImage.src);
  console.log(this.darkImage.src);

  normalImage.onload = function () {
    handleTextureLoaded(normalImage, normalTexture);
  };

  lightImage.onload = function () {
    handleTextureLoaded(lightImage, lightTexture);
  };

  darkImage.onload = function () {
    handleTextureLoaded(darkImage, darkTexture);
  };

  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, normalTexture);
  gl.uniform1i(gl.getUniformLocation(program, "uSamplerNormal"), 0);

  gl.activeTexture(gl.TEXTURE1);
  gl.bindTexture(gl.TEXTURE_2D, lightTexture);
  gl.uniform1i(gl.getUniformLocation(program, "uSamplerColor1"), 1);

  gl.activeTexture(gl.TEXTURE2);
  gl.bindTexture(gl.TEXTURE_2D, darkTexture);
  gl.uniform1i(gl.getUniformLocation(program, "uSamplerColor0"), 2);

  currentLightLoc = gl.getUniformLocation(program, "currentLight");
  lightNumLoc = gl.getUniformLocation(program, "lightNum");
  mouseLoc = gl.getUniformLocation(program, "mouseXY");

  lightsOnlyLoc = gl.getUniformLocation(program, "lightsOnly");

  lightColorLoc = gl.getUniformLocation(program, "lightColor");
  lightIntensityLoc = gl.getUniformLocation(program, "lightIntensity");
  showDiffuseLoc = gl.getUniformLocation(program, "showDiffuse");
  showSpecLoc = gl.getUniformLocation(program, "showSpec");
  pointLightDisLoc = gl.getUniformLocation(program, "pointLightDis");
  pointLightDecayLoc = gl.getUniformLocation(program, "pointLightDecay");

  render();
};

function initTextures() {
  normalTexture = gl.createTexture();
  normalImage = new Image();

  lightTexture = gl.createTexture();
  lightImage = new Image();

  darkTexture = gl.createTexture();
  darkImage = new Image();
}

function handleTextureLoaded(image, texture) {
  gl.bindTexture(gl.TEXTURE_2D, null);
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.generateMipmap(gl.TEXTURE_2D);
  //gl.bindTexture(gl.TEXTURE_2D, 0);
}

function render(){

    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );

    gl.uniform1i(currentLightLoc, currentLight);
    gl.uniform1f(lightNumLoc, lightNum);

    gl.uniform2fv(mouseLoc, flatten(mouseXY));//use flatten() to extract data from JS Array, send it to WebGL functions
    
    gl.uniform1i(lightsOnlyLoc, lightsOnly);
    gl.uniform3fv(lightColorLoc, flatten(lightColor));
    gl.uniform1fv(lightIntensityLoc, lightIntensity);
    
    gl.uniform1iv(showDiffuseLoc, showDiffuse);
    gl.uniform1iv(showSpecLoc, showSpec);
    gl.uniform1fv(pointLightDisLoc, pointLightDis);
    gl.uniform1fv(pointLightDecayLoc, pointLightDecay);
    
    gl.uniform1f(styleBrightLoc, styleBright);
    gl.uniform1f(styleDarkLoc, styleDark);

    gl.drawArrays( gl.TRIANGLES, 0, numVertices );


    requestAnimFrame(render);

}

function quad(a, b, c, d) {

    var vertices = [
        vec4(-1.0, -1.0, 1.0, 1.0),
        vec4(-1.0, 1.0, 1.0, 1.0),
        vec4(1.0, 1.0, 1.0, 1.0),
        vec4(1.0, -1.0, 1.0, 1.0),
        vec4(-1.0, -1.0, -1.0, 1.0),
        vec4(-1.0, 1.0, -1.0, 1.0),
        vec4(1.0, 1.0, -1.0, 1.0),
        vec4(1.0, -1.0, -1.0, 1.0)
        ];

    var vertexColors = [
        [0.0, 0.0, 0.0, 1.0],
        [1.0, 0.0, 0.0, 1.0],
        [1.0, 1.0, 0.0, 1.0],
        [0.0, 1.0, 0.0, 1.0],
        [0.5, 0.5, 1.0, 1.0],
        [1.0, 0.0, 1.0, 1.0],
        [0.0, 1.0, 1.0, 1.0],
        [1.0, 1.0, 1.0, 1.0]
        ];

    var faceNormal = cross(subtract(vertices[a],vertices[b]), subtract(vertices[c],vertices[b]));

    var vertexTexCoords = [
        vec2(0.0, 0.0),
        vec2(1.0, 0.0),
        vec2(1.0, 1.0),
        vec2(0.0, 1.0)
    ];

    texCoords.push(vertexTexCoords[0] );
    texCoords.push(vertexTexCoords[3] );
    texCoords.push(vertexTexCoords[2] );
    texCoords.push(vertexTexCoords[0] );
    texCoords.push(vertexTexCoords[2] );
    texCoords.push(vertexTexCoords[1] );

    var indices = [a, b, c, a, c, d];
    for(var i = 0; i < indices.length; ++i) {
        points.push(vertices[indices[i]] );

        // for vertex colors use
        //colors.push(vertexColors[indices[i]] );

        // for solid colored faces use
        colors.push(vertexColors[a] );

        normals.push(faceNormal);
    }
}

function colorCube() {
    quad(1, 0, 3, 2);
    quad(2, 3, 7, 6);
    quad(3, 0, 4, 7);
    quad(6, 5, 1, 2);
    quad(4, 5, 6, 7);
    quad(5, 4, 0, 1);
}
function requestCORSIfNotSameOrigin(img, url) {
    if ((new URL(url)).origin !== window.location.origin) {
      img.crossOrigin = "";
    }
  }