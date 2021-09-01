import Spacer from './core.js'

const IGNORED_TAGS = /^(script|link|style)$/i;
const BLOCK_TAGS = /^(div|p|h1|h2|h3|h4|h5|h6|blockqoute|pre|textarea|nav|header|main|footer|section|sidbar|aside|table|li|ul|ol|dl)$/i;
const SPACING_TAGS = /^(br|hr|img|video|audio)$/i;

class BrowserSpacer extends Spacer {

    constructor(options) {
        super(options);
        if (options.wrapper) {
            this.options.spacingContent = this.options.spacingContent.replace(' ', '&nbsp;');
        }
    }

    spacePage(elements, options) {
        elements = typeof elements === 'string' ? document.querySelectorAll(elements) : (elements || [document.childNodes[1]]);
        options = this.resolveOptions(options);
        if (options.wrapper) {
            options.spacingContent = options.spacingContent.replace(' ', '&nbsp;');
        }
        [].forEach.call(elements, e => {
            spaceNode(this, e, options);
        });
    }
}

function spaceNode(spacer, node, options) {
    if (node.tagName && IGNORED_TAGS.test(node.tagName)) {
        return;
    }
    let optionsNoWrapper = Object.assign({}, options, {wrapper: false});
    let optionsNoWrapperNoHTMLEntity = Object.assign({}, options, {
        wrapper: false,
        spacingContent: options.spacingContent.replace('&nbsp;', ' ')
    });
    let optionsEffect = options;
    if (node.parentNode && node.parentNode.tagName === 'TITLE') {
        optionsEffect = optionsNoWrapperNoHTMLEntity;
    }
    if (node.previousSibling
        && (!node.previousSibling.tagName || (!BLOCK_TAGS.test(node.previousSibling.tagName) && !SPACING_TAGS.test(node.previousSibling.tagName)))
        && (!node.tagName || (!BLOCK_TAGS.test(node.tagName) && !SPACING_TAGS.test(node.tagName)))) {
        let preText = node.previousSibling.nodeType === Node.TEXT_NODE ? node.previousSibling.data : node.previousSibling.textContent;
        if ((Spacer.endsWithCJK(preText) || Spacer.endsWithSymbolsNeedSpaceFollowed(preText)) && Spacer.startsWithLatin(node.textContent)
            || (Spacer.endsWithLatin(preText) || Spacer.endsWithSymbolsNeedSpaceFollowed(preText)) && Spacer.startsWithCJK(node.textContent)) {
            let spaceContent = optionsEffect.forceUnifiedSpacing ? optionsEffect.spacingContent : '';
            if (optionsEffect.wrapper) {
                insertBefore(createNode(optionsEffect.wrapper.open + spaceContent + optionsEffect.wrapper.close), node);
            } else {
                insertBefore(document.createTextNode(spaceContent ? spaceContent : optionsEffect.spacingContent), node);
            }
        }
        if (optionsEffect.handleOriginalSpace && node.previousSibling.nodeType === Node.TEXT_NODE) {
            if (Spacer.endsWithCJKAndSpacing(preText) && Spacer.startsWithLatin(node.textContent)
                || Spacer.endsWithLatinAndSpacing(preText) && Spacer.startsWithCJK(node.textContent)) {
                let preEndSpacing = '';
                let arr = /(.*)([ ]+)$/g.match(node.previousSibling.data);
                node.previousSibling.data = arr[1];
                preEndSpacing = arr[2];
                let spaceContent = optionsEffect.forceUnifiedSpacing ? optionsEffect.spacingContent : (optionsEffect.keepOriginalSpace ? preEndSpacing : '');
                if (optionsEffect.wrapper) {
                    insertBefore(createNode(optionsEffect.wrapper.open + spaceContent + optionsEffect.wrapper.close), node);
                } else {
                    insertBefore(document.createTextNode(spaceContent ? spaceContent : optionsEffect.spacingContent), node);
                }
            }
        }
    }
    if (node.nodeType === Node.TEXT_NODE) {
        if (optionsEffect.wrapper) {
            let arr = spacer.split(node.data, optionsEffect);
            if (arr.length == 1) {
                return;
            }
            console.log(arr);
            for (let i = 0; i < arr.length; i++) {
                let isSpacing = /^[ ]*$/.test(arr[i]);
                if (isSpacing || (i != 0 && !/^[ ]*$/.test(arr[i - 1])
                    && !Spacer.startsWithSymbolsNeedSpaceFollowed(arr[i])
                    && !(/[.]$/.test(arr[i - 1]) && /^\d+[%]?$|[ ]/.test(arr[i]))
                    && !(/[:]$/.test(arr[i - 1]) && /^\d+/.test(arr[i])))) {
                    let spaceContent = optionsEffect.forceUnifiedSpacing ? optionsEffect.spacingContent : (isSpacing && optionsEffect.keepOriginalSpace) ? arr[i] : '';
                    insertBefore(createNode(optionsEffect.wrapper.open + spaceContent + optionsEffect.wrapper.close), node);
                }
                if (!isSpacing) {
                    insertBefore(document.createTextNode(arr[i]), node);
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