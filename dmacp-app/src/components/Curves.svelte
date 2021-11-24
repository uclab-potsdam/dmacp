<script>
import * as d3 from 'd3';
export let scaledEntities;

const onlyRelationalEntities = scaledEntities.filter((entity) => {
    return entity.targets.length !== 0
})

const UniqueRelationsIDs = []
onlyRelationalEntities.forEach((relation) => {
    UniqueRelationsIDs.push(relation.targets[0])
})

const PathCoordinates = []
UniqueRelationsIDs.forEach((relation, r) => {
    // Needs to build in a way to go back to previous point if more than 1
    // relation si presente
    const relationalEntity = scaledEntities.find(el => el.id === relation)
    const totalTargets = relationalEntity.targets
    PathCoordinates.push({ coords: [ relationalEntity.cx, relationalEntity.cy ]})
})

$: Signature = d3.line()
        .x((d) => d.coords[0])
        .y((d) => d.coords[1])
        .curve(d3.curveCatmullRom.alpha(1))(PathCoordinates);

</script>
<g>
    <!-- <path d='{catmullRom}' stroke="black" fill="none"/> -->
    <path d='{Signature}' stroke="red" fill="none"/>
</g>
<style>
 path {
     stroke-width: 1px;
 }
</style>