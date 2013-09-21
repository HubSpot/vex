## Advanced

### DOM Structure

When opening a dialog, vex appends the following HTML to `appendLocation` (which defaults to `body`).

```html
<div class="vex">
    <div class="vex-overlay"></div>
    <div class="vex-content">
        <div class="vex-close"></div>
    </div>
</div>
```

If `showCloseButton` is set to false, `<div class="vex-close"></div>` will be ommitted.

Optional class names or inline CSS can be added to any of these elements by setting any the following options (with defaults shown):

```
className: ''
css: {}
overlayClassName: ''
overlayCSS: {}
contentClassName: ''
contentCSS: {}
closeClassName: ''
closeCSS: {}
```

The CSS options take an object to be passed to jQuery's `.css` function.

### API

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

In addition, you can wait to append your content until after the dialog has opened. (Visually, it will be perceived the same way.)

```coffeescript
vex.open
    afterOpen: ($vexContent) ->
        # console.log $vexContent.data()
        $vexContent.append $el
    afterClose: ->
        console.log 'vexClose'
```

Instead of using callbacks, you can choose to chain off the open call and bind to vexOpen and vexClose events. For example:

```coffeescript
vex
    .open()
    .bind('vexOpen', (options) ->
        options.$vexContent.append $el
    )
    .bind('vexClose', ->
        console.log 'vexClose'
    )
```

Also, since opening/closing is synchronous, you don't even have to wait for the vexOpen event. Just append right away!

```coffeescript
vex.open().append($el).bind('vexClose', -> console.log 'vexClose')
```

You can also close vex dialogs by id:
```coffeescript
$vexContent = vex.open()
vex.close($vexContent.data().vex.id)
```

#### Options

When calling `vex.open()` you can pass a number of options to handle styling and certain behaviors.

Here are the defaults:

```coffeescript
defaultOptions:
    content: ''
    showCloseButton: true
    escapeButtonCloses: true
    overlayClosesOnClick: true
    appendLocation: 'body'
    className: ''
    css: {}
    overlayClassName: ''
    overlayCSS: {}
    contentClassName: ''
    contentCSS: {}
    closeClassName: ''
    closeCSS: {}
```

### Note about Includes

To use Vex, minimally, you must include:

```html
<script src="vex.js"></script>
<link rel="stylesheet" href="vex.css" />
```

We also recommend including `vex.dialog.js` and a theme file. However, these are not actually required. To include both `vex.js` and `vex.dialog.js`, use `vex.combined.js` (or `vex.combined.min.js`). All of these files can be found in the ZIP which you can [download here](/vex).

<!-- Resources for the demos -->
<p style="-webkit-transform: translateZ(0)"></p>
<script src="/vex/js/vex.js"></script>
<script src="/vex/js/vex.dialog.js"></script>
<link rel="stylesheet" href="/vex/css/vex.css" />
<link rel="stylesheet" href="/vex/css/vex-theme-os.css">
<script>
    (function(){
        vex.defaultOptions.className = 'vex-theme-os';
    })();
</script>