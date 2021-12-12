<template>
  <defs>
    <filter id="f1" x="-75" y="-75" :width="sizes.width" :height="sizes.height">
      <feGaussianBlur in="SourceGraphic" stdDeviation="1" edgeMode="wrap"/>
    </filter>
    <linearGradient id="begin-grad" x1="0%" y1="0%" x2="30%" y2="0%">
      <stop offset="0%" style="stop-color:rgba(255, 255, 255, 0.438);stop-opacity:1"/>
      <stop offset="50%" style="stop-color:rgb(255,255,255);stop-opacity:0" />
    </linearGradient>
    <linearGradient id="end-grad" x1="0%" y1="100%" x2="0%" y2="0%">
      <stop offset="0%" style="stop-color:rgba(255, 255, 255);stop-opacity:0"/>
      <stop offset="100%" style="stop-color:rgba(255, 255, 255, 0.438);stop-opacity:1" />
    </linearGradient>
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