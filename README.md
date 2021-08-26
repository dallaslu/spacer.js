# spacer.js
Typographical word spacing

## Example

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Spacer间隔器</title>
    <style>
        spacer{
            width: .25em;
            display: inline-block;
        }
        spacer::after {
            content: '';
        }
    </style>
    <script type="module" src="../src/spacer.js"></script>
</head>
<body>
<img alt="时髦的人都好Fancy"/>
<p>Today你eat了吗？</p>
<script>
    window.addEventListener('load', function(){
        let spacer = new Spacer({
            wrapper:{
                open: '<spacer>',
                close: '</spacer>'
            },
            spacingContent: ' ',
            handleOriginalSpace: true,
            forceUnifiedSpacing: true
        });
        spacer.spacePage();
    });
</script>
</body>
</html>
```
