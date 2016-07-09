(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Vex = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

/**
 * Expose `parse`.
 */

module.exports = parse;

/**
 * Tests for browser support.
 */

var innerHTMLBug = false;
var bugTestDiv;
if (typeof document !== 'undefined') {
  bugTestDiv = document.createElement('div');
  // Setup
  bugTestDiv.innerHTML = '  <link/><table></table><a href="/a">a</a><input type="checkbox"/>';
  // Make sure that link elements get serialized correctly by innerHTML
  // This requires a wrapper element in IE
  innerHTMLBug = !bugTestDiv.getElementsByTagName('link').length;
  bugTestDiv = undefined;
}

/**
 * Wrap map from jquery.
 */

var map = {
  legend: [1, '<fieldset>', '</fieldset>'],
  tr: [2, '<table><tbody>', '</tbody></table>'],
  col: [2, '<table><tbody></tbody><colgroup>', '</colgroup></table>'],
  // for script/link/style tags to work in IE6-8, you have to wrap
  // in a div with a non-whitespace character in front, ha!
  _default: innerHTMLBug ? [1, 'X<div>', '</div>'] : [0, '', '']
};

map.td =
map.th = [3, '<table><tbody><tr>', '</tr></tbody></table>'];

map.option =
map.optgroup = [1, '<select multiple="multiple">', '</select>'];

map.thead =
map.tbody =
map.colgroup =
map.caption =
map.tfoot = [1, '<table>', '</table>'];

map.polyline =
map.ellipse =
map.polygon =
map.circle =
map.text =
map.line =
map.path =
map.rect =
map.g = [1, '<svg xmlns="http://www.w3.org/2000/svg" version="1.1">','</svg>'];

/**
 * Parse `html` and return a DOM Node instance, which could be a TextNode,
 * HTML DOM Node of some kind (<div> for example), or a DocumentFragment
 * instance, depending on the contents of the `html` string.
 *
 * @param {String} html - HTML string to "domify"
 * @param {Document} doc - The `document` instance to create the Node for
 * @return {DOMNode} the TextNode, DOM Node, or DocumentFragment instance
 * @api private
 */

function parse(html, doc) {
  if ('string' != typeof html) throw new TypeError('String expected');

  // default to the global `document` object
  if (!doc) doc = document;

  // tag name
  var m = /<([\w:]+)/.exec(html);
  if (!m) return doc.createTextNode(html);

  html = html.replace(/^\s+|\s+$/g, ''); // Remove leading/trailing whitespace

  var tag = m[1];

  // body support
  if (tag == 'body') {
    var el = doc.createElement('html');
    el.innerHTML = html;
    return el.removeChild(el.lastChild);
  }

  // wrap map
  var wrap = map[tag] || map._default;
  var depth = wrap[0];
  var prefix = wrap[1];
  var suffix = wrap[2];
  var el = doc.createElement('div');
  el.innerHTML = prefix + html + suffix;
  while (depth--) el = el.lastChild;

  // one element
  if (el.firstChild == el.lastChild) {
    return el.removeChild(el.firstChild);
  }

  // several elements
  var fragment = doc.createDocumentFragment();
  while (el.firstChild) {
    fragment.appendChild(el.removeChild(el.firstChild));
  }

  return fragment;
}

},{}],2:[function(require,module,exports){
/*global window*/

/**
 * Check if object is dom node.
 *
 * @param {Object} val
 * @return {Boolean}
 * @api public
 */

module.exports = function isNode(val){
  if (!val || typeof val !== 'object') return false;
  if (window && 'object' == typeof window.Node) return val instanceof window.Node;
  return 'number' == typeof val.nodeType && 'string' == typeof val.nodeName;
}

},{}],3:[function(require,module,exports){
// Small deps for string to HTML conversion
var domify = require('domify')
var isDom = require('is-dom')

// Object.assign polyfill
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
if (typeof Object.assign !== 'function') {
  Object.assign = function (target) {
    'use strict'
    if (target == null) {
      throw new TypeError('Cannot convert undefined or null to object')
    }

    target = Object(target)
    for (var index = 1; index < arguments.length; index++) {
      var source = arguments[index]
      if (source != null) {
        for (var key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key]
          }
        }
      }
    }
    return target
  }
}

// Object.create polyfill
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/create
if (typeof Object.create !== 'function') {
  Object.create = (function () {
    var Temp = function () {}
    return function (prototype, propertiesObject) {
      if (prototype !== Object(prototype) && prototype !== null) {
        throw TypeError('Argument must be an object, or null')
      }
      Temp.prototype = prototype || {}
      if (propertiesObject !== undefined) {
        Object.defineProperties(Temp.prototype, propertiesObject)
      }
      var result = new Temp()
      Temp.prototype = null
      // to imitate the case of Object.create(null)
      if (prototype === null) {
        // eslint-disable-next-line
        result.__proto__ = null
      }
      return result
    }
  })()
}

// Detect CSS Animation End Support
// https://github.com/limonte/sweetalert2/blob/99bd539f85e15ac170f69d35001d12e092ef0054/src/utils/dom.js#L194
var animationEndEvent = (function() {
  var el = document.createElement('div')
  var eventNames = {
    'WebkitAnimation': 'webkitAnimationEnd',
    'MozAnimation': 'animationend',
    'OAnimation': 'oanimationend',
    'msAnimation': 'MSAnimationEnd',
    'animation': 'animationend'
  }
  for (var i in eventNames) {
    if (el.style[i] !== undefined) {
      return eventNames[i];
    }
  }
  return false;
})();

// Vex base CSS classes
var baseClassNames = {
  vex: 'vex',
  content: 'vex-content',
  overlay: 'vex-overlay',
  close: 'vex-close',
  closing: 'vex-closing',
  open: 'vex-open'
}

// Vex factory function
var Vex = function () {
  // Vex object
  var vex = {}

  // Register global handler for ESC
  var escHandler = function (e) {
    if (e.keyCode === 27) {
      vex.close()
    }
  }
  window.addEventListener('keyup', escHandler)

  // Open
  vex.open = function (opts) {
    var options = this.options = Object.assign({}, Vex.defaultOptions, opts)

    // Vex
    var rootEl = this.rootEl = document.createElement('div')
    rootEl.classList.add(baseClassNames.vex)
    if (options.className) {
      rootEl.classList = options.className
    }

    // Overlay
    var overlayEl = this.overlayEl = document.createElement('div')
    overlayEl.classList = baseClassNames.overlay
    if (options.overlayClassName) {
      overlayEl.classList = options.overlayClassName
    }
    if (options.overlayClosesOnClick) {
      overlayEl.addEventListener('click', function (e) {
        if (e.target === overlayEl) {
          this.close()
        }
      }.bind(this))
    }
    rootEl.appendChild(overlayEl)

    // Content
    var contentEl = this.contentEl = document.createElement('div')
    contentEl.classList.add(baseClassNames.content)
    if (options.contentClassName) {
      contentEl.classList.add(options.contentClassName)
    }
    contentEl.appendChild(isDom(options.content) ? options.content : domify(options.content))
    rootEl.appendChild(contentEl)

    // Close button
    if (options.showCloseButton) {
      var closeEl = this.closeEl = document.createElement('div')
      closeEl.classList.add(baseClassNames.close)
      if (options.closeClassName) {
        closeEl.classList.add(options.closeClassName)
      }
      closeEl.addEventListener('click', this.close.bind(this))
      contentEl.appendChild(closeEl)
    }

    // Inject DOM
    document.querySelector(options.appendLocation).appendChild(rootEl)

    // Call after open callback
    if (options.afterOpen) {
      options.afterOpen.call(this)
    }

    // Apply styling to the body during the next tick
    setTimeout(function () {
      document.body.classList.add(baseClassNames.open)
    }, 0)

    // For chaining
    return this
  }

  // Close
  vex.close = function () {
    var options = this.options

    var beforeClose = function () {
      if (options.beforeClose) {
        return options.beforeClose.call(this)
      }
      return true
    }.bind(this)

    var close = function () {
      // Remove the dialog from the DOM
      this.rootEl.parentNode.removeChild(this.rootEl)
      // Remove styling from the body during the next tick
      setTimeout(function () {
        document.body.classList.remove(baseClassNames.open)
      }, 0)
      // Call after close callback
      if (options.afterClose) {
        options.afterClose.call(this)
      }
    }.bind(this)

    if (beforeClose() === false) {
      return false
    }

    var style = window.getComputedStyle(this.contentEl)
    function hasAnimationPre (prefix) {
      return style.getPropertyValue(prefix + 'animation-name') !== 'none' && style.getPropertyValue(prefix + 'animation-duration') !== '0s'
    }
    var hasAnimation = hasAnimationPre('') || hasAnimationPre('-webkit-') || hasAnimationPre('-moz-') || hasAnimationPre('-o-')

    if (animationEndEvent && hasAnimation) {
      this.rootEl.addEventListener(animationEndEvent, close)
      this.rootEl.classList.add(baseClassNames.closing)
    } else {
      close()
    }

    // Cleanup global handler for ESC
    window.removeEventListener('keyup', escHandler)

    return true
  }

  return vex
}

Vex.defaultOptions = {
  content: '',
  showCloseButton: true,
  escapeButtonCloses: true,
  overlayClosesOnClick: true,
  appendLocation: 'body',
  className: '',
  overlayClassName: '',
  contentClassName: '',
  closeClassName: ''
}

// TODO A way to identify Vexes
// TODO Close all Vexes
// TODO Close Vex by ID
// TODO Get all Vexes
// TODO Get Vex by ID
// TODO Loading symbols?

Vex.registerPlugin = function (plugin, name) {
  var pluginName = name || plugin.name;
  if (Vex[pluginName]) {
    throw new Error('Plugin ' + name + ' is already registered.')
  }
  var proto = Vex()
  Vex[pluginName] = function () {
    return Object.assign(Object.create(proto), plugin(proto))
  }
  for (var static in plugin) {
    if (plugin.hasOwnProperty(static)) {
      Vex[pluginName][static] = plugin.statics[static]
    }
  }
}

module.exports = Vex

},{"domify":1,"is-dom":2}]},{},[3])(3)
});