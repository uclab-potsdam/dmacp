<template>
  <div class="legend-container">
        <div class="legend-inner">
            <div class="legend" v-if="legend" @click="legend = false">
                <h6>How to read:</h6>
                <div class="legend-elements">
                    <div class="dots">
                        <div>
                            <p class="label">Size of dot: number of relations for this entity</p>
                            <svg :width="sizes.width" :height="sizes.height">
                                <circle v-for="(dot, d) in dummyDots" :key="dot" :cx="dummyScale(d)" cy="15" :r="dot" />
                            </svg>
                        </div>
                        <div>
                            <p class="label">Blurriness: indefiniteness</p>
                            <svg :width="sizes.width" :height="sizes.height * 2">
                                <Filters :sizes="sizes"/>
                                <g :transform="`translate(${dummyScale(dummyDots[0])}, 0)`">
                                <circle :class="`blurry-${blur.blurriness}`" v-for="(blur, b) in legendBlurriness" :key="b" :cx="blur.blurriness * 10" cy="15" r="4"/>
                                </g>
                                <g transform="translate(0, 30)">
                                    <rect x="5" y="5" height="5" width="90" class="is-end" />
                                    <rect x="5" y="20" height="5" width="90" class="is-beginning" />
                                    <line x1="5" x2="95" y1="35" y2="35" class="finite"/>
                                </g>
                            </svg>
                        </div>
                    </div>
                    <div class="relations">
                        <p class="label">Orientation of arc: directionality of relation</p>
                        <svg :width="sizes.width" :height="sizes.height * 2">
                            <path class="precedes" d="M10,50A 15,15 0 0,1 80,50" fill="none" stroke="rgb(120, 115, 243)"/>
                            <path class="follows" d="M30,50A 15,15 0 0,0 100,50" fill="none" stroke="#727193" />
                            <circle cx="10" cy="50" r="4"/>
                            <circle cx="100" cy="50" r="4"/>
                            <circle cx="30" cy="50" r="4"/>
                            <circle cx="80" cy="50" r="4"/>
                        </svg>
                    </div>
                </div>
            </div>
            <div class="legend-toggle" v-else @click="legend = true">
             <span class="helper"></span><img src="../assets/img/legend.svg"/>
            </div>
        </div>
  </div>
</template>

<script>
import Filters from './visualization-components/SvgFilters.vue'
import { scaleLinear } from 'd3-scale'

export default {
  name: 'Legend',
  components: {
      Filters
  },
  data () {
      return {
          dummyDots: [1, 2, 3, 4, 5, 6, 7, 9, 10],
          sizes: {width: 150, height: 50},
          legend: false
      }
  },
  computed: {
      dummyScale () {
          return scaleLinear().domain([1, 9]).range([10, 140])
      },
      legendBlurriness () {
          const slicedArray = this.dummyDots.slice(0, 5)
          return slicedArray.map((d, i) => {
              return {
                  blurriness: 2 * i
              }
          })
      }
  }
}
</script>
<style>

</style>
