<template>
  <div class="visualization-container" ref="visualization">
    <svg :width="sizes.width" :height="sizes.height">
      <Intervals :data="data" :scales="{ xScale, yScale }" :ticks="xTicks"/>
      <Dots :data="data" :scales="{ xScale, yScale }" />
    </svg>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { scaleSymlog, scaleLinear } from 'd3-scale'
import { extent, mode } from 'd3-array'
import Dots from './visualization-components/Dots.vue'
import Intervals from './visualization-components/Intervals.vue'


export default {
  name: 'Visualization',
  components: {
    Dots,
    Intervals
  },
  data () {
    return {
      sizes: { height: 0, width: 0 },
      xTicks: []
    }
  },
  computed: {
    ...mapState(['data']),
    xValues () { return this.data.map(essay => essay.map(narration => narration.entityTimePosition.map( entity => entity.x ))).flat(2) },
    yValues () { return this.data.map(essay => essay.map(narration => narration.entityTimePosition.map( entity => entity.y ))).flat(2) },
    xValuesMode () { return mode(this.xValues) }, 
    xScale () {
      const width = this.sizes.width
      const { xValues, xValuesMode } = this
      const xScale_ = scaleSymlog()
                        .domain(extent(xValues.map(d => { return d})))
                        .constant(1).range([100, 1.33*width])
                        .clamp(false)
                        .nice()

      this.storeRealScale(xScale_)

      return (x) => { return xScale_(x-xValuesMode) }
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
 },
  methods: {
        calcContainerSize () {
          const { visualization } = this.$refs
          let cHeight = visualization.clientHeight
          let cWidth = visualization.clientWidth

          this.sizes.height = cHeight
          this.sizes.width = cWidth
    },
    storeRealScale (scale) {
      this.xTicks = scale.ticks(5)
    }
  }
}
</script>
