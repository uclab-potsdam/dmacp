const arrayOfEssays = {}

function parse(string, mimeType) {
    const parser = new DOMParser();
    return parser.parseFromString(string, mimeType)
}

/**
 * Fetches a resource using XMLHttpRequest and a Promise
 * @param {String} url - The URL of the resource to get
 * @param {String|FormData|Blob|File} [postData] - Any data to POST, set to false when GET
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
                x.setRequestHeader('Content-type', 'text/html');
            x.send(postData);
        }
    });
}

// shorthand to convert HTML collection into array
function arrayFromCollection(parent, tag) {
    return [].map.call(parent.querySelectorAll(tag), (el) => {
        return el
    })
}

function transformData(parsedText) {
    const essayContent = Array.from(parsedText.body.children)
    const textTitle = essayContent.find((e) => { return e.id === 'EssayTitle' })
    const textBody = essayContent.find((e) => { return e.id === 'EssayBody' })
    const paragraphs = arrayFromCollection(textBody, "p")

    return paragraphs.map((paragraph, p) => {
        const entities = arrayFromCollection(paragraph, "[typeof][resource]").map((parentEntity) => {
            const childrenEntities = arrayFromCollection(parentEntity, 'span')
            const parentProperties = arrayFromCollection(parentEntity, 'meta').filter(node => node.parentNode === parentEntity)
            const targets = []
            const targetedBy = []
            
            // iterate over parents properties to infer causality
            parentProperties.forEach((prop) => {
                const currentAttribute = prop.getAttribute('property')
                switch (currentAttribute) {
                    case 'ac:linksTo':
                        targets.push(prop.getAttribute('resource'))
                        break;
                    case 'ac:linkedFrom':
                        targetedBy.push(prop.getAttribute('resource'))
                        break;
                }
            })

            return {
                entityType: parentEntity.getAttribute('typeof'),
                targets,
                targetedBy
            }
        })
        
        return {
            paragraphNumber: p + 1,
            entities
        }
    })
}

async function init () {
    let rawText = await fetch('collaborative_tagging/combustion.html', false, 'text').then(
        function (response) {
            return response
        }
    );

    const parsedEssay = parse(rawText, 'text/html')
    const data = transformData(parsedEssay)


    console.log(data)
}

init()