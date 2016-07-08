(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.vex = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

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
var domify = require('domify')

var vexDialogFactory = function (vex) {
  if (!vex) {
    throw new Error('Vex is required to use vex.dialog')
  }

  // TODO
  // var formToObject = function (form) {
  //   object = {}
  //   $.each $form.serializeArray(), ->
  //     if object[@name]
  //       object[@name] = [object[@name]] if !object[@name].push
  //       object[@name].push(@value || '')
  //     else
  //       object[@name] = @value || '';
  //   object
  // }

  var dialog = {}

  dialog.buttons = {
    YES: {
      text: 'OK',
      type: 'submit',
      className: 'vex-dialog-button-primary'
    },

    NO: {
      text: 'Cancel',
      type: 'button',
      className: 'vex-dialog-button-secondary',
      click: function (vexContent, event) {
        // TODO
        // $vexContent.data().vex.value = false
        vex.close(parseInt(vexContent.getAttribute('data-vex-id')))
      }
    }
  }

  dialog.defaultOptions = {
    callback: function () {},
    afterOpen: function () {},
    message: 'Message',
    input: '<input name="vex" type="hidden" value="_vex-empty-value" />',
    value: false,
    buttons: [
      dialog.buttons.YES,
      dialog.buttons.NO
    ],
    showCloseButton: false,
    onSubmit: function (event) {
      var vexContent = event.target
      while (vexContent.classList.contains('vex-content')) {
        if (!vexContent.parentNode) {
          throw new Error('Could not find vex-content')
        }
        vexContent = vexContent.parentNode
      }
      event.preventDefault()
      // TODO
      // $vexContent.data().vex.value = dialog.getFormValueOnSubmit(formToObject, form)
      return vex.close(vexContent.getAttribute('data-vex-id'))
    },
    focusFirstInput: true
  }

  dialog.defaultAlertOptions = {
    message: 'Alert',
    buttons: [
      dialog.buttons.YES
    ]
  }

  dialog.defaultConfirmOptions = {
    message: 'Confirm'
  }

  dialog.open = function (options) {
    options = Object.assign({}, vex.defaultOptions, dialog.defaultOptions, options)
    options.content = dialog.buildDialogForm(options)

    beforeClose = options.beforeClose
    options.beforeClose = function (vexContent, config) {
      options.callback(config.value)
      if (beforeClose) {
        beforeClose(vexContent, config)
      }
    }

    vexContent = vex.open(options)

    if (options.focusFirstInput) {
      var firstInput = vexContent.querySelector('button[type="submit"], button[type="button"], input[type="submit"], input[type="button"], textarea, input[type="date"], input[type="datetime"], input[type="datetime-local"], input[type="email"], input[type="month"], input[type="number"], input[type="password"], input[type="search"], input[type="tel"], input[type="text"], input[type="time"], input[type="url"], input[type="week"]')
      firstInput.focus()
    }

    return vexContent
  }

  dialog.alert = function (options) {
    if (typeof options === 'string') {
      options = {
        message: options
      }
    }

    options = Object.assign({}, dialog.defaultAlertOptions, options)

    return dialog.open(options)
  }

  dialog.confirm = function (options) {
    if (typeof options === 'string') {
      throw new Error('dialog.confirm(options) requires options.callback.')
    }

    options = Object.assign({}, dialog.defaultConfirmOptions, options)

    return dialog.open(options)
  }

  dialog.prompt = function (options) {
    if (typeof options === 'string') {
      throw new Error('dialog.prompt(options) requires options.callback.')
    }

    var defaultPromptOptions = {
      message: '<label for="vex">' + options.label || 'Prompt:' + '</label>',
      input: '<input name="vex" type="text" class="vex-dialog-prompt-input" placeholder="' + options.placeholder || '' + '" value="' + options.value || '' + '" />'
    }

    options = Object.assign({}, defaultPromptOptions, options)

    return dialog.open(options)
  }

  dialog.buildDialogForm = function (options) {
    var form = document.createElement('form')
    form.classList.add('vex-dialog-form')

    var message = document.createElement('div')
    message.classList.add('vex-dialog-message')
    message.appendChild(domify(options.message))

    var input = document.createElement('div')
    input.classList.add('vex-dialog-input')
    input.appendChild(domify(options.input))

    form.appendChild(message)
    form.appendChild(input)
    form.appendChild(dialog.buttonsToDOM(options.buttons))
    form.addEventListener('submit', options.onSubmit)

    return form
  }

  dialog.getFormValueOnSubmit = function (formData) {
    if (formData.vex || formData.vex === '') {
      if (formData.vex === '_vex-empty-value') {
        return true
      }
      return formData.vex
    } else {
      return formData
    }
  }

  dialog.buttonsToDOM = function (buttons) {
    var domButtons = document.createElement('div')
    domButtons.classList.add('vex-dialog-buttons')

    for (var i = 0; i < buttons.length; i++) {
      var button = buttons[i]
      var domButton = document.createElement('button')
      domButton.type = button.type
      domButton.textContent = button.text
      domButton.classList.add(button.className)
      domButton.classList.add('vex-dialog-button')
      if (i === 0) {
        domButton.classList.add('vex-first')
      } else if (i === buttons.length - 1) {
        domButton.classList.add('vex-last')
      }
      domButton.addEventListener('click', function (e) {
        var vexContent = event.target
        while (vexContent.classList.contains('vex-content')) {
          if (!vexContent.parentNode) {
            throw new Error('Could not find vex-content')
          }
          vexContent = vexContent.parentNode
        }
        if (button.click) {
          button.click(vexContent, e)
        }
      })
      domButtons.appendChild(domButton)
    }

    return buttons
  }

  return dialog
}

module.exports = vexDialogFactory

},{"domify":1}],3:[function(require,module,exports){
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

var domify = require('domify')

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

  vex.dialog = require('./vex.dialog')(vex)

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

module.exports = vexFactory()

},{"./vex.dialog":2,"domify":1}]},{},[3])(3)
});