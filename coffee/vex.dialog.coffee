vexDialogFactory = ($, vex) ->

    return $.error('Vex is required to use vex.dialog') unless vex?

    $formToObject = ($form) ->
        object = {}
        $.each $form.serializeArray(), ->
            if object[@name]
                object[@name] = [object[@name]] if !object[@name].push
                object[@name].push(@value || '')
            else
                object[@name] = @value || '';
        object

    dialog = {}

    dialog.buttons =

        YES:
            text: 'OK'
            type: 'submit'
            className: 'vex-dialog-button-primary'

        NO:
            text: 'Cancel'
            type: 'button'
            className: 'vex-dialog-button-secondary'
            click: ($vexContent, event) ->
                $vexContent.data().vex.value = false
                vex.close $vexContent.data().vex.id

    dialog.defaultOptions =
        callback: (value) ->
        afterOpen: ->
        message: 'Message'
        input: """<input name="vex" type="hidden" value="_vex-empty-value" />"""
        value: false
        buttons: [
            dialog.buttons.YES
            dialog.buttons.NO
        ]
        showCloseButton: false
        onSubmit: (event) ->
            $form = $ @
            $vexContent = $form.parent()
            event.preventDefault()
            event.stopPropagation()
            $vexContent.data().vex.value = dialog.getFormValueOnSubmit $formToObject $form
            vex.close $vexContent.data().vex.id
        focusFirstInput: true

    dialog.defaultAlertOptions =
        message: 'Alert'
        buttons: [
            dialog.buttons.YES
        ]

    dialog.defaultConfirmOptions =
        message: 'Confirm'

    dialog.open = (options) ->
        options = $.extend {}, vex.defaultOptions, dialog.defaultOptions, options
        options.content = dialog.buildDialogForm options

        beforeClose = options.beforeClose
        options.beforeClose = ($vexContent, config) ->
            options.callback config.value
            beforeClose? $vexContent, config

        $vexContent = vex.open options

        if options.focusFirstInput
            $vexContent.find('button[type="submit"], button[type="button"], input[type="submit"], input[type="button"], textarea, input[type="date"], input[type="datetime"], input[type="datetime-local"], input[type="email"], input[type="month"], input[type="number"], input[type="password"], input[type="search"], input[type="tel"], input[type="text"], input[type="time"], input[type="url"], input[type="week"]').first().focus()

        return $vexContent

    dialog.alert = (options) ->
        if typeof options is 'string'
            options = message: options

        options = $.extend {}, dialog.defaultAlertOptions, options

        dialog.open options

    dialog.confirm = (options) ->
        if typeof options is 'string'
            return $.error('''dialog.confirm(options) requires options.callback.''')

        options = $.extend {}, dialog.defaultConfirmOptions, options

        dialog.open options

    dialog.prompt = (options) ->
        if typeof options is 'string'
            return $.error('''dialog.prompt(options) requires options.callback.''')

        defaultPromptOptions =
            message: """<label for="vex">#{ options.label or 'Prompt:' }</label>"""
            input: """<input name="vex" type="text" class="vex-dialog-prompt-input" placeholder="#{ options.placeholder or '' }"  value="#{ options.value or '' }" />"""

        options = $.extend {}, defaultPromptOptions, options

        dialog.open options

    dialog.buildDialogForm = (options) ->
        $form = $('<form class="vex-dialog-form" />')

        $message = $('<div class="vex-dialog-message" />')
        $input = $('<div class="vex-dialog-input" />')

        $form
            .append($message.append options.message)
            .append($input.append options.input)
            .append(dialog.buttonsToDOM options.buttons)
            .bind('submit.vex', options.onSubmit)

        return $form

    dialog.getFormValueOnSubmit = (formData) ->
        if formData.vex or formData.vex is ''
            return true if formData.vex is '_vex-empty-value'
            return formData.vex

        else
            return formData

    dialog.buttonsToDOM = (buttons) ->
        $buttons = $('<div class="vex-dialog-buttons" />')

        $.each buttons, (index, button) ->
            $button = $("""<button type="#{button.type}"></button>""")
                .text(button.text)
                .addClass(button.className + ' vex-dialog-button ' + (if index is 0 then 'vex-first ' else '') + (if index is buttons.length - 1 then 'vex-last ' else ''))
                .bind('click.vex', (e) -> button.click($(@).parents(vex.getSelectorFromBaseClass(vex.baseClassNames.content)), e) if button.click)

            $button.appendTo $buttons

        return $buttons

    # return dialog from factory
    dialog

if typeof define is 'function' and define.amd
    # AMD
    define ['jquery', 'vex'], vexDialogFactory
else if typeof exports is 'object'
    # CommonJS
    module.exports = vexDialogFactory require('jquery'), require('./vex.js')
else
    # Global
    window.vex.dialog = vexDialogFactory window.jQuery, window.vex
