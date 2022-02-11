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
                                <g :transform="`translate(${dummyScale(dummyDots[0]) + 10}, 0)`" v-for="(blur, b) in legendBlurriness" :key="b">
                                    <circle :class="`blurry-${blur.blurriness}`" :cx="blur.blurriness * 22" cy="15" r="4"/>
                                    <text :x="blur.blurriness * 22" y="35" text-anchor="middle">
                                        {{blur.blurriness / 10}} / {{ (blur.blurriness + 2) / 10}}
                                    </text>
                                </g>
                                <g transform="translate(5, 50)">
                                    <g>
                                        <rect x="0" y="5" height="5" width="150" class="is-beginning" />
                                        <circle cx="0" cy="7.5" r="3"/>
                                        <text x="155" y="10">Indefinite end</text>
                                    </g>
                                    <g>
                                        <rect x="0" y="20" height="5" width="145" class="is-end" />
                                        <circle cx="145" cy="22" r="3"/>
                                        <text x="155" y="25">Indefinite beginning</text>
                                    </g>
                                    <g>
                                        <line x1="0" x2="145" y1="40" y2="40" class="finite"/>
                                        <circle cx="0" cy="40" r="3"/>
                                        <circle cx="145" cy="40" r="3"/>
                                        <text x="155" y="42">Definite Interval</text>
                                    </g>
                                </g>
                            </svg>
                        </div>
                    </div>
                    <div class="relations">
                        <p class="label">Orientation of arc: directionality of relation</p>
                        <svg :width="sizes.width - 50" :height="sizes.height * 4">
                            <g>
                                <text x="0" y="10">
                                    The entity is linked <tspan x="0" y="20">to a future event</tspan>
                                </text>
                            </g>
                            <g transform="translate(0, 20)">
                                <g>
                                    <path class="concurs" d="M90,100 V 50" fill="none" stroke="#ffffff" />
                                    <text x="100" y="70">
                                        The entity is linked <tspan x="100" y="80">to a concurring event</tspan>
                                    </text>
                                </g>
                                <g>
                                    <path class="follows" d="M90,100A 15,15 0 0,0 180,100" fill="none" stroke="#727193" />
                                    <circle cx="90" cy="100" r="4"/>
                                    <circle cx="180" cy="100" r="4"/>
                                    <text x="90" y="160">
                                        The entity is linked <tspan x="90" y="170">to a past event</tspan>
                                    </text>
                                </g>
                                <g>
                                    <path class="precedes" d="M10,50A 15,15 0 0,1 90,50" fill="none" stroke="rgb(120, 115, 243)"/>
                                    <circle cx="10" cy="50" r="4"/>
                                    <circle cx="90" cy="50" r="4"/>
                                </g>
                            </g>
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
          sizes: {width: 250, height: 50},
          legend: true
      }
  },
  computed: {
      dummyScale () {
          return scaleLinear().domain([1, 9]).range([10, this.sizes.width - 20])
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

