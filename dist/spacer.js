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
    if (node.previousSibling) {
        var preText = node.previousSibling.nodeType === Node.TEXT_NODE ? node.previousSibling.data : node.previousSibling.textContent;
        if (_core2.default.endsWithCJK(preText) && _core2.default.startsWithLatin(node.textContent) || _core2.default.endsWithLatin(preText) && _core2.default.startsWithCJK(node.textContent)) {
            var spaceInnerHTML = optionsEffect.forceUnifiedSpacing ? optionsEffect.spacingContent : '';
            node.parentNode.insertBefore(createNode(optionsEffect.wrapper.open + spaceInnerHTML + optionsEffect.wrapper.close), node);
        }
        if (optionsEffect.handleOriginalSpace && node.previousSibling.nodeType === Node.TEXT_NODE) {
            if (_core2.default.endsWithCJKAndSpacing(preText) && _core2.default.startsWithLatin(node.textContent) || _core2.default.endsWithLatinAndSpacing(preText) && _core2.default.startsWithCJK(node.textContent)) {
                var preEndSpacing = '';
                var arr = /(.*)([ ]+)$/g.match(node.previousSibling.data);
                node.previousSibling.data = arr[1];
                preEndSpacing = arr[2];
                var _spaceInnerHTML = optionsEffect.forceUnifiedSpacing ? optionsEffect.spacingContent : optionsEffect.keepOriginalSpace ? preEndSpacing : '';
                node.parentNode.insertBefore(createNode(optionsEffect.wrapper.open + _spaceInnerHTML + optionsEffect.wrapper.close), node);
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
                    node.parentNode.insertBefore(createNode(optionsEffect.wrapper.open + _spaceInnerHTML2 + optionsEffect.wrapper.close), node);
                }

                if (!isSpacing) {
                    node.parentNode.insertBefore(document.createTextNode(_arr[i]), node);
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

var CJK = '\u2E80-\uFE4F';
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJidWlsZC9hc3NldHMvanMvYnJvd3Nlci5qcyIsImJ1aWxkL2Fzc2V0cy9qcy9jb3JlLmpzIiwiYnVpbGQvYXNzZXRzL2pzL3NwYWNlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7O0FDQUE7Ozs7Ozs7Ozs7OztBQUVBLElBQU0sZUFBZSx3QkFBckI7O0lBRU0sYTs7O0FBRUYsMkJBQVksT0FBWixFQUFxQjtBQUFBOztBQUFBLGtJQUNYLE9BRFc7O0FBRWpCLGNBQUssT0FBTCxDQUFhLGNBQWIsR0FBOEIsTUFBSyxPQUFMLENBQWEsY0FBYixDQUE0QixPQUE1QixDQUFvQyxHQUFwQyxFQUF5QyxRQUF6QyxDQUE5QjtBQUZpQjtBQUdwQjs7OztrQ0FFUyxRLEVBQVUsTyxFQUFTO0FBQUE7O0FBQ3pCLHVCQUFXLE9BQU8sUUFBUCxLQUFvQixRQUFwQixHQUErQixTQUFTLGdCQUFULENBQTBCLFFBQTFCLENBQS9CLEdBQXNFLFlBQVksQ0FBQyxTQUFTLFVBQVQsQ0FBb0IsQ0FBcEIsQ0FBRCxDQUE3RjtBQUNBLHNCQUFVLEtBQUssY0FBTCxDQUFvQixPQUFwQixDQUFWO0FBQ0Esb0JBQVEsY0FBUixHQUF5QixRQUFRLGNBQVIsQ0FBdUIsT0FBdkIsQ0FBK0IsR0FBL0IsRUFBb0MsUUFBcEMsQ0FBekI7QUFDQSxlQUFHLE9BQUgsQ0FBVyxJQUFYLENBQWdCLFFBQWhCLEVBQTBCLGFBQUs7QUFDM0IsMEJBQVUsTUFBVixFQUFnQixDQUFoQixFQUFtQixPQUFuQjtBQUNILGFBRkQ7QUFHSDs7OztFQWR1QixjOztBQWlCNUIsU0FBUyxTQUFULENBQW1CLE1BQW5CLEVBQTJCLElBQTNCLEVBQWlDLE9BQWpDLEVBQTBDO0FBQ3RDLFFBQUksS0FBSyxPQUFMLElBQWdCLGFBQWEsSUFBYixDQUFrQixLQUFLLE9BQXZCLENBQXBC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O0FBQ3hCLG1CQUFPLGtCQUFrQixJQUFsQixDQUF1QixJQUF2QixDQUFQO0FBQ0g7OztnREFFOEIsSSxFQUFNO0FBQ2pDLG1CQUFPLDRCQUE0QixJQUE1QixDQUFpQyxJQUFqQyxDQUFQO0FBQ0g7Ozs7OztBQUdMLFNBQVMsV0FBVCxDQUFxQixPQUFyQixFQUE4QjtBQUMxQixXQUFPLE9BQU8sT0FBUCxLQUFtQixRQUFuQixHQUE4QixFQUFDLGdCQUFnQixPQUFqQixFQUE5QixHQUEwRCxPQUFqRTtBQUNIOztBQUVELFNBQVMsYUFBVCxDQUF1QixPQUF2QixFQUFnQztBQUM1QixjQUFVLFlBQVksT0FBWixDQUFWO0FBQ0EsV0FBTyxPQUFPLE1BQVAsQ0FBYyxFQUFkLEVBQWtCLGVBQWxCLEVBQW1DLGNBQW5DLEVBQW1ELE9BQW5ELENBQVA7QUFDSDs7a0JBRWMsTTs7Ozs7Ozs7O0FDM0dmOzs7Ozs7QUFFQTtBQUNBLElBQUksT0FBTyxNQUFQLEtBQWtCLFVBQWxCLElBQWdDLE9BQU8sR0FBM0MsRUFBZ0Q7QUFDNUMsV0FBTyxFQUFQLEVBQVcsWUFBVztBQUNsQixlQUFPO0FBQ0gsb0JBQVE7QUFETCxTQUFQO0FBR0gsS0FKRDtBQUtIO0FBQ0Q7QUFDQSxJQUFJLE9BQU8sT0FBUCxLQUFtQixXQUF2QixFQUFvQztBQUNoQyxZQUFRLE1BQVIsR0FBaUIsaUJBQWpCO0FBQ0g7QUFDRDtBQUNBLElBQUksT0FBTyxNQUFQLEtBQWtCLFdBQXRCLEVBQW1DO0FBQy9CLFdBQU8sTUFBUCxHQUFnQixpQkFBaEI7QUFDSDs7a0JBRWMsaUIiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJpbXBvcnQgU3BhY2VyIGZyb20gJy4vY29yZS5qcydcclxuXHJcbmNvbnN0IElHTk9SRURfVEFHUyA9IC9eKHNjcmlwdHxsaW5rfHN0eWxlKSQvaTtcclxuXHJcbmNsYXNzIEJyb3dzZXJTcGFjZXIgZXh0ZW5kcyBTcGFjZXIge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcclxuICAgICAgICBzdXBlcihvcHRpb25zKTtcclxuICAgICAgICB0aGlzLm9wdGlvbnMuc3BhY2luZ0NvbnRlbnQgPSB0aGlzLm9wdGlvbnMuc3BhY2luZ0NvbnRlbnQucmVwbGFjZSgnICcsICcmbmJzcDsnKTtcclxuICAgIH1cclxuXHJcbiAgICBzcGFjZVBhZ2UoZWxlbWVudHMsIG9wdGlvbnMpIHtcclxuICAgICAgICBlbGVtZW50cyA9IHR5cGVvZiBlbGVtZW50cyA9PT0gJ3N0cmluZycgPyBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKGVsZW1lbnRzKSA6IChlbGVtZW50cyB8fCBbZG9jdW1lbnQuY2hpbGROb2Rlc1sxXV0pO1xyXG4gICAgICAgIG9wdGlvbnMgPSB0aGlzLnJlc29sdmVPcHRpb25zKG9wdGlvbnMpO1xyXG4gICAgICAgIG9wdGlvbnMuc3BhY2luZ0NvbnRlbnQgPSBvcHRpb25zLnNwYWNpbmdDb250ZW50LnJlcGxhY2UoJyAnLCAnJm5ic3A7Jyk7XHJcbiAgICAgICAgW10uZm9yRWFjaC5jYWxsKGVsZW1lbnRzLCBlID0+IHtcclxuICAgICAgICAgICAgc3BhY2VOb2RlKHRoaXMsIGUsIG9wdGlvbnMpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBzcGFjZU5vZGUoc3BhY2VyLCBub2RlLCBvcHRpb25zKSB7XHJcbiAgICBpZiAobm9kZS50YWdOYW1lICYmIElHTk9SRURfVEFHUy50ZXN0KG5vZGUudGFnTmFtZSkpIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICBsZXQgb3B0aW9uc05vV3JhcHBlciA9IE9iamVjdC5hc3NpZ24oe30sIG9wdGlvbnMsIHt3cmFwcGVyOiBmYWxzZX0pO1xyXG4gICAgbGV0IG9wdGlvbnNOb1dyYXBwZXJOb0hUTUxFbnRpdHkgPSBPYmplY3QuYXNzaWduKHt9LCBvcHRpb25zLCB7XHJcbiAgICAgICAgd3JhcHBlcjogZmFsc2UsXHJcbiAgICAgICAgc3BhY2luZ0NvbnRlbnQ6IG9wdGlvbnMuc3BhY2luZ0NvbnRlbnQucmVwbGFjZSgnJm5ic3A7JywgJyAnKVxyXG4gICAgfSk7XHJcbiAgICBsZXQgb3B0aW9uc0VmZmVjdCA9IG9wdGlvbnM7XHJcbiAgICBpZiAobm9kZS5wYXJlbnROb2RlICYmIG5vZGUucGFyZW50Tm9kZS50YWdOYW1lID09PSAnVElUTEUnKSB7XHJcbiAgICAgICAgb3B0aW9uc0VmZmVjdCA9IG9wdGlvbnNOb1dyYXBwZXJOb0hUTUxFbnRpdHk7XHJcbiAgICB9XHJcbiAgICBpZiAobm9kZS5wcmV2aW91c1NpYmxpbmcpIHtcclxuICAgICAgICBsZXQgcHJlVGV4dCA9IG5vZGUucHJldmlvdXNTaWJsaW5nLm5vZGVUeXBlID09PSBOb2RlLlRFWFRfTk9ERSA/IG5vZGUucHJldmlvdXNTaWJsaW5nLmRhdGEgOiBub2RlLnByZXZpb3VzU2libGluZy50ZXh0Q29udGVudDtcclxuICAgICAgICBpZiAoU3BhY2VyLmVuZHNXaXRoQ0pLKHByZVRleHQpICYmIFNwYWNlci5zdGFydHNXaXRoTGF0aW4obm9kZS50ZXh0Q29udGVudClcclxuICAgICAgICAgICAgfHwgU3BhY2VyLmVuZHNXaXRoTGF0aW4ocHJlVGV4dCkgJiYgU3BhY2VyLnN0YXJ0c1dpdGhDSksobm9kZS50ZXh0Q29udGVudCkpIHtcclxuICAgICAgICAgICAgbGV0IHNwYWNlSW5uZXJIVE1MID0gb3B0aW9uc0VmZmVjdC5mb3JjZVVuaWZpZWRTcGFjaW5nID8gb3B0aW9uc0VmZmVjdC5zcGFjaW5nQ29udGVudCA6ICcnO1xyXG4gICAgICAgICAgICBub2RlLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKGNyZWF0ZU5vZGUob3B0aW9uc0VmZmVjdC53cmFwcGVyLm9wZW4gKyBzcGFjZUlubmVySFRNTCArIG9wdGlvbnNFZmZlY3Qud3JhcHBlci5jbG9zZSksIG5vZGUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAob3B0aW9uc0VmZmVjdC5oYW5kbGVPcmlnaW5hbFNwYWNlICYmIG5vZGUucHJldmlvdXNTaWJsaW5nLm5vZGVUeXBlID09PSBOb2RlLlRFWFRfTk9ERSkge1xyXG4gICAgICAgICAgICBpZiAoU3BhY2VyLmVuZHNXaXRoQ0pLQW5kU3BhY2luZyhwcmVUZXh0KSAmJiBTcGFjZXIuc3RhcnRzV2l0aExhdGluKG5vZGUudGV4dENvbnRlbnQpXHJcbiAgICAgICAgICAgICAgICB8fCBTcGFjZXIuZW5kc1dpdGhMYXRpbkFuZFNwYWNpbmcocHJlVGV4dCkgJiYgU3BhY2VyLnN0YXJ0c1dpdGhDSksobm9kZS50ZXh0Q29udGVudCkpIHtcclxuICAgICAgICAgICAgICAgIGxldCBwcmVFbmRTcGFjaW5nID0gJyc7XHJcbiAgICAgICAgICAgICAgICBsZXQgYXJyID0gLyguKikoWyBdKykkL2cubWF0Y2gobm9kZS5wcmV2aW91c1NpYmxpbmcuZGF0YSk7XHJcbiAgICAgICAgICAgICAgICBub2RlLnByZXZpb3VzU2libGluZy5kYXRhID0gYXJyWzFdO1xyXG4gICAgICAgICAgICAgICAgcHJlRW5kU3BhY2luZyA9IGFyclsyXTtcclxuICAgICAgICAgICAgICAgIGxldCBzcGFjZUlubmVySFRNTCA9IG9wdGlvbnNFZmZlY3QuZm9yY2VVbmlmaWVkU3BhY2luZyA/IG9wdGlvbnNFZmZlY3Quc3BhY2luZ0NvbnRlbnQgOiAob3B0aW9uc0VmZmVjdC5rZWVwT3JpZ2luYWxTcGFjZSA/IHByZUVuZFNwYWNpbmcgOiAnJyk7XHJcbiAgICAgICAgICAgICAgICBub2RlLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKGNyZWF0ZU5vZGUob3B0aW9uc0VmZmVjdC53cmFwcGVyLm9wZW4gKyBzcGFjZUlubmVySFRNTCArIG9wdGlvbnNFZmZlY3Qud3JhcHBlci5jbG9zZSksIG5vZGUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgaWYgKG5vZGUubm9kZVR5cGUgPT09IE5vZGUuVEVYVF9OT0RFKSB7XHJcbiAgICAgICAgaWYgKG9wdGlvbnNFZmZlY3Qud3JhcHBlcikge1xyXG4gICAgICAgICAgICBsZXQgYXJyID0gc3BhY2VyLnNwbGl0KG5vZGUuZGF0YSwgb3B0aW9uc0VmZmVjdCk7XHJcbiAgICAgICAgICAgIGlmIChhcnIubGVuZ3RoID09IDEpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGFyci5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgbGV0IGlzU3BhY2luZyA9IC9eWyBdKiQvLnRlc3QoYXJyW2ldKTtcclxuICAgICAgICAgICAgICAgIGlmIChpc1NwYWNpbmcgfHwgKGkgIT0gMCAmJiAhL15bIF0qJC8udGVzdChhcnJbaSAtIDFdKSkpIHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgc3BhY2VJbm5lckhUTUwgPSBvcHRpb25zRWZmZWN0LmZvcmNlVW5pZmllZFNwYWNpbmcgPyBvcHRpb25zRWZmZWN0LnNwYWNpbmdDb250ZW50IDogKGlzU3BhY2luZyAmJiBvcHRpb25zRWZmZWN0LmtlZXBPcmlnaW5hbFNwYWNlKSA/IGFycltpXSA6ICcnO1xyXG4gICAgICAgICAgICAgICAgICAgIG5vZGUucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUoY3JlYXRlTm9kZShvcHRpb25zRWZmZWN0LndyYXBwZXIub3BlbiArIHNwYWNlSW5uZXJIVE1MICsgb3B0aW9uc0VmZmVjdC53cmFwcGVyLmNsb3NlKSwgbm9kZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKCFpc1NwYWNpbmcpIHtcclxuICAgICAgICAgICAgICAgICAgICBub2RlLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGFycltpXSksIG5vZGUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIG5vZGUucmVtb3ZlKCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgaWYgKG5vZGUucGFyZW50Tm9kZS50YWdOYW1lID09PSAnVElUTEUnKSB7XHJcbiAgICAgICAgICAgICAgICBzcGFjZUF0dHJpYnV0ZShzcGFjZXIsIG5vZGUsICdkYXRhJywgb3B0aW9uc05vV3JhcHBlck5vSFRNTEVudGl0eSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBzcGFjZUF0dHJpYnV0ZShzcGFjZXIsIG5vZGUsICdkYXRhJywgb3B0aW9uc05vV3JhcHBlcik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICAvLyB0YWcgbmFtZSBmaWx0ZXJcclxuICAgICAgICBzcGFjZUF0dHJpYnV0ZShzcGFjZXIsIG5vZGUsICd0aXRsZScsIG9wdGlvbnNOb1dyYXBwZXJOb0hUTUxFbnRpdHkpO1xyXG4gICAgICAgIHNwYWNlQXR0cmlidXRlKHNwYWNlciwgbm9kZSwgJ2FsdCcsIG9wdGlvbnNOb1dyYXBwZXJOb0hUTUxFbnRpdHkpO1xyXG4gICAgICAgIHNwYWNlQXR0cmlidXRlKHNwYWNlciwgbm9kZSwgJ2xhYmVsJywgb3B0aW9uc05vV3JhcHBlck5vSFRNTEVudGl0eSk7XHJcbiAgICAgICAgc3BhY2VBdHRyaWJ1dGUoc3BhY2VyLCBub2RlLCAncGxhY2Vob2xkZXInLCBvcHRpb25zTm9XcmFwcGVyTm9IVE1MRW50aXR5KTtcclxuICAgIH1cclxuICAgIGlmIChub2RlLmNoaWxkTm9kZXMpIHtcclxuICAgICAgICBsZXQgc3RhdGljTm9kZXMgPSBbXTtcclxuICAgICAgICBub2RlLmNoaWxkTm9kZXMuZm9yRWFjaChjaGlsZCA9PiB7XHJcbiAgICAgICAgICAgIHN0YXRpY05vZGVzLnB1c2goY2hpbGQpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHN0YXRpY05vZGVzLmZvckVhY2goY2hpbGQgPT4ge1xyXG4gICAgICAgICAgICBzcGFjZU5vZGUoc3BhY2VyLCBjaGlsZCwgb3B0aW9ucyk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNyZWF0ZU5vZGUoaHRtbCkge1xyXG4gICAgbGV0IGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgZGl2LmlubmVySFRNTCA9IGh0bWw7XHJcbiAgICByZXR1cm4gZGl2LmZpcnN0Q2hpbGQ7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHNwYWNlQXR0cmlidXRlKHNwYWNlciwgbm9kZSwgYXR0ciwgb3B0aW9ucykge1xyXG4gICAgaWYgKG5vZGVbYXR0cl0pIHtcclxuICAgICAgICBsZXQgcmVzdWx0ID0gc3BhY2VyLnNwYWNlKG5vZGVbYXR0cl0sIG9wdGlvbnMpO1xyXG4gICAgICAgIGlmIChub2RlW2F0dHJdICE9PSByZXN1bHQpIHtcclxuICAgICAgICAgICAgbm9kZVthdHRyXSA9IHJlc3VsdDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IEJyb3dzZXJTcGFjZXI7IiwiLypcclxuICogaHR0cHM6Ly93d3cudW5pY29kZS5vcmcvUHVibGljLzUuMC4wL3VjZC9VbmloYW4uaHRtbFxyXG4gKi9cclxuXHJcbmNvbnN0IENKSyA9ICdcXHUyRTgwLVxcdUZFNEYnO1xyXG5jb25zdCBDSktfUEFUVEVSTiA9IGBbJHtDSkt9XWA7XHJcbmNvbnN0IFNZTU9MUyA9ICdAJj1fXFwkJVxcXlxcKlxcLSsnO1xyXG5jb25zdCBMQVRJTiA9ICdBLVphLXowLTlcXHUwMEMwLVxcdTAwRkZcXHUwMTAwLVxcdTAxN0ZcXHUwMTgwLVxcdTAyNEZcXHUxRTAwLVxcdTFFRkYnO1xyXG5jb25zdCBMQVRJTl9QQVRURVJOID0gYFske0xBVElOfV1gO1xyXG5jb25zdCBMQVRJTl9MSUtFX1BBVFRFUk4gPSBgWyR7TEFUSU59JV1gO1xyXG5jb25zdCBPTkVfT1JfTU9SRV9TUEFDRSA9ICdbIF0rJztcclxuY29uc3QgRU5EU19XSVRIX0NKS19BTkRfU1BBQ0lORyA9IG5ldyBSZWdFeHAoYCR7Q0pLX1BBVFRFUk59JHtPTkVfT1JfTU9SRV9TUEFDRX0kYCk7XHJcbmNvbnN0IEVORFNfV0lUSF9MQVRJTl9BTkRfU1BBQ0lORyA9IG5ldyBSZWdFeHAoYCR7TEFUSU5fTElLRV9QQVRURVJOfSR7T05FX09SX01PUkVfU1BBQ0V9JGApO1xyXG5jb25zdCBFTkRTX1dJVEhfQ0pLID0gbmV3IFJlZ0V4cChgJHtDSktfUEFUVEVSTn0kYCk7XHJcbmNvbnN0IEVORFNfV0lUSF9MQVRJTiA9IG5ldyBSZWdFeHAoYCR7TEFUSU5fTElLRV9QQVRURVJOfSRgKTtcclxuY29uc3QgU1RBUlRTX1dJVEhfQ0pLID0gbmV3IFJlZ0V4cChgXiR7Q0pLX1BBVFRFUk59YCk7XHJcbmNvbnN0IFNUQVJUU19XSVRIX0xBVElOID0gbmV3IFJlZ0V4cChgXiR7TEFUSU5fTElLRV9QQVRURVJOfWApO1xyXG5jb25zdCBQQVRURVJOX0RFRkFVTFQgPSBuZXcgUmVnRXhwKGAoPzw9JHtMQVRJTl9MSUtFX1BBVFRFUk59KSg/PSR7Q0pLX1BBVFRFUk59KXwoPzw9JHtDSktfUEFUVEVSTn0pKD89JHtMQVRJTl9MSUtFX1BBVFRFUk59KWAsICdnJyk7XHJcbmNvbnN0IFBBVFRFUk5fU1BBQ0UgPSBuZXcgUmVnRXhwKGAoPzw9JHtMQVRJTl9MSUtFX1BBVFRFUk59KSg/PVsgXSoke0NKS19QQVRURVJOfSl8KD88PSR7Q0pLX1BBVFRFUk59KSg/PVsgXSoke0xBVElOX0xJS0VfUEFUVEVSTn0pfCg/PD0ke0NKS19QQVRURVJOfVsgXSopKD89JHtMQVRJTl9MSUtFX1BBVFRFUk59KXwoPzw9JHtMQVRJTl9MSUtFX1BBVFRFUk59WyBdKikoPz0ke0NKS19QQVRURVJOfSlgLCAnZycpO1xyXG5cclxuY29uc3QgREVGQVVMVF9PUFRJT05TID0ge1xyXG4gICAgc3BhY2luZ0NvbnRlbnQ6ICcgJ1xyXG59O1xyXG5cclxubGV0IGRlZmF1bHRPcHRpb25zID0ge307XHJcblxyXG5jbGFzcyBTcGFjZXIge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcclxuICAgICAgICB0aGlzLm9wdGlvbnMgPSBoYW5kbGVPcHRpb25zKG9wdGlvbnMpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBjb25maWcob3B0aW9ucykge1xyXG4gICAgICAgIG9wdGlvbnMgPSB3cmFwT3B0aW9ucyhvcHRpb25zKTtcclxuICAgICAgICBPYmplY3QuYXNzaWduKGRlZmF1bHRPcHRpb25zLCBERUZBVUxUX09QVElPTlMsIG9wdGlvbnMpO1xyXG4gICAgfVxyXG5cclxuICAgIHNwYWNlKHRleHQsIG9wdGlvbnMpIHtcclxuICAgICAgICBsZXQgYXJyID0gdGhpcy5zcGxpdCh0ZXh0LCBvcHRpb25zKTtcclxuICAgICAgICBvcHRpb25zID0gdGhpcy5yZXNvbHZlT3B0aW9ucyhvcHRpb25zKTtcclxuICAgICAgICBpZiAob3B0aW9ucy53cmFwcGVyKSB7XHJcbiAgICAgICAgICAgIGxldCByZXN1bHQgPSBhcnJbMF07XHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAxOyBpIDwgYXJyLmxlbmd0aCAtIDE7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgbGV0IG9wZW4gPSAvWyBdKi8udGVzdChhcnJbaSArIDFdKTtcclxuICAgICAgICAgICAgICAgIGxldCBjbG9zZSA9IC9bIF0qLy50ZXN0KGFycltpIC0gMV0pO1xyXG4gICAgICAgICAgICAgICAgaWYgKG9wZW4pIHtcclxuICAgICAgICAgICAgICAgICAgICByZXN1bHQgKz0gb3B0aW9ucy53cmFwcGVyLm9wZW47XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAoY2xvc2UpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXN1bHQgKz0gb3B0aW9ucy53cmFwcGVyLmNsb3NlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKCFvcGVuICYmICFjbG9zZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdCArPSBvcHRpb25zLndyYXBwZXIub3BlbiArIG9wdGlvbnMud3JhcHBlci5jbG9zZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiBhcnIuam9pbihvcHRpb25zLnNwYWNpbmdDb250ZW50KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgc3BsaXQodGV4dCwgb3B0aW9ucykge1xyXG4gICAgICAgIG9wdGlvbnMgPSB0aGlzLnJlc29sdmVPcHRpb25zKG9wdGlvbnMpO1xyXG4gICAgICAgIGlmICh0eXBlb2YgdGV4dCA9PT0gJ3N0cmluZycpIHtcclxuICAgICAgICAgICAgbGV0IHBhdHRlcm4gPSBvcHRpb25zLmhhbmRsZU9yaWdpbmFsU3BhY2UgPyBQQVRURVJOX1NQQUNFIDogUEFUVEVSTl9ERUZBVUxUO1xyXG4gICAgICAgICAgICByZXR1cm4gdGV4dC5zcGxpdChwYXR0ZXJuKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIFt0ZXh0XTtcclxuICAgIH1cclxuXHJcbiAgICByZXNvbHZlT3B0aW9ucyhvcHRpb25zKSB7XHJcbiAgICAgICAgcmV0dXJuIG9wdGlvbnMgPyBoYW5kbGVPcHRpb25zKG9wdGlvbnMpIDogdGhpcy5vcHRpb25zO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBlbmRzV2l0aENKS0FuZFNwYWNpbmcodGV4dCkge1xyXG4gICAgICAgIHJldHVybiBFTkRTX1dJVEhfQ0pLX0FORF9TUEFDSU5HLnRlc3QodGV4dCk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGVuZHNXaXRoQ0pLKHRleHQpe1xyXG4gICAgICAgIHJldHVybiBFTkRTX1dJVEhfQ0pLLnRlc3QodGV4dCk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGVuZHNXaXRoTGF0aW4odGV4dCl7XHJcbiAgICAgICAgcmV0dXJuIEVORFNfV0lUSF9MQVRJTi50ZXN0KHRleHQpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBzdGFydHNXaXRoQ0pLKHRleHQpe1xyXG4gICAgICAgIHJldHVybiBTVEFSVFNfV0lUSF9DSksudGVzdCh0ZXh0KTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgc3RhcnRzV2l0aExhdGluKHRleHQpe1xyXG4gICAgICAgIHJldHVybiBTVEFSVFNfV0lUSF9MQVRJTi50ZXN0KHRleHQpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBlbmRzV2l0aExhdGluQW5kU3BhY2luZyh0ZXh0KSB7XHJcbiAgICAgICAgcmV0dXJuIEVORFNfV0lUSF9MQVRJTl9BTkRfU1BBQ0lORy50ZXN0KHRleHQpO1xyXG4gICAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiB3cmFwT3B0aW9ucyhvcHRpb25zKSB7XHJcbiAgICByZXR1cm4gdHlwZW9mIG9wdGlvbnMgPT09ICdzdHJpbmcnID8ge3NwYWNpbmdDb250ZW50OiBvcHRpb25zfSA6IG9wdGlvbnM7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGhhbmRsZU9wdGlvbnMob3B0aW9ucykge1xyXG4gICAgb3B0aW9ucyA9IHdyYXBPcHRpb25zKG9wdGlvbnMpO1xyXG4gICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oe30sIERFRkFVTFRfT1BUSU9OUywgZGVmYXVsdE9wdGlvbnMsIG9wdGlvbnMpO1xyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBTcGFjZXI7IiwiaW1wb3J0IEJyb3dzZXJTcGFjZXIgZnJvbSAnLi9icm93c2VyLmpzJ1xyXG5cclxuLy8gQWRkIHN1cHBvcnQgZm9yIEFNRCAoQXN5bmNocm9ub3VzIE1vZHVsZSBEZWZpbml0aW9uKSBsaWJyYXJpZXMgc3VjaCBhcyByZXF1aXJlLmpzLlxyXG5pZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XHJcbiAgICBkZWZpbmUoW10sIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIFNwYWNlcjogQnJvd3NlclNwYWNlclxyXG4gICAgICAgIH1cclxuICAgIH0pXHJcbn1cclxuLy9BZGQgc3VwcG9ydCBmb3JtIENvbW1vbkpTIGxpYnJhcmllcyBzdWNoIGFzIGJyb3dzZXJpZnkuXHJcbmlmICh0eXBlb2YgZXhwb3J0cyAhPT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgIGV4cG9ydHMuU3BhY2VyID0gQnJvd3NlclNwYWNlcjtcclxufVxyXG4vL0RlZmluZSBnbG9iYWxseSBpbiBjYXNlIEFNRCBpcyBub3QgYXZhaWxhYmxlIG9yIHVudXNlZFxyXG5pZiAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgIHdpbmRvdy5TcGFjZXIgPSBCcm93c2VyU3BhY2VyO1xyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBCcm93c2VyU3BhY2VyOyJdfQ==
