(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

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

module.exports = {
    domify: require('domify')
}

},{"domify":1}],3:[function(require,module,exports){
var deps = require('./deps')
var domify = deps.domify

var addListeners = function (events, element, fn) {
  for (var i = 0; i < events.length; i++) {
    element.addEventListener(events[i], fn)
  }
}

var vexFactory = function () {
  var animationEndSupport = false

  // Internal lookup table of vexes by id
  var vexes = {}

  // Vex
  var vex = {

    globalID: 1,

    // Inconsistent casings are intentional
    // http://stackoverflow.com/a/12958895/131898
    animationEndEvent: ['animationend', 'webkitAnimationEnd', 'mozAnimationEnd', 'MSAnimationEnd', 'oanimationend'],

    baseClassNames: {
      vex: 'vex',
      content: 'vex-content',
      overlay: 'vex-overlay',
      close: 'vex-close',
      closing: 'vex-closing',
      open: 'vex-open'
    },

    defaultOptions: {
      content: '',
      showCloseButton: true,
      escapeButtonCloses: true,
      overlayClosesOnClick: true,
      appendLocation: 'body',
      className: '',
      css: {},
      overlayClassName: '',
      overlayCSS: {},
      contentClassName: '',
      contentCSS: {},
      closeClassName: '',
      closeCSS: {}
    },

    open: function (options) {
      options = Object.assign({}, this.defaultOptions, options)

      options.id = this.globalID
      this.globalID += 1

      // Vex

      options.vex = document.createElement('div')
      options.vex.classList.add(this.baseClassNames.vex)
      if (options.className) {
        options.vex.classList.add(options.className)
      }
      // TODO .css(options.css)
      options.vex.setAttribute('data-vex-id', options.id)

      // Overlay

      options.vexOverlay = document.createElement('div')
      options.vexOverlay.classList.add(this.baseClassNames.overlay)
      if (options.overlayClassName) {
        options.vexOverlay.classList.add(options.overlayClassName)
      }
      // TODO .css(options.overlayCSS)

      if (options.overlayClosesOnClick) {
        options.vexOverlay.addEventListener('click', function (e) {
          if (e.target !== options.vexOverlay) {
            return
          }
          this.close(options.id)
        }.bind(this))
      }

      options.vex.appendChild(options.vexOverlay)

      // Content

      options.vexContent = document.createElement('div')
      options.vexContent.classList.add(this.baseClassNames.content)
      if (options.contentClassName) {
        options.vexContent.classList.add(options.contentClassName)
      }
      options.vexContent.setAttribute('data-vex-id', options.id)
      // TODO .css(options.contentCSS)
      options.vexContent.appendChild(domify(options.content))

      options.vex.appendChild(options.vexContent)

      // Close button

      if (options.showCloseButton) {
        options.closeButton = document.createElement('div')
        options.closeButton.classList.add(this.baseClassNames.close)
        if (options.closeClassName) {
          options.closeButton.classList.add(options.closeClassName)
        }
        // TODO .css(options.closeCSS)
        options.closeButton.addEventListener('click', function () {
          this.close(options.id)
        }.bind(this))

        options.vexContent.appendChild(options.closeButton)
      }

      // Lookup

      vexes[options.id] = options

      // Inject DOM and trigger callbacks/events

      document.querySelector(options.appendLocation).appendChild(options.vex)

      // Call afterOpen callback and trigger vexOpen event

      if (options.afterOpen) {
        options.afterOpen(options.vexContent, options)
      }
      // TODO: trigger events ('open')
      setTimeout(this.setupBodyClassNameOnOpen.bind(this), 0)

      // For chaining
      return options.vexContent
    },

    getSelectorFromBaseClass: function (baseClass) {
      return '.' + baseClass.split(' ').join('.')
    },

    getAllVexes: function () {
      var notClosingSelector = '.' + this.baseClassNames.vex + ':not(.' + this.baseClassNames.closing + ')'
      return document.querySelectorAll(notClosingSelector)
    },

    getVexByID: function (id) {
      var allVexes = this.getAllVexes()
      for (var i = 0; i < allVexes.length; i++) {
        if (parseInt(allVexes[i].getAttribute('data-vex-id')) === id) {
          return allVexes[i]
        }
      }
      return null
    },

    close: function (id) {
      if (!id) {
        var allVexes = this.getAllVexes()
        var lastVex = allVexes[allVexes.length - 1]
        if (!lastVex) {
          return false
        }
        id = parseInt(lastVex.getAttribute('data-vex-id'))
      }

      return this.closeByID(id)
    },

    closeAll: function () {
      var ids = []
      var allVexes = this.getAllVexes()
      for (var i = 0; i < allVexes.length; i++) {
        ids.push(parseInt(allVexes[i].getAttribute('data-vex-id')))
      }
      if (ids.length === 0) {
        return false
      }

      ids.reverse()

      for (var j = 0; j < ids.length; j++) {
        this.closeByID(ids[j])
      }

      return true
    },

    closeByID: function (id) {
      var vexContent = this.getVexByID(id)
      if (!vexContent) {
        return
      }

      var options = Object.assign({}, vexes[parseInt(vexContent.getAttribute('data-vex-id'))])

      var beforeClose = function () {
        if (options.beforeClose) {
          options.beforeClose(vexContent, options)
        }
      }

      var close = function () {
        // TODO event triggering ('vexClose')
        options.vex.parentNode.removeChild(options.vex)
        this.setupBodyClassNameOnAfterClose()
        if (options.afterClose) {
          options.afterClose(vexContent, options)
        }
        // TODO event triggering ('afterClose')
      }.bind(this)

      var hasAnimation = window.getComputedStyle(vexContent).getPropertyValue('animation-name') !== 'none' &&
        window.getComputedStyle(vexContent).getPropertyValue('animation-duration') !== '0s'

      if (animationEndSupport && hasAnimation) {
        if (beforeClose() !== false) {
          addListeners(this.animationEndEvent, options.vex, function () {
            close()
          })
          options.vex.classList.add(this.baseClassNames.closing)
        }
      } else {
        if (beforeClose() !== false) {
          close()
        }
      }

      return true
    },

    closeByEscape: function () {
      var ids = []
      var allVexes = this.getAllVexes()
      for (var i = 0; i < allVexes.length; i++) {
        ids.push(parseInt(allVexes.getAttribute('data-vex-id')))
      }
      if (ids.length === 0) {
        return false
      }

      var id = Math.max.apply(null, ids)

      if (vexes[id].escapeButtonCloses) {
        return false
      }

      return this.closeByID(id)
    },

    setupBodyClassNameOnOpen: function () {
      document.body.classList.add(this.baseClassNames.open)
    },

    setupBodyClassNameOnAfterClose: function () {
      if (!this.getAllVexes().length) {
        document.body.classList.remove(this.baseClassNames.open)
      }
    },

    hideLoading: function () {
      var el = document.querySelector('.vex-loading-spinner')
      if (el) {
        el.parentNode.removeChild(el)
      }
    },

    showLoading: function () {
      this.hideLoading()
      var el = document.createElement('div')
      el.classList = 'vex-loading-spinner ' + this.defaultOptions.className
      document.body.appendChild(el)
    }
  }

  document.addEventListener('DOMContentLoaded', function (event) {
    // Detect CSS Animation Support

    var s = (document.body || document.documentElement).style
    animationEndSupport = s.animation !== undefined || s.WebkitAnimation !== undefined || s.MozAnimation !== undefined || s.MsAnimation !== undefined || s.OAnimation !== undefined

    // Register global handler for ESC
    window.addEventListener('keyup', function (event) {
      if (event.keyCode === 27) {
        vex.closeByEscape()
      }
    })
  })

  return vex
}

if (typeof define === 'function' && define.amd) { // eslint-disable-line
  // AMD
  define([], vexFactory) // eslint-disable-line
} else if (typeof exports === 'object') {
  // CommonJS
  module.exports = vexFactory()
} else {
  // Global
  window.vex = vexFactory()
}

},{"./deps":2}]},{},[3]);
