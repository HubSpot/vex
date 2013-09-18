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

Let's jump right into a hot demo.

#### Demo

<a class="demo-confirm hs-brand-button">Destroy the planet</a>
<div class="demo-result-simple hs-doc-callout hs-doc-callout-info" style="display: none"></div>
<script>
$('.demo-confirm').click(function(){
    vex.dialog.confirm({
        message: 'Are you absolutely sure you want to destroy the alien planet?',
        callback: function(value) {
            $('.demo-result-simple').show().html('<h4>Result</h4><p>' + (value ? 'Successfully destroyed the planet.' : 'Chicken.') + '</p>');
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

### Demo

<a class="demo hs-brand-button">Log in</a>
<div class="demo-result hs-doc-callout hs-doc-callout-info" style="display: none"></div>
<script>
    $('.demo').click(function(){
        vex.dialog.open({
            message: 'Enter your username and password:',
            input: '' +
                '<input name="username" type="text" placeholder="Username" />' +
                '<input name="password" type="password" placeholder="Password" />' +
            '',
            buttons: [
                $.extend({}, vex.dialog.buttons.YES, { text: 'Login' }),
                $.extend({}, vex.dialog.buttons.NO, { text: 'Back' })
            ],
            callback: function (data) {
                $('.demo-result').show().html('' +
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
        <input name="username" type="text" placeholder="Username" />
        <input name="password" type="password" placeholder="Password" />
    """
    buttons: [
        $.extend({}, vex.dialog.buttons.YES, text: 'Login')
        $.extend({}, vex.dialog.buttons.NO, text: 'Back')
    ]
    callback: (data) ->
        return console.log('Cancelled') if data is false
        console.log 'Username', data.username, 'Password', data.password
```

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