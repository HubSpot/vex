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
var isDom = require('is-dom')

var addListeners = function (events, element, fn) {
  for (var i = 0; i < events.length; i++) {
    element.addEventListener(events[i], fn)
  }
}

// Detect CSS Animation End Support
var animationEndEvent = ['animationend', 'webkitAnimationEnd', 'mozAnimationEnd', 'MSAnimationEnd', 'oanimationend']
var animationEndSupport = false
var onLoad = function (event) {
  var s = (document.body || document.documentElement).style
  animationEndSupport = s.animation !== undefined || s.WebkitAnimation !== undefined || s.MozAnimation !== undefined || s.MsAnimation !== undefined || s.OAnimation !== undefined
}
if (document.readyState === 'complete' || document.readyState === 'loaded') {
  onLoad()
} else {
  document.addEventListener('DOMContentLoaded', onLoad)
}

var Vex = function () {
  // Vex
  var vex = {
    open: function (options) {
      this.options = options = Object.assign({}, Vex.defaultOptions, options)

      // Vex
      this.rootEl = options.vex = document.createElement('div')
      options.vex.classList.add(Vex.baseClassNames.vex)
      if (options.className) {
        options.vex.classList.add(options.className)
      }
      // TODO .css(options.css)

      // Overlay
      options.vexOverlay = document.createElement('div')
      options.vexOverlay.classList.add(Vex.baseClassNames.overlay)
      if (options.overlayClassName) {
        options.vexOverlay.classList.add(options.overlayClassName)
      }
      // TODO .css(options.overlayCSS)
      if (options.overlayClosesOnClick) {
        options.vexOverlay.addEventListener('click', function (e) {
          if (e.target !== options.vexOverlay) {
            return
          }
          this.close()
        }.bind(this))
      }
      options.vex.appendChild(options.vexOverlay)

      // Content
      this.contentEl = options.vexContent = document.createElement('div')
      options.vexContent.classList.add(Vex.baseClassNames.content)
      if (options.contentClassName) {
        options.vexContent.classList.add(options.contentClassName)
      }
      // TODO .css(options.contentCSS)
      options.vexContent.appendChild(isDom(options.content) ? options.content : domify(options.content))
      options.vex.appendChild(options.vexContent)

      // Close button
      if (options.showCloseButton) {
        options.closeButton = document.createElement('div')
        options.closeButton.classList.add(Vex.baseClassNames.close)
        if (options.closeClassName) {
          options.closeButton.classList.add(options.closeClassName)
        }
        // TODO .css(options.closeCSS)
        options.closeButton.addEventListener('click', this.close.bind(this))
        options.vexContent.appendChild(options.closeButton)
      }

      // Inject DOM
      document.querySelector(options.appendLocation).appendChild(options.vex)

      // Call afterOpen callback and trigger vexOpen event
      if (options.afterOpen) {
        options.afterOpen(options.vexContent, options)
      }
      // TODO: trigger events ('open')
      setTimeout(function () {
        document.body.classList.add(Vex.baseClassNames.open)
      }, 0)

      // For chaining
      return this
    },

    close: function () {
      var options = this.options

      var beforeClose = function () {
        if (options.beforeClose) {
          options.beforeClose.call(this)
        }
      }.bind(this)

      var close = function () {
        // TODO event triggering ('vexClose')
        if (!options.vex.parentNode) {
          options.vex = null
          return
        }
        options.vex.parentNode.removeChild(options.vex)
        document.body.classList.remove(Vex.baseClassNames.open)
        if (options.afterClose) {
          options.afterClose.call(this)
        }
        // TODO event triggering ('afterClose')
      }.bind(this)

      var style = window.getComputedStyle(this.contentEl)
      function hasAnimationPre (prefix) {
        return style.getPropertyValue(prefix + 'animation-name') !== 'none' && style.getPropertyValue(prefix + 'animation-duration') !== '0s'
      }
      var hasAnimation = hasAnimationPre('') || hasAnimationPre('-webkit-') || hasAnimationPre('-moz-') || hasAnimationPre('-o-')

      if (animationEndSupport && hasAnimation) {
        if (beforeClose() !== false) {
          addListeners(animationEndEvent, options.vex, function (e) {
            close()
          })
          options.vex.classList.add(Vex.baseClassNames.closing)
        }
      } else {
        if (beforeClose() !== false) {
          close()
        }
      }

      return true
    }
  }

  // TODO Event handlers (like onRemove) to remove this listener
  // Register global handler for ESC
  window.addEventListener('keyup', function (event) {
    if (event.keyCode === 27) {
      vex.close()
    }
  })

  return vex
}

Vex.baseClassNames = {
  vex: 'vex',
  content: 'vex-content',
  overlay: 'vex-overlay',
  close: 'vex-close',
  closing: 'vex-closing',
  open: 'vex-open'
}

Vex.defaultOptions = {
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
}

// TODO A way to identify Vexes
// TODO Close all Vexes
// TODO Close Vex by ID
// TODO Get all Vexes
// TODO Get Vex by ID
// TODO Loading symbols?

Vex.Dialog = require('./vex.dialog')(Vex)

module.exports = Vex
