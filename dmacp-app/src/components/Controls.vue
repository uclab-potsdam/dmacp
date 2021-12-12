<template>
  <div class="controls-container">
      <div class="buttons-container">
        <control-button :label="'Compress'" :active="compress" />
        <control-button :label="'Events'" :active="events" />
        <control-button :label="relationsString" :active="true" />
        <control-button :label="'x'" :active="true" />
      </div>
  </div>
</template>

<script>
import ControlButton from '../stories/Button.vue'
import { mapState } from 'vuex'

export default {
  name: 'Controls',
  components: {
      ControlButton
  },
  computed: {
      ...mapState(['compress', 'events', 'relations']),
      relationsString () {
          return this.relations === 'signature' ? 'Signature' : 'Links'
      }
  }
}
</script>
