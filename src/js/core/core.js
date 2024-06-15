/*
 *
 */
import Snippet from "./snippet.js";

const LOOKBEHIND_SUPPORTED = (() => {
    try {
        new RegExp('(?<=exp)');
        return true;
    } catch (e) {
        return false;
    }
})();

/*
 * \u2E80-\u2EFF    CJK 部首
 * \u2F00-\u2FDF    康熙字典部首
 * \u3000-\u303F    CJK 符号和标点
 * \u31C0-\u31EF    CJK 笔画
 * \u3200-\u32FF    封闭式 CJK 文字和月份
 * \u3300-\u33FF    CJK 兼容
 * \u3400-\u4DBF    CJK 统一表意符号扩展 A
 * \u4DC0-\u4DFF    易经六十四卦符号
 * \u4E00-\u9FBF    CJK 统一表意符号
 * \uF900-\uFAFF    CJK 兼容象形文字
 * \uFE30-\uFE4F    CJK 兼容形式
 * \uFF00-\uFFEF    全角ASCII、全角标点
 *
 * https://www.unicode.org/Public/5.0.0/ucd/Unihan.html
 */
const CJK = '\u2E80-\u2FDF\u3040-\uFE4F';
const SYMBOLS = '@&=_\$%\^\*\-+';
const LATIN = 'A-Za-z0-9\u00C0-\u00FF\u0100-\u017F\u0180-\u024F\u1E00-\u1EFF';
const ONE_OR_MORE_SPACE = '[ ]+';
const ANY_SPACE = '[ ]*';
const SYMBOLS_NEED_SPACE_FOLLOWED = '[\.:,?!]';
const ONE_AJK = `[${CJK}]`;
const ONE_LATIN = `[${LATIN}]`;
const ONE_LATIN_LIKE = `[${LATIN}%]`;
const SPLIT_AJK_SPACE_LATIN_LIKE = buildSplit(`${ONE_LATIN_LIKE}`, `${ANY_SPACE}`, `${ONE_AJK}`);
const SPLIT_LATIN_LIKE_SPACE_AJK = buildSplit(`${ONE_AJK}`, `${ANY_SPACE}`, `${ONE_LATIN_LIKE}`);
const SPLIT_SPACE = `${SPLIT_AJK_SPACE_LATIN_LIKE}|${SPLIT_LATIN_LIKE_SPACE_AJK}`;
const SPLIT_SYMBOLS_NEED_SPACE_FOLLOWED = buildSplit(`${SYMBOLS_NEED_SPACE_FOLLOWED}`, '', `${ONE_AJK}|${ONE_LATIN}`);
const SPLIT_AJK_LATIN_LIKE = buildSplit(`${ONE_LATIN_LIKE}`, '', `${ONE_AJK}`);
const SPLIT_LATIN_LIKE_AJK = buildSplit(`${ONE_AJK}`, '', `${ONE_LATIN_LIKE}`);
const REGEXP_SPACES = new RegExp(`^${ONE_OR_MORE_SPACE}$`);
const REGEXP_ANY_CJK = new RegExp(`${ONE_AJK}`);
const REGEXP_ENDS_WITH_SYMBOLS_NEED_SPACE_FOLLOWED = new RegExp(`${SYMBOLS_NEED_SPACE_FOLLOWED}$`);
const REGEXP_STARTS_WITH_SYMBOLS_NEED_SPACE_FOLLOWED = new RegExp(`^${SYMBOLS_NEED_SPACE_FOLLOWED}`);
const REGEXP_ENDS_WITH_CJK_AND_SPACE = new RegExp(`${ONE_AJK}${ONE_OR_MORE_SPACE}$`);
const REGEXP_ENDS_WITH_LATIN_AND_SPACE = new RegExp(`${ONE_LATIN_LIKE}${ONE_OR_MORE_SPACE}$`);
const REGEXP_ENDS_WITH_ANY_SPACE = new RegExp(`${ANY_SPACE}$`);
const REGEXP_ENDS_WITH_CJK = new RegExp(`${ONE_AJK}$`);
const REGEXP_ENDS_WITH_LATIN = new RegExp(`${ONE_LATIN_LIKE}$`);
const REGEXP_STARTS_WITH_CJK = new RegExp(`^${ONE_AJK}`);
const REGEXP_STARTS_WITH_LATIN = new RegExp(`^${ONE_LATIN_LIKE}`);
const REGEXP_SPLIT_END_SPACE = new RegExp(`(${ANY_SPACE})$`);
const REGEXP_SPLIT_DEFAULT = new RegExp(`(${SPLIT_AJK_LATIN_LIKE}|${SPLIT_LATIN_LIKE_AJK}|${SPLIT_SYMBOLS_NEED_SPACE_FOLLOWED})`, 'g');
const REGEXP_SPLIT_SPACE = new RegExp(`(${SPLIT_SPACE}|${SPLIT_SYMBOLS_NEED_SPACE_FOLLOWED})`, 'g');

function wrapSplit(exp) {
    return LOOKBEHIND_SUPPORTED ? exp : format.call('({0})', exp);
}

function buildSplit(lookbehind, exp, lookahead) {
    return format.call(LOOKBEHIND_SUPPORTED ? '(?<={0}){1}(?={2})' : '{0}{1}(?={2})', lookbehind, exp, lookahead);
}

function format(...args) {
    let result = this;
    if (args.length == 0) {
        return result;
    }
    let data = args.length == 1 && typeof args[1] === 'object' ? args[1] : args;
    for (let key in data) {
        if (data[key] !== undefined) {
            result = result.replaceAll('\{' + key + '\}', data[key]);
        }
    }
    return result;
}

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
        return this.custom(options, (step, opts) => {
            return this.split(text, opts).reduce((acc, cur, i, src) => {
                return step({
                    current: cur,
                    acc: acc,
                    i: i,
                    src: src
                });
            }, '');
        }, c => c.i == 0 ? null : c.src[c.i - 1], c => null, (opts, c, add, s, append) => {
            if (add) {
                if (opts.wrapper) {
                    s = `${opts.wrapper.open}${s}${opts.wrapper.close}`;
                }
                return `${c.acc}${s}${append}`;
            }
            return `${c.acc}${append}`;
        });
    }

    custom(options, prepare, prevSolver, nextSolver, splicer) {
        options = this.resolveOptions(options);
        return prepare(context => {
            let cur = context.current;
            let spacingContent = options.spacingContent;
            let append = '';
            let addSpace = false;

            if (Spacer.isSpaces(cur)) {
                addSpace = true;
                if (!options.forceUnifiedSpacing && options.keepOriginalSpace) {
                    spacingContent = cur.text;
                }
            } else {
                append = cur.text;
                let prev = prevSolver(context, options);
                if (prev) {
                    if (Spacer.endsWithSymbolsNeedSpaceFollowed(prev)) {
                        if (prev.is(/\.$/) && cur.is(/^[a-z\d]+/)
                            || prev.is(/:$/) && cur.is(/^\d+/)) {
                            addSpace = false;
                        } else {
                            addSpace = true;
                        }
                    } else if (Spacer.endsWithCJK(prev) && Spacer.startsWithLatin(cur)
                        || Spacer.endsWithLatin(prev) && Spacer.startsWithCJK(cur)) {
                        // between CJK and Latin-like(English letters, numbers, etc.)
                        addSpace = true;
                    }
                }
            }
            return splicer(options, context, addSpace, spacingContent, append);
        }, options);
    }

    /**
     * Split to Snippet[]
     * @param text
     * @param options
     * @returns {Snippet[]}
     */
    split(text, options) {
        options = this.resolveOptions(options);
        if (typeof text === 'string') {
            let pattern = options.handleOriginalSpace ? REGEXP_SPLIT_SPACE : REGEXP_SPLIT_DEFAULT;
            let arr = text.split(pattern)
                .filter((cur) => cur !== '' && cur !== undefined)
                .map((cur, i, src) => new Snippet(cur));
            if (arr.length > 1 && !LOOKBEHIND_SUPPORTED) {
                arr = arr.flatMap((cur, i, src) => {
                    // 'Spacer 间隔器'=>['Space', 'r ', '间隔器']=>['Space','r',' ', '', '间隔器']
                    if (cur.is(REGEXP_ENDS_WITH_ANY_SPACE)) {
                        return cur.text.split(REGEXP_SPLIT_END_SPACE).map(cur => new Snippet(cur));
                    }
                    return cur;
                })
                let result = [];
                arr.forEach((cur, i, src) => {
                    // 'Spacer间隔器'=>['Space', 'r', '间隔器']=>['Spacer', '间隔器']
                    if (cur.text.length == 1 && i > 0 && !cur.is(/^[ ]*$/)) {
                        let prev = src[i - 1];
                        if (!Spacer.endsWithCJK(prev) && !Spacer.startsWithCJK(cur)
                            || !Spacer.endsWithLatin(prev) && !Spacer.startsWithLatin(cur)) {
                            result[result.length - 1] = new Snippet(result[result.length - 1] + cur);
                            return;
                        }
                    }
                    result.push(cur);
                });
                arr = result;
            }
            return arr;
        }
        return [new Snippet(text)];
    }

    resolveOptions(options) {
        return options ? Object.assign({}, this.options, wrapOptions(options)) : this.options;
    }

    static endsWithCJKAndSpacing(text) {
        return test(REGEXP_ENDS_WITH_CJK_AND_SPACE, text);
    }

    static endsWithCJK(text) {
        return test(REGEXP_ENDS_WITH_CJK, text);
    }

    static endsWithLatin(text) {
        return test(REGEXP_ENDS_WITH_LATIN, text);
    }

    static startsWithCJK(text) {
        return test(REGEXP_STARTS_WITH_CJK, text);
    }

    static startsWithLatin(text) {
        return test(REGEXP_STARTS_WITH_LATIN, text);
    }

    static endsWithLatinAndSpacing(text) {
        return test(REGEXP_ENDS_WITH_LATIN_AND_SPACE, text);
    }

    static endsWithSymbolsNeedSpaceFollowed(text) {
        return test(REGEXP_ENDS_WITH_SYMBOLS_NEED_SPACE_FOLLOWED, text);
    }

    static startsWithSymbolsNeedSpaceFollowed(text) {
        return test(REGEXP_STARTS_WITH_SYMBOLS_NEED_SPACE_FOLLOWED, text);
    }

    static isSpaces(text) {
        return test(REGEXP_SPACES, text);
    }

    static createSnippet(text){
        return new Snippet(text);
    }
}

function test(regexp, text) {
    return text instanceof Snippet ? text.is(regexp) : regexp.test(text);
}

function wrapOptions(options) {
    return typeof options === 'string' ? {spacingContent: options} : options;
}

function handleOptions(options) {
    options = wrapOptions(options);
    return Object.assign({}, DEFAULT_OPTIONS, defaultOptions, options);
}

export default Spacer;
