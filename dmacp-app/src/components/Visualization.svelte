<script>
import * as d3 from 'd3';
import { onMount } from 'svelte';

    export let data;

    let width;
    let height;
    let xScale = () => {};
    let xTicks = [];
    let yScale = () => {};
    let scaledEntities = [];
    let scaledIntervals = [];

    const xValues = data.map(essay => essay.map(narration => narration.entityTimePosition.map( entity => entity.x ))).flat(2)
    const yValues = data.map(essay => essay.map(narration => narration.entityTimePosition.map( entity => entity.y ))).flat(2)
    const narrationValues = data.map((essay , e) => e)

    onMount(async () => {
        width = document.getElementById("container").clientWidth
        height = document.getElementById("container").clientHeight

        xScale = d3.scaleSymlog().domain(d3.extent(xValues.map(d => { return d }))).range([100, width -100])
        yScale = d3.scaleLinear().domain(d3.extent(yValues.map(d => { return d }))).range([30, height - 10])

        xTicks = xScale.ticks()

        scaledEntities = data.map((essay, e) => {
        return essay.map((narration) => {
            return narration.entityTimePosition.map( (entity) => {
                return {
                        narration: e,
                        textualLabel: entity.label,
                        cx: xScale(entity.x),
                        cy: yScale(entity.y),
                        type: narration.type
                    }
                } )
            })
        }).flat(2)
        

        scaledIntervals = data.map((essay, e) => {
        return essay.map((narration) => {
            return narration.entityTimePosition.map( (entity) => {
                return {
                        narration: e,
                        textualLabel: entity.label,
                        cx: xScale(entity.x),
                        cy: yScale(entity.y),
                        type: narration.type
                    }
                }).filter(entity => entity.type === 'interval')
            })
        }).flat(2)

        console.log(scaledIntervals)

    })

</script>
<div>
    <div id="container">
        <svg width="{ width }" height="{ height }">
            <g>
                {#each xTicks as tick}
                    <g transform="translate({ xScale(tick) }, 10)">
                        <text x="0" y="0">{ tick }</text>
                        <line x1="0" x2="0" y1="0" y2="{ height }" stroke="black"/>
                    </g>
                {:else}
                    <!-- <text>loading</text> -->
                {/each}
            </g>
            {#each scaledEntities as value}
                <circle cx="{ value.cx }" cy="{ value.cy }" r="5"/>
                <g transform="translate(10, 0)">
                    <text x="{ value.cx }" y="{ value.cy }">{ value.textualLabel }</text>
                </g>
            {:else}
                <text>loading</text>
            {/each}
        </svg>
    </div>
</div>
<style>

    #container {
        height: 92vh;
        /* width: 80vw; */
    }

    svg {
        /* width: 100%; */
        background-color: rgb(218, 254, 255);
    }

    svg circle {
        fill: red;
    }

    svg text {
        font-size: 10px;
    }

</style>