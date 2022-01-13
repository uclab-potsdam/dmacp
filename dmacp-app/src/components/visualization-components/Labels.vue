<template>
    <g class="marker-event" :class="{'selected': selectedMarker.id === entity.id}" :transform="`translate(${entity.cx}, ${entity.cy})`">
        <foreignObject class="label-container" :x="x" y="-10" :width="labelWidth" height="100" v-if="showLabel" ref="label">
            <div class="label">
                <p v-if="entity.innerText !== undefined">
                    {{e}}. 
                    <span :class="{'limited-visibility': selectedMarker.id !== entity.id && selectedMarker.id !== null}">
                        {{ entity.innerText }}
                    </span>
                </p>
            </div>
        </foreignObject>
    </g>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'Labels',
    props: {
        entity: Object,
        e: Number,
        previousEntity: Object,
        selectedMarker: Object
    },
    data () {
        return {
            textAnchor: 'left',
            timeoutContainer: null
        }
    },
    computed: {
        ...mapState(['compress']),
        labelWidth () {
            return this.selectedMarker.id === this.entity.id ? 300 : 200
        },
        x () {
            
            let xPosition = 10
            if (this.compress) {
                xPosition = 0
            } else if (this.selectedMarker.id === this.entity.id) {
                xPosition = 20
            }

            return xPosition
        },
        showLabel () {
            const { entity, selectedMarker, compress } = this
            return entity.radius > 3 || selectedMarker.id === entity.id && this.compress === false
        }
    }
}
</script>