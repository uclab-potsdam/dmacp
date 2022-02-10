export default function parsePaintboxData(paintBoxData) {
    const entities = paintBoxData["instants"]
    console.log(paintBoxData)
    const parsedEntities = entities.map((d, i) => {
        const pointsOfEntities = []
        const targets = []
        let point = {}
        const entityID = d.id
        let entityType = 'instant'
        point['x'] = d.x
        point['y'] = d.y
        point['label'] = d.name
        // TO DO: discuss implementation in paintbox
        point['innerText'] = d.name
        // in my data this included only first child, reference to targets for 
        // all children and consider removing
        point['target'] = []
        
        pointsOfEntities.push(point)
       
        entities.forEach((el) => {
            if (el.target.includes(entityID) && d.y === el.y) {
                point = {}
                point['x'] = el.x
                point['y'] = el.y
                point['label'] = el.name
                point['innerText'] = el.name
                // in my data this included only first child, reference to targets for 
                // all children and consider removing
                point['target'] = []
                entityType = 'interval'
                pointsOfEntities.push(point)
            } else {
            }
        })

        d.connections.forEach((c) => { 
            const connection = entities.find(el => {return el.id === c})
            if (connection !== undefined && typeof(c) !== 'string') {
                targets.push(connection.name)
            } else if (typeof (c) === 'string') {
                targets.push(c)
            }
         })

        return {
            resource: d.name,
            entityTimePosition: pointsOfEntities,
            type: entityType,
            targets,
            intervalContext: null,
            dataSource: "paintbox"
        }

    })

    return parsedEntities
}