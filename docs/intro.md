## vex

### Take control of your dialogs

vex is a modern dialog library which is highly configurable, easily stylable, and gets out of the way. You'll love vex because it's tiny (`5.5kb` minified and gzipped), has a clear and simple API, works on mobile devices, and can be customized to match your style in seconds.

#### Features

- Drop-in replacement for `alert`, `confirm`, and `prompt`
- Easily configurable animations which are smooth as butter
- Lightweight with no external dependencies
- Looks and behaves great on mobile devices
- Open multiple dialogs at once and close them individually or all at once
- UMD support

#### Requirements

- None!

#### Browser Support

vex will run in any ES5-compatible environment, and includes polyfills for `classList` and `Object.assign`.

This means the following browsers are compatible with vex:
- IE 9+
- Edge 13+
- Firefox 21+
- Chrome 23+
- Safari 6+
- Opera 15+

#### Including in your project

For the most common usage of vex, you'll want to include vex, vex-dialog, the vex CSS file, and a theme file.

For HTML includes:

```html
<script src="vex.combined.min.js"></script>
<script>vex.defaultOptions.className = 'vex-theme-os'</script>
<link rel="stylesheet" href="vex.css" />
<link rel="stylesheet" href="vex-theme-os.css" />
```

For browserify/webpack, you'll still need to include the stylesheets on your page, but you can setup vex in your scripts:

```html
<link rel="stylesheet" href="vex.css" />
<link rel="stylesheet" href="vex-theme-os.css" />
```

```javascript
var vex = require('vex-js')
vex.registerPlugin(require('vex-dialog'))
vex.defaultOptions.className = 'vex-theme-os'
```

That will give you all of the APIs for both vex and vex-dialog, and set you up with the "Operating System" theme. If you'd prefer another theme, check out [Themes](/vex/api/themes).

The `vex.combined.min.js` file includes:
- `vex.dialog.js` which adds the functionality that mimics the native browser alert, confirm, and prompt (everything you see in the [Basic docs](/vex/api/basic) examples).
- `vex.js` which is a lightweight barebones generic dialog wrapper. See the [Advanced usage docs](/vex/api/advanced) for more information.

<div class="hs-doc-callout hs-doc-callout-info">
<h4>Module Systems</h4>
<p>Note that when using a JavaScript module system like RequireJS or CommonJS, especially as part of a build system like Browserify or Webpack, you will not be able to use the <code>vex.combined.min.js</code> file. Instead, require <code>vex</code> and register the <code>vex-dialog</code> plugin.
</div>

#### Confirm Demo

One of the simplest ways to use vex is to call `vex.dialog.alert`, `vex.dialog.confirm`, or `vex.dialog.prompt`. In this demo, we're using `vex.dialog.confirm` to ask the user to confirm the answer to a simple question.

<a class="demo-confirm hs-brand-button">Destroy the planet</a>
<div class="demo-result-confirm hs-doc-callout hs-doc-callout-info" style="display: none"></div>
<script>
$('.demo-confirm').click(function(){
    vex.dialog.confirm({
        message: 'Are you absolutely sure you want to destroy the alien planet?',
        callback: function(value) {
            $('.demo-result-confirm').show().html('<h4>Result</h4><p>' + (value ? 'Successfully destroyed the planet.' : 'Chicken.') + '</p>');
        }
    });
});
</script>

Play with this demo:

```javascript
vex.dialog.confirm({
    message: 'Are you absolutely sure you want to destroy the alien planet?',
    callback: function (value) {
        if (value) {
            console.log('Successfully destroyed the planet.')
        } else {
            console.log('Chicken.')
        }
    }
})
```

#### Login Demo

Here's a more complex demo in which we use `vex.dialog.open` (a more generic method that `alert`, `confirm`, and `prompt` all call internally) to build a login dialog.

<a class="demo-login hs-brand-button">Log in</a>
<div class="demo-result-login hs-doc-callout hs-doc-callout-info" style="display: none"></div>
<script>
    $('.demo-login').click(function(){
        vex.dialog.open({
            message: 'Enter your username and password:',
            input: '' +
                '<input name="username" type="text" placeholder="Username" required />' +
                '<input name="password" type="password" placeholder="Password" required />' +
            '',
            buttons: [
                $.extend({}, vex.dialog.buttons.YES, { text: 'Login' }),
                $.extend({}, vex.dialog.buttons.NO, { text: 'Back' })
            ],
            callback: function (data) {
                $('.demo-result-login').show().html('' +
                    '<h4>Result</h4>' +
                    '<p>' +
                        'Username: <b>' + data.username + '</b><br/>' +
                        'Password: <b>' + data.password + '</b>' +
                    '</p>' +
                '')
            }
        });
    });
</script>

Play with this example:

```javascript
vex.dialog.open({
    message: 'Enter your username and password:',
    input: [
        '<input name="username" type="text" placeholder="Username" required />',
        '<input name="password" type="password" placeholder="Password" required />'
    ].join(''),
    buttons: [
        $.extend({}, vex.dialog.buttons.YES, { text: 'Login' }),
        $.extend({}, vex.dialog.buttons.NO, { text: 'Back' })
    ],
    callback: function (data) {
        if (!data) {
            console.log('Cancelled')
        } else {
            console.log('Username', data.username, 'Password', data.password)
        }
    }
})
```

#### Learn More

To learn more about how to use vex, visit our API pages.

- [Basic](http://github.hubspot.com/vex/api/basic)
- [Themes](http://github.hubspot.com/vex/api/themes)
- [Advanced](http://github.hubspot.com/vex/api/advanced)

#### Credits

vex was built by [Adam Schwartz](http://twitter.com/adamfschwartz)


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
