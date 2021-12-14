<template>
  <div class="controls-container">
      <div class="buttons-container">
        <control-button :label="'Compress'" :active="compress" @onClick="changeVisStatus('compress')" />
        <control-button :label="'Events'" :active="events" @onClick="changeVisStatus('events')" />
        <control-button :label="relationsString" :active="true" @onClick="changeVisStatus(relationsString)" />
        <control-button :label="'x'" :active="true" />
      </div>
  </div>
</template>

<script>
import ControlButton from '../stories/Button.vue'
import { mapState, mapActions } from 'vuex'

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
  },
  methods: {
    ...mapActions(['changeVisStatus'])
  }
}
</script>
