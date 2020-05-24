export class Brick extends HTMLElement {
    constructor() {
        super();
        const shadow = this.attachShadow({mode: 'open'});
        shadow.innerHTML = this.render();
    }

    connectedCallback() {
        this.attach_handlers();
    }

    find(query) {
        return this.querySelector(query);
    }

    shadow_find(query) {
        return this.shadowRoot.querySelector(query);
    }

    attach_handlers() {
        // Attach event handlers here.
    }
}

customElements.define('bricks-brick', Brick);
