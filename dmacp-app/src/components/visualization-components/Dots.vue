<template>
    <g>
        <g class="relations" v-if="isMounted">
            <g class="curves">
                <Signature :data="scaledEntities" />
            </g>
            <g class="links">
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
      data: Array,
      scales: Object
  },
  data () {
      return {
          isMounted: false
      }
  },
  computed: {
    scaledEntities () {
    const xScale = this.scales.xScale
    const yScale = this.scales.yScale
    const data = this.data

    return data.map((essay, e) => {
        return essay.map((narration) => {
            return narration.entityTimePosition.map((entity) => {
                return {
                        narration: e,
                        id: narration.resource,
                        textualLabel: entity.label,
                        cx: xScale(entity.x),
                        cy: yScale(entity.y),
                        radius: 2 + 1 * narration.targets.length,
                        type: narration.type,
                        context: narration.intervalContext,
                        targets: narration.targets
                    }
                } )
            })
        }).flat(2)
    }
  },
  mounted () {
      this.isMounted = true
    //   console.log(this.$options.name, 'is mounted')
  }
}
</script>
