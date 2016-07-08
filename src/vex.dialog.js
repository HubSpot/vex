var domify = require('domify')
var isDom = require('is-dom')
var serialize = require('form-serialize')

var vexDialogFactory = function (vex) {
  if (!vex) {
    throw new Error('Vex is required to use vex.dialog')
  }

  var getVexContentFromTarget = function (vexContent) {
    while (!vexContent.classList.contains('vex-content')) {
      if (!vexContent.parentNode) {
        throw new Error('Could not find vex-content')
      }
      vexContent = vexContent.parentNode
    }
    return vexContent
  }

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
        var id = parseInt(vexContent.getAttribute('data-vex-id'))
        vex.vexes[id].vex.value = false
        vex.close(id)
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
    onSubmit: function (e) {
      var vexContent = getVexContentFromTarget(event.target)
      var id = parseInt(vexContent.getAttribute('data-vex-id'))
      event.preventDefault()
      vex.vexes[id].value = serialize(e.target, { hash: true })
      return vex.close(id)
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
      vexContent.querySelector('button, input, textarea').focus()
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
    message.appendChild(isDom(options.message) ? options.message : domify(options.message))

    var input = document.createElement('div')
    input.classList.add('vex-dialog-input')
    input.appendChild(isDom(options.input) ? options.input : domify(options.input))

    form.appendChild(message)
    form.appendChild(input)
    form.appendChild(dialog.buttonsToDOM(options.buttons))
    form.addEventListener('submit', options.onSubmit)

    return form
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
        var vexContent = getVexContentFromTarget(e.target)
        if (this.click) {
          this.click(vexContent, e)
        }
      }.bind(button))
      domButtons.appendChild(domButton)
    }

    return domButtons
  }

  return dialog
}

module.exports = vexDialogFactory
