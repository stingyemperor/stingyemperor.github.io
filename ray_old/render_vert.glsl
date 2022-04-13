attribute vec3 vertex;
varying vec2 textCoord;
attribute vec2 a_texCoord;
varying vec2 v_texCoord;

void main(){
  textCoord = (vertex.xy + 1.0) * 0.5;
  gl_Position = vec4(vertex, 1.0);
  v_texCoord = a_texCoord;
}
