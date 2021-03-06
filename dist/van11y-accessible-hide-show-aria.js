/*
 * ES2015 simple and accessible hide-show system (collapsible regions), using ARIA
 * Website: https://van11y.net/accessible-hide-show/
 * License MIT: https://github.com/nico3333fr/van11y-accessible-hide-show-aria/blob/master/LICENSE
 */
'use strict';

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

(function (doc) {

    'use strict';

    var HIDESHOW_EXPAND = 'js-expandmore';
    var HIDESHOW_BUTTON_EXPAND = 'js-expandmore-button';
    var HIDESHOW_BUTTON_EXPAND_STYLE = 'expandmore__button';
    var HIDESHOW_BUTTON_LABEL_ID = 'label_expand_';

    var DATA_PREFIX_CLASS = 'data-hideshow-prefix-class';

    var HIDESHOW_BUTTON_EMPTY_ELEMENT_SYMBOL = 'expandmore__symbol';
    var HIDESHOW_BUTTON_EMPTY_ELEMENT_TAG = 'span';
    var ATTR_HIDESHOW_BUTTON_EMPTY_ELEMENT = 'aria-hidden';

    //const HIDESHOW_TO_EXPAND = 'js-to_expand';
    var HIDESHOW_TO_EXPAND_ID = 'expand_';
    var HIDESHOW_TO_EXPAND_STYLE = 'expandmore__to_expand';

    /*
     recommended settings by a11y expert
    */
    var ATTR_CONTROL = 'data-controls';
    var ATTR_EXPANDED = 'aria-expanded';
    var ATTR_LABELLEDBY = 'data-labelledby';
    var ATTR_HIDDEN = 'data-hidden';

    var IS_OPENED_CLASS = 'is-opened';

    var DISPLAY_FIRST_LOAD = 'js-first_load';
    var DISPLAY_FIRST_LOAD_DELAY = '1500';

    var findById = function findById(id) {
        return doc.getElementById(id);
    };

    var addClass = function addClass(el, className) {
        if (el.classList) {
            el.classList.add(className); // IE 10+
        } else {
                el.className += ' ' + className; // IE 8+
            }
    };

    var removeClass = function removeClass(el, className) {
        if (el.classList) {
            el.classList.remove(className); // IE 10+
        } else {
                el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' '); // IE 8+
            }
    };

    var hasClass = function hasClass(el, className) {
        if (el.classList) {
            return el.classList.contains(className); // IE 10+
        } else {
                return new RegExp('(^| )' + className + '( |$)', 'gi').test(el.className); // IE 8+ ?
            }
    };

    var setAttributes = function setAttributes(node, attrs) {
        Object.keys(attrs).forEach(function (attribute) {
            node.setAttribute(attribute, attrs[attribute]);
        });
    };

    var triggerEvent = function triggerEvent(el, event_type) {
        if (el.fireEvent) {
            el.fireEvent('on' + event_type);
        } else {
            var evObj = document.createEvent('Events');
            evObj.initEvent(event_type, true, false);
            el.dispatchEvent(evObj);
        }
    };

    /* gets an element el, search if it is element with class or child of parent class, returns id of the element founded */
    var searchParent = function searchParent(el, parentClass) {
        var found = false;
        var parentElement = el;
        while (parentElement && found === false) {
            if (hasClass(parentElement, parentClass) === true) {
                found = true;
            } else {
                parentElement = parentElement.parentNode;
            }
        }
        if (found === true) {
            return parentElement.getAttribute('id');
        } else {
            return '';
        }
    };

    /** Find all expand inside a container
     * @param  {Node} node Default document
     * @return {Array}      
     */
    var $listHideShows = function $listHideShows() {
        var node = arguments.length <= 0 || arguments[0] === undefined ? doc : arguments[0];
        return [].slice.call(node.querySelectorAll('.' + HIDESHOW_EXPAND));
    };

    /**
     * Build expands for a container
     * @param  {Node} node 
     */
    var attach = function attach(node) {

        $listHideShows(node).forEach(function (expand_node) {
            var _setAttributes, _setAttributes2;

            var iLisible = Math.random().toString(32).slice(2, 12);
            // let prefixClassName = typeof expand_node.getAttribute(DATA_PREFIX_CLASS) !== 'undefined' ? expand_node.getAttribute(DATA_PREFIX_CLASS) + '-' : '' ; // IE11+
            var prefixClassName = expand_node.hasAttribute(DATA_PREFIX_CLASS) === true ? expand_node.getAttribute(DATA_PREFIX_CLASS) + '-' : '';
            var toExpand = expand_node.nextElementSibling;
            var expandmoreText = expand_node.innerHTML;
            var expandButton = doc.createElement("BUTTON");
            var expandButtonEmptyElement = doc.createElement(HIDESHOW_BUTTON_EMPTY_ELEMENT_TAG);

            // empty element for symbol
            addClass(expandButtonEmptyElement, prefixClassName + HIDESHOW_BUTTON_EMPTY_ELEMENT_SYMBOL);
            expandButtonEmptyElement.setAttribute(ATTR_HIDESHOW_BUTTON_EMPTY_ELEMENT, true);

            // clear element before adding button to it
            expand_node.innerHTML = '';

            // create a button with all attributes
            addClass(expandButton, prefixClassName + HIDESHOW_BUTTON_EXPAND_STYLE);
            addClass(expandButton, HIDESHOW_BUTTON_EXPAND);
            setAttributes(expandButton, (_setAttributes = {}, _defineProperty(_setAttributes, ATTR_CONTROL, HIDESHOW_TO_EXPAND_ID + iLisible), _defineProperty(_setAttributes, ATTR_EXPANDED, 'false'), _defineProperty(_setAttributes, 'id', HIDESHOW_BUTTON_LABEL_ID + iLisible), _defineProperty(_setAttributes, 'type', 'button'), _setAttributes));
            expandButton.innerHTML = expandmoreText;

            // Button goes into node
            expand_node.appendChild(expandButton);
            expandButton.insertBefore(expandButtonEmptyElement, expandButton.firstChild);

            // to expand attributes
            setAttributes(toExpand, (_setAttributes2 = {}, _defineProperty(_setAttributes2, ATTR_LABELLEDBY, HIDESHOW_BUTTON_LABEL_ID + iLisible), _defineProperty(_setAttributes2, ATTR_HIDDEN, 'true'), _defineProperty(_setAttributes2, 'id', HIDESHOW_TO_EXPAND_ID + iLisible), _setAttributes2));

            // add delay if DISPLAY_FIRST_LOAD
            addClass(toExpand, prefixClassName + HIDESHOW_TO_EXPAND_STYLE);
            if (hasClass(toExpand, DISPLAY_FIRST_LOAD) === true) {
                setTimeout(function () {
                    removeClass(toExpand, DISPLAY_FIRST_LOAD);
                }, DISPLAY_FIRST_LOAD_DELAY);
            }

            // quick tip to open
            if (hasClass(toExpand, IS_OPENED_CLASS) === true) {
                addClass(expandButton, IS_OPENED_CLASS);
                expandButton.setAttribute(ATTR_EXPANDED, 'true');

                removeClass(toExpand, IS_OPENED_CLASS);
                toExpand.removeAttribute(ATTR_HIDDEN);
            }
        });
    };

    /* listeners */
    ['click', 'keydown'].forEach(function (eventName) {

        doc.body.addEventListener(eventName, function (e) {

            // search if click on button or on element in a button (fix for Chrome)
            var id_expand_button = searchParent(e.target, HIDESHOW_BUTTON_EXPAND);

            // click on button
            if (id_expand_button !== '' && eventName === 'click') {
                var button_tag = findById(id_expand_button);
                var destination = findById(button_tag.getAttribute(ATTR_CONTROL));
                var etat_button = button_tag.getAttribute(ATTR_EXPANDED);

                // if closed
                if (etat_button === 'false') {
                    button_tag.setAttribute(ATTR_EXPANDED, true);
                    addClass(button_tag, IS_OPENED_CLASS);
                    destination.removeAttribute(ATTR_HIDDEN);
                } else {
                    button_tag.setAttribute(ATTR_EXPANDED, false);
                    removeClass(button_tag, IS_OPENED_CLASS);
                    destination.setAttribute(ATTR_HIDDEN, true);
                }
            }
            // click on hx (fix for voiceover = click or keydown on hx => click on button.
            // this makes no sense, but somebody has to do the job to make it fucking work
            if (hasClass(e.target, HIDESHOW_EXPAND) === true) {
                var hx_tag = e.target;
                var button_in = hx_tag.querySelector('.' + HIDESHOW_BUTTON_EXPAND);

                if (hx_tag != button_in) {
                    if (eventName === 'click') {
                        triggerEvent(button_in, 'click');
                        return false;
                    }
                    if (eventName === 'keydown' && (13 === e.keyCode || 32 === e.keyCode)) {
                        triggerEvent(button_in, 'click');
                        return false;
                    }
                }
            }
        }, true);
    });

    var onLoad = function onLoad() {
        attach();
        document.removeEventListener('DOMContentLoaded', onLoad);
    };

    document.addEventListener('DOMContentLoaded', onLoad);

    window.van11yAccessibleHideShowAria = attach;
})(document);