(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.vex = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*
 * classList.js: Cross-browser full element.classList implementation.
 * 2014-07-23
 *
 * By Eli Grey, http://eligrey.com
 * Public Domain.
 * NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.
 */

/*global self, document, DOMException */

/*! @source http://purl.eligrey.com/github/classList.js/blob/master/classList.js*/

/* Copied from MDN:
 * https://developer.mozilla.org/en-US/docs/Web/API/Element/classList
 */

if ("document" in window.self) {

  // Full polyfill for browsers with no classList support
  // Including IE < Edge missing SVGElement.classList
  if (!("classList" in document.createElement("_"))
    || document.createElementNS && !("classList" in document.createElementNS("http://www.w3.org/2000/svg","g"))) {

  (function (view) {

    "use strict";

    if (!('Element' in view)) return;

    var
        classListProp = "classList"
      , protoProp = "prototype"
      , elemCtrProto = view.Element[protoProp]
      , objCtr = Object
      , strTrim = String[protoProp].trim || function () {
        return this.replace(/^\s+|\s+$/g, "");
      }
      , arrIndexOf = Array[protoProp].indexOf || function (item) {
        var
            i = 0
          , len = this.length
        ;
        for (; i < len; i++) {
          if (i in this && this[i] === item) {
            return i;
          }
        }
        return -1;
      }
      // Vendors: please allow content code to instantiate DOMExceptions
      , DOMEx = function (type, message) {
        this.name = type;
        this.code = DOMException[type];
        this.message = message;
      }
      , checkTokenAndGetIndex = function (classList, token) {
        if (token === "") {
          throw new DOMEx(
              "SYNTAX_ERR"
            , "An invalid or illegal string was specified"
          );
        }
        if (/\s/.test(token)) {
          throw new DOMEx(
              "INVALID_CHARACTER_ERR"
            , "String contains an invalid character"
          );
        }
        return arrIndexOf.call(classList, token);
      }
      , ClassList = function (elem) {
        var
            trimmedClasses = strTrim.call(elem.getAttribute("class") || "")
          , classes = trimmedClasses ? trimmedClasses.split(/\s+/) : []
          , i = 0
          , len = classes.length
        ;
        for (; i < len; i++) {
          this.push(classes[i]);
        }
        this._updateClassName = function () {
          elem.setAttribute("class", this.toString());
        };
      }
      , classListProto = ClassList[protoProp] = []
      , classListGetter = function () {
        return new ClassList(this);
      }
    ;
    // Most DOMException implementations don't allow calling DOMException's toString()
    // on non-DOMExceptions. Error's toString() is sufficient here.
    DOMEx[protoProp] = Error[protoProp];
    classListProto.item = function (i) {
      return this[i] || null;
    };
    classListProto.contains = function (token) {
      token += "";
      return checkTokenAndGetIndex(this, token) !== -1;
    };
    classListProto.add = function () {
      var
          tokens = arguments
        , i = 0
        , l = tokens.length
        , token
        , updated = false
      ;
      do {
        token = tokens[i] + "";
        if (checkTokenAndGetIndex(this, token) === -1) {
          this.push(token);
          updated = true;
        }
      }
      while (++i < l);

      if (updated) {
        this._updateClassName();
      }
    };
    classListProto.remove = function () {
      var
          tokens = arguments
        , i = 0
        , l = tokens.length
        , token
        , updated = false
        , index
      ;
      do {
        token = tokens[i] + "";
        index = checkTokenAndGetIndex(this, token);
        while (index !== -1) {
          this.splice(index, 1);
          updated = true;
          index = checkTokenAndGetIndex(this, token);
        }
      }
      while (++i < l);

      if (updated) {
        this._updateClassName();
      }
    };
    classListProto.toggle = function (token, force) {
      token += "";

      var
          result = this.contains(token)
        , method = result ?
          force !== true && "remove"
        :
          force !== false && "add"
      ;

      if (method) {
        this[method](token);
      }

      if (force === true || force === false) {
        return force;
      } else {
        return !result;
      }
    };
    classListProto.toString = function () {
      return this.join(" ");
    };

    if (objCtr.defineProperty) {
      var classListPropDesc = {
          get: classListGetter
        , enumerable: true
        , configurable: true
      };
      try {
        objCtr.defineProperty(elemCtrProto, classListProp, classListPropDesc);
      } catch (ex) { // IE 8 doesn't support enumerable:true
        if (ex.number === -0x7FF5EC54) {
          classListPropDesc.enumerable = false;
          objCtr.defineProperty(elemCtrProto, classListProp, classListPropDesc);
        }
      }
    } else if (objCtr[protoProp].__defineGetter__) {
      elemCtrProto.__defineGetter__(classListProp, classListGetter);
    }

    }(window.self));

    } else {
    // There is full or partial native classList support, so just check if we need
    // to normalize the add/remove and toggle APIs.

    (function () {
      "use strict";

      var testElement = document.createElement("_");

      testElement.classList.add("c1", "c2");

      // Polyfill for IE 10/11 and Firefox <26, where classList.add and
      // classList.remove exist but support only one argument at a time.
      if (!testElement.classList.contains("c2")) {
        var createMethod = function(method) {
          var original = DOMTokenList.prototype[method];

          DOMTokenList.prototype[method] = function(token) {
            var i, len = arguments.length;

            for (i = 0; i < len; i++) {
              token = arguments[i];
              original.call(this, token);
            }
          };
        };
        createMethod('add');
        createMethod('remove');
      }

      testElement.classList.toggle("c3", false);

      // Polyfill for IE 10 and Firefox <24, where classList.toggle does not
      // support the second argument.
      if (testElement.classList.contains("c3")) {
        var _toggle = DOMTokenList.prototype.toggle;

        DOMTokenList.prototype.toggle = function(token, force) {
          if (1 in arguments && !this.contains(token) === !force) {
            return force;
          } else {
            return _toggle.call(this, token);
          }
        };

      }

      testElement = null;
    }());
  }
}

},{}],2:[function(require,module,exports){

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

},{}],3:[function(require,module,exports){
(function (global){
/*! vex.dialog.min.js 3.0.0 */
!function(a){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=a();else if("function"==typeof define&&define.amd)define([],a);else{var b;b="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:this,b.vexDialog=a()}}(function(){return function a(b,c,d){function e(g,h){if(!c[g]){if(!b[g]){var i="function"==typeof require&&require;if(!h&&i)return i(g,!0);if(f)return f(g,!0);var j=new Error("Cannot find module '"+g+"'");throw j.code="MODULE_NOT_FOUND",j}var k=c[g]={exports:{}};b[g][0].call(k.exports,function(a){var c=b[g][1][a];return e(c?c:a)},k,k.exports,a,b,c,d)}return c[g].exports}for(var f="function"==typeof require&&require,g=0;g<d.length;g++)e(d[g]);return e}({1:[function(a,b,c){function d(a,b){if("string"!=typeof a)throw new TypeError("String expected");b||(b=document);var c=/<([\w:]+)/.exec(a);if(!c)return b.createTextNode(a);a=a.replace(/^\s+|\s+$/g,"");var d=c[1];if("body"==d){var e=b.createElement("html");return e.innerHTML=a,e.removeChild(e.lastChild)}var f=g[d]||g._default,h=f[0],i=f[1],j=f[2],e=b.createElement("div");for(e.innerHTML=i+a+j;h--;)e=e.lastChild;if(e.firstChild==e.lastChild)return e.removeChild(e.firstChild);for(var k=b.createDocumentFragment();e.firstChild;)k.appendChild(e.removeChild(e.firstChild));return k}b.exports=d;var e,f=!1;"undefined"!=typeof document&&(e=document.createElement("div"),e.innerHTML='  <link/><table></table><a href="/a">a</a><input type="checkbox"/>',f=!e.getElementsByTagName("link").length,e=void 0);var g={legend:[1,"<fieldset>","</fieldset>"],tr:[2,"<table><tbody>","</tbody></table>"],col:[2,"<table><tbody></tbody><colgroup>","</colgroup></table>"],_default:f?[1,"X<div>","</div>"]:[0,"",""]};g.td=g.th=[3,"<table><tbody><tr>","</tr></tbody></table>"],g.option=g.optgroup=[1,'<select multiple="multiple">',"</select>"],g.thead=g.tbody=g.colgroup=g.caption=g.tfoot=[1,"<table>","</table>"],g.polyline=g.ellipse=g.polygon=g.circle=g.text=g.line=g.path=g.rect=g.g=[1,'<svg xmlns="http://www.w3.org/2000/svg" version="1.1">',"</svg>"]},{}],2:[function(a,b,c){function d(a,b){"object"!=typeof b?b={hash:!!b}:void 0===b.hash&&(b.hash=!0);for(var c=b.hash?{}:"",d=b.serializer||(b.hash?g:h),e=a&&a.elements?a.elements:[],f=Object.create(null),k=0;k<e.length;++k){var l=e[k];if((b.disabled||!l.disabled)&&l.name&&j.test(l.nodeName)&&!i.test(l.type)){var m=l.name,n=l.value;if("checkbox"!==l.type&&"radio"!==l.type||l.checked||(n=void 0),b.empty){if("checkbox"!==l.type||l.checked||(n=""),"radio"===l.type&&(f[l.name]||l.checked?l.checked&&(f[l.name]=!0):f[l.name]=!1),!n&&"radio"==l.type)continue}else if(!n)continue;if("select-multiple"!==l.type)c=d(c,m,n);else{n=[];for(var o=l.options,p=!1,q=0;q<o.length;++q){var r=o[q],s=b.empty&&!r.value,t=r.value||s;r.selected&&t&&(p=!0,c=b.hash&&"[]"!==m.slice(m.length-2)?d(c,m+"[]",r.value):d(c,m,r.value))}!p&&b.empty&&(c=d(c,m,""))}}}if(b.empty)for(var m in f)f[m]||(c=d(c,m,""));return c}function e(a){var b=[],c=/^([^\[\]]*)/,d=new RegExp(k),e=c.exec(a);for(e[1]&&b.push(e[1]);null!==(e=d.exec(a));)b.push(e[1]);return b}function f(a,b,c){if(0===b.length)return a=c;var d=b.shift(),e=d.match(/^\[(.+?)\]$/);if("[]"===d)return a=a||[],Array.isArray(a)?a.push(f(null,b,c)):(a._values=a._values||[],a._values.push(f(null,b,c))),a;if(e){var g=e[1],h=+g;isNaN(h)?(a=a||{},a[g]=f(a[g],b,c)):(a=a||[],a[h]=f(a[h],b,c))}else a[d]=f(a[d],b,c);return a}function g(a,b,c){var d=b.match(k);if(d){var g=e(b);f(a,g,c)}else{var h=a[b];h?(Array.isArray(h)||(a[b]=[h]),a[b].push(c)):a[b]=c}return a}function h(a,b,c){return c=c.replace(/(\r)?\n/g,"\r\n"),c=encodeURIComponent(c),c=c.replace(/%20/g,"+"),a+(a?"&":"")+encodeURIComponent(b)+"="+c}var i=/^(?:submit|button|image|reset|file)$/i,j=/^(?:input|select|textarea|keygen)/i,k=/(\[[^\[\]]*\])/g;b.exports=d},{}],3:[function(a,b,c){var d=a("domify"),e=a("form-serialize"),f=function(a){var b=document.createElement("form");b.classList.add("vex-dialog-form");var c=document.createElement("div");c.classList.add("vex-dialog-message"),c.appendChild(a.message instanceof window.Node?a.message:d(a.message));var e=document.createElement("div");return e.classList.add("vex-dialog-input"),e.appendChild(a.input instanceof window.Node?a.input:d(a.input)),b.appendChild(c),b.appendChild(e),b},g=function(a){var b=document.createElement("div");b.classList.add("vex-dialog-buttons");for(var c=0;c<a.length;c++){var d=a[c],e=document.createElement("button");e.type=d.type,e.textContent=d.text,e.classList.add(d.className),e.classList.add("vex-dialog-button"),0===c?e.classList.add("vex-first"):c===a.length-1&&e.classList.add("vex-last"),function(a){e.addEventListener("click",function(b){a.click&&a.click.call(this,b)}.bind(this))}.bind(this)(d),b.appendChild(e)}return b},h=function(a){if("undefined"!=typeof a){var b=document.createElement("div");return b.appendChild(document.createTextNode(a)),b.innerHTML}return""},i=function(a){var b={name:"dialog",open:function(b){var c=Object.assign({},this.defaultOptions,b);c.unsafeMessage&&!c.message?c.message=c.unsafeMessage:c.message&&(c.message=h(c.message));var d=c.content=f(c),e=a.open(c),i=c.beforeClose;if(e.options.beforeClose=function(){c.callback(this.value||!1),i&&i.call(this)}.bind(e),d.appendChild(g.call(e,c.buttons)),e.form=d,d.addEventListener("submit",c.onSubmit.bind(e)),c.focusFirstInput){var j=e.contentEl.querySelector("button, input, textarea");j&&j.focus()}return e},alert:function(a){return"string"==typeof a&&(a={message:a}),a=Object.assign({},this.defaultOptions,this.defaultAlertOptions,a),this.open(a)},confirm:function(a){if("string"==typeof a)throw new Error("dialog.confirm(options) requires options.callback.");return a=Object.assign({},this.defaultOptions,this.defaultConfirmOptions,a),this.open(a)},prompt:function(a){if("string"==typeof a)throw new Error("dialog.prompt(options) requires options.callback.");var b=Object.assign({},this.defaultOptions,this.defaultPromptOptions),c={unsafeMessage:'<label for="vex">'+(h(a.label)||b.label)+"</label>",input:'<input name="vex" type="text" class="vex-dialog-prompt-input" placeholder="'+(a.placeholder||b.placeholder)+'" value="'+(a.value||b.value)+'" />'};a=Object.assign(b,c,a);var d=a.callback;return a.callback=function(a){a=a[Object.keys(a)[0]],d(a)},this.open(a)}};return b.buttons={YES:{text:"OK",type:"submit",className:"vex-dialog-button-primary",click:function(){this.value=!0}},NO:{text:"Cancel",type:"button",className:"vex-dialog-button-secondary",click:function(){this.value=!1,this.close()}}},b.defaultOptions={callback:function(){},afterOpen:function(){},message:"",input:"",buttons:[b.buttons.YES,b.buttons.NO],showCloseButton:!1,onSubmit:function(a){return a.preventDefault(),this.options.input&&(this.value=e(this.form,{hash:!0})),this.close()},focusFirstInput:!0},b.defaultAlertOptions={message:"Alert",buttons:[b.buttons.YES]},b.defaultPromptOptions={label:"Prompt:",placeholder:"",value:""},b.defaultConfirmOptions={message:"Confirm"},b};b.exports=i},{domify:1,"form-serialize":2}]},{},[3])(3)});
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],4:[function(require,module,exports){
var vex = require('./vex')
vex.registerPlugin(require('vex-dialog'))
module.exports = vex

},{"./vex":5,"vex-dialog":3}],5:[function(require,module,exports){
// String to DOM function
var domify = require('domify')
// classList polyfill for old browsers
require('classlist-polyfill')

// Object.assign polyfill
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
if (typeof Object.assign !== 'function') {
  Object.assign = function (target) {
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

// Detect CSS Animation End Support
// https://github.com/limonte/sweetalert2/blob/99bd539f85e15ac170f69d35001d12e092ef0054/src/utils/dom.js#L194
var animationEndEvent = (function () {
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
      return eventNames[i]
    }
  }
  return false
})()

// vex base CSS classes
var baseClassNames = {
  vex: 'vex',
  content: 'vex-content',
  overlay: 'vex-overlay',
  close: 'vex-close',
  closing: 'vex-closing',
  open: 'vex-open'
}

// Private lookup table of all open vex objects, keyed by id
var vexes = {}
var globalId = 1

// vex itself is an object that exposes a simple API to open and close vex objects in various ways
var vex = {
  open: function (opts) {
    // The dialog instance
    var vexInstance = {}

    // Set id
    vexInstance.id = globalId++

    // Store internally
    vexes[vexInstance.id] = vexInstance

    // Set state
    vexInstance.isOpen = true

    // Close function on the vex instance
    // This is how all API functions should close individual vexes
    vexInstance.close = function () {
      // Check state
      if (!this.isOpen) {
        return true
      }

      var options = this.options

      var beforeClose = function () {
        // Call before close callback
        if (options.beforeClose) {
          return options.beforeClose.call(this)
        }
        // Otherwise indicate that it's ok to continue with close
        return true
      }.bind(this)

      var close = function () {
        if (!this.rootEl.parentNode) {
          return
        }
        // Run once
        this.rootEl.removeEventListener(animationEndEvent, close)
        // Remove from lookup table (prevent memory leaks)
        delete vexes[this.id]
        // Remove the dialog from the DOM
        this.rootEl.parentNode.removeChild(this.rootEl)
        // Call after close callback
        if (options.afterClose) {
          options.afterClose.call(this)
        }
        // Remove styling from the body, if no more vexes are open
        if (Object.keys(vexes).length === 0) {
          document.body.classList.remove(baseClassNames.open)
        }
      }.bind(this)

      // If any user-defined validation or anything fails, abort the close
      if (beforeClose() === false) {
        return false
      }

      // Update state
      this.isOpen = false

      // Detect if the content el has any CSS animations defined
      var style = window.getComputedStyle(this.contentEl)
      function hasAnimationPre (prefix) {
        return style.getPropertyValue(prefix + 'animation-name') !== 'none' && style.getPropertyValue(prefix + 'animation-duration') !== '0s'
      }
      var hasAnimation = hasAnimationPre('') || hasAnimationPre('-webkit-') || hasAnimationPre('-moz-') || hasAnimationPre('-o-')

      // Close the vex
      if (animationEndEvent && hasAnimation) {
        // Setup the end event listener, to remove the el from the DOM
        this.rootEl.addEventListener(animationEndEvent, close)
        // Add the closing class to the dialog, showing the close animation
        this.rootEl.classList.add(baseClassNames.closing)
      } else {
        close()
      }

      return true
    }

    // Allow strings as content
    if (typeof opts === 'string') {
      opts = {
        content: opts
      }
    }
    // Store options on instance for future reference
    var options = vexInstance.options = Object.assign({}, vex.defaultOptions, opts)

    // vex root
    var rootEl = vexInstance.rootEl = document.createElement('div')
    rootEl.classList.add(baseClassNames.vex)
    if (options.className) {
      rootEl.classList.add(options.className)
    }

    // Overlay
    var overlayEl = vexInstance.overlayEl = document.createElement('div')
    overlayEl.classList.add(baseClassNames.overlay)
    if (options.overlayClassName) {
      overlayEl.classList.add(options.overlayClassName)
    }
    if (options.overlayClosesOnClick) {
      overlayEl.addEventListener('click', function (e) {
        if (e.target === overlayEl) {
          vexInstance.close()
        }
      })
    }
    rootEl.appendChild(overlayEl)

    // Content
    var contentEl = vexInstance.contentEl = document.createElement('div')
    contentEl.classList.add(baseClassNames.content)
    if (options.contentClassName) {
      contentEl.classList.add(options.contentClassName)
    }
    contentEl.appendChild(options.content instanceof window.Node ? options.content : domify(options.content))
    rootEl.appendChild(contentEl)

    // Close button
    if (options.showCloseButton) {
      var closeEl = vexInstance.closeEl = document.createElement('div')
      closeEl.classList.add(baseClassNames.close)
      if (options.closeClassName) {
        closeEl.classList.add(options.closeClassName)
      }
      closeEl.addEventListener('click', vexInstance.close.bind(vexInstance))
      contentEl.appendChild(closeEl)
    }

    // Add to DOM
    document.querySelector(options.appendLocation).appendChild(rootEl)

    // Call after open callback
    if (options.afterOpen) {
      options.afterOpen.call(vexInstance)
    }

    // Apply styling to the body
    document.body.classList.add(baseClassNames.open)

    // Return the created vex instance
    return vexInstance
  },

  // A top-level vex.close function to close dialogs by reference or id
  close: function (vexOrId) {
    var id
    if (vexOrId.id) {
      id = vexOrId.id
    } else if (typeof vexOrId === 'string') {
      id = vexOrId
    } else {
      throw new TypeError('close requires a vex object or id string')
    }
    if (!vexes[id]) {
      return false
    }
    return vexes[id].close()
  },

  // Close the most recently created/opened vex
  closeTop: function () {
    var ids = Object.keys(vexes)
    if (!ids.length) {
      return false
    }
    return vexes[ids[ids.length - 1]].close()
  },

  // Close every vex!
  closeAll: function () {
    for (var id in vexes) {
      this.close(id)
    }
    return true
  },

  // A getter for the internal lookup table
  getAll: function () {
    return vexes
  },

  // A getter for the internal lookup table
  getById: function (id) {
    return vexes[id]
  }
}

// Close top vex on escape
window.addEventListener('keyup', function (e) {
  if (e.keyCode === 27) {
    vex.closeTop()
  }
})
// Close all vexes on history pop state (useful in single page apps)
window.addEventListener('popstate', vex.closeAll)

vex.defaultOptions = {
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

// TODO Loading symbols?

// Plugin system!
vex.registerPlugin = function (pluginFn, name) {
  var plugin = pluginFn(vex)
  var pluginName = name || plugin.name
  if (vex[pluginName]) {
    throw new Error('Plugin ' + name + ' is already registered.')
  }
  vex[pluginName] = plugin
}

module.exports = vex

},{"classlist-polyfill":1,"domify":2}]},{},[4])(4)
});