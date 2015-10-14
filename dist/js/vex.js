/*! vex-js 2.3.2 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(factory);
  } else if (typeof exports === 'object') {
    module.exports = factory(require, exports, module);
  } else {
    root.vex = factory();
  }
}(this, function(require, exports, module) {

'use strict';

var animationEndSupport = false;

$(function () {
  var s = undefined;
  s = (document.body || document.documentElement).style;
  animationEndSupport = s.animation !== void 0 || s.WebkitAnimation !== void 0 || s.MozAnimation !== void 0 || s.MsAnimation !== void 0 || s.OAnimation !== void 0;
  return $(window).bind('keyup.vex', function (event) {
    if (event.keyCode === 27) {
      return vex.closeByEscape();
    }
  });
});

var vex = {
  globalID: 1,
  animationEndEvent: 'animationend webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend',
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
  open: function open(options) {
    options = $.extend({}, vex.defaultOptions, options);
    options.id = vex.globalID;
    vex.globalID += 1;
    options.$vex = $('<div>').addClass(vex.baseClassNames.vex).addClass(options.className).css(options.css).data({
      vex: options
    });
    options.$vexOverlay = $('<div>').addClass(vex.baseClassNames.overlay).addClass(options.overlayClassName).css(options.overlayCSS).data({
      vex: options
    });
    if (options.overlayClosesOnClick) {
      options.$vexOverlay.bind('click.vex', function (e) {
        if (e.target !== undefined) {
          return;
        }
        return vex.close($(undefined).data().vex.id);
      });
    }
    options.$vex.append(options.$vexOverlay);
    options.$vexContent = $('<div>').addClass(vex.baseClassNames.content).addClass(options.contentClassName).css(options.contentCSS).append(options.content).data({
      vex: options
    });
    options.$vex.append(options.$vexContent);
    if (options.showCloseButton) {
      options.$closeButton = $('<div>').addClass(vex.baseClassNames.close).addClass(options.closeClassName).css(options.closeCSS).data({
        vex: options
      }).bind('click.vex', function () {
        return vex.close($(undefined).data().vex.id);
      });
      options.$vexContent.append(options.$closeButton);
    }
    $(options.appendLocation).append(options.$vex);
    vex.setupBodyClassName(options.$vex);
    if (options.afterOpen) {
      options.afterOpen(options.$vexContent, options);
    }
    setTimeout(function () {
      return options.$vexContent.trigger('vexOpen', options);
    }, 0);
    return options.$vexContent;
  },
  getSelectorFromBaseClass: function getSelectorFromBaseClass(baseClass) {
    return "." + baseClass.split(' ').join('.');
  },
  getAllVexes: function getAllVexes() {
    return $("." + vex.baseClassNames.vex + ":not(\"." + vex.baseClassNames.closing + "\") " + vex.getSelectorFromBaseClass(vex.baseClassNames.content));
  },
  getVexByID: function getVexByID(id) {
    return vex.getAllVexes().filter(function () {
      return $(this).data().vex.id === id;
    });
  },
  close: function close(id) {
    var $lastVex = undefined;
    if (!id) {
      $lastVex = vex.getAllVexes().last();
      if (!$lastVex.length) {
        return false;
      }
      id = $lastVex.data().vex.id;
    }
    return vex.closeByID(id);
  },
  closeAll: function closeAll() {
    var ids = undefined;
    ids = vex.getAllVexes().map(function () {
      return $(this).data().vex.id;
    }).toArray();
    if (!(ids != null ? ids.length : void 0)) {
      return false;
    }
    $.each(ids.reverse(), function (index, id) {
      return vex.closeByID(id);
    });
    return true;
  },
  closeByID: function closeByID(id) {
    var $vexContent = vex.getVexByID(id);
    if (!$vexContent.length) {
      return;
    }
    var $vex = $vexContent.data().vex.$vex;
    var options = $.extend({}, $vexContent.data().vex);
    var beforeClose = function beforeClose() {
      if (options.beforeClose) {
        return options.beforeClose($vexContent, options);
      }
    };
    var close = function close() {
      $vexContent.trigger('vexClose', options);
      $vex.remove();
      $('body').trigger('vexAfterClose', options);
      if (options.afterClose) {
        return options.afterClose($vexContent, options);
      }
    };
    if (animationEndSupport) {
      if (beforeClose() !== false) {
        $vex.unbind(vex.animationEndEvent).bind(vex.animationEndEvent, function () {
          return close();
        }).addClass(vex.baseClassNames.closing);
      }
    } else {
      if (beforeClose() !== false) {
        close();
      }
    }
    return true;
  },
  closeByEscape: function closeByEscape() {
    var ids = vex.getAllVexes().map(function () {
      return $(undefined).data().vex.id;
    }).toArray();
    if (!(ids != null ? ids.length : void 0)) {
      return false;
    }
    var id = Math.max.apply(Math, ids);
    var $lastVex = vex.getVexByID(id);
    if ($lastVex.data().vex.escapeButtonCloses !== true) {
      return false;
    }
    return vex.closeByID(id);
  },
  setupBodyClassName: function setupBodyClassName($vex) {
    return $('body').bind('vexOpen.vex', function () {
      return $('body').addClass(vex.baseClassNames.open);
    }).bind('vexAfterClose.vex', function () {
      if (!vex.getAllVexes().length) {
        return $('body').removeClass(vex.baseClassNames.open);
      }
    });
  },
  hideLoading: function hideLoading() {
    return $('.vex-loading-spinner').remove();
  },
  showLoading: function showLoading() {
    vex.hideLoading();
    return $('body').append("<div class=\"vex-loading-spinner " + vex.defaultOptions.className + "\"></div>");
  }
};
return vex;

}));
