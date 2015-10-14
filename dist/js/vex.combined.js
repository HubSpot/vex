/*! vex-js 2.3.2 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(factory);
  } else if (typeof exports === 'object') {
    module.exports = factory(require, exports, module);
  } else {
    root.Vex = factory();
  }
}(this, function(require, exports, module) {

'use strict';

function vexFactory($) {
  var _this = this;

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
          if (e.target !== _this) {
            return;
          }
          return vex.close($(_this).data().vex.id);
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
          return vex.close($(_this).data().vex.id);
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
        return $(_this).data().vex.id;
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
}

if (typeof define === 'function' && define.amd) {
  define(['jquery'], vexFactory);
} else if (typeof exports === 'object') {
  module.exports = vexFactory(require('jquery'));
} else {
  window.vex = vexFactory(jQuery);
}
'use strict';

function vexDialogFactory($, vex) {
  var _this = this;

  if (typeof vex === 'undefined') {
    throw new Error('You must include Vex to use vex.dialog');
  }

  $formToObject = function ($form) {
    var object = {};
    $.each($form.serializeArray(), function () {
      if (object[_this.name]) {
        object[_this.name] = !object[_this.name].push ? [object[_this.name]] : object[_this.name];
        return object[_this.name].push(_this.value || '');
      } else {
        return object[_this.name] = _this.value || '';
      }
    });
    return object;
  };

  var dialog = {};

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
      click: function click($vexContent, event) {
        $vexContent.data().vex.value = false;
        return vex.close($vexContent.data().vex.id);
      }
    }
  };

  dialog.defaultOptions = {
    callback: function callback(value) {},
    afterOpen: function afterOpen() {},
    message: 'Message',
    input: "<input name=\"vex\" type=\"hidden\" value=\"_vex-empty-value\" />",
    value: false,
    buttons: [dialog.buttons.YES, dialog.buttons.NO],
    showCloseButton: false,
    onSubmit: function onSubmit(event) {
      var $form = $(_this);
      var $vexContent = $form.parent();
      event.preventDefault();
      event.stopPropagation();
      $vexContent.data().vex.value = dialog.getFormValueOnSubmit($formToObject($form));
      return vex.close($vexContent.data().vex.id);
    },
    focusFirstInput: true
  };

  dialog.defaultAlertOptions = {
    message: 'Alert',
    buttons: [dialog.buttons.YES]
  };

  dialog.defaultConfirmOptions = {
    message: 'Confirm'
  };

  dialog.open = function (options) {
    var $vexContent, beforeClose;
    options = $.extend({}, vex.defaultOptions, dialog.defaultOptions, options);
    options.content = dialog.buildDialogForm(options);
    beforeClose = options.beforeClose;
    options.beforeClose = function ($vexContent, config) {
      options.callback(config.value);
      return typeof beforeClose === "function" ? beforeClose($vexContent, config) : void 0;
    };
    $vexContent = vex.open(options);
    if (options.focusFirstInput) {
      $vexContent.find('button[type="submit"], button[type="button"], input[type="submit"], input[type="button"], textarea, input[type="date"], input[type="datetime"], input[type="datetime-local"], input[type="email"], input[type="month"], input[type="number"], input[type="password"], input[type="search"], input[type="tel"], input[type="text"], input[type="time"], input[type="url"], input[type="week"]').first().focus();
    }
    return $vexContent;
  };

  dialog.alert = function (options) {
    if (typeof options === 'string') {
      options = {
        message: options
      };
    }
    options = $.extend({}, dialog.defaultAlertOptions, options);
    return dialog.open(options);
  };

  dialog.confirm = function (options) {
    if (typeof options === 'string') {
      return $.error('dialog.confirm(options) requires options.callback.');
    }
    options = $.extend({}, dialog.defaultConfirmOptions, options);
    return dialog.open(options);
  };

  dialog.prompt = function (options) {
    var defaultPromptOptions;
    if (typeof options === 'string') {
      return $.error('dialog.prompt(options) requires options.callback.');
    }
    defaultPromptOptions = {
      message: "<label for=\"vex\">" + (options.label || 'Prompt:') + "</label>",
      input: "<input name=\"vex\" type=\"text\" class=\"vex-dialog-prompt-input\" placeholder=\"" + (options.placeholder || '') + "\"  value=\"" + (options.value || '') + "\" />"
    };
    options = $.extend({}, defaultPromptOptions, options);
    return dialog.open(options);
  };

  dialog.buildDialogForm = function (options) {
    var $form, $input, $message;
    $form = $('<form class="vex-dialog-form" />');
    $message = $('<div class="vex-dialog-message" />');
    $input = $('<div class="vex-dialog-input" />');
    $form.append($message.append(options.message)).append($input.append(options.input)).append(dialog.buttonsToDOM(options.buttons)).bind('submit.vex', options.onSubmit);
    return $form;
  };

  dialog.getFormValueOnSubmit = function (options) {
    if (formData.vex || formData.vex === '') {
      if (formData.vex === '_vex-empty-value') {
        return true;
      }
      return formData.vex;
    } else {
      return formData;
    }
  };

  dialog.buttonsToDOM = function (buttons) {
    var $buttons;
    $buttons = $('<div class="vex-dialog-buttons" />');
    $.each(buttons, function (index, button) {
      var $button;
      $button = $("<button type=\"" + button.type + "\"></button>").text(button.text).addClass(button.className + ' vex-dialog-button ' + (index === 0 ? 'vex-first ' : '') + (index === buttons.length - 1 ? 'vex-last ' : '')).bind('click.vex', function (e) {
        if (button.click) {
          return button.click($(_this).parents(vex.getSelectorFromBaseClass(vex.baseClassNames.content)), e);
        }
      });
      return $button.appendTo($buttons);
    });
    return $buttons;
  };

  return dialog;
}

if (typeof define === 'function' && define.amd) {
  define(['jquery', 'vex'], vexDialogFactory);
} else if (typeof exports === 'object') {
  module.exports = vexDialogFactory(require('jquery'), require('./vex.js'));
} else {
  window.vex.dialog = vexDialogFactory(window.jQuery, window.vex);
}
return Vex;

}));
