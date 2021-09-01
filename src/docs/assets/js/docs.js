(function () {
    document.querySelector('#add-dynamic-content').addEventListener('click', () => {
        let t = document.querySelector('#dynamic-content-template');
        let time = t.content.querySelector('time');
        time.textContent = new Date().toString();
        let clone = document.importNode(t.content, true);
        document.querySelector('#dynamic-content-wrapper').appendChild(clone);
    });
})();