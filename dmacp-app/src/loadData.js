import * as d3 from 'd3';

export default async function loadData (dataPath) {
    const data = await d3.html(dataPath).then(function (essay) {
        let globalY = 0
        essay = [].map.call(essay.querySelectorAll("p"), (narration) => {

            narration = [].map.call(narration.querySelectorAll('[typeof][resource]'), (entity) => {
                globalY = globalY + 1
                const isInstant = entity.querySelector('[typeof="time:Instant"]') !== null

                const entityTimePosition = [].map.call(entity.querySelectorAll('meta'), (unit) => {
                    const hasYear = unit.getAttribute('property') === 'time:inXSDgYear'

                    if (hasYear) {
                        return {
                            x: +unit.getAttribute('content'),
                            y: globalY
                        }
                    }
                }).filter(element => element !== undefined)

                return {
                    resource: entity.getAttribute('resource'),
                    type: !isInstant ? 'instant' : 'interval',
                    entityTimePosition
                }
            })
            console.log(narration)
            return narration
        })
        return essay
    });
    // console.log(data)
    return data
};