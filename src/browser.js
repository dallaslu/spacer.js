import Spacer from './core.js'

const IGNORED_TAGS = /^(script|link|style)$/i;

class BrowserSpacer extends Spacer {

    constructor(options) {
        super(options);
        this.options.spacingContent = this.options.spacingContent.replace(' ', '&nbsp;');
    }

    spacePage(elements, options) {
        elements = typeof elements === 'string' ? document.querySelectorAll(elements) : (elements || [document.childNodes[1]]);
        options = this.resolveOptions(options);
        options.spacingContent = options.spacingContent.replace(' ', '&nbsp;');
        [].forEach.call(elements, e => {
            spaceNode(this, e, options);
        });
    }
}

function spaceNode(spacer, node, options) {
    if(node.tagName && IGNORED_TAGS.test(node.tagName)){
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
    if (node.nodeType === Node.TEXT_NODE) {
        if (optionsEffect.wrapper) {
            let arr = spacer.split(node.data, optionsEffect);
            if (arr.length == 1) {
                return;
            }
            for (let i = 0; i < arr.length; i++) {
                let isSpacing = /^[ ]*$/.test(arr[i]);
                if (isSpacing || (i != 0 && !/^[ ]*$/.test(arr[i - 1]))) {
                    let spaceInnerHTML = optionsEffect.forceUnifiedSpacing ? optionsEffect.spacingContent : (isSpacing && optionsEffect.keepOriginalSpace) ? arr[i] : '';
                    node.parentNode.insertBefore(createNode(optionsEffect.wrapper.open + spaceInnerHTML + optionsEffect.wrapper.close), node);
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

        if(node.previousSibling){
            if(node.previousSibling.nodeType === Node.TEXT_NODE){
                if(Spacer.endsWithCJK(node.previousSibling.data) && Spacer.startsWithLatin(node.textContent)
                 ||Spacer.endsWithLatin(node.previousSibling.data) && Spacer.startsWithCJK(node.textContent)){
                    // TODO wrap original spaces
                    node.parentNode.insertBefore(createNode(optionsEffect.wrapper.open + optionsEffect.wrapper.close), node);
                }
            }else{
                if(Spacer.endsWithCJK(node.previousSibling.textContent) && Spacer.startsWithLatin(node.textContent)
                    ||Spacer.endsWithLatin(node.previousSibling.textContent) && Spacer.startsWithCJK(node.textContent)){
                    // TODO wrap original spaces
                    node.parentNode.insertBefore(createNode(optionsEffect.wrapper.open + optionsEffect.wrapper.close), node);
                }
            }
        }
    }
    if (node.childNodes) {
        let staticNodeList = [];
        node.childNodes.forEach(child => {
            staticNodeList.push(child);
        });
        staticNodeList.forEach(child=>{
            spaceNode(spacer, child, options);
        });
    }
}

function createNode(html){
    let div = document.createElement('div');
    div.innerHTML = html;
    return div.firstChild;
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