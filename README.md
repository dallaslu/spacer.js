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
    <script src="dist/spacer.min.js"></script>
</head>
<body>
<img alt="时髦人都好fancy"/>
<p>Today你eat了吗？</p>
<script>
    let spacer = new Spacer({
        wrapper:{
            open: '<spacer>',
            close: '</spacer>'
        },
        spacingContent: ' ',
        handleOriginalSpace: true,
        forceUnifiedSpacing: true
    });
    console.log(spacer.space('中文ABC'));
    spacer.spacePage();
</script>
</body>
</html>
```

## Options

 Name | Type | Example | Default |
| ---- | ---- | ------- | ------- |
| `spacingContent` | string | `' '` | `' '` |
| `wrapper` | object | ```{open: '<spacer>', close: '</spacer>'}```| `Undefined` |
| `handleOriginalSpace` | bool | `true` | `false` |
| `forceUnifiedSpacing` | bool | `true` | `false` |
| `keepOriginalSpace` | bool | `true` | `false` |

### Detail

#### `spacingContent`
Spacing content.
1. `中文ABC` -> `中文 ABC`
2. `中文 ABC` -> `中文 ABC`
3. `中文____ABC` -> `中文_ABC`(`_` as blank)
#### `wrapper`
Html wrapper tag.
```css
spacer{
    width: .25em; /* 1/4 font-size by default */
    display: inline-block;
}
spacer::after {
    content: '';
}
```
1. `中文ABC` -> `中文<spacer></spacer>ABC`
2. `Global世界` -> `Global<spacer></spacer>世界`

#### `handleOriginalSpace`
Handle original space. 

When `true`:
1. `中文___ABC` -> `中文_ABC`(No wrapper case, `_` as blank)
2. `中文 ABC` -> `中文<spacer></spacer>ABC`
3. `中文____ABC` -> `中文<spacer></spacer>ABC`(`_` as blank)

When `false`:
1. `中文 ABC` -> `中文 ABC`
2. `中文____ABC` -> `中文____ABC`(`_` as blank)
#### `forceUnifiedSpacing`
Replace all spacings with `spacingContent` value or wrapper. Only works when `handleOriginalSpace` is `true` and `wrapper`.
1. ###### `中文ABC` -> `中文<spacer> </spacer>ABC`
2. `中文____ABC` -> `中文<spacer>_</spacer>ABC`(`_` as blank)

#### `keepOriginalSpace`
Only works when `forceUnifiedSpacing` is `false` and `handleOriginalSpace` is `true` and `wrapper`.
1. `中文ABC` -> `中文<spacer></spacer>ABC`
2. `中文 ABC` -> `中文<spacer> </spacer>ABC`
3. `中文____ABC` -> `中文<spacer>____</spacer>ABC`(`_` as blank)