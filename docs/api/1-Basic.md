## Basic

### Dialog API

vex-dialog exposes 4 main apis:

- `vex.dialog.alert(stringOrOptions)`
- `vex.dialog.confirm(options)`
- `vex.dialog.prompt(options)`
- `vex.dialog.open(options)`

These all call the `vex.open` method with different combinations of options. [All of the options](/docs/api/3-Advanced.md#options) that `vex.open` supports are also supported here.

vex-dialog provides *safe by default* behavior by treating the `message` you provide as a regular string, not raw HTML.

If you need to pass through HTML to your dialog, use the `unsafeMessage` option.
The `unsafeMessage` option is safe to use as long as you provide either static HTML *or* HTML-escape ([html-escape](https://www.npmjs.com/package/html-escape), [_.escape](https://lodash.com/docs#escape), etc.) any untrusted content passed through, such as user-supplied content.

#### Alert

Use alerts when you want to display a message to the user, but you don't want to give them any choice to proceed.

<a class="demo-alert hs-brand-button">Open an alert</a>
<script>
$('.demo-alert').click(function(){
    vex.dialog.alert('Thanks for checking out vex!');
});
</script>

Play with this demo:

```javascript
vex.dialog.alert('Thanks for checking out vex!')
```

When passing a string, the text is interpreted as a string and HTML-escaped for safety.

If you want to pass HTML tags into the `alert()` method, you need to use the `unsafeMessage` option and handle any escaping of
potentially unsafe content you provide to this option:

```javascript
// This use of raw HTML is made safe because the HTML is static.
vex.dialog.alert({ unsafeMessage: '<b>Hello World!</b>' })

// This use of raw HTML is made safe because the Underscore escape method is used to escape potentially unsafe content.
vex.dialog.alert({ unsafeMessage: '<b>Hello ' + _.escape(user.firstName) + '!</b>' })
```

#### Confirm

Use confirms when you want to present a yes-or-no option to the user.

<a class="demo-confirm hs-brand-button">Open a confirm</a>
<div class="demo-result-confirm hs-doc-callout hs-doc-callout-info" style="display: none"></div>
<script>
$('.demo-confirm').click(function(){
    vex.dialog.confirm({
        message: 'Are you absolutely sure you want to destroy the alien planet?',
        callback: function(value) {
            $('.demo-result-confirm').html('Callback value: <b>' + value + '</b>').show();
        }
    });
});
</script>

Play with this demo:

```javascript
vex.dialog.confirm({
    message: 'Are you absolutely sure you want to destroy the alien planet?',
    callback: function (value) {
        console.log(value)
    }
})
```

`message` is interpreted as a string and HTML-escaped for safety. Explicitly use the `unsafeMessage` option instead when you need to pass raw HTML, making sure to HTML-escape any untrusted content (see above for example).

#### Prompt

<a class="demo-prompt hs-brand-button">Open a prompt</a>
<div class="demo-result-prompt hs-doc-callout hs-doc-callout-info" style="display: none"></div>
<script>
$('.demo-prompt').click(function(){
    vex.dialog.prompt({
        message: 'What planet did the aliens come from?',
        placeholder: 'Planet name',
        callback: function(value) {
            $('.demo-result-prompt').html('Callback value: <b>' + value + '</b>').show();
        }
    });
});
</script>

Play with this demo:

```javascript
vex.dialog.prompt({
    message: 'What planet did the aliens come from?',
    placeholder: 'Planet name',
    callback: function (value) {
        console.log(value)
    }
})
```

`message` is interpreted as a string and HTML-escaped for safety. Explicitly use the `unsafeMessage` option instead when you need to pass raw HTML, making sure to HTML-escape any untrusted content (see above for example).

#### Open

With `open`, you are in full control.

##### Inputs
You can specify your own form inputs, and the `name` attribute will be the property name of the data object passed in the callback.

##### Buttons
You can specify your own buttons if you want more options than just OK or Cancel. If you simply want to change the labels, you can override the default options for the following:

```javascript
vex.dialog.buttons.YES.text = 'Okiedokie'
vex.dialog.buttons.NO.text = 'Aahw hell no'
```

##### Demo

Putting this all together, let's create a dialog with the following customizations:

- Display a date input and a color input,
- Add an extra button which resets the color input to the default value (`#000`)
- Change the text for the OK button

<p>
<div class="demo-result-custom-vex-dialog hs-doc-callout hs-doc-callout-info" style="display: none"></div>
</p>

```javascript
todayDateString = new Date().toJSON().slice(0, 10)
vex.dialog.open({
    message: 'Select a date and color.',
    input: [
        '<style>',
            '.vex-custom-field-wrapper {',
                'margin: 1em 0;',
            '}',
            '.vex-custom-field-wrapper > label {',
                'display: inline-block;',
                'margin-bottom: .2em;',
            '}',
        '</style>',
        '<div class="vex-custom-field-wrapper">',
            '<label for="date">Date</label>',
            '<div class="vex-custom-input-wrapper">',
                '<input name="date" type="date" value="' + todayDateString + '" />',
            '</div>',
        '</div>',
        '<div class="vex-custom-field-wrapper">',
            '<label for="color">Color</label>',
            '<div class="vex-custom-input-wrapper">',
                '<input name="color" type="color" value="#ff00cc" />',
            '</div>',
        '</div>'
    ].join(''),
    callback: function (data) {
        if (!data) {
            return console.log('Cancelled')
        }
        console.log('Date', data.date, 'Color', data.color)
        $('.demo-result-custom-vex-dialog').show().html([
            '<h4>Result</h4>',
            '<p>',
                'Date: <b>' + data.date + '</b><br/>',
                'Color: <input type="color" value="' + data.color + '" readonly />',
            '</p>'
        ].join(''))
    }
})
```

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
