<template>
    <g class="continuous-curve">
        <g v-for="(signature, s) in signaturePath" :key="s">
            <path class="signature" :d="signature.d" stroke="red"/>
        </g>
    </g>
</template>

<script>
import { line, curveCatmullRom } from 'd3-shape'
import { createRelationalArrays, getRandomColor } from '../../assets/js/utils.js'

export default {
  name: 'Signature',
  props: {
      relationsData: Array
  },
  data () {
      return {
          orderedData: [],
          relationalityMode: 'network' // can be changed to 'last-relation' or to 'network'
      }
  },
  computed: {
    PathCoordinates () {
        // console.log('ordered data in path coordinates', this.orderedData)
        const data = this.relationsData
        const coordinates = []

        this.orderedData.forEach((arrayOfRelations, r) => {
            const subArrayofCoords = []

            arrayOfRelations.forEach((relation) => {
            const relationalEntity = data.find(el => el.id === relation)

            if (relationalEntity !== undefined) {
                    subArrayofCoords.push(
                        { coords: [ relationalEntity.cx, relationalEntity.cy ]
                    })
                }            
            })

            coordinates.push(subArrayofCoords)
        })
        return coordinates
    },
    signatureGenerator () {
        return line()
                .x((d) => d.coords[0])
                .y((d) => d.coords[1])
                .curve(curveCatmullRom.alpha(1));
                //.curve(curveNatural);
    },
    signaturePath () {
        return this.PathCoordinates.map((signature, s) => {
            return {
                    d: this.signatureGenerator(signature),
                    color: getRandomColor()
                }
        })
    }
  },
  mounted () {
      const relationsData = this.relationsData
      this.orderedData = createRelationalArrays(relationsData, this.relationalityMode)
  }
}
</script>