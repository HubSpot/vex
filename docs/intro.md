## Vex

### Take control of your dialogs

Vex is a modern dialog library which is highly configurable, easily stylable, and gets out of the way. You'll love vex because it's tiny (`6kb` minified), has a clear and simple API, works on mobile devices, and can be customized to match your style in seconds.

#### Features

- Drop-in replacement for `alert`, `confirm`, and `prompt`
- Easilly configurable animations which are smooth as butter
- Tiny footprint (`6kb` minified) and only depends on `jQuery`
- Looks and behaves great on mobile devices
- Open multiple dialogs at once and close them individually or all at once
- Built in CSS spinner for asynchronous dialogs
- AMD support

#### Requirements

- jQuery

#### Browser Support

- IE8+
- Firefox 4+
- Current WebKit (Chrome, Safari)
- Opera

#### Including

For the most common usage of Vex, you'll want to include following:

```html
<script src="vex.combined.min.js"></script>
<script>vex.defaultOptions.className = 'vex-theme-os';</script>
<link rel="stylesheet" href="vex.css" />
<link rel="stylesheet" href="vex-theme-os.css" />
```

That will give you all of the APIs for both Vex and Vex Dialog, and set you up with the "Operating System" theme. If you'd prefer another theme, check out [Themes](/vex/api/themes).

<div class="hs-doc-callout hs-doc-callout-info">
<h4>AMD / CommonJS</h4>
<p>Note that when using a javascript dependency manager like RequireJS or CommonJS, you will not be able to use the <code>vex.combined.min.js</code> file. Instead, require <code>vex.dialog</code> and/or <code>vex</code>. (If you only wish to use <code>vex.dialog</code>, you do not need to require <code>vex</code> yourself, as it itself requires <code>vex</code>.)</p>
</div>

#### Confirm Demo

One of the simplest ways to use Vex is to call `vex.dialog.alert`, `vex.dialog.confirm`, or `vex.dialog.prompt`. In this demo, we're using `vex.dialog.confirm` to ask the user to confirm the answer to a simple question.

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

```coffeescript
vex.dialog.confirm
    message: 'Are you absolutely sure you want to destroy the alien planet?'
    callback: (value) ->
        console.log if value then 'Successfully destroyed the planet.' else 'Chicken.'
```

#### Login Demo

Here's a more complex demo in which we use `vex.dialog.open` (a more generic method which `alert`, `confirm`, and `prompt` all call internally) to build a login dialog.

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

```coffeescript
vex.dialog.open
    message: 'Enter your username and password:'
    input: """
        <input name="username" type="text" placeholder="Username" required />
        <input name="password" type="password" placeholder="Password" required />
    """
    buttons: [
        $.extend({}, vex.dialog.buttons.YES, text: 'Login')
        $.extend({}, vex.dialog.buttons.NO, text: 'Back')
    ]
    callback: (data) ->
        return console.log('Cancelled') if data is false
        console.log 'Username', data.username, 'Password', data.password
```

#### Learn More

To learn more about how to use Vex, visit our API pages.

- [Basic](http://github.hubspot.com/vex/api/basic)
- [Themes](http://github.hubspot.com/vex/api/themes)
- [Advanced](http://github.hubspot.com/vex/api/advanced)

#### Credits

Vex was built by [Adam Schwartz](http://twitter.com/adamfschwartz)


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
