#version 300 es
precision mediump float;

uniform float uTime;
uniform vec2 uResolution;
uniform vec2 uMouse;
uniform bool uMousePressed;

uniform sampler2D uRandomTexture;
uniform sampler2D uFloorTexture;
uniform sampler2D uFloorNormal;
uniform vec3 uWallTop;
uniform vec3 uLambertian;
uniform vec3 uLightColor;
uniform float uLightIntensity;
uniform float uSamplelight;
uniform float uIndexOfRefraction;
uniform int uSamples;
uniform float uCameraPosition;
uniform float uCameraHeight;
uniform float uFieldOfView;
uniform float uFocus;


out vec4 fragmentColor;

#define PI 3.14159265359
#define TWO_PI 6.28318530718

#define REFLECT_LAMBERTIAN 1
#define REFLECT_SPECULAR 2
#define REFLECT_DIELECTRIC 3
#define REFLECT_LIGHT 4

struct SurfaceInfo {
  int reflectType;
  vec3 attenuation;
  vec3 emission;
};

struct HitInfo {
  vec3 pos;
  vec3 normal;
  SurfaceInfo surfaceInfo;
};

struct Ray {
  vec3 origin;
  vec3 dir;
};


int randomindex;
SurfaceInfo wTop, wBottom, wRight, wLeft, wBack, lambertian, specular, dielectric, light;
void initialize() {
  randomindex = int(gl_FragCoord.x * fract(sin(dot(gl_FragCoord.xy * 0.01, vec2(19.342, 54.342)) * 3244.4234)) * 256.0 * 256.0);

  wTop = SurfaceInfo(REFLECT_LAMBERTIAN, uWallTop, vec3(0.0));
  lambertian = SurfaceInfo(REFLECT_LAMBERTIAN, uLambertian, vec3(0.0));
  specular = SurfaceInfo(REFLECT_SPECULAR, vec3(0.0), vec3(0.0));
  dielectric = SurfaceInfo(REFLECT_DIELECTRIC, vec3(0.0), vec3(0.0));
  light = SurfaceInfo(REFLECT_LIGHT, vec3(0.0), uLightColor * uLightIntensity);
}

vec3 at(in Ray ray, in float t) {
  return ray.origin + t * ray.dir;
}

vec2 randompos() {
  int h = randomindex / 256;
  int w = randomindex  - h * 256;
  return vec2(float(w) / 256.0, float(h) / 256.0);
}


const uint k = 1103515245U;

vec3 hash( uvec3 x )
{
    x = ((x>>8U)^x.yzx)*k;
    x = ((x>>8U)^x.yzx)*k;
    x = ((x>>8U)^x.yzx)*k;
    
    return vec3(x)*(1.0/float(0xffffffffU));
}


vec3 random3() {
  uvec3 p = uvec3(0.0,0.0,0.0);
  p.x = uint(gl_FragCoord.x);
  p.y = uint(gl_FragCoord.y);
  p.z = uint(uTime);

  randomindex += 1;
  return texture(uRandomTexture, randompos()).xyz;
  return hash(p);
}

vec2 random2() {
  return random3().xy;
}

float random() {
  return random3().x;
}

vec3 randomCosineHemisphere() {
  float r1 = random();
  float r2 = random();
  float z = sqrt(1.0 - r2);
  float phi = TWO_PI * r1;
  float x = cos(phi) * sqrt(r2);
  float y = sin(phi) * sqrt(r2);
  return vec3(x, y, z);
}


bool rectZX(in float z1, in float x1, in float z2, in float x2, in float y,
      in float tmin, inout float tmax, in Ray ray, SurfaceInfo surfaceInfo, inout HitInfo hitInfo) {
  float t = (y - ray.origin.y) / ray.dir.y;
  vec3 p = at(ray, t);
  if (t < tmin || t > tmax || p.z < z1 || p.z > z2 || p.x < x1 || p.x > x2) return false;
  tmax = t;
  hitInfo.pos = p;
  hitInfo.normal = vec3(0.0, 1.0, 0.0);
  hitInfo.surfaceInfo = surfaceInfo;
  return true;
}


vec2 planeMap(vec3 point){
  vec3 normal = vec3(0.0, 1.0, 0.0);
  vec3 u = normalize(vec3(normal.y,-normal.x,0));
  vec3 v = cross(normal,u);
  float hu = dot(u,point);
  float hv = dot(v,point);
  return vec2(hu,hv);
}

bool rectZXfloor(in float z1, in float x1, in float z2, in float x2, in float y,
      in float tmin, inout float tmax, in Ray ray, SurfaceInfo surfaceInfo, inout HitInfo hitInfo) {
  float t = (y - ray.origin.y) / ray.dir.y;
  vec3 p = at(ray, t);
  if (t < tmin || t > tmax || p.z < z1 || p.z > z2 || p.x < x1 || p.x > x2) return false;
  tmax = t;
  hitInfo.pos = p;
  vec2 uv = planeMap(p);
  vec3 tempN = texture(uFloorNormal,uv).xyz;
  hitInfo.normal = 2.0*tempN -1.0;

  //hitInfo.normal = vec3(0.0, 1.0, 0.0);
  hitInfo.surfaceInfo = surfaceInfo;
  
  vec3 temp = texture(uFloorTexture,uv).xyz;
  hitInfo.surfaceInfo.attenuation = temp;

  return true;
}




bool sphere(in vec3 center, in float radius, in float tmin, inout float tmax,
      in Ray ray, in SurfaceInfo surfaceInfo, inout HitInfo info) {
  vec3 oc = ray.origin - center;
  float a = dot(ray.dir, ray.dir);
  float b = dot(oc, ray.dir);
  float c = dot(oc, oc) - radius * radius;
  float dis = b * b - a * c;

  if (dis < 0.0) return false;

  float t = (-b - sqrt(dis)) / a;
  if (t > tmin && t < tmax) {
    tmax = t;
    info.pos = at(ray, t);
    info.normal = normalize(info.pos - center);
    info.surfaceInfo = surfaceInfo;
    return true;
  }
  t = (-b + sqrt(dis)) / a;
  if (t > tmin && t < tmax) {
    tmax = t;
    info.pos = at(ray, t);
    info.normal = normalize(info.pos - center);
    info.surfaceInfo = surfaceInfo;
    return true;
  }

  return false;
}

bool intersect(in Ray ray, in float tmin, in float tmax, inout HitInfo info) {
  bool hit = false;

  hit = rectZXfloor(-25.0, -25.0, 25.0, 25.0, -2.0, tmin, tmax, ray, wTop, info) || hit;
  hit = rectZX(-1.0, -1.0, 1.0, 1.0,  2.0, tmin, tmax, ray, light, info) || hit;
  hit = sphere(vec3(0.0, -0.2, -3.0), 1.5, tmin, tmax, ray, dielectric, info) || hit;
  hit = sphere(vec3(0.0, -0.2,3.0), 1.5, tmin, tmax, ray, specular, info) || hit;
  hit = sphere(vec3(0.0, -0.8, 0.0), 1.0, tmin, tmax, ray, lambertian, info) || hit;
  return hit;
}

mat3 orthonormal(in vec3 z) {
  vec3 w = normalize(z);
  vec3 u = normalize(cross(w, abs(w.x) > 0.9 ? vec3(0.0, 1.0, 0.0) : vec3(1.0, 0.0, 0.0)));
  vec3 v = normalize(cross(u, w));
  return mat3(u, v, w);
}

float cosinePdfValue(in HitInfo info, in vec3 dir) {
  float c = dot(normalize(dir), info.normal);
  return c > 0.0 ? c / PI : 0.0;
}

vec3 cosinePdfDir(in HitInfo info) {
  return orthonormal(info.normal) * randomCosineHemisphere();
}

float lightPdfValue(in HitInfo info, in vec3 dir) {
  Ray ray = Ray(info.pos, dir);
  HitInfo hi;
  SurfaceInfo si;
  float t = 1000.0;
  if (rectZX(-1.0, -1.0, 1.0, 1.0,  2.0, 0.001, t, ray, si, hi)) {
    float area = 2.0 * 2.0;
    float d2 = pow(length(dir) * 2.0, 2.0);
    float cosine = abs(dot(dir, hi.normal)) / length(dir);
    return d2 / (cosine * area);
  }
  return 0.0;
}

vec3 lightPdfDir(in HitInfo info) {
  vec3 onLight = vec3(-0.3 + 0.6 * random(), 0.999, -0.3 + 0.6 * random());
  vec3 toLight = onLight - info.pos;
  float dist = dot(toLight, toLight);
  toLight = normalize(toLight);
  vec3 dir = toLight;
  return dir;
}

float mixPdfValue(in HitInfo info, in vec3 dir) {
  return (1.0 - uSamplelight) * cosinePdfValue(info, dir) + uSamplelight * lightPdfValue(info, dir);
}

vec3 mixPdfDir(in HitInfo info) {
  return random() < uSamplelight ? lightPdfDir(info) : cosinePdfDir(info);
}

float schlick(float cosine, float ref) {
  float r0 = (1.0 - ref) / (1.0 + ref);
  r0 = r0 * r0;
  return r0 + (1.0 - r0) * pow((1.0 - cosine), 5.0);
}

vec3 trace(in Ray ray) {
  vec3 c = vec3(1.0);
  for (int i = 0; i < 10; i++) {
    HitInfo info;
    if (intersect(ray, 0.0001, 1000.0, info)) {
      if (info.surfaceInfo.reflectType == REFLECT_LAMBERTIAN) {
        vec3 normal = dot(ray.dir, info.normal) < 0.0 ? info.normal : -info.normal;
        info.normal = normal;
        vec3 dir = mixPdfDir(info);
        float p = mixPdfValue(info, dir);
        if (p <= 0.0) return vec3(0.0);
        c *= p > 0.0 ? info.surfaceInfo.attenuation * dot(info.normal, dir) / (PI * p) : vec3(0.0);
        ray = Ray(info.pos, dir);
      } else if (info.surfaceInfo.reflectType == REFLECT_SPECULAR) {
        vec3 normal = dot(ray.dir, info.normal) < 0.0 ? info.normal : -info.normal;
        ray = Ray(info.pos, reflect(ray.dir, normal));
      } else if(info.surfaceInfo.reflectType == REFLECT_DIELECTRIC) {
        vec3 n;
        float eta, cosine;
        if (dot(ray.dir, info.normal) < 0.0) {
          n = info.normal;
          eta = 1.0 / uIndexOfRefraction;
          cosine = -dot(ray.dir, info.normal) / length(ray.dir);
        } else {
          n = -info.normal;
          eta = uIndexOfRefraction;
          cosine = uIndexOfRefraction * dot(ray.dir, info.normal) / length(ray.dir);
        }
        vec3 r = refract(normalize(ray.dir), n, eta);
        vec3 dir = r == vec3(0.0) || random() < schlick(cosine, uIndexOfRefraction) ? reflect(ray.dir, n) : r;
        ray = Ray(info.pos, dir);
      } else if (info.surfaceInfo.reflectType == REFLECT_LIGHT) {
        c *= dot(info.normal, ray.dir) > 0.0 ? info.surfaceInfo.emission : vec3(0.0);
        return c;
      }
    } else {
      return vec3(0.0);
    }
  }
  return vec3(0.0);
}

mat3 camera(in vec3 pos, in vec3 tar, in vec3 up) {
  vec3 cz = normalize(tar - pos);
  vec3 cx = normalize(cross(cz, normalize(up)));
  vec3 cy = normalize(cross(cx, cz));
  return mat3(cx, cy, cz);
}

Ray ray(in mat3 cam, in vec2 uv, in vec3 origin) {
  vec3 dir = cam * normalize(vec3(uv, 1.0));
  Ray ray = Ray(origin, dir);
  return ray;
}

void ray(in mat3 cam, in vec3 origin, in vec2 uv, in float vfov, in float aspect, inout vec3 rpos, inout vec3 rdir) {
  float theta = vfov * PI / 180.0;
  float h = tan(theta / 2.0);
  float w = h * aspect;
  rpos = origin;
  rdir = normalize(origin + cam * uFocus * vec3(w * uv.x, h * uv.y, 1.0) - rpos);
}

void main() {

  initialize();

  vec2 m = uMouse / uResolution.y;
  float camAngle = uCameraPosition * PI / 180.0;

  vec3 pos = vec3(10.0 * cos(camAngle), uCameraHeight, 10.0 * sin(camAngle));
  vec3 tar = vec3(0.0, 0.0, 0.0);
  mat3 cam = camera(pos, tar, vec3(0.0, 1.0, 0.0));


  vec3 c = vec3(0.0);
  for (int i = 1; i <= 1000; i++) {

    vec2 pixel = gl_FragCoord.xy + random2();
    vec2 st = (2.0 * pixel - uResolution.xy) / uResolution.xy;

    vec2 uv = gl_FragCoord.xy + random2();
    vec3 rpos, rdir;
    ray(cam, pos, st, uFieldOfView, uResolution.x / uResolution.y, rpos, rdir);
    Ray ray = ray(cam, st, pos);
    Ray nextRay;
    nextRay.origin = rpos;
    nextRay.dir = rdir;
    c += trace(nextRay);
    if (uSamples == i) break;
  }
  c /= float(uSamples < 1000 ? uSamples : 1000);

  c = pow(c, vec3(1.0 / 2.2));

  fragmentColor = vec4(c, 1.0);
}