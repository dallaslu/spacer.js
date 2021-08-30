import BrowserSpacer from './browser.js'

// Add support for AMD (Asynchronous Module Definition) libraries such as require.js.
if (typeof define === 'function' && define.amd) {
    define([], function() {
        return {
            Spacer: BrowserSpacer
        }
    })
}
//Add support form CommonJS libraries such as browserify.
if (typeof exports !== 'undefined') {
    exports.Spacer = BrowserSpacer;
}
//Define globally in case AMD is not available or unused
if (typeof window !== 'undefined') {
    window.Spacer = BrowserSpacer;
}

export default BrowserSpacer;