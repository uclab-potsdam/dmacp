<template>
  <div id="app">
    <div class="main-container">
      <Visualization v-if="dataAreLoaded"/>
      <Controls />
      <Legend />
    </div>
  </div>
</template>

<script>
import Visualization from './components/Visualization.vue'
import Controls from './components/Controls.vue'
import Legend from './components/Legend.vue'
import { mapActions, mapState } from 'vuex'

export default {
  name: 'App',
  components: {
    Visualization,
    Controls,
    Legend
  },
  computed: {
      ...mapState({
      dataStatus: state => state.status
    }),
    dataAreLoaded () {
      // without this the code will break!
      const { dataStatus } = this
      console.log(dataStatus)
      return dataStatus === "Loaded"
    }
  },
  mounted () {
    this.loadingData()
  },
  methods: {
    ...mapActions(['loadingData'])
  }
}
</script>

<style lang="scss">
// @import "@/assets/scss/_main.scss";
</style>
