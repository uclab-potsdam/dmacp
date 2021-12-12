<template>
    <g>
        <g class="relations" v-if="isMounted">
            <g class="curves" v-if="createSignature">
                <Signature :relations-data="scaledEntities" />
            </g>
            <g class="links" v-if="createLinks">
                <Links :links-data="scaledEntities" />
            </g>
        </g>
        <g class="dots">
            <g v-for="(entity, e) in scaledEntities" :key="`${e}-key`">
                <g class="marker-density">
                    <circle :cx="entity.cx" :cy="entity.cy" :r="entity.radius"/>
                </g>
                <circle class="entity-marker" :cx="entity.cx" :cy="entity.cy" r="2"/>
                <text v-show="entity.radius > 3" :x="entity.cx + 10" :y="entity.cy">{{e}}, {{ entity.id }}</text>
            </g>
        </g>
    </g>
</template>

<script>
import Signature from './Signature.vue';
import Links from './Links.vue';

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
  mounted () {
      this.isMounted = true
      //console.log(this.$options.name, 'is mounted')
      //console.log(this.scaledEntities)
  }
}
</script>
