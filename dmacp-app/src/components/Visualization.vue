<template>
  <div class="visualization-container" ref="visualization">
    <svg :width="sizes.width" :height="sizes.height">
      <Filters :sizes="sizes"/>
      <g class="ticks">
        <g v-for="(tick, t) in xTicks" :key="`${t}-tickX`" :transform="`translate(${xScale(tick)}, 0)`">
          <line x1="0" x2="0" y1="0" :y2="sizes.height" class="axis" />
        </g>
        <g v-if="compress === false">
          <g v-for="(tick, t) in yTicks" :key="`${t}-tickY`" :transform="`translate(0, ${yScale(tick)})`">
            <line y1="0" y2="0" x1="0" :x2="sizes.width" class="axis" />
          </g>
        </g>
      </g>
      <Intervals v-if="compress === false" :data="data" :scales="{ xScale, yScale }" :ticks="xTicks"/>
      <Dots :scaled-entities="scaledEntities" :scales="{ xScale, yScale }" />
    </svg>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { scaleSymlog, scaleLinear } from 'd3-scale'
import { extent, mode } from 'd3-array'
import Dots from './visualization-components/Dots.vue'
import Intervals from './visualization-components/Intervals.vue'
import Filters from './visualization-components/SvgFilters.vue'


export default {
  name: 'Visualization',
  components: {
    Dots,
    Intervals,
    Filters
  },
  data () {
    return {
      sizes: { height: 0, width: 0 },
      xTicks: []
      //compress: false
    }
  },
  computed: {
    ...mapState(['data', 'compress']),
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
    },
    yTicks () {
      return this.yScale.ticks()
    },
    scaledEntities () {
    const xScale = this.xScale
    const yScale = this.yScale
    const data = this.data
    return data.map((essay, e) => {
        return essay.map((narration, n) => {
            return narration.entityTimePosition.map((entity, index) => {
                const targets = narration.targets
                return {
                        narration: e,
                        id: narration.resource,
                        textualLabel: entity.label,
                        cx: xScale(entity.x),
                        cy: this.compress ? this.sizes.height / 2 : yScale(entity.y),
                        radius: 2 + 1 * narration.targets.length,
                        type: narration.type,
                        context: narration.intervalContext,
                        targets
                    }
                } )
            })
        }).flat(2)
    }
  },
  mounted () {
    this.calcContainerSize()
    window.addEventListener('resize', this.calcContainerSize, false)
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
      const logScaleTicks = scale.ticks(5)
      logScaleTicks.push(this.xValuesMode)
      this.xTicks = logScaleTicks
    }
  },
  updated () {
    this.calcContainerSize()
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.calcContainerSize, false)
  }
}
</script>
