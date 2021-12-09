<template>
  <defs>
    <filter id="f1" x="-75" y="-75" :width="sizes.width" :height="sizes.height">
      <feGaussianBlur in="SourceGraphic" stdDeviation="1" edgeMode="wrap"/>
    </filter>
  </defs>
</template>

<script>
export default {
  name: 'Filters',
  props: {
      sizes: Object
  }
}
</script>