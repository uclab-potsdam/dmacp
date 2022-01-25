<template>
    <g>
    <!-- <transition name="fade-relations"> -->
        <g id="relations" class="relations" v-show="isMounted">
            <g class="curves" v-if="relations === 'signature'">
                <Signature :relations-data="scaledEntities" />
            </g>
            <g class="links" v-if="relations === 'links'">
                <Links :links-data="scaledEntities" :selected-marker="selectedMarker" :is-mounted="isMounted"/>
            </g>
        </g>
        <g class="dots">
            <g v-for="(entity, e) in scaledEntities" :key="`${e}-key`" class="marker-container">
                <g 
                class="marker" 
                @click="changeSelectedMarker(entity)" 
                :class="[
                    {'limited-visibility': selectedMarker.id !== entity.id && selectedMarker.id !== null && !selectedMarker.targets.includes(entity.id)},
                    {'disabled-on-compress': entity.radius < 3 && compress}
                ]">
                    <g v-if="entity.uncertaintyScore !== undefined" class="marker-density" :class="[entity.id]">
                        <circle :class="`marker-halo blurry-${entity.uncertaintyScore * 2}`" :cx="entity.cx" :cy="entity.cy" :r="entity.radius"/>
                        <circle class="marker-stroke" :cx="entity.cx" :cy="entity.cy" r="1"/>
                    </g>
                    <circle v-else :class="`entity-marker ${entity.id}`" :cx="entity.cx" :cy="entity.cy" :r="entity.radius" />
                    <circle v-if="selectedMarker.id === entity.id" class="entity-selected" :cx="entity.cx" :cy="entity.cy" :r="entity.radius * 2" />
                </g>
            </g>
            <g>
                <Labels  v-show="events" :data="scaledEntities" :selected-marker="selectedMarker" />
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
  },
  methods: {
        ...mapActions(['changeSelectedMarker'])
  }
}
</script>
<style>
  .fade-relations-enter-active, .fade-relations-leave-active {
  transition: opacity 1s .2s;
}
.fade-relations-enter, .fade-relations-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>