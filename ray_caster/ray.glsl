#version 300 es
        precision mediump float;
        
                                                        //============================================================================
                                                        //uniforms.
                                                        //============================================================================
        
        uniform float uTime;
        uniform vec2 uResolution;
        uniform vec2 uMouse;
        uniform bool uMousePressed;
        
        uniform float uCameraPosition;
        uniform float uCameraHeight;
        uniform float uFieldOfView;
        uniform float uFocus;
        uniform float uAperture;
        uniform vec3 uGroundColor1;
        uniform vec3 uGroundColor2;
        uniform vec3 uSkyTopColor;
        uniform vec3 uSkyBottomColor;
        uniform vec3 uLambertianColor;
        uniform vec3 uMetalColor;
        uniform float uFuzziness;
        uniform float uIndexOfRefraction;
        uniform int uSamples;
        uniform sampler2D uRandomTexture;
        uniform sampler2D uFloorTexture;
        uniform sampler2D uFloorNormal;
        uniform sampler2D uSphereEnvironment;
        uniform float uLightX;
        uniform float uLightY;
        uniform float uLightZ;
        uniform samplerCube uSkyBox;
        uniform mat4 uViewDirectionProjectionInverse;
        
        in vec4 vPosition;
        out vec4 fragmentColor;
        
                                                                #define PI 3.14159265359
                                                                #define TWO_PI 6.28318530718
        
                                                                #define NUM_OF_FACES 6
                                                                #define NUM_OF_VERTICES 8
        
                                                        //============================================================================
                                                        //Structs
                                                        //============================================================================        
        struct HitInfo {
            vec3 pos;
            vec3 normal;
            int reflectType;
            float u, v;
        };
        
        struct Light {
            vec3 position;
            vec3 direction;
            vec3 color;
            float intensity;
            vec3 uvec;
            vec3 vvec;
            int vsteps;
            int usteps;
            int samples;
        };
        
        struct Material {
            vec3 ambient;
            vec3 diffuse;
            vec3 specular;
            float shininess;
            float refractionCoeff;
            float refractionIndex;
        };
        
        struct Mesh {
            int numFaces;
            int numTriangles;
            int[NUM_OF_FACES] faceIndex;
            int[NUM_OF_VERTICES] vertIndex;
            vec3[NUM_OF_VERTICES] vertices;
            vec3[NUM_OF_FACES] normals;
            vec2[100] st;
        };
                                                        //============================================================================
                                                        //Randomness.
                                                        //============================================================================
        
        float random(float x) {
            return fract(sin(x) * 4245.324);
        }
        
        float random(vec2 x) {
            return fract(sin(dot(x, vec2(12.9898, 78.233))) * 43758.5453123);
        }
        
        vec2 random2(vec2 x) {
            return fract(sin(vec2(dot(x, vec2(12.9898, 78.233)), dot(x, vec2(19.392, 59.434)))) * 43758.5453123);
        }
        
        float randseed = 0.423;
        
        float random() {
            randseed += 0.01;
            return random(randseed);
        }
        
        int randIndex() {
        
            return int(gl_FragCoord.x * fract(sin(dot(gl_FragCoord.xy * 0.01, vec2(19.342, 54.342)) * 3244.4234)) * 256.0 * 256.0);
        }
        
        vec2 randompos() {
            int randomindex = randIndex();
            int h = randomindex / 256;
            int w = randomindex - h * 256;
            return vec2(float(w) / 256.0, float(h) / 256.0);
        }
        vec3 random3() {
            int randomindex = randIndex();
            randomindex += 1;
            return texture(uRandomTexture, randompos()).xyz;
        }
        vec2 random2() {
            return random3().xy;
        }
        float random4() {
            return random3().x;
        }
        
        vec3 random_in_unit_sphere() {
            vec3 v;
            for(int i = 0; i < 100; i++) {
                randseed += 0.01;
                float rx = random(randseed);
                randseed += 0.01;
                float ry = random(randseed);
                randseed += 0.01;
                float rz = random(randseed);
                v = vec3(rx, ry, rz) * 2.0 - 1.0;
                if(length(v) <= 1.0)
                    break;
            }
            return v;
        }
        
        vec2 random_on_unit_disk() {
            vec2 v;
            for(int i = 0; i < 100; i++) {
                randseed += 0.01;
                float rx = random(randseed);
                randseed += 0.01;
                float ry = random(randseed);
                v = vec2(rx, ry) * 2.0 - 1.0;
                if(length(v) <= 1.0)
                    break;
            }
            return v;
        }
        
        vec3 randomCosineHemisphere() {
            float r1 = random4();
            float r2 = random4();
            float z = sqrt(1.0 - r2);
            float phi = TWO_PI * r1;
            float x = cos(phi) * sqrt(r2);
            float y = sin(phi) * sqrt(r2);
            return vec3(x, y, z);
        }
        
                                                        //============================================================================
                                                        //Camera
                                                        //============================================================================
        
        mat3 camera(in vec3 pos, in vec3 tar, in vec3 up) {
            vec3 cz = normalize(tar - pos);
            vec3 cx = normalize(cross(cz, normalize(up)));
            vec3 cy = normalize(cross(cx, cz));
            return mat3(cx, cy, cz);
        }
        
        vec3 backgroundColor(in vec3 dir) {
            return mix(uSkyBottomColor, uSkyTopColor, dir.y * 0.5 + 0.5);
        }
        
                                                        //============================================================================
                                                        //Ray
                                                        //============================================================================
        
        void ray(in mat3 cam, in vec3 origin, in vec2 uv, in float vfov, in float aspect, inout vec3 rpos, inout vec3 rdir) {
            float theta = vfov * PI / 180.0;
            float h = tan(theta / 2.0);
            float w = h * aspect;
            vec3 offset = cam * vec3(random_on_unit_disk(), 0.0) * uAperture;
            rpos = origin + offset;
            rdir = normalize(origin + cam * uFocus * vec3(w * uv.x, h * uv.y, 1.0) - rpos);
        }
        
                                                        //============================================================================
                                                        //Plane
                                                        //============================================================================
        vec2 planeMap(vec3 point) {
            vec3 normal = vec3(0.0, 1.0, 0.0);
            vec3 u = normalize(vec3(normal.y, -normal.x, 0));
            vec3 v = cross(normal, u);
            float hu = dot(u, point);
            float hv = dot(v, point);
            return vec2(hu, hv);
        }
        
        bool plane(in vec3 pos, in vec3 dir, in float y, in int reflectType, in float tmin, inout float tmax, inout HitInfo info) {
            if(dir.y == 0.0)
                return false;
            float tt = (y - pos.y) / dir.y;
            if(tt > tmin && tt < tmax) {
                info.pos = pos + tt * dir;
        
                vec2 uv = planeMap(info.pos);
                vec3 tempN = texture(uFloorNormal, uv).xyz;
                info.normal = tempN;
                info.reflectType = reflectType;
                info.u = uv.x;
                info.v = uv.y;
                return true;
            }
            return false;
        }
        
        bool plane(in vec3 pos, in vec3 dir, in float y, in float tmin, in float tmax) {
            if(dir.y == 0.0)
                return false;
            float tt = (y - pos.y) / dir.y;
            if(tt > tmin && tt < tmax) {
                return true;
            }
            return false;
        }
        
        bool IntersectPlane(float A, float B, float C, float D, in int reflectType, vec3 pos, vec3 dir, in float tmin, inout float tmax, inout HitInfo info) {
            vec3 N = vec3(A, B, C);
            float NRd = dot(N, dir);
            float NRo = dot(N, pos);
            float t0 = (-D - NRo) / NRd;
            if(t0 < tmin || t0 > tmax)
                return false;
        
                                                                              // We have a hit -- output results.
            tmax = t0;
            info.pos = pos + t0 * dir;
            vec2 uv = planeMap(info.pos);
            vec3 tempN = texture(uFloorNormal, uv).xyz;
            info.normal = tempN;
            info.reflectType = reflectType;
            info.u = uv.x;
            info.v = uv.y;
            return true;
        }
        
        bool IntersectPlane(float A, float B, float C, float D, in int reflectType, vec3 pos, vec3 dir, in float tmin, in float tmax) {
            vec3 N = vec3(A, B, C);
            float NRd = dot(N, dir);
            float NRo = dot(N, pos);
            float t0 = (-D - NRo) / NRd;
            if(t0 < tmin || t0 > tmax)
                return false;
            return true;
        }
        
        bool rectZX(in float z1, in float x1, in float z2, in float x2, in float y, in float tmin, inout float tmax, vec3 pos, vec3 dir, in int reflectType, inout HitInfo hitInfo) {
            float t = (y - pos.y) / dir.y;
            vec3 p = pos + t * dir;
            if(t < tmin || t > tmax || p.z < z1 || p.z > z2 || p.x < x1 || p.x > x2)
                return false;
            tmax = t;
            vec2 uv = planeMap(hitInfo.pos);
            vec3 tempN = texture(uFloorNormal, uv).xyz;
            hitInfo.normal = tempN;
            hitInfo.pos = p;
            hitInfo.u = uv.x;
            hitInfo.v = uv.y;
            hitInfo.normal = vec3(0.0, 1.0, 0.0);
            hitInfo.reflectType = reflectType;
            return true;
        }
        
        bool rectZX(in float z1, in float x1, in float z2, in float x2, in float y, in float tmin, inout float tmax, vec3 pos, vec3 dir) {
            float t = (y - pos.y) / dir.y;
            vec3 p = pos + t * dir;
            if(t < tmin || t > tmax || p.z < z1 || p.z > z2 || p.x < x1 || p.x > x2)
                return false;
            tmax = t;
            return true;
        }
        
                                                        //============================================================================
                                                        //Sphere
                                                        //============================================================================
        
        bool sphere(in vec3 pos, in vec3 dir, in vec3 center, in float radius, in int reflectType, in float tmin, inout float tmax, inout HitInfo info) {
            vec3 oc = pos - center;
            float a = dot(dir, dir);
            float b = dot(oc, dir);
            float c = dot(oc, oc) - radius * radius;
            float dis = b * b - a * c;
        
            if(dis < 0.0)
                return false;
        
            float tt = (-b - sqrt(dis)) / a;
            if(tt > tmin && tt < tmax) {
                tmax = tt;
                info.pos = pos + tt * dir;
                info.normal = normalize(info.pos - center);
                info.reflectType = reflectType;
                return true;
            }
            tt = (-b + sqrt(dis)) / a;
            if(tt > tmin && tt < tmax) {
                tmax = tt;
                info.pos = pos + tt * dir;
                info.normal = normalize(info.pos - center);
                info.reflectType = reflectType;
                return true;
            }
        
            return false;
        }
        
        bool sphere(in vec3 pos, in vec3 dir, in vec3 center, in float radius, in float tmin, in float tmax) {
            vec3 oc = pos - center;
            float a = dot(dir, dir);
            float b = dot(oc, dir);
            float c = dot(oc, oc) - radius * radius;
            float dis = b * b - a * c;
        
            if(dis < 0.0)
                return false;
        
            float tt = (-b - sqrt(dis)) / a;
            if(tt > tmin && tt < tmax) {
        
                return true;
            }
            tt = (-b + sqrt(dis)) / a;
            if(tt > tmin && tt < tmax) {
        
                return true;
            }
        
            return false;
        }
        
        bool envSphere(in vec3 pos, in vec3 dir, in vec3 center, in float radius, in float tmin, in float tmax, out vec3 env) {
            vec3 oc = pos - center;
            float a = dot(dir, dir);
            float b = dot(oc, dir);
            float c = dot(oc, oc) - radius * radius;
            float dis = b * b - a * c;
        
            if(dis < 0.0)
                return false;
        
            float tt = (-b - sqrt(dis)) / a;
            if(tt > tmin && tt < tmax) {
                env = pos + tt * dir;
                return true;
            }
            tt = (-b + sqrt(dis)) / a;
            if(tt > tmin && tt < tmax) {
                env = pos + tt * dir;
                return true;
            }
        
            return false;
        }
        
        vec2 sphereMap(vec3 point, vec3 center, float radius) {
            float theta = atan(-(point.z - center.z), point.x - center.x);
            float u = (theta + PI) / TWO_PI;
            float phi = acos(-(point.y - center.y) / radius);
            float v = phi / PI;
        
            return vec2(u, v);
        }
        
        const float POS_RADIUS = 3.0;
        const vec3 SPHERE_POS1 = vec3(POS_RADIUS * cos(0.0), 2.0, POS_RADIUS * sin(0.0));
        const vec3 SPHERE_POS2 = vec3(POS_RADIUS * cos(TWO_PI / 3.0), 2.0, POS_RADIUS * sin(TWO_PI / 3.0));
        const vec3 SPHERE_POS3 = vec3(POS_RADIUS * cos(TWO_PI / 3.0 * 2.0), 2.0, POS_RADIUS * sin(TWO_PI / 3.0 * 2.0));
        const vec3 SPHERE_POS4 = vec3(0.0, 0.0, 0.0);
        const float SPHERE_RADIUS = 2.0;
        
                                                        //============================================================================
                                                        //Triangle
                                                        //============================================================================
        
        bool triangle(in vec3 pos, in vec3 dir, vec3 v0, vec3 v1, vec3 v2, out HitInfo info, in int reflectType) {
        
            float epsilon = 0.001;
            vec3 e1 = v1 - v0;
            vec3 e2 = v2 - v0;
            vec3 h = cross(dir, e2);
        
            float a = dot(e1, h);
        
            if(a < epsilon && a > epsilon) {
                return false;
            }
        
            float f = 1.0 / a;
            vec3 s = pos - v0;
        
            float u = f * dot(s, h);
        
            if(u < 0.0 || u > 1.0) {
                return false;
            }
        
            vec3 q = cross(s, e1);
            float v = f * dot(dir, q);
        
            if(v < 0.0 || u + v > 1.0) {
                return false;
            }
        
            float t = f * dot(e2, q);
        
            info.pos = pos + t * dir;
            info.normal = cross(e1, e2);
            info.reflectType = reflectType;
        
            if(t > epsilon) {
                return true;
            }
        
            return true;
        }
        
        bool triangle(in vec3 pos, in vec3 dir, vec3 v0, vec3 v1, vec3 v2) {
        
            float epsilon = 0.001;
            vec3 e1 = v1 - v0;
            vec3 e2 = v2 - v0;
            vec3 h = cross(dir, e2);
        
            float a = dot(e1, h);
        
            if(a < epsilon && a > epsilon) {
                return false;
            }
        
            float f = 1.0 / a;
            vec3 s = pos - v0;
        
            float u = f * dot(s, h);
        
            if(u < 0.0 || u > 1.0) {
                return false;
            }
        
            vec3 q = cross(s, e1);
            float v = f * dot(dir, q);
        
            if(v < 0.0 || u + v > 1.0) {
                return false;
            }
        
            float t = f * dot(e2, q);
        
            if(t > epsilon) {
                return true;
            }
        
            return true;
        }
        
        int numTriangles(inout Mesh mesh, out int k, out int maxVertIndex, out int[100] triangleIndex, out vec2[100] texCoordinate) {
        
            k = 0;
            maxVertIndex = 0;
        
            for(int i = 0; i < mesh.numFaces; i++) {
                mesh.numTriangles += mesh.faceIndex[i] - 2;
                for(int j = 0; j < mesh.faceIndex[i]; j++) {
                    if(mesh.vertIndex[k + j] > maxVertIndex) {
                        maxVertIndex = mesh.vertIndex[k + j];
                    }
        
                    k += mesh.faceIndex[i];
                }
            }
        
            maxVertIndex += 1;
        
            vec3[100] P;
        
            for(int i = 0; i < maxVertIndex; i++) {
                P[i] = mesh.vertices[i];
            }
        
            int l = 0;
        
            vec3[100] N;
            for(int i = 0, k = 0; i < mesh.numFaces; i++) {
                for(int j = 0; j < mesh.faceIndex[i] - 2; j++) {
                    triangleIndex[l] = mesh.vertIndex[k];
                    triangleIndex[l + 1] = mesh.vertIndex[k + j + 1];
                    triangleIndex[l + 2] = mesh.vertIndex[k + j + 2];
                    texCoordinate[l] = mesh.st[k];
                    texCoordinate[l + 1] = mesh.st[k + j + 1];
                    texCoordinate[l + 2] = mesh.st[k + j + 2];
        
                    l += 3;
                }
                k += mesh.faceIndex[i];
            }
        
            return 0;
        }

        
                                                        //============================================================================
                                                        //Intersection
                                                        //============================================================================
        bool intersect(in vec3 pos, in vec3 dir, inout HitInfo info, Light light) {
            float tmin = 0.00001;
            float tmax = 10000.0;
            bool hit = false;
            hit = sphere(pos, dir, SPHERE_POS1, SPHERE_RADIUS, 1, tmin, tmax, info) || hit;
            hit = sphere(pos, dir, SPHERE_POS2, SPHERE_RADIUS, 2, tmin, tmax, info) || hit;
            hit = sphere(pos, dir, SPHERE_POS3, SPHERE_RADIUS, 3, tmin, tmax, info) || hit;
            hit = IntersectPlane(0.0, 1.0, 0.0, 0.0, 0, pos, dir, tmin, tmax, info) || hit;
        
                                    //hit = sphere(pos,dir,light.position, SPHERE_RADIUS,1,tmin,tmax,info)||hit;
                    //hit = rectZX(-8.0, -5.0, 8.0, 5.0, 0.0, tmin, tmax, pos, dir, 0, info) || hit;
        
            vec3 v0 = vec3(-5.0, 5.0, 5.0);
            vec3 v1 = vec3(-5.0, -5.0, 5.0);
            vec3 v2 = vec3(5.0, -5.0, 5.0);
                                                    //hit = triangle(pos, dir, v0, v1, v2, info, 5) || hit;
                                                                    //hit = plane(pos, dir, -SPHERE_RADIUS, 0, tmin, tmax, info) || hit;
            return hit;
        }
        
        bool intersect(in vec3 pos, in vec3 dir, float tMax) {
            float tmin = 0.00001;
                                                                    //float tmax = 10000.0;
            bool hit = false;
            hit = sphere(pos, dir, SPHERE_POS1, SPHERE_RADIUS, tmin, tMax) || hit;
            hit = sphere(pos, dir, SPHERE_POS2, SPHERE_RADIUS, tmin, tMax) || hit;
            //hit = sphere(pos, dir, SPHERE_POS3, SPHERE_RADIUS, tmin, tMax) || hit;
            hit = IntersectPlane(0.0, 1.0, 0.0, 0.0, 0, pos, dir, tmin, tMax) || hit;
        
                    //hit = rectZX(-8.0, -5.0, 8.0, 5.0, 0.0, tmin, tMax, pos, dir) || hit;
        
            vec3 v0 = vec3(-5.0, 5.0, 5.0);
            vec3 v1 = vec3(-5.0, -5.0, 5.0);
            vec3 v2 = vec3(5.0, -5.0, 5.0);
        
                                                    //hit = triangle(pos, dir, v0, v1, v2);
        
                                                                    //hit = plane(pos, dir, -SPHERE_RADIUS, 0, tmin, tmax, info) || hit;
            return hit;
        }
        
                                                        //============================================================================
                                                        //Refraction
                                                        //============================================================================
        
        float schlick(float cosine, float ref) {
            float r0 = (1.0 - ref) / (1.0 + ref);
            r0 = r0 * r0;
            return r0 + (1.0 - r0) * pow((1.0 - cosine), 5.0);
        }
        
                                                        //============================================================================
                                                        //Lighting
                                                        //============================================================================
        
        Light light() {
        
            Light light;
            light.position = vec3(6.0, 8.0, 8.0) + vec3(uLightX, uLightY, uLightZ);
            light.color = vec3(1.0, 1.0, 0.6);
            light.intensity = 1.0;
            light.usteps = 6;
            light.vsteps = 6;
            light.uvec = light.position + vec3(0, 0, 4);
            light.vvec = light.position + vec3(0, 4, 0);
            light.samples = light.usteps * light.vsteps;
        
            return light;
        }
        
        Light fakeSphericalLight() {
            Light light;
        
            return light;
        }
        
                                //Cells are defined by u and v
        
        vec3 pointOnLight(Light light, float u, float v) {
        
            return light.position + light.uvec * (u + random4()) + light.vvec * (v + random());
        
        }
        
        bool pointInShadow(vec3 lightPoint, HitInfo info) {
        
            vec3 shadowRayOrigin = info.pos;
            vec3 shadowRayDirection = normalize(lightPoint - info.pos);
            float dist = length(lightPoint - info.pos);
            if(intersect(shadowRayOrigin, shadowRayDirection, dist)) {
                return true;
            } else {
                return false;
            }
        
            return true;
        }
        
        float intensityAt(Light light, HitInfo info, out bool shadow, vec3 pos, Material material, out vec3 color) {
            float total = 0.0;
            shadow = false;
            vec3 sum = vec3(0.0);
            for(int v = 0; v < light.vsteps; v++) {
                for(int u = 0; u < light.usteps; u++) {
        
                    vec3 lightPosition = pointOnLight(light, float(u), float(v));
        
                    vec3 L = normalize(lightPosition - info.pos);
                    vec3 N = normalize(info.normal);
                    vec3 V = normalize(pos - info.pos);
        
                    vec3 R = reflect(-L, N);
                    float NdotL = max(dot(N, L), 0.0);
                    float RdotV = max(dot(R, V), 0.0);
                    float RfotVpown = (RdotV == 0.0) ? 0.0 : pow(RdotV, material.shininess);
        
                    sum = sum + NdotL * material.diffuse;
                    sum = sum + RfotVpown * material.specular;
        
                    if(!pointInShadow(lightPosition, info)) {
                        total = total + 1.0;
                        shadow = true;
                    }
                }
            }
        
            color = (material.ambient + (sum / float(light.samples)) * light.intensity)*light.color;
            return total / float(light.samples);
        }
        
        vec3 phongShading(vec3 N, vec3 L, vec3 V, Light light, Material material, HitInfo info, bool shadow) {
        
                    // if(shadow) {
                    //     return material.ambient ;
                    // }
            vec3 R = reflect(-L, N);
            float NdotL = max(dot(N, L), 0.0);
            float RdotV = max(dot(R, V), 0.0);
            float RfotVpown = (RdotV == 0.0) ? 0.0 : pow(RdotV, material.shininess);
        
            return (material.ambient + NdotL * material.diffuse + RfotVpown * material.specular) * light.color;
        }
        
                                                        //============================================================================
                                                        //Materials
                                                        //============================================================================
        Material plane(vec3 diffuse) {
            Material plane;
            plane.diffuse = diffuse;
            plane.ambient = 0.1 * diffuse;
            plane.specular = 3.0 * diffuse;
            plane.shininess = 64.0;
        
            return plane;
        }
        
        Material sphere(vec3 diffuse) {
            Material sphere;
        
            sphere.diffuse = diffuse;
            sphere.ambient = 0.2 * sphere.diffuse;
            sphere.specular = 2.0 * sphere.diffuse;
            sphere.shininess = 64.0;
            return sphere;
        }
        
        Material mirror() {
            Material mirror;
            mirror.diffuse = vec3(0.5, 0.5, 0.5);
            mirror.ambient = 0.2 * mirror.diffuse;
            mirror.specular = 2.0 * mirror.specular;
            mirror.shininess = 64.0;
            return mirror;
        }
        
                                                        //============================================================================
                                                        //Ray Tracer
                                                        //============================================================================
        vec3 trace(in vec3 pos, in vec3 dir, in Light light) {
        
            HitInfo info;
            vec3 c = vec3(1.0);
        
            for(int i = 0; i < 2; i++) {
                if(intersect(pos, dir, info, light)) {
                                                                              //pos = info.pos;
                    bool shadow = false;
                    vec3 L = normalize(light.position - info.pos);
                    vec3 N = normalize(info.normal);
                    vec3 V = normalize(pos - info.pos);
                    float intense;
                    vec3 shadowRayOrigin = info.pos;
        
                    vec3 shadowRayDirection = L;
                    float dist = length(light.position - info.pos);
        
                    if(info.reflectType == 5) {
                        Material sphere = sphere(uLambertianColor);
        
                        intense = intensityAt(light, info, shadow, pos, sphere, c);
                        c = c * intense;
                    }
        
                    if(info.reflectType == 0) { // ground
        
                        vec2 uv;
                        uv.x = info.u;
                        uv.y = info.v;
                        vec3 tempC = texture(uFloorTexture, uv).xyz;
                        Material plane = plane(tempC);
        
                        intense = intensityAt(light, info, shadow, pos, plane, c);
                        c = c * intense;
                                //c = phongShading(N, L, V, light, plane, info,shadow)*intense;
                        //dir = info.normal + random_in_unit_sphere();
                        
               
        
                    } else if(info.reflectType == 1) { // lambertian
        
                                                                                //vec2 uv = sphereMap(info.pos,SPHERE_POS1,SPHERE_RADIUS);
                                                                               // vec3 tempS = texture(uSphereEnvironment, uv).xyz;
        
                        Material sphere = sphere(uLambertianColor);
                        intense = intensityAt(light, info, shadow, pos, sphere, c);
                        c = c * intense;
                                //c = phongShading(N, L, V, light, sphere, info,shadow)*intense;
        
                        //dir = info.normal + random_in_unit_sphere();
                    } else if(info.reflectType == 2) { // specular
        
                        Material mirror = mirror();
        
                        intense = intensityAt(light, info, shadow, pos, mirror, c);
                        c = c * intense;
        
                                //c = phongShading(N, L, V, light, mirror, info,shadow)*intense;
                        dir = normalize(reflect(dir, info.normal) + uFuzziness * random_in_unit_sphere());
                        if(dot(info.normal, dir) < 0.0)
                            break;
                    } else if(info.reflectType == 3) { // dielectric
                        vec3 n;
                        float eta, cosine;
                        float prob;
                        float facingRatio = dot(-normalize(dir),normalize(info.normal));
                        
                        float fresnel = 0.1 + pow(1.0-facingRatio,3.0)*0.9; 

                        
                        if(dot(dir, info.normal) < 0.0) {
                            n = info.normal;
                            eta =  1.0/uIndexOfRefraction;
                            cosine = -dot(dir, info.normal) / length(dir);
                        } else {
                           
                            n = -info.normal;
                            eta = uIndexOfRefraction;
                            cosine = uIndexOfRefraction * dot(dir, info.normal) / length(dir);
                        }
                        vec3 r = refract(normalize(dir), normalize(n), eta);
                        bool isRefracted = r.x!=0.0|| r.y!=0.0 ||r.z!=0.0;
                        if(isRefracted){
                            prob = schlick(cosine, uIndexOfRefraction);
                        }

                        if(random()<prob){
                            dir = reflect(dir, n);
                        }
                        else{
                            dir = r;
                        }
                        //dir= r;
                        //dir = r == vec3(0.0) || random() < schlick(cosine, uIndexOfRefraction) ? reflect(dir, n) : r;
                    }
                } else {
                    vec3 pp;
                    bool test = envSphere(pos, dir, SPHERE_POS4, 20.0, 0.00001, 1000.0, pp);
                    vec2 uv = sphereMap(pp, SPHERE_POS4, 20.0);
                    vec3 tempS = texture(uSphereEnvironment, uv).xyz;
                                                                            //c *= backgroundColor(dir);
                    c *= tempS;
                    break;
                }
            }
            return c;
        }
        
                                                        //============================================================================
                                                        //Main
                                                        //============================================================================
        
        void main() {
            vec2 m = uMouse / uResolution.y;
        
            randseed = random(gl_FragCoord.xy * 0.01);
        
            float camAngle = uCameraPosition * PI / 180.0;
            vec3 pos = vec3(10.0 * cos(camAngle), uCameraHeight, 10.0 * sin(camAngle));
            vec3 tar = vec3(0.0, 0.0, 0.0);
            mat3 cam = camera(pos, tar, vec3(0.0, 1.0, 0.0));
        
            vec3 c = vec3(0.0);
            const int SPP = 10;
            int sqrtSPP = int(sqrt(float(SPP)));
        
            vec3 lightPoints[SPP];
        
            for(int i = 1; i <= 5; i++) {
                Light light = light();
        
                //vec2 pixel = gl_FragCoord.xy + random2();
                vec2 pixel = gl_FragCoord.xy + random(gl_FragCoord.xy + float(i) * vec2(0.01));
                vec2 st = (2.0 * pixel - uResolution.xy) / uResolution.xy;
                vec3 rpos, rdir;
                ray(cam, pos, st, uFieldOfView, uResolution.x / uResolution.y, rpos, rdir);
        
                c += trace(rpos, rdir, light);
                if(uSamples == i)
                    break;
            }
            c /= float(uSamples < 5 ? uSamples : 5);
        
            c = pow(c, vec3(1.0 / 2.2));
        
            fragmentColor = vec4(c, 1.0);
        }