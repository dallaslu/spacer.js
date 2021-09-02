import Spacer from './core/core.js'

const IGNORED_TAGS = /^(script|link|style)$/i;
const BLOCK_TAGS = /^(div|p|h1|h2|h3|h4|h5|h6|blockqoute|pre|textarea|nav|header|main|footer|section|sidbar|aside|table|li|ul|ol|dl)$/i;
const SPACING_TAGS = /^(br|hr|img|video|audio)$/i;

Spacer.config({
    tagAttrMap: {
        '*': ['title'],
        'optgroup': ['label'],
        'input': ['placeholder'],
        'img': ['alt']
    }
});

class BrowserSpacer extends Spacer {

    constructor(options) {
        super(options);
        if (options.wrapper) {
            this.options.spacingContent = this.options.spacingContent.replace(' ', '&nbsp;');
        }
    }

    spacePage(elements, options, observe) {
        elements = typeof elements === 'string' ? document.querySelectorAll(elements) : (elements || document);
        options = this.resolveOptions(options);
        if (options.wrapper) {
            options.spacingContent = options.spacingContent.replace(' ', '&nbsp;');
        }
        if (!elements.forEach) {
            elements = [elements];
        }
        elements.forEach(e => {
            spaceNode(this, e, options);
            if (observe) {
                let observer = new MutationObserver((mutations, observer) => {
                    observer.disconnect();
                    mutations.forEach(m => {
                        if (m.type === 'childList') {
                            this.spacePage(m.addedNodes, options, false);
                        }
                    });
                    connect();
                });
                let connect = function () {
                    observer.observe(e, {
                        characterData: true,
                        childList: true,
                        attributes: true,
                        subtree: true,
                        attributeOldValue: true,
                        characterDataOldValue: true
                    });
                }
                connect();
            }
        });
    }
}

function spaceNode(spacer, node, options) {
    if (node.tagName && IGNORED_TAGS.test(node.tagName) || node.nodeType === Node.COMMENT_NODE) {
        return;
    }
    let optionsNoWrapper = Object.assign({}, options, {wrapper: false});
    let optionsNoWrapperNoHTMLEntity = Object.assign({}, optionsNoWrapper, {
        spacingContent: options.spacingContent.replace('&nbsp;', ' ')
    });
    let optionsEffect = options;
    if (node.parentNode && node.parentNode.tagName === 'TITLE') {
        optionsEffect = optionsNoWrapperNoHTMLEntity;
    }

    spacer.custom(optionsEffect, (step, opts) => {
        let current = Spacer.createSnippet((() => {
            if (node.nodeType === Node.TEXT_NODE) {
                return node.data;
            } else {
                return node.textContent;
            }
        })());
        if (current && current.text) {
            step({
                current: current
            });
        }
    }, (c, opts) => {
        if (node.previousSibling
            && (!node.previousSibling.tagName || (!BLOCK_TAGS.test(node.previousSibling.tagName) && !SPACING_TAGS.test(node.previousSibling.tagName)))
            && (!node.tagName || (!BLOCK_TAGS.test(node.tagName) && !SPACING_TAGS.test(node.tagName)))) {
            return Spacer.createSnippet(node.previousSibling.nodeType === Node.TEXT_NODE ? node.previousSibling.data : node.previousSibling.textContent);
        }
    }, c => null, (opts, c, add, s, append) => {
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
            spacer.custom(optionsEffect, (step, opts) => {
                return spacer.split(node.data, opts).reduce((acc, cur, i, src) => {
                    return step({
                        current: cur,
                        acc: acc,
                        i: i,
                        src: src
                    });
                }, '');
            }, c => c.i == 0 ? null : c.src[c.i - 1], c => null, (opts, c, add, s, append) => {
                if (add) {
                    insertBefore(createNode(`${opts.wrapper.open}${s}${opts.wrapper.close}`), node);
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
            for (let k in optionsEffect.tagAttrMap) {
                let attrs = optionsEffect.tagAttrMap[k];
                if (k === '*' || k === node.tagName.toLowerCase()) {
                    attrs.forEach(a => spaceAttribute(spacer, node, a, optionsNoWrapperNoHTMLEntity));
                }
            }
        }
    }

    if (node.childNodes) {
        let staticNodes = [];
        node.childNodes.forEach(child => {
            staticNodes.push(child);
        });
        staticNodes.forEach(child => {
            spaceNode(spacer, child, options);
        });
    }
}

function createNode(html) {
    let div = document.createElement('div');
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
        let result = spacer.space(node[attr], options);
        if (node[attr] !== result) {
            node[attr] = result;
        }
    }
}

export default BrowserSpacer;