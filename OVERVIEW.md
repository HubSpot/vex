## vex-nojquery

Dialogs for the 21st century.

### [Demo](http://github.hubspot.com/vex/docs/welcome/) — [Documentation](http://github.hubspot.com/vex/)

### Take control of your dialogs

Vex is a modern dialog library which is highly configurable, easily stylable, and gets out of the way. You'll love vex because it's tiny (`10.2kb` minified, `3.8kb` minified + gzipped), has a clear and simple API, works on mobile devices, and can be customized to match your style in seconds.

#### Features

- Drop-in replacement for `alert`, `confirm`, and `prompt`
- Easilly configurable animations which are smooth as butter
- Tiny footprint
- Looks and behaves great on mobile devices
- (TODO) Open multiple dialogs at once and close them individually or all at once
- (TODO) Built in CSS spinner for asynchronous dialogs

#### Documentation

- [Documentation Home](http://github.hubspot.com/vex/).
- [Vex Documentation](http://github.hubspot.com/vex/api/vex/).
- [Vex Dialog Documentation](http://github.hubspot.com/vex/api/vex_dialog/).

### How To Use Vex

#### Basics of Opening and Passing Content

Create a Vex object by calling `Vex()`.

```javascript
var dialog = Vex()
```

To open a dialog, call `Vex().open`.

```javascript
dialog.open({
    content: 'Hello, World!'
})
```

The user can close the dialog manually, or you can call `Vex().close`.

```javascript
dialog.close()
```

Read more about Vex in the [API docs](http://github.hubspot.com/vex/api/vex/).

#### Vex Dialog

Included by default, Vex Dialog is a plugin for Vex that contains dropin replacements for `alert`, `confirm`, and `prompt`.

### API

Vex Dialog exposes four main methods:

- `Vex.Dialog().alert(stringOrOptions)`
- `Vex.Dialog().confirm(options)`
- `Vex.Dialog().prompt(options)`
- `Vex.Dialog().open(options)`

Read more about Vex Dialog in the [API docs](http://github.hubspot.com/vex/api/vex_dialog/).

#### Options

When calling `Vex().open` you can pass a number of options to handle styling and certain behaviors.

Here are the defaults:

```javascript
defaultOptions = {
  content: '',
  showCloseButton: true,
  escapeButtonCloses: true,
  overlayClosesOnClick: true,
  appendLocation: 'body',
  className: '',
  css: {},
  overlayClassName: '',
  overlayCSS: {},
  contentClassName: '',
  contentCSS: {},
  closeClassName: '',
  closeCSS: {}
}
```