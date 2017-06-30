## Advanced

### DOM Structure

When opening an instance, vex appends the following HTML to `appendLocation` (which defaults to `body`).

```html
<div class="vex-overlay"></div>
<div class="vex">
    <div class="vex-content">
        <div class="vex-close"></div>
    </div>
</div>
```

If `showCloseButton` is set to false, `<div class="vex-close"></div>` will be ommitted.

Optional class names can be added to any of these elements by setting any the following options (with defaults shown):

```
className: ''
overlayClassName: ''
contentClassName: ''
closeClassName: ''
```

### vex API

#### `vex.open(stringOrOptions)`

Returns: a vex instance

Opens an instance. The content of the instance is either the string passed in to `vex.open` or the `content`/`unsafeContent` option.
The default options are documented below.

#### `vex.close(vexInstanceOrId)`

Returns: a boolean indicating whether the instance could be closed

Closes a vex instance. Pass either a vex instance or a numeric id, and vex will try to close the instance.
Closing an instance will remove it from vex's internal lookup table to save memory, meaning after an instance is closed it will not be retrievable from either `vex.getAll()` or `vex.getById()`.

#### `vex.closeTop()`

Returns: a boolean indicating whether the top instance could be closed

Closes the most recently opened instance (on top).

#### `vex.closeAll()`

Returns: `true`

Closes all vex instances.

#### `vex.getById(id)`

Returns: a vex instance or `undefined`

Gets a single vex instance by its id.

#### `vex.getAll()`

Returns: an object whose keys are ids and values are vex instances mapped to those ids

Gets all open vex instances.

### vex instance API

A vex instance is returned from `vex.open`.

#### `vexInstance.close()`

Returns: a boolean indicating whether the instance could be closed

Closes this vex. Closing a vex instance will remove it from vex's internal lookup table to save memory, meaning after a vex is closed it will not be retrievable from either `vex.getAll()` or `vex.getById()`.

#### `vexInstance.id`

The id assigned to this instance by vex. Used for getting and closing instances.

#### `vexInstance.rootEl`

The root DOM element (`div.vex`).

#### `vexInstance.overlayEl`

The overlay DOM element (`div.vex-overlay`).

#### `vexInstance.contentEl`

The content DOM element (`div.vex-content`).

#### `vexInstance.closeEl`

The close button DOM element (`div.vex-close`).

#### `vexInstance.isOpen`

A boolean indicating whether the instance is open/visible.

#### Options

When calling `vex.open()` you can pass a number of options to handle styling and certain behaviors.

Here are the defaults:

```javascript
defaultOptions: {
    content: '',
    unsafeContent: '',
    showCloseButton: true,
    escapeButtonCloses: true,
    overlayClosesOnClick: true,
    appendLocation: 'body',
    className: '',
    overlayClassName: '',
    contentClassName: '',
    closeClassName: '',
    closeAllOnPopState:true
}
```

vex provides *safe by default* behavior by treating the `content` you provide as a regular string, not raw HTML.

If you need to pass through HTML to your vex instances, use the `unsafeContent` option.
The `unsafeContent` option is safe to use as long as you provide either static HTML *or* HTML-escape ([html-escape](https://www.npmjs.com/package/html-escape), [_.escape](https://lodash.com/docs#escape), etc.) any untrusted content passed through, such as user-supplied content.

In addition to these string options, there are also three callback functions you can optionally provide:

- `afterOpen` is called immediately after the vex instance is appended to the DOM
- `afterClose` is called immediately after the vex instance is removed from the DOM
- `beforeClose` is called before removing the instance from the DOM, and should return a boolean. If `beforeClose` returns false, the close will not go through and the vex instance will remain open. Useful for validation or any other checks you need to perform.

Each callback is called with the context of the vex instance. That is, the keyword `this` inside of these callback functions references the vex instance.

Lastly, when using single-page applications, the default behavior is for vex to close all open dialogs on state transitions. 
Setting `closeAllOnPopState` to `false` will allow these dialogs to persist across state changes. 

### Note about Includes

To use vex, minimally, you must include:

```html
<script src="vex.js"></script>
<link rel="stylesheet" href="vex.css" />
```

We also recommend including `vex-dialog` and a theme file. However, these are not actually required. To include both `vex` and `vex-dialog`, use `vex.combined.js` (or `vex.combined.min.js`). All of these files can be found in the ZIP which you can [download here](/vex).

<!-- Resources for the demos -->
<p style="-webkit-transform: translateZ(0)"></p>
<script src="/vex/dist/js/vex.combined.js"></script>
<link rel="stylesheet" href="/vex/dist/css/vex.css" />
<link rel="stylesheet" href="/vex/dist/css/vex-theme-os.css">
<script>
    (function(){
        vex.defaultOptions.className = 'vex-theme-os';
    })();
</script>
