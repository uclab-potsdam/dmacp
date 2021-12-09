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
          orderedData: [],
          colors: ["red", "blue", "pink", "green", "white", "aqua", "orange", "violet", "goldenrod"]
      }
  },
  computed: {
      onlyRelationalEntities () {
        const { data } = this
        return data.filter((entity) => {
            return entity.targets.length !== 0
        })
      },
    //   DataOrderedByRel () {

    //     },
    //   UniqueRelationsIDs () {
    //     const IDsArray = []
    //     this.onlyRelationalEntities.forEach((relation, r) => {
    //         const lastElementOfIDsArray = IDsArray.slice(-1)
    //                     if (r == 0) {
    //             IDsArray.push(relation.id)
    //         }
    //         IDsArray.push(relation.id)
    //         if (relation.targets.length > 1) {
    //             relation.targets.forEach(target => {
    //                 IDsArray.push(relation.id)
    //                 // if (relation.id !== lastElementOfIDsArray[0]) {
    //                     IDsArray.push(target)
    //                 //}
    //             }) 
    //         } else {
    //             IDsArray.push(relation.targets[0])
    //         }
    //         // IDsArray.push(relation.targets)

    //         // console.log("end----")
    //     })
        
    //     return IDsArray
    // },
    PathCoordinates () {
        const scaledEntities = this.data
        const coordinates = []
        // console.log(this.UniqueRelationsIDs)
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
        //console.log(coordinates)
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
        console.log(this.PathCoordinates)
        return this.PathCoordinates.map((signature, s) => {
            return this.signatureGenerator(signature)
        })
    }
  },
  mounted () {
      this.orderedData = this.createPathsArrays(this.data)
      //console.log("paths", this.signaturePath)
  },
  methods: {
      createPathsArrays (data) {
        const orderedIDs = []
        // console.log(this.data)
        data.forEach((entity, e) => {

            const singleRelationalityArray = []

            let hasRelations = entity.targets.length !== 0
            let currentRelation = entity
            // console.log(currentRelation)

                while (hasRelations) {   
                    // console.log("!")
                    console.log(currentRelation)
                    singleRelationalityArray.push(currentRelation.id)
                    console.log(currentRelation.id, currentRelation.targets)

                    currentRelation.targets.forEach(t => singleRelationalityArray.push(t))
                    //singleRelationalityArray.push(currentRelation.targets)

                    const lastTarget = currentRelation.targets.splice(-1)
                    const stringLastTarget = lastTarget[0]

                    currentRelation = data.find(obj => { return obj.targets === currentRelation.targets })
                    hasRelations = currentRelation.targets.length !== 0 

                }

            orderedIDs.push(singleRelationalityArray)
            // console.log("array preview", orderedIDs)
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