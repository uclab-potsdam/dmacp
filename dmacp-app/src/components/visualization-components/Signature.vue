<template>
    <g class="continuous-curve">
        <g v-for="(signature, s) in signaturePath" :key="s">
            <path :d="signature" :stroke="getRandomColor()"/>
        </g>
    </g>
</template>

<script>
import { line, curveCatmullRom } from 'd3-shape'

export default {
  name: 'Signature',
  props: {
      data: Array
  },
  data () {
      return {
          orderedData: []
      }
  },
  computed: {
      onlyRelationalEntities () {
        const { data } = this
        return data.filter((entity) => {
            return entity.targets.length !== 0
        })
      },
    PathCoordinates () {
        const scaledEntities = this.data
        const coordinates = []
        this.orderedData.forEach((arrayOfRelations, r) => {
            const subArrayofCoords = []
            arrayOfRelations.forEach((relation) => {
            const relationalEntity = scaledEntities.find(el => el.id === relation)
            if (relationalEntity !== undefined) {
                subArrayofCoords.push({ coords: [ relationalEntity.cx, relationalEntity.cy ]})
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
        console.log(this.PathCoordinates)
        return this.PathCoordinates.map((signature, s) => {
            return this.signatureGenerator(signature)
        })
    }
  },
  mounted () {
      this.orderedData = this.createPathsArrays(this.data)
  },
  methods: {
      createPathsArrays (data) {
        const orderedIDs = []
        data.forEach((entity, e) => {

            const singleRelationalityArray = []

            let hasRelations = entity.targets.length !== 0
            let currentRelation = entity

                while (hasRelations) { 
                    // Looping through entities until there are targets to be followed
                    // The source id is pushed in the array  
                    singleRelationalityArray.push(currentRelation.id)
                    // Each target is pushed in the array as well
                    currentRelation.targets.forEach(t => singleRelationalityArray.push(t))

                    // const lastTarget = currentRelation.targets.splice(-1)
                    // const stringLastTarget = lastTarget[0]
                    
                    // Updating value for variable holding the relation under scrutiny (needs to check if it's fetching the correct entities)
                    currentRelation = data.find(obj => { return obj.targets === currentRelation.targets })
                    // Updating variable to decide if keep looping or break out and start with the new entity
                    hasRelations = currentRelation.targets.length !== 0 
                }

            // Pushing individual array in parent array for visualization
            orderedIDs.push(singleRelationalityArray)
            })

            return orderedIDs.filter(n => n.length !== 0)
      },
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