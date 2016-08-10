## Plugins

vex has support for plugins that can extend and modify the behavior of vex.
Plugins are a great way to extend the functionality of vex while keeping your dependencies lightweight.
For these examples, we'll be using [vex-dialog](https://github.com/bbatliner/vex-dialog), a plugin for vex that contains dropin replacements for `alert`, `confirm`, and `prompt`.

### Installing plugins

Plugins can be published individually to package managers such as npm or bower, or included locally. For vex-dialog, we'll use npm.

```
npm install --save vex-dialog
```

### Registering plugins

All plugins must be registered with the main vex module.

```javascript
var vex = require('vex-js') // or window.vex, if included via script tag
vex.registerPlugin(require('vex-dialog')) // or window.vexDialog, if included via script tag

// The plugin is registered under the vex namespace.
vex.dialog.alert('I was made by a plugin!')
```

### Writing your own plugins

A vex plugin is a simple function that returns an object containing that plugin's functionality. The 

For example, here is a basic plugin that will log a message every time a vex is opened using the plugin:

```javascript
var myFirstPlugin = function (vex) {
    return {
        name : 'helloWorld',
        open : function (options) {
            console.log('you opened a vex with a plugin!')
            return vex.open(options)
        }
    }
}
```

Then, register your plugin with vex:

```javascript
vex.registerPlugin(myFirstPlugin)
vex.helloWorld.open('Hello!') // logs 'you opened a vex with a plugin!'
// also opens a vex!
```

### List of plugins

- [vex-dialog](https://github.com/bbatliner/vex-dialog)
