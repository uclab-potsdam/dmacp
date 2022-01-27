<template>
    <g class="labels-container">
        <!-- On hover make only text visible, then click to highlight relations -->
        <g class="expanded-view" v-if="!this.compress"> 
            <g class="marker-event" v-for="(entity, e) in data" :key="`${e}-key-label`" :class="{'selected': evaluateSelection(entity)}" :transform="`translate(${entity.x}, ${entity.y})`">
                <foreignObject class="label-container" x="10" y="-5" width="300" height="100" :class="evaluateVisibility(entity)">
                    <div class="label">
                        <p v-if="entity.labelText !== undefined" @click="changeSelectedMarker(entity)">
                            <span v-show="evaluateVisibility(entity)">
                                {{entity.index + 1}}.
                            </span>
                            <span :class="{'limited-visibility': limitVisibility(entity)}">
                                {{ entity.labelText }}
                            </span>
                        </p>
                    </div>
                </foreignObject>
            </g>
        </g>
    </g>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  name: 'LabelsContent',
    props: {
        data: Array,
        selectedMarker: Object
    },
    computed: {
        ...mapState(['compress'])
    },
    methods: {
        ...mapActions(['changeSelectedMarker']),
        evaluateSelection(entity) {
            const { selectedMarker } = this
            return selectedMarker.id === entity.id
        },
        evaluateVisibility(entity) {
            const { selectedMarker } = this

            const isRelevant = entity.relations > 3
            const IDsMatch = selectedMarker.id === entity.id
            const targetsExist = selectedMarker.targets !== undefined
            const entitiesAreRelated = targetsExist ? selectedMarker.targets.includes(entity.id) : false
                        
            if (isRelevant || IDsMatch || targetsExist && entitiesAreRelated) {
                return 'label-visible'
            } else if (isRelevant && !targetsExist || entitiesAreRelated) {
                return true
            } else {
                return 'label-hidden'
            }
        },
        limitVisibility(entity) {
            const { selectedMarker } = this
            const isNotRelevant = selectedMarker.id !== entity.id
            const isNotDefault = selectedMarker.id !== null
            const targetsExist = selectedMarker.targets !== undefined
            const entitiesAreUnrelated = targetsExist ? !selectedMarker.targets.includes(entity.id) : false

            return isNotRelevant && isNotDefault && targetsExist && entitiesAreUnrelated
        }
    }
}
</script>