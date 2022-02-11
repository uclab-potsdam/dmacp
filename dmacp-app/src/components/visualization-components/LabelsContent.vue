<template>
    <!-- On hover make only text visible, then click to highlight relations -->
    <g :class="compress === true ? 'compressed-view' : 'expanded-view'"> 
        <g class="marker-event" v-for="(entity, e) in data" :key="`${e}-key-label`" :class="{'selected': evaluateSelection(entity)}" :transform="`translate(${entity.x}, ${entity.y})`">
            <line v-if="entity.labelText !== undefined && compress" :x1="0" :x2="0" :y1="entity.y1" :y2="entity.y2 " stroke="#e0e0e0"/>
            <foreignObject 
                class="label-container" 
                x="10" 
                :y="compress ? entity.y2 : -5" width="250" height="100" :class="[evaluateVisibility(entity), changeTextFlag(entity)]" 
            >
                <div class="label">
                    <p v-if="entity.labelText !== undefined" @click="changeSelectedMarker(entity)" :class="{'limited-visibility': limitVisibility(entity)}">
                        <span v-show="evaluateVisibility(entity)" id="date">
                            {{timeLabelString(entity.timeLabel)}}.
                        </span>
                        <span id="label">
                            {{ entity.labelText }}
                        </span>
                    </p>
                </div>
            </foreignObject>
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
        timeLabelString(date) {
            const absValue = Math.abs(date)
            const epoch = date < 0 ? ' BCE' : ' CE'
            return absValue.toString() + epoch
        },
        changeTextFlag(entity) {
            let flagDirection = 'left'
            if (this.compress === false) {
                if (entity.context === ('is-beginning' || null)) {
                    flagDirection = 'right'
                } else if (entity.type === 'interval' && entity.context === null){
                    flagDirection = 'left'
                }
            }
            return flagDirection
        },
        evaluateSelection(entity) {
            const { selectedMarker } = this
            return selectedMarker.id === entity.id
        },
        evaluateVisibility(entity) {
            const { selectedMarker } = this

            const isRelevant = entity.relations > 3
            const IDsMatch = selectedMarker.id === entity.id
            const targetsExist = selectedMarker.targets !== undefined
            const entitiesAreRelated = selectedMarker.targets.includes(entity.id)
                        
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
            const entitiesAreUnrelated = !selectedMarker.targets.includes(entity.id)

            return isNotRelevant && isNotDefault && targetsExist && entitiesAreUnrelated
        }
    }
}
</script>