<template>
    <g class="continuous-curve">
        <g v-for="(signature, s) in signaturePath" :key="s">
            <path :d="signature" />
        </g>
    </g>
</template>

<script>
import { line, curveCatmullRom } from 'd3-shape'
import { createRelationalArrays } from '../../assets/js/utils.js'

export default {
  name: 'Signature',
  props: {
      data: Array
  },
  data () {
      return {
          orderedData: [],
          relationalityMode: 'network'
      }
  },
  computed: {
    PathCoordinates () {
        // console.log('ordered data in path coordinates', this.orderedData)
        const data = this.data
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
                .curve(curveCatmullRom.alpha(0.5));
    },
    signaturePath () {
        return this.PathCoordinates.map((signature, s) => {
            return this.signatureGenerator(signature)
        })
    }
  },
  mounted () {
      const data = this.data
      this.orderedData = createRelationalArrays(data, this.relationalityMode)
  },
  methods: {
    getRandomColor() {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }
  }
}
</script>