// start of fragment shader
#define numSphere 2
#define maxDepth 1
precision highp float;
uniform vec3 eyePos;
varying vec3 initialRay;

uniform float textureWeight;
uniform sampler2D texture;

//light position
uniform vec3 lightPos;
uniform float lightSize;
uniform float timeSinceStart;
// record the position of the spheres
// value of infinity  means the sphere should not be shown
uniform vec4 sphereCenterRadius[numSphere];

// record the material of the sphere
// -inf for diffuse material
// -k for glass with refraction constant k (k>0)
//  0 for mirror material  
//  g for glossiness of mirror material (g = random noise magnitude added to the reflected ray)
uniform float sphereMaterial[numSphere];
//record the color of each sphere
uniform vec3 sphereColor[numSphere];
// uniform vec4 planeCenterRadius;
// uniform vec3 planeColor;
// uniform float planeMaterial[numSphere];

const float pi = 3.1415926535897932384626433836795028841971;
const float inf = 1000000000000000.0;
const float epsilon = 0.00001; 

// find the intersection index of the given ray
// t = inf means no intersection in the given direction
// 0- shpere , 1 = plane
float intersectSphere(vec3 origin, vec3 dir, vec3 center, float radius){
  // length( (origin + t * dir) - center ) = radius
  // to solve t, square both sides and solve the quadratic formula

  float a = dot(dir,dir);
  float b = 2.0 * dot(dir,origin - center);
  float c = dot(origin - center,origin - center) - radius * radius;
  float discriminate = b*b - 4.0 * a * c;
  if(discriminate < 0.0) return inf;
  float tNear = (-b - sqrt(discriminate))/ (2.0 * a);
  if(tNear > 0.0 ) return tNear;
  float tFar = (-b + sqrt(discriminate))/(2.0 * a);
  if(tFar > 0.0) return tFar;
  return inf;
}

float intersectPlane(vec3 origin,vec3 dir,vec3 center,vec3 normal){
  

  float denom = dot(normal,dir);
  if(denom> 0.00001){
    vec3 p0l0 = center - origin;
    float t = dot(p0l0,normal)/denom;
    //if(t<0.0){t=0.0;}
    return t;
  }

  return inf;
}

// find intersection with multiple objects, return hitObjIndex and t 
float intersectObjects(vec3 origin, vec3 dir, inout vec4 hitObjCenterRadius, inout float hitObjMaterial, inout vec3 hitObjColor){
  float tMin = inf;
  for(int j=0;j < numSphere;j++){
    //infinity radius means the sphere should not be drawn
    if(sphereCenterRadius[j].w >=inf)continue;

    if(j==1){
      float t = intersectSphere(origin, dir, sphereCenterRadius[j].xyz,sphereCenterRadius[j].w);
      if(t < tMin) {
        tMin = t;
        hitObjCenterRadius= sphereCenterRadius[j];
        hitObjColor = sphereColor[j]; 
        hitObjMaterial = sphereMaterial[j];
        
      }
    }else if(j==0){
      vec3 normal = vec3(0.0,-1.0,0.0);
      float t = intersectPlane(origin,dir,sphereCenterRadius[j].xyz,normal);
      if(t < tMin) {
        tMin = t;
        hitObjCenterRadius= sphereCenterRadius[j];
        hitObjColor = sphereColor[j];
        hitObjMaterial = sphereMaterial[j];
        
      }
    }

  }
  return tMin;
}

float intersectName(vec3 origin, vec3 dir){
  float a=-1.0;
  float tMin = inf;

  for(int j=0;j < numSphere;j++){
    if(sphereCenterRadius[j].w >=inf){
      return -1.0; 
    }else if(j==1){
      float t = intersectSphere(origin, dir, sphereCenterRadius[j].xyz,sphereCenterRadius[j].w); 
      if(t>= tMin){
        return -1.0;
      }else{
        return 1.0;
      } 
    }else{
      vec3 normal = vec3(0.0,-1.0,0.0);
      float t = intersectPlane(origin,dir,sphereCenterRadius[j].xyz,normal);
      if(t>=tMin){
        return -1.0;
      }else{
        return 0.0;
      }
    }
  }


  return a;
}

float intersectCheck(vec3 origin, vec3 dir){

  float tMin = inf;

  float tSphere = intersectSphere(origin, dir, sphereCenterRadius[0].xyz,sphereCenterRadius[0].w);
  vec3 normal = vec3(0.0,-1.0,0.0);
  float tPlane = intersectPlane(origin,dir,sphereCenterRadius[1].xyz,normal);

  if ((tSphere ==tMin) && (tPlane ==tMin)){
    return -1.0;
  }else{
    if(tSphere <= tPlane){
      return 1.0;
    }else{
      return 0.0;
    }
  }

}

float computeShadow( vec3 origin, vec3 dir){
  vec4 hitObjCenterRadius;
  float hitObjMaterial;
  vec3 hitObjColor;
  if(intersectObjects(origin, dir, hitObjCenterRadius, hitObjMaterial, hitObjColor) < inf)
    return 0.0;
  else
    return 1.0;
}

// float soft_shadows( vec3 origin, vec3 dir){
//   float shadow = 1.0;
//   float d = 0;
//   float t = 0;

//   for(int i=0;i<50;i++){

//   }
// }

//return new hit surface color
//bounceCount is passed for seed (to get diffrent random value perbounce)
void materialBounce( inout vec3 origin, inout vec3 dir, inout float surfaceLight, float t,vec4 centerRadius){
  vec3 hitPoint = origin + t * dir;

  vec3 lightPos_ = vec3(5.0,5.0,1.0);
  vec3 toLightDir = normalize(lightPos_ - hitPoint);
  
  vec3 surfaceNormal;

  float objName = intersectCheck(origin, dir);
  
  // this surface Normal always assume the ray in comming from outside of the sphere
  //vec3 surfaceNormal = (hitPoint - centerRadius.xyz ) / centerRadius.w;
  if(objName == 1.0){
   surfaceNormal = (hitPoint - centerRadius.xyz ) / centerRadius.w;
  }else{
    surfaceNormal = vec3(0.0,1.0,0.0);
  }
  //vec3 surfaceNormal = vec3(0.0,1.0,0.0);
  vec3 reflectDir = normalize(reflect(dir, surfaceNormal));
  
  float specular; // set this according to material
  float diffuse = max(0.0, dot(surfaceNormal , toLightDir));
  float ambient = 0.3;
  
  // compute direction_of_next_ray and specular according to material

    dir = reflectDir ;
    float specularIndex = max(0.0, dot(reflectDir , toLightDir));
    specular = 2.0 * pow(specularIndex, 20.0);

  float shadow = computeShadow(hitPoint + epsilon * surfaceNormal, toLightDir);
  surfaceLight = ambient + ( (specular + diffuse) * shadow );   //surfaceLight = ambient + ( (specular + diffuse) * shadow );
  origin = hitPoint + epsilon * surfaceNormal;
}

vec3 findBackGround(vec3 origin, vec3 dir){
  return mix(vec3(1.0,1.0,1.0),vec3(0.5,0.7,1.0),(dir.y+1.0)*0.5);
}


//find pixel color iteratively
vec3 findColor(vec3  origin,vec3 dir ){
  vec3 o = origin;
  vec3 d = dir;
  vec3 colorMask = vec3(1.0,1.0,1.0);
  vec3 accumColor = vec3(0.0,0.0,0.0);
  

  vec4 hitObjCenterRadius;
  float hitObjMaterial;
  vec3 hitObjColor;
  
  //record the nearest hit so far
  float t = intersectObjects(o, d, hitObjCenterRadius, hitObjMaterial, hitObjColor);

  
  float surfaceLight;
  if(t == inf){
    surfaceLight = 1.0;
    hitObjColor = findBackGround(o,d);
  }
  else{
    materialBounce(o, d, surfaceLight, t,hitObjCenterRadius);
  }
  colorMask = hitObjColor;
  accumColor = colorMask * surfaceLight;

  return accumColor;
}

void main(){
  
  vec3 initialRayBlur = initialRay;  //initialRay + 0.001 * randomUnitDirection(timeSinceStart)
  vec3 textureData = texture2D(texture, gl_FragCoord.xy / vec2(1000,700)).rgb;
  gl_FragColor = vec4(mix(findColor(eyePos, initialRayBlur), textureData, textureWeight), 1.0);
}
