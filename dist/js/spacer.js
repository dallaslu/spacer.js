(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _core = require('./core.js');

var _core2 = _interopRequireDefault(_core);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var IGNORED_TAGS = /^(script|link|style)$/i;
var BLOCK_TAGS = /^(div|p|h1|h2|h3|h4|h5|h6|blockqoute|pre|textarea|nav|header|main|footer|section|sidbar|aside|table|li|ul|ol|dl)$/i;
var SPACING_TAGS = /^(br|hr|img|video|audio)$/i;

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

            elements = typeof elements === 'string' ? document.querySelectorAll(elements) : elements || [document.childNodes[1]];
            options = this.resolveOptions(options);
            if (options.wrapper) {
                options.spacingContent = options.spacingContent.replace(' ', '&nbsp;');
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
    if (node.tagName && IGNORED_TAGS.test(node.tagName)) {
        return;
    }
    var optionsNoWrapper = Object.assign({}, options, { wrapper: false });
    var optionsNoWrapperNoHTMLEntity = Object.assign({}, options, {
        wrapper: false,
        spacingContent: options.spacingContent.replace('&nbsp;', ' ')
    });
    var optionsEffect = options;
    if (node.parentNode && node.parentNode.tagName === 'TITLE') {
        optionsEffect = optionsNoWrapperNoHTMLEntity;
    }
    if (node.previousSibling && (!node.previousSibling.tagName || !BLOCK_TAGS.test(node.previousSibling.tagName) && !SPACING_TAGS.test(node.previousSibling.tagName)) && (!node.tagName || !BLOCK_TAGS.test(node.tagName) && !SPACING_TAGS.test(node.tagName))) {
        var preText = node.previousSibling.nodeType === Node.TEXT_NODE ? node.previousSibling.data : node.previousSibling.textContent;
        if ((_core2.default.endsWithCJK(preText) || _core2.default.endsWithSymbolsNeedSpaceFollowed(preText)) && _core2.default.startsWithLatin(node.textContent) || (_core2.default.endsWithLatin(preText) || _core2.default.endsWithSymbolsNeedSpaceFollowed(preText)) && _core2.default.startsWithCJK(node.textContent)) {
            var spaceContent = optionsEffect.forceUnifiedSpacing ? optionsEffect.spacingContent : '';
            if (optionsEffect.wrapper) {
                insertBefore(createNode(optionsEffect.wrapper.open + spaceContent + optionsEffect.wrapper.close), node);
            } else {
                insertBefore(document.createTextNode(spaceContent ? spaceContent : optionsEffect.spacingContent), node);
            }
        }
        if (optionsEffect.handleOriginalSpace && node.previousSibling.nodeType === Node.TEXT_NODE) {
            if (_core2.default.endsWithCJKAndSpacing(preText) && _core2.default.startsWithLatin(node.textContent) || _core2.default.endsWithLatinAndSpacing(preText) && _core2.default.startsWithCJK(node.textContent)) {
                var preEndSpacing = '';
                var arr = /(.*)([ ]+)$/g.match(node.previousSibling.data);
                node.previousSibling.data = arr[1];
                preEndSpacing = arr[2];
                var _spaceContent = optionsEffect.forceUnifiedSpacing ? optionsEffect.spacingContent : optionsEffect.keepOriginalSpace ? preEndSpacing : '';
                if (optionsEffect.wrapper) {
                    insertBefore(createNode(optionsEffect.wrapper.open + _spaceContent + optionsEffect.wrapper.close), node);
                } else {
                    insertBefore(document.createTextNode(_spaceContent ? _spaceContent : optionsEffect.spacingContent), node);
                }
            }
        }
    }
    if (node.nodeType === Node.TEXT_NODE) {
        if (optionsEffect.wrapper) {
            var _arr = spacer.split(node.data, optionsEffect);
            if (_arr.length == 1) {
                return;
            }
            console.log(_arr);
            for (var i = 0; i < _arr.length; i++) {
                var isSpacing = /^[ ]*$/.test(_arr[i]);
                if (isSpacing || i != 0 && !/^[ ]*$/.test(_arr[i - 1]) && !_core2.default.startsWithSymbolsNeedSpaceFollowed(_arr[i]) && !(/[.]$/.test(_arr[i - 1]) && /^\d+[%]?$|[ ]/.test(_arr[i])) && !(/[:]$/.test(_arr[i - 1]) && /^\d+/.test(_arr[i]))) {
                    var _spaceContent2 = optionsEffect.forceUnifiedSpacing ? optionsEffect.spacingContent : isSpacing && optionsEffect.keepOriginalSpace ? _arr[i] : '';
                    insertBefore(createNode(optionsEffect.wrapper.open + _spaceContent2 + optionsEffect.wrapper.close), node);
                }
                if (!isSpacing) {
                    insertBefore(document.createTextNode(_arr[i]), node);
                }
            }
            node.remove();
        } else {
            if (node.parentNode.tagName === 'TITLE') {
                spaceAttribute(spacer, node, 'data', optionsNoWrapperNoHTMLEntity);
            } else {
                spaceAttribute(spacer, node, 'data', optionsNoWrapper);
            }
        }
        return;
    } else {
        // tag name filter
        spaceAttribute(spacer, node, 'title', optionsNoWrapperNoHTMLEntity);
        spaceAttribute(spacer, node, 'alt', optionsNoWrapperNoHTMLEntity);
        spaceAttribute(spacer, node, 'label', optionsNoWrapperNoHTMLEntity);
        spaceAttribute(spacer, node, 'placeholder', optionsNoWrapperNoHTMLEntity);
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

},{"./core.js":2}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*
 *
 */
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
            var arr = this.split(text, options);
            options = this.resolveOptions(options);
            return arr.reduce(function (acc, cur, i, src) {
                var spacingContent = '';
                var curIsSpace = /^[ ]*$/.test(cur);
                if (curIsSpace && options.forceUnifiedSpacing) {
                    cur = options.spacingContent;
                }
                if (!curIsSpace && (REGEXP_STARTS_WITH_SYMBOLS_NEED_SPACE_FOLLOWED.test(cur) || /\d+\.$/.test(acc) && /^\d+[%]?$/.test(cur) || /\d+:$/.test(acc) && /^\d+/.test(cur))) {
                    return acc + cur;
                }
                if (options.wrapper) {
                    if (curIsSpace) {
                        if (options.keepOriginalSpace) {
                            cur = options.wrapper.open + cur + options.wrapper.close;
                        } else {
                            cur = options.wrapper.open + options.wrapper.close;
                        }
                    } else {
                        spacingContent = options.wrapper.open + options.wrapper.close;
                    }
                } else {
                    if (curIsSpace) {
                        if (options.keepOriginalSpace) {
                            cur = cur;
                        } else {
                            cur = options.spacingContent;
                        }
                    } else {
                        spacingContent = options.spacingContent;
                    }
                }
                return acc + spacingContent + cur;
            });
        }
    }, {
        key: 'split',
        value: function split(text, options) {
            options = this.resolveOptions(options);
            if (typeof text === 'string') {
                var pattern = options.handleOriginalSpace ? REGEXP_SPLIT_SPACE : REGEXP_SPLIT_DEFAULT;
                var arr = text.split(pattern);
                if (arr.length > 1 && !LOOKBEHIND_SUPPORTED) {
                    var result = [];
                    arr.flatMap(function (cur, i, src) {
                        // 'Spacer 间隔器'=>['Space', 'r ', '间隔器']=>['Space','r',' ', '', '间隔器']
                        if (cur !== undefined && cur.length > 0) {
                            return cur.split(REGEXP_SPLIT_END_SPACE);
                        }
                        return [];
                    }).forEach(function (cur, i, src) {
                        // 'Spacer间隔器'=>['Space', 'r', '间隔器']=>['Spacer', '间隔器']
                        if (cur.length == 1 && i > 0 && !/^[ ]*$/.test(cur)) {
                            var prev = src[i - 1];
                            if (!Spacer.endsWithCJK(prev) && !Spacer.startsWithCJK(cur) || !Spacer.endsWithLatin(prev) && !Spacer.startsWithLatin(cur)) {
                                result[result.length - 1] += cur;
                                return;
                            }
                        }
                        result.push(cur);
                    });
                    arr = result;
                }
                return arr.filter(function (cur, i, src) {
                    // ['Spacer',' ', '', '间隔器']=>['Spacer',' ', '间隔器']
                    return cur !== '';
                });
            }
            return [text];
        }
    }, {
        key: 'resolveOptions',
        value: function resolveOptions(options) {
            return options ? handleOptions(options) : this.options;
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
            return REGEXP_ENDS_WITH_CJK_AND_SPACING.test(text);
        }
    }, {
        key: 'endsWithCJK',
        value: function endsWithCJK(text) {
            return REGEXP_ENDS_WITH_CJK.test(text);
        }
    }, {
        key: 'endsWithLatin',
        value: function endsWithLatin(text) {
            return REGEXP_ENDS_WITH_LATIN.test(text);
        }
    }, {
        key: 'startsWithCJK',
        value: function startsWithCJK(text) {
            return REGEXP_STARTS_WITH_CJK.test(text);
        }
    }, {
        key: 'startsWithLatin',
        value: function startsWithLatin(text) {
            return REGEXP_STARTS_WITH_LATIN.test(text);
        }
    }, {
        key: 'endsWithLatinAndSpacing',
        value: function endsWithLatinAndSpacing(text) {
            return REGEXP_ENDS_WITH_LATIN_AND_SPACING.test(text);
        }
    }, {
        key: 'endsWithSymbolsNeedSpaceFollowed',
        value: function endsWithSymbolsNeedSpaceFollowed(text) {
            return REGEXP_ENDS_WITH_SYMBOLS_NEED_SPACE_FOLLOWED.test(text);
        }
    }, {
        key: 'startsWithSymbolsNeedSpaceFollowed',
        value: function startsWithSymbolsNeedSpaceFollowed(text) {
            return REGEXP_STARTS_WITH_SYMBOLS_NEED_SPACE_FOLLOWED.test(text);
        }
    }]);

    return Spacer;
}();

function wrapOptions(options) {
    return typeof options === 'string' ? { spacingContent: options } : options;
}

function handleOptions(options) {
    options = wrapOptions(options);
    return Object.assign({}, DEFAULT_OPTIONS, defaultOptions, options);
}

exports.default = Spacer;

},{}],3:[function(require,module,exports){
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

},{"./browser.js":1}]},{},[3])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJidWlsZC9qcy9icm93c2VyLmpzIiwiYnVpbGQvanMvY29yZS5qcyIsImJ1aWxkL2pzL3NwYWNlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7O0FDQUE7Ozs7Ozs7Ozs7OztBQUVBLElBQU0sZUFBZSx3QkFBckI7QUFDQSxJQUFNLGFBQWEsb0hBQW5CO0FBQ0EsSUFBTSxlQUFlLDRCQUFyQjs7SUFFTSxhOzs7QUFFRiwyQkFBWSxPQUFaLEVBQXFCO0FBQUE7O0FBQUEsa0lBQ1gsT0FEVzs7QUFFakIsWUFBSSxRQUFRLE9BQVosRUFBcUI7QUFDakIsa0JBQUssT0FBTCxDQUFhLGNBQWIsR0FBOEIsTUFBSyxPQUFMLENBQWEsY0FBYixDQUE0QixPQUE1QixDQUFvQyxHQUFwQyxFQUF5QyxRQUF6QyxDQUE5QjtBQUNIO0FBSmdCO0FBS3BCOzs7O2tDQUVTLFEsRUFBVSxPLEVBQVMsTyxFQUFTO0FBQUE7O0FBQ2xDLHVCQUFXLE9BQU8sUUFBUCxLQUFvQixRQUFwQixHQUErQixTQUFTLGdCQUFULENBQTBCLFFBQTFCLENBQS9CLEdBQXNFLFlBQVksQ0FBQyxTQUFTLFVBQVQsQ0FBb0IsQ0FBcEIsQ0FBRCxDQUE3RjtBQUNBLHNCQUFVLEtBQUssY0FBTCxDQUFvQixPQUFwQixDQUFWO0FBQ0EsZ0JBQUksUUFBUSxPQUFaLEVBQXFCO0FBQ2pCLHdCQUFRLGNBQVIsR0FBeUIsUUFBUSxjQUFSLENBQXVCLE9BQXZCLENBQStCLEdBQS9CLEVBQW9DLFFBQXBDLENBQXpCO0FBQ0g7QUFDRCxxQkFBUyxPQUFULENBQWlCLGFBQUs7QUFDbEIsMEJBQVUsTUFBVixFQUFnQixDQUFoQixFQUFtQixPQUFuQjtBQUNBLG9CQUFJLE9BQUosRUFBYTtBQUNULHdCQUFJLFdBQVcsSUFBSSxnQkFBSixDQUFxQixVQUFDLFNBQUQsRUFBWSxR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QW5DLEVBQW1ELE9BQW5ELENBQVA7QUFDSDs7a0JBRWMsTTs7Ozs7Ozs7O0FDdk5mOzs7Ozs7QUFFQTtBQUNBLElBQUksT0FBTyxNQUFQLEtBQWtCLFVBQWxCLElBQWdDLE9BQU8sR0FBM0MsRUFBZ0Q7QUFDNUMsV0FBTyxFQUFQLEVBQVcsWUFBVztBQUNsQixlQUFPO0FBQ0gsb0JBQVE7QUFETCxTQUFQO0FBR0gsS0FKRDtBQUtIO0FBQ0Q7QUFDQSxJQUFJLE9BQU8sT0FBUCxLQUFtQixXQUF2QixFQUFvQztBQUNoQyxZQUFRLE1BQVIsR0FBaUIsaUJBQWpCO0FBQ0g7QUFDRDtBQUNBLElBQUksT0FBTyxNQUFQLEtBQWtCLFdBQXRCLEVBQW1DO0FBQy9CLFdBQU8sTUFBUCxHQUFnQixpQkFBaEI7QUFDSDs7a0JBRWMsaUIiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJpbXBvcnQgU3BhY2VyIGZyb20gJy4vY29yZS5qcydcclxuXHJcbmNvbnN0IElHTk9SRURfVEFHUyA9IC9eKHNjcmlwdHxsaW5rfHN0eWxlKSQvaTtcclxuY29uc3QgQkxPQ0tfVEFHUyA9IC9eKGRpdnxwfGgxfGgyfGgzfGg0fGg1fGg2fGJsb2NrcW91dGV8cHJlfHRleHRhcmVhfG5hdnxoZWFkZXJ8bWFpbnxmb290ZXJ8c2VjdGlvbnxzaWRiYXJ8YXNpZGV8dGFibGV8bGl8dWx8b2x8ZGwpJC9pO1xyXG5jb25zdCBTUEFDSU5HX1RBR1MgPSAvXihicnxocnxpbWd8dmlkZW98YXVkaW8pJC9pO1xyXG5cclxuY2xhc3MgQnJvd3NlclNwYWNlciBleHRlbmRzIFNwYWNlciB7XHJcblxyXG4gICAgY29uc3RydWN0b3Iob3B0aW9ucykge1xyXG4gICAgICAgIHN1cGVyKG9wdGlvbnMpO1xyXG4gICAgICAgIGlmIChvcHRpb25zLndyYXBwZXIpIHtcclxuICAgICAgICAgICAgdGhpcy5vcHRpb25zLnNwYWNpbmdDb250ZW50ID0gdGhpcy5vcHRpb25zLnNwYWNpbmdDb250ZW50LnJlcGxhY2UoJyAnLCAnJm5ic3A7Jyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHNwYWNlUGFnZShlbGVtZW50cywgb3B0aW9ucywgb2JzZXJ2ZSkge1xyXG4gICAgICAgIGVsZW1lbnRzID0gdHlwZW9mIGVsZW1lbnRzID09PSAnc3RyaW5nJyA/IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoZWxlbWVudHMpIDogKGVsZW1lbnRzIHx8IFtkb2N1bWVudC5jaGlsZE5vZGVzWzFdXSk7XHJcbiAgICAgICAgb3B0aW9ucyA9IHRoaXMucmVzb2x2ZU9wdGlvbnMob3B0aW9ucyk7XHJcbiAgICAgICAgaWYgKG9wdGlvbnMud3JhcHBlcikge1xyXG4gICAgICAgICAgICBvcHRpb25zLnNwYWNpbmdDb250ZW50ID0gb3B0aW9ucy5zcGFjaW5nQ29udGVudC5yZXBsYWNlKCcgJywgJyZuYnNwOycpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbGVtZW50cy5mb3JFYWNoKGUgPT4ge1xyXG4gICAgICAgICAgICBzcGFjZU5vZGUodGhpcywgZSwgb3B0aW9ucyk7XHJcbiAgICAgICAgICAgIGlmIChvYnNlcnZlKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgb2JzZXJ2ZXIgPSBuZXcgTXV0YXRpb25PYnNlcnZlcigobXV0YXRpb25zLCBvYnNlcnZlcikgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIG9ic2VydmVyLmRpc2Nvbm5lY3QoKTtcclxuICAgICAgICAgICAgICAgICAgICBtdXRhdGlvbnMuZm9yRWFjaChtID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG0udHlwZSA9PT0gJ2NoaWxkTGlzdCcpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc3BhY2VQYWdlKG0uYWRkZWROb2Rlcywgb3B0aW9ucywgZmFsc2UpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29ubmVjdCgpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICBsZXQgY29ubmVjdCA9IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgICAgICAgb2JzZXJ2ZXIub2JzZXJ2ZShlLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoYXJhY3RlckRhdGE6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoaWxkTGlzdDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgYXR0cmlidXRlczogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgc3VidHJlZTogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgYXR0cmlidXRlT2xkVmFsdWU6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoYXJhY3RlckRhdGFPbGRWYWx1ZTogdHJ1ZVxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgY29ubmVjdCgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHNwYWNlTm9kZShzcGFjZXIsIG5vZGUsIG9wdGlvbnMpIHtcclxuICAgIGlmIChub2RlLnRhZ05hbWUgJiYgSUdOT1JFRF9UQUdTLnRlc3Qobm9kZS50YWdOYW1lKSkge1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIGxldCBvcHRpb25zTm9XcmFwcGVyID0gT2JqZWN0LmFzc2lnbih7fSwgb3B0aW9ucywge3dyYXBwZXI6IGZhbHNlfSk7XHJcbiAgICBsZXQgb3B0aW9uc05vV3JhcHBlck5vSFRNTEVudGl0eSA9IE9iamVjdC5hc3NpZ24oe30sIG9wdGlvbnMsIHtcclxuICAgICAgICB3cmFwcGVyOiBmYWxzZSxcclxuICAgICAgICBzcGFjaW5nQ29udGVudDogb3B0aW9ucy5zcGFjaW5nQ29udGVudC5yZXBsYWNlKCcmbmJzcDsnLCAnICcpXHJcbiAgICB9KTtcclxuICAgIGxldCBvcHRpb25zRWZmZWN0ID0gb3B0aW9ucztcclxuICAgIGlmIChub2RlLnBhcmVudE5vZGUgJiYgbm9kZS5wYXJlbnROb2RlLnRhZ05hbWUgPT09ICdUSVRMRScpIHtcclxuICAgICAgICBvcHRpb25zRWZmZWN0ID0gb3B0aW9uc05vV3JhcHBlck5vSFRNTEVudGl0eTtcclxuICAgIH1cclxuICAgIGlmIChub2RlLnByZXZpb3VzU2libGluZ1xyXG4gICAgICAgICYmICghbm9kZS5wcmV2aW91c1NpYmxpbmcudGFnTmFtZSB8fCAoIUJMT0NLX1RBR1MudGVzdChub2RlLnByZXZpb3VzU2libGluZy50YWdOYW1lKSAmJiAhU1BBQ0lOR19UQUdTLnRlc3Qobm9kZS5wcmV2aW91c1NpYmxpbmcudGFnTmFtZSkpKVxyXG4gICAgICAgICYmICghbm9kZS50YWdOYW1lIHx8ICghQkxPQ0tfVEFHUy50ZXN0KG5vZGUudGFnTmFtZSkgJiYgIVNQQUNJTkdfVEFHUy50ZXN0KG5vZGUudGFnTmFtZSkpKSkge1xyXG4gICAgICAgIGxldCBwcmVUZXh0ID0gbm9kZS5wcmV2aW91c1NpYmxpbmcubm9kZVR5cGUgPT09IE5vZGUuVEVYVF9OT0RFID8gbm9kZS5wcmV2aW91c1NpYmxpbmcuZGF0YSA6IG5vZGUucHJldmlvdXNTaWJsaW5nLnRleHRDb250ZW50O1xyXG4gICAgICAgIGlmICgoU3BhY2VyLmVuZHNXaXRoQ0pLKHByZVRleHQpIHx8IFNwYWNlci5lbmRzV2l0aFN5bWJvbHNOZWVkU3BhY2VGb2xsb3dlZChwcmVUZXh0KSkgJiYgU3BhY2VyLnN0YXJ0c1dpdGhMYXRpbihub2RlLnRleHRDb250ZW50KVxyXG4gICAgICAgICAgICB8fCAoU3BhY2VyLmVuZHNXaXRoTGF0aW4ocHJlVGV4dCkgfHwgU3BhY2VyLmVuZHNXaXRoU3ltYm9sc05lZWRTcGFjZUZvbGxvd2VkKHByZVRleHQpKSAmJiBTcGFjZXIuc3RhcnRzV2l0aENKSyhub2RlLnRleHRDb250ZW50KSkge1xyXG4gICAgICAgICAgICBsZXQgc3BhY2VDb250ZW50ID0gb3B0aW9uc0VmZmVjdC5mb3JjZVVuaWZpZWRTcGFjaW5nID8gb3B0aW9uc0VmZmVjdC5zcGFjaW5nQ29udGVudCA6ICcnO1xyXG4gICAgICAgICAgICBpZiAob3B0aW9uc0VmZmVjdC53cmFwcGVyKSB7XHJcbiAgICAgICAgICAgICAgICBpbnNlcnRCZWZvcmUoY3JlYXRlTm9kZShvcHRpb25zRWZmZWN0LndyYXBwZXIub3BlbiArIHNwYWNlQ29udGVudCArIG9wdGlvbnNFZmZlY3Qud3JhcHBlci5jbG9zZSksIG5vZGUpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgaW5zZXJ0QmVmb3JlKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKHNwYWNlQ29udGVudCA/IHNwYWNlQ29udGVudCA6IG9wdGlvbnNFZmZlY3Quc3BhY2luZ0NvbnRlbnQpLCBub2RlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAob3B0aW9uc0VmZmVjdC5oYW5kbGVPcmlnaW5hbFNwYWNlICYmIG5vZGUucHJldmlvdXNTaWJsaW5nLm5vZGVUeXBlID09PSBOb2RlLlRFWFRfTk9ERSkge1xyXG4gICAgICAgICAgICBpZiAoU3BhY2VyLmVuZHNXaXRoQ0pLQW5kU3BhY2luZyhwcmVUZXh0KSAmJiBTcGFjZXIuc3RhcnRzV2l0aExhdGluKG5vZGUudGV4dENvbnRlbnQpXHJcbiAgICAgICAgICAgICAgICB8fCBTcGFjZXIuZW5kc1dpdGhMYXRpbkFuZFNwYWNpbmcocHJlVGV4dCkgJiYgU3BhY2VyLnN0YXJ0c1dpdGhDSksobm9kZS50ZXh0Q29udGVudCkpIHtcclxuICAgICAgICAgICAgICAgIGxldCBwcmVFbmRTcGFjaW5nID0gJyc7XHJcbiAgICAgICAgICAgICAgICBsZXQgYXJyID0gLyguKikoWyBdKykkL2cubWF0Y2gobm9kZS5wcmV2aW91c1NpYmxpbmcuZGF0YSk7XHJcbiAgICAgICAgICAgICAgICBub2RlLnByZXZpb3VzU2libGluZy5kYXRhID0gYXJyWzFdO1xyXG4gICAgICAgICAgICAgICAgcHJlRW5kU3BhY2luZyA9IGFyclsyXTtcclxuICAgICAgICAgICAgICAgIGxldCBzcGFjZUNvbnRlbnQgPSBvcHRpb25zRWZmZWN0LmZvcmNlVW5pZmllZFNwYWNpbmcgPyBvcHRpb25zRWZmZWN0LnNwYWNpbmdDb250ZW50IDogKG9wdGlvbnNFZmZlY3Qua2VlcE9yaWdpbmFsU3BhY2UgPyBwcmVFbmRTcGFjaW5nIDogJycpO1xyXG4gICAgICAgICAgICAgICAgaWYgKG9wdGlvbnNFZmZlY3Qud3JhcHBlcikge1xyXG4gICAgICAgICAgICAgICAgICAgIGluc2VydEJlZm9yZShjcmVhdGVOb2RlKG9wdGlvbnNFZmZlY3Qud3JhcHBlci5vcGVuICsgc3BhY2VDb250ZW50ICsgb3B0aW9uc0VmZmVjdC53cmFwcGVyLmNsb3NlKSwgbm9kZSk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGluc2VydEJlZm9yZShkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShzcGFjZUNvbnRlbnQgPyBzcGFjZUNvbnRlbnQgOiBvcHRpb25zRWZmZWN0LnNwYWNpbmdDb250ZW50KSwgbm9kZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBpZiAobm9kZS5ub2RlVHlwZSA9PT0gTm9kZS5URVhUX05PREUpIHtcclxuICAgICAgICBpZiAob3B0aW9uc0VmZmVjdC53cmFwcGVyKSB7XHJcbiAgICAgICAgICAgIGxldCBhcnIgPSBzcGFjZXIuc3BsaXQobm9kZS5kYXRhLCBvcHRpb25zRWZmZWN0KTtcclxuICAgICAgICAgICAgaWYgKGFyci5sZW5ndGggPT0gMSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGFycik7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYXJyLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgaXNTcGFjaW5nID0gL15bIF0qJC8udGVzdChhcnJbaV0pO1xyXG4gICAgICAgICAgICAgICAgaWYgKGlzU3BhY2luZyB8fCAoaSAhPSAwICYmICEvXlsgXSokLy50ZXN0KGFycltpIC0gMV0pXHJcbiAgICAgICAgICAgICAgICAgICAgJiYgIVNwYWNlci5zdGFydHNXaXRoU3ltYm9sc05lZWRTcGFjZUZvbGxvd2VkKGFycltpXSlcclxuICAgICAgICAgICAgICAgICAgICAmJiAhKC9bLl0kLy50ZXN0KGFycltpIC0gMV0pICYmIC9eXFxkK1slXT8kfFsgXS8udGVzdChhcnJbaV0pKVxyXG4gICAgICAgICAgICAgICAgICAgICYmICEoL1s6XSQvLnRlc3QoYXJyW2kgLSAxXSkgJiYgL15cXGQrLy50ZXN0KGFycltpXSkpKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBzcGFjZUNvbnRlbnQgPSBvcHRpb25zRWZmZWN0LmZvcmNlVW5pZmllZFNwYWNpbmcgPyBvcHRpb25zRWZmZWN0LnNwYWNpbmdDb250ZW50IDogKGlzU3BhY2luZyAmJiBvcHRpb25zRWZmZWN0LmtlZXBPcmlnaW5hbFNwYWNlKSA/IGFycltpXSA6ICcnO1xyXG4gICAgICAgICAgICAgICAgICAgIGluc2VydEJlZm9yZShjcmVhdGVOb2RlKG9wdGlvbnNFZmZlY3Qud3JhcHBlci5vcGVuICsgc3BhY2VDb250ZW50ICsgb3B0aW9uc0VmZmVjdC53cmFwcGVyLmNsb3NlKSwgbm9kZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAoIWlzU3BhY2luZykge1xyXG4gICAgICAgICAgICAgICAgICAgIGluc2VydEJlZm9yZShkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShhcnJbaV0pLCBub2RlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBub2RlLnJlbW92ZSgpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGlmIChub2RlLnBhcmVudE5vZGUudGFnTmFtZSA9PT0gJ1RJVExFJykge1xyXG4gICAgICAgICAgICAgICAgc3BhY2VBdHRyaWJ1dGUoc3BhY2VyLCBub2RlLCAnZGF0YScsIG9wdGlvbnNOb1dyYXBwZXJOb0hUTUxFbnRpdHkpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgc3BhY2VBdHRyaWJ1dGUoc3BhY2VyLCBub2RlLCAnZGF0YScsIG9wdGlvbnNOb1dyYXBwZXIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybjtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgLy8gdGFnIG5hbWUgZmlsdGVyXHJcbiAgICAgICAgc3BhY2VBdHRyaWJ1dGUoc3BhY2VyLCBub2RlLCAndGl0bGUnLCBvcHRpb25zTm9XcmFwcGVyTm9IVE1MRW50aXR5KTtcclxuICAgICAgICBzcGFjZUF0dHJpYnV0ZShzcGFjZXIsIG5vZGUsICdhbHQnLCBvcHRpb25zTm9XcmFwcGVyTm9IVE1MRW50aXR5KTtcclxuICAgICAgICBzcGFjZUF0dHJpYnV0ZShzcGFjZXIsIG5vZGUsICdsYWJlbCcsIG9wdGlvbnNOb1dyYXBwZXJOb0hUTUxFbnRpdHkpO1xyXG4gICAgICAgIHNwYWNlQXR0cmlidXRlKHNwYWNlciwgbm9kZSwgJ3BsYWNlaG9sZGVyJywgb3B0aW9uc05vV3JhcHBlck5vSFRNTEVudGl0eSk7XHJcbiAgICB9XHJcbiAgICBpZiAobm9kZS5jaGlsZE5vZGVzKSB7XHJcbiAgICAgICAgbGV0IHN0YXRpY05vZGVzID0gW107XHJcbiAgICAgICAgbm9kZS5jaGlsZE5vZGVzLmZvckVhY2goY2hpbGQgPT4ge1xyXG4gICAgICAgICAgICBzdGF0aWNOb2Rlcy5wdXNoKGNoaWxkKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICBzdGF0aWNOb2Rlcy5mb3JFYWNoKGNoaWxkID0+IHtcclxuICAgICAgICAgICAgc3BhY2VOb2RlKHNwYWNlciwgY2hpbGQsIG9wdGlvbnMpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBjcmVhdGVOb2RlKGh0bWwpIHtcclxuICAgIGxldCBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgIGRpdi5pbm5lckhUTUwgPSBodG1sO1xyXG4gICAgcmV0dXJuIGRpdi5maXJzdENoaWxkO1xyXG59XHJcblxyXG5mdW5jdGlvbiBpbnNlcnRCZWZvcmUobmV3Tm9kZSwgbm9kZSkge1xyXG4gICAgaWYgKG5vZGUudGFnTmFtZSAhPT0gJ0hUTUwnICYmIG5vZGUucGFyZW50Tm9kZSAmJiBub2RlLnBhcmVudE5vZGUudGFnTmFtZSAhPT0gJ0hUTUwnKSB7XHJcbiAgICAgICAgbm9kZS5wYXJlbnROb2RlLmluc2VydEJlZm9yZShuZXdOb2RlLCBub2RlKTtcclxuICAgIH1cclxufVxyXG5cclxuZnVuY3Rpb24gc3BhY2VBdHRyaWJ1dGUoc3BhY2VyLCBub2RlLCBhdHRyLCBvcHRpb25zKSB7XHJcbiAgICBpZiAobm9kZVthdHRyXSkge1xyXG4gICAgICAgIGxldCByZXN1bHQgPSBzcGFjZXIuc3BhY2Uobm9kZVthdHRyXSwgb3B0aW9ucyk7XHJcbiAgICAgICAgaWYgKG5vZGVbYXR0cl0gIT09IHJlc3VsdCkge1xyXG4gICAgICAgICAgICBub2RlW2F0dHJdID0gcmVzdWx0O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgQnJvd3NlclNwYWNlcjsiLCIvKlxyXG4gKlxyXG4gKi9cclxuY29uc3QgTE9PS0JFSElORF9TVVBQT1JURUQgPSAoKCkgPT4ge1xyXG4gICAgdHJ5IHtcclxuICAgICAgICBuZXcgUmVnRXhwKCcoPzw9ZXhwKScpO1xyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxufSkoKTtcclxuXHJcbi8qXHJcbiAqIFxcdTJFODAtXFx1MkVGRiAgICBDSksg6YOo6aaWXHJcbiAqIFxcdTJGMDAtXFx1MkZERiAgICDlurfnhpnlrZflhbjpg6jpppZcclxuICogXFx1MzAwMC1cXHUzMDNGICAgIENKSyDnrKblj7flkozmoIfngrlcclxuICogXFx1MzFDMC1cXHUzMUVGICAgIENKSyDnrJTnlLtcclxuICogXFx1MzIwMC1cXHUzMkZGICAgIOWwgemXreW8jyBDSksg5paH5a2X5ZKM5pyI5Lu9XHJcbiAqIFxcdTMzMDAtXFx1MzNGRiAgICBDSksg5YW85a65XHJcbiAqIFxcdTM0MDAtXFx1NERCRiAgICBDSksg57uf5LiA6KGo5oSP56ym5Y+35omp5bGVIEFcclxuICogXFx1NERDMC1cXHU0REZGICAgIOaYk+e7j+WFreWNgeWbm+WNpuespuWPt1xyXG4gKiBcXHU0RTAwLVxcdTlGQkYgICAgQ0pLIOe7n+S4gOihqOaEj+espuWPt1xyXG4gKiBcXHVGOTAwLVxcdUZBRkYgICAgQ0pLIOWFvOWuueixoeW9ouaWh+Wtl1xyXG4gKiBcXHVGRTMwLVxcdUZFNEYgICAgQ0pLIOWFvOWuueW9ouW8j1xyXG4gKiBcXHVGRjAwLVxcdUZGRUYgICAg5YWo6KeSQVNDSUnjgIHlhajop5LmoIfngrlcclxuICpcclxuICogaHR0cHM6Ly93d3cudW5pY29kZS5vcmcvUHVibGljLzUuMC4wL3VjZC9VbmloYW4uaHRtbFxyXG4gKi9cclxuY29uc3QgQ0pLID0gJ1xcdTJFODAtXFx1MkZERlxcdTMwNDAtXFx1RkU0Ric7XHJcbmNvbnN0IFNZTUJPTFMgPSAnQCY9X1xcJCVcXF5cXCpcXC0rJztcclxuY29uc3QgTEFUSU4gPSAnQS1aYS16MC05XFx1MDBDMC1cXHUwMEZGXFx1MDEwMC1cXHUwMTdGXFx1MDE4MC1cXHUwMjRGXFx1MUUwMC1cXHUxRUZGJztcclxuY29uc3QgT05FX09SX01PUkVfU1BBQ0UgPSAnWyBdKyc7XHJcbmNvbnN0IEFOWV9TUEFDRSA9ICdbIF0qJztcclxuY29uc3QgU1lNQk9MU19ORUVEX1NQQUNFX0ZPTExPV0VEID0gJ1tcXC46LD8hXSc7XHJcbmNvbnN0IE9ORV9BSksgPSBgWyR7Q0pLfV1gO1xyXG5jb25zdCBPTkVfTEFUSU4gPSBgWyR7TEFUSU59XWA7XHJcbmNvbnN0IE9ORV9MQVRJTl9MSUtFID0gYFske0xBVElOfSVdYDtcclxuY29uc3QgU1BMSVRfQUpLX1NQQUNFX0xBVElOX0xJS0UgPSBidWlsZFNwbGl0KGAke09ORV9MQVRJTl9MSUtFfWAsIGAke0FOWV9TUEFDRX1gLCBgJHtPTkVfQUpLfWApO1xyXG5jb25zdCBTUExJVF9MQVRJTl9MSUtFX1NQQUNFX0FKSyA9IGJ1aWxkU3BsaXQoYCR7T05FX0FKS31gLCBgJHtBTllfU1BBQ0V9YCwgYCR7T05FX0xBVElOX0xJS0V9YCk7XHJcbmNvbnN0IFNQTElUX1NQQUNFID0gYCR7U1BMSVRfQUpLX1NQQUNFX0xBVElOX0xJS0V9fCR7U1BMSVRfTEFUSU5fTElLRV9TUEFDRV9BSkt9YDtcclxuY29uc3QgU1BMSVRfU1lNQk9MU19ORUVEX1NQQUNFX0ZPTExPV0VEID0gYnVpbGRTcGxpdChgJHtTWU1CT0xTX05FRURfU1BBQ0VfRk9MTE9XRUR9YCwgJycsIGAke09ORV9BSkt9fCR7T05FX0xBVElOfWApO1xyXG5jb25zdCBTUExJVF9BSktfTEFUSU5fTElLRSA9IGJ1aWxkU3BsaXQoYCR7T05FX0xBVElOX0xJS0V9YCwgJycsIGAke09ORV9BSkt9YCk7XHJcbmNvbnN0IFNQTElUX0xBVElOX0xJS0VfQUpLID0gYnVpbGRTcGxpdChgJHtPTkVfQUpLfWAsICcnLCBgJHtPTkVfTEFUSU5fTElLRX1gKTtcclxuY29uc3QgUkVHRVhQX0FOWV9DSksgPSBuZXcgUmVnRXhwKGAke09ORV9BSkt9YCk7XHJcbmNvbnN0IFJFR0VYUF9FTkRTX1dJVEhfU1lNQk9MU19ORUVEX1NQQUNFX0ZPTExPV0VEID0gbmV3IFJlZ0V4cChgJHtTWU1CT0xTX05FRURfU1BBQ0VfRk9MTE9XRUR9JGApO1xyXG5jb25zdCBSRUdFWFBfU1RBUlRTX1dJVEhfU1lNQk9MU19ORUVEX1NQQUNFX0ZPTExPV0VEID0gbmV3IFJlZ0V4cChgXiR7U1lNQk9MU19ORUVEX1NQQUNFX0ZPTExPV0VEfWApO1xyXG5jb25zdCBSRUdFWFBfRU5EU19XSVRIX0NKS19BTkRfU1BBQ0lORyA9IG5ldyBSZWdFeHAoYCR7T05FX0FKS30ke09ORV9PUl9NT1JFX1NQQUNFfSRgKTtcclxuY29uc3QgUkVHRVhQX0VORFNfV0lUSF9MQVRJTl9BTkRfU1BBQ0lORyA9IG5ldyBSZWdFeHAoYCR7T05FX0xBVElOX0xJS0V9JHtPTkVfT1JfTU9SRV9TUEFDRX0kYCk7XHJcbmNvbnN0IFJFR0VYUF9FTkRTX1dJVEhfQ0pLID0gbmV3IFJlZ0V4cChgJHtPTkVfQUpLfSRgKTtcclxuY29uc3QgUkVHRVhQX0VORFNfV0lUSF9MQVRJTiA9IG5ldyBSZWdFeHAoYCR7T05FX0xBVElOX0xJS0V9JGApO1xyXG5jb25zdCBSRUdFWFBfU1RBUlRTX1dJVEhfQ0pLID0gbmV3IFJlZ0V4cChgXiR7T05FX0FKS31gKTtcclxuY29uc3QgUkVHRVhQX1NUQVJUU19XSVRIX0xBVElOID0gbmV3IFJlZ0V4cChgXiR7T05FX0xBVElOX0xJS0V9YCk7XHJcbmNvbnN0IFJFR0VYUF9TUExJVF9FTkRfU1BBQ0UgPSBuZXcgUmVnRXhwKGAoJHtBTllfU1BBQ0V9KSRgKTtcclxuY29uc3QgUkVHRVhQX1NQTElUX0RFRkFVTFQgPSBuZXcgUmVnRXhwKGAoJHtTUExJVF9BSktfTEFUSU5fTElLRX18JHtTUExJVF9MQVRJTl9MSUtFX0FKS318JHtTUExJVF9TWU1CT0xTX05FRURfU1BBQ0VfRk9MTE9XRUR9KWAsICdnJyk7XHJcbmNvbnN0IFJFR0VYUF9TUExJVF9TUEFDRSA9IG5ldyBSZWdFeHAoYCgke1NQTElUX1NQQUNFfXwke1NQTElUX1NZTUJPTFNfTkVFRF9TUEFDRV9GT0xMT1dFRH0pYCwgJ2cnKTtcclxuXHJcbmZ1bmN0aW9uIHdyYXBTcGxpdChleHApIHtcclxuICAgIHJldHVybiBMT09LQkVISU5EX1NVUFBPUlRFRCA/IGV4cCA6IGZvcm1hdC5jYWxsKCcoezB9KScsIGV4cCk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGJ1aWxkU3BsaXQobG9va2JlaGluZCwgZXhwLCBsb29rYWhlYWQpIHtcclxuICAgIHJldHVybiBmb3JtYXQuY2FsbChMT09LQkVISU5EX1NVUFBPUlRFRCA/ICcoPzw9ezB9KXsxfSg/PXsyfSknIDogJ3swfXsxfSg/PXsyfSknLCBsb29rYmVoaW5kLCBleHAsIGxvb2thaGVhZCk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGZvcm1hdCguLi5hcmdzKSB7XHJcbiAgICBsZXQgcmVzdWx0ID0gdGhpcztcclxuICAgIGlmIChhcmdzLmxlbmd0aCA9PSAwKSB7XHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH1cclxuICAgIGxldCBkYXRhID0gYXJncy5sZW5ndGggPT0gMSAmJiB0eXBlb2YgYXJnc1sxXSA9PT0gJ29iamVjdCcgPyBhcmdzWzFdIDogYXJncztcclxuICAgIGZvciAobGV0IGtleSBpbiBkYXRhKSB7XHJcbiAgICAgICAgaWYgKGRhdGFba2V5XSAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIHJlc3VsdCA9IHJlc3VsdC5yZXBsYWNlQWxsKCdcXHsnICsga2V5ICsgJ1xcfScsIGRhdGFba2V5XSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxufVxyXG5cclxuY29uc3QgREVGQVVMVF9PUFRJT05TID0ge1xyXG4gICAgc3BhY2luZ0NvbnRlbnQ6ICcgJ1xyXG59O1xyXG5cclxubGV0IGRlZmF1bHRPcHRpb25zID0ge307XHJcblxyXG5jbGFzcyBTcGFjZXIge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcclxuICAgICAgICB0aGlzLm9wdGlvbnMgPSBoYW5kbGVPcHRpb25zKG9wdGlvbnMpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBjb25maWcob3B0aW9ucykge1xyXG4gICAgICAgIG9wdGlvbnMgPSB3cmFwT3B0aW9ucyhvcHRpb25zKTtcclxuICAgICAgICBPYmplY3QuYXNzaWduKGRlZmF1bHRPcHRpb25zLCBERUZBVUxUX09QVElPTlMsIG9wdGlvbnMpO1xyXG4gICAgfVxyXG5cclxuICAgIHNwYWNlKHRleHQsIG9wdGlvbnMpIHtcclxuICAgICAgICBsZXQgYXJyID0gdGhpcy5zcGxpdCh0ZXh0LCBvcHRpb25zKTtcclxuICAgICAgICBvcHRpb25zID0gdGhpcy5yZXNvbHZlT3B0aW9ucyhvcHRpb25zKTtcclxuICAgICAgICByZXR1cm4gYXJyLnJlZHVjZSgoYWNjLCBjdXIsIGksIHNyYykgPT4ge1xyXG4gICAgICAgICAgICBsZXQgc3BhY2luZ0NvbnRlbnQgPSAnJztcclxuICAgICAgICAgICAgbGV0IGN1cklzU3BhY2UgPSAvXlsgXSokLy50ZXN0KGN1cik7XHJcbiAgICAgICAgICAgIGlmIChjdXJJc1NwYWNlICYmIG9wdGlvbnMuZm9yY2VVbmlmaWVkU3BhY2luZykge1xyXG4gICAgICAgICAgICAgICAgY3VyID0gb3B0aW9ucy5zcGFjaW5nQ29udGVudDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoIWN1cklzU3BhY2UgJiYgKFJFR0VYUF9TVEFSVFNfV0lUSF9TWU1CT0xTX05FRURfU1BBQ0VfRk9MTE9XRUQudGVzdChjdXIpXHJcbiAgICAgICAgICAgICAgICB8fCAvXFxkK1xcLiQvLnRlc3QoYWNjKSAmJiAvXlxcZCtbJV0/JC8udGVzdChjdXIpXHJcbiAgICAgICAgICAgICAgICB8fCAvXFxkKzokLy50ZXN0KGFjYykgJiYgL15cXGQrLy50ZXN0KGN1cikpKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gYWNjICsgY3VyO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChvcHRpb25zLndyYXBwZXIpIHtcclxuICAgICAgICAgICAgICAgIGlmIChjdXJJc1NwYWNlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wdGlvbnMua2VlcE9yaWdpbmFsU3BhY2UpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY3VyID0gb3B0aW9ucy53cmFwcGVyLm9wZW4gKyBjdXIgKyBvcHRpb25zLndyYXBwZXIuY2xvc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY3VyID0gb3B0aW9ucy53cmFwcGVyLm9wZW4gKyBvcHRpb25zLndyYXBwZXIuY2xvc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBzcGFjaW5nQ29udGVudCA9IG9wdGlvbnMud3JhcHBlci5vcGVuICsgb3B0aW9ucy53cmFwcGVyLmNsb3NlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgaWYgKGN1cklzU3BhY2UpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAob3B0aW9ucy5rZWVwT3JpZ2luYWxTcGFjZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjdXIgPSBjdXI7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY3VyID0gb3B0aW9ucy5zcGFjaW5nQ29udGVudDtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHNwYWNpbmdDb250ZW50ID0gb3B0aW9ucy5zcGFjaW5nQ29udGVudDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gYWNjICsgc3BhY2luZ0NvbnRlbnQgKyBjdXI7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgc3BsaXQodGV4dCwgb3B0aW9ucykge1xyXG4gICAgICAgIG9wdGlvbnMgPSB0aGlzLnJlc29sdmVPcHRpb25zKG9wdGlvbnMpO1xyXG4gICAgICAgIGlmICh0eXBlb2YgdGV4dCA9PT0gJ3N0cmluZycpIHtcclxuICAgICAgICAgICAgbGV0IHBhdHRlcm4gPSBvcHRpb25zLmhhbmRsZU9yaWdpbmFsU3BhY2UgPyBSRUdFWFBfU1BMSVRfU1BBQ0UgOiBSRUdFWFBfU1BMSVRfREVGQVVMVDtcclxuICAgICAgICAgICAgbGV0IGFyciA9IHRleHQuc3BsaXQocGF0dGVybik7XHJcbiAgICAgICAgICAgIGlmIChhcnIubGVuZ3RoID4gMSAmJiAhTE9PS0JFSElORF9TVVBQT1JURUQpIHtcclxuICAgICAgICAgICAgICAgIGxldCByZXN1bHQgPSBbXTtcclxuICAgICAgICAgICAgICAgIGFyci5mbGF0TWFwKChjdXIsIGksIHNyYykgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vICdTcGFjZXIg6Ze06ZqU5ZmoJz0+WydTcGFjZScsICdyICcsICfpl7TpmpTlmagnXT0+WydTcGFjZScsJ3InLCcgJywgJycsICfpl7TpmpTlmagnXVxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChjdXIgIT09IHVuZGVmaW5lZCAmJiBjdXIubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gY3VyLnNwbGl0KFJFR0VYUF9TUExJVF9FTkRfU1BBQ0UpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gW107XHJcbiAgICAgICAgICAgICAgICB9KS5mb3JFYWNoKChjdXIsIGksIHNyYykgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vICdTcGFjZXLpl7TpmpTlmagnPT5bJ1NwYWNlJywgJ3InLCAn6Ze06ZqU5ZmoJ109PlsnU3BhY2VyJywgJ+mXtOmalOWZqCddXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGN1ci5sZW5ndGggPT0gMSAmJiBpID4gMCAmJiAhL15bIF0qJC8udGVzdChjdXIpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBwcmV2ID0gc3JjW2kgLSAxXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFTcGFjZXIuZW5kc1dpdGhDSksocHJldikgJiYgIVNwYWNlci5zdGFydHNXaXRoQ0pLKGN1cilcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHx8ICFTcGFjZXIuZW5kc1dpdGhMYXRpbihwcmV2KSAmJiAhU3BhY2VyLnN0YXJ0c1dpdGhMYXRpbihjdXIpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXN1bHRbcmVzdWx0Lmxlbmd0aCAtIDFdICs9IGN1cjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICByZXN1bHQucHVzaChjdXIpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICBhcnIgPSByZXN1bHQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIGFyci5maWx0ZXIoKGN1ciwgaSwgc3JjKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAvLyBbJ1NwYWNlcicsJyAnLCAnJywgJ+mXtOmalOWZqCddPT5bJ1NwYWNlcicsJyAnLCAn6Ze06ZqU5ZmoJ11cclxuICAgICAgICAgICAgICAgIHJldHVybiBjdXIgIT09ICcnO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIFt0ZXh0XTtcclxuICAgIH1cclxuXHJcbiAgICByZXNvbHZlT3B0aW9ucyhvcHRpb25zKSB7XHJcbiAgICAgICAgcmV0dXJuIG9wdGlvbnMgPyBoYW5kbGVPcHRpb25zKG9wdGlvbnMpIDogdGhpcy5vcHRpb25zO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBlbmRzV2l0aENKS0FuZFNwYWNpbmcodGV4dCkge1xyXG4gICAgICAgIHJldHVybiBSRUdFWFBfRU5EU19XSVRIX0NKS19BTkRfU1BBQ0lORy50ZXN0KHRleHQpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBlbmRzV2l0aENKSyh0ZXh0KSB7XHJcbiAgICAgICAgcmV0dXJuIFJFR0VYUF9FTkRTX1dJVEhfQ0pLLnRlc3QodGV4dCk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGVuZHNXaXRoTGF0aW4odGV4dCkge1xyXG4gICAgICAgIHJldHVybiBSRUdFWFBfRU5EU19XSVRIX0xBVElOLnRlc3QodGV4dCk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIHN0YXJ0c1dpdGhDSksodGV4dCkge1xyXG4gICAgICAgIHJldHVybiBSRUdFWFBfU1RBUlRTX1dJVEhfQ0pLLnRlc3QodGV4dCk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIHN0YXJ0c1dpdGhMYXRpbih0ZXh0KSB7XHJcbiAgICAgICAgcmV0dXJuIFJFR0VYUF9TVEFSVFNfV0lUSF9MQVRJTi50ZXN0KHRleHQpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBlbmRzV2l0aExhdGluQW5kU3BhY2luZyh0ZXh0KSB7XHJcbiAgICAgICAgcmV0dXJuIFJFR0VYUF9FTkRTX1dJVEhfTEFUSU5fQU5EX1NQQUNJTkcudGVzdCh0ZXh0KTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgZW5kc1dpdGhTeW1ib2xzTmVlZFNwYWNlRm9sbG93ZWQodGV4dCkge1xyXG4gICAgICAgIHJldHVybiBSRUdFWFBfRU5EU19XSVRIX1NZTUJPTFNfTkVFRF9TUEFDRV9GT0xMT1dFRC50ZXN0KHRleHQpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBzdGFydHNXaXRoU3ltYm9sc05lZWRTcGFjZUZvbGxvd2VkKHRleHQpIHtcclxuICAgICAgICByZXR1cm4gUkVHRVhQX1NUQVJUU19XSVRIX1NZTUJPTFNfTkVFRF9TUEFDRV9GT0xMT1dFRC50ZXN0KHRleHQpO1xyXG4gICAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiB3cmFwT3B0aW9ucyhvcHRpb25zKSB7XHJcbiAgICByZXR1cm4gdHlwZW9mIG9wdGlvbnMgPT09ICdzdHJpbmcnID8ge3NwYWNpbmdDb250ZW50OiBvcHRpb25zfSA6IG9wdGlvbnM7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGhhbmRsZU9wdGlvbnMob3B0aW9ucykge1xyXG4gICAgb3B0aW9ucyA9IHdyYXBPcHRpb25zKG9wdGlvbnMpO1xyXG4gICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oe30sIERFRkFVTFRfT1BUSU9OUywgZGVmYXVsdE9wdGlvbnMsIG9wdGlvbnMpO1xyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBTcGFjZXI7IiwiaW1wb3J0IEJyb3dzZXJTcGFjZXIgZnJvbSAnLi9icm93c2VyLmpzJ1xyXG5cclxuLy8gQWRkIHN1cHBvcnQgZm9yIEFNRCAoQXN5bmNocm9ub3VzIE1vZHVsZSBEZWZpbml0aW9uKSBsaWJyYXJpZXMgc3VjaCBhcyByZXF1aXJlLmpzLlxyXG5pZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XHJcbiAgICBkZWZpbmUoW10sIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIFNwYWNlcjogQnJvd3NlclNwYWNlclxyXG4gICAgICAgIH1cclxuICAgIH0pXHJcbn1cclxuLy9BZGQgc3VwcG9ydCBmb3JtIENvbW1vbkpTIGxpYnJhcmllcyBzdWNoIGFzIGJyb3dzZXJpZnkuXHJcbmlmICh0eXBlb2YgZXhwb3J0cyAhPT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgIGV4cG9ydHMuU3BhY2VyID0gQnJvd3NlclNwYWNlcjtcclxufVxyXG4vL0RlZmluZSBnbG9iYWxseSBpbiBjYXNlIEFNRCBpcyBub3QgYXZhaWxhYmxlIG9yIHVudXNlZFxyXG5pZiAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgIHdpbmRvdy5TcGFjZXIgPSBCcm93c2VyU3BhY2VyO1xyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBCcm93c2VyU3BhY2VyOyJdfQ==
