var image1, image2, image3, image4, image5, image6, image7, image8, image10, image11, image12, image13, image14, image15, image16;

//var linkPrefix = "https://raw.githubusercontent.com/h44rd/NormalMaps/master/";
var linkPrefix = "";
// init vars
var $container1 = $('#container1'),
	$container2 = $('#container2'),
	$container3 = $('#container3'),
	$container4 = $('#container4'),
	$container5 = $('#container5'),
	$container6 = $('#container6');
	$container7 = $('#container7');
	$container8 = $('#container8');
	//$container9 = $('#container9');
	$container10 = $('#container10');
	$container11 = $('#container11');
	$container12 = $('#container12');
	$container13 = $('#container13');
	$container14 = $('#container14');
	$container15 = $('#container15');
	$container16 = $('#container16');

sampleButtons = function()
{
	var exampleButtons = $(".main_button_container button");
	exampleButtons.on("click", function() {
		

		if($(this).text() ==="Lucy")
		{
			initParameters();
		
			//Lucy
			alphaR = 1;
			image1.src = linkPrefix + "images/dark.png"//dark
			image2.src = linkPrefix + "images/white.png"//bright
			image3.src = linkPrefix + "images/white.png"; //shape map
			image4.src = linkPrefix + "images/snowrefl.jpg";  //reflection
			image5.src = linkPrefix + "images/snow.jpg";  //refraction	
			image6.src = linkPrefix + "images/white.png"; //alpha
			image7.src = linkPrefix + "images/hts/lucy.png"; //height field
			image8.src = linkPrefix + "images/envl.png"; // Env light
			//image9.src = linkPrefix + "images/white.png"; //alpha
			image10.src = linkPrefix + "images/noiseIM.png"; 
			image11.src = linkPrefix + "images/h1.png"; //hatch
			image12.src = linkPrefix + "images/h2.png"; //hatch
			image13.src = linkPrefix + "images/h3.png"; //hatch
			image14.src = linkPrefix + "images/h4.png"; //hatch
			image15.src = linkPrefix + "images/h5.png"; //hatch
			image16.src = linkPrefix + "images/h6.png"; //hatch
		
			
		}

		if($(this).text() ==="Skull")
		{
			initParameters();
		
			//Dragon
			alphaR = 1;
			FGdis = 2.82;
			image1.src = linkPrefix + "images/skull/dark.png"//dark
			image2.src = linkPrefix + "images/skull/light.png"//bright
			image3.src = linkPrefix + "images/white.png"; //shape map
			image4.src = linkPrefix + "images/skull/galaxy.jpg";  //reflection
			image5.src = linkPrefix + "images/skull/starry.jpg";  //refraction	
			image6.src = linkPrefix + "images/skull/alphanre.png"; //alpha
			image7.src = linkPrefix + "images/hts/skull.png"; //height field
			image8.src = linkPrefix + "images/envl.png"; // Env light
			//image9.src = linkPrefix + "images/dark.jpg";  //refraction
			image11.src = linkPrefix + "images/h1.png"; //hatch
			image12.src = linkPrefix + "images/h2.png"; //hatch
			image13.src = linkPrefix + "images/h3.png"; //hatch
			image14.src = linkPrefix + "images/h4.png"; //hatch
			image15.src = linkPrefix + "images/h5.png"; //hatch
			image16.src = linkPrefix + "images/h6.png"; //hatch
		
			
		}

		if($(this).text() ==="Dragon")
		{
			initParameters();
		
			//Dragon
			alphaR = 1;
			image1.src = linkPrefix + "images/dark.png"//dark
			image2.src = linkPrefix + "images/white.png"//bright
			image3.src = linkPrefix + "images/white.png"; //shape map
			image4.src = linkPrefix + "images/dark.png";  //reflection
			image5.src = linkPrefix + "images/dark.jpg";  //refraction	
			image6.src = linkPrefix + "images/white.png"; //alpha
			image7.src = linkPrefix + "images/hts/dragon.png"; //height field
			image8.src = linkPrefix + "images/envl.png"; // Env light
			//image9.src = linkPrefix + "images/white.png"; //alpha
			image10.src = linkPrefix + "images/noiseIM.png"; 
			image11.src = linkPrefix + "images/h1.png"; //hatch
			image12.src = linkPrefix + "images/h2.png"; //hatch
			image13.src = linkPrefix + "images/h3.png"; //hatch
			image14.src = linkPrefix + "images/h4.png"; //hatch
			image15.src = linkPrefix + "images/h5.png"; //hatch
			image16.src = linkPrefix + "images/h6.png"; //hatch
		}

		if($(this).text() ==="Buddha")
		{
			initParameters();
			
			//Buddha
			alphaR = 1;
			image1.src = linkPrefix + "images/dark.png"//dark
			image2.src = linkPrefix + "images/white.png"//bright
			image3.src = linkPrefix + "images/white.png"; //shape map
			image4.src = linkPrefix + "images/dark.png";  //reflection
			image5.src = linkPrefix + "images/dark.jpg";  //refraction	
			image6.src = linkPrefix + "images/white.png"; //alpha
			image7.src = linkPrefix + "images/hts/buddha1.png"; //height field
			image8.src = linkPrefix + "images/envl.png"; // Env light
			//image9.src = linkPrefix + "images/white.png"; //alpha
			image10.src = linkPrefix + "images/noiseIM.png";
			image11.src = linkPrefix + "images/h1.png"; //hatch
			image12.src = linkPrefix + "images/h2.png"; //hatch
			image13.src = linkPrefix + "images/h3.png"; //hatch
			image14.src = linkPrefix + "images/h4.png"; //hatch
			image15.src = linkPrefix + "images/h5.png"; //hatch
			image16.src = linkPrefix + "images/h6.png"; //hatch
		}
		
		if($(this).text() ==="Picasso Self-Portrait")
		{
			initParameters();
			
			//Buddha
			alphaR = 1;
			image1.src = linkPrefix + "images/1/dark1.jpeg";//dark
			image2.src = linkPrefix + "images/1/light1.jpeg";//bright
			image3.src = linkPrefix + "images/white.png"; //shape map
			image4.src = linkPrefix + "images/dark.png";  //reflection
			image5.src = linkPrefix + "images/dark.jpg";  //refraction	
			image6.src = linkPrefix + "images/white.png"; //alpha
			image7.src = linkPrefix + "images/1/height1.jpg"; //height field
			image8.src = linkPrefix + "images/envl.png"; // Env light
			//image9.src = linkPrefix + "images/white.png"; //alpha
			image10.src = linkPrefix + "images/noiseIM.png";
			image11.src = linkPrefix + "images/h1.png"; //hatch
			image12.src = linkPrefix + "images/h2.png"; //hatch
			image13.src = linkPrefix + "images/h3.png"; //hatch
			image14.src = linkPrefix + "images/h4.png"; //hatch
			image15.src = linkPrefix + "images/h5.png"; //hatch
			image16.src = linkPrefix + "images/h6.png"; //hatch
		}
		
		if($(this).text() ==="Picasso Dora Maar")
		{
			initParameters();
			
			//Buddha
			alphaR = 1;
			image1.src = linkPrefix + "images/2/dark2.jpg";//dark
			image2.src = linkPrefix + "images/2/light2.jpg";//bright
			image3.src = linkPrefix + "images/white.png"; //shape map
			image4.src = linkPrefix + "images/dark.png";  //reflection
			image5.src = linkPrefix + "images/dark.jpg";  //refraction	
			image6.src = linkPrefix + "images/white.png"; //alpha
			image7.src = linkPrefix + "images/2/height2.jpg"; //height field
			image8.src = linkPrefix + "images/envl.png"; // Env light
			//image9.src = linkPrefix + "images/white.png"; //alpha
			image10.src = linkPrefix + "images/noiseIM.png";
			image11.src = linkPrefix + "images/h1.png"; //hatch
			image12.src = linkPrefix + "images/h2.png"; //hatch
			image13.src = linkPrefix + "images/h3.png"; //hatch
			image14.src = linkPrefix + "images/h4.png"; //hatch
			image15.src = linkPrefix + "images/h5.png"; //hatch
			image16.src = linkPrefix + "images/h6.png"; //hatch
		}
		
		if($(this).text() ==="Modigliani")
		{
			initParameters();
			
			//Buddha
			alphaR = 1;
			image1.src = linkPrefix + "images/3/dark3.jpeg";//dark
			image2.src = linkPrefix + "images/3/light3.jpeg";//bright
			image3.src = linkPrefix + "images/white.png"; //shape map
			image4.src = linkPrefix + "images/dark.png";  //reflection
			image5.src = linkPrefix + "images/dark.jpg";  //refraction	
			image6.src = linkPrefix + "images/white.png"; //alpha
			image7.src = linkPrefix + "images/3/height3-c.jpg"; //height field
			image8.src = linkPrefix + "images/envl.png"; // Env light
			//image9.src = linkPrefix + "images/white.png"; //alpha
			image10.src = linkPrefix + "images/noiseIM.png";
			image11.src = linkPrefix + "images/h1.png"; //hatch
			image12.src = linkPrefix + "images/h2.png"; //hatch
			image13.src = linkPrefix + "images/h3.png"; //hatch
			image14.src = linkPrefix + "images/h4.png"; //hatch
			image15.src = linkPrefix + "images/h5.png"; //hatch
			image16.src = linkPrefix + "images/h6.png"; //hatch
		}
		
		if($(this).text() ==="Picasso Self-Portrait Soft")
		{
			initParameters();
			
			//Buddha
			alphaR = 1;
			image1.src = linkPrefix + "images/1/dark1.jpeg";//dark
			image2.src = linkPrefix + "images/1/light1.jpeg";//bright
			image3.src = linkPrefix + "images/white.png"; //shape map
			image4.src = linkPrefix + "images/dark.png";  //reflection
			image5.src = linkPrefix + "images/dark.jpg";  //refraction	
			image6.src = linkPrefix + "images/white.png"; //alpha
			image7.src = linkPrefix + "images/1/softheight1.jpg"; //height field
			image8.src = linkPrefix + "images/envl.png"; // Env light
			//image9.src = linkPrefix + "images/white.png"; //alpha
			image10.src = linkPrefix + "images/noiseIM.png";
			image11.src = linkPrefix + "images/h1.png"; //hatch
			image12.src = linkPrefix + "images/h2.png"; //hatch
			image13.src = linkPrefix + "images/h3.png"; //hatch
			image14.src = linkPrefix + "images/h4.png"; //hatch
			image15.src = linkPrefix + "images/h5.png"; //hatch
			image16.src = linkPrefix + "images/h6.png"; //hatch
		}
		
		if($(this).text() ==="Picasso Dora Maar Soft")
		{
			initParameters();
			
			//Buddha
			alphaR = 1;
			image1.src = linkPrefix + "images/2/dark2.jpg";//dark
			image2.src = linkPrefix + "images/2/light2.jpg";//bright
			image3.src = linkPrefix + "images/white.png"; //shape map
			image4.src = linkPrefix + "images/dark.png";  //reflection
			image5.src = linkPrefix + "images/dark.jpg";  //refraction	
			image6.src = linkPrefix + "images/white.png"; //alpha
			image7.src = linkPrefix + "images/2/softheight2.jpg"; //height field
			image8.src = linkPrefix + "images/envl.png"; // Env light
			//image9.src = linkPrefix + "images/white.png"; //alpha
			image10.src = linkPrefix + "images/noiseIM.png";
			image11.src = linkPrefix + "images/h1.png"; //hatch
			image12.src = linkPrefix + "images/h2.png"; //hatch
			image13.src = linkPrefix + "images/h3.png"; //hatch
			image14.src = linkPrefix + "images/h4.png"; //hatch
			image15.src = linkPrefix + "images/h5.png"; //hatch
			image16.src = linkPrefix + "images/h6.png"; //hatch
		}
		
		if($(this).text() ==="Modigliani Soft")
		{
			initParameters();
			
			//Buddha
			alphaR = 1;
			image1.src = linkPrefix + "images/3/dark3.jpeg";//dark
			image2.src = linkPrefix + "images/3/light3.jpeg";//bright
			image3.src = linkPrefix + "images/white.png"; //shape map
			image4.src = linkPrefix + "images/dark.png";  //reflection
			image5.src = linkPrefix + "images/dark.jpg";  //refraction	
			image6.src = linkPrefix + "images/white.png"; //alpha
			image7.src = linkPrefix + "images/3/softheight3.jpg"; //height field
			image8.src = linkPrefix + "images/envl.png"; // Env light
			//image9.src = linkPrefix + "images/white.png"; //alpha
			image10.src = linkPrefix + "images/noiseIM.png";
			image11.src = linkPrefix + "images/h1.png"; //hatch
			image12.src = linkPrefix + "images/h2.png"; //hatch
			image13.src = linkPrefix + "images/h3.png"; //hatch
			image14.src = linkPrefix + "images/h4.png"; //hatch
			image15.src = linkPrefix + "images/h5.png"; //hatch
			image16.src = linkPrefix + "images/h6.png"; //hatch
		}
		
		$("#container1image").empty().append(image1);
		$("#container2image").empty().append(image2);
		$("#container3image").empty().append(image3);
		$("#container4image").empty().append(image4);
		$("#container5image").empty().append(image5);
		$("#container6image").empty().append(image6);
		$("#container7image").empty().append(image7);
		$("#container8image").empty().append(image8);
		//$("#container9image").empty().append(image9);
		$("#container10image").empty().append(image10);
		$("#container11image").empty().append(image11);
		$("#container12image").empty().append(image12);
		$("#container13image").empty().append(image13);
		$("#container14image").empty().append(image14);
		$("#container15image").empty().append(image15);
		$("#container16image").empty().append(image16);

		


    	//set thumb image size
		setThumbImgSize(image3);

		//update gl-canvas width and height
		updateCanvasSizeandStyle(image7);

		normalImage.src = linkPrefix + image3.src;
    	lightImage.src = linkPrefix + image2.src;
    	darkImage.src = linkPrefix + image1.src;
    	refractImage.src = linkPrefix + image5.src;
    	reflectImage.src = linkPrefix + image4.src;
    	alphaImage.src = linkPrefix + image6.src;
		heightFieldImage.src = linkPrefix + image7.src;
		envLightImage.src = linkPrefix + image8.src;
		//maskImage.src = linkPrefix + image9.src;
		noiseImage.src = linkPrefix + image10.src;
		h1Image.src = linkPrefix + image11.src;
		h2Image.src = linkPrefix + image12.src;
		h3Image.src = linkPrefix + image13.src;
		h4Image.src = linkPrefix + image14.src;
		h5Image.src = linkPrefix + image15.src;
		h6Image.src = linkPrefix + image16.src;
		
    	
    	
    });

}

var Bottlebtn = $('#btn_Bottle');
        Bottlebtn.click(function() {
		
			initParameters();
			
			//newBottle
			alphaR = 0;
			FGshiftX = -0.11;
			FGshiftY = -0.0;
			FGscaleX = 0.6;
			FGscaleY = 0.67;
			FGdis = 0.22;
			mouseXY[0] = [0.34, -0.0746];
			fresnelB = 0.3;
			fresnelC = 0.53;
			logIOR = 0.27;
			image1.src = linkPrefix + "images/newBottle/diffuse.png"; //dark
			image2.src = linkPrefix + "images/newBottle/diffuse_bright.png"; //bright
			image3.src = linkPrefix + "images/newBottle/shape.png"; //shape map
			image4.src = linkPrefix + "images/newBottle/reflect.jpg";  //reflection
			image5.src = linkPrefix + "images/newBottle/bg.png";//refraction
			image6.src = linkPrefix + "images/newBottle/alpha.png";
		
			$("#container1image").empty().append(image1);
			$("#container2image").empty().append(image2);
			$("#container3image").empty().append(image3);
			$("#container4image").empty().append(image4);
			$("#container5image").empty().append(image5);
			$("#container6image").empty().append(image6);
			$("#container7image").empty().append(image7);
			$("#container8image").empty().append(image8);
			//$("#container9image").empty().append(image9);
			

		


			//set thumb image size
				setThumbImgSize(image3);

				//update gl-canvas width and height
				updateCanvasSizeandStyle(image7);

				normalImage.src = linkPrefix + image3.src;
			lightImage.src = linkPrefix + image2.src;
			darkImage.src = linkPrefix + image1.src;
			refractImage.src = linkPrefix + image5.src;
			reflectImage.src = linkPrefix + image4.src;
			alphaImage.src = linkPrefix + image6.src;
				heightFieldImage.src = linkPrefix + image7.src;
				envLightImage.src = linkPrefix + image8.src;
				//maskImage.src = linkPrefix + image9.src;
		
		
            
    });



UPLOADinit = function()
{
	/******************* Initial Maps *********************/

	image1 = new Image();
	image2 = new Image();
	image3 = new Image();
	image4 = new Image();
	image5 = new Image();	
	image6 = new Image();	
	image7 = new Image();
	image8 = new Image();
	//image9 = new Image();
	image10 = new Image();
	image11 = new Image();
	image12 = new Image();
	image13 = new Image();
	image14 = new Image();
	image15 = new Image();
	image16 = new Image();
	

	initParameters();

	//Sphere for fresnel
	alphaR = 1;
	reflMap = 1;
	fresnelB = 0.36;
	fresnelC = 0.73;
	image1.src = linkPrefix + "images/skull/dark.png"//dark
	image2.src = linkPrefix + "images/skull/light.png"//bright
	image3.src = linkPrefix + "images/white.png"; //shape map
	image4.src = linkPrefix + "images/dark.png";  //reflection
	image5.src = linkPrefix + "images/dark.jpg";  //refraction	
	image6.src = linkPrefix + "images/skull/alphanre.png"; //alpha
	image7.src = linkPrefix + "images/hts/skull.png"; //height field
	image8.src = linkPrefix + "images/envl.png"; // Env light
	//image9.src = linkPrefix + "images/dark.jpg";  //refraction
	image11.src = linkPrefix + "images/h1.png"; //hatch
	image12.src = linkPrefix + "images/h2.png"; //hatch
	image13.src = linkPrefix + "images/h3.png"; //hatch
	image14.src = linkPrefix + "images/h4.png"; //hatch
	image15.src = linkPrefix + "images/h5.png"; //hatch
	image16.src = linkPrefix + "images/h6.png"; //hatch


	


	

	//sphere for test
	// image1.src = linkPrefix + "images/dark.png"//dark
	// image2.src = linkPrefix + "images/white.png"//bright
	// image3.src = linkPrefix + "images/sphere.png";  //shape
	// image4.src = linkPrefix + "images/trees.png";  //reflection
	// //image4.src = linkPrefix + "images/bg_artMuseum.jpg";  //reflection
	// //image4.src = linkPrefix + "images/reflect_window2.png";//reflection
	// image6.src = linkPrefix + "images/white.png"; //alpha

	// image5.src = linkPrefix + "images/checker.jpg";//refraction
	// image5.src = linkPrefix + "images/light.png";  //refraction


	

	//Holmer with bubble
	// image3.src = linkPrefix + "images/Holmer/Holmer_new_shape.png"; //shape map
	// image1.src = linkPrefix + "images/Holmer/Holmer_new_dark.png"; //dark
	// image2.src = linkPrefix + "images/Holmer/Holmer_new_bright.png"; //bright
	// image4.src = linkPrefix + "images/reflect_window2.png";//reflection
	// image5.src = linkPrefix + "images/checker.jpg";  //refraction
	// image6.src = linkPrefix + "images/Holmer/Holmer_new_alphaControl.png";
	 

	
	
	//newBottle for Fresnel
	
			// alphaR = 0;
			// reflMap = 1;
			// logIOR = 0.1;
			// mouseXY[0] = [0.32, -0.06];
			// fresnelB = 0.36;
			// fresnelC = 0.73;
			// FGshiftX = 0.1;
			// FGshiftY = -0.05;
			// FGscaleX = 0.92;
			// FGscaleY = 0.67;
			// FGdis = 0.27;
			// image1.src = linkPrefix + "images/dark.png"//dark
			// image2.src = linkPrefix + "images/white.png"//bright
			// //image3.src = linkPrefix + "images/sphere.png";  //shape
			// image4.src = linkPrefix + "images/indoor.jpg";  //reflection
			// image6.src = linkPrefix + "images/white.png"; //alpha
			// image5.src = linkPrefix + "images/checker2.png";  //refraction	
			// image3.src = linkPrefix + "images/newBottleForFresnel.png"; //shape map

	


	

	//for fresnel test - newBottle
	// image1.src = linkPrefix + "images/dark.png"; //dark
	// image2.src = linkPrefix + "images/light.png"; //bright
	// image3.src = linkPrefix + "images/newBottleForFresnel.png"; //shape map
	// image4.src = linkPrefix + "images/white.png";  //reflection
	// image6.src = linkPrefix + "images/white.png"; //alpha
	// image5.src = linkPrefix + "images/checker2.png";//refraction
	

	

	

	



	


	//poly_girl
	// image1.src = linkPrefix + "images/dark.png"; //dark
	// image2.src = linkPrefix + "images/white.png"; //bright
	// image3.src = linkPrefix + "images/polyGirl/original.jpg"; //shape map
	// image4.src = linkPrefix + "images/dark.png";  //reflection
	// image5.src = linkPrefix + "images/dark.png";  //refraction	
	// image6.src = linkPrefix + "images/white.png"; //alpha


	
	
	























	//for fresnel test - cylinder
	// alphaR = 0;
	// logIOR = 1;
	// image1.src = linkPrefix + "images/dark.png"; //dark
	// image2.src = linkPrefix + "images/light.png"; //bright
	// image3.src = linkPrefix + "images/cylinder.png"; //shape map
	// image4.src = linkPrefix + "images/trees.png";  //reflection
	// image6.src = linkPrefix + "images/white.png"; //alpha
	
	// image5.src = linkPrefix + "images/dark.png";  //refraction	




	//eye
	// image1.src = linkPrefix + "images/Eye/eye_dark.jpg"; //dark
	// image2.src = linkPrefix + "images/Eye/eye_bright.jpg"; //bright
	
	// image3.src = linkPrefix + "images/Eye/eye_shape_smooth.png"; //shape map
	// image4.src = linkPrefix + "images/Eye/eye_foreground.png";  //reflection
	// image5.src = linkPrefix + "images/checker.jpg";//refraction
	// image6.src = linkPrefix + "images/eye/eye_alpha.jpg";
	




	// image1.src = linkPrefix + "images/dark.png"; //dark
	// image2.src = linkPrefix + "images/light.png"; //bright
	// image3.src = linkPrefix + "images/bottle/shape.png"; //shape map
	// //image4.src = linkPrefix + "images/stripe_s.jpg";  //reflection
	// image4.src = linkPrefix + "images/reflect_red.png";  //reflection
	
	// image5.src = linkPrefix + "images/checker.jpg";//refraction
	// image6.src = linkPrefix + "images/white.png";

	//image2.src = linkPrefix + "images/light.png"; //bright
	
	

	//image1.src = linkPrefix + "images/dark_(alpha50).png"; //dark
	//image2.src = linkPrefix + "images/light_(alpha50).png"; //bright
	


	//image3.src = linkPrefix + "images/normal.png"; //shape map
	

	

	
	
	
	//for responsive display
	// image1.src = linkPrefix + "images/solid.png";
	// image2.src = linkPrefix + "images/solid.png";
	// image3.src = linkPrefix + "images/solid.png";
	// image4.src = linkPrefix + "images/solid.png";
	// image5.src = linkPrefix + "images/solid.png";
	// image6.src = linkPrefix + "images/solid.png";
	
	

	//image1.src = linkPrefix + "images/Holmer/Holmer_dark.png"; //dark
	//image2.src = linkPrefix + "images/Holmer/Holmer_bright.png"; //bright
	//image3.src = linkPrefix + "images/Holmer/Holmer_shape.png"; //shape map
	

	//image4.src = linkPrefix + "images/reflect_red.png";//reflection
	//image4.src = linkPrefix + "images/dark.png";
	
	//image5.src = linkPrefix + "images/dark.png";  //refraction
	//image5.src = linkPrefix + "images/white.png";

	
	

	//image1.src = linkPrefix + "images/bottle/dark.png"//dark
	//image2.src = linkPrefix + "images/bottle/bright.png"//bright
	//image3.src = linkPrefix + "images/bottle/shape.png"
	//image5.src = linkPrefix + "images/bottle/bg.png"
	//image6.src = linkPrefix + "images/eye/eye_alpha.jpg";
	


		
	//image6.src = linkPrefix + "images/Holmer/Holmer_alphaControl.jpg";  //refraction
		

	//load default images in thumb
	
	initDefaultThumbImgSize(image1);
	initDefaultThumbImgSize(image2);
	initDefaultThumbImgSize(image3);
	initDefaultThumbImgSize(image4);
	initDefaultThumbImgSize(image5);
	initDefaultThumbImgSize(image6);
	initDefaultThumbImgSize(image7);
	initDefaultThumbImgSize(image8);
	//initDefaultThumbImgSize(image9);
	initDefaultThumbImgSize(image10);
	initDefaultThumbImgSize(image11);
	initDefaultThumbImgSize(image12);
	initDefaultThumbImgSize(image13);
	initDefaultThumbImgSize(image14);
	initDefaultThumbImgSize(image15);
	initDefaultThumbImgSize(image16);
	

	initDefaultCanvasSize(image7);//canvas size based on Normal map
	
	$("#container1image").append(image1);
	$("#container2image").append(image2);
	$("#container3image").append(image3);
	$("#container4image").append(image4);
	$("#container5image").append(image5);
	$("#container6image").append(image6);
	$("#container7image").append(image7);
	$("#container8image").append(image8);
	//$("#container9image").append(image9);
	$("#container10image").append(image10);
	$("#container11image").append(image11);
	$("#container12image").append(image12);
	$("#container13image").append(image13);
	$("#container14image").append(image14);
	$("#container15image").append(image15);
	$("#container16image").append(image16);
		

	//key function
	addEventListeners();
}

function initDefaultThumbImgSize(_image){
	_image.addEventListener('load', function() {
		//set thumb image size
		setThumbImgSize(_image);
	});
	
}

function initDefaultCanvasSize(_image){
	_image.addEventListener('load', function() {
		//update gl-canvas width and height
		updateCanvasSizeandStyle(_image);
	});
	
}

function addEventListeners()
{
	// container1 DnD event
	var container1 = $container1[0];
	container1.addEventListener('dragover', cancel, false);
	container1.addEventListener('dragenter', cancel, false);
	container1.addEventListener('dragexit', cancel, false);
	container1.addEventListener('drop', dropFile, false);

	var container2 = $container2[0];
	container2.addEventListener('dragover', cancel, false);
	container2.addEventListener('dragenter', cancel, false);
	container2.addEventListener('dragexit', cancel, false);
	container2.addEventListener('drop', dropFile, false);
	
	var container3 = $container3[0];
	container3.addEventListener('dragover', cancel, false);
	container3.addEventListener('dragenter', cancel, false);
	container3.addEventListener('dragexit', cancel, false);
	container3.addEventListener('drop', dropFile, false);

	var container4 = $container4[0];
	container4.addEventListener('dragover', cancel, false);
	container4.addEventListener('dragenter', cancel, false);
	container4.addEventListener('dragexit', cancel, false);
	container4.addEventListener('drop', dropFile, false);

	var container5 = $container5[0];
	container5.addEventListener('dragover', cancel, false);
	container5.addEventListener('dragenter', cancel, false);
	container5.addEventListener('dragexit', cancel, false);
	container5.addEventListener('drop', dropFile, false);

	var container6 = $container6[0];
	container6.addEventListener('dragover', cancel, false);
	container6.addEventListener('dragenter', cancel, false);
	container6.addEventListener('dragexit', cancel, false);
	container6.addEventListener('drop', dropFile, false);

	var container7 = $container7[0];
	container7.addEventListener('dragover', cancel, false);
	container7.addEventListener('dragenter', cancel, false);
	container7.addEventListener('dragexit', cancel, false);
	container7.addEventListener('drop', dropFile, false);

	var container8 = $container8[0];
	container8.addEventListener('dragover', cancel, false);
	container8.addEventListener('dragenter', cancel, false);
	container8.addEventListener('dragexit', cancel, false);
	container8.addEventListener('drop', dropFile, false);
	
	/*var container9 = $container9[0];
	container9.addEventListener('dragover', cancel, false);
	container9.addEventListener('dragenter', cancel, false);
	container9.addEventListener('dragexit', cancel, false);
	container9.addEventListener('drop', dropFile, false);*/
	
	var container10 = $container10[0];
	container10.addEventListener('dragover', cancel, false);
	container10.addEventListener('dragenter', cancel, false);
	container10.addEventListener('dragexit', cancel, false);
	container10.addEventListener('drop', dropFile, false);
	
	var container11 = $container11[0];
	container11.addEventListener('dragover', cancel, false);
	container11.addEventListener('dragenter', cancel, false);
	container11.addEventListener('dragexit', cancel, false);
	container11.addEventListener('drop', dropFile, false);
	
	var container12 = $container12[0];
	container12.addEventListener('dragover', cancel, false);
	container12.addEventListener('dragenter', cancel, false);
	container12.addEventListener('dragexit', cancel, false);
	container12.addEventListener('drop', dropFile, false);
	
	var container13 = $container13[0];
	container13.addEventListener('dragover', cancel, false);
	container13.addEventListener('dragenter', cancel, false);
	container13.addEventListener('dragexit', cancel, false);
	container13.addEventListener('drop', dropFile, false);
	
	var container14 = $container14[0];
	container14.addEventListener('dragover', cancel, false);
	container14.addEventListener('dragenter', cancel, false);
	container14.addEventListener('dragexit', cancel, false);
	container14.addEventListener('drop', dropFile, false);
	
	var container15 = $container15[0];
	container15.addEventListener('dragover', cancel, false);
	container15.addEventListener('dragenter', cancel, false);
	container15.addEventListener('dragexit', cancel, false);
	container15.addEventListener('drop', dropFile, false);
	
	var container16 = $container16[0];
	container16.addEventListener('dragover', cancel, false);
	container16.addEventListener('dragenter', cancel, false);
	container16.addEventListener('dragexit', cancel, false);
	container16.addEventListener('drop', dropFile, false);
	
	
}


/*
 * Handles when a file is dropped by
 * the user onto the container1
 */
function dropFile(event)
{
	var eventCaller = event.target.parentNode.parentNode.id;
		//from ".btn-file input" to ".btn-file" to "imgThumb_container", result is "#container1 2 3 4 5"
	//alert(event);

	// stop the browser doing
	// it's normal thing of going
	// to the item
	event.stopPropagation();
	event.preventDefault();
	
	// query what was dropped
	var files = event.dataTransfer.files;
	
	// if we have something
	if(files.length) {
		handleDropFile(files[0], eventCaller);
	}
	
	return false;
}

/**
 * Handles the uploaded file (drop file and selected file)
 */
function handleDropFile(file, eventCaller)
{
	var fileReader 			= new FileReader();
	//fileReader.onloadend	= fileUploaded;
	fileReader.onloadend = function(event) {
		if(event.target.result.match(/^data:image/))
		{
			return fileUploaded.call(this, event, eventCaller);
		}else{
			// time to whinge
			alert("Umm, images only? ... Yeah");
		}
	}
	fileReader.readAsDataURL(file);
}

/************* Selected file to upload (not drag and drop) -start**************/
//load selected file to container
function handleSelectedFile(fileSelected, container)
{
	var fileToLoad = fileSelected[0];
     if (fileToLoad.type.match("image.*"))
     {
         var fileReader = new FileReader();
         fileReader.onload = function(event) 
         {
             return fileUploaded.call(this, event, container);
         };
     }else{
		alert("Umm, images only? ... Yeah");
	}
	fileReader.readAsDataURL(fileToLoad);
}
/************* Selected file to upload (not drag and drop) - end **************/


/**
 * File upload handled
 */
function fileUploaded(event, elemName)
{
	var image;
	var $container = $('#' + elemName);
	
	// check it's an image
	
	$container.addClass('live');
	
	if(elemName === "container1")
	{
		image1 = new Image();
		image1.src 	= event.target.result;
		image = image1;

		//set thumb image size
		setThumbImgSize(image1);
		
		// Update WebGL texture.
		darkImage.src = image1.src;
	}
	else if(elemName === "container2")
	{
		image2 = new Image();
		image2.src 	= event.target.result;
		image = image2;
		
		//set thumb image size
		setThumbImgSize(image2);

		// Update WebGL texture.
		lightImage.src = image2.src;
	}
	else if(elemName === "container3")
	{
		image3 = new Image();
		image3.src 	= event.target.result;
		image = image3;

		//set thumb image size
		setThumbImgSize(image3);
		//update gl-canvas width and height
		//updateCanvasSizeandStyle(image3);
		
		// Update WebGL texture.
		normalImage.src = image3.src;

	}
	else if(elemName === "container4")
	{
		image4 = new Image();
		image4.src 	= event.target.result;
		image = image4;

		//set thumb image size
		setThumbImgSize(image4);

		// Update WebGL texture.
		reflectImage.src = image4.src;
	}
	else if(elemName === "container5")
	{
		image5 = new Image();
		image5.src 	= event.target.result;
		image = image5;

		//set thumb image size
		setThumbImgSize(image5);

		// Update WebGL texture.
		refractImage.src = image5.src;

 
	}
	else if(elemName === "container6")
	{
		image6 = new Image();
		image6.src 	= event.target.result;
		image = image6;

		//set thumb image size
		setThumbImgSize(image6);

		// Update WebGL texture.
		alphaImage.src = image6.src;
	}
	
	else if(elemName === "container7")
	{
		image7 = new Image();
		image7.src 	= event.target.result;
		image = image7;

		//set thumb image size
		setThumbImgSize(image7);
		initDefaultCanvasSize(image7);
		// Update WebGL texture.
		heightFieldImage.src = image7.src;

	}

	else if(elemName === "container8")
	{
		image8 = new Image();
		image8.src 	= event.target.result;
		image = image8;

		//set thumb image size
		setThumbImgSize(image8);
		
		// Update WebGL texture.
		envLightImage.src = image8.src;

	}
	/*else if(elemName === "container9")
	{
		image9 = new Image();
		image9.src 	= event.target.result;
		image = image9;

		//set thumb image size
		setThumbImgSize(image9);
		
		// Update WebGL texture.
		maskImage.src = image9.src;

	}*/
	else if(elemName === "container10")
	{
		image10 = new Image();
		image10.src 	= event.target.result;
		image = image10;

		//set thumb image size
		setThumbImgSize(image10);
		
		// Update WebGL texture.
		noiseImage.src = image10.src;

	}
	else if(elemName === "container11")
	{
		image11 = new Image();
		image11.src 	= event.target.result;
		image = image11;

		//set thumb image size
		setThumbImgSize(image11);
		
		// Update WebGL texture.
		h1Image.src = image11.src;

	}
	else if(elemName === "container12")
	{
		image12 = new Image();
		image12.src 	= event.target.result;
		image = image12;

		//set thumb image size
		setThumbImgSize(image12);
		
		// Update WebGL texture.
		h2Image.src = image12.src;

	}
	else if(elemName === "container13")
	{
		image13 = new Image();
		image13.src 	= event.target.result;
		image = image13;

		//set thumb image size
		setThumbImgSize(image13);
		
		// Update WebGL texture.
		h3Image.src = image13.src;

	}
	else if(elemName === "container14")
	{
		image14 = new Image();
		image14.src 	= event.target.result;
		image = image14;

		//set thumb image size
		setThumbImgSize(image14);
		
		// Update WebGL texture.
		h4Image.src = image14.src;

	}
	else if(elemName === "container15")
	{
		image15 = new Image();
		image15.src 	= event.target.result;
		image = image15;

		//set thumb image size
		setThumbImgSize(image15);
		
		// Update WebGL texture.
		h5Image.src = image15.src;

	}
	else if(elemName === "container16")
	{
		image16 = new Image();
		image16.src 	= event.target.result;
		image = image16;

		//set thumb image size
		setThumbImgSize(image16);
		
		// Update WebGL texture.
		h6Image.src = image16.src;

	}
	// create the image object
	imageManip(elemName, image);
}


function cancel(event)
{
	if(event.preventDefault)
		event.preventDefault();
	
	return false;
}

function imageManip(elemName, image)
{
	$('#' + elemName + 'image').empty();
	$('#' + elemName + 'image').append(image);
}

function setThumbImgSize(_image)
{
	_image.style.width = "auto";
	_image.style.height = "auto";
	
	if(_image.width>=_image.height){
		_image.style.width = "100px";
	}else{
		_image.style.height = "100px";
	}
}

function updateCanvasSizeandStyle(_image)
{
	var canvas = document.getElementById("gl-canvas");
	var canvasContainer = $('.canvas_container');
	var ratioImage = _image.width / _image.height;
	var ratioContainer = canvasContainer.width() / canvasContainer.height();
	
	var lightPostionContainer = $('#lightPosition_container');
	
	if(ratioImage>=ratioContainer){
		canvas.width = canvasContainer.width();
		canvas.height = canvas.width * _image.height / _image.width;
		canvas.style.width = "100%";
		canvas.style.height = "auto";
		$(lightPostionContainer).css("width", "100%");
		$(lightPostionContainer).css("height", "auto");
		
		
	}else{
		canvas.height = canvasContainer.height() ;
		canvas.width = canvas.height * _image.width / _image.height;
		canvas.style.height = "100%";
		canvas.style.width = "auto";
		$(lightPostionContainer).css("height", "100%");
		$(lightPostionContainer).css("width", "auto");
		
	}
	
	$(lightPostionContainer).attr("width", canvas.width) ;
	$(lightPostionContainer).attr("height", canvas.height);
	var viewbox = "0 0 " + canvas.width + " " + canvas.height;
	$(lightPostionContainer).attr("viewBox", viewbox);
	
	gl = WebGLUtils.setupWebGL( canvas );
 	gl.viewport( 0, 0, canvas.width, canvas.height );
 	gl.clearColor( 0.05, 0.05, 0.05, 1.0 );

}




/************* Selected file to upload (not drag and drop) set listener**************/
/************* and drag and drop UPLOADinit **************/


//hover image with image name label show up
$(document).on('change', '.btn-file :file', function() {
  	var input = $(this);
  	var label = input.val().replace(/\\/g, '/').replace(/.*\//, '');
 	input.trigger('fileselect', [label]);
});

$(document).ready( function() {

	UPLOADinit();
	sampleButtons();

    $('.btn-file :file').on('fileselect', function(event) {
    	var elemName = event.target.id;
    	var containerName = event.target.parentNode.parentNode.id;
		var filesSelected = document.getElementById(elemName).files;
		handleSelectedFile(filesSelected, containerName);
    });
});
