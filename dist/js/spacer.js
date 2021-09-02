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

var IGNORED_TAGS = /^(script|link|style)$/i;
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
    console.log(node.tagName + ':' + node.nodeType);
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
var REGEXP_ENDS_WITH_CJK_AND_SPACING = new RegExp('' + ONE_AJK + ONE_OR_MORE_SPACE + '$');
var REGEXP_ENDS_WITH_LATIN_AND_SPACING = new RegExp('' + ONE_LATIN_LIKE + ONE_OR_MORE_SPACE + '$');
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
                        if (cur.is(ANY_SPACE + '$')) {
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
            return test(REGEXP_ENDS_WITH_CJK_AND_SPACING, text);
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
            return test(REGEXP_ENDS_WITH_LATIN_AND_SPACING, text);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJidWlsZC9qcy9icm93c2VyLmpzIiwiYnVpbGQvanMvY29yZS9jb3JlLmpzIiwiYnVpbGQvanMvY29yZS9zbmlwcGV0LmpzIiwiYnVpbGQvanMvc3BhY2VyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7QUNBQTs7Ozs7Ozs7Ozs7O0FBRUEsSUFBTSxlQUFlLHdCQUFyQjtBQUNBLElBQU0sYUFBYSxvSEFBbkI7QUFDQSxJQUFNLGVBQWUsNEJBQXJCOztBQUVBLGVBQU8sTUFBUCxDQUFjO0FBQ1YsZ0JBQVk7QUFDUixhQUFLLENBQUMsT0FBRCxDQURHO0FBRVIsb0JBQVksQ0FBQyxPQUFELENBRko7QUFHUixpQkFBUyxDQUFDLGFBQUQsQ0FIRDtBQUlSLGVBQU8sQ0FBQyxLQUFEO0FBSkM7QUFERixDQUFkOztJQVNNLGE7OztBQUVGLDJCQUFZLE9BQVosRUFBcUI7QUFBQTs7QUFBQSxrSUFFWCxPQUZXOztBQUlqQixZQUFJLFFBQVEsT0FBWixFQUFxQjtBQUNqQixrQkFBSyxPQUFMLENBQWEsY0FBYixHQUE4QixNQUFLLE9BQUwsQ0FBYSxjQUFiLENBQTRCLE9BQTVCLENBQW9DLEdBQXBDLEVBQXlDLFFBQXpDLENBQTlCO0FBQ0g7QUFOZ0I7QUFPcEI7Ozs7a0NBRVMsUSxFQUFVLE8sRUFBUyxPLEVBQVM7QUFBQTs7QUFDbEMsdUJBQVcsT0FBTyxRQUFQLEtBQW9CLFFBQXBCLEdBQStCLFNBQVMsZ0JBQVQsQ0FBMEIsUUFBMUIsQ0FBL0IsR0FBc0UsWUFBWSxRQUE3RjtBQUNBLHNCQUFVLEtBQUssY0FBTCxDQUFvQixPQUFwQixDQUFWO0FBQ0EsZ0JBQUksUUFBUSxPQUFaLEVBQXFCO0FBQ2pCLHdCQUFRLGNBQVIsR0FBeUIsUUFBUSxjQUFSLENBQXVCLE9BQXZCLENBQStCLEdBQS9CLEVBQW9DLFFBQXBDLENBQXpC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QUFWO0FBQ0EsV0FBTyxPQUFPLE1BQVAsQ0FBYyxFQUFkLEVBQWtCLGVBQWxCLEVBQW1DLGNBQW5DLEVBQW1ELE9BQW5ELENBQVA7QUFDSDs7a0JBRWMsTTs7Ozs7Ozs7Ozs7OztBQzdQZixJQUFNLGFBQWEsT0FBTyxXQUFQLENBQW5COztJQUVNLE87QUFDRixxQkFBWSxJQUFaLEVBQWtCO0FBQUE7O0FBQ2QsYUFBSyxJQUFMLEdBQVksSUFBWjtBQUNBLGFBQUssVUFBTCxJQUFtQixFQUFuQjtBQUNIOzs7OzJCQUVFLE0sRUFBUTtBQUNQLGdCQUFJLFFBQVEsS0FBSyxVQUFMLEVBQWlCLE1BQWpCLENBQVo7QUFDQSxtQkFBTyxVQUFVLFNBQVYsR0FBdUIsS0FBSyxVQUFMLEVBQWlCLE1BQWpCLElBQTJCLE9BQU8sSUFBUCxDQUFZLEtBQUssSUFBakIsQ0FBbEQsR0FBNEUsS0FBbkY7QUFDSDs7O21DQUVVO0FBQ1AsbUJBQU8sS0FBSyxJQUFaO0FBQ0g7Ozs7OztrQkFHVSxPOzs7Ozs7Ozs7QUNsQmY7Ozs7OztBQUVBO0FBQ0EsSUFBSSxPQUFPLE1BQVAsS0FBa0IsVUFBbEIsSUFBZ0MsT0FBTyxHQUEzQyxFQUFnRDtBQUM1QyxXQUFPLEVBQVAsRUFBVyxZQUFXO0FBQ2xCLGVBQU87QUFDSCxvQkFBUTtBQURMLFNBQVA7QUFHSCxLQUpEO0FBS0g7QUFDRDtBQUNBLElBQUksT0FBTyxPQUFQLEtBQW1CLFdBQXZCLEVBQW9DO0FBQ2hDLFlBQVEsTUFBUixHQUFpQixpQkFBakI7QUFDSDtBQUNEO0FBQ0EsSUFBSSxPQUFPLE1BQVAsS0FBa0IsV0FBdEIsRUFBbUM7QUFDL0IsV0FBTyxNQUFQLEdBQWdCLGlCQUFoQjtBQUNIOztrQkFFYyxpQiIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsImltcG9ydCBTcGFjZXIgZnJvbSAnLi9jb3JlL2NvcmUuanMnXHJcblxyXG5jb25zdCBJR05PUkVEX1RBR1MgPSAvXihzY3JpcHR8bGlua3xzdHlsZSkkL2k7XHJcbmNvbnN0IEJMT0NLX1RBR1MgPSAvXihkaXZ8cHxoMXxoMnxoM3xoNHxoNXxoNnxibG9ja3FvdXRlfHByZXx0ZXh0YXJlYXxuYXZ8aGVhZGVyfG1haW58Zm9vdGVyfHNlY3Rpb258c2lkYmFyfGFzaWRlfHRhYmxlfGxpfHVsfG9sfGRsKSQvaTtcclxuY29uc3QgU1BBQ0lOR19UQUdTID0gL14oYnJ8aHJ8aW1nfHZpZGVvfGF1ZGlvKSQvaTtcclxuXHJcblNwYWNlci5jb25maWcoe1xyXG4gICAgdGFnQXR0ck1hcDoge1xyXG4gICAgICAgICcqJzogWyd0aXRsZSddLFxyXG4gICAgICAgICdvcHRncm91cCc6IFsnbGFiZWwnXSxcclxuICAgICAgICAnaW5wdXQnOiBbJ3BsYWNlaG9sZGVyJ10sXHJcbiAgICAgICAgJ2ltZyc6IFsnYWx0J11cclxuICAgIH1cclxufSk7XHJcblxyXG5jbGFzcyBCcm93c2VyU3BhY2VyIGV4dGVuZHMgU3BhY2VyIHtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihvcHRpb25zKSB7XHJcblxyXG4gICAgICAgIHN1cGVyKG9wdGlvbnMpO1xyXG5cclxuICAgICAgICBpZiAob3B0aW9ucy53cmFwcGVyKSB7XHJcbiAgICAgICAgICAgIHRoaXMub3B0aW9ucy5zcGFjaW5nQ29udGVudCA9IHRoaXMub3B0aW9ucy5zcGFjaW5nQ29udGVudC5yZXBsYWNlKCcgJywgJyZuYnNwOycpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBzcGFjZVBhZ2UoZWxlbWVudHMsIG9wdGlvbnMsIG9ic2VydmUpIHtcclxuICAgICAgICBlbGVtZW50cyA9IHR5cGVvZiBlbGVtZW50cyA9PT0gJ3N0cmluZycgPyBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKGVsZW1lbnRzKSA6IChlbGVtZW50cyB8fCBkb2N1bWVudCk7XHJcbiAgICAgICAgb3B0aW9ucyA9IHRoaXMucmVzb2x2ZU9wdGlvbnMob3B0aW9ucyk7XHJcbiAgICAgICAgaWYgKG9wdGlvbnMud3JhcHBlcikge1xyXG4gICAgICAgICAgICBvcHRpb25zLnNwYWNpbmdDb250ZW50ID0gb3B0aW9ucy5zcGFjaW5nQ29udGVudC5yZXBsYWNlKCcgJywgJyZuYnNwOycpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoIWVsZW1lbnRzLmZvckVhY2gpIHtcclxuICAgICAgICAgICAgZWxlbWVudHMgPSBbZWxlbWVudHNdO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbGVtZW50cy5mb3JFYWNoKGUgPT4ge1xyXG4gICAgICAgICAgICBzcGFjZU5vZGUodGhpcywgZSwgb3B0aW9ucyk7XHJcbiAgICAgICAgICAgIGlmIChvYnNlcnZlKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgb2JzZXJ2ZXIgPSBuZXcgTXV0YXRpb25PYnNlcnZlcigobXV0YXRpb25zLCBvYnNlcnZlcikgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIG9ic2VydmVyLmRpc2Nvbm5lY3QoKTtcclxuICAgICAgICAgICAgICAgICAgICBtdXRhdGlvbnMuZm9yRWFjaChtID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG0udHlwZSA9PT0gJ2NoaWxkTGlzdCcpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc3BhY2VQYWdlKG0uYWRkZWROb2Rlcywgb3B0aW9ucywgZmFsc2UpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29ubmVjdCgpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICBsZXQgY29ubmVjdCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICBvYnNlcnZlci5vYnNlcnZlKGUsIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2hhcmFjdGVyRGF0YTogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2hpbGRMaXN0OiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBhdHRyaWJ1dGVzOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzdWJ0cmVlOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBhdHRyaWJ1dGVPbGRWYWx1ZTogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2hhcmFjdGVyRGF0YU9sZFZhbHVlOiB0cnVlXHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBjb25uZWN0KCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxufVxyXG5cclxuZnVuY3Rpb24gc3BhY2VOb2RlKHNwYWNlciwgbm9kZSwgb3B0aW9ucykge1xyXG4gICAgaWYgKG5vZGUudGFnTmFtZSAmJiBJR05PUkVEX1RBR1MudGVzdChub2RlLnRhZ05hbWUpIHx8IG5vZGUubm9kZVR5cGUgPT09IE5vZGUuQ09NTUVOVF9OT0RFKSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgY29uc29sZS5sb2cobm9kZS50YWdOYW1lICsgJzonICsgbm9kZS5ub2RlVHlwZSk7XHJcbiAgICBsZXQgb3B0aW9uc05vV3JhcHBlciA9IE9iamVjdC5hc3NpZ24oe30sIG9wdGlvbnMsIHt3cmFwcGVyOiBmYWxzZX0pO1xyXG4gICAgbGV0IG9wdGlvbnNOb1dyYXBwZXJOb0hUTUxFbnRpdHkgPSBPYmplY3QuYXNzaWduKHt9LCBvcHRpb25zTm9XcmFwcGVyLCB7XHJcbiAgICAgICAgc3BhY2luZ0NvbnRlbnQ6IG9wdGlvbnMuc3BhY2luZ0NvbnRlbnQucmVwbGFjZSgnJm5ic3A7JywgJyAnKVxyXG4gICAgfSk7XHJcbiAgICBsZXQgb3B0aW9uc0VmZmVjdCA9IG9wdGlvbnM7XHJcbiAgICBpZiAobm9kZS5wYXJlbnROb2RlICYmIG5vZGUucGFyZW50Tm9kZS50YWdOYW1lID09PSAnVElUTEUnKSB7XHJcbiAgICAgICAgb3B0aW9uc0VmZmVjdCA9IG9wdGlvbnNOb1dyYXBwZXJOb0hUTUxFbnRpdHk7XHJcbiAgICB9XHJcblxyXG4gICAgc3BhY2VyLmN1c3RvbShvcHRpb25zRWZmZWN0LCAoc3RlcCwgb3B0cykgPT4ge1xyXG4gICAgICAgIGxldCBjdXJyZW50ID0gU3BhY2VyLmNyZWF0ZVNuaXBwZXQoKCgpID0+IHtcclxuICAgICAgICAgICAgaWYgKG5vZGUubm9kZVR5cGUgPT09IE5vZGUuVEVYVF9OT0RFKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbm9kZS5kYXRhO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG5vZGUudGV4dENvbnRlbnQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KSgpKTtcclxuICAgICAgICBpZiAoY3VycmVudCAmJiBjdXJyZW50LnRleHQpIHtcclxuICAgICAgICAgICAgc3RlcCh7XHJcbiAgICAgICAgICAgICAgICBjdXJyZW50OiBjdXJyZW50XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH0sIChjLCBvcHRzKSA9PiB7XHJcbiAgICAgICAgaWYgKG5vZGUucHJldmlvdXNTaWJsaW5nXHJcbiAgICAgICAgICAgICYmICghbm9kZS5wcmV2aW91c1NpYmxpbmcudGFnTmFtZSB8fCAoIUJMT0NLX1RBR1MudGVzdChub2RlLnByZXZpb3VzU2libGluZy50YWdOYW1lKSAmJiAhU1BBQ0lOR19UQUdTLnRlc3Qobm9kZS5wcmV2aW91c1NpYmxpbmcudGFnTmFtZSkpKVxyXG4gICAgICAgICAgICAmJiAoIW5vZGUudGFnTmFtZSB8fCAoIUJMT0NLX1RBR1MudGVzdChub2RlLnRhZ05hbWUpICYmICFTUEFDSU5HX1RBR1MudGVzdChub2RlLnRhZ05hbWUpKSkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIFNwYWNlci5jcmVhdGVTbmlwcGV0KG5vZGUucHJldmlvdXNTaWJsaW5nLm5vZGVUeXBlID09PSBOb2RlLlRFWFRfTk9ERSA/IG5vZGUucHJldmlvdXNTaWJsaW5nLmRhdGEgOiBub2RlLnByZXZpb3VzU2libGluZy50ZXh0Q29udGVudCk7XHJcbiAgICAgICAgfVxyXG4gICAgfSwgYyA9PiBudWxsLCAob3B0cywgYywgYWRkLCBzLCBhcHBlbmQpID0+IHtcclxuICAgICAgICBpZiAoYWRkKSB7XHJcbiAgICAgICAgICAgIGlmIChvcHRzLndyYXBwZXIpIHtcclxuICAgICAgICAgICAgICAgIGluc2VydEJlZm9yZShjcmVhdGVOb2RlKG9wdHMud3JhcHBlci5vcGVuICsgcyArIG9wdHMud3JhcHBlci5jbG9zZSksIG5vZGUpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgaW5zZXJ0QmVmb3JlKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGFwcGVuZCksIG5vZGUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgaWYgKG5vZGUubm9kZVR5cGUgPT09IE5vZGUuVEVYVF9OT0RFKSB7XHJcbiAgICAgICAgaWYgKG9wdGlvbnNFZmZlY3Qud3JhcHBlcikge1xyXG4gICAgICAgICAgICBzcGFjZXIuY3VzdG9tKG9wdGlvbnNFZmZlY3QsIChzdGVwLCBvcHRzKSA9PiB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gc3BhY2VyLnNwbGl0KG5vZGUuZGF0YSwgb3B0cykucmVkdWNlKChhY2MsIGN1ciwgaSwgc3JjKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHN0ZXAoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjdXJyZW50OiBjdXIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFjYzogYWNjLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpOiBpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzcmM6IHNyY1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfSwgJycpO1xyXG4gICAgICAgICAgICB9LCBjID0+IGMuaSA9PSAwID8gbnVsbCA6IGMuc3JjW2MuaSAtIDFdLCBjID0+IG51bGwsIChvcHRzLCBjLCBhZGQsIHMsIGFwcGVuZCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKGFkZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGluc2VydEJlZm9yZShjcmVhdGVOb2RlKGAke29wdHMud3JhcHBlci5vcGVufSR7c30ke29wdHMud3JhcHBlci5jbG9zZX1gKSwgbm9kZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAoYXBwZW5kKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaW5zZXJ0QmVmb3JlKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGFwcGVuZCksIG5vZGUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgbm9kZS5yZW1vdmUoKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBpZiAobm9kZS5wYXJlbnROb2RlICYmIG5vZGUucGFyZW50Tm9kZS50YWdOYW1lID09PSAnVElUTEUnKSB7XHJcbiAgICAgICAgICAgICAgICBzcGFjZUF0dHJpYnV0ZShzcGFjZXIsIG5vZGUsICdkYXRhJywgb3B0aW9uc05vV3JhcHBlck5vSFRNTEVudGl0eSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBzcGFjZUF0dHJpYnV0ZShzcGFjZXIsIG5vZGUsICdkYXRhJywgb3B0aW9uc05vV3JhcHBlcik7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICAvLyB0YWcgYXR0ciBtYXBcclxuICAgICAgICBpZiAobm9kZS50YWdOYW1lKSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGsgaW4gb3B0aW9uc0VmZmVjdC50YWdBdHRyTWFwKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgYXR0cnMgPSBvcHRpb25zRWZmZWN0LnRhZ0F0dHJNYXBba107XHJcbiAgICAgICAgICAgICAgICBpZiAoayA9PT0gJyonIHx8IGsgPT09IG5vZGUudGFnTmFtZS50b0xvd2VyQ2FzZSgpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYXR0cnMuZm9yRWFjaChhID0+IHNwYWNlQXR0cmlidXRlKHNwYWNlciwgbm9kZSwgYSwgb3B0aW9uc05vV3JhcHBlck5vSFRNTEVudGl0eSkpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGlmIChub2RlLmNoaWxkTm9kZXMpIHtcclxuICAgICAgICBsZXQgc3RhdGljTm9kZXMgPSBbXTtcclxuICAgICAgICBub2RlLmNoaWxkTm9kZXMuZm9yRWFjaChjaGlsZCA9PiB7XHJcbiAgICAgICAgICAgIHN0YXRpY05vZGVzLnB1c2goY2hpbGQpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHN0YXRpY05vZGVzLmZvckVhY2goY2hpbGQgPT4ge1xyXG4gICAgICAgICAgICBzcGFjZU5vZGUoc3BhY2VyLCBjaGlsZCwgb3B0aW9ucyk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNyZWF0ZU5vZGUoaHRtbCkge1xyXG4gICAgbGV0IGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgZGl2LmlubmVySFRNTCA9IGh0bWw7XHJcbiAgICByZXR1cm4gZGl2LmZpcnN0Q2hpbGQ7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGluc2VydEJlZm9yZShuZXdOb2RlLCBub2RlKSB7XHJcbiAgICBpZiAobm9kZS50YWdOYW1lICE9PSAnSFRNTCcgJiYgbm9kZS5wYXJlbnROb2RlICYmIG5vZGUucGFyZW50Tm9kZS50YWdOYW1lICE9PSAnSFRNTCcpIHtcclxuICAgICAgICBub2RlLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKG5ld05vZGUsIG5vZGUpO1xyXG4gICAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBzcGFjZUF0dHJpYnV0ZShzcGFjZXIsIG5vZGUsIGF0dHIsIG9wdGlvbnMpIHtcclxuICAgIGlmIChub2RlW2F0dHJdKSB7XHJcbiAgICAgICAgbGV0IHJlc3VsdCA9IHNwYWNlci5zcGFjZShub2RlW2F0dHJdLCBvcHRpb25zKTtcclxuICAgICAgICBpZiAobm9kZVthdHRyXSAhPT0gcmVzdWx0KSB7XHJcbiAgICAgICAgICAgIG5vZGVbYXR0cl0gPSByZXN1bHQ7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBCcm93c2VyU3BhY2VyOyIsIi8qXHJcbiAqXHJcbiAqL1xyXG5pbXBvcnQgU25pcHBldCBmcm9tIFwiLi9zbmlwcGV0LmpzXCI7XHJcblxyXG5jb25zdCBMT09LQkVISU5EX1NVUFBPUlRFRCA9ICgoKSA9PiB7XHJcbiAgICB0cnkge1xyXG4gICAgICAgIG5ldyBSZWdFeHAoJyg/PD1leHApJyk7XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG59KSgpO1xyXG5cclxuLypcclxuICogXFx1MkU4MC1cXHUyRUZGICAgIENKSyDpg6jpppZcclxuICogXFx1MkYwMC1cXHUyRkRGICAgIOW6t+eGmeWtl+WFuOmDqOmmllxyXG4gKiBcXHUzMDAwLVxcdTMwM0YgICAgQ0pLIOespuWPt+WSjOagh+eCuVxyXG4gKiBcXHUzMUMwLVxcdTMxRUYgICAgQ0pLIOeslOeUu1xyXG4gKiBcXHUzMjAwLVxcdTMyRkYgICAg5bCB6Zet5byPIENKSyDmloflrZflkozmnIjku71cclxuICogXFx1MzMwMC1cXHUzM0ZGICAgIENKSyDlhbzlrrlcclxuICogXFx1MzQwMC1cXHU0REJGICAgIENKSyDnu5/kuIDooajmhI/nrKblj7fmianlsZUgQVxyXG4gKiBcXHU0REMwLVxcdTRERkYgICAg5piT57uP5YWt5Y2B5Zub5Y2m56ym5Y+3XHJcbiAqIFxcdTRFMDAtXFx1OUZCRiAgICBDSksg57uf5LiA6KGo5oSP56ym5Y+3XHJcbiAqIFxcdUY5MDAtXFx1RkFGRiAgICBDSksg5YW85a656LGh5b2i5paH5a2XXHJcbiAqIFxcdUZFMzAtXFx1RkU0RiAgICBDSksg5YW85a655b2i5byPXHJcbiAqIFxcdUZGMDAtXFx1RkZFRiAgICDlhajop5JBU0NJSeOAgeWFqOinkuagh+eCuVxyXG4gKlxyXG4gKiBodHRwczovL3d3dy51bmljb2RlLm9yZy9QdWJsaWMvNS4wLjAvdWNkL1VuaWhhbi5odG1sXHJcbiAqL1xyXG5jb25zdCBDSksgPSAnXFx1MkU4MC1cXHUyRkRGXFx1MzA0MC1cXHVGRTRGJztcclxuY29uc3QgU1lNQk9MUyA9ICdAJj1fXFwkJVxcXlxcKlxcLSsnO1xyXG5jb25zdCBMQVRJTiA9ICdBLVphLXowLTlcXHUwMEMwLVxcdTAwRkZcXHUwMTAwLVxcdTAxN0ZcXHUwMTgwLVxcdTAyNEZcXHUxRTAwLVxcdTFFRkYnO1xyXG5jb25zdCBPTkVfT1JfTU9SRV9TUEFDRSA9ICdbIF0rJztcclxuY29uc3QgQU5ZX1NQQUNFID0gJ1sgXSonO1xyXG5jb25zdCBTWU1CT0xTX05FRURfU1BBQ0VfRk9MTE9XRUQgPSAnW1xcLjosPyFdJztcclxuY29uc3QgT05FX0FKSyA9IGBbJHtDSkt9XWA7XHJcbmNvbnN0IE9ORV9MQVRJTiA9IGBbJHtMQVRJTn1dYDtcclxuY29uc3QgT05FX0xBVElOX0xJS0UgPSBgWyR7TEFUSU59JV1gO1xyXG5jb25zdCBTUExJVF9BSktfU1BBQ0VfTEFUSU5fTElLRSA9IGJ1aWxkU3BsaXQoYCR7T05FX0xBVElOX0xJS0V9YCwgYCR7QU5ZX1NQQUNFfWAsIGAke09ORV9BSkt9YCk7XHJcbmNvbnN0IFNQTElUX0xBVElOX0xJS0VfU1BBQ0VfQUpLID0gYnVpbGRTcGxpdChgJHtPTkVfQUpLfWAsIGAke0FOWV9TUEFDRX1gLCBgJHtPTkVfTEFUSU5fTElLRX1gKTtcclxuY29uc3QgU1BMSVRfU1BBQ0UgPSBgJHtTUExJVF9BSktfU1BBQ0VfTEFUSU5fTElLRX18JHtTUExJVF9MQVRJTl9MSUtFX1NQQUNFX0FKS31gO1xyXG5jb25zdCBTUExJVF9TWU1CT0xTX05FRURfU1BBQ0VfRk9MTE9XRUQgPSBidWlsZFNwbGl0KGAke1NZTUJPTFNfTkVFRF9TUEFDRV9GT0xMT1dFRH1gLCAnJywgYCR7T05FX0FKS318JHtPTkVfTEFUSU59YCk7XHJcbmNvbnN0IFNQTElUX0FKS19MQVRJTl9MSUtFID0gYnVpbGRTcGxpdChgJHtPTkVfTEFUSU5fTElLRX1gLCAnJywgYCR7T05FX0FKS31gKTtcclxuY29uc3QgU1BMSVRfTEFUSU5fTElLRV9BSksgPSBidWlsZFNwbGl0KGAke09ORV9BSkt9YCwgJycsIGAke09ORV9MQVRJTl9MSUtFfWApO1xyXG5jb25zdCBSRUdFWFBfU1BBQ0VTID0gbmV3IFJlZ0V4cChgXiR7T05FX09SX01PUkVfU1BBQ0V9JGApO1xyXG5jb25zdCBSRUdFWFBfQU5ZX0NKSyA9IG5ldyBSZWdFeHAoYCR7T05FX0FKS31gKTtcclxuY29uc3QgUkVHRVhQX0VORFNfV0lUSF9TWU1CT0xTX05FRURfU1BBQ0VfRk9MTE9XRUQgPSBuZXcgUmVnRXhwKGAke1NZTUJPTFNfTkVFRF9TUEFDRV9GT0xMT1dFRH0kYCk7XHJcbmNvbnN0IFJFR0VYUF9TVEFSVFNfV0lUSF9TWU1CT0xTX05FRURfU1BBQ0VfRk9MTE9XRUQgPSBuZXcgUmVnRXhwKGBeJHtTWU1CT0xTX05FRURfU1BBQ0VfRk9MTE9XRUR9YCk7XHJcbmNvbnN0IFJFR0VYUF9FTkRTX1dJVEhfQ0pLX0FORF9TUEFDSU5HID0gbmV3IFJlZ0V4cChgJHtPTkVfQUpLfSR7T05FX09SX01PUkVfU1BBQ0V9JGApO1xyXG5jb25zdCBSRUdFWFBfRU5EU19XSVRIX0xBVElOX0FORF9TUEFDSU5HID0gbmV3IFJlZ0V4cChgJHtPTkVfTEFUSU5fTElLRX0ke09ORV9PUl9NT1JFX1NQQUNFfSRgKTtcclxuY29uc3QgUkVHRVhQX0VORFNfV0lUSF9DSksgPSBuZXcgUmVnRXhwKGAke09ORV9BSkt9JGApO1xyXG5jb25zdCBSRUdFWFBfRU5EU19XSVRIX0xBVElOID0gbmV3IFJlZ0V4cChgJHtPTkVfTEFUSU5fTElLRX0kYCk7XHJcbmNvbnN0IFJFR0VYUF9TVEFSVFNfV0lUSF9DSksgPSBuZXcgUmVnRXhwKGBeJHtPTkVfQUpLfWApO1xyXG5jb25zdCBSRUdFWFBfU1RBUlRTX1dJVEhfTEFUSU4gPSBuZXcgUmVnRXhwKGBeJHtPTkVfTEFUSU5fTElLRX1gKTtcclxuY29uc3QgUkVHRVhQX1NQTElUX0VORF9TUEFDRSA9IG5ldyBSZWdFeHAoYCgke0FOWV9TUEFDRX0pJGApO1xyXG5jb25zdCBSRUdFWFBfU1BMSVRfREVGQVVMVCA9IG5ldyBSZWdFeHAoYCgke1NQTElUX0FKS19MQVRJTl9MSUtFfXwke1NQTElUX0xBVElOX0xJS0VfQUpLfXwke1NQTElUX1NZTUJPTFNfTkVFRF9TUEFDRV9GT0xMT1dFRH0pYCwgJ2cnKTtcclxuY29uc3QgUkVHRVhQX1NQTElUX1NQQUNFID0gbmV3IFJlZ0V4cChgKCR7U1BMSVRfU1BBQ0V9fCR7U1BMSVRfU1lNQk9MU19ORUVEX1NQQUNFX0ZPTExPV0VEfSlgLCAnZycpO1xyXG5cclxuZnVuY3Rpb24gd3JhcFNwbGl0KGV4cCkge1xyXG4gICAgcmV0dXJuIExPT0tCRUhJTkRfU1VQUE9SVEVEID8gZXhwIDogZm9ybWF0LmNhbGwoJyh7MH0pJywgZXhwKTtcclxufVxyXG5cclxuZnVuY3Rpb24gYnVpbGRTcGxpdChsb29rYmVoaW5kLCBleHAsIGxvb2thaGVhZCkge1xyXG4gICAgcmV0dXJuIGZvcm1hdC5jYWxsKExPT0tCRUhJTkRfU1VQUE9SVEVEID8gJyg/PD17MH0pezF9KD89ezJ9KScgOiAnezB9ezF9KD89ezJ9KScsIGxvb2tiZWhpbmQsIGV4cCwgbG9va2FoZWFkKTtcclxufVxyXG5cclxuZnVuY3Rpb24gZm9ybWF0KC4uLmFyZ3MpIHtcclxuICAgIGxldCByZXN1bHQgPSB0aGlzO1xyXG4gICAgaWYgKGFyZ3MubGVuZ3RoID09IDApIHtcclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfVxyXG4gICAgbGV0IGRhdGEgPSBhcmdzLmxlbmd0aCA9PSAxICYmIHR5cGVvZiBhcmdzWzFdID09PSAnb2JqZWN0JyA/IGFyZ3NbMV0gOiBhcmdzO1xyXG4gICAgZm9yIChsZXQga2V5IGluIGRhdGEpIHtcclxuICAgICAgICBpZiAoZGF0YVtrZXldICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgcmVzdWx0ID0gcmVzdWx0LnJlcGxhY2VBbGwoJ1xceycgKyBrZXkgKyAnXFx9JywgZGF0YVtrZXldKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG59XHJcblxyXG5jb25zdCBERUZBVUxUX09QVElPTlMgPSB7XHJcbiAgICBzcGFjaW5nQ29udGVudDogJyAnXHJcbn07XHJcblxyXG5sZXQgZGVmYXVsdE9wdGlvbnMgPSB7fTtcclxuXHJcbmNsYXNzIFNwYWNlciB7XHJcblxyXG4gICAgY29uc3RydWN0b3Iob3B0aW9ucykge1xyXG4gICAgICAgIHRoaXMub3B0aW9ucyA9IGhhbmRsZU9wdGlvbnMob3B0aW9ucyk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGNvbmZpZyhvcHRpb25zKSB7XHJcbiAgICAgICAgb3B0aW9ucyA9IHdyYXBPcHRpb25zKG9wdGlvbnMpO1xyXG4gICAgICAgIE9iamVjdC5hc3NpZ24oZGVmYXVsdE9wdGlvbnMsIERFRkFVTFRfT1BUSU9OUywgb3B0aW9ucyk7XHJcbiAgICB9XHJcblxyXG4gICAgc3BhY2UodGV4dCwgb3B0aW9ucykge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmN1c3RvbShvcHRpb25zLCAoc3RlcCwgb3B0cykgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zcGxpdCh0ZXh0LCBvcHRzKS5yZWR1Y2UoKGFjYywgY3VyLCBpLCBzcmMpID0+IHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBzdGVwKHtcclxuICAgICAgICAgICAgICAgICAgICBjdXJyZW50OiBjdXIsXHJcbiAgICAgICAgICAgICAgICAgICAgYWNjOiBhY2MsXHJcbiAgICAgICAgICAgICAgICAgICAgaTogaSxcclxuICAgICAgICAgICAgICAgICAgICBzcmM6IHNyY1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0sICcnKTtcclxuICAgICAgICB9LCBjID0+IGMuaSA9PSAwID8gbnVsbCA6IGMuc3JjW2MuaSAtIDFdLCBjID0+IG51bGwsIChvcHRzLCBjLCBhZGQsIHMsIGFwcGVuZCkgPT4ge1xyXG4gICAgICAgICAgICBpZiAoYWRkKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAob3B0cy53cmFwcGVyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcyA9IGAke29wdHMud3JhcHBlci5vcGVufSR7c30ke29wdHMud3JhcHBlci5jbG9zZX1gO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGAke2MuYWNjfSR7c30ke2FwcGVuZH1gO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBgJHtjLmFjY30ke2FwcGVuZH1gO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGN1c3RvbShvcHRpb25zLCBwcmVwYXJlLCBwcmV2U29sdmVyLCBuZXh0U29sdmVyLCBzcGxpY2VyKSB7XHJcbiAgICAgICAgb3B0aW9ucyA9IHRoaXMucmVzb2x2ZU9wdGlvbnMob3B0aW9ucyk7XHJcbiAgICAgICAgcmV0dXJuIHByZXBhcmUoY29udGV4dCA9PiB7XHJcbiAgICAgICAgICAgIGxldCBjdXIgPSBjb250ZXh0LmN1cnJlbnQ7XHJcbiAgICAgICAgICAgIGxldCBzcGFjaW5nQ29udGVudCA9IG9wdGlvbnMuc3BhY2luZ0NvbnRlbnQ7XHJcbiAgICAgICAgICAgIGxldCBhcHBlbmQgPSAnJztcclxuICAgICAgICAgICAgbGV0IGFkZFNwYWNlID0gZmFsc2U7XHJcblxyXG4gICAgICAgICAgICBpZiAoU3BhY2VyLmlzU3BhY2VzKGN1cikpIHtcclxuICAgICAgICAgICAgICAgIGFkZFNwYWNlID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIGlmICghb3B0aW9ucy5mb3JjZVVuaWZpZWRTcGFjaW5nICYmIG9wdGlvbnMua2VlcE9yaWdpbmFsU3BhY2UpIHtcclxuICAgICAgICAgICAgICAgICAgICBzcGFjaW5nQ29udGVudCA9IGN1ci50ZXh0O1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgYXBwZW5kID0gY3VyLnRleHQ7XHJcbiAgICAgICAgICAgICAgICBsZXQgcHJldiA9IHByZXZTb2x2ZXIoY29udGV4dCwgb3B0aW9ucyk7XHJcbiAgICAgICAgICAgICAgICBpZiAocHJldikge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChTcGFjZXIuZW5kc1dpdGhTeW1ib2xzTmVlZFNwYWNlRm9sbG93ZWQocHJldikpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHByZXYuaXMoL1xcLiQvKSAmJiBjdXIuaXMoL15cXGQrLylcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHx8IHByZXYuaXMoLzokLykgJiYgY3VyLmlzKC9eXFxkKy8pKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhZGRTcGFjZSA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYWRkU3BhY2UgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChTcGFjZXIuZW5kc1dpdGhDSksocHJldikgJiYgU3BhY2VyLnN0YXJ0c1dpdGhMYXRpbihjdXIpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHx8IFNwYWNlci5lbmRzV2l0aExhdGluKHByZXYpICYmIFNwYWNlci5zdGFydHNXaXRoQ0pLKGN1cikpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gYmV0d2VlbiBDSksgYW5kIExhdGluLWxpa2UoRW5nbGlzaCBsZXR0ZXJzLCBudW1iZXJzLCBldGMuKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBhZGRTcGFjZSA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBzcGxpY2VyKG9wdGlvbnMsIGNvbnRleHQsIGFkZFNwYWNlLCBzcGFjaW5nQ29udGVudCwgYXBwZW5kKTtcclxuICAgICAgICB9LCBvcHRpb25zKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFNwbGl0IHRvIFNuaXBwZXRbXVxyXG4gICAgICogQHBhcmFtIHRleHRcclxuICAgICAqIEBwYXJhbSBvcHRpb25zXHJcbiAgICAgKiBAcmV0dXJucyB7U25pcHBldFtdfVxyXG4gICAgICovXHJcbiAgICBzcGxpdCh0ZXh0LCBvcHRpb25zKSB7XHJcbiAgICAgICAgb3B0aW9ucyA9IHRoaXMucmVzb2x2ZU9wdGlvbnMob3B0aW9ucyk7XHJcbiAgICAgICAgaWYgKHR5cGVvZiB0ZXh0ID09PSAnc3RyaW5nJykge1xyXG4gICAgICAgICAgICBsZXQgcGF0dGVybiA9IG9wdGlvbnMuaGFuZGxlT3JpZ2luYWxTcGFjZSA/IFJFR0VYUF9TUExJVF9TUEFDRSA6IFJFR0VYUF9TUExJVF9ERUZBVUxUO1xyXG4gICAgICAgICAgICBsZXQgYXJyID0gdGV4dC5zcGxpdChwYXR0ZXJuKVxyXG4gICAgICAgICAgICAgICAgLmZpbHRlcigoY3VyKSA9PiBjdXIgIT09ICcnICYmIGN1ciAhPT0gdW5kZWZpbmVkKVxyXG4gICAgICAgICAgICAgICAgLm1hcCgoY3VyLCBpLCBzcmMpID0+IG5ldyBTbmlwcGV0KGN1cikpO1xyXG4gICAgICAgICAgICBpZiAoYXJyLmxlbmd0aCA+IDEgJiYgIUxPT0tCRUhJTkRfU1VQUE9SVEVEKSB7XHJcbiAgICAgICAgICAgICAgICBhcnIgPSBhcnIuZmxhdE1hcCgoY3VyLCBpLCBzcmMpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAvLyAnU3BhY2VyIOmXtOmalOWZqCc9PlsnU3BhY2UnLCAnciAnLCAn6Ze06ZqU5ZmoJ109PlsnU3BhY2UnLCdyJywnICcsICcnLCAn6Ze06ZqU5ZmoJ11cclxuICAgICAgICAgICAgICAgICAgICBpZiAoY3VyLmlzKGAke0FOWV9TUEFDRX0kYCkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGN1ci50ZXh0LnNwbGl0KFJFR0VYUF9TUExJVF9FTkRfU1BBQ0UpLm1hcChjdXIgPT4gbmV3IFNuaXBwZXQoY3VyKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBjdXI7XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgbGV0IHJlc3VsdCA9IFtdO1xyXG4gICAgICAgICAgICAgICAgYXJyLmZvckVhY2goKGN1ciwgaSwgc3JjKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gJ1NwYWNlcumXtOmalOWZqCc9PlsnU3BhY2UnLCAncicsICfpl7TpmpTlmagnXT0+WydTcGFjZXInLCAn6Ze06ZqU5ZmoJ11cclxuICAgICAgICAgICAgICAgICAgICBpZiAoY3VyLnRleHQubGVuZ3RoID09IDEgJiYgaSA+IDAgJiYgIWN1ci5pcygvXlsgXSokLykpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHByZXYgPSBzcmNbaSAtIDFdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIVNwYWNlci5lbmRzV2l0aENKSyhwcmV2KSAmJiAhU3BhY2VyLnN0YXJ0c1dpdGhDSksoY3VyKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfHwgIVNwYWNlci5lbmRzV2l0aExhdGluKHByZXYpICYmICFTcGFjZXIuc3RhcnRzV2l0aExhdGluKGN1cikpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdFtyZXN1bHQubGVuZ3RoIC0gMV0gPSBuZXcgU25pcHBldChyZXN1bHRbcmVzdWx0Lmxlbmd0aCAtIDFdICsgY3VyKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICByZXN1bHQucHVzaChjdXIpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICBhcnIgPSByZXN1bHQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIGFycjtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIFtuZXcgU25pcHBldCh0ZXh0KV07XHJcbiAgICB9XHJcblxyXG4gICAgcmVzb2x2ZU9wdGlvbnMob3B0aW9ucykge1xyXG4gICAgICAgIHJldHVybiBvcHRpb25zID8gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5vcHRpb25zLCB3cmFwT3B0aW9ucyhvcHRpb25zKSkgOiB0aGlzLm9wdGlvbnM7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGVuZHNXaXRoQ0pLQW5kU3BhY2luZyh0ZXh0KSB7XHJcbiAgICAgICAgcmV0dXJuIHRlc3QoUkVHRVhQX0VORFNfV0lUSF9DSktfQU5EX1NQQUNJTkcsIHRleHQpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBlbmRzV2l0aENKSyh0ZXh0KSB7XHJcbiAgICAgICAgcmV0dXJuIHRlc3QoUkVHRVhQX0VORFNfV0lUSF9DSkssIHRleHQpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBlbmRzV2l0aExhdGluKHRleHQpIHtcclxuICAgICAgICByZXR1cm4gdGVzdChSRUdFWFBfRU5EU19XSVRIX0xBVElOLCB0ZXh0KTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgc3RhcnRzV2l0aENKSyh0ZXh0KSB7XHJcbiAgICAgICAgcmV0dXJuIHRlc3QoUkVHRVhQX1NUQVJUU19XSVRIX0NKSywgdGV4dCk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIHN0YXJ0c1dpdGhMYXRpbih0ZXh0KSB7XHJcbiAgICAgICAgcmV0dXJuIHRlc3QoUkVHRVhQX1NUQVJUU19XSVRIX0xBVElOLCB0ZXh0KTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgZW5kc1dpdGhMYXRpbkFuZFNwYWNpbmcodGV4dCkge1xyXG4gICAgICAgIHJldHVybiB0ZXN0KFJFR0VYUF9FTkRTX1dJVEhfTEFUSU5fQU5EX1NQQUNJTkcsIHRleHQpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBlbmRzV2l0aFN5bWJvbHNOZWVkU3BhY2VGb2xsb3dlZCh0ZXh0KSB7XHJcbiAgICAgICAgcmV0dXJuIHRlc3QoUkVHRVhQX0VORFNfV0lUSF9TWU1CT0xTX05FRURfU1BBQ0VfRk9MTE9XRUQsIHRleHQpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBzdGFydHNXaXRoU3ltYm9sc05lZWRTcGFjZUZvbGxvd2VkKHRleHQpIHtcclxuICAgICAgICByZXR1cm4gdGVzdChSRUdFWFBfU1RBUlRTX1dJVEhfU1lNQk9MU19ORUVEX1NQQUNFX0ZPTExPV0VELCB0ZXh0KTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgaXNTcGFjZXModGV4dCkge1xyXG4gICAgICAgIHJldHVybiB0ZXN0KFJFR0VYUF9TUEFDRVMsIHRleHQpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBjcmVhdGVTbmlwcGV0KHRleHQpe1xyXG4gICAgICAgIHJldHVybiBuZXcgU25pcHBldCh0ZXh0KTtcclxuICAgIH1cclxufVxyXG5cclxuZnVuY3Rpb24gdGVzdChyZWdleHAsIHRleHQpIHtcclxuICAgIHJldHVybiB0ZXh0IGluc3RhbmNlb2YgU25pcHBldCA/IHRleHQuaXMocmVnZXhwKSA6IHJlZ2V4cC50ZXN0KHRleHQpO1xyXG59XHJcblxyXG5mdW5jdGlvbiB3cmFwT3B0aW9ucyhvcHRpb25zKSB7XHJcbiAgICByZXR1cm4gdHlwZW9mIG9wdGlvbnMgPT09ICdzdHJpbmcnID8ge3NwYWNpbmdDb250ZW50OiBvcHRpb25zfSA6IG9wdGlvbnM7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGhhbmRsZU9wdGlvbnMob3B0aW9ucykge1xyXG4gICAgb3B0aW9ucyA9IHdyYXBPcHRpb25zKG9wdGlvbnMpO1xyXG4gICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oe30sIERFRkFVTFRfT1BUSU9OUywgZGVmYXVsdE9wdGlvbnMsIG9wdGlvbnMpO1xyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBTcGFjZXI7IiwiY29uc3QgVEVTVF9DQUNIRSA9IFN5bWJvbCgndGVzdENhY2hlJyk7XHJcblxyXG5jbGFzcyBTbmlwcGV0IHtcclxuICAgIGNvbnN0cnVjdG9yKHRleHQpIHtcclxuICAgICAgICB0aGlzLnRleHQgPSB0ZXh0O1xyXG4gICAgICAgIHRoaXNbVEVTVF9DQUNIRV0gPSB7fTtcclxuICAgIH1cclxuXHJcbiAgICBpcyhyZWdleHApIHtcclxuICAgICAgICBsZXQgY2FjaGUgPSB0aGlzW1RFU1RfQ0FDSEVdW3JlZ2V4cF07XHJcbiAgICAgICAgcmV0dXJuIGNhY2hlID09PSB1bmRlZmluZWQgPyAodGhpc1tURVNUX0NBQ0hFXVtyZWdleHBdID0gcmVnZXhwLnRlc3QodGhpcy50ZXh0KSkgOiBjYWNoZTtcclxuICAgIH1cclxuXHJcbiAgICB0b1N0cmluZygpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy50ZXh0O1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBTbmlwcGV0O1xyXG4iLCJpbXBvcnQgQnJvd3NlclNwYWNlciBmcm9tICcuL2Jyb3dzZXIuanMnXHJcblxyXG4vLyBBZGQgc3VwcG9ydCBmb3IgQU1EIChBc3luY2hyb25vdXMgTW9kdWxlIERlZmluaXRpb24pIGxpYnJhcmllcyBzdWNoIGFzIHJlcXVpcmUuanMuXHJcbmlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIHtcclxuICAgIGRlZmluZShbXSwgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgU3BhY2VyOiBCcm93c2VyU3BhY2VyXHJcbiAgICAgICAgfVxyXG4gICAgfSlcclxufVxyXG4vL0FkZCBzdXBwb3J0IGZvcm0gQ29tbW9uSlMgbGlicmFyaWVzIHN1Y2ggYXMgYnJvd3NlcmlmeS5cclxuaWYgKHR5cGVvZiBleHBvcnRzICE9PSAndW5kZWZpbmVkJykge1xyXG4gICAgZXhwb3J0cy5TcGFjZXIgPSBCcm93c2VyU3BhY2VyO1xyXG59XHJcbi8vRGVmaW5lIGdsb2JhbGx5IGluIGNhc2UgQU1EIGlzIG5vdCBhdmFpbGFibGUgb3IgdW51c2VkXHJcbmlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJykge1xyXG4gICAgd2luZG93LlNwYWNlciA9IEJyb3dzZXJTcGFjZXI7XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IEJyb3dzZXJTcGFjZXI7Il19
