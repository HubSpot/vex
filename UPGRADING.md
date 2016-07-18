## Upgrade guide to vex 3

#### 1. The `css`, `overlayCSS`, `contentCSS`, and `closeCSS` options have been removed

Use CSS classes in your stylesheets and the appropriate `ClassName` options. Depending on how the CSS options were being used, support may be re-added in the future.

#### 2. `vexOpen` and `vexClose` events are no longer emitted

These depended on jQuery's event system, and it would be too much overhead to include a similar system with vex 3. Use the callbacks `afterOpen` and `afterClose`, passed in with the other options.

#### 3. The return value of `vex.open()` is no longer a jQuery element, but a "vex instance" with its own API

For documentation of this API, see [the docs](/docs/api/3-Advanced.md).

#### 4. `vex.dialog` has been replaced by its plugin counterpart, [`vex-dialog`](https://github.com/bbatliner/vex-dialog)

While you can still use `vex.combined.js`, inclusion of vex in build systems such as Browserify or Webpack will require some changes.

Previously, using vex and vex.dialog in a build system looked something like the following:

```javascript
var vex = require('vex-js')
vex.dialog = require('vex-js/js/vex.dialog')
```

Now, you should require `vex-dialog` separately, and register it as a plugin with vex:

```javascript
var vex = require('vex-js')
vex.registerPlugin(require('vex-dialog'))
```

