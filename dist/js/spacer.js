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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJidWlsZC9qcy9icm93c2VyLmpzIiwiYnVpbGQvanMvY29yZS9jb3JlLmpzIiwiYnVpbGQvanMvY29yZS9zbmlwcGV0LmpzIiwiYnVpbGQvanMvc3BhY2VyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7QUNBQTs7Ozs7Ozs7Ozs7O0FBRUEsSUFBTSxlQUFlLHdCQUFyQjtBQUNBLElBQU0sYUFBYSxvSEFBbkI7QUFDQSxJQUFNLGVBQWUsNEJBQXJCOztBQUVBLGVBQU8sTUFBUCxDQUFjO0FBQ1YsZ0JBQVk7QUFDUixhQUFLLENBQUMsT0FBRCxDQURHO0FBRVIsb0JBQVksQ0FBQyxPQUFELENBRko7QUFHUixpQkFBUyxDQUFDLGFBQUQsQ0FIRDtBQUlSLGVBQU8sQ0FBQyxLQUFEO0FBSkM7QUFERixDQUFkOztJQVNNLGE7OztBQUVGLDJCQUFZLE9BQVosRUFBcUI7QUFBQTs7QUFBQSxrSUFDWCxPQURXOztBQUVqQixZQUFJLFFBQVEsT0FBWixFQUFxQjtBQUNqQixrQkFBSyxPQUFMLENBQWEsY0FBYixHQUE4QixNQUFLLE9BQUwsQ0FBYSxjQUFiLENBQTRCLE9BQTVCLENBQW9DLEdBQXBDLEVBQXlDLFFBQXpDLENBQTlCO0FBQ0g7QUFKZ0I7QUFLcEI7Ozs7a0NBRVMsUSxFQUFVLE8sRUFBUyxPLEVBQVM7QUFBQTs7QUFDbEMsdUJBQVcsT0FBTyxRQUFQLEtBQW9CLFFBQXBCLEdBQStCLFNBQVMsZ0JBQVQsQ0FBMEIsUUFBMUIsQ0FBL0IsR0FBc0UsWUFBWSxRQUE3RjtBQUNBLHNCQUFVLEtBQUssY0FBTCxDQUFvQixPQUFwQixDQUFWO0FBQ0EsZ0JBQUksUUFBUSxPQUFaLEVBQXFCO0FBQ2pCLHdCQUFRLGNBQVIsR0FBeUIsUUFBUSxjQUFSLENBQXVCLE9BQXZCLENBQStCLEdBQS9CLEVBQW9DLFFBQXBDLENBQXpC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LEVBQW1ELE9BQW5ELENBQVA7QUFDSDs7a0JBRWMsTTs7Ozs7Ozs7Ozs7OztBQzdQZixJQUFNLGFBQWEsT0FBTyxXQUFQLENBQW5COztJQUVNLE87QUFDRixxQkFBWSxJQUFaLEVBQWtCO0FBQUE7O0FBQ2QsYUFBSyxJQUFMLEdBQVksSUFBWjtBQUNBLGFBQUssVUFBTCxJQUFtQixFQUFuQjtBQUNIOzs7OzJCQUVFLE0sRUFBUTtBQUNQLGdCQUFJLFFBQVEsS0FBSyxVQUFMLEVBQWlCLE1BQWpCLENBQVo7QUFDQSxtQkFBTyxVQUFVLFNBQVYsR0FBdUIsS0FBSyxVQUFMLEVBQWlCLE1BQWpCLElBQTJCLE9BQU8sSUFBUCxDQUFZLEtBQUssSUFBakIsQ0FBbEQsR0FBNEUsS0FBbkY7QUFDSDs7O21DQUVVO0FBQ1AsbUJBQU8sS0FBSyxJQUFaO0FBQ0g7Ozs7OztrQkFHVSxPOzs7Ozs7Ozs7QUNsQmY7Ozs7OztBQUVBO0FBQ0EsSUFBSSxPQUFPLE1BQVAsS0FBa0IsVUFBbEIsSUFBZ0MsT0FBTyxHQUEzQyxFQUFnRDtBQUM1QyxXQUFPLEVBQVAsRUFBVyxZQUFXO0FBQ2xCLGVBQU87QUFDSCxvQkFBUTtBQURMLFNBQVA7QUFHSCxLQUpEO0FBS0g7QUFDRDtBQUNBLElBQUksT0FBTyxPQUFQLEtBQW1CLFdBQXZCLEVBQW9DO0FBQ2hDLFlBQVEsTUFBUixHQUFpQixpQkFBakI7QUFDSDtBQUNEO0FBQ0EsSUFBSSxPQUFPLE1BQVAsS0FBa0IsV0FBdEIsRUFBbUM7QUFDL0IsV0FBTyxNQUFQLEdBQWdCLGlCQUFoQjtBQUNIOztrQkFFYyxpQiIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsImltcG9ydCBTcGFjZXIgZnJvbSAnLi9jb3JlL2NvcmUuanMnXHJcblxyXG5jb25zdCBJR05PUkVEX1RBR1MgPSAvXihzY3JpcHR8bGlua3xzdHlsZSkkL2k7XHJcbmNvbnN0IEJMT0NLX1RBR1MgPSAvXihkaXZ8cHxoMXxoMnxoM3xoNHxoNXxoNnxibG9ja3FvdXRlfHByZXx0ZXh0YXJlYXxuYXZ8aGVhZGVyfG1haW58Zm9vdGVyfHNlY3Rpb258c2lkYmFyfGFzaWRlfHRhYmxlfGxpfHVsfG9sfGRsKSQvaTtcclxuY29uc3QgU1BBQ0lOR19UQUdTID0gL14oYnJ8aHJ8aW1nfHZpZGVvfGF1ZGlvKSQvaTtcclxuXHJcblNwYWNlci5jb25maWcoe1xyXG4gICAgdGFnQXR0ck1hcDoge1xyXG4gICAgICAgICcqJzogWyd0aXRsZSddLFxyXG4gICAgICAgICdvcHRncm91cCc6IFsnbGFiZWwnXSxcclxuICAgICAgICAnaW5wdXQnOiBbJ3BsYWNlaG9sZGVyJ10sXHJcbiAgICAgICAgJ2ltZyc6IFsnYWx0J11cclxuICAgIH1cclxufSk7XHJcblxyXG5jbGFzcyBCcm93c2VyU3BhY2VyIGV4dGVuZHMgU3BhY2VyIHtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihvcHRpb25zKSB7XHJcbiAgICAgICAgc3VwZXIob3B0aW9ucyk7XHJcbiAgICAgICAgaWYgKG9wdGlvbnMud3JhcHBlcikge1xyXG4gICAgICAgICAgICB0aGlzLm9wdGlvbnMuc3BhY2luZ0NvbnRlbnQgPSB0aGlzLm9wdGlvbnMuc3BhY2luZ0NvbnRlbnQucmVwbGFjZSgnICcsICcmbmJzcDsnKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgc3BhY2VQYWdlKGVsZW1lbnRzLCBvcHRpb25zLCBvYnNlcnZlKSB7XHJcbiAgICAgICAgZWxlbWVudHMgPSB0eXBlb2YgZWxlbWVudHMgPT09ICdzdHJpbmcnID8gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChlbGVtZW50cykgOiAoZWxlbWVudHMgfHwgZG9jdW1lbnQpO1xyXG4gICAgICAgIG9wdGlvbnMgPSB0aGlzLnJlc29sdmVPcHRpb25zKG9wdGlvbnMpO1xyXG4gICAgICAgIGlmIChvcHRpb25zLndyYXBwZXIpIHtcclxuICAgICAgICAgICAgb3B0aW9ucy5zcGFjaW5nQ29udGVudCA9IG9wdGlvbnMuc3BhY2luZ0NvbnRlbnQucmVwbGFjZSgnICcsICcmbmJzcDsnKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCFlbGVtZW50cy5mb3JFYWNoKSB7XHJcbiAgICAgICAgICAgIGVsZW1lbnRzID0gW2VsZW1lbnRzXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxlbWVudHMuZm9yRWFjaChlID0+IHtcclxuICAgICAgICAgICAgc3BhY2VOb2RlKHRoaXMsIGUsIG9wdGlvbnMpO1xyXG4gICAgICAgICAgICBpZiAob2JzZXJ2ZSkge1xyXG4gICAgICAgICAgICAgICAgbGV0IG9ic2VydmVyID0gbmV3IE11dGF0aW9uT2JzZXJ2ZXIoKG11dGF0aW9ucywgb2JzZXJ2ZXIpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBvYnNlcnZlci5kaXNjb25uZWN0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgbXV0YXRpb25zLmZvckVhY2gobSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChtLnR5cGUgPT09ICdjaGlsZExpc3QnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNwYWNlUGFnZShtLmFkZGVkTm9kZXMsIG9wdGlvbnMsIGZhbHNlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbm5lY3QoKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgbGV0IGNvbm5lY3QgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgb2JzZXJ2ZXIub2JzZXJ2ZShlLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoYXJhY3RlckRhdGE6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoaWxkTGlzdDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgYXR0cmlidXRlczogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgc3VidHJlZTogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgYXR0cmlidXRlT2xkVmFsdWU6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoYXJhY3RlckRhdGFPbGRWYWx1ZTogdHJ1ZVxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgY29ubmVjdCgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHNwYWNlTm9kZShzcGFjZXIsIG5vZGUsIG9wdGlvbnMpIHtcclxuICAgIGlmIChub2RlLnRhZ05hbWUgJiYgSUdOT1JFRF9UQUdTLnRlc3Qobm9kZS50YWdOYW1lKSB8fCBub2RlLm5vZGVUeXBlID09PSBOb2RlLkNPTU1FTlRfTk9ERSkge1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIGxldCBvcHRpb25zTm9XcmFwcGVyID0gT2JqZWN0LmFzc2lnbih7fSwgb3B0aW9ucywge3dyYXBwZXI6IGZhbHNlfSk7XHJcbiAgICBsZXQgb3B0aW9uc05vV3JhcHBlck5vSFRNTEVudGl0eSA9IE9iamVjdC5hc3NpZ24oe30sIG9wdGlvbnNOb1dyYXBwZXIsIHtcclxuICAgICAgICBzcGFjaW5nQ29udGVudDogb3B0aW9ucy5zcGFjaW5nQ29udGVudC5yZXBsYWNlKCcmbmJzcDsnLCAnICcpXHJcbiAgICB9KTtcclxuICAgIGxldCBvcHRpb25zRWZmZWN0ID0gb3B0aW9ucztcclxuICAgIGlmIChub2RlLnBhcmVudE5vZGUgJiYgbm9kZS5wYXJlbnROb2RlLnRhZ05hbWUgPT09ICdUSVRMRScpIHtcclxuICAgICAgICBvcHRpb25zRWZmZWN0ID0gb3B0aW9uc05vV3JhcHBlck5vSFRNTEVudGl0eTtcclxuICAgIH1cclxuXHJcbiAgICBzcGFjZXIuY3VzdG9tKG9wdGlvbnNFZmZlY3QsIChzdGVwLCBvcHRzKSA9PiB7XHJcbiAgICAgICAgbGV0IGN1cnJlbnQgPSBTcGFjZXIuY3JlYXRlU25pcHBldCgoKCkgPT4ge1xyXG4gICAgICAgICAgICBpZiAobm9kZS5ub2RlVHlwZSA9PT0gTm9kZS5URVhUX05PREUpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBub2RlLmRhdGE7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbm9kZS50ZXh0Q29udGVudDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pKCkpO1xyXG4gICAgICAgIGlmIChjdXJyZW50ICYmIGN1cnJlbnQudGV4dCkge1xyXG4gICAgICAgICAgICBzdGVwKHtcclxuICAgICAgICAgICAgICAgIGN1cnJlbnQ6IGN1cnJlbnRcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfSwgKGMsIG9wdHMpID0+IHtcclxuICAgICAgICBpZiAobm9kZS5wcmV2aW91c1NpYmxpbmdcclxuICAgICAgICAgICAgJiYgKCFub2RlLnByZXZpb3VzU2libGluZy50YWdOYW1lIHx8ICghQkxPQ0tfVEFHUy50ZXN0KG5vZGUucHJldmlvdXNTaWJsaW5nLnRhZ05hbWUpICYmICFTUEFDSU5HX1RBR1MudGVzdChub2RlLnByZXZpb3VzU2libGluZy50YWdOYW1lKSkpXHJcbiAgICAgICAgICAgICYmICghbm9kZS50YWdOYW1lIHx8ICghQkxPQ0tfVEFHUy50ZXN0KG5vZGUudGFnTmFtZSkgJiYgIVNQQUNJTkdfVEFHUy50ZXN0KG5vZGUudGFnTmFtZSkpKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gU3BhY2VyLmNyZWF0ZVNuaXBwZXQobm9kZS5wcmV2aW91c1NpYmxpbmcubm9kZVR5cGUgPT09IE5vZGUuVEVYVF9OT0RFID8gbm9kZS5wcmV2aW91c1NpYmxpbmcuZGF0YSA6IG5vZGUucHJldmlvdXNTaWJsaW5nLnRleHRDb250ZW50KTtcclxuICAgICAgICB9XHJcbiAgICB9LCBjID0+IG51bGwsIChvcHRzLCBjLCBhZGQsIHMsIGFwcGVuZCkgPT4ge1xyXG4gICAgICAgIGlmIChhZGQpIHtcclxuICAgICAgICAgICAgaWYgKG9wdHMud3JhcHBlcikge1xyXG4gICAgICAgICAgICAgICAgaW5zZXJ0QmVmb3JlKGNyZWF0ZU5vZGUob3B0cy53cmFwcGVyLm9wZW4gKyBzICsgb3B0cy53cmFwcGVyLmNsb3NlKSwgbm9kZSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBpbnNlcnRCZWZvcmUoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoYXBwZW5kKSwgbm9kZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICBpZiAobm9kZS5ub2RlVHlwZSA9PT0gTm9kZS5URVhUX05PREUpIHtcclxuICAgICAgICBpZiAob3B0aW9uc0VmZmVjdC53cmFwcGVyKSB7XHJcbiAgICAgICAgICAgIHNwYWNlci5jdXN0b20ob3B0aW9uc0VmZmVjdCwgKHN0ZXAsIG9wdHMpID0+IHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBzcGFjZXIuc3BsaXQobm9kZS5kYXRhLCBvcHRzKS5yZWR1Y2UoKGFjYywgY3VyLCBpLCBzcmMpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gc3RlcCh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJlbnQ6IGN1cixcclxuICAgICAgICAgICAgICAgICAgICAgICAgYWNjOiBhY2MsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGk6IGksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNyYzogc3JjXHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9LCAnJyk7XHJcbiAgICAgICAgICAgIH0sIGMgPT4gYy5pID09IDAgPyBudWxsIDogYy5zcmNbYy5pIC0gMV0sIGMgPT4gbnVsbCwgKG9wdHMsIGMsIGFkZCwgcywgYXBwZW5kKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAoYWRkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaW5zZXJ0QmVmb3JlKGNyZWF0ZU5vZGUoYCR7b3B0cy53cmFwcGVyLm9wZW59JHtzfSR7b3B0cy53cmFwcGVyLmNsb3NlfWApLCBub2RlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmIChhcHBlbmQpIHtcclxuICAgICAgICAgICAgICAgICAgICBpbnNlcnRCZWZvcmUoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoYXBwZW5kKSwgbm9kZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBub2RlLnJlbW92ZSgpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGlmIChub2RlLnBhcmVudE5vZGUgJiYgbm9kZS5wYXJlbnROb2RlLnRhZ05hbWUgPT09ICdUSVRMRScpIHtcclxuICAgICAgICAgICAgICAgIHNwYWNlQXR0cmlidXRlKHNwYWNlciwgbm9kZSwgJ2RhdGEnLCBvcHRpb25zTm9XcmFwcGVyTm9IVE1MRW50aXR5KTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHNwYWNlQXR0cmlidXRlKHNwYWNlciwgbm9kZSwgJ2RhdGEnLCBvcHRpb25zTm9XcmFwcGVyKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgLy8gdGFnIGF0dHIgbWFwXHJcbiAgICAgICAgaWYgKG5vZGUudGFnTmFtZSkge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBrIGluIG9wdGlvbnNFZmZlY3QudGFnQXR0ck1hcCkge1xyXG4gICAgICAgICAgICAgICAgbGV0IGF0dHJzID0gb3B0aW9uc0VmZmVjdC50YWdBdHRyTWFwW2tdO1xyXG4gICAgICAgICAgICAgICAgaWYgKGsgPT09ICcqJyB8fCBrID09PSBub2RlLnRhZ05hbWUudG9Mb3dlckNhc2UoKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGF0dHJzLmZvckVhY2goYSA9PiBzcGFjZUF0dHJpYnV0ZShzcGFjZXIsIG5vZGUsIGEsIG9wdGlvbnNOb1dyYXBwZXJOb0hUTUxFbnRpdHkpKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpZiAobm9kZS5jaGlsZE5vZGVzKSB7XHJcbiAgICAgICAgbGV0IHN0YXRpY05vZGVzID0gW107XHJcbiAgICAgICAgbm9kZS5jaGlsZE5vZGVzLmZvckVhY2goY2hpbGQgPT4ge1xyXG4gICAgICAgICAgICBzdGF0aWNOb2Rlcy5wdXNoKGNoaWxkKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICBzdGF0aWNOb2Rlcy5mb3JFYWNoKGNoaWxkID0+IHtcclxuICAgICAgICAgICAgc3BhY2VOb2RlKHNwYWNlciwgY2hpbGQsIG9wdGlvbnMpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBjcmVhdGVOb2RlKGh0bWwpIHtcclxuICAgIGxldCBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgIGRpdi5pbm5lckhUTUwgPSBodG1sO1xyXG4gICAgcmV0dXJuIGRpdi5maXJzdENoaWxkO1xyXG59XHJcblxyXG5mdW5jdGlvbiBpbnNlcnRCZWZvcmUobmV3Tm9kZSwgbm9kZSkge1xyXG4gICAgaWYgKG5vZGUudGFnTmFtZSAhPT0gJ0hUTUwnICYmIG5vZGUucGFyZW50Tm9kZSAmJiBub2RlLnBhcmVudE5vZGUudGFnTmFtZSAhPT0gJ0hUTUwnKSB7XHJcbiAgICAgICAgbm9kZS5wYXJlbnROb2RlLmluc2VydEJlZm9yZShuZXdOb2RlLCBub2RlKTtcclxuICAgIH1cclxufVxyXG5cclxuZnVuY3Rpb24gc3BhY2VBdHRyaWJ1dGUoc3BhY2VyLCBub2RlLCBhdHRyLCBvcHRpb25zKSB7XHJcbiAgICBpZiAobm9kZVthdHRyXSkge1xyXG4gICAgICAgIGxldCByZXN1bHQgPSBzcGFjZXIuc3BhY2Uobm9kZVthdHRyXSwgb3B0aW9ucyk7XHJcbiAgICAgICAgaWYgKG5vZGVbYXR0cl0gIT09IHJlc3VsdCkge1xyXG4gICAgICAgICAgICBub2RlW2F0dHJdID0gcmVzdWx0O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgQnJvd3NlclNwYWNlcjsiLCIvKlxyXG4gKlxyXG4gKi9cclxuaW1wb3J0IFNuaXBwZXQgZnJvbSBcIi4vc25pcHBldC5qc1wiO1xyXG5cclxuY29uc3QgTE9PS0JFSElORF9TVVBQT1JURUQgPSAoKCkgPT4ge1xyXG4gICAgdHJ5IHtcclxuICAgICAgICBuZXcgUmVnRXhwKCcoPzw9ZXhwKScpO1xyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxufSkoKTtcclxuXHJcbi8qXHJcbiAqIFxcdTJFODAtXFx1MkVGRiAgICBDSksg6YOo6aaWXHJcbiAqIFxcdTJGMDAtXFx1MkZERiAgICDlurfnhpnlrZflhbjpg6jpppZcclxuICogXFx1MzAwMC1cXHUzMDNGICAgIENKSyDnrKblj7flkozmoIfngrlcclxuICogXFx1MzFDMC1cXHUzMUVGICAgIENKSyDnrJTnlLtcclxuICogXFx1MzIwMC1cXHUzMkZGICAgIOWwgemXreW8jyBDSksg5paH5a2X5ZKM5pyI5Lu9XHJcbiAqIFxcdTMzMDAtXFx1MzNGRiAgICBDSksg5YW85a65XHJcbiAqIFxcdTM0MDAtXFx1NERCRiAgICBDSksg57uf5LiA6KGo5oSP56ym5Y+35omp5bGVIEFcclxuICogXFx1NERDMC1cXHU0REZGICAgIOaYk+e7j+WFreWNgeWbm+WNpuespuWPt1xyXG4gKiBcXHU0RTAwLVxcdTlGQkYgICAgQ0pLIOe7n+S4gOihqOaEj+espuWPt1xyXG4gKiBcXHVGOTAwLVxcdUZBRkYgICAgQ0pLIOWFvOWuueixoeW9ouaWh+Wtl1xyXG4gKiBcXHVGRTMwLVxcdUZFNEYgICAgQ0pLIOWFvOWuueW9ouW8j1xyXG4gKiBcXHVGRjAwLVxcdUZGRUYgICAg5YWo6KeSQVNDSUnjgIHlhajop5LmoIfngrlcclxuICpcclxuICogaHR0cHM6Ly93d3cudW5pY29kZS5vcmcvUHVibGljLzUuMC4wL3VjZC9VbmloYW4uaHRtbFxyXG4gKi9cclxuY29uc3QgQ0pLID0gJ1xcdTJFODAtXFx1MkZERlxcdTMwNDAtXFx1RkU0Ric7XHJcbmNvbnN0IFNZTUJPTFMgPSAnQCY9X1xcJCVcXF5cXCpcXC0rJztcclxuY29uc3QgTEFUSU4gPSAnQS1aYS16MC05XFx1MDBDMC1cXHUwMEZGXFx1MDEwMC1cXHUwMTdGXFx1MDE4MC1cXHUwMjRGXFx1MUUwMC1cXHUxRUZGJztcclxuY29uc3QgT05FX09SX01PUkVfU1BBQ0UgPSAnWyBdKyc7XHJcbmNvbnN0IEFOWV9TUEFDRSA9ICdbIF0qJztcclxuY29uc3QgU1lNQk9MU19ORUVEX1NQQUNFX0ZPTExPV0VEID0gJ1tcXC46LD8hXSc7XHJcbmNvbnN0IE9ORV9BSksgPSBgWyR7Q0pLfV1gO1xyXG5jb25zdCBPTkVfTEFUSU4gPSBgWyR7TEFUSU59XWA7XHJcbmNvbnN0IE9ORV9MQVRJTl9MSUtFID0gYFske0xBVElOfSVdYDtcclxuY29uc3QgU1BMSVRfQUpLX1NQQUNFX0xBVElOX0xJS0UgPSBidWlsZFNwbGl0KGAke09ORV9MQVRJTl9MSUtFfWAsIGAke0FOWV9TUEFDRX1gLCBgJHtPTkVfQUpLfWApO1xyXG5jb25zdCBTUExJVF9MQVRJTl9MSUtFX1NQQUNFX0FKSyA9IGJ1aWxkU3BsaXQoYCR7T05FX0FKS31gLCBgJHtBTllfU1BBQ0V9YCwgYCR7T05FX0xBVElOX0xJS0V9YCk7XHJcbmNvbnN0IFNQTElUX1NQQUNFID0gYCR7U1BMSVRfQUpLX1NQQUNFX0xBVElOX0xJS0V9fCR7U1BMSVRfTEFUSU5fTElLRV9TUEFDRV9BSkt9YDtcclxuY29uc3QgU1BMSVRfU1lNQk9MU19ORUVEX1NQQUNFX0ZPTExPV0VEID0gYnVpbGRTcGxpdChgJHtTWU1CT0xTX05FRURfU1BBQ0VfRk9MTE9XRUR9YCwgJycsIGAke09ORV9BSkt9fCR7T05FX0xBVElOfWApO1xyXG5jb25zdCBTUExJVF9BSktfTEFUSU5fTElLRSA9IGJ1aWxkU3BsaXQoYCR7T05FX0xBVElOX0xJS0V9YCwgJycsIGAke09ORV9BSkt9YCk7XHJcbmNvbnN0IFNQTElUX0xBVElOX0xJS0VfQUpLID0gYnVpbGRTcGxpdChgJHtPTkVfQUpLfWAsICcnLCBgJHtPTkVfTEFUSU5fTElLRX1gKTtcclxuY29uc3QgUkVHRVhQX1NQQUNFUyA9IG5ldyBSZWdFeHAoYF4ke09ORV9PUl9NT1JFX1NQQUNFfSRgKTtcclxuY29uc3QgUkVHRVhQX0FOWV9DSksgPSBuZXcgUmVnRXhwKGAke09ORV9BSkt9YCk7XHJcbmNvbnN0IFJFR0VYUF9FTkRTX1dJVEhfU1lNQk9MU19ORUVEX1NQQUNFX0ZPTExPV0VEID0gbmV3IFJlZ0V4cChgJHtTWU1CT0xTX05FRURfU1BBQ0VfRk9MTE9XRUR9JGApO1xyXG5jb25zdCBSRUdFWFBfU1RBUlRTX1dJVEhfU1lNQk9MU19ORUVEX1NQQUNFX0ZPTExPV0VEID0gbmV3IFJlZ0V4cChgXiR7U1lNQk9MU19ORUVEX1NQQUNFX0ZPTExPV0VEfWApO1xyXG5jb25zdCBSRUdFWFBfRU5EU19XSVRIX0NKS19BTkRfU1BBQ0lORyA9IG5ldyBSZWdFeHAoYCR7T05FX0FKS30ke09ORV9PUl9NT1JFX1NQQUNFfSRgKTtcclxuY29uc3QgUkVHRVhQX0VORFNfV0lUSF9MQVRJTl9BTkRfU1BBQ0lORyA9IG5ldyBSZWdFeHAoYCR7T05FX0xBVElOX0xJS0V9JHtPTkVfT1JfTU9SRV9TUEFDRX0kYCk7XHJcbmNvbnN0IFJFR0VYUF9FTkRTX1dJVEhfQ0pLID0gbmV3IFJlZ0V4cChgJHtPTkVfQUpLfSRgKTtcclxuY29uc3QgUkVHRVhQX0VORFNfV0lUSF9MQVRJTiA9IG5ldyBSZWdFeHAoYCR7T05FX0xBVElOX0xJS0V9JGApO1xyXG5jb25zdCBSRUdFWFBfU1RBUlRTX1dJVEhfQ0pLID0gbmV3IFJlZ0V4cChgXiR7T05FX0FKS31gKTtcclxuY29uc3QgUkVHRVhQX1NUQVJUU19XSVRIX0xBVElOID0gbmV3IFJlZ0V4cChgXiR7T05FX0xBVElOX0xJS0V9YCk7XHJcbmNvbnN0IFJFR0VYUF9TUExJVF9FTkRfU1BBQ0UgPSBuZXcgUmVnRXhwKGAoJHtBTllfU1BBQ0V9KSRgKTtcclxuY29uc3QgUkVHRVhQX1NQTElUX0RFRkFVTFQgPSBuZXcgUmVnRXhwKGAoJHtTUExJVF9BSktfTEFUSU5fTElLRX18JHtTUExJVF9MQVRJTl9MSUtFX0FKS318JHtTUExJVF9TWU1CT0xTX05FRURfU1BBQ0VfRk9MTE9XRUR9KWAsICdnJyk7XHJcbmNvbnN0IFJFR0VYUF9TUExJVF9TUEFDRSA9IG5ldyBSZWdFeHAoYCgke1NQTElUX1NQQUNFfXwke1NQTElUX1NZTUJPTFNfTkVFRF9TUEFDRV9GT0xMT1dFRH0pYCwgJ2cnKTtcclxuXHJcbmZ1bmN0aW9uIHdyYXBTcGxpdChleHApIHtcclxuICAgIHJldHVybiBMT09LQkVISU5EX1NVUFBPUlRFRCA/IGV4cCA6IGZvcm1hdC5jYWxsKCcoezB9KScsIGV4cCk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGJ1aWxkU3BsaXQobG9va2JlaGluZCwgZXhwLCBsb29rYWhlYWQpIHtcclxuICAgIHJldHVybiBmb3JtYXQuY2FsbChMT09LQkVISU5EX1NVUFBPUlRFRCA/ICcoPzw9ezB9KXsxfSg/PXsyfSknIDogJ3swfXsxfSg/PXsyfSknLCBsb29rYmVoaW5kLCBleHAsIGxvb2thaGVhZCk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGZvcm1hdCguLi5hcmdzKSB7XHJcbiAgICBsZXQgcmVzdWx0ID0gdGhpcztcclxuICAgIGlmIChhcmdzLmxlbmd0aCA9PSAwKSB7XHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH1cclxuICAgIGxldCBkYXRhID0gYXJncy5sZW5ndGggPT0gMSAmJiB0eXBlb2YgYXJnc1sxXSA9PT0gJ29iamVjdCcgPyBhcmdzWzFdIDogYXJncztcclxuICAgIGZvciAobGV0IGtleSBpbiBkYXRhKSB7XHJcbiAgICAgICAgaWYgKGRhdGFba2V5XSAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIHJlc3VsdCA9IHJlc3VsdC5yZXBsYWNlQWxsKCdcXHsnICsga2V5ICsgJ1xcfScsIGRhdGFba2V5XSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxufVxyXG5cclxuY29uc3QgREVGQVVMVF9PUFRJT05TID0ge1xyXG4gICAgc3BhY2luZ0NvbnRlbnQ6ICcgJ1xyXG59O1xyXG5cclxubGV0IGRlZmF1bHRPcHRpb25zID0ge307XHJcblxyXG5jbGFzcyBTcGFjZXIge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcclxuICAgICAgICB0aGlzLm9wdGlvbnMgPSBoYW5kbGVPcHRpb25zKG9wdGlvbnMpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBjb25maWcob3B0aW9ucykge1xyXG4gICAgICAgIG9wdGlvbnMgPSB3cmFwT3B0aW9ucyhvcHRpb25zKTtcclxuICAgICAgICBPYmplY3QuYXNzaWduKGRlZmF1bHRPcHRpb25zLCBERUZBVUxUX09QVElPTlMsIG9wdGlvbnMpO1xyXG4gICAgfVxyXG5cclxuICAgIHNwYWNlKHRleHQsIG9wdGlvbnMpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5jdXN0b20ob3B0aW9ucywgKHN0ZXAsIG9wdHMpID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc3BsaXQodGV4dCwgb3B0cykucmVkdWNlKChhY2MsIGN1ciwgaSwgc3JjKSA9PiB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gc3RlcCh7XHJcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudDogY3VyLFxyXG4gICAgICAgICAgICAgICAgICAgIGFjYzogYWNjLFxyXG4gICAgICAgICAgICAgICAgICAgIGk6IGksXHJcbiAgICAgICAgICAgICAgICAgICAgc3JjOiBzcmNcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9LCAnJyk7XHJcbiAgICAgICAgfSwgYyA9PiBjLmkgPT0gMCA/IG51bGwgOiBjLnNyY1tjLmkgLSAxXSwgYyA9PiBudWxsLCAob3B0cywgYywgYWRkLCBzLCBhcHBlbmQpID0+IHtcclxuICAgICAgICAgICAgaWYgKGFkZCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKG9wdHMud3JhcHBlcikge1xyXG4gICAgICAgICAgICAgICAgICAgIHMgPSBgJHtvcHRzLndyYXBwZXIub3Blbn0ke3N9JHtvcHRzLndyYXBwZXIuY2xvc2V9YDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJldHVybiBgJHtjLmFjY30ke3N9JHthcHBlbmR9YDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gYCR7Yy5hY2N9JHthcHBlbmR9YDtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBjdXN0b20ob3B0aW9ucywgcHJlcGFyZSwgcHJldlNvbHZlciwgbmV4dFNvbHZlciwgc3BsaWNlcikge1xyXG4gICAgICAgIG9wdGlvbnMgPSB0aGlzLnJlc29sdmVPcHRpb25zKG9wdGlvbnMpO1xyXG4gICAgICAgIHJldHVybiBwcmVwYXJlKGNvbnRleHQgPT4ge1xyXG4gICAgICAgICAgICBsZXQgY3VyID0gY29udGV4dC5jdXJyZW50O1xyXG4gICAgICAgICAgICBsZXQgc3BhY2luZ0NvbnRlbnQgPSBvcHRpb25zLnNwYWNpbmdDb250ZW50O1xyXG4gICAgICAgICAgICBsZXQgYXBwZW5kID0gJyc7XHJcbiAgICAgICAgICAgIGxldCBhZGRTcGFjZSA9IGZhbHNlO1xyXG5cclxuICAgICAgICAgICAgaWYgKFNwYWNlci5pc1NwYWNlcyhjdXIpKSB7XHJcbiAgICAgICAgICAgICAgICBhZGRTcGFjZSA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICBpZiAoIW9wdGlvbnMuZm9yY2VVbmlmaWVkU3BhY2luZyAmJiBvcHRpb25zLmtlZXBPcmlnaW5hbFNwYWNlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc3BhY2luZ0NvbnRlbnQgPSBjdXIudGV4dDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGFwcGVuZCA9IGN1ci50ZXh0O1xyXG4gICAgICAgICAgICAgICAgbGV0IHByZXYgPSBwcmV2U29sdmVyKGNvbnRleHQsIG9wdGlvbnMpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHByZXYpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoU3BhY2VyLmVuZHNXaXRoU3ltYm9sc05lZWRTcGFjZUZvbGxvd2VkKHByZXYpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwcmV2LmlzKC9cXC4kLykgJiYgY3VyLmlzKC9eXFxkKy8pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB8fCBwcmV2LmlzKC86JC8pICYmIGN1ci5pcygvXlxcZCsvKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYWRkU3BhY2UgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFkZFNwYWNlID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoU3BhY2VyLmVuZHNXaXRoQ0pLKHByZXYpICYmIFNwYWNlci5zdGFydHNXaXRoTGF0aW4oY3VyKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB8fCBTcGFjZXIuZW5kc1dpdGhMYXRpbihwcmV2KSAmJiBTcGFjZXIuc3RhcnRzV2l0aENKSyhjdXIpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGJldHdlZW4gQ0pLIGFuZCBMYXRpbi1saWtlKEVuZ2xpc2ggbGV0dGVycywgbnVtYmVycywgZXRjLilcclxuICAgICAgICAgICAgICAgICAgICAgICAgYWRkU3BhY2UgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gc3BsaWNlcihvcHRpb25zLCBjb250ZXh0LCBhZGRTcGFjZSwgc3BhY2luZ0NvbnRlbnQsIGFwcGVuZCk7XHJcbiAgICAgICAgfSwgb3B0aW9ucyk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBTcGxpdCB0byBTbmlwcGV0W11cclxuICAgICAqIEBwYXJhbSB0ZXh0XHJcbiAgICAgKiBAcGFyYW0gb3B0aW9uc1xyXG4gICAgICogQHJldHVybnMge1NuaXBwZXRbXX1cclxuICAgICAqL1xyXG4gICAgc3BsaXQodGV4dCwgb3B0aW9ucykge1xyXG4gICAgICAgIG9wdGlvbnMgPSB0aGlzLnJlc29sdmVPcHRpb25zKG9wdGlvbnMpO1xyXG4gICAgICAgIGlmICh0eXBlb2YgdGV4dCA9PT0gJ3N0cmluZycpIHtcclxuICAgICAgICAgICAgbGV0IHBhdHRlcm4gPSBvcHRpb25zLmhhbmRsZU9yaWdpbmFsU3BhY2UgPyBSRUdFWFBfU1BMSVRfU1BBQ0UgOiBSRUdFWFBfU1BMSVRfREVGQVVMVDtcclxuICAgICAgICAgICAgbGV0IGFyciA9IHRleHQuc3BsaXQocGF0dGVybilcclxuICAgICAgICAgICAgICAgIC5maWx0ZXIoKGN1cikgPT4gY3VyICE9PSAnJyAmJiBjdXIgIT09IHVuZGVmaW5lZClcclxuICAgICAgICAgICAgICAgIC5tYXAoKGN1ciwgaSwgc3JjKSA9PiBuZXcgU25pcHBldChjdXIpKTtcclxuICAgICAgICAgICAgaWYgKGFyci5sZW5ndGggPiAxICYmICFMT09LQkVISU5EX1NVUFBPUlRFRCkge1xyXG4gICAgICAgICAgICAgICAgYXJyID0gYXJyLmZsYXRNYXAoKGN1ciwgaSwgc3JjKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gJ1NwYWNlciDpl7TpmpTlmagnPT5bJ1NwYWNlJywgJ3IgJywgJ+mXtOmalOWZqCddPT5bJ1NwYWNlJywncicsJyAnLCAnJywgJ+mXtOmalOWZqCddXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGN1ci5pcyhgJHtBTllfU1BBQ0V9JGApKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBjdXIudGV4dC5zcGxpdChSRUdFWFBfU1BMSVRfRU5EX1NQQUNFKS5tYXAoY3VyID0+IG5ldyBTbmlwcGV0KGN1cikpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gY3VyO1xyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIGxldCByZXN1bHQgPSBbXTtcclxuICAgICAgICAgICAgICAgIGFyci5mb3JFYWNoKChjdXIsIGksIHNyYykgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vICdTcGFjZXLpl7TpmpTlmagnPT5bJ1NwYWNlJywgJ3InLCAn6Ze06ZqU5ZmoJ109PlsnU3BhY2VyJywgJ+mXtOmalOWZqCddXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGN1ci50ZXh0Lmxlbmd0aCA9PSAxICYmIGkgPiAwICYmICFjdXIuaXMoL15bIF0qJC8pKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBwcmV2ID0gc3JjW2kgLSAxXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFTcGFjZXIuZW5kc1dpdGhDSksocHJldikgJiYgIVNwYWNlci5zdGFydHNXaXRoQ0pLKGN1cilcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHx8ICFTcGFjZXIuZW5kc1dpdGhMYXRpbihwcmV2KSAmJiAhU3BhY2VyLnN0YXJ0c1dpdGhMYXRpbihjdXIpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXN1bHRbcmVzdWx0Lmxlbmd0aCAtIDFdID0gbmV3IFNuaXBwZXQocmVzdWx0W3Jlc3VsdC5sZW5ndGggLSAxXSArIGN1cik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0LnB1c2goY3VyKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgYXJyID0gcmVzdWx0O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBhcnI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBbbmV3IFNuaXBwZXQodGV4dCldO1xyXG4gICAgfVxyXG5cclxuICAgIHJlc29sdmVPcHRpb25zKG9wdGlvbnMpIHtcclxuICAgICAgICByZXR1cm4gb3B0aW9ucyA/IE9iamVjdC5hc3NpZ24oe30sIHRoaXMub3B0aW9ucywgd3JhcE9wdGlvbnMob3B0aW9ucykpIDogdGhpcy5vcHRpb25zO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBlbmRzV2l0aENKS0FuZFNwYWNpbmcodGV4dCkge1xyXG4gICAgICAgIHJldHVybiB0ZXN0KFJFR0VYUF9FTkRTX1dJVEhfQ0pLX0FORF9TUEFDSU5HLCB0ZXh0KTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgZW5kc1dpdGhDSksodGV4dCkge1xyXG4gICAgICAgIHJldHVybiB0ZXN0KFJFR0VYUF9FTkRTX1dJVEhfQ0pLLCB0ZXh0KTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgZW5kc1dpdGhMYXRpbih0ZXh0KSB7XHJcbiAgICAgICAgcmV0dXJuIHRlc3QoUkVHRVhQX0VORFNfV0lUSF9MQVRJTiwgdGV4dCk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIHN0YXJ0c1dpdGhDSksodGV4dCkge1xyXG4gICAgICAgIHJldHVybiB0ZXN0KFJFR0VYUF9TVEFSVFNfV0lUSF9DSkssIHRleHQpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBzdGFydHNXaXRoTGF0aW4odGV4dCkge1xyXG4gICAgICAgIHJldHVybiB0ZXN0KFJFR0VYUF9TVEFSVFNfV0lUSF9MQVRJTiwgdGV4dCk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGVuZHNXaXRoTGF0aW5BbmRTcGFjaW5nKHRleHQpIHtcclxuICAgICAgICByZXR1cm4gdGVzdChSRUdFWFBfRU5EU19XSVRIX0xBVElOX0FORF9TUEFDSU5HLCB0ZXh0KTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgZW5kc1dpdGhTeW1ib2xzTmVlZFNwYWNlRm9sbG93ZWQodGV4dCkge1xyXG4gICAgICAgIHJldHVybiB0ZXN0KFJFR0VYUF9FTkRTX1dJVEhfU1lNQk9MU19ORUVEX1NQQUNFX0ZPTExPV0VELCB0ZXh0KTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgc3RhcnRzV2l0aFN5bWJvbHNOZWVkU3BhY2VGb2xsb3dlZCh0ZXh0KSB7XHJcbiAgICAgICAgcmV0dXJuIHRlc3QoUkVHRVhQX1NUQVJUU19XSVRIX1NZTUJPTFNfTkVFRF9TUEFDRV9GT0xMT1dFRCwgdGV4dCk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGlzU3BhY2VzKHRleHQpIHtcclxuICAgICAgICByZXR1cm4gdGVzdChSRUdFWFBfU1BBQ0VTLCB0ZXh0KTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgY3JlYXRlU25pcHBldCh0ZXh0KXtcclxuICAgICAgICByZXR1cm4gbmV3IFNuaXBwZXQodGV4dCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHRlc3QocmVnZXhwLCB0ZXh0KSB7XHJcbiAgICByZXR1cm4gdGV4dCBpbnN0YW5jZW9mIFNuaXBwZXQgPyB0ZXh0LmlzKHJlZ2V4cCkgOiByZWdleHAudGVzdCh0ZXh0KTtcclxufVxyXG5cclxuZnVuY3Rpb24gd3JhcE9wdGlvbnMob3B0aW9ucykge1xyXG4gICAgcmV0dXJuIHR5cGVvZiBvcHRpb25zID09PSAnc3RyaW5nJyA/IHtzcGFjaW5nQ29udGVudDogb3B0aW9uc30gOiBvcHRpb25zO1xyXG59XHJcblxyXG5mdW5jdGlvbiBoYW5kbGVPcHRpb25zKG9wdGlvbnMpIHtcclxuICAgIG9wdGlvbnMgPSB3cmFwT3B0aW9ucyhvcHRpb25zKTtcclxuICAgIHJldHVybiBPYmplY3QuYXNzaWduKHt9LCBERUZBVUxUX09QVElPTlMsIGRlZmF1bHRPcHRpb25zLCBvcHRpb25zKTtcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgU3BhY2VyOyIsImNvbnN0IFRFU1RfQ0FDSEUgPSBTeW1ib2woJ3Rlc3RDYWNoZScpO1xyXG5cclxuY2xhc3MgU25pcHBldCB7XHJcbiAgICBjb25zdHJ1Y3Rvcih0ZXh0KSB7XHJcbiAgICAgICAgdGhpcy50ZXh0ID0gdGV4dDtcclxuICAgICAgICB0aGlzW1RFU1RfQ0FDSEVdID0ge307XHJcbiAgICB9XHJcblxyXG4gICAgaXMocmVnZXhwKSB7XHJcbiAgICAgICAgbGV0IGNhY2hlID0gdGhpc1tURVNUX0NBQ0hFXVtyZWdleHBdO1xyXG4gICAgICAgIHJldHVybiBjYWNoZSA9PT0gdW5kZWZpbmVkID8gKHRoaXNbVEVTVF9DQUNIRV1bcmVnZXhwXSA9IHJlZ2V4cC50ZXN0KHRoaXMudGV4dCkpIDogY2FjaGU7XHJcbiAgICB9XHJcblxyXG4gICAgdG9TdHJpbmcoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMudGV4dDtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgU25pcHBldDtcclxuIiwiaW1wb3J0IEJyb3dzZXJTcGFjZXIgZnJvbSAnLi9icm93c2VyLmpzJ1xyXG5cclxuLy8gQWRkIHN1cHBvcnQgZm9yIEFNRCAoQXN5bmNocm9ub3VzIE1vZHVsZSBEZWZpbml0aW9uKSBsaWJyYXJpZXMgc3VjaCBhcyByZXF1aXJlLmpzLlxyXG5pZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XHJcbiAgICBkZWZpbmUoW10sIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIFNwYWNlcjogQnJvd3NlclNwYWNlclxyXG4gICAgICAgIH1cclxuICAgIH0pXHJcbn1cclxuLy9BZGQgc3VwcG9ydCBmb3JtIENvbW1vbkpTIGxpYnJhcmllcyBzdWNoIGFzIGJyb3dzZXJpZnkuXHJcbmlmICh0eXBlb2YgZXhwb3J0cyAhPT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgIGV4cG9ydHMuU3BhY2VyID0gQnJvd3NlclNwYWNlcjtcclxufVxyXG4vL0RlZmluZSBnbG9iYWxseSBpbiBjYXNlIEFNRCBpcyBub3QgYXZhaWxhYmxlIG9yIHVudXNlZFxyXG5pZiAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgIHdpbmRvdy5TcGFjZXIgPSBCcm93c2VyU3BhY2VyO1xyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBCcm93c2VyU3BhY2VyOyJdfQ==
