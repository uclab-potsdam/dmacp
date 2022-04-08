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
    let entityPositionInText = 0

    return paragraphs.map((paragraph, p) => {
        const entities = arrayFromCollection(paragraph, "[typeof][resource]").map((parentEntity, pe) => {
            entityPositionInText = entityPositionInText + 1
            console.log('current entity >>>', entityPositionInText)
            // init arrays to store resources
            const targets = []
            const targetedBy = []
            // arrays from collection of nodes
            const timePoints = arrayFromCollection(parentEntity, 'span')
            const parentProperties = arrayFromCollection(parentEntity, 'meta')
            
            // init container for instant child
            const instantObj = {}

            // default text label is content of span
            let textLabel = ''
            const rawSpanContent = parentEntity.innerText
            textLabel = rawSpanContent.replace(/ {2}|\n/g, "")
            console.log(parentProperties)
            // iterate over parents properties to infer causality and other props
            parentProperties.forEach((prop) =>  {
                const currentAttribute = prop.getAttribute('property')
                console.log(currentAttribute)
                switch (currentAttribute) {
                    // Adding resources id to arrays
                    case 'ac:linksTo':
                        targets.push(prop.getAttribute('resource').substring(1))
                        break;
                    case 'ac:linkedFrom':
                        targetedBy.push(prop.getAttribute('resource').substring(1))
                        break;
                    case 'ac:label':
                        textLabel = prop.getAttribute('content')
                        break;
                    // Adding properties for instant child
                    case 'time:inXSDgYear':
                        instantObj[currentAttribute] = +prop.getAttribute('content')
                        break;
                    case 'rdfs:label':
                    case 'ac:hasIndefiniteness':
                        instantObj[currentAttribute] = prop.getAttribute('content')
                        break;
                }
            })

            if (timePoints.length === 0) {
                // if there is no child: create one and store instant metadata
                instantObj['time:positionInText'] = entityPositionInText
                timePoints[0] = instantObj
            } else {
                // if there are children: parse them and format them
                timePoints.forEach((entity, e) => {
                    const intervalObj = {}
                    instantObj['time:positionInText'] = entityPositionInText
                    const childrenProps = arrayFromCollection(entity, 'meta')
                    childrenProps.forEach((cprop) => {
                        const currentAttribute = cprop.getAttribute('property')
                        if (currentAttribute === 'time:inXSDgYear') {
                            intervalObj[currentAttribute] = +cprop.getAttribute('content')
                        } else {
                            intervalObj[currentAttribute] = cprop.getAttribute('content')
                        }
                    })
                    // substitute formatted element within the array
                    timePoints[e] = intervalObj
                })
            }
            return {
                entityType: parentEntity.getAttribute('typeof'),
                targets,
                targetedBy,
                textLabel,
                timePoints
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