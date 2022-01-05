<template>
    <g class="intervals">
        <g v-for="(interval, i) in scaledIntervals" :key="`${i}-interval-key`">
            <rect 
                v-if="interval.indefinite == 'indefinite' && interval.context !== null"
                :class="[interval.context, interval.indefinite]"
                :x="interval.x1"
                :y="interval.y1 - 1"
                :width="interval.x2"
                height="2"
            />
            <line 
                v-else
                :class="interval.indefinite"
                :x1="interval.x1"
                :x2="interval.x2"
                :y1="interval.y1"
                :y2="interval.y1"
            />
        </g>
    </g>
</template>

<script>
import { max } from 'd3-array';

export default {
  name: 'Intervals',
  props: {
      data: Array,
      scales: Object,
      ticks: Array
  },
  computed: {
      scaledIntervals () {
        const { data } = this
        const xTicks = this.ticks
        const xScale = this.scales.xScale
        const yScale = this.scales.yScale

        return data.map((essay, e) => {
        return essay.map((narration, n) => {
            let x1 = 0;
            let x2 = 0;
            const entityLength = narration.entityTimePosition.length
            if (entityLength > 0) {
                x1 = xScale(narration.entityTimePosition[0].x)
                x2 = entityLength < 2 ? xScale(max(xTicks.map(d => { return d }))) : xScale(narration.entityTimePosition[entityLength - 1].x)
            }

            return narration.entityTimePosition.map( (entity) => {
                const definitionOfInterval = x2 === xScale(max(xTicks.map(d => { return d }))) ? 'indefinite' : 'finite'
                const y = yScale(entity.y);
                return {
                        narration: e,
                        x1,
                        x2,
                        y1: y,
                        type: narration.type,
                        indefinite: definitionOfInterval,
                        context: narration.intervalContext
                    }
                }).filter(entity => entity.type === 'interval')
            })
    }).flat(2)
    }
  },
  mounted() {
    //   console.log(this.scaledIntervals.map(d => d.context))
  }
}
</script>