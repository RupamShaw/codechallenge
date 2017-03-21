/**
 * Imports the Sass file, and converts it to a css string for use in the
 * web component's template.
 */
import css from 'css-loader!sass-loader!./autocomplete.scss';
const CSS = css.toString();

import HTML from 'autocomplete.html';

/**
 * @class
 * @memberof  Matrix
 * @classdesc <m-autocomplete> defines an input element that is pre-populated
 *            with fetched data, accessible from a drop down. When the user
 *            types, the drop down shows, and a value can be selected by the
 *            keyboard or mouse.
 */
class MAutocomplete extends HTMLElement {

    constructor() {
        super();
        this.attachShadow({mode: 'open'});
    }

    connectedCallback() {
        // Initialise HTML and CSS
        this.shadowRoot.innerHTML = HTML;
        const style = document.createElement('style');
        style.innerHTML = CSS;
        this.shadowRoot.prepend(style);
    }

    /**
     * Write your web component code here
     */

}

// Register the custom element for use
window.customElements.define('m-autocomplete', MAutocomplete);
