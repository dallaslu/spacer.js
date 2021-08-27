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
        if (_core2.default.endsWithCJK(preText) && _core2.default.startsWithLatin(node.textContent) || _core2.default.endsWithLatin(preText) && _core2.default.startsWithCJK(node.textContent)) {
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
 * \u31C0-\u31EF	CJK 笔画
 * \u3200-\u32FF	封闭式 CJK 文字和月份
 * \u3300-\u33FF	CJK 兼容
 * \u3400-\u4DBF	CJK 统一表意符号扩展 A
 * \u4DC0-\u4DFF	易经六十四卦符号
 * \u4E00-\u9FBF	CJK 统一表意符号
 * \uF900-\uFAFF	CJK 兼容象形文字
 * \uFE30-\uFE4F	CJK 兼容形式
 * \uFF00-\uFFEF	全角ASCII、全角标点
 */
var CJK = '\u2E80-\u2FDF\u31C0-\uFE4F';
var CJK_PATTERN = '[' + CJK + ']';
var SYMOLS = '@&=_\$%\^\*\-+';
var LATIN = 'A-Za-z0-9\xC0-\xFF\u0100-\u017F\u0180-\u024F\u1E00-\u1EFF';
var LATIN_PATTERN = '[' + LATIN + ']';
var LATIN_LIKE_PATTERN = '[' + LATIN + '%]';
var ONE_OR_MORE_SPACE = '[ ]+';
var ENDS_WITH_CJK_AND_SPACING = new RegExp('' + CJK_PATTERN + ONE_OR_MORE_SPACE + '$');
var ENDS_WITH_LATIN_AND_SPACING = new RegExp('' + LATIN_LIKE_PATTERN + ONE_OR_MORE_SPACE + '$');
var ENDS_WITH_CJK = new RegExp(CJK_PATTERN + '$');
var ENDS_WITH_LATIN = new RegExp(LATIN_LIKE_PATTERN + '$');
var STARTS_WITH_CJK = new RegExp('^' + CJK_PATTERN);
var STARTS_WITH_LATIN = new RegExp('^' + LATIN_LIKE_PATTERN);
var PATTERN_DEFAULT = new RegExp('(?<=' + LATIN_LIKE_PATTERN + ')(?=' + CJK_PATTERN + ')|(?<=' + CJK_PATTERN + ')(?=' + LATIN_LIKE_PATTERN + ')', 'g');
var PATTERN_SPACE = new RegExp('(?<=' + LATIN_LIKE_PATTERN + ')(?=[ ]*' + CJK_PATTERN + ')|(?<=' + CJK_PATTERN + ')(?=[ ]*' + LATIN_LIKE_PATTERN + ')|(?<=' + CJK_PATTERN + '[ ]*)(?=' + LATIN_LIKE_PATTERN + ')|(?<=' + LATIN_LIKE_PATTERN + '[ ]*)(?=' + CJK_PATTERN + ')', 'g');

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
                var pattern = options.handleOriginalSpace ? PATTERN_SPACE : PATTERN_DEFAULT;
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
            return ENDS_WITH_CJK_AND_SPACING.test(text);
        }
    }, {
        key: 'endsWithCJK',
        value: function endsWithCJK(text) {
            return ENDS_WITH_CJK.test(text);
        }
    }, {
        key: 'endsWithLatin',
        value: function endsWithLatin(text) {
            return ENDS_WITH_LATIN.test(text);
        }
    }, {
        key: 'startsWithCJK',
        value: function startsWithCJK(text) {
            return STARTS_WITH_CJK.test(text);
        }
    }, {
        key: 'startsWithLatin',
        value: function startsWithLatin(text) {
            return STARTS_WITH_LATIN.test(text);
        }
    }, {
        key: 'endsWithLatinAndSpacing',
        value: function endsWithLatinAndSpacing(text) {
            return ENDS_WITH_LATIN_AND_SPACING.test(text);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJidWlsZC9hc3NldHMvanMvYnJvd3Nlci5qcyIsImJ1aWxkL2Fzc2V0cy9qcy9jb3JlLmpzIiwiYnVpbGQvYXNzZXRzL2pzL3NwYWNlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7O0FDQUE7Ozs7Ozs7Ozs7OztBQUVBLElBQU0sZUFBZSx3QkFBckI7QUFDQSxJQUFNLGFBQWEsd0dBQW5CO0FBQ0EsSUFBTSxlQUFlLDRCQUFyQjs7SUFFTSxhOzs7QUFFRiwyQkFBWSxPQUFaLEVBQXFCO0FBQUE7O0FBQUEsa0lBQ1gsT0FEVzs7QUFFakIsY0FBSyxPQUFMLENBQWEsY0FBYixHQUE4QixNQUFLLE9BQUwsQ0FBYSxjQUFiLENBQTRCLE9BQTVCLENBQW9DLEdBQXBDLEVBQXlDLFFBQXpDLENBQTlCO0FBRmlCO0FBR3BCOzs7O2tDQUVTLFEsRUFBVSxPLEVBQVM7QUFBQTs7QUFDekIsdUJBQVcsT0FBTyxRQUFQLEtBQW9CLFFBQXBCLEdBQStCLFNBQVMsZ0JBQVQsQ0FBMEIsUUFBMUIsQ0FBL0IsR0FBc0UsWUFBWSxDQUFDLFNBQVMsVUFBVCxDQUFvQixDQUFwQixDQUFELENBQTdGO0FBQ0Esc0JBQVUsS0FBSyxjQUFMLENBQW9CLE9BQXBCLENBQVY7QUFDQSxvQkFBUSxjQUFSLEdBQXlCLFFBQVEsY0FBUixDQUF1QixPQUF2QixDQUErQixHQUEvQixFQUFvQyxRQUFwQyxDQUF6QjtBQUNBLGVBQUcsT0FBSCxDQUFXLElBQVgsQ0FBZ0IsUUFBaEIsRUFBMEIsYUFBSztBQUMzQiwwQkFBVSxNQUFWLEVBQWdCLENBQWhCLEVBQW1CLE9BQW5CO0FBQ0gsYUFGRDtBQUdIOzs7O0VBZHVCLGM7O0FBaUI1QixTQUFTLFNBQVQsQ0FBbUIsTUFBbkIsRUFBMkIsSUFBM0IsRUFBaUMsT0FBakMsRUFBMEM7QUFDdEMsUUFBSSxLQUFL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VztBQUNsQixlQUFPO0FBQ0gsb0JBQVE7QUFETCxTQUFQO0FBR0gsS0FKRDtBQUtIO0FBQ0Q7QUFDQSxJQUFJLE9BQU8sT0FBUCxLQUFtQixXQUF2QixFQUFvQztBQUNoQyxZQUFRLE1BQVIsR0FBaUIsaUJBQWpCO0FBQ0g7QUFDRDtBQUNBLElBQUksT0FBTyxNQUFQLEtBQWtCLFdBQXRCLEVBQW1DO0FBQy9CLFdBQU8sTUFBUCxHQUFnQixpQkFBaEI7QUFDSDs7a0JBRWMsaUIiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJpbXBvcnQgU3BhY2VyIGZyb20gJy4vY29yZS5qcydcclxuXHJcbmNvbnN0IElHTk9SRURfVEFHUyA9IC9eKHNjcmlwdHxsaW5rfHN0eWxlKSQvaTtcclxuY29uc3QgQkxPQ0tfVEFHUyA9IC9eKGRpdnxwfGgxfGgyfGgzfGg0fGg1fGg2fGJsb2NrcW91dGV8cHJlfHRleHRhcmVhfG5hdnxoZWFkZXJ8bWFpbnxmb290ZXJ8c2VjdGlvbnxzaWRiYXJ8YXNpZGV8dGFibGUpJC9pO1xyXG5jb25zdCBTUEFDSU5HX1RBR1MgPSAvXihicnxocnxpbWd8dmlkZW98YXVkaW8pJC9pO1xyXG5cclxuY2xhc3MgQnJvd3NlclNwYWNlciBleHRlbmRzIFNwYWNlciB7XHJcblxyXG4gICAgY29uc3RydWN0b3Iob3B0aW9ucykge1xyXG4gICAgICAgIHN1cGVyKG9wdGlvbnMpO1xyXG4gICAgICAgIHRoaXMub3B0aW9ucy5zcGFjaW5nQ29udGVudCA9IHRoaXMub3B0aW9ucy5zcGFjaW5nQ29udGVudC5yZXBsYWNlKCcgJywgJyZuYnNwOycpO1xyXG4gICAgfVxyXG5cclxuICAgIHNwYWNlUGFnZShlbGVtZW50cywgb3B0aW9ucykge1xyXG4gICAgICAgIGVsZW1lbnRzID0gdHlwZW9mIGVsZW1lbnRzID09PSAnc3RyaW5nJyA/IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoZWxlbWVudHMpIDogKGVsZW1lbnRzIHx8IFtkb2N1bWVudC5jaGlsZE5vZGVzWzFdXSk7XHJcbiAgICAgICAgb3B0aW9ucyA9IHRoaXMucmVzb2x2ZU9wdGlvbnMob3B0aW9ucyk7XHJcbiAgICAgICAgb3B0aW9ucy5zcGFjaW5nQ29udGVudCA9IG9wdGlvbnMuc3BhY2luZ0NvbnRlbnQucmVwbGFjZSgnICcsICcmbmJzcDsnKTtcclxuICAgICAgICBbXS5mb3JFYWNoLmNhbGwoZWxlbWVudHMsIGUgPT4ge1xyXG4gICAgICAgICAgICBzcGFjZU5vZGUodGhpcywgZSwgb3B0aW9ucyk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHNwYWNlTm9kZShzcGFjZXIsIG5vZGUsIG9wdGlvbnMpIHtcclxuICAgIGlmIChub2RlLnRhZ05hbWUgJiYgSUdOT1JFRF9UQUdTLnRlc3Qobm9kZS50YWdOYW1lKSkge1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIGxldCBvcHRpb25zTm9XcmFwcGVyID0gT2JqZWN0LmFzc2lnbih7fSwgb3B0aW9ucywge3dyYXBwZXI6IGZhbHNlfSk7XHJcbiAgICBsZXQgb3B0aW9uc05vV3JhcHBlck5vSFRNTEVudGl0eSA9IE9iamVjdC5hc3NpZ24oe30sIG9wdGlvbnMsIHtcclxuICAgICAgICB3cmFwcGVyOiBmYWxzZSxcclxuICAgICAgICBzcGFjaW5nQ29udGVudDogb3B0aW9ucy5zcGFjaW5nQ29udGVudC5yZXBsYWNlKCcmbmJzcDsnLCAnICcpXHJcbiAgICB9KTtcclxuICAgIGxldCBvcHRpb25zRWZmZWN0ID0gb3B0aW9ucztcclxuICAgIGlmIChub2RlLnBhcmVudE5vZGUgJiYgbm9kZS5wYXJlbnROb2RlLnRhZ05hbWUgPT09ICdUSVRMRScpIHtcclxuICAgICAgICBvcHRpb25zRWZmZWN0ID0gb3B0aW9uc05vV3JhcHBlck5vSFRNTEVudGl0eTtcclxuICAgIH1cclxuICAgIGlmIChub2RlLnByZXZpb3VzU2libGluZ1xyXG4gICAgICAgICYmICghbm9kZS5wcmV2aW91c1NpYmxpbmcudGFnTmFtZSB8fCAoIUJMT0NLX1RBR1MudGVzdChub2RlLnByZXZpb3VzU2libGluZy50YWdOYW1lKSAmJiAhU1BBQ0lOR19UQUdTLnRlc3Qobm9kZS5wcmV2aW91c1NpYmxpbmcudGFnTmFtZSkpKVxyXG4gICAgICAgICYmICghbm9kZS50YWdOYW1lIHx8ICghQkxPQ0tfVEFHUy50ZXN0KG5vZGUudGFnTmFtZSkgJiYgIVNQQUNJTkdfVEFHUy50ZXN0KG5vZGUudGFnTmFtZSkpKSkge1xyXG4gICAgICAgIGxldCBwcmVUZXh0ID0gbm9kZS5wcmV2aW91c1NpYmxpbmcubm9kZVR5cGUgPT09IE5vZGUuVEVYVF9OT0RFID8gbm9kZS5wcmV2aW91c1NpYmxpbmcuZGF0YSA6IG5vZGUucHJldmlvdXNTaWJsaW5nLnRleHRDb250ZW50O1xyXG4gICAgICAgIGlmIChTcGFjZXIuZW5kc1dpdGhDSksocHJlVGV4dCkgJiYgU3BhY2VyLnN0YXJ0c1dpdGhMYXRpbihub2RlLnRleHRDb250ZW50KVxyXG4gICAgICAgICAgICB8fCBTcGFjZXIuZW5kc1dpdGhMYXRpbihwcmVUZXh0KSAmJiBTcGFjZXIuc3RhcnRzV2l0aENKSyhub2RlLnRleHRDb250ZW50KSkge1xyXG4gICAgICAgICAgICBsZXQgc3BhY2VJbm5lckhUTUwgPSBvcHRpb25zRWZmZWN0LmZvcmNlVW5pZmllZFNwYWNpbmcgPyBvcHRpb25zRWZmZWN0LnNwYWNpbmdDb250ZW50IDogJyc7XHJcbiAgICAgICAgICAgIGluc2VydEJlZm9yZShjcmVhdGVOb2RlKG9wdGlvbnNFZmZlY3Qud3JhcHBlci5vcGVuICsgc3BhY2VJbm5lckhUTUwgKyBvcHRpb25zRWZmZWN0LndyYXBwZXIuY2xvc2UpLCBub2RlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKG9wdGlvbnNFZmZlY3QuaGFuZGxlT3JpZ2luYWxTcGFjZSAmJiBub2RlLnByZXZpb3VzU2libGluZy5ub2RlVHlwZSA9PT0gTm9kZS5URVhUX05PREUpIHtcclxuICAgICAgICAgICAgaWYgKFNwYWNlci5lbmRzV2l0aENKS0FuZFNwYWNpbmcocHJlVGV4dCkgJiYgU3BhY2VyLnN0YXJ0c1dpdGhMYXRpbihub2RlLnRleHRDb250ZW50KVxyXG4gICAgICAgICAgICAgICAgfHwgU3BhY2VyLmVuZHNXaXRoTGF0aW5BbmRTcGFjaW5nKHByZVRleHQpICYmIFNwYWNlci5zdGFydHNXaXRoQ0pLKG5vZGUudGV4dENvbnRlbnQpKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgcHJlRW5kU3BhY2luZyA9ICcnO1xyXG4gICAgICAgICAgICAgICAgbGV0IGFyciA9IC8oLiopKFsgXSspJC9nLm1hdGNoKG5vZGUucHJldmlvdXNTaWJsaW5nLmRhdGEpO1xyXG4gICAgICAgICAgICAgICAgbm9kZS5wcmV2aW91c1NpYmxpbmcuZGF0YSA9IGFyclsxXTtcclxuICAgICAgICAgICAgICAgIHByZUVuZFNwYWNpbmcgPSBhcnJbMl07XHJcbiAgICAgICAgICAgICAgICBsZXQgc3BhY2VJbm5lckhUTUwgPSBvcHRpb25zRWZmZWN0LmZvcmNlVW5pZmllZFNwYWNpbmcgPyBvcHRpb25zRWZmZWN0LnNwYWNpbmdDb250ZW50IDogKG9wdGlvbnNFZmZlY3Qua2VlcE9yaWdpbmFsU3BhY2UgPyBwcmVFbmRTcGFjaW5nIDogJycpO1xyXG4gICAgICAgICAgICAgICAgaW5zZXJ0QmVmb3JlKGNyZWF0ZU5vZGUob3B0aW9uc0VmZmVjdC53cmFwcGVyLm9wZW4gKyBzcGFjZUlubmVySFRNTCArIG9wdGlvbnNFZmZlY3Qud3JhcHBlci5jbG9zZSksIG5vZGUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgaWYgKG5vZGUubm9kZVR5cGUgPT09IE5vZGUuVEVYVF9OT0RFKSB7XHJcbiAgICAgICAgaWYgKG9wdGlvbnNFZmZlY3Qud3JhcHBlcikge1xyXG4gICAgICAgICAgICBsZXQgYXJyID0gc3BhY2VyLnNwbGl0KG5vZGUuZGF0YSwgb3B0aW9uc0VmZmVjdCk7XHJcbiAgICAgICAgICAgIGlmIChhcnIubGVuZ3RoID09IDEpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGFyci5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgbGV0IGlzU3BhY2luZyA9IC9eWyBdKiQvLnRlc3QoYXJyW2ldKTtcclxuICAgICAgICAgICAgICAgIGlmIChpc1NwYWNpbmcgfHwgKGkgIT0gMCAmJiAhL15bIF0qJC8udGVzdChhcnJbaSAtIDFdKSkpIHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgc3BhY2VJbm5lckhUTUwgPSBvcHRpb25zRWZmZWN0LmZvcmNlVW5pZmllZFNwYWNpbmcgPyBvcHRpb25zRWZmZWN0LnNwYWNpbmdDb250ZW50IDogKGlzU3BhY2luZyAmJiBvcHRpb25zRWZmZWN0LmtlZXBPcmlnaW5hbFNwYWNlKSA/IGFycltpXSA6ICcnO1xyXG4gICAgICAgICAgICAgICAgICAgIGluc2VydEJlZm9yZShjcmVhdGVOb2RlKG9wdGlvbnNFZmZlY3Qud3JhcHBlci5vcGVuICsgc3BhY2VJbm5lckhUTUwgKyBvcHRpb25zRWZmZWN0LndyYXBwZXIuY2xvc2UpLCBub2RlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoIWlzU3BhY2luZykge1xyXG4gICAgICAgICAgICAgICAgICAgIGluc2VydEJlZm9yZShkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShhcnJbaV0pLCBub2RlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBub2RlLnJlbW92ZSgpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGlmIChub2RlLnBhcmVudE5vZGUudGFnTmFtZSA9PT0gJ1RJVExFJykge1xyXG4gICAgICAgICAgICAgICAgc3BhY2VBdHRyaWJ1dGUoc3BhY2VyLCBub2RlLCAnZGF0YScsIG9wdGlvbnNOb1dyYXBwZXJOb0hUTUxFbnRpdHkpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgc3BhY2VBdHRyaWJ1dGUoc3BhY2VyLCBub2RlLCAnZGF0YScsIG9wdGlvbnNOb1dyYXBwZXIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybjtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgLy8gdGFnIG5hbWUgZmlsdGVyXHJcbiAgICAgICAgc3BhY2VBdHRyaWJ1dGUoc3BhY2VyLCBub2RlLCAndGl0bGUnLCBvcHRpb25zTm9XcmFwcGVyTm9IVE1MRW50aXR5KTtcclxuICAgICAgICBzcGFjZUF0dHJpYnV0ZShzcGFjZXIsIG5vZGUsICdhbHQnLCBvcHRpb25zTm9XcmFwcGVyTm9IVE1MRW50aXR5KTtcclxuICAgICAgICBzcGFjZUF0dHJpYnV0ZShzcGFjZXIsIG5vZGUsICdsYWJlbCcsIG9wdGlvbnNOb1dyYXBwZXJOb0hUTUxFbnRpdHkpO1xyXG4gICAgICAgIHNwYWNlQXR0cmlidXRlKHNwYWNlciwgbm9kZSwgJ3BsYWNlaG9sZGVyJywgb3B0aW9uc05vV3JhcHBlck5vSFRNTEVudGl0eSk7XHJcbiAgICB9XHJcbiAgICBpZiAobm9kZS5jaGlsZE5vZGVzKSB7XHJcbiAgICAgICAgbGV0IHN0YXRpY05vZGVzID0gW107XHJcbiAgICAgICAgbm9kZS5jaGlsZE5vZGVzLmZvckVhY2goY2hpbGQgPT4ge1xyXG4gICAgICAgICAgICBzdGF0aWNOb2Rlcy5wdXNoKGNoaWxkKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICBzdGF0aWNOb2Rlcy5mb3JFYWNoKGNoaWxkID0+IHtcclxuICAgICAgICAgICAgc3BhY2VOb2RlKHNwYWNlciwgY2hpbGQsIG9wdGlvbnMpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBjcmVhdGVOb2RlKGh0bWwpIHtcclxuICAgIGxldCBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgIGRpdi5pbm5lckhUTUwgPSBodG1sO1xyXG4gICAgcmV0dXJuIGRpdi5maXJzdENoaWxkO1xyXG59XHJcblxyXG5mdW5jdGlvbiBpbnNlcnRCZWZvcmUobmV3Tm9kZSwgbm9kZSkge1xyXG4gICAgaWYgKG5vZGUudGFnTmFtZSAhPT0gJ0hUTUwnICYmIG5vZGUucGFyZW50Tm9kZSAmJiBub2RlLnBhcmVudE5vZGUudGFnTmFtZSAhPT0gJ0hUTUwnKSB7XHJcbiAgICAgICAgbm9kZS5wYXJlbnROb2RlLmluc2VydEJlZm9yZShuZXdOb2RlLCBub2RlKTtcclxuICAgIH1cclxufVxyXG5cclxuZnVuY3Rpb24gc3BhY2VBdHRyaWJ1dGUoc3BhY2VyLCBub2RlLCBhdHRyLCBvcHRpb25zKSB7XHJcbiAgICBpZiAobm9kZVthdHRyXSkge1xyXG4gICAgICAgIGxldCByZXN1bHQgPSBzcGFjZXIuc3BhY2Uobm9kZVthdHRyXSwgb3B0aW9ucyk7XHJcbiAgICAgICAgaWYgKG5vZGVbYXR0cl0gIT09IHJlc3VsdCkge1xyXG4gICAgICAgICAgICBub2RlW2F0dHJdID0gcmVzdWx0O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgQnJvd3NlclNwYWNlcjsiLCIvKlxyXG4gKiBodHRwczovL3d3dy51bmljb2RlLm9yZy9QdWJsaWMvNS4wLjAvdWNkL1VuaWhhbi5odG1sXHJcbiAqL1xyXG4vKlxyXG4gKiBcXHUyRTgwLVxcdTJFRkYgICAgQ0pLIOmDqOmmllxyXG4gKiBcXHUyRjAwLVxcdTJGREYgICAg5bq354aZ5a2X5YW46YOo6aaWXHJcbiAqIFxcdTMwMDAtXFx1MzAzRiAgICBDSksg56ym5Y+35ZKM5qCH54K5XHJcbiAqIFxcdTMxQzAtXFx1MzFFRlx0Q0pLIOeslOeUu1xyXG4gKiBcXHUzMjAwLVxcdTMyRkZcdOWwgemXreW8jyBDSksg5paH5a2X5ZKM5pyI5Lu9XHJcbiAqIFxcdTMzMDAtXFx1MzNGRlx0Q0pLIOWFvOWuuVxyXG4gKiBcXHUzNDAwLVxcdTREQkZcdENKSyDnu5/kuIDooajmhI/nrKblj7fmianlsZUgQVxyXG4gKiBcXHU0REMwLVxcdTRERkZcdOaYk+e7j+WFreWNgeWbm+WNpuespuWPt1xyXG4gKiBcXHU0RTAwLVxcdTlGQkZcdENKSyDnu5/kuIDooajmhI/nrKblj7dcclxuICogXFx1RjkwMC1cXHVGQUZGXHRDSksg5YW85a656LGh5b2i5paH5a2XXHJcbiAqIFxcdUZFMzAtXFx1RkU0Rlx0Q0pLIOWFvOWuueW9ouW8j1xyXG4gKiBcXHVGRjAwLVxcdUZGRUZcdOWFqOinkkFTQ0lJ44CB5YWo6KeS5qCH54K5XHJcbiAqL1xyXG5jb25zdCBDSksgPSAnXFx1MkU4MC1cXHUyRkRGXFx1MzFDMC1cXHVGRTRGJztcclxuY29uc3QgQ0pLX1BBVFRFUk4gPSBgWyR7Q0pLfV1gO1xyXG5jb25zdCBTWU1PTFMgPSAnQCY9X1xcJCVcXF5cXCpcXC0rJztcclxuY29uc3QgTEFUSU4gPSAnQS1aYS16MC05XFx1MDBDMC1cXHUwMEZGXFx1MDEwMC1cXHUwMTdGXFx1MDE4MC1cXHUwMjRGXFx1MUUwMC1cXHUxRUZGJztcclxuY29uc3QgTEFUSU5fUEFUVEVSTiA9IGBbJHtMQVRJTn1dYDtcclxuY29uc3QgTEFUSU5fTElLRV9QQVRURVJOID0gYFske0xBVElOfSVdYDtcclxuY29uc3QgT05FX09SX01PUkVfU1BBQ0UgPSAnWyBdKyc7XHJcbmNvbnN0IEVORFNfV0lUSF9DSktfQU5EX1NQQUNJTkcgPSBuZXcgUmVnRXhwKGAke0NKS19QQVRURVJOfSR7T05FX09SX01PUkVfU1BBQ0V9JGApO1xyXG5jb25zdCBFTkRTX1dJVEhfTEFUSU5fQU5EX1NQQUNJTkcgPSBuZXcgUmVnRXhwKGAke0xBVElOX0xJS0VfUEFUVEVSTn0ke09ORV9PUl9NT1JFX1NQQUNFfSRgKTtcclxuY29uc3QgRU5EU19XSVRIX0NKSyA9IG5ldyBSZWdFeHAoYCR7Q0pLX1BBVFRFUk59JGApO1xyXG5jb25zdCBFTkRTX1dJVEhfTEFUSU4gPSBuZXcgUmVnRXhwKGAke0xBVElOX0xJS0VfUEFUVEVSTn0kYCk7XHJcbmNvbnN0IFNUQVJUU19XSVRIX0NKSyA9IG5ldyBSZWdFeHAoYF4ke0NKS19QQVRURVJOfWApO1xyXG5jb25zdCBTVEFSVFNfV0lUSF9MQVRJTiA9IG5ldyBSZWdFeHAoYF4ke0xBVElOX0xJS0VfUEFUVEVSTn1gKTtcclxuY29uc3QgUEFUVEVSTl9ERUZBVUxUID0gbmV3IFJlZ0V4cChgKD88PSR7TEFUSU5fTElLRV9QQVRURVJOfSkoPz0ke0NKS19QQVRURVJOfSl8KD88PSR7Q0pLX1BBVFRFUk59KSg/PSR7TEFUSU5fTElLRV9QQVRURVJOfSlgLCAnZycpO1xyXG5jb25zdCBQQVRURVJOX1NQQUNFID0gbmV3IFJlZ0V4cChgKD88PSR7TEFUSU5fTElLRV9QQVRURVJOfSkoPz1bIF0qJHtDSktfUEFUVEVSTn0pfCg/PD0ke0NKS19QQVRURVJOfSkoPz1bIF0qJHtMQVRJTl9MSUtFX1BBVFRFUk59KXwoPzw9JHtDSktfUEFUVEVSTn1bIF0qKSg/PSR7TEFUSU5fTElLRV9QQVRURVJOfSl8KD88PSR7TEFUSU5fTElLRV9QQVRURVJOfVsgXSopKD89JHtDSktfUEFUVEVSTn0pYCwgJ2cnKTtcclxuXHJcbmNvbnN0IERFRkFVTFRfT1BUSU9OUyA9IHtcclxuICAgIHNwYWNpbmdDb250ZW50OiAnICdcclxufTtcclxuXHJcbmxldCBkZWZhdWx0T3B0aW9ucyA9IHt9O1xyXG5cclxuY2xhc3MgU3BhY2VyIHtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihvcHRpb25zKSB7XHJcbiAgICAgICAgdGhpcy5vcHRpb25zID0gaGFuZGxlT3B0aW9ucyhvcHRpb25zKTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgY29uZmlnKG9wdGlvbnMpIHtcclxuICAgICAgICBvcHRpb25zID0gd3JhcE9wdGlvbnMob3B0aW9ucyk7XHJcbiAgICAgICAgT2JqZWN0LmFzc2lnbihkZWZhdWx0T3B0aW9ucywgREVGQVVMVF9PUFRJT05TLCBvcHRpb25zKTtcclxuICAgIH1cclxuXHJcbiAgICBzcGFjZSh0ZXh0LCBvcHRpb25zKSB7XHJcbiAgICAgICAgbGV0IGFyciA9IHRoaXMuc3BsaXQodGV4dCwgb3B0aW9ucyk7XHJcbiAgICAgICAgb3B0aW9ucyA9IHRoaXMucmVzb2x2ZU9wdGlvbnMob3B0aW9ucyk7XHJcbiAgICAgICAgaWYgKG9wdGlvbnMud3JhcHBlcikge1xyXG4gICAgICAgICAgICBsZXQgcmVzdWx0ID0gYXJyWzBdO1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMTsgaSA8IGFyci5sZW5ndGggLSAxOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGxldCBvcGVuID0gL1sgXSovLnRlc3QoYXJyW2kgKyAxXSk7XHJcbiAgICAgICAgICAgICAgICBsZXQgY2xvc2UgPSAvWyBdKi8udGVzdChhcnJbaSAtIDFdKTtcclxuICAgICAgICAgICAgICAgIGlmIChvcGVuKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0ICs9IG9wdGlvbnMud3JhcHBlci5vcGVuO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKGNsb3NlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0ICs9IG9wdGlvbnMud3JhcHBlci5jbG9zZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmICghb3BlbiAmJiAhY2xvc2UpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXN1bHQgKz0gb3B0aW9ucy53cmFwcGVyLm9wZW4gKyBvcHRpb25zLndyYXBwZXIuY2xvc2U7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gYXJyLmpvaW4ob3B0aW9ucy5zcGFjaW5nQ29udGVudCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHNwbGl0KHRleHQsIG9wdGlvbnMpIHtcclxuICAgICAgICBvcHRpb25zID0gdGhpcy5yZXNvbHZlT3B0aW9ucyhvcHRpb25zKTtcclxuICAgICAgICBpZiAodHlwZW9mIHRleHQgPT09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgICAgIGxldCBwYXR0ZXJuID0gb3B0aW9ucy5oYW5kbGVPcmlnaW5hbFNwYWNlID8gUEFUVEVSTl9TUEFDRSA6IFBBVFRFUk5fREVGQVVMVDtcclxuICAgICAgICAgICAgcmV0dXJuIHRleHQuc3BsaXQocGF0dGVybik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBbdGV4dF07XHJcbiAgICB9XHJcblxyXG4gICAgcmVzb2x2ZU9wdGlvbnMob3B0aW9ucykge1xyXG4gICAgICAgIHJldHVybiBvcHRpb25zID8gaGFuZGxlT3B0aW9ucyhvcHRpb25zKSA6IHRoaXMub3B0aW9ucztcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgZW5kc1dpdGhDSktBbmRTcGFjaW5nKHRleHQpIHtcclxuICAgICAgICByZXR1cm4gRU5EU19XSVRIX0NKS19BTkRfU1BBQ0lORy50ZXN0KHRleHQpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBlbmRzV2l0aENKSyh0ZXh0KXtcclxuICAgICAgICByZXR1cm4gRU5EU19XSVRIX0NKSy50ZXN0KHRleHQpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBlbmRzV2l0aExhdGluKHRleHQpe1xyXG4gICAgICAgIHJldHVybiBFTkRTX1dJVEhfTEFUSU4udGVzdCh0ZXh0KTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgc3RhcnRzV2l0aENKSyh0ZXh0KXtcclxuICAgICAgICByZXR1cm4gU1RBUlRTX1dJVEhfQ0pLLnRlc3QodGV4dCk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIHN0YXJ0c1dpdGhMYXRpbih0ZXh0KXtcclxuICAgICAgICByZXR1cm4gU1RBUlRTX1dJVEhfTEFUSU4udGVzdCh0ZXh0KTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgZW5kc1dpdGhMYXRpbkFuZFNwYWNpbmcodGV4dCkge1xyXG4gICAgICAgIHJldHVybiBFTkRTX1dJVEhfTEFUSU5fQU5EX1NQQUNJTkcudGVzdCh0ZXh0KTtcclxuICAgIH1cclxufVxyXG5cclxuZnVuY3Rpb24gd3JhcE9wdGlvbnMob3B0aW9ucykge1xyXG4gICAgcmV0dXJuIHR5cGVvZiBvcHRpb25zID09PSAnc3RyaW5nJyA/IHtzcGFjaW5nQ29udGVudDogb3B0aW9uc30gOiBvcHRpb25zO1xyXG59XHJcblxyXG5mdW5jdGlvbiBoYW5kbGVPcHRpb25zKG9wdGlvbnMpIHtcclxuICAgIG9wdGlvbnMgPSB3cmFwT3B0aW9ucyhvcHRpb25zKTtcclxuICAgIHJldHVybiBPYmplY3QuYXNzaWduKHt9LCBERUZBVUxUX09QVElPTlMsIGRlZmF1bHRPcHRpb25zLCBvcHRpb25zKTtcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgU3BhY2VyOyIsImltcG9ydCBCcm93c2VyU3BhY2VyIGZyb20gJy4vYnJvd3Nlci5qcydcclxuXHJcbi8vIEFkZCBzdXBwb3J0IGZvciBBTUQgKEFzeW5jaHJvbm91cyBNb2R1bGUgRGVmaW5pdGlvbikgbGlicmFyaWVzIHN1Y2ggYXMgcmVxdWlyZS5qcy5cclxuaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkge1xyXG4gICAgZGVmaW5lKFtdLCBmdW5jdGlvbigpIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBTcGFjZXI6IEJyb3dzZXJTcGFjZXJcclxuICAgICAgICB9XHJcbiAgICB9KVxyXG59XHJcbi8vQWRkIHN1cHBvcnQgZm9ybSBDb21tb25KUyBsaWJyYXJpZXMgc3VjaCBhcyBicm93c2VyaWZ5LlxyXG5pZiAodHlwZW9mIGV4cG9ydHMgIT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICBleHBvcnRzLlNwYWNlciA9IEJyb3dzZXJTcGFjZXI7XHJcbn1cclxuLy9EZWZpbmUgZ2xvYmFsbHkgaW4gY2FzZSBBTUQgaXMgbm90IGF2YWlsYWJsZSBvciB1bnVzZWRcclxuaWYgKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICB3aW5kb3cuU3BhY2VyID0gQnJvd3NlclNwYWNlcjtcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgQnJvd3NlclNwYWNlcjsiXX0=
