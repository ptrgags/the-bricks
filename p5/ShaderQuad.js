import { Brick } from '../Brick.js';
import { Sketch } from './Sketch.js';

const DEFAULT_VERT_SHADER = `
attribute vec3 aPosition;
attribute vec2 aTexCoord;

varying vec2 uv;

void main() {
    uv = aTexCoord;
    gl_Position = vec4(aPosition, 1.0);
}
`;

const DEFAULT_FRAG_SHADER = `
precision highp float;

varying vec2 uv;

void main() {
    gl_FragColor = vec4(uv, 0.0, 1.0);
}
`;

class ShaderSketch extends Sketch {
    constructor(options) {
        super(options);
        this._shader_text = {
            vert: options.vert || DEFAULT_VERT_SHADER,
            frag: options.frag || DEFAULT_FRAG_SHADER
        };
        this._shader = undefined;
        this._alpha_enabled = options.alpha_enabled;
    }

    setup(sketch) {
        super.setup();
        const {vert, frag} = this._shader_text;
        this._shader = sketch.createShader(vert, frag);
    }

    update_shader(options) {
        this._shader_text = {
            ...this._shader_text,
            ...options
        };

        if (this._sketch) {
            this._shader = sketch.createShader(options.vert, options.frag);
        }
    }

    draw(sketch) {
        if (!this._shader) {
            return;
        }

        sketch.shader(this._shader);
        this._shader.setUniform('time', sketch.millis() / 1000);
        sketch.noStroke();

        // This trick forces p5.js to enable the alpha channel.
        if (this._alpha_enabled) { 
            sketch.fill(0, 0, 0, 0);
        }

        sketch.quad(
            -1, -1,
            1, -1,
            1, 1,
            -1, 1
        );
        sketch.resetShader();
    }
}

class ShaderQuad extends Brick {
    constructor() {
        super();
        this._sketch = undefined;
        this._size = undefined;
    }

    render() { 
        const style = getComputedStyle(this);
        return `
        <style>
            #canvas {
                width: 100%;
                height: 100%;
            }
        </style>

        <div id="canvas"></div>
        `;
    }

    /**
     * Set/update the shaders. The first call of this function triggers the
     * sketch initialization. Both vert/frag shaders are optional, and if not
     * specified, the previous shader will be used. If no previous shader
     * exists, a default shader will be used.
     *
     * @param {Object} options an object containing:
     * @param {String} [options.vert] GLSL vertex shader code (optional)
     * @param {String} [options.frag] GLSL fragment shader (optional)
     */
    set_shaders(options) {
        const {vert, frag} = options || {};
        if (this._sketch) {
            this._sketch.update_shader(vert, frag);
            return;
        }

        this._sketch = new ShaderSketch({
            container: this.shadow_find('#canvas'),
            vert: vert,
            frag: frag,
            size: this._size
        });
        this._sketch.attach();
    }

    set size(size) {
        this._size = size;

        if (this._sketch) {
            this._sketch.size = this._size;
        }
    }
}
customElements.define('bricks-shader-quad', ShaderQuad);
