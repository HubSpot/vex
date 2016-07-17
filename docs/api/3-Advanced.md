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

**Breaking change:** inline CSS can no longer be included in options. Use CSS classes, instead.

Optional class names can be added to any of these elements by setting any the following options (with defaults shown):

```
className: ''
overlayClassName: ''
contentClassName: ''
closeClassName: ''
```

### API

#### Basics of Opening and Passing Content

To open a dialog, call `vex.open`.

```javascript
vex.open({
    content: '<div>Content</div>'
})
```

In addition, you can wait to append your content until after the dialog has opened. (Visually, it will be perceived the same way.)

```javascript
vex.open({
    afterOpen: function () {
        this.contentEl.appendChild(el)
    }
})
```

**Breaking change:** vexOpen and vexClose events are no longer emitted. Use the callbacks `afterOpen` and `afterClose`.

Also, since opening/closing is synchronous, you don't even have to wait for the vexOpen event. Just append right away!

```javascript
vex.open().contentEl.appendChild(el)
```

You can also close vex dialogs by id:
```javascript
var dialog = vex.open()
vex.close(dialog.id)
```

Or just the most recently opened vex:
```javascript
vex.closeTop()
```

Or all at once:
```javascript
vex.closeAll()
```

#### Options

When calling `vex.open()` you can pass a number of options to handle styling and certain behaviors.

Here are the defaults:

```javascript
defaultOptions: {
    content: '',
    showCloseButton: true,
    escapeButtonCloses: true,
    overlayClosesOnClick: true,
    appendLocation: 'body',
    className: '',
    overlayClassName: '',
    contentClassName: '',
    closeClassName: ''
}
```

### Note about Includes

To use vex, minimally, you must include:

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
