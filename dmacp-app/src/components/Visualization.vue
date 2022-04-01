<template>
  <div class="visualization-container" ref="visualization">
    <svg id="abgc-cycles" :width="sizes.width" :height="sizes.height">
      <rect 
        :width="sizes.width" 
        :height="sizes.height" 
        x="0" 
        y="0" 
        fill="#C4C4C4"
        fill-opacity="0"
        @click="changeSelectedMarker(resetMarkerSelection)"
      />
      <Filters :sizes="sizes"/>
      <transition name="fade">
        <g v-if="visualization">
          <Intervals v-if="compress === false" :data="data" :scales="{ xScale, yScale }" :ticks="xTicks"/>
          <Dots :scaled-entities="scaledEntities" :scales="{ xScale, yScale }"/>
        </g>
      </transition>
      <Axis :sizes="sizes" :x-ticks="xTicks" :y-ticks="yTicks" :scales="{x: xScale, y: yScale}" :compress="compress"/>
    </svg>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { scaleSymlog, scaleLinear } from 'd3-scale'
import { extent, min, max, bin, mode } from 'd3-array'
import * as simplestat from 'simple-statistics'
import Dots from './visualization-components/Dots.vue'
import Axis from './visualization-components/Axis.vue'
import Intervals from './visualization-components/Intervals.vue'
import Filters from './visualization-components/SvgFilters.vue'


export default {
  name: 'Visualization',
  components: {
    Dots,
    Axis,
    Intervals,
    Filters
  },
  data () {
    return {
      sizes: { height: 0, width: 0 },
      margin: {left: 200, top: 0, right: 200, bottom: 0},
      xTicks: [],
      resetMarkerSelection: {id: null, type: null},
      visualization: false
    }
  },
  computed: {
    ...mapState(['data', 'compress', 'selectedMarker', 'essayKey']),
    xValues () { 
      return this.data.map(essay => essay.map(narration => narration.entityTimePosition.map( entity => entity.x ))).flat(2) 
    },
    yValues () { 
      return this.data.map(essay => essay.map(narration => narration.entityTimePosition.map( entity => entity.y ))).flat(2) 
    },
    xValuesQuantile () {
      const { xValues } = this
      // create binning operator with custom threshold based on Ckmeans / Jenks algorithm
      const bin20 = bin().thresholds(data => simplestat.ckmeans(data, 20).map(l => min(l)))
      // Feed x values to operator
      const binnedData = bin20(xValues)
      // Obtain index of longest array (most dense cluster of points)
      const indexOfLongestArray = binnedData.map(a => a.length).indexOf(Math.max(...binnedData.map(a => a.length)));
      // Get the most popular value from array, this will become the centre of our scale
      return mode(binnedData[indexOfLongestArray]) 
    }, 
    xScale () {
      const width = this.sizes.width
      const { xValues, xValuesQuantile } = this

      const hasNegative = xValues.some(v => v < 0);
      const currentPivot = hasNegative ? xValuesQuantile : 0
      // Needs to find consistent way of tweaking right margin for range
      const xScale_ = scaleSymlog()
                        .domain([min(xValues.map(d => { return d})), max(xValues.map(d => { return d})) - currentPivot])
                        .constant(1).range([100, width - this.margin.right])
                        .clamp(false)
                        .nice()

      this.storeRealScale(xScale_)
return (x) => { 
        // Shift centre only if negative values are present
        return xScale_(x-currentPivot)
      }
    },
    yScale () {
      const height = this.sizes.height
      const { yValues } = this
      return scaleLinear()
                .domain(extent(yValues.map(d => { return d })))
                .range([this.margin.bottom, height - this.margin.top])
    },
    yTicks () {
      return this.yScale.ticks(50)
    },
    scaledEntities () {
    const xScale = this.xScale
    const yScale = this.yScale
    const data = this.data
    return data.map((essay, e) => {
        return essay.map((narration, n) => {
            return narration.entityTimePosition.map((entity) => {
                const targets = narration.targets
                return {
                        narration: e,
                        id: narration.resource,
                        textualLabel: entity.label,
                        calendarDate: entity.x,
                        cx: xScale(entity.x),
                        cy: this.compress ? this.sizes.height / 2 : yScale(entity.y),
                        radius: 2 + 1 * narration.targets.length,
                        type: narration.type,
                        context: narration.intervalContext,
                        innerText: entity.innerText,
                        uncertaintyScore: entity.indefinitness,
                        targets,
                        provenance: narration.dataSource
                    }
                } )
            })
        }).flat(2)
    }
  },
  mounted () {
    this.visualization = true
    this.calcContainerSize()
    window.addEventListener('resize', this.calcContainerSize, false)

 },
  methods: {
    ...mapActions(['changeSelectedMarker']),
    calcContainerSize () {
      const { visualization } = this.$refs
      let cHeight = visualization.clientHeight
      let cWidth = visualization.clientWidth
      
      this.margin.top = this.margin.bottom = Math.max(cWidth / 100 * 5, 50)
      this.sizes.height = cHeight
      this.sizes.width = cWidth
    },
    storeRealScale (scale) {
      const logScaleTicks = scale.ticks(5)
      logScaleTicks.push(this.xValuesQuantile)
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
