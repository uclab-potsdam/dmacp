<template>
    <g class="individual-links">
      <g v-for="(link, l) in curvesPaths" :key="l">
        <path :class="`link ${link.id}`" :d="link.d" :stroke="link.color" />
      </g>
    </g>
</template>

<script>
import { getRandomColor } from '../../assets/js/utils.js'

export default {
  name: 'Links',
    props: {
      linksData: Array
  },
  computed: {
    onlyRelationalEntities () {
      return this.linksData.filter(obj => { return obj.targets.length !== 0})
    },
    sourcesAndTargets () {
        const sourcesAndTargetsData = []
        this.onlyRelationalEntities.forEach((entity, e) => {
  
          const targets = entity.targets
          const lengthOfTargets = targets.length

          for (let index = 0; index < lengthOfTargets; index++) {

            const newObj = {}
            newObj["source"] = [entity.cx, entity.cy]
            newObj["id"] = entity.id
            console.log(entity.id)
            const currentTarget = targets[index]
            const currentEntity = this.linksData.find(obj => { return obj.id === currentTarget})

            if (currentEntity !== undefined) {
             newObj["target"] =  [currentEntity.cx, currentEntity.cy]
            } else {
              // If no coordinates for target node are found, source is fed again.
              newObj["target"] = newObj["source"]
            }
            sourcesAndTargetsData.push(newObj)
          }
      })

      return sourcesAndTargetsData
    },
    arrayOfColors () {
      const groupsIDs = this.sourcesAndTargets.map(d => { return d.id})
      const newObj = {}
      groupsIDs.forEach(d => {
        newObj[d] = getRandomColor()
      })

      return newObj
    },
    curvesPaths () {
      //console.log(this.arrayOfColors)
      return this.sourcesAndTargets.map((d, i) => {
        return {
            id: d.id,
            color: this.arrayOfColors[d.id],
            d: this.generateDforArc(d)
          }
      })
    } 
  },
  mounted () {
    console.log(this.curvesPaths)
  },
  methods: {
    generateDforArc (d) {
      const dx = d.target[0] - d.source[0]
      const dy = d.target[1] - d.source[1]
      const dr = Math.sqrt(dx + dy * dy + dx)

      const path = "M" + d.source[0] + "," + d.source[1] + "A" + dr + "," + dr + " 0 0,1 " + d.target[0] + "," + d.target[1]

      return path
    }
  }
}
</script>