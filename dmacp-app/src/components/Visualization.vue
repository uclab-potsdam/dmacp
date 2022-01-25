<template>
  <div class="visualization-container" ref="visualization">
    <svg :width="sizes.width" :height="sizes.height">
      <rect 
        :width="sizes.width" 
        :height="sizes.height" 
        x="0" 
        y="0" 
        fill="#C4C4C4"
        @click="changeSelectedMarker(resetMarkerSelection)"
      />
      <Filters :sizes="sizes"/>
      <g class="ticks">
        <g class="x-axis">
          <g transform="translate(20, 20)">
            <text x="0" y="0">
              Time of the told: how entities are presented along time
            </text>
            <line x1="1" x2="50" y1="15" y2="15" stroke="black"/>
            <path d="M45,10 L50,15 L45,20" stroke="black" fill="none" />          
          </g>
          <g v-for="(tick, t) in xTicks" :key="`${t}-tickX`" :transform="`translate(${xScale(tick)}, 0)`">
            <line x1="0" x2="0" y1="0" :y2="sizes.height" class="axis" />
              <text x="10" y="-5" :transform="`translate(0, ${sizes.height - 20}) rotate(90)`" text-anchor="end">
                {{formatXTicks(tick)}}
              </text>
          </g>
        </g>
        <g v-if="compress === false" class="y-axis">
          <g transform="translate(20, 50)">
            <text x="0" y="0" transform="rotate(90)">
              Time of the telling: how entities are presented within the essay
            </text>
            <line x1="20" x2="20" y1="1" y2="50" stroke="black"/>
            <path d="M15,45 L20,50 L25,45" stroke="black" fill="none" />
          </g>
          <!-- <g v-for="(tick, t) in yTicks" :key="`${t}-tickY`" :transform="`translate(0, ${yScale(tick)})`">
            <line y1="0" y2="0" x1="0" :x2="sizes.width" class="axis" />
            <text x="10" y="-4">{{tick}}</text>
          </g> -->
        </g>
        <g v-else>
          <line :y1="sizes.height / 2" :y2="sizes.height / 2" x1="0" :x2="sizes.width" class="axis" />
        </g>
      </g>
      <transition name="fade">
        <g v-if="visualization">
          <Intervals v-if="compress === false" :data="data" :scales="{ xScale, yScale }" :ticks="xTicks"/>
          <Dots :scaled-entities="scaledEntities" :scales="{ xScale, yScale }"/>
        </g>
      </transition>
    </svg>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { scaleSymlog, scaleLinear } from 'd3-scale'
import { extent, mode, max } from 'd3-array'
import { timeFormat } from 'd3-time-format'
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
      xTicks: [],
      resetMarkerSelection: {id: null, type: null},
      visualization: false
    }
  },
  computed: {
    ...mapState(['data', 'compress', 'selectedMarker']),
    xValues () { 
      return this.data.map(essay => essay.map(narration => narration.entityTimePosition.map( entity => entity.x ))).flat(2) 
    },
    yValues () { 
      return this.data.map(essay => essay.map(narration => narration.entityTimePosition.map( entity => entity.y ))).flat(2) 
    },
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
      // here fix needed if events are not spread out in time
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
                        cx: xScale(entity.x),
                        cy: this.compress ? this.sizes.height / 2 : yScale(entity.y),
                        radius: 2 + 1 * narration.targets.length,
                        type: narration.type,
                        context: narration.intervalContext,
                        innerText: entity.innerText,
                        uncertaintyScore: entity.indefinitness,
                        targets
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

      this.sizes.height = cHeight
      this.sizes.width = cWidth
    },
    storeRealScale (scale) {
      const logScaleTicks = scale.ticks(5)
      logScaleTicks.push(this.xValuesMode)
      logScaleTicks.push(2022)
      this.xTicks = logScaleTicks
    },
    formatXTicks (tick) {
      const formatter = timeFormat('%Y')
      const date = new Date(tick, 1, 1)

      if (tick < 100) {
        date.setFullYear(Math.abs(tick))
      }

      return tick > 0 ? formatter(date).toString() + ' CE' : tick.toString() + ' BCE'
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
