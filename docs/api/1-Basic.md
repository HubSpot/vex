## Basic

### Dialog API

Vex Dialog exposes 4 main apis:

- `vex.dialog.alert(stringOrOptions)`
- `vex.dialog.confirm(options)`
- `vex.dialog.prompt(options)`
- `vex.dialog.open(options)`

(Internally, `alert`, `confirm`, and `prompt` call `open` with a different compositions of options.)

#### Alert

Use alerts when you want to display a message to the user, but you don't want to give them any choice to procede.

<a class="demo-alert hs-brand-button">Open an alert</a>
<script>
$('.demo-alert').click(function(){
    vex.dialog.alert('Thanks for checking out Vex!');
});
</script>

Play with this demo:

```coffeescript
vex.dialog.alert 'Thanks for checking out Vex!'
```

#### Confirm

Use confirms when you want to present an yes-or-no option to the user.

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

```coffeescript
vex.dialog.confirm
    message: 'Are you absolutely sure you want to destroy the alien planet?'
    callback: (value) -> console.log(value)
```

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

```coffeescript
vex.dialog.prompt
    message: 'What planet did the aliens come from?'
    placeholder: 'Planet name'
    callback: (value) -> console.log(value)
```

#### Open

With `open`, you are in full control.

##### Inputs
You can specify your own form inputs, and the `name` attribute will be the property name of the data object passed in the callback.

##### Buttons
You can specify your own buttons if you want more options than just OK or Cancel. If you simply want to change the labels, you can override the default options for the following:

```coffeescript
vex.dialog.buttons.YES.text = 'Okiedokie'
vex.dialog.buttons.NO.text = 'Aahw hell no'
```

##### Demo

Putting this all together, lets create a dialog with the following custimizations:

- Display a date input and a color input,
- Add an extra button which resets the color input to the default value (`#000`)
- Change the text for the OK button

<p>
<div class="demo-result-custom-vex-dialog hs-doc-callout hs-doc-callout-info" style="display: none"></div>
</p>

```coffeescript
todayDateString = new Date().toJSON().slice(0, 10)
vex.dialog.open
    message: 'Select a date and color.'
    input: """
        <style>
            .vex-custom-field-wrapper {
                margin: 1em 0;
            }
            .vex-custom-field-wrapper > label {
                display: inline-block;
                margin-bottom: .2em;
            }
        </style>
        <div class="vex-custom-field-wrapper">
            <label for="date">Date</label>
            <div class="vex-custom-input-wrapper">
                <input name="date" type="date" value="#{ todayDateString }" />
            </div>
        </div>
        <div class="vex-custom-field-wrapper">
            <label for="color">Color</label>
            <div class="vex-custom-input-wrapper">
                <input name="color" type="color" value="#ff00cc" />
            </div>
        </div>
    """
    callback: (data) ->
        return console.log('Cancelled') if data is false
        console.log 'Date', data.date, 'Color', data.color
        $('.demo-result-custom-vex-dialog').show().html """
            <h4>Result</h4>
            <p>
                Date: <b>#{ data.date}</b><br/>
                Color: <input type="color" value="#{data.color}" readonly />
            </p>
        """
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