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
        this.onlyRelationalEntities.forEach((relation) => {
            IDsArray.push(relation.targets[0])
        })
        
        return IDsArray
    },
    PathCoordinates () {
        const scaledEntities = this.data
        const coordinates = []
        this.UniqueRelationsIDs.forEach((relation, r) => {
            // Needs to build in a way to go back to previous point if more than 1
            // relation si presente
            const relationalEntity = scaledEntities.find(el => el.id === relation)
            const totalTargets = relationalEntity.targets
            coordinates.push({ coords: [ relationalEntity.cx, relationalEntity.cy ]})
        })

        return coordinates
    },
    signatureGenerator () {
        return line()
                .x((d) => d.coords[0])
                .y((d) => d.coords[1])
                .curve(curveCatmullRom.alpha(1));
    },
    signaturePath () {
        return this.signatureGenerator(this.PathCoordinates)
    }
  }
}
</script>