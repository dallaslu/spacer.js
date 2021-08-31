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
            for (var i = 0; i < _arr.length; i++) {
                var isSpacing = /^[ ]*$/.test(_arr[i]);
                if (isSpacing || i != 0 && !/^[ ]*$/.test(_arr[i - 1]) && !_core2.default.startsWithSymbolsNeedSpaceFollowed(_arr[i])) {
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
                if (!curIsSpace && REGEXP_STARTS_WITH_SYMBOLS_NEED_SPACE_FOLLOWED.test(cur)) {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJidWlsZC9qcy9icm93c2VyLmpzIiwiYnVpbGQvanMvY29yZS5qcyIsImJ1aWxkL2pzL3NwYWNlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7O0FDQUE7Ozs7Ozs7Ozs7OztBQUVBLElBQU0sZUFBZSx3QkFBckI7QUFDQSxJQUFNLGFBQWEsb0hBQW5CO0FBQ0EsSUFBTSxlQUFlLDRCQUFyQjs7SUFFTSxhOzs7QUFFRiwyQkFBWSxPQUFaLEVBQXFCO0FBQUE7O0FBQUEsa0lBQ1gsT0FEVzs7QUFFakIsWUFBSSxRQUFRLE9BQVosRUFBcUI7QUFDakIsa0JBQUssT0FBTCxDQUFhLGNBQWIsR0FBOEIsTUFBSyxPQUFMLENBQWEsY0FBYixDQUE0QixPQUE1QixDQUFvQyxHQUFwQyxFQUF5QyxRQUF6QyxDQUE5QjtBQUNIO0FBSmdCO0FBS3BCOzs7O2tDQUVTLFEsRUFBVSxPLEVBQVM7QUFBQTs7QUFDekIsdUJBQVcsT0FBTyxRQUFQLEtBQW9CLFFBQXBCLEdBQStCLFNBQVMsZ0JBQVQsQ0FBMEIsUUFBMUIsQ0FBL0IsR0FBc0UsWUFBWSxDQUFDLFNBQVMsVUFBVCxDQUFvQixDQUFwQixDQUFELENBQTdGO0FBQ0Esc0JBQVUsS0FBSyxjQUFMLENBQW9CLE9BQXBCLENBQVY7QUFDQSxnQkFBSSxRQUFRLE9BQVosRUFBcUI7QUFDakIsd0JBQVEsY0FBUixHQUF5QixRQUFRLGNBQVIsQ0FBdUIsT0FBdkIsQ0FBK0IsR0FBL0IsRUFBb0MsUUFBcEMsQ0FBekI7QUFDSDtBQUNELGVBQUcsT0FBSCxDQUFXLElBQVgsQ0FBZ0IsUUFBaEIsRUFBMEIsYUFBSztBQUMzQiwwQkFBVSxNQUFWLEVBQWdCLENBQWhCLEVBQW1CLE9BQW5CO0FBQ0gsYUFGRDtBQUdIOzs7O0VBbEJ1QixjOztBQXFCNUIsU0FBUyxTQUFULENBQW1CLE1BQW5C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OUIsR0FBMEQsT0FBakU7QUFDSDs7QUFFRCxTQUFTLGFBQVQsQ0FBdUIsT0FBdkIsRUFBZ0M7QUFDNUIsY0FBVSxZQUFZLE9BQVosQ0FBVjtBQUNBLFdBQU8sT0FBTyxNQUFQLENBQWMsRUFBZCxFQUFrQixlQUFsQixFQUFtQyxjQUFuQyxFQUFtRCxPQUFuRCxDQUFQO0FBQ0g7O2tCQUVjLE07Ozs7Ozs7OztBQ3JOZjs7Ozs7O0FBRUE7QUFDQSxJQUFJLE9BQU8sTUFBUCxLQUFrQixVQUFsQixJQUFnQyxPQUFPLEdBQTNDLEVBQWdEO0FBQzVDLFdBQU8sRUFBUCxFQUFXLFlBQVc7QUFDbEIsZUFBTztBQUNILG9CQUFRO0FBREwsU0FBUDtBQUdILEtBSkQ7QUFLSDtBQUNEO0FBQ0EsSUFBSSxPQUFPLE9BQVAsS0FBbUIsV0FBdkIsRUFBb0M7QUFDaEMsWUFBUSxNQUFSLEdBQWlCLGlCQUFqQjtBQUNIO0FBQ0Q7QUFDQSxJQUFJLE9BQU8sTUFBUCxLQUFrQixXQUF0QixFQUFtQztBQUMvQixXQUFPLE1BQVAsR0FBZ0IsaUJBQWhCO0FBQ0g7O2tCQUVjLGlCIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiaW1wb3J0IFNwYWNlciBmcm9tICcuL2NvcmUuanMnXHJcblxyXG5jb25zdCBJR05PUkVEX1RBR1MgPSAvXihzY3JpcHR8bGlua3xzdHlsZSkkL2k7XHJcbmNvbnN0IEJMT0NLX1RBR1MgPSAvXihkaXZ8cHxoMXxoMnxoM3xoNHxoNXxoNnxibG9ja3FvdXRlfHByZXx0ZXh0YXJlYXxuYXZ8aGVhZGVyfG1haW58Zm9vdGVyfHNlY3Rpb258c2lkYmFyfGFzaWRlfHRhYmxlfGxpfHVsfG9sfGRsKSQvaTtcclxuY29uc3QgU1BBQ0lOR19UQUdTID0gL14oYnJ8aHJ8aW1nfHZpZGVvfGF1ZGlvKSQvaTtcclxuXHJcbmNsYXNzIEJyb3dzZXJTcGFjZXIgZXh0ZW5kcyBTcGFjZXIge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcclxuICAgICAgICBzdXBlcihvcHRpb25zKTtcclxuICAgICAgICBpZiAob3B0aW9ucy53cmFwcGVyKSB7XHJcbiAgICAgICAgICAgIHRoaXMub3B0aW9ucy5zcGFjaW5nQ29udGVudCA9IHRoaXMub3B0aW9ucy5zcGFjaW5nQ29udGVudC5yZXBsYWNlKCcgJywgJyZuYnNwOycpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBzcGFjZVBhZ2UoZWxlbWVudHMsIG9wdGlvbnMpIHtcclxuICAgICAgICBlbGVtZW50cyA9IHR5cGVvZiBlbGVtZW50cyA9PT0gJ3N0cmluZycgPyBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKGVsZW1lbnRzKSA6IChlbGVtZW50cyB8fCBbZG9jdW1lbnQuY2hpbGROb2Rlc1sxXV0pO1xyXG4gICAgICAgIG9wdGlvbnMgPSB0aGlzLnJlc29sdmVPcHRpb25zKG9wdGlvbnMpO1xyXG4gICAgICAgIGlmIChvcHRpb25zLndyYXBwZXIpIHtcclxuICAgICAgICAgICAgb3B0aW9ucy5zcGFjaW5nQ29udGVudCA9IG9wdGlvbnMuc3BhY2luZ0NvbnRlbnQucmVwbGFjZSgnICcsICcmbmJzcDsnKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgW10uZm9yRWFjaC5jYWxsKGVsZW1lbnRzLCBlID0+IHtcclxuICAgICAgICAgICAgc3BhY2VOb2RlKHRoaXMsIGUsIG9wdGlvbnMpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBzcGFjZU5vZGUoc3BhY2VyLCBub2RlLCBvcHRpb25zKSB7XHJcbiAgICBpZiAobm9kZS50YWdOYW1lICYmIElHTk9SRURfVEFHUy50ZXN0KG5vZGUudGFnTmFtZSkpIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICBsZXQgb3B0aW9uc05vV3JhcHBlciA9IE9iamVjdC5hc3NpZ24oe30sIG9wdGlvbnMsIHt3cmFwcGVyOiBmYWxzZX0pO1xyXG4gICAgbGV0IG9wdGlvbnNOb1dyYXBwZXJOb0hUTUxFbnRpdHkgPSBPYmplY3QuYXNzaWduKHt9LCBvcHRpb25zLCB7XHJcbiAgICAgICAgd3JhcHBlcjogZmFsc2UsXHJcbiAgICAgICAgc3BhY2luZ0NvbnRlbnQ6IG9wdGlvbnMuc3BhY2luZ0NvbnRlbnQucmVwbGFjZSgnJm5ic3A7JywgJyAnKVxyXG4gICAgfSk7XHJcbiAgICBsZXQgb3B0aW9uc0VmZmVjdCA9IG9wdGlvbnM7XHJcbiAgICBpZiAobm9kZS5wYXJlbnROb2RlICYmIG5vZGUucGFyZW50Tm9kZS50YWdOYW1lID09PSAnVElUTEUnKSB7XHJcbiAgICAgICAgb3B0aW9uc0VmZmVjdCA9IG9wdGlvbnNOb1dyYXBwZXJOb0hUTUxFbnRpdHk7XHJcbiAgICB9XHJcbiAgICBpZiAobm9kZS5wcmV2aW91c1NpYmxpbmdcclxuICAgICAgICAmJiAoIW5vZGUucHJldmlvdXNTaWJsaW5nLnRhZ05hbWUgfHwgKCFCTE9DS19UQUdTLnRlc3Qobm9kZS5wcmV2aW91c1NpYmxpbmcudGFnTmFtZSkgJiYgIVNQQUNJTkdfVEFHUy50ZXN0KG5vZGUucHJldmlvdXNTaWJsaW5nLnRhZ05hbWUpKSlcclxuICAgICAgICAmJiAoIW5vZGUudGFnTmFtZSB8fCAoIUJMT0NLX1RBR1MudGVzdChub2RlLnRhZ05hbWUpICYmICFTUEFDSU5HX1RBR1MudGVzdChub2RlLnRhZ05hbWUpKSkpIHtcclxuICAgICAgICBsZXQgcHJlVGV4dCA9IG5vZGUucHJldmlvdXNTaWJsaW5nLm5vZGVUeXBlID09PSBOb2RlLlRFWFRfTk9ERSA/IG5vZGUucHJldmlvdXNTaWJsaW5nLmRhdGEgOiBub2RlLnByZXZpb3VzU2libGluZy50ZXh0Q29udGVudDtcclxuICAgICAgICBpZiAoKFNwYWNlci5lbmRzV2l0aENKSyhwcmVUZXh0KSB8fCBTcGFjZXIuZW5kc1dpdGhTeW1ib2xzTmVlZFNwYWNlRm9sbG93ZWQocHJlVGV4dCkpICYmIFNwYWNlci5zdGFydHNXaXRoTGF0aW4obm9kZS50ZXh0Q29udGVudClcclxuICAgICAgICAgICAgfHwgKFNwYWNlci5lbmRzV2l0aExhdGluKHByZVRleHQpIHx8IFNwYWNlci5lbmRzV2l0aFN5bWJvbHNOZWVkU3BhY2VGb2xsb3dlZChwcmVUZXh0KSkgJiYgU3BhY2VyLnN0YXJ0c1dpdGhDSksobm9kZS50ZXh0Q29udGVudCkpIHtcclxuICAgICAgICAgICAgbGV0IHNwYWNlQ29udGVudCA9IG9wdGlvbnNFZmZlY3QuZm9yY2VVbmlmaWVkU3BhY2luZyA/IG9wdGlvbnNFZmZlY3Quc3BhY2luZ0NvbnRlbnQgOiAnJztcclxuICAgICAgICAgICAgaWYgKG9wdGlvbnNFZmZlY3Qud3JhcHBlcikge1xyXG4gICAgICAgICAgICAgICAgaW5zZXJ0QmVmb3JlKGNyZWF0ZU5vZGUob3B0aW9uc0VmZmVjdC53cmFwcGVyLm9wZW4gKyBzcGFjZUNvbnRlbnQgKyBvcHRpb25zRWZmZWN0LndyYXBwZXIuY2xvc2UpLCBub2RlKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGluc2VydEJlZm9yZShkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShzcGFjZUNvbnRlbnQgPyBzcGFjZUNvbnRlbnQgOiBvcHRpb25zRWZmZWN0LnNwYWNpbmdDb250ZW50KSwgbm9kZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKG9wdGlvbnNFZmZlY3QuaGFuZGxlT3JpZ2luYWxTcGFjZSAmJiBub2RlLnByZXZpb3VzU2libGluZy5ub2RlVHlwZSA9PT0gTm9kZS5URVhUX05PREUpIHtcclxuICAgICAgICAgICAgaWYgKFNwYWNlci5lbmRzV2l0aENKS0FuZFNwYWNpbmcocHJlVGV4dCkgJiYgU3BhY2VyLnN0YXJ0c1dpdGhMYXRpbihub2RlLnRleHRDb250ZW50KVxyXG4gICAgICAgICAgICAgICAgfHwgU3BhY2VyLmVuZHNXaXRoTGF0aW5BbmRTcGFjaW5nKHByZVRleHQpICYmIFNwYWNlci5zdGFydHNXaXRoQ0pLKG5vZGUudGV4dENvbnRlbnQpKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgcHJlRW5kU3BhY2luZyA9ICcnO1xyXG4gICAgICAgICAgICAgICAgbGV0IGFyciA9IC8oLiopKFsgXSspJC9nLm1hdGNoKG5vZGUucHJldmlvdXNTaWJsaW5nLmRhdGEpO1xyXG4gICAgICAgICAgICAgICAgbm9kZS5wcmV2aW91c1NpYmxpbmcuZGF0YSA9IGFyclsxXTtcclxuICAgICAgICAgICAgICAgIHByZUVuZFNwYWNpbmcgPSBhcnJbMl07XHJcbiAgICAgICAgICAgICAgICBsZXQgc3BhY2VDb250ZW50ID0gb3B0aW9uc0VmZmVjdC5mb3JjZVVuaWZpZWRTcGFjaW5nID8gb3B0aW9uc0VmZmVjdC5zcGFjaW5nQ29udGVudCA6IChvcHRpb25zRWZmZWN0LmtlZXBPcmlnaW5hbFNwYWNlID8gcHJlRW5kU3BhY2luZyA6ICcnKTtcclxuICAgICAgICAgICAgICAgIGlmIChvcHRpb25zRWZmZWN0LndyYXBwZXIpIHtcclxuICAgICAgICAgICAgICAgICAgICBpbnNlcnRCZWZvcmUoY3JlYXRlTm9kZShvcHRpb25zRWZmZWN0LndyYXBwZXIub3BlbiArIHNwYWNlQ29udGVudCArIG9wdGlvbnNFZmZlY3Qud3JhcHBlci5jbG9zZSksIG5vZGUpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBpbnNlcnRCZWZvcmUoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoc3BhY2VDb250ZW50ID8gc3BhY2VDb250ZW50IDogb3B0aW9uc0VmZmVjdC5zcGFjaW5nQ29udGVudCksIG5vZGUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgaWYgKG5vZGUubm9kZVR5cGUgPT09IE5vZGUuVEVYVF9OT0RFKSB7XHJcbiAgICAgICAgaWYgKG9wdGlvbnNFZmZlY3Qud3JhcHBlcikge1xyXG4gICAgICAgICAgICBsZXQgYXJyID0gc3BhY2VyLnNwbGl0KG5vZGUuZGF0YSwgb3B0aW9uc0VmZmVjdCk7XHJcbiAgICAgICAgICAgIGlmIChhcnIubGVuZ3RoID09IDEpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGFyci5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgbGV0IGlzU3BhY2luZyA9IC9eWyBdKiQvLnRlc3QoYXJyW2ldKTtcclxuICAgICAgICAgICAgICAgIGlmIChpc1NwYWNpbmcgfHwgKGkgIT0gMCAmJiAhL15bIF0qJC8udGVzdChhcnJbaSAtIDFdKSAmJiAhU3BhY2VyLnN0YXJ0c1dpdGhTeW1ib2xzTmVlZFNwYWNlRm9sbG93ZWQoYXJyW2ldKSkpIHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgc3BhY2VDb250ZW50ID0gb3B0aW9uc0VmZmVjdC5mb3JjZVVuaWZpZWRTcGFjaW5nID8gb3B0aW9uc0VmZmVjdC5zcGFjaW5nQ29udGVudCA6IChpc1NwYWNpbmcgJiYgb3B0aW9uc0VmZmVjdC5rZWVwT3JpZ2luYWxTcGFjZSkgPyBhcnJbaV0gOiAnJztcclxuICAgICAgICAgICAgICAgICAgICBpbnNlcnRCZWZvcmUoY3JlYXRlTm9kZShvcHRpb25zRWZmZWN0LndyYXBwZXIub3BlbiArIHNwYWNlQ29udGVudCArIG9wdGlvbnNFZmZlY3Qud3JhcHBlci5jbG9zZSksIG5vZGUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKCFpc1NwYWNpbmcpIHtcclxuICAgICAgICAgICAgICAgICAgICBpbnNlcnRCZWZvcmUoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoYXJyW2ldKSwgbm9kZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgbm9kZS5yZW1vdmUoKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBpZiAobm9kZS5wYXJlbnROb2RlLnRhZ05hbWUgPT09ICdUSVRMRScpIHtcclxuICAgICAgICAgICAgICAgIHNwYWNlQXR0cmlidXRlKHNwYWNlciwgbm9kZSwgJ2RhdGEnLCBvcHRpb25zTm9XcmFwcGVyTm9IVE1MRW50aXR5KTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHNwYWNlQXR0cmlidXRlKHNwYWNlciwgbm9kZSwgJ2RhdGEnLCBvcHRpb25zTm9XcmFwcGVyKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm47XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIC8vIHRhZyBuYW1lIGZpbHRlclxyXG4gICAgICAgIHNwYWNlQXR0cmlidXRlKHNwYWNlciwgbm9kZSwgJ3RpdGxlJywgb3B0aW9uc05vV3JhcHBlck5vSFRNTEVudGl0eSk7XHJcbiAgICAgICAgc3BhY2VBdHRyaWJ1dGUoc3BhY2VyLCBub2RlLCAnYWx0Jywgb3B0aW9uc05vV3JhcHBlck5vSFRNTEVudGl0eSk7XHJcbiAgICAgICAgc3BhY2VBdHRyaWJ1dGUoc3BhY2VyLCBub2RlLCAnbGFiZWwnLCBvcHRpb25zTm9XcmFwcGVyTm9IVE1MRW50aXR5KTtcclxuICAgICAgICBzcGFjZUF0dHJpYnV0ZShzcGFjZXIsIG5vZGUsICdwbGFjZWhvbGRlcicsIG9wdGlvbnNOb1dyYXBwZXJOb0hUTUxFbnRpdHkpO1xyXG4gICAgfVxyXG4gICAgaWYgKG5vZGUuY2hpbGROb2Rlcykge1xyXG4gICAgICAgIGxldCBzdGF0aWNOb2RlcyA9IFtdO1xyXG4gICAgICAgIG5vZGUuY2hpbGROb2Rlcy5mb3JFYWNoKGNoaWxkID0+IHtcclxuICAgICAgICAgICAgc3RhdGljTm9kZXMucHVzaChjaGlsZCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgc3RhdGljTm9kZXMuZm9yRWFjaChjaGlsZCA9PiB7XHJcbiAgICAgICAgICAgIHNwYWNlTm9kZShzcGFjZXIsIGNoaWxkLCBvcHRpb25zKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxufVxyXG5cclxuZnVuY3Rpb24gY3JlYXRlTm9kZShodG1sKSB7XHJcbiAgICBsZXQgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICBkaXYuaW5uZXJIVE1MID0gaHRtbDtcclxuICAgIHJldHVybiBkaXYuZmlyc3RDaGlsZDtcclxufVxyXG5cclxuZnVuY3Rpb24gaW5zZXJ0QmVmb3JlKG5ld05vZGUsIG5vZGUpIHtcclxuICAgIGlmIChub2RlLnRhZ05hbWUgIT09ICdIVE1MJyAmJiBub2RlLnBhcmVudE5vZGUgJiYgbm9kZS5wYXJlbnROb2RlLnRhZ05hbWUgIT09ICdIVE1MJykge1xyXG4gICAgICAgIG5vZGUucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUobmV3Tm9kZSwgbm9kZSk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHNwYWNlQXR0cmlidXRlKHNwYWNlciwgbm9kZSwgYXR0ciwgb3B0aW9ucykge1xyXG4gICAgaWYgKG5vZGVbYXR0cl0pIHtcclxuICAgICAgICBsZXQgcmVzdWx0ID0gc3BhY2VyLnNwYWNlKG5vZGVbYXR0cl0sIG9wdGlvbnMpO1xyXG4gICAgICAgIGlmIChub2RlW2F0dHJdICE9PSByZXN1bHQpIHtcclxuICAgICAgICAgICAgbm9kZVthdHRyXSA9IHJlc3VsdDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IEJyb3dzZXJTcGFjZXI7IiwiLypcclxuICpcclxuICovXHJcbmNvbnN0IExPT0tCRUhJTkRfU1VQUE9SVEVEID0gKCgpID0+IHtcclxuICAgIHRyeSB7XHJcbiAgICAgICAgbmV3IFJlZ0V4cCgnKD88PWV4cCknKTtcclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcbn0pKCk7XHJcblxyXG4vKlxyXG4gKiBcXHUyRTgwLVxcdTJFRkYgICAgQ0pLIOmDqOmmllxyXG4gKiBcXHUyRjAwLVxcdTJGREYgICAg5bq354aZ5a2X5YW46YOo6aaWXHJcbiAqIFxcdTMwMDAtXFx1MzAzRiAgICBDSksg56ym5Y+35ZKM5qCH54K5XHJcbiAqIFxcdTMxQzAtXFx1MzFFRiAgICBDSksg56yU55S7XHJcbiAqIFxcdTMyMDAtXFx1MzJGRiAgICDlsIHpl63lvI8gQ0pLIOaWh+Wtl+WSjOaciOS7vVxyXG4gKiBcXHUzMzAwLVxcdTMzRkYgICAgQ0pLIOWFvOWuuVxyXG4gKiBcXHUzNDAwLVxcdTREQkYgICAgQ0pLIOe7n+S4gOihqOaEj+espuWPt+aJqeWxlSBBXHJcbiAqIFxcdTREQzAtXFx1NERGRiAgICDmmJPnu4/lha3ljYHlm5vljabnrKblj7dcclxuICogXFx1NEUwMC1cXHU5RkJGICAgIENKSyDnu5/kuIDooajmhI/nrKblj7dcclxuICogXFx1RjkwMC1cXHVGQUZGICAgIENKSyDlhbzlrrnosaHlvaLmloflrZdcclxuICogXFx1RkUzMC1cXHVGRTRGICAgIENKSyDlhbzlrrnlvaLlvI9cclxuICogXFx1RkYwMC1cXHVGRkVGICAgIOWFqOinkkFTQ0lJ44CB5YWo6KeS5qCH54K5XHJcbiAqXHJcbiAqIGh0dHBzOi8vd3d3LnVuaWNvZGUub3JnL1B1YmxpYy81LjAuMC91Y2QvVW5paGFuLmh0bWxcclxuICovXHJcbmNvbnN0IENKSyA9ICdcXHUyRTgwLVxcdTJGREZcXHUzMDQwLVxcdUZFNEYnO1xyXG5jb25zdCBTWU1CT0xTID0gJ0AmPV9cXCQlXFxeXFwqXFwtKyc7XHJcbmNvbnN0IExBVElOID0gJ0EtWmEtejAtOVxcdTAwQzAtXFx1MDBGRlxcdTAxMDAtXFx1MDE3RlxcdTAxODAtXFx1MDI0RlxcdTFFMDAtXFx1MUVGRic7XHJcbmNvbnN0IE9ORV9PUl9NT1JFX1NQQUNFID0gJ1sgXSsnO1xyXG5jb25zdCBBTllfU1BBQ0UgPSAnWyBdKic7XHJcbmNvbnN0IFNZTUJPTFNfTkVFRF9TUEFDRV9GT0xMT1dFRCA9ICdbXFwuOiw/IV0nO1xyXG5jb25zdCBPTkVfQUpLID0gYFske0NKS31dYDtcclxuY29uc3QgT05FX0xBVElOID0gYFske0xBVElOfV1gO1xyXG5jb25zdCBPTkVfTEFUSU5fTElLRSA9IGBbJHtMQVRJTn0lXWA7XHJcbmNvbnN0IFNQTElUX0FKS19TUEFDRV9MQVRJTl9MSUtFID0gYnVpbGRTcGxpdChgJHtPTkVfTEFUSU5fTElLRX1gLCBgJHtBTllfU1BBQ0V9YCwgYCR7T05FX0FKS31gKTtcclxuY29uc3QgU1BMSVRfTEFUSU5fTElLRV9TUEFDRV9BSksgPSBidWlsZFNwbGl0KGAke09ORV9BSkt9YCwgYCR7QU5ZX1NQQUNFfWAsIGAke09ORV9MQVRJTl9MSUtFfWApO1xyXG5jb25zdCBTUExJVF9TUEFDRSA9IGAke1NQTElUX0FKS19TUEFDRV9MQVRJTl9MSUtFfXwke1NQTElUX0xBVElOX0xJS0VfU1BBQ0VfQUpLfWA7XHJcbmNvbnN0IFNQTElUX1NZTUJPTFNfTkVFRF9TUEFDRV9GT0xMT1dFRCA9IGJ1aWxkU3BsaXQoYCR7U1lNQk9MU19ORUVEX1NQQUNFX0ZPTExPV0VEfWAsICcnLCBgJHtPTkVfQUpLfXwke09ORV9MQVRJTn1gKTtcclxuY29uc3QgU1BMSVRfQUpLX0xBVElOX0xJS0UgPSBidWlsZFNwbGl0KGAke09ORV9MQVRJTl9MSUtFfWAsICcnLCBgJHtPTkVfQUpLfWApO1xyXG5jb25zdCBTUExJVF9MQVRJTl9MSUtFX0FKSyA9IGJ1aWxkU3BsaXQoYCR7T05FX0FKS31gLCAnJywgYCR7T05FX0xBVElOX0xJS0V9YCk7XHJcbmNvbnN0IFJFR0VYUF9BTllfQ0pLID0gbmV3IFJlZ0V4cChgJHtPTkVfQUpLfWApO1xyXG5jb25zdCBSRUdFWFBfRU5EU19XSVRIX1NZTUJPTFNfTkVFRF9TUEFDRV9GT0xMT1dFRCA9IG5ldyBSZWdFeHAoYCR7U1lNQk9MU19ORUVEX1NQQUNFX0ZPTExPV0VEfSRgKTtcclxuY29uc3QgUkVHRVhQX1NUQVJUU19XSVRIX1NZTUJPTFNfTkVFRF9TUEFDRV9GT0xMT1dFRCA9IG5ldyBSZWdFeHAoYF4ke1NZTUJPTFNfTkVFRF9TUEFDRV9GT0xMT1dFRH1gKTtcclxuY29uc3QgUkVHRVhQX0VORFNfV0lUSF9DSktfQU5EX1NQQUNJTkcgPSBuZXcgUmVnRXhwKGAke09ORV9BSkt9JHtPTkVfT1JfTU9SRV9TUEFDRX0kYCk7XHJcbmNvbnN0IFJFR0VYUF9FTkRTX1dJVEhfTEFUSU5fQU5EX1NQQUNJTkcgPSBuZXcgUmVnRXhwKGAke09ORV9MQVRJTl9MSUtFfSR7T05FX09SX01PUkVfU1BBQ0V9JGApO1xyXG5jb25zdCBSRUdFWFBfRU5EU19XSVRIX0NKSyA9IG5ldyBSZWdFeHAoYCR7T05FX0FKS30kYCk7XHJcbmNvbnN0IFJFR0VYUF9FTkRTX1dJVEhfTEFUSU4gPSBuZXcgUmVnRXhwKGAke09ORV9MQVRJTl9MSUtFfSRgKTtcclxuY29uc3QgUkVHRVhQX1NUQVJUU19XSVRIX0NKSyA9IG5ldyBSZWdFeHAoYF4ke09ORV9BSkt9YCk7XHJcbmNvbnN0IFJFR0VYUF9TVEFSVFNfV0lUSF9MQVRJTiA9IG5ldyBSZWdFeHAoYF4ke09ORV9MQVRJTl9MSUtFfWApO1xyXG5jb25zdCBSRUdFWFBfU1BMSVRfRU5EX1NQQUNFID0gbmV3IFJlZ0V4cChgKCR7QU5ZX1NQQUNFfSkkYCk7XHJcbmNvbnN0IFJFR0VYUF9TUExJVF9ERUZBVUxUID0gbmV3IFJlZ0V4cChgKCR7U1BMSVRfQUpLX0xBVElOX0xJS0V9fCR7U1BMSVRfTEFUSU5fTElLRV9BSkt9fCR7U1BMSVRfU1lNQk9MU19ORUVEX1NQQUNFX0ZPTExPV0VEfSlgLCAnZycpO1xyXG5jb25zdCBSRUdFWFBfU1BMSVRfU1BBQ0UgPSBuZXcgUmVnRXhwKGAoJHtTUExJVF9TUEFDRX18JHtTUExJVF9TWU1CT0xTX05FRURfU1BBQ0VfRk9MTE9XRUR9KWAsICdnJyk7XHJcblxyXG5mdW5jdGlvbiB3cmFwU3BsaXQoZXhwKSB7XHJcbiAgICByZXR1cm4gTE9PS0JFSElORF9TVVBQT1JURUQgPyBleHAgOiBmb3JtYXQuY2FsbCgnKHswfSknLCBleHApO1xyXG59XHJcblxyXG5mdW5jdGlvbiBidWlsZFNwbGl0KGxvb2tiZWhpbmQsIGV4cCwgbG9va2FoZWFkKSB7XHJcbiAgICByZXR1cm4gZm9ybWF0LmNhbGwoTE9PS0JFSElORF9TVVBQT1JURUQgPyAnKD88PXswfSl7MX0oPz17Mn0pJyA6ICd7MH17MX0oPz17Mn0pJywgbG9va2JlaGluZCwgZXhwLCBsb29rYWhlYWQpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBmb3JtYXQoLi4uYXJncykge1xyXG4gICAgbGV0IHJlc3VsdCA9IHRoaXM7XHJcbiAgICBpZiAoYXJncy5sZW5ndGggPT0gMCkge1xyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9XHJcbiAgICBsZXQgZGF0YSA9IGFyZ3MubGVuZ3RoID09IDEgJiYgdHlwZW9mIGFyZ3NbMV0gPT09ICdvYmplY3QnID8gYXJnc1sxXSA6IGFyZ3M7XHJcbiAgICBmb3IgKGxldCBrZXkgaW4gZGF0YSkge1xyXG4gICAgICAgIGlmIChkYXRhW2tleV0gIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICByZXN1bHQgPSByZXN1bHQucmVwbGFjZUFsbCgnXFx7JyArIGtleSArICdcXH0nLCBkYXRhW2tleV0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiByZXN1bHQ7XHJcbn1cclxuXHJcbmNvbnN0IERFRkFVTFRfT1BUSU9OUyA9IHtcclxuICAgIHNwYWNpbmdDb250ZW50OiAnICdcclxufTtcclxuXHJcbmxldCBkZWZhdWx0T3B0aW9ucyA9IHt9O1xyXG5cclxuY2xhc3MgU3BhY2VyIHtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihvcHRpb25zKSB7XHJcbiAgICAgICAgdGhpcy5vcHRpb25zID0gaGFuZGxlT3B0aW9ucyhvcHRpb25zKTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgY29uZmlnKG9wdGlvbnMpIHtcclxuICAgICAgICBvcHRpb25zID0gd3JhcE9wdGlvbnMob3B0aW9ucyk7XHJcbiAgICAgICAgT2JqZWN0LmFzc2lnbihkZWZhdWx0T3B0aW9ucywgREVGQVVMVF9PUFRJT05TLCBvcHRpb25zKTtcclxuICAgIH1cclxuXHJcbiAgICBzcGFjZSh0ZXh0LCBvcHRpb25zKSB7XHJcbiAgICAgICAgbGV0IGFyciA9IHRoaXMuc3BsaXQodGV4dCwgb3B0aW9ucyk7XHJcbiAgICAgICAgb3B0aW9ucyA9IHRoaXMucmVzb2x2ZU9wdGlvbnMob3B0aW9ucyk7XHJcbiAgICAgICAgcmV0dXJuIGFyci5yZWR1Y2UoKGFjYywgY3VyLCBpLCBzcmMpID0+IHtcclxuICAgICAgICAgICAgbGV0IHNwYWNpbmdDb250ZW50ID0gJyc7XHJcbiAgICAgICAgICAgIGxldCBjdXJJc1NwYWNlID0gL15bIF0qJC8udGVzdChjdXIpO1xyXG4gICAgICAgICAgICBpZiAoY3VySXNTcGFjZSAmJiBvcHRpb25zLmZvcmNlVW5pZmllZFNwYWNpbmcpIHtcclxuICAgICAgICAgICAgICAgIGN1ciA9IG9wdGlvbnMuc3BhY2luZ0NvbnRlbnQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKCFjdXJJc1NwYWNlICYmIFJFR0VYUF9TVEFSVFNfV0lUSF9TWU1CT0xTX05FRURfU1BBQ0VfRk9MTE9XRUQudGVzdChjdXIpKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gYWNjICsgY3VyO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChvcHRpb25zLndyYXBwZXIpIHtcclxuICAgICAgICAgICAgICAgIGlmIChjdXJJc1NwYWNlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wdGlvbnMua2VlcE9yaWdpbmFsU3BhY2UpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY3VyID0gb3B0aW9ucy53cmFwcGVyLm9wZW4gKyBjdXIgKyBvcHRpb25zLndyYXBwZXIuY2xvc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY3VyID0gb3B0aW9ucy53cmFwcGVyLm9wZW4gKyBvcHRpb25zLndyYXBwZXIuY2xvc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBzcGFjaW5nQ29udGVudCA9IG9wdGlvbnMud3JhcHBlci5vcGVuICsgb3B0aW9ucy53cmFwcGVyLmNsb3NlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgaWYgKGN1cklzU3BhY2UpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAob3B0aW9ucy5rZWVwT3JpZ2luYWxTcGFjZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjdXIgPSBjdXI7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY3VyID0gb3B0aW9ucy5zcGFjaW5nQ29udGVudDtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHNwYWNpbmdDb250ZW50ID0gb3B0aW9ucy5zcGFjaW5nQ29udGVudDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gYWNjICsgc3BhY2luZ0NvbnRlbnQgKyBjdXI7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgc3BsaXQodGV4dCwgb3B0aW9ucykge1xyXG4gICAgICAgIG9wdGlvbnMgPSB0aGlzLnJlc29sdmVPcHRpb25zKG9wdGlvbnMpO1xyXG4gICAgICAgIGlmICh0eXBlb2YgdGV4dCA9PT0gJ3N0cmluZycpIHtcclxuICAgICAgICAgICAgbGV0IHBhdHRlcm4gPSBvcHRpb25zLmhhbmRsZU9yaWdpbmFsU3BhY2UgPyBSRUdFWFBfU1BMSVRfU1BBQ0UgOiBSRUdFWFBfU1BMSVRfREVGQVVMVDtcclxuICAgICAgICAgICAgbGV0IGFyciA9IHRleHQuc3BsaXQocGF0dGVybik7XHJcbiAgICAgICAgICAgIGlmIChhcnIubGVuZ3RoID4gMSAmJiAhTE9PS0JFSElORF9TVVBQT1JURUQpIHtcclxuICAgICAgICAgICAgICAgIGxldCByZXN1bHQgPSBbXTtcclxuICAgICAgICAgICAgICAgIGFyci5mbGF0TWFwKChjdXIsIGksIHNyYykgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vICdTcGFjZXIg6Ze06ZqU5ZmoJz0+WydTcGFjZScsICdyICcsICfpl7TpmpTlmagnXT0+WydTcGFjZScsJ3InLCcgJywgJycsICfpl7TpmpTlmagnXVxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChjdXIgIT09IHVuZGVmaW5lZCAmJiBjdXIubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gY3VyLnNwbGl0KFJFR0VYUF9TUExJVF9FTkRfU1BBQ0UpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gW107XHJcbiAgICAgICAgICAgICAgICB9KS5mb3JFYWNoKChjdXIsIGksIHNyYykgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vICdTcGFjZXLpl7TpmpTlmagnPT5bJ1NwYWNlJywgJ3InLCAn6Ze06ZqU5ZmoJ109PlsnU3BhY2VyJywgJ+mXtOmalOWZqCddXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGN1ci5sZW5ndGggPT0gMSAmJiBpID4gMCAmJiAhL15bIF0qJC8udGVzdChjdXIpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBwcmV2ID0gc3JjW2kgLSAxXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFTcGFjZXIuZW5kc1dpdGhDSksocHJldikgJiYgIVNwYWNlci5zdGFydHNXaXRoQ0pLKGN1cilcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHx8ICFTcGFjZXIuZW5kc1dpdGhMYXRpbihwcmV2KSAmJiAhU3BhY2VyLnN0YXJ0c1dpdGhMYXRpbihjdXIpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXN1bHRbcmVzdWx0Lmxlbmd0aCAtIDFdICs9IGN1cjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICByZXN1bHQucHVzaChjdXIpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICBhcnIgPSByZXN1bHQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIGFyci5maWx0ZXIoKGN1ciwgaSwgc3JjKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAvLyBbJ1NwYWNlcicsJyAnLCAnJywgJ+mXtOmalOWZqCddPT5bJ1NwYWNlcicsJyAnLCAn6Ze06ZqU5ZmoJ11cclxuICAgICAgICAgICAgICAgIHJldHVybiBjdXIgIT09ICcnO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIFt0ZXh0XTtcclxuICAgIH1cclxuXHJcbiAgICByZXNvbHZlT3B0aW9ucyhvcHRpb25zKSB7XHJcbiAgICAgICAgcmV0dXJuIG9wdGlvbnMgPyBoYW5kbGVPcHRpb25zKG9wdGlvbnMpIDogdGhpcy5vcHRpb25zO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBlbmRzV2l0aENKS0FuZFNwYWNpbmcodGV4dCkge1xyXG4gICAgICAgIHJldHVybiBSRUdFWFBfRU5EU19XSVRIX0NKS19BTkRfU1BBQ0lORy50ZXN0KHRleHQpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBlbmRzV2l0aENKSyh0ZXh0KSB7XHJcbiAgICAgICAgcmV0dXJuIFJFR0VYUF9FTkRTX1dJVEhfQ0pLLnRlc3QodGV4dCk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGVuZHNXaXRoTGF0aW4odGV4dCkge1xyXG4gICAgICAgIHJldHVybiBSRUdFWFBfRU5EU19XSVRIX0xBVElOLnRlc3QodGV4dCk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIHN0YXJ0c1dpdGhDSksodGV4dCkge1xyXG4gICAgICAgIHJldHVybiBSRUdFWFBfU1RBUlRTX1dJVEhfQ0pLLnRlc3QodGV4dCk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIHN0YXJ0c1dpdGhMYXRpbih0ZXh0KSB7XHJcbiAgICAgICAgcmV0dXJuIFJFR0VYUF9TVEFSVFNfV0lUSF9MQVRJTi50ZXN0KHRleHQpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBlbmRzV2l0aExhdGluQW5kU3BhY2luZyh0ZXh0KSB7XHJcbiAgICAgICAgcmV0dXJuIFJFR0VYUF9FTkRTX1dJVEhfTEFUSU5fQU5EX1NQQUNJTkcudGVzdCh0ZXh0KTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgZW5kc1dpdGhTeW1ib2xzTmVlZFNwYWNlRm9sbG93ZWQodGV4dCkge1xyXG4gICAgICAgIHJldHVybiBSRUdFWFBfRU5EU19XSVRIX1NZTUJPTFNfTkVFRF9TUEFDRV9GT0xMT1dFRC50ZXN0KHRleHQpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBzdGFydHNXaXRoU3ltYm9sc05lZWRTcGFjZUZvbGxvd2VkKHRleHQpIHtcclxuICAgICAgICByZXR1cm4gUkVHRVhQX1NUQVJUU19XSVRIX1NZTUJPTFNfTkVFRF9TUEFDRV9GT0xMT1dFRC50ZXN0KHRleHQpO1xyXG4gICAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiB3cmFwT3B0aW9ucyhvcHRpb25zKSB7XHJcbiAgICByZXR1cm4gdHlwZW9mIG9wdGlvbnMgPT09ICdzdHJpbmcnID8ge3NwYWNpbmdDb250ZW50OiBvcHRpb25zfSA6IG9wdGlvbnM7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGhhbmRsZU9wdGlvbnMob3B0aW9ucykge1xyXG4gICAgb3B0aW9ucyA9IHdyYXBPcHRpb25zKG9wdGlvbnMpO1xyXG4gICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oe30sIERFRkFVTFRfT1BUSU9OUywgZGVmYXVsdE9wdGlvbnMsIG9wdGlvbnMpO1xyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBTcGFjZXI7IiwiaW1wb3J0IEJyb3dzZXJTcGFjZXIgZnJvbSAnLi9icm93c2VyLmpzJ1xyXG5cclxuLy8gQWRkIHN1cHBvcnQgZm9yIEFNRCAoQXN5bmNocm9ub3VzIE1vZHVsZSBEZWZpbml0aW9uKSBsaWJyYXJpZXMgc3VjaCBhcyByZXF1aXJlLmpzLlxyXG5pZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XHJcbiAgICBkZWZpbmUoW10sIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIFNwYWNlcjogQnJvd3NlclNwYWNlclxyXG4gICAgICAgIH1cclxuICAgIH0pXHJcbn1cclxuLy9BZGQgc3VwcG9ydCBmb3JtIENvbW1vbkpTIGxpYnJhcmllcyBzdWNoIGFzIGJyb3dzZXJpZnkuXHJcbmlmICh0eXBlb2YgZXhwb3J0cyAhPT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgIGV4cG9ydHMuU3BhY2VyID0gQnJvd3NlclNwYWNlcjtcclxufVxyXG4vL0RlZmluZSBnbG9iYWxseSBpbiBjYXNlIEFNRCBpcyBub3QgYXZhaWxhYmxlIG9yIHVudXNlZFxyXG5pZiAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgIHdpbmRvdy5TcGFjZXIgPSBCcm93c2VyU3BhY2VyO1xyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBCcm93c2VyU3BhY2VyOyJdfQ==
