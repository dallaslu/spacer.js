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
            var spaceInnerHTML = optionsEffect.forceUnifiedSpacing ? optionsEffect.spacingContent : options.wrapper ? '' : optionsEffect.spacingContent;
            if (optionsEffect.wrapper) {
                insertBefore(createNode(optionsEffect.wrapper.open + spaceInnerHTML + optionsEffect.wrapper.close), node);
            } else {
                insertBefore(document.createTextNode(spaceInnerHTML), node);
            }
        }
        if (optionsEffect.handleOriginalSpace && node.previousSibling.nodeType === Node.TEXT_NODE) {
            if (_core2.default.endsWithCJKAndSpacing(preText) && _core2.default.startsWithLatin(node.textContent) || _core2.default.endsWithLatinAndSpacing(preText) && _core2.default.startsWithCJK(node.textContent)) {
                var preEndSpacing = '';
                var arr = /(.*)([ ]+)$/g.match(node.previousSibling.data);
                node.previousSibling.data = arr[1];
                preEndSpacing = arr[2];
                var _spaceInnerHTML = optionsEffect.forceUnifiedSpacing ? optionsEffect.spacingContent : optionsEffect.keepOriginalSpace ? preEndSpacing : '';
                if (optionsEffect.wrapper) {
                    insertBefore(createNode(optionsEffect.wrapper.open + _spaceInnerHTML + optionsEffect.wrapper.close), node);
                } else {
                    insertBefore(document.createTextNode(_spaceInnerHTML), node);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJidWlsZC9hc3NldHMvanMvYnJvd3Nlci5qcyIsImJ1aWxkL2Fzc2V0cy9qcy9jb3JlLmpzIiwiYnVpbGQvYXNzZXRzL2pzL3NwYWNlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7O0FDQUE7Ozs7Ozs7Ozs7OztBQUVBLElBQU0sZUFBZSx3QkFBckI7QUFDQSxJQUFNLGFBQWEsb0hBQW5CO0FBQ0EsSUFBTSxlQUFlLDRCQUFyQjs7SUFFTSxhOzs7QUFFRiwyQkFBWSxPQUFaLEVBQXFCO0FBQUE7O0FBQUEsa0lBQ1gsT0FEVzs7QUFFakIsWUFBSSxRQUFRLE9BQVosRUFBcUI7QUFDakIsa0JBQUssT0FBTCxDQUFhLGNBQWIsR0FBOEIsTUFBSyxPQUFMLENBQWEsY0FBYixDQUE0QixPQUE1QixDQUFvQyxHQUFwQyxFQUF5QyxRQUF6QyxDQUE5QjtBQUNIO0FBSmdCO0FBS3BCOzs7O2tDQUVTLFEsRUFBVSxPLEVBQVM7QUFBQTs7QUFDekIsdUJBQVcsT0FBTyxRQUFQLEtBQW9CLFFBQXBCLEdBQStCLFNBQVMsZ0JBQVQsQ0FBMEIsUUFBMUIsQ0FBL0IsR0FBc0UsWUFBWSxDQUFDLFNBQVMsVUFBVCxDQUFvQixDQUFwQixDQUFELENBQTdGO0FBQ0Esc0JBQVUsS0FBSyxjQUFMLENBQW9CLE9BQXBCLENBQVY7QUFDQSxnQkFBSSxRQUFRLE9BQVosRUFBcUI7QUFDakIsd0JBQVEsY0FBUixHQUF5QixRQUFRLGNBQVIsQ0FBdUIsT0FBdkIsQ0FBK0IsR0FBL0IsRUFBb0MsUUFBcEMsQ0FBekI7QUFDSDtBQUNELGVBQUcsT0FBSCxDQUFXLElBQVgsQ0FBZ0IsUUFBaEIsRUFBMEIsYUFBSztBQUMzQiwwQkFBVSxNQUFWLEVBQWdCLENBQWhCLEVBQW1CLE9BQW5CO0FBQ0gsYUFGRDtBQUdIOzs7O0VBbEJ1QixjOztBQXFCNUIs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bnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsImltcG9ydCBTcGFjZXIgZnJvbSAnLi9jb3JlLmpzJ1xyXG5cclxuY29uc3QgSUdOT1JFRF9UQUdTID0gL14oc2NyaXB0fGxpbmt8c3R5bGUpJC9pO1xyXG5jb25zdCBCTE9DS19UQUdTID0gL14oZGl2fHB8aDF8aDJ8aDN8aDR8aDV8aDZ8YmxvY2txb3V0ZXxwcmV8dGV4dGFyZWF8bmF2fGhlYWRlcnxtYWlufGZvb3RlcnxzZWN0aW9ufHNpZGJhcnxhc2lkZXx0YWJsZXxsaXx1bHxvbHxkbCkkL2k7XHJcbmNvbnN0IFNQQUNJTkdfVEFHUyA9IC9eKGJyfGhyfGltZ3x2aWRlb3xhdWRpbykkL2k7XHJcblxyXG5jbGFzcyBCcm93c2VyU3BhY2VyIGV4dGVuZHMgU3BhY2VyIHtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihvcHRpb25zKSB7XHJcbiAgICAgICAgc3VwZXIob3B0aW9ucyk7XHJcbiAgICAgICAgaWYgKG9wdGlvbnMud3JhcHBlcikge1xyXG4gICAgICAgICAgICB0aGlzLm9wdGlvbnMuc3BhY2luZ0NvbnRlbnQgPSB0aGlzLm9wdGlvbnMuc3BhY2luZ0NvbnRlbnQucmVwbGFjZSgnICcsICcmbmJzcDsnKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgc3BhY2VQYWdlKGVsZW1lbnRzLCBvcHRpb25zKSB7XHJcbiAgICAgICAgZWxlbWVudHMgPSB0eXBlb2YgZWxlbWVudHMgPT09ICdzdHJpbmcnID8gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChlbGVtZW50cykgOiAoZWxlbWVudHMgfHwgW2RvY3VtZW50LmNoaWxkTm9kZXNbMV1dKTtcclxuICAgICAgICBvcHRpb25zID0gdGhpcy5yZXNvbHZlT3B0aW9ucyhvcHRpb25zKTtcclxuICAgICAgICBpZiAob3B0aW9ucy53cmFwcGVyKSB7XHJcbiAgICAgICAgICAgIG9wdGlvbnMuc3BhY2luZ0NvbnRlbnQgPSBvcHRpb25zLnNwYWNpbmdDb250ZW50LnJlcGxhY2UoJyAnLCAnJm5ic3A7Jyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFtdLmZvckVhY2guY2FsbChlbGVtZW50cywgZSA9PiB7XHJcbiAgICAgICAgICAgIHNwYWNlTm9kZSh0aGlzLCBlLCBvcHRpb25zKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxufVxyXG5cclxuZnVuY3Rpb24gc3BhY2VOb2RlKHNwYWNlciwgbm9kZSwgb3B0aW9ucykge1xyXG4gICAgaWYgKG5vZGUudGFnTmFtZSAmJiBJR05PUkVEX1RBR1MudGVzdChub2RlLnRhZ05hbWUpKSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgbGV0IG9wdGlvbnNOb1dyYXBwZXIgPSBPYmplY3QuYXNzaWduKHt9LCBvcHRpb25zLCB7d3JhcHBlcjogZmFsc2V9KTtcclxuICAgIGxldCBvcHRpb25zTm9XcmFwcGVyTm9IVE1MRW50aXR5ID0gT2JqZWN0LmFzc2lnbih7fSwgb3B0aW9ucywge1xyXG4gICAgICAgIHdyYXBwZXI6IGZhbHNlLFxyXG4gICAgICAgIHNwYWNpbmdDb250ZW50OiBvcHRpb25zLnNwYWNpbmdDb250ZW50LnJlcGxhY2UoJyZuYnNwOycsICcgJylcclxuICAgIH0pO1xyXG4gICAgbGV0IG9wdGlvbnNFZmZlY3QgPSBvcHRpb25zO1xyXG4gICAgaWYgKG5vZGUucGFyZW50Tm9kZSAmJiBub2RlLnBhcmVudE5vZGUudGFnTmFtZSA9PT0gJ1RJVExFJykge1xyXG4gICAgICAgIG9wdGlvbnNFZmZlY3QgPSBvcHRpb25zTm9XcmFwcGVyTm9IVE1MRW50aXR5O1xyXG4gICAgfVxyXG4gICAgaWYgKG5vZGUucHJldmlvdXNTaWJsaW5nXHJcbiAgICAgICAgJiYgKCFub2RlLnByZXZpb3VzU2libGluZy50YWdOYW1lIHx8ICghQkxPQ0tfVEFHUy50ZXN0KG5vZGUucHJldmlvdXNTaWJsaW5nLnRhZ05hbWUpICYmICFTUEFDSU5HX1RBR1MudGVzdChub2RlLnByZXZpb3VzU2libGluZy50YWdOYW1lKSkpXHJcbiAgICAgICAgJiYgKCFub2RlLnRhZ05hbWUgfHwgKCFCTE9DS19UQUdTLnRlc3Qobm9kZS50YWdOYW1lKSAmJiAhU1BBQ0lOR19UQUdTLnRlc3Qobm9kZS50YWdOYW1lKSkpKSB7XHJcbiAgICAgICAgbGV0IHByZVRleHQgPSBub2RlLnByZXZpb3VzU2libGluZy5ub2RlVHlwZSA9PT0gTm9kZS5URVhUX05PREUgPyBub2RlLnByZXZpb3VzU2libGluZy5kYXRhIDogbm9kZS5wcmV2aW91c1NpYmxpbmcudGV4dENvbnRlbnQ7XHJcbiAgICAgICAgaWYgKChTcGFjZXIuZW5kc1dpdGhDSksocHJlVGV4dCkgfHwgU3BhY2VyLmVuZHNXaXRoU3ltYm9sc05lZWRTcGFjZUZvbGxvd2VkKHByZVRleHQpKSAmJiBTcGFjZXIuc3RhcnRzV2l0aExhdGluKG5vZGUudGV4dENvbnRlbnQpXHJcbiAgICAgICAgICAgIHx8IChTcGFjZXIuZW5kc1dpdGhMYXRpbihwcmVUZXh0KSB8fCBTcGFjZXIuZW5kc1dpdGhTeW1ib2xzTmVlZFNwYWNlRm9sbG93ZWQocHJlVGV4dCkpICYmIFNwYWNlci5zdGFydHNXaXRoQ0pLKG5vZGUudGV4dENvbnRlbnQpKSB7XHJcbiAgICAgICAgICAgIGxldCBzcGFjZUlubmVySFRNTCA9IG9wdGlvbnNFZmZlY3QuZm9yY2VVbmlmaWVkU3BhY2luZyA/IG9wdGlvbnNFZmZlY3Quc3BhY2luZ0NvbnRlbnQgOiAob3B0aW9ucy53cmFwcGVyID8gJycgOiBvcHRpb25zRWZmZWN0LnNwYWNpbmdDb250ZW50KTtcclxuICAgICAgICAgICAgaWYgKG9wdGlvbnNFZmZlY3Qud3JhcHBlcikge1xyXG4gICAgICAgICAgICAgICAgaW5zZXJ0QmVmb3JlKGNyZWF0ZU5vZGUob3B0aW9uc0VmZmVjdC53cmFwcGVyLm9wZW4gKyBzcGFjZUlubmVySFRNTCArIG9wdGlvbnNFZmZlY3Qud3JhcHBlci5jbG9zZSksIG5vZGUpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgaW5zZXJ0QmVmb3JlKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKHNwYWNlSW5uZXJIVE1MKSwgbm9kZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKG9wdGlvbnNFZmZlY3QuaGFuZGxlT3JpZ2luYWxTcGFjZSAmJiBub2RlLnByZXZpb3VzU2libGluZy5ub2RlVHlwZSA9PT0gTm9kZS5URVhUX05PREUpIHtcclxuICAgICAgICAgICAgaWYgKFNwYWNlci5lbmRzV2l0aENKS0FuZFNwYWNpbmcocHJlVGV4dCkgJiYgU3BhY2VyLnN0YXJ0c1dpdGhMYXRpbihub2RlLnRleHRDb250ZW50KVxyXG4gICAgICAgICAgICAgICAgfHwgU3BhY2VyLmVuZHNXaXRoTGF0aW5BbmRTcGFjaW5nKHByZVRleHQpICYmIFNwYWNlci5zdGFydHNXaXRoQ0pLKG5vZGUudGV4dENvbnRlbnQpKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgcHJlRW5kU3BhY2luZyA9ICcnO1xyXG4gICAgICAgICAgICAgICAgbGV0IGFyciA9IC8oLiopKFsgXSspJC9nLm1hdGNoKG5vZGUucHJldmlvdXNTaWJsaW5nLmRhdGEpO1xyXG4gICAgICAgICAgICAgICAgbm9kZS5wcmV2aW91c1NpYmxpbmcuZGF0YSA9IGFyclsxXTtcclxuICAgICAgICAgICAgICAgIHByZUVuZFNwYWNpbmcgPSBhcnJbMl07XHJcbiAgICAgICAgICAgICAgICBsZXQgc3BhY2VJbm5lckhUTUwgPSBvcHRpb25zRWZmZWN0LmZvcmNlVW5pZmllZFNwYWNpbmcgPyBvcHRpb25zRWZmZWN0LnNwYWNpbmdDb250ZW50IDogKG9wdGlvbnNFZmZlY3Qua2VlcE9yaWdpbmFsU3BhY2UgPyBwcmVFbmRTcGFjaW5nIDogJycpO1xyXG4gICAgICAgICAgICAgICAgaWYgKG9wdGlvbnNFZmZlY3Qud3JhcHBlcikge1xyXG4gICAgICAgICAgICAgICAgICAgIGluc2VydEJlZm9yZShjcmVhdGVOb2RlKG9wdGlvbnNFZmZlY3Qud3JhcHBlci5vcGVuICsgc3BhY2VJbm5lckhUTUwgKyBvcHRpb25zRWZmZWN0LndyYXBwZXIuY2xvc2UpLCBub2RlKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaW5zZXJ0QmVmb3JlKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKHNwYWNlSW5uZXJIVE1MKSwgbm9kZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBpZiAobm9kZS5ub2RlVHlwZSA9PT0gTm9kZS5URVhUX05PREUpIHtcclxuICAgICAgICBpZiAob3B0aW9uc0VmZmVjdC53cmFwcGVyKSB7XHJcbiAgICAgICAgICAgIGxldCBhcnIgPSBzcGFjZXIuc3BsaXQobm9kZS5kYXRhLCBvcHRpb25zRWZmZWN0KTtcclxuICAgICAgICAgICAgaWYgKGFyci5sZW5ndGggPT0gMSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYXJyLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgaXNTcGFjaW5nID0gL15bIF0qJC8udGVzdChhcnJbaV0pO1xyXG4gICAgICAgICAgICAgICAgaWYgKGlzU3BhY2luZyB8fCAoaSAhPSAwICYmICEvXlsgXSokLy50ZXN0KGFycltpIC0gMV0pKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBzcGFjZUlubmVySFRNTCA9IG9wdGlvbnNFZmZlY3QuZm9yY2VVbmlmaWVkU3BhY2luZyA/IG9wdGlvbnNFZmZlY3Quc3BhY2luZ0NvbnRlbnQgOiAoaXNTcGFjaW5nICYmIG9wdGlvbnNFZmZlY3Qua2VlcE9yaWdpbmFsU3BhY2UpID8gYXJyW2ldIDogJyc7XHJcbiAgICAgICAgICAgICAgICAgICAgaW5zZXJ0QmVmb3JlKGNyZWF0ZU5vZGUob3B0aW9uc0VmZmVjdC53cmFwcGVyLm9wZW4gKyBzcGFjZUlubmVySFRNTCArIG9wdGlvbnNFZmZlY3Qud3JhcHBlci5jbG9zZSksIG5vZGUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKCFpc1NwYWNpbmcpIHtcclxuICAgICAgICAgICAgICAgICAgICBpbnNlcnRCZWZvcmUoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoYXJyW2ldKSwgbm9kZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgbm9kZS5yZW1vdmUoKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBpZiAobm9kZS5wYXJlbnROb2RlLnRhZ05hbWUgPT09ICdUSVRMRScpIHtcclxuICAgICAgICAgICAgICAgIHNwYWNlQXR0cmlidXRlKHNwYWNlciwgbm9kZSwgJ2RhdGEnLCBvcHRpb25zTm9XcmFwcGVyTm9IVE1MRW50aXR5KTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHNwYWNlQXR0cmlidXRlKHNwYWNlciwgbm9kZSwgJ2RhdGEnLCBvcHRpb25zTm9XcmFwcGVyKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm47XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIC8vIHRhZyBuYW1lIGZpbHRlclxyXG4gICAgICAgIHNwYWNlQXR0cmlidXRlKHNwYWNlciwgbm9kZSwgJ3RpdGxlJywgb3B0aW9uc05vV3JhcHBlck5vSFRNTEVudGl0eSk7XHJcbiAgICAgICAgc3BhY2VBdHRyaWJ1dGUoc3BhY2VyLCBub2RlLCAnYWx0Jywgb3B0aW9uc05vV3JhcHBlck5vSFRNTEVudGl0eSk7XHJcbiAgICAgICAgc3BhY2VBdHRyaWJ1dGUoc3BhY2VyLCBub2RlLCAnbGFiZWwnLCBvcHRpb25zTm9XcmFwcGVyTm9IVE1MRW50aXR5KTtcclxuICAgICAgICBzcGFjZUF0dHJpYnV0ZShzcGFjZXIsIG5vZGUsICdwbGFjZWhvbGRlcicsIG9wdGlvbnNOb1dyYXBwZXJOb0hUTUxFbnRpdHkpO1xyXG4gICAgfVxyXG4gICAgaWYgKG5vZGUuY2hpbGROb2Rlcykge1xyXG4gICAgICAgIGxldCBzdGF0aWNOb2RlcyA9IFtdO1xyXG4gICAgICAgIG5vZGUuY2hpbGROb2Rlcy5mb3JFYWNoKGNoaWxkID0+IHtcclxuICAgICAgICAgICAgc3RhdGljTm9kZXMucHVzaChjaGlsZCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgc3RhdGljTm9kZXMuZm9yRWFjaChjaGlsZCA9PiB7XHJcbiAgICAgICAgICAgIHNwYWNlTm9kZShzcGFjZXIsIGNoaWxkLCBvcHRpb25zKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxufVxyXG5cclxuZnVuY3Rpb24gY3JlYXRlTm9kZShodG1sKSB7XHJcbiAgICBsZXQgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICBkaXYuaW5uZXJIVE1MID0gaHRtbDtcclxuICAgIHJldHVybiBkaXYuZmlyc3RDaGlsZDtcclxufVxyXG5cclxuZnVuY3Rpb24gaW5zZXJ0QmVmb3JlKG5ld05vZGUsIG5vZGUpIHtcclxuICAgIGlmIChub2RlLnRhZ05hbWUgIT09ICdIVE1MJyAmJiBub2RlLnBhcmVudE5vZGUgJiYgbm9kZS5wYXJlbnROb2RlLnRhZ05hbWUgIT09ICdIVE1MJykge1xyXG4gICAgICAgIG5vZGUucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUobmV3Tm9kZSwgbm9kZSk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHNwYWNlQXR0cmlidXRlKHNwYWNlciwgbm9kZSwgYXR0ciwgb3B0aW9ucykge1xyXG4gICAgaWYgKG5vZGVbYXR0cl0pIHtcclxuICAgICAgICBsZXQgcmVzdWx0ID0gc3BhY2VyLnNwYWNlKG5vZGVbYXR0cl0sIG9wdGlvbnMpO1xyXG4gICAgICAgIGlmIChub2RlW2F0dHJdICE9PSByZXN1bHQpIHtcclxuICAgICAgICAgICAgbm9kZVthdHRyXSA9IHJlc3VsdDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IEJyb3dzZXJTcGFjZXI7IiwiLypcclxuICogaHR0cHM6Ly93d3cudW5pY29kZS5vcmcvUHVibGljLzUuMC4wL3VjZC9VbmloYW4uaHRtbFxyXG4gKi9cclxuLypcclxuICogXFx1MkU4MC1cXHUyRUZGICAgIENKSyDpg6jpppZcclxuICogXFx1MkYwMC1cXHUyRkRGICAgIOW6t+eGmeWtl+WFuOmDqOmmllxyXG4gKiBcXHUzMDAwLVxcdTMwM0YgICAgQ0pLIOespuWPt+WSjOagh+eCuVxyXG4gKiBcXHUzMUMwLVxcdTMxRUYgICAgQ0pLIOeslOeUu1xyXG4gKiBcXHUzMjAwLVxcdTMyRkYgICAg5bCB6Zet5byPIENKSyDmloflrZflkozmnIjku71cclxuICogXFx1MzMwMC1cXHUzM0ZGICAgIENKSyDlhbzlrrlcclxuICogXFx1MzQwMC1cXHU0REJGICAgIENKSyDnu5/kuIDooajmhI/nrKblj7fmianlsZUgQVxyXG4gKiBcXHU0REMwLVxcdTRERkYgICAg5piT57uP5YWt5Y2B5Zub5Y2m56ym5Y+3XHJcbiAqIFxcdTRFMDAtXFx1OUZCRiAgICBDSksg57uf5LiA6KGo5oSP56ym5Y+3XHJcbiAqIFxcdUY5MDAtXFx1RkFGRiAgICBDSksg5YW85a656LGh5b2i5paH5a2XXHJcbiAqIFxcdUZFMzAtXFx1RkU0RiAgICBDSksg5YW85a655b2i5byPXHJcbiAqIFxcdUZGMDAtXFx1RkZFRiAgICDlhajop5JBU0NJSeOAgeWFqOinkuagh+eCuVxyXG4gKi9cclxuY29uc3QgQ0pLID0gJ1xcdTJFODAtXFx1MkZERlxcdTMxQzAtXFx1RkU0Ric7XHJcbmNvbnN0IFNZTUJPTFMgPSAnQCY9X1xcJCVcXF5cXCpcXC0rJztcclxuY29uc3QgTEFUSU4gPSAnQS1aYS16MC05XFx1MDBDMC1cXHUwMEZGXFx1MDEwMC1cXHUwMTdGXFx1MDE4MC1cXHUwMjRGXFx1MUUwMC1cXHUxRUZGJztcclxuY29uc3QgT05FX09SX01PUkVfU1BBQ0UgPSAnWyBdKyc7XHJcbmNvbnN0IFNZTUJPTFNfTkVFRF9TUEFDRV9GT0xMT1dFRCA9ICdbXFwuOiw/IV0nO1xyXG5jb25zdCBPTkVfQUpLID0gYFske0NKS31dYDtcclxuY29uc3QgT05FX0xBVElOID0gYFske0xBVElOfV1gO1xyXG5jb25zdCBPTkVfTEFUSU5fTElLRSA9IGBbJHtMQVRJTn0lXWA7XHJcbmNvbnN0IFNQTElUX0JFRk9SRV9TUEFDRSA9IGAoPzw9JHtPTkVfTEFUSU5fTElLRX0pKD89WyBdKiR7T05FX0FKS30pfCg/PD0ke09ORV9BSkt9KSg/PVsgXSoke09ORV9MQVRJTl9MSUtFfSlgO1xyXG5jb25zdCBTUExJVF9BRlRFUl9TUEFDRSA9IGAoPzw9JHtPTkVfQUpLfVsgXSopKD89JHtPTkVfTEFUSU5fTElLRX0pfCg/PD0ke09ORV9MQVRJTl9MSUtFfVsgXSopKD89JHtPTkVfQUpLfSlgO1xyXG5jb25zdCBTUExJVF9TWU1CT0xTX05FRURfU1BBQ0VfRk9MTE9XRUQgPSBgKD88PSR7U1lNQk9MU19ORUVEX1NQQUNFX0ZPTExPV0VEfSkoPz0ke09ORV9BSkt9fCR7T05FX0xBVElOfSlgO1xyXG5jb25zdCBSRUdFWFBfRU5EU19XSVRIX1NZTUJPTFNfTkVFRF9TUEFDRV9GT0xMT1dFRCA9IG5ldyBSZWdFeHAoYCR7U1lNQk9MU19ORUVEX1NQQUNFX0ZPTExPV0VEfSRgKTtcclxuY29uc3QgUkVHRVhQX0VORFNfV0lUSF9DSktfQU5EX1NQQUNJTkcgPSBuZXcgUmVnRXhwKGAke09ORV9BSkt9JHtPTkVfT1JfTU9SRV9TUEFDRX0kYCk7XHJcbmNvbnN0IFJFR0VYUF9FTkRTX1dJVEhfTEFUSU5fQU5EX1NQQUNJTkcgPSBuZXcgUmVnRXhwKGAke09ORV9MQVRJTl9MSUtFfSR7T05FX09SX01PUkVfU1BBQ0V9JGApO1xyXG5jb25zdCBSRUdFWFBfRU5EU19XSVRIX0NKSyA9IG5ldyBSZWdFeHAoYCR7T05FX0FKS30kYCk7XHJcbmNvbnN0IFJFR0VYUF9FTkRTX1dJVEhfTEFUSU4gPSBuZXcgUmVnRXhwKGAke09ORV9MQVRJTl9MSUtFfSRgKTtcclxuY29uc3QgUkVHRVhQX1NUQVJUU19XSVRIX0NKSyA9IG5ldyBSZWdFeHAoYF4ke09ORV9BSkt9YCk7XHJcbmNvbnN0IFJFR0VYUF9TVEFSVFNfV0lUSF9MQVRJTiA9IG5ldyBSZWdFeHAoYF4ke09ORV9MQVRJTl9MSUtFfWApO1xyXG5jb25zdCBSRUdFWFBfU1BMSVRfREVGQVVMVCA9IG5ldyBSZWdFeHAoYCg/PD0ke09ORV9MQVRJTl9MSUtFfSkoPz0ke09ORV9BSkt9KXwoPzw9JHtPTkVfQUpLfSkoPz0ke09ORV9MQVRJTl9MSUtFfSl8JHtTUExJVF9TWU1CT0xTX05FRURfU1BBQ0VfRk9MTE9XRUR9YCwgJ2cnKTtcclxuY29uc3QgUkVHRVhQX1NQTElUX1NQQUNFID0gbmV3IFJlZ0V4cChgJHtTUExJVF9CRUZPUkVfU1BBQ0V9fCR7U1BMSVRfQUZURVJfU1BBQ0V9fCR7U1BMSVRfU1lNQk9MU19ORUVEX1NQQUNFX0ZPTExPV0VEfWAsICdnJyk7XHJcblxyXG5jb25zdCBERUZBVUxUX09QVElPTlMgPSB7XHJcbiAgICBzcGFjaW5nQ29udGVudDogJyAnXHJcbn07XHJcblxyXG5sZXQgZGVmYXVsdE9wdGlvbnMgPSB7fTtcclxuXHJcbmNsYXNzIFNwYWNlciB7XHJcblxyXG4gICAgY29uc3RydWN0b3Iob3B0aW9ucykge1xyXG4gICAgICAgIHRoaXMub3B0aW9ucyA9IGhhbmRsZU9wdGlvbnMob3B0aW9ucyk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGNvbmZpZyhvcHRpb25zKSB7XHJcbiAgICAgICAgb3B0aW9ucyA9IHdyYXBPcHRpb25zKG9wdGlvbnMpO1xyXG4gICAgICAgIE9iamVjdC5hc3NpZ24oZGVmYXVsdE9wdGlvbnMsIERFRkFVTFRfT1BUSU9OUywgb3B0aW9ucyk7XHJcbiAgICB9XHJcblxyXG4gICAgc3BhY2UodGV4dCwgb3B0aW9ucykge1xyXG4gICAgICAgIGxldCBhcnIgPSB0aGlzLnNwbGl0KHRleHQsIG9wdGlvbnMpO1xyXG4gICAgICAgIG9wdGlvbnMgPSB0aGlzLnJlc29sdmVPcHRpb25zKG9wdGlvbnMpO1xyXG4gICAgICAgIGlmIChvcHRpb25zLndyYXBwZXIpIHtcclxuICAgICAgICAgICAgbGV0IHJlc3VsdCA9IGFyclswXTtcclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDE7IGkgPCBhcnIubGVuZ3RoIC0gMTsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgb3BlbiA9IC9bIF0qLy50ZXN0KGFycltpICsgMV0pO1xyXG4gICAgICAgICAgICAgICAgbGV0IGNsb3NlID0gL1sgXSovLnRlc3QoYXJyW2kgLSAxXSk7XHJcbiAgICAgICAgICAgICAgICBpZiAob3Blbikge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdCArPSBvcHRpb25zLndyYXBwZXIub3BlbjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmIChjbG9zZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdCArPSBvcHRpb25zLndyYXBwZXIuY2xvc2U7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAoIW9wZW4gJiYgIWNsb3NlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0ICs9IG9wdGlvbnMud3JhcHBlci5vcGVuICsgb3B0aW9ucy53cmFwcGVyLmNsb3NlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIGFyci5qb2luKG9wdGlvbnMuc3BhY2luZ0NvbnRlbnQpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBzcGxpdCh0ZXh0LCBvcHRpb25zKSB7XHJcbiAgICAgICAgb3B0aW9ucyA9IHRoaXMucmVzb2x2ZU9wdGlvbnMob3B0aW9ucyk7XHJcbiAgICAgICAgaWYgKHR5cGVvZiB0ZXh0ID09PSAnc3RyaW5nJykge1xyXG4gICAgICAgICAgICBsZXQgcGF0dGVybiA9IG9wdGlvbnMuaGFuZGxlT3JpZ2luYWxTcGFjZSA/IFJFR0VYUF9TUExJVF9TUEFDRSA6IFJFR0VYUF9TUExJVF9ERUZBVUxUO1xyXG4gICAgICAgICAgICByZXR1cm4gdGV4dC5zcGxpdChwYXR0ZXJuKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIFt0ZXh0XTtcclxuICAgIH1cclxuXHJcbiAgICByZXNvbHZlT3B0aW9ucyhvcHRpb25zKSB7XHJcbiAgICAgICAgcmV0dXJuIG9wdGlvbnMgPyBoYW5kbGVPcHRpb25zKG9wdGlvbnMpIDogdGhpcy5vcHRpb25zO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBlbmRzV2l0aENKS0FuZFNwYWNpbmcodGV4dCkge1xyXG4gICAgICAgIHJldHVybiBSRUdFWFBfRU5EU19XSVRIX0NKS19BTkRfU1BBQ0lORy50ZXN0KHRleHQpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBlbmRzV2l0aENKSyh0ZXh0KXtcclxuICAgICAgICByZXR1cm4gUkVHRVhQX0VORFNfV0lUSF9DSksudGVzdCh0ZXh0KTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgZW5kc1dpdGhMYXRpbih0ZXh0KXtcclxuICAgICAgICByZXR1cm4gUkVHRVhQX0VORFNfV0lUSF9MQVRJTi50ZXN0KHRleHQpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBzdGFydHNXaXRoQ0pLKHRleHQpe1xyXG4gICAgICAgIHJldHVybiBSRUdFWFBfU1RBUlRTX1dJVEhfQ0pLLnRlc3QodGV4dCk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIHN0YXJ0c1dpdGhMYXRpbih0ZXh0KXtcclxuICAgICAgICByZXR1cm4gUkVHRVhQX1NUQVJUU19XSVRIX0xBVElOLnRlc3QodGV4dCk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGVuZHNXaXRoTGF0aW5BbmRTcGFjaW5nKHRleHQpIHtcclxuICAgICAgICByZXR1cm4gUkVHRVhQX0VORFNfV0lUSF9MQVRJTl9BTkRfU1BBQ0lORy50ZXN0KHRleHQpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBlbmRzV2l0aFN5bWJvbHNOZWVkU3BhY2VGb2xsb3dlZCh0ZXh0KXtcclxuICAgICAgICByZXR1cm4gUkVHRVhQX0VORFNfV0lUSF9TWU1CT0xTX05FRURfU1BBQ0VfRk9MTE9XRUQudGVzdCh0ZXh0KTtcclxuICAgIH1cclxufVxyXG5cclxuZnVuY3Rpb24gd3JhcE9wdGlvbnMob3B0aW9ucykge1xyXG4gICAgcmV0dXJuIHR5cGVvZiBvcHRpb25zID09PSAnc3RyaW5nJyA/IHtzcGFjaW5nQ29udGVudDogb3B0aW9uc30gOiBvcHRpb25zO1xyXG59XHJcblxyXG5mdW5jdGlvbiBoYW5kbGVPcHRpb25zKG9wdGlvbnMpIHtcclxuICAgIG9wdGlvbnMgPSB3cmFwT3B0aW9ucyhvcHRpb25zKTtcclxuICAgIHJldHVybiBPYmplY3QuYXNzaWduKHt9LCBERUZBVUxUX09QVElPTlMsIGRlZmF1bHRPcHRpb25zLCBvcHRpb25zKTtcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgU3BhY2VyOyIsImltcG9ydCBCcm93c2VyU3BhY2VyIGZyb20gJy4vYnJvd3Nlci5qcydcclxuXHJcbi8vIEFkZCBzdXBwb3J0IGZvciBBTUQgKEFzeW5jaHJvbm91cyBNb2R1bGUgRGVmaW5pdGlvbikgbGlicmFyaWVzIHN1Y2ggYXMgcmVxdWlyZS5qcy5cclxuaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkge1xyXG4gICAgZGVmaW5lKFtdLCBmdW5jdGlvbigpIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBTcGFjZXI6IEJyb3dzZXJTcGFjZXJcclxuICAgICAgICB9XHJcbiAgICB9KVxyXG59XHJcbi8vQWRkIHN1cHBvcnQgZm9ybSBDb21tb25KUyBsaWJyYXJpZXMgc3VjaCBhcyBicm93c2VyaWZ5LlxyXG5pZiAodHlwZW9mIGV4cG9ydHMgIT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICBleHBvcnRzLlNwYWNlciA9IEJyb3dzZXJTcGFjZXI7XHJcbn1cclxuLy9EZWZpbmUgZ2xvYmFsbHkgaW4gY2FzZSBBTUQgaXMgbm90IGF2YWlsYWJsZSBvciB1bnVzZWRcclxuaWYgKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICB3aW5kb3cuU3BhY2VyID0gQnJvd3NlclNwYWNlcjtcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgQnJvd3NlclNwYWNlcjsiXX0=
