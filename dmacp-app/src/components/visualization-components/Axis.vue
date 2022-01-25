<template>
      <g class="ticks">
        <g class="x-axis">
          <g transform="translate(20, 20)">
            <text x="0" y="0">
              Time of the told: how entities are presented along time
            </text>
            <line x1="1" x2="50" y1="15" y2="15" stroke="#2c3e50" />
            <path d="M45,10 L50,15 L45,20" stroke="#2c3e50" fill="none" />          
          </g>
          <g v-for="(tick, t) in xTicks" :key="`${t}-tickX`" :transform="`translate(${scales.x(tick)}, 0)`">
            <line x1="0" x2="0" y1="0" :y2="sizes.height" class="axis" />
              <text x="10" y="-5" :transform="`translate(0, ${sizes.height - 20}) rotate(90)`" text-anchor="end">
                {{formatXTicks(tick)}}
              </text>
          </g>
        </g>
        <g v-if="compress === false" class="y-axis">
          <g transform="translate(20, 50)">
            <text x="-5" y="0" transform="rotate(90)">
              Time of the telling: how entities are presented within the essay
            </text>
            <line x1="20" x2="20" y1="-15" y2="50" stroke="#2c3e50"/>
            <path d="M15,45 L20,50 L25,45" stroke="#2c3e50" fill="none" />
          </g>
          <!-- <g v-for="(tick, t) in yTicks" :key="`${t}-tickY`" :transform="`translate(0, ${scales.y(tick)})`">
            <line y1="0" y2="0" x1="0" :x2="sizes.width" class="axis" />
            <text x="10" y="-4">{{tick}}</text>
          </g> -->
        </g>
        <g v-else>
          <line :y1="sizes.height / 2" :y2="sizes.height / 2" x1="0" :x2="sizes.width" class="axis" />
        </g>
      </g>
</template>

<script>
import { timeFormat } from 'd3-time-format'

export default {
    name: 'Axis',
    props: {
        sizes: Object,
        xTicks: Array,
        yTicks: Array,
        scales: Object,
        compress: Boolean
    },
    methods: {
    formatXTicks (tick) {
      const formatter = timeFormat('%Y')
      const date = new Date(tick, 1, 1)

      if (tick < 100) {
        date.setFullYear(Math.abs(tick))
      }

      return tick > 0 ? formatter(date).toString() + ' CE' : Math.abs(tick).toString() + ' BCE'
    }
  }
}
</script>