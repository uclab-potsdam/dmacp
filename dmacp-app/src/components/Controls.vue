<template>
  <div class="controls-container">
      <div class="buttons-container">
        <control-button :label="'Compress'" :active="true" />
        <control-button :label="'Events'" :active="true" />
        <control-button :label="'Relations'" :active="true" />
        <control-button :label="'x'" :active="true" />
      </div>
  </div>
</template>

<script>
import ControlButton from '../stories/Button.vue'

export default {
  name: 'Controls',
  components: {
      ControlButton
  }
}
</script>
