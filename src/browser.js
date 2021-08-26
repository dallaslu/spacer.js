import Spacer from './core.js'

class BrowserSpacer extends Spacer {

    constructor(options) {
        super(options);
        this.options.spacingContent = this.options.spacingContent.replace(' ', '&nbsp;');
    }

    spacePage(elements, options) {
        elements = typeof elements === 'string' ? document.querySelectorAll(elements) : (elements || [document]);
        options = this.resolveOptions(options);
        options.spacingContent = options.spacingContent.replace(' ', '&nbsp;');
        [].forEach.call(elements, e => {
            spaceNode(this, e, options);
        });
    }
}

function spaceNode(spacer, node, options) {
    let optionsNoWrapper = Object.assign({}, options, {wrapper: false});
    let optionsNoWrapperNoHTMLEntity = Object.assign({}, options, {
        wrapper: false,
        spacingContent: options.spacingContent.replace('&nbsp;', ' ')
    });
    if (node.nodeType === Node.TEXT_NODE) {
        let optionsEffect = options;
        if (node.parentNode.tagName === 'TITLE') {
            optionsEffect = optionsNoWrapperNoHTMLEntity;
        }
        if (optionsEffect.wrapper) {
            let arr = spacer.split(node.data, optionsEffect);
            if (arr.length == 1) {
                return;
            }
            for (let i = 0; i < arr.length; i++) {
                let isSpacing = /^[ ]*$/.test(arr[i]);
                if (isSpacing || (i != 0 && !/^[ ]*$/.test(arr[i - 1]))) {
                    let spaceInnerHTML = optionsEffect.forceUnifiedSpacing ? optionsEffect.spacingContent : (isSpacing && optionsEffect.keepOriginalSpace) ? arr[i] : '';
                    let div = document.createElement('div');
                    div.innerHTML = optionsEffect.wrapper.open + spaceInnerHTML + optionsEffect.wrapper.close;
                    node.parentNode.insertBefore(div.firstChild, node);
                }

                if (!isSpacing) {
                    node.parentNode.insertBefore(document.createTextNode(arr[i]), node);
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
    }
    if (node.childNodes) {
        node.childNodes.forEach(child => {
            spaceNode(spacer, child, options);
        });
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