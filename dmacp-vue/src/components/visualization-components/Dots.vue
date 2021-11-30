<template>
    <g>
        <g class="curves">
            <Signature :data="scaledEntities" />
        </g>
        <g class="dots">
            <g v-for="(entity, e) in scaledEntities" :key="`${e}-key`">
            <circle :cx="entity.cx" :cy="entity.cy" r="2"/>
            </g>
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

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

</style>
