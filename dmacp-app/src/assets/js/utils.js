export const createRelationalArrays = function (relData, mode) {
    const copy = relData.map(object => ({ ...object }))
    const orderedIDs = []
    copy.forEach((entity) => {

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


export const calcVerticalSpace = function(data) {
    // Creating separate arrays for labels
    // that will be changed based on vis status
    const importantLabels = data.filter(d => d.relations > 3)
    const sortedLabels = importantLabels.sort((a, b) => a.y - b.y)

    const positions = sortedLabels.map(d => d.y)
    const minDist = 15

    // calculate the differences, by using filter() to get an array which is
    // the same as positions, but without the first item (i > 0). Then those values are
    // subtracted by the value that comes before them (y - positions[y])
    let diffs = positions.filter((y, i) => i > 0).map((y, i) => y - positions[i])

    while (diffs.find(d => d < minDist) != null) {
        // if there is a difference to small, iterate over them
        diffs.forEach((d, i) => {
            // if this is difference is to small…
            if (d < minDist) {
                // move the first position up and the one after that down
                // we move them by whatever is bigger. the minimum value to reach the
                // required distance or 2 pixels
                positions[i] = positions[i] - Math.max((minDist - d) / 2, 2)
                positions[i + 1] = positions[i + 1] + Math.max((minDist - d) / 2, 2)

                // Now we can set some boundaries, if we for example don't want a label to be
                // lower/higher than a specific value…
                if (positions[i + 1] >= 5) {
                    positions[i + 1] = 5
                }
            }
        })
        // since we moved things around, it can be that labels which did not overlap before
        // do now. so we have to recalculate the diffs, and stay in this while-loop until everything
        // is fine [Fidel]
        diffs = positions.filter((y, i) => i > 0).map((y, i) => y - positions[i])
    }

    sortedLabels.forEach((l, i) => {
        l.y2 = positions[i]

        if (i === sortedLabels.length - 1) {
            l.y2 = -minDist * 2
        }
    })

    return sortedLabels
}
