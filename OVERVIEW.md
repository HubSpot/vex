## vex

Dialogs for the 21st century.

### [Demo](http://github.hubspot.com/vex/docs/welcome/) — [Documentation](http://github.hubspot.com/vex/)

### Take control of your dialogs

Vex is a modern dialog library which is highly configurable, easily stylable, and gets out of the way. You'll love vex because it's tiny (`6kb` minified, `2kb` minified+gz), has a clear and simple API, works on mobile devices, and can be customized to match your style in seconds.

#### Features

- Drop-in replacement for `alert`, `confirm`, and `prompt`
- Easilly configurable animations which are smooth as butter
- Tiny footprint (`6kb` minified) and only depends on `jQuery`
- Looks and behaves great on mobile devices
- Open multiple dialogs at once and close them individually or all at once
- Built in CSS spinner for asynchronous dialogs

#### Documentation

- [Documentation Home](http://github.hubspot.com/vex/).
- [Vex Documentation](http://github.hubspot.com/vex/api/vex/).
- [Vex Dialog Documentation](http://github.hubspot.com/vex/api/vex_dialog/).

### How To Use Vex

#### Basics of Opening and Passing Content

To open a dialog, call `vex.open`.

```coffeescript
vex.open
    content: '<div>Content</div>'
    afterOpen: ($vexContent) ->
        # console.log $vexContent.data().vex
        $vexContent.append $el
    afterClose: ->
        console.log 'vexClose'
```

Instead of using callbacks, you can choose to chain off the open call and bind to vexOpen and vexClose events. For example:

```coffeescript
vex
    .open()
    .append($el)
    .bind('vexOpen', (options) ->
        options.$vexContent.append $el
    )
    .bind('vexClose', ->
        console.log 'vexClose'
    )
```

Read more about Vex in the [API docs](http://github.hubspot.com/vex/api/vex/).

#### Vex Dialog

When including `vex.dialog`, you get dropin replacements for `alert`, `confirm`, and `prompt`.

```html
<script src="vex.dialog.js"></script>
```

### API

Vex Dialog exposes 4 main apis:

- `vex.dialog.alert(stringOrOptions)`
- `vex.dialog.confirm(options)`
- `vex.dialog.prompt(options)`
- `vex.dialog.open(options)`

(Internally, `alert`, `confirm`, and `prompt` call `open` with a different compositions of options.)

Read more about Vex dialog in the [API docs](http://github.hubspot.com/vex/api/vex_dialog/).

#### Options

When calling `vex.open()` you can pass a number of options to handle styling and certain behaviors.

Here are the defaults:

```coffeescript
defaultOptions:
    content: ''
    showCloseButton: true
    overlayClosesOnClick: true
    appendLocation: 'body'
    className: ''
    css: {}
    overlayClassName: ''
    overlayCSS: {}
    closeClassName: ''
    closeCSS: {}
```