<template>
    <g class="individual-links">
      <transition name="fade-relations">
      <g v-if="isMounted">
          <g v-for="(link, l) in curvesPaths" :key="l" :class="{'not-selected' : selectedMarker.id !== link.id && selectedMarker.id !== null}" @click="addArrow(l)">
            <path :class="[`link ${link.id}`, link.position, link.provenance]" :d="link.d" :stroke="link.color" :ref="`link-${l}`"/>
            <!-- <g>
              <path 
                :d="`M${elementCenter.x + 10 + ',' + elementCenter.y + 10} L ${elementCenter.x + ',' + elementCenter.y} v -10`" 
                fill="none" 
                stroke="black"
              />
            </g> -->
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
      isMounted: Boolean,
  },
  data () {
    return {
      elementCenter: {x: 0, y: 0}
    }
  },
  computed: {
    ...mapState(['compress']),
    onlyRelationalEntities () {
      return this.linksData.filter(obj => { return obj.targets.length !== 0})
    },
    sourcesAndTargets () {
        const sourcesAndTargetsData = []
        const { onlyRelationalEntities, searchRelatedElement  } = this

        onlyRelationalEntities.forEach((entity, e) => {
          const targets = entity.targets
          const lengthOfTargets = targets.length

          for (let index = 0; index < lengthOfTargets; index++) {

            const newObj = {}
            const currentTarget = targets[index]
            const currentEntity = this.linksData.find(obj => { return obj.id === currentTarget})

            newObj["source"] = [entity.cx, entity.cy]
            newObj["id"] = entity.id
            newObj["source-position"] = searchRelatedElement(this.linksData, entity.id)
            newObj["targets"] = ['']
            newObj["provenance"] = entity.provenance

            if (currentEntity !== undefined) {
              newObj["target-position"] = searchRelatedElement(this.linksData, currentEntity.id)
              newObj["target"] =  [currentEntity.cx, currentEntity.cy]
              newObj["targets"] = targets

              // determines if an entity relates to something that happens in the future (follows) or in the past (precedes)
              newObj["position"] = newObj["target-position"] > newObj["source-position"]
                ? 'follows' : 'precedes'

              newObj["position"] = newObj["target-position"] === newObj["source-position"] ? 'concurs' : newObj["position"]

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
      return this.sourcesAndTargets.map((d, i) => {
        return {
            id: d.id,
            targets: d.targets,
            d: this.generateDforArc(d),
            position: d.position,
            provenance: d.provenance
          }
      })
    } 
  },
  methods: {
    searchRelatedElement (array, identifier) {
      const findResult = array.find((e) => { return e.id === identifier})
      return findResult.calendarDate
    },
    addArrow(i) {
      const linkString = "link-" + i
      const currentLink = this.$refs[linkString]

      const coordinates = currentLink[0].getPointAtLength(100)

      this.elementCenter.x = coordinates.x
      this.elementCenter.y = coordinates.y
    },
    generateDforArc (d) {
      // default pairs of coordinates to generate lines and arcs
      const startOfArc = d.source
      const endOfArc = d.target

      // default starting points for arc generation
      const startX = startOfArc[0]
      const startY = startOfArc[1]
      const endX = endOfArc[0]
      const endY = endOfArc[1]

      // Middle x, middle y and circle radius (useful to generate arcs)
      const dx = endX - startX
      const dy = endY - startY
      let dr = 0

      // Determines if arc of straight line (straight lines = concurrent events)
      const isArc = startX !== endX
      
      // Determines direction of path intersection on point A
      const position = d.position === 'follows' ? 1 : 0

      // Achieve consistency for arc sweep-flag by forcing smaller 
      // value to always be first in generating the curve
      const startingPoint = startX > endX ? [endX, endY] : [startX, startY]
      const endPoint = startX > endX ?  [startX, startY] : [endX, endY]

      //Checking visualization mode to avoid negative square numbers for dr (arc radius)
      if (this.compress) {
          dr = Math.sign(dx) < 0 ? Math.sqrt(-(dx + dy * dy + dx)) : Math.sqrt(dx + dy * dy + dx)
      } else {
        const originalDr = Math.sqrt(dx + dy * dy + dx)
        console.log(originalDr > 100)
        dr = originalDr > 100 ? originalDr + 150 : originalDr
      }

      // Check which type of element shall be drawn
      if (isArc) {
        // validity check for dr and then draws arc
        return !isNaN(dr) ? "M" + startingPoint[0] + "," + startingPoint[1] + "A" + dr + "," + dr + " 0 0," + position + " " + endPoint[0] + "," + endPoint[1] : 
          "M" + dx + "," + dy + "z"      
      } else {
        // draws a straight line if events concur
        return "M" + startingPoint[0] + "," + startingPoint[1] + "L" +  endPoint[0] + "," + endPoint[1]
      }
    }
  }
}
</script>