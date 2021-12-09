<template>
    <g class="continuous-curve">
        <path :d="signaturePath" />
    </g>
</template>

<script>
import { line, curveCatmullRom } from 'd3-shape'

export default {
  name: 'Signature',
  props: {
      data: Array
  },
  computed: {
      onlyRelationalEntities () {
        const { data } = this
        return data.filter((entity) => {
            return entity.targets.length !== 0
        })
      },
      UniqueRelationsIDs () {
        const IDsArray = []
        this.onlyRelationalEntities.forEach((relation, r) => {
            const lastElementOfIDsArray = IDsArray.slice(-1)
            
            //const nextRelation = this.onlyRelationalEntities[nextElement]

            // First element get pushed at the beginning
            if (r == 0) {
                IDsArray.push(relation.id)
            }
            console.log("beginning----")
            console.log("current element id:", relation.id, "last Element in array of ids:", lastElementOfIDsArray[0])
            console.log(relation.targets)

            if (relation.targets.length > 1) {
                relation.targets.forEach(target => {
                    // if (relation.id !== lastElementOfIDsArray[0]) {
                        IDsArray.push(relation.id)
                        IDsArray.push(target)
                    //}
                }) 
            } else {
                IDsArray.push(relation.targets[0])
            }
            // IDsArray.push(relation.targets)

            console.log("end----")
        })
        
        return IDsArray
    },
    PathCoordinates () {
        const scaledEntities = this.data
        const coordinates = []
        console.log(this.UniqueRelationsIDs)
        this.UniqueRelationsIDs.forEach((relation, r) => {
            const relationalEntity = scaledEntities.find(el => el.id === relation)
            if (relationalEntity !== undefined) {
                coordinates.push({ coords: [ relationalEntity.cx, relationalEntity.cy ]})
            }
        })

        return coordinates
    },
    signatureGenerator () {
        return line()
                .x((d) => d.coords[0])
                .y((d) => d.coords[1])
                // .curve(curveNatural)
                .curve(curveCatmullRom.alpha(0.5));
    },
    signaturePath () {
        return this.signatureGenerator(this.PathCoordinates)
    }
  }
}
</script>