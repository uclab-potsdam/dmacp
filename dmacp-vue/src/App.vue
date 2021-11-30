<template>
  <div id="app">
    <div class="main-container">
      <Visualization />
    </div>
  </div>
</template>

<script>
import Visualization from './components/Visualization.vue'
import { mapActions, mapState } from 'vuex'

export default {
  name: 'App',
  components: {
    Visualization
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
