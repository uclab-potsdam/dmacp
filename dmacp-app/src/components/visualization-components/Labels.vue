<template>
    <g class="marker-event" :transform="`translate(${entity.cx}, ${entity.cy})`">
        <foreignObject x="10" y="-15" width="200" height="200" v-show="entity.radius > 3">
            <div ref="label">
                <p>
                    {{e}}. {{ entity.innerText }}
                </p>
            </div>
        </foreignObject>
        <!-- <text v-show="entity.radius > 3" x="10" y="0">
            {{e}}
        </text> -->
    </g>
</template>

<script>

export default {
  name: 'Labels',
  props: {
      entity: Object,
      e: Number
  },
  data () {
      return {
        x: 0,
        textAnchor: 'right',
        previousLabel: null
      }
  },
  mounted () {
      this.calcLabelPosition()
  },
  methods: {
      calcLabelPosition () {
        const paragraph = this.$refs.label.firstChild
        //console.log(paragraph, paragraph.getBoundingClientRect())
        this.previousLabel = paragraph.getBoundingClientRect()
      }
  }
}
</script>
<style scoped>
    p {
        margin: 0;
        text-align: left;
        line-height: 1;
    }
</style>
