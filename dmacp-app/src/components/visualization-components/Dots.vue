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
                @click="changeSelectedMarker(entity.id)" 
                :class="{'limited-visibility': selectedMarker !== entity.id && selectedMarker !== null}"
                >
                    <g v-if="entity.uncertaintyScore !== undefined" class="marker-density" :class="[entity.id]">
                        <circle class="marker-halo" :cx="entity.cx" :cy="entity.cy" :r="entity.radius"/>
                        <circle class="marker-stroke" :cx="entity.cx" :cy="entity.cy" r="2"/>
                    </g>
                    <circle v-else class="entity-marker" :cx="entity.cx" :cy="entity.cy" :r="entity.radius" />
                </g>
                <Labels 
                    :selected-marker="selectedMarker" 
                    :entity="entity" 
                    :e="e" 
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
          createLinks: false
      }
  },
  computed: {
      ...mapState(['relations', 'events', 'selectedMarker'])
  },
  mounted () {
        this.isMounted = true
  },
  methods: {
        ...mapActions(['changeSelectedMarker'])
  }
}
</script>
