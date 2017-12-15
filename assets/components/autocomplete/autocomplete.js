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
let nameProfile = [];
export default class MAutocomplete extends HTMLElement {

    constructor() {
        super();
        this.attachShadow({mode: 'open'});

        // Set the default prop values
        this._src = '';
    }

    // Listen for changes to the dom attributes. When one of these attrs changes
    // on the host element, it will trigger attrubuteChangedCallback
    static get observedAttributes() {
        return ['src'];
    }

    /**
     * Write your web component code here
     */
    connectedCallback() {
        // Initialise HTML and CSS
        this.shadowRoot.innerHTML = HTML;
        const style = document.createElement('style');
        style.innerHTML = CSS;
        this.shadowRoot.prepend(style);
        nameProfile = this._src;
        this.addEventListnerSearchBox();
    }
    addEventListnerSearchBox() {
        const sf = this.shadowRoot.querySelector('#divdropdownSearch').querySelector('#searchFieldBox').querySelector('#sf');
       // const dropdownlist = this.shadowRoot.querySelector('#divdropdownSearch').querySelector('#searchFieldBox').querySelector('#dropdown');

        if (sf) {
            sf.addEventListener('mousedown', () => {
                console.log('auto  in to the difference to mousedown is  texting');
                this.sfactive();
            }, false);
            sf.addEventListener('keypress', e => {
                this.sfactive();
                if (e.keyCode == '13') {
                    this.searchText();
                }
            }, false);
            sf.addEventListener('focus', () => {
                this.sfactive();
            }, false);
            sf.addEventListener('change', () => {
                this.sfactive();
            }, false);
            sf.addEventListener('blur', () => {
                this.sfinactive();
            }, false);
        }

        const divbutton = this.shadowRoot.querySelector('#divdropdownSearch').querySelector('#searchBtnSubmit');
        const button = divbutton.querySelector('#searchbtn');
        if (button) {
            button.addEventListener('focus', () => {
                this.btnactive();
            }, false);
            button.addEventListener('click', () => {
                // Const sf = this.shadowRoot.querySelector('#divdropdownSearch').querySelector('#searchFieldBox').querySelector('#sf');
                if (sf.value == 'Search for Person') {
                    sf.value = '';
                    sf.placeholder = '';
                }
                this.searchText();
                this.btnactive();
            }, false);
            button.addEventListener('blur', () => {
                this.btninactive();
            }, false);
        }
    }

    attributeChangedCallback(attr, oldV, newV) {
        switch (attr) {
            case 'src':
                this._src = newV;
                if (this._src === '')
                    console.log('waiting for dropdown to fill');
                else {
                    this.filldropdown(this._src);
                }
                break;
        }
    }


    get src() { return this._src; }

    set src(v) {
        this._src = v;
    }

    filldropdown(string) {
        const nameProfiles = [];
        const people = JSON.parse(string);
        Object.entries(people).forEach(([key, value]) => {
            const name = `${value.name.title} ${value.name.first} ${value.name.last}`;
            nameProfiles.push({[name]: value.profile});
        });
        const dropdown = this.shadowRoot.querySelector('#divdropdownSearch').querySelector('#searchFieldBox').querySelector('#dropdown');
        if (dropdown) {
            nameProfile = nameProfiles; // This  data is used for dropdown
        }
    }

    dropdownListTag(src, text, i) {
        const n = i+1;
        const divDDTag = `<div style="display:flex;background-color: #dcdcf5;border:2px #dcdcf5" id="dds${i}" tabindex="${n}" >
                                <div style="display: flex">
                                    <img src=${src} style="border-radius: 100%;padding: 7px;margin-right: 20px;margin-left: 10px;"
                                        alt="Smiley face" height="40" width="40">
                                </div>
                                <div  id='selectedtext' style="display: flex;align-items: center;justify-content: center;font-size: 16px;">${text}</div>
                        </div>`;

        return divDDTag;
    }

    searchText() {
        const sf = this.shadowRoot.querySelector('#divdropdownSearch').querySelector('#searchFieldBox').querySelector('#sf');
        const sfval = sf.value;
        const dropdownlist = this.shadowRoot.querySelector('#divdropdownSearch').querySelector('#searchFieldBox').querySelector('#dropdown');

        let tag = '';
        let countelements = 0;
        if (sfval == 'Search for Person') {
            console.log('nothing to search');
        } else {
            Object.entries(nameProfile).forEach(([key, imagewithtext]) => {
                let text;
                for (text in imagewithtext) {
                    if (imagewithtext.hasOwnProperty(text)) {
                        if (text.toLowerCase().includes(sfval.toLowerCase()) || !sfval) {
                            tag = this.dropdownListTag(imagewithtext[text], text, countelements) + tag;
                            countelements += 1;
                        }
                    }
                }
            });
        }
        dropdownlist.innerHTML = `${tag}`;

        this.addEventListnertoDropDownContents(countelements);
    }

    addEventListnertoDropDownContents(countelements) {
        const sf = this.shadowRoot.querySelector('#divdropdownSearch').querySelector('#searchFieldBox').querySelector('#sf');
        const dropdownlist = this.shadowRoot.querySelector('#divdropdownSearch')
            .querySelector('#searchFieldBox').querySelector('#dropdown');
        for (let countelement = 0; countelement < countelements; countelement++) {
            const selecteddde = dropdownlist.querySelector(`#dds${countelement}`);
            if (selecteddde) {
                selecteddde.addEventListener('click', () => {
                    this.ddtextcolorblack(countelements);
                    if (selecteddde) {
                        selecteddde.setAttribute('style', 'display:flex;background-color: #12129;color:blue;border:2px #dcdcf5;');
                        sf.value = selecteddde.textContent.trim();
                    }
                }, false);

                selecteddde.addEventListener('keydown', e => {
                    e.preventDefault();
                    if (e.keyCode == '40') {
                        let nextselecteddde;
                        if (countelement <= countelements) {
                            if (countelement !== 0) {
                                this.ddtextcolorblack(countelements);
                                nextselecteddde = dropdownlist.querySelector(`#dds${countelement-1}`);
                                if (nextselecteddde) {
                                    nextselecteddde.setAttribute('style', 'display:flex;background-color: #12129;color:blue;border:2px #dcdcf5;');
                                    sf.value = nextselecteddde.textContent.trim();
                                    countelement--;
                                }
                            }
                        }
                    }
                    if (e.keyCode == '13') {
                        let nextselecteddde;
                        if (countelement <= countelements) {
                            nextselecteddde = dropdownlist.querySelector(`#dds${countelement}`);
                            if (nextselecteddde) {
                                nextselecteddde.setAttribute('style', 'display:flex;background-color: #12129;color:blue;border:2px #dcdcf5;');
                                sf.value = nextselecteddde.textContent.trim();
                                dropdownlist.innerHTML = '';
                            }
                        }
                    }
                }, false);

                selecteddde.addEventListener('keyup', e => {
                    e.preventDefault();
                    if (e.keyCode == '38') {
                        let nextselecteddde;
                        if (countelement <= countelements) {
                            if (countelement !== countelements-1) {
                                this.ddtextcolorblack(countelements);
                                nextselecteddde = dropdownlist.querySelector(`#dds${countelement+1}`);
                                if (nextselecteddde) {
                                    nextselecteddde.setAttribute('style', 'display:flex;background-color: #12129;color:blue;border:2px #dcdcf5;');
                                    sf.value = nextselecteddde.textContent.trim();
                                    countelement++;
                                }
                            }
                        }
                    }
                }, false);
            }
        }
    }

    sfactive() {
        const sf = this.shadowRoot.querySelector('#searchFieldBox').querySelector('#sf');
        const divbutton = this.shadowRoot.querySelector('#divdropdownSearch').querySelector('#searchBtnSubmit');
        const button = divbutton.querySelector('#searchbtn');
        if (sf.value == 'Search for Person') {
            sf.value = '';
            sf.placeholder = '';
        }
        button.setAttribute('style', 'border:1px solid blue;border-left-style: 0px solid transparent;');
        sf.setAttribute('style', 'border:1px solid blue;');
    }

    sfinactive() {
        const sf = this.shadowRoot.querySelector('#searchFieldBox').querySelector('#sf');
        const divbutton = this.shadowRoot.querySelector('#divdropdownSearch').querySelector('#searchBtnSubmit');
        const button = divbutton.querySelector('#searchbtn');

        if (sf.value == '') {
            sf.value = 'Search for Person';
            sf.placeholder = '';
        }
        sf.setAttribute('style', 'border:1px solid black;');
        button.setAttribute('style', 'border:1px solid black;');
    }
    ddtextcolorblack(countelements) {
        for (let countelement = 0; countelement < countelements; countelement++) {
            const selecteddde = this.shadowRoot.querySelector('#divdropdownSearch')
                .querySelector('#searchFieldBox').querySelector('#dropdown')
                .querySelector(`#dds${countelement}`);
            if (selecteddde)
                selecteddde.setAttribute('style', 'display:flex;background-color: #dcdcf5;color:black;border:2px #dcdcf5');
        }
    }

    btnactive() {
        const sf = this.shadowRoot.querySelector('#searchFieldBox').querySelector('#sf');
        const divbutton = this.shadowRoot.querySelector('#divdropdownSearch').querySelector('#searchBtnSubmit');
        const button = divbutton.querySelector('#searchbtn');
        sf.setAttribute('style', 'border:1px solid blue;');
        button.setAttribute('style', 'border:1px solid blue;border-left-style: 0px  solid transparent ;');
    }
    btninactive() {
        const sf = this.shadowRoot.querySelector('#searchFieldBox').querySelector('#sf');
        const divbutton = this.shadowRoot.querySelector('#divdropdownSearch').querySelector('#searchBtnSubmit');
        const button = divbutton.querySelector('#searchbtn');
        sf.setAttribute('style', 'border:1px solid black;');
        button.setAttribute('style', 'border:1px  solid black;');
    }
}

// Register the custom element for use
window.customElements.define('m-autocomplete', MAutocomplete);
