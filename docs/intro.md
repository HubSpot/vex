## `vex` is a modern dialog library which is highly configurable, easily stylable, and gets out of the way.

You'll love vex because it's tiny (`<5kb`), has a clear and simple API, and can customized to the max.

#### Features

- Drop-in replacement for `alert`, `confirm`, and `prompt`
- Animations done in CSS
- Fully reposive CSS means it looks and behaves great on mobile devices
- Componentized so you can toss the `vex.dialog` part and really slim it down if desired

Let's jump right into a hot demo.

#### Demo

<a class="demo-confirm hs-brand-button">Destory the planet</a>
<div class="demo-result-simple hs-doc-callout hs-doc-callout-info" style="display: none"></div>
<script>
$('.demo-confirm').click(function(){
    $('.executr-run-button:first').click();
});
</script>

Play with this demo:

```coffeescript
vex.dialog.confirm
    message: 'Are you absolutely sure you want to destroy the alien planet?'
    callback: (value) ->
        $('.demo-result-simple').show().html """
            <h4>Result</h4>
            <p>
                #{ if value is true then '''
                    Successfully destroyed the planet.
                ''' else '''
                    I guess you chickened out.
                '''}
            </p>
        """
```

### Demo

<a class="demo hs-brand-button">Pick a date and color</a>
<div class="demo-result hs-doc-callout hs-doc-callout-info" style="display: none"></div>
<script>
    $('.demo').click(function(){
        $('.executr-run-button:last').click();
    });
</script>

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
        $('.demo-result').show().html """
            <h4>Result</h4>
            <p>
                Date: <b>#{ data.date}</b><br/>
                Color: <input type="color" value="#{data.color}" readonly />
            </p>
        """
```

<!-- Resources for the demos -->
<script src="/vex/js/vex.js"></script>
<link rel="stylesheet" href="/vex/css/vex.css" />
<script src="/vex/js/vex.dialog.js"></script>
<link rel="stylesheet" href="/vex/css/vex.dialog.css" />
<p style="-webkit-transform: translateZ(0)"></p>