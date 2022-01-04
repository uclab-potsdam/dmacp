<template>
    <g>
        <g class="relations" v-if="isMounted">
            <g class="curves" v-if="relations === 'signature'">
                <Signature :relations-data="scaledEntities" />
            </g>
            <g class="links" v-if="relations === 'links'">
                <Links :links-data="scaledEntities" />
            </g>
        </g>
        <g class="dots">
            <g v-for="(entity, e) in scaledEntities" :key="`${e}-key`">
                <g class="marker-density">
                    <circle :cx="entity.cx" :cy="entity.cy" :r="entity.radius"/>
                </g>
                <circle class="entity-marker" :cx="entity.cx" :cy="entity.cy" r="2"/>
                <g class="marker-event" v-if="events">
                <text v-show="entity.radius > 3" :x="entity.cx + 10" :y="entity.cy">{{e}}, {{ entity.id }}</text>
                </g>
            </g>
        </g>
    </g>
</template>

<script>
import Signature from './Signature.vue';
import Links from './Links.vue';
import { mapState } from 'vuex';

export default {
  name: 'Dots',
  components: {
      Signature,
      Links 
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
      ...mapState(['relations', 'events'])
  },
  mounted () {
      this.isMounted = true
      console.log(this.relations)
      //console.log(this.$options.name, 'is mounted')
      //console.log(this.scaledEntities)
  }
}
</script>
