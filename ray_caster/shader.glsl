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
//     float ph = sphere.kd /
//     return (sphere.color / pi) + +sphere.ks * ((sphere.n + 2.0) / (2.0 * pi)) * pow(cosAlpha, sphere.n);
// }

vec3 sphereLighting(Sphere sphere, vec3 point, vec3 normal, Light light) {
    vec3 lightPoint = light.position - point;
    return sphere.color * max(dot(normal, lightPoint), 0.0) / length(lightPoint);
}

vec3 planeLighting(Plane plane, vec3 point, vec3 normal, Light light) {
    vec3 lightPoint = light.position - point;
    return plane.color * max(dot(normal, lightPoint), 0.0) / length(lightPoint);
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {

    vec2 uv = (fragCoord.xy / iResolution.xy) / vec2(1.0, 1.6);

    //Scene

    //Sphere
    Sphere sphere;
    sphere.center = vec3(0.0, 0.5, -5.0);
    sphere.radius = 1.0;
    sphere.color = vec3(1.0, 0.0, 0.0);
    sphere.kd = 1.0;
    sphere.ks = 1.0;
    sphere.n = 50.0;

    //Plane
    Plane plane;
    plane.normal = vec3(0.0, 1.0, 0.0);
    plane.height = 3.3;
    plane.color = vec3(0.0, 1.0, 0.0);
    plane.kd = 1.0;
    plane.ks = 1.0;
    plane.n = 50.0;

    //Light
    Light light;
    light.position = vec3(1.0, 3.0, 5.0);
    light.color = vec3(1.0, 1.0, 1.0);
    light.intensity = 2.0;

    //Ray
    Ray ray;
    ray.origin = vec3(0.0, 2.0, 2.0);
    ray.direction = vec3(-1.0 + 2.0 * uv, -1.0);

    //Intersection
    float t;
    
    if(intersection_sphere(ray, sphere, t)) {
        vec3 point = ray.origin + t * ray.direction;
        vec3 normal = point - sphere.center;
        fragColor = vec4(sphereLighting(sphere, point, normal, light), 1.0);

    } else if(intersection_plane(ray, plane, t)) {
        vec3 point = ray.origin + t * ray.direction;
        fragColor = vec4(planeLighting(plane, point, plane.normal, light), 1.0);
        
        Ray nr;
        nr.origin = point;
        nr.direction = point-light.position;
        

    } else {
        fragColor = vec4(0.0, 0.0, 0.0, 1.0);
    }
}