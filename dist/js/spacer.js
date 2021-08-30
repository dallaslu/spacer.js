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
                if (isSpacing || i != 0 && !/^[ ]*$/.test(_arr[i - 1])) {
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
var REGEXP_ANY_CJK = new RegExp('' + ONE_AJK);
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
            if (typeof text === 'string' && REGEXP_ANY_CJK.test(text)) {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJidWlsZC9qcy9icm93c2VyLmpzIiwiYnVpbGQvanMvY29yZS5qcyIsImJ1aWxkL2pzL3NwYWNlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7O0FDQUE7Ozs7Ozs7Ozs7OztBQUVBLElBQU0sZUFBZSx3QkFBckI7QUFDQSxJQUFNLGFBQWEsb0hBQW5CO0FBQ0EsSUFBTSxlQUFlLDRCQUFyQjs7SUFFTSxhOzs7QUFFRiwyQkFBWSxPQUFaLEVBQXFCO0FBQUE7O0FBQUEsa0lBQ1gsT0FEVzs7QUFFakIsWUFBSSxRQUFRLE9BQVosRUFBcUI7QUFDakIsa0JBQUssT0FBTCxDQUFhLGNBQWIsR0FBOEIsTUFBSyxPQUFMLENBQWEsY0FBYixDQUE0QixPQUE1QixDQUFvQyxHQUFwQyxFQUF5QyxRQUF6QyxDQUE5QjtBQUNIO0FBSmdCO0FBS3BCOzs7O2tDQUVTLFEsRUFBVSxPLEVBQVM7QUFBQTs7QUFDekIsdUJBQVcsT0FBTyxRQUFQLEtBQW9CLFFBQXBCLEdBQStCLFNBQVMsZ0JBQVQsQ0FBMEIsUUFBMUIsQ0FBL0IsR0FBc0UsWUFBWSxDQUFDLFNBQVMsVUFBVCxDQUFvQixDQUFwQixDQUFELENBQTdGO0FBQ0Esc0JBQVUsS0FBSyxjQUFMLENBQW9CLE9BQXBCLENBQVY7QUFDQSxnQkFBSSxRQUFRLE9BQVosRUFBcUI7QUFDakIsd0JBQVEsY0FBUixHQUF5QixRQUFRLGNBQVIsQ0FBdUIsT0FBdkIsQ0FBK0IsR0FBL0IsRUFBb0MsUUFBcEMsQ0FBekI7QUFDSDtBQUNELGVBQUcsT0FBSCxDQUFXLElBQVgsQ0FBZ0IsUUFBaEIsRUFBMEIsYUFBSztBQUMzQiwwQkFBVSxNQUFWLEVBQWdCLENBQWhCLEVBQW1CLE9BQW5CO0FBQ0gsYUFGRDtBQUdIOzs7O0VBbEJ1QixjOztBQXFCNUIsU0FBUyxTQUFULENBQW1CLE1BQW5C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SDs7a0JBRWMsaUIiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJpbXBvcnQgU3BhY2VyIGZyb20gJy4vY29yZS5qcydcclxuXHJcbmNvbnN0IElHTk9SRURfVEFHUyA9IC9eKHNjcmlwdHxsaW5rfHN0eWxlKSQvaTtcclxuY29uc3QgQkxPQ0tfVEFHUyA9IC9eKGRpdnxwfGgxfGgyfGgzfGg0fGg1fGg2fGJsb2NrcW91dGV8cHJlfHRleHRhcmVhfG5hdnxoZWFkZXJ8bWFpbnxmb290ZXJ8c2VjdGlvbnxzaWRiYXJ8YXNpZGV8dGFibGV8bGl8dWx8b2x8ZGwpJC9pO1xyXG5jb25zdCBTUEFDSU5HX1RBR1MgPSAvXihicnxocnxpbWd8dmlkZW98YXVkaW8pJC9pO1xyXG5cclxuY2xhc3MgQnJvd3NlclNwYWNlciBleHRlbmRzIFNwYWNlciB7XHJcblxyXG4gICAgY29uc3RydWN0b3Iob3B0aW9ucykge1xyXG4gICAgICAgIHN1cGVyKG9wdGlvbnMpO1xyXG4gICAgICAgIGlmIChvcHRpb25zLndyYXBwZXIpIHtcclxuICAgICAgICAgICAgdGhpcy5vcHRpb25zLnNwYWNpbmdDb250ZW50ID0gdGhpcy5vcHRpb25zLnNwYWNpbmdDb250ZW50LnJlcGxhY2UoJyAnLCAnJm5ic3A7Jyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHNwYWNlUGFnZShlbGVtZW50cywgb3B0aW9ucykge1xyXG4gICAgICAgIGVsZW1lbnRzID0gdHlwZW9mIGVsZW1lbnRzID09PSAnc3RyaW5nJyA/IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoZWxlbWVudHMpIDogKGVsZW1lbnRzIHx8IFtkb2N1bWVudC5jaGlsZE5vZGVzWzFdXSk7XHJcbiAgICAgICAgb3B0aW9ucyA9IHRoaXMucmVzb2x2ZU9wdGlvbnMob3B0aW9ucyk7XHJcbiAgICAgICAgaWYgKG9wdGlvbnMud3JhcHBlcikge1xyXG4gICAgICAgICAgICBvcHRpb25zLnNwYWNpbmdDb250ZW50ID0gb3B0aW9ucy5zcGFjaW5nQ29udGVudC5yZXBsYWNlKCcgJywgJyZuYnNwOycpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBbXS5mb3JFYWNoLmNhbGwoZWxlbWVudHMsIGUgPT4ge1xyXG4gICAgICAgICAgICBzcGFjZU5vZGUodGhpcywgZSwgb3B0aW9ucyk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHNwYWNlTm9kZShzcGFjZXIsIG5vZGUsIG9wdGlvbnMpIHtcclxuICAgIGlmIChub2RlLnRhZ05hbWUgJiYgSUdOT1JFRF9UQUdTLnRlc3Qobm9kZS50YWdOYW1lKSkge1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIGxldCBvcHRpb25zTm9XcmFwcGVyID0gT2JqZWN0LmFzc2lnbih7fSwgb3B0aW9ucywge3dyYXBwZXI6IGZhbHNlfSk7XHJcbiAgICBsZXQgb3B0aW9uc05vV3JhcHBlck5vSFRNTEVudGl0eSA9IE9iamVjdC5hc3NpZ24oe30sIG9wdGlvbnMsIHtcclxuICAgICAgICB3cmFwcGVyOiBmYWxzZSxcclxuICAgICAgICBzcGFjaW5nQ29udGVudDogb3B0aW9ucy5zcGFjaW5nQ29udGVudC5yZXBsYWNlKCcmbmJzcDsnLCAnICcpXHJcbiAgICB9KTtcclxuICAgIGxldCBvcHRpb25zRWZmZWN0ID0gb3B0aW9ucztcclxuICAgIGlmIChub2RlLnBhcmVudE5vZGUgJiYgbm9kZS5wYXJlbnROb2RlLnRhZ05hbWUgPT09ICdUSVRMRScpIHtcclxuICAgICAgICBvcHRpb25zRWZmZWN0ID0gb3B0aW9uc05vV3JhcHBlck5vSFRNTEVudGl0eTtcclxuICAgIH1cclxuICAgIGlmIChub2RlLnByZXZpb3VzU2libGluZ1xyXG4gICAgICAgICYmICghbm9kZS5wcmV2aW91c1NpYmxpbmcudGFnTmFtZSB8fCAoIUJMT0NLX1RBR1MudGVzdChub2RlLnByZXZpb3VzU2libGluZy50YWdOYW1lKSAmJiAhU1BBQ0lOR19UQUdTLnRlc3Qobm9kZS5wcmV2aW91c1NpYmxpbmcudGFnTmFtZSkpKVxyXG4gICAgICAgICYmICghbm9kZS50YWdOYW1lIHx8ICghQkxPQ0tfVEFHUy50ZXN0KG5vZGUudGFnTmFtZSkgJiYgIVNQQUNJTkdfVEFHUy50ZXN0KG5vZGUudGFnTmFtZSkpKSkge1xyXG4gICAgICAgIGxldCBwcmVUZXh0ID0gbm9kZS5wcmV2aW91c1NpYmxpbmcubm9kZVR5cGUgPT09IE5vZGUuVEVYVF9OT0RFID8gbm9kZS5wcmV2aW91c1NpYmxpbmcuZGF0YSA6IG5vZGUucHJldmlvdXNTaWJsaW5nLnRleHRDb250ZW50O1xyXG4gICAgICAgIGlmICgoU3BhY2VyLmVuZHNXaXRoQ0pLKHByZVRleHQpIHx8IFNwYWNlci5lbmRzV2l0aFN5bWJvbHNOZWVkU3BhY2VGb2xsb3dlZChwcmVUZXh0KSkgJiYgU3BhY2VyLnN0YXJ0c1dpdGhMYXRpbihub2RlLnRleHRDb250ZW50KVxyXG4gICAgICAgICAgICB8fCAoU3BhY2VyLmVuZHNXaXRoTGF0aW4ocHJlVGV4dCkgfHwgU3BhY2VyLmVuZHNXaXRoU3ltYm9sc05lZWRTcGFjZUZvbGxvd2VkKHByZVRleHQpKSAmJiBTcGFjZXIuc3RhcnRzV2l0aENKSyhub2RlLnRleHRDb250ZW50KSkge1xyXG4gICAgICAgICAgICBsZXQgc3BhY2VDb250ZW50ID0gb3B0aW9uc0VmZmVjdC5mb3JjZVVuaWZpZWRTcGFjaW5nID8gb3B0aW9uc0VmZmVjdC5zcGFjaW5nQ29udGVudCA6ICcnO1xyXG4gICAgICAgICAgICBpZiAob3B0aW9uc0VmZmVjdC53cmFwcGVyKSB7XHJcbiAgICAgICAgICAgICAgICBpbnNlcnRCZWZvcmUoY3JlYXRlTm9kZShvcHRpb25zRWZmZWN0LndyYXBwZXIub3BlbiArIHNwYWNlQ29udGVudCArIG9wdGlvbnNFZmZlY3Qud3JhcHBlci5jbG9zZSksIG5vZGUpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgaW5zZXJ0QmVmb3JlKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKHNwYWNlQ29udGVudCA/IHNwYWNlQ29udGVudCA6IG9wdGlvbnNFZmZlY3Quc3BhY2luZ0NvbnRlbnQpLCBub2RlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAob3B0aW9uc0VmZmVjdC5oYW5kbGVPcmlnaW5hbFNwYWNlICYmIG5vZGUucHJldmlvdXNTaWJsaW5nLm5vZGVUeXBlID09PSBOb2RlLlRFWFRfTk9ERSkge1xyXG4gICAgICAgICAgICBpZiAoU3BhY2VyLmVuZHNXaXRoQ0pLQW5kU3BhY2luZyhwcmVUZXh0KSAmJiBTcGFjZXIuc3RhcnRzV2l0aExhdGluKG5vZGUudGV4dENvbnRlbnQpXHJcbiAgICAgICAgICAgICAgICB8fCBTcGFjZXIuZW5kc1dpdGhMYXRpbkFuZFNwYWNpbmcocHJlVGV4dCkgJiYgU3BhY2VyLnN0YXJ0c1dpdGhDSksobm9kZS50ZXh0Q29udGVudCkpIHtcclxuICAgICAgICAgICAgICAgIGxldCBwcmVFbmRTcGFjaW5nID0gJyc7XHJcbiAgICAgICAgICAgICAgICBsZXQgYXJyID0gLyguKikoWyBdKykkL2cubWF0Y2gobm9kZS5wcmV2aW91c1NpYmxpbmcuZGF0YSk7XHJcbiAgICAgICAgICAgICAgICBub2RlLnByZXZpb3VzU2libGluZy5kYXRhID0gYXJyWzFdO1xyXG4gICAgICAgICAgICAgICAgcHJlRW5kU3BhY2luZyA9IGFyclsyXTtcclxuICAgICAgICAgICAgICAgIGxldCBzcGFjZUNvbnRlbnQgPSBvcHRpb25zRWZmZWN0LmZvcmNlVW5pZmllZFNwYWNpbmcgPyBvcHRpb25zRWZmZWN0LnNwYWNpbmdDb250ZW50IDogKG9wdGlvbnNFZmZlY3Qua2VlcE9yaWdpbmFsU3BhY2UgPyBwcmVFbmRTcGFjaW5nIDogJycpO1xyXG4gICAgICAgICAgICAgICAgaWYgKG9wdGlvbnNFZmZlY3Qud3JhcHBlcikge1xyXG4gICAgICAgICAgICAgICAgICAgIGluc2VydEJlZm9yZShjcmVhdGVOb2RlKG9wdGlvbnNFZmZlY3Qud3JhcHBlci5vcGVuICsgc3BhY2VDb250ZW50ICsgb3B0aW9uc0VmZmVjdC53cmFwcGVyLmNsb3NlKSwgbm9kZSk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGluc2VydEJlZm9yZShkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShzcGFjZUNvbnRlbnQgPyBzcGFjZUNvbnRlbnQgOiBvcHRpb25zRWZmZWN0LnNwYWNpbmdDb250ZW50KSwgbm9kZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBpZiAobm9kZS5ub2RlVHlwZSA9PT0gTm9kZS5URVhUX05PREUpIHtcclxuICAgICAgICBpZiAob3B0aW9uc0VmZmVjdC53cmFwcGVyKSB7XHJcbiAgICAgICAgICAgIGxldCBhcnIgPSBzcGFjZXIuc3BsaXQobm9kZS5kYXRhLCBvcHRpb25zRWZmZWN0KTtcclxuICAgICAgICAgICAgaWYgKGFyci5sZW5ndGggPT0gMSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYXJyLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgaXNTcGFjaW5nID0gL15bIF0qJC8udGVzdChhcnJbaV0pO1xyXG4gICAgICAgICAgICAgICAgaWYgKGlzU3BhY2luZyB8fCAoaSAhPSAwICYmICEvXlsgXSokLy50ZXN0KGFycltpIC0gMV0pKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBzcGFjZUNvbnRlbnQgPSBvcHRpb25zRWZmZWN0LmZvcmNlVW5pZmllZFNwYWNpbmcgPyBvcHRpb25zRWZmZWN0LnNwYWNpbmdDb250ZW50IDogKGlzU3BhY2luZyAmJiBvcHRpb25zRWZmZWN0LmtlZXBPcmlnaW5hbFNwYWNlKSA/IGFycltpXSA6ICcnO1xyXG4gICAgICAgICAgICAgICAgICAgIGluc2VydEJlZm9yZShjcmVhdGVOb2RlKG9wdGlvbnNFZmZlY3Qud3JhcHBlci5vcGVuICsgc3BhY2VDb250ZW50ICsgb3B0aW9uc0VmZmVjdC53cmFwcGVyLmNsb3NlKSwgbm9kZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAoIWlzU3BhY2luZykge1xyXG4gICAgICAgICAgICAgICAgICAgIGluc2VydEJlZm9yZShkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShhcnJbaV0pLCBub2RlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBub2RlLnJlbW92ZSgpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGlmIChub2RlLnBhcmVudE5vZGUudGFnTmFtZSA9PT0gJ1RJVExFJykge1xyXG4gICAgICAgICAgICAgICAgc3BhY2VBdHRyaWJ1dGUoc3BhY2VyLCBub2RlLCAnZGF0YScsIG9wdGlvbnNOb1dyYXBwZXJOb0hUTUxFbnRpdHkpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgc3BhY2VBdHRyaWJ1dGUoc3BhY2VyLCBub2RlLCAnZGF0YScsIG9wdGlvbnNOb1dyYXBwZXIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybjtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgLy8gdGFnIG5hbWUgZmlsdGVyXHJcbiAgICAgICAgc3BhY2VBdHRyaWJ1dGUoc3BhY2VyLCBub2RlLCAndGl0bGUnLCBvcHRpb25zTm9XcmFwcGVyTm9IVE1MRW50aXR5KTtcclxuICAgICAgICBzcGFjZUF0dHJpYnV0ZShzcGFjZXIsIG5vZGUsICdhbHQnLCBvcHRpb25zTm9XcmFwcGVyTm9IVE1MRW50aXR5KTtcclxuICAgICAgICBzcGFjZUF0dHJpYnV0ZShzcGFjZXIsIG5vZGUsICdsYWJlbCcsIG9wdGlvbnNOb1dyYXBwZXJOb0hUTUxFbnRpdHkpO1xyXG4gICAgICAgIHNwYWNlQXR0cmlidXRlKHNwYWNlciwgbm9kZSwgJ3BsYWNlaG9sZGVyJywgb3B0aW9uc05vV3JhcHBlck5vSFRNTEVudGl0eSk7XHJcbiAgICB9XHJcbiAgICBpZiAobm9kZS5jaGlsZE5vZGVzKSB7XHJcbiAgICAgICAgbGV0IHN0YXRpY05vZGVzID0gW107XHJcbiAgICAgICAgbm9kZS5jaGlsZE5vZGVzLmZvckVhY2goY2hpbGQgPT4ge1xyXG4gICAgICAgICAgICBzdGF0aWNOb2Rlcy5wdXNoKGNoaWxkKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICBzdGF0aWNOb2Rlcy5mb3JFYWNoKGNoaWxkID0+IHtcclxuICAgICAgICAgICAgc3BhY2VOb2RlKHNwYWNlciwgY2hpbGQsIG9wdGlvbnMpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBjcmVhdGVOb2RlKGh0bWwpIHtcclxuICAgIGxldCBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgIGRpdi5pbm5lckhUTUwgPSBodG1sO1xyXG4gICAgcmV0dXJuIGRpdi5maXJzdENoaWxkO1xyXG59XHJcblxyXG5mdW5jdGlvbiBpbnNlcnRCZWZvcmUobmV3Tm9kZSwgbm9kZSkge1xyXG4gICAgaWYgKG5vZGUudGFnTmFtZSAhPT0gJ0hUTUwnICYmIG5vZGUucGFyZW50Tm9kZSAmJiBub2RlLnBhcmVudE5vZGUudGFnTmFtZSAhPT0gJ0hUTUwnKSB7XHJcbiAgICAgICAgbm9kZS5wYXJlbnROb2RlLmluc2VydEJlZm9yZShuZXdOb2RlLCBub2RlKTtcclxuICAgIH1cclxufVxyXG5cclxuZnVuY3Rpb24gc3BhY2VBdHRyaWJ1dGUoc3BhY2VyLCBub2RlLCBhdHRyLCBvcHRpb25zKSB7XHJcbiAgICBpZiAobm9kZVthdHRyXSkge1xyXG4gICAgICAgIGxldCByZXN1bHQgPSBzcGFjZXIuc3BhY2Uobm9kZVthdHRyXSwgb3B0aW9ucyk7XHJcbiAgICAgICAgaWYgKG5vZGVbYXR0cl0gIT09IHJlc3VsdCkge1xyXG4gICAgICAgICAgICBub2RlW2F0dHJdID0gcmVzdWx0O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgQnJvd3NlclNwYWNlcjsiLCIvKlxyXG4gKiBodHRwczovL3d3dy51bmljb2RlLm9yZy9QdWJsaWMvNS4wLjAvdWNkL1VuaWhhbi5odG1sXHJcbiAqL1xyXG4vKlxyXG4gKiBcXHUyRTgwLVxcdTJFRkYgICAgQ0pLIOmDqOmmllxyXG4gKiBcXHUyRjAwLVxcdTJGREYgICAg5bq354aZ5a2X5YW46YOo6aaWXHJcbiAqIFxcdTMwMDAtXFx1MzAzRiAgICBDSksg56ym5Y+35ZKM5qCH54K5XHJcbiAqIFxcdTMxQzAtXFx1MzFFRiAgICBDSksg56yU55S7XHJcbiAqIFxcdTMyMDAtXFx1MzJGRiAgICDlsIHpl63lvI8gQ0pLIOaWh+Wtl+WSjOaciOS7vVxyXG4gKiBcXHUzMzAwLVxcdTMzRkYgICAgQ0pLIOWFvOWuuVxyXG4gKiBcXHUzNDAwLVxcdTREQkYgICAgQ0pLIOe7n+S4gOihqOaEj+espuWPt+aJqeWxlSBBXHJcbiAqIFxcdTREQzAtXFx1NERGRiAgICDmmJPnu4/lha3ljYHlm5vljabnrKblj7dcclxuICogXFx1NEUwMC1cXHU5RkJGICAgIENKSyDnu5/kuIDooajmhI/nrKblj7dcclxuICogXFx1RjkwMC1cXHVGQUZGICAgIENKSyDlhbzlrrnosaHlvaLmloflrZdcclxuICogXFx1RkUzMC1cXHVGRTRGICAgIENKSyDlhbzlrrnlvaLlvI9cclxuICogXFx1RkYwMC1cXHVGRkVGICAgIOWFqOinkkFTQ0lJ44CB5YWo6KeS5qCH54K5XHJcbiAqL1xyXG5jb25zdCBDSksgPSAnXFx1MkU4MC1cXHUyRkRGXFx1MzFDMC1cXHVGRTRGJztcclxuY29uc3QgU1lNQk9MUyA9ICdAJj1fXFwkJVxcXlxcKlxcLSsnO1xyXG5jb25zdCBMQVRJTiA9ICdBLVphLXowLTlcXHUwMEMwLVxcdTAwRkZcXHUwMTAwLVxcdTAxN0ZcXHUwMTgwLVxcdTAyNEZcXHUxRTAwLVxcdTFFRkYnO1xyXG5jb25zdCBPTkVfT1JfTU9SRV9TUEFDRSA9ICdbIF0rJztcclxuY29uc3QgU1lNQk9MU19ORUVEX1NQQUNFX0ZPTExPV0VEID0gJ1tcXC46LD8hXSc7XHJcbmNvbnN0IE9ORV9BSksgPSBgWyR7Q0pLfV1gO1xyXG5jb25zdCBPTkVfTEFUSU4gPSBgWyR7TEFUSU59XWA7XHJcbmNvbnN0IE9ORV9MQVRJTl9MSUtFID0gYFske0xBVElOfSVdYDtcclxuY29uc3QgU1BMSVRfQkVGT1JFX1NQQUNFID0gYCg/PD0ke09ORV9MQVRJTl9MSUtFfSkoPz1bIF0qJHtPTkVfQUpLfSl8KD88PSR7T05FX0FKS30pKD89WyBdKiR7T05FX0xBVElOX0xJS0V9KWA7XHJcbmNvbnN0IFNQTElUX0FGVEVSX1NQQUNFID0gYCg/PD0ke09ORV9BSkt9WyBdKikoPz0ke09ORV9MQVRJTl9MSUtFfSl8KD88PSR7T05FX0xBVElOX0xJS0V9WyBdKikoPz0ke09ORV9BSkt9KWA7XHJcbmNvbnN0IFNQTElUX1NZTUJPTFNfTkVFRF9TUEFDRV9GT0xMT1dFRCA9IGAoPzw9JHtTWU1CT0xTX05FRURfU1BBQ0VfRk9MTE9XRUR9KSg/PSR7T05FX0FKS318JHtPTkVfTEFUSU59KWA7XHJcbmNvbnN0IFJFR0VYUF9BTllfQ0pLID0gbmV3IFJlZ0V4cChgJHtPTkVfQUpLfWApO1xyXG5jb25zdCBSRUdFWFBfRU5EU19XSVRIX1NZTUJPTFNfTkVFRF9TUEFDRV9GT0xMT1dFRCA9IG5ldyBSZWdFeHAoYCR7U1lNQk9MU19ORUVEX1NQQUNFX0ZPTExPV0VEfSRgKTtcclxuY29uc3QgUkVHRVhQX0VORFNfV0lUSF9DSktfQU5EX1NQQUNJTkcgPSBuZXcgUmVnRXhwKGAke09ORV9BSkt9JHtPTkVfT1JfTU9SRV9TUEFDRX0kYCk7XHJcbmNvbnN0IFJFR0VYUF9FTkRTX1dJVEhfTEFUSU5fQU5EX1NQQUNJTkcgPSBuZXcgUmVnRXhwKGAke09ORV9MQVRJTl9MSUtFfSR7T05FX09SX01PUkVfU1BBQ0V9JGApO1xyXG5jb25zdCBSRUdFWFBfRU5EU19XSVRIX0NKSyA9IG5ldyBSZWdFeHAoYCR7T05FX0FKS30kYCk7XHJcbmNvbnN0IFJFR0VYUF9FTkRTX1dJVEhfTEFUSU4gPSBuZXcgUmVnRXhwKGAke09ORV9MQVRJTl9MSUtFfSRgKTtcclxuY29uc3QgUkVHRVhQX1NUQVJUU19XSVRIX0NKSyA9IG5ldyBSZWdFeHAoYF4ke09ORV9BSkt9YCk7XHJcbmNvbnN0IFJFR0VYUF9TVEFSVFNfV0lUSF9MQVRJTiA9IG5ldyBSZWdFeHAoYF4ke09ORV9MQVRJTl9MSUtFfWApO1xyXG5jb25zdCBSRUdFWFBfU1BMSVRfREVGQVVMVCA9IG5ldyBSZWdFeHAoYCg/PD0ke09ORV9MQVRJTl9MSUtFfSkoPz0ke09ORV9BSkt9KXwoPzw9JHtPTkVfQUpLfSkoPz0ke09ORV9MQVRJTl9MSUtFfSl8JHtTUExJVF9TWU1CT0xTX05FRURfU1BBQ0VfRk9MTE9XRUR9YCwgJ2cnKTtcclxuY29uc3QgUkVHRVhQX1NQTElUX1NQQUNFID0gbmV3IFJlZ0V4cChgJHtTUExJVF9CRUZPUkVfU1BBQ0V9fCR7U1BMSVRfQUZURVJfU1BBQ0V9fCR7U1BMSVRfU1lNQk9MU19ORUVEX1NQQUNFX0ZPTExPV0VEfWAsICdnJyk7XHJcblxyXG5jb25zdCBERUZBVUxUX09QVElPTlMgPSB7XHJcbiAgICBzcGFjaW5nQ29udGVudDogJyAnXHJcbn07XHJcblxyXG5sZXQgZGVmYXVsdE9wdGlvbnMgPSB7fTtcclxuXHJcbmNsYXNzIFNwYWNlciB7XHJcblxyXG4gICAgY29uc3RydWN0b3Iob3B0aW9ucykge1xyXG4gICAgICAgIHRoaXMub3B0aW9ucyA9IGhhbmRsZU9wdGlvbnMob3B0aW9ucyk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGNvbmZpZyhvcHRpb25zKSB7XHJcbiAgICAgICAgb3B0aW9ucyA9IHdyYXBPcHRpb25zKG9wdGlvbnMpO1xyXG4gICAgICAgIE9iamVjdC5hc3NpZ24oZGVmYXVsdE9wdGlvbnMsIERFRkFVTFRfT1BUSU9OUywgb3B0aW9ucyk7XHJcbiAgICB9XHJcblxyXG4gICAgc3BhY2UodGV4dCwgb3B0aW9ucykge1xyXG4gICAgICAgIGxldCBhcnIgPSB0aGlzLnNwbGl0KHRleHQsIG9wdGlvbnMpO1xyXG4gICAgICAgIG9wdGlvbnMgPSB0aGlzLnJlc29sdmVPcHRpb25zKG9wdGlvbnMpO1xyXG4gICAgICAgIGlmIChvcHRpb25zLndyYXBwZXIpIHtcclxuICAgICAgICAgICAgbGV0IHJlc3VsdCA9IGFyclswXTtcclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDE7IGkgPCBhcnIubGVuZ3RoIC0gMTsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgb3BlbiA9IC9bIF0qLy50ZXN0KGFycltpICsgMV0pO1xyXG4gICAgICAgICAgICAgICAgbGV0IGNsb3NlID0gL1sgXSovLnRlc3QoYXJyW2kgLSAxXSk7XHJcbiAgICAgICAgICAgICAgICBpZiAob3Blbikge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdCArPSBvcHRpb25zLndyYXBwZXIub3BlbjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmIChjbG9zZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdCArPSBvcHRpb25zLndyYXBwZXIuY2xvc2U7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAoIW9wZW4gJiYgIWNsb3NlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0ICs9IG9wdGlvbnMud3JhcHBlci5vcGVuICsgb3B0aW9ucy53cmFwcGVyLmNsb3NlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIGFyci5qb2luKG9wdGlvbnMuc3BhY2luZ0NvbnRlbnQpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBzcGxpdCh0ZXh0LCBvcHRpb25zKSB7XHJcbiAgICAgICAgb3B0aW9ucyA9IHRoaXMucmVzb2x2ZU9wdGlvbnMob3B0aW9ucyk7XHJcbiAgICAgICAgaWYgKHR5cGVvZiB0ZXh0ID09PSAnc3RyaW5nJyAmJiBSRUdFWFBfQU5ZX0NKSy50ZXN0KHRleHQpKSB7XHJcbiAgICAgICAgICAgIGxldCBwYXR0ZXJuID0gb3B0aW9ucy5oYW5kbGVPcmlnaW5hbFNwYWNlID8gUkVHRVhQX1NQTElUX1NQQUNFIDogUkVHRVhQX1NQTElUX0RFRkFVTFQ7XHJcbiAgICAgICAgICAgIHJldHVybiB0ZXh0LnNwbGl0KHBhdHRlcm4pO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gW3RleHRdO1xyXG4gICAgfVxyXG5cclxuICAgIHJlc29sdmVPcHRpb25zKG9wdGlvbnMpIHtcclxuICAgICAgICByZXR1cm4gb3B0aW9ucyA/IGhhbmRsZU9wdGlvbnMob3B0aW9ucykgOiB0aGlzLm9wdGlvbnM7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGVuZHNXaXRoQ0pLQW5kU3BhY2luZyh0ZXh0KSB7XHJcbiAgICAgICAgcmV0dXJuIFJFR0VYUF9FTkRTX1dJVEhfQ0pLX0FORF9TUEFDSU5HLnRlc3QodGV4dCk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGVuZHNXaXRoQ0pLKHRleHQpe1xyXG4gICAgICAgIHJldHVybiBSRUdFWFBfRU5EU19XSVRIX0NKSy50ZXN0KHRleHQpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBlbmRzV2l0aExhdGluKHRleHQpe1xyXG4gICAgICAgIHJldHVybiBSRUdFWFBfRU5EU19XSVRIX0xBVElOLnRlc3QodGV4dCk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIHN0YXJ0c1dpdGhDSksodGV4dCl7XHJcbiAgICAgICAgcmV0dXJuIFJFR0VYUF9TVEFSVFNfV0lUSF9DSksudGVzdCh0ZXh0KTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgc3RhcnRzV2l0aExhdGluKHRleHQpe1xyXG4gICAgICAgIHJldHVybiBSRUdFWFBfU1RBUlRTX1dJVEhfTEFUSU4udGVzdCh0ZXh0KTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgZW5kc1dpdGhMYXRpbkFuZFNwYWNpbmcodGV4dCkge1xyXG4gICAgICAgIHJldHVybiBSRUdFWFBfRU5EU19XSVRIX0xBVElOX0FORF9TUEFDSU5HLnRlc3QodGV4dCk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGVuZHNXaXRoU3ltYm9sc05lZWRTcGFjZUZvbGxvd2VkKHRleHQpe1xyXG4gICAgICAgIHJldHVybiBSRUdFWFBfRU5EU19XSVRIX1NZTUJPTFNfTkVFRF9TUEFDRV9GT0xMT1dFRC50ZXN0KHRleHQpO1xyXG4gICAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiB3cmFwT3B0aW9ucyhvcHRpb25zKSB7XHJcbiAgICByZXR1cm4gdHlwZW9mIG9wdGlvbnMgPT09ICdzdHJpbmcnID8ge3NwYWNpbmdDb250ZW50OiBvcHRpb25zfSA6IG9wdGlvbnM7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGhhbmRsZU9wdGlvbnMob3B0aW9ucykge1xyXG4gICAgb3B0aW9ucyA9IHdyYXBPcHRpb25zKG9wdGlvbnMpO1xyXG4gICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oe30sIERFRkFVTFRfT1BUSU9OUywgZGVmYXVsdE9wdGlvbnMsIG9wdGlvbnMpO1xyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBTcGFjZXI7IiwiaW1wb3J0IEJyb3dzZXJTcGFjZXIgZnJvbSAnLi9icm93c2VyLmpzJ1xyXG5cclxuLy8gQWRkIHN1cHBvcnQgZm9yIEFNRCAoQXN5bmNocm9ub3VzIE1vZHVsZSBEZWZpbml0aW9uKSBsaWJyYXJpZXMgc3VjaCBhcyByZXF1aXJlLmpzLlxyXG5pZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XHJcbiAgICBkZWZpbmUoW10sIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIFNwYWNlcjogQnJvd3NlclNwYWNlclxyXG4gICAgICAgIH1cclxuICAgIH0pXHJcbn1cclxuLy9BZGQgc3VwcG9ydCBmb3JtIENvbW1vbkpTIGxpYnJhcmllcyBzdWNoIGFzIGJyb3dzZXJpZnkuXHJcbmlmICh0eXBlb2YgZXhwb3J0cyAhPT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgIGV4cG9ydHMuU3BhY2VyID0gQnJvd3NlclNwYWNlcjtcclxufVxyXG4vL0RlZmluZSBnbG9iYWxseSBpbiBjYXNlIEFNRCBpcyBub3QgYXZhaWxhYmxlIG9yIHVudXNlZFxyXG5pZiAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgIHdpbmRvdy5TcGFjZXIgPSBCcm93c2VyU3BhY2VyO1xyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBCcm93c2VyU3BhY2VyOyJdfQ==
