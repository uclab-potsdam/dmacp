<template>
    <g>
        <g class="dots">
            <g v-for="(entity, e) in scaledEntities" :key="`${e}-key`">
                <g class="marker-density">
                    <circle v-show="entity.radius > 3" :cx="entity.cx" :cy="entity.cy" :r="entity.radius"/>
                </g>
            <circle class="entity-marker" :cx="entity.cx" :cy="entity.cy" r="2"/>
            <text v-show="entity.radius > 3" :x="entity.cx + 10" :y="entity.cy">{{e}}, {{ entity.id }}</text>
            </g>
        </g>
        <g class="curves">
            <Signature :data="scaledEntities" />
        </g>
        <g class="links">
            <Links :data="scaledEntities"/>
        </g>
    </g>
</template>

<script>
import Signature from './Signature.vue';

export default {
  name: 'Dots',
  components: {
      Signature
  },
  props: {
      data: Array,
      scales: Object
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
  }
}
</script>
