/*! vex-js 2.3.2 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(factory);
  } else if (typeof exports === 'object') {
    module.exports = factory(require, exports, module);
  } else {
    root.vex.dialog = factory();
  }
}(this, function(require, exports, module) {

'use strict';

if (typeof vex === 'undefined') {
  throw new Error('You must include Vex to use vex.dialog');
}

var $formToObject = function $formToObject($form) {
  var object = {};
  $.each($form.serializeArray(), function () {
    if (object[undefined.name]) {
      object[undefined.name] = !object[undefined.name].push ? [object[undefined.name]] : object[undefined.name];
      return object[undefined.name].push(undefined.value || '');
    } else {
      return object[undefined.name] = undefined.value || '';
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
    var $form = $(undefined);
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
  options = $.extend({}, vex.defaultOptions, dialog.defaultOptions, options);
  options.content = dialog.buildDialogForm(options);
  var beforeClose = options.beforeClose;
  options.beforeClose = function ($vexContent, config) {
    options.callback(config.value);
    return typeof beforeClose === "function" ? beforeClose($vexContent, config) : void 0;
  };
  var $vexContent = vex.open(options);
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
  if (typeof options === 'string') {
    return $.error('dialog.prompt(options) requires options.callback.');
  }
  var defaultPromptOptions = {
    message: "<label for=\"vex\">" + (options.label || 'Prompt:') + "</label>",
    input: "<input name=\"vex\" type=\"text\" class=\"vex-dialog-prompt-input\" placeholder=\"" + (options.placeholder || '') + "\"  value=\"" + (options.value || '') + "\" />"
  };
  options = $.extend({}, defaultPromptOptions, options);
  return dialog.open(options);
};

dialog.buildDialogForm = function (options) {
  var $form = $('<form class="vex-dialog-form" />');
  var $message = $('<div class="vex-dialog-message" />');
  var $input = $('<div class="vex-dialog-input" />');
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
  var $buttons = $('<div class="vex-dialog-buttons" />');
  $.each(buttons, function (index, button) {
    var $button = $("<button type=\"" + button.type + "\"></button>").text(button.text).addClass(button.className + ' vex-dialog-button ' + (index === 0 ? 'vex-first ' : '') + (index === buttons.length - 1 ? 'vex-last ' : '')).bind('click.vex', function (e) {
      if (button.click) {
        return button.click($(undefined).parents(vex.getSelectorFromBaseClass(vex.baseClassNames.content)), e);
      }
    });
    return $button.appendTo($buttons);
  });
  return $buttons;
};
return dialog;

}));
