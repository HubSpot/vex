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

var vexFactory = function () {
  var animationEndSupport = false

  

  // Vex
  var vex = {

    // Internal lookup table of vexes by id
    vexes: {},

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
      options.vexContent.appendChild(isDom(options.content) ? options.content : domify(options.content))

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

      this.vexes[options.id] = options

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

      var options = Object.assign({}, this.vexes[parseInt(vexContent.getAttribute('data-vex-id'))])

      var beforeClose = function () {
        if (options.beforeClose) {
          options.beforeClose(vexContent, options)
        }
      }

      var close = function () {
        // TODO event triggering ('vexClose')
        if (!options.vex.parentNode) {
          options.vex = null
          return
        }
        options.vex.parentNode.removeChild(options.vex)
        this.setupBodyClassNameOnAfterClose()
        if (options.afterClose) {
          options.afterClose(vexContent, options)
        }
        // TODO event triggering ('afterClose')
      }.bind(this)

      var style = window.getComputedStyle(vexContent)
      function hasAnimationPre(prefix) {
        return style.getPropertyValue(prefix + 'animation-name') !== 'none' && style.getPropertyValue(prefix + 'animation-duration') !== '0s'
      }
      var hasAnimation = hasAnimationPre('') || hasAnimationPre('-webkit-') || hasAnimationPre('-moz-') || hasAnimationPre('-o-')

      if (animationEndSupport && hasAnimation) {
        if (beforeClose() !== false) {
          addListeners(this.animationEndEvent, options.vex, function (e) {
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

      if (this.vexes[id].escapeButtonCloses) {
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

  var onLoad = function (event) {
    // Detect CSS Animation Support

    var s = (document.body || document.documentElement).style
    animationEndSupport = s.animation !== undefined || s.WebkitAnimation !== undefined || s.MozAnimation !== undefined || s.MsAnimation !== undefined || s.OAnimation !== undefined

    // Register global handler for ESC
    window.addEventListener('keyup', function (event) {
      if (event.keyCode === 27) {
        vex.closeByEscape()
      }
    })
  }

  if (document.readyState === 'complete' || document.readyState === 'loaded') {
    onLoad()
  } else {
    document.addEventListener('DOMContentLoaded', onLoad)
  }

  return vex
}

module.exports = vexFactory()
