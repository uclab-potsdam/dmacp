<template>
    <g class="individual-links">
      <transition name="fade-relations">
      <g v-if="isMounted">
          <g v-for="(link, l) in curvesPaths" :key="l" :class="{'not-selected' : selectedMarker.id !== link.id && !link['targets'].includes(selectedMarker.id) && selectedMarker.id !== null}">
            <path :class="[`link ${link.id}`, link.position]" :d="link.d" :stroke="link.color" />
          </g>
      </g>
      </transition>
    </g>
</template>

<script>
import {mapState} from 'vuex'

export default {
  name: 'Links',
    props: {
      linksData: Array,
      selectedMarker: Object,
      isMounted: Boolean
  },
  computed: {
    ...mapState(['compress']),
    onlyRelationalEntities () {
      return this.linksData.filter(obj => { return obj.targets.length !== 0})
    },
    sourcesAndTargets () {
        const sourcesAndTargetsData = []
        const { onlyRelationalEntities, searchForIndex  } = this

        onlyRelationalEntities.forEach((entity, e) => {
  
          const targets = entity.targets
          const lengthOfTargets = targets.length

          for (let index = 0; index < lengthOfTargets; index++) {

            const newObj = {}
            const currentTarget = targets[index]
            const currentEntity = this.linksData.find(obj => { return obj.id === currentTarget})

            newObj["source"] = [entity.cx, entity.cy]
            newObj["id"] = entity.id
            newObj["source-position"] = searchForIndex(onlyRelationalEntities, entity.id)
            newObj["targets"] = ['']

            if (currentEntity !== undefined) {
              newObj["target-position"] = searchForIndex(onlyRelationalEntities, currentEntity.id)
              newObj["target"] =  [currentEntity.cx, currentEntity.cy]
              newObj["targets"] = targets
              newObj["position"] = newObj["target-position"] > newObj["source-position"] 
                ? 'follows' : 'precedes'
            } else {
              // If no coordinates for target node are found, source is fed again.
              newObj["target"] = newObj["source"]
            }
            sourcesAndTargetsData.push(newObj)
          }
      })
      return sourcesAndTargetsData
    },
    curvesPaths () {
      //console.log()
      return this.sourcesAndTargets.map((d, i) => {

        return {
            id: d.id,
            color: '#8482FF',
            targets: d.targets,
            d: this.generateDforArc(d),
            position: d.position
          }
      })
    } 
  },
  methods: {
    searchForIndex (array, identifier) {
      return array.findIndex((e) => { return e.id === identifier})
    },
    generateDforArc (d) {
      const dx = d.target[0] - d.source[0]
      const dy = d.target[1] - d.source[1]
      let dr = 0

      //Checking mode to avoid negative square numbers for dr
      if (this.compress) {
          dr = Math.sign(dx) < 0 ? Math.sqrt(-(dx + dy * dy + dx)) : Math.sqrt(dx + dy * dy + dx)
      } else {
        dr = Math.sqrt(dx + dy * dy + dx)
      }
      // Achieve consistency for arc sweep-flag by forcing smaller 
      // value to always be first in generating the curve
      const position = d.position === 'follows' ? 0 : 1
      const startingPoint = d.source[0] > d.target[0] ? [d.target[0], d.target[1]] : [d.source[0], d.source[1]]
      const endPoint = d.source[0] > d.target[0] ?  [d.source[0], d.source[1]] : [d.target[0], d.target[1]]

      return !isNaN(dr) ? "M" + startingPoint[0] + "," + startingPoint[1] 
        + "A" + dr + "," + dr + 
        " 0 0," + position + " " + endPoint[0] + "," + endPoint[1] : "M" + dx + "," + dy + "z"
    }
  }
}
</script>