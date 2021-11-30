<template>
  <div class="visualization-container" ref="visualization">
    <!-- <p> {{ xScale(xValues[0]) }}, {{ yValues }}</p> -->
    <svg :width="sizes.width" :height="sizes.height">
      <Dots :data="data" :scales="{ xScale, yScale }"/>
      <g v-for="(entity, e) in scaledEntities" :key="`${e}-key`">
        <circle :cx="entity.cx" :cy="entity.cy" r="2"/>
      </g>
    </svg>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { scaleSymlog, scaleLinear } from 'd3-scale'
import { extent } from 'd3-array'
import Dots from './visualization-components/Dots.vue'

export default {
  name: 'Visualization',
  components: {
    Dots
  },
  data () {
    return {
      sizes: { height: 0, width: 0 }
    }
  },
  computed: {
    ...mapState(['data']),
    xValues () { return this.data.map(essay => essay.map(narration => narration.entityTimePosition.map( entity => entity.x ))).flat(2) },
    yValues () { return this.data.map(essay => essay.map(narration => narration.entityTimePosition.map( entity => entity.y ))).flat(2) },
    xScale () {
      const width = this.sizes.width
      const { xValues } = this
      const xScale_ = scaleSymlog()
                        .domain(extent(xValues.map(d => { return d})))
                        .constant(1).range([100, 1.33*width])
                        .clamp(false)
                        .nice()

      return (x) => { return xScale_(x-1945) }
    },
    yScale () {
      const height = this.sizes.height
      const { yValues } = this
      return scaleLinear()
                .domain(extent(yValues.map(d => { return d })))
                .range([30, height - 30])
    }
  },
  mounted () {
    this.calcContainerSize()
    console.log(this.scaledEntities)
  },
  methods: {
        calcContainerSize () {
          const { visualization } = this.$refs
          let cHeight = visualization.clientHeight
          let cWidth = visualization.clientWidth

          this.sizes.height = cHeight
          this.sizes.width = cWidth
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

</style>
