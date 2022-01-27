<template>
    <g class="labels-container">
        <!-- On hover make only text visible, then click to highlight relations -->
        <g class="expanded-view" v-if="!this.compress"> 
            <LabelsContent :data="dataForLabels.expandedView" :selected-marker="selectedMarker"/>
        </g>
        <g class="compressed-view" v-else>
            <g class="marker-event" v-for="(entity, e) in dataForLabels.compressedView" :key="`${e}-key-label`" :class="{'selected': selectedMarker.id === entity.id}" :transform="`translate(${entity.x}, ${entity.y})`">
                <line v-if="entity.labelText !== undefined" :x1="0" :x2="0" :y1="entity.y1" :y2="entity.y2 " stroke="#e0e0e0"/>
                <foreignObject class="label-container" x="5" :y="entity.y2" width="250" height="100">
                    <div class="label">
                        <p v-if="entity.labelText !== undefined" @click="changeSelectedMarker(entity)">
                            {{entity.index + 1}}. 
                            <span :class="{'limited-visibility': selectedMarker.id !== entity.id && selectedMarker.id !== null}">
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
import LabelsContent from './LabelsContent.vue'
import { calcVerticalSpace } from '../../assets/js/utils.js'

export default {
  name: 'Labels',
    components: {
        LabelsContent
    },
    props: {
        data: Array,
        selectedMarker: Object
    },
    computed: {
        ...mapState(['compress']),
        dataForLabels () {

            const essentialData = this.data.map((d, i) => {
                return {
                    index: i,
                    id: d.id,
                    x: d.cx,
                    y: d.cy,
                    labelText: d.innerText,
                    relations: d.radius,
                }
            })

            const sortedLabels = calcVerticalSpace(essentialData)

            return {
                compressedView: sortedLabels,
                expandedView: essentialData
            }
        }
    },
    methods: {
        ...mapActions(['changeSelectedMarker'])
    }
}
</script>