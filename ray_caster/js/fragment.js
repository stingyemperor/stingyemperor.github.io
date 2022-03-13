const fragment =/*glsl */`
varying lowp vec4 vColor;
void main(void) {
  gl_FragColor = vColor;
}
`;
export default fragment;