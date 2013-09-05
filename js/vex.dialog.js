(function() {
  var dialog;
  if (!window.vex) {
    return $.error('Vex is required to use vex.dialog');
  }
  dialog = {};
  dialog.buttons = {
    YES: {
      text: 'OK',
      type: 'submit',
      className: 'hs-button primary'
    },
    NO: {
      text: 'Cancel',
      type: 'button',
      className: 'hs-button secondary',
      click: function($vexContent, event) {
        $vexContent.data().vex.value = false;
        return vex.close($vexContent.data().vex.id);
      }
    }
  };
  dialog.defaultOptions = {
    callback: function(value) {
      if (console && console.log) {
        return console.log('Vex dialog callback:', value);
      }
    },
    afterOpen: function() {},
    className: 'vex-content-auto',
    css: {
      width: 400
    },
    message: 'Message',
    input: "<input name=\"vex\" type=\"hidden\" value=\"false\" />",
    value: false,
    buttons: [dialog.buttons.YES, dialog.buttons.NO],
    onSubmit: function() {
      event.preventDefault();
      event.stopPropagation();
      $vexContent.data().vex.value = dialog.getFormValueOnSubmit($form.serializeObject());
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
  dialog.defaultPromptOptions = {
    message: "<label for=\"vex\">Prompt:</label>",
    input: "<input name=\"vex\" type=\"text\" class=\"hs-input\" />"
  };
  dialog.open = function(options) {
    var $vexContent;
    options = $.extend({}, vex.defaultOptions, dialog.defaultOptions, options);
    options.content = dialog.buildDialogForm(options);
    options.beforeClose = function($vexContent) {
      return options.callback($vexContent.data().vex.value);
    };
    $vexContent = vex.open(options);
    if (options.focusFirstInput) {
      return $vexContent.find('input[type="text"], input[type="submit"]').first().focus();
    }
  };
  dialog.alert = function(options) {
    if (typeof options === 'string') {
      options = {
        message: options
      };
    }
    options = $.extend({}, vex.dialog.defaultAlertOptions, options);
    return vex.dialog.open(options);
  };
  dialog.confirm = function(options) {
    if (typeof options === 'string') {
      options = {
        message: options
      };
    }
    options = $.extend({}, vex.dialog.defaultConfirmOptions, options);
    return vex.dialog.open(options);
  };
  dialog.prompt = function(options) {
    if (typeof options === 'string') {
      return $.error('vex.dialog.prompt(options) requires options.callback.');
    }
    options = $.extend({}, vex.dialog.defaultPromptOptions, options);
    return vex.dialog.open(options);
  };
  dialog.buildDialogForm = function(options) {
    var $form;
    $form = $('<form class="vex-dialog-form" />');
    $form.append(options.message).append(options.input).append(dialog.buttonsToDOM(options.buttons)).bind('submit.vex', options.onSubmit);
    return $form;
  };
  dialog.getFormValueOnSubmit = function(formData) {
    var value;
    if (formData.vex) {
      value = formData.vex;
      if (value === false) {
        value = true;
      }
      if (value === 'true') {
        return true;
      }
      if (value === 'false') {
        return false;
      }
      return value;
    } else {
      return formData;
    }
  };
  dialog.buttonsToDOM = function(buttons) {
    var $buttons;
    $buttons = $('<div class="vex-dialog-buttons" />');
    $.each(buttons, function(index, button) {
      return $buttons.append($("<input type=\"" + button.type + "\" />").val(button.text).addClass(button.className + ' vex-dialog-button ' + (index === 0 ? 'vex-first ' : '') + (index === buttons.length - 1 ? 'vex-last ' : '')).bind('click.vex', function(e) {
        if (button.click) {
          return button.click($(this).parents("." + vex.baseClassNames.content), e);
        }
      }));
    });
    return $buttons;
  };
  window.vex.dialog = dialog;
}).call(this);
