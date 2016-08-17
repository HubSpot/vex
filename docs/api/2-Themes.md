## Themes

To use a builtin theme, you must include the theme style sheet, and set vex `className` to match match:

```html
<link rel="stylesheet" href="vex-theme-default.css" />
<script>vex.defaultOptions.className = 'vex-theme-default';</script>
```

At the moment, there are 6 themes:

<table class="hs-table">
<tr>
<th>Name</th>
<th>`className`</th>
<th></th>
</tr>
<tbody>
<tr><td>Default</td><td>`vex-theme-default`</td><td><a href data-theme="vex-theme-default">Example</td></tr>
<tr><td>Operating System</td><td>`vex-theme-os`</td><td><a href data-theme="vex-theme-os">Example</td></tr>
<tr><td>Plain</td><td>`vex-theme-plain`</td><td><a href data-theme="vex-theme-plain">Example</td></tr>
<tr><td>Wireframe</td><td>`vex-theme-wireframe`</td><td><a href data-theme="vex-theme-wireframe">Example</td></tr>
<tr><td>Flat Attack!</td><td>`vex-theme-flat-attack`</td><td><a href data-theme="vex-theme-flat-attack">Example</td></tr>
<tr><td>Top</td><td>`vex-theme-top`</td><td><a href data-theme="vex-theme-top">Example</td></tr>
<tr><td>Bottom Right Corner</td><td>`vex-theme-bottom-right-corner`</td><td><a href data-theme="vex-theme-bottom-right-corner">Example</td></tr>
</tbody>
</table>

Instead of setting `vex.defaultOptions.className`, you could instead set the `className` option when opening a vex. Here's an example of that.

### Inline Theme Example

```javascript
vex.defaultOptions.className = 'vex-theme-os'
vex.dialog.alert({
    message: 'Testing the wireframe theme.',
    className: 'vex-theme-wireframe' // Overwrites defaultOptions
})
```

<!-- Resources for the demos -->
<p style="-webkit-transform: translateZ(0)"></p>
<script src="/vex/dist/js/vex.combined.js"></script>
<link rel="stylesheet" href="/vex/dist/css/vex.css" />
<link rel="stylesheet" href="/vex/dist/css/vex-theme-default.css">
<link rel="stylesheet" href="/vex/dist/css/vex-theme-os.css">
<link rel="stylesheet" href="/vex/dist/css/vex-theme-plain.css">
<link rel="stylesheet" href="/vex/dist/css/vex-theme-wireframe.css">
<link rel="stylesheet" href="/vex/dist/css/vex-theme-flat-attack.css">
<link rel="stylesheet" href="/vex/dist/css/vex-theme-top.css">
<link rel="stylesheet" href="/vex/dist/css/vex-theme-bottom-right-corner.css">
<script>
    (function(){
        vex.defaultOptions.className = 'vex-theme-os';

        $('[data-theme]').each(function(){
            $(this).click(function(e){
                e.preventDefault();
                vex.dialog.alert({
                    unsafeMessage: 'Testing the <code>' + $(this).data('theme') + '</code> theme.',
                    className: $(this).data('theme')
                });
                return false;
            });
        });
    })();
</script>
