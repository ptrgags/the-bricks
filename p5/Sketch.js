export const SKETCH_SIZES = {
    fill_parent: "fill_parent",
    // My art is based on 2.5x3.5 inch trading card size.
    trading_card_tiny: [250, 350], // 100 DPI
    trading_card_small: [500, 700], // 200 DPI
    trading_card_medium: [750, 1050], // 300 DPI, minimum size suitable for printing
    trading_card_large: [1500, 2100], // 600 DPI, large enough for a wallpaper
    texture_small: [256, 256],
    texture_medium: [512, 512],
    texture_large: [1024, 1024],
}

export class Sketch {
    constructor(options) {
        this._sketch = undefined;
        this._container = options.container;
        this._margin = options.margin || 0;
        this._width = undefined;
        this._height = undefined;
        this._size = options.size || SKETCH_SIZES.trading_card_small;
    }

    get size() {
        return this._size;
    }

    set size(value) {
        this._size = value;
        if (this._sketch) {
            this._resize(this._sketch);
        }
    }

    get width() {
        return this._width;
    }

    get height() {
        return this._height;
    }

    _compute_size(sketch) {
        if (this._size !== SKETCH_SIZES.fill_parent) {
            [this._width, this._height] = this._size;
            return;
        }

        const style = getComputedStyle(this._container);
        this._width = parseFloat(style.width) - this._margin;
        this._height = parseFloat(style.height) - this._margin;
    }

    _setup(sketch) { 
        this._compute_size(sketch);
        const canvas = sketch.createCanvas(this._width, this._height, sketch.WEBGL);
        canvas.parent(this._container);
        canvas.style('visibility', 'visible');

        this.setup(sketch);
    }

    _resize(sketch) {
        this._compute_size(sketch);
        this._sketch.resizeCanvas(this._width, this._height);
    }

    setup(sketch) {
        // Implement in subclass!
    }

    draw(sketch) {
        // Implement in subclass!
    }

    attach() {
        const closure = (sketch) => {
            sketch.setup = () => this._setup(sketch);
            sketch.draw = () => this.draw(sketch);
            sketch.windowResized = () => this._resize(sketch);
        };
        this._sketch = new p5(closure);
    }
}
