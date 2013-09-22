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
        callback: (value) -> console.log('Vex dialog callback:', value) if console and console.log
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

        options.beforeClose = ($vexContent) ->
            options.callback $vexContent.data().vex.value

        $vexContent = vex.open options

        if options.focusFirstInput
            $vexContent.find('input[type="text"], input[type="submit"]').first().focus()

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
            input: """<input name="vex" type="text" class="vex-dialog-prompt-input" placeholder="#{ options.placeholder or '' }" />"""

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
        if formData.vex
            return true if formData.vex is '_vex-empty-value'
            return formData.vex

        else
            return formData

    dialog.buttonsToDOM = (buttons) ->
        $buttons = $('<div class="vex-dialog-buttons" />')

        $.each buttons, (index, button) ->
            $buttons.append $("""<input type="#{button.type}" />""")
                .val(button.text)
                .addClass(button.className + ' vex-dialog-button ' + (if index is 0 then 'vex-first ' else '') + (if index is buttons.length - 1 then 'vex-last ' else ''))
                .bind('click.vex', (e) -> button.click($(@).parents(".#{vex.baseClassNames.content}"), e) if button.click)

        return $buttons

    # return dialog from factory
    dialog


if typeof define is 'function' and define.amd
    # AMD
    define ['jquery', 'vex'], vexDialogFactory
else if typeof exports is 'object'
    # CommonJS
    module.exports = vexDialogFactory require('jquery'), require('vex')
else
    # Global
    window.vex.dialog = vexDialogFactory window.jQuery, window.vex
