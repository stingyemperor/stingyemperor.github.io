/****************** For SlideBar Parameter ******************/
var mouseFlag = 0;// 0 : moving ; 1: stop
var currentLight = 0;
var lightNum=1;

//light section parameters
var mouseXY = [];
var mouseXYenv;


mouseXY[0] = [0.3, -0.1];   //default light
//let previousTime = 0.0;
//let degreesPerSecond = 20.0;
mouseXYenv = [0.3,-0.1];
var lightsPosition = 1;
var lightsOnly = 0;
var lightColor = [];
var baseColor = [];
var backLightCol =[];
var lightIntensity = [];
var pointLightDis = [];
var pointLightDecay = [];
var showDiffuse = [];
var showSpec = [];  

lightColor =[1.0, 1.0 ,1.0];
baseColor =[1.0, 1.0 ,1.0];
backLightCol =[0.92,0.70,0.20];
lightIntensity[0] = 1.0;
pointLightDis[0] = 0.5;
pointLightDecay[0] = 0.0;
showDiffuse[0] = 1;
showSpec[0] = 1; 

//style section parameters

var styleBright,
    styleDark;

//highlight parameters
var highlightA,
    highlightB;
//Diffuse Alpha parameters
var alphaR;
var alphaG;
var alphaB;

//refraction parameters
var logIOR;//[-1, 1]
var BGdis;

//reflection parameters
var FGdis;

var reflMap;//1: plane; 2:hemisphere

var FGshiftX;
var FGshiftY;
var FGscaleX;
var FGscaleY;


//Fresnel parameters
var fresnelIntensity;
var fresnelB; //cos = 0.95
var fresnelC; //cos = 0.7
var checkFresnel;

// Height Field Light parameters
var hLightDistance;
var hLightIntensity;
var hLightBack;
var useEnvMap;
var EnvL;
var useBacklight;
var useAO;

var clipNum;
var sampleNum;
var biasNum;
var radiusNum;

function initParameters(){
    lightColor =[0.75, 0.40, 0.15];
    baseColor = [0.0, 0.0, 0.0];
    backLightCol = [0.6,0.8,0.8];
    lightIntensity[0] = 1.0;
    pointLightDis[0] = 0.5;
    pointLightDecay[0] = 0.0;
    showDiffuse[0] = 1;
    showSpec[0] = 1; 

    //style section parameters
    styleBright = 0;
    styleDark = 1;

    //highlight parameters
    highlightA = 0.1;
    highlightB = 0.08;

    //Diffuse Alpha parameters
    alphaR = 1;
    alphaG = 1;
    alphaB = 1;
    
    //refraction parameters
    logIOR = 1.0;//[-1, 1]
    BGdis = 1.0;
    
    //reflection parameters
    FGdis = 0.82;
    reflMap = 1;//1: plane; 2:hemisphere
    FGshiftX = 0;
    FGshiftY = 0;
    FGscaleX = 0.5;
    FGscaleY = 0.5;
    
    //Fresnel parameters
    fresnelIntensity = 0;
    fresnelB = 0.3; //cos = 0.95
    fresnelC = 0.6; //cos = 0.7
    checkFresnel = 0;

    // Height Light parameters
    hLightDistance = 3.4;
    hLightIntensity = 1.2;
    hLightBack = 0.71;
    useEnvMap = 0;
    EnvL = 0.8;
    useBacklight = 0;
    useAO = 0;
	
    clipNum = 0.3;
    sampleNum = 512.0;
    biasNum = 0.3;
    radiusNum = 0.1;	
	
	

}





//Locs

var currentLightLoc;
var lightNumLoc;
var mouseLoc;

var mouseenvLoc;

var lightsOnlyLoc;
var lightColorLoc;
var baseColorLoc;
var backLightColLoc;
var lightIntensityLoc;
var pointLightDisLoc;
var pointLightDecayLoc;

var showDiffuseLoc;
var showSpecLoc;

var styleBrightLoc, styleDarkLoc;
var highlightALoc, highlightBLoc;
var alphaRLoc, alphaGLoc, alphaBLoc;
var logIORLoc, BGdisLoc;
var FGdisLoc;
var reflMapLoc;
var FGshiftXLoc, FGshiftYLoc, FGscaleXLoc, FGscaleXLoc;

var fresnelIntensityLoc;
var fresnelBLoc, fresnelCLoc;
var checkFresnelLoc; 

var hLightDistanceLoc, hLightIntensityLoc, hLightBackLoc;
var useEnvMapLoc;
var EnvLLoc;
var useBacklightLoc;
var useAOLoc;

var clipNumLoc;
var sampleNumLoc;
var biasNumLoc;
var radiusNumLoc;
/****************** For Basic shader ******************/

var gl;
var points = [];
var colors = [];
var normals = [];
var texCoords = [];

var numVertices = 36;

var color0Loc;
var color1Loc;

var normalImage, normalTexture;
var darkTexture, darkImage;
var lightTexture, lightImage;
var normalTexture, normalImage;
var reflectTexture, reflectImage;
var refractTexture, refractImage;
var alphaTexture, alphaImage;
var heightFieldTexture, heightFieldImage;
var envLightTexture, envLightImage;
var noiseTexture, noiseImage;
var h1Texture, h1Image;
var h2Texture, h2Image;
var h3Texture, h3Image;
var h4Texture, h4Image;
var h5Texture, h5Image;
var h6Texture, h6Image;

var capturer = null;
var then = 0;
window.onload = function init()
{
    var canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    
    var context = canvas.getContext('2d');
    

    /***************/

    colorCube();

    /////////////////  Configure WebGL  ////////////////////////

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.05, 0.05, 0.05, 1.0 );

    gl.enable( gl.DEPTH_TEST );
    
    //////////////////  Load shaders and initialize attribute buffers  /////////////////
    
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
	
    
	
    gl.useProgram( program );
    
    /* Vertex colors
    // Load the data into the GPU   
    var cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW );

    // Associate out shader variables with our data buffer
    var vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );
    */


    // Vertex positions
    // Load the data into the GPU
    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW )

    // Associate out shader variables with our data buffer
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 ); 
    gl.enableVertexAttribArray( vPosition );


    // Vertex normals
    // Load the data into the GPU
    var nBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, nBuffer);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(normals), gl.STATIC_DRAW);

    // Associate out shader variables with our data buffer
    var vNormal = gl.getAttribLocation( program, "vNormal" );
    gl.vertexAttribPointer( vNormal, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vNormal );


    // Vertex texture coordinates
    // Load the data into the GPU
    var tBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, tBuffer);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(texCoords), gl.STATIC_DRAW);

    // Associate out shader variables with our data buffer
    var vTex = gl.getAttribLocation( program, "texcoord");
    gl.vertexAttribPointer( vTex, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray( vTex );

    initTextures();

    normalImage.src = image3.src;
    requestCORSIfNotSameOrigin(normalImage, normalImage.src);
    console.log(normalImage.src);
    
    lightImage.src = image2.src;
    requestCORSIfNotSameOrigin(lightImage, lightImage.src);
    console.log(lightImage.src);
    
    darkImage.src =  image1.src;
    requestCORSIfNotSameOrigin(darkImage, darkImage.src);
    console.log(this.darkImage.src);
    
    refractImage.src = image5.src;
    requestCORSIfNotSameOrigin(refractImage, refractImage.src);
    console.log(this.refractImage.src);
    
    reflectImage.src = image4.src;
    requestCORSIfNotSameOrigin(reflectImage, reflectImage.src);
    console.log(this.refractImage.src);
    
    alphaImage.src = image6.src;
    requestCORSIfNotSameOrigin(alphaImage, alphaImage.src);
    console.log(this.alphaImage.src);
    
    heightFieldImage.src = image7.src;
    requestCORSIfNotSameOrigin(heightFieldImage, heightFieldImage.src);
    console.log(heightFieldImage.src);
    
    envLightImage.src = image8.src;
    requestCORSIfNotSameOrigin(envLightImage, envLightImage.src);
    console.log(envLightImage.src);
	
    noiseImage.src = image10.src;
    requestCORSIfNotSameOrigin(noiseImage, noiseImage.src);
    console.log(noiseImage.src);
	
    h1Image.src = image11.src;
    requestCORSIfNotSameOrigin(h1Image, h1Image.src);
    console.log(h1Image.src);
    
    h2Image.src = image12.src;
    requestCORSIfNotSameOrigin(h2Image, h2Image.src);
    console.log(h2Image.src);
	
    h3Image.src = image13.src;
    requestCORSIfNotSameOrigin(h3Image, h3Image.src);
    console.log(h3Image.src);
	
    h4Image.src = image14.src;
    requestCORSIfNotSameOrigin(h4Image, h4Image.src);
    console.log(h4Image.src);
	
    h5Image.src = image15.src;
    requestCORSIfNotSameOrigin(h5Image, h5Image.src);
    console.log(h5Image.src);
	
    h6Image.src = image16.src;
    requestCORSIfNotSameOrigin(h6Image, h6Image.src);
    console.log(h6Image.src);

    normalImage.onload = function() { handleTextureLoaded(normalImage, normalTexture); }

    lightImage.onload = function() { handleTextureLoaded(lightImage, lightTexture); }

    darkImage.onload = function() { handleTextureLoaded(darkImage, darkTexture); }

    refractImage.onload = function() { handleTextureLoaded(refractImage, refractTexture); }

    reflectImage.onload = function() { handleTextureLoaded(reflectImage, reflectTexture); }

    alphaImage.onload = function() { handleTextureLoaded(alphaImage, alphaTexture); }

    heightFieldImage.onload = function() { handleTextureLoaded(heightFieldImage, heightFieldTexture); }

    envLightImage.onload = function() { handleTextureLoaded(envLightImage, envLightTexture); }
	
    noiseImage.onload = function() { handleTextureLoaded(noiseImage, noiseTexture); }
	
    h1Image.onload = function() { handleTextureLoaded(h1Image, h1Texture); }
	
    h2Image.onload = function() { handleTextureLoaded(h2Image, h2Texture); }
  
    h3Image.onload = function() { handleTextureLoaded(h3Image, h3Texture); }

    h4Image.onload = function() { handleTextureLoaded(h4Image, h4Texture); }
	
    h5Image.onload = function() { handleTextureLoaded(h5Image, h5Texture); }
	
    h6Image.onload = function() { handleTextureLoaded(h6Image, h6Texture); }

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, normalTexture);
    gl.uniform1i(gl.getUniformLocation(program, "uSamplerNormal"), 0);

    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, lightTexture);
    gl.uniform1i(gl.getUniformLocation(program, "uSamplerColor1"), 1);

    gl.activeTexture(gl.TEXTURE2);
    gl.bindTexture(gl.TEXTURE_2D, darkTexture);
    gl.uniform1i(gl.getUniformLocation(program, "uSamplerColor0"), 2);

    gl.activeTexture(gl.TEXTURE3);
    gl.bindTexture(gl.TEXTURE_2D, refractTexture);
    gl.uniform1i(gl.getUniformLocation(program, "uSamplerBackground"), 3);

    gl.activeTexture(gl.TEXTURE4); 
    gl.bindTexture(gl.TEXTURE_2D, reflectTexture);
    gl.uniform1i(gl.getUniformLocation(program, "uSamplerForeground"), 4);

    gl.activeTexture(gl.TEXTURE5); 
    gl.bindTexture(gl.TEXTURE_2D, alphaTexture);
    gl.uniform1i(gl.getUniformLocation(program, "uSamplerAlpha"), 5);

    gl.activeTexture(gl.TEXTURE6); 
    gl.bindTexture(gl.TEXTURE_2D, heightFieldTexture);
    gl.uniform1i(gl.getUniformLocation(program, "uSamplerHeight"), 6);

    gl.activeTexture(gl.TEXTURE7); 
    gl.bindTexture(gl.TEXTURE_2D, envLightTexture);
    gl.uniform1i(gl.getUniformLocation(program, "uSamplerEnv"), 7);
	
    gl.activeTexture(gl.TEXTURE8); 
    gl.bindTexture(gl.TEXTURE_2D, noiseTexture);
    gl.uniform1i(gl.getUniformLocation(program, "uSamplerNoise"), 8);
	
    gl.activeTexture(gl.TEXTURE9); 
    gl.bindTexture(gl.TEXTURE_2D, h1Texture);
    gl.uniform1i(gl.getUniformLocation(program, "uSamplerh1"), 9);
	
    gl.activeTexture(gl.TEXTURE10); 
    gl.bindTexture(gl.TEXTURE_2D, h2Texture);
    gl.uniform1i(gl.getUniformLocation(program, "uSamplerh2"), 10);
	
    gl.activeTexture(gl.TEXTURE11); 
    gl.bindTexture(gl.TEXTURE_2D, h3Texture);
    gl.uniform1i(gl.getUniformLocation(program, "uSamplerh3"), 11);
	
    gl.activeTexture(gl.TEXTURE12); 
    gl.bindTexture(gl.TEXTURE_2D, h4Texture);
    gl.uniform1i(gl.getUniformLocation(program, "uSamplerh4"), 12);
	
    gl.activeTexture(gl.TEXTURE13); 
    gl.bindTexture(gl.TEXTURE_2D, h5Texture);
    gl.uniform1i(gl.getUniformLocation(program, "uSamplerh5"), 13);
	
    gl.activeTexture(gl.TEXTURE14); 
    gl.bindTexture(gl.TEXTURE_2D, h6Texture);
    gl.uniform1i(gl.getUniformLocation(program, "uSamplerh6"), 14);

    currentLightLoc = gl.getUniformLocation (program, "currentLight");
    lightNumLoc = gl.getUniformLocation (program, "lightNum");
    mouseLoc = gl.getUniformLocation( program, "mouseXY");
    mouseenvLoc = gl.getUniformLocation( program, "mouseXYenv");
    
    lightsOnlyLoc = gl.getUniformLocation (program, "lightsOnly");

    
    lightColorLoc = gl.getUniformLocation (program, "lightColor");
    baseColorLoc = gl.getUniformLocation (program, "baseColor");
    backLightColLoc = gl.getUniformLocation (program, "backLightCol");
    lightIntensityLoc = gl.getUniformLocation (program, "lightIntensity");
    showDiffuseLoc = gl.getUniformLocation( program, "showDiffuse");
    showSpecLoc = gl.getUniformLocation( program, "showSpec");
    pointLightDisLoc = gl.getUniformLocation( program, "pointLightDis");
    pointLightDecayLoc = gl.getUniformLocation( program, "pointLightDecay");
            

    styleBrightLoc = gl.getUniformLocation( program, "styleBright");
    styleDarkLoc = gl.getUniformLocation( program, "styleDark");
    highlightALoc = gl.getUniformLocation( program, "highlightA");
    highlightBLoc = gl.getUniformLocation( program, "highlightB");
    alphaRLoc = gl.getUniformLocation( program, "alphaR");
    alphaGLoc = gl.getUniformLocation( program, "alphaG");
    alphaBLoc = gl.getUniformLocation( program, "alphaB");
    logIORLoc = gl.getUniformLocation( program, "logIOR");
    BGdisLoc = gl.getUniformLocation( program, "BGdis");
    FGdisLoc = gl.getUniformLocation( program, "FGdis");
    reflMapLoc = gl.getUniformLocation ( program, "reflMap");
    FGshiftXLoc = gl.getUniformLocation( program, "FGshiftX");
    FGshiftYLoc = gl.getUniformLocation( program, "FGshiftY");
    FGscaleXLoc = gl.getUniformLocation( program, "FGscaleX");
    FGscaleYLoc = gl.getUniformLocation( program, "FGscaleY");

    fresnelIntensityLoc = gl.getUniformLocation ( program, "fresnelIntensity");
    fresnelBLoc = gl.getUniformLocation( program, "fresnelB");
    fresnelCLoc = gl.getUniformLocation( program, "fresnelC");
    checkFresnelLoc = gl.getUniformLocation( program, "checkFresnel");

    hLightDistanceLoc = gl.getUniformLocation( program, "hLightDistance");
    hLightIntensityLoc = gl.getUniformLocation( program, "hLightIntensity");
    hLightBackLoc = gl.getUniformLocation( program, "hLightBack");
    useEnvMapLoc = gl.getUniformLocation( program, "useEnvMap");
    EnvLLoc = gl.getUniformLocation( program, "EnvL");
    useBacklightLoc = gl.getUniformLocation( program, "useBacklight");
    useAOLoc = gl.getUniformLocation( program, "useAO");
    clipNumLoc = gl.getUniformLocation( program, "clipNum");
    sampleNumLoc = gl.getUniformLocation( program, "sampleNum");
    biasNumLoc = gl.getUniformLocation( program, "biasNum");
    radiusNumLoc = gl.getUniformLocation( program, "radiusNum");

	// Create a capturer that exports PNG images in a TAR file

	capturer = new CCapture( {
				verbose: false,
				display: true,
				framerate: 60,
				quality: 100,
				format: 'png'
			} );


    var startBtn = $('#btn_Start');
        startBtn.click(function() {
            capturer.start();
    });

    var stopBtn = $('#btn_Stop');
        stopBtn.click(function() {
		    capturer.stop();
		    capturer.save();
    });

    
    render();
};

function initTextures() {
    

    normalTexture = gl.createTexture();
    normalImage = new Image();
    
    lightTexture = gl.createTexture();
    lightImage = new Image();
    
    darkTexture = gl.createTexture();
    darkImage = new Image();
    
    refractTexture = gl.createTexture();
    refractImage = new Image();
    
    reflectTexture = gl.createTexture();
    reflectImage = new Image();
    
    alphaTexture = gl.createTexture();
    alphaImage = new Image();
    

    heightFieldTexture = gl.createTexture();
    heightFieldImage = new Image();

    envLightTexture = gl.createTexture();
    envLightImage = new Image();
	
    noiseTexture = gl.createTexture();
    noiseImage = new Image();	

    h1Texture = gl.createTexture();
    h1Image = new Image();
	
    h2Texture = gl.createTexture();
    h2Image = new Image();
	
    h3Texture = gl.createTexture();
    h3Image = new Image();
	
    h4Texture = gl.createTexture();
    h4Image = new Image();
	
    h5Texture = gl.createTexture();
    h5Image = new Image();
	
    h6Texture = gl.createTexture();
    h6Image = new Image();
	
	
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



function render() {
	
    
    
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );

    var lightsOnlyElem = $ ('#lightsOnlySelect:checked');
    lightsOnly = (lightsOnlyElem.val())?1:0;

    var checkFresnelElem = $('#checkFresnelSelect:checked');
    checkFresnel = (checkFresnelElem.val())?1:0;

    var useEnvMapElem = $('#useEnvMapSelect:checked');
    useEnvMap = (useEnvMapElem.val())?1:0;
 
    var useBacklightElem = $('#useBacklightSelect:checked');
    useBacklight = (useBacklightElem.val())?1:0;
	
    var useAOElem = $('#useAOSelect:checked');
    useAO = (useAOElem.val())?1:0;
    

    for (var i = 0; i < lightNum ; i++)
    {
        var checkboxName_showDiffuse = '#lightPanel' + i + ' #diffuseSelect:checked';
        var showDiffuseElem = $(checkboxName_showDiffuse);
        showDiffuse[i] = (showDiffuseElem.val())?1:0;
        
        var checkboxName_showSpec = '#lightPanel' + i + ' #specSelect:checked';
        var showSpecElem = $(checkboxName_showSpec);
        showSpec[i] = (showSpecElem.val())?1:0;
        
    }
    
    
	
    gl.uniform1i(currentLightLoc, currentLight);
    gl.uniform1f(lightNumLoc, lightNum);

    gl.uniform2fv(mouseLoc, flatten(mouseXY));//use flatten() to extract data from JS Array, send it to WebGL functions
    
    gl.uniform2fv(mouseenvLoc, flatten(mouseXYenv));
	
    gl.uniform1i(lightsOnlyLoc, lightsOnly);
    gl.uniform3fv(lightColorLoc, lightColor);
    gl.uniform3fv(baseColorLoc, baseColor);
    gl.uniform3fv(backLightColLoc, backLightCol);
    gl.uniform1fv(lightIntensityLoc, lightIntensity);
    
    gl.uniform1iv(showDiffuseLoc, showDiffuse);
    gl.uniform1iv(showSpecLoc, showSpec);
    gl.uniform1fv(pointLightDisLoc, pointLightDis);
    gl.uniform1fv(pointLightDecayLoc, pointLightDecay);
    
    gl.uniform1f(styleBrightLoc, styleBright);
    gl.uniform1f(styleDarkLoc, styleDark);
    gl.uniform1f(highlightALoc, highlightA);
    gl.uniform1f(highlightBLoc, highlightB);
    gl.uniform1f(alphaRLoc, alphaR);
    gl.uniform1f(alphaGLoc, alphaG);
    gl.uniform1f(alphaBLoc, alphaB);
    
    gl.uniform1f(logIORLoc, logIOR);
    gl.uniform1f(BGdisLoc, BGdis);
    gl.uniform1f(FGdisLoc, FGdis);
    gl.uniform1i(reflMapLoc, reflMap);
    gl.uniform1f(FGshiftXLoc, FGshiftX);
    gl.uniform1f(FGshiftYLoc, FGshiftY);
    gl.uniform1f(FGscaleXLoc, FGscaleX);
    gl.uniform1f(FGscaleYLoc, FGscaleY);

    gl.uniform1f(fresnelIntensityLoc, fresnelIntensity);
    gl.uniform1f(fresnelBLoc, fresnelB);
    gl.uniform1f(fresnelCLoc, fresnelC);
    gl.uniform1i(checkFresnelLoc, checkFresnel);

    gl.uniform1f(hLightDistanceLoc, hLightDistance);
    gl.uniform1f(hLightIntensityLoc, hLightIntensity);
    gl.uniform1f(hLightBackLoc, hLightBack);
    gl.uniform1i(useEnvMapLoc, useEnvMap);
    gl.uniform1f(EnvLLoc, EnvL);
    gl.uniform1i(useBacklightLoc, useBacklight);
    gl.uniform1i(useAOLoc, useAO);
	
	
    gl.uniform1f(clipNumLoc, clipNum);
    gl.uniform1f(sampleNumLoc, sampleNum);
    gl.uniform1f(biasNumLoc, biasNum);
    gl.uniform1f(radiusNumLoc, radiusNum);

    gl.drawArrays( gl.TRIANGLES, 0, numVertices );

    requestAnimFrame(render);
    
    if( capturer )
    capturer.capture( document.getElementById( "gl-canvas" ) );

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

function height()
{

    var img = new Image();
    image3.src = 'images/chamelon1.png';
    img.src = image3.src;

    var ncanvas = document.createElement('canvas');
    ncanvas.width = img.width;
    ncanvas.height = img.height;
    ncanvas.getContext('2d').drawImage(img, 0, 0, img.width, img.height);

    var harray = new Array(img.width);
    var harray1 = new Array(img.width);
    for(var i=0;i < img.width; i++)
    {
        harray[i] = new Array(img.height);
        harray1[i] = new Array(img.height);
    }

    var hcanvas = document.createElement('canvas');
    hcanvas.width = img.width;
    hcanvas.height = img.height;
    hcanvas.getContext('2d').drawImage(img, 0, 0, img.width, img.height);

    var maxh = -10000.0, minh = 10000.0;
    var dx = 0, dy = 0, dz = 0;
    var hx = 0.0, hy = 0.0, ht = 0.0;
    var hData, xData, yData, aData;
    var ai  = -1.0, bi = -1.0, ci = -1.0, di = -1.0;

    for(var x=0; x<img.width; x++) // Loop order change gives same results
    {
        for (var y = img.height-1; y>=0; y--)
        {
            if (x > 0)
            {
                xData = ncanvas.getContext('2d').getImageData(x-1, y, 1, 1).data;
                dx = (2 * xData[0]/255 - 1);

                dz = (2 * xData[2]/255 - 1);
                //if (dz !=0) dx = dx/dz;

                hx = harray[x-1][y];
            }
            else
            {
                dx = 0.0;
                hx = 0.0;
            }

            if (y < img.height-1)
            {
                yData = ncanvas.getContext('2d').getImageData(x, y+1, 1, 1).data;
                dy = (2 * yData[1]/255 - 1);

                dz = (2 * yData[2]/255 - 1);
                //if (dz !=0) dy = dy/dz;

                hy = harray[x][y+1];
            }
            else
            {
                dy = 0.0;
                hy = 0.0;
            }


            ht = ((hx + hy) -  (dx + dy))/2.0;

            aData = ncanvas.getContext('2d').getImageData(x, y, 1, 1).data;
            ai = 2 * aData[0]/255 - 1, bi = 2 * aData[1]/255 - 1, ci = 2 * aData[2]/255 - 1, di = 2 * aData[3]/255 - 1;
           if (di > -1.0)
                harray[x][y] = ht;
            else
                harray[x][y] = 0;
            if (minh > ht) minh = ht;
            if (maxh < ht) maxh = ht;
        }
    }
    console.log("Alpha: "+String(ai) + " " + String(bi) + " " + String(ci) + " " + String(di));


    for(var x = img.width-1; x >= 0; x--) // Loop order change gives same results
    {
        for (var y = img.height - 1; y >= 0; y--)
        {
            if (x < img.width - 1)
            {
                xData = ncanvas.getContext('2d').getImageData(x+1, y, 1, 1).data;
                dx = (2 * xData[0]/255 - 1);

                dz = (2 * xData[2]/255 - 1);
                //if (dz !=0) dx = dx/dz;

                hx = harray1[x+1][y];
            }
            else
            {
                dx = 0.0;
                hx = 0.0;
              }

            if (y < img.height - 1)
            {
                yData = ncanvas.getContext('2d').getImageData(x, y+1, 1, 1).data;
                dy = -(2 * yData[1]/255 - 1);

                dz = (2 * yData[2]/255 - 1);
                //if (dz !=0) dy = dy/dz;

                hy = harray1[x][y+1];
            }
            else
            {
                dy = 0.0;
                hy = 0.0;
            }


            ht = ((hx + hy) + (dx + dy))/2.0;

            aData = ncanvas.getContext('2d').getImageData(x, y, 1, 1).data;
            ai = 2 * aData[0]/255 - 1, bi = 2 * aData[1]/255 - 1, ci = 2 * aData[2]/255 - 1, di = 2 * aData[3]/255 - 1;
            if (di > -1.0)
                harray1[x][y] = ht;
            else
                harray1[x][y] = 0;
            if (minh > ht) minh = ht;
            if (maxh < ht) maxh = ht;
        }
    }

    console.log(JSON.stringify(harray));
    console.log("Max: " + String(maxh));
    console.log("Min: " + String(minh));

    setTimeout(function() {

        for(var i = 0; i<img.height; i++)
        {
            for(var j=0; j<img.width; j++) // Any order for for loop. Doesn't matter here
            {
                var alpha = 0;
                var h = (harray1[i][j]);// + harray1[i][j])/2.0;
                //var h = harray[i][j] > harray1[i][j] ? harray1[i][j] : harray[i][j];
                //var h = (harray1[i][j]);
                h = (h-minh)/((maxh-minh));

                aData = ncanvas.getContext('2d').getImageData(i, j, 1, 1).data;
                ai = 2 * aData[0]/255 - 1, bi = 2 * aData[1]/255 - 1, ci = 2 * aData[2]/255 - 1, di = 2 * aData[3]/255 - 1;
                if (di > -1) alpha = 1; // Change alpha to 1 if not transparent
                var heightData = hcanvas.getContext('2d').createImageData(1, 1, i, j);
                heightData.data[0] = h * 255;
                heightData.data[1] = h * 255;
                heightData.data[2] = h * 255;
                heightData.data[3] = alpha * 255;

                hcanvas.getContext('2d').putImageData(heightData,i, j);
            }
        }

    window.open(hcanvas.toDataURL('image/png'));
    }, 2000);
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
