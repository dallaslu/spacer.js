/*
 * https://www.unicode.org/Public/5.0.0/ucd/Unihan.html
 */
/*
 * \u2E80-\u2EFF    CJK 部首
 * \u2F00-\u2FDF    康熙字典部首
 * \u3000-\u303F    CJK 符号和标点
 * \u31C0-\u31EF	CJK 笔画
 * \u3200-\u32FF	封闭式 CJK 文字和月份
 * \u3300-\u33FF	CJK 兼容
 * \u3400-\u4DBF	CJK 统一表意符号扩展 A
 * \u4DC0-\u4DFF	易经六十四卦符号
 * \u4E00-\u9FBF	CJK 统一表意符号
 * \uF900-\uFAFF	CJK 兼容象形文字
 * \uFE30-\uFE4F	CJK 兼容形式
 * \uFF00-\uFFEF	全角ASCII、全角标点
 */
const CJK = '\u2E80-\u2FDF\u31C0-\uFE4F';
const CJK_PATTERN = `[${CJK}]`;
const SYMOLS = '@&=_\$%\^\*\-+';
const LATIN = 'A-Za-z0-9\u00C0-\u00FF\u0100-\u017F\u0180-\u024F\u1E00-\u1EFF';
const LATIN_PATTERN = `[${LATIN}]`;
const LATIN_LIKE_PATTERN = `[${LATIN}%]`;
const ONE_OR_MORE_SPACE = '[ ]+';
const ENDS_WITH_CJK_AND_SPACING = new RegExp(`${CJK_PATTERN}${ONE_OR_MORE_SPACE}$`);
const ENDS_WITH_LATIN_AND_SPACING = new RegExp(`${LATIN_LIKE_PATTERN}${ONE_OR_MORE_SPACE}$`);
const ENDS_WITH_CJK = new RegExp(`${CJK_PATTERN}$`);
const ENDS_WITH_LATIN = new RegExp(`${LATIN_LIKE_PATTERN}$`);
const STARTS_WITH_CJK = new RegExp(`^${CJK_PATTERN}`);
const STARTS_WITH_LATIN = new RegExp(`^${LATIN_LIKE_PATTERN}`);
const PATTERN_DEFAULT = new RegExp(`(?<=${LATIN_LIKE_PATTERN})(?=${CJK_PATTERN})|(?<=${CJK_PATTERN})(?=${LATIN_LIKE_PATTERN})`, 'g');
const PATTERN_SPACE = new RegExp(`(?<=${LATIN_LIKE_PATTERN})(?=[ ]*${CJK_PATTERN})|(?<=${CJK_PATTERN})(?=[ ]*${LATIN_LIKE_PATTERN})|(?<=${CJK_PATTERN}[ ]*)(?=${LATIN_LIKE_PATTERN})|(?<=${LATIN_LIKE_PATTERN}[ ]*)(?=${CJK_PATTERN})`, 'g');

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

    static endsWithCJKAndSpacing(text) {
        return ENDS_WITH_CJK_AND_SPACING.test(text);
    }

    static endsWithCJK(text){
        return ENDS_WITH_CJK.test(text);
    }

    static endsWithLatin(text){
        return ENDS_WITH_LATIN.test(text);
    }

    static startsWithCJK(text){
        return STARTS_WITH_CJK.test(text);
    }

    static startsWithLatin(text){
        return STARTS_WITH_LATIN.test(text);
    }

    static endsWithLatinAndSpacing(text) {
        return ENDS_WITH_LATIN_AND_SPACING.test(text);
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