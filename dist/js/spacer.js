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
        value: function spacePage(elements, options) {
            var _this2 = this;

            elements = typeof elements === 'string' ? document.querySelectorAll(elements) : elements || [document.childNodes[1]];
            options = this.resolveOptions(options);
            if (options.wrapper) {
                options.spacingContent = options.spacingContent.replace(' ', '&nbsp;');
            }
            [].forEach.call(elements, function (e) {
                spaceNode(_this2, e, options);
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
                if (isSpacing || i != 0 && !/^[ ]*$/.test(_arr[i - 1]) && !_core2.default.startsWithSymbolsNeedSpaceFollowed(_arr[i]) && !(/\.$/.test(_arr[i - 1]) && /^[0-9]+[%]?$/.test(_arr[i]))) {
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
                if (!curIsSpace && (REGEXP_STARTS_WITH_SYMBOLS_NEED_SPACE_FOLLOWED.test(cur) || /\.$/.test(acc) && /^[0-9]+[%]?$/.test(cur))) {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJidWlsZC9qcy9icm93c2VyLmpzIiwiYnVpbGQvanMvY29yZS5qcyIsImJ1aWxkL2pzL3NwYWNlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7O0FDQUE7Ozs7Ozs7Ozs7OztBQUVBLElBQU0sZUFBZSx3QkFBckI7QUFDQSxJQUFNLGFBQWEsb0hBQW5CO0FBQ0EsSUFBTSxlQUFlLDRCQUFyQjs7SUFFTSxhOzs7QUFFRiwyQkFBWSxPQUFaLEVBQXFCO0FBQUE7O0FBQUEsa0lBQ1gsT0FEVzs7QUFFakIsWUFBSSxRQUFRLE9BQVosRUFBcUI7QUFDakIsa0JBQUssT0FBTCxDQUFhLGNBQWIsR0FBOEIsTUFBSyxPQUFMLENBQWEsY0FBYixDQUE0QixPQUE1QixDQUFvQyxHQUFwQyxFQUF5QyxRQUF6QyxDQUE5QjtBQUNIO0FBSmdCO0FBS3BCOzs7O2tDQUVTLFEsRUFBVSxPLEVBQVM7QUFBQTs7QUFDekIsdUJBQVcsT0FBTyxRQUFQLEtBQW9CLFFBQXBCLEdBQStCLFNBQVMsZ0JBQVQsQ0FBMEIsUUFBMUIsQ0FBL0IsR0FBc0UsWUFBWSxDQUFDLFNBQVMsVUFBVCxDQUFvQixDQUFwQixDQUFELENBQTdGO0FBQ0Esc0JBQVUsS0FBSyxjQUFMLENBQW9CLE9BQXBCLENBQVY7QUFDQSxnQkFBSSxRQUFRLE9BQVosRUFBcUI7QUFDakIsd0JBQVEsY0FBUixHQUF5QixRQUFRLGNBQVIsQ0FBdUIsT0FBdkIsQ0FBK0IsR0FBL0IsRUFBb0MsUUFBcEMsQ0FBekI7QUFDSDtBQUNELGVBQUcsT0FBSCxDQUFXLElBQVgsQ0FBZ0IsUUFBaEIsRUFBMEIsYUFBSztBQUMzQiwwQkFBVSxNQUFWLEVBQWdCLENBQWhCLEVBQW1CLE9BQW5CO0FBQ0gsYUFGRDtBQUdIOzs7O0VBbEJ1QixjOztBQXFCNUIsU0FBUyxTQUFULENBQW1CLE1BQW5C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SUFBbEQsQ0FBUDtBQUNIOzs7MkRBRXlDLEksRUFBTTtBQUM1QyxtQkFBTywrQ0FBK0MsSUFBL0MsQ0FBb0QsSUFBcEQsQ0FBUDtBQUNIOzs7Ozs7QUFHTCxTQUFTLFdBQVQsQ0FBcUIsT0FBckIsRUFBOEI7QUFDMUIsV0FBTyxPQUFPLE9BQVAsS0FBbUIsUUFBbkIsR0FBOEIsRUFBQyxnQkFBZ0IsT0FBakIsRUFBOUIsR0FBMEQsT0FBakU7QUFDSDs7QUFFRCxTQUFTLGFBQVQsQ0FBdUIsT0FBdkIsRUFBZ0M7QUFDNUIsY0FBVSxZQUFZLE9BQVosQ0FBVjtBQUNBLFdBQU8sT0FBTyxNQUFQLENBQWMsRUFBZCxFQUFrQixlQUFsQixFQUFtQyxjQUFuQyxFQUFtRCxPQUFuRCxDQUFQO0FBQ0g7O2tCQUVjLE07Ozs7Ozs7OztBQ3ROZjs7Ozs7O0FBRUE7QUFDQSxJQUFJLE9BQU8sTUFBUCxLQUFrQixVQUFsQixJQUFnQyxPQUFPLEdBQTNDLEVBQWdEO0FBQzVDLFdBQU8sRUFBUCxFQUFXLFlBQVc7QUFDbEIsZUFBTztBQUNILG9CQUFRO0FBREwsU0FBUDtBQUdILEtBSkQ7QUFLSDtBQUNEO0FBQ0EsSUFBSSxPQUFPLE9BQVAsS0FBbUIsV0FBdkIsRUFBb0M7QUFDaEMsWUFBUSxNQUFSLEdBQWlCLGlCQUFqQjtBQUNIO0FBQ0Q7QUFDQSxJQUFJLE9BQU8sTUFBUCxLQUFrQixXQUF0QixFQUFtQztBQUMvQixXQUFPLE1BQVAsR0FBZ0IsaUJBQWhCO0FBQ0g7O2tCQUVjLGlCIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiaW1wb3J0IFNwYWNlciBmcm9tICcuL2NvcmUuanMnXHJcblxyXG5jb25zdCBJR05PUkVEX1RBR1MgPSAvXihzY3JpcHR8bGlua3xzdHlsZSkkL2k7XHJcbmNvbnN0IEJMT0NLX1RBR1MgPSAvXihkaXZ8cHxoMXxoMnxoM3xoNHxoNXxoNnxibG9ja3FvdXRlfHByZXx0ZXh0YXJlYXxuYXZ8aGVhZGVyfG1haW58Zm9vdGVyfHNlY3Rpb258c2lkYmFyfGFzaWRlfHRhYmxlfGxpfHVsfG9sfGRsKSQvaTtcclxuY29uc3QgU1BBQ0lOR19UQUdTID0gL14oYnJ8aHJ8aW1nfHZpZGVvfGF1ZGlvKSQvaTtcclxuXHJcbmNsYXNzIEJyb3dzZXJTcGFjZXIgZXh0ZW5kcyBTcGFjZXIge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcclxuICAgICAgICBzdXBlcihvcHRpb25zKTtcclxuICAgICAgICBpZiAob3B0aW9ucy53cmFwcGVyKSB7XHJcbiAgICAgICAgICAgIHRoaXMub3B0aW9ucy5zcGFjaW5nQ29udGVudCA9IHRoaXMub3B0aW9ucy5zcGFjaW5nQ29udGVudC5yZXBsYWNlKCcgJywgJyZuYnNwOycpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBzcGFjZVBhZ2UoZWxlbWVudHMsIG9wdGlvbnMpIHtcclxuICAgICAgICBlbGVtZW50cyA9IHR5cGVvZiBlbGVtZW50cyA9PT0gJ3N0cmluZycgPyBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKGVsZW1lbnRzKSA6IChlbGVtZW50cyB8fCBbZG9jdW1lbnQuY2hpbGROb2Rlc1sxXV0pO1xyXG4gICAgICAgIG9wdGlvbnMgPSB0aGlzLnJlc29sdmVPcHRpb25zKG9wdGlvbnMpO1xyXG4gICAgICAgIGlmIChvcHRpb25zLndyYXBwZXIpIHtcclxuICAgICAgICAgICAgb3B0aW9ucy5zcGFjaW5nQ29udGVudCA9IG9wdGlvbnMuc3BhY2luZ0NvbnRlbnQucmVwbGFjZSgnICcsICcmbmJzcDsnKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgW10uZm9yRWFjaC5jYWxsKGVsZW1lbnRzLCBlID0+IHtcclxuICAgICAgICAgICAgc3BhY2VOb2RlKHRoaXMsIGUsIG9wdGlvbnMpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBzcGFjZU5vZGUoc3BhY2VyLCBub2RlLCBvcHRpb25zKSB7XHJcbiAgICBpZiAobm9kZS50YWdOYW1lICYmIElHTk9SRURfVEFHUy50ZXN0KG5vZGUudGFnTmFtZSkpIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICBsZXQgb3B0aW9uc05vV3JhcHBlciA9IE9iamVjdC5hc3NpZ24oe30sIG9wdGlvbnMsIHt3cmFwcGVyOiBmYWxzZX0pO1xyXG4gICAgbGV0IG9wdGlvbnNOb1dyYXBwZXJOb0hUTUxFbnRpdHkgPSBPYmplY3QuYXNzaWduKHt9LCBvcHRpb25zLCB7XHJcbiAgICAgICAgd3JhcHBlcjogZmFsc2UsXHJcbiAgICAgICAgc3BhY2luZ0NvbnRlbnQ6IG9wdGlvbnMuc3BhY2luZ0NvbnRlbnQucmVwbGFjZSgnJm5ic3A7JywgJyAnKVxyXG4gICAgfSk7XHJcbiAgICBsZXQgb3B0aW9uc0VmZmVjdCA9IG9wdGlvbnM7XHJcbiAgICBpZiAobm9kZS5wYXJlbnROb2RlICYmIG5vZGUucGFyZW50Tm9kZS50YWdOYW1lID09PSAnVElUTEUnKSB7XHJcbiAgICAgICAgb3B0aW9uc0VmZmVjdCA9IG9wdGlvbnNOb1dyYXBwZXJOb0hUTUxFbnRpdHk7XHJcbiAgICB9XHJcbiAgICBpZiAobm9kZS5wcmV2aW91c1NpYmxpbmdcclxuICAgICAgICAmJiAoIW5vZGUucHJldmlvdXNTaWJsaW5nLnRhZ05hbWUgfHwgKCFCTE9DS19UQUdTLnRlc3Qobm9kZS5wcmV2aW91c1NpYmxpbmcudGFnTmFtZSkgJiYgIVNQQUNJTkdfVEFHUy50ZXN0KG5vZGUucHJldmlvdXNTaWJsaW5nLnRhZ05hbWUpKSlcclxuICAgICAgICAmJiAoIW5vZGUudGFnTmFtZSB8fCAoIUJMT0NLX1RBR1MudGVzdChub2RlLnRhZ05hbWUpICYmICFTUEFDSU5HX1RBR1MudGVzdChub2RlLnRhZ05hbWUpKSkpIHtcclxuICAgICAgICBsZXQgcHJlVGV4dCA9IG5vZGUucHJldmlvdXNTaWJsaW5nLm5vZGVUeXBlID09PSBOb2RlLlRFWFRfTk9ERSA/IG5vZGUucHJldmlvdXNTaWJsaW5nLmRhdGEgOiBub2RlLnByZXZpb3VzU2libGluZy50ZXh0Q29udGVudDtcclxuICAgICAgICBpZiAoKFNwYWNlci5lbmRzV2l0aENKSyhwcmVUZXh0KSB8fCBTcGFjZXIuZW5kc1dpdGhTeW1ib2xzTmVlZFNwYWNlRm9sbG93ZWQocHJlVGV4dCkpICYmIFNwYWNlci5zdGFydHNXaXRoTGF0aW4obm9kZS50ZXh0Q29udGVudClcclxuICAgICAgICAgICAgfHwgKFNwYWNlci5lbmRzV2l0aExhdGluKHByZVRleHQpIHx8IFNwYWNlci5lbmRzV2l0aFN5bWJvbHNOZWVkU3BhY2VGb2xsb3dlZChwcmVUZXh0KSkgJiYgU3BhY2VyLnN0YXJ0c1dpdGhDSksobm9kZS50ZXh0Q29udGVudCkpIHtcclxuICAgICAgICAgICAgbGV0IHNwYWNlQ29udGVudCA9IG9wdGlvbnNFZmZlY3QuZm9yY2VVbmlmaWVkU3BhY2luZyA/IG9wdGlvbnNFZmZlY3Quc3BhY2luZ0NvbnRlbnQgOiAnJztcclxuICAgICAgICAgICAgaWYgKG9wdGlvbnNFZmZlY3Qud3JhcHBlcikge1xyXG4gICAgICAgICAgICAgICAgaW5zZXJ0QmVmb3JlKGNyZWF0ZU5vZGUob3B0aW9uc0VmZmVjdC53cmFwcGVyLm9wZW4gKyBzcGFjZUNvbnRlbnQgKyBvcHRpb25zRWZmZWN0LndyYXBwZXIuY2xvc2UpLCBub2RlKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGluc2VydEJlZm9yZShkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShzcGFjZUNvbnRlbnQgPyBzcGFjZUNvbnRlbnQgOiBvcHRpb25zRWZmZWN0LnNwYWNpbmdDb250ZW50KSwgbm9kZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKG9wdGlvbnNFZmZlY3QuaGFuZGxlT3JpZ2luYWxTcGFjZSAmJiBub2RlLnByZXZpb3VzU2libGluZy5ub2RlVHlwZSA9PT0gTm9kZS5URVhUX05PREUpIHtcclxuICAgICAgICAgICAgaWYgKFNwYWNlci5lbmRzV2l0aENKS0FuZFNwYWNpbmcocHJlVGV4dCkgJiYgU3BhY2VyLnN0YXJ0c1dpdGhMYXRpbihub2RlLnRleHRDb250ZW50KVxyXG4gICAgICAgICAgICAgICAgfHwgU3BhY2VyLmVuZHNXaXRoTGF0aW5BbmRTcGFjaW5nKHByZVRleHQpICYmIFNwYWNlci5zdGFydHNXaXRoQ0pLKG5vZGUudGV4dENvbnRlbnQpKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgcHJlRW5kU3BhY2luZyA9ICcnO1xyXG4gICAgICAgICAgICAgICAgbGV0IGFyciA9IC8oLiopKFsgXSspJC9nLm1hdGNoKG5vZGUucHJldmlvdXNTaWJsaW5nLmRhdGEpO1xyXG4gICAgICAgICAgICAgICAgbm9kZS5wcmV2aW91c1NpYmxpbmcuZGF0YSA9IGFyclsxXTtcclxuICAgICAgICAgICAgICAgIHByZUVuZFNwYWNpbmcgPSBhcnJbMl07XHJcbiAgICAgICAgICAgICAgICBsZXQgc3BhY2VDb250ZW50ID0gb3B0aW9uc0VmZmVjdC5mb3JjZVVuaWZpZWRTcGFjaW5nID8gb3B0aW9uc0VmZmVjdC5zcGFjaW5nQ29udGVudCA6IChvcHRpb25zRWZmZWN0LmtlZXBPcmlnaW5hbFNwYWNlID8gcHJlRW5kU3BhY2luZyA6ICcnKTtcclxuICAgICAgICAgICAgICAgIGlmIChvcHRpb25zRWZmZWN0LndyYXBwZXIpIHtcclxuICAgICAgICAgICAgICAgICAgICBpbnNlcnRCZWZvcmUoY3JlYXRlTm9kZShvcHRpb25zRWZmZWN0LndyYXBwZXIub3BlbiArIHNwYWNlQ29udGVudCArIG9wdGlvbnNFZmZlY3Qud3JhcHBlci5jbG9zZSksIG5vZGUpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBpbnNlcnRCZWZvcmUoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoc3BhY2VDb250ZW50ID8gc3BhY2VDb250ZW50IDogb3B0aW9uc0VmZmVjdC5zcGFjaW5nQ29udGVudCksIG5vZGUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgaWYgKG5vZGUubm9kZVR5cGUgPT09IE5vZGUuVEVYVF9OT0RFKSB7XHJcbiAgICAgICAgaWYgKG9wdGlvbnNFZmZlY3Qud3JhcHBlcikge1xyXG4gICAgICAgICAgICBsZXQgYXJyID0gc3BhY2VyLnNwbGl0KG5vZGUuZGF0YSwgb3B0aW9uc0VmZmVjdCk7XHJcbiAgICAgICAgICAgIGlmIChhcnIubGVuZ3RoID09IDEpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhhcnIpO1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGFyci5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgbGV0IGlzU3BhY2luZyA9IC9eWyBdKiQvLnRlc3QoYXJyW2ldKTtcclxuICAgICAgICAgICAgICAgIGlmIChpc1NwYWNpbmcgfHwgKGkgIT0gMCAmJiAhL15bIF0qJC8udGVzdChhcnJbaSAtIDFdKVxyXG4gICAgICAgICAgICAgICAgICAgICYmICFTcGFjZXIuc3RhcnRzV2l0aFN5bWJvbHNOZWVkU3BhY2VGb2xsb3dlZChhcnJbaV0pXHJcbiAgICAgICAgICAgICAgICAgICAgJiYgISgvXFwuJC8udGVzdChhcnJbaSAtIDFdKSAmJiAvXlswLTldK1slXT8kLy50ZXN0KGFycltpXSkpKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBzcGFjZUNvbnRlbnQgPSBvcHRpb25zRWZmZWN0LmZvcmNlVW5pZmllZFNwYWNpbmcgPyBvcHRpb25zRWZmZWN0LnNwYWNpbmdDb250ZW50IDogKGlzU3BhY2luZyAmJiBvcHRpb25zRWZmZWN0LmtlZXBPcmlnaW5hbFNwYWNlKSA/IGFycltpXSA6ICcnO1xyXG4gICAgICAgICAgICAgICAgICAgIGluc2VydEJlZm9yZShjcmVhdGVOb2RlKG9wdGlvbnNFZmZlY3Qud3JhcHBlci5vcGVuICsgc3BhY2VDb250ZW50ICsgb3B0aW9uc0VmZmVjdC53cmFwcGVyLmNsb3NlKSwgbm9kZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAoIWlzU3BhY2luZykge1xyXG4gICAgICAgICAgICAgICAgICAgIGluc2VydEJlZm9yZShkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShhcnJbaV0pLCBub2RlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBub2RlLnJlbW92ZSgpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGlmIChub2RlLnBhcmVudE5vZGUudGFnTmFtZSA9PT0gJ1RJVExFJykge1xyXG4gICAgICAgICAgICAgICAgc3BhY2VBdHRyaWJ1dGUoc3BhY2VyLCBub2RlLCAnZGF0YScsIG9wdGlvbnNOb1dyYXBwZXJOb0hUTUxFbnRpdHkpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgc3BhY2VBdHRyaWJ1dGUoc3BhY2VyLCBub2RlLCAnZGF0YScsIG9wdGlvbnNOb1dyYXBwZXIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybjtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgLy8gdGFnIG5hbWUgZmlsdGVyXHJcbiAgICAgICAgc3BhY2VBdHRyaWJ1dGUoc3BhY2VyLCBub2RlLCAndGl0bGUnLCBvcHRpb25zTm9XcmFwcGVyTm9IVE1MRW50aXR5KTtcclxuICAgICAgICBzcGFjZUF0dHJpYnV0ZShzcGFjZXIsIG5vZGUsICdhbHQnLCBvcHRpb25zTm9XcmFwcGVyTm9IVE1MRW50aXR5KTtcclxuICAgICAgICBzcGFjZUF0dHJpYnV0ZShzcGFjZXIsIG5vZGUsICdsYWJlbCcsIG9wdGlvbnNOb1dyYXBwZXJOb0hUTUxFbnRpdHkpO1xyXG4gICAgICAgIHNwYWNlQXR0cmlidXRlKHNwYWNlciwgbm9kZSwgJ3BsYWNlaG9sZGVyJywgb3B0aW9uc05vV3JhcHBlck5vSFRNTEVudGl0eSk7XHJcbiAgICB9XHJcbiAgICBpZiAobm9kZS5jaGlsZE5vZGVzKSB7XHJcbiAgICAgICAgbGV0IHN0YXRpY05vZGVzID0gW107XHJcbiAgICAgICAgbm9kZS5jaGlsZE5vZGVzLmZvckVhY2goY2hpbGQgPT4ge1xyXG4gICAgICAgICAgICBzdGF0aWNOb2Rlcy5wdXNoKGNoaWxkKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICBzdGF0aWNOb2Rlcy5mb3JFYWNoKGNoaWxkID0+IHtcclxuICAgICAgICAgICAgc3BhY2VOb2RlKHNwYWNlciwgY2hpbGQsIG9wdGlvbnMpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBjcmVhdGVOb2RlKGh0bWwpIHtcclxuICAgIGxldCBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgIGRpdi5pbm5lckhUTUwgPSBodG1sO1xyXG4gICAgcmV0dXJuIGRpdi5maXJzdENoaWxkO1xyXG59XHJcblxyXG5mdW5jdGlvbiBpbnNlcnRCZWZvcmUobmV3Tm9kZSwgbm9kZSkge1xyXG4gICAgaWYgKG5vZGUudGFnTmFtZSAhPT0gJ0hUTUwnICYmIG5vZGUucGFyZW50Tm9kZSAmJiBub2RlLnBhcmVudE5vZGUudGFnTmFtZSAhPT0gJ0hUTUwnKSB7XHJcbiAgICAgICAgbm9kZS5wYXJlbnROb2RlLmluc2VydEJlZm9yZShuZXdOb2RlLCBub2RlKTtcclxuICAgIH1cclxufVxyXG5cclxuZnVuY3Rpb24gc3BhY2VBdHRyaWJ1dGUoc3BhY2VyLCBub2RlLCBhdHRyLCBvcHRpb25zKSB7XHJcbiAgICBpZiAobm9kZVthdHRyXSkge1xyXG4gICAgICAgIGxldCByZXN1bHQgPSBzcGFjZXIuc3BhY2Uobm9kZVthdHRyXSwgb3B0aW9ucyk7XHJcbiAgICAgICAgaWYgKG5vZGVbYXR0cl0gIT09IHJlc3VsdCkge1xyXG4gICAgICAgICAgICBub2RlW2F0dHJdID0gcmVzdWx0O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgQnJvd3NlclNwYWNlcjsiLCIvKlxyXG4gKlxyXG4gKi9cclxuY29uc3QgTE9PS0JFSElORF9TVVBQT1JURUQgPSAoKCkgPT4ge1xyXG4gICAgdHJ5IHtcclxuICAgICAgICBuZXcgUmVnRXhwKCcoPzw9ZXhwKScpO1xyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxufSkoKTtcclxuXHJcbi8qXHJcbiAqIFxcdTJFODAtXFx1MkVGRiAgICBDSksg6YOo6aaWXHJcbiAqIFxcdTJGMDAtXFx1MkZERiAgICDlurfnhpnlrZflhbjpg6jpppZcclxuICogXFx1MzAwMC1cXHUzMDNGICAgIENKSyDnrKblj7flkozmoIfngrlcclxuICogXFx1MzFDMC1cXHUzMUVGICAgIENKSyDnrJTnlLtcclxuICogXFx1MzIwMC1cXHUzMkZGICAgIOWwgemXreW8jyBDSksg5paH5a2X5ZKM5pyI5Lu9XHJcbiAqIFxcdTMzMDAtXFx1MzNGRiAgICBDSksg5YW85a65XHJcbiAqIFxcdTM0MDAtXFx1NERCRiAgICBDSksg57uf5LiA6KGo5oSP56ym5Y+35omp5bGVIEFcclxuICogXFx1NERDMC1cXHU0REZGICAgIOaYk+e7j+WFreWNgeWbm+WNpuespuWPt1xyXG4gKiBcXHU0RTAwLVxcdTlGQkYgICAgQ0pLIOe7n+S4gOihqOaEj+espuWPt1xyXG4gKiBcXHVGOTAwLVxcdUZBRkYgICAgQ0pLIOWFvOWuueixoeW9ouaWh+Wtl1xyXG4gKiBcXHVGRTMwLVxcdUZFNEYgICAgQ0pLIOWFvOWuueW9ouW8j1xyXG4gKiBcXHVGRjAwLVxcdUZGRUYgICAg5YWo6KeSQVNDSUnjgIHlhajop5LmoIfngrlcclxuICpcclxuICogaHR0cHM6Ly93d3cudW5pY29kZS5vcmcvUHVibGljLzUuMC4wL3VjZC9VbmloYW4uaHRtbFxyXG4gKi9cclxuY29uc3QgQ0pLID0gJ1xcdTJFODAtXFx1MkZERlxcdTMwNDAtXFx1RkU0Ric7XHJcbmNvbnN0IFNZTUJPTFMgPSAnQCY9X1xcJCVcXF5cXCpcXC0rJztcclxuY29uc3QgTEFUSU4gPSAnQS1aYS16MC05XFx1MDBDMC1cXHUwMEZGXFx1MDEwMC1cXHUwMTdGXFx1MDE4MC1cXHUwMjRGXFx1MUUwMC1cXHUxRUZGJztcclxuY29uc3QgT05FX09SX01PUkVfU1BBQ0UgPSAnWyBdKyc7XHJcbmNvbnN0IEFOWV9TUEFDRSA9ICdbIF0qJztcclxuY29uc3QgU1lNQk9MU19ORUVEX1NQQUNFX0ZPTExPV0VEID0gJ1tcXC46LD8hXSc7XHJcbmNvbnN0IE9ORV9BSksgPSBgWyR7Q0pLfV1gO1xyXG5jb25zdCBPTkVfTEFUSU4gPSBgWyR7TEFUSU59XWA7XHJcbmNvbnN0IE9ORV9MQVRJTl9MSUtFID0gYFske0xBVElOfSVdYDtcclxuY29uc3QgU1BMSVRfQUpLX1NQQUNFX0xBVElOX0xJS0UgPSBidWlsZFNwbGl0KGAke09ORV9MQVRJTl9MSUtFfWAsIGAke0FOWV9TUEFDRX1gLCBgJHtPTkVfQUpLfWApO1xyXG5jb25zdCBTUExJVF9MQVRJTl9MSUtFX1NQQUNFX0FKSyA9IGJ1aWxkU3BsaXQoYCR7T05FX0FKS31gLCBgJHtBTllfU1BBQ0V9YCwgYCR7T05FX0xBVElOX0xJS0V9YCk7XHJcbmNvbnN0IFNQTElUX1NQQUNFID0gYCR7U1BMSVRfQUpLX1NQQUNFX0xBVElOX0xJS0V9fCR7U1BMSVRfTEFUSU5fTElLRV9TUEFDRV9BSkt9YDtcclxuY29uc3QgU1BMSVRfU1lNQk9MU19ORUVEX1NQQUNFX0ZPTExPV0VEID0gYnVpbGRTcGxpdChgJHtTWU1CT0xTX05FRURfU1BBQ0VfRk9MTE9XRUR9YCwgJycsIGAke09ORV9BSkt9fCR7T05FX0xBVElOfWApO1xyXG5jb25zdCBTUExJVF9BSktfTEFUSU5fTElLRSA9IGJ1aWxkU3BsaXQoYCR7T05FX0xBVElOX0xJS0V9YCwgJycsIGAke09ORV9BSkt9YCk7XHJcbmNvbnN0IFNQTElUX0xBVElOX0xJS0VfQUpLID0gYnVpbGRTcGxpdChgJHtPTkVfQUpLfWAsICcnLCBgJHtPTkVfTEFUSU5fTElLRX1gKTtcclxuY29uc3QgUkVHRVhQX0FOWV9DSksgPSBuZXcgUmVnRXhwKGAke09ORV9BSkt9YCk7XHJcbmNvbnN0IFJFR0VYUF9FTkRTX1dJVEhfU1lNQk9MU19ORUVEX1NQQUNFX0ZPTExPV0VEID0gbmV3IFJlZ0V4cChgJHtTWU1CT0xTX05FRURfU1BBQ0VfRk9MTE9XRUR9JGApO1xyXG5jb25zdCBSRUdFWFBfU1RBUlRTX1dJVEhfU1lNQk9MU19ORUVEX1NQQUNFX0ZPTExPV0VEID0gbmV3IFJlZ0V4cChgXiR7U1lNQk9MU19ORUVEX1NQQUNFX0ZPTExPV0VEfWApO1xyXG5jb25zdCBSRUdFWFBfRU5EU19XSVRIX0NKS19BTkRfU1BBQ0lORyA9IG5ldyBSZWdFeHAoYCR7T05FX0FKS30ke09ORV9PUl9NT1JFX1NQQUNFfSRgKTtcclxuY29uc3QgUkVHRVhQX0VORFNfV0lUSF9MQVRJTl9BTkRfU1BBQ0lORyA9IG5ldyBSZWdFeHAoYCR7T05FX0xBVElOX0xJS0V9JHtPTkVfT1JfTU9SRV9TUEFDRX0kYCk7XHJcbmNvbnN0IFJFR0VYUF9FTkRTX1dJVEhfQ0pLID0gbmV3IFJlZ0V4cChgJHtPTkVfQUpLfSRgKTtcclxuY29uc3QgUkVHRVhQX0VORFNfV0lUSF9MQVRJTiA9IG5ldyBSZWdFeHAoYCR7T05FX0xBVElOX0xJS0V9JGApO1xyXG5jb25zdCBSRUdFWFBfU1RBUlRTX1dJVEhfQ0pLID0gbmV3IFJlZ0V4cChgXiR7T05FX0FKS31gKTtcclxuY29uc3QgUkVHRVhQX1NUQVJUU19XSVRIX0xBVElOID0gbmV3IFJlZ0V4cChgXiR7T05FX0xBVElOX0xJS0V9YCk7XHJcbmNvbnN0IFJFR0VYUF9TUExJVF9FTkRfU1BBQ0UgPSBuZXcgUmVnRXhwKGAoJHtBTllfU1BBQ0V9KSRgKTtcclxuY29uc3QgUkVHRVhQX1NQTElUX0RFRkFVTFQgPSBuZXcgUmVnRXhwKGAoJHtTUExJVF9BSktfTEFUSU5fTElLRX18JHtTUExJVF9MQVRJTl9MSUtFX0FKS318JHtTUExJVF9TWU1CT0xTX05FRURfU1BBQ0VfRk9MTE9XRUR9KWAsICdnJyk7XHJcbmNvbnN0IFJFR0VYUF9TUExJVF9TUEFDRSA9IG5ldyBSZWdFeHAoYCgke1NQTElUX1NQQUNFfXwke1NQTElUX1NZTUJPTFNfTkVFRF9TUEFDRV9GT0xMT1dFRH0pYCwgJ2cnKTtcclxuXHJcbmZ1bmN0aW9uIHdyYXBTcGxpdChleHApIHtcclxuICAgIHJldHVybiBMT09LQkVISU5EX1NVUFBPUlRFRCA/IGV4cCA6IGZvcm1hdC5jYWxsKCcoezB9KScsIGV4cCk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGJ1aWxkU3BsaXQobG9va2JlaGluZCwgZXhwLCBsb29rYWhlYWQpIHtcclxuICAgIHJldHVybiBmb3JtYXQuY2FsbChMT09LQkVISU5EX1NVUFBPUlRFRCA/ICcoPzw9ezB9KXsxfSg/PXsyfSknIDogJ3swfXsxfSg/PXsyfSknLCBsb29rYmVoaW5kLCBleHAsIGxvb2thaGVhZCk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGZvcm1hdCguLi5hcmdzKSB7XHJcbiAgICBsZXQgcmVzdWx0ID0gdGhpcztcclxuICAgIGlmIChhcmdzLmxlbmd0aCA9PSAwKSB7XHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH1cclxuICAgIGxldCBkYXRhID0gYXJncy5sZW5ndGggPT0gMSAmJiB0eXBlb2YgYXJnc1sxXSA9PT0gJ29iamVjdCcgPyBhcmdzWzFdIDogYXJncztcclxuICAgIGZvciAobGV0IGtleSBpbiBkYXRhKSB7XHJcbiAgICAgICAgaWYgKGRhdGFba2V5XSAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIHJlc3VsdCA9IHJlc3VsdC5yZXBsYWNlQWxsKCdcXHsnICsga2V5ICsgJ1xcfScsIGRhdGFba2V5XSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxufVxyXG5cclxuY29uc3QgREVGQVVMVF9PUFRJT05TID0ge1xyXG4gICAgc3BhY2luZ0NvbnRlbnQ6ICcgJ1xyXG59O1xyXG5cclxubGV0IGRlZmF1bHRPcHRpb25zID0ge307XHJcblxyXG5jbGFzcyBTcGFjZXIge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcclxuICAgICAgICB0aGlzLm9wdGlvbnMgPSBoYW5kbGVPcHRpb25zKG9wdGlvbnMpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBjb25maWcob3B0aW9ucykge1xyXG4gICAgICAgIG9wdGlvbnMgPSB3cmFwT3B0aW9ucyhvcHRpb25zKTtcclxuICAgICAgICBPYmplY3QuYXNzaWduKGRlZmF1bHRPcHRpb25zLCBERUZBVUxUX09QVElPTlMsIG9wdGlvbnMpO1xyXG4gICAgfVxyXG5cclxuICAgIHNwYWNlKHRleHQsIG9wdGlvbnMpIHtcclxuICAgICAgICBsZXQgYXJyID0gdGhpcy5zcGxpdCh0ZXh0LCBvcHRpb25zKTtcclxuICAgICAgICBvcHRpb25zID0gdGhpcy5yZXNvbHZlT3B0aW9ucyhvcHRpb25zKTtcclxuICAgICAgICByZXR1cm4gYXJyLnJlZHVjZSgoYWNjLCBjdXIsIGksIHNyYykgPT4ge1xyXG4gICAgICAgICAgICBsZXQgc3BhY2luZ0NvbnRlbnQgPSAnJztcclxuICAgICAgICAgICAgbGV0IGN1cklzU3BhY2UgPSAvXlsgXSokLy50ZXN0KGN1cik7XHJcbiAgICAgICAgICAgIGlmIChjdXJJc1NwYWNlICYmIG9wdGlvbnMuZm9yY2VVbmlmaWVkU3BhY2luZykge1xyXG4gICAgICAgICAgICAgICAgY3VyID0gb3B0aW9ucy5zcGFjaW5nQ29udGVudDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoIWN1cklzU3BhY2UgJiYgKFJFR0VYUF9TVEFSVFNfV0lUSF9TWU1CT0xTX05FRURfU1BBQ0VfRk9MTE9XRUQudGVzdChjdXIpXHJcbiAgICAgICAgICAgICAgICB8fCAvXFwuJC8udGVzdChhY2MpICYmIC9eWzAtOV0rWyVdPyQvLnRlc3QoY3VyKSkpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBhY2MgKyBjdXI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKG9wdGlvbnMud3JhcHBlcikge1xyXG4gICAgICAgICAgICAgICAgaWYgKGN1cklzU3BhY2UpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAob3B0aW9ucy5rZWVwT3JpZ2luYWxTcGFjZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjdXIgPSBvcHRpb25zLndyYXBwZXIub3BlbiArIGN1ciArIG9wdGlvbnMud3JhcHBlci5jbG9zZTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjdXIgPSBvcHRpb25zLndyYXBwZXIub3BlbiArIG9wdGlvbnMud3JhcHBlci5jbG9zZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHNwYWNpbmdDb250ZW50ID0gb3B0aW9ucy53cmFwcGVyLm9wZW4gKyBvcHRpb25zLndyYXBwZXIuY2xvc2U7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoY3VySXNTcGFjZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChvcHRpb25zLmtlZXBPcmlnaW5hbFNwYWNlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGN1ciA9IGN1cjtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjdXIgPSBvcHRpb25zLnNwYWNpbmdDb250ZW50O1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc3BhY2luZ0NvbnRlbnQgPSBvcHRpb25zLnNwYWNpbmdDb250ZW50O1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBhY2MgKyBzcGFjaW5nQ29udGVudCArIGN1cjtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBzcGxpdCh0ZXh0LCBvcHRpb25zKSB7XHJcbiAgICAgICAgb3B0aW9ucyA9IHRoaXMucmVzb2x2ZU9wdGlvbnMob3B0aW9ucyk7XHJcbiAgICAgICAgaWYgKHR5cGVvZiB0ZXh0ID09PSAnc3RyaW5nJykge1xyXG4gICAgICAgICAgICBsZXQgcGF0dGVybiA9IG9wdGlvbnMuaGFuZGxlT3JpZ2luYWxTcGFjZSA/IFJFR0VYUF9TUExJVF9TUEFDRSA6IFJFR0VYUF9TUExJVF9ERUZBVUxUO1xyXG4gICAgICAgICAgICBsZXQgYXJyID0gdGV4dC5zcGxpdChwYXR0ZXJuKTtcclxuICAgICAgICAgICAgaWYgKGFyci5sZW5ndGggPiAxICYmICFMT09LQkVISU5EX1NVUFBPUlRFRCkge1xyXG4gICAgICAgICAgICAgICAgbGV0IHJlc3VsdCA9IFtdO1xyXG4gICAgICAgICAgICAgICAgYXJyLmZsYXRNYXAoKGN1ciwgaSwgc3JjKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gJ1NwYWNlciDpl7TpmpTlmagnPT5bJ1NwYWNlJywgJ3IgJywgJ+mXtOmalOWZqCddPT5bJ1NwYWNlJywncicsJyAnLCAnJywgJ+mXtOmalOWZqCddXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGN1ciAhPT0gdW5kZWZpbmVkICYmIGN1ci5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBjdXIuc3BsaXQoUkVHRVhQX1NQTElUX0VORF9TUEFDRSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBbXTtcclxuICAgICAgICAgICAgICAgIH0pLmZvckVhY2goKGN1ciwgaSwgc3JjKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gJ1NwYWNlcumXtOmalOWZqCc9PlsnU3BhY2UnLCAncicsICfpl7TpmpTlmagnXT0+WydTcGFjZXInLCAn6Ze06ZqU5ZmoJ11cclxuICAgICAgICAgICAgICAgICAgICBpZiAoY3VyLmxlbmd0aCA9PSAxICYmIGkgPiAwICYmICEvXlsgXSokLy50ZXN0KGN1cikpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHByZXYgPSBzcmNbaSAtIDFdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIVNwYWNlci5lbmRzV2l0aENKSyhwcmV2KSAmJiAhU3BhY2VyLnN0YXJ0c1dpdGhDSksoY3VyKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfHwgIVNwYWNlci5lbmRzV2l0aExhdGluKHByZXYpICYmICFTcGFjZXIuc3RhcnRzV2l0aExhdGluKGN1cikpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdFtyZXN1bHQubGVuZ3RoIC0gMV0gKz0gY3VyO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKGN1cik7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIGFyciA9IHJlc3VsdDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gYXJyLmZpbHRlcigoY3VyLCBpLCBzcmMpID0+IHtcclxuICAgICAgICAgICAgICAgIC8vIFsnU3BhY2VyJywnICcsICcnLCAn6Ze06ZqU5ZmoJ109PlsnU3BhY2VyJywnICcsICfpl7TpmpTlmagnXVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGN1ciAhPT0gJyc7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gW3RleHRdO1xyXG4gICAgfVxyXG5cclxuICAgIHJlc29sdmVPcHRpb25zKG9wdGlvbnMpIHtcclxuICAgICAgICByZXR1cm4gb3B0aW9ucyA/IGhhbmRsZU9wdGlvbnMob3B0aW9ucykgOiB0aGlzLm9wdGlvbnM7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGVuZHNXaXRoQ0pLQW5kU3BhY2luZyh0ZXh0KSB7XHJcbiAgICAgICAgcmV0dXJuIFJFR0VYUF9FTkRTX1dJVEhfQ0pLX0FORF9TUEFDSU5HLnRlc3QodGV4dCk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGVuZHNXaXRoQ0pLKHRleHQpIHtcclxuICAgICAgICByZXR1cm4gUkVHRVhQX0VORFNfV0lUSF9DSksudGVzdCh0ZXh0KTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgZW5kc1dpdGhMYXRpbih0ZXh0KSB7XHJcbiAgICAgICAgcmV0dXJuIFJFR0VYUF9FTkRTX1dJVEhfTEFUSU4udGVzdCh0ZXh0KTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgc3RhcnRzV2l0aENKSyh0ZXh0KSB7XHJcbiAgICAgICAgcmV0dXJuIFJFR0VYUF9TVEFSVFNfV0lUSF9DSksudGVzdCh0ZXh0KTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgc3RhcnRzV2l0aExhdGluKHRleHQpIHtcclxuICAgICAgICByZXR1cm4gUkVHRVhQX1NUQVJUU19XSVRIX0xBVElOLnRlc3QodGV4dCk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGVuZHNXaXRoTGF0aW5BbmRTcGFjaW5nKHRleHQpIHtcclxuICAgICAgICByZXR1cm4gUkVHRVhQX0VORFNfV0lUSF9MQVRJTl9BTkRfU1BBQ0lORy50ZXN0KHRleHQpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBlbmRzV2l0aFN5bWJvbHNOZWVkU3BhY2VGb2xsb3dlZCh0ZXh0KSB7XHJcbiAgICAgICAgcmV0dXJuIFJFR0VYUF9FTkRTX1dJVEhfU1lNQk9MU19ORUVEX1NQQUNFX0ZPTExPV0VELnRlc3QodGV4dCk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIHN0YXJ0c1dpdGhTeW1ib2xzTmVlZFNwYWNlRm9sbG93ZWQodGV4dCkge1xyXG4gICAgICAgIHJldHVybiBSRUdFWFBfU1RBUlRTX1dJVEhfU1lNQk9MU19ORUVEX1NQQUNFX0ZPTExPV0VELnRlc3QodGV4dCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHdyYXBPcHRpb25zKG9wdGlvbnMpIHtcclxuICAgIHJldHVybiB0eXBlb2Ygb3B0aW9ucyA9PT0gJ3N0cmluZycgPyB7c3BhY2luZ0NvbnRlbnQ6IG9wdGlvbnN9IDogb3B0aW9ucztcclxufVxyXG5cclxuZnVuY3Rpb24gaGFuZGxlT3B0aW9ucyhvcHRpb25zKSB7XHJcbiAgICBvcHRpb25zID0gd3JhcE9wdGlvbnMob3B0aW9ucyk7XHJcbiAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7fSwgREVGQVVMVF9PUFRJT05TLCBkZWZhdWx0T3B0aW9ucywgb3B0aW9ucyk7XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IFNwYWNlcjsiLCJpbXBvcnQgQnJvd3NlclNwYWNlciBmcm9tICcuL2Jyb3dzZXIuanMnXHJcblxyXG4vLyBBZGQgc3VwcG9ydCBmb3IgQU1EIChBc3luY2hyb25vdXMgTW9kdWxlIERlZmluaXRpb24pIGxpYnJhcmllcyBzdWNoIGFzIHJlcXVpcmUuanMuXHJcbmlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIHtcclxuICAgIGRlZmluZShbXSwgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgU3BhY2VyOiBCcm93c2VyU3BhY2VyXHJcbiAgICAgICAgfVxyXG4gICAgfSlcclxufVxyXG4vL0FkZCBzdXBwb3J0IGZvcm0gQ29tbW9uSlMgbGlicmFyaWVzIHN1Y2ggYXMgYnJvd3NlcmlmeS5cclxuaWYgKHR5cGVvZiBleHBvcnRzICE9PSAndW5kZWZpbmVkJykge1xyXG4gICAgZXhwb3J0cy5TcGFjZXIgPSBCcm93c2VyU3BhY2VyO1xyXG59XHJcbi8vRGVmaW5lIGdsb2JhbGx5IGluIGNhc2UgQU1EIGlzIG5vdCBhdmFpbGFibGUgb3IgdW51c2VkXHJcbmlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJykge1xyXG4gICAgd2luZG93LlNwYWNlciA9IEJyb3dzZXJTcGFjZXI7XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IEJyb3dzZXJTcGFjZXI7Il19
