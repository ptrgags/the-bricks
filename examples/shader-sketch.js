import "../p5/ShaderQuad.js";
import { SKETCH_SIZES } from '../p5/Sketch.js';

const grid = document.querySelector("#grid");
grid.size = SKETCH_SIZES.fill_parent;
grid.set_shaders();

const FRAG_STRIPES = `
precision highp float;

varying vec2 uv;

uniform float time;

void main() {
    const vec2 WAVE_VEC = vec2(10.0, 20.0);
    float stripes = 0.5 + 0.5 * sin(dot(WAVE_VEC, uv) - 10.0 * time);
    gl_FragColor = vec4(stripes, 0.5, 0.4, 1.0);
}
`;

const foo = document.querySelector("#foo");
foo.size = SKETCH_SIZES.trading_card_tiny;
foo.set_shaders({frag: FRAG_STRIPES});
