/*
 * https://www.unicode.org/Public/5.0.0/ucd/Unihan.html
 */
const CJK = '[\u2E80-\uFE4F]';
const SYMOLS = '@&=_\$%\^\*\-+';
const LATIN = '[A-Za-z0-9\u00C0-\u00FF\u0100-\u017F\u0180-\u024F\u1E00-\u1EFF]';
const PATTERN_DEFAULT = new RegExp(`(?<=${LATIN})(?=${CJK})|(?<=${CJK})(?=${LATIN})`, 'g');
const PATTERN_SPACE = new RegExp(`(?<=${LATIN})(?=[ ]*${CJK})|(?<=${CJK})(?=[ ]*${LATIN})|(?<=${CJK}[ ]*)(?=${LATIN})|(?<=${LATIN}[ ]*)(?=${CJK})`, 'g');

const DEFAULT_OPTIONS = {
    spacingContent: ' '
};

let defaultOptions = {};

class Spacer {

    constructor(options) {
        this.options = handleOptions(options);
    }

    static config(options) {
        options = wrapOptions(options);
        Object.assign(defaultOptions, DEFAULT_OPTIONS, options);
    }

    space(text, options) {
        let arr = this.split(text, options);
        options = this.resolveOptions(options);
        if (options.wrapper) {
            let result = arr[0];
            for (let i = 1; i < arr.length - 1; i++) {
                let open = /[ ]*/.test(arr[i + 1]);
                let close = /[ ]*/.test(arr[i - 1]);
                if (open) {
                    result += options.wrapper.open;
                }
                if (close) {
                    result += options.wrapper.close;
                }
                if (!open && !close) {
                    result += options.wrapper.open + options.wrapper.close;
                }
            }
        } else {
            return arr.join(options.spacingContent);
        }
    }

    split(text, options) {
        options = this.resolveOptions(options);
        if (typeof text === 'string') {
            let pattern = options.handleOriginalSpace ? PATTERN_SPACE : PATTERN_DEFAULT;
            return text.split(pattern);
        }
        return [text];
    }

    resolveOptions(options) {
        return options ? handleOptions(options) : this.options;
    }
}

function wrapOptions(options) {
    return typeof options === 'string' ? {spacingContent: options} : options;
}

function handleOptions(options) {
    options = wrapOptions(options);
    return Object.assign({}, DEFAULT_OPTIONS, defaultOptions, options);
}

export default Spacer;