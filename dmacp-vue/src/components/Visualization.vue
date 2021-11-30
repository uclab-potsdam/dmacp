<template>
  <div class="visualization-container" ref="visualization">
    <svg :width="sizes.width" :height="sizes.height">
    </svg>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'Visualization',
  data () {
    return {
      sizes: { height: 0, width: 0 }
    }
  },
  computed: {
    ...mapState(['data'])
  },
  mounted () {
    this.calcContainerSize()
  },
  methods: {
        calcContainerSize () {
          const { visualization } = this.$refs
          let cHeight = visualization.clientHeight
          let cWidth = visualization.clientWidth

          this.sizes.height = cHeight
          this.sizes.width = cWidth
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

</style>
