<template>
    <LabelsContent 
        :data="compress === true ? dataForLabels.compressedView : dataForLabels.expandedView" 
        :selected-marker="selectedMarker" 
    />
</template>

<script>
import { mapState, mapActions } from 'vuex'
import LabelsContent from './LabelsContent.vue'
import { isEmpty } from 'lodash'
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
                
                // for finite intervals picking only the far left label
                let previousEntity = this.data[i - 1]
                let xPos = d.cx
                if (!isEmpty(previousEntity) && previousEntity.id === d.id) {
                    xPos = Math.max(previousEntity.cx, xPos)
                }

                return {
                    index: i,
                    id: d.id,
                    x: xPos,
                    y: d.cy,
                    timeLabel: d.calendarDate,
                    labelText: d.innerText,
                    relations: d.radius,
                    context: d.context,
                    type: d.type
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