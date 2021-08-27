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
var BLOCK_TAGS = /^(div|p|h1|h2|h3|h4|h5|h6|blockqoute|pre|textarea|nav|header|main|footer|section|sidbar|aside|table)$/i;
var SPACING_TAGS = /^(br|hr|img|video|audio)$/i;

var BrowserSpacer = function (_Spacer) {
    _inherits(BrowserSpacer, _Spacer);

    function BrowserSpacer(options) {
        _classCallCheck(this, BrowserSpacer);

        var _this = _possibleConstructorReturn(this, (BrowserSpacer.__proto__ || Object.getPrototypeOf(BrowserSpacer)).call(this, options));

        _this.options.spacingContent = _this.options.spacingContent.replace(' ', '&nbsp;');
        return _this;
    }

    _createClass(BrowserSpacer, [{
        key: 'spacePage',
        value: function spacePage(elements, options) {
            var _this2 = this;

            elements = typeof elements === 'string' ? document.querySelectorAll(elements) : elements || [document.childNodes[1]];
            options = this.resolveOptions(options);
            options.spacingContent = options.spacingContent.replace(' ', '&nbsp;');
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
            var spaceInnerHTML = optionsEffect.forceUnifiedSpacing ? optionsEffect.spacingContent : '';
            insertBefore(createNode(optionsEffect.wrapper.open + spaceInnerHTML + optionsEffect.wrapper.close), node);
        }
        if (optionsEffect.handleOriginalSpace && node.previousSibling.nodeType === Node.TEXT_NODE) {
            if (_core2.default.endsWithCJKAndSpacing(preText) && _core2.default.startsWithLatin(node.textContent) || _core2.default.endsWithLatinAndSpacing(preText) && _core2.default.startsWithCJK(node.textContent)) {
                var preEndSpacing = '';
                var arr = /(.*)([ ]+)$/g.match(node.previousSibling.data);
                node.previousSibling.data = arr[1];
                preEndSpacing = arr[2];
                var _spaceInnerHTML = optionsEffect.forceUnifiedSpacing ? optionsEffect.spacingContent : optionsEffect.keepOriginalSpace ? preEndSpacing : '';
                insertBefore(createNode(optionsEffect.wrapper.open + _spaceInnerHTML + optionsEffect.wrapper.close), node);
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
                if (isSpacing || i != 0 && !/^[ ]*$/.test(_arr[i - 1])) {
                    var _spaceInnerHTML2 = optionsEffect.forceUnifiedSpacing ? optionsEffect.spacingContent : isSpacing && optionsEffect.keepOriginalSpace ? _arr[i] : '';
                    insertBefore(createNode(optionsEffect.wrapper.open + _spaceInnerHTML2 + optionsEffect.wrapper.close), node);
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

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*
 * https://www.unicode.org/Public/5.0.0/ucd/Unihan.html
 */
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
 */
var CJK = '\u2E80-\u2FDF\u31C0-\uFE4F';
var SYMBOLS = '@&=_\$%\^\*\-+';
var LATIN = 'A-Za-z0-9\xC0-\xFF\u0100-\u017F\u0180-\u024F\u1E00-\u1EFF';
var ONE_OR_MORE_SPACE = '[ ]+';
var SYMBOLS_NEED_SPACE_FOLLOWED = '[\.:,?!]';
var ONE_AJK = '[' + CJK + ']';
var ONE_LATIN = '[' + LATIN + ']';
var ONE_LATIN_LIKE = '[' + LATIN + '%]';
var SPLIT_BEFORE_SPACE = '(?<=' + ONE_LATIN_LIKE + ')(?=[ ]*' + ONE_AJK + ')|(?<=' + ONE_AJK + ')(?=[ ]*' + ONE_LATIN_LIKE + ')';
var SPLIT_AFTER_SPACE = '(?<=' + ONE_AJK + '[ ]*)(?=' + ONE_LATIN_LIKE + ')|(?<=' + ONE_LATIN_LIKE + '[ ]*)(?=' + ONE_AJK + ')';
var SPLIT_SYMBOLS_NEED_SPACE_FOLLOWED = '(?<=' + SYMBOLS_NEED_SPACE_FOLLOWED + ')(?=' + ONE_AJK + '|' + ONE_LATIN + ')';
var REGEXP_ENDS_WITH_SYMBOLS_NEED_SPACE_FOLLOWED = new RegExp(SYMBOLS_NEED_SPACE_FOLLOWED + '$');
var REGEXP_ENDS_WITH_CJK_AND_SPACING = new RegExp('' + ONE_AJK + ONE_OR_MORE_SPACE + '$');
var REGEXP_ENDS_WITH_LATIN_AND_SPACING = new RegExp('' + ONE_LATIN_LIKE + ONE_OR_MORE_SPACE + '$');
var REGEXP_ENDS_WITH_CJK = new RegExp(ONE_AJK + '$');
var REGEXP_ENDS_WITH_LATIN = new RegExp(ONE_LATIN_LIKE + '$');
var REGEXP_STARTS_WITH_CJK = new RegExp('^' + ONE_AJK);
var REGEXP_STARTS_WITH_LATIN = new RegExp('^' + ONE_LATIN_LIKE);
var REGEXP_SPLIT_DEFAULT = new RegExp('(?<=' + ONE_LATIN_LIKE + ')(?=' + ONE_AJK + ')|(?<=' + ONE_AJK + ')(?=' + ONE_LATIN_LIKE + ')|' + SPLIT_SYMBOLS_NEED_SPACE_FOLLOWED, 'g');
var REGEXP_SPLIT_SPACE = new RegExp(SPLIT_BEFORE_SPACE + '|' + SPLIT_AFTER_SPACE + '|' + SPLIT_SYMBOLS_NEED_SPACE_FOLLOWED, 'g');

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
            if (options.wrapper) {
                var result = arr[0];
                for (var i = 1; i < arr.length - 1; i++) {
                    var open = /[ ]*/.test(arr[i + 1]);
                    var close = /[ ]*/.test(arr[i - 1]);
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
    }, {
        key: 'split',
        value: function split(text, options) {
            options = this.resolveOptions(options);
            if (typeof text === 'string') {
                var pattern = options.handleOriginalSpace ? REGEXP_SPLIT_SPACE : REGEXP_SPLIT_DEFAULT;
                return text.split(pattern);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJidWlsZC9hc3NldHMvanMvYnJvd3Nlci5qcyIsImJ1aWxkL2Fzc2V0cy9qcy9jb3JlLmpzIiwiYnVpbGQvYXNzZXRzL2pzL3NwYWNlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7O0FDQUE7Ozs7Ozs7Ozs7OztBQUVBLElBQU0sZUFBZSx3QkFBckI7QUFDQSxJQUFNLGFBQWEsd0dBQW5CO0FBQ0EsSUFBTSxlQUFlLDRCQUFyQjs7SUFFTSxhOzs7QUFFRiwyQkFBWSxPQUFaLEVBQXFCO0FBQUE7O0FBQUEsa0lBQ1gsT0FEVzs7QUFFakIsY0FBSyxPQUFMLENBQWEsY0FBYixHQUE4QixNQUFLLE9BQUwsQ0FBYSxjQUFiLENBQTRCLE9BQTVCLENBQW9DLEdBQXBDLEVBQXlDLFFBQXpDLENBQTlCO0FBRmlCO0FBR3BCOzs7O2tDQUVTLFEsRUFBVSxPLEVBQVM7QUFBQTs7QUFDekIsdUJBQVcsT0FBTyxRQUFQLEtBQW9CLFFBQXBCLEdBQStCLFNBQVMsZ0JBQVQsQ0FBMEIsUUFBMUIsQ0FBL0IsR0FBc0UsWUFBWSxDQUFDLFNBQVMsVUFBVCxDQUFvQixDQUFwQixDQUFELENBQTdGO0FBQ0Esc0JBQVUsS0FBSyxjQUFMLENBQW9CLE9BQXBCLENBQVY7QUFDQSxvQkFBUSxjQUFSLEdBQXlCLFFBQVEsY0FBUixDQUF1QixPQUF2QixDQUErQixHQUEvQixFQUFvQyxRQUFwQyxDQUF6QjtBQUNBLGVBQUcsT0FBSCxDQUFXLElBQVgsQ0FBZ0IsUUFBaEIsRUFBMEIsYUFBSztBQUMzQiwwQkFBVSxNQUFWLEVBQWdCLENBQWhCLEVBQW1CLE9BQW5CO0FBQ0gsYUFGRDtBQUdIOzs7O0VBZHVCLGM7O0FBaUI1QixTQUFTLFNBQVQsQ0FBbUIsTUFBbkIsRUFBMkIsSUFBM0IsRUFBaUMsT0FBakMsRUFBMEM7QUFDdEMsUUFBSSxLQUFLLE9BQUwsSUFBZ0IsYUFBYSxJQUFiLENBQWtCLEtBQUssT0FBdkIsQ0FBcEIsRUFBcUQ7QUFDakQ7QUFDSDtBQUNELFFBQUksbUJBQW1CLE9BQU8sTUFBUCxDQUFjLEVBQWQsRUFBa0IsT0FBbEIsRUFBMkIsRUFBQyxTQUFTLEtBQVYsRUFBM0IsQ0FBdkI7QUFDQSxRQUFJLCtCQUErQixPQUFPLE1BQVAsQ0FBYyxFQUFkLEVBQWtCLE9BQWxCLEVBQTJCO0FBQzFELGlCQUFTLEtBRGlEO0FBRTFELHdCQUFnQixRQUFRLGNBQVIsQ0FBdUIsT0FBdkIsQ0FBK0IsUUFBL0IsRUFBeUMsR0FBekM7QUFGMEMsS0FBM0IsQ0FBbkM7QUFJQSxRQUFJLGdCQUFnQixPQUFwQjtBQUNBLFFBQUksS0FBSyxVQUFMLElBQW1CLEtBQUssVUFBTCxDQUFnQixPQUFoQixLQUE0QixPQUFuRCxFQUE0RDtBQUN4RCx3QkFBZ0IsNEJBQWhCO0FBQ0g7QUFDRCxRQUFJLEtBQUssZUFBTCxLQUNJLENBQUMsS0FBSyxlQUFMLENBQXFCLE9BQXRCLElBQWtDLENBQUMsV0FBVyxJQUFYLENBQWdCLEtBQUssZUFBTCxDQUFxQixPQUFyQyxDQUFELElBQWtELENBQUMsYUFBYSxJQUFiLENBQWtCLEtBQUssZUFBTCxDQUFxQixPQUF2QyxDQUR6RixNQUVJLENBQUMsS0FBSyxPQUFOLElBQWtCLENBQUMsV0FBVyxJQUFYLENBQWdCLEtBQUssT0FBckIsQ0FBRCxJQUFrQyxDQUFDLGFBQWEsSUFBYixDQUFrQixLQUFLLE9BQXZCLENBRnpELENBQUosRUFFZ0c7QUFDNUYsWUFBSSxVQUFVLEtBQUssZUFBTCxDQUFxQixRQUFyQixLQUFrQyxLQUFLLFNBQXZDLEdBQW1ELEtBQUssZUFBTCxDQUFxQixJQUF4RSxHQUErRSxLQUFLLGVBQUwsQ0FBcUIsV0FBbEg7QUFDQSxZQUFJLENBQUMsZUFBTyxXQUFQLENBQW1CLE9BQW5CLEtBQStCLGVBQU8sZ0NBQVAsQ0FBd0MsT0FBeEMsQ0FBaEMsS0FBcUYsZUFBTyxlQUFQLENBQXVCLEtBQUssV0FBNUIsQ0FBckYsSUFDRyxDQUFDLGVBQU8sYUFBUCxDQUFxQixPQUFyQixLQUFpQyxlQUFPLGdDQUFQLENBQXdDLE9BQXhDLENBQWxDLEtBQXVGLGVBQU8sYUFBUCxDQUFxQixLQUFLLFdBQTFCLENBRDlGLEVBQ3NJO0FBQ2xJLGdCQUFJLGlCQUFpQixjQUFjLG1CQUFkLEdBQW9DLGNBQWMsY0FBbEQsR0FBbUUsRUFBeEY7QUFDQSx5QkFBYSxXQUFXLGNBQWMsT0FBZCxDQUFzQixJQUF0QixHQUE2QixjQUE3QixHQUE4QyxjQUFjLE9BQWQsQ0FBc0IsS0FBL0UsQ0FBYixFQUFvRyxJQUFwRztBQUNIO0FBQ0QsWUFBSSxjQUFjLG1CQUFkLElBQXFDLEtBQUssZUFBTCxDQUFxQixRQUFyQixLQUFrQyxLQUFLLFNBQWhGLEVBQTJGO0FBQ3ZGLGdCQUFJLGVBQU8scUJBQVAsQ0FBNkIsT0FBN0IsS0FBeUMsZUFBTyxlQUFQLENBQXVCLEtBQUssV0FBNUIsQ0FBekMsSUFDRyxlQUFPLHVCQUFQLENBQStCLE9BQS9CLEtBQTJDLGVBQU8sYUFBUCxDQUFxQixLQUFLLFdBQTFCLENBRGxELEVBQzBGO0FBQ3RGLG9CQUFJLGdCQUFnQixFQUFwQjtBQUNBLG9CQUFJLE1BQU0sZUFBZSxLQUFmLENBQXFCLEtBQUssZUFBTCxDQUFxQixJQUExQyxDQUFWO0FBQ0EscUJBQUssZUFBTCxDQUFxQixJQUFyQixHQUE0QixJQUFJLENBQUosQ0FBNUI7QUFDQSxnQ0FBZ0IsSUFBSSxDQUFKLENBQWhCO0FBQ0Esb0JBQUksa0JBQWlCLGNBQWMsbUJBQWQsR0FBb0MsY0FBYyxjQUFsRCxHQUFvRSxjQUFjLGlCQUFkLEdBQWtDLGFBQWxDLEdBQWtELEVBQTNJO0FBQ0EsNkJBQWEsV0FBVyxjQUFjLE9BQWQsQ0FBc0IsSUFBdEIsR0FBNkIsZUFBN0IsR0FBOEMsY0FBYyxPQUFkLENBQXNCLEtBQS9FLENBQWIsRUFBb0csSUFBcEc7QUFDSDtBQUNKO0FBQ0o7QUFDRCxRQUFJLEtBQUssUUFBTCxLQUFrQixLQUFLLFNBQTNCLEVBQXNDO0FBQ2xDLFlBQUksY0FBYyxPQUFsQixFQUEyQjtBQUN2QixnQkFBSSxPQUFNLE9BQU8sS0FBUCxDQUFhLEtBQUssSUFBbEIsRUFBd0IsYUFBeEIsQ0FBVjtBQUNBLGdCQUFJLEtBQUksTUFBSixJQUFjLENBQWxCLEVBQXFCO0FBQ2pCO0FBQ0g7QUFDRCxpQkFBSyxJQUFJLElBQUksQ0FBYixFQUFnQixJQUFJLEtBQUksTUFBeEIsRUFBZ0MsR0FBaEMsRUFBcUM7QUFDakMsb0JBQUksWUFBWSxTQUFTLElBQVQsQ0FBYyxLQUFJLENBQUosQ0FBZCxDQUFoQjtBQUNBLG9CQUFJLGFBQWMsS0FBSyxDQUFMLElBQVUsQ0FBQyxTQUFTLElBQVQsQ0FBYyxLQUFJLElBQUksQ0FBUixDQUFkLENBQTdCLEVBQXlEO0FBQ3JELHdCQUFJLG1CQUFpQixjQUFjLG1CQUFkLEdBQW9DLGNBQWMsY0FBbEQsR0FBb0UsYUFBYSxjQUFjLGlCQUE1QixHQUFpRCxLQUFJLENBQUosQ0FBakQsR0FBMEQsRUFBbEo7QUFDQSxpQ0FBYSxXQUFXLGNBQWMsT0FBZCxDQUFzQixJQUF0QixHQUE2QixnQkFBN0IsR0FBOEMsY0FBYyxPQUFkLENBQXNCLEtBQS9FLENBQWIsRUFBb0csSUFBcEc7QUFDSDtBQUNELG9CQUFJLENBQUMsU0FBTCxFQUFnQjtBQUNaLGlDQUFhLFNBQVMsY0FBVCxDQUF3QixLQUFJLENBQUosQ0FBeEIsQ0FBYixFQUE4QyxJQUE5QztBQUNIO0FBQ0o7QUFDRCxpQkFBSyxNQUFMO0FBQ0gsU0FoQkQsTUFnQk87QUFDSCxnQkFBSSxLQUFLLFVBQUwsQ0FBZ0IsT0FBaEIsS0FBNEIsT0FBaEMsRUFBeUM7QUFDckMsK0JBQWUsTUFBZixFQUF1QixJQUF2QixFQUE2QixNQUE3QixFQUFxQyw0QkFBckM7QUFDSCxhQUZELE1BRU87QUFDSCwrQkFBZSxNQUFmLEVBQXVCLElBQXZCLEVBQTZCLE1BQTdCLEVBQXFDLGdCQUFyQztBQUNIO0FBQ0o7QUFDRDtBQUNILEtBekJELE1BeUJPO0FBQ0g7QUFDQSx1QkFBZSxNQUFmLEVBQXVCLElBQXZCLEVBQTZCLE9BQTdCLEVBQXNDLDRCQUF0QztBQUNBLHVCQUFlLE1BQWYsRUFBdUIsSUFBdkIsRUFBNkIsS0FBN0IsRUFBb0MsNEJBQXBDO0FBQ0EsdUJBQWUsTUFBZixFQUF1QixJQUF2QixFQUE2QixPQUE3QixFQUFzQyw0QkFBdEM7QUFDQSx1QkFBZSxNQUFmLEVBQXVCLElBQXZCLEVBQTZCLGFBQTdCLEVBQTRDLDRCQUE1QztBQUNIO0FBQ0QsUUFBSSxLQUFLLFVBQVQsRUFBcUI7QUFDakIsWUFBSSxjQUFjLEVBQWxCO0FBQ0EsYUFBSyxVQUFMLENBQWdCLE9BQWhCLENBQXdCLGlCQUFTO0FBQzdCLHdCQUFZLElBQVosQ0FBaUIsS0FBakI7QUFDSCxTQUZEO0FBR0Esb0JBQVksT0FBWixDQUFvQixpQkFBUztBQUN6QixzQkFBVSxNQUFWLEVBQWtCLEtBQWxCLEVBQXlCLE9BQXpCO0FBQ0gsU0FGRDtBQUdIO0FBQ0o7O0FBRUQsU0FBUyxVQUFULENBQW9CLElBQXBCLEVBQTBCO0FBQ3RCLFFBQUksTUFBTSxTQUFTLGFBQVQsQ0FBdUIsS0FBdkIsQ0FBVjtBQUNBLFFBQUksU0FBSixHQUFnQixJQUFoQjtBQUNBLFdBQU8sSUFBSSxVQUFYO0FBQ0g7O0FBRUQsU0FBUyxZQUFULENBQXNCLE9BQXRCLEVBQStCLElBQS9CLEVBQXFDO0FBQ2pDLFFBQUksS0FBSyxPQUFMLEtBQWlCLE1BQWpCLElBQTJCLEtBQUssVUFBaEMsSUFBOEMsS0FBSyxVQUFMLENBQWdCLE9BQWhCLEtBQTRCLE1BQTlFLEVBQXNGO0FBQ2xGLGFBQUssVUFBTCxDQUFnQixZQUFoQixDQUE2QixPQUE3QixFQUFzQyxJQUF0QztBQUNIO0FBQ0o7O0FBRUQsU0FBUyxjQUFULENBQXdCLE1BQXhCLEVBQWdDLElBQWhDLEVBQXNDLElBQXRDLEVBQTRDLE9BQTVDLEVBQXFEO0FBQ2pELFFBQUksS0FBSyxJQUFMLENBQUosRUFBZ0I7QUFDWixZQUFJLFNBQVMsT0FBTyxLQUFQLENBQWEsS0FBSyxJQUFMLENBQWIsRUFBeUIsT0FBekIsQ0FBYjtBQUNBLFlBQUksS0FBSyxJQUFMLE1BQWUsTUFBbkIsRUFBMkI7QUFDdkIsaUJBQUssSUFBTCxJQUFhLE1BQWI7QUFDSDtBQUNKO0FBQ0o7O2tCQUVjLGE7Ozs7Ozs7Ozs7Ozs7QUN6SGY7OztBQUdBOzs7Ozs7Ozs7Ozs7OztBQWNBLElBQU0sTUFBTSw0QkFBWjtBQUNBLElBQU0sVUFBVSxnQkFBaEI7QUFDQSxJQUFNLFFBQVEsMkRBQWQ7QUFDQSxJQUFNLG9CQUFvQixNQUExQjtBQUNBLElBQU0sOEJBQThCLFVBQXBDO0FBQ0EsSUFBTSxnQkFBYyxHQUFkLE1BQU47QUFDQSxJQUFNLGtCQUFnQixLQUFoQixNQUFOO0FBQ0EsSUFBTSx1QkFBcUIsS0FBckIsT0FBTjtBQUNBLElBQU0sOEJBQTRCLGNBQTVCLGdCQUFxRCxPQUFyRCxjQUFxRSxPQUFyRSxnQkFBdUYsY0FBdkYsTUFBTjtBQUNBLElBQU0sNkJBQTJCLE9BQTNCLGdCQUE2QyxjQUE3QyxjQUFvRSxjQUFwRSxnQkFBNkYsT0FBN0YsTUFBTjtBQUNBLElBQU0sNkNBQTJDLDJCQUEzQyxZQUE2RSxPQUE3RSxTQUF3RixTQUF4RixNQUFOO0FBQ0EsSUFBTSwrQ0FBK0MsSUFBSSxNQUFKLENBQWMsMkJBQWQsT0FBckQ7QUFDQSxJQUFNLG1DQUFtQyxJQUFJLE1BQUosTUFBYyxPQUFkLEdBQXdCLGlCQUF4QixPQUF6QztBQUNBLElBQU0scUNBQXFDLElBQUksTUFBSixNQUFjLGNBQWQsR0FBK0IsaUJBQS9CLE9BQTNDO0FBQ0EsSUFBTSx1QkFBdUIsSUFBSSxNQUFKLENBQWMsT0FBZCxPQUE3QjtBQUNBLElBQU0seUJBQXlCLElBQUksTUFBSixDQUFjLGNBQWQsT0FBL0I7QUFDQSxJQUFNLHlCQUF5QixJQUFJLE1BQUosT0FBZSxPQUFmLENBQS9CO0FBQ0EsSUFBTSwyQkFBMkIsSUFBSSxNQUFKLE9BQWUsY0FBZixDQUFqQztBQUNBLElBQU0sdUJBQXVCLElBQUksTUFBSixVQUFrQixjQUFsQixZQUF1QyxPQUF2QyxjQUF1RCxPQUF2RCxZQUFxRSxjQUFyRSxVQUF3RixpQ0FBeEYsRUFBNkgsR0FBN0gsQ0FBN0I7QUFDQSxJQUFNLHFCQUFxQixJQUFJLE1BQUosQ0FBYyxrQkFBZCxTQUFvQyxpQkFBcEMsU0FBeUQsaUNBQXpELEVBQThGLEdBQTlGLENBQTNCOztBQUVBLElBQU0sa0JBQWtCO0FBQ3BCLG9CQUFnQjtBQURJLENBQXhCOztBQUlBLElBQUksaUJBQWlCLEVBQXJCOztJQUVNLE07QUFFRixvQkFBWSxPQUFaLEVBQXFCO0FBQUE7O0FBQ2pCLGFBQUssT0FBTCxHQUFlLGNBQWMsT0FBZCxDQUFmO0FBQ0g7Ozs7OEJBT0ssSSxFQUFNLE8sRUFBUztBQUNqQixnQkFBSSxNQUFNLEtBQUssS0FBTCxDQUFXLElBQVgsRUFBaUIsT0FBakIsQ0FBVjtBQUNBLHNCQUFVLEtBQUssY0FBTCxDQUFvQixPQUFwQixDQUFWO0FBQ0EsZ0JBQUksUUFBUSxPQUFaLEVBQXFCO0FBQ2pCLG9CQUFJLFNBQVMsSUFBSSxDQUFKLENBQWI7QUFDQSxxQkFBSyxJQUFJLElBQUksQ0FBYixFQUFnQixJQUFJLElBQUksTUFBSixHQUFhLENBQWpDLEVBQW9DLEdBQXBDLEVBQXlDO0FBQ3JDLHdCQUFJLE9BQU8sT0FBTyxJQUFQLENBQVksSUFBSSxJQUFJLENBQVIsQ0FBWixDQUFYO0FBQ0Esd0JBQUksUUFBUSxPQUFPLElBQVAsQ0FBWSxJQUFJLElBQUksQ0FBUixDQUFaLENBQVo7QUFDQSx3QkFBSSxJQUFKLEVBQVU7QUFDTixrQ0FBVSxRQUFRLE9BQVIsQ0FBZ0IsSUFBMUI7QUFDSDtBQUNELHdCQUFJLEtBQUosRUFBVztBQUNQLGtDQUFVLFFBQVEsT0FBUixDQUFnQixLQUExQjtBQUNIO0FBQ0Qsd0JBQUksQ0FBQyxJQUFELElBQVMsQ0FBQyxLQUFkLEVBQXFCO0FBQ2pCLGtDQUFVLFFBQVEsT0FBUixDQUFnQixJQUFoQixHQUF1QixRQUFRLE9BQVIsQ0FBZ0IsS0FBakQ7QUFDSDtBQUNKO0FBQ0osYUFmRCxNQWVPO0FBQ0gsdUJBQU8sSUFBSSxJQUFKLENBQVMsUUFBUSxjQUFqQixDQUFQO0FBQ0g7QUFDSjs7OzhCQUVLLEksRUFBTSxPLEVBQVM7QUFDakIsc0JBQVUsS0FBSyxjQUFMLENBQW9CLE9BQXBCLENBQVY7QUFDQSxnQkFBSSxPQUFPLElBQVAsS0FBZ0IsUUFBcEIsRUFBOEI7QUFDMUIsb0JBQUksVUFBVSxRQUFRLG1CQUFSLEdBQThCLGtCQUE5QixHQUFtRCxvQkFBakU7QUFDQSx1QkFBTyxLQUFLLEtBQUwsQ0FBVyxPQUFYLENBQVA7QUFDSDtBQUNELG1CQUFPLENBQUMsSUFBRCxDQUFQO0FBQ0g7Ozt1Q0FFYyxPLEVBQVM7QUFDcEIsbUJBQU8sVUFBVSxjQUFjLE9BQWQsQ0FBVixHQUFtQyxLQUFLLE9BQS9DO0FBQ0g7OzsrQkF2Q2EsTyxFQUFTO0FBQ25CLHNCQUFVLFlBQVksT0FBWixDQUFWO0FBQ0EsbUJBQU8sTUFBUCxDQUFjLGNBQWQsRUFBOEIsZUFBOUIsRUFBK0MsT0FBL0M7QUFDSDs7OzhDQXNDNEIsSSxFQUFNO0FBQy9CLG1CQUFPLGlDQUFpQyxJQUFqQyxDQUFzQyxJQUF0QyxDQUFQO0FBQ0g7OztvQ0FFa0IsSSxFQUFLO0FBQ3BCLG1CQUFPLHFCQUFxQixJQUFyQixDQUEwQixJQUExQixDQUFQO0FBQ0g7OztzQ0FFb0IsSSxFQUFLO0FBQ3RCLG1CQUFPLHVCQUF1QixJQUF2QixDQUE0QixJQUE1QixDQUFQO0FBQ0g7OztzQ0FFb0IsSSxFQUFLO0FBQ3RCLG1CQUFPLHVCQUF1QixJQUF2QixDQUE0QixJQUE1QixDQUFQO0FBQ0g7Ozt3Q0FFc0IsSSxFQUFLO0FBQ3hCLG1CQUFPLHlCQUF5QixJQUF6QixDQUE4QixJQUE5QixDQUFQO0FBQ0g7OztnREFFOEIsSSxFQUFNO0FBQ2pDLG1CQUFPLG1DQUFtQyxJQUFuQyxDQUF3QyxJQUF4QyxDQUFQO0FBQ0g7Ozt5REFFdUMsSSxFQUFLO0FBQ3pDLG1CQUFPLDZDQUE2QyxJQUE3QyxDQUFrRCxJQUFsRCxDQUFQO0FBQ0g7Ozs7OztBQUdMLFNBQVMsV0FBVCxDQUFxQixPQUFyQixFQUE4QjtBQUMxQixXQUFPLE9BQU8sT0FBUCxLQUFtQixRQUFuQixHQUE4QixFQUFDLGdCQUFnQixPQUFqQixFQUE5QixHQUEwRCxPQUFqRTtBQUNIOztBQUVELFNBQVMsYUFBVCxDQUF1QixPQUF2QixFQUFnQztBQUM1QixjQUFVLFlBQVksT0FBWixDQUFWO0FBQ0EsV0FBTyxPQUFPLE1BQVAsQ0FBYyxFQUFkLEVBQWtCLGVBQWxCLEVBQW1DLGNBQW5DLEVBQW1ELE9BQW5ELENBQVA7QUFDSDs7a0JBRWMsTTs7Ozs7Ozs7O0FDaklmOzs7Ozs7QUFFQTtBQUNBLElBQUksT0FBTyxNQUFQLEtBQWtCLFVBQWxCLElBQWdDLE9BQU8sR0FBM0MsRUFBZ0Q7QUFDNUMsV0FBTyxFQUFQLEVBQVcsWUFBVztBQUNsQixlQUFPO0FBQ0gsb0JBQVE7QUFETCxTQUFQO0FBR0gsS0FKRDtBQUtIO0FBQ0Q7QUFDQSxJQUFJLE9BQU8sT0FBUCxLQUFtQixXQUF2QixFQUFvQztBQUNoQyxZQUFRLE1BQVIsR0FBaUIsaUJBQWpCO0FBQ0g7QUFDRDtBQUNBLElBQUksT0FBTyxNQUFQLEtBQWtCLFdBQXRCLEVBQW1DO0FBQy9CLFdBQU8sTUFBUCxHQUFnQixpQkFBaEI7QUFDSDs7a0JBRWMsaUIiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJpbXBvcnQgU3BhY2VyIGZyb20gJy4vY29yZS5qcydcclxuXHJcbmNvbnN0IElHTk9SRURfVEFHUyA9IC9eKHNjcmlwdHxsaW5rfHN0eWxlKSQvaTtcclxuY29uc3QgQkxPQ0tfVEFHUyA9IC9eKGRpdnxwfGgxfGgyfGgzfGg0fGg1fGg2fGJsb2NrcW91dGV8cHJlfHRleHRhcmVhfG5hdnxoZWFkZXJ8bWFpbnxmb290ZXJ8c2VjdGlvbnxzaWRiYXJ8YXNpZGV8dGFibGUpJC9pO1xyXG5jb25zdCBTUEFDSU5HX1RBR1MgPSAvXihicnxocnxpbWd8dmlkZW98YXVkaW8pJC9pO1xyXG5cclxuY2xhc3MgQnJvd3NlclNwYWNlciBleHRlbmRzIFNwYWNlciB7XHJcblxyXG4gICAgY29uc3RydWN0b3Iob3B0aW9ucykge1xyXG4gICAgICAgIHN1cGVyKG9wdGlvbnMpO1xyXG4gICAgICAgIHRoaXMub3B0aW9ucy5zcGFjaW5nQ29udGVudCA9IHRoaXMub3B0aW9ucy5zcGFjaW5nQ29udGVudC5yZXBsYWNlKCcgJywgJyZuYnNwOycpO1xyXG4gICAgfVxyXG5cclxuICAgIHNwYWNlUGFnZShlbGVtZW50cywgb3B0aW9ucykge1xyXG4gICAgICAgIGVsZW1lbnRzID0gdHlwZW9mIGVsZW1lbnRzID09PSAnc3RyaW5nJyA/IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoZWxlbWVudHMpIDogKGVsZW1lbnRzIHx8IFtkb2N1bWVudC5jaGlsZE5vZGVzWzFdXSk7XHJcbiAgICAgICAgb3B0aW9ucyA9IHRoaXMucmVzb2x2ZU9wdGlvbnMob3B0aW9ucyk7XHJcbiAgICAgICAgb3B0aW9ucy5zcGFjaW5nQ29udGVudCA9IG9wdGlvbnMuc3BhY2luZ0NvbnRlbnQucmVwbGFjZSgnICcsICcmbmJzcDsnKTtcclxuICAgICAgICBbXS5mb3JFYWNoLmNhbGwoZWxlbWVudHMsIGUgPT4ge1xyXG4gICAgICAgICAgICBzcGFjZU5vZGUodGhpcywgZSwgb3B0aW9ucyk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHNwYWNlTm9kZShzcGFjZXIsIG5vZGUsIG9wdGlvbnMpIHtcclxuICAgIGlmIChub2RlLnRhZ05hbWUgJiYgSUdOT1JFRF9UQUdTLnRlc3Qobm9kZS50YWdOYW1lKSkge1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIGxldCBvcHRpb25zTm9XcmFwcGVyID0gT2JqZWN0LmFzc2lnbih7fSwgb3B0aW9ucywge3dyYXBwZXI6IGZhbHNlfSk7XHJcbiAgICBsZXQgb3B0aW9uc05vV3JhcHBlck5vSFRNTEVudGl0eSA9IE9iamVjdC5hc3NpZ24oe30sIG9wdGlvbnMsIHtcclxuICAgICAgICB3cmFwcGVyOiBmYWxzZSxcclxuICAgICAgICBzcGFjaW5nQ29udGVudDogb3B0aW9ucy5zcGFjaW5nQ29udGVudC5yZXBsYWNlKCcmbmJzcDsnLCAnICcpXHJcbiAgICB9KTtcclxuICAgIGxldCBvcHRpb25zRWZmZWN0ID0gb3B0aW9ucztcclxuICAgIGlmIChub2RlLnBhcmVudE5vZGUgJiYgbm9kZS5wYXJlbnROb2RlLnRhZ05hbWUgPT09ICdUSVRMRScpIHtcclxuICAgICAgICBvcHRpb25zRWZmZWN0ID0gb3B0aW9uc05vV3JhcHBlck5vSFRNTEVudGl0eTtcclxuICAgIH1cclxuICAgIGlmIChub2RlLnByZXZpb3VzU2libGluZ1xyXG4gICAgICAgICYmICghbm9kZS5wcmV2aW91c1NpYmxpbmcudGFnTmFtZSB8fCAoIUJMT0NLX1RBR1MudGVzdChub2RlLnByZXZpb3VzU2libGluZy50YWdOYW1lKSAmJiAhU1BBQ0lOR19UQUdTLnRlc3Qobm9kZS5wcmV2aW91c1NpYmxpbmcudGFnTmFtZSkpKVxyXG4gICAgICAgICYmICghbm9kZS50YWdOYW1lIHx8ICghQkxPQ0tfVEFHUy50ZXN0KG5vZGUudGFnTmFtZSkgJiYgIVNQQUNJTkdfVEFHUy50ZXN0KG5vZGUudGFnTmFtZSkpKSkge1xyXG4gICAgICAgIGxldCBwcmVUZXh0ID0gbm9kZS5wcmV2aW91c1NpYmxpbmcubm9kZVR5cGUgPT09IE5vZGUuVEVYVF9OT0RFID8gbm9kZS5wcmV2aW91c1NpYmxpbmcuZGF0YSA6IG5vZGUucHJldmlvdXNTaWJsaW5nLnRleHRDb250ZW50O1xyXG4gICAgICAgIGlmICgoU3BhY2VyLmVuZHNXaXRoQ0pLKHByZVRleHQpIHx8IFNwYWNlci5lbmRzV2l0aFN5bWJvbHNOZWVkU3BhY2VGb2xsb3dlZChwcmVUZXh0KSkgJiYgU3BhY2VyLnN0YXJ0c1dpdGhMYXRpbihub2RlLnRleHRDb250ZW50KVxyXG4gICAgICAgICAgICB8fCAoU3BhY2VyLmVuZHNXaXRoTGF0aW4ocHJlVGV4dCkgfHwgU3BhY2VyLmVuZHNXaXRoU3ltYm9sc05lZWRTcGFjZUZvbGxvd2VkKHByZVRleHQpKSAmJiBTcGFjZXIuc3RhcnRzV2l0aENKSyhub2RlLnRleHRDb250ZW50KSkge1xyXG4gICAgICAgICAgICBsZXQgc3BhY2VJbm5lckhUTUwgPSBvcHRpb25zRWZmZWN0LmZvcmNlVW5pZmllZFNwYWNpbmcgPyBvcHRpb25zRWZmZWN0LnNwYWNpbmdDb250ZW50IDogJyc7XHJcbiAgICAgICAgICAgIGluc2VydEJlZm9yZShjcmVhdGVOb2RlKG9wdGlvbnNFZmZlY3Qud3JhcHBlci5vcGVuICsgc3BhY2VJbm5lckhUTUwgKyBvcHRpb25zRWZmZWN0LndyYXBwZXIuY2xvc2UpLCBub2RlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKG9wdGlvbnNFZmZlY3QuaGFuZGxlT3JpZ2luYWxTcGFjZSAmJiBub2RlLnByZXZpb3VzU2libGluZy5ub2RlVHlwZSA9PT0gTm9kZS5URVhUX05PREUpIHtcclxuICAgICAgICAgICAgaWYgKFNwYWNlci5lbmRzV2l0aENKS0FuZFNwYWNpbmcocHJlVGV4dCkgJiYgU3BhY2VyLnN0YXJ0c1dpdGhMYXRpbihub2RlLnRleHRDb250ZW50KVxyXG4gICAgICAgICAgICAgICAgfHwgU3BhY2VyLmVuZHNXaXRoTGF0aW5BbmRTcGFjaW5nKHByZVRleHQpICYmIFNwYWNlci5zdGFydHNXaXRoQ0pLKG5vZGUudGV4dENvbnRlbnQpKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgcHJlRW5kU3BhY2luZyA9ICcnO1xyXG4gICAgICAgICAgICAgICAgbGV0IGFyciA9IC8oLiopKFsgXSspJC9nLm1hdGNoKG5vZGUucHJldmlvdXNTaWJsaW5nLmRhdGEpO1xyXG4gICAgICAgICAgICAgICAgbm9kZS5wcmV2aW91c1NpYmxpbmcuZGF0YSA9IGFyclsxXTtcclxuICAgICAgICAgICAgICAgIHByZUVuZFNwYWNpbmcgPSBhcnJbMl07XHJcbiAgICAgICAgICAgICAgICBsZXQgc3BhY2VJbm5lckhUTUwgPSBvcHRpb25zRWZmZWN0LmZvcmNlVW5pZmllZFNwYWNpbmcgPyBvcHRpb25zRWZmZWN0LnNwYWNpbmdDb250ZW50IDogKG9wdGlvbnNFZmZlY3Qua2VlcE9yaWdpbmFsU3BhY2UgPyBwcmVFbmRTcGFjaW5nIDogJycpO1xyXG4gICAgICAgICAgICAgICAgaW5zZXJ0QmVmb3JlKGNyZWF0ZU5vZGUob3B0aW9uc0VmZmVjdC53cmFwcGVyLm9wZW4gKyBzcGFjZUlubmVySFRNTCArIG9wdGlvbnNFZmZlY3Qud3JhcHBlci5jbG9zZSksIG5vZGUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgaWYgKG5vZGUubm9kZVR5cGUgPT09IE5vZGUuVEVYVF9OT0RFKSB7XHJcbiAgICAgICAgaWYgKG9wdGlvbnNFZmZlY3Qud3JhcHBlcikge1xyXG4gICAgICAgICAgICBsZXQgYXJyID0gc3BhY2VyLnNwbGl0KG5vZGUuZGF0YSwgb3B0aW9uc0VmZmVjdCk7XHJcbiAgICAgICAgICAgIGlmIChhcnIubGVuZ3RoID09IDEpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGFyci5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgbGV0IGlzU3BhY2luZyA9IC9eWyBdKiQvLnRlc3QoYXJyW2ldKTtcclxuICAgICAgICAgICAgICAgIGlmIChpc1NwYWNpbmcgfHwgKGkgIT0gMCAmJiAhL15bIF0qJC8udGVzdChhcnJbaSAtIDFdKSkpIHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgc3BhY2VJbm5lckhUTUwgPSBvcHRpb25zRWZmZWN0LmZvcmNlVW5pZmllZFNwYWNpbmcgPyBvcHRpb25zRWZmZWN0LnNwYWNpbmdDb250ZW50IDogKGlzU3BhY2luZyAmJiBvcHRpb25zRWZmZWN0LmtlZXBPcmlnaW5hbFNwYWNlKSA/IGFycltpXSA6ICcnO1xyXG4gICAgICAgICAgICAgICAgICAgIGluc2VydEJlZm9yZShjcmVhdGVOb2RlKG9wdGlvbnNFZmZlY3Qud3JhcHBlci5vcGVuICsgc3BhY2VJbm5lckhUTUwgKyBvcHRpb25zRWZmZWN0LndyYXBwZXIuY2xvc2UpLCBub2RlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmICghaXNTcGFjaW5nKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaW5zZXJ0QmVmb3JlKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGFycltpXSksIG5vZGUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIG5vZGUucmVtb3ZlKCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgaWYgKG5vZGUucGFyZW50Tm9kZS50YWdOYW1lID09PSAnVElUTEUnKSB7XHJcbiAgICAgICAgICAgICAgICBzcGFjZUF0dHJpYnV0ZShzcGFjZXIsIG5vZGUsICdkYXRhJywgb3B0aW9uc05vV3JhcHBlck5vSFRNTEVudGl0eSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBzcGFjZUF0dHJpYnV0ZShzcGFjZXIsIG5vZGUsICdkYXRhJywgb3B0aW9uc05vV3JhcHBlcik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICAvLyB0YWcgbmFtZSBmaWx0ZXJcclxuICAgICAgICBzcGFjZUF0dHJpYnV0ZShzcGFjZXIsIG5vZGUsICd0aXRsZScsIG9wdGlvbnNOb1dyYXBwZXJOb0hUTUxFbnRpdHkpO1xyXG4gICAgICAgIHNwYWNlQXR0cmlidXRlKHNwYWNlciwgbm9kZSwgJ2FsdCcsIG9wdGlvbnNOb1dyYXBwZXJOb0hUTUxFbnRpdHkpO1xyXG4gICAgICAgIHNwYWNlQXR0cmlidXRlKHNwYWNlciwgbm9kZSwgJ2xhYmVsJywgb3B0aW9uc05vV3JhcHBlck5vSFRNTEVudGl0eSk7XHJcbiAgICAgICAgc3BhY2VBdHRyaWJ1dGUoc3BhY2VyLCBub2RlLCAncGxhY2Vob2xkZXInLCBvcHRpb25zTm9XcmFwcGVyTm9IVE1MRW50aXR5KTtcclxuICAgIH1cclxuICAgIGlmIChub2RlLmNoaWxkTm9kZXMpIHtcclxuICAgICAgICBsZXQgc3RhdGljTm9kZXMgPSBbXTtcclxuICAgICAgICBub2RlLmNoaWxkTm9kZXMuZm9yRWFjaChjaGlsZCA9PiB7XHJcbiAgICAgICAgICAgIHN0YXRpY05vZGVzLnB1c2goY2hpbGQpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHN0YXRpY05vZGVzLmZvckVhY2goY2hpbGQgPT4ge1xyXG4gICAgICAgICAgICBzcGFjZU5vZGUoc3BhY2VyLCBjaGlsZCwgb3B0aW9ucyk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNyZWF0ZU5vZGUoaHRtbCkge1xyXG4gICAgbGV0IGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgZGl2LmlubmVySFRNTCA9IGh0bWw7XHJcbiAgICByZXR1cm4gZGl2LmZpcnN0Q2hpbGQ7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGluc2VydEJlZm9yZShuZXdOb2RlLCBub2RlKSB7XHJcbiAgICBpZiAobm9kZS50YWdOYW1lICE9PSAnSFRNTCcgJiYgbm9kZS5wYXJlbnROb2RlICYmIG5vZGUucGFyZW50Tm9kZS50YWdOYW1lICE9PSAnSFRNTCcpIHtcclxuICAgICAgICBub2RlLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKG5ld05vZGUsIG5vZGUpO1xyXG4gICAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBzcGFjZUF0dHJpYnV0ZShzcGFjZXIsIG5vZGUsIGF0dHIsIG9wdGlvbnMpIHtcclxuICAgIGlmIChub2RlW2F0dHJdKSB7XHJcbiAgICAgICAgbGV0IHJlc3VsdCA9IHNwYWNlci5zcGFjZShub2RlW2F0dHJdLCBvcHRpb25zKTtcclxuICAgICAgICBpZiAobm9kZVthdHRyXSAhPT0gcmVzdWx0KSB7XHJcbiAgICAgICAgICAgIG5vZGVbYXR0cl0gPSByZXN1bHQ7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBCcm93c2VyU3BhY2VyOyIsIi8qXHJcbiAqIGh0dHBzOi8vd3d3LnVuaWNvZGUub3JnL1B1YmxpYy81LjAuMC91Y2QvVW5paGFuLmh0bWxcclxuICovXHJcbi8qXHJcbiAqIFxcdTJFODAtXFx1MkVGRiAgICBDSksg6YOo6aaWXHJcbiAqIFxcdTJGMDAtXFx1MkZERiAgICDlurfnhpnlrZflhbjpg6jpppZcclxuICogXFx1MzAwMC1cXHUzMDNGICAgIENKSyDnrKblj7flkozmoIfngrlcclxuICogXFx1MzFDMC1cXHUzMUVGICAgIENKSyDnrJTnlLtcclxuICogXFx1MzIwMC1cXHUzMkZGICAgIOWwgemXreW8jyBDSksg5paH5a2X5ZKM5pyI5Lu9XHJcbiAqIFxcdTMzMDAtXFx1MzNGRiAgICBDSksg5YW85a65XHJcbiAqIFxcdTM0MDAtXFx1NERCRiAgICBDSksg57uf5LiA6KGo5oSP56ym5Y+35omp5bGVIEFcclxuICogXFx1NERDMC1cXHU0REZGICAgIOaYk+e7j+WFreWNgeWbm+WNpuespuWPt1xyXG4gKiBcXHU0RTAwLVxcdTlGQkYgICAgQ0pLIOe7n+S4gOihqOaEj+espuWPt1xyXG4gKiBcXHVGOTAwLVxcdUZBRkYgICAgQ0pLIOWFvOWuueixoeW9ouaWh+Wtl1xyXG4gKiBcXHVGRTMwLVxcdUZFNEYgICAgQ0pLIOWFvOWuueW9ouW8j1xyXG4gKiBcXHVGRjAwLVxcdUZGRUYgICAg5YWo6KeSQVNDSUnjgIHlhajop5LmoIfngrlcclxuICovXHJcbmNvbnN0IENKSyA9ICdcXHUyRTgwLVxcdTJGREZcXHUzMUMwLVxcdUZFNEYnO1xyXG5jb25zdCBTWU1CT0xTID0gJ0AmPV9cXCQlXFxeXFwqXFwtKyc7XHJcbmNvbnN0IExBVElOID0gJ0EtWmEtejAtOVxcdTAwQzAtXFx1MDBGRlxcdTAxMDAtXFx1MDE3RlxcdTAxODAtXFx1MDI0RlxcdTFFMDAtXFx1MUVGRic7XHJcbmNvbnN0IE9ORV9PUl9NT1JFX1NQQUNFID0gJ1sgXSsnO1xyXG5jb25zdCBTWU1CT0xTX05FRURfU1BBQ0VfRk9MTE9XRUQgPSAnW1xcLjosPyFdJztcclxuY29uc3QgT05FX0FKSyA9IGBbJHtDSkt9XWA7XHJcbmNvbnN0IE9ORV9MQVRJTiA9IGBbJHtMQVRJTn1dYDtcclxuY29uc3QgT05FX0xBVElOX0xJS0UgPSBgWyR7TEFUSU59JV1gO1xyXG5jb25zdCBTUExJVF9CRUZPUkVfU1BBQ0UgPSBgKD88PSR7T05FX0xBVElOX0xJS0V9KSg/PVsgXSoke09ORV9BSkt9KXwoPzw9JHtPTkVfQUpLfSkoPz1bIF0qJHtPTkVfTEFUSU5fTElLRX0pYDtcclxuY29uc3QgU1BMSVRfQUZURVJfU1BBQ0UgPSBgKD88PSR7T05FX0FKS31bIF0qKSg/PSR7T05FX0xBVElOX0xJS0V9KXwoPzw9JHtPTkVfTEFUSU5fTElLRX1bIF0qKSg/PSR7T05FX0FKS30pYDtcclxuY29uc3QgU1BMSVRfU1lNQk9MU19ORUVEX1NQQUNFX0ZPTExPV0VEID0gYCg/PD0ke1NZTUJPTFNfTkVFRF9TUEFDRV9GT0xMT1dFRH0pKD89JHtPTkVfQUpLfXwke09ORV9MQVRJTn0pYDtcclxuY29uc3QgUkVHRVhQX0VORFNfV0lUSF9TWU1CT0xTX05FRURfU1BBQ0VfRk9MTE9XRUQgPSBuZXcgUmVnRXhwKGAke1NZTUJPTFNfTkVFRF9TUEFDRV9GT0xMT1dFRH0kYCk7XHJcbmNvbnN0IFJFR0VYUF9FTkRTX1dJVEhfQ0pLX0FORF9TUEFDSU5HID0gbmV3IFJlZ0V4cChgJHtPTkVfQUpLfSR7T05FX09SX01PUkVfU1BBQ0V9JGApO1xyXG5jb25zdCBSRUdFWFBfRU5EU19XSVRIX0xBVElOX0FORF9TUEFDSU5HID0gbmV3IFJlZ0V4cChgJHtPTkVfTEFUSU5fTElLRX0ke09ORV9PUl9NT1JFX1NQQUNFfSRgKTtcclxuY29uc3QgUkVHRVhQX0VORFNfV0lUSF9DSksgPSBuZXcgUmVnRXhwKGAke09ORV9BSkt9JGApO1xyXG5jb25zdCBSRUdFWFBfRU5EU19XSVRIX0xBVElOID0gbmV3IFJlZ0V4cChgJHtPTkVfTEFUSU5fTElLRX0kYCk7XHJcbmNvbnN0IFJFR0VYUF9TVEFSVFNfV0lUSF9DSksgPSBuZXcgUmVnRXhwKGBeJHtPTkVfQUpLfWApO1xyXG5jb25zdCBSRUdFWFBfU1RBUlRTX1dJVEhfTEFUSU4gPSBuZXcgUmVnRXhwKGBeJHtPTkVfTEFUSU5fTElLRX1gKTtcclxuY29uc3QgUkVHRVhQX1NQTElUX0RFRkFVTFQgPSBuZXcgUmVnRXhwKGAoPzw9JHtPTkVfTEFUSU5fTElLRX0pKD89JHtPTkVfQUpLfSl8KD88PSR7T05FX0FKS30pKD89JHtPTkVfTEFUSU5fTElLRX0pfCR7U1BMSVRfU1lNQk9MU19ORUVEX1NQQUNFX0ZPTExPV0VEfWAsICdnJyk7XHJcbmNvbnN0IFJFR0VYUF9TUExJVF9TUEFDRSA9IG5ldyBSZWdFeHAoYCR7U1BMSVRfQkVGT1JFX1NQQUNFfXwke1NQTElUX0FGVEVSX1NQQUNFfXwke1NQTElUX1NZTUJPTFNfTkVFRF9TUEFDRV9GT0xMT1dFRH1gLCAnZycpO1xyXG5cclxuY29uc3QgREVGQVVMVF9PUFRJT05TID0ge1xyXG4gICAgc3BhY2luZ0NvbnRlbnQ6ICcgJ1xyXG59O1xyXG5cclxubGV0IGRlZmF1bHRPcHRpb25zID0ge307XHJcblxyXG5jbGFzcyBTcGFjZXIge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcclxuICAgICAgICB0aGlzLm9wdGlvbnMgPSBoYW5kbGVPcHRpb25zKG9wdGlvbnMpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBjb25maWcob3B0aW9ucykge1xyXG4gICAgICAgIG9wdGlvbnMgPSB3cmFwT3B0aW9ucyhvcHRpb25zKTtcclxuICAgICAgICBPYmplY3QuYXNzaWduKGRlZmF1bHRPcHRpb25zLCBERUZBVUxUX09QVElPTlMsIG9wdGlvbnMpO1xyXG4gICAgfVxyXG5cclxuICAgIHNwYWNlKHRleHQsIG9wdGlvbnMpIHtcclxuICAgICAgICBsZXQgYXJyID0gdGhpcy5zcGxpdCh0ZXh0LCBvcHRpb25zKTtcclxuICAgICAgICBvcHRpb25zID0gdGhpcy5yZXNvbHZlT3B0aW9ucyhvcHRpb25zKTtcclxuICAgICAgICBpZiAob3B0aW9ucy53cmFwcGVyKSB7XHJcbiAgICAgICAgICAgIGxldCByZXN1bHQgPSBhcnJbMF07XHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAxOyBpIDwgYXJyLmxlbmd0aCAtIDE7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgbGV0IG9wZW4gPSAvWyBdKi8udGVzdChhcnJbaSArIDFdKTtcclxuICAgICAgICAgICAgICAgIGxldCBjbG9zZSA9IC9bIF0qLy50ZXN0KGFycltpIC0gMV0pO1xyXG4gICAgICAgICAgICAgICAgaWYgKG9wZW4pIHtcclxuICAgICAgICAgICAgICAgICAgICByZXN1bHQgKz0gb3B0aW9ucy53cmFwcGVyLm9wZW47XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAoY2xvc2UpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXN1bHQgKz0gb3B0aW9ucy53cmFwcGVyLmNsb3NlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKCFvcGVuICYmICFjbG9zZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdCArPSBvcHRpb25zLndyYXBwZXIub3BlbiArIG9wdGlvbnMud3JhcHBlci5jbG9zZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiBhcnIuam9pbihvcHRpb25zLnNwYWNpbmdDb250ZW50KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgc3BsaXQodGV4dCwgb3B0aW9ucykge1xyXG4gICAgICAgIG9wdGlvbnMgPSB0aGlzLnJlc29sdmVPcHRpb25zKG9wdGlvbnMpO1xyXG4gICAgICAgIGlmICh0eXBlb2YgdGV4dCA9PT0gJ3N0cmluZycpIHtcclxuICAgICAgICAgICAgbGV0IHBhdHRlcm4gPSBvcHRpb25zLmhhbmRsZU9yaWdpbmFsU3BhY2UgPyBSRUdFWFBfU1BMSVRfU1BBQ0UgOiBSRUdFWFBfU1BMSVRfREVGQVVMVDtcclxuICAgICAgICAgICAgcmV0dXJuIHRleHQuc3BsaXQocGF0dGVybik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBbdGV4dF07XHJcbiAgICB9XHJcblxyXG4gICAgcmVzb2x2ZU9wdGlvbnMob3B0aW9ucykge1xyXG4gICAgICAgIHJldHVybiBvcHRpb25zID8gaGFuZGxlT3B0aW9ucyhvcHRpb25zKSA6IHRoaXMub3B0aW9ucztcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgZW5kc1dpdGhDSktBbmRTcGFjaW5nKHRleHQpIHtcclxuICAgICAgICByZXR1cm4gUkVHRVhQX0VORFNfV0lUSF9DSktfQU5EX1NQQUNJTkcudGVzdCh0ZXh0KTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgZW5kc1dpdGhDSksodGV4dCl7XHJcbiAgICAgICAgcmV0dXJuIFJFR0VYUF9FTkRTX1dJVEhfQ0pLLnRlc3QodGV4dCk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGVuZHNXaXRoTGF0aW4odGV4dCl7XHJcbiAgICAgICAgcmV0dXJuIFJFR0VYUF9FTkRTX1dJVEhfTEFUSU4udGVzdCh0ZXh0KTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgc3RhcnRzV2l0aENKSyh0ZXh0KXtcclxuICAgICAgICByZXR1cm4gUkVHRVhQX1NUQVJUU19XSVRIX0NKSy50ZXN0KHRleHQpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBzdGFydHNXaXRoTGF0aW4odGV4dCl7XHJcbiAgICAgICAgcmV0dXJuIFJFR0VYUF9TVEFSVFNfV0lUSF9MQVRJTi50ZXN0KHRleHQpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBlbmRzV2l0aExhdGluQW5kU3BhY2luZyh0ZXh0KSB7XHJcbiAgICAgICAgcmV0dXJuIFJFR0VYUF9FTkRTX1dJVEhfTEFUSU5fQU5EX1NQQUNJTkcudGVzdCh0ZXh0KTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgZW5kc1dpdGhTeW1ib2xzTmVlZFNwYWNlRm9sbG93ZWQodGV4dCl7XHJcbiAgICAgICAgcmV0dXJuIFJFR0VYUF9FTkRTX1dJVEhfU1lNQk9MU19ORUVEX1NQQUNFX0ZPTExPV0VELnRlc3QodGV4dCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHdyYXBPcHRpb25zKG9wdGlvbnMpIHtcclxuICAgIHJldHVybiB0eXBlb2Ygb3B0aW9ucyA9PT0gJ3N0cmluZycgPyB7c3BhY2luZ0NvbnRlbnQ6IG9wdGlvbnN9IDogb3B0aW9ucztcclxufVxyXG5cclxuZnVuY3Rpb24gaGFuZGxlT3B0aW9ucyhvcHRpb25zKSB7XHJcbiAgICBvcHRpb25zID0gd3JhcE9wdGlvbnMob3B0aW9ucyk7XHJcbiAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7fSwgREVGQVVMVF9PUFRJT05TLCBkZWZhdWx0T3B0aW9ucywgb3B0aW9ucyk7XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IFNwYWNlcjsiLCJpbXBvcnQgQnJvd3NlclNwYWNlciBmcm9tICcuL2Jyb3dzZXIuanMnXHJcblxyXG4vLyBBZGQgc3VwcG9ydCBmb3IgQU1EIChBc3luY2hyb25vdXMgTW9kdWxlIERlZmluaXRpb24pIGxpYnJhcmllcyBzdWNoIGFzIHJlcXVpcmUuanMuXHJcbmlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIHtcclxuICAgIGRlZmluZShbXSwgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgU3BhY2VyOiBCcm93c2VyU3BhY2VyXHJcbiAgICAgICAgfVxyXG4gICAgfSlcclxufVxyXG4vL0FkZCBzdXBwb3J0IGZvcm0gQ29tbW9uSlMgbGlicmFyaWVzIHN1Y2ggYXMgYnJvd3NlcmlmeS5cclxuaWYgKHR5cGVvZiBleHBvcnRzICE9PSAndW5kZWZpbmVkJykge1xyXG4gICAgZXhwb3J0cy5TcGFjZXIgPSBCcm93c2VyU3BhY2VyO1xyXG59XHJcbi8vRGVmaW5lIGdsb2JhbGx5IGluIGNhc2UgQU1EIGlzIG5vdCBhdmFpbGFibGUgb3IgdW51c2VkXHJcbmlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJykge1xyXG4gICAgd2luZG93LlNwYWNlciA9IEJyb3dzZXJTcGFjZXI7XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IEJyb3dzZXJTcGFjZXI7Il19
