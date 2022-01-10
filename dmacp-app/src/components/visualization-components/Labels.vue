<template>
    <g class="marker-event" :class="{'selected': selectedMarker === entity.id}" :transform="`translate(${entity.cx}, ${entity.cy})`">
        <foreignObject x="5" y="-18" :width="labelWidth" height="100" v-show="entity.radius > 3 || selectedMarker === entity.id">
            <div class="label" ref="label">
                <p>
                    {{e}}. 
                    <span :class="{'limited-visibility': selectedMarker !== entity.id && selectedMarker !== null}">
                        {{ entity.innerText }}
                    </span>
                </p>
            </div>
        </foreignObject>
        <!-- <text v-show="entity.radius > 3" x="10" y="0">
            {{e}} :style="`text-align: ${textAnchor}`"
        </text> -->
    </g>
</template>

<script>

export default {
  name: 'Labels',
  props: {
      entity: Object,
      e: Number,
      previousEntity: Object,
      selectedMarker: String
  },
  data () {
      return {
        x: 0,
        y: -15,
        textAnchor: 'left',
        timeoutContainer: null
      }
  },
  computed: {
      labelWidth () {
          return this.selectedMarker === this.entity.id ? 200 : 200
      }
  },
  mounted () {
        if (this.timeoutContainer) { clearTimeout(this.timeoutContainer) }
        this.timeoutContainer = setTimeout(() => { 
            //this.calcLabelXPosition() 
            this.calcLabelYPosition() 
        }, 500)
  },
  methods: {
      coordinatesofObject (obj) {
        let rightPos = (elem) => elem.getBoundingClientRect().right;
        let leftPos = (elem) => elem.getBoundingClientRect().left;
        let topPos = (elem) => elem.getBoundingClientRect().top;
        let btmPos = (elem) => elem.getBoundingClientRect().bottom;

        return {
            right: rightPos(obj),
            left: leftPos(obj),
            top: topPos(obj),
            bottom: btmPos(obj)
        }
      },
      calcLabelYPosition () {
        let currentY = 0
        let overlappingLabel = null

        // calc current bbox of label
        const currentLabel = this.$refs.label
        const currentLabelPos = currentLabel.getBoundingClientRect();
        const rightPosLabel = currentLabelPos.right
        const leftPosLabel = currentLabelPos.left
        const btmPosLabel = currentLabelPos.bottom
        const topPosLabel = currentLabelPos.top

        // get all labels
        const existingLabels = document.getElementsByClassName('label')

        for(let i = 0; i < existingLabels.length; i ++) {
            const previousLabel = i === 0 ? i : i - 1
            const coordinates = this.coordinatesofObject(existingLabels[previousLabel])
            
            let isOverlapping = !(
                coordinates.bottom < btmPosLabel ||
                coordinates.top > topPosLabel
            );

            if (isOverlapping) {
                overlappingLabel = coordinates.bottom
                console.log('overlaps', this.entity.innerText)
            }
        }

        if (overlappingLabel !== null) {
            const difference = overlappingLabel - topPosLabel
            while (currentY <= difference) {
                currentY = currentY + 1
            }
            this.y = -currentY
        }

      }
  }
}
</script>