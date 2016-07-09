var domify = require('domify')
var isDom = require('is-dom')
var serialize = require('form-serialize')

var buildDialogForm = function (options) {
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
  form.appendChild(buttonsToDOM.call(this, options.buttons))
  form.addEventListener('submit', options.onSubmit.bind(this))

  return form
}

var buttonsToDOM = function (buttons) {
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
    // Attach click listener to button with closure
    (function (button) {
      domButton.addEventListener('click', function (e) {
        if (button.click) {
          button.click.call(this, e)
        }
      }.bind(this))
    }.bind(this)(button))

    domButtons.appendChild(domButton)
  }

  return domButtons
}

var Dialog = function (vex) {
  // Dialog plugin
  return {
    // Open
    open: function (opts) {
      var options = Object.assign({}, Dialog.defaultOptions, opts)

      // Build the form from the options
      this.form = options.content = buildDialogForm.call(this, options)

      // Override the before close callback to also pass the value of the form
      var beforeClose = options.beforeClose
      options.beforeClose = function () {
        options.callback(this.value || false)
        if (beforeClose) {
          beforeClose.call(this)
        }
      }.bind(this)

      // Open the dialog
      var dialog = vex.open(options)

      // Optionally focus the first input in the form
      if (options.focusFirstInput) {
        dialog.contentEl.querySelector('button, input, textarea').focus()
      }

      // For chaining
      return dialog
    },

    // Alert
    alert: function (options) {
      if (typeof options === 'string') {
        options = {
          message: options
        }
      }
      options = Object.assign({}, Dialog.defaultOptions, Dialog.defaultAlertOptions, options)
      return this.open(options)
    },

    // Confirm
    confirm: function (options) {
      if (typeof options === 'string') {
        throw new Error('Dialog.confirm(options) requires options.callback.')
      }
      options = Object.assign({}, Dialog.defaultOptions, Dialog.defaultConfirmOptions, options)
      return this.open(options)
    },

    // Prompt
    prompt: function (options) {
      if (typeof options === 'string') {
        throw new Error('Dialog.prompt(options) requires options.callback.')
      }
      var variableDefaults = {
        message: '<label for="vex">' + (options.label || 'Prompt:') + '</label>',
        input: '<input name="vex" type="text" class="vex-dialog-prompt-input" placeholder="' + (options.placeholder || '') + '" value="' + (options.value || '') + '" />'
      }
      options = Object.assign({}, Dialog.defaultOptions, Dialog.defaultPromptOptions, options, variableDefaults)
      return this.open(options)
    }
  }
}

Dialog.buttons = {
  YES: {
    text: 'OK',
    type: 'submit',
    className: 'vex-dialog-button-primary'
  },

  NO: {
    text: 'Cancel',
    type: 'button',
    className: 'vex-dialog-button-secondary',
    click: function () {
      this.close()
    }
  }
}

Dialog.defaultOptions = {
  callback: function () {},
  afterOpen: function () {},
  message: 'Message',
  input: '<input name="vex" type="hidden" value="_vex-empty-value" />',
  buttons: [
    Dialog.buttons.YES,
    Dialog.buttons.NO
  ],
  showCloseButton: false,
  onSubmit: function (e) {
    e.preventDefault()
    this.value = serialize(this.form, { hash: true })
    return this.close()
  },
  focusFirstInput: true
}

Dialog.defaultAlertOptions = {
  message: 'Alert',
  buttons: [
    Dialog.buttons.YES
  ]
}

Dialog.defaultPromptOptions = {}

Dialog.defaultConfirmOptions = {
  message: 'Confirm'
}

// var plugin = function (Vex) {
//   if (!Vex) {
//     throw new Error('Vex not found.')
//   }
//   var proto = Vex()
//   var Dialog = function () {
//     return Object.assign(Object.create(proto), {
//       open: function (options) {
//         options = Object.assign({}, Dialog.defaultOptions, options)
//         this.form = options.content = buildDialogForm.call(this, options)

//         var beforeClose = options.beforeClose
//         options.beforeClose = function () {
//           options.callback(this.value || false)
//           if (beforeClose) {
//             beforeClose.call(this)
//           }
//         }

//         var vex = proto.open(options)

//         if (options.focusFirstInput) {
//           vex.contentEl.querySelector('button, input, textarea').focus()
//         }

//         return vex
//       },

//       alert: function (options) {
//         if (typeof options === 'string') {
//           options = {
//             message: options
//           }
//         }
//         options = Object.assign({}, Dialog.defaultOptions, Dialog.defaultAlertOptions, options)
//         return this.open(options)
//       },

//       confirm: function (options) {
//         if (typeof options === 'string') {
//           throw new Error('Dialog.confirm(options) requires options.callback.')
//         }
//         options = Object.assign({}, Dialog.defaultOptions, Dialog.defaultConfirmOptions, options)
//         return this.open(options)
//       },

//       prompt: function (options) {
//         if (typeof options === 'string') {
//           throw new Error('Dialog.prompt(options) requires options.callback.')
//         }
//         var variableDefaults = {
//           message: '<label for="vex">' + (options.label || 'Prompt:') + '</label>',
//           input: '<input name="vex" type="text" class="vex-dialog-prompt-input" placeholder="' + (options.placeholder || '') + '" value="' + (options.value || '') + '" />'
//         }
//         options = Object.assign({}, Dialog.defaultOptions, Dialog.defaultPromptOptions, options, variableDefaults)
//         return this.open(options)
//       }
//     })
//   }

//   Dialog.buttons = {
//     YES: {
//       text: 'OK',
//       type: 'submit',
//       className: 'vex-dialog-button-primary'
//     },

//     NO: {
//       text: 'Cancel',
//       type: 'button',
//       className: 'vex-dialog-button-secondary',
//       click: function () {
//         this.close()
//       }
//     }
//   }

//   Dialog.defaultOptions = {
//     callback: function () {},
//     afterOpen: function () {},
//     message: 'Message',
//     input: '<input name="vex" type="hidden" value="_vex-empty-value" />',
//     buttons: [
//       Dialog.buttons.YES,
//       Dialog.buttons.NO
//     ],
//     showCloseButton: false,
//     onSubmit: function (e) {
//       e.preventDefault()
//       this.value = serialize(this.form, { hash: true })
//       return this.close()
//     },
//     focusFirstInput: true
//   }

//   Dialog.defaultAlertOptions = {
//     message: 'Alert',
//     buttons: [
//       Dialog.buttons.YES
//     ]
//   }

//   Dialog.defaultPromptOptions = {}

//   Dialog.defaultConfirmOptions = {
//     message: 'Confirm'
//   }

//   return Dialog
// }

module.exports = Dialog
