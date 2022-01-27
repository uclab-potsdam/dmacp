<template>
    <g class="labels-container">
        <!-- On hover make only text visible, then click to highlight relations -->
        <g class="expanded-view" v-if="!this.compress"> 
            <LabelsContent :data="dataForLabels.expandedView" :selected-marker="selectedMarker"/>
        </g>
        <g class="compressed-view" v-else>
            <LabelsContent :data="dataForLabels.compressedView" :selected-marker="selectedMarker"/>
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