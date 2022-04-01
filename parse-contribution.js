/**
 * Fetches a resource using XMLHttpRequest and a Promise
 * @param {String} url - The URL of the resource to get
 * @param {String|FormData|Blob|File} [postData] - Any data to POST
 * @param {String} [responseType] - The type of response to expect (defaults to document)
 * @returns {Promise}
 */
function fetch(url, postData, responseType) {
    return new Promise((res, rej) => {
        var x = new XMLHttpRequest();
        x.responseType = responseType || 'document';
        x.addEventListener('load', e => res(x.response, x));
        x.addEventListener('error', e => {
            console.warn('XHR Error', url, e);
            rej(x.response, x);
        });
        if (!postData) {
            x.open('GET', url);
            x.send();
        } else {
            x.open('POST', url);
            if ('string' === typeof postData)
                x.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
            x.send(postData);
        }
    });
}

async function init () {
    let rawText = await fetch('collaborative_tagging/combustion.html', false, 'text').then(
        function (response) {
            return response
        }
    );

    console.log(rawText)
}

init()