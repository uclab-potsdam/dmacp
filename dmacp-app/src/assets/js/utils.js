export const createRelationalArrays = function (relData, mode) {
    console.log('in utils', relData)
    const orderedIDs = []
    relData.forEach((entity) => {

        const singleRelationalityArray = []

        let hasRelations = entity.targets.length !== 0
        let currentRelation = entity
        let loops = 0

        while (hasRelations) {
            loops += 1

            if (loops > 1000000) {
                hasRelations = false
            }

            console.log(currentRelation.id)

            if (mode === 'network') {
                currentRelation.targets.forEach(t => {
                    singleRelationalityArray.push(currentRelation.id)
                    singleRelationalityArray.push(t)
                })
            } else if (mode === 'last-relation') {
                singleRelationalityArray.push(currentRelation.id)
                currentRelation.targets.forEach(t => {
                    singleRelationalityArray.push(t)
                })
            }
            //singleRelationalityArray.push(currentRelation.id)

            console.log(singleRelationalityArray)

            const lastTarget = currentRelation.targets.splice(-1)
            console.log(lastTarget)

            const matchingEntity = relData.find(obj => {return obj.id === lastTarget[0]})
            currentRelation = matchingEntity

            hasRelations = currentRelation.targets.length !== 0
        }

        // while (hasRelations) {
        //     // Looping through entities until there are targets to be followed
        //     // The source id is pushed in the array  
        //     singleRelationalityArray.push(currentRelation.id)
        //     // Each target is pushed in the array as well
        //     currentRelation.targets.forEach(t => singleRelationalityArray.push(t))

        //     // const targets = currentRelation.targets
        //     // const targets = currentRelation.targets
        //     const lastTarget = currentRelation.targets.splice(-1)
        //     // const stringLastTarget = lastTarget[0]

        //     //console.log(currentRelation.targets)

        //     // Updating value for variable holding the relation under scrutiny (needs to check if it's fetching the correct entities)
        //     currentRelation = relData.find(obj => { return obj.id === lastTarget[0] })
        //     // Updating variable to decide if keep looping or break out and start with the new entity
        //     hasRelations = currentRelation.targets.length !== 0
        // }

        // Pushing individual array in parent array for visualization
        orderedIDs.push(singleRelationalityArray)
    })

    return orderedIDs.filter(n => n.length !== 0)
}
