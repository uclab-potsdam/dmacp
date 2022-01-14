<template>
    <g>
        <g id="relations" class="relations" v-show="isMounted">
            <g class="curves" v-if="relations === 'signature'">
                <Signature :relations-data="scaledEntities" />
            </g>
            <g class="links" v-if="relations === 'links'">
                <Links :links-data="scaledEntities" :selected-marker="selectedMarker"/>
            </g>
        </g>
        <g class="dots labels-container">
            <g v-for="(entity, e) in scaledEntities" :key="`${e}-key`">
                <g 
                class="marker" 
                @click="changeSelectedMarker(entity)" 
                :class="[
                    {'limited-visibility': selectedMarker.id !== entity.id && selectedMarker.id !== null},
                    {'disabled-on-compress': entity.radius < 3 && compress}
                ]">
                    <g v-if="entity.uncertaintyScore !== undefined" class="marker-density" :class="[entity.id]">
                        <circle class="marker-halo" :cx="entity.cx" :cy="entity.cy" :r="entity.radius"/>
                        <circle class="marker-stroke" :cx="entity.cx" :cy="entity.cy" r="1"/>
                    </g>
                    <circle v-else class="entity-marker" :cx="entity.cx" :cy="entity.cy" :r="entity.radius" />
                    <circle v-if="selectedMarker.id === entity.id" class="entity-selected" :cx="entity.cx" :cy="entity.cy" :r="entity.radius * 2" />
                </g>

            </g>
            <g v-for="(entity, e) in scaledEntities" :key="`${e}-key-label`">
                <Labels 
                    :selected-marker="selectedMarker" 
                    :entity="entity" 
                    :e="e"
                    :y="defaultYPosition"
                    v-show="events" 
                    :previous-entity="scaledEntities[e - 1]"
                />
            </g>
        </g>
    </g>
</template>

<script>
import Signature from './Signature.vue';
import Links from './Links.vue';
import Labels from './Labels.vue';
import { mapState, mapActions } from 'vuex';
import { changeYPosition } from '../../assets/js/utils.js'

export default {
  name: 'Dots',
  components: {
      Signature,
      Links,
      Labels
    },
  props: {
      scaledEntities: Array,
      scales: Object
  },
  data () {
      return {
            isMounted: false,
            createSignature: true,
            createLinks: false,
            timeoutContainer: null,
            defaultYPosition: 5
      }
  },
  computed: {
      ...mapState(['relations', 'events', 'selectedMarker', 'compress'])
  },
  mounted () {
        this.isMounted = true
        if (this.compress) {
            if (this.timeoutContainer) { clearTimeout(this.timeoutContainer) }
            this.timeoutContainer = setTimeout(() => { 
                changeYPosition(this.compress, this.defaultYPosition, 'label-container') 
            }, 500)
        }
  },
  methods: {
        ...mapActions(['changeSelectedMarker'])
  },
    watch: {
      compress: function (current) {
            console.log(current)
            changeYPosition(this.compress, this.defaultYPosition, 'label-container') 
      }
  }
}
</script>
