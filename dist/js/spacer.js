(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _core = require('./core/core.js');

var _core2 = _interopRequireDefault(_core);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var IGNORED_TAGS = /^(script|link|style|code)$/i;
var BLOCK_TAGS = /^(div|p|h1|h2|h3|h4|h5|h6|blockqoute|pre|textarea|nav|header|main|footer|section|sidbar|aside|table|li|ul|ol|dl)$/i;
var SPACING_TAGS = /^(br|hr|img|video|audio)$/i;

_core2.default.config({
    tagAttrMap: {
        '*': ['title'],
        'optgroup': ['label'],
        'input': ['placeholder'],
        'img': ['alt']
    }
});

var BrowserSpacer = function (_Spacer) {
    _inherits(BrowserSpacer, _Spacer);

    function BrowserSpacer(options) {
        _classCallCheck(this, BrowserSpacer);

        var _this = _possibleConstructorReturn(this, (BrowserSpacer.__proto__ || Object.getPrototypeOf(BrowserSpacer)).call(this, options));

        if (options.wrapper) {
            _this.options.spacingContent = _this.options.spacingContent.replace(' ', '&nbsp;');
        }
        return _this;
    }

    _createClass(BrowserSpacer, [{
        key: 'spacePage',
        value: function spacePage(elements, options, observe) {
            var _this2 = this;

            elements = typeof elements === 'string' ? document.querySelectorAll(elements) : elements || document;
            options = this.resolveOptions(options);
            if (options.wrapper) {
                options.spacingContent = options.spacingContent.replace(' ', '&nbsp;');
            }
            if (!elements.forEach) {
                elements = [elements];
            }
            elements.forEach(function (e) {
                spaceNode(_this2, e, options);
                if (observe) {
                    var observer = new MutationObserver(function (mutations, observer) {
                        observer.disconnect();
                        mutations.forEach(function (m) {
                            if (m.type === 'childList') {
                                _this2.spacePage(m.addedNodes, options, false);
                            }
                        });
                        _connect();
                    });
                    var _connect = function _connect() {
                        observer.observe(e, {
                            characterData: true,
                            childList: true,
                            attributes: true,
                            subtree: true,
                            attributeOldValue: true,
                            characterDataOldValue: true
                        });
                    };
                    _connect();
                }
            });
        }
    }]);

    return BrowserSpacer;
}(_core2.default);

function spaceNode(spacer, node, options) {
    if (node.tagName && IGNORED_TAGS.test(node.tagName) || node.nodeType === Node.COMMENT_NODE) {
        return;
    }
    var optionsNoWrapper = Object.assign({}, options, { wrapper: false });
    var optionsNoWrapperNoHTMLEntity = Object.assign({}, optionsNoWrapper, {
        spacingContent: options.spacingContent.replace('&nbsp;', ' ')
    });
    var optionsEffect = options;
    if (node.parentNode && node.parentNode.tagName === 'TITLE') {
        optionsEffect = optionsNoWrapperNoHTMLEntity;
    }

    spacer.custom(optionsEffect, function (step, opts) {
        var current = _core2.default.createSnippet(function () {
            if (node.nodeType === Node.TEXT_NODE) {
                return node.data;
            } else {
                return node.textContent;
            }
        }());
        if (current && current.text) {
            step({
                current: current
            });
        }
    }, function (c, opts) {
        if (node.previousSibling && (!node.previousSibling.tagName || !BLOCK_TAGS.test(node.previousSibling.tagName) && !SPACING_TAGS.test(node.previousSibling.tagName)) && (!node.tagName || !BLOCK_TAGS.test(node.tagName) && !SPACING_TAGS.test(node.tagName))) {
            return _core2.default.createSnippet(node.previousSibling.nodeType === Node.TEXT_NODE ? node.previousSibling.data : node.previousSibling.textContent);
        }
    }, function (c) {
        return null;
    }, function (opts, c, add, s, append) {
        if (add) {
            if (opts.wrapper) {
                insertBefore(createNode(opts.wrapper.open + s + opts.wrapper.close), node);
            } else {
                insertBefore(document.createTextNode(append), node);
            }
        }
    });

    if (node.nodeType === Node.TEXT_NODE) {
        if (optionsEffect.wrapper) {
            spacer.custom(optionsEffect, function (step, opts) {
                return spacer.split(node.data, opts).reduce(function (acc, cur, i, src) {
                    return step({
                        current: cur,
                        acc: acc,
                        i: i,
                        src: src
                    });
                }, '');
            }, function (c) {
                return c.i == 0 ? null : c.src[c.i - 1];
            }, function (c) {
                return null;
            }, function (opts, c, add, s, append) {
                if (add) {
                    insertBefore(createNode('' + opts.wrapper.open + s + opts.wrapper.close), node);
                }
                if (append) {
                    insertBefore(document.createTextNode(append), node);
                }
            });
            node.remove();
        } else {
            if (node.parentNode && node.parentNode.tagName === 'TITLE') {
                spaceAttribute(spacer, node, 'data', optionsNoWrapperNoHTMLEntity);
            } else {
                spaceAttribute(spacer, node, 'data', optionsNoWrapper);
            }
        }
    } else {
        // tag attr map
        if (node.tagName) {
            for (var k in optionsEffect.tagAttrMap) {
                var attrs = optionsEffect.tagAttrMap[k];
                if (k === '*' || k === node.tagName.toLowerCase()) {
                    attrs.forEach(function (a) {
                        return spaceAttribute(spacer, node, a, optionsNoWrapperNoHTMLEntity);
                    });
                }
            }
        }
    }

    if (node.childNodes) {
        var staticNodes = [];
        node.childNodes.forEach(function (child) {
            staticNodes.push(child);
        });
        staticNodes.forEach(function (child) {
            spaceNode(spacer, child, options);
        });
    }
}

function createNode(html) {
    var div = document.createElement('div');
    div.innerHTML = html;
    return div.firstChild;
}

function insertBefore(newNode, node) {
    if (node.tagName !== 'HTML' && node.parentNode && node.parentNode.tagName !== 'HTML') {
        node.parentNode.insertBefore(newNode, node);
    }
}

function spaceAttribute(spacer, node, attr, options) {
    if (node[attr]) {
        var result = spacer.space(node[attr], options);
        if (node[attr] !== result) {
            node[attr] = result;
        }
    }
}

exports.default = BrowserSpacer;

},{"./core/core.js":2}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; /*
                                                                                                                                                                                                                                                                               *
                                                                                                                                                                                                                                                                               */


var _snippet = require('./snippet.js');

var _snippet2 = _interopRequireDefault(_snippet);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var LOOKBEHIND_SUPPORTED = function () {
    try {
        new RegExp('(?<=exp)');
        return true;
    } catch (e) {
        return false;
    }
}();

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
var CJK = '\u2E80-\u2FDF\u3040-\uFE4F';
var SYMBOLS = '@&=_\$%\^\*\-+';
var LATIN = 'A-Za-z0-9\xC0-\xFF\u0100-\u017F\u0180-\u024F\u1E00-\u1EFF';
var ONE_OR_MORE_SPACE = '[ ]+';
var ANY_SPACE = '[ ]*';
var SYMBOLS_NEED_SPACE_FOLLOWED = '[\.:,?!]';
var ONE_AJK = '[' + CJK + ']';
var ONE_LATIN = '[' + LATIN + ']';
var ONE_LATIN_LIKE = '[' + LATIN + '%]';
var SPLIT_AJK_SPACE_LATIN_LIKE = buildSplit('' + ONE_LATIN_LIKE, '' + ANY_SPACE, '' + ONE_AJK);
var SPLIT_LATIN_LIKE_SPACE_AJK = buildSplit('' + ONE_AJK, '' + ANY_SPACE, '' + ONE_LATIN_LIKE);
var SPLIT_SPACE = SPLIT_AJK_SPACE_LATIN_LIKE + '|' + SPLIT_LATIN_LIKE_SPACE_AJK;
var SPLIT_SYMBOLS_NEED_SPACE_FOLLOWED = buildSplit('' + SYMBOLS_NEED_SPACE_FOLLOWED, '', ONE_AJK + '|' + ONE_LATIN);
var SPLIT_AJK_LATIN_LIKE = buildSplit('' + ONE_LATIN_LIKE, '', '' + ONE_AJK);
var SPLIT_LATIN_LIKE_AJK = buildSplit('' + ONE_AJK, '', '' + ONE_LATIN_LIKE);
var REGEXP_SPACES = new RegExp('^' + ONE_OR_MORE_SPACE + '$');
var REGEXP_ANY_CJK = new RegExp('' + ONE_AJK);
var REGEXP_ENDS_WITH_SYMBOLS_NEED_SPACE_FOLLOWED = new RegExp(SYMBOLS_NEED_SPACE_FOLLOWED + '$');
var REGEXP_STARTS_WITH_SYMBOLS_NEED_SPACE_FOLLOWED = new RegExp('^' + SYMBOLS_NEED_SPACE_FOLLOWED);
var REGEXP_ENDS_WITH_CJK_AND_SPACE = new RegExp('' + ONE_AJK + ONE_OR_MORE_SPACE + '$');
var REGEXP_ENDS_WITH_LATIN_AND_SPACE = new RegExp('' + ONE_LATIN_LIKE + ONE_OR_MORE_SPACE + '$');
var REGEXP_ENDS_WITH_ANY_SPACE = new RegExp(ANY_SPACE + '$');
var REGEXP_ENDS_WITH_CJK = new RegExp(ONE_AJK + '$');
var REGEXP_ENDS_WITH_LATIN = new RegExp(ONE_LATIN_LIKE + '$');
var REGEXP_STARTS_WITH_CJK = new RegExp('^' + ONE_AJK);
var REGEXP_STARTS_WITH_LATIN = new RegExp('^' + ONE_LATIN_LIKE);
var REGEXP_SPLIT_END_SPACE = new RegExp('(' + ANY_SPACE + ')$');
var REGEXP_SPLIT_DEFAULT = new RegExp('(' + SPLIT_AJK_LATIN_LIKE + '|' + SPLIT_LATIN_LIKE_AJK + '|' + SPLIT_SYMBOLS_NEED_SPACE_FOLLOWED + ')', 'g');
var REGEXP_SPLIT_SPACE = new RegExp('(' + SPLIT_SPACE + '|' + SPLIT_SYMBOLS_NEED_SPACE_FOLLOWED + ')', 'g');

function wrapSplit(exp) {
    return LOOKBEHIND_SUPPORTED ? exp : format.call('({0})', exp);
}

function buildSplit(lookbehind, exp, lookahead) {
    return format.call(LOOKBEHIND_SUPPORTED ? '(?<={0}){1}(?={2})' : '{0}{1}(?={2})', lookbehind, exp, lookahead);
}

function format() {
    var result = this;

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
    }

    if (args.length == 0) {
        return result;
    }
    var data = args.length == 1 && _typeof(args[1]) === 'object' ? args[1] : args;
    for (var key in data) {
        if (data[key] !== undefined) {
            result = result.replaceAll('\{' + key + '\}', data[key]);
        }
    }
    return result;
}

var DEFAULT_OPTIONS = {
    spacingContent: ' '
};

var defaultOptions = {};

var Spacer = function () {
    function Spacer(options) {
        _classCallCheck(this, Spacer);

        this.options = handleOptions(options);
    }

    _createClass(Spacer, [{
        key: 'space',
        value: function space(text, options) {
            var _this = this;

            return this.custom(options, function (step, opts) {
                return _this.split(text, opts).reduce(function (acc, cur, i, src) {
                    return step({
                        current: cur,
                        acc: acc,
                        i: i,
                        src: src
                    });
                }, '');
            }, function (c) {
                return c.i == 0 ? null : c.src[c.i - 1];
            }, function (c) {
                return null;
            }, function (opts, c, add, s, append) {
                if (add) {
                    if (opts.wrapper) {
                        s = '' + opts.wrapper.open + s + opts.wrapper.close;
                    }
                    return '' + c.acc + s + append;
                }
                return '' + c.acc + append;
            });
        }
    }, {
        key: 'custom',
        value: function custom(options, prepare, prevSolver, nextSolver, splicer) {
            options = this.resolveOptions(options);
            return prepare(function (context) {
                var cur = context.current;
                var spacingContent = options.spacingContent;
                var append = '';
                var addSpace = false;

                if (Spacer.isSpaces(cur)) {
                    addSpace = true;
                    if (!options.forceUnifiedSpacing && options.keepOriginalSpace) {
                        spacingContent = cur.text;
                    }
                } else {
                    append = cur.text;
                    var prev = prevSolver(context, options);
                    if (prev) {
                        if (Spacer.endsWithSymbolsNeedSpaceFollowed(prev)) {
                            if (prev.is(/\.$/) && cur.is(/^\d+/) || prev.is(/:$/) && cur.is(/^\d+/)) {
                                addSpace = false;
                            } else {
                                addSpace = true;
                            }
                        } else if (Spacer.endsWithCJK(prev) && Spacer.startsWithLatin(cur) || Spacer.endsWithLatin(prev) && Spacer.startsWithCJK(cur)) {
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

    }, {
        key: 'split',
        value: function split(text, options) {
            options = this.resolveOptions(options);
            if (typeof text === 'string') {
                var pattern = options.handleOriginalSpace ? REGEXP_SPLIT_SPACE : REGEXP_SPLIT_DEFAULT;
                var arr = text.split(pattern).filter(function (cur) {
                    return cur !== '' && cur !== undefined;
                }).map(function (cur, i, src) {
                    return new _snippet2.default(cur);
                });
                if (arr.length > 1 && !LOOKBEHIND_SUPPORTED) {
                    arr = arr.flatMap(function (cur, i, src) {
                        // 'Spacer 间隔器'=>['Space', 'r ', '间隔器']=>['Space','r',' ', '', '间隔器']
                        if (cur.is(REGEXP_ENDS_WITH_ANY_SPACE)) {
                            return cur.text.split(REGEXP_SPLIT_END_SPACE).map(function (cur) {
                                return new _snippet2.default(cur);
                            });
                        }
                        return cur;
                    });
                    var result = [];
                    arr.forEach(function (cur, i, src) {
                        // 'Spacer间隔器'=>['Space', 'r', '间隔器']=>['Spacer', '间隔器']
                        if (cur.text.length == 1 && i > 0 && !cur.is(/^[ ]*$/)) {
                            var prev = src[i - 1];
                            if (!Spacer.endsWithCJK(prev) && !Spacer.startsWithCJK(cur) || !Spacer.endsWithLatin(prev) && !Spacer.startsWithLatin(cur)) {
                                result[result.length - 1] = new _snippet2.default(result[result.length - 1] + cur);
                                return;
                            }
                        }
                        result.push(cur);
                    });
                    arr = result;
                }
                return arr;
            }
            return [new _snippet2.default(text)];
        }
    }, {
        key: 'resolveOptions',
        value: function resolveOptions(options) {
            return options ? Object.assign({}, this.options, wrapOptions(options)) : this.options;
        }
    }], [{
        key: 'config',
        value: function config(options) {
            options = wrapOptions(options);
            Object.assign(defaultOptions, DEFAULT_OPTIONS, options);
        }
    }, {
        key: 'endsWithCJKAndSpacing',
        value: function endsWithCJKAndSpacing(text) {
            return test(REGEXP_ENDS_WITH_CJK_AND_SPACE, text);
        }
    }, {
        key: 'endsWithCJK',
        value: function endsWithCJK(text) {
            return test(REGEXP_ENDS_WITH_CJK, text);
        }
    }, {
        key: 'endsWithLatin',
        value: function endsWithLatin(text) {
            return test(REGEXP_ENDS_WITH_LATIN, text);
        }
    }, {
        key: 'startsWithCJK',
        value: function startsWithCJK(text) {
            return test(REGEXP_STARTS_WITH_CJK, text);
        }
    }, {
        key: 'startsWithLatin',
        value: function startsWithLatin(text) {
            return test(REGEXP_STARTS_WITH_LATIN, text);
        }
    }, {
        key: 'endsWithLatinAndSpacing',
        value: function endsWithLatinAndSpacing(text) {
            return test(REGEXP_ENDS_WITH_LATIN_AND_SPACE, text);
        }
    }, {
        key: 'endsWithSymbolsNeedSpaceFollowed',
        value: function endsWithSymbolsNeedSpaceFollowed(text) {
            return test(REGEXP_ENDS_WITH_SYMBOLS_NEED_SPACE_FOLLOWED, text);
        }
    }, {
        key: 'startsWithSymbolsNeedSpaceFollowed',
        value: function startsWithSymbolsNeedSpaceFollowed(text) {
            return test(REGEXP_STARTS_WITH_SYMBOLS_NEED_SPACE_FOLLOWED, text);
        }
    }, {
        key: 'isSpaces',
        value: function isSpaces(text) {
            return test(REGEXP_SPACES, text);
        }
    }, {
        key: 'createSnippet',
        value: function createSnippet(text) {
            return new _snippet2.default(text);
        }
    }]);

    return Spacer;
}();

function test(regexp, text) {
    return text instanceof _snippet2.default ? text.is(regexp) : regexp.test(text);
}

function wrapOptions(options) {
    return typeof options === 'string' ? { spacingContent: options } : options;
}

function handleOptions(options) {
    options = wrapOptions(options);
    return Object.assign({}, DEFAULT_OPTIONS, defaultOptions, options);
}

exports.default = Spacer;

},{"./snippet.js":3}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TEST_CACHE = Symbol('testCache');

var Snippet = function () {
    function Snippet(text) {
        _classCallCheck(this, Snippet);

        this.text = text;
        this[TEST_CACHE] = {};
    }

    _createClass(Snippet, [{
        key: 'is',
        value: function is(regexp) {
            var cache = this[TEST_CACHE][regexp];
            return cache === undefined ? this[TEST_CACHE][regexp] = regexp.test(this.text) : cache;
        }
    }, {
        key: 'toString',
        value: function toString() {
            return this.text;
        }
    }]);

    return Snippet;
}();

exports.default = Snippet;

},{}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _browser = require('./browser.js');

var _browser2 = _interopRequireDefault(_browser);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Add support for AMD (Asynchronous Module Definition) libraries such as require.js.
if (typeof define === 'function' && define.amd) {
    define([], function () {
        return {
            Spacer: _browser2.default
        };
    });
}
//Add support form CommonJS libraries such as browserify.
if (typeof exports !== 'undefined') {
    exports.Spacer = _browser2.default;
}
//Define globally in case AMD is not available or unused
if (typeof window !== 'undefined') {
    window.Spacer = _browser2.default;
}

exports.default = _browser2.default;

},{"./browser.js":1}]},{},[4])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJidWlsZC9qcy9icm93c2VyLmpzIiwiYnVpbGQvanMvY29yZS9jb3JlLmpzIiwiYnVpbGQvanMvY29yZS9zbmlwcGV0LmpzIiwiYnVpbGQvanMvc3BhY2VyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7QUNBQTs7Ozs7Ozs7Ozs7O0FBRUEsSUFBTSxlQUFlLDZCQUFyQjtBQUNBLElBQU0sYUFBYSxvSEFBbkI7QUFDQSxJQUFNLGVBQWUsNEJBQXJCOztBQUVBLGVBQU8sTUFBUCxDQUFjO0FBQ1YsZ0JBQVk7QUFDUixhQUFLLENBQUMsT0FBRCxDQURHO0FBRVIsb0JBQVksQ0FBQyxPQUFELENBRko7QUFHUixpQkFBUyxDQUFDLGFBQUQsQ0FIRDtBQUlSLGVBQU8sQ0FBQyxLQUFEO0FBSkM7QUFERixDQUFkOztJQVNNLGE7OztBQUVGLDJCQUFZLE9BQVosRUFBcUI7QUFBQTs7QUFBQSxrSUFDWCxPQURXOztBQUVqQixZQUFJLFFBQVEsT0FBWixFQUFxQjtBQUNqQixrQkFBSyxPQUFMLENBQWEsY0FBYixHQUE4QixNQUFLLE9BQUwsQ0FBYSxjQUFiLENBQTRCLE9BQTVCLENBQW9DLEdBQXBDLEVBQXlDLFFBQXpDLENBQTlCO0FBQ0g7QUFKZ0I7QUFLcEI7Ozs7a0NBRVMsUSxFQUFVLE8sRUFBUyxPLEVBQVM7QUFBQTs7QUFDbEMsdUJBQVcsT0FBTyxRQUFQLEtBQW9CLFFBQXBCLEdBQStCLFNBQVMsZ0JBQVQsQ0FBMEIsUUFBMUIsQ0FBL0IsR0FBc0UsWUFBWSxRQUE3RjtBQUNBLHNCQUFVLEtBQUssY0FBTCxDQUFvQixPQUFwQixDQUFWO0FBQ0EsZ0JBQUksUUFBUSxPQUFaLEVBQXFCO0FBQ2pCLHdCQUFRLGNBQVIsR0FBeUIsUUFBUSxjQUFSLENBQXVCLE9BQXZCLENBQStCLEdBQS9CLEVBQW9DLFFBQXBDLENBQXpC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LE9BQU8sTUFBUCxDQUFjLEVBQWQsRUFBa0IsZUFBbEIsRUFBbUMsY0FBbkMsRUFBbUQsT0FBbkQsQ0FBUDtBQUNIOztrQkFFYyxNOzs7Ozs7Ozs7Ozs7O0FDOVBmLElBQU0sYUFBYSxPQUFPLFdBQVAsQ0FBbkI7O0lBRU0sTztBQUNGLHFCQUFZLElBQVosRUFBa0I7QUFBQTs7QUFDZCxhQUFLLElBQUwsR0FBWSxJQUFaO0FBQ0EsYUFBSyxVQUFMLElBQW1CLEVBQW5CO0FBQ0g7Ozs7MkJBRUUsTSxFQUFRO0FBQ1AsZ0JBQUksUUFBUSxLQUFLLFVBQUwsRUFBaUIsTUFBakIsQ0FBWjtBQUNBLG1CQUFPLFVBQVUsU0FBVixHQUF1QixLQUFLLFVBQUwsRUFBaUIsTUFBakIsSUFBMkIsT0FBTyxJQUFQLENBQVksS0FBSyxJQUFqQixDQUFsRCxHQUE0RSxLQUFuRjtBQUNIOzs7bUNBRVU7QUFDUCxtQkFBTyxLQUFLLElBQVo7QUFDSDs7Ozs7O2tCQUdVLE87Ozs7Ozs7OztBQ2xCZjs7Ozs7O0FBRUE7QUFDQSxJQUFJLE9BQU8sTUFBUCxLQUFrQixVQUFsQixJQUFnQyxPQUFPLEdBQTNDLEVBQWdEO0FBQzVDLFdBQU8sRUFBUCxFQUFXLFlBQVc7QUFDbEIsZUFBTztBQUNILG9CQUFRO0FBREwsU0FBUDtBQUdILEtBSkQ7QUFLSDtBQUNEO0FBQ0EsSUFBSSxPQUFPLE9BQVAsS0FBbUIsV0FBdkIsRUFBb0M7QUFDaEMsWUFBUSxNQUFSLEdBQWlCLGlCQUFqQjtBQUNIO0FBQ0Q7QUFDQSxJQUFJLE9BQU8sTUFBUCxLQUFrQixXQUF0QixFQUFtQztBQUMvQixXQUFPLE1BQVAsR0FBZ0IsaUJBQWhCO0FBQ0g7O2tCQUVjLGlCIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiaW1wb3J0IFNwYWNlciBmcm9tICcuL2NvcmUvY29yZS5qcydcclxuXHJcbmNvbnN0IElHTk9SRURfVEFHUyA9IC9eKHNjcmlwdHxsaW5rfHN0eWxlfGNvZGUpJC9pO1xyXG5jb25zdCBCTE9DS19UQUdTID0gL14oZGl2fHB8aDF8aDJ8aDN8aDR8aDV8aDZ8YmxvY2txb3V0ZXxwcmV8dGV4dGFyZWF8bmF2fGhlYWRlcnxtYWlufGZvb3RlcnxzZWN0aW9ufHNpZGJhcnxhc2lkZXx0YWJsZXxsaXx1bHxvbHxkbCkkL2k7XHJcbmNvbnN0IFNQQUNJTkdfVEFHUyA9IC9eKGJyfGhyfGltZ3x2aWRlb3xhdWRpbykkL2k7XHJcblxyXG5TcGFjZXIuY29uZmlnKHtcclxuICAgIHRhZ0F0dHJNYXA6IHtcclxuICAgICAgICAnKic6IFsndGl0bGUnXSxcclxuICAgICAgICAnb3B0Z3JvdXAnOiBbJ2xhYmVsJ10sXHJcbiAgICAgICAgJ2lucHV0JzogWydwbGFjZWhvbGRlciddLFxyXG4gICAgICAgICdpbWcnOiBbJ2FsdCddXHJcbiAgICB9XHJcbn0pO1xyXG5cclxuY2xhc3MgQnJvd3NlclNwYWNlciBleHRlbmRzIFNwYWNlciB7XHJcblxyXG4gICAgY29uc3RydWN0b3Iob3B0aW9ucykge1xyXG4gICAgICAgIHN1cGVyKG9wdGlvbnMpO1xyXG4gICAgICAgIGlmIChvcHRpb25zLndyYXBwZXIpIHtcclxuICAgICAgICAgICAgdGhpcy5vcHRpb25zLnNwYWNpbmdDb250ZW50ID0gdGhpcy5vcHRpb25zLnNwYWNpbmdDb250ZW50LnJlcGxhY2UoJyAnLCAnJm5ic3A7Jyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHNwYWNlUGFnZShlbGVtZW50cywgb3B0aW9ucywgb2JzZXJ2ZSkge1xyXG4gICAgICAgIGVsZW1lbnRzID0gdHlwZW9mIGVsZW1lbnRzID09PSAnc3RyaW5nJyA/IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoZWxlbWVudHMpIDogKGVsZW1lbnRzIHx8IGRvY3VtZW50KTtcclxuICAgICAgICBvcHRpb25zID0gdGhpcy5yZXNvbHZlT3B0aW9ucyhvcHRpb25zKTtcclxuICAgICAgICBpZiAob3B0aW9ucy53cmFwcGVyKSB7XHJcbiAgICAgICAgICAgIG9wdGlvbnMuc3BhY2luZ0NvbnRlbnQgPSBvcHRpb25zLnNwYWNpbmdDb250ZW50LnJlcGxhY2UoJyAnLCAnJm5ic3A7Jyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICghZWxlbWVudHMuZm9yRWFjaCkge1xyXG4gICAgICAgICAgICBlbGVtZW50cyA9IFtlbGVtZW50c107XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsZW1lbnRzLmZvckVhY2goZSA9PiB7XHJcbiAgICAgICAgICAgIHNwYWNlTm9kZSh0aGlzLCBlLCBvcHRpb25zKTtcclxuICAgICAgICAgICAgaWYgKG9ic2VydmUpIHtcclxuICAgICAgICAgICAgICAgIGxldCBvYnNlcnZlciA9IG5ldyBNdXRhdGlvbk9ic2VydmVyKChtdXRhdGlvbnMsIG9ic2VydmVyKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgb2JzZXJ2ZXIuZGlzY29ubmVjdCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIG11dGF0aW9ucy5mb3JFYWNoKG0gPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAobS50eXBlID09PSAnY2hpbGRMaXN0Jykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zcGFjZVBhZ2UobS5hZGRlZE5vZGVzLCBvcHRpb25zLCBmYWxzZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICBjb25uZWN0KCk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIGxldCBjb25uZWN0ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIG9ic2VydmVyLm9ic2VydmUoZSwge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjaGFyYWN0ZXJEYXRhOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjaGlsZExpc3Q6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJpYnV0ZXM6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN1YnRyZWU6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJpYnV0ZU9sZFZhbHVlOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjaGFyYWN0ZXJEYXRhT2xkVmFsdWU6IHRydWVcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGNvbm5lY3QoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBzcGFjZU5vZGUoc3BhY2VyLCBub2RlLCBvcHRpb25zKSB7XHJcbiAgICBpZiAobm9kZS50YWdOYW1lICYmIElHTk9SRURfVEFHUy50ZXN0KG5vZGUudGFnTmFtZSkgfHwgbm9kZS5ub2RlVHlwZSA9PT0gTm9kZS5DT01NRU5UX05PREUpIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICBsZXQgb3B0aW9uc05vV3JhcHBlciA9IE9iamVjdC5hc3NpZ24oe30sIG9wdGlvbnMsIHt3cmFwcGVyOiBmYWxzZX0pO1xyXG4gICAgbGV0IG9wdGlvbnNOb1dyYXBwZXJOb0hUTUxFbnRpdHkgPSBPYmplY3QuYXNzaWduKHt9LCBvcHRpb25zTm9XcmFwcGVyLCB7XHJcbiAgICAgICAgc3BhY2luZ0NvbnRlbnQ6IG9wdGlvbnMuc3BhY2luZ0NvbnRlbnQucmVwbGFjZSgnJm5ic3A7JywgJyAnKVxyXG4gICAgfSk7XHJcbiAgICBsZXQgb3B0aW9uc0VmZmVjdCA9IG9wdGlvbnM7XHJcbiAgICBpZiAobm9kZS5wYXJlbnROb2RlICYmIG5vZGUucGFyZW50Tm9kZS50YWdOYW1lID09PSAnVElUTEUnKSB7XHJcbiAgICAgICAgb3B0aW9uc0VmZmVjdCA9IG9wdGlvbnNOb1dyYXBwZXJOb0hUTUxFbnRpdHk7XHJcbiAgICB9XHJcblxyXG4gICAgc3BhY2VyLmN1c3RvbShvcHRpb25zRWZmZWN0LCAoc3RlcCwgb3B0cykgPT4ge1xyXG4gICAgICAgIGxldCBjdXJyZW50ID0gU3BhY2VyLmNyZWF0ZVNuaXBwZXQoKCgpID0+IHtcclxuICAgICAgICAgICAgaWYgKG5vZGUubm9kZVR5cGUgPT09IE5vZGUuVEVYVF9OT0RFKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbm9kZS5kYXRhO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG5vZGUudGV4dENvbnRlbnQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KSgpKTtcclxuICAgICAgICBpZiAoY3VycmVudCAmJiBjdXJyZW50LnRleHQpIHtcclxuICAgICAgICAgICAgc3RlcCh7XHJcbiAgICAgICAgICAgICAgICBjdXJyZW50OiBjdXJyZW50XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH0sIChjLCBvcHRzKSA9PiB7XHJcbiAgICAgICAgaWYgKG5vZGUucHJldmlvdXNTaWJsaW5nXHJcbiAgICAgICAgICAgICYmICghbm9kZS5wcmV2aW91c1NpYmxpbmcudGFnTmFtZSB8fCAoIUJMT0NLX1RBR1MudGVzdChub2RlLnByZXZpb3VzU2libGluZy50YWdOYW1lKSAmJiAhU1BBQ0lOR19UQUdTLnRlc3Qobm9kZS5wcmV2aW91c1NpYmxpbmcudGFnTmFtZSkpKVxyXG4gICAgICAgICAgICAmJiAoIW5vZGUudGFnTmFtZSB8fCAoIUJMT0NLX1RBR1MudGVzdChub2RlLnRhZ05hbWUpICYmICFTUEFDSU5HX1RBR1MudGVzdChub2RlLnRhZ05hbWUpKSkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIFNwYWNlci5jcmVhdGVTbmlwcGV0KG5vZGUucHJldmlvdXNTaWJsaW5nLm5vZGVUeXBlID09PSBOb2RlLlRFWFRfTk9ERSA/IG5vZGUucHJldmlvdXNTaWJsaW5nLmRhdGEgOiBub2RlLnByZXZpb3VzU2libGluZy50ZXh0Q29udGVudCk7XHJcbiAgICAgICAgfVxyXG4gICAgfSwgYyA9PiBudWxsLCAob3B0cywgYywgYWRkLCBzLCBhcHBlbmQpID0+IHtcclxuICAgICAgICBpZiAoYWRkKSB7XHJcbiAgICAgICAgICAgIGlmIChvcHRzLndyYXBwZXIpIHtcclxuICAgICAgICAgICAgICAgIGluc2VydEJlZm9yZShjcmVhdGVOb2RlKG9wdHMud3JhcHBlci5vcGVuICsgcyArIG9wdHMud3JhcHBlci5jbG9zZSksIG5vZGUpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgaW5zZXJ0QmVmb3JlKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGFwcGVuZCksIG5vZGUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgaWYgKG5vZGUubm9kZVR5cGUgPT09IE5vZGUuVEVYVF9OT0RFKSB7XHJcbiAgICAgICAgaWYgKG9wdGlvbnNFZmZlY3Qud3JhcHBlcikge1xyXG4gICAgICAgICAgICBzcGFjZXIuY3VzdG9tKG9wdGlvbnNFZmZlY3QsIChzdGVwLCBvcHRzKSA9PiB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gc3BhY2VyLnNwbGl0KG5vZGUuZGF0YSwgb3B0cykucmVkdWNlKChhY2MsIGN1ciwgaSwgc3JjKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHN0ZXAoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjdXJyZW50OiBjdXIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFjYzogYWNjLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpOiBpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzcmM6IHNyY1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfSwgJycpO1xyXG4gICAgICAgICAgICB9LCBjID0+IGMuaSA9PSAwID8gbnVsbCA6IGMuc3JjW2MuaSAtIDFdLCBjID0+IG51bGwsIChvcHRzLCBjLCBhZGQsIHMsIGFwcGVuZCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKGFkZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGluc2VydEJlZm9yZShjcmVhdGVOb2RlKGAke29wdHMud3JhcHBlci5vcGVufSR7c30ke29wdHMud3JhcHBlci5jbG9zZX1gKSwgbm9kZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAoYXBwZW5kKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaW5zZXJ0QmVmb3JlKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGFwcGVuZCksIG5vZGUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgbm9kZS5yZW1vdmUoKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBpZiAobm9kZS5wYXJlbnROb2RlICYmIG5vZGUucGFyZW50Tm9kZS50YWdOYW1lID09PSAnVElUTEUnKSB7XHJcbiAgICAgICAgICAgICAgICBzcGFjZUF0dHJpYnV0ZShzcGFjZXIsIG5vZGUsICdkYXRhJywgb3B0aW9uc05vV3JhcHBlck5vSFRNTEVudGl0eSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBzcGFjZUF0dHJpYnV0ZShzcGFjZXIsIG5vZGUsICdkYXRhJywgb3B0aW9uc05vV3JhcHBlcik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIC8vIHRhZyBhdHRyIG1hcFxyXG4gICAgICAgIGlmIChub2RlLnRhZ05hbWUpIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgayBpbiBvcHRpb25zRWZmZWN0LnRhZ0F0dHJNYXApIHtcclxuICAgICAgICAgICAgICAgIGxldCBhdHRycyA9IG9wdGlvbnNFZmZlY3QudGFnQXR0ck1hcFtrXTtcclxuICAgICAgICAgICAgICAgIGlmIChrID09PSAnKicgfHwgayA9PT0gbm9kZS50YWdOYW1lLnRvTG93ZXJDYXNlKCkpIHtcclxuICAgICAgICAgICAgICAgICAgICBhdHRycy5mb3JFYWNoKGEgPT4gc3BhY2VBdHRyaWJ1dGUoc3BhY2VyLCBub2RlLCBhLCBvcHRpb25zTm9XcmFwcGVyTm9IVE1MRW50aXR5KSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKG5vZGUuY2hpbGROb2Rlcykge1xyXG4gICAgICAgIGxldCBzdGF0aWNOb2RlcyA9IFtdO1xyXG4gICAgICAgIG5vZGUuY2hpbGROb2Rlcy5mb3JFYWNoKGNoaWxkID0+IHtcclxuICAgICAgICAgICAgc3RhdGljTm9kZXMucHVzaChjaGlsZCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgc3RhdGljTm9kZXMuZm9yRWFjaChjaGlsZCA9PiB7XHJcbiAgICAgICAgICAgIHNwYWNlTm9kZShzcGFjZXIsIGNoaWxkLCBvcHRpb25zKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxufVxyXG5cclxuZnVuY3Rpb24gY3JlYXRlTm9kZShodG1sKSB7XHJcbiAgICBsZXQgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICBkaXYuaW5uZXJIVE1MID0gaHRtbDtcclxuICAgIHJldHVybiBkaXYuZmlyc3RDaGlsZDtcclxufVxyXG5cclxuZnVuY3Rpb24gaW5zZXJ0QmVmb3JlKG5ld05vZGUsIG5vZGUpIHtcclxuICAgIGlmIChub2RlLnRhZ05hbWUgIT09ICdIVE1MJyAmJiBub2RlLnBhcmVudE5vZGUgJiYgbm9kZS5wYXJlbnROb2RlLnRhZ05hbWUgIT09ICdIVE1MJykge1xyXG4gICAgICAgIG5vZGUucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUobmV3Tm9kZSwgbm9kZSk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHNwYWNlQXR0cmlidXRlKHNwYWNlciwgbm9kZSwgYXR0ciwgb3B0aW9ucykge1xyXG4gICAgaWYgKG5vZGVbYXR0cl0pIHtcclxuICAgICAgICBsZXQgcmVzdWx0ID0gc3BhY2VyLnNwYWNlKG5vZGVbYXR0cl0sIG9wdGlvbnMpO1xyXG4gICAgICAgIGlmIChub2RlW2F0dHJdICE9PSByZXN1bHQpIHtcclxuICAgICAgICAgICAgbm9kZVthdHRyXSA9IHJlc3VsdDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IEJyb3dzZXJTcGFjZXI7IiwiLypcclxuICpcclxuICovXHJcbmltcG9ydCBTbmlwcGV0IGZyb20gXCIuL3NuaXBwZXQuanNcIjtcclxuXHJcbmNvbnN0IExPT0tCRUhJTkRfU1VQUE9SVEVEID0gKCgpID0+IHtcclxuICAgIHRyeSB7XHJcbiAgICAgICAgbmV3IFJlZ0V4cCgnKD88PWV4cCknKTtcclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcbn0pKCk7XHJcblxyXG4vKlxyXG4gKiBcXHUyRTgwLVxcdTJFRkYgICAgQ0pLIOmDqOmmllxyXG4gKiBcXHUyRjAwLVxcdTJGREYgICAg5bq354aZ5a2X5YW46YOo6aaWXHJcbiAqIFxcdTMwMDAtXFx1MzAzRiAgICBDSksg56ym5Y+35ZKM5qCH54K5XHJcbiAqIFxcdTMxQzAtXFx1MzFFRiAgICBDSksg56yU55S7XHJcbiAqIFxcdTMyMDAtXFx1MzJGRiAgICDlsIHpl63lvI8gQ0pLIOaWh+Wtl+WSjOaciOS7vVxyXG4gKiBcXHUzMzAwLVxcdTMzRkYgICAgQ0pLIOWFvOWuuVxyXG4gKiBcXHUzNDAwLVxcdTREQkYgICAgQ0pLIOe7n+S4gOihqOaEj+espuWPt+aJqeWxlSBBXHJcbiAqIFxcdTREQzAtXFx1NERGRiAgICDmmJPnu4/lha3ljYHlm5vljabnrKblj7dcclxuICogXFx1NEUwMC1cXHU5RkJGICAgIENKSyDnu5/kuIDooajmhI/nrKblj7dcclxuICogXFx1RjkwMC1cXHVGQUZGICAgIENKSyDlhbzlrrnosaHlvaLmloflrZdcclxuICogXFx1RkUzMC1cXHVGRTRGICAgIENKSyDlhbzlrrnlvaLlvI9cclxuICogXFx1RkYwMC1cXHVGRkVGICAgIOWFqOinkkFTQ0lJ44CB5YWo6KeS5qCH54K5XHJcbiAqXHJcbiAqIGh0dHBzOi8vd3d3LnVuaWNvZGUub3JnL1B1YmxpYy81LjAuMC91Y2QvVW5paGFuLmh0bWxcclxuICovXHJcbmNvbnN0IENKSyA9ICdcXHUyRTgwLVxcdTJGREZcXHUzMDQwLVxcdUZFNEYnO1xyXG5jb25zdCBTWU1CT0xTID0gJ0AmPV9cXCQlXFxeXFwqXFwtKyc7XHJcbmNvbnN0IExBVElOID0gJ0EtWmEtejAtOVxcdTAwQzAtXFx1MDBGRlxcdTAxMDAtXFx1MDE3RlxcdTAxODAtXFx1MDI0RlxcdTFFMDAtXFx1MUVGRic7XHJcbmNvbnN0IE9ORV9PUl9NT1JFX1NQQUNFID0gJ1sgXSsnO1xyXG5jb25zdCBBTllfU1BBQ0UgPSAnWyBdKic7XHJcbmNvbnN0IFNZTUJPTFNfTkVFRF9TUEFDRV9GT0xMT1dFRCA9ICdbXFwuOiw/IV0nO1xyXG5jb25zdCBPTkVfQUpLID0gYFske0NKS31dYDtcclxuY29uc3QgT05FX0xBVElOID0gYFske0xBVElOfV1gO1xyXG5jb25zdCBPTkVfTEFUSU5fTElLRSA9IGBbJHtMQVRJTn0lXWA7XHJcbmNvbnN0IFNQTElUX0FKS19TUEFDRV9MQVRJTl9MSUtFID0gYnVpbGRTcGxpdChgJHtPTkVfTEFUSU5fTElLRX1gLCBgJHtBTllfU1BBQ0V9YCwgYCR7T05FX0FKS31gKTtcclxuY29uc3QgU1BMSVRfTEFUSU5fTElLRV9TUEFDRV9BSksgPSBidWlsZFNwbGl0KGAke09ORV9BSkt9YCwgYCR7QU5ZX1NQQUNFfWAsIGAke09ORV9MQVRJTl9MSUtFfWApO1xyXG5jb25zdCBTUExJVF9TUEFDRSA9IGAke1NQTElUX0FKS19TUEFDRV9MQVRJTl9MSUtFfXwke1NQTElUX0xBVElOX0xJS0VfU1BBQ0VfQUpLfWA7XHJcbmNvbnN0IFNQTElUX1NZTUJPTFNfTkVFRF9TUEFDRV9GT0xMT1dFRCA9IGJ1aWxkU3BsaXQoYCR7U1lNQk9MU19ORUVEX1NQQUNFX0ZPTExPV0VEfWAsICcnLCBgJHtPTkVfQUpLfXwke09ORV9MQVRJTn1gKTtcclxuY29uc3QgU1BMSVRfQUpLX0xBVElOX0xJS0UgPSBidWlsZFNwbGl0KGAke09ORV9MQVRJTl9MSUtFfWAsICcnLCBgJHtPTkVfQUpLfWApO1xyXG5jb25zdCBTUExJVF9MQVRJTl9MSUtFX0FKSyA9IGJ1aWxkU3BsaXQoYCR7T05FX0FKS31gLCAnJywgYCR7T05FX0xBVElOX0xJS0V9YCk7XHJcbmNvbnN0IFJFR0VYUF9TUEFDRVMgPSBuZXcgUmVnRXhwKGBeJHtPTkVfT1JfTU9SRV9TUEFDRX0kYCk7XHJcbmNvbnN0IFJFR0VYUF9BTllfQ0pLID0gbmV3IFJlZ0V4cChgJHtPTkVfQUpLfWApO1xyXG5jb25zdCBSRUdFWFBfRU5EU19XSVRIX1NZTUJPTFNfTkVFRF9TUEFDRV9GT0xMT1dFRCA9IG5ldyBSZWdFeHAoYCR7U1lNQk9MU19ORUVEX1NQQUNFX0ZPTExPV0VEfSRgKTtcclxuY29uc3QgUkVHRVhQX1NUQVJUU19XSVRIX1NZTUJPTFNfTkVFRF9TUEFDRV9GT0xMT1dFRCA9IG5ldyBSZWdFeHAoYF4ke1NZTUJPTFNfTkVFRF9TUEFDRV9GT0xMT1dFRH1gKTtcclxuY29uc3QgUkVHRVhQX0VORFNfV0lUSF9DSktfQU5EX1NQQUNFID0gbmV3IFJlZ0V4cChgJHtPTkVfQUpLfSR7T05FX09SX01PUkVfU1BBQ0V9JGApO1xyXG5jb25zdCBSRUdFWFBfRU5EU19XSVRIX0xBVElOX0FORF9TUEFDRSA9IG5ldyBSZWdFeHAoYCR7T05FX0xBVElOX0xJS0V9JHtPTkVfT1JfTU9SRV9TUEFDRX0kYCk7XHJcbmNvbnN0IFJFR0VYUF9FTkRTX1dJVEhfQU5ZX1NQQUNFID0gbmV3IFJlZ0V4cChgJHtBTllfU1BBQ0V9JGApO1xyXG5jb25zdCBSRUdFWFBfRU5EU19XSVRIX0NKSyA9IG5ldyBSZWdFeHAoYCR7T05FX0FKS30kYCk7XHJcbmNvbnN0IFJFR0VYUF9FTkRTX1dJVEhfTEFUSU4gPSBuZXcgUmVnRXhwKGAke09ORV9MQVRJTl9MSUtFfSRgKTtcclxuY29uc3QgUkVHRVhQX1NUQVJUU19XSVRIX0NKSyA9IG5ldyBSZWdFeHAoYF4ke09ORV9BSkt9YCk7XHJcbmNvbnN0IFJFR0VYUF9TVEFSVFNfV0lUSF9MQVRJTiA9IG5ldyBSZWdFeHAoYF4ke09ORV9MQVRJTl9MSUtFfWApO1xyXG5jb25zdCBSRUdFWFBfU1BMSVRfRU5EX1NQQUNFID0gbmV3IFJlZ0V4cChgKCR7QU5ZX1NQQUNFfSkkYCk7XHJcbmNvbnN0IFJFR0VYUF9TUExJVF9ERUZBVUxUID0gbmV3IFJlZ0V4cChgKCR7U1BMSVRfQUpLX0xBVElOX0xJS0V9fCR7U1BMSVRfTEFUSU5fTElLRV9BSkt9fCR7U1BMSVRfU1lNQk9MU19ORUVEX1NQQUNFX0ZPTExPV0VEfSlgLCAnZycpO1xyXG5jb25zdCBSRUdFWFBfU1BMSVRfU1BBQ0UgPSBuZXcgUmVnRXhwKGAoJHtTUExJVF9TUEFDRX18JHtTUExJVF9TWU1CT0xTX05FRURfU1BBQ0VfRk9MTE9XRUR9KWAsICdnJyk7XHJcblxyXG5mdW5jdGlvbiB3cmFwU3BsaXQoZXhwKSB7XHJcbiAgICByZXR1cm4gTE9PS0JFSElORF9TVVBQT1JURUQgPyBleHAgOiBmb3JtYXQuY2FsbCgnKHswfSknLCBleHApO1xyXG59XHJcblxyXG5mdW5jdGlvbiBidWlsZFNwbGl0KGxvb2tiZWhpbmQsIGV4cCwgbG9va2FoZWFkKSB7XHJcbiAgICByZXR1cm4gZm9ybWF0LmNhbGwoTE9PS0JFSElORF9TVVBQT1JURUQgPyAnKD88PXswfSl7MX0oPz17Mn0pJyA6ICd7MH17MX0oPz17Mn0pJywgbG9va2JlaGluZCwgZXhwLCBsb29rYWhlYWQpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBmb3JtYXQoLi4uYXJncykge1xyXG4gICAgbGV0IHJlc3VsdCA9IHRoaXM7XHJcbiAgICBpZiAoYXJncy5sZW5ndGggPT0gMCkge1xyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9XHJcbiAgICBsZXQgZGF0YSA9IGFyZ3MubGVuZ3RoID09IDEgJiYgdHlwZW9mIGFyZ3NbMV0gPT09ICdvYmplY3QnID8gYXJnc1sxXSA6IGFyZ3M7XHJcbiAgICBmb3IgKGxldCBrZXkgaW4gZGF0YSkge1xyXG4gICAgICAgIGlmIChkYXRhW2tleV0gIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICByZXN1bHQgPSByZXN1bHQucmVwbGFjZUFsbCgnXFx7JyArIGtleSArICdcXH0nLCBkYXRhW2tleV0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiByZXN1bHQ7XHJcbn1cclxuXHJcbmNvbnN0IERFRkFVTFRfT1BUSU9OUyA9IHtcclxuICAgIHNwYWNpbmdDb250ZW50OiAnICdcclxufTtcclxuXHJcbmxldCBkZWZhdWx0T3B0aW9ucyA9IHt9O1xyXG5cclxuY2xhc3MgU3BhY2VyIHtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihvcHRpb25zKSB7XHJcbiAgICAgICAgdGhpcy5vcHRpb25zID0gaGFuZGxlT3B0aW9ucyhvcHRpb25zKTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgY29uZmlnKG9wdGlvbnMpIHtcclxuICAgICAgICBvcHRpb25zID0gd3JhcE9wdGlvbnMob3B0aW9ucyk7XHJcbiAgICAgICAgT2JqZWN0LmFzc2lnbihkZWZhdWx0T3B0aW9ucywgREVGQVVMVF9PUFRJT05TLCBvcHRpb25zKTtcclxuICAgIH1cclxuXHJcbiAgICBzcGFjZSh0ZXh0LCBvcHRpb25zKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY3VzdG9tKG9wdGlvbnMsIChzdGVwLCBvcHRzKSA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnNwbGl0KHRleHQsIG9wdHMpLnJlZHVjZSgoYWNjLCBjdXIsIGksIHNyYykgPT4ge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHN0ZXAoe1xyXG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnQ6IGN1cixcclxuICAgICAgICAgICAgICAgICAgICBhY2M6IGFjYyxcclxuICAgICAgICAgICAgICAgICAgICBpOiBpLFxyXG4gICAgICAgICAgICAgICAgICAgIHNyYzogc3JjXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSwgJycpO1xyXG4gICAgICAgIH0sIGMgPT4gYy5pID09IDAgPyBudWxsIDogYy5zcmNbYy5pIC0gMV0sIGMgPT4gbnVsbCwgKG9wdHMsIGMsIGFkZCwgcywgYXBwZW5kKSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChhZGQpIHtcclxuICAgICAgICAgICAgICAgIGlmIChvcHRzLndyYXBwZXIpIHtcclxuICAgICAgICAgICAgICAgICAgICBzID0gYCR7b3B0cy53cmFwcGVyLm9wZW59JHtzfSR7b3B0cy53cmFwcGVyLmNsb3NlfWA7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gYCR7Yy5hY2N9JHtzfSR7YXBwZW5kfWA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIGAke2MuYWNjfSR7YXBwZW5kfWA7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgY3VzdG9tKG9wdGlvbnMsIHByZXBhcmUsIHByZXZTb2x2ZXIsIG5leHRTb2x2ZXIsIHNwbGljZXIpIHtcclxuICAgICAgICBvcHRpb25zID0gdGhpcy5yZXNvbHZlT3B0aW9ucyhvcHRpb25zKTtcclxuICAgICAgICByZXR1cm4gcHJlcGFyZShjb250ZXh0ID0+IHtcclxuICAgICAgICAgICAgbGV0IGN1ciA9IGNvbnRleHQuY3VycmVudDtcclxuICAgICAgICAgICAgbGV0IHNwYWNpbmdDb250ZW50ID0gb3B0aW9ucy5zcGFjaW5nQ29udGVudDtcclxuICAgICAgICAgICAgbGV0IGFwcGVuZCA9ICcnO1xyXG4gICAgICAgICAgICBsZXQgYWRkU3BhY2UgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgICAgIGlmIChTcGFjZXIuaXNTcGFjZXMoY3VyKSkge1xyXG4gICAgICAgICAgICAgICAgYWRkU3BhY2UgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgaWYgKCFvcHRpb25zLmZvcmNlVW5pZmllZFNwYWNpbmcgJiYgb3B0aW9ucy5rZWVwT3JpZ2luYWxTcGFjZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHNwYWNpbmdDb250ZW50ID0gY3VyLnRleHQ7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBhcHBlbmQgPSBjdXIudGV4dDtcclxuICAgICAgICAgICAgICAgIGxldCBwcmV2ID0gcHJldlNvbHZlcihjb250ZXh0LCBvcHRpb25zKTtcclxuICAgICAgICAgICAgICAgIGlmIChwcmV2KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKFNwYWNlci5lbmRzV2l0aFN5bWJvbHNOZWVkU3BhY2VGb2xsb3dlZChwcmV2KSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocHJldi5pcygvXFwuJC8pICYmIGN1ci5pcygvXlxcZCsvKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfHwgcHJldi5pcygvOiQvKSAmJiBjdXIuaXMoL15cXGQrLykpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFkZFNwYWNlID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhZGRTcGFjZSA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKFNwYWNlci5lbmRzV2l0aENKSyhwcmV2KSAmJiBTcGFjZXIuc3RhcnRzV2l0aExhdGluKGN1cilcclxuICAgICAgICAgICAgICAgICAgICAgICAgfHwgU3BhY2VyLmVuZHNXaXRoTGF0aW4ocHJldikgJiYgU3BhY2VyLnN0YXJ0c1dpdGhDSksoY3VyKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBiZXR3ZWVuIENKSyBhbmQgTGF0aW4tbGlrZShFbmdsaXNoIGxldHRlcnMsIG51bWJlcnMsIGV0Yy4pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFkZFNwYWNlID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHNwbGljZXIob3B0aW9ucywgY29udGV4dCwgYWRkU3BhY2UsIHNwYWNpbmdDb250ZW50LCBhcHBlbmQpO1xyXG4gICAgICAgIH0sIG9wdGlvbnMpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogU3BsaXQgdG8gU25pcHBldFtdXHJcbiAgICAgKiBAcGFyYW0gdGV4dFxyXG4gICAgICogQHBhcmFtIG9wdGlvbnNcclxuICAgICAqIEByZXR1cm5zIHtTbmlwcGV0W119XHJcbiAgICAgKi9cclxuICAgIHNwbGl0KHRleHQsIG9wdGlvbnMpIHtcclxuICAgICAgICBvcHRpb25zID0gdGhpcy5yZXNvbHZlT3B0aW9ucyhvcHRpb25zKTtcclxuICAgICAgICBpZiAodHlwZW9mIHRleHQgPT09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgICAgIGxldCBwYXR0ZXJuID0gb3B0aW9ucy5oYW5kbGVPcmlnaW5hbFNwYWNlID8gUkVHRVhQX1NQTElUX1NQQUNFIDogUkVHRVhQX1NQTElUX0RFRkFVTFQ7XHJcbiAgICAgICAgICAgIGxldCBhcnIgPSB0ZXh0LnNwbGl0KHBhdHRlcm4pXHJcbiAgICAgICAgICAgICAgICAuZmlsdGVyKChjdXIpID0+IGN1ciAhPT0gJycgJiYgY3VyICE9PSB1bmRlZmluZWQpXHJcbiAgICAgICAgICAgICAgICAubWFwKChjdXIsIGksIHNyYykgPT4gbmV3IFNuaXBwZXQoY3VyKSk7XHJcbiAgICAgICAgICAgIGlmIChhcnIubGVuZ3RoID4gMSAmJiAhTE9PS0JFSElORF9TVVBQT1JURUQpIHtcclxuICAgICAgICAgICAgICAgIGFyciA9IGFyci5mbGF0TWFwKChjdXIsIGksIHNyYykgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vICdTcGFjZXIg6Ze06ZqU5ZmoJz0+WydTcGFjZScsICdyICcsICfpl7TpmpTlmagnXT0+WydTcGFjZScsJ3InLCcgJywgJycsICfpl7TpmpTlmagnXVxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChjdXIuaXMoUkVHRVhQX0VORFNfV0lUSF9BTllfU1BBQ0UpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBjdXIudGV4dC5zcGxpdChSRUdFWFBfU1BMSVRfRU5EX1NQQUNFKS5tYXAoY3VyID0+IG5ldyBTbmlwcGV0KGN1cikpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gY3VyO1xyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIGxldCByZXN1bHQgPSBbXTtcclxuICAgICAgICAgICAgICAgIGFyci5mb3JFYWNoKChjdXIsIGksIHNyYykgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vICdTcGFjZXLpl7TpmpTlmagnPT5bJ1NwYWNlJywgJ3InLCAn6Ze06ZqU5ZmoJ109PlsnU3BhY2VyJywgJ+mXtOmalOWZqCddXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGN1ci50ZXh0Lmxlbmd0aCA9PSAxICYmIGkgPiAwICYmICFjdXIuaXMoL15bIF0qJC8pKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBwcmV2ID0gc3JjW2kgLSAxXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFTcGFjZXIuZW5kc1dpdGhDSksocHJldikgJiYgIVNwYWNlci5zdGFydHNXaXRoQ0pLKGN1cilcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHx8ICFTcGFjZXIuZW5kc1dpdGhMYXRpbihwcmV2KSAmJiAhU3BhY2VyLnN0YXJ0c1dpdGhMYXRpbihjdXIpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXN1bHRbcmVzdWx0Lmxlbmd0aCAtIDFdID0gbmV3IFNuaXBwZXQocmVzdWx0W3Jlc3VsdC5sZW5ndGggLSAxXSArIGN1cik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0LnB1c2goY3VyKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgYXJyID0gcmVzdWx0O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBhcnI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBbbmV3IFNuaXBwZXQodGV4dCldO1xyXG4gICAgfVxyXG5cclxuICAgIHJlc29sdmVPcHRpb25zKG9wdGlvbnMpIHtcclxuICAgICAgICByZXR1cm4gb3B0aW9ucyA/IE9iamVjdC5hc3NpZ24oe30sIHRoaXMub3B0aW9ucywgd3JhcE9wdGlvbnMob3B0aW9ucykpIDogdGhpcy5vcHRpb25zO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBlbmRzV2l0aENKS0FuZFNwYWNpbmcodGV4dCkge1xyXG4gICAgICAgIHJldHVybiB0ZXN0KFJFR0VYUF9FTkRTX1dJVEhfQ0pLX0FORF9TUEFDRSwgdGV4dCk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGVuZHNXaXRoQ0pLKHRleHQpIHtcclxuICAgICAgICByZXR1cm4gdGVzdChSRUdFWFBfRU5EU19XSVRIX0NKSywgdGV4dCk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGVuZHNXaXRoTGF0aW4odGV4dCkge1xyXG4gICAgICAgIHJldHVybiB0ZXN0KFJFR0VYUF9FTkRTX1dJVEhfTEFUSU4sIHRleHQpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBzdGFydHNXaXRoQ0pLKHRleHQpIHtcclxuICAgICAgICByZXR1cm4gdGVzdChSRUdFWFBfU1RBUlRTX1dJVEhfQ0pLLCB0ZXh0KTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgc3RhcnRzV2l0aExhdGluKHRleHQpIHtcclxuICAgICAgICByZXR1cm4gdGVzdChSRUdFWFBfU1RBUlRTX1dJVEhfTEFUSU4sIHRleHQpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBlbmRzV2l0aExhdGluQW5kU3BhY2luZyh0ZXh0KSB7XHJcbiAgICAgICAgcmV0dXJuIHRlc3QoUkVHRVhQX0VORFNfV0lUSF9MQVRJTl9BTkRfU1BBQ0UsIHRleHQpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBlbmRzV2l0aFN5bWJvbHNOZWVkU3BhY2VGb2xsb3dlZCh0ZXh0KSB7XHJcbiAgICAgICAgcmV0dXJuIHRlc3QoUkVHRVhQX0VORFNfV0lUSF9TWU1CT0xTX05FRURfU1BBQ0VfRk9MTE9XRUQsIHRleHQpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBzdGFydHNXaXRoU3ltYm9sc05lZWRTcGFjZUZvbGxvd2VkKHRleHQpIHtcclxuICAgICAgICByZXR1cm4gdGVzdChSRUdFWFBfU1RBUlRTX1dJVEhfU1lNQk9MU19ORUVEX1NQQUNFX0ZPTExPV0VELCB0ZXh0KTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgaXNTcGFjZXModGV4dCkge1xyXG4gICAgICAgIHJldHVybiB0ZXN0KFJFR0VYUF9TUEFDRVMsIHRleHQpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBjcmVhdGVTbmlwcGV0KHRleHQpe1xyXG4gICAgICAgIHJldHVybiBuZXcgU25pcHBldCh0ZXh0KTtcclxuICAgIH1cclxufVxyXG5cclxuZnVuY3Rpb24gdGVzdChyZWdleHAsIHRleHQpIHtcclxuICAgIHJldHVybiB0ZXh0IGluc3RhbmNlb2YgU25pcHBldCA/IHRleHQuaXMocmVnZXhwKSA6IHJlZ2V4cC50ZXN0KHRleHQpO1xyXG59XHJcblxyXG5mdW5jdGlvbiB3cmFwT3B0aW9ucyhvcHRpb25zKSB7XHJcbiAgICByZXR1cm4gdHlwZW9mIG9wdGlvbnMgPT09ICdzdHJpbmcnID8ge3NwYWNpbmdDb250ZW50OiBvcHRpb25zfSA6IG9wdGlvbnM7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGhhbmRsZU9wdGlvbnMob3B0aW9ucykge1xyXG4gICAgb3B0aW9ucyA9IHdyYXBPcHRpb25zKG9wdGlvbnMpO1xyXG4gICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oe30sIERFRkFVTFRfT1BUSU9OUywgZGVmYXVsdE9wdGlvbnMsIG9wdGlvbnMpO1xyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBTcGFjZXI7IiwiY29uc3QgVEVTVF9DQUNIRSA9IFN5bWJvbCgndGVzdENhY2hlJyk7XHJcblxyXG5jbGFzcyBTbmlwcGV0IHtcclxuICAgIGNvbnN0cnVjdG9yKHRleHQpIHtcclxuICAgICAgICB0aGlzLnRleHQgPSB0ZXh0O1xyXG4gICAgICAgIHRoaXNbVEVTVF9DQUNIRV0gPSB7fTtcclxuICAgIH1cclxuXHJcbiAgICBpcyhyZWdleHApIHtcclxuICAgICAgICBsZXQgY2FjaGUgPSB0aGlzW1RFU1RfQ0FDSEVdW3JlZ2V4cF07XHJcbiAgICAgICAgcmV0dXJuIGNhY2hlID09PSB1bmRlZmluZWQgPyAodGhpc1tURVNUX0NBQ0hFXVtyZWdleHBdID0gcmVnZXhwLnRlc3QodGhpcy50ZXh0KSkgOiBjYWNoZTtcclxuICAgIH1cclxuXHJcbiAgICB0b1N0cmluZygpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy50ZXh0O1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBTbmlwcGV0O1xyXG4iLCJpbXBvcnQgQnJvd3NlclNwYWNlciBmcm9tICcuL2Jyb3dzZXIuanMnXHJcblxyXG4vLyBBZGQgc3VwcG9ydCBmb3IgQU1EIChBc3luY2hyb25vdXMgTW9kdWxlIERlZmluaXRpb24pIGxpYnJhcmllcyBzdWNoIGFzIHJlcXVpcmUuanMuXHJcbmlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIHtcclxuICAgIGRlZmluZShbXSwgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgU3BhY2VyOiBCcm93c2VyU3BhY2VyXHJcbiAgICAgICAgfVxyXG4gICAgfSlcclxufVxyXG4vL0FkZCBzdXBwb3J0IGZvcm0gQ29tbW9uSlMgbGlicmFyaWVzIHN1Y2ggYXMgYnJvd3NlcmlmeS5cclxuaWYgKHR5cGVvZiBleHBvcnRzICE9PSAndW5kZWZpbmVkJykge1xyXG4gICAgZXhwb3J0cy5TcGFjZXIgPSBCcm93c2VyU3BhY2VyO1xyXG59XHJcbi8vRGVmaW5lIGdsb2JhbGx5IGluIGNhc2UgQU1EIGlzIG5vdCBhdmFpbGFibGUgb3IgdW51c2VkXHJcbmlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJykge1xyXG4gICAgd2luZG93LlNwYWNlciA9IEJyb3dzZXJTcGFjZXI7XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IEJyb3dzZXJTcGFjZXI7Il19
