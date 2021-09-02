const TEST_CACHE = Symbol('testCache');

class Snippet {
    constructor(text) {
        this.text = text;
        this[TEST_CACHE] = {};
    }

    is(regexp) {
        let cache = this[TEST_CACHE][regexp];
        return cache === undefined ? (this[TEST_CACHE][regexp] = regexp.test(this.text)) : cache;
    }

    toString() {
        return this.text;
    }
}

export default Snippet;
