<template>
    <g class="labels-container">
        <!-- On hover make only text visible, then click to highlight relations -->
        <g class="expanded-view" v-if="!this.compress"> 
            <g class="marker-event" v-for="(entity, e) in dataForLabels.expandedView" :key="`${e}-key-label`" :class="{'selected': selectedMarker.id === entity.id}" :transform="`translate(${entity.x}, ${entity.y})`">
                <foreignObject class="label-container" x="15" y="-10" width="200" height="100" :class="entity.relations > 3 || selectedMarker.id === entity.id ? 'label-visible' : 'label-hidden'">
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

export default {
  name: 'Labels',
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

            // Creating separate arrays for labels
            // that will be changed based on vis status
            const importantLabels = essentialData.filter(d => d.relations > 3)
            const sortedLabels = importantLabels.sort((a, b) => a.y - b.y)

            const positions = sortedLabels.map(d => d.y)
            const minDist = 15

            // calculate the differences, by using filter() to get an array which is
            // the same as positions, but without the first item (i > 0). Then those values are
            // subtracted by the value that comes before them (y - positions[y])
            let diffs = positions.filter((y, i) => i > 0).map((y, i) => y - positions[i])

            while (diffs.find(d => d < minDist) != null) {
                // if there is a difference to small, iterate over them
                diffs.forEach((d, i) => {
                // if this is difference is to small…
                if (d < minDist) {
                    // move the first position up and the one after that down
                    // we move them by whatever is bigger. the minimum value to reach the
                    // required distance or 2 pixels
                    positions[i] = positions[i] - Math.max((minDist - d) / 2, 2)
                    positions[i + 1] = positions[i + 1] + Math.max((minDist - d) / 2, 2)

                    // Now we can set some boundaries, if we for example don't want a label to be
                    // lower/higher than a specific value…
                    if (positions[i + 1] >= 5) {
                    positions[i + 1] = 5
                    }
                }
                })
                // since we moved things around, it can be that labels which did not overlap before
                // do now. so we have to recalculate the diffs, and stay in this while-loop until everything
                // is fine [Fidel]
                diffs = positions.filter((y, i) => i > 0).map((y, i) => y - positions[i])
            }

            sortedLabels.forEach((l, i) => {
                l.y2 = positions[i]

                if (i === sortedLabels.length - 1) {
                    l.y2 = -minDist * 2
                }
            })

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