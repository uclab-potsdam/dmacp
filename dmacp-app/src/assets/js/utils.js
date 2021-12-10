export const createRelationalArrays = function (relData, mode) {
    const orderedIDs = []
    relData.forEach((entity) => {

        const singleRelationalityArray = []
        
        let loops = 0
        let hasRelations = entity.targets.length !== 0
        let currentRelation = entity

        while (hasRelations) {
            // Naive debugging to avoid infinite loops
            loops += 1
            if (loops > 1000000) {
                hasRelations = false
            }

            // Loop through entities until there are targets to be followed
            // Change mode will change update pattern 
            if (mode === 'network') {
                // Each target and source is pushed in the array as well
                currentRelation.targets.forEach(t => {
                    singleRelationalityArray.push(currentRelation.id)
                    singleRelationalityArray.push(t)
                })
            } else if (mode === 'last-relation') {
                // source is pushed only once, every target is added
                singleRelationalityArray.push(currentRelation.id)
                currentRelation.targets.forEach(t => {
                    singleRelationalityArray.push(t)
                })
            }

            // Get last target of entity
            const lastTarget = currentRelation.targets.splice(-1)
            const matchingEntity = relData.find(obj => {return obj.id === lastTarget[0]})
            // Update value for variable holding the relation under scrutiny
            currentRelation = matchingEntity

            // Update variable to decide if keep looping or break out and start with the new entity
            hasRelations = currentRelation.targets.length !== 0
        }

        // Push individual array in parent array for visualization
        orderedIDs.push(singleRelationalityArray)
    })

    return orderedIDs.filter(n => n.length !== 0)
}
