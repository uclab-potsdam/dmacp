<template>
    <g class="marker-event" :class="{'selected': selectedMarker === entity.id}" :transform="`translate(${entity.cx}, ${entity.cy})`">
        <foreignObject x="5" y="0" :width="labelWidth" height="100" v-show="entity.radius > 3 || selectedMarker === entity.id">
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
import { mapState } from 'vuex'

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
      ...mapState(['compress']),
      labelWidth () {
          //console.log(this.relations)
          return this.selectedMarker === this.entity.id ? 200 : 200
      }
  },
  mounted () {
        // if (this.timeoutContainer) { clearTimeout(this.timeoutContainer) }
        // this.timeoutContainer = setTimeout(() => { 
        //     //this.calcLabelXPosition() 
        //     this.calcLabelYPosition() 
        // }, 500)
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

        console.log(this.compress)

        // calc current bbox of label
        // const bottomPosLabel = currentLabelPos.bottom
        // const leftPosLabel = currentLabelPos.bottom
        // const rightPosLabel = currentLabelPos.bottom

        // get all labels
        const existingLabels = document.getElementsByClassName('label')
        const currentLabel = this.$refs.label
        const currentLabelBBox = currentLabel.getBoundingClientRect()
        //console.log(existingLabels)
        const y = currentLabelBBox.y
        
        for (let index = 0; index < existingLabels.length; index++) {

            if(y > 0) {
                //const y = bbox.y
                console.log(y)
                //left = left === '150px' ? 0 : '150px';
                document.getElementsByTagName("foreignObject")[index].style.y = y + 1 + 'px';
                console.log(document.getElementsByTagName("foreignObject")[index].style.y)
            }
        }
        
      }
  },
  watch: {
      compress: function (current) {

          if (current) {
            this.calcLabelYPosition()
          }
          //console.log(newRelation)
      }
  }
}
</script>